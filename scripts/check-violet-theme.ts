import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const browser = await chromium.launch({ channel: "chrome" });
const results: unknown[] = [];
const routes = [
  "today",
  "read",
  "letters",
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
];
for (const width of [1440, 375]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5174");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.goto("http://127.0.0.1:5174/#settings");
  await page.getByRole("button", { name: "Night post" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Settings saved." })
    .waitFor();
  for (const route of routes) {
    await page.goto("http://127.0.0.1:5174/#" + route);
    await page.locator(".app-main").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const violations = (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations;
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    results.push({
      width,
      route,
      overflow,
      violations: violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    if (["today", "read", "voice", "postmarks"].includes(route))
      await page.screenshot({
        path: `.impeccable/review/violet-night-${route}-${width}.png`,
        fullPage: true,
      });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(
  "output/violet-dark-check.json",
  JSON.stringify(results, null, 2),
);
const failed = (
  results as { overflow: boolean; violations: unknown[] }[]
).filter((r) => r.overflow || r.violations.length);
console.log(JSON.stringify(failed, null, 2));
expect(failed).toEqual([]);
console.log("28 dark-theme route/viewport checks passed.");
