import manifest from "./generated/audio.json";
import baseline from "./generated/violetto-baseline.json";
import emotions from "./generated/violetto-emotions.json";
import auditions from "./generated/violetto-auditions.json";

/* Audio is cached the first time it plays (see vite.config.ts). This opt-in
   fills the same cache with every lesson clip, for study with no connection. */
const cacheName = "shiori-audio";
export const lessonAudioUrls = () =>
  [
    ...new Set([
      ...Object.values(manifest as Record<string, string>),
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
  if (!("caches" in window))
    throw new Error("This browser cannot store audio offline.");
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
