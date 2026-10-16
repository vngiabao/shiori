/* Answer sounds: a soft tick when a choice is tapped, a rising music-box
   chime for a right answer, a low muted knock for a miss, and a short
   arpeggio when a lesson is finished. Synthesised with Web Audio, so there
   is nothing to download and they work offline.

   One shared AudioContext. Browsers (iOS in particular) only let it start
   from a user gesture, so `unlockSfx()` runs on the first pointer press and
   every sound also tries to resume it. The preference is per device. */

import { audioEpoch, queueReaction } from "./audio";
import type { Reaction } from "./persona";

const KEY = "shiori.answerSounds";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function answerSoundsOn() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}
export function setAnswerSounds(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* private mode: the default stays on */
  }
}

function audio() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.9;
    // A gentle low-pass keeps every sound warm rather than electronic.
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 6000;
    master.connect(tone).connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  return ctx;
}

/** Call from a user gesture so later sounds are allowed to play. */
export function unlockSfx() {
  audio();
}

/** One bell-like note: a sine with a quiet octave partial and a fast decay. */
function bell(at: number, freq: number, peak: number, length: number) {
  const c = ctx!;
  for (const [mult, level] of [
    [1, 1],
    [2, 0.28],
    [3, 0.08],
  ] as const) {
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = "sine";
    osc.frequency.value = freq * mult;
    amp.gain.setValueAtTime(0, at);
    amp.gain.linearRampToValueAtTime(peak * level, at + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + length / mult);
    osc.connect(amp).connect(master!);
    osc.start(at);
    osc.stop(at + length + 0.05);
  }
}

function play(fn: (now: number) => void) {
  if (!answerSoundsOn()) return;
  const c = audio();
  if (!c) return;
  fn(c.currentTime + 0.01);
}

/** A soft wooden tick: tapping a choice. */
export function tapSound() {
  play((t) => {
    const c = ctx!;
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(1300, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.04);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(0.06, t + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    osc.connect(amp).connect(master!);
    osc.start(t);
    osc.stop(t + 0.08);
  });
}

/** Right: two rising music-box notes (C6, G6). Each answer right in a row
 *  lifts the pair a step up the major scale, so a run of answers climbs. */
const ladder = [0, 2, 4, 5, 7, 9, 11, 12];
export function correctSound(streak = 1) {
  const lift =
    2 ** (ladder[Math.min(Math.max(streak - 1, 0), ladder.length - 1)] / 12);
  play((t) => {
    bell(t, 1046.5 * lift, 0.16, 0.5);
    bell(t + 0.09, 1568 * lift, 0.15, 0.7);
  });
}

/** Wrong: a low, muted knock that falls slightly. Never a buzzer. */
export function wrongSound() {
  play((t) => {
    const c = ctx!;
    for (const [start, from, to] of [
      [0, 233, 175],
      [0.11, 196, 147],
    ] as const) {
      const osc = c.createOscillator();
      const amp = c.createGain();
      const soft = c.createBiquadFilter();
      soft.type = "lowpass";
      soft.frequency.value = 900;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(from, t + start);
      osc.frequency.exponentialRampToValueAtTime(to, t + start + 0.16);
      amp.gain.setValueAtTime(0.0001, t + start);
      amp.gain.exponentialRampToValueAtTime(0.22, t + start + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + start + 0.2);
      osc.connect(soft).connect(amp).connect(master!);
      osc.start(t + start);
      osc.stop(t + start + 0.24);
    }
  });
}

/** Lesson finished: C6 E6 G6 C7, landing with the seal. */
export function completeSound(delay = 0) {
  play((t) => {
    [1046.5, 1318.5, 1568, 2093].forEach((f, i) =>
      bell(t + delay + i * 0.085, f, 0.13, i === 3 ? 1.1 : 0.55),
    );
  });
}

/** How long a reaction voice should wait so it starts after the chime. */
export const SFX_LEAD_MS = 260;

/** Run a spoken reaction after the chime has rung, so the two never overlap. */
export function afterChime(fn: () => void, wait = SFX_LEAD_MS) {
  if (!answerSoundsOn()) return fn();
  // If the learner moves on (or anything else plays) before the chime has
  // rung, the reaction is dropped rather than cutting into the next audio.
  const epoch = audioEpoch();
  window.setTimeout(() => {
    if (audioEpoch() === epoch) fn();
  }, wait);
}
/** Violetto's reaction: the line is chosen now, its voice after the chime. */
export function reactAfterChime(
  key: Reaction,
  onError: (e: Error) => void = () => undefined,
  wait = SFX_LEAD_MS,
) {
  const say = queueReaction(key);
  afterChime(() => {
    say().catch(onError);
  }, wait);
}
/** The answer sound that matches a verdict. */
export function verdictSound(correct: boolean, streak = 1) {
  if (correct) correctSound(streak);
  else wrongSound();
}

/* ───────── Letter-world sounds for the playful touches ───────── */
let noise: AudioBuffer | null = null;
function noiseBurst(
  t: number,
  length: number,
  low: number,
  high: number,
  peak: number,
) {
  const c = ctx!;
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource();
  src.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = Math.sqrt(low * high);
  band.Q.value = Math.sqrt(low * high) / (high - low);
  const amp = c.createGain();
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(peak, t + 0.003);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(band).connect(amp).connect(master!);
  src.start(t);
  src.stop(t + length + 0.02);
}
function thump(t: number, freq: number, peak: number, length: number) {
  const c = ctx!;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.6, t);
  osc.frequency.exponentialRampToValueAtTime(freq, t + 0.03);
  amp.gain.setValueAtTime(0.0001, t);
  amp.gain.exponentialRampToValueAtTime(peak, t + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(amp).connect(master!);
  osc.start(t);
  osc.stop(t + length + 0.02);
}
/** A rubber postmark landing on paper. */
export function stampSound() {
  play((t) => {
    thump(t, 110, 0.35, 0.16);
    noiseBurst(t, 0.07, 300, 1800, 0.18);
  });
}
/** Violetto's typewriter: a key, the space bar, a backspace. */
export function keySound(kind: "key" | "space" | "back" = "key") {
  play((t) => {
    const v = 0.85 + Math.random() * 0.3;
    if (kind === "space") {
      thump(t, 140, 0.16, 0.08);
      noiseBurst(t, 0.05, 600, 2400, 0.08);
    } else {
      noiseBurst(t, 0.035, 2200 * v, 5200 * v, kind === "back" ? 0.07 : 0.11);
      thump(t + 0.012, 260 * v, 0.07, 0.05);
    }
  });
}
/** The carriage-return bell at the end of a typed line. */
export function bellSound() {
  play((t) => bell(t, 2637, 0.09, 0.9));
}
/** A sheet of letter paper sliding out of its envelope. */
export function paperSound() {
  play((t) => {
    noiseBurst(t, 0.22, 1500, 6000, 0.05);
    noiseBurst(t + 0.12, 0.28, 900, 4000, 0.04);
  });
}
