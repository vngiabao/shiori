import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const questions = JSON.parse(
  fs.readFileSync(
    new URL("../content/jlpt/questions.json", import.meta.url),
    "utf8",
  ),
) as { level: string; stage: string; answer: number }[];
const questionsFor = (level: string, stage: string) =>
  questions.filter((q) => q.level === level && q.stage === stage);

async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.goto("/#jlpt/N5");
  await page.getByRole("heading", { name: "JLPT study room." }).waitFor();
}
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator(".jlpt-teacher img")
    .first()
    .evaluate((img: HTMLImageElement) => img.decode());
}

test("JLPT source-to-checkpoint pathway, timed refresh, expiry and next cycle", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.clock.install();
  await onboard(page);
  await page.getByRole("button", { name: /Timed sample/ }).click();
  await expect(
    page.getByText("Complete these prerequisites before this milestone:"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start 8-minute sample" }),
  ).toHaveCount(0);
  await page
    .locator(".jlpt-syllabus")
    .getByRole("button", { name: /1 Entry requirements Available/ })
    .click();
  for (const box of await page.locator(".jlpt-entry input").all())
    await box.check();
  await page.getByRole("button", { name: "Confirm starting skills" }).click();
  for (const stage of ["vocabulary", "grammar", "reading"] as const) {
    await expect(
      page.getByRole("button", { name: "Start checkpoint" }),
    ).toBeDisabled();
    await page
      .getByLabel("Book unit, pages or sample item")
      .fill(`My book: ${stage}, unit 1`);
    await page
      .getByLabel("What did you correct or learn?")
      .fill(
        "I corrected the missed item and wrote down the reason in context.",
      );
    await page.getByRole("button", { name: "Save study block" }).click();
    await page.getByRole("button", { name: "Start checkpoint" }).click();
    for (const [i, q] of questionsFor("N5", stage).entries()) {
      await page.getByRole("radio").nth(q.answer).click();
      await expect(page.getByRole("radio").nth(q.answer)).toBeChecked();
      if (i === 0)
        await page.getByRole("button", { name: "Next question" }).click();
      else await page.getByRole("button", { name: /Submit answers/ }).click();
    }
    await expect(
      page.getByRole("heading", { name: "2 / 2 correct" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Back to the pathway" }).click();
  }
  await page
    .getByLabel("Book unit, pages or sample item")
    .fill("Official listening sample, task item 1");
  await page
    .getByLabel("What did you correct or learn?")
    .fill(
      "I missed the changed time, replayed, and identified the final arrangement.",
    );
  await page.getByRole("button", { name: "Save study block" }).click();
  await page.getByRole("button", { name: "Start 8-minute sample" }).click();
  await page.getByRole("radio").nth(1).click();
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await page.reload();
  await expect(page.getByRole("radio").nth(1)).toBeChecked();
  await expect(page.getByRole("timer")).toBeVisible();
  await page.clock.fastForward(8 * 60 * 1000 + 1000);
  await expect(
    page.getByRole("heading", { name: "1 / 6 correct" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to the pathway" }).click();
  await page.getByRole("button", { name: "Start 8-minute sample" }).click();
  for (const [i, q] of questionsFor("N5", "exam").entries()) {
    await page.getByRole("radio").nth(q.answer).click();
    await expect(page.getByRole("radio").nth(q.answer)).toBeChecked();
    if (i < 5)
      await page.getByRole("button", { name: "Next question" }).click();
    else await page.getByRole("button", { name: /Submit answers/ }).click();
  }
  await expect(
    page.getByRole("heading", { name: "6 / 6 correct" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to the pathway" }).click();
  await page.getByRole("button", { name: "Begin next study cycle" }).click();
  await expect(
    page.getByText("Study cycle 2 · 0 of 6 milestones complete"),
  ).toBeVisible();
  await expect(page.getByText("6/6 raw correct")).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Study cycle 2 · 0 of 6 milestones complete"),
  ).toBeVisible();
});

for (const width of [320, 375, 768, 1024, 1440])
  test(`JLPT levels fit and remain accessible at ${width}`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await onboard(page);
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") {
        await page.goto("/#settings");
        await page.getByRole("button", { name: "Night post" }).click();
        await page
          .getByRole("status")
          .filter({ hasText: "Settings saved." })
          .waitFor();
      }
      for (const level of ["N5", "N4", "N3", "N2", "N1"]) {
        await page.goto(`/#jlpt/${level}`);
        await settle(page);
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
        await expect(
          page
            .getByRole("navigation", { name: "JLPT level" })
            .getByRole("link", { name: new RegExp(level) }),
        ).toHaveAttribute("aria-current", "page");
        if ([375, 1440].includes(width) && level === "N5")
          await page.screenshot({
            path: `.impeccable/review/jlpt-${level}-${theme}-${width}.png`,
            fullPage: true,
          });
        if (width === 1440 && theme === "light" && level === "N1")
          await page.screenshot({
            path: ".impeccable/review/jlpt-N1-light-1440.png",
            fullPage: true,
          });
      }
    }
  });

test("JLPT exam question and result views have accessible mobile states", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await onboard(page);
  await page.evaluate(async () => {
    const dbPath = "/src/db.ts";
    const modelPath = "/src/jlpt-model.ts";
    const { db } = await import(dbPath);
    const { createRun, newPlan } = await import(modelPath);
    await db.jlptRuns.add(createRun(newPlan("N1"), "exam"));
  });
  await page.goto("/#jlpt/N1");
  await page.getByRole("radio").first().waitFor();
  await settle(page);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: ".impeccable/review/jlpt-exam-375.png",
    fullPage: true,
  });
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Next question" }).click();
  await page.getByRole("button", { name: /Submit answers/ }).click();
  await page.getByRole("heading", { name: "0 / 6 correct" }).waitFor();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: ".impeccable/review/jlpt-result-375.png",
    fullPage: true,
  });
});
