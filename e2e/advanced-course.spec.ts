import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const takes = JSON.parse(readFileSync("src/generated/dialogue-voices.json", "utf8"));

for (const unit of [
  {
    id: "n3-u01", reading: "A week of changes and choices",
    lessons: [
      ["A change you can describe", "n3-u01-d-vlog", "An ability or routine has changed", "A deliberate goal: ために versus ように"],
      ["Choose a purpose and a method", "n3-u01-d-purpose", "A deliberate goal: ために versus ように", "An ability or routine has changed"],
    ],
  },
  {
    id: "n3-u02", reading: "Two calls and a short break",
    lessons: [
      ["Before, during, and just after", "n3-u02-d-phone", "Locate an action in three stages", "Act before a useful state changes"],
      ["Use the time while it lasts", "n3-u02-d-window", "Act before a useful state changes", "Locate an action in three stages"],
    ],
  },
  {
    id: "n3-u03", reading: "A message separating impressions and facts",
    lessons: [
      ["What you saw, and what you heard", "n3-u03-d-preview", "State what was reported, and by whom", "A perceived trait, not an identity"],
      ["A likeness is not an identity", "n3-u03-d-costume", "A perceived trait, not an identity", "State what was reported, and by whom"],
    ],
  },
  {
    id: "n3-u04", reading: "From an expectation to a checked record",
    lessons: [
      ["Expectation, conviction and a checked fact", "n3-u04-d-note", "An expectation with grounds", "Recommend a responsible action"],
      ["Explain the result; choose the responsible action", "n3-u04-d-record", "Recommend a responsible action", "An expectation with grounds"],
    ],
  },
  {
    id: "n3-u05", reading: "Three opinions are not everybody’s opinion",
    lessons: [
      ["Topic, target and two viewpoints", "n3-u05-d-opinions", "Name the topic of a discussion", "Read what によって connects"],
      ["A survey has a scope", "n3-u05-d-survey", "Read what によって connects", "Name the topic of a discussion"],
    ],
  },
  {
    id: "n3-u06", reading: "Decided yesterday; carried out last night",
    lessons: [
      ["An arrangement and a personal choice", "n3-u06-d-meeting", "A decision is not its completed action", "No need is not a prohibition"],
      ["No need, and requested advice", "n3-u06-d-help", "No need is not a prohibition", "A decision is not its completed action"],
    ],
  },
  {
    id: "n3-u07", reading: "Before travel; after arrival",
    lessons: [
      ["A route and its conditions", "n3-u07-d-route", "Describe a regular result or a discovery", "Advice based on a stated plan"],
      ["Preparation before; a message after", "n3-u07-d-plan", "Advice based on a stated plan", "Describe a regular result or a discovery"],
    ],
  },
  {
    id: "n3-u08", reading: "What the screen did not tell me",
    lessons: [
      ["A fact and an unmet expectation", "n3-u08-d-screen", "An outcome that stays the same", "Recognise blame; choose how to repair it"],
      ["Recognise blame; repair the conversation", "n3-u08-d-repair", "Recognise blame; choose how to repair it", "An outcome that stays the same"],
    ],
  },
  {
    id: "n3-u09", reading: "Service restored; the session still starts at four",
    lessons: [
      ["A reason, a thank-you and an accusation", "n3-u09-d-route", "Credit a benefit; notice sarcasm", "Read ため as cause or purpose in context"],
      ["A report keeps what is still unknown", "n3-u09-d-report", "Read ため as cause or purpose in context", "Credit a benefit; notice sarcasm"],
    ],
  },
  {
    id: "n3-u10", reading: "A whole session; three days of omissions",
    lessons: [
      ["A span, an interruption and each update", "n3-u10-d-review", "Track what happens each time", "A recurring tendency is not an identity"],
      ["A repeated habit and a slight state", "n3-u10-d-habit", "A recurring tendency is not an identity", "Track what happens each time"],
    ],
  },
]) test(`${unit.id} lessons bind grammar and scenes, recordings decode, reading support and saved themes work`, async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    (window as any).played = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).played.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.goto("/");
  const audioFailures = await page.evaluate(async (lines: { url: string; seconds: number }[]) => {
    const ctx = new AudioContext(), failed: string[] = [];
    for (const line of lines) {
      try {
        const response = await fetch(line.url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        if (audio.numberOfChannels !== 1 || Math.abs(audio.duration - line.seconds) > .001) throw new Error("Invalid recording");
      } catch { failed.push(line.url); }
    }
    await ctx.close(); return failed;
  }, unit.lessons.flatMap(([, scene]) => takes[scene]));
  expect(audioFailures).toEqual([]);
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
  for (const [title, scene, allowed, absent] of unit.lessons) {
    await page.goto("/#library");
    await page.getByLabel("Show lessons").selectOption("n3");
    await page.locator(".course-lessons > div").filter({ hasText: title }).getByRole("button", { name: "Read", exact: true }).click();
    const counter = page.locator(".lesson-top > span").last();
    for (let step = 0; step < 16; step++) {
      const meet = page.getByRole("button", { name: "I’ve met these" });
      if (!(await meet.count())) break;
      const before = await counter.textContent();
      await meet.click();
      await expect(counter).not.toHaveText(before!);
    }
    await expect(page.getByRole("heading", { name: "Notice how this works." })).toBeVisible();
    await expect(page.getByText(allowed, { exact: true })).toBeVisible();
    await expect(page.getByText(absent, { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Hear it in context" }).click();
    await expect(page.getByRole("heading", { name: "Listen to the conversation." })).toBeVisible();
    await page.getByRole("button", { name: "Play again", exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as any).played)).toEqual(expect.arrayContaining(takes[scene].map((t: { url: string }) => t.url)));
    await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  }
  for (const [width, theme] of [[1440, "light"], [375, "light"], [1440, "dark"], [375, "dark"]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#settings");
    await page.getByRole("button", { name: theme === "dark" ? "Night post" : "Morning letter" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.goto("/#read");
    await page.reload();
    await page.getByRole("button", { name: "Texts", exact: false }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const region = page.getByRole("region", { name: unit.reading });
    if (!(await region.isVisible())) await page.getByText(unit.reading, { exact: true }).first().click();
    await expect(region).toBeVisible();
    await expect(region.locator("ruby")).toHaveCount(0);
    await region.getByRole("button", { name: /furigana/i }).click();
    expect(await region.locator("ruby").count()).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.locator("h1").click();
    await page.screenshot({ path: `output/${unit.id}-reading-${theme}-${width}.png`, fullPage: true });
  }
});
