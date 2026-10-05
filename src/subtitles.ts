export type Cue = { start: number; end: number; text: string };

const time = /(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})/;
const seconds = (t: string) => {
  const m = time.exec(t);
  if (!m) return NaN;
  const [, h = "0", min, s, ms] = m;
  return +h * 3600 + +min * 60 + +s + +ms.padEnd(3, "0") / 1000;
};

/** Parses SRT or WebVTT text into cues: tags, positioning and blank cues removed. */
export function parseSubtitles(raw: string): Cue[] {
  const blocks = raw
    .replace(/^﻿/, "")
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n");
    const at = lines.findIndex((l) => l.includes("-->"));
    if (at < 0) continue;
    const [from, to] = lines[at].split("-->");
    const start = seconds(from);
    const end = seconds(to);
    const text = lines
      .slice(at + 1)
      .join("\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\{\\[^}]*\}/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();
    if (Number.isFinite(start) && Number.isFinite(end) && end > start && text)
      cues.push({ start, end, text });
  }
  return cues.sort((a, b) => a.start - b.start);
}

/** The cue playing at time t, or the last one that has started. */
export function cueAt(cues: Cue[], t: number) {
  let found = -1;
  for (let i = 0; i < cues.length && cues[i].start <= t + 0.05; i++) found = i;
  return found;
}

export const clock = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
