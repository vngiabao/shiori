import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("reading practice, text cloze and saved drafts work in the existing Read area", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Reader");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#read");
  await page.getByRole("button", { name: "Reading path" }).click();
  await page.screenshot({
    path: "output/reading-path-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Practise sentences" }).click();
  for (let i = 0; i < 8; i++) {
    await page.getByRole("button", { name: "Show reading or hint" }).click();
    await page.locator(".reading-choices button").first().click();
    if (i === 0) {
      await expect(
        page.locator(".reading-choices button").first(),
      ).toHaveAttribute("aria-pressed", "true");
      await page.screenshot({
        path: "output/reading-selected.png",
        fullPage: true,
      });
    }
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: i === 7 ? "Finish practice" : "Next sentence or word",
      })
      .click();
  }
  await expect(
    page.getByText("0 without hints or furigana.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Text desk", exact: false }).click();
  await page.getByLabel("Title", { exact: true }).fill("My lyric");
  await page
    .getByLabel("Japanese text", { exact: true })
    .fill("{猫|ねこ}がいます。");
  await page.getByLabel("Text to hide").fill("猫");
  await page
    .getByLabel("My translation", { exact: true })
    .fill("There is a cat.");
  await page.getByRole("button", { name: "Save text", exact: true }).click();
  await expect(
    page.getByText("Saved on this device.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Practise missing text" }).click();
  await page.getByLabel("Missing text", { exact: true }).fill("猫");
  await page.getByRole("button", { name: "Check missing text" }).click();
  await expect(page.getByText("Exact match.", { exact: false })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Text desk" }).click();
  await page.getByRole("button", { name: "My lyric", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("Unfinished title");
  await page.getByRole("button", { name: "Reading path" }).click();
  await page.getByRole("button", { name: "Text desk" }).click();
  await expect(
    page.getByRole("textbox", { name: "Title", exact: true }),
  ).toHaveValue("Unfinished title");
  await page.getByRole("textbox", { name: "Title", exact: true }).fill("");
  await page.getByRole("button", { name: "Save text", exact: true }).click();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "New text", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "My translation", exact: true }),
  ).toHaveValue("There is a cat.");
  await page
    .getByRole("textbox", { name: "Title", exact: true })
    .fill("My lyric");
  await page.getByRole("button", { name: "Save text", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Japanese text", exact: true }),
  ).toHaveValue("{猫|ねこ}がいます。");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({
    path: "output/text-desk-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Reading path" }).click();
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await page.screenshot({
    path: "output/reading-path-mobile-dark.png",
    fullPage: true,
  });
});
