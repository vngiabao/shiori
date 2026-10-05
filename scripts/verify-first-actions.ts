import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
const browser = await chromium.launch({ channel: "chrome" });
const results = [];
for (const width of [320, 375, 414]) {
  const context = await browser.newContext({
    viewport: { width, height: 812 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174");
  await page.evaluate(() => document.fonts.ready);
  const quick = page.getByRole("button", { name: "Begin with Violetto" });
  const welcome = await quick.boundingBox();
  expect(welcome!.y + welcome!.height).toBeLessThan(812);
  if (width === 375)
    await page.screenshot({
      path: ".impeccable/review/violet-welcome-first-375.png",
    });
  await quick.click();
  await expect(page.getByLabel("What should Violetto call you?")).toBeFocused();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") {
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
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const lesson = await page
      .getByRole("button", { name: "Begin lesson", exact: true })
      .boundingBox();
    const nav = await page.locator(".mobile-nav").boundingBox();
    expect(lesson!.y + lesson!.height).toBeLessThan(nav!.y);
    const companion = await page.locator(".violetto-desk").boundingBox();
    expect(companion!.y + companion!.height).toBeLessThan(nav!.y);
    results.push({
      width,
      height: 812,
      theme,
      welcomeButtonBottom: welcome!.y + welcome!.height,
      lessonButtonBottom: lesson!.y + lesson!.height,
      navTop: nav!.y,
      companionBottom: companion!.y + companion!.height,
    });
    if (width === 375)
      await page.screenshot({
        path: `.impeccable/review/violet-today-first-${theme}-375.png`,
      });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(
  "output/violet-first-actions.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
