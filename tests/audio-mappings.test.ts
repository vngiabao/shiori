import { expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import manifest from "../src/generated/audio.json";
import rawPacks from "../src/generated/packs.json";
import type { Pack } from "../src/types";
import { teacherLines } from "../src/reactionState";
import { lessonAudioUrls } from "../src/offline";
import { plain, kanaOf, rubyIsWellFormed } from "../src/text";
import { baselineLines, violetto } from "../src/persona";
import { dialogueTake } from "../src/dialogueAudio";
import cast from "../src/generated/cast-auditions.json";
import speakers from "../content/voices/dialogue-speakers.json";

it("has a real WAV mapping for every shipped lesson and reaction URL", () => {
  const urls = lessonAudioUrls();
  const availableUrls = new Set(urls);
  for (const url of urls) {
    const file = resolve("public", url.replace(/^\//, ""));
    expect(existsSync(file), url).toBe(true);
    const bytes = readFileSync(file);
    expect(bytes.subarray(0, 4).toString(), url).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString(), url).toBe("WAVE");
    expect(bytes.length, url).toBeGreaterThan(44);
  }
  const mapping = manifest as Record<string, string>;
  const provenance = JSON.parse(
    readFileSync("content/voices/lesson-provenance.json", "utf8"),
  ) as { records: { text: string; url: string }[] };
  const associations = new Set(
    provenance.records.map((row) => JSON.stringify([row.text, row.url])),
  );
  for (const [text, url] of Object.entries(mapping)) {
    expect(associations.has(JSON.stringify([text, url])), text).toBe(true);
  }
  for (const [key, take] of Object.entries(baselineLines)) {
    const line = violetto.lines[key as keyof typeof violetto.lines];
    expect(associations.has(JSON.stringify([line.text, take.url])), key).toBe(
      true,
    );
  }
  const packs = rawPacks as Pack[];
  const required = new Set<string>();
  const words = new Map(packs.flatMap((p) => p.words).map((w) => [w.id, w]));
  for (const pack of packs) {
    pack.words.forEach((w) => {
      required.add(w.text);
      required.add(w.kana);
      if (w.exampleRuby) required.add(w.example);
    });
    pack.grammar.forEach((g) => {
      required.add(g.example);
      g.examples?.forEach(x => required.add(plain(x.ja)));
    });
    pack.roleplays.forEach((r) => r.turns.forEach((t) => { required.add(t.line); required.add(t.example); t.alternatives?.forEach(a => required.add(a)); }));
    pack.dialogues?.forEach((d) =>
      d.lines.forEach((l, index) => {
        required.add(plain(l.line));
        const take = dialogueTake(d, index);
        expect(take.text).toBe(plain(l.line));
        expect(take.speaker).toBe(l.speaker);
        expect(take.index).toBe(index);
        expect(availableUrls.has(take.url), take.url).toBe(true);
      }),
    );
    for (const ex of pack.exercises ?? []) {
      if (ex.type === "reply") required.add(plain(ex.line!));
      if (["choice", "register", "compare"].includes(ex.type) && ex.line) required.add(plain(ex.line));
      if (ex.type === "cloze")
        required.add(
          plain(ex.line!.replace("＿＿", ex.options![ex.answer as number])),
        );
      if (ex.type === "order") required.add(plain(ex.tiles!.join("")));
    }
    for (const letter of pack.letters) {
      let previous = 0;
      let text = "";
      for (const stop of [...letter.paragraphs, letter.tokens.length]) {
        if (stop > previous)
          text +=
            letter.tokens
              .slice(previous, stop)
              .map((id) => words.get(id)!.text)
              .join("") + "。";
        previous = stop;
      }
      required.add(text);
    }
  }
  required.add("わ");
  for (const text of required) expect(mapping[text], text).toBeTruthy();
  expect(teacherLines).toHaveLength(100);
  expect(new Set(teacherLines.map((l) => l.text)).size).toBe(100);
  for (const line of teacherLines) {
    expect(availableUrls.has(line.url), line.url).toBe(true);
    expect(rubyIsWellFormed(line.ruby), line.id).toBe(true);
    expect(plain(line.ruby)).toBe(line.text);
    expect(kanaOf(line.ruby)).toBe(line.reading);
    expect(line.romaji && line.meaning).toBeTruthy();
  }
}, 30_000);

it("ships a mapped audition for every configured character", () => {
  const provenance=JSON.parse(readFileSync("content/voices/cast-provenance.json","utf8"));
  expect(cast.map(t => t.speaker).sort()).toEqual(Object.keys(speakers.speakers).sort());
  for (const take of cast) {
    expect(lessonAudioUrls()).toContain(take.url);
    expect(provenance.records.some((r:{speaker:string;text:string;url:string}) => r.speaker===take.speaker && r.text===take.text && r.url===take.url)).toBe(true);
  }
});
