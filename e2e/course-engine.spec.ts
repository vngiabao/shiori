import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("N4 grouping, reading support and two-scene lesson work at desktop and mobile sizes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", {name:"Start without an account"}).click();
  await page.getByLabel("What should Violetto call you?").fill("Bao");
  await page.getByRole("button", {name:"Open my first letter"}).click();
  await expect(page.getByRole("heading", {name:"Your next letter is ready."})).toBeVisible();
  for (const width of [1440, 320]) {
    await page.setViewportSize({width,height:1000});
    await page.goto("/#today");
    await expect(page.getByRole("heading", {name:"Your next letter is ready."})).toBeVisible();
    await page.goto("/#read");
    await page.getByRole("button", {name:"Texts",exact:false}).click();
    await page.getByText("Café recruitment notice", {exact:true}).first().click();
    const region=page.getByRole("region", {name:"Café recruitment notice"});
    await expect(region).toBeVisible();
    await expect(region.locator("ruby")).toHaveCount(0);
    await region.getByRole("button", {name:/furigana/}).click();
    expect(await region.locator("ruby").count()).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
    await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0,0); });
    await page.screenshot({path:`.impeccable/review/course-reading-${width}.png`,fullPage:true});
    await page.getByText("Choosing a coastal bus",{exact:true}).first().click();
    const guide=page.getByRole("region",{name:"Choosing a coastal bus"});
    await expect(guide.getByRole("table")).toBeVisible();
    await expect(guide.getByRole("row")).toHaveCount(4);
    await expect(guide.getByRole("cell",{name:"A",exact:true})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
    await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0,0); });
    await page.screenshot({path:`.impeccable/review/course-table-${width}.png`,fullPage:true});
  }
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n4");
  await page.locator(".course-lessons > div").filter({hasText:"Can you work here?"}).getByRole("button",{name:"Read",exact:true}).click();
  for (let i=0;i<5;i++) await page.getByRole("button",{name:"I’ve met these"}).click();
  await expect(page.getByRole("heading",{name:"Notice how this works."})).toBeVisible();
  await page.getByRole("button",{name:"Hear it in context"}).click();
  await expect(page.getByRole("heading",{name:"Listen to the conversation."})).toBeVisible();
  await expect(page.getByText("You have read the café notice.",{exact:false})).toBeVisible();
});
