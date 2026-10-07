import { afterEach, expect, it, vi } from "vitest";
import { lessonAudioUrls, saveAudioOffline } from "../src/offline";

vi.mock("../src/content", () => ({ loadAllCourse: vi.fn() }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function setup() {
  vi.stubEnv("DEV", false);
  vi.stubGlobal("window", { caches: true });
  const saved = new Set<string>(lessonAudioUrls().slice(2));
  const cache = {
    match: vi.fn(async (url: string) =>
      saved.has(url) ? new Response("saved") : undefined,
    ),
    keys: vi.fn(async () =>
      [...saved].map((url) => new Request("https://shiori.gbaonvo.com" + url)),
    ),
    put: vi.fn(async (url: string) => {
      saved.add(url);
    }),
  };
  vi.stubGlobal("caches", { open: vi.fn(async () => cache) });
  const fetch = vi.fn(async (url: string) =>
    url === "/course-assets.json"
      ? new Response("[]")
      : new Response("recording"),
  );
  vi.stubGlobal("fetch", fetch);
  return { saved, cache, fetch, urls: lessonAudioUrls() };
}

it("retries a transient connection failure and skips previously saved clips", async () => {
  const { fetch, saved, urls } = setup();
  let first = true;
  fetch.mockImplementation(async (url) => {
    if (url === "/course-assets.json") return new Response("[]");
    if (url === urls[0] && first) {
      first = false;
      throw new TypeError("Failed to fetch");
    }
    return new Response("recording");
  });
  const progress = vi.fn();
  await saveAudioOffline(progress);
  expect(fetch.mock.calls.filter(([url]) => url === urls[0])).toHaveLength(2);
  expect(fetch.mock.calls.filter(([url]) => url === urls[2])).toHaveLength(0);
  expect(saved.size).toBe(urls.length);
  expect(progress).toHaveBeenLastCalledWith(urls.length, urls.length);
});

it("reports a missing file without retrying it and retains the rest of its batch", async () => {
  const { fetch, saved, urls } = setup();
  fetch.mockImplementation(async (url) => {
    if (url === "/course-assets.json") return new Response("[]");
    if (url === urls[0]) return new Response("missing", { status: 404 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    return new Response("recording");
  });
  const progress = vi.fn();
  await expect(saveAudioOffline(progress)).rejects.toThrow("404");
  expect(saved.has(urls[1])).toBe(true);
  expect(fetch.mock.calls.filter(([url]) => url === urls[0])).toHaveLength(1);
  const count = progress.mock.calls.length;
  await new Promise((resolve) => setTimeout(resolve, 30));
  expect(progress.mock.calls.length).toBe(count);
  fetch.mockImplementation(async (url) =>
    url === "/course-assets.json"
      ? new Response("[]")
      : new Response("recording"),
  );
  await saveAudioOffline(progress);
  expect(saved.size).toBe(urls.length);
});

it("reports storage exhaustion instead of claiming the course was saved", async () => {
  const { cache } = setup();
  cache.put.mockRejectedValue(
    new DOMException("Quota exceeded", "QuotaExceededError"),
  );
  await expect(saveAudioOffline(vi.fn())).rejects.toThrow("available storage");
});

it("shares saved immutable clips between fetch and media Origin variants", async () => {
  const { cache, urls } = setup();
  await saveAudioOffline(vi.fn());
  expect(cache.match).toHaveBeenCalledWith(urls[2], { ignoreVary: true });
});

it("rejects a download whose earlier files disappeared before completion", async () => {
  const { cache, urls } = setup();
  cache.keys.mockImplementation(async () =>
    urls.slice(1).map((url) => new Request("https://shiori.gbaonvo.com" + url)),
  );
  await expect(saveAudioOffline(vi.fn())).rejects.toThrow("not retained");
});
