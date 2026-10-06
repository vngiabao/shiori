import manifest from "./generated/audio.json";
import { type Reaction } from "./persona";
import { selectReaction } from "./reactionState";
import type { Profile, Word } from "./types";
let current: HTMLAudioElement | null = null;
let cancelTimed: (() => void) | null = null;
let last = { text: "", rate: 1, url: "" };
let preferences: Pick<
  Profile,
  "spokenReactions" | "wordAudio" | "voicePreview"
> = {};
export function configureVoice(profile: typeof preferences) {
  preferences = profile;
}
export async function playClip(url: string, rate = 1) {
  stopAudio();
  last = { text: "", rate, url };
  const clip = new Audio(url);
  current = clip;
  clip.playbackRate = rate;
  await clip.play();
}
export function speakWord(text: string) {
  return preferences.wordAudio === false ? Promise.resolve() : speak(text);
}
// Orthographic は is "ha" in the kana chart, but "wa" as the topic marker.
// Keep the written word unchanged and resolve its pedagogical context here.
export function wordAudioText(word: Pick<Word, "id" | "kana">) {
  return word.id === "wa" ? "わ" : word.kana;
}
export function speakReaction(key: Reaction, force = false) {
  const voice = preferences.voicePreview ?? "baseline";
  const line = selectReaction(key, voice, force);
  if (!force && preferences.spokenReactions === false) return Promise.resolve();
  return playClip(line.url);
}
const assets = manifest as Record<string, string>;
export function stopAudio() {
  sequence++;
  cancelTimed?.();
  cancelTimed = null;
  current?.pause();
  current = null;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
export async function speak(text: string, rate = 1): Promise<void> {
  stopAudio();
  last = { text, rate, url: "" };
  if (assets[text]) {
    current = new Audio(assets[text]);
    current.playbackRate = rate;
    await current.play();
    return;
  }
  if (!("speechSynthesis" in window))
    throw new Error(
      "Audio is unavailable on this browser. Try a downloaded lesson or a Japanese device voice.",
    );
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith("ja"));
  if (!voice)
    throw new Error(
      "No Japanese device voice found. Install a Japanese voice in your device’s language settings.",
    );
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.voice = voice;
  u.rate = rate;
  window.speechSynthesis.speak(u);
}
let sequence = 0;
/** Plays lines one after another (a dialogue), calling onLine as each starts.
 *  A later call or stopAudio() ends the sequence early. */
export async function playLines(
  texts: (string | { text: string; url: string })[],
  onLine?: (index: number) => void,
) {
  const mine = ++sequence;
  for (const [i, text] of texts.entries()) {
    if (mine !== sequence) return;
    onLine?.(i);
    await (typeof text === "string"
      ? speakToEnd(text)
      : speakToEnd(text.text, text.url));
    if (mine !== sequence) return;
    await new Promise((r) => setTimeout(r, 380));
  }
  onLine?.(-1);
}

/** Schedule decoded recordings on the audio clock: no rate/pitch processing.
 * Used only for explicitly authored conversational pauses/backchannels.
 * Default dialogue playback and individual-line replay remain unchanged. */
export async function playTimedLines(
  lines: { text: string; url: string; gapAfterMs: number }[],
  onLine?: (index: number) => void,
) {
  stopAudio();
  const mine = ++sequence;
  if (!lines.length) return;
  const ctx = new AudioContext();
  const sources: AudioBufferSourceNode[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  let rejectPlayback: ((reason: unknown) => void) | undefined;
  let cancelled = false;
  let closed = false;
  const close = () => {
    timers.forEach(clearTimeout);
    if (!closed) { closed = true; void ctx.close().catch(() => undefined); }
  };
  const cancel = () => {
    cancelled = true;
    for (const source of sources) { source.onended = null; source.stop(); }
    close();
    rejectPlayback?.(new DOMException("Playback was interrupted.", "AbortError"));
  };
  cancelTimed = cancel;
  try {
    const buffers = await Promise.all(lines.map(async (line) => {
      const response = await fetch(line.url);
      if (!response.ok) throw new Error("The conversation recording could not be loaded.");
      return ctx.decodeAudioData(await response.arrayBuffer());
    }));
    if (cancelled || mine !== sequence) throw new DOMException("Playback was interrupted.", "AbortError");
    await ctx.resume();
    if (cancelled || mine !== sequence) throw new DOMException("Playback was interrupted.", "AbortError");
    const base = ctx.currentTime + .025;
    await new Promise<void>((resolve, reject) => {
      rejectPlayback = reject;
      let offset = 0, ended = 0;
      for (const [i, line] of lines.entries()) {
        if (!Number.isInteger(line.gapAfterMs) || line.gapAfterMs < -250 || line.gapAfterMs > 800 || buffers[i].duration + line.gapAfterMs / 1000 < .1)
          throw new Error("Invalid conversation timing.");
        const source = ctx.createBufferSource();
        source.buffer = buffers[i];
        source.connect(ctx.destination);
        source.onended = () => {
          if (++ended === lines.length && !cancelled && mine === sequence) {
            onLine?.(-1); resolve();
          }
        };
        sources.push(source);
        const at = base + offset;
        source.start(at);
        timers.push(setTimeout(() => {
          if (!cancelled && mine === sequence) {
            last = { text: line.text, rate: 1, url: line.url };
            onLine?.(i);
          }
        }, Math.max(0, (at - ctx.currentTime) * 1000)));
        offset += buffers[i].duration + line.gapAfterMs / 1000;
      }
    });
  } catch (error) {
    if (!cancelled) cancel();
    throw error;
  } finally {
    if (cancelTimed === cancel) cancelTimed = null;
    close();
  }
}
function speakToEnd(text: string, url = assets[text]) {
  current?.pause();
  last = { text, rate: 1, url: url ?? "" };
  if (url) {
    const clip = new Audio(url);
    current = clip;
    return new Promise<void>((resolve, reject) => {
      clip.onended = () => resolve();
      clip.onpause = () => clip.ended ? resolve() : reject(new DOMException("Playback was interrupted.", "AbortError"));
      clip.onerror = () => reject(new Error("The audio recording could not be loaded."));
      clip.play().catch(reject);
    });
  }
  return new Promise<void>((resolve, reject) => {
    const voice = window.speechSynthesis
      ?.getVoices()
      .find((v) => v.lang.startsWith("ja"));
    if (!voice)
      return reject(new Error("No Japanese voice is available for this line."));
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.voice = voice;
    u.onend = () => resolve();
    u.onerror = () => reject(new Error("The speech voice could not play."));
    window.speechSynthesis.speak(u);
  });
}
export function stopLines() {
  sequence++;
  stopAudio();
}
export function replay() {
  if (last.url) return playClip(last.url, last.rate);
  if (last.text) return speak(last.text, last.rate);
  return Promise.resolve();
}
export const audioSource = (text: string) =>
  assets[text]
    ? "Japanese lesson voice · VOICEVOX:冥鳴ひまり"
    : "Japanese device voice";
