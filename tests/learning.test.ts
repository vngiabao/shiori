import lexicon from "../content/sources/jmdict-readings.json";
import { describe, it, expect, beforeEach, vi } from "vitest";
import "fake-indexeddb/auto";
import {
  updateMemory,
  buildPlan,
  coverage,
  romajiVisible,
} from "../src/learning";
import { db, recordAttempt, exportBackup, importBackup } from "../src/db";
import { validatePack } from "../src/packs";
import { packs } from "../src/content";
import type { Attempt } from "../src/types";
const attempt = (overrides: Partial<Attempt> = {}): Attempt => ({
  id: "a",
  at: 1791100000000,
  itemId: "hello",
  skill: "reading",
  correct: true,
  support: "none",
  source: "test",
  ...overrides,
});
vi.stubGlobal("localStorage", {
  getItem: () => null,
  setItem: () => undefined,
});
describe("Honest skill memory", () => {
  it.each(["furigana", "romaji", "transcript", "meaning", "example"] as const)(
    "does not schedule %s-supported answers",
    (support) =>
      expect(updateMemory(undefined, attempt({ support }))).toBeNull(),
  );
  it("does not score self-assessment", () =>
    expect(updateMemory(undefined, attempt({ correct: null }))).toBeNull());
  it("schedules unaided answers deterministically", () => {
    const a = attempt();
    const m = updateMemory(undefined, a)!;
    expect(m).toEqual(updateMemory(undefined, a));
    expect(m.due).toBeGreaterThan(a.at);
    expect(m.successes).toBe(1);
  });
  it("refuses to mix listening and reading", () =>
    expect(() =>
      updateMemory(
        updateMemory(undefined, attempt())!,
        attempt({ skill: "listening" }),
      ),
    ).toThrow("Skill memory mismatch"));
  it("counts only unaided reading in text coverage", () => {
    const m = updateMemory(undefined, attempt({ skill: "listening" }))!;
    expect(coverage(["hello"], [m])).toBe(0);
  });
  it("fades romaji after 14 days", () => {
    expect(romajiVisible(0, true, 13 * 86400000)).toBe(true);
    expect(romajiVisible(0, true, 14 * 86400000)).toBe(false);
  });
  it.each([10, 20, 30, 45, 60])(
    "allocates exactly %i positive minutes",
    (n) => {
      for (const path of ["kana", "sound", "together"] as const)
        for (const due of [0, 4]) {
          const p = buildPlan(n, [], path, due);
          expect(p.items.reduce((s, i) => s + i.minutes, 0)).toBe(n);
          expect(p.items.every((i) => i.minutes > 0)).toBe(true);
        }
    },
  );
});
describe("Content gate", () => {
  it("accepts the seed course", () =>
    expect(validatePack(packs[0], lexicon)).toEqual([]));
  it("checks practice exercises and their answer keys", () => {
    const p = structuredClone(packs[0]);
    const cloze = p.exercises!.find((x) => x.type === "cloze")!;
    cloze.line = "＿＿と＿＿";
    expect(validatePack(p).join()).toContain("exactly one gap");
    cloze.line = "{私|わたし＿＿";
    expect(validatePack(p).join()).toContain("Malformed ruby");
  });
  it("rejects answers that always sit in the same place", () => {
    const p = structuredClone(packs[0]);
    for (const x of p.exercises!)
      if (typeof x.answer === "number") {
        const right = x.options![x.answer];
        x.options = [right, ...x.options!.filter((o) => o !== right)];
        x.answer = 0;
      }
    expect(validatePack(p).join()).toContain("Answers cluster on option 1");
  });
  it("rejects dialogue questions without their scene", () => {
    const p = structuredClone(packs[0]);
    p.exercises!.find((x) => x.type === "dialogue")!.dialogue = "missing";
    expect(validatePack(p).join()).toContain("Unknown dialogue");
  });
  it("rejects misaligned furigana", () => {
    const p = structuredClone(packs[0]);
    p.words[0].parts = [{ text: "違", reading: "い" }];
    expect(validatePack(p).join()).toContain("Reading alignment");
  });
  it("rejects fabricated JLPT levels", () => {
    const p = structuredClone(packs[0]);
    p.words[0].jlpt = 1;
    expect(validatePack(p).join()).toContain("JLPT mapping unverified");
  });
  it("rejects broken answer keys", () => {
    const p = structuredClone(packs[0]);
    p.letters[0].answer = 99;
    expect(validatePack(p).join()).toContain("Answer key");
  });
  it("rejects missing glosses and low coverage", () => {
    const p = structuredClone(packs[0]);
    p.letters[0].tokens.push("missing");
    p.letters[0].prerequisites = [];
    const result = validatePack(p).join();
    expect(result).toContain("Unglossed text");
    expect(result).toContain("Coverage below 95%");
  });
  it("rejects self-rejecting roleplays", () => {
    const p = structuredClone(packs[0]);
    p.roleplays[0].turns[0].accept = ["^no$"];
    expect(validatePack(p).join()).toContain("rejects own example");
  });
});
describe("Persistence and backup", () => {
  beforeEach(async () => {
    await db.attempts.clear();
    await db.memories.clear();
    await db.profiles.clear();
    await db.completions.clear();
    await db.media.clear();
    await db.fieldSessions.clear();
  });
  it("a listening miss never touches reading memory", async () => {
    await recordAttempt({
      itemId: "hello",
      skill: "reading",
      correct: true,
      support: "none",
      source: "test",
    });
    const before = await db.memories.get("hello:reading");
    await recordAttempt({
      itemId: "hello",
      skill: "listening",
      correct: false,
      support: "none",
      source: "test",
    });
    expect(await db.memories.get("hello:reading")).toEqual(before);
    expect((await db.memories.get("hello:listening"))?.failures).toBe(1);
  });
  it("persists supported attempts without creating a memory", async () => {
    await recordAttempt({
      itemId: "hello",
      skill: "reading",
      correct: true,
      support: "furigana",
      source: "test",
    });
    expect(await db.attempts.count()).toBe(1);
    expect(await db.memories.count()).toBe(0);
  });
  it("round-trips backups and duplicate imports are idempotent", async () => {
    await db.attempts.put(attempt());
    const b = await exportBackup();
    await db.attempts.clear();
    await importBackup(b);
    const first = await db.memories.toArray();
    await importBackup(b);
    expect(await db.attempts.count()).toBe(1);
    expect(await db.memories.toArray()).toEqual(first);
  });
  it("rejects foreign backups before touching data", async () => {
    await db.attempts.put(attempt());
    await expect(importBackup({ app: "chinese" })).rejects.toThrow();
    expect(await db.attempts.count()).toBe(1);
  });
  it("restores voice preferences and accepts older profiles without them", async () => {
    const profile = {
      id: "local" as const,
      name: "Bao",
      path: "kana" as const,
      minutes: 20,
      created: 1,
      theme: "light" as const,
      romaji: true,
      streak: false,
      furigana: true,
      voicePreview: "v03",
      spokenReactions: false,
      wordAudio: true,
    };
    await db.profiles.put(profile);
    const backup = await exportBackup();
    await db.profiles.clear();
    await importBackup(backup);
    expect(await db.profiles.get("local")).toEqual(profile);
    delete backup.profiles[0].voicePreview;
    delete backup.profiles[0].spokenReactions;
    delete backup.profiles[0].wordAudio;
    await db.profiles.clear();
    await importBackup(backup);
    expect((await db.profiles.get("local"))?.voicePreview).toBeUndefined();
    backup.profiles[0].voicePreview = "unknown";
    await expect(importBackup(backup)).rejects.toThrow(
      "invalid voice settings",
    );
    expect((await db.profiles.get("local"))?.voicePreview).toBeUndefined();
  });
  it("restores real-world study logs once and rejects invalid durations", async () => {
    await db.fieldSessions.put({
      id: "field-1",
      at: 1,
      kind: "conversation",
      minutes: 30,
      title: "Tutor",
      support: "supported",
      note: "Practised requests",
      feedback: "Use polite endings",
    });
    const backup = await exportBackup();
    await db.fieldSessions.clear();
    await importBackup(backup);
    await importBackup(backup);
    expect(await db.fieldSessions.count()).toBe(1);
    expect((await db.fieldSessions.get("field-1"))?.feedback).toBe(
      "Use polite endings",
    );
    backup.fieldSessions[0].minutes = -1;
    await expect(importBackup(backup)).rejects.toThrow(
      "invalid study sessions",
    );
    expect((await db.fieldSessions.get("field-1"))?.minutes).toBe(30);
  });
});
