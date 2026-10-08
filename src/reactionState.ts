import { useSyncExternalStore } from "react";
import teacher from "./generated/violetto-teacher.json";
import {
  reactionAsset,
  violetto,
  voiceCandidates,
  type Reaction,
} from "./persona";
import type { Pose } from "./components";

export type TeacherLine = {
  id: string;
  category: Reaction;
  text: string;
  reading: string;
  ruby: string;
  romaji: string;
  meaning: string;
  mood: string;
  pose: Pose;
  url: string;
  seconds?: number;
};
export const teacherLines = teacher as TeacherLine[];
const listeners = new Set<() => void>();
const selected = new Map<Reaction, { voice: string; line: TeacherLine }>();
const bags = new Map<Reaction, TeacherLine[]>();
const previous = new Map<Reaction, string>();
const defaults = new Map<Reaction, TeacherLine>();
function original(key: Reaction, voice = "baseline"): TeacherLine {
  return {
    ...violetto.lines[key],
    pose: violetto.lines[key].pose as Pose,
    id: key,
    category: key,
    url: reactionAsset(key, voice),
  };
}
export function currentReaction(key: Reaction): TeacherLine {
  if (selected.has(key)) return selected.get(key)!.line;
  if (!defaults.has(key)) defaults.set(key, original(key));
  return defaults.get(key)!;
}
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function useReactionLine(key: Reaction) {
  return useSyncExternalStore(
    subscribe,
    () => currentReaction(key),
    () => currentReaction(key),
  );
}
/** A new event consumes a shuffled bag. Replay never consumes another line.
 * Muted events still select a line so the written teacher retains variety. */
export function selectReaction(
  key: Reaction,
  voice: string,
  replay = false,
): TeacherLine {
  const saved = selected.get(key);
  if (replay && saved?.voice === voice) return saved.line;
  let line = original(key, voice);
  // Auditions contain the original script only: never put new text over them.
  if (!replay && !voiceCandidates.some((v) => v.id === voice)) {
    let bag = bags.get(key) ?? [];
    if (!bag.length) {
      bag = teacherLines.filter((l) => l.category === key);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag.at(-1)?.id === previous.get(key))
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    const lastLine = teacherLines.find((l) => l.id === previous.get(key));
    // Keep every message in the bag, but avoid runs of the same feeling or
    // fuller remarks when a brief response is still available. Replay is stable.
    const differentMood = bag.filter((l) => l.mood !== lastLine?.mood);
    let choices = differentMood.length ? differentMood : bag;
    if ((lastLine?.seconds ?? 0) > 2.5) {
      const brief = choices.filter((l) => (l.seconds ?? 0) <= 2.5);
      const anyBrief = bag.filter((l) => (l.seconds ?? 0) <= 2.5);
      if (brief.length || anyBrief.length)
        choices = brief.length ? brief : anyBrief;
    }
    const candidate =
      choices.find((l) => l.id !== previous.get(key)) ?? choices[0];
    if (candidate) line = bag.splice(bag.indexOf(candidate), 1)[0];
    bags.set(key, bag);
    previous.set(key, line.id);
  }
  selected.set(key, { voice, line });
  listeners.forEach((listener) => listener());
  return line;
}
