import { type SyncState, fields } from "./sync-model";
const profileWriter = crypto.randomUUID();
import {
  validReadingRun,
  validTextDraft,
  type ReadingRun,
  type TextDraft,
} from "./reading-path";
import Dexie, { type Table } from "dexie";
import type {
  Attempt,
  Memory,
  Profile,
  Completion,
  MediaAttempt,
  FieldSession,
  SavedLine,
} from "./types";
import { updateMemory } from "./learning";
import {
  validJlptPlan,
  validJlptLog,
  validJlptRun,
  type JlptPlan,
  type JlptLog,
  type JlptRun,
} from "./jlpt-model";
export class ShioriDB extends Dexie {
  attempts!: Table<Attempt, string>;
  memories!: Table<Memory, string>;
  profiles!: Table<Profile, string>;
  completions!: Table<Completion, string>;
  media!: Table<MediaAttempt, string>;
  fieldSessions!: Table<FieldSession, string>;
  jlptPlans!: Table<JlptPlan, string>;
  jlptLogs!: Table<JlptLog, string>;
  jlptRuns!: Table<JlptRun, string>;
  syncState!: Table<SyncState, string>;
  readingRuns!: Table<ReadingRun, string>;
  textDrafts!: Table<TextDraft, string>;
  lines!: Table<SavedLine, string>;
  constructor(name = "shiori-japanese-v1") {
    super(name);
    this.version(1).stores({
      attempts: "id,at,itemId,skill",
      memories: "id,due,itemId,skill",
      profiles: "id",
      completions: "id,at",
      media: "id,at,clip",
    });
    this.version(2).stores({ fieldSessions: "id,at,kind" });
    this.version(3).stores({
      jlptPlans: "id",
      jlptLogs: "id,level,at",
      jlptRuns: "id,level,started",
    });
    // Lines saved from your own films and episodes (sentence mining).
    this.version(4).stores({ lines: "id,at,clip" });
    this.version(5).stores({ readingRuns: "id,at,stage", textDrafts: "id,at" });
    this.version(6).stores({ syncState: "id" });
    this.profiles.hook("creating", (_key, profile, tx) => {
      if ((tx as typeof tx & { fromCloud?: boolean }).fromCloud) return;
      profile.updatedAt ??= Date.now();
      profile.updatedBy ??= profileWriter;
    });
    this.profiles.hook("updating", (changes, _key, _old, tx) => {
      if ((tx as typeof tx & { fromCloud?: boolean }).fromCloud) return;
      if (
        fields.profiles.some(
          (k) => k !== "updatedAt" && k !== "updatedBy" && k in changes,
        )
      )
        return { updatedAt: Date.now(), updatedBy: profileWriter };
    });
  }
}
export const db = new ShioriDB();
export async function recordAttempt(
  input: Omit<Attempt, "id" | "at">,
  database = db,
) {
  const a: Attempt = { ...input, id: crypto.randomUUID(), at: Date.now() };
  await database.transaction(
    "rw",
    database.attempts,
    database.memories,
    async () => {
      const previous = await database.memories.get(`${a.itemId}:${a.skill}`);
      const next = updateMemory(previous, a);
      await database.attempts.add(a);
      if (next) await database.memories.put(next);
    },
  );
  return a;
}
export async function finishLesson(id: string, canDo: string) {
  if (!(await db.completions.get(id)))
    await db.completions.put({ id, at: Date.now(), canDo });
}
export async function exportBackup() {
  return db.transaction(
    "r",
    [
      db.profiles,
      db.attempts,
      db.completions,
      db.media,
      db.fieldSessions,
      db.jlptPlans,
      db.jlptLogs,
      db.jlptRuns,
      db.lines,
      db.readingRuns,
      db.textDrafts,
    ],
    async () => ({
      schemaVersion: 1,
      app: "shiori-japanese",
      exportedAt: new Date().toISOString(),
      profiles: await db.profiles.toArray(),
      attempts: await db.attempts.toArray(),
      completions: await db.completions.toArray(),
      media: await db.media.toArray(),
      fieldSessions: await db.fieldSessions.toArray(),
      jlptPlans: await db.jlptPlans.toArray(),
      jlptLogs: await db.jlptLogs.toArray(),
      jlptRuns: await db.jlptRuns.toArray(),
      lines: await db.lines.toArray(),
      readingRuns: await db.readingRuns.toArray(),
      textDrafts: await db.textDrafts.toArray(),
      letterDrafts: Object.fromEntries(
        Object.keys(localStorage)
          .filter((k) => k.startsWith("shiori-reply-"))
          .map((k) => [k, localStorage.getItem(k)]),
      ),
    }),
  );
}
export async function importBackup(raw: unknown) {
  const b = raw as Awaited<ReturnType<typeof exportBackup>>;
  if (
    !b ||
    b.app !== "shiori-japanese" ||
    b.schemaVersion !== 1 ||
    !Array.isArray(b.attempts) ||
    !Array.isArray(b.profiles) ||
    !Array.isArray(b.completions) ||
    !Array.isArray(b.media)
  )
    throw new Error("This is not a Shiori version 1 backup.");
  if (
    b.readingRuns !== undefined &&
    (!Array.isArray(b.readingRuns) || !b.readingRuns.every(validReadingRun))
  )
    throw new Error("Invalid reading practice records.");
  if (
    b.textDrafts !== undefined &&
    (!Array.isArray(b.textDrafts) || !b.textDrafts.every(validTextDraft))
  )
    throw new Error("Invalid text drafts.");
  if (
    b.profiles.some(
      (p) =>
        (p.updatedAt !== undefined &&
          (!Number.isFinite(p.updatedAt) || p.updatedAt < 0)) ||
        (p.updatedBy !== undefined && typeof p.updatedBy !== "string"),
    )
  )
    throw new Error("Invalid profile revision.");
  const skills = [
      "reading",
      "reading-aloud",
      "listening",
      "recall",
      "typing",
      "politeness",
    ],
    supports = [
      "none",
      "furigana",
      "romaji",
      "transcript",
      "meaning",
      "example",
    ];
  for (const [records, validator] of [
    [b.jlptPlans, validJlptPlan],
    [b.jlptLogs, validJlptLog],
    [b.jlptRuns, validJlptRun],
  ] as const) {
    if (
      records !== undefined &&
      (!Array.isArray(records) || records.some((r) => !validator(r)))
    )
      throw new Error("This backup contains invalid JLPT records.");
  }
  if (
    b.attempts.some(
      (a) =>
        typeof a.id !== "string" ||
        typeof a.itemId !== "string" ||
        !Number.isFinite(a.at) ||
        !skills.includes(a.skill) ||
        !supports.includes(a.support) ||
        ![true, false, null].includes(a.correct),
    )
  )
    throw new Error("This backup contains invalid learning records.");
  if (
    b.profiles.some(
      (p) =>
        p.id !== "local" ||
        typeof p.name !== "string" ||
        !["kana", "sound", "together"].includes(p.path) ||
        ![10, 20, 30, 45, 60].includes(p.minutes) ||
        !Number.isFinite(p.created) ||
        !["light", "dark"].includes(p.theme),
    )
  )
    throw new Error("This backup contains invalid settings.");
  if (
    b.profiles.some(
      (p) =>
        [p.spokenReactions, p.wordAudio].some(
          (v) => v !== undefined && typeof v !== "boolean",
        ) ||
        (p.voicePreview !== undefined &&
          !["baseline", "v01", "v02", "v03", "v04"].includes(p.voicePreview)),
    )
  )
    throw new Error("This backup contains invalid voice settings.");
  if (
    b.completions.some(
      (c) =>
        typeof c.id !== "string" ||
        !Number.isFinite(c.at) ||
        typeof c.canDo !== "string",
    ) ||
    b.media.some(
      (m) =>
        typeof m.id !== "string" ||
        !Number.isFinite(m.at) ||
        typeof m.phase !== "string",
    )
  )
    throw new Error("This backup contains invalid sessions.");
  if (
    b.fieldSessions &&
    (!Array.isArray(b.fieldSessions) ||
      b.fieldSessions.some(
        (s) =>
          typeof s.id !== "string" ||
          !Number.isFinite(s.at) ||
          !["reading", "listening", "conversation", "writing"].includes(
            s.kind,
          ) ||
          !Number.isInteger(s.minutes) ||
          s.minutes < 1 ||
          s.minutes > 600 ||
          typeof s.title !== "string" ||
          typeof s.note !== "string" ||
          typeof s.feedback !== "string" ||
          !["independent", "supported"].includes(s.support),
      ))
  )
    throw new Error("This backup contains invalid study sessions.");
  if (
    b.letterDrafts &&
    (typeof b.letterDrafts !== "object" ||
      Object.entries(b.letterDrafts).some(
        ([k, v]) => !k.startsWith("shiori-reply-") || typeof v !== "string",
      ))
  )
    throw new Error("This backup contains invalid letter drafts.");
  if (
    b.lines !== undefined &&
    (!Array.isArray(b.lines) ||
      b.lines.some(
        (l) =>
          typeof l.id !== "string" ||
          !Number.isFinite(l.at) ||
          typeof l.clip !== "string" ||
          typeof l.text !== "string" ||
          typeof l.note !== "string" ||
          (l.unit !== undefined && (typeof l.unit !== "string" || !/^(n[1-5]|keigo)-u\d+$/.test(l.unit))) ||
          !Number.isFinite(l.start) ||
          !Number.isFinite(l.end),
      ))
  )
    throw new Error("This backup contains invalid saved lines.");
  await db.transaction(
    "rw",
    [
      db.attempts,
      db.memories,
      db.profiles,
      db.completions,
      db.media,
      db.fieldSessions,
      db.jlptPlans,
      db.jlptLogs,
      db.jlptRuns,
      db.lines,
      db.readingRuns,
      db.textDrafts,
    ],
    async () => {
      for (const r of b.readingRuns ?? [])
        if (!(await db.readingRuns.get(r.id))) await db.readingRuns.add(r);
      for (const d of b.textDrafts ?? []) {
        const previous = await db.textDrafts.get(d.id);
        if (!previous || d.at > previous.at) await db.textDrafts.put(d);
      }
      for (const l of b.lines ?? [])
        if (!(await db.lines.get(l.id))) await db.lines.add(l);
      for (const a of b.attempts)
        if (!(await db.attempts.get(a.id))) await db.attempts.add(a);
      for (const c of b.completions)
        if (!(await db.completions.get(c.id))) await db.completions.add(c);
      for (const m of b.media)
        if (!(await db.media.get(m.id))) await db.media.add(m);
      for (const s of b.fieldSessions ?? [])
        if (!(await db.fieldSessions.get(s.id))) await db.fieldSessions.add(s);
      for (const p of b.jlptPlans ?? []) {
        const previous = await db.jlptPlans.get(p.id);
        if (!previous || p.cycle > previous.cycle) await db.jlptPlans.put(p);
      }
      for (const l of b.jlptLogs ?? [])
        if (!(await db.jlptLogs.get(l.id))) await db.jlptLogs.add(l);
      for (const r of b.jlptRuns ?? []) {
        const previous = await db.jlptRuns.get(r.id);
        if (!previous || (previous.submitted === null && r.submitted !== null))
          await db.jlptRuns.put(r);
      }
      if (!(await db.profiles.get("local")) && b.profiles[0])
        await db.profiles.put(b.profiles[0]);
      const all = (await db.attempts.toArray()).sort(
        (a, b) => a.at - b.at || a.id.localeCompare(b.id),
      );
      const map = new Map<string, Memory>();
      for (const a of all) {
        const key = `${a.itemId}:${a.skill}`;
        const m = updateMemory(map.get(key), a);
        if (m) map.set(key, m);
      }
      await db.memories.clear();
      await db.memories.bulkPut([...map.values()]);
    },
  );
  for (const [key, value] of Object.entries(b.letterDrafts ?? {}))
    if (!localStorage.getItem(key) && value) localStorage.setItem(key, value);
}
