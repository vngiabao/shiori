import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Bao");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
}
// Wait for entrances to finish so contrast is measured on settled colours.
const axe = async (page: Page) =>
  (await page.evaluate(() =>
    Promise.all(document.getAnimations().map((a) => a.finished)),
  ),
  await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()).violations;

for (const width of [1440, 375]) {
  test(`a phrase lesson teaches, then tests in new sentences at ${width}`, async ({
    page,
  }) => {
    test.setTimeout(150000);
    await page.setViewportSize({ width, height: width < 600 ? 812 : 900 });
    await onboard(page);
    await page.goto("/#library");
    await page
      .locator("div")
      .filter({
        has: page.getByRole("heading", {
          name: "A name, a beginning",
          exact: true,
        }),
      })
      .filter({ has: page.getByRole("button", { name: "Read" }) })
      .last()
      .getByRole("button", { name: "Read" })
      .click();
    // Words are met as a list first; nothing is quizzed on the same screen.
    await expect(
      page.getByRole("heading", { name: "New words" }),
    ).toBeVisible();
    await expect(page.locator(".answer-option")).toHaveCount(0);
    const counter = page.locator(".lesson-top > span").last();
    while (await page.getByRole("button", { name: "I’ve met these" }).count()) {
      const before = await counter.textContent();
      await page.getByRole("button", { name: "I’ve met these" }).click();
      await expect(counter).not.toHaveText(before!);
    }
    // The scene is heard before its text is shown.
    await expect(
      page.getByRole("heading", { name: "Listen to the conversation." }),
    ).toBeVisible();
    await expect(page.locator(".scene-lines .masked")).toHaveCount(5);
    expect(await axe(page)).toEqual([]);
    await page
      .getByRole("button", { name: "Answer questions" })
      .click({ timeout: 20000 });
    let sawGap = false;
    let sawOrder = false;
    for (let guard = 0; guard < 30; guard++) {
      if (await page.locator(".completion").count()) break;
      if (await page.locator(".cloze-line").count()) sawGap = true;
      const tiles = page.locator(".order-pool .order-tile");
      if (await tiles.count()) {
        sawOrder = true;
        // Build 私は日本語の学生です from the shuffled tiles.
        for (const t of ["私", "は", "日本語", "の", "学生", "です"])
          await tiles
            .filter({ hasText: new RegExp(`^${t}`) })
            .first()
            .click();
      } else await page.locator(".lesson-main .answer-option").first().click();
      await page.getByRole("button", { name: /Check answer/ }).click();
      await expect(page.locator(".verdict-bar")).toBeVisible();
      if (
        sawOrder &&
        guard < 30 &&
        (await page.locator(".order-answer").count())
      )
        await expect(page.locator(".verdict-bar")).toContainText("Right.");
      if (guard === 2) expect(await axe(page)).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const step = await counter.textContent();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await expect
        .poll(
          async () =>
            (await page.locator(".completion").count()) > 0 ||
            (await counter.textContent()) !== step,
        )
        .toBe(true);
    }
    expect(sawGap && sawOrder).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Lesson delivered." }),
    ).toBeVisible();
  });
}

test("letters ask comprehension questions that depend on the particles", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#letter/letter-5");
  const tasks = page.getByRole("region", { name: "Check what you read" });
  await expect(tasks).toBeVisible();
  await tasks.getByRole("button", { name: "✕ False" }).click();
  await expect(tasks.getByRole("status").first()).toContainText("Right.");
  await tasks
    .locator(".letter-task")
    .nth(1)
    .getByRole("button")
    .filter({ hasText: "と" })
    .click();
  await expect(tasks.getByRole("status").nth(1)).toContainText(
    "と after a person",
  );
  expect(await axe(page)).toEqual([]);
});
