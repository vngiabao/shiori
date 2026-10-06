import type { Pack } from "./types";
type Dictionary = {
  characters?: {
    literal: string;
    readingMeaning: {
      groups: {
        readings: { type: string; value: string }[];
        meanings: { lang: string; value: string }[];
      }[];
    };
  }[];
};
export function validateKanjiReferences(
  packs: Pack[],
  extra: Pack["kanji"],
  dictionary: Dictionary,
  hasStrokes: (char: string) => boolean,
) {
  const errors: string[] = [];
  const words = packs.flatMap((p) => p.words),
    entries = [...packs.flatMap((p) => p.kanji), ...extra];
  const chars = new Set(
    // 々 is an iteration mark in the Han script, not a separate ideograph
    // with its own KANJIDIC entry or stroke lesson.
    words.flatMap((w) =>
      [...w.text].filter((c) => /\p{Unified_Ideograph}/u.test(c)),
    ),
  );
  const normalized = (s: string) => s.replace(/[.\-]/g, "");
  for (const char of chars) {
    const hits = entries.filter((k) => k.char === char);
    if (hits.length !== 1) errors.push(`Expected one kanji reference: ${char}`);
    if (!hasStrokes(char)) errors.push(`Missing stroke data: ${char}`);
  }
  for (const k of entries) {
    const source = dictionary.characters?.find((d) => d.literal === k.char);
    if (!source) {
      errors.push(`KANJIDIC2 source missing: ${k.char}`);
      continue;
    }
    const groups = source.readingMeaning.groups;
    for (const [type, value] of [
      ["ja_on", k.on],
      ["ja_kun", k.kun],
    ])
      for (const reading of value.split("、").filter(Boolean))
        if (
          !groups.some((g) =>
            g.readings.some(
              (r) =>
                r.type === type && normalized(r.value) === normalized(reading),
            ),
          )
        )
          errors.push(`KANJIDIC2 reading mismatch: ${k.char} ${reading}`);
    if (
      extra.includes(k) &&
      k.meaning !==
        groups
          .flatMap((g) =>
            g.meanings.filter((m) => m.lang === "en").map((m) => m.value),
          )
          .join("; ")
    )
      errors.push(`KANJIDIC2 meaning mismatch: ${k.char}`);
    for (const id of k.words)
      if (!words.find((w) => w.id === id)?.text.includes(k.char))
        errors.push(`Kanji word mismatch: ${k.char} ${id}`);
  }
  return errors;
}
