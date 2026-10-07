import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const pack = JSON.parse(readFileSync("content/packs/n2-u08.json", "utf8"));
const dialogue = pack.dialogues[0];

test("real production dialogue recordings overlap on the audio clock and leaving cancels without credit", async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    const state = { starts: [] as { start: number; duration: number; rate: number }[], stops: 0 };
    (window as any).timingEvidence = state;
    const start = AudioBufferSourceNode.prototype.start;
    const stop = AudioBufferSourceNode.prototype.stop;
    AudioBufferSourceNode.prototype.start = function (at = 0) {
      state.starts.push({ start: at, duration: this.buffer!.duration, rate: this.playbackRate.value });
      start.call(this, at);
    };
    AudioBufferSourceNode.prototype.stop = function (at = 0) {
      state.stops++; stop.call(this, at);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n2");
  await page.locator(".course-lessons > div").filter({ hasText: pack.lessons[0].title }).getByRole("button", { name: "Read", exact: true }).click();
  await expect(page.getByRole("button", { name: "I’ve met these" })).toBeVisible();
  const counter = page.locator(".lesson-top > span").last();
  for (let i = 0; i < 20; i++) {
    const meet = page.getByRole("button", { name: "I’ve met these" });
    if (!(await meet.count())) break;
    const before = await counter.textContent();
    await meet.click(); await expect(counter).not.toHaveText(before!);
  }
  await page.getByRole("button", { name: "Hear it in context" }).click();
  await expect(page.getByRole("heading", { name: "Listen to the conversation." })).toBeVisible();
  // No replay click: the first production mount must start by itself.
  await expect.poll(() => page.evaluate(() => (window as any).timingEvidence.starts.length)).toBe(dialogue.lines.length);
  const scheduled = await page.evaluate(() => (window as any).timingEvidence.starts as { start: number; duration: number; rate: number }[]);
  for (let i = 0; i < scheduled.length - 1; i++)
    expect(scheduled[i + 1].start - scheduled[i].start).toBeCloseTo(scheduled[i].duration + (dialogue.lines[i].gapAfterMs ?? 380) / 1000, 4);
  expect(dialogue.lines.some((line: any) => line.gapAfterMs < 0)).toBe(true);
  expect(scheduled.every(line => line.rate === 1)).toBe(true);
  await expect(page.getByRole("button", { name: "Answer questions" })).toBeDisabled();
  await page.getByRole("button", { name: "Leave lesson" }).click();
  await expect.poll(() => page.evaluate(() => (window as any).timingEvidence.stops)).toBe(dialogue.lines.length);
  const completed = await page.evaluate(() => new Promise<number>((resolve, reject) => {
    const request = indexedDB.open("shiori-japanese-v1");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const connection = request.result;
      const count = connection.transaction("completions", "readonly").objectStore("completions").count();
      count.onsuccess = () => { resolve(count.result); connection.close(); };
      count.onerror = () => { reject(count.error); connection.close(); };
    };
  }));
  expect(completed).toBe(0);
});
