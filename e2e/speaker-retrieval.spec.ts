import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("the N3 speaker question replays the exact character take and records feedback", async ({ page }) => {
  test.setTimeout(90000);
  const pack = JSON.parse(readFileSync("content/packs/n3-u12.json", "utf8"));
  const ex = pack.exercises.find((x: { type: string }) => x.type === "speaker");
  const scene = pack.dialogues.find((d: { id: string }) => d.id === ex.dialogue);
  const plain = (s: string) => s.replace(/\{([^|{}]+)\|[^|{}]+\}/g, "$1");
  const index = scene.lines.findIndex((l: { line: string }) => plain(l.line) === plain(ex.line));
  const takes = JSON.parse(readFileSync("src/generated/dialogue-voices.json", "utf8"));
  await page.addInitScript(() => {
    (window as any).played = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).played.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n3");
  await page.locator(".course-lessons > div").filter({ hasText: "Recall, wonder and respond among peers" }).getByRole("button", { name: "Read", exact: true }).click();
  const counter = page.locator(".lesson-top > span").last();
  let reached = false;
  for (let guard = 0; guard < 60; guard++) {
    if (await page.getByRole("heading", { name: ex.prompt, exact: true }).count()) { reached = true; break; }
    const before = await counter.textContent();
    const meet = page.getByRole("button", { name: "I’ve met these" });
    const grammar = page.getByRole("button", { name: "Hear it in context" });
    const scene = page.getByRole("button", { name: "Answer questions" });
    if (await meet.count()) await meet.click();
    else if (await grammar.count()) await grammar.click();
    else if (await scene.count()) await scene.click();
    else {
      const tiles = page.locator(".order-pool .order-tile:enabled");
      if (await tiles.count()) while (await tiles.count()) await tiles.first().click();
      else await page.locator(".lesson-main .answer-option").first().click();
      await page.getByRole("button", { name: /Check answer/ }).click();
      await expect(page.locator(".verdict-bar")).toBeVisible();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(counter).not.toHaveText(before!);
  }
  expect(reached).toBe(true);
  await page.getByRole("button", { name: "Hear the line", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).played.at(-1))).toBe(takes[ex.dialogue][index].url);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.locator(".lesson-main .answer-option").nth(ex.answer).click();
  await page.getByRole("button", { name: /Check answer/ }).click();
  await expect(page.locator(".verdict-bar")).toContainText("Right.");
  await expect(page.locator(".verdict-bar")).toContainText("Misaki");
  const answeredStep = await counter.textContent();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(counter).not.toHaveText(answeredStep!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
