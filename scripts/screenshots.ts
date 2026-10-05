import { chromium } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome" });
fs.mkdirSync(".impeccable/review", { recursive: true });
for (const width of [1440, 768, 375]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:5174");
  await page
    .getByRole("button", { name: "Start without an account" })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `.impeccable/review/welcome-${width}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Bao");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `.impeccable/review/today-${width}.png`,
    fullPage: true,
  });
  for (const route of [
    "read",
    "letter/letter-1",
    "listen",
    "speak",
    "practice",
    "media",
    "progress",
    "settings",
    "companion",
    "library",
    "fieldwork",
    "voice",
    "postmarks",
  ]) {
    await page.goto("http://127.0.0.1:5174/#" + route);
    await page.locator(".app-main").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `.impeccable/review/${route.replace("/", "-")}-${width}.png`,
      fullPage: true,
    });
    if (route === "letter/letter-1") {
      await page.locator(".gloss-token").first().click();
      await page.screenshot({
        path: `.impeccable/review/gloss-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.goto("http://127.0.0.1:5174/#today");
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  await page.getByRole("button", { name: "Ready to try" }).waitFor();
  await page.getByText("3 strokes", { exact: true }).waitFor();
  await page.screenshot({
    path: `.impeccable/review/lesson-${width}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Ready to try" }).click();
  await page.screenshot({
    path: `.impeccable/review/quiz-${width}.png`,
    fullPage: true,
  });
  await page.goto("http://127.0.0.1:5174/#settings");
  await page.getByRole("button", { name: "Night post" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Settings saved." })
    .waitFor();
  await page.goto("http://127.0.0.1:5174/#today");
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.screenshot({
    path: `.impeccable/review/night-${width}.png`,
    fullPage: true,
  });
  await page.close();
}
await browser.close();
console.log("Captured desktop, tablet and phone screens.");
