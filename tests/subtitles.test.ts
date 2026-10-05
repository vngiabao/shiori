import { describe, it, expect } from "vitest";
import { parseSubtitles, cueAt } from "../src/subtitles";

describe("Subtitle files", () => {
  it("reads SRT with Windows line endings and styling tags", () => {
    const srt =
      "﻿1\r\n00:00:01,500 --> 00:00:03,000\r\n<i>おはよう。</i>\r\n\r\n2\r\n00:00:04,000 --> 00:00:06,250\r\n{\\an8}行こうか。\r\nうん。\r\n";
    expect(parseSubtitles(srt)).toEqual([
      { start: 1.5, end: 3, text: "おはよう。" },
      { start: 4, end: 6.25, text: "行こうか。\nうん。" },
    ]);
  });
  it("reads WebVTT without hours and skips the header and blank cues", () => {
    const vtt =
      "WEBVTT\n\n00:01.000 --> 00:02.500 line:90%\nただいま。\n\nNOTE comment\n\n00:03.000 --> 00:03.500\n\n";
    expect(parseSubtitles(vtt)).toEqual([
      { start: 1, end: 2.5, text: "ただいま。" },
    ]);
  });
  it("finds the cue at a moment, holding the last started line", () => {
    const cues = parseSubtitles(
      "1\n00:00:01,000 --> 00:00:02,000\nA\n\n2\n00:00:05,000 --> 00:00:06,000\nB\n",
    );
    expect(cueAt(cues, 0.5)).toBe(-1);
    expect(cueAt(cues, 1.2)).toBe(0);
    expect(cueAt(cues, 3)).toBe(0);
    expect(cueAt(cues, 5.5)).toBe(1);
  });
});
