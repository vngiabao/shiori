import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const srt = [
  "1\n00:00:00,000 --> 00:00:00,400\nおはようございます。",
  "2\n00:00:00,400 --> 00:00:00,800\nいってきます。",
].join("\n\n");

test("Watch steps from Japanese subtitles to peeks and keeps saved lines", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Bao");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#media");
  await page.getByLabel("Video or audio").setInputFiles({
    name: "episode-01.wav",
    mimeType: "audio/wav",
    buffer: fs.readFileSync("public/audio/vv2-005c4f74d5980301507a.wav"),
  });
  await page.getByLabel("Japanese subtitles").setInputFiles({
    name: "episode-01.ja.srt",
    mimeType: "application/x-subrip",
    buffer: Buffer.from(srt),
  });
  const lines = page.getByRole("region", { name: "Lines" });
  await expect(lines.getByText("いってきます。")).toBeVisible();
  // Peek rung: lines hide, and each peek is counted.
  await page.getByLabel(/Peek when stuck/).check();
  await expect(lines.getByText("いってきます。")).toHaveCount(0);
  await lines.getByRole("button").first().click();
  await page.getByRole("button", { name: /Show this line/ }).click();
  await expect(page.locator(".watch-line")).toContainText(
    "おはようございます。",
  );
  await lines.getByRole("button").nth(1).click();
  await page.getByRole("button", { name: /Save line/ }).click();
  await expect(
    page
      .getByRole("region", { name: "Saved lines" })
      .getByText("いってきます。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Finish session" }).click();
  await expect(page.getByRole("status").first()).toContainText(
    "you opened 2 of 2 lines",
  );
  await expect(page.getByText("Your sessions with this clip")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
