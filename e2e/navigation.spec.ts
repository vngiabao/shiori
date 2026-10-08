import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Reader");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.locator(".app-header")).toBeVisible();
}

async function fits(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
}

test("desktop navigation exposes the complete course and every secondary page", async ({
  page,
}) => {
  await onboard(page);
  await page
    .locator(".app-header")
    .getByRole("link", { name: "Course library", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Course library.", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".library-summary")).toContainText(
    "154 content packs · 963 lessons",
  );
  for (const level of ["n4", "n3", "n2", "n1", "keigo"]) {
    await page.getByLabel("Show lessons").selectOption(level);
    await expect(page.locator(".course-unit").first()).toBeVisible();
    await expect(
      page
        .locator(".course-lessons")
        .first()
        .getByRole("button", { name: "Read", exact: true })
        .first(),
    ).toBeVisible();
  }
  await page.getByLabel("Show lessons").selectOption("n4");
  await page
    .locator(".course-lessons")
    .first()
    .getByRole("button", { name: "Read", exact: true })
    .first()
    .click();
  await expect(page.locator(".app-header")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Leave lesson", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  await expect(page.locator(".app-header")).toBeVisible();
  const more = page.locator(".header-more-button");
  await more.click();
  const menu = page.getByRole("navigation", { name: "More navigation" });
  await expect(menu).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({ path: "output/navigation-desktop.png" });
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(more).toBeFocused();
  await more.click();
  await page
    .getByRole("heading", { name: "Course library.", exact: true })
    .click();
  await expect(menu).toBeHidden();
  for (const [name, route] of [
    ["Letters", "letters"],
    ["Beyond the course", "fieldwork"],
    ["Dictionary", "dictionary"],
    ["Settings", "settings"],
    ["Violetto", "companion"],
    ["Postmark collection", "postmarks"],
    ["Violetto's voice", "voice"],
  ]) {
    await more.click();
    await menu.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${route}$`));
    await expect(page.locator(".app-main h1").first()).toBeVisible();
    await expect(menu).toBeHidden();
  }
  await more.click();
  await menu
    .getByRole("link", { name: "Violetto's voice", exact: true })
    .click();
  await expect(menu).toBeHidden();
  await more.click();
  await menu.getByRole("button", { name: "Close menu", exact: true }).click();
  await expect(more).toBeFocused();
  for (const width of [1440, 1251, 1024, 851]) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
    await expect(
      page
        .locator(".app-header")
        .getByRole("link", { name: "Course library", exact: true }),
    ).toBeVisible();
  }
});

test("phone Courses and More reach all study pages without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await onboard(page);
  const tabs = page.locator(".mobile-nav");
  await tabs.getByRole("link", { name: /Courses/ }).click();
  await expect(
    page.getByRole("heading", { name: "Course library.", exact: true }),
  ).toBeVisible();
  await tabs.getByRole("button", { name: /More/ }).click();
  const menu = page.getByRole("navigation", { name: "More navigation" });
  for (const name of [
    "JLPT",
    "Practice",
    "Media",
    "Progress",
    "Letters",
    "Beyond the course",
    "Dictionary",
    "Settings",
    "Violetto",
    "Postmark collection",
    "Violetto's voice",
  ])
    await expect(menu.getByRole("link", { name, exact: true })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({ path: "output/navigation-mobile.png" });
  await menu.getByRole("link", { name: "JLPT", exact: true }).click();
  await expect(page).toHaveURL(/#jlpt$/);
  await expect(menu).toBeHidden();
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await fits(page);
    for (const element of await tabs.locator("a,button").all()) {
      const box = await element.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await tabs.getByRole("button", { name: /More/ }).click();
  await menu.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Night post", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await tabs.getByRole("button", { name: /More/ }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
