import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { playTimedLines, speak, stopAudio } from "../src/audio";
import { validatePack } from "../src/packs";
import packs from "../src/generated/packs.json";

beforeEach(() => { vi.stubGlobal("window", {}); });
afterEach(() => { stopAudio(); vi.useRealTimers(); vi.unstubAllGlobals(); });
function audioClock() {
  const sources: { start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; onended: (() => void) | null; buffer: unknown }[] = [];
  const close = vi.fn().mockResolvedValue(undefined);
  vi.useFakeTimers();
  vi.stubGlobal("window", {});
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(4) })));
  vi.stubGlobal("AudioContext", class {
    currentTime = 0; destination = {};
    resume = vi.fn().mockResolvedValue(undefined);
    close = close;
    decodeAudioData = vi.fn(async () => ({ duration: 1 }));
    createBufferSource() {
      const source = { buffer: null as unknown, onended: null as (() => void) | null,
        connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
      sources.push(source); return source;
    }
  });
  return { sources, close };
}
const lines = [
  { text: "first", url: "/first.wav", gapAfterMs: -200 },
  { text: "reply", url: "/reply.wav", gapAfterMs: 320 },
  { text: "next", url: "/next.wav", gapAfterMs: 380 },
];
it("schedules unchanged recordings with a bounded overlap and waits for every source", async () => {
  const { sources } = audioClock(), onLine = vi.fn();
  const done = playTimedLines(lines, onLine);
  await vi.advanceTimersByTimeAsync(0);
  expect(sources).toHaveLength(3);
  expect(sources.map(s => s.start.mock.calls[0][0])).toEqual([.025, .8250000000000001, 2.145]);
  expect((fetch as any).mock.calls.map((c: string[]) => c[0])).toEqual(lines.map(l => l.url));
  expect(sources.every(s => !("playbackRate" in s))).toBe(true);
  await vi.advanceTimersByTimeAsync(26);
  expect(onLine.mock.calls).toEqual([[0]]);
  sources[0].onended?.(); sources[1].onended?.();
  expect(onLine).not.toHaveBeenCalledWith(-1);
  sources[2].onended?.(); await done;
  expect(onLine).toHaveBeenLastCalledWith(-1);
});
it("a tapped word stops every overlapping source without awarding a full listen", async () => {
  const { sources, close } = audioClock(), onLine = vi.fn();
  const done = playTimedLines(lines, onLine);
  const rejected = expect(done).rejects.toMatchObject({ name: "AbortError" });
  await vi.advanceTimersByTimeAsync(826);
  vi.stubGlobal("Audio", class { pause = vi.fn(); play = vi.fn().mockResolvedValue(undefined); });
  await speak("あ"); await rejected;
  expect(sources.every(s => s.stop.mock.calls.length === 1 && s.onended === null)).toBe(true);
  expect(onLine).not.toHaveBeenCalledWith(-1);
  expect(close).toHaveBeenCalled();
  const count = onLine.mock.calls.length;
  await vi.advanceTimersByTimeAsync(3000);
  expect(onLine).toHaveBeenCalledTimes(count);
});
it("missing recordings fail before any scheduled playback or heard credit", async () => {
  const { sources } = audioClock(), onLine = vi.fn();
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false })));
  await expect(playTimedLines(lines, onLine)).rejects.toThrow("could not be loaded");
  expect(sources).toHaveLength(0); expect(onLine).not.toHaveBeenCalled();
});
it("rejects oversized timing, same-speaker overlap and trailing overlap in authored packs", () => {
  const original = (packs as any[]).find(p => p.id === "n2-u07");
  for (const [index, gap] of [[0, -251], [0, 801], [0, 1.5], [11, -100]]) {
    const pack = structuredClone(original);
    pack.dialogues[0].lines[index].gapAfterMs = gap;
    expect(validatePack(pack).some(e => e.startsWith("Dialogue timing"))).toBe(true);
  }
  const pack = structuredClone(original);
  pack.dialogues[0].lines[0].gapAfterMs = -100;
  pack.dialogues[0].lines[1].speaker = pack.dialogues[0].lines[0].speaker;
  expect(validatePack(pack).some(e => e.startsWith("Dialogue timing"))).toBe(true);
});
