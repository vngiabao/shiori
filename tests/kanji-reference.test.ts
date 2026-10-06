import { it, expect } from "vitest";
import fs from "node:fs";
import { packs } from "../src/content";
import extra from "../content/kanji/n5.json";
import dictionary from "../content/sources/kanjidic2.json";
import { validateKanjiReferences } from "../src/kanji-reference";
it("requires the repeated kanji but not a fabricated iteration-mark reference", () => {
  const p = structuredClone(packs.find((p) => p.id === "n5-vocab-01")!);
  const word = p.words.find((w) => w.text === "色々")!;
  p.words = [word];
  p.kanji = [];
  const entries = extra.filter((k) => k.char === "色");
  entries[0] = { ...entries[0], words: [word.id] };
  expect(
    validateKanjiReferences([p], entries, dictionary, (c) => c === "色"),
  ).toEqual([]);
  expect(validateKanjiReferences([p], [], dictionary, () => false)).toContain(
    "Expected one kanji reference: 色",
  );
});
it("every course kanji has a source-checked reference and real stroke paths", () => {
  expect(
    validateKanjiReferences(packs, extra, dictionary, (c) => {
      const d = JSON.parse(
        fs.readFileSync(
          `public/strokes/${c.codePointAt(0)!.toString(16).padStart(5, "0")}.json`,
          "utf8",
        ),
      );
      return d.char === c && d.paths.length > 0;
    }),
  ).toEqual([]);
});
it("missing dictionary data and missing strokes cannot silently pass", () => {
  expect(
    validateKanjiReferences(packs, extra, { characters: [] }, () => false)
      .length,
  ).toBeGreaterThan(167);
  const bad = structuredClone(extra);
  bad[0].meaning = "invented";
  expect(
    validateKanjiReferences(packs, bad, dictionary, () => true).some((e) =>
      e.includes("meaning mismatch"),
    ),
  ).toBe(true);
});
