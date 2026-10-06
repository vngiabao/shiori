import extraKanji from "../content/kanji/n5.json";
import data from "./generated/packs.json";
import type { Pack, Word } from "./types";
export const packs = data as Pack[];
export const words = packs.flatMap((p) => p.words);
export const wordMap = Object.fromEntries(
  words.map((w) => [w.id, w]),
) as Record<string, Word>;
export const lessons = packs.flatMap((p) => p.lessons);
export const letters = packs.flatMap((p) => p.letters);
export const roleplays = packs.flatMap((p) => p.roleplays);
export const grammar = packs.flatMap((p) => p.grammar);
export const kanji = [...packs.flatMap((p) => p.kanji), ...extraKanji];
export const dialogues = packs.flatMap((p) => p.dialogues ?? []);
export const readings = packs.flatMap((p) => p.readings ?? []);
export const exercises = packs.flatMap((p) => p.exercises ?? []);
export const phraseWords = words.filter(
  (w) =>
    !w.id.startsWith("h-") &&
    !w.id.startsWith("k-") &&
    !w.id.startsWith("sound-"),
);
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
