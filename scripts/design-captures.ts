import { chromium } from "@playwright/test";
import fs from "node:fs";
const batch = process.argv[2] || "C";
const dir = `.impeccable/review/shared-${batch}`;
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const width of [1440, 768, 375, 320]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:5174");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Bao");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page.locator(".today-board").waitFor();
  for (const theme of ["light", "dark"]) {
    await page.goto("http://127.0.0.1:5174/#settings");
    await page
      .getByRole("button", {
        name: theme === "light" ? "Morning letter" : "Night post",
      })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Settings saved." })
      .waitFor();
    await page.goto("http://127.0.0.1:5174/#today");
    await page.locator(".today-board").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${dir}/shiori-today-${width}-${theme}.png`,
      fullPage: true,
    });
    if (batch === "A" || batch === "before") continue;
    for (const correct of [true, false]) {
      await page
        .getByRole("button", { name: "Begin lesson", exact: true })
        .click();
      await page.getByRole("button", { name: "Ready to try" }).click();
      const choices = page.locator(".answer-option");
      await choices
        .filter({ hasText: correct ? /^[1-4]a$/ : /^[1-4][^a]$/ })
        .first()
        .click();
      await page
        .getByRole("button", { name: "Check answer", exact: true })
        .click();
      await page.locator(".verdict-bar").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `${dir}/shiori-${correct ? "correct" : "wrong"}-${width}-${theme}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: "Leave lesson" }).click();
    }
  }
  await page.close();
}
await browser.close();
console.log(`Captured ${batch} at 1440, 768, 375, 320 in both themes.`);
