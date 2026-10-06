import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

test("vocabulary deck examples play mapped Clear audio and hide before retrieval", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n5");
  const deck = page.locator(".course-unit").filter({
    has: page.getByRole("heading", {
      name: "N5 vocabulary · Deck 1",
      exact: true,
    }),
  });
  await deck.getByRole("button", { name: "Read", exact: true }).first().click();
  await expect(
    page.getByRole("heading", { name: "New words", exact: true }),
  ).toBeVisible();
  const example = page.locator(".word-example").first();
  await example.locator("summary").click();
  await expect(
    example.getByText("I will meet my friend tomorrow."),
  ).toBeVisible();
  const mapping = JSON.parse(
    fs.readFileSync("src/generated/audio.json", "utf8"),
  );
  const expected = mapping["明日、友達に会います。"];
  expect(expected).toBeTruthy();
  const response = await page.request.get(expected);
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 4).toString()).toBe("RIFF");
  const played = page.waitForResponse(
    (r) => new URL(r.url()).pathname === expected,
  );
  await example.getByRole("button", { name: "Hear the example" }).click();
  expect([200, 206]).toContain((await played).status());
  await expect(
    example.getByRole("button", { name: "Hear the example" }),
  ).toBeEnabled();
  const words = fs
    .readdirSync("content/packs")
    .filter((name) => /^n5-vocab-\d+\.json$/.test(name))
    .flatMap(
      (name) =>
        JSON.parse(fs.readFileSync(`content/packs/${name}`, "utf8")).words,
    ) as { text: string; kana: string; example: string }[];
  const urls = [
    ...new Set(
      words.flatMap((w) => [
        mapping[w.text],
        mapping[w.kana],
        mapping[w.example],
      ]),
    ),
  ];
  expect(
    await page.evaluate(async (urls) => {
      const context = new AudioContext();
      try {
        for (const url of urls) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Missing deck audio: ${url}`);
          const decoded = await context.decodeAudioData(
            await response.arrayBuffer(),
          );
          if (
            decoded.numberOfChannels !== 1 ||
            decoded.sampleRate !== context.sampleRate ||
            decoded.duration <= 0
          )
            throw new Error(`Invalid deck audio: ${url}`);
        }
        return urls.length;
      } finally {
        await context.close();
      }
    }, urls),
  ).toBe(urls.length);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        await Promise.all([...document.images].map((img) => img.decode()));
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      });
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
      if ([375, 1440].includes(width))
        await page.screenshot({
          path: `.impeccable/review/deck-example-${theme}-${width}.png`,
          fullPage: true,
        });
    }
  }
  await page.getByRole("button", { name: "I’ve met these" }).click();
  await page.getByRole("button", { name: "I’ve met these" }).click();
  await expect(
    page.getByRole("heading", { name: "New words", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".word-example")).toHaveCount(0);
  await expect(page.locator(".answer-option")).toHaveCount(4);
});
