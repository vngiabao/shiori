import type { Pack, Reading } from "./types";
import { plain } from "./text";
import inflections from "../content/sources/recycled-inflections.json";

const readingTexts = (r: Reading) => [...r.paragraphs, ...(r.table?.head ?? []), ...(r.table?.rows.flat() ?? []), ...(r.panels ?? []).flatMap(p => p.lines.map(l => l.line))];

// Surface-form accounting, not a proficiency estimate. Inflected words absent
// from the taught vocabulary need explicit glosses; no guessed lemmatisation.
export function readingCoverage(reading: Reading, known: string[]) {
  const allowed = new Set([...known, ...reading.glosses.map(g => g.text)]);
  const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
  const texts = readingTexts(reading);
  const tokens = texts.flatMap(text => [...segmenter.segment(plain(text))].filter(s => s.isWordLike && /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(s.segment)).map(s => s.segment));
  // A taught multi-token chunk covers its component tokens when it occurs in
  // this text. A glossary cannot cover a different surface form implicitly.
  const chunks = [...allowed].filter(w => texts.some(t => plain(t).includes(w)));
  for (const chunk of chunks)
    for (const part of segmenter.segment(chunk)) if (part.isWordLike) allowed.add(part.segment);
  const unknown = tokens.filter(t => !allowed.has(t));
  return { total: tokens.length, covered: tokens.length - unknown.length, ratio: tokens.length ? 1 - unknown.length / tokens.length : 0, unknown: [...new Set(unknown)] };
}

export function validateCourseSequence(packs: Pack[]) {
  const errors: string[] = [], warnings: string[] = [];
  const known: string[] = [];
  const units: Pack[] = [];
  const reviewedForms = inflections.forms as Record<string,string[]>;
  const wordForms = new Map(packs.flatMap(p => p.words).map(w => [w.id, [w.text, w.kana, ...(reviewedForms[w.text] ?? [])]]));
  for (const p of packs) {
    for (const r of p.readings ?? []) {
      const index=p.lessons.findIndex(l => l.id === r.lesson);
      const taught=new Set(p.lessons.slice(0,index+1).flatMap(l => l.words));
      const coverage = readingCoverage(r, [...known, ...p.words.filter(w => taught.has(w.id)).flatMap(w => [w.text,w.kana])]);
      if (coverage.ratio < .95) errors.push(`${r.id}: taught/glossed surface coverage ${(coverage.ratio*100).toFixed(1)}%; unaccounted: ${coverage.unknown.join("、")}`);
    }
    known.push(...p.words.flatMap(w => [w.text, w.kana]));
    if (/^(n[1-5]|keigo)-u\d+$/.test(p.id)) {
      const previous = new Set(units.slice(-3).flatMap(u => u.words.map(w => w.id)));
      if (previous.size && !p.id.startsWith("n5-")) {
        const usages = [
          ...(p.dialogues ?? []).map(d => ({ id:d.id, refs:d.words ?? [], text:d.lines.map(l => plain(l.line)).join(" ") })),
          ...(p.exercises ?? []).map(x => {
            const reading = p.readings?.find(r => r.id === x.reading);
            const pair = p.readings?.find(r => r.id === reading?.pair);
            return { id:x.id, refs:x.words, text:[x.line ?? "", ...(x.options ?? []), ...(x.tiles ?? []), ...(p.dialogues?.find(d => d.id === x.dialogue)?.lines.map(l => l.line) ?? []), ...(reading ? readingTexts(reading) : []), ...(x.type === "compare" && pair ? readingTexts(pair) : [])].map(plain).join(" ") };
          }),
        ];
        for (const usage of usages) for (const id of usage.refs.filter(id => previous.has(id)))
          if (!wordForms.get(id)?.some(form => usage.text.includes(form))) errors.push(`${usage.id}: recycled reference ${id} absent from task or scene`);
        const refs = [...(p.dialogues ?? []).flatMap(d => d.words ?? []), ...(p.exercises ?? []).flatMap(x => x.words)];
        const ratio = refs.length ? refs.filter(id => previous.has(id)).length/refs.length : 0;
        if (ratio < .15) errors.push(`${p.id}: recent-unit recycling ${(ratio*100).toFixed(1)}% below 15%`);
        else if (ratio < .30) warnings.push(`${p.id}: recent-unit recycling ${(ratio*100).toFixed(1)}% below 30% target`);
      }
      units.push(p);
    }
  }
  return { errors, warnings };
}
