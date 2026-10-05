import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("focus lesson: select then check, keyboard, evidence, bubble and clearing", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  await expect(page.locator(".app-header")).toHaveCount(0);
  await expect(page.locator(".mobile-nav")).toHaveCount(0);
  await expect(page.locator(".violetto-bubble")).toHaveCount(0);
  await page.getByRole("button", { name: "Ready to try" }).click();
  const choices = page.locator(".answer-option");
  const correct = choices.filter({ hasText: /^[1-4]a$/ });
  const key = (await correct.innerText()).trim()[0];
  await page.keyboard.press(key);
  await expect(correct).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".verdict-bar")).toHaveCount(0);
  const before = await choices.first().boundingBox();
  await page.keyboard.press("Enter");
  await expect(page.locator(".verdict-bar")).toContainText(
    "Recalled without help.",
  );
  expect((await choices.first().boundingBox())!.y).toBe(before!.y);
  await expect(page.locator(".lesson-companion .mascot")).toHaveAttribute(
    "data-pose",
    "celebrate",
  );
  await expect(page.locator(".bubble-reading")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator(".verdict-bar")).toHaveCount(0);
  await expect(page.locator(".violetto-bubble")).toHaveCount(0);
});
for (const width of [1440, 768, 375, 320])
  test(`focus states fit and pass axe at ${width}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Start without an account" })
      .click();
    await page.getByRole("button", { name: "Open my first letter" }).click();
    await page.locator(".today-board").waitFor();
    for (const theme of ["light", "dark"]) {
      await page.goto("/#settings");
      await page
        .getByRole("button", {
          name: theme === "light" ? "Morning letter" : "Night post",
        })
        .click();
      await expect(page.getByRole("status")).toContainText("Settings saved.");
      await page.goto("/#today");
      await expect(page.locator(".postal-desk-strip")).toHaveCount(0);
      for (const correct of [true, false]) {
        await page
          .getByRole("button", { name: "Begin lesson", exact: true })
          .click();
        await page.getByRole("button", { name: "Ready to try" }).click();
        await page
          .locator(".answer-option")
          .filter({ hasText: correct ? /^[1-4]a$/ : /^[1-4]i$/ })
          .click();
        await page
          .getByRole("button", { name: "Check answer", exact: true })
          .click();
        await expect(page.locator(".verdict-bar")).toContainText(
          correct ? "Right." : "Not quite.",
        );
        await page.locator(".verdict-bar").evaluate(async (el) => {
          await Promise.all(
            el
              .getAnimations({ subtree: true })
              .map((animation) => animation.finished),
          );
        });
        if (width < 768) {
          await expect(page.locator(".bubble-reading")).not.toBeVisible();
          await page
            .getByRole("button", { name: "Expand Violetto’s message" })
            .click();
          await expect(page.locator(".bubble-reading")).toBeVisible();
        }
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
        await page.getByRole("button", { name: "Leave lesson" }).click();
      }
    }
  });
