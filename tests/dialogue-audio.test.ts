import { afterEach, expect, it, vi } from "vitest";
import { dialogues } from "../src/content";
import {
  dialogueTake,
  playDialogue,
  playDialogueLine,
} from "../src/dialogueAudio";
import { replay, speak } from "../src/audio";
import clear from "../src/generated/audio.json";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("plays each scene's speaker recording, replays that take, and leaves drills Clear", async () => {
  vi.useFakeTimers();
  const played: string[] = [];
  vi.stubGlobal("window", {});
  vi.stubGlobal(
    "Audio",
    class {
      playbackRate = 1;
      onended: (() => void) | null = null;
      onpause: (() => void) | null = null;
      constructor(public url: string) {}
      pause() {
        this.onpause?.();
      }
      play() {
        played.push(this.url);
        Promise.resolve().then(() => this.onended?.());
        return Promise.resolve();
      }
    },
  );
  const scene = dialogues.find((d) => d.id === "d-cafe")!;
  const promise = playDialogue(scene);
  await vi.runAllTimersAsync();
  await promise;
  expect(played).toEqual(scene.lines.map((_, i) => dialogueTake(scene, i).url));
  await playDialogueLine(scene, 0);
  await replay();
  expect(played.slice(-2)).toEqual([
    dialogueTake(scene, 0).url,
    dialogueTake(scene, 0).url,
  ]);
  await speak("あ");
  expect(played.at(-1)).toBe(clear["あ"]);
});
