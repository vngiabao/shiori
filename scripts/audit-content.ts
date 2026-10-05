import fs from "node:fs";
import {
  packs,
  words,
  lessons,
  letters,
  roleplays,
  grammar,
  kanji,
} from "../src/content";
const phrases = words.filter((w) => !/^h-|^k-|^sound-/.test(w.id));
const taught = new Set(lessons.flatMap((l) => l.words));
const chars = letters.map((l) =>
  l.tokens.map((id) => words.find((w) => w.id === id)!.text).join(""),
);
const result = {
  date: new Date().toISOString().slice(0, 10),
  packs: packs.length,
  kanaBasePerScript: 46,
  kanaEntries: words.filter((w) => /^[hk]-/.test(w.id)).length,
  soundExamples: words.filter((w) => w.id.startsWith("sound-")).length,
  dictionaryWordsAndChunks: phrases.length,
  taughtPhraseTargets: phrases.filter((w) => taught.has(w.id)).length,
  lessons: lessons.length,
  kanaLessons: lessons.filter((l) => l.kind === "kana").length,
  phraseLessons: lessons.filter((l) => l.kind === "phrase").length,
  suggestedFirstPassMinutes: lessons.reduce((s, l) => s + l.minutes, 0),
  letters: letters.length,
  letterTokens: letters.reduce((s, l) => s + l.tokens.length, 0),
  letterJapaneseCharacters: chars.reduce((s, l) => s + [...l].length, 0),
  roleplays: roleplays.length,
  scriptedResponseTurns: roleplays.reduce((s, r) => s + r.turns.length, 0),
  grammarNotes: grammar.length,
  kanjiReferencePages: kanji.length,
  reviewedPacks: packs.filter((p) => p.status === "reviewed").length,
  jlptMappedWords: words.filter((w) => w.jlpt !== null).length,
  professionalModules: 0,
  unseenExamSets: 0,
};
fs.mkdirSync("output", { recursive: true });
fs.writeFileSync(
  "output/content-inventory.json",
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
