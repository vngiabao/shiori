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
// Retry short connection failures, but report missing files immediately. A
// completed batch settles before the caller enables Retry, so old callbacks
// cannot overwrite the next attempt's progress. Previously saved clips survive.
async function cacheAsset(cache: Cache, url: string) {
  if (await cache.match(url)) return;
  for (let attempt = 0; attempt < 3; attempt++) {
    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      if (attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * (attempt + 1)),
        );
        continue;
      }
      throw new Error(
        "The download stopped. Check your connection and try again; saved files will be kept.",
      );
    }
    if (!response.ok) {
      if (response.status >= 500 && attempt < 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * (attempt + 1)),
        );
        continue;
      }
      throw new Error(
        `A course file could not be downloaded (${response.status}). Reload Shiori online and try again.`,
      );
    }
    try {
      await cache.put(url, response);
      return;
    } catch {
      throw new Error(
        "This browser couldn’t save more files. Check available storage, then try again; saved files will be kept.",
      );
    }
  }
}
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
  for (const url of assets) await cacheAsset(courseCache, url);
  const cache = await caches.open(cacheName);
  const urls = lessonAudioUrls();
  let done = 0;
  // A few at a time keeps the page responsive on slow connections.
  for (let i = 0; i < urls.length; i += 8) {
    const results = await Promise.allSettled(
      urls.slice(i, i + 8).map(async (url) => {
        await cacheAsset(cache, url);
        onProgress(++done, urls.length);
      }),
    );
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") throw failure.reason;
  }
}
