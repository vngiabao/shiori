import type {
  Attempt,
  Completion,
  MediaAttempt,
  FieldSession,
  SavedLine,
  Profile,
  Memory,
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
import {
  validReadingRun,
  validTextDraft,
  type ReadingRun,
  type TextDraft,
} from "./reading-path";
export const SYNC_SCHEMA = 1;
export type SyncState = {
  id: "local";
  deviceId: string;
  ownerId?: string;
  enabled: boolean;
  includeText?: boolean;
  consentDeclinedFor?: string;
  epoch?: string;
  revision?: number;
  lastSync?: number;
  acknowledged?: string;
  pending?: boolean;
};
export type LearningSnapshot = {
  attempts: Attempt[];
  completions: Completion[];
  media: MediaAttempt[];
  fieldSessions: FieldSession[];
  lines: SavedLine[];
  jlptPlans: JlptPlan[];
  jlptLogs: JlptLog[];
  jlptRuns: JlptRun[];
  readingRuns: ReadingRun[];
  textDrafts: TextDraft[];
  profile?: Profile;
  memories: Memory[];
};
export const kinds = [
  "attempts",
  "completions",
  "media",
  "fieldSessions",
  "lines",
  "jlptPlans",
  "jlptLogs",
  "jlptRuns",
  "readingRuns",
  "textDrafts",
] as const;
export type SyncKind = (typeof kinds)[number] | "profiles";
export type SyncRow = {
  kind: SyncKind;
  id: string;
  schema_version: number;
  payload: unknown;
};
export const personalKinds = new Set<SyncKind>([
  "lines",
  "textDrafts",
  "fieldSessions",
  "jlptLogs",
]);
export const compareId = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
export function canonical(x: unknown): string {
  if (x instanceof Date) return JSON.stringify(x.toISOString());
  if (Array.isArray(x)) return `[${x.map(canonical).join(",")}]`;
  if (x && typeof x === "object")
    return `{${Object.entries(x)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => compareId(a, b))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(",")}}`;
  return JSON.stringify(x);
}
export const emptySnapshot = (): LearningSnapshot => ({
  attempts: [],
  completions: [],
  media: [],
  fieldSessions: [],
  lines: [],
  jlptPlans: [],
  jlptLogs: [],
  jlptRuns: [],
  readingRuns: [],
  textDrafts: [],
  memories: [],
});
export const fields: Record<SyncKind, string[]> = {
  attempts: ["id", "at", "itemId", "skill", "correct", "support", "source"],
  completions: ["id", "at", "canDo"],
  media: [
    "id",
    "at",
    "clip",
    "phase",
    "transcript",
    "lines",
    "revealed",
    "followed",
  ],
  fieldSessions: [
    "id",
    "at",
    "kind",
    "minutes",
    "title",
    "support",
    "note",
    "feedback",
  ],
  lines: ["id", "at", "clip", "start", "end", "text", "note", "unit"],
  jlptPlans: ["id", "cycle", "source", "targetDate"],
  jlptLogs: [
    "id",
    "level",
    "cycle",
    "stage",
    "source",
    "unit",
    "minutes",
    "notes",
    "at",
    "checks",
  ],
  jlptRuns: [
    "id",
    "level",
    "cycle",
    "stage",
    "questionIds",
    "answers",
    "started",
    "deadline",
    "submitted",
    "aborted",
  ],
  readingRuns: ["id", "at", "stage", "checkpoint", "responses"],
  textDrafts: [
    "id",
    "at",
    "title",
    "text",
    "blank",
    "translation",
    "reference",
  ],
  profiles: [
    "id",
    "name",
    "path",
    "minutes",
    "created",
    "theme",
    "romaji",
    "streak",
    "furigana",
    "updatedAt",
    "updatedBy",
  ],
};
export function cloudProfile(p: Profile): Profile {
  return Object.fromEntries(
    fields.profiles
      .filter((k) => k in p)
      .map((k) => [k, p[k as keyof Profile]]),
  ) as Profile;
}
export function rowsOf(s: LearningSnapshot): SyncRow[] {
  const rows: SyncRow[] = kinds.flatMap((kind) =>
    s[kind].map((r) => ({
      kind,
      id: r.id,
      schema_version: 1,
      payload: Object.fromEntries(
        fields[kind]
          .filter((k) => k in r)
          .map((k) => [k, (r as unknown as Record<string, unknown>)[k]]),
      ),
    })),
  );
  if (s.profile)
    rows.push({
      kind: "profiles",
      id: "local",
      schema_version: 1,
      payload: cloudProfile(s.profile),
    });
  return rows.sort((a, b) =>
    compareId(`${a.kind}:${a.id}`, `${b.kind}:${b.id}`),
  );
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const num = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const str = (v: unknown) => typeof v === "string" && v.length <= 20000;
function valid(kind: SyncKind, p: Record<string, unknown>): boolean {
  if (Object.keys(p).some((k) => !fields[kind].includes(k))) return false;
  switch (kind) {
    case "attempts":
      return (
        num(p.at) &&
        str(p.itemId) &&
        str(p.source) &&
        [
          "reading",
          "reading-aloud",
          "listening",
          "recall",
          "typing",
          "politeness",
        ].includes(String(p.skill)) &&
        [
          "none",
          "furigana",
          "romaji",
          "transcript",
          "meaning",
          "example",
        ].includes(String(p.support)) &&
        [true, false, null].includes(p.correct as boolean | null)
      );
    case "completions":
      return num(p.at) && str(p.canDo);
    case "media":
      return (
        num(p.at) &&
        str(p.clip) &&
        str(p.phase) &&
        typeof p.transcript === "boolean" &&
        ["lines", "revealed", "followed"].every(
          (k) => p[k] === undefined || num(p[k]),
        )
      );
    case "fieldSessions":
      return (
        num(p.at) &&
        ["reading", "listening", "conversation", "writing"].includes(
          String(p.kind),
        ) &&
        num(p.minutes) &&
        (p.minutes as number) <= 600 &&
        ["title", "note", "feedback"].every((k) => str(p[k])) &&
        ["independent", "supported"].includes(String(p.support))
      );
    case "lines":
      return (
        num(p.at) &&
        num(p.start) &&
        num(p.end) &&
        (p.end as number) >= (p.start as number) &&
        ["clip", "text", "note"].every((k) => str(p[k])) &&
        (p.unit === undefined || (str(p.unit) && /^(n[1-5]|keigo)-u\d+$/.test(p.unit as string)))
      );
    case "jlptPlans":
      return validJlptPlan(p);
    case "jlptLogs":
      return validJlptLog(p);
    case "jlptRuns":
      return validJlptRun(p);
    case "readingRuns":
      return (
        validReadingRun(p) &&
        Array.isArray(p.responses) &&
        p.responses.every(
          (r) =>
            object(r) &&
            Object.keys(r).every((k) =>
              ["itemId", "correct", "supported", "elapsedMs", "fresh"].includes(
                k,
              ),
            ),
        )
      );
    case "textDrafts":
      return validTextDraft(p);
    case "profiles":
      return (
        p.id === "local" &&
        str(p.name) &&
        ["kana", "sound", "together"].includes(String(p.path)) &&
        [10, 20, 30, 45, 60].includes(p.minutes as number) &&
        num(p.created) &&
        ["light", "dark"].includes(String(p.theme)) &&
        ["romaji", "streak", "furigana"].every(
          (k) => typeof p[k] === "boolean",
        ) &&
        num(p.updatedAt) &&
        str(p.updatedBy)
      );
  }
}
export function snapshotOf(rows: SyncRow[]): LearningSnapshot {
  const s = emptySnapshot();
  const seen = new Set<string>();
  for (const r of rows) {
    if (
      !object(r) ||
      r.schema_version !== 1 ||
      !fields[r.kind] ||
      !object(r.payload) ||
      !str(r.id) ||
      !r.id ||
      r.id !== r.payload.id ||
      !valid(r.kind, r.payload)
    )
      throw new Error("Invalid cloud record. Local data was not replaced.");
    const key = `${r.kind}:${r.id}`;
    if (seen.has(key)) throw new Error("Duplicate cloud record.");
    seen.add(key);
    if (r.kind === "profiles") s.profile = r.payload as Profile;
    else (s[r.kind] as unknown[]).push(r.payload);
  }
  return s;
}
export function mergeSnapshots(
  a: LearningSnapshot,
  b: LearningSnapshot,
): LearningSnapshot {
  const out = emptySnapshot();
  for (const kind of kinds) {
    const map = new Map<string, unknown>();
    for (const r of [...a[kind], ...b[kind]]) {
      const old = map.get(r.id) as typeof r | undefined;
      if (!old) {
        map.set(r.id, r);
        continue;
      }
      if (canonical(old) === canonical(r)) continue;
      if (["attempts", "media", "readingRuns"].includes(kind))
        throw new Error(
          "Different immutable records share an ID. Export a backup before resolving this conflict.",
        );
      const rank = (x: unknown) => {
        const q = x as Record<string, unknown>;
        if (kind === "completions") return -(q.at as number);
        if (kind === "jlptPlans") return q.cycle as number;
        if (kind === "jlptRuns")
          return q.submitted === null
            ? (q.answers as unknown[]).filter((v) => v !== null).length
            : 1e12 + (q.submitted as number);
        return q.at as number;
      };
      if (
        rank(r) > rank(old) ||
        (rank(r) === rank(old) && canonical(r) > canonical(old))
      )
        map.set(r.id, r);
    }
    (out[kind] as unknown[]) = [...map.values()].sort((x, y) =>
      compareId((x as { id: string }).id, (y as { id: string }).id),
    );
  }
  out.attempts.sort((a, b) => a.at - b.at || compareId(a.id, b.id));
  const mem = new Map<string, Memory>();
  for (const a of out.attempts) {
    const key = `${a.itemId}:${a.skill}`,
      m = updateMemory(mem.get(key), a);
    if (m) mem.set(key, m);
  }
  out.memories = [...mem.values()];
  out.profile = [a.profile, b.profile]
    .filter((p): p is Profile => !!p)
    .sort(
      (x, y) =>
        (y.updatedAt ?? 0) - (x.updatedAt ?? 0) ||
        compareId(y.updatedBy ?? "", x.updatedBy ?? "") ||
        compareId(canonical(y), canonical(x)),
    )[0];
  return out;
}
