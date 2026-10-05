import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const manifest = JSON.parse(
  fs.readFileSync("src/generated/audio.json", "utf8"),
) as Record<string, string>;
test("replacement kana audio decodes, changes clips, and voice sheet fits both sizes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.goto("/#voice");
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    for (const text of ["あ", "い", "う", "え", "お", "あ、い。"]) {
      await page
        .getByRole("button", { name: `Hear ${text}`, exact: true })
        .click();
      await expect(page.locator(".audio-error")).toHaveCount(0);
    }
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `.impeccable/review/voice-repair-${width}.png`,
      fullPage: true,
    });
  }
  const decoded = await page.evaluate(async (manifest) => {
    const ctx = new AudioContext();
    const rows = [];
    for (const text of ["あ", "い", "う", "え", "お", "あ、い。"]) {
      const url = manifest[text];
      const response = await fetch(url);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      rows.push({
        text,
        url,
        seconds: buffer.duration,
        channels: buffer.numberOfChannels,
      });
    }
    await ctx.close();
    return rows;
  }, manifest);
  for (const row of decoded) {
    expect(row.url).toMatch(/vv2-.*\.wav$/);
    expect(row.channels).toBe(1);
    expect(row.seconds).toBeGreaterThan(0.3);
    expect(row.seconds).toBeLessThan(2);
  }
});
