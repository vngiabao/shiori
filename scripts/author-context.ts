import fs from "node:fs";
import packs from "../src/generated/pack-index";
const words = packs.flatMap(p => p.words);
fs.mkdirSync("output", { recursive: true });
fs.writeFileSync(
  "output/author-context.json",
  JSON.stringify(
    {
      schemaVersion: 1,
      source: "Bundled course only; no learner data",
      units: packs.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        lessons: p.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          words: l.words,
        })),
      })),
      vocabulary: words.map((w) => ({
        id: w.id,
        text: w.text,
        kana: w.kana,
        meaning: w.meaning,
        jlpt: w.jlpt,
      })),
    },
    null,
    2,
  ),
);
console.log("Wrote output/author-context.json");
