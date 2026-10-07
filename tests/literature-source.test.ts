import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { expect, test } from "vitest";
import { plain } from "../src/text";

// Literary source wording must survive added ruby, glosses and pack builds.
// The selected source snapshot has a reviewed hash separate from the draft.
for (const file of readdirSync("content/sources/literature").filter(f => f.endsWith(".json"))) {
  const prefix = `content/sources/literature/${file.slice(0, -5)}`;
  const source = JSON.parse(readFileSync(`${prefix}.json`, "utf8"));
  test(`${source.unit} retains the pinned literary excerpt and source ruby`, () => {
    const bytes = readFileSync(`${prefix}.txt`);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(source.selectedTextSha256);
    const expected = bytes.toString("utf8").trimEnd().split("\n\n");
    const pack = JSON.parse(readFileSync(`content/packs/${source.unit}.json`, "utf8"));
    const readings = pack.readings.filter((r: any) => r.genre === "literature");
    expect(readings).toHaveLength(1);
    const reading = readings[0];
    expect(reading.paragraphs.map(plain)).toEqual(expected);
    expect(expected.map(s => s.length)).toEqual(source.paragraphCharacters);
    expect(reading.source.title.startsWith(source.title)).toBe(true);
    expect(reading.source.author).toBe(source.author);
    expect(reading.source.url).toBe(source.retrievedFrom);
    expect(reading.source.deathYear).toBe(Number(source.deathDate.slice(0, 4)));
    for (const ruby of source.sourceRuby) {
      expect(reading.paragraphs.join("\n")).toContain(`{${ruby.text}|${ruby.kana}}`);
    }
    expect(reading.glosses.some((g: any) => /REVIEW:/.test(g.meaning))).toBe(false);
  });
}
