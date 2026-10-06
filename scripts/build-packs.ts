import { validateKanjiReferences } from "../src/kanji-reference";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { validatePack } from "../src/packs";
import { validateCourseSequence } from "../src/course-validation";
import type { Pack } from "../src/types";
const readOptional = (file: string) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
const lexicon = readOptional("content/sources/jmdict-readings.json");
const dictionaryProvenance = readOptional("content/sources/jmdict-provenance.json");
const dictionaryCoverage = readOptional("content/sources/jmdict-coverage.json");
const jlpt = readOptional("content/sources/jlpt.json");
const kanjidic = readOptional("content/sources/kanjidic2.json");
const packs: Pack[] = [];
const errors: string[] = [];
const files = fs
  .readdirSync("content/packs")
  .filter((x) => x.endsWith(".json"))
  .sort((a,b) => {
    const order = (x:string) => {
      if (x === "first-post.json") return 0;
      const level = /^(n[1-5]|keigo)-/.exec(x)?.[1];
      const rank = ["n5", "n4", "n3", "n2", "n1", "keigo"].indexOf(level ?? "");
      return rank < 0 ? 99 : 1 + rank * 2 + (/^(n[1-5]|keigo)-u/.test(x) ? 0 : 1);
    };
    return order(a)-order(b) || a.localeCompare(b);
  });
const source = files.map((file) => ({
  file,
  p: JSON.parse(
    fs.readFileSync(path.join("content/packs", file), "utf8"),
  ) as Pack,
}));
// A new or edited pack must receive a fresh source audit. Unknown headwords
// remain visible in the report rather than being silently called verified.
if (!dictionaryProvenance.sourcePackHashes || !dictionaryCoverage.words) {
  errors.push("JMdict coverage missing; run npm run sources:jmdict");
} else {
  for (const file of files) {
    const hash = createHash("sha256")
      .update(fs.readFileSync(path.join("content/packs", file))).digest("hex");
    if (dictionaryProvenance.sourcePackHashes[file] !== hash)
      errors.push(`JMdict coverage stale: ${file}; run npm run sources:jmdict`);
  }
  const lexiconHash = createHash("sha256")
    .update(fs.readFileSync("content/sources/jmdict-readings.json")).digest("hex");
  if (dictionaryProvenance.subsetSha256 !== lexiconHash)
    errors.push("JMdict subset changed without source provenance; run npm run sources:jmdict");
  if (dictionaryCoverage.totalWords !== source.reduce((n, x) => n + x.p.words.length, 0))
    errors.push("JMdict word accounting differs from course; run npm run sources:jmdict");
}
for (const [index, { file, p }] of source.entries()) {
  try {
    const otherIds = source
      .slice(0,index)
      .flatMap((x) => x.p.words.map((w) => w.id));
    errors.push(
      ...validatePack(p, lexicon, jlpt, otherIds).map((e) => file + ": " + e),
    );
    packs.push(p);
  } catch (e) {
    errors.push(`${file}: ${String(e)}`);
  }
}
const sequence = validateCourseSequence(packs);
errors.push(...sequence.errors);
sequence.warnings.forEach(w => console.warn(w));
const allIds = new Set<string>();
for (const p of packs) {
  for (const entity of [
    p,
    ...p.lessons,
    ...p.letters,
    ...p.roleplays,
    ...p.grammar,
    ...(p.readings ?? []),
  ]) {
    if (allIds.has(entity.id))
      errors.push(`Cross-pack duplicate: ${entity.id}`);
    allIds.add(entity.id);
  }
  for (const k of p.kanji) {
    const dictionary = kanjidic.characters?.find(
      (c: { literal: string }) => c.literal === k.char,
    );
    if (dictionary) {
      const readings = dictionary.readingMeaning.groups.flatMap(
        (g: { readings: { type: string; value: string }[] }) => g.readings,
      );
      for (const [type, value] of [
        ["ja_on", k.on],
        ["ja_kun", k.kun],
      ]) {
        for (const reading of value.split("、")) {
          const normalized = reading.replace(/[.\-]/g, "");
          if (
            !readings.some(
              (r: { type: string; value: string }) =>
                r.type === type && r.value.replace(/[.\-]/g, "") === normalized,
            )
          )
            errors.push(`KANJIDIC2 reading mismatch: ${k.char} ${reading}`);
        }
      }
    }
    for (const id of k.words) {
      const word = packs.flatMap((p) => p.words).find((w) => w.id === id);
      if (!word?.text.includes(k.char))
        errors.push(`Kanji example ${id} does not contain ${k.char}`);
    }
  }
  for (const w of p.words) {
    if (allIds.has(w.id)) errors.push(`Cross-pack duplicate: ${w.id}`);
    allIds.add(w.id);
  }
}
const extraKanji = JSON.parse(fs.readFileSync('content/kanji/n5.json', 'utf8'));
errors.push(...validateKanjiReferences(packs, extraKanji, kanjidic, char=>{
  const file=`public/strokes/${char.codePointAt(0)!.toString(16).padStart(5,'0')}.json`;
  if(!fs.existsSync(file))return false;
  const data=JSON.parse(fs.readFileSync(file,'utf8'));
  return data.char===char && Array.isArray(data.paths) && data.paths.length>0 && data.paths.every((p:unknown)=>typeof p==='string'&&p.length>0);
}));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
if (!packs.length) throw new Error("No passing packs");
if (!process.argv.includes("--check")) {
  fs.mkdirSync("src/generated", { recursive: true });
  fs.writeFileSync("src/generated/packs.json", JSON.stringify(packs));
}
console.log(
  `${packs.length} pack passed: ${packs.flatMap((p) => p.words).length} entries, ${packs.flatMap((p) => p.lessons).length} lessons, ${packs.flatMap((p) => p.letters).length} letters. ${Object.keys(lexicon).length} JMdict entries available. JLPT mapping ${Object.keys(jlpt).length ? "cross-check enabled" : "pending; no levels asserted"}.`,
);
console.log(`JMdict reading audit: ${dictionaryCoverage.counts?.matched ?? 0} matched word records; ${dictionaryCoverage.counts?.unmatched ?? 0} explicitly unverified (see output/jmdict-mismatches.md). Dictionary matches do not verify sentence naturalness.`);
