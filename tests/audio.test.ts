import { afterEach, expect, it, vi } from "vitest";
import {
  configureVoice,
  speak,
  speakWord,
  stopAudio,
  wordAudioText,
  speakReaction,
  replay,
  playLines,
} from "../src/audio";
import manifest from "../src/generated/audio.json";
import {
  currentReaction,
  teacherLines,
  selectReaction,
} from "../src/reactionState";
import { voiceCandidates } from "../src/persona";

afterEach(() => {
  configureVoice({});
  vi.unstubAllGlobals();
});
it("does not count an interrupted conversation as heard or resume over a tapped word", async () => {
  const clips: {
    onpause?: () => void;
    onended?: () => void;
    ended: boolean;
    pause: () => void;
  }[] = [];
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "Audio",
    class {
      ended = false;
      onpause?: () => void;
      onended?: () => void;
      constructor() {
        clips.push(this);
      }
      play() {
        return Promise.resolve();
      }
      pause() {
        this.onpause?.();
      }
    },
  );
  const callback = vi.fn();
  const conversation = playLines(
    [
      { text: "こんにちは", url: manifest["こんにちは"] },
      { text: "あ", url: manifest["あ"] },
    ],
    callback,
  );
  const rejected = expect(conversation).rejects.toMatchObject({
    name: "AbortError",
  });
  await speak("い");
  await rejected;
  expect(clips).toHaveLength(2);
  expect(callback.mock.calls).toEqual([[0]]);
  stopAudio();
});
it("varies new reactions, replays the same delivery, and honours mute", async () => {
  const played: string[] = [];
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "Audio",
    class {
      playbackRate = 1;
      pause = vi.fn();
      constructor(public url: string) {}
      play() {
        played.push(this.url);
        return Promise.resolve();
      }
    },
  );
  configureVoice({});
  await speakReaction("welcome");
  await speakReaction("welcome");
  expect(new Set(played).size).toBe(2);
  expect(
    teacherLines.some((l) => l.category === "welcome" && l.url === played[1]),
  ).toBe(true);
  expect(currentReaction("welcome").url).toBe(played[1]);
  await speakReaction("welcome", true);
  await replay();
  expect(played.slice(2)).toEqual([played[1], played[1]]);
  configureVoice({ spokenReactions: false });
  const beforeMute = currentReaction("welcome").id;
  await speakReaction("welcome");
  expect(played).toHaveLength(4);
  expect(currentReaction("welcome").id).not.toBe(beforeMute);
  await speakReaction("welcome", true);
  expect(played.at(-1)).toBe(currentReaction("welcome").url);
  configureVoice({});
  await speakReaction("welcome");
  expect(played.at(-1)).not.toBe(played.at(-2));
  stopAudio();
});
it("uses each praise message before repeating and avoids repeats at bag boundaries", async () => {
  vi.stubGlobal("window", {});
  configureVoice({ spokenReactions: false });
  const ids: string[] = [];
  for (let i = 0; i < 51; i++) {
    await speakReaction("correct");
    ids.push(currentReaction("correct").id);
  }
  expect(new Set(ids.slice(0, 25)).size).toBe(25);
  expect(new Set(ids.slice(25, 50)).size).toBe(25);
  expect(ids.every((id, i) => i === 0 || id !== ids[i - 1])).toBe(true);
});
it("keeps earlier audition text matched to its recording", async () => {
  vi.stubGlobal("window", {});
  configureVoice({
    spokenReactions: false,
    voicePreview: voiceCandidates[0].id,
  });
  await speakReaction("correct");
  expect(currentReaction("correct").id).toBe("correct");
  expect(currentReaction("correct").url).toBe(
    voiceCandidates[0].lines.correct.url,
  );
});
it("breaks up longer corrections and repeated moods without losing any messages", () => {
  const remaining = new Map(
    teacherLines.filter((l) => l.category === "retry").map((l) => [l.id, l]),
  );
  let last: (typeof teacherLines)[number] | undefined;
  for (let i = 0; i < 20; i++) {
    const available = [...remaining.values()];
    const line = selectReaction("retry", "baseline");
    expect(remaining.has(line.id)).toBe(true);
    if (
      last &&
      (last.seconds ?? 0) > 2.5 &&
      available.some((l) => (l.seconds ?? 0) <= 2.5)
    )
      expect(line.seconds).toBeLessThanOrEqual(2.5);
    if (
      last &&
      available.some((l) => l.mood !== last!.mood) &&
      !((last.seconds ?? 0) > 2.5)
    )
      expect(line.mood).not.toBe(last.mood);
    expect(selectReaction("retry", "baseline", true)).toBe(line);
    remaining.delete(line.id);
    last = line;
  }
  expect(remaining.size).toBe(0);
});
it("distinguishes kana ha from the topic particle without changing spelling", () => {
  expect(wordAudioText({ id: "h-は", kana: "は" })).toBe("は");
  expect(wordAudioText({ id: "wa", kana: "は" })).toBe("わ");
});
it("preserves the rain/candy lexical contrast when tapping homophones", () => {
  const rain = wordAudioText({ id: "rain", text: "雨", kana: "あめ" });
  const candy = wordAudioText({ id: "candy", text: "飴", kana: "あめ" });
  expect(rain).toBe("雨");
  expect(candy).toBe("飴");
  const urls = manifest as Record<string, string>;
  expect(urls[rain]).not.toBe(urls[candy]);
  expect(wordAudioText({ id: "h-あ", text: "あ", kana: "あ" })).toBe("あ");
});
it("uses separate replacement vowel clips and stops the previous sound", async () => {
  const clips: {
    url: string;
    pause: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    playbackRate: number;
  }[] = [];
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "Audio",
    class {
      pause = vi.fn();
      play = vi.fn().mockResolvedValue(undefined);
      playbackRate = 1;
      constructor(public url: string) {
        clips.push(this);
      }
    },
  );
  await speak("あ");
  await speak("い");
  expect(clips.map((c) => c.url)).toEqual([manifest["あ"], manifest["い"]]);
  expect(clips[0].pause).toHaveBeenCalledOnce();
  expect(
    clips.every((c) => c.url.endsWith(".wav") && c.url.includes("vv2-")),
  ).toBe(true);
  configureVoice({ wordAudio: false });
  await speakWord("う");
  expect(clips).toHaveLength(2);
  stopAudio();
});
