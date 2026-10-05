import { chromium } from "@playwright/test";
import fs from "node:fs";
const dir = ".impeccable/review/shared-C";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const width of [1440, 768, 375, 320]) {
  for (const verdict of ["today", "correct", "wrong"]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await page.goto("http://127.0.0.1:5173");
    await page
      .getByRole("button", { name: /Start without an account/ })
      .click();
    await page.getByPlaceholder("Your first name").fill("Bao");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("checkbox", { name: "Start in quiet mode" }).check();
    await page
      .getByRole("button", { name: "Meet your first characters" })
      .click();
    if (verdict === "today") {
      await page.getByRole("button", { name: "Save and exit" }).click();
    } else {
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .locator(".choice")
        .filter({ hasText: verdict === "correct" ? "one" : "two" })
        .first()
        .click();
      await page.getByRole("button", { name: "Check", exact: true }).click();
      await page.locator(".verdict").waitFor();
    }
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator(".mascot img")
      .evaluateAll((imgs) =>
        Promise.all(imgs.map((img) => (img as HTMLImageElement).decode())),
      );
    await page.screenshot({
      path: `${dir}/kiyo-${verdict}-${width}.png`,
      fullPage: true,
    });
    await page.close();
  }
}
await browser.close();
console.log("Kiyo captured read-only in isolated guest browser contexts.");
