import type { Pack } from "./types";
import { plain, kanaOf, rubyIsWellFormed } from "./text";
// Dictionaries may write a kana reading in katakana; this is the same reading,
// not permission to ignore punctuation, long vowels, voicing or small kana.
export const dictionaryReadingKey = (text: string) =>
  text
    .normalize("NFKC")
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
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
    if (
      w.exampleRuby !== undefined &&
      (!rubyIsWellFormed(w.exampleRuby) ||
        plain(w.exampleRuby) !== w.example ||
        !w.exampleMeaning ||
        /\p{Script=Han}/u.test(kanaOf(w.exampleRuby)))
    )
      errors.push(`Incomplete supported example ${w.id}`);
    if (w.jlpt !== null && jlpt[w.text] !== w.jlpt)
      errors.push(`JLPT mapping unverified ${w.id}`);
    if (
      !/^(h-|k-|sound-)/.test(w.id) &&
      !["yui", "ren", "hana", "n5-u01-w-sato"].includes(w.id) &&
      lexicon[w.text] &&
      !lexicon[w.text].some(
        (reading) =>
          dictionaryReadingKey(reading) === dictionaryReadingKey(w.kana),
      )
    )
      errors.push(`JMdict reading mismatch ${w.id}`);
    if (
      w.lemma &&
      (typeof w.lemma.text !== "string" ||
        typeof w.lemma.kana !== "string" ||
        !lexicon[w.lemma.text]?.some(
          (r) =>
            dictionaryReadingKey(r) === dictionaryReadingKey(w.lemma!.kana),
        ))
    )
      errors.push(`JMdict lemma missing or mismatch ${w.id}`);
  }
  const entityIds = new Set<string>();
  for (const l of [
    ...p.lessons,
    ...p.letters,
    ...p.roleplays,
    ...(p.readings ?? []),
  ]) {
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
      if (t.alternatives?.some((a) => !accepts(a, t.accept)))
        errors.push(`Roleplay alternative rejected: ${rp.id}`);
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
  const readingIds = new Set((p.readings ?? []).map((r) => r.id));
  const dialogueIds = new Set<string>();
  const ruby = (id: string, ...texts: (string | undefined)[]) => {
    for (const t of texts)
      if (t !== undefined && !rubyIsWellFormed(t))
        errors.push(`Malformed ruby ${id}`);
  };
  for (const r of p.readings ?? []) {
    if (!lessonIds.has(r.lesson) || !r.title || !r.paragraphs.length)
      errors.push(`Incomplete reading ${r.id}`);
    if (
      ![
        "notice",
        "message",
        "email",
        "article",
        "diary",
        "guide",
        "story",
        "essay",
        "news",
        "literature",
        "manga",
      ].includes(r.genre)
    )
      errors.push(`Reading genre ${r.id}`);
    ruby(
      r.id,
      ...r.paragraphs,
      ...(r.table?.head ?? []),
      ...(r.table?.rows.flat() ?? []),
    );
    if (
      r.table &&
      (!r.table.head.length ||
        !r.table.rows.length ||
        r.table.rows.some((row) => row.length !== r.table!.head.length))
    )
      errors.push(`Reading table ${r.id}`);
    if (r.glosses.some((g) => !g.text || !g.kana || !g.meaning))
      errors.push(`Incomplete gloss ${r.id}`);
    if (r.pair && (!readingIds.has(r.pair) || r.pair === r.id))
      errors.push(`Invalid reading pair ${r.id}`);
    if (
      r.genre === "literature" &&
      (!r.source ||
        !r.source.title ||
        !r.source.author ||
        !r.source.url ||
        !r.source.licence ||
        !Number.isInteger(r.source.deathYear) ||
        r.source.deathYear > 1967)
    )
      errors.push(`Literature source ${r.id}`);
    if (r.genre === "manga" && !r.panels?.length)
      errors.push(`Manga panels missing ${r.id}`);
    for (const panel of r.panels ?? []) {
      if (
        !panel.description ||
        !panel.lines.length ||
        panel.lines.some((l) => !l.speaker || !l.line)
      )
        errors.push(`Incomplete manga panel ${r.id}`);
      ruby(r.id, ...panel.lines.map((l) => l.line));
    }
  }
  for (const g of p.grammar) {
    if (
      g.lessons &&
      (!g.lessons.length || g.lessons.some((id) => !lessonIds.has(id)))
    )
      errors.push(`Grammar lesson binding ${g.id}`);
    if (p.lessons.length > 1 && g.formation && !g.lessons)
      errors.push(`Multi-lesson grammar needs explicit scope ${g.id}`);
    ruby(g.id, ...(g.examples ?? []).map((x) => x.ja));
    if (g.examples?.some((x) => !x.ja || !x.en))
      errors.push(`Grammar example ${g.id}`);
  }
  for (const d of p.dialogues ?? []) {
    if (dialogueIds.has(d.id)) errors.push(`Duplicate dialogue ${d.id}`);
    dialogueIds.add(d.id);
    if (!lessonIds.has(d.lesson)) errors.push(`Unknown lesson in ${d.id}`);
    if (d.lines.length < 3) errors.push(`Dialogue too short ${d.id}`);
    if (
      d.speed !== undefined &&
      (!Number.isFinite(d.speed) || d.speed < 1 || d.speed > 1.25)
    )
      errors.push(`Dialogue speed ${d.id}`);
    if (d.words?.some((id) => !wordIds.has(id)))
      errors.push(`Dialogue words ${d.id}`);
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
      !(x.letter && letterIds.has(x.letter)) &&
      !(x.reading && readingIds.has(x.reading))
    )
      errors.push(`Exercise without a lesson or letter ${x.id}`);
    if (x.reading && !readingIds.has(x.reading))
      errors.push(`Unknown reading in ${x.id}`);
    if (x.reading && x.lesson) {
      const readingLesson = (p.readings ?? []).find(
        (r) => r.id === x.reading,
      )?.lesson;
      if (
        readingLesson &&
        p.lessons.findIndex((l) => l.id === readingLesson) >
          p.lessons.findIndex((l) => l.id === x.lesson)
      )
        errors.push(`Reading tested before its lesson ${x.id}`);
    }
    if (x.type === "compare") {
      const primary = (p.readings ?? []).find((r) => r.id === x.reading);
      if (!primary?.pair) errors.push(`Compare needs paired readings ${x.id}`);
      const paired = (p.readings ?? []).find((r) => r.id === primary?.pair);
      if (
        paired &&
        x.lesson &&
        p.lessons.findIndex((l) => l.id === paired.lesson) >
          p.lessons.findIndex((l) => l.id === x.lesson)
      )
        errors.push(`Paired reading tested before its lesson ${x.id}`);
    }
    if (x.type === "register" && !x.context)
      errors.push(`Register needs listener and situation ${x.id}`);
    if (x.type === "speaker" && (!x.line || !x.dialogue))
      errors.push(`Speaker needs a scene and line ${x.id}`);
    if (x.type === "speaker" && x.line && x.dialogue) {
      const matches =
        p.dialogues
          ?.find((d) => d.id === x.dialogue)
          ?.lines.filter((l) => plain(l.line) === plain(x.line!)) ?? [];
      if (
        matches.length !== 1 ||
        typeof x.answer !== "number" ||
        x.options?.[x.answer] !== matches[0]?.speaker
      )
        errors.push(`Speaker key must identify one exact scene line ${x.id}`);
    }
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
