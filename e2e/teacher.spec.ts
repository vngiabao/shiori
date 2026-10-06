import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const teacher = JSON.parse(
  readFileSync("src/generated/violetto-teacher.json", "utf8"),
) as {
  id: string;
  text: string;
  category: string;
  pose: string;
  url: string;
  seconds: number;
}[];

test("teacher feedback text and replay match the selected recording", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).teacherPlayed = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).teacherPlayed.push(this.src);
      return Promise.resolve();
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  const shown: string[] = [];
  for (const [i, answer] of ["a", "い"].entries()) {
    await page.getByRole("button", { name: "Ready to try" }).click();
    await page
      .locator(".answer-option")
      .filter({ hasText: new RegExp(`^[1-4]${answer}$`) })
      .click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    const bubble = page.locator(".violetto-bubble");
    await expect(bubble).toBeVisible();
    const text = await bubble.locator(".bubble-toggle span").innerText();
    const matching = teacher.find((line) => line.text === text);
    expect(matching?.category).toBe("correct");
    shown.push(text);
    const url = await page.evaluate(
      () => (window as any).teacherPlayed.at(-1) as string,
    );
    expect(new URL(url).pathname).toBe(matching!.url);
    await bubble
      .getByRole("button", { name: "Hear Violetto", exact: true })
      .click();
    expect(
      await page.evaluate(() => (window as any).teacherPlayed.at(-1)),
    ).toBe(url);
    await expect(page.locator(".lesson-companion .mascot")).toHaveAttribute(
      "data-pose",
      matching!.pose,
    );
    if (i === 0)
      await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  expect(shown[0]).not.toBe(shown[1]);
  await expect(page.locator(".audio-error")).toHaveCount(0);
});

test("all 100 teacher recordings are served and decoded by the browser", async ({
  page,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async (lines) => {
    const ctx = new AudioContext();
    const failed: string[] = [];
    for (const line of lines) {
      try {
        const response = await fetch(line.url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        if (
          audio.numberOfChannels !== 1 ||
          Math.abs(audio.duration - line.seconds) > 0.001
        )
          throw new Error("Invalid recording");
      } catch {
        failed.push(line.id);
      }
    }
    await ctx.close();
    return failed;
  }, teacher);
  expect(result).toEqual([]);
});
