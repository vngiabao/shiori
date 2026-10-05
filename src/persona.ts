import roster from "../content/voices/violetto.json";
import baseline from "./generated/violetto-baseline.json";
import auditions from "./generated/violetto-auditions.json";
import emotions from "./generated/violetto-emotions.json";
import emotionConfig from "../content/voices/emotions.json";
export const violetto = roster;
export type Reaction = keyof typeof roster.lines;
export type VoiceTake = { url: string; seconds: number };
export type VoiceCandidate = {
  id: string;
  name: string;
  description: string;
  base: VoiceTake;
  lines: Record<string, VoiceTake>;
};
export const voiceCandidates = (auditions as { candidates: VoiceCandidate[] })
  .candidates;
export const baselineLines = baseline as Record<string, VoiceTake>;
export const emotionalLines = emotions as Record<
  Reaction,
  (VoiceTake & { name: string; text: string; mood: string })[]
>;
export const emotionMoods = emotionConfig.moods;
export function reactionAsset(key: Reaction, voice = "baseline", take = 0) {
  return (
    voiceCandidates.find((c) => c.id === voice)?.lines[key]?.url ??
    emotionalLines[key]?.[take % emotionalLines[key].length]?.url ??
    baselineLines[key]?.url
  );
}
export function reactionFor(correct: boolean, supported: boolean): Reaction {
  return correct ? (supported ? "supported" : "correct") : "retry";
}
