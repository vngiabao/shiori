import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Intercept actual module requests; production offline behaviour has its own worker test.
test.use({ serviceWorkers: "block" });

async function enter(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
}

test("a first learner loads no advanced levels; opening N1 loads its prerequisites", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await enter(page);
  expect(
    requests.filter((url) => /level-n[1-4]\.ts|course-n[1-4]-/.test(url)),
  ).toEqual([]);
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n1");
  await expect(
    page.getByText("Put conditions behind a proposal", { exact: true }),
  ).toBeVisible();
  expect(
    requests.filter((url) => /level-n[1-4]\.ts|course-n[1-4]-/.test(url)),
  ).toEqual([]);
  await page
    .locator(".course-lessons > div")
    .filter({ hasText: "Put conditions behind a proposal" })
    .getByRole("button", { name: "Read", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "New words", exact: true }),
  ).toBeVisible();
  for (const level of ["n4", "n3", "n2", "n1"])
    expect(
      requests.some((url) =>
        new RegExp(`level-${level}\\.ts|course-${level}-`).test(url),
      ),
    ).toBe(true);
  await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  await page.goto("/#media?unit=n1-u05");
  await expect(
    page.getByText(
      "Lines saved here are tagged to n1-u05. This records practice, not comprehension.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("a failed course download keeps the library and navigation usable", async ({
  page,
}) => {
  await enter(page);
  await page.route(/level-n1\.ts|course-n1-/, (route) => route.abort());
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n1");
  await page
    .locator(".course-lessons > div")
    .filter({ hasText: "Put conditions behind a proposal" })
    .getByRole("button", { name: "Read", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "This lesson couldn’t load",
  );
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 1000 });
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
    await page.screenshot({
      path: `output/course-loading-error-${width}.png`,
      fullPage: false,
    });
  }
  await page.goto("/#today");
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("a failed import can recover after reload without resetting progress", async ({
  page,
}) => {
  await enter(page);
  await page.route(/level-n1\.ts|course-n1-/, (route) => route.abort());
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n1");
  const row = () =>
    page
      .locator(".course-lessons > div")
      .filter({ hasText: "Put conditions behind a proposal" });
  await row().getByRole("button", { name: "Read", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "This lesson couldn’t load",
  );
  await page.unroute(/level-n1\.ts|course-n1-/);
  await page
    .getByRole("button", { name: "Reload Shiori", exact: true })
    .click();
  await expect(page.getByLabel("Show lessons")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start without an account" }),
  ).toHaveCount(0);
  await page.getByLabel("Show lessons").selectOption("n1");
  await row().getByRole("button", { name: "Read", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "New words", exact: true }),
  ).toBeVisible();
});

test("leaving during a download cannot open the old lesson later", async ({
  page,
}) => {
  await enter(page);
  let release!: () => void;
  const paused = new Promise<void>((resolve) => (release = resolve));
  let intercepted!: () => void;
  const started = new Promise<void>((resolve) => (intercepted = resolve));
  await page.route(/level-n1\.ts|course-n1-/, async (route) => {
    intercepted();
    await paused;
    await route.continue();
  });
  await page.goto("/#library");
  await page.getByLabel("Show lessons").selectOption("n1");
  await page
    .locator(".course-lessons > div")
    .filter({ hasText: "Put conditions behind a proposal" })
    .getByRole("button", { name: "Read", exact: true })
    .click();
  await started;
  await page.goto("/#today");
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  release();
  await page.waitForResponse(/level-n1\.ts|course-n1-/);
  await expect(
    page.getByRole("button", { name: "Leave lesson", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
});

test("returning advanced progress loads its words without changing the saved record", async ({
  page,
}) => {
  await enter(page);
  const saved = {
    id: "n3-u12-lesson-1",
    at: 1720000000000,
    canDo: "Hear what the short forms contain",
  };
  await page.evaluate(async (record) => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("shiori-japanese-v1");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result,
          transaction = database.transaction("completions", "readwrite");
        transaction.objectStore("completions").put(record);
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }, saved);
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  expect(requests.some((url) => /level-n3\.ts|course-n3-/.test(url))).toBe(
    true,
  );
  expect(
    requests.some((url) => /level-n[12]\.ts|course-n[12]-/.test(url)),
  ).toBe(false);
  const record = await page.evaluate(
    async (id) =>
      new Promise<unknown>((resolve, reject) => {
        const request = indexedDB.open("shiori-japanese-v1");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const database = request.result,
            query = database
              .transaction("completions", "readonly")
              .objectStore("completions")
              .get(id);
          query.onsuccess = () => {
            database.close();
            resolve(query.result);
          };
          query.onerror = () => reject(query.error);
        };
      }),
    saved.id,
  );
  expect(record).toEqual(saved);
});
