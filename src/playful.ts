/* Playful touches: the small, smart behaviours that make Shiori feel alive.
   A paper crane follows the pointer, clicks on empty paper leave a postmark,
   answer boxes sound like Violetto's typewriter, she watches the pointer and
   reacts when poked, and Today follows the clock and the season.

   Everything is decoration over the real interface: fixed overlays with
   pointer-events none, transforms and opacity only. Skipped entirely when
   the device asks for reduced motion or the learner turns it off. */
import { gsap } from "gsap";
import { useEffect, type RefObject } from "react";
import { poseNames, type Pose } from "./components";
import { bellSound, keySound, paperSound, stampSound } from "./sfx";

const KEY = "shiori.playful";
export function playfulOn() {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}
export function setPlayful(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* private mode keeps the default */
  }
  window.dispatchEvent(new Event("shiori:playful"));
}
const still = () =>
  typeof window === "undefined" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(pointer: fine)").matches;
const active = () => playfulOn() && !still();
const inLesson = () => Boolean(document.querySelector(".focus-shell"));

/* ───────── Postmark stamps on empty paper ───────── */
const marks = ["済", "〒", "栞", "届", "便"];
let markIndex = 0;
const interactive =
  "button, a, input, textarea, select, label, summary, details, video, audio, [role='button'], [role='dialog'], [contenteditable], .answer-option, .gloss-token, .mascot, .kana-grid, .letter-body, .tabs";

function stamp(x: number, y: number) {
  const layer = document.createElement("div");
  layer.className = "stamp-layer";
  layer.setAttribute("aria-hidden", "true");
  const mark = document.createElement("span");
  mark.className = "click-stamp";
  mark.textContent = marks[markIndex++ % marks.length];
  mark.style.left = `${x}px`;
  mark.style.top = `${y}px`;
  layer.appendChild(mark);
  document.body.appendChild(layer);
  const turn = gsap.utils.random(-22, 22);
  stampSound();
  gsap
    .timeline({ onComplete: () => layer.remove() })
    .fromTo(
      mark,
      { scale: 1.9, rotation: turn - 14, opacity: 0 },
      { scale: 1, rotation: turn, opacity: 0.92, duration: 0.13, ease: "power4.in" },
    )
    .to(mark, { scale: 1.04, duration: 0.06, yoyo: true, repeat: 1 })
    .to(mark, { opacity: 0, duration: 0.9, ease: "power1.in" }, "+=0.9");
}

function onStampPress(e: PointerEvent) {
  if (e.button !== 0 || !active() || inLesson()) return;
  const target = e.target as Element | null;
  if (!target?.closest("main, .welcome") || target.closest(interactive)) return;
  if (document.querySelectorAll(".stamp-layer").length > 10) return;
  stamp(e.clientX, e.clientY);
}

/* ───────── A paper crane that follows the pointer ───────── */
const craneSvg = `
<svg viewBox="0 0 64 44" width="56" height="38" aria-hidden="true">
  <g stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
    <polygon class="crane-wing crane-far" points="33,24 47,3 39,24" />
    <polygon class="crane-paper" points="3,9 25,29 29,30" />
    <polygon class="crane-paper" points="35,30 40,29 58,7" />
    <polygon class="crane-paper" points="58,7 63.5,14 56.5,10.5" />
    <polygon class="crane-paper" points="24,29 32,39 40,29 32,24" />
    <line x1="32" y1="24" x2="32" y2="39" stroke-width=".6" opacity=".45" />
    <polygon class="crane-wing crane-near" points="32,25 14,1 37,23" />
  </g>
  <circle cx="35" cy="33" r="1.5" class="crane-seal" />
</svg>
<span class="crane-z" aria-hidden="true">z</span>`;

function startCrane() {
  if (!finePointer()) return () => undefined;
  const crane = document.createElement("div");
  crane.className = "paper-crane";
  crane.innerHTML = craneSvg;
  document.body.appendChild(crane);
  let px = innerWidth / 2,
    py = innerHeight / 2,
    tx = px,
    ty = py,
    seen = false,
    facing = 1,
    restSince = performance.now(),
    raf = 0;
  const move = (e: PointerEvent) => {
    tx = e.clientX + 26;
    ty = e.clientY + 22;
    if (!seen) {
      px = tx;
      py = ty;
      seen = true;
    }
  };
  const leave = (e: MouseEvent) => {
    if (!e.relatedTarget) seen = false;
  };
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const show = seen && active() && !inLesson();
    crane.classList.toggle("shown", show);
    if (!show) return;
    const dx = tx - px,
      dy = ty - py,
      far = Math.hypot(dx, dy);
    // Ease toward the pointer, but never faster than a bird would fly.
    const step = Math.min(far * 0.09, 14);
    if (far > 1) {
      px += (dx / far) * step;
      py += (dy / far) * step;
    }
    if (Math.abs(dx) > 6) facing = dx < 0 ? -1 : 1;
    const flying = far > 5;
    if (flying) restSince = now;
    const resting = now - restSince;
    crane.classList.toggle("flying", flying);
    crane.classList.toggle("perched", !flying && resting < 6000);
    crane.classList.toggle("asleep", !flying && resting >= 6000);
    const tilt = Math.max(-18, Math.min(18, dy * 0.35));
    crane.style.transform = `translate(${px - 28}px, ${py - 19}px) scaleX(${facing}) rotate(${tilt * facing}deg)`;
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("mouseout", leave);
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", move);
    document.removeEventListener("mouseout", leave);
    crane.remove();
  };
}

/* ───────── Typewriter keys in answer and reply boxes ───────── */
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t || e.ctrlKey || e.metaKey || e.altKey) return;
  const typing =
    t instanceof HTMLTextAreaElement ||
    (t instanceof HTMLInputElement &&
      ["text", "search", ""].includes(t.type) &&
      !t.readOnly);
  if (!typing) return;
  if (e.key === "Enter") {
    if (t instanceof HTMLTextAreaElement) bellSound();
    return;
  }
  if (e.key === " ") keySound("space");
  else if (e.key === "Backspace") keySound("back");
  else if (e.key.length === 1 || e.key === "Process") keySound("key");
}

let started = false;
/** Installs the global touches once, from main.tsx. */
export function startPlayful() {
  if (started || typeof window === "undefined") return;
  started = true;
  document.addEventListener("pointerdown", onStampPress, true);
  document.addEventListener("keydown", onKey, true);
  startCrane();
}

/* ───────── Violetto: watching, poses, pokes ───────── */
function poseAt(el: HTMLElement, pose: Pose) {
  const i = poseNames.indexOf(pose);
  el.style.backgroundPosition = `${((i % 4) * 100) / 3}% ${(Math.floor(i / 4) * 100) / 3}%`;
}
/** Show a pose for a moment, then hand the figure back to React's pose. */
export function flashPose(el: HTMLElement, pose: Pose, ms = 1400) {
  const back = el.dataset.pose as Pose | undefined;
  poseAt(el, pose);
  window.setTimeout(() => {
    if (el.isConnected) poseAt(el, (el.dataset.pose as Pose) ?? back ?? "welcome");
  }, ms);
}

/** She turns a little toward the pointer, the way the login bear follows
 *  the text field. Whole-figure lean, since her art is painted, not rigged. */
export function useWatcher(ref: RefObject<HTMLElement | null>, strength = 1) {
  useEffect(() => {
    const el = ref.current;
    if (!el || still() || !finePointer()) return;
    gsap.set(el, { transformPerspective: 800 });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" });
    const clamp = gsap.utils.clamp(-1, 1);
    const move = (e: PointerEvent) => {
      if (!playfulOn()) return;
      const b = el.getBoundingClientRect();
      const dx = clamp((e.clientX - (b.left + b.width / 2)) / (innerWidth / 2));
      const dy = clamp((e.clientY - (b.top + b.height / 2)) / (innerHeight / 2));
      ry(dx * 14 * strength);
      rx(-dy * 8 * strength);
      x(dx * 6 * strength);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      gsap.killTweensOf(el, "rotationX,rotationY,x");
      gsap.set(el, { clearProps: "transform" });
    };
  }, [ref, strength]);
}

/** Tap her and she reacts; five quick pokes and she is flustered. */
export function usePoke(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pokes: number[] = [];
    const moods: Pose[] = ["proud", "celebrate", "encourage", "think", "hint"];
    const poke = () => {
      if (!playfulOn()) return;
      const now = performance.now();
      pokes = [...pokes.filter((t) => now - t < 3000), now];
      const pose = pokes.length >= 5 ? "error" : moods[pokes.length % moods.length];
      if (pokes.length >= 5) pokes = [];
      flashPose(el, pose, pose === "error" ? 1800 : 1200);
      if (!still())
        gsap.fromTo(el, { y: 0 }, { y: -10, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" });
    };
    el.addEventListener("click", poke);
    el.style.cursor = "pointer";
    return () => el.removeEventListener("click", poke);
  }, [ref]);
}

/* ───────── Today: the clock and the season ───────── */
export function daypart(hour = new Date().getHours()) {
  return hour < 5 ? "night" : hour < 10 ? "dawn" : hour < 17 ? "day" : hour < 20 ? "dusk" : "night";
}
const maple =
  '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="M12 1.5l1.7 4.4 3.5-1.7-1 3.9 4.1-.6-2.5 3.1 3.1 1.6-3.9 1.2 1.2 2.7-3.5-.8-.9 3.4H12.8V22h-1.6v-3.3H9.4l-.9-3.4-3.5.8 1.2-2.7-3.9-1.2 3.1-1.6-2.5-3.1 4.1.6-1-3.9 3.5 1.7z"/></svg>';

/** A few slow particles for the season drift across Today's opening. */
export function useSeason(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = ref.current;
    if (!host || !active()) return;
    const month = new Date().getMonth() + 1;
    const season =
      month >= 3 && month <= 5 ? "spring" : month <= 8 && month >= 6 ? "summer" : month >= 9 && month <= 11 ? "autumn" : "winter";
    const layer = document.createElement("div");
    layer.className = `season-layer season-${season}`;
    layer.setAttribute("aria-hidden", "true");
    host.appendChild(layer);
    const count = season === "summer" ? 9 : 7;
    const tweens: gsap.core.Tween[] = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "season-bit";
      if (season === "autumn") p.innerHTML = maple;
      layer.appendChild(p);
      const w = host.clientWidth,
        h = host.clientHeight;
      if (season === "summer") {
        gsap.set(p, { x: gsap.utils.random(0, w), y: gsap.utils.random(h * 0.2, h), opacity: 0 });
        tweens.push(
          gsap.to(p, {
            x: "+=" + gsap.utils.random(-60, 60),
            y: "-=" + gsap.utils.random(20, 70),
            opacity: gsap.utils.random(0.5, 0.95),
            duration: gsap.utils.random(2.5, 4.5),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 3),
          }),
        );
        continue;
      }
      const startX = gsap.utils.random(-0.1, 0.9) * w;
      gsap.set(p, { x: startX, y: -30, rotation: gsap.utils.random(0, 360), scale: gsap.utils.random(0.7, 1.15) });
      tweens.push(
        gsap.to(p, {
          y: h + 30,
          x: startX + gsap.utils.random(60, 220),
          rotation: "+=" + gsap.utils.random(120, 360),
          duration: gsap.utils.random(11, 18),
          repeat: -1,
          ease: "none",
          delay: gsap.utils.random(0, 10),
        }),
      );
    }
    return () => {
      tweens.forEach((t) => t.kill());
      layer.remove();
    };
  }, [ref]);
}

/** Opening a letter: the wax seal breaks and the sheet rises out. */
export function openLetter(sheet: HTMLElement | null) {
  if (!sheet || !active()) return;
  const seal = document.createElement("span");
  seal.className = "letter-wax";
  seal.setAttribute("aria-hidden", "true");
  seal.innerHTML = '<i class="wax-left">栞</i><i class="wax-right">栞</i>';
  sheet.appendChild(seal);
  const [left, right] = seal.querySelectorAll("i");
  paperSound();
  gsap
    .timeline({ onComplete: () => seal.remove() })
    .from(sheet, { y: 26, opacity: 0, duration: 0.5, ease: "power3.out" })
    .to(left, { x: -18, rotation: -28, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.35)
    .to(right, { x: 18, rotation: 28, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.35);
}
