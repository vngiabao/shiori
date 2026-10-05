import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("same-voice emotional takes play and remain accessible", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    (window as any).emotionPlayed = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).emotionPlayed.push(this.src);
      return play.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page
    .getByRole("heading", { name: "Your next letter is ready." })
    .waitFor();
  await page.goto("/#voice");
  await page.getByLabel("Compare the same line").selectOption("correct");
  const section = page.getByRole("region", { name: "Expressive Violetto" });
  await expect(section.getByRole("heading")).toHaveText("Quiet delight");
  await section.getByRole("button", { name: "A small smile" }).click();
  await section.getByRole("button", { name: "Sincerely pleased" }).click();
  const played = await page.evaluate(
    () => (window as any).emotionPlayed as string[],
  );
  expect(played).toHaveLength(2);
  expect(played[0]).not.toBe(played[1]);
  await page.getByLabel("Compare the same line").selectOption("contrast");
  await expect(
    section.getByRole("button", { name: "Clear lesson speech" }),
  ).toBeVisible();
  await expect(
    section.getByRole("button", { name: "Sincerely pleased" }),
  ).toHaveCount(0);
  await page.getByLabel("Compare the same line").selectOption("retry");
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.screenshot({
      path: `.impeccable/review/emotions-${width}.png`,
      fullPage: true,
    });
  }
});
