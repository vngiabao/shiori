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
  await page.getByRole("button", { name: "Leave lesson" }).click();
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n4");
  await page
    .locator(".course-unit")
    .filter({
      has: page.getByRole("heading", {
        name: "N4 vocabulary · Deck 1",
        exact: true,
      }),
    })
    .getByRole("button", { name: "Read", exact: true })
    .first()
    .click();
  await page.setViewportSize({ width: 375, height: 1000 });
  const n4Example = page.locator(".word-example").first();
  await n4Example.locator("summary").click();
  await expect(
    n4Example.getByText("I accidentally stepped on someone's foot."),
  ).toBeVisible();
  const n4Audio = mapping["足を踏んでしまいました。"];
  expect(n4Audio).toBeTruthy();
  const n4Played = page.waitForResponse(
    (r) => new URL(r.url()).pathname === n4Audio,
  );
  await n4Example.getByRole("button", { name: "Hear the example" }).click();
  expect([200, 206]).toContain((await n4Played).status());
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
  await page.getByRole("button", { name: "Leave lesson" }).click();
  for (const [number, sentence, meaning] of [
    [
      1,
      "この教室では、最初にお茶の作法を学びます。",
      "In this class, we first learn tea etiquette.",
    ],
    [
      2,
      "夏になると、冷たい飲み物の需要が増えます。",
      "Demand for cold drinks increases in summer.",
    ],
    [
      3,
      "会場に着いたとき、受付は既に始まっていました。",
      "Reception had already started when I arrived at the venue.",
    ],
    [
      4,
      "彼が同じ映画を好きだと知って、意外に思いました。",
      "I was surprised to learn that he liked the same film.",
    ],
    [
      5,
      "犬がボールを追って走りました。",
      "The dog ran after the ball.",
    ],
  ] as const) {
    await page.goto("/#library");
    await page.getByLabel("Show lessons").selectOption("n3");
    await page
      .locator(".course-unit")
      .filter({
        has: page.getByRole("heading", {
          name: `N3 vocabulary · Deck ${number}`,
          exact: true,
        }),
      })
      .getByRole("button", { name: "Read", exact: true })
      .first()
      .click();
    const n3Example = page.locator(".word-example").first();
    await n3Example.locator("summary").click();
    await expect(n3Example.getByText(meaning, { exact: true })).toBeVisible();
    const url = mapping[sentence];
    expect(url).toBeTruthy();
    const response = page.waitForResponse(
      (r) => new URL(r.url()).pathname === url,
    );
    await n3Example.getByRole("button", { name: "Hear the example" }).click();
    expect([200, 206]).toContain((await response).status());
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "I’ve met these" }).click();
    await page.getByRole("button", { name: "I’ve met these" }).click();
    await expect(page.locator(".word-example")).toHaveCount(0);
    await expect(page.locator(".answer-option")).toHaveCount(4);
    await page.getByRole("button", { name: "Leave lesson" }).click();
  }
});

// Each installed deck gets a bounded playback check, rather than one growing
// all-course evaluate that eventually times out before reporting the bad deck.
for (const name of fs
  .readdirSync("content/packs")
  .filter((name) => /^n[1-5]-vocab-\d+\.json$/.test(name))) {
  test(`${name} words and examples all decode from mapped Clear recordings`, async ({
    page,
  }) => {
    test.setTimeout(90000);
    const mapping = JSON.parse(
      fs.readFileSync("src/generated/audio.json", "utf8"),
    );
    const words = JSON.parse(fs.readFileSync(`content/packs/${name}`, "utf8"))
      .words as { text: string; kana: string; example: string }[];
    const urls: string[] = [
      ...new Set<string>(
        words.flatMap((w) => [
          mapping[w.text],
          mapping[w.kana],
          mapping[w.example],
        ]),
      ),
    ];
    expect(
      urls.every((url) => typeof url === "string" && url.startsWith("/audio/")),
    ).toBe(true);
    await page.goto("/");
    expect(
      await page.evaluate(async (urls) => {
        const context = new AudioContext();
        try {
          let next = 0;
          await Promise.all(
            Array.from({ length: Math.min(8, urls.length) }, async () => {
              while (next < urls.length) {
                const url = urls[next++];
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
            }),
          );
          return urls.length;
        } finally {
          await context.close();
        }
      }, urls),
    ).toBe(urls.length);
  });
}
