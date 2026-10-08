import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
const takes = JSON.parse(
  readFileSync("src/generated/dialogue-voices.json", "utf8"),
) as Record<string, { url: string; seconds: number }[]>;
const cast = JSON.parse(
  readFileSync("src/generated/cast-auditions.json", "utf8"),
) as { speaker: string; url: string }[];

test("every course character has an audition that serves and decodes", async ({
  page,
}) => {
  await page.goto("/");
  const failures = await page.evaluate(async (takes) => {
    const ctx = new AudioContext(),
      failures: string[] = [];
    for (const take of takes) {
      try {
        const response = await fetch(take.url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        if (audio.numberOfChannels !== 1 || audio.duration <= 1)
          throw new Error("Invalid audition");
      } catch {
        failures.push(take.speaker);
      }
    }
    await ctx.close();
    return failures;
  }, cast);
  expect(failures).toEqual([]);
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#voice");
  await page.getByLabel("Choose a character").selectOption("Kenta");
  const section = page.getByRole("region", { name: "Course cast auditions" });
  await expect(section.getByText(/Ren's younger brother/)).toBeVisible();
  await section.getByRole("button", { name: "Hear this character" }).click();
  await expect(
    page.getByText("Could not play this take. Try again."),
  ).toHaveCount(0);
});

test("every speaker take is served and decodes", async ({ page }) => {
  test.setTimeout(300000);
  await page.goto("/");
  const failed = await page.evaluate(async (lines) => {
    const ctx = new AudioContext();
    const failures: string[] = [];
    let next = 0;
    await Promise.all(
      Array.from({ length: 8 }, async () => {
        while (next < lines.length) {
          const line = lines[next++];
          try {
            const response = await fetch(line.url);
            if (!response.ok) throw new Error(String(response.status));
            const audio = await ctx.decodeAudioData(
              await response.arrayBuffer(),
            );
            if (
              audio.numberOfChannels !== 1 ||
              Math.abs(audio.duration - line.seconds) > 0.001
            )
              throw new Error("Invalid audio");
          } catch {
            failures.push(line.url);
          }
        }
      }),
    );
    await ctx.close();
    return failures;
  }, Object.values(takes).flat());
  expect(failed).toEqual([]);
});

test("lesson scenes and Watch samples select the speaker-specific clips", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).scenePlayed = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).scenePlayed.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "New words" })).toBeVisible();
  await page.evaluate(() => {
    (window as any).scenePlayed = [];
  });
  const counter = page.locator(".lesson-top > span").last();
  while (await page.getByRole("button", { name: "I’ve met these" }).count()) {
    const before = await counter.textContent();
    await page.getByRole("button", { name: "I’ve met these" }).click();
    await expect(counter).not.toHaveText(before!);
  }
  await expect(
    page.getByRole("button", { name: "Answer questions" }),
  ).toBeEnabled();
  // Development StrictMode may start then cancel the first line on remount.
  const played = await page.evaluate(
    () => (window as any).scenePlayed as string[],
  );
  expect(played.slice(-takes["d-names"].length)).toEqual(
    takes["d-names"].map((line) => line.url),
  );
  await page.goto("/#media");
  await page
    .getByRole("button", {
      name: "Practise the workflow on the course conversations",
    })
    .click();
  await page
    .getByRole("region", { name: "Lines", exact: true })
    .getByRole("button")
    .first()
    .click();
  expect(await page.evaluate(() => (window as any).scenePlayed.at(-1))).toBe(
    takes["d-morning"][0].url,
  );
  await expect(
    page.getByText("This line could not play. Please try again."),
  ).toHaveCount(0);
});
