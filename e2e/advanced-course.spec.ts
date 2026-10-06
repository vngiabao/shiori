import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const takes = JSON.parse(readFileSync("src/generated/dialogue-voices.json", "utf8"));

test("the two N3 lessons use their own grammar and scenes, with valid recordings and supported reading", async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    (window as any).played = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).played.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.goto("/");
  const audioFailures = await page.evaluate(async (lines: { url: string; seconds: number }[]) => {
    const ctx = new AudioContext(), failed: string[] = [];
    for (const line of lines) {
      try {
        const response = await fetch(line.url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        if (audio.numberOfChannels !== 1 || Math.abs(audio.duration - line.seconds) > .001) throw new Error("Invalid recording");
      } catch { failed.push(line.url); }
    }
    await ctx.close(); return failed;
  }, [...takes["n3-u01-d-vlog"], ...takes["n3-u01-d-purpose"]]);
  expect(audioFailures).toEqual([]);
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
  for (const [title, scene, allowed, absent] of [
    ["A change you can describe", "n3-u01-d-vlog", "An ability or routine has changed", "A deliberate goal: ために versus ように"],
    ["Choose a purpose and a method", "n3-u01-d-purpose", "A deliberate goal: ために versus ように", "An ability or routine has changed"],
  ]) {
    await page.goto("/#library");
    await page.getByLabel("Show lessons").selectOption("n3");
    await page.locator(".course-lessons > div").filter({ hasText: title }).getByRole("button", { name: "Read", exact: true }).click();
    const counter = page.locator(".lesson-top > span").last();
    for (let step = 0; step < 16; step++) {
      const meet = page.getByRole("button", { name: "I’ve met these" });
      if (!(await meet.count())) break;
      const before = await counter.textContent();
      await meet.click();
      await expect(counter).not.toHaveText(before!);
    }
    await expect(page.getByRole("heading", { name: "Notice how this works." })).toBeVisible();
    await expect(page.getByText(allowed, { exact: true })).toBeVisible();
    await expect(page.getByText(absent, { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Hear it in context" }).click();
    await expect(page.getByRole("heading", { name: "Listen to the conversation." })).toBeVisible();
    await page.getByRole("button", { name: "Play again", exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).played)).toEqual(expect.arrayContaining(takes[scene].map((t: { url: string }) => t.url)));
    await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  }
  for (const [width, theme] of [[1440, "light"], [375, "light"], [1440, "dark"], [375, "dark"]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#settings");
    await page.getByRole("button", { name: theme === "dark" ? "Night post" : "Morning letter" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.goto("/#read");
    await page.reload();
    await page.getByRole("button", { name: "Texts", exact: false }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const region = page.getByRole("region", { name: "A week of changes and choices" });
    if (!(await region.isVisible())) await page.getByText("A week of changes and choices", { exact: true }).first().click();
    await expect(region).toBeVisible();
    await expect(region.locator("ruby")).toHaveCount(0);
    await region.getByRole("button", { name: /furigana/i }).click();
    expect(await region.locator("ruby").count()).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.locator("h1").click();
    await page.screenshot({ path: `output/n3-u01-reading-${theme}-${width}.png`, fullPage: true });
  }
});
