import { ReadingPath, TextDesk } from "./ReadingPath";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  EnvelopeSimple,
  BookOpen,
  Check,
  Microphone,
  Stop,
} from "@phosphor-icons/react";
import {
  letters,
  lessons,
  wordMap,
  words,
  roleplays,
  grammar,
  kanji,
} from "./content";
import {
  AudioButton,
  Button,
  Dialog,
  Japanese,
  Mascot,
  PageHeading,
  Stroke,
} from "./components";
import { recordAttempt } from "./db";
import { coverage, wordStatus } from "./learning";
import { accepts, normalize } from "./packs";
import { speakWord, speakReaction, stopAudio, wordAudioText } from "./audio";
import { ReactionLine } from "./Violetto";
import { KanaAid } from "./KanaAid";
import { LetterTasks } from "./LetterTasks";
import { buildReviewSteps } from "./PhraseLesson";
import { SubtitleFreeRoute } from "./Route";
import { kanaKind, kanaTips } from "./kana";
import { reactionFor } from "./persona";
import type { Attempt, Completion, Memory, Lesson, Skill, Word } from "./types";

export function Read({
  memories,
  attempts,
  start,
  openLetter,
}: {
  memories: Memory[];
  attempts: Attempt[];
  start: (l: Lesson) => void;
  openLetter: (id: string) => void;
}) {
  const [tab, setTab] = useState("Hiragana");
  const [selected, setSelected] = useState<Word | null>(null);
  const kanaWords = words.filter((w) =>
    w.id.startsWith(tab === "Hiragana" ? "h-" : "k-"),
  );
  const grouped = lessons.filter((l) =>
    l.id.startsWith(tab === "Hiragana" ? "hiragana" : "katakana"),
  );
  return (
    <>
      <PageHeading
        title="Reading."
        description="Kana first, then words, then letters."
      />
      <div className="tabs" role="group" aria-label="Reading areas">
        {[
          "Hiragana",
          "Katakana",
          "Kanji",
          "Letters",
          "Reading path",
          "Text desk",
        ].map((t) => (
          <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
            {t}
            <span lang="ja">
              {t === "Hiragana"
                ? "ひらがな"
                : t === "Katakana"
                  ? "カタカナ"
                  : t === "Kanji"
                    ? "漢字"
                    : t === "Letters"
                      ? "手紙"
                      : t === "Reading path"
                        ? "読む練習"
                        : "ことば"}
            </span>
          </button>
        ))}
      </div>
      {tab === "Reading path" ? (
        <ReadingPath />
      ) : tab === "Text desk" ? (
        <TextDesk />
      ) : tab === "Letters" ? (
        <LetterShelf memories={memories} open={openLetter} />
      ) : tab === "Kanji" ? (
        <>
          <div className="split-intro">
            <h2>Little parts. Bigger meanings.</h2>
            <p>
              On’yomi is a reading adapted from Chinese; kun’yomi connects a
              character to a Japanese word. Learn the reading of the whole word,
              not an isolated list.
            </p>
          </div>
          <div className="kanji-list">
            {kanji.map((k) => (
              <details key={k.char}>
                <summary>
                  <span lang="ja">{k.char}</span>
                  <strong>{k.meaning}</strong>
                  <span>{k.components}</span>
                </summary>
                <div className="kanji-detail">
                  <Stroke char={k.char} />
                  <div>
                    <p>
                      <strong>On’yomi</strong> <span lang="ja">{k.on}</span>
                    </p>
                    <p>
                      <strong>Kun’yomi</strong> <span lang="ja">{k.kun}</span>
                    </p>
                    <p>Words that use this character:</p>
                    {k.words.map((id) => (
                      <button
                        className="text-button"
                        key={id}
                        onClick={() => setSelected(wordMap[id])}
                      >
                        <Japanese word={wordMap[id]} />
                        <span>{wordMap[id].meaning}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </>
      ) : (
        <div className="read-layout">
          <section>
            <h2>
              {tab === "Hiragana" ? "The hiragana chart" : "The katakana chart"}
            </h2>
            <p className="muted">
              Tap a kana to hear it, watch its strokes and get a memory aid.
            </p>
            <div className="kana-grid">
              {kanaWords.map((w) => (
                <button
                  key={w.id}
                  className={wordStatus(w.id, memories, attempts)}
                  onClick={() => setSelected(w)}
                  aria-label={`${w.text}, ${w.romaji}, ${wordStatus(w.id, memories, attempts)}`}
                >
                  <span lang="ja">{w.text}</span>
                  <small>{w.romaji}</small>
                  <i />
                </button>
              ))}
            </div>
            <p className="legend">
              <span>Not met</span>
              <span>Met</span>
              <span>Recognised</span>
              <span>Secure</span>
            </p>
          </section>
          <aside className="lesson-index">
            <h2>Lessons</h2>
            {grouped.map((l, i) => (
              <button key={l.id} onClick={() => start(l)}>
                <span className="index-number">{i + 1}</span>
                <span>
                  <strong>{l.title}</strong>
                  <small>{l.description}</small>
                </span>
                <ArrowRight />
              </button>
            ))}
            <section className="kana-tips" aria-labelledby="kana-tips">
              <h2 id="kana-tips">How to make kana stick</h2>
              <ol>
                {kanaTips.map(([title, body]) => (
                  <li key={title}>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      )}
      {selected && (
        <WordDialog word={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
export function WordDialog({ word, close }: { word: Word; close: () => void }) {
  const [audioError, setAudioError] = useState("");
  const kana = kanaKind(word) === "hiragana" || kanaKind(word) === "katakana";
  useEffect(() => {
    speakWord(wordAudioText(word)).catch((e) => {
      if (e.name !== "AbortError")
        setAudioError("Word audio could not play. Use Listen to retry.");
    });
    return () => stopAudio();
  }, [word.id, word.kana]);
  return (
    <Dialog
      title={kana ? `${word.text} · ${word.romaji}` : "A closer look"}
      onClose={close}
    >
      {kana ? (
        <div className="kana-dialog">
          <Stroke char={word.text} size={200} autoplay credit={false} />
          <div className="kana-facts">
            <AudioButton
              text={wordAudioText(word)}
              label={`Hear ${word.romaji}`}
            />
            {audioError && <p role="status">{audioError}</p>}
            <KanaAid word={word} />
          </div>
        </div>
      ) : (
        <div className="dictionary-word">
          <Japanese word={word} />
          <p className="romaji">{word.romaji}</p>
          <h3>{word.meaning}</h3>
          <span className="register">{word.register}</span>
          <AudioButton text={wordAudioText(word)} />
          {audioError && <p role="status">{audioError}</p>}
          {[...word.text].length === 1 && <Stroke char={word.text} />}
          <p className="muted">
            JLPT mapping pending. Editorial content is an AI-assisted draft.
          </p>
        </div>
      )}
    </Dialog>
  );
}
export function LetterShelf({
  memories,
  open,
}: {
  memories: Memory[];
  open: (id: string) => void;
}) {
  return (
    <div className="letter-shelf">
      {letters.map((l, i) => (
        <button key={l.id} className="letter-tile" onClick={() => open(l.id)}>
          <div className="letter-tile-top">
            <span>LETTER {String(i + 1).padStart(2, "0")}</span>
            <EnvelopeSimple weight="thin" size={26} />
          </div>
          <span className="letter-subject" lang="ja">
            {l.subject}
          </span>
          <h2>{l.title}</h2>
          <p>From {l.from}</p>
          <footer>
            <span>
              {coverage(l.tokens, memories) >= 0.95
                ? "Ready for independent reading"
                : "Guided reading · all words glossed"}
            </span>
            <ArrowRight />
          </footer>
        </button>
      ))}
    </div>
  );
}
// Letters from the recurring friends are signed as friends; notes from a
// teacher, a shop or your own diary are not.
const friends = ["Yui", "Ren", "Hana"];
export function Reader({
  id,
  memories,
  back,
}: {
  id: string;
  memories: Memory[];
  back: () => void;
}) {
  const letter = letters.find((l) => l.id === id)!;
  const [selected, setSelected] = useState<string | null>(null);
  const [furigana, setFurigana] = useState(true);
  const [supported, setSupported] = useState(true);
  const [answer, setAnswer] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState(
    () => localStorage.getItem("shiori-reply-" + id) ?? "",
  );
  const ratio = coverage(letter.tokens, memories);
  const paragraphs: string[][] = [];
  let from = 0;
  for (const stop of [...letter.paragraphs, letter.tokens.length]) {
    if (stop > from) paragraphs.push(letter.tokens.slice(from, stop));
    from = stop;
  }
  return (
    <>
      <button className="text-button" onClick={back}>
        <ArrowLeft />
        All letters
      </button>
      <PageHeading
        title={letter.title}
        description={
          letter.from === "You"
            ? "Something you wrote"
            : `A letter from ${letter.from}`
        }
      >
        <Mascot pose="read" size={130} />
      </PageHeading>
      <div className="reader-layout">
        <article className="letter-paper">
          <div className="letter-meta">
            <span lang="ja">{letter.subject}</span>
            <span>
              {letter.from === "You" ? "" : `FROM ${letter.from.toUpperCase()}`}
            </span>
          </div>
          <div className="reader-toolbar">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={furigana}
                onChange={(e) => {
                  setFurigana(e.target.checked);
                  if (e.target.checked) setSupported(true);
                }}
              />
              Furigana
            </label>
            <button
              className="text-button"
              onClick={() => {
                setFurigana(false);
                setSupported(false);
                setSelected(null);
                setAnswer(null);
              }}
            >
              Start without help
            </button>
            <AudioButton
              onPlayed={() => setSupported(true)}
              text={paragraphs
                .map((p) => p.map((id) => wordMap[id].text).join("") + "。")
                .join("")}
            />
          </div>
          <div className="letter-body" lang="ja">
            {paragraphs.map((p, i) => (
              <p key={i}>
                {p.map((id, j) => (
                  <button
                    key={j}
                    className={`gloss-token ${selected === id ? "selected" : ""}`}
                    onClick={() => {
                      setSelected(id);
                      setSupported(true);
                      speakWord(wordAudioText(wordMap[id])).catch((e) => {
                        if (e.name !== "AbortError")
                          setError(
                            "Word audio could not play. Use Listen to retry.",
                          );
                      });
                    }}
                  >
                    <Japanese word={wordMap[id]} furigana={furigana} />
                  </button>
                ))}
                。
              </p>
            ))}
          </div>
          <p className="letter-signature">
            {letter.from}
            {friends.includes(letter.from) && <span>あなたの友達より</span>}
          </p>
          {selected && (
            <section
              className="mobile-gloss"
              aria-label="Selected word meaning"
              aria-live="polite"
            >
              <div>
                <Japanese word={wordMap[selected]} />
                <p>{wordMap[selected].meaning}</p>
              </div>
              <AudioButton text={wordAudioText(wordMap[selected])} />
              <button className="text-button" onClick={() => setSelected(null)}>
                Close meaning
              </button>
            </section>
          )}
          <div className="letter-question">
            <h3>{letter.question}</h3>
            {letter.options.map((o, i) => (
              <button
                key={o}
                className={`answer-option ${answer !== null && i === letter.answer ? "correct" : ""}`}
                disabled={answer !== null || busy}
                onClick={async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await recordAttempt({
                      itemId: letter.id,
                      skill: "reading",
                      correct: i === letter.answer,
                      support: supported ? "furigana" : "none",
                      source: "letter",
                    });
                    setAnswer(i);
                    speakReaction(
                      reactionFor(i === letter.answer, supported),
                    ).catch((e) => {
                      if (e.name !== "AbortError")
                        setError(
                          "Voice could not play. Your answer was saved.",
                        );
                    });
                  } catch {
                    setError("Could not save your answer. Please try again.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {o}
                {answer !== null && i === letter.answer && <Check />}
              </button>
            ))}
            {answer !== null && (
              <p role="status">
                {answer === letter.answer
                  ? "You understood the letter."
                  : "Read it again: " +
                    letter.options[letter.answer] +
                    "."}{" "}
                {supported
                  ? "Saved as supported reading."
                  : "Saved as unaided comprehension."}
              </p>
            )}
            {error && <p role="alert">{error}</p>}
          </div>
          <LetterTasks letterId={letter.id} supported={supported} />
        </article>
        <aside className="reader-aside">
          <h2>Your reading companion</h2>
          <p>
            {ratio >= 0.95
              ? "At least 95% of these words have unaided reading evidence."
              : `${Math.round(ratio * 100)}% of this letter has unaided word evidence so far. Use the glosses, or meet its words first.`}
          </p>
          {ratio < 0.95 && (
            <p className="notice-note">
              Guided reading. This is not yet a 95%-known independent text for
              you.
            </p>
          )}
          <div className="gloss-panel" aria-live="polite">
            {selected ? (
              <>
                <Japanese word={wordMap[selected]} />
                <p>{wordMap[selected].meaning}</p>
                <p className="muted">
                  {wordMap[selected].romaji} · {wordMap[selected].register}
                </p>
                <AudioButton text={wordAudioText(wordMap[selected])} />
              </>
            ) : (
              <>
                <BookOpen size={28} weight="thin" />
                <p>
                  Touch a word.
                  <br />
                  Let its meaning unfold.
                </p>
              </>
            )}
          </div>
          <label htmlFor="reply">A little reply</label>
          <textarea
            id="reply"
            value={reply}
            placeholder="こんにちは。…"
            onChange={(e) => {
              setReply(e.target.value);
              localStorage.setItem("shiori-reply-" + id, e.target.value);
            }}
          />
          <small>
            Draft saved on this device. Free writing is not automatically
            graded.
          </small>
          <p className="content-note">
            AI-assisted draft · awaiting language review
          </p>
        </aside>
      </div>
    </>
  );
}
export function Listen({
  start,
  completions,
}: {
  start: (l: Lesson, skill?: Skill) => void;
  completions: Completion[];
}) {
  return (
    <>
      <PageHeading
        title="Listening."
        description="Train your ear step by step, from one clear voice to scenes without subtitles."
      />
      <div className="listen-feature">
        <div className="listening-art">
          <span lang="ja">あ</span>
          <Mascot pose="listen" size={170} />
        </div>
        <div>
          <h2>A first hello.</h2>
          <p>
            Listen to eight small phrases. Find their meaning with the writing
            tucked away.
          </p>
          <Button
            onClick={() =>
              start(
                lessons.find((l) => l.id === "phrase-1")!,
                "listening",
              )
            }
          >
            Start listening
            <ArrowRight />
          </Button>
          <p className="muted">Japanese TTS · replay whenever you need</p>
        </div>
      </div>
      <SubtitleFreeRoute
        courseDone={
          lessons.filter((l) => completions.some((c) => c.id === l.id)).length
        }
        courseTotal={lessons.length}
      />
      <section className="pitch-note">
        <h2>A small change in pitch. A different word.</h2>
        <p>
          Tokyo Japanese example. Pitch varies by region; this is a listening
          guide, not a pronunciation score.
        </p>
        <div className="pitch-pair">
          {["rain", "candy"].map((id) => (
            <div key={id}>
              <Japanese word={wordMap[id]} />
              <svg
                viewBox="0 0 180 65"
                role="img"
                aria-label={id === "rain" ? "High then low" : "Low then high"}
              >
                <path
                  d={id === "rain" ? "M15 15H75V48H165" : "M15 48H75V15H165"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <p>{wordMap[id].meaning}</p>
              <AudioButton text={wordMap[id].text} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export function Practice({
  memories,
  start,
  startMixed,
}: {
  memories: Memory[];
  start: (l: Lesson, skill?: Skill, ids?: string[]) => void;
  startMixed: () => void;
}) {
  const [skill, setSkill] = useState<Skill>("reading");
  const mixed = buildReviewSteps(memories);
  const due = memories.filter(
    (m) => m.due <= Date.now() && m.skill === skill && wordMap[m.itemId],
  );
  const list = due.map((m) => m.itemId);
  const l: Lesson = {
    id: "review",
    title: "A little remembering",
    description: "Meet familiar words again.",
    kind: "phrase",
    words: list,
    minutes: 5,
    canDo: "Bring familiar words back without a prompt",
  };
  return (
    <>
      <PageHeading
        title="Review."
        description="Memories return just before they fade. Each skill keeps its own."
      />
      <div className="review-feature">
        <div>
          <h2>
            {mixed.length
              ? `${mixed.length} ${mixed.length === 1 ? "item is" : "items are"} ready.`
              : "Nothing due. Room to explore."}
          </h2>
          <p>
            {mixed.length
              ? "Words come back inside new sentences: gaps, replies, sentences to build. Try before you reveal; help is remembered."
              : "Your next review appears here when a memory is due. You can still practise a skill below."}
          </p>
          {mixed.length > 0 && (
            <Button onClick={startMixed}>
              Begin mixed review
              <ArrowRight />
            </Button>
          )}
          <label htmlFor="review-skill">Or review one skill</label>
          <select
            id="review-skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value as Skill)}
          >
            {["reading", "reading-aloud", "listening", "recall", "typing"].map(
              (s) => (
                <option value={s} key={s}>
                  {
                    {
                      reading: "Reading",
                      "reading-aloud": "Reading recall",
                      listening: "Listening",
                      recall: "Recall",
                      typing: "Typing",
                    }[s]
                  }
                </option>
              ),
            )}
          </select>
          {due.length > 0 && (
            <Button secondary onClick={() => start(l, skill, list)}>
              Review {due.length} {skill.replace("-", " ")}
              <ArrowRight />
            </Button>
          )}
        </div>
        <Mascot pose="review" size={215} />
      </div>
      <div className="practice-list">
        {(
          [
            "reading",
            "listening",
            "recall",
            "typing",
            "reading-aloud",
          ] as Skill[]
        ).map((s) => (
          <button
            key={s}
            onClick={() =>
              start(
                {
                  ...lessons.find((l) => l.id === "phrase-1")!,
                  title: "Practise " + s,
                },
                s,
                lessons.find((l) => l.id === "phrase-1")!.words,
              )
            }
          >
            <span>
              <h2>
                {s === "reading-aloud"
                  ? "Recall the reading"
                  : s === "recall"
                    ? "English → Japanese"
                    : s[0].toUpperCase() + s.slice(1)}
              </h2>
              <p>
                {s === "reading-aloud"
                  ? "Type the kana you would say. This checks reading recall, not speech."
                  : s === "listening"
                    ? "Sound → meaning, without a transcript."
                    : s === "typing"
                      ? "Retrieve a word’s kana reading."
                      : s === "recall"
                        ? "Find the Japanese phrase from its meaning."
                        : "Written Japanese → meaning."}
              </p>
            </span>
            <ArrowRight />
          </button>
        ))}
      </div>
      <h2>Notice how Japanese works.</h2>
      <div className="grammar-list">
        {grammar.map((g) => (
          <details key={g.id}>
            <summary>{g.title}</summary>
            <p>{g.explanation}</p>
            <p className="grammar-example" lang="ja">
              {g.example}
            </p>
            <p>{g.translation}</p>
            <AudioButton text={g.example} />
          </details>
        ))}
      </div>
      <Politeness />
    </>
  );
}
function Politeness() {
  const [choice, setChoice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <section className="politeness">
      <h2>The right words for the moment.</h2>
      <p>
        A bookshop keeper helps you find a book. How would you thank them
        politely?
      </p>
      <div className="answer-options">
        {["ありがとう", "ありがとうございます", "どうも"].map((t, i) => (
          <button
            key={t}
            className="answer-option"
            disabled={choice !== null || busy}
            onClick={async () => {
              setBusy(true);
              try {
                await recordAttempt({
                  itemId: "register-thanks",
                  skill: "politeness",
                  correct: i === 1,
                  support: "none",
                  source: "practice",
                });
                setChoice(i);
                speakReaction(i === 1 ? "correct" : "politeness").catch((e) => {
                  if (e.name !== "AbortError")
                    setError(
                      "Voice could not play. Use Hear Violetto to retry.",
                    );
                });
              } catch {
                setError("Could not save the answer. Please try again.");
              } finally {
                setBusy(false);
              }
            }}
            lang="ja"
          >
            {t}
          </button>
        ))}
      </div>
      {choice !== null && (
        <div role="status">
          <ReactionLine kind={choice === 1 ? "correct" : "politeness"} />
          <p>
            {choice === 1 ? "その通りです。" : "少し失礼かもしれません。"}{" "}
            ありがとうございます is the clear polite choice here. ありがとう is
            casual; どうも alone can sound brief.
          </p>
          <button className="text-button" onClick={() => setChoice(null)}>
            Try again
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
export function Speak() {
  const [id, setId] = useState<string | null>(null);
  return id ? (
    <Conversation id={id} back={() => setId(null)} />
  ) : (
    <>
      <PageHeading
        title="Speaking."
        description="Scripted conversations. Say each reply aloud, then type it."
      />
      <div className="speak-intro">
        <Mascot pose="speak" size={185} />
        <div>
          <p lang="ja" className="japanese">
            言葉を、届けましょう。
          </p>
          <h2>Let’s put your words into the world.</h2>
          <p>
            Read a situation, say your reply out loud, then type it. These
            scripted conversations check useful phrases, not pronunciation.
          </p>
        </div>
      </div>
      <div className="conversation-list">
        {roleplays.map((r, i) => (
          <button key={r.id} onClick={() => setId(r.id)}>
            <span className="cast-letter">{r.partner[0]}</span>
            <div>
              <span>
                {r.partner} ·{" "}
                {
                  [
                    "the bookshop keeper",
                    "the café owner",
                    "your fellow learner",
                  ][i]
                }
              </span>
              <h2>{r.title}</h2>
              <p>{r.scene}</p>
            </div>
            <ArrowRight />
          </button>
        ))}
      </div>
      <Recorder />
    </>
  );
}
function Conversation({ id, back }: { id: string; back: () => void }) {
  const r = roleplays.find((r) => r.id === id)!;
  const [turn, setTurn] = useState(0);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const t = r.turns[turn];
  if (!t)
    return (
      <div className="completion">
        <Mascot pose="proud" size={200} />
        <h1>You found the words.</h1>
        <p>
          A small exchange, a real beginning. Typed replies are saved as recall
          practice; speaking is not automatically scored.
        </p>
        <Button onClick={back}>
          More conversations
          <ArrowRight />
        </Button>
      </div>
    );
  return (
    <>
      <button className="text-button" onClick={back}>
        <ArrowLeft />
        Conversations
      </button>
      <PageHeading title={r.title} description={r.scene} />
      <div className="conversation-stage">
        <div className="partner-line">
          <span>{r.partner}</span>
          <p lang="ja">{t.line}</p>
          <p className="muted">{t.kana}</p>
          <AudioButton text={t.line} />
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy || result !== null) return;
            setBusy(true);
            setError("");
            const ok = accepts(input, t.accept);
            try {
              await recordAttempt({
                itemId: r.id + "-" + turn,
                skill: "recall",
                correct: ok,
                support: hint ? "example" : "none",
                source: "roleplay",
              });
              setResult(ok);
              speakReaction(reactionFor(ok, hint)).catch((e) => {
                if (e.name !== "AbortError")
                  setError("Voice could not play. Your reply was saved.");
              });
            } catch {
              setError("Could not save the reply. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="role-answer">{t.task}</label>
          <p className="muted">
            Say it aloud first, then type your answer in Japanese.
          </p>
          <input
            id="role-answer"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={result === true}
          />
          <div className="actions">
            <Button
              type="submit"
              disabled={!input.trim() || busy || result !== null}
            >
              Send reply
              <ArrowRight />
            </Button>
            <button
              type="button"
              className="text-button"
              onClick={() => setHint(true)}
            >
              Show an example
            </button>
          </div>
        </form>
        {hint && (
          <p className="notice-note" lang="ja">
            {t.example}
            <span className="muted"> · {t.meaning} · supported practice</span>
          </p>
        )}
        {result !== null && (
          <div role="status" className="conversation-feedback">
            <Mascot pose={result ? "proud" : "encourage"} size={110} />
            <div>
              <ReactionLine kind={reactionFor(result, hint)} />
              <strong>
                {result
                  ? "Your reply fits."
                  : "That wording is outside this exercise’s accepted patterns."}
              </strong>
              <p>
                {result
                  ? "A clear, polite exchange."
                  : `Try the target phrase: ${t.example}. Other natural replies may exist.`}
              </p>
              <Button
                onClick={() => {
                  if (result) {
                    setTurn((n) => n + 1);
                    setHint(false);
                  } else setHint(true);
                  setInput("");
                  setResult(null);
                }}
              >
                {result ? "Continue" : "Try with the example"}
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}
        {error && <p role="alert">{error}</p>}
      </div>
    </>
  );
}
export function Recorder() {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
    },
    [],
  );
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  async function start() {
    try {
      setError("");
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder)
        throw Error(
          "Recording is unavailable in this browser. You can still practise aloud.",
        );
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const r = new MediaRecorder(stream.current);
      const chunks: BlobPart[] = [];
      r.ondataavailable = (e) => chunks.push(e.data);
      r.onstop = () => {
        setUrl(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })));
        stream.current?.getTracks().forEach((t) => t.stop());
        setRecording(false);
        if (timer.current) clearTimeout(timer.current);
      };
      r.start();
      recorder.current = r;
      setRecording(true);
      timer.current = setTimeout(() => r.stop(), 60000);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <section className="recorder">
      <div>
        <h2>Hear yourself.</h2>
        <p>
          Record a phrase and listen back. Recordings stay in this session, on
          this device, and are never uploaded.
        </p>
      </div>
      <Button
        secondary
        onClick={() => (recording ? recorder.current?.stop() : start())}
      >
        {recording ? <Stop /> : <Microphone />}
        {recording ? "Stop recording" : "Record a phrase"}
      </Button>
      {url && <audio controls src={url} />}
      <small>
        Up to 60 seconds. Self-listening only; no pronunciation or pitch score.
      </small>
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
export function Dictionary() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Word | null>(null);
  const q = normalize(query).normalize("NFD").replace(/\p{M}/gu, "");
  const filtered = words.filter((w) =>
    [w.text, w.kana, w.romaji, w.meaning].some((v) =>
      normalize(v).normalize("NFD").replace(/\p{M}/gu, "").includes(q),
    ),
  );
  return (
    <>
      <PageHeading
        title="Dictionary."
        description="Search by Japanese, reading, romaji or English."
      />
      <label className="sr-only" htmlFor="dictionary-search">
        Search dictionary
      </label>
      <input
        className="search-field"
        id="dictionary-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try 手紙, tegami, or letter…"
      />
      <p className="muted">
        {filtered.length} course entries · broader dictionary expansion planned
      </p>
      <div className="dictionary-list">
        {filtered.slice(0, 100).map((w) => (
          <button key={w.id} onClick={() => setSelected(w)}>
            <Japanese word={w} />
            <span>{w.meaning}</span>
            <small>{w.register}</small>
            <ArrowRight />
          </button>
        ))}
      </div>
      {!filtered.length && (
        <p>
          No course entries match. Try a shorter word or another writing form.
        </p>
      )}
      {selected && (
        <WordDialog word={selected} close={() => setSelected(null)} />
      )}
    </>
  );
}
