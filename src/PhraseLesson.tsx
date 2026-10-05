import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  Play,
  SpeakerHigh,
  X,
} from "@phosphor-icons/react";
import { dialogues, exercises, wordMap, words } from "./content";
import {
  AudioButton,
  Button,
  Furigana,
  Japanese,
  Mascot,
  Seal,
} from "./components";
import { db, finishLesson, recordAttempt } from "./db";
import { postalProgress } from "./rewards";
import { romajiVisible } from "./learning";
import {
  playLines,
  speak,
  speakReaction,
  stopLines,
  wordAudioText,
} from "./audio";
import { ReactionLine, ViolettoBubble } from "./Violetto";
import { reactionFor } from "./persona";
import { plain } from "./text";
import type {
  Dialogue,
  Exercise,
  Lesson,
  Memory,
  Profile,
  Skill,
  Support,
  Word,
} from "./types";
import "./phrase-lesson.css";

/* A phrase lesson in the textbook order: meet the words, hear them in a scene,
   then use them in new sentences. Words are never quizzed straight after
   meeting them; recognition checks come back later, between other tasks. */
export type Step =
  | { kind: "meet"; words: Word[] }
  | { kind: "scene"; dialogue: Dialogue }
  | { kind: "exercise"; ex: Exercise; lastForScene: boolean }
  | { kind: "check"; word: Word; skill: Skill };

export const hasPractice = (lesson: Lesson) =>
  lesson.kind === "phrase" && exercises.some((x) => x.lesson === lesson.id);

function buildSteps(lesson: Lesson, mode: Skill): Step[] {
  const lessonWords = lesson.words.map((id) => wordMap[id]).filter(Boolean);
  const steps: Step[] = [];
  for (let i = 0; i < lessonWords.length; i += 4)
    steps.push({ kind: "meet", words: lessonWords.slice(i, i + 4) });
  const scene = dialogues.find((d) => d.lesson === lesson.id);
  if (scene) steps.push({ kind: "scene", dialogue: scene });
  const own = exercises.filter((x) => x.lesson === lesson.id);
  // Words already practised inside a sentence don't need a bare check as well;
  // the rest get one each, at most eight, so sentences carry most of the lesson.
  const tested = new Set(own.map((x) => x.words[0]));
  const checks: Step[] = lessonWords
    .filter((word) => !tested.has(word.id))
    .slice(0, 8)
    .map((word, i) => ({
      kind: "check",
      word,
      skill: mode === "listening" || i % 2 ? "listening" : "reading",
    }));
  // Recognition checks are spread evenly between the exercises, starting after
  // the second, so each word returns a few tasks after it was met.
  const perGap = Math.max(
    1,
    Math.ceil(checks.length / Math.max(1, own.length - 1)),
  );
  own.forEach((ex, i) => {
    const lastForScene =
      !!ex.dialogue &&
      !own.slice(i + 1).some((later) => later.dialogue === ex.dialogue);
    steps.push({ kind: "exercise", ex, lastForScene });
    if (i >= 1) steps.push(...checks.splice(0, perGap));
  });
  steps.push(...checks);
  return steps;
}

/* Mixed review: each due memory comes back as a task in a new sentence when the
   course has one for that word and skill (a gap, a reply, a sentence to build),
   rotating between them; otherwise as a plain recognition check. */
export function buildReviewSteps(memories: Memory[], limit = 20): Step[] {
  const now = Date.now();
  return memories
    .filter((m) => m.due <= now && wordMap[m.itemId])
    .sort((a, b) => a.due - b.due)
    .flatMap((m): Step[] => {
      const tasks = exercises.filter(
        (x) => x.words[0] === m.itemId && x.skill === m.skill,
      );
      if (tasks.length) {
        const ex = tasks[(m.successes + m.failures) % tasks.length];
        return [{ kind: "exercise", ex, lastForScene: true }];
      }
      return m.skill === "reading" || m.skill === "listening"
        ? [{ kind: "check", word: wordMap[m.itemId], skill: m.skill }]
        : [];
    })
    .slice(0, limit);
}
export const reviewLesson: Lesson = {
  id: "review",
  title: "Mixed review",
  description: "Due memories, back in new sentences.",
  kind: "phrase",
  words: [],
  minutes: 10,
  canDo: "Recall familiar Japanese in a new sentence",
};

export function PhraseLesson({
  lesson,
  profile,
  mode = "reading",
  review,
  onClose,
}: {
  lesson: Lesson;
  profile: Profile;
  mode?: Skill;
  /** Steps for a review session; review never marks a lesson finished. */
  review?: Step[];
  onClose: () => void;
}) {
  const steps = useMemo(
    () => review ?? buildSteps(lesson, mode),
    [lesson, mode, review],
  );
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | boolean | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [support, setSupport] = useState<Support>("none");
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tally, setTally] = useState({ unaided: 0, supported: 0, missed: 0 });
  const [done, setDone] = useState<{
    level: number | null;
    awards: string[];
  } | null>(null);
  const saving = useRef(false);
  const step = steps[index];
  const learnRomaji = romajiVisible(profile.created, profile.romaji);

  // Choices for a recognition check: meanings of other phrases, lesson-mates first.
  const checkOptions = useMemo(() => {
    if (step?.kind !== "check") return [];
    const others = [
      ...lesson.words.map((id) => wordMap[id]),
      ...words.filter((w) => !/^(h|k|sound)-/.test(w.id) && w.id.length > 2),
    ].filter(
      (w) => w && w.id !== step.word.id && w.meaning !== step.word.meaning,
    );
    const pool = [...new Set(others.map((w) => w.meaning))];
    const start = index % Math.max(1, pool.length - 3);
    const wrong = pool.slice(start, start + 3);
    const all = [step.word.meaning, ...wrong];
    return all.sort((a, b) => hash(a + index) - hash(b + index));
  }, [step, index, lesson.words]);

  const exercise = step?.kind === "exercise" ? step.ex : null;
  const options =
    step?.kind === "check" ? checkOptions : (exercise?.options ?? []);
  const orderTiles = useMemo(() => {
    if (exercise?.type !== "order") return [];
    const tiles = exercise.tiles!.map((t, i) => ({ t, i }));
    return tiles.sort(
      (a, b) => hash(a.t + exercise.id) - hash(b.t + exercise.id),
    );
  }, [exercise]);
  const ready =
    exercise?.type === "order"
      ? picked.length === exercise.tiles!.length
      : choice !== null;

  // Listening tasks play once on arrival; replay stays one tap away.
  useEffect(() => {
    stopLines();
    if (!step) return;
    const scene =
      step.kind === "exercise" && step.ex.dialogue
        ? dialogues.find((d) => d.id === step.ex.dialogue)
        : null;
    if (step.kind === "exercise" && step.ex.type === "reply")
      speak(plain(step.ex.line!)).catch(() => undefined);
    else if (scene && step.kind === "exercise")
      playLines(scene.lines.map((l) => plain(l.line))).catch(() => undefined);
    else if (step.kind === "check" && step.skill === "listening")
      speak(wordAudioText(step.word)).catch(() => undefined);
    return () => stopLines();
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (
        busy ||
        e.repeat ||
        e.isComposing ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return;
      if (el.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (/^[1-4]$/.test(e.key) && verdict === null && options.length) {
        const n = Number(e.key) - 1;
        if (n < options.length) {
          e.preventDefault();
          setChoice(n);
        }
      }
      if (
        e.key === "Enter" &&
        (!el.closest("button,a") || el.closest(".answer-option"))
      ) {
        e.preventDefault();
        if (verdict !== null) next();
        else if (ready && (step.kind === "exercise" || step.kind === "check"))
          void check();
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });

  function reset() {
    setChoice(null);
    setPicked([]);
    setSupport("none");
    setVerdict(null);
    setError("");
  }
  async function next() {
    stopLines();
    if (index + 1 < steps.length) {
      reset();
      setIndex(index + 1);
      window.scrollTo(0, 0);
      return;
    }
    if (review) {
      setDone({ level: null, awards: [] });
      speakReaction("complete").catch(() => undefined);
      return;
    }
    setBusy(true);
    try {
      const [history, before] = await Promise.all([
        db.attempts.toArray(),
        db.completions.toArray(),
      ]);
      const was = postalProgress(history, before);
      await finishLesson(lesson.id, lesson.canDo);
      const now = postalProgress(history, await db.completions.toArray());
      setDone({
        level: now.level > was.level ? now.level : null,
        awards: now.stamps
          .filter(
            (s) =>
              s.at !== undefined &&
              was.stamps.find((b) => b.id === s.id)?.at === undefined,
          )
          .map((s) => s.title),
      });
      speakReaction("complete").catch(() => undefined);
    } catch {
      setError("Could not save completion. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function meet(ws: Word[]) {
    setBusy(true);
    try {
      for (const w of ws)
        await recordAttempt({
          itemId: w.id,
          skill: mode,
          correct: null,
          support: "meaning",
          source: lesson.id,
        });
      await next();
    } catch {
      setError("Could not save these new words. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function check() {
    if (saving.current || verdict !== null) return;
    let correct: boolean;
    let itemId: string;
    let skill: Skill;
    if (step.kind === "check") {
      correct = options[choice as number] === step.word.meaning;
      itemId = step.word.id;
      skill = step.skill;
    } else if (step.kind === "exercise") {
      const x = step.ex;
      correct =
        x.type === "order"
          ? picked.map((i) => plain(x.tiles![i])).join("") ===
            x.tiles!.map(plain).join("")
          : choice === x.answer;
      itemId = x.words[0];
      skill = x.skill;
    } else return;
    saving.current = true;
    setBusy(true);
    try {
      await recordAttempt({
        itemId,
        skill,
        correct,
        support,
        source: lesson.id,
      });
      setVerdict(correct);
      setTally((t) =>
        support !== "none"
          ? { ...t, supported: t.supported + 1 }
          : correct
            ? { ...t, unaided: t.unaided + 1 }
            : { ...t, missed: t.missed + 1 },
      );
      speakReaction(reactionFor(correct, support !== "none")).catch(
        () => undefined,
      );
    } catch {
      setError("Your answer could not be saved. Try again before continuing.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  if (done)
    return (
      <main id="main-content" className="completion">
        <Seal>済</Seal>
        <Mascot pose="levelup" size={220} />
        <h1>{review ? "Review finished." : "Lesson delivered."}</h1>
        {done.level !== null && (
          <p className="earned-level" role="status">
            Correspondence level {done.level}
            {done.awards.length > 0 && (
              <span>{done.awards.join(" · ")} postmark collected</span>
            )}
          </p>
        )}
        <ReactionLine kind="complete" />
        <p className="completion-can">
          {review
            ? "Each answer reschedules its own memory."
            : "You practised this goal:"}
          <br />
          <strong>
            {review ? `${steps.length} items reviewed` : lesson.canDo}
          </strong>
        </p>
        <div className="completion-evidence">
          <span>{tally.unaided} unaided answers</span>
          <span>{tally.supported} with support</span>
          <span>{tally.missed} to review</span>
        </div>
        <p>
          Missed items come back in review. Only unaided answers strengthen a
          memory.
        </p>
        <Button onClick={onClose}>
          Back to my desk
          <ArrowRight />
        </Button>
      </main>
    );

  return (
    <main
      id="main-content"
      className={`lesson-shell focus-shell phrase-lesson ${verdict !== null ? "has-verdict" : ""}`}
    >
      <header className="lesson-top">
        <button
          className="text-button"
          onClick={() => {
            stopLines();
            onClose();
          }}
        >
          <X />
          Leave lesson
        </button>
        <span>{lesson.title}</span>
        <span>
          {index + 1} / {steps.length}
        </span>
      </header>
      <div
        className="lesson-progress"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuenow={index}
        aria-valuemin={0}
        aria-valuemax={steps.length}
      >
        <span style={{ width: `${(index / steps.length) * 100}%` }} />
      </div>
      <div className="lesson-body">
        <div className="lesson-main">
          {step.kind === "meet" ? (
            <MeetWords
              words={step.words}
              learnRomaji={learnRomaji}
              busy={busy}
              onNext={() => meet(step.words)}
            />
          ) : step.kind === "scene" ? (
            <Scene dialogue={step.dialogue} onNext={next} />
          ) : step.kind === "check" ? (
            <>
              <h1>
                {step.skill === "listening"
                  ? "What did you hear?"
                  : "What does it mean?"}
              </h1>
              <div className="quiz-prompt">
                {step.skill === "listening" ? (
                  <AudioButton
                    text={wordAudioText(step.word)}
                    label="Play again"
                  />
                ) : (
                  <Japanese
                    word={step.word}
                    furigana={support === "furigana"}
                  />
                )}
              </div>
              {support !== "none" && (
                <p className="hint-text" lang="ja">
                  {step.word.text}
                  <span>
                    Supported attempt. Still useful, and saved separately.
                  </span>
                </p>
              )}
              <SupportButton
                hidden={verdict !== null}
                label={
                  step.skill === "listening" ? "Show the words" : "Show reading"
                }
                onClick={() =>
                  setSupport(
                    step.skill === "listening" ? "transcript" : "furigana",
                  )
                }
              />
              <Options
                options={options}
                choice={choice}
                answer={options.indexOf(step.word.meaning)}
                verdict={verdict}
                busy={busy}
                onPick={setChoice}
              />
            </>
          ) : (
            <ExerciseBody
              ex={step.ex}
              choice={choice}
              setChoice={setChoice}
              picked={picked}
              setPicked={setPicked}
              tiles={orderTiles}
              support={support}
              setSupport={setSupport}
              verdict={verdict}
              busy={busy}
            />
          )}
          {verdict !== null &&
            step.kind === "exercise" &&
            step.lastForScene && (
              <Transcript
                dialogue={dialogues.find((d) => d.id === step.ex.dialogue)!}
              />
            )}
          {(step.kind === "exercise" || step.kind === "check") && (
            <div className="check-action">
              <Button
                disabled={!ready || busy || verdict !== null}
                onClick={check}
              >
                Check answer <Check />
              </Button>
              {exercise?.type !== "order" && (
                <span>1–4 to select · Enter to check</span>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="error-text">
              {error}
            </p>
          )}
        </div>
        <aside className="lesson-companion" aria-live="polite">
          <Mascot
            pose={
              verdict === false
                ? "encourage"
                : verdict === true
                  ? support === "none"
                    ? "celebrate"
                    : "hint"
                  : step.kind === "scene" || exercise?.skill === "listening"
                    ? "listen"
                    : step.kind === "meet"
                      ? "read"
                      : "think"
            }
            size={132}
          />
          {verdict !== null && (
            <ViolettoBubble
              key={`${index}-${verdict}`}
              kind={reactionFor(verdict, support !== "none")}
            />
          )}
        </aside>
      </div>
      {verdict !== null && (
        <div className={`verdict-bar ${verdict ? "good" : "try-again"}`}>
          <div className="verdict-inner">
            <div className="verdict-evidence" role="status">
              <strong>
                {verdict ? <Check /> : <X />}
                {verdict ? "Right." : "Not quite."}
              </strong>
              <Feedback step={step} verdict={verdict} support={support} />
            </div>
            <Button onClick={next} disabled={busy}>
              Continue <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

function MeetWords({
  words: ws,
  learnRomaji,
  busy,
  onNext,
}: {
  words: Word[];
  learnRomaji: boolean;
  busy: boolean;
  onNext: () => void;
}) {
  return (
    <>
      <h1>New words</h1>
      <p className="task-context">
        Listen to each one and say it once. They come back later in new
        sentences.
      </p>
      <ul className="word-list">
        {ws.map((w) => (
          <li key={w.id}>
            <span className="word-list-ja">
              <Japanese word={w} />
            </span>
            <span className="word-list-meta">
              {learnRomaji && <span className="romaji">{w.romaji}</span>}
              <span>{w.meaning}</span>
              {w.register !== "neutral" && (
                <span className="register">{w.register}</span>
              )}
            </span>
            <AudioButton text={wordAudioText(w)} label="Hear" />
          </li>
        ))}
      </ul>
      <Button onClick={onNext} disabled={busy}>
        I’ve met these
        <ArrowRight />
      </Button>
    </>
  );
}

/* The first listen: speakers are named, their words hidden until the questions are done. */
function Scene({
  dialogue,
  onNext,
}: {
  dialogue: Dialogue;
  onNext: () => void;
}) {
  const [speaking, setSpeaking] = useState(-1);
  const [heard, setHeard] = useState(false);
  const play = () =>
    playLines(
      dialogue.lines.map((l) => plain(l.line)),
      (i) => {
        setSpeaking(i);
        if (i === -1) setHeard(true);
      },
    ).catch(() => setHeard(true));
  useEffect(() => {
    void play();
    return () => stopLines();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <h1>Listen to the conversation.</h1>
      <p className="task-context">
        {dialogue.scene} No text yet: catch what you can, then answer.
      </p>
      <ol className="scene-lines" aria-label="Speakers">
        {dialogue.lines.map((l, i) => (
          <li key={i} className={i === speaking ? "speaking" : ""}>
            <strong>{l.speaker}</strong>
            <span className="masked" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <div className="actions">
        <Button secondary onClick={play}>
          <Play /> Play again
        </Button>
        <Button onClick={onNext} disabled={!heard}>
          Answer questions
          <ArrowRight />
        </Button>
      </div>
    </>
  );
}

function ExerciseBody({
  ex,
  choice,
  setChoice,
  picked,
  setPicked,
  tiles,
  support,
  setSupport,
  verdict,
  busy,
}: {
  ex: Exercise;
  choice: number | boolean | null;
  setChoice: (c: number | boolean) => void;
  picked: number[];
  setPicked: (p: number[]) => void;
  tiles: { t: string; i: number }[];
  support: Support;
  setSupport: (s: Support) => void;
  verdict: boolean | null;
  busy: boolean;
}) {
  const scene = ex.dialogue
    ? dialogues.find((d) => d.id === ex.dialogue)
    : undefined;
  const heading = {
    cloze: "Fill the gap.",
    reply: "Choose the natural reply.",
    dialogue: ex.prompt,
    truefalse: "True or false?",
    order: "Build the sentence.",
    choice: ex.prompt ?? "Which fits best?",
  }[ex.type];
  const locked = verdict !== null || busy;
  return (
    <>
      <h1>{heading}</h1>
      {ex.context && <p className="task-context">{ex.context}</p>}
      {scene && (
        <Button
          secondary
          onClick={() => playLines(scene.lines.map((l) => plain(l.line)))}
        >
          <SpeakerHigh /> Play the conversation
        </Button>
      )}
      {ex.type === "cloze" && (
        <p className="cloze-line" lang="ja">
          {ex.line!.split("＿＿").map((part, i) => (
            <span key={i}>
              {i > 0 && (
                <span
                  className={`cloze-gap ${choice !== null ? "filled" : ""}`}
                >
                  {choice !== null ? (
                    <Furigana text={ex.options![choice as number]} />
                  ) : (
                    "　"
                  )}
                </span>
              )}
              <Furigana text={part} />
            </span>
          ))}
        </p>
      )}
      {ex.type === "reply" && (
        <>
          <AudioButton text={plain(ex.line!)} label="Play again" />
          {support !== "none" || verdict !== null ? (
            <p className="reply-line">
              <Furigana text={ex.line!} />
            </p>
          ) : (
            <SupportButton
              hidden={false}
              label="Show the line"
              onClick={() => setSupport("transcript")}
            />
          )}
        </>
      )}
      {ex.type === "truefalse" && <p className="tf-statement">{ex.prompt}</p>}
      {ex.type === "order" && (
        <>
          <p className="task-context">
            Say: <strong>{ex.meaning}</strong>
          </p>
          <div className="order-answer" aria-label="Your sentence">
            {picked.length === 0 && (
              <span className="order-placeholder">Tap the words in order</span>
            )}
            {picked.map((i, n) => (
              <button
                key={n}
                className="order-tile placed"
                disabled={locked}
                onClick={() => setPicked(picked.filter((_, k) => k !== n))}
                aria-label={`Remove ${plain(ex.tiles![i])}`}
              >
                <Furigana text={ex.tiles![i]} />
              </button>
            ))}
          </div>
          <div className="order-pool">
            {tiles.map(({ t, i }) => (
              <button
                key={i}
                className="order-tile"
                disabled={locked || picked.includes(i)}
                onClick={() => setPicked([...picked, i])}
              >
                <Furigana text={t} />
              </button>
            ))}
          </div>
        </>
      )}
      {ex.type === "truefalse" ? (
        <div className="answer-options tf-options">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              aria-pressed={choice === v}
              disabled={locked}
              className={`answer-option ${choice === v ? "selected" : ""} ${verdict !== null && ex.answer === v ? "correct" : ""}`}
              onClick={() => setChoice(v)}
            >
              <span aria-hidden="true">{v ? "◯" : "✕"}</span>
              {v ? "True" : "False"}
            </button>
          ))}
        </div>
      ) : ex.type !== "order" ? (
        <Options
          options={ex.options!}
          choice={choice as number | null}
          answer={ex.answer as number}
          verdict={verdict}
          busy={busy}
          japanese={ex.type !== "dialogue"}
          onPick={setChoice}
        />
      ) : null}
    </>
  );
}

function Options({
  options,
  choice,
  answer,
  verdict,
  busy,
  japanese = false,
  onPick,
}: {
  options: string[];
  choice: number | boolean | null;
  answer: number;
  verdict: boolean | null;
  busy: boolean;
  japanese?: boolean;
  onPick: (n: number) => void;
}) {
  return (
    <div className="answer-options">
      {options.map((o, i) => (
        <button
          key={o}
          aria-pressed={choice === i}
          disabled={busy || verdict !== null}
          className={`answer-option ${choice === i ? "selected" : ""} ${verdict !== null && i === answer ? "correct" : ""}`}
          onClick={() => onPick(i)}
        >
          <span>{i + 1}</span>
          {japanese ? <Furigana text={o} /> : o}
          {verdict !== null && i === answer && <Check />}
        </button>
      ))}
    </div>
  );
}

function SupportButton({
  hidden,
  label,
  onClick,
}: {
  hidden: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="text-button hint-button"
      style={{ visibility: hidden ? "hidden" : "visible" }}
      disabled={hidden}
      onClick={onClick}
    >
      <Eye size={18} />
      {label}
    </button>
  );
}

function Feedback({
  step,
  verdict,
  support,
}: {
  step: Step;
  verdict: boolean;
  support: Support;
}) {
  const evidence =
    support !== "none"
      ? "Help was shown, so this counts as supported."
      : verdict
        ? "Recalled without help."
        : "It comes back in review soon.";
  if (step.kind === "check")
    return (
      <>
        <p>{evidence}</p>
        <div className="correct-answer">
          <span>
            <b lang="ja">{step.word.text}</b> · {step.word.romaji} ·{" "}
            {step.word.meaning}
          </span>
          <AudioButton text={wordAudioText(step.word)} label="Hear it" />
        </div>
      </>
    );
  if (step.kind !== "exercise") return null;
  const x = step.ex;
  const full =
    x.type === "cloze"
      ? x.line!.replace("＿＿", x.options![x.answer as number])
      : x.type === "order"
        ? x.tiles!.join("")
        : x.type === "reply"
          ? x.line!
          : null;
  return (
    <>
      <p>
        {x.explain} {evidence}
      </p>
      {full && (
        <div className="correct-answer">
          <span className="feedback-line">
            <Furigana text={full} />
            {x.meaning && <small>{x.meaning}</small>}
          </span>
          <AudioButton text={plain(full)} label="Hear it" />
        </div>
      )}
    </>
  );
}

/** After the last question on a scene, the words it was built from. */
function Transcript({ dialogue }: { dialogue: Dialogue }) {
  return (
    <section className="transcript" aria-label="Transcript">
      <h2>What was said</h2>
      <ol>
        {dialogue.lines.map((l, i) => (
          <li key={i}>
            <strong>{l.speaker}</strong>
            <span>
              <Furigana text={l.line} />
              <small>
                {l.romaji} · {l.meaning}
              </small>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function hash(s: string) {
  let n = 0;
  for (const c of s) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return n;
}
