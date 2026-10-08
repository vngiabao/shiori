import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const manifest = JSON.parse(
  readFileSync("src/generated/audio.json", "utf8"),
) as Record<string, string>;

test("rain and candy buttons choose distinct native recordings", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).pitchPlayed = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).pitchPlayed.push({
        url: new URL(this.src).pathname,
        rate: this.playbackRate,
      });
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.goto("/#listen");
  const pair = page.locator(".pitch-pair");
  for (const [index, text] of ["雨", "飴"].entries()) {
    await pair
      .getByRole("button", { name: "Listen", exact: true })
      .nth(index)
      .click();
    expect(
      await page.evaluate(() => (window as any).pitchPlayed.at(-1)),
    ).toEqual({ url: manifest[text], rate: 1 });
  }
  expect(manifest["雨"]).not.toBe(manifest["飴"]);
  await expect(page.locator(".audio-error")).toHaveCount(0);
  const decoded = await page.evaluate(
    async (urls) => {
      const ctx = new AudioContext();
      const rows = [];
      for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        rows.push({
          channels: audio.numberOfChannels,
          seconds: audio.duration,
        });
      }
      await ctx.close();
      return rows;
    },
    [manifest["雨"], manifest["飴"]],
  );
  for (const row of decoded) {
    expect(row.channels).toBe(1);
    expect(row.seconds).toBeGreaterThan(0.6);
    expect(row.seconds).toBeLessThan(1);
  }
  await page.screenshot({
    path: "output/pitch-contrast-desktop.png",
    fullPage: true,
  });
});
