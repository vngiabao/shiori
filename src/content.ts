import foundation from "../content/packs/first-post.json";
import { catalog, levelLoaders } from "./generated/course-catalog";
export { catalog as courseCatalog };
import type { Pack, Word } from "./types";
// Foundation stays in the app shell. Other levels load only when needed.
// Tests retain the full validated aggregate; the production branch removes it.
const initial =
  import.meta.env.MODE === "test"
    ? (await import("./generated/pack-index")).default
    : ([foundation] as unknown as Pack[]);
export const packs: Pack[] = [...initial];
// Two thousand kanji reference pages load when the Kanji tab first opens.
let extraKanji: Pack["kanji"] = [];
let kanjiRequest: Promise<void> | null = null;
export function loadKanjiReference() {
  return (kanjiRequest ??= import("../content/kanji/n5.json").then((m) => {
    extraKanji = m.default as Pack["kanji"];
    rebuildContent();
  }));
}
export let words = packs.flatMap((p) => p.words);
export const wordMap = Object.fromEntries(
  words.map((w) => [w.id, w]),
) as Record<string, Word>;
export let lessons = packs.flatMap((p) => p.lessons);
export let letters = packs.flatMap((p) => p.letters);
export let roleplays = packs.flatMap((p) => p.roleplays);
export let grammar = packs.flatMap((p) => p.grammar);
export let kanji = [...packs.flatMap((p) => p.kanji), ...extraKanji];
export let dialogues = packs.flatMap((p) => p.dialogues ?? []);
export let readings = packs.flatMap((p) => p.readings ?? []);
export let exercises = packs.flatMap((p) => p.exercises ?? []);
export let phraseWords = words.filter(
  (w) =>
    !w.id.startsWith("h-") &&
    !w.id.startsWith("k-") &&
    !w.id.startsWith("sound-"),
);
const loaded = new Set(packs.map((p) => levelOf(p.id)));
const pending = new Map<string, Promise<void>>();
let revision = 0;
const listeners = new Set<() => void>();
export const contentRevision = () => revision;
export const subscribeContent = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
export function levelOf(id: string) {
  return /^(n[1-5]|keigo)-/.exec(id)?.[1] ?? "foundation";
}
export const courseLevels = ["n5", "n4", "n3", "n2", "n1", "keigo"];
function rebuildContent() {
  packs.sort(
    (a, b) =>
      catalog.findIndex((p) => p.id === a.id) -
      catalog.findIndex((p) => p.id === b.id),
  );
  words = packs.flatMap((p) => p.words);
  Object.assign(wordMap, Object.fromEntries(words.map((w) => [w.id, w])));
  lessons = packs.flatMap((p) => p.lessons);
  letters = packs.flatMap((p) => p.letters);
  roleplays = packs.flatMap((p) => p.roleplays);
  grammar = packs.flatMap((p) => p.grammar);
  kanji = [...packs.flatMap((p) => p.kanji), ...extraKanji];
  dialogues = packs.flatMap((p) => p.dialogues ?? []);
  readings = packs.flatMap((p) => p.readings ?? []);
  exercises = packs.flatMap((p) => p.exercises ?? []);
  phraseWords = words.filter(
    (w) =>
      !w.id.startsWith("h-") &&
      !w.id.startsWith("k-") &&
      !w.id.startsWith("sound-"),
  );
  revision++;
  listeners.forEach((fn) => fn());
}
export async function loadCourseLevel(level: string): Promise<void> {
  if (loaded.has(level) || !levelLoaders[level]) return;
  if (pending.has(level)) return pending.get(level)!;
  const request = levelLoaders[level]()
    .then(({ default: added }) => {
      const existing = new Set(packs.map((p) => p.id));
      packs.push(...added.filter((p) => !existing.has(p.id)));
      loaded.add(level);
      rebuildContent();
    })
    .finally(() => pending.delete(level));
  pending.set(level, request);
  return request;
}
// Later units refer to earlier words. Load prerequisites before opening a lesson.
export async function loadThroughLevel(level: string) {
  const end = courseLevels.indexOf(level);
  for (const current of courseLevels.slice(0, end + 1))
    await loadCourseLevel(current);
}
export const loadAllCourse = async () => {
  for (const level of Object.keys(levelLoaders)) await loadCourseLevel(level);
};
export const courseLevelLoaded = (level: string) => loaded.has(level);
export const stages = [
  ["Kana & hello", "Recognise kana and introduce yourself.", "Foundation"],
  [
    "Everyday exchanges",
    "Order, ask directions, talk about your day.",
    "N5 alignment",
  ],
  [
    "Make yourself understood",
    "Describe plans, experiences, and preferences.",
    "N4 alignment",
  ],
  [
    "Follow the conversation",
    "Read short stories and understand casual speech.",
    "N3 alignment",
  ],
  [
    "Stories without the scaffold",
    "Read longer fiction and discuss what you think.",
    "N3 → N2",
  ],
  [
    "Natural listening",
    "Follow multiple speakers and casual contractions.",
    "N2 alignment",
  ],
  [
    "Read between the lines",
    "Explore nuance, implication, and longer essays.",
    "N2 → N1",
  ],
  [
    "Find your own voice",
    "Write thoughtful replies and sustain discussion.",
    "N1 alignment",
  ],
  [
    "Media without subtitles",
    "Follow native media across speakers and genres.",
    "Beyond the exam",
  ],
  [
    "Keigo at work",
    "Adapt respectful and humble language to relationships.",
    "Professional Japanese",
  ],
];
// Tests validate the whole reference set, so load it with the aggregate.
if (import.meta.env.MODE === "test") await loadKanjiReference();
