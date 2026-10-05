import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  SpeakerHigh,
  X,
  EnvelopeSimple,
  Play,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { speak, audioSource } from "./audio";
import type { Word } from "./types";
export const poseNames = [
  "welcome",
  "listen",
  "speak",
  "read",
  "write",
  "think",
  "hint",
  "celebrate",
  "proud",
  "encourage",
  "politeness",
  "review",
  "tea",
  "error",
  "levelup",
  "keepgoing",
] as const;
export type Pose = (typeof poseNames)[number];
export function Mascot({
  pose = "welcome",
  size = 180,
  className = "",
}: {
  pose?: Pose;
  size?: number;
  className?: string;
}) {
  const i = poseNames.indexOf(pose);
  return (
    <span
      role="img"
      aria-label={`Violetto, ${pose}`}
      className={`mascot ${className}`}
      data-pose={pose}
      style={{
        width: size,
        height: size,
        backgroundPosition: `${((i % 4) * 100) / 3}% ${(Math.floor(i / 4) * 100) / 3}%`,
      }}
    />
  );
}
export function Brand({ small = false }: { small?: boolean }) {
  return (
    <a
      href="#today"
      className={`brand ${small ? "small" : ""}`}
      aria-label="Shiori home"
    >
      <img
        className="brand-logo brand-logo-light"
        src="/brand/shiori-signature.svg"
        alt=""
        width="1230"
        height="825"
      />
      <img
        className="brand-logo brand-logo-inverse"
        src="/brand/shiori-signature-inverse.svg"
        alt=""
        width="1230"
        height="825"
      />
    </a>
  );
}
export function Button({
  children,
  onClick,
  secondary = false,
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${secondary ? "button secondary" : "button"} ${className}`}
    >
      {children}
    </button>
  );
}
export function Next({
  children = "Continue",
  onClick,
}: {
  children?: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick}>
      {children}
      <ArrowRight size={20} />
    </Button>
  );
}
export function AudioButton({
  text,
  label = "Listen",
  rate = 1,
  onPlayed,
}: {
  text: string;
  label?: string;
  rate?: number;
  onPlayed?: () => void;
}) {
  const [error, setError] = useState("");
  return (
    <span className="audio-control">
      <button
        className="audio-button"
        onClick={async () => {
          setError("");
          try {
            await speak(text, rate);
            onPlayed?.();
          } catch (e) {
            if ((e as Error).name !== "AbortError")
              setError("Audio could not play. Please try again.");
          }
        }}
        title={audioSource(text)}
      >
        <SpeakerHigh size={20} />
        <span>{label}</span>
      </button>
      {error && (
        <span role="status" className="audio-error">
          {error}
        </span>
      )}
    </span>
  );
}
export function Japanese({
  word,
  furigana = true,
  className = "",
}: {
  word: Word;
  furigana?: boolean;
  className?: string;
}) {
  return (
    <span lang="ja" className={`japanese ${className}`}>
      {word.parts.map((p, i) =>
        furigana && p.reading ? (
          <ruby key={i}>
            {p.text}
            <rt>{p.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </span>
  );
}
/** Renders "{漢字|かんじ}" markup as ruby: kana sit over the kanji only. */
export function Furigana({ text }: { text: string }) {
  const parts = text.split(/(\{[^|}]+\|[^}]+\})/).filter(Boolean);
  return (
    <span lang="ja" className="furigana">
      {parts.map((p, i) => {
        const m = /^\{([^|]+)\|([^}]+)\}$/.exec(p);
        return m ? (
          <ruby key={i}>
            {m[1]}
            <rt>{m[2]}</rt>
          </ruby>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </span>
  );
}
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </header>
  );
}
export function Seal({
  children = "栞",
  small = false,
}: {
  children?: ReactNode;
  small?: boolean;
}) {
  return (
    <span className={`seal ${small ? "seal-small" : ""}`} aria-hidden="true">
      {children}
    </span>
  );
}
export function Envelope({ className = "" }: { className?: string }) {
  return (
    <span className={`envelope ${className}`} aria-hidden="true">
      <EnvelopeSimple weight="thin" />
      <Seal small />
    </span>
  );
}
export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    const previous = document.activeElement as HTMLElement;
    d?.showModal();
    return () => {
      d?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-title">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/**
 * A kana or kanji drawn from KanjiVG centre-lines. Each stroke is inked along
 * its own path, start to end, the way a pen moves; numbers mark where each
 * stroke begins. Reduced motion shows the finished character at once.
 */
export function Stroke({
  char,
  size = 220,
  autoplay = false,
  numbers = true,
  credit = true,
}: {
  char: string;
  size?: number;
  autoplay?: boolean;
  numbers?: boolean;
  credit?: boolean;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [starts, setStarts] = useState<[number, number][]>([]);
  const [error, setError] = useState(false);
  const willPlay = () => autoplay && !reduceMotion();
  const [playing, setPlaying] = useState(willPlay);
  const ink = useRef<SVGGElement>(null);
  const run = useRef<Animation[]>([]);
  useEffect(() => {
    setPaths([]);
    setStarts([]);
    setError(false);
    setPlaying(willPlay());
    const controller = new AbortController();
    fetch(
      `/strokes/${char.codePointAt(0)!.toString(16).padStart(5, "0")}.json`,
      { signal: controller.signal },
    )
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => setPaths(d.paths))
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(true);
          setPlaying(false);
        }
      });
    return () => controller.abort();
    // willPlay reads only autoplay and the motion preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char]);
  useEffect(() => {
    const strokes = [...(ink.current?.querySelectorAll("path") ?? [])];
    setStarts(
      strokes.map((s) => {
        const p = s.getPointAtLength(0);
        return [p.x, p.y];
      }),
    );
    if (autoplay && strokes.length) play();
    return () => run.current.forEach((a) => a.cancel());
    // play() reads the freshly rendered paths; it is stable for this char.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, autoplay]);
  function play() {
    const strokes = [...(ink.current?.querySelectorAll("path") ?? [])];
    run.current.forEach((a) => a.cancel());
    run.current = [];
    if (!strokes.length || reduceMotion()) return;
    setPlaying(true);
    let delay = 120;
    for (const s of strokes) {
      const length = s.getTotalLength();
      const duration = Math.max(240, length * 7);
      s.style.strokeDasharray = `${length}`;
      const a = s.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration,
          delay,
          easing: "cubic-bezier(0.45, 0, 0.25, 1)",
          fill: "backwards",
        },
      );
      run.current.push(a);
      delay += duration + 160;
    }
    run.current.at(-1)!.onfinish = () => setPlaying(false);
  }
  return (
    <figure className="stroke-demo" style={{ width: size }}>
      <div className="stroke-sheet" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 109 109"
          aria-label={`${char}, stroke order`}
          role="img"
        >
          <path d="M54.5 0v109M0 54.5h109" className="stroke-guide" />
          {paths.map((d, i) => (
            <path key={i} d={d} className="stroke-ghost" />
          ))}
          <g ref={ink}>
            {paths.map((d, i) => (
              <path key={i} d={d} className="stroke-ink" />
            ))}
          </g>
          {numbers &&
            starts.map(([x, y], i) => (
              <text
                key={i}
                x={x - 4}
                y={y - 3}
                className="stroke-number"
                aria-hidden="true"
              >
                {i + 1}
              </text>
            ))}
        </svg>
      </div>
      {error ? (
        <figcaption>Stroke data is unavailable for {char}.</figcaption>
      ) : (
        <figcaption>
          <button className="text-button" onClick={play} disabled={playing}>
            {playing ? <ArrowCounterClockwise /> : <Play />}
            {playing ? "Writing…" : "Watch the strokes"}
          </button>
          <span className="muted">
            {paths.length} stroke{paths.length === 1 ? "" : "s"}
          </span>
          {credit && <small>Stroke order: KanjiVG, CC BY-SA 3.0</small>}
        </figcaption>
      )}
    </figure>
  );
}
