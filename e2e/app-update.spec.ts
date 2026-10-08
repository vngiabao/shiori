import { test, expect } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { AddressInfo } from "node:net";
import AxeBuilder from "@axe-core/playwright";

// Serve the built app and its real Workbox worker, changing only a release
// comment to simulate a second deployment. No mocked registration or database.
let server: Server;
let origin: string;
let revision = 1;
test.beforeAll(async () => {
  const root = path.resolve("dist");
  server = createServer((request, response) => {
    const name = new URL(request.url!, "http://localhost").pathname;
    const file = path.resolve(
      root,
      "." + (name === "/" ? "/index.html" : name),
    );
    if (!file.startsWith(root + path.sep) || !existsSync(file)) {
      response.writeHead(404).end();
      return;
    }
    const mime: Record<string, string> = {
      ".js": "application/javascript",
      ".html": "text/html",
      ".css": "text/css",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".wav": "audio/wav",
      ".png": "image/png",
      ".woff2": "font/woff2",
    };
    response.setHeader(
      "Content-Type",
      mime[path.extname(file)] ?? "application/octet-stream",
    );
    response.setHeader("Cache-Control", "no-store");
    if (name === "/sw.js")
      response.end(
        readFileSync(file, "utf8") + `\n// test release ${revision}\n`,
      );
    else response.end(readFileSync(file));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
test.afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test("an installed update waits until study ends and explicit refresh preserves the profile and audio", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto(origin);
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page
    .getByLabel("What should Violetto call you?")
    .fill("Returning Reader");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const manifest = JSON.parse(readFileSync("src/generated/audio.json", "utf8"));
  const audio = manifest["あ"] as string;
  await page.evaluate(async (url) => {
    const response = await fetch(url);
    const cache = await caches.open("shiori-audio");
    await cache.put(url, response);
    (window as any).updateDocumentMarker = "original document";
  }, audio);
  await page.getByRole("button", { name: "Begin lesson", exact: true }).click();
  revision++;
  await page.evaluate(async () => {
    await (await navigator.serviceWorker.getRegistration())!.update();
  });
  await page.waitForFunction(async () =>
    Boolean((await navigator.serviceWorker.getRegistration())?.waiting),
  );
  expect(await page.evaluate(() => (window as any).updateDocumentMarker)).toBe(
    "original document",
  );
  await expect(
    page.getByRole("button", { name: "Update Shiori", exact: true }),
  ).toBeHidden();
  await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Update Shiori", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "output/shiori-update-desktop.png" });
  await page.setViewportSize({ width: 375, height: 900 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(375);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({ path: "output/shiori-update-mobile.png" });
  await page
    .getByRole("button", { name: "Update Shiori", exact: true })
    .click();
  // The same Today content is present before and after refresh; wait for the
  // document replacement rather than treating an existing heading as proof.
  await page.waitForFunction(
    () => (window as any).updateDocumentMarker === undefined,
  );
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await expect(page.getByText(/Welcome, Returning Reader/)).toBeVisible();
  expect(
    await page.evaluate(() => (window as any).updateDocumentMarker),
  ).toBeUndefined();
  await expect(
    page.getByRole("button", { name: "Update Shiori", exact: true }),
  ).toBeHidden();
  expect(
    await page.evaluate(
      async (url) =>
        Boolean(await (await caches.open("shiori-audio")).match(url)),
      audio,
    ),
  ).toBe(true);
  await page.context().setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  const duration = await page.evaluate(async (url) => {
    const audio = new AudioContext();
    const buffer = await audio.decodeAudioData(
      await (await fetch(url)).arrayBuffer(),
    );
    await audio.close();
    return buffer.duration;
  }, audio);
  expect(duration).toBeGreaterThan(0.3);
});
