import { it, expect } from "vitest";
import fs from "node:fs";
import { packs } from "../src/content";
import extra from "../content/kanji/n5.json";
import dictionary from "../content/sources/kanjidic2.json";
import { validateKanjiReferences } from "../src/kanji-reference";
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
