import { expect, it } from "vitest";
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { validatePack } from "../src/packs";
import { readingCoverage, validateCourseSequence } from "../src/course-validation";
import type { Pack, Reading } from "../src/types";

const base = JSON.parse(readFileSync("content/packs/n5-u01.json", "utf8")) as Pack;
const make = (): Pack => structuredClone(base);
const reading = (): Reading => ({ id:"test-r", lesson:base.lessons[0].id, title:"Office notice", genre:"notice", paragraphs:["{会社|かいしゃ}に{行|い}く。"], glosses:[{text:"会社",kana:"かいしゃ",meaning:"company"},{text:"に",kana:"に",meaning:"to"},{text:"行く",kana:"いく",meaning:"go"}] });
const validate = (p:Pack) => validatePack(p, {}, {}, ["watashi", "wa", "desu", "no-part", "hello", "tea", "please", "you", "coffee"]);

it("requires accountable reading surfaces, valid tables, pairs and public-domain sources", () => {
  const r=reading();
  expect(readingCoverage(r,[]).ratio).toBe(1);
  r.glosses=[];
  expect(readingCoverage(r,[]).ratio).toBe(0);
  const p=make();p.readings=[reading()];
  p.readings[0].table={head:["A","B"],rows:[["one"]]};
  expect(validate(p)).toContain("Reading table test-r");
  p.readings[0].genre="literature";
  expect(validate(p)).toContain("Literature source test-r");
  p.readings[0].source={title:"Test",author:"Test",deathYear:2000,url:"https://example.com",licence:"Test"};
  expect(validate(p)).toContain("Literature source test-r");
  p.readings[0].pair="missing";
  expect(validate(p)).toContain("Invalid reading pair test-r");
  p.readings[0].genre="manga";
  expect(validate(p)).toContain("Manga panels missing test-r");
});
it("rejects future-unit coverage and insufficient recent-unit recycling", () => {
  const first=make();first.id="n5-u12";
  const second=make();second.id="n4-u01";second.readings=[reading()];second.words=[];second.exercises=[];second.dialogues=[];
  expect(validateCourseSequence([first,second]).errors.some(x => x.includes("recycling"))).toBe(true);
  expect(validateCourseSequence([first,second]).errors.some(x => x.includes("surface coverage"))).toBe(false);
  second.readings![0].glosses=[];
  expect(validateCourseSequence([first,second]).errors.some(x => x.includes("surface coverage"))).toBe(true);
});
it("validates register situations, compared texts, speaker lines and natural-speed limits", () => {
  const p=make();
  p.exercises![0].type="register";p.exercises![0].context=undefined;
  expect(validate(p)).toContain(`Register needs listener and situation ${p.exercises![0].id}`);
  p.exercises![0].type="compare";
  expect(validate(p)).toContain(`Compare needs paired readings ${p.exercises![0].id}`);
  p.exercises![0].type="speaker";p.exercises![0].line=undefined;
  expect(validate(p)).toContain(`Speaker needs a scene and line ${p.exercises![0].id}`);
  p.dialogues![0].speed=1.26;
  expect(validate(p)).toContain(`Dialogue speed ${p.dialogues![0].id}`);
});
it("rebuilds all twelve N5 drafts byte-for-byte and supports explicit multi-lesson bindings", () => {
  const runner="node_modules/tsx/dist/cli.mjs";
  for (const file of readdirSync("content/units").filter(f => /^n5-u\d+\.json$/.test(f))) {
    const output=`content/packs/${file}`, before=readFileSync(output);
    execFileSync(process.execPath,[runner,"scripts/build-unit.ts",`content/units/${file}`]);
    expect(readFileSync(output).equals(before),file).toBe(true);
  }
  const draft=JSON.parse(readFileSync("content/units/n5-u01.json","utf8"));
  draft.id="engine-fixture";
  draft.lessons=[{...draft.lesson,words:[draft.words[0][0]]},{...draft.lesson,words:[draft.words[1][0]]}];
  delete draft.lesson;delete draft.letter;
  draft.dialogues=[{...draft.dialogue,lesson:"engine-fixture-lesson-2"}];delete draft.dialogue;
  draft.exercises=draft.exercises.map((x:object)=>({...x,lesson:"engine-fixture-lesson-1"}));
  const input="output/engine-fixture.json",output="content/packs/engine-fixture.json";
  try {
    writeFileSync(input,JSON.stringify(draft));
    execFileSync(process.execPath,[runner,"scripts/build-unit.ts",input]);
    const p=JSON.parse(readFileSync(output,"utf8"));
    expect(p.lessons.map((l:{id:string})=>l.id)).toEqual(["engine-fixture-lesson-1","engine-fixture-lesson-2"]);
    expect(p.dialogues[0].lesson).toBe("engine-fixture-lesson-2");
    expect(p.exercises.every((x:{lesson:string})=>x.lesson==="engine-fixture-lesson-1")).toBe(true);
  } finally { rmSync(input,{force:true});rmSync(output,{force:true}); }
},30000);

it("cannot test the second text before its lesson in a comparison", () => {
  const p=make();
  p.lessons.push({...p.lessons[0],id:"later-lesson"});
  p.readings=[{...reading(),pair:"later-text"},{...reading(),id:"later-text",lesson:"later-lesson"}];
  const x=p.exercises![0]; x.type="compare";x.reading="test-r";
  expect(validate(p)).toContain(`Paired reading tested before its lesson ${x.id}`);
});

it("counts real recycled vocabulary in table cells instead of requiring prose duplicates", () => {
  const first=make(); first.id="n5-u12";
  const second=make();second.id="n4-u01";second.words=[];second.dialogues=[];
  const word=first.words[0];
  const r={...reading(),table:{head:["Name"],rows:[[word.text]]}};
  second.readings=[r];
  second.exercises=[{...second.exercises![0],reading:r.id,words:[word.id],line:undefined,dialogue:undefined,options:["A","B"],answer:0}];
  expect(validateCourseSequence([first,second]).errors).toEqual([]);
});

it("counts explicitly reviewed conjugations without accepting a shared kanji prefix", () => {
  const first=make();first.id="n5-u12";first.words=[{...first.words[0],id:"hurry",text:"急ぐ",kana:"いそぐ"}];
  const second=make();second.id="n4-u01";second.words=[];second.readings=[];second.dialogues=[];
  second.exercises=[{...second.exercises![0],words:["hurry"],line:"急ぎましょう。",dialogue:undefined}];
  expect(validateCourseSequence([first,second]).errors).toEqual([]);
  second.exercises[0].line="急所です。";
  expect(validateCourseSequence([first,second]).errors).toContain(`${second.exercises[0].id}: recycled reference hurry absent from task or scene`);
});
