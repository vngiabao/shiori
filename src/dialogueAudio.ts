import manifest from "./generated/dialogue-voices.json";
import { playClip, playLines } from "./audio";
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
export const dialogueTakes = manifest as Record<string, DialogueTake[]>;
export function dialogueTake(dialogue: Dialogue, index: number): DialogueTake {
  const line = dialogue.lines[index];
  const take = dialogueTakes[dialogue.id]?.[index];
  if (
    !line ||
    !take ||
    take.text !== plain(line.line) ||
    take.speaker !== line.speaker
  )
    throw new Error(`Dialogue audio needs rebuilding: ${dialogue.id}/${index}`);
  return take;
}
export function playDialogue(
  dialogue: Dialogue,
  onLine?: (index: number) => void,
) {
  return playLines(
    dialogue.lines.map((_, i) => dialogueTake(dialogue, i)),
    onLine,
  );
}
export function playDialogueLine(dialogue: Dialogue, index: number) {
  return playClip(dialogueTake(dialogue, index).url);
}
