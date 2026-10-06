import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";
// Read build metadata directly so the configuration does not import app code.
const audioUrls = new Set<string>();
const collectAudio = (value: unknown) => {
  if (typeof value === "string" && /^\/(audio|voice-auditions)\//.test(value)) audioUrls.add(value);
  else if (Array.isArray(value)) value.forEach(collectAudio);
  else if (value && typeof value === "object") Object.values(value).forEach(collectAudio);
};
for (const name of ["audio", "violetto-baseline", "violetto-emotions", "violetto-auditions", "violetto-teacher", "dialogue-voices", "cast-auditions"])
  collectAudio(JSON.parse(readFileSync(new URL(`./src/generated/${name}.json`, import.meta.url), "utf8")));
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["brand/shiori-violetto-icon.svg"],
      manifest: {
        name: "Shiori · Japanese with Violetto",
        short_name: "Shiori",
        theme_color: "#172c49",
        background_color: "#edf1f7",
        display: "standalone",
        icons: [
          {
            src: "/brand/shiori-violetto-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        // The app shell, fonts, stroke data and art install up front. Audio grows
        // with every unit, so clips are cached the first time they play instead.
        globPatterns: ["**/*.{js,css,html,svg,woff2,json,png}"],
        maximumFileSizeToCacheInBytes: 12000000,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/audio/") ||
              url.pathname.startsWith("/voice-auditions/"),
            handler: "CacheFirst",
            options: {
              cacheName: "shiori-audio",
              // The opt-in download must fit every shipped clip as the course
              // grows, plus older content-hashed clips used by an open tab.
              expiration: { maxEntries: Math.max(3000, audioUrls.size + 500) },
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: { port: 5174, strictPort: true },
  build: { chunkSizeWarningLimit: 900 },
});
