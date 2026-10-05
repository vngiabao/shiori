import type { Pack } from "./types";
import { plain, rubyIsWellFormed } from "./text";
// Dictionaries may write a kana reading in katakana; this is the same reading,
// not permission to ignore punctuation, long vowels, voicing or small kana.
export const dictionaryReadingKey = (text: string) =>
  text.normalize("NFKC").replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60),
  );
export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[\s、。！？,.!?]/g, "")
    .toLowerCase();
export function accepts(input: string, patterns: string[]) {
  return patterns.some((p) =>
    new RegExp(p, "u").test(input.normalize("NFKC").trim()),
  );
}
export function validatePack(
  p: Pack,
  lexicon: Record<string, string[]> = {},
  jlpt: Record<string, number> = {},
  earlierWords: string[] = [],
) {
  const errors: string[] = [];
  const ids = new Set<string>(earlierWords);
  if (
    !p.id ||
    p.version !== 1 ||
    !["AI-assisted draft", "reviewed"].includes(p.status)
  )
    errors.push("Invalid pack metadata");
  if (!Array.isArray(p.words) || !p.words.length) return ["No vocabulary"];
  for (const w of p.words) {
    if (ids.has(w.id)) errors.push(`Duplicate word ${w.id}`);
    ids.add(w.id);
    if (!w.text || !w.meaning || !w.kana || !w.romaji)
      errors.push(`Incomplete word ${w.id}`);
    if (!/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s・]+$/u.test(w.kana))
      errors.push(`Invalid kana ${w.id}`);
    if (
      w.parts.map((p) => p.text).join("") !== w.text ||
      w.parts.map((p) => p.reading ?? p.text).join("") !== w.kana
    )
      errors.push(`Reading alignment ${w.id}`);
    if (w.parts.some((p) => /\p{Script=Han}/u.test(p.text) && !p.reading))
      errors.push(`Unglossed kanji ${w.id}`);
    if (w.jlpt !== null && jlpt[w.text] !== w.jlpt)
      errors.push(`JLPT mapping unverified ${w.id}`);
    if (!/^(h-|k-|sound-)/.test(w.id) && !["yui","ren","hana","n5-u01-w-sato"].includes(w.id) && lexicon[w.text] && !lexicon[w.text].some(
      (reading) => dictionaryReadingKey(reading) === dictionaryReadingKey(w.kana),
    ))
      errors.push(`JMdict reading mismatch ${w.id}`);
    if (w.lemma && (typeof w.lemma.text !== 'string' || typeof w.lemma.kana !== 'string' || !lexicon[w.lemma.text]?.some(r=>dictionaryReadingKey(r)===dictionaryReadingKey(w.lemma!.kana))))
      errors.push(`JMdict lemma missing or mismatch ${w.id}`);
  }
  const entityIds = new Set<string>();
  for (const l of [...p.lessons, ...p.letters, ...p.roleplays]) {
    if (entityIds.has(l.id)) errors.push(`Duplicate item ${l.id}`);
    entityIds.add(l.id);
  }
  for (const l of p.lessons) {
    if (!l.words.length) errors.push(`Empty lesson ${l.id}`);
    l.words.forEach((id) => {
      if (!ids.has(id)) errors.push(`Unknown word ${id}`);
    });
  }
  for (const l of p.letters) {
    l.tokens.forEach((id) => {
      if (!ids.has(id)) errors.push(`Unglossed text ${id}`);
    });
    l.prerequisites.forEach((id) => {
      if (!ids.has(id)) errors.push(`Unknown prerequisite ${id}`);
    });
    const coverage =
      l.tokens.filter((id) => l.prerequisites.includes(id)).length /
      l.tokens.length;
    if (!l.tokens.length || coverage < 0.95)
      errors.push(`Coverage below 95% ${l.id}`);
    if (
      !Number.isInteger(l.answer) ||
      l.answer < 0 ||
      l.answer >= l.options.length ||
      new Set(l.options).size !== l.options.length
    )
      errors.push(`Answer key ${l.id}`);
  }
  for (const rp of p.roleplays)
    for (const t of rp.turns) {
      try {
        if (!accepts(t.example, t.accept))
          errors.push(`Role-play rejects own example ${rp.id}`);
      } catch {
        errors.push(`Invalid pattern ${rp.id}`);
      }
    }
  errors.push(...validatePractice(p, ids));
  return errors;
}
/** Dialogues and exercises: structure, answer keys, references and ruby. */
export function validatePractice(p: Pack, wordIds: Set<string>) {
  const errors: string[] = [];
  const lessonIds = new Set(p.lessons.map((l) => l.id));
  const letterIds = new Set(p.letters.map((l) => l.id));
  const dialogueIds = new Set<string>();
  const ruby = (id: string, ...texts: (string | undefined)[]) => {
    for (const t of texts)
      if (t !== undefined && !rubyIsWellFormed(t))
        errors.push(`Malformed ruby ${id}`);
  };
  for (const d of p.dialogues ?? []) {
    if (dialogueIds.has(d.id)) errors.push(`Duplicate dialogue ${d.id}`);
    dialogueIds.add(d.id);
    if (!lessonIds.has(d.lesson)) errors.push(`Unknown lesson in ${d.id}`);
    if (d.lines.length < 3) errors.push(`Dialogue too short ${d.id}`);
    for (const l of d.lines) {
      if (!l.speaker || !l.line || !l.romaji || !l.meaning)
        errors.push(`Incomplete dialogue line ${d.id}`);
      ruby(d.id, l.line);
    }
  }
  const seen = new Set<string>();
  const positions: number[] = [];
  for (const x of p.exercises ?? []) {
    if (seen.has(x.id)) errors.push(`Duplicate exercise ${x.id}`);
    seen.add(x.id);
    if (
      !(x.lesson && lessonIds.has(x.lesson)) &&
      !(x.letter && letterIds.has(x.letter))
    )
      errors.push(`Exercise without a lesson or letter ${x.id}`);
    if (x.dialogue && !dialogueIds.has(x.dialogue))
      errors.push(`Unknown dialogue in ${x.id}`);
    if (x.type === "dialogue" && !x.dialogue)
      errors.push(`Dialogue question without a dialogue ${x.id}`);
    if (!x.words.length || x.words.some((w) => !wordIds.has(w)))
      errors.push(`Exercise words ${x.id}`);
    if (!x.explain) errors.push(`Missing explanation ${x.id}`);
    ruby(x.id, x.line, ...(x.options ?? []), ...(x.tiles ?? []));
    if (x.type === "truefalse") {
      if (typeof x.answer !== "boolean" || !x.prompt)
        errors.push(`True/false key ${x.id}`);
    } else if (x.type === "order") {
      if (!x.tiles || x.tiles.length < 3 || !x.meaning)
        errors.push(`Order tiles ${x.id}`);
    } else {
      const o = x.options ?? [];
      if (
        typeof x.answer !== "number" ||
        !Number.isInteger(x.answer) ||
        x.answer < 0 ||
        x.answer >= o.length ||
        o.length < 3 ||
        new Set(o.map(plain)).size !== o.length
      )
        errors.push(`Answer key ${x.id}`);
      else positions.push(x.answer);
    }
    if (x.type === "cloze" && (x.line ?? "").split("＿＿").length !== 2)
      errors.push(`Cloze needs exactly one gap ${x.id}`);
    if (x.type === "reply" && !x.line)
      errors.push(`Reply without a line ${x.id}`);
  }
  // Learners notice when the right answer always sits in the same place.
  for (const l of p.letters) positions.push(l.answer);
  if (positions.length >= 8)
    for (let i = 0; i < 4; i++)
      if (positions.filter((n) => n === i).length / positions.length > 0.5)
        errors.push(`Answers cluster on option ${i + 1}`);
  return errors;
}
