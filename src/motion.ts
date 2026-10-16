/* Shiori's motion: a few moments that should feel like events, built with
   GSAP. Everything here is skipped when the device asks for reduced motion.
   Entrances fade with opacity, never visibility, so content stays focusable
   and readable by screen readers while it moves,
   and nothing moves layout: transforms and opacity only, plus a fixed overlay
   for petals that is removed when they land. */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP);

const still = () =>
  typeof window === "undefined" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sakura, Violetto's violet, a little gold leaf.
const petalColours = ["#f4b8c8", "#eaa2b7", "#b9a6e8", "#8f86cf", "#e2c07f"];

/** A short burst of petals from the centre of an element. Fixed overlay, so
 *  nothing in the page moves; the overlay removes itself when they settle. */
export function petalBurst(from: Element | null, count = 14, spread = 1) {
  if (!from || still()) return;
  const box = from.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "petal-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  const petals = Array.from({ length: count }, (_, i) => {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.background = petalColours[i % petalColours.length];
    p.style.left = `${box.left + box.width / 2}px`;
    p.style.top = `${box.top + box.height / 2}px`;
    layer.appendChild(p);
    return p;
  });
  const tl = gsap.timeline({ onComplete: () => layer.remove() });
  tl.fromTo(
    petals,
    { x: 0, y: 0, scale: 0.4, rotation: 0, autoAlpha: 1 },
    {
      x: () => gsap.utils.random(-150, 150) * spread,
      y: () => gsap.utils.random(-140, -50) * spread,
      scale: () => gsap.utils.random(0.7, 1.2),
      rotation: () => gsap.utils.random(-200, 200),
      duration: 0.5,
      ease: "power3.out",
    },
  ).to(petals, {
    y: `+=${110 * spread}`,
    x: () => `+=${gsap.utils.random(-30, 30)}`,
    rotation: () => `+=${gsap.utils.random(-120, 120)}`,
    autoAlpha: 0,
    duration: 0.9,
    ease: "power1.in",
  });
}

/** "No": a quick horizontal shake. Moves on x only, never y. */
export function shake(el: Element | null) {
  if (!el || still()) return;
  gsap.fromTo(
    el,
    { x: 0 },
    {
      keyframes: { x: [0, -7, 7, -5, 5, -2, 0] },
      duration: 0.42,
      ease: "power1.out",
      clearProps: "transform",
    },
  );
}

/** The end of a lesson: the seal is stamped, the page answers the stamp,
 *  Violetto hops in, the lines rise and the counts tick up. */
export function useCompletion(
  scope: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useGSAP(
    () => {
      if (!active || still() || !scope.current) return;
      const root = scope.current;
      const seal = root.querySelector(".seal");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(root.querySelector(".mascot"), {
        y: 40,
        scale: 0.7,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(2.2)",
      })
        .from(
          seal,
          {
            scale: 3,
            rotation: -40,
            opacity: 0,
            duration: 0.32,
            ease: "power4.in",
          },
          0.25,
        )
        // The stamp lands: the card gives a little under it.
        .to(root, { y: 3, duration: 0.06, yoyo: true, repeat: 1 }, ">")
        .add(() => petalBurst(seal, 18, 1.1), "<")
        .from(
          root.querySelectorAll(
            "h1, .earned-level, .violetto-line, .completion-can, .completion-evidence, .completion > p, .completion > .button",
          ),
          { y: 14, opacity: 0, duration: 0.45, stagger: 0.07 },
          "-=0.05",
        );
      root.querySelectorAll<HTMLElement>(".count").forEach((el) => {
        const end = Number(el.dataset.value ?? el.textContent ?? 0);
        const n = { v: 0 };
        tl.to(
          n,
          {
            v: end,
            duration: Math.min(1.2, 0.3 + end * 0.08),
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(n.v));
            },
          },
          "<0.1",
        );
      });
    },
    { scope, dependencies: [active] },
  );
}

/** Today settles in: the round, the letter and the ledger, then the
 *  envelopes are delivered one by one. Violetto breathes in her panel. */
export function useTodayEntrance(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (still() || !scope.current) return;
      const q = gsap.utils.selector(scope);
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(".round-card"), {
        y: 18,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
      })
        .from(
          q(".today-post .postcard, .ledger-slip"),
          { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 },
          0.1,
        )
        .from(
          q(".envelope-path li"),
          {
            y: 10,
            scale: 0.85,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(2)",
          },
          0.2,
        );
      // The current envelope keeps a slow breath so the eye finds it.
      gsap.to(q(".envelope-path .current .path-envelope"), {
        y: -3,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });
      gsap.to(q(".violetto-panel .mascot"), {
        y: -4,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope },
  );
}

/** Library: each level's progress fills in from the left. */
export function usePathBoard(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (still() || !scope.current) return;
      gsap.from(gsap.utils.selector(scope)(".path-bar > span"), {
        scaleX: 0,
        transformOrigin: "0% 50%",
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope },
  );
}
