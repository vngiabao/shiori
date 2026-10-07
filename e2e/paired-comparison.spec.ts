import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

test("N2 comparison keeps both authors visible, records supported work and advances all four keys", async ({
  page,
}) => {
  test.setTimeout(90000);
  const pack = JSON.parse(readFileSync("content/packs/n2-u13.json", "utf8"));
  const comparisons = pack.exercises.filter(
    (x: { type: string }) => x.type === "compare",
  );
  expect(comparisons).toHaveLength(4);
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n2");
  await page
    .locator(".course-lessons > div")
    .filter({ hasText: "Compare the shared purpose and different order" })
    .getByRole("button", { name: "Read", exact: true })
    .click();
  const counter = page.locator(".lesson-top > span").last();
  let reached = false;
  for (let guard = 0; guard < 60; guard++) {
    if (
      await page
        .getByRole("heading", { name: comparisons[0].prompt, exact: true })
        .count()
    ) {
      reached = true;
      break;
    }
    const before = await counter.textContent();
    const meet = page.getByRole("button", { name: "I’ve met these" });
    const grammar = page.getByRole("button", { name: "Hear it in context" });
    const scene = page.getByRole("button", { name: "Answer questions" });
    if (await meet.count()) await meet.click();
    else if (await grammar.count()) await grammar.click();
    else if (await scene.count()) await scene.click();
    else {
      const tiles = page.locator(".order-pool .order-tile:enabled");
      if (await tiles.count())
        while (await tiles.count()) await tiles.first().click();
      else await page.locator(".lesson-main .answer-option").first().click();
      await page.getByRole("button", { name: /Check answer/ }).click();
      await expect(page.locator(".verdict-bar")).toBeVisible();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(counter).not.toHaveText(before!);
  }
  expect(reached).toBe(true);
  for (const [index, ex] of comparisons.entries()) {
    await expect(
      page.getByRole("heading", { name: ex.prompt, exact: true }),
    ).toBeVisible();
    for (const reading of pack.readings)
      await expect(
        page.getByRole("region", { name: reading.title, exact: true }),
      ).toBeVisible();
    const primary = page.getByRole("region", {
      name: pack.readings[1].title,
      exact: true,
    });
    await expect(primary.locator("ruby")).toHaveCount(0);
    await primary.getByRole("button", { name: /furigana/i }).click();
    for (const reading of pack.readings)
      expect(
        await page
          .getByRole("region", { name: reading.title, exact: true })
          .locator("ruby")
          .count(),
      ).toBeGreaterThan(0);
    if (index === 0) {
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: "output/n2-u13-paired-375.png",
        fullPage: true,
      });
    }
    await page.locator(".lesson-main .answer-option").nth(ex.answer).click();
    await page.getByRole("button", { name: /Check answer/ }).click();
    await expect(page.locator(".verdict-bar")).toContainText("Right.");
    await expect(page.locator(".verdict-bar")).toContainText(ex.explain);
    const before = await counter.textContent();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(counter).not.toHaveText(before!);
    if (index + 1 < comparisons.length) {
      for (let guard = 0; guard < 10; guard++) {
        if (
          await page
            .getByRole("heading", {
              name: comparisons[index + 1].prompt,
              exact: true,
            })
            .count()
        )
          break;
        await page.locator(".lesson-main .answer-option").first().click();
        await page.getByRole("button", { name: /Check answer/ }).click();
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
      }
    }
  }
  const attempts = await page.evaluate(
    async (ids: string[]) => {
      const request = indexedDB.open("shiori-japanese-v1");
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      try {
        const req = database
          .transaction("attempts")
          .objectStore("attempts")
          .getAll();
        const all = await new Promise<any[]>((resolve, reject) => {
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        return all.filter(
          (x) =>
            ids.includes(x.itemId) &&
            x.source === "n2-u13-lesson-2" &&
            x.support === "furigana",
        );
      } finally {
        database.close();
      }
    },
    comparisons.map((x: { words: string[] }) => x.words[0]),
  );
  expect(attempts).toHaveLength(4);
  expect(attempts.every((x) => x.correct && x.support === "furigana")).toBe(
    true,
  );
  await expect(page.getByRole("alert")).toHaveCount(0);
});
