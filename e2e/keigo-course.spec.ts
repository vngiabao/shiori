import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const takes = JSON.parse(readFileSync("src/generated/dialogue-voices.json", "utf8"));
const manifest = JSON.parse(readFileSync("src/generated/audio.json", "utf8"));
const plain = (s: string) => s.replace(/\{([^|{}]+)\|[^{}]+\}/g, "$1");

for (const id of ["keigo-u01", "keigo-u02", "keigo-u03", "keigo-u04", "keigo-u05", "keigo-u06", "keigo-u07", "keigo-u08", "keigo-u09", "keigo-u10", "keigo-u11", "keigo-u12"]) {
  const pack = JSON.parse(readFileSync(`content/packs/${id}.json`, "utf8"));
  test(`${id} completes both conversations, contextual tasks and mapped feedback`, async ({ page }) => {
    test.setTimeout(120000);
    const failures: string[] = [];
    page.on("pageerror", e => failures.push(e.message));
    page.on("response", r => { if (r.url().includes("/audio/") && !r.ok()) failures.push(r.url()); });
    await page.addInitScript(() => {
      (window as any).played = [];
      HTMLMediaElement.prototype.play = function () {
        (window as any).played.push(new URL(this.src).pathname);
        queueMicrotask(() => this.dispatchEvent(new Event("ended")));
        return Promise.resolve();
      };
    });
    await page.goto("/");
    const lines = pack.dialogues.flatMap((d: any) => takes[d.id]);
    expect(lines).toHaveLength(pack.dialogues.reduce((n: number, d: any) => n + d.lines.length, 0));
    expect(await page.evaluate(async (audio: any[]) => {
      const ctx = new AudioContext(), errors: string[] = [];
      for (const a of audio) {
        try {
          const r = await fetch(a.url);
          if (!r.ok) throw new Error(String(r.status));
          const b = await ctx.decodeAudioData(await r.arrayBuffer());
          if (b.numberOfChannels !== 1 || Math.abs(b.duration - a.seconds) > .001) throw new Error("Invalid WAV");
        } catch { errors.push(a.url); }
      }
      await ctx.close(); return errors;
    }, lines)).toEqual([]);
    await page.getByRole("button", { name: "Start without an account" }).click();
    await page.getByRole("button", { name: "Open my first letter" }).click();
    await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
    await page.goto("/#library");
    await page.getByLabel("Show lessons").selectOption("keigo");
    await page.locator(".course-lessons > div").filter({ hasText: pack.lessons[0].title })
      .getByRole("button", { name: "Read", exact: true }).click();
    const counter = page.locator(".lesson-top > span").last();
    await expect(page.getByRole("button", { name: "I’ve met these" })).toBeVisible();
    while (await page.getByRole("button", { name: "I’ve met these" }).count()) {
      const before = await counter.textContent();
      await page.getByRole("button", { name: "I’ve met these" }).click();
      await expect(counter).not.toHaveText(before!);
    }
    await expect(page.getByRole("heading", { name: "Notice how this works." })).toBeVisible();
    for (const note of pack.grammar) {
      const section = page.locator("section.reading-stage").filter({ has: page.getByRole("heading", { name: note.title, exact: true }) });
      await expect(section.getByText(note.explanation, { exact: true })).toBeVisible();
      const buttons = section.getByRole("button");
      expect(await buttons.count()).toBe(note.examples.length);
      for (let i = 0; i < note.examples.length; i++) {
        await buttons.nth(i).click();
        await expect.poll(() => page.evaluate(() => (window as any).played))
          .toContain(manifest[plain(note.examples[i].ja)]);
      }
    }
    await page.getByRole("button", { name: "Hear it in context" }).click();
    const ordered = [...pack.dialogues.flatMap((d: any) => pack.exercises.filter((x: any) => x.dialogue === d.id)),
      ...pack.exercises.filter((x: any) => !x.dialogue)];
    let sceneIndex = 0, exerciseIndex = 0;
    for (let guard = 0; guard < 45; guard++) {
      if (await page.locator(".completion").count()) break;
      const heading = await page.locator(".lesson-main h1").textContent();
      if (heading === "Listen to the conversation.") {
        const d = pack.dialogues[sceneIndex++];
        await expect(page.locator(".lesson-main .task-context").first()).toContainText(d.scene);
        await page.getByRole("button", { name: "Play again", exact: true }).click();
        await expect.poll(() => page.evaluate(() => (window as any).played), { timeout: 14000 })
          .toEqual(expect.arrayContaining(takes[d.id].map((a: any) => a.url)));
        await page.getByRole("button", { name: "Answer questions", exact: true }).click();
        continue;
      }
      const check = heading === "What did you hear?" || heading === "What does it mean?";
      const ex = check ? null : ordered[exerciseIndex++];
      if (ex) {
        if (["dialogue", "choice", "register", "speaker", "compare"].includes(ex.type))
          await expect(page.locator(".lesson-main h1")).toHaveText(ex.prompt);
        if (ex.type === "order") {
          for (const tile of ex.tiles) {
            const options = page.locator(".order-pool .order-tile:not(:disabled)");
            const texts = await options.evaluateAll(nodes => nodes.map(el => {
              const copy = el.cloneNode(true) as HTMLElement; copy.querySelectorAll("rt").forEach(r => r.remove()); return copy.textContent;
            }));
            const index = texts.indexOf(plain(tile)); expect(index).toBeGreaterThanOrEqual(0);
            await options.nth(index).click();
          }
        } else await page.locator(".lesson-main .answer-option").nth(ex.answer).click();
      } else await page.locator(".lesson-main .answer-option").first().click();
      await page.getByRole("button", { name: /Check answer/ }).click();
      await expect(page.locator(".verdict-bar")).toBeVisible();
      if (ex) {
        await expect(page.locator(".verdict-bar")).toContainText("Right.");
        const full = ex.type === "cloze" ? ex.line.replace("＿＿", ex.options[ex.answer])
          : ex.type === "order" ? ex.tiles.join("") : ex.type === "reply" ? ex.line : null;
        if (full) {
          await page.locator(".verdict-bar").getByRole("button", { name: "Hear it", exact: true }).click();
          await expect.poll(() => page.evaluate(() => (window as any).played)).toContain(manifest[plain(full)]);
        }
      }
      const before = await counter.textContent();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await expect.poll(async () => !!(await page.locator(".completion").count()) || await counter.textContent() !== before).toBe(true);
    }
    expect(sceneIndex).toBe(2); expect(exerciseIndex).toBe(pack.exercises.length);
    await expect(page.getByRole("heading", { name: "Lesson delivered." })).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(0);
    expect(failures).toEqual([]);
    for (const [width, theme] of [[1440, "light"], [375, "light"], [1440, "dark"], [375, "dark"]] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/#settings");
      await page.getByRole("button", { name: theme === "dark" ? "Night post" : "Morning letter" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await page.goto("/#read"); await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await page.getByRole("button", { name: "Texts", exact: false }).click();
      const title = pack.readings[0].title;
      const region = page.getByRole("region", { name: title, exact: true });
      if (!(await region.isVisible())) await page.getByText(title, { exact: true }).first().click();
      await expect(region).toBeVisible(); await expect(region.locator("ruby")).toHaveCount(0);
      await region.getByRole("button", { name: /furigana/i }).click();
      expect(await region.locator("ruby").count()).toBeGreaterThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
      await region.scrollIntoViewIfNeeded();
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await region.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 110));
      await page.screenshot({ path: `output/${id}-reading-viewport-${theme}-${width}.png` });
      await page.screenshot({ path: `output/${id}-reading-detail-${theme}-${width}.png`, fullPage: true });
      await region.screenshot({ path: `output/${id}-document-${theme}-${width}.png` });
    }
  });
}
