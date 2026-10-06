import { expect, it } from "vitest";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { packs } from "../src/content";
import { hasPractice } from "../src/PhraseLesson";
import { validatePack } from "../src/packs";
import lexicon from "../content/sources/jmdict-readings.json";
import { plain, kanaOf } from "../src/text";

it.each(packs.filter((p) => p.category === "vocabulary"))(
  "keeps $id traceable, dictionary checked and in small delayed-check lessons",
  (deck) => {
    const provenance = JSON.parse(
      fs.readFileSync(`content/sources/decks/${deck.id}.json`, "utf8"),
    );
    expect(deck.words).toHaveLength(100);
    expect(provenance.officialJLPTList).toBe(false);
    expect(
      createHash("sha256")
        .update(fs.readFileSync(`content/decks/${deck.id}.txt`))
        .digest("hex"),
    ).toBe(provenance.sourceDraftSha256);
    expect(validatePack(deck, lexicon)).toEqual([]);
    expect(
      deck.lessons.every((l) => l.words.length <= 8 && hasPractice(l)),
    ).toBe(true);
    expect(deck.lessons.flatMap((l) => l.words).sort()).toEqual(
      deck.words.map((w) => w.id).sort(),
    );
    for (const word of deck.words) {
      const source = provenance.words.find(
        (w: { id: string }) => w.id === word.id,
      );
      expect(source.selected).toEqual({ text: word.text, kana: word.kana });
      expect(source.dictionaryEntryIds.length).toBeGreaterThan(0);
      expect(word.source).toContain(`#L${source.sourceRow}`);
      expect(plain(word.exampleRuby!)).toBe(word.example);
      expect(kanaOf(word.exampleRuby!)).not.toMatch(/\p{Script=Han}/u);
      expect(word.exampleMeaning).toBeTruthy();
      expect(word.jlpt).toBeNull();
    }
  },
);
it("rejects a mismatched or unglossed supported example", () => {
  const deck = structuredClone(packs.find((p) => p.id === "n5-vocab-01")!);
  const word = deck.words[0];
  word.exampleRuby = "学校へ行きます。";
  expect(validatePack(deck, lexicon)).toContain(
    `Incomplete supported example ${word.id}`,
  );
  word.exampleRuby = "{違|ちが}う{文|ぶん}です。";
  expect(validatePack(deck, lexicon)).toContain(
    `Incomplete supported example ${word.id}`,
  );
});
