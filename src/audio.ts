import manifest from "./generated/audio.json";
import { reactionAsset, violetto, type Reaction } from "./persona";
import type { Profile, Word } from "./types";
let current: HTMLAudioElement | null = null;
let last = { text: "", rate: 1, url: "" };
const reactionTurns = new Map<string, number>();
let lastReaction: { key: Reaction; voice: string; url: string } | null = null;
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
  if (!force && preferences.spokenReactions === false) return Promise.resolve();
  const voice = preferences.voicePreview ?? "baseline";
  // A manual replay matches the feedback just shown; new events alternate takes.
  if (force && lastReaction?.key === key && lastReaction.voice === voice)
    return playClip(lastReaction.url);
  const identity = `${voice}:${key}`;
  const turn = reactionTurns.get(identity) ?? 0;
  const url = reactionAsset(key, voice, turn);
  if (url) {
    reactionTurns.set(identity, turn + 1);
    lastReaction = { key, voice, url };
  }
  return url ? playClip(url) : speak(violetto.lines[key].text);
}
const assets = manifest as Record<string, string>;
export function stopAudio() {
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
  texts: string[],
  onLine?: (index: number) => void,
) {
  const mine = ++sequence;
  for (const [i, text] of texts.entries()) {
    if (mine !== sequence) return;
    onLine?.(i);
    await speakToEnd(text);
    if (mine !== sequence) return;
    await new Promise((r) => setTimeout(r, 380));
  }
  onLine?.(-1);
}
function speakToEnd(text: string) {
  current?.pause();
  last = { text, rate: 1, url: "" };
  if (assets[text]) {
    const clip = new Audio(assets[text]);
    current = clip;
    return new Promise<void>((resolve, reject) => {
      clip.onended = clip.onpause = () => resolve();
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
    u.onend = u.onerror = () => resolve();
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
