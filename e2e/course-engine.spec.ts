import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

test("a contextual register task displays its sentence, plays its mapped audio and gives feedback", async ({page}) => {
  test.setTimeout(90000);
  const pack=JSON.parse(readFileSync("content/packs/n4-u09.json","utf8"));
  const ex=pack.exercises.find((x: {id:string}) => x.id === "n4-u09-x-contract");
  const audio=JSON.parse(readFileSync("src/generated/audio.json","utf8"));
  const plain=(s:string) => s.replace(/\{([^|{}]+)\|[^|{}]+\}/g,"$1");
  await page.addInitScript(() => {
    (window as any).played=[];
    HTMLMediaElement.prototype.play=function () {
      (window as any).played.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.setViewportSize({width:375,height:900});
  await page.goto("/");
  await page.getByRole("button",{name:"Start without an account"}).click();
  await page.getByRole("button",{name:"Open my first letter"}).click();
  await expect(page.getByRole("heading",{name:"Your next letter is ready."})).toBeVisible();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n4");
  await page.locator(".course-lessons > div").filter({hasText:"A changed meeting room"}).getByRole("button",{name:"Read",exact:true}).click();
  const counter=page.locator(".lesson-top > span").last();
  let reached=false;
  for (let guard=0;guard<60;guard++) {
    const target=page.getByRole("heading",{name:ex.prompt,exact:true});
    if (await target.count()) { reached=true; break; }
    const before=await counter.textContent();
    const meet=page.getByRole("button",{name:"I’ve met these"});
    const grammar=page.getByRole("button",{name:"Hear it in context"});
    const scene=page.getByRole("button",{name:"Answer questions"});
    if (await meet.count()) await meet.click();
    else if (await grammar.count()) await grammar.click();
    else if (await scene.count()) await scene.click();
    else {
      const tiles=page.locator(".order-pool .order-tile:enabled");
      if (await tiles.count()) while (await tiles.count()) await tiles.first().click();
      else await page.locator(".lesson-main .answer-option").first().click();
      await page.getByRole("button",{name:/Check answer/}).click();
      await expect(page.locator(".verdict-bar")).toBeVisible();
      await page.getByRole("button",{name:"Continue",exact:true}).click();
    }
    await expect(counter).not.toHaveText(before!);
  }
  expect(reached).toBe(true);
  await expect(page.locator(".task-context")).toContainText("Kenta casually");
  expect(await page.locator(".reading-line").evaluate(el => {const copy=el.cloneNode(true) as HTMLElement; copy.querySelectorAll("rt,rp").forEach(n => n.remove()); return copy.textContent;})).toBe(plain(ex.line));
  await page.getByRole("button",{name:"Hear the sentence"}).click();
  await expect.poll(() => page.evaluate(() => (window as any).played.at(-1))).toBe(audio[plain(ex.line)]);
  await page.locator(".lesson-main .answer-option").nth(ex.answer).click();
  await page.getByRole("button",{name:/Check answer/}).click();
  await expect(page.locator(".verdict-bar")).toContainText("Right.");
  await expect(page.locator(".verdict-bar")).toContainText("書いとく");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

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
