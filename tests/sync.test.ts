import { beforeEach, it, expect } from "vitest";
import "fake-indexeddb/auto";
import fs from "node:fs";
import { db } from "../src/db";
import {
  emptySnapshot,
  mergeSnapshots,
  rowsOf,
  snapshotOf,
  fields,
  type SyncRow,
} from "../src/sync-model";
import {
  acceptAccount,
  allowDeviceProgress,
  detachSync,
  getSyncStatus,
  pauseSync,
  setPersonalText,
  setSyncTransportForTests,
  syncNow,
} from "../src/sync";
import { SyncConflict, type CloudSnapshot } from "../src/sync-transport";
import { updateMemory } from "../src/learning";
import type { Attempt, Profile } from "../src/types";
const attempt = (id: string, at = 1000): Attempt => ({
  id,
  at,
  itemId: "h-a",
  skill: "reading",
  correct: true,
  support: "none",
  source: "test",
});
const profile: Profile = {
  id: "local",
  name: "Learner",
  path: "kana",
  minutes: 20,
  created: 1,
  theme: "light",
  romaji: true,
  streak: false,
  furigana: true,
  updatedAt: 1,
  updatedBy: "a",
};
const user = {
  id: "a",
  email: "a@example.test",
  name: "A",
  provider: "email" as const,
};
let cloud: CloudSnapshot, writes: number;
beforeEach(async () => {
  await detachSync();
  for (const t of db.tables) await t.clear();
  cloud = {
    revision: 0,
    epoch: "one",
    deleted: false,
    schema_version: 1,
    rows: [],
  };
  writes = 0;
  setSyncTransportForTests(() => ({
    pull: async () => structuredClone(cloud),
    push: async (s, rows) => {
      if (s.revision !== cloud.revision) throw new SyncConflict();
      writes++;
      const map = new Map(cloud.rows.map((r) => [`${r.kind}:${r.id}`, r]));
      for (const r of rows) map.set(`${r.kind}:${r.id}`, r);
      cloud = {
        ...cloud,
        revision: cloud.revision + 1,
        deleted: false,
        rows: [...map.values()],
      };
      return cloud;
    },
    remove: async () => {
      cloud = {
        ...cloud,
        revision: cloud.revision + 1,
        epoch: "deleted",
        deleted: true,
        rows: [],
      };
      return cloud;
    },
  }));
});
it("merges two devices deterministically, deduplicates and rebuilds from evidence only", () => {
  const a = emptySnapshot(),
    b = emptySnapshot();
  a.attempts = [attempt("b", 2000), attempt("a")];
  b.attempts = [
    attempt("a"),
    { ...attempt("hint", 3000), support: "furigana" },
  ];
  const ab = mergeSnapshots(a, b),
    ba = mergeSnapshots(b, a);
  expect(ab).toEqual(ba);
  expect(ab.attempts).toHaveLength(3);
  expect(ab.memories).toEqual([
    updateMemory(updateMemory(undefined, attempt("a"))!, attempt("b", 2000)),
  ]);
  b.attempts = [{ ...attempt("a"), correct: false }];
  expect(() => mergeSnapshots(a, b)).toThrow("immutable");
});
it("uses stable profile and mutable record conflict rules", () => {
  const a = emptySnapshot(),
    b = emptySnapshot();
  a.profile = profile;
  b.profile = { ...profile, name: "New", updatedAt: 2 };
  a.completions = [{ id: "lesson", at: 2, canDo: "x" }];
  b.completions = [{ id: "lesson", at: 1, canDo: "x" }];
  expect(mergeSnapshots(a, b)).toEqual(mergeSnapshots(b, a));
  expect(mergeSnapshots(a, b).profile?.name).toBe("New");
  expect(mergeSnapshots(a, b).completions[0].at).toBe(1);
});
it("rejects malformed payloads and extra fields instead of syncing recordings", () => {
  const data = emptySnapshot();
  data.attempts = [attempt("a")];
  const rows = rowsOf(data);
  expect(snapshotOf(rows).attempts).toEqual(data.attempts);
  expect(() =>
    snapshotOf([
      { ...rows[0], payload: { ...attempt("a"), recording: "secret" } },
    ]),
  ).toThrow();
  expect(() => snapshotOf([{ ...rows[0], schema_version: 2 }])).toThrow();
  expect(() => snapshotOf([...rows, ...rows])).toThrow();
});
it("requires consent, persists decline, keeps text local and blocks another account", async () => {
  await db.profiles.put(profile);
  await db.attempts.put(attempt("a"));
  await db.textDrafts.put({
    id: "text",
    at: 1,
    title: "Private",
    text: "猫",
    blank: "猫",
    translation: "cat",
    reference: "",
  });
  await acceptAccount(user);
  expect(getSyncStatus().phase).toBe("consent");
  await syncNow();
  expect(writes).toBe(0);
  await pauseSync();
  await acceptAccount(user);
  expect(getSyncStatus().phase).toBe("paused");
  await allowDeviceProgress();
  expect(writes).toBeGreaterThan(0);
  expect(cloud.rows.some((r) => r.kind === "textDrafts")).toBe(false);
  expect(cloud.rows.some((r) => r.kind === "attempts")).toBe(true);
  await setPersonalText(true);
  await syncNow();
  expect(cloud.rows.some((r) => r.kind === "textDrafts")).toBe(true);
  await acceptAccount({ ...user, id: "b" });
  expect(getSyncStatus().phase).toBe("account-mismatch");
  const before = writes;
  await syncNow();
  expect(writes).toBe(before);
});
it("keeps queued changes on network failure and retries without duplicating evidence", async () => {
  await db.attempts.put(attempt("a"));
  await acceptAccount(user);
  const failed = async (): Promise<never> => {
    throw new Error("offline test");
  };
  setSyncTransportForTests(() => ({
    pull: failed,
    push: failed,
    remove: failed,
  }));
  await allowDeviceProgress();
  expect((await db.syncState.get("local"))?.pending).toBe(true);
  expect(await db.attempts.count()).toBe(1);
  expect(getSyncStatus().phase).toBe("error");
  setSyncTransportForTests(() => ({
    pull: async () => structuredClone(cloud),
    push: async (_state, rows) => {
      writes++;
      const records = new Map(
        cloud.rows.map((row) => [`${row.kind}:${row.id}`, row]),
      );
      for (const row of rows) records.set(`${row.kind}:${row.id}`, row);
      cloud = {
        ...cloud,
        revision: cloud.revision + 1,
        rows: [...records.values()],
      };
      return cloud;
    },
    remove: failed,
  }));
  await syncNow();
  expect((await db.syncState.get("local"))?.pending).toBe(false);
  expect(cloud.rows.filter((row) => row.kind === "attempts")).toHaveLength(1);
  const afterRetry = writes;
  await syncNow();
  expect(writes).toBe(afterRetry);
  expect(await db.attempts.count()).toBe(1);
});
it("cloud deletion epoch pauses old devices before reupload", async () => {
  await db.attempts.put(attempt("a"));
  await acceptAccount(user);
  await allowDeviceProgress();
  const before = writes;
  cloud = { ...cloud, deleted: true, epoch: "two", rows: [] };
  await syncNow();
  expect(getSyncStatus().phase).toBe("paused");
  expect(writes).toBe(before);
  expect(await db.attempts.count()).toBe(1);
});
it("RLS and payload allowlists cover every supported record kind (static only)", () => {
  const sql = fs.readFileSync(
    "supabase/migrations/202610050001_learning_sync.sql",
    "utf8",
  );
  expect(sql.match(/force row level security/g)).toHaveLength(2);
  expect(sql).toContain("auth.uid()");
  expect(sql).toContain("for update");
  expect(sql).toContain("s.revision is distinct from p_revision");
  expect(sql).toContain("revoke all");
  for (const [k, v] of Object.entries(fields)) {
    expect(sql).toContain(`when '${k}' then`);
    for (const key of v) expect(sql).toContain(`'${key}'`);
  }
});
