/* Converts a compact unit draft (words as ruby markup, letters as sentences of
   word ids) into a full content pack, then the normal content gate checks it.
   Usage: npx tsx scripts/build-unit.ts drafts/n5-u01.json */
import fs from "node:fs";
import path from "node:path";
import { kanaOf, plain } from "../src/text";
import type { Pack, Word } from "../src/types";

type Draft = {
  lemmas?: Record<string, NonNullable<Word["lemma"]>>;
  id: string;
  title: string;
  lesson: {
    title: string;
    description: string;
    canDo: string;
    minutes: number;
  };
  /** [id, ruby text, romaji, meaning, register, example (ruby)?] */
  words: [string, string, string, string, Word["register"], string?][];
  grammar: Pack["grammar"];
  dialogue: Omit<NonNullable<Pack["dialogues"]>[number], "lesson">;
  exercises: Omit<NonNullable<Pack["exercises"]>[number], "lesson">[];
  letter: {
    title: string;
    from: string;
    subject: string;
    sentences: string[][];
    question: string;
    options: string[];
    answer: number;
    tasks: Omit<NonNullable<Pack["exercises"]>[number], "letter">[];
  };
};

const parts = (ruby: string): Word["parts"] =>
  ruby
    .split(/(\{[^|{}]+\|[^|{}]+\})/)
    .filter(Boolean)
    .map((p) => {
      const m = /^\{([^|{}]+)\|([^|{}]+)\}$/.exec(p);
      return m ? { text: m[1], reading: m[2] } : { text: p };
    });

const file = process.argv[2];
const d = JSON.parse(fs.readFileSync(file, "utf8")) as Draft;
const lessonId = `${d.id}-lesson`;
// Spread correct answers across positions; authors write the right answer anywhere.
let turn = d.id.length;
const rotate = <T extends { options?: string[]; answer?: number | boolean }>(
  x: T,
): T => {
  if (typeof x.answer !== "number" || !x.options) return x;
  const right = x.options[x.answer];
  const others = x.options.filter((_, i) => i !== x.answer);
  const slot = turn++ % x.options.length;
  others.splice(slot, 0, right);
  return { ...x, options: others, answer: slot };
};
const question = rotate({ options: d.letter.options, answer: d.letter.answer });
const tokens = d.letter.sentences.flat();
const paragraphs: number[] = [];
let at = 0;
for (const s of d.letter.sentences.slice(0, -1))
  paragraphs.push((at += s.length));
const pack: Pack = {
  id: d.id,
  version: 1,
  status: "AI-assisted draft",
  title: d.title,
  words: d.words.map(([id, ruby, romaji, meaning, register, example]) => ({
    id,
    ...(d.lemmas?.[id] ? { lemma: d.lemmas[id] } : {}),
    text: plain(ruby),
    kana: kanaOf(ruby),
    romaji,
    meaning,
    register,
    example: plain(example ?? ruby),
    pitch: null,
    jlpt: null,
    parts: parts(ruby),
  })),
  lessons: [
    {
      id: lessonId,
      kind: "phrase",
      words: d.words.map((w) => w[0]),
      ...d.lesson,
    },
  ],
  letters: [
    {
      id: `${d.id}-letter`,
      title: d.letter.title,
      from: d.letter.from,
      subject: d.letter.subject,
      tokens,
      paragraphs,
      prerequisites: [...new Set(tokens)],
      question: d.letter.question,
      options: question.options!,
      answer: question.answer as number,
    },
  ],
  roleplays: [],
  grammar: d.grammar,
  kanji: [],
  dialogues: [{ ...d.dialogue, lesson: lessonId }],
  exercises: [
    ...d.exercises.map((x) => rotate({ ...x, lesson: lessonId })),
    ...d.letter.tasks.map((x) => rotate({ ...x, letter: `${d.id}-letter` })),
  ],
};
const out = path.join("content/packs", `${d.id}.json`);
fs.writeFileSync(out, JSON.stringify(pack, null, 2) + "\n");
console.log(
  `Wrote ${out}: ${pack.words.length} words, ${pack.exercises!.length} exercises`,
);
