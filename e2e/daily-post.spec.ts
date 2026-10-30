import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function onboard(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.locator(".week-post")).toBeVisible();
}

/** Study history `daysAgo` (0 = today) and five reading memories, written
 *  straight into the learner's IndexedDB, then Today reloads. */
async function seed(page: Page, daysAgo: number[]) {
  await page.evaluate(async (offsets) => {
    const open = indexedDB.open("shiori-japanese-v1");
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      open.onsuccess = () => resolve(open.result);
      open.onerror = reject;
    });
    const tx = db.transaction(["attempts", "memories"], "readwrite");
    const day = 864e5;
    const now = Date.now();
    const words = ["h-あ", "h-い", "h-う", "h-え", "h-お"];
    for (const o of offsets)
      words.forEach((itemId, i) =>
        tx.objectStore("attempts").put({
          id: `seed-${o}-${i}`,
          at: now - o * day - i * 6e4,
          itemId,
          skill: "reading",
          correct: true,
          support: "none",
          source: "lesson",
        }),
      );
    words.forEach((itemId, i) => {
      const due = now - (i - 2) * day;
      tx.objectStore("memories").put({
        id: `${itemId}:reading`,
        itemId,
        skill: "reading",
        due,
        successes: 1,
        failures: 0,
        card: {
          due: new Date(due),
          stability: 2,
          difficulty: 5,
          elapsed_days: 1,
          scheduled_days: 1,
          learning_steps: 0,
          reps: 1,
          lapses: 0,
          state: 2,
          last_review: new Date(now - 2 * day),
        },
      });
    });
    await new Promise((resolve) => (tx.oncomplete = resolve));
    db.close();
  }, daysAgo);
  await page.reload();
  await expect(page.locator(".week-post")).toBeVisible();
}

test("a new learner sets a daily reminder their own calendar delivers", async ({
  page,
}) => {
  await onboard(page);
  const week = page.locator(".week-post");
  await expect(
    week.getByRole("heading", { name: "The daily post" }),
  ).toBeVisible();
  await expect(week.locator(".week-slot")).toHaveCount(7);
  await expect(week.locator(".week-slot.is-today")).toHaveCount(1);
  await expect(week).toContainText(
    "Your first lesson earns this week’s first stamp.",
  );
  // No memories yet, so no two-minute shortcut.
  await expect(
    page.getByRole("button", { name: "Study for two minutes" }),
  ).toHaveCount(0);

  const reminder = page.locator(".today-post .post-reminder");
  await expect(
    reminder.getByRole("heading", {
      name: "When should Violetto write to you each day?",
    }),
  ).toBeVisible();
  await reminder.getByLabel("Reminder time").fill("07:45");
  const google = reminder.getByRole("link", { name: "Add to Google Calendar" });
  const href = new URL((await google.getAttribute("href"))!);
  expect(href.hostname).toBe("calendar.google.com");
  expect(href.searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
  expect(href.searchParams.get("dates")).toMatch(/T074500\//);

  await reminder.getByLabel("Reminder time").fill("");
  await expect(reminder.getByText("Choose a time first.")).toBeVisible();
  const blocked = reminder.getByRole("link", {
    name: "Add to Apple Calendar or Outlook",
  });
  await expect(blocked).toHaveAttribute("aria-disabled", "true");
  await expect(blocked).not.toHaveAttribute("href");
  await reminder.getByLabel("Reminder time").fill("07:45");
  await expect(reminder.getByText("Choose a time first.")).toHaveCount(0);
  const download = page.waitForEvent("download");
  await reminder
    .getByRole("link", {
      name: "Add to Apple Calendar or Outlook",
    })
    .click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("shiori-daily-post.ics");
  const ics = await readFile((await file.path())!, "utf8");
  expect(ics).toMatch(/DTSTART:\d{8}T074500\r\n/);
  expect(ics).toContain("RRULE:FREQ=DAILY");
  expect(ics).toContain("BEGIN:VALARM");

  await expect(page.locator(".today-post .post-reminder.is-set")).toContainText(
    "Your calendar reminds you at 7:45 AM each day.",
  );
  await page.reload();
  await expect(page.locator(".today-post .post-reminder.is-set")).toContainText(
    "7:45 AM",
  );

  // Settings holds the same reminder and the weekly goal.
  await page.goto("/#settings");
  await expect(
    page.getByRole("heading", { name: "The daily post" }),
  ).toBeVisible();
  await expect(
    page.locator(".settings-layout .post-reminder.is-set"),
  ).toContainText("7:45 AM");
  await page.getByLabel("Weekly study goal").selectOption("5");
  await page.goto("/#today");
  await expect(page.locator(".week-post select")).toHaveValue("5");
});

test("study days earn the month's stamp and count toward the week", async ({
  page,
}) => {
  await onboard(page);
  await seed(page, [0]);
  const today = page.locator(".week-slot.is-today");
  await expect(today).toHaveClass(/is-stamped/);
  await expect(today.locator(".sr-only")).toHaveText(/stamped$/);
  await expect(today.locator(".week-stamp")).toBeVisible();
  await expect(page.locator(".week-summary")).toContainText(
    /^1 of 4 days this week\./,
  );
  const stamps = await page.request.get("/post/season-stamps.webp");
  expect(stamps.ok()).toBe(true);
  // Five memories exist, so busy days have a two-minute way in.
  await page.getByRole("button", { name: "Study for two minutes" }).click();
  await expect(page.getByText("Mixed review")).toBeVisible();
});

test("coming back after days away starts small, without a backlog", async ({
  page,
}) => {
  await onboard(page);
  await seed(page, [5, 6]);
  await expect(
    page.getByRole("heading", { name: "Your desk is as you left it." }),
  ).toBeVisible();
  await expect(page.locator(".today-heading")).toContainText(
    "After 5 days away, begin with five familiar words.",
  );
  await expect(page.locator(".violetto-panel .mascot")).toHaveAttribute(
    "data-pose",
    "wave",
  );
  await expect(
    page.getByRole("button", { name: "Study for two minutes" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Begin lesson", exact: true }),
  ).toHaveClass(/secondary/);
  await page.getByRole("button", { name: "Begin with five words" }).click();
  await expect(page.getByText("Mixed review")).toBeVisible();
});
