import { playClip, playLines, playTimedLines } from "./audio";
import { plain } from "./text";
import type { Dialogue } from "./types";

export type DialogueTake = {
  text: string;
  url: string;
  seconds: number;
  speaker: string;
  index: number;
  mood: string;
};
// Scene takes load on first playback, keeping them out of the first screen.
let takes: Record<string, DialogueTake[]> = {};
let takesLoaded = false;
const ready = import("./generated/dialogue-voices.json").then((m) => {
  takes = m.default as Record<string, DialogueTake[]>;
  takesLoaded = true;
});
export const dialogueTakesReady = () => ready;
export function dialogueTake(dialogue: Dialogue, index: number): DialogueTake {
  const line = dialogue.lines[index];
  const take = takes[dialogue.id]?.[index];
  if (
    !line ||
    !take ||
    take.text !== plain(line.line) ||
    take.speaker !== line.speaker
  )
    throw new Error(`Dialogue audio needs rebuilding: ${dialogue.id}/${index}`);
  return take;
}
export async function playDialogue(
  dialogue: Dialogue,
  onLine?: (index: number) => void,
) {
  if (!takesLoaded) await ready;
  if (dialogue.lines.some((line) => line.gapAfterMs !== undefined))
    return playTimedLines(dialogue.lines.map((line, i) => ({
      ...dialogueTake(dialogue, i), gapAfterMs: line.gapAfterMs ?? 380,
    })), onLine);
  return playLines(
    dialogue.lines.map((_, i) => dialogueTake(dialogue, i)),
    onLine,
  );
}
export async function playDialogueLine(dialogue: Dialogue, index: number) {
  if (!takesLoaded) await ready;
  return playClip(dialogueTake(dialogue, index).url);
}
