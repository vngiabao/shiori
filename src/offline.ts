import { loadAllCourse } from "./content";
import manifest from "./generated/audio.json";
import baseline from "./generated/violetto-baseline.json";
import emotions from "./generated/violetto-emotions.json";
import auditions from "./generated/violetto-auditions.json";
import teacher from "./generated/violetto-teacher.json";
import dialogue from "./generated/dialogue-voices.json";
import cast from "./generated/cast-auditions.json";

/* Audio is cached the first time it plays (see vite.config.ts). This opt-in
   fills the same cache with every lesson clip, for study with no connection. */
const cacheName = "shiori-audio";
export const lessonAudioUrls = () =>
  [
    ...new Set([
      ...Object.values(manifest as Record<string, string>),
      ...teacher.map((line) => line.url),
      ...cast.map((line) => line.url),
      ...Object.values(dialogue)
        .flat()
        .map((line) => line.url),
      ...Object.values(baseline as Record<string, { url: string }>).map(
        (c) => c.url,
      ),
      ...Object.values(emotions as Record<string, { url: string }[]>)
        .flat()
        .map((c) => c.url),
      // Earlier reaction voices, in case one is chosen in Violetto's voice page.
      ...(
        auditions as {
          candidates: {
            base: { url: string };
            lines: Record<string, { url: string }>;
          }[];
        }
      ).candidates.flatMap((c) => [
        c.base.url,
        ...Object.values(c.lines).map((l) => l.url),
      ]),
    ]),
  ].filter(Boolean);

export async function saveAudioOffline(
  onProgress: (done: number, total: number) => void,
) {
  if (import.meta.env.DEV)
    throw new Error(
      "Offline saving is available in the built Shiori app. Open the production preview or hosted site.",
    );
  if (!("caches" in window))
    throw new Error("This browser cannot store audio offline.");
  // Save text chunks as well as audio; never claim an offline course from clips alone.
  await loadAllCourse();
  const response = await fetch("/course-assets.json");
  if (!response.ok)
    throw new Error(
      "Course files couldn’t be found. Reload Shiori online and try again.",
    );
  const assets: string[] = await response.json();
  const courseCache = await caches.open("shiori-course");
  for (const url of assets)
    if (!(await courseCache.match(url))) await courseCache.add(url);
  const cache = await caches.open(cacheName);
  const urls = lessonAudioUrls();
  let done = 0;
  // A few at a time keeps the page responsive on slow connections.
  for (let i = 0; i < urls.length; i += 8) {
    await Promise.all(
      urls.slice(i, i + 8).map(async (url) => {
        if (!(await cache.match(url))) await cache.add(url);
        onProgress(++done, urls.length);
      }),
    );
  }
}
