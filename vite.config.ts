import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync, statSync } from "node:fs";
// Read build metadata directly so the configuration does not import app code.
const audioUrls = new Set<string>();
const collectAudio = (value: unknown) => {
  if (typeof value === "string" && /^\/(audio|voice-auditions)\//.test(value))
    audioUrls.add(value);
  else if (Array.isArray(value)) value.forEach(collectAudio);
  else if (value && typeof value === "object")
    Object.values(value).forEach(collectAudio);
};
for (const name of [
  "audio",
  "violetto-baseline",
  "violetto-emotions",
  "violetto-auditions",
  "violetto-teacher",
  "dialogue-voices",
  "cast-auditions",
])
  collectAudio(
    JSON.parse(
      readFileSync(
        new URL(`./src/generated/${name}.json`, import.meta.url),
        "utf8",
      ),
    ),
  );
export default defineConfig({
  plugins: [
    react(),
    {
      name: "course-offline-index",
      generateBundle(_, bundle) {
        const urls = Object.values(bundle)
          .filter(
            (file) =>
              file.type === "chunk" &&
              /^assets\/course-(?:n[1-5]|keigo|other)/.test(file.fileName),
          )
          .map((file) => "/" + file.fileName);
        this.emitFile({
          type: "asset",
          fileName: "course-assets.json",
          source: JSON.stringify(urls),
        });
      },
    },
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
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
        clientsClaim: true,
        importScripts: ["/sw-migration.js"],
        manifestTransforms: [
          async (entries) => {
            const bytes = entries.reduce(
              (total, entry) =>
                total +
                statSync(new URL(`./dist/${entry.url}`, import.meta.url)).size,
              0,
            );
            if (bytes > 15 * 1024 * 1024)
              throw new Error(
                `Offline install exceeds 15 MiB: ${(bytes / 1024).toFixed(2)} KiB. Reduce eager assets before shipping.`,
              );
            return { manifest: entries, warnings: [] };
          },
        ],
        // The app shell, fonts, stroke data and art install up front. Audio grows
        // with every unit, so clips are cached the first time they play instead.
        globPatterns: ["**/*.{js,css,html,svg,woff2,json,png}"],
        globIgnores: [
          "assets/course-n*.js",
          "assets/course-keigo*.js",
          "assets/course-other*.js",
        ],
        maximumFileSizeToCacheInBytes: 12000000,
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              /^\/assets\/course-.+\.js$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "shiori-course",
              // Hashed same-origin files are identical across fetch/import Origin headers.
              matchOptions: { ignoreVary: true },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              url.origin === self.location.origin &&
              !request.headers.has("X-Shiori-Offline-Download") &&
              (url.pathname.startsWith("/audio/") ||
                url.pathname.startsWith("/voice-auditions/")),
            handler: "CacheFirst",
            options: {
              cacheName: "shiori-audio",
              // Hashed local recordings have identical bytes for fetch and media requests.
              matchOptions: { ignoreVary: true },
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
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            ...["n5", "n4", "n3", "n2", "n1", "keigo"].map((level) => ({
              name: `course-${level}`,
              test: new RegExp(
                `[/\\\\]content[/\\\\]packs[/\\\\]${level}-[^/\\\\]+\\.json$`,
              ),
              maxSize: 300000,
              priority: 20,
            })),
            {
              name: "course-foundation",
              test: /[/\\]content[/\\]packs[/\\]first-post\.json$/,
              priority: 20,
            },
            {
              name: "kanji-reference",
              test: /[/\\]content[/\\]kanji[/\\]n5\.json$/,
              priority: 20,
            },
            {
              name: "voice-mappings",
              test: /[/\\]src[/\\]generated[/\\].+\.json$/,
              maxSize: 300000,
              priority: 10,
            },
            {
              name: "vendor",
              test: /[/\\]node_modules[/\\]/,
              maxSize: 350000,
              priority: 5,
            },
          ],
        },
      },
    },
  },
});
