import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
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
              expiration: { maxEntries: 3000 },
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
