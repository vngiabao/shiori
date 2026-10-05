import { afterEach, expect, it, vi } from "vitest";
import {
  configureVoice,
  speak,
  speakWord,
  stopAudio,
  wordAudioText,
  speakReaction,
  replay,
} from "../src/audio";
import manifest from "../src/generated/audio.json";
import { emotionalLines } from "../src/persona";

afterEach(() => {
  configureVoice({});
  vi.unstubAllGlobals();
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
  expect(played).toEqual(emotionalLines.welcome.map((t) => t.url));
  await speakReaction("welcome", true);
  await replay();
  expect(played.slice(2)).toEqual([played[1], played[1]]);
  configureVoice({ spokenReactions: false });
  await speakReaction("welcome");
  expect(played).toHaveLength(4);
  configureVoice({});
  await speakReaction("welcome");
  expect(played.at(-1)).toBe(played[0]);
  stopAudio();
});
it("distinguishes kana ha from the topic particle without changing spelling", () => {
  expect(wordAudioText({ id: "h-は", kana: "は" })).toBe("は");
  expect(wordAudioText({ id: "wa", kana: "は" })).toBe("わ");
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
