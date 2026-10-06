import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext();
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5175");
await page.getByRole("button", { name: "Start without an account" }).click();
await page.getByRole("button", { name: "Open my first letter" }).click();
await page.evaluate(async () => {
  await navigator.serviceWorker.ready;
});
await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
// Audio is cached on first play; the opt-in Settings action saves it all.
await page.goto("http://127.0.0.1:5175/#settings");
await page
  .getByRole("button", { name: "Save lesson audio for offline" })
  .click();
await expect(
  page.getByRole("status").filter({ hasText: "All lesson audio is saved" }),
).toBeVisible({ timeout: 120000 });
await page.goto("http://127.0.0.1:5175/#today");
await context.setOffline(true);
await page.reload();
await expect(
  page.getByRole("heading", { name: "Your next letter is ready." }),
).toBeVisible();
await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
await expect(page.getByRole("button", { name: "Ready to try" })).toBeVisible();
const audio = JSON.parse(fs.readFileSync("src/generated/audio.json", "utf8"));
const auditions = JSON.parse(
  fs.readFileSync("src/generated/violetto-auditions.json", "utf8"),
);
const emotions = JSON.parse(
  fs.readFileSync("src/generated/violetto-emotions.json", "utf8"),
);
const teacher = JSON.parse(
  fs.readFileSync("src/generated/violetto-teacher.json", "utf8"),
);
const dialogue = JSON.parse(
  fs.readFileSync("src/generated/dialogue-voices.json", "utf8"),
) as Record<string, { url: string }[]>;
const dialogueUrls = Object.values(dialogue)
  .flat()
  .map((line) => line.url);
const cast = JSON.parse(
  fs.readFileSync("src/generated/cast-auditions.json", "utf8"),
) as { url: string }[];
const decks = fs
  .readdirSync("content/packs")
  .filter((name) => /^n[1-5]-vocab-\d+\.json$/.test(name))
  .map(
    (name) =>
      JSON.parse(fs.readFileSync(`content/packs/${name}`, "utf8")) as {
        words: { text: string; kana: string; example: string }[];
      },
  );
const deckUrls = [
  ...new Set(
    decks.flatMap((pack) =>
      pack.words.flatMap((word) => [
        audio[word.text],
        audio[word.kana],
        audio[word.example],
      ]),
    ),
  ),
];
// Every new reaction and dialogue take must survive the opt-in download.
const missingTeacher = await page.evaluate(
  async (urls: string[]) => {
    const cache = await caches.open("shiori-audio");
    const missing: string[] = [];
    for (const url of urls) if (!(await cache.match(url))) missing.push(url);
    return missing;
  },
  [
    ...teacher.map((line: { url: string }) => line.url),
    ...dialogueUrls,
    ...cast.map((t) => t.url),
    ...deckUrls,
  ],
);
expect(missingTeacher).toEqual([]);
const checks = [];
for (const clip of [
  dialogueUrls[0],
  dialogueUrls.at(-1),
  cast.at(-1)!.url,
  teacher[0].url,
  teacher[50].url,
  emotions.correct[1].url,
  audio["あ"],
  audio["い"],
  audio["こんにちは"] ?? Object.values(audio)[0],
  auditions.candidates[2].lines.correct.url,
  ...decks.map((pack) => audio[pack.words[0].example]),
]) {
  const check = await page.evaluate(
    async ({ clip }) => {
      const response = await fetch(clip).catch((e) => {
        throw new Error(`${clip}: ${e}`);
      });
      const a = new Audio(clip);
      await new Promise<void>((resolve, reject) => {
        a.onloadedmetadata = () => resolve();
        a.onerror = () => reject(new Error("Audio decoding failed"));
      });
      await a.play();
      const result = {
        status: response.status,
        bytes: (await response.arrayBuffer()).byteLength,
        duration: a.duration,
        playing: !a.paused,
      };
      a.pause();
      return result;
    },
    { clip: clip as string },
  );
  expect(check.status).toBe(200);
  expect(check.bytes).toBeGreaterThan(1000);
  expect(check.duration).toBeGreaterThan(0);
  expect(check.playing).toBe(true);
  checks.push({ clip, ...check });
}
expect(errors).toEqual([]);
await page.goto("http://127.0.0.1:5175/#jlpt/N1");
await expect(
  page.getByRole("heading", { name: "JLPT study room." }),
).toBeVisible();
await page
  .locator(".jlpt-teacher img")
  .first()
  .evaluate((img: HTMLImageElement) => img.decode());
fs.writeFileSync(
  "output/offline-verification.json",
  JSON.stringify(
    {
      verifiedAt: new Date().toISOString(),
      offlineReload: true,
      teacherClipsCached: teacher.length,
      dialogueClipsCached: dialogueUrls.length,
      deckAudioUrlsCached: deckUrls.length,
      deckExampleClipsPlayed: decks.length,
      lessonAvailable: true,
      jlptAndTeacherOffline: true,
      bundledAudio: checks,
      pageErrors: errors,
    },
    null,
    2,
  ),
);
console.log(
  "Production offline reload, lesson, word and Violetto audio passed.",
  checks,
);
await browser.close();
