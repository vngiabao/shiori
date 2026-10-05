import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ channel: 'chrome' });
const root = 'http://127.0.0.1:5174';
for (const width of [1440, 375, 320]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(root);
  await page.getByRole('button', { name: 'Start without an account' }).waitFor();
  for (const state of ['welcome', 'today', 'night']) {
    if (state === 'today') {
      await page.getByRole('button', { name: 'Start without an account' }).click();
      await page.getByRole('button', { name: 'Open my first letter' }).click();
      await page.getByRole('heading', { name: 'Your next letter is ready.' }).waitFor();
    }
    if (state === 'night') {
      await page.goto(root + '/#settings');
      await page.getByRole('button', { name: 'Night post' }).click();
      await page.getByRole('status').filter({ hasText: 'Settings saved.' }).waitFor();
      await page.goto(root + '/#today');
      await page.getByRole('heading', { name: 'Your next letter is ready.' }).waitFor();
    }
    const logo = page.getByRole('link', { name: 'Shiori home' });
    await expect(logo.locator('img:visible')).toHaveCount(1);
    await logo.locator('img:visible').evaluate((img: HTMLImageElement) => img.decode());
    await page.evaluate(async () => {
      await document.fonts.ready;
      const src = getComputedStyle(document.querySelector('.mascot')!).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
      if (src) { const img = new Image(); img.src = src; await img.decode(); }
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    await page.screenshot({ path: `.impeccable/review/shiori-logo-${state}-${width}.png`, fullPage: false });
  }
  await page.goto(root + '/brand/index.html');
  await page.locator('.hero img').evaluate((img: HTMLImageElement) => img.decode());
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.screenshot({ path: `.impeccable/review/shiori-logo-sheet-${width}.png`, fullPage: true });
  await context.close();
}
await browser.close();
fs.writeFileSync('output/shiori-logo-check.json', JSON.stringify({ passed: true, widths: [1440,375,320], states: ['welcome','today','night','brand-sheet'] }));
console.log('12 logo/theme/viewport checks passed: SVG loading, accessible home link, single visible variant, contrast, overflow.');
