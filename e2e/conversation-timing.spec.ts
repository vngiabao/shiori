import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const manifest = JSON.parse(readFileSync("src/generated/audio.json", "utf8"));

test("real decoded recordings overlap on the audio clock and tapping cancels a sequence", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  const rows = ["こんにちは", "あ", "い"].map(text => ({ text, url: manifest[text], gapAfterMs: -100 }));
  rows[2].gapAfterMs = 0;
  const result = await page.evaluate(async (rows) => {
    const modulePath = "/src/audio.ts";
    const { playTimedLines, stopAudio } = await import(modulePath);
    const scheduled: { start: number; duration: number; rate: number }[] = [];
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (at = 0) {
      scheduled.push({ start: at, duration: this.buffer!.duration, rate: this.playbackRate.value });
      start.call(this, at);
    };
    const heard: number[] = [];
    try {
      await playTimedLines(rows, (i: number) => heard.push(i));
      let credited = false;
      const interrupted = playTimedLines(rows, (i: number) => { if (i === -1) credited = true; });
      const outcome = interrupted.then(() => "completed", (e: DOMException) => e.name);
      // Interrupt before decode or playback finishes; neither may count as heard.
      stopAudio();
      return { scheduled: scheduled.slice(0, 3), heard, interrupted: await outcome, credited };
    } finally { AudioBufferSourceNode.prototype.start = start; }
  }, rows);
  expect(result.scheduled).toHaveLength(3);
  for (let i = 0; i < 2; i++)
    expect(result.scheduled[i + 1].start - result.scheduled[i].start).toBeCloseTo(result.scheduled[i].duration - .1, 4);
  expect(result.scheduled.every(s => s.rate === 1)).toBe(true);
  expect(result.heard).toEqual([0, 1, 2, -1]);
  expect(result.interrupted).toBe("AbortError");
  expect(result.credited).toBe(false);
});
