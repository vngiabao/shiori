import { useEffect, useMemo, useRef, useState } from "react";
import { X, Check, ArrowRight, Eye, SpeakerHigh } from "@phosphor-icons/react";
import { kanaKind, lookalikes } from "./kana";
import { KanaAid } from "./KanaAid";
import { wordMap, words } from "./content";
import {
  AudioButton,
  Button,
  Japanese,
  Mascot,
  Seal,
  Stroke,
} from "./components";
import { recordAttempt, finishLesson, db } from "./db";
import { postalProgress } from "./rewards";
import { normalize } from "./packs";
import { romajiVisible } from "./learning";
import { speakReaction, speakWord, wordAudioText } from "./audio";
import { ReactionLine, ViolettoBubble } from "./Violetto";
import { reactionFor } from "./persona";
import { useReactionLine } from "./reactionState";
import type { Lesson, Profile, Skill, Support, Word } from "./types";
export function LessonPlayer({
  lesson,
  profile,
  onClose,
  mode = "reading",
  reviewWords,
}: {
  lesson: Lesson;
  profile: Profile;
  onClose: () => void;
  mode?: Skill;
  reviewWords?: string[];
}) {
  const ids = reviewWords ?? lesson.words;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"meet" | "quiz" | "done">(
    reviewWords ? "quiz" : "meet",
  );
  const [support, setSupport] = useState<Support>("none");
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState<boolean | null>(null);
  const teacherLine = useReactionLine(
    reactionFor(verdict === true, support !== "none"),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [heard, setHeard] = useState(false);
  const [awards, setAwards] = useState<string[]>([]);
  const [completionLevel, setCompletionLevel] = useState<number | null>(null);
  const saving = useRef(false);
  const shell = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const task = useRef<HTMLDivElement>(null);
  const word = wordMap[ids[index]];
  const kind = kanaKind(word);
  const isKana = kind !== "phrase";
  // Kana lessons alternate sight → sound with sound → sight, so the shape is
  // retrieved from the ear as well as read. Each is stored as its own skill.
  const hearAndPick =
    lesson.kind === "kana" &&
    mode === "reading" &&
    !reviewWords &&
    index % 2 === 1;
  const skill: Skill = hearAndPick ? "listening" : mode;
  const showsGlyphs = mode === "recall" || hearAndPick;
  const label = (w: Word) =>
    showsGlyphs ? w.text : isKana && skill === "reading" ? w.romaji : w.meaning;
  const target =
    skill === "typing" || skill === "reading-aloud" ? word.kana : label(word);
  const options = useMemo(() => {
    // Wrong answers come from the same kind of item: kana against kana,
    // phrases against phrases. Look-alikes first, then lesson neighbours.
    const sameKind = words.filter(
      (w) => w.id !== word.id && kanaKind(w) === kind,
    );
    const neighbours = lesson.words
      .map((id) => wordMap[id])
      .filter((w) => w && w.id !== word.id && kanaKind(w) === kind);
    const rotated = sameKind
      .slice(index % sameKind.length)
      .concat(sameKind.slice(0, index % sameKind.length));
    const other = [
      ...new Set(
        [...lookalikes(word), ...neighbours, ...rotated]
          .map(label)
          .filter((t) => t && t !== target),
      ),
    ].slice(0, 3);
    return [target, ...other].sort((a, b) => hash(a + index) - hash(b + index));
    // label depends only on the values listed here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, skill, target, index]);
  const learnRomaji = romajiVisible(profile.created, profile.romaji);
  useEffect(() => {
    const node = bar.current;
    if (!node) return;
    const observer = new ResizeObserver(() =>
      shell.current?.style.setProperty(
        "--verdict-height",
        `${node.getBoundingClientRect().height}px`,
      ),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [verdict, phase]);
  // A kana listening question plays its sound once on arrival; replay stays one tap away.
  useEffect(() => {
    if (phase !== "quiz" || !hearAndPick || verdict !== null) return;
    speakWord(wordAudioText(word))
      .then(() => setHeard(true))
      .catch(() => undefined);
    // Only a new question should trigger playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (
        phase !== "quiz" ||
        busy ||
        e.repeat ||
        e.isComposing ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      )
        return;
      const el = e.target as HTMLElement;
      if (el.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (
        /^[1-4]$/.test(e.key) &&
        verdict === null &&
        !["typing", "reading-aloud"].includes(skill) &&
        (skill !== "listening" || heard || support !== "none")
      ) {
        e.preventDefault();
        const option = options[Number(e.key) - 1];
        if (option !== undefined) setAnswer(option);
      }
      if (
        e.key === "Enter" &&
        (!el.closest("button,a") || el.closest(".answer-option"))
      ) {
        e.preventDefault();
        if (verdict !== null) void next();
        else if (
          answer &&
          (skill !== "listening" || heard || support !== "none")
        )
          void grade(answer);
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });
  function reset() {
    setSupport("none");
    setAnswer("");
    setVerdict(null);
    setHeard(false);
    setError("");
  }
  async function grade(value: string) {
    if (saving.current || busy || verdict !== null) return;
    saving.current = true;
    setBusy(true);
    setError("");
    const correct = normalize(value) === normalize(target);
    try {
      await recordAttempt({
        itemId: word.id,
        skill: skill,
        correct,
        support,
        source: reviewWords ? "review" : lesson.id,
      });
      setVerdict(correct);
      speakReaction(reactionFor(correct, support !== "none")).catch((e) => {
        if (e.name !== "AbortError")
          setError("Voice could not play. Your answer was saved.");
      });
      if (support !== "none") setHelpCount((n) => n + 1);
      else if (correct) setCorrectCount((n) => n + 1);
    } catch {
      setError("Your answer could not be saved. Try again before continuing.");
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  async function next() {
    if (index + 1 < ids.length) {
      setIndex((n) => n + 1);
      reset();
      setPhase(reviewWords ? "quiz" : "meet");
    } else {
      setBusy(true);
      try {
        if (!reviewWords) {
          const [history, previous] = await Promise.all([
            db.attempts.toArray(),
            db.completions.toArray(),
          ]);
          const before = postalProgress(history, previous);
          await finishLesson(lesson.id, lesson.canDo);
          const after = postalProgress(history, await db.completions.toArray());
          if (after.level > before.level) setCompletionLevel(after.level);
          setAwards(
            after.stamps
              .filter(
                (s) =>
                  s.at !== undefined &&
                  before.stamps.find((b) => b.id === s.id)?.at === undefined,
              )
              .map((s) => s.title),
          );
        }
        setPhase("done");
        speakReaction("complete").catch((e) => {
          if (e.name !== "AbortError")
            setError("Voice could not play. Your practice was saved.");
        });
      } catch {
        setError("Could not save completion. Please try again.");
      } finally {
        setBusy(false);
      }
    }
  }
  if (phase === "done")
    return (
      <main id="main-content" className="completion">
        <Seal>済</Seal>
        <Mascot pose="levelup" size={220} />
        <h1>A little closer.</h1>
        {completionLevel !== null && (
          <p className="earned-level" role="status">
            Correspondence level {completionLevel}
            {awards.length > 0 && (
              <span>{awards.join(" · ")} postmark collected</span>
            )}
          </p>
        )}
        <ReactionLine kind="complete" />
        <p className="completion-can">
          You practised this goal:
          <br />
          <strong>{lesson.canDo}</strong>
        </p>
        <div className="completion-evidence">
          <span>{correctCount} unaided {correctCount === 1 ? "answer" : "answers"}</span>
          <span>{helpCount} with support</span>
        </div>
        <p>
          Every encounter counts as practice. Only unaided answers strengthen
          your review memories.
        </p>
        <Button onClick={onClose}>
          Back to my desk
          <ArrowRight />
        </Button>
        <a className="text-button completion-postmarks" href="#postmarks">
          View your postmarks <ArrowRight />
        </a>
      </main>
    );
  return (
    <main
      id="main-content"
      ref={shell}
      className={`lesson-shell focus-shell ${verdict !== null ? "has-verdict" : ""}`}
    >
      <header className="lesson-top">
        <button className="text-button" onClick={onClose}>
          <X />
          Leave lesson
        </button>
        <span>{lesson.title}</span>
        <span>
          {index + 1} / {ids.length}
        </span>
      </header>
      <div
        className="lesson-progress"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuenow={index}
        aria-valuemin={0}
        aria-valuemax={ids.length}
      >
        <span style={{ width: `${(index / ids.length) * 100}%` }} />
      </div>
      <div className="lesson-body">
        <div className="lesson-main" ref={task}>
          <h1>
            {phase === "meet"
              ? isKana
                ? kind === "sound"
                  ? "Meet a new sound."
                  : `Meet a new ${kind === "katakana" ? "katakana" : "hiragana"}.`
                : "Meet a new word."
              : hearAndPick
                ? "Which kana did you hear?"
                : skill === "listening"
                  ? "What did you hear?"
                  : skill === "typing"
                    ? "Type the reading."
                    : skill === "reading-aloud"
                      ? "Recall the reading."
                      : skill === "recall"
                        ? "Find the Japanese."
                        : isKana
                          ? "Which sound is this?"
                          : "What does it mean?"}
          </h1>
          {phase === "meet" ? (
            <>
              {isKana ? (
                <div className="kana-meet">
                  {[...word.text].length === 1 ? (
                    <Stroke char={word.text} size={248} autoplay />
                  ) : (
                    <p className="kana-glyph" lang="ja">
                      {word.text}
                    </p>
                  )}
                  <div className="kana-facts">
                    <button
                      className="kana-sound"
                      aria-label={`Hear ${word.text}, ${word.romaji}`}
                      onClick={() =>
                        speakWord(wordAudioText(word)).catch((e) => {
                          if (e.name !== "AbortError")
                            setError("Audio could not play. Please try again.");
                        })
                      }
                    >
                      <span>{word.romaji}</span>
                      <SpeakerHigh size={22} />
                    </button>
                    {kind === "sound" && (
                      <p className="kana-detail">{word.meaning}</p>
                    )}
                    <KanaAid word={word} />
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className="word-display word-speak"
                    aria-label={`Hear ${word.text}`}
                    onClick={() =>
                      speakWord(wordAudioText(word)).catch((e) => {
                        if (e.name !== "AbortError")
                          setError("Audio could not play. Please try again.");
                      })
                    }
                  >
                    <Japanese word={word} />
                  </button>
                  {learnRomaji && <p className="romaji">{word.romaji}</p>}
                  <p className="word-meaning">{word.meaning}</p>
                  <div className="actions centered">
                    <AudioButton text={wordAudioText(word)} />
                    <span className="register">{word.register}</span>
                  </div>
                </>
              )}
              <Button
                onClick={async () => {
                  setBusy(true);
                  try {
                    await recordAttempt({
                      itemId: word.id,
                      skill: mode,
                      correct: null,
                      support: "meaning",
                      source: lesson.id,
                    });
                    reset();
                    setPhase("quiz");
                  } catch {
                    setError(
                      "Could not save this encounter. Please try again.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
              >
                Ready to try
                <ArrowRight />
              </Button>
            </>
          ) : (
            <>
              <div className="quiz-prompt">
                {skill === "listening" ? (
                  <AudioButton
                    text={wordAudioText(word)}
                    label="Play Japanese"
                    onPlayed={() => setHeard(true)}
                  />
                ) : skill === "recall" ? (
                  <p className="word-meaning">{word.meaning}</p>
                ) : (
                  <Japanese word={word} furigana={support === "furigana"} />
                )}
              </div>
              {support !== "none" && (
                <p className="hint-text" lang="ja">
                  {isKana
                    ? word.romaji
                    : skill === "listening"
                      ? word.text
                      : word.kana}
                  <span>
                    Supported attempt. Still useful, and saved separately.
                  </span>
                </p>
              )}
              {
                <button
                  className="text-button hint-button"
                  style={{
                    visibility: verdict === null ? "visible" : "hidden",
                  }}
                  disabled={verdict !== null}
                  onClick={() =>
                    setSupport(
                      isKana
                        ? "romaji"
                        : skill === "listening"
                          ? "transcript"
                          : "furigana",
                    )
                  }
                >
                  <Eye size={18} />
                  {isKana
                    ? "Show romaji"
                    : skill === "listening"
                      ? "Show transcript"
                      : "Show reading"}
                </button>
              }
              {skill === "typing" || skill === "reading-aloud" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    grade(answer);
                  }}
                >
                  <label htmlFor="answer">Reading in kana</label>
                  <input
                    id="answer"
                    autoComplete="off"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={verdict !== null}
                  />
                  <Button
                    type="submit"
                    disabled={!answer.trim() || busy || verdict !== null}
                  >
                    Check answer
                  </Button>
                </form>
              ) : (
                <div
                  className={`answer-options ${showsGlyphs || isKana ? "glyph-options" : ""}`}
                >
                  {options.map((option, i) => (
                    <button
                      key={option}
                      disabled={
                        busy ||
                        verdict !== null ||
                        (skill === "listening" && !heard && support === "none")
                      }
                      aria-pressed={answer === option}
                      className={`answer-option ${answer === option ? "selected" : ""} ${verdict !== null && option === target ? "correct" : ""}`}
                      onClick={() => setAnswer(option)}
                    >
                      <span>{i + 1}</span>
                      {option}
                      {verdict !== null && option === target && <Check />}
                    </button>
                  ))}
                </div>
              )}
              {!["typing", "reading-aloud"].includes(skill) && (
                <div className="check-action">
                  <Button
                    disabled={
                      !answer ||
                      busy ||
                      verdict !== null ||
                      (skill === "listening" && !heard && support === "none")
                    }
                    onClick={() => grade(answer)}
                  >
                    Check answer <Check />
                  </Button>
                  <span>1–4 to select · Enter to check</span>
                </div>
              )}
              {skill === "listening" && !heard && support === "none" && (
                <p className="muted listen-first">
                  Play the audio before choosing an answer.
                </p>
              )}
            </>
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
              verdict !== null
                ? teacherLine.pose
                : phase === "meet"
                  ? "read"
                  : "listen"
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
        <div
          ref={bar}
          className={`verdict-bar ${verdict ? "good" : "try-again"}`}
        >
          <div className="verdict-inner">
            <div className="verdict-evidence" role="status">
              <strong>
                {verdict ? <Check /> : <X />}
                {verdict ? "Right." : "Not quite."}
              </strong>
              <p>
                {!verdict
                  ? "Goes back into review soon."
                  : support === "none"
                    ? "Recalled without help."
                    : support === "transcript"
                      ? "The transcript was shown, so this counts as supported."
                      : support === "romaji"
                        ? "Romaji was shown, so this counts as supported."
                        : "Furigana was shown, so this counts as supported."}
              </p>
              {!verdict && (
                <div className="correct-answer">
                  <span>
                    Correct answer: <b>{target}</b>
                  </span>
                  <AudioButton text={wordAudioText(word)} label="Hear answer" />
                </div>
              )}
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
function hash(s: string) {
  let n = 0;
  for (const c of s) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return n;
}
