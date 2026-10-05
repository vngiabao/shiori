import notes from "../content/kana/notes.json";
import { words } from "./content";
import type { Word } from "./types";

export type KanaNote = {
  aid: string;
  origin?: string;
  lookalikes?: string[];
  tell?: string;
  /** A family rule (voicing marks, small kana) rather than a picture aid. */
  rule?: boolean;
};
const table: Record<string, KanaNote> = {
  ...notes.hiragana,
  ...notes.katakana,
};
export const kanaTips = notes.tips as [string, string][];
const romajiOf = Object.fromEntries(
  words
    .filter((w) => w.id.startsWith("h-") || w.id.startsWith("k-"))
    .map((w) => [w.text, w.romaji]),
);
const voicing = { "゙": "゛ (dakuten)", "゚": "゜ (handakuten)" } as const;
/** Notes for one kana, deriving voiced and combined kana from their base. */
export function kanaNote(text: string): KanaNote | undefined {
  if (table[text]) return table[text];
  const [base, mark] = [...text.normalize("NFD")];
  if (mark && mark in voicing && [...text].length === 1)
    return {
      aid: `${base} (${romajiOf[base]}) + ${voicing[mark as keyof typeof voicing]}. ${mark === "゙" ? "The two small strokes voice the sound" : "The small circle turns h into p"}: ${romajiOf[base]} → ${romajiOf[text]}.`,
      lookalikes: [base],
      tell: "Read the base kana first, then the marks at its top right.",
      rule: true,
    };
  const chars = [...text];
  if (chars.length === 2 && "ゃゅょャュョ".includes(chars[1]))
    return {
      aid: `${chars[0]} (${romajiOf[chars[0]]}) + a small ${chars[1]} glide together into one beat.`,
      tell: `Written full size, ${chars[0]}${String.fromCharCode(chars[1].charCodeAt(0) + 1)} would be two beats.`,
      rule: true,
    };
  return undefined;
}
/** Kana that are easy to confuse with this one, for sharper quiz options. */
export function lookalikes(word: Word) {
  return (kanaNote(word.text)?.lookalikes ?? [])
    .map((c) => words.find((w) => w.text === c && w.id !== word.id))
    .filter((w): w is Word => !!w);
}
export const kanaKind = (w: Word) =>
  w.id.startsWith("h-")
    ? "hiragana"
    : w.id.startsWith("k-")
      ? "katakana"
      : w.id.startsWith("sound-")
        ? "sound"
        : "phrase";
