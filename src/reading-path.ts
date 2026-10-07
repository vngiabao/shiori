import type { Word } from "./types";
import { dictionaryReadingKey } from "./packs";
import { plain, rubyIsWellFormed } from "./text";

export type ReadingStage = "kana" | "words" | "sentences";
export type ReadingQuestion = {
  id: string;
  line: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
};
export type ReadingResponse = {
  itemId: string;
  correct: boolean;
  supported: boolean;
  elapsedMs: number;
  fresh: boolean;
};
export type ReadingRun = {
  id: string;
  at: number;
  stage: ReadingStage;
  checkpoint: boolean;
  responses: ReadingResponse[];
};
export type TextDraft = {
  id: string;
  at: number;
  title: string;
  text: string;
  blank: string;
  translation: string;
  reference: string;
};
export const stages: {
  id: ReadingStage;
  title: string;
  prerequisite: string;
  description: string;
}[] = [
  {
    id: "kana",
    title: "Kana at a glance",
    prerequisite: "Meet the hiragana and katakana charts first.",
    description:
      "Match the two scripts without romaji. Start untimed; let accuracy come before speed.",
  },
  {
    id: "words",
    title: "Words in sight",
    prerequisite: "Recognise kana; meet the words in your course lessons.",
    description:
      "Read the whole word. Reveal furigana when needed, then try again without it.",
  },
  {
    id: "sentences",
    title: "Follow the sentence",
    prerequisite:
      "Work through the beginner phrase lessons, especially plain and past forms.",
    description:
      "Notice endings, particles and who did what. Check meaning in fresh short sentences.",
  },
];
export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function wordRuby(w: Word) {
  return w.parts
    .map((p) => (p.reading ? `{${p.text}|${p.reading}}` : p.text))
    .join("");
}
export function wordQuestions(
  words: Word[],
  stage: "kana" | "words",
): ReadingQuestion[] {
  const unique = [...new Map(words.map((w) => [w.text, w])).values()];
  if (stage === "kana") {
    const katakana = unique.filter((w) => w.id.startsWith("k-"));
    return unique
      .filter((w) => w.id.startsWith("h-"))
      .flatMap((w) => {
        const pair = katakana.find(
          (k) => dictionaryReadingKey(k.text) === w.text,
        );
        if (!pair) return [];
        const alternatives = katakana.filter(
          (k) =>
            k.text !== pair.text &&
            [...k.text].length === [...pair.text].length,
        );
        return [
          {
            id: `kana:${w.id}`,
            line: w.text,
            prompt: "Choose the same sound in katakana.",
            answer: pair.text,
            options: [
              pair.text,
              ...shuffle(alternatives)
                .slice(0, 3)
                .map((k) => k.text),
            ],
            hint: `${w.text} → ${pair.text}`,
            explanation: `${w.text} and ${pair.text} represent the same sound.`,
          },
        ];
      });
  }
  const vocabulary = unique.filter(
    (w) =>
      !w.id.startsWith("h-") &&
      !w.id.startsWith("k-") &&
      !w.id.startsWith("sound-"),
  );
  const meanings = [...new Set(vocabulary.map((w) => w.meaning))];
  const meaningIndex = new Map(meanings.map((meaning, i) => [meaning, i]));
  const alternatives = (answer: string) => {
    const excluded = meaningIndex.get(answer)!;
    const available = meanings.length - 1;
    const swaps = new Map<number, number>();
    const selected: string[] = [];
    // Sample three distinct meanings without shuffling the whole course per word.
    for (let i = 0; i < Math.min(3, available); i++) {
      const j = i + Math.floor(Math.random() * (available - i));
      const value = swaps.get(j) ?? j;
      swaps.set(j, swaps.get(i) ?? i);
      selected.push(meanings[value >= excluded ? value + 1 : value]);
    }
    return selected;
  };
  return vocabulary.map((w) => ({
    id: `word:${w.id}`,
    line: wordRuby(w),
    prompt: "Choose the course meaning of this word.",
    answer: w.meaning,
    options: [
      w.meaning,
      ...alternatives(w.meaning),
    ],
    hint: w.kana,
    explanation: `${w.text}（${w.kana}） — ${w.meaning}`,
  }));
}
export function selectQuestions(
  bank: ReadingQuestion[],
  runs: ReadingRun[],
  count = 8,
): ReadingQuestion[] {
  const seen = new Set(runs.flatMap((r) => r.responses.map((x) => x.itemId)));
  return [
    ...shuffle(bank.filter((q) => !seen.has(q.id))),
    ...shuffle(bank.filter((q) => seen.has(q.id))),
  ]
    .slice(0, count)
    .map((q) => ({ ...q, options: shuffle(q.options) }));
}
export function summary(run: ReadingRun) {
  const correct = run.responses.filter((r) => r.correct).length;
  const independent = run.responses.filter(
    (r) => r.correct && !r.supported,
  ).length;
  const times = run.responses
    .filter((r) => r.correct && !r.supported)
    .map((r) => r.elapsedMs)
    .sort((a, b) => a - b);
  return {
    correct,
    independent,
    total: run.responses.length,
    medianMs: times.length
      ? (times[Math.floor((times.length - 1) / 2)] +
          times[Math.floor(times.length / 2)]) /
        2
      : null,
  };
}
export function checkpointStatus(runs: ReadingRun[], stage: ReadingStage) {
  const passed = runs.filter(
    (r) =>
      r.stage === stage &&
      r.checkpoint &&
      r.responses.length >= 8 &&
      summary(r).independent / r.responses.length >= 0.875,
  );
  return passed.some((a) =>
    passed.some((b) => Math.abs(a.at - b.at) >= 86400000),
  )
    ? "repeated"
    : passed.length
      ? "once"
      : "practice";
}
const object = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object";
export function validReadingRun(value: unknown): value is ReadingRun {
  if (!object(value)) return false;
  const r = value;
  return (
    typeof r.id === "string" &&
    r.id.length > 0 &&
    Number.isFinite(r.at) &&
    ["kana", "words", "sentences"].includes(String(r.stage)) &&
    typeof r.checkpoint === "boolean" &&
    Array.isArray(r.responses) &&
    r.responses.length > 0 &&
    r.responses.length <= 30 &&
    r.responses.every(
      (x) =>
        object(x) &&
        typeof x.itemId === "string" &&
        typeof x.correct === "boolean" &&
        typeof x.supported === "boolean" &&
        typeof x.fresh === "boolean" &&
        typeof x.elapsedMs === "number" &&
        Number.isFinite(x.elapsedMs) &&
        x.elapsedMs >= 0,
    )
  );
}
export function validTextDraft(value: unknown): value is TextDraft {
  if (!object(value)) return false;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    Number.isFinite(value.at) &&
    ["title", "text", "blank", "translation", "reference"].every(
      (k) =>
        typeof value[k] === "string" && (value[k] as string).length <= 20000,
    ) &&
    rubyIsWellFormed(value.text as string)
  );
}
export function gapText(text: string, blank: string) {
  const written = plain(text);
  return blank && written.includes(blank)
    ? written.split(blank).join("＿＿")
    : null;
}
export function exactTextAnswer(input: string, expected: string) {
  return input.normalize("NFKC").trim() === expected.normalize("NFKC").trim();
}
