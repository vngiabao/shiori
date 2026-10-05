import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  timeout: 40000,
  workers: 1,
  use: {
    baseURL: process.env.APP_URL ?? "http://127.0.0.1:5174",
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
  reporter: "list",
});
