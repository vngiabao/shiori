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
test("guest onboarding, a complete lesson, local persistence and review evidence", async ({
  page,
}) => {
  await onboard(page);
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  for (const [i, correct] of ["a", "i", "u", "e", "o"].entries()) {
    await page.getByRole("button", { name: "Ready to try" }).click();
    if (i === 0)
      await page.getByRole("button", { name: "Show romaji" }).click();
    if (i % 2)
      await page.getByRole("button", { name: "Play Japanese" }).click();
    await page
      .locator(".answer-option")
      .filter({
        hasText: new RegExp(`^[1-4]${i % 2 ? "あいうえお"[i] : correct}$`),
      })
      .click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Continue",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "A little closer." }),
  ).toBeVisible();
  await expect(page.getByText("4 unaided answers")).toBeVisible();
  await expect(page.getByText("1 with support")).toBeVisible();
  await page.goto("/#postmarks");
  await expect(page.locator(".postal-number")).toHaveText("1");
  await expect(
    page.locator(".stamp-entry.earned").filter({ hasText: "First dispatch" }),
  ).toBeVisible();
  await page.reload();
  await page.goto("/#progress");
  await expect(
    page.getByRole("heading", { name: "1 lesson finished." }),
  ).toBeVisible();
  await expect(
    page.getByText("2 / 2 unaided answers correct").first(),
  ).toBeVisible();
});
test("letters record supported reading and roleplay advances through valid answers", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#letter/letter-1");
  await page
    .getByRole("button", { name: "Books in Japanese", exact: true })
    .click();
  await expect(
    page.getByText("Saved as supported reading.", { exact: false }),
  ).toBeVisible();
  await page.goto("/#speak");
  await page.getByRole("button", { name: /Meet me at the bookshop/ }).click();
  for (const answer of ["はじめまして", "よろしくお願いします"]) {
    await page.locator("#role-answer").fill(answer);
    await page.getByRole("button", { name: "Send reply" }).click();
    await expect(page.getByText("Your reply fits.")).toBeVisible();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "You found the words." }),
  ).toBeVisible();
});
test("settings persist, dictionary works and backup exports", async ({
  page,
}) => {
  await onboard(page);
  await page.goto("/#dictionary");
  await page.getByRole("textbox", { name: "Search dictionary" }).fill("tegami");
  await page.locator(".dictionary-list>button").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.goto("/#settings");
  await page.getByRole("button", { name: "Night post" }).click();
  await expect(page.locator(".settings-status")).toHaveText("Settings saved.");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export backup" }).click();
  expect((await download).suggestedFilename()).toContain("shiori-backup");
});
for (const width of [1440, 768, 375, 320, 414])
  test(`screens are accessible and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await onboard(page);
    for (const route of [
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
    ]) {
      await page.goto("/#" + route);
      await page.locator(".app-main").waitFor();
      await page.evaluate(() => document.fonts.ready);
      const violations = (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations;
      expect(violations, route).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        route + " overflow",
      ).toBe(true);
    }
  });

test("voice audition choice persists and spoken reactions and tapped words respect settings", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    (window as unknown as { played: string[] }).played = [];
    HTMLMediaElement.prototype.play = function () {
      (window as unknown as { played: string[] }).played.push(
        this.currentSrc || this.src,
      );
      return original.call(this);
    };
  });
  await onboard(page);
  await page.goto("/#voice");
  const candidate = page.locator(".voice-audition").nth(2);
  await candidate.getByRole("button", { name: "Listen to this take" }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { played: string[] }).played.at(-1),
      ),
    )
    .toContain("v03-welcome.wav");
  await candidate.getByRole("button", { name: "Try in reactions" }).click();
  await expect(page.getByRole("status")).toContainText(
    "selected for reaction previews",
  );
  await page.reload();
  await expect(
    page
      .locator(".voice-audition")
      .nth(2)
      .getByRole("button", { name: "Selected for reactions" }),
  ).toBeVisible();
  await page.goto("/#today");
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  await page.getByRole("button", { name: "Ready to try" }).click();
  await page
    .locator(".answer-option")
    .filter({ hasText: /^[1-4]a$/ })
    .click();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { played: string[] }).played.at(-1),
      ),
    )
    .toContain("v03-correct.wav");
  await page.goto("/#settings");
  await page.getByRole("checkbox", { name: /Speak praise/ }).uncheck();
  await expect(page.locator(".settings-status")).toHaveText("Settings saved.");
  await page.getByRole("checkbox", { name: /Read tapped/ }).uncheck();
  await expect(page.locator(".settings-status")).toHaveText("Settings saved.");
  await page.goto("/#letter/letter-1");
  const before = await page.evaluate(
    () => (window as unknown as { played: string[] }).played.length,
  );
  await page.locator(".gloss-token").first().click();
  await page
    .getByRole("button", { name: "Books in Japanese", exact: true })
    .click();
  await expect(
    page.getByText("Saved as supported reading.", { exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => (window as unknown as { played: string[] }).played.length,
    ),
  ).toBe(before);
  await page.goto("/#settings");
  await page.getByRole("checkbox", { name: /Read tapped/ }).check();
  await expect(page.locator(".settings-status")).toHaveText("Settings saved.");
  await page.goto("/#letter/letter-1");
  await page.locator(".gloss-token").first().click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { played: string[] }).played.at(-1),
      ),
    )
    .toContain("/audio/");
});

test("phone teaching tools, keyboard reading areas and supported completion stay honest", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  await onboard(page);
  await page.goto("/#read");
  const group = page.getByRole("group", { name: "Reading areas" });
  await group.getByRole("button", { name: /Hiragana/ }).focus();
  await page.keyboard.press("Tab");
  await expect(group.getByRole("button", { name: /Katakana/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(group.getByRole("button", { name: /Katakana/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.goto("/#letter/letter-1");
  await page.locator(".gloss-token").first().click();
  await expect(
    page.getByRole("region", { name: "Selected word meaning" }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Close meaning" }).click();
  await page.goto("/#today");
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  await expect(page.locator(".stroke-sheet svg")).toBeVisible();
  // The first meeting draws the kana once; wait for the pen to lift.
  await expect(page.getByRole("button", { name: "Writing…" })).toHaveCount(0, {
    timeout: 10000,
  });
  const icon = await page
    .getByRole("button", { name: "Watch the strokes" })
    .locator("svg")
    .boundingBox();
  expect(icon!.width).toBeLessThan(40);
  // Kana lessons alternate: read the glyph and pick its sound, then hear the sound and pick its glyph.
  const glyphs = ["あ", "い", "う", "え", "お"];
  for (const [i, correct] of ["a", "i", "u", "e", "o"].entries()) {
    await page.getByRole("button", { name: "Ready to try" }).click();
    await page.getByRole("button", { name: "Show romaji" }).click();
    await page
      .locator(".answer-option")
      .filter({ hasText: new RegExp(`^[1-4]${i % 2 ? glyphs[i] : correct}$`) })
      .click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Continue",
        exact: true,
      })
      .click();
  }
  await expect(page.getByText("0 unaided answers")).toBeVisible();
  await expect(page.getByText("5 with support")).toBeVisible();
  await expect(page.getByText("You practised this goal:")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: ".impeccable/review/completion-supported-375.png",
    fullPage: true,
  });
  await page.goto("/#settings");
  await page.getByRole("button", { name: "Night post" }).click();
  await expect(page.locator(".settings-status")).toHaveText("Settings saved.");
  await page.goto("/#today");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
