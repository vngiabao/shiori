import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await page.goto("http://127.0.0.1:5174");
await page.getByRole("button", { name: "Start without an account" }).click();
await page.getByLabel("What should Violetto call you?").fill("Bao");
await page.getByRole("button", { name: "Open my first letter" }).click();
await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
await page.getByText("3 strokes", { exact: true }).waitFor();
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: ".impeccable/review/lesson-1440.png",
  fullPage: true,
});
await browser.close();
