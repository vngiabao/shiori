import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Sun,
  BookOpen,
  Headphones,
  ChatsCircle,
  ArrowClockwise,
  PlayCircle,
  ChartBar,
  MagnifyingGlass,
  Gear,
  ArrowRight,
  DotsThree,
  X,
  Check,
  EnvelopeSimple,
  Clock,
  GraduationCap,
} from "@phosphor-icons/react";
import { db } from "./db";
import {
  Brand,
  Button,
  Mascot,
  PageHeading,
  Seal,
  poseNames,
  AudioButton,
} from "./components";
import { Welcome, Settings, Progress } from "./Account";
import {
  Dictionary,
  Listen,
  Practice,
  Read,
  Reader,
  Speak,
  LetterShelf,
} from "./Study";
import { Library, Fieldwork } from "./Library";
import { JlptRoom } from "./Jlpt";
import { jlptLevels, type JlptLevel } from "./jlpt-model";
import { LessonPlayer } from "./LessonPlayer";
import { Watch } from "./Watch";
import { backupDue, downloadBackup, lastBackup } from "./backup";
import {
  PhraseLesson,
  hasPractice,
  buildReviewSteps,
  reviewLesson,
  type Step,
} from "./PhraseLesson";
import {
  Postmarks,
  VoiceStudio,
  ViolettoPanel,
  ReactionLine,
} from "./Violetto";
import { postalProgress } from "./rewards";
import { lessons, letters, wordMap } from "./content";
import { buildPlan } from "./learning";
import {
  replay,
  stopAudio,
  configureVoice,
  speakReaction,
  wordAudioText,
} from "./audio";
import type {
  Lesson,
  Profile,
  Skill,
  Attempt,
  Memory,
  Completion,
} from "./types";
const nav = [
  ["today", "Today", Sun],
  ["read", "Read", BookOpen],
  ["listen", "Listen", Headphones],
  ["speak", "Speak", ChatsCircle],
  ["jlpt", "JLPT", GraduationCap],
  ["practice", "Practice", ArrowClockwise],
  ["media", "Media", PlayCircle],
  ["progress", "Progress", ChartBar],
] as const;
export default function App() {
  const state = useLiveQuery(async () => ({
    profile: await db.profiles.get("local"),
    attempts: await db.attempts.toArray(),
    memories: await db.memories.toArray(),
    completions: await db.completions.toArray(),
    media: await db.media.toArray(),
  }));
  const [route, setRoute] = useState(location.hash.slice(1) || "today");
  const [active, setActive] = useState<{
    lesson: Lesson;
    skill: Skill;
    ids?: string[];
  } | null>(null);
  const [more, setMore] = useState(false);
  const [mixed, setMixed] = useState<Step[] | null>(null);
  const [examFocus, setExamFocus] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [audioError, setAudioError] = useState("");
  useEffect(() => {
    const hash = () => {
      setRoute(location.hash.slice(1) || "today");
      setMore(false);
      setActive(null);
      setMixed(null);
      stopAudio();
      window.scrollTo(0, 0);
    };
    const net = () => setOnline(navigator.onLine);
    const keys = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (
        e.code === "Space" &&
        !["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(tag)
      ) {
        e.preventDefault();
        replay().catch((err) => setAudioError(err.message));
      }
    };
    window.addEventListener("hashchange", hash);
    window.addEventListener("online", net);
    window.addEventListener("offline", net);
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("online", net);
      window.removeEventListener("offline", net);
      window.removeEventListener("keydown", keys);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = state?.profile?.theme ?? "light";
  }, [state?.profile?.theme]);
  useEffect(() => {
    if (state?.profile) configureVoice(state.profile);
  }, [state?.profile]);
  function go(r: string) {
    location.hash = r;
    setRoute(r);
    setMore(false);
    setActive(null);
    stopAudio();
    window.scrollTo(0, 0);
  }
  function start(lesson: Lesson, skill: Skill = "reading", ids?: string[]) {
    setActive({ lesson, skill, ids });
    speakReaction("welcome").catch((e) => {
      if (e.name !== "AbortError")
        setAudioError("Violetto could not speak. Use Hear Violetto to retry.");
    });
    window.scrollTo(0, 0);
  }
  if (!state)
    return (
      <div className="loading-state">
        <Brand />
        <p>Opening your desk…</p>
      </div>
    );
  if (!state.profile) return <Welcome />;
  const p = state.profile;
  const props = { memories: state.memories, attempts: state.attempts, start };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!active && !mixed && !examFocus && (
        <header className="app-header">
          <Brand />
          <nav aria-label="Main navigation">
            {nav.map(([id, label, Icon]) => (
              <a
                key={id}
                href={"#" + id}
                aria-current={
                  (route === id ||
                    (id === "jlpt" && route.startsWith("jlpt/"))) &&
                  !active
                    ? "page"
                    : undefined
                }
              >
                <Icon size={19} />
                {label}
              </a>
            ))}
          </nav>
          <div className="header-tools">
            <a href="#dictionary" aria-label="Search dictionary">
              <MagnifyingGlass size={23} />
            </a>
            <a href="#settings" aria-label="Settings">
              <Gear size={23} />
            </a>
          </div>
        </header>
      )}
      {!online && (
        <div className="offline-banner" role="status">
          You’re offline. Your saved lessons and progress are right here.
        </div>
      )}
      {mixed ? (
        <PhraseLesson
          lesson={reviewLesson}
          profile={p}
          review={mixed}
          onClose={() => {
            setMixed(null);
            stopAudio();
            window.scrollTo(0, 0);
          }}
        />
      ) : active && !active.ids && hasPractice(active.lesson) ? (
        <PhraseLesson
          key={active.lesson.id + active.skill}
          lesson={active.lesson}
          profile={p}
          mode={active.skill}
          onClose={() => {
            setActive(null);
            stopAudio();
            window.scrollTo(0, 0);
          }}
        />
      ) : active ? (
        <LessonPlayer
          key={
            active.lesson.id + active.skill + (active.ids ? "review" : "lesson")
          }
          lesson={active.lesson}
          profile={p}
          mode={active.skill}
          reviewWords={active.ids}
          onClose={() => {
            setActive(null);
            stopAudio();
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <main
          id="main-content"
          className={`app-main ${examFocus ? "exam-focus" : ""}`}
          data-page={route.split("/")[0]}
        >
          {route === "today" ? (
            <Today
              profile={p}
              {...props}
              completions={state.completions}
              go={go}
            />
          ) : route === "read" ? (
            <Read {...props} openLetter={(id) => go("letter/" + id)} />
          ) : route === "letters" ? (
            <>
              <PageHeading
                title="Letters."
                description="Short letters from people you will come to know. Every word can be glossed."
              />
              <LetterShelf
                memories={state.memories}
                open={(id) => go("letter/" + id)}
              />
            </>
          ) : route.startsWith("letter/") &&
            letters.some((l) => l.id === route.slice(7)) ? (
            <Reader
              key={route}
              id={route.slice(7)}
              memories={state.memories}
              back={() => go("letters")}
            />
          ) : route === "listen" ? (
            <Listen start={start} completions={state.completions} />
          ) : route === "speak" ? (
            <Speak />
          ) : route === "practice" ? (
            <Practice
              memories={state.memories}
              start={start}
              startMixed={() => {
                setMixed(buildReviewSteps(state.memories));
                window.scrollTo(0, 0);
              }}
            />
          ) : route === "media" ? (
            <Watch />
          ) : route === "jlpt" || route.startsWith("jlpt/") ? (
            <JlptRoom
              onFocusChange={setExamFocus}
              key={route}
              level={
                jlptLevels.includes(route.split("/")[1] as JlptLevel)
                  ? (route.split("/")[1] as JlptLevel)
                  : "N5"
              }
            />
          ) : route === "progress" ? (
            <Progress {...state} />
          ) : route === "postmarks" ? (
            <Postmarks
              attempts={state.attempts}
              completions={state.completions}
              go={go}
            />
          ) : route === "voice" ? (
            <VoiceStudio profile={p} />
          ) : route === "library" ? (
            <Library start={start} completions={state.completions} />
          ) : route === "fieldwork" ? (
            <Fieldwork />
          ) : route === "dictionary" ? (
            <Dictionary />
          ) : route === "settings" ? (
            <Settings profile={p} />
          ) : route === "companion" ? (
            <Companion />
          ) : (
            <>
              <PageHeading title="This page could not be found." />
              <Button onClick={() => go("today")}>Back to Today</Button>
            </>
          )}
        </main>
      )}
      {!active && !mixed && !examFocus && (
        <>
          <footer className="app-footer">
            <span>栞 · One letter at a time.</span>
            <span>
              Saved on this device ·{" "}
              <a href="#settings">Back up your progress</a>
            </span>
          </footer>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {nav
              .filter(([id]) =>
                ["today", "read", "listen", "speak"].includes(id),
              )
              .map(([id, label, Icon]) => (
                <a
                  key={id}
                  href={"#" + id}
                  aria-current={
                    route === id || (id === "jlpt" && route.startsWith("jlpt/"))
                      ? "page"
                      : undefined
                  }
                >
                  <Icon size={22} />
                  {label}
                  <small lang="ja">
                    {
                      {
                        today: "今日",
                        read: "読む",
                        listen: "聴く",
                        speak: "話す",
                      }[id as "today" | "read" | "listen" | "speak"]
                    }
                  </small>
                </a>
              ))}
            <button aria-expanded={more} onClick={() => setMore(!more)}>
              <DotsThree size={24} />
              More
              <small aria-hidden="true">⋯</small>
            </button>
          </nav>
          {more && (
            <div className="more-panel">
              <div>
                <h2>Your study desk</h2>
                <button
                  className="icon-button"
                  aria-label="Close menu"
                  onClick={() => setMore(false)}
                >
                  <X />
                </button>
              </div>
              {[
                ...nav.filter(
                  ([id]) => !["today", "read", "listen", "speak"].includes(id),
                ),
                ["library", "Course library", BookOpen],
                ["fieldwork", "Beyond the course", EnvelopeSimple],
                ["dictionary", "Dictionary", MagnifyingGlass],
                ["settings", "Settings", Gear],
                ["companion", "Violetto", EnvelopeSimple],
                ["postmarks", "Postmark collection", EnvelopeSimple],
                ["voice", "Violetto's voice", Headphones],
              ].map(([id, label, Icon]) => (
                <a key={String(id)} href={"#" + id}>
                  <Icon size={22} />
                  {String(label)}
                  <ArrowRight />
                </a>
              ))}
            </div>
          )}
        </>
      )}
      {audioError && (
        <div role="alert" className="audio-toast">
          {audioError}
          <button
            onClick={() => setAudioError("")}
            aria-label="Dismiss audio error"
          >
            <X />
          </button>
        </div>
      )}
    </>
  );
}
function Today({
  profile,
  attempts,
  memories,
  completions,
  start,
  go,
}: {
  profile: Profile;
  attempts: Attempt[];
  memories: Memory[];
  completions: Completion[];
  start: (l: Lesson, skill?: Skill) => void;
  go: (s: string) => void;
}) {
  const done = new Set(completions.map((c) => c.id));
  const track =
    profile.path === "sound"
      ? lessons.filter((l) => l.kind === "phrase")
      : lessons.filter((l) => l.id.startsWith("hiragana"));
  const next =
    track.find((l) => !done.has(l.id)) ??
    lessons.find((l) => !done.has(l.id)) ??
    track[0];
  const due = memories.filter((m) => m.due <= Date.now()).length;
  const plan = buildPlan(profile.minutes, attempts, profile.path, due);
  const first = wordMap[next.words[0]];
  const post = postalProgress(attempts, completions);
  const labels: Record<string, [string, string]> = {
    read: ["Meet a few new shapes", "A short lesson in your reading path"],
    letters: ["Open a letter", "Read slowly, with a meaning at every word"],
    listen: [
      "Listen for meaning",
      "The same words, a different kind of memory",
    ],
    speak: ["Find something to say", "A small exchange at the bookshop"],
    practice: ["Bring a memory back", `${due} memories ready to revisit`],
  };
  const streak = post.streak;
  const recognised = new Set(
    attempts
      .filter(
        (a) =>
          a.skill === "reading" &&
          a.correct === true &&
          a.support === "none" &&
          [...(wordMap[a.itemId]?.text ?? "")].length === 1,
      )
      .map((a) => wordMap[a.itemId].text),
  ).size;
  const lessonNumber = lessons.indexOf(next) + 1;
  return (
    <>
      <div className="today-board">
        <header className="today-heading">
          <div>
            <p className="date-line">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              <span lang="ja">今日の一歩</span>
            </p>
            <h1>Your next letter is ready.</h1>
            <p>
              Welcome{profile.name === "friend" ? "" : `, ${profile.name}`}.
              {due
                ? ` ${due} ${due === 1 ? "memory is" : "memories are"} ready to revisit.`
                : " One lesson, a few minutes, then rest."}
            </p>
          </div>
        </header>
        <ViolettoPanel
          kind={attempts.length ? "return" : "welcome"}
          pose={due ? "review" : "welcome"}
        />
        <section className="lead-lesson">
          <div className="lesson-letter-art" aria-hidden="true">
            <div className="lead-glyph" lang="ja">
              {first.text}
            </div>
            <p>{first.romaji}</p>
          </div>
          <div className="lead-lesson-copy">
            <h2>{next.title}.</h2>
            <p className="lesson-meta">
              Lesson {lessonNumber} of {lessons.length} ·{" "}
              {next.kind === "kana" ? "Sounds and kana" : "First exchanges"} ·{" "}
              {next.minutes} min
            </p>
            <p>{next.description}</p>
            <div
              className="kana-preview"
              lang="ja"
              aria-label="Words in this lesson"
            >
              {next.words.slice(0, 5).map((id) => (
                <span key={id}>{wordMap[id].text}</span>
              ))}
            </div>
            <div className="actions">
              <Button
                onClick={() =>
                  start(
                    next,
                    profile.path === "sound" ? "listening" : "reading",
                  )
                }
              >
                {done.has(next.id) ? "Revisit lesson" : "Begin lesson"}
                <ArrowRight />
              </Button>
              <AudioButton text={wordAudioText(first)} label="Hear it" />
            </div>
          </div>
        </section>
      </div>
      {backupDue(attempts.length) && <BackupReminder />}
      <div className="today-columns">
        <section className="daily-plan">
          <div className="section-title">
            <h2>Today’s session</h2>
            <label>
              <span className="sr-only">Today’s minutes</span>
              <select
                value={profile.minutes}
                onChange={(e) =>
                  db.profiles.update("local", {
                    minutes: Number(e.target.value),
                  })
                }
              >
                {[10, 20, 30, 45, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} min
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="muted">{plan.reason}</p>
          <ol>
            {plan.items.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() =>
                    item.route === "read" ? start(next) : go(item.route)
                  }
                >
                  <span className="plan-number">{i + 1}</span>
                  <span>
                    <strong>{labels[item.route][0]}</strong>
                    <small>{labels[item.route][1]}</small>
                  </span>
                  <span className="plan-time">{item.minutes} min</span>
                  <ArrowRight size={18} />
                </button>
              </li>
            ))}
          </ol>
        </section>
        <aside className="today-post">
          <div className="section-title">
            <h2>In your letterbox.</h2>
            <a href="#letters">
              All letters
              <ArrowRight size={16} />
            </a>
          </div>
          <button className="postcard" onClick={() => go("letter/letter-1")}>
            <div>
              <span>FROM YUI</span>
              <EnvelopeSimple size={24} weight="thin" />
            </div>
            <span className="postcard-japanese" lang="ja">
              はじめまして。
            </span>
            <h3>A letter for you.</h3>
            <p>
              A new friend, a bookshop,
              <br />
              and your first words.
            </p>
            <span className="postcard-link">
              Open the letter
              <ArrowRight size={18} />
            </span>
          </button>
          <div className="quiet-stats">
            <div>
              <span>Working toward</span>
              <strong>{next.canDo}</strong>
            </div>
            <div>
              <span>Correspondence level</span>
              <strong>{post.level}</strong>
            </div>
            {profile.streak && (
              <div>
                <span>Days in a row</span>
                <strong>{streak}</strong>
              </div>
            )}
            <div>
              <span>Review due</span>
              <button onClick={() => go("practice")}>
                {due}
                <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <span>Kana / kanji recalled unaided</span>
              <strong>{recognised}</strong>
            </div>
            <div>
              <span>Postmarks</span>
              <a href="#postmarks">
                {post.stamps.filter((s) => s.at !== undefined).length} of{" "}
                {post.stamps.length}
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </aside>
      </div>
      <section className="path-section">
        <div className="section-title">
          <div>
            <h2>Your first correspondence.</h2>
            <p className="muted">
              A path from first sounds to meaningful exchanges.
            </p>
          </div>
          <a href="#library">
            All lessons
            <ArrowRight size={17} />
          </a>
        </div>
        <ol className="envelope-path">
          {track.slice(0, 8).map((l, i) => (
            <li
              key={l.id}
              className={
                done.has(l.id) ? "finished" : l.id === next.id ? "current" : ""
              }
            >
              <button
                onClick={() =>
                  start(l, profile.path === "sound" ? "listening" : "reading")
                }
              >
                <span className="path-envelope">
                  <EnvelopeSimple size={49} weight="thin" />
                  {done.has(l.id) ? <Check size={16} /> : <span>{i + 1}</span>}
                </span>
                <strong>{l.title}</strong>
                <small>
                  {done.has(l.id)
                    ? "Delivered"
                    : l.id === next.id
                      ? "Start here"
                      : `${l.minutes} min`}
                </small>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
function Companion() {
  return (
    <>
      <PageHeading
        title="Violetto."
        description="Your companion: composed, precise, and learning what words mean to people."
      />
      <div className="companion-intro">
        <Mascot size={225} />
        <div>
          <h2>Every feeling starts with a word.</h2>
          <p>
            Violetto keeps you company as you read, listen, hesitate, and try
            again. A quiet nod for a clear answer. A little encouragement when
            the words don’t come yet.
          </p>
          <ReactionLine kind="welcome" />
          <div className="actions">
            <a className="text-button" href="#voice">
              Find her voice <ArrowRight />
            </a>
            <a className="text-button" href="#postmarks">
              Your postmark collection <ArrowRight />
            </a>
          </div>
        </div>
      </div>
      <div className="pose-gallery">
        {poseNames.map((p, i) => (
          <div key={p}>
            <Mascot pose={p} size={180} />
            <h3>
              {
                [
                  "Welcome",
                  "Listening",
                  "Speaking",
                  "Reading",
                  "At the typewriter",
                  "Thinking",
                  "A little hint",
                  "Well done",
                  "Quietly proud",
                  "Try again",
                  "A gentle correction",
                  "Reviewing",
                  "Tea break",
                  "A little flustered",
                  "A letter delivered",
                  "Keep going",
                ][i]
              }
            </h3>
          </div>
        ))}
      </div>
    </>
  );
}

/** Until sync exists, progress lives only in this browser: a weekly nudge to keep a copy. */
function BackupReminder() {
  const [done, setDone] = useState(false);
  const last = lastBackup();
  if (done)
    return (
      <p className="backup-reminder" role="status">
        Backup saved to your downloads. Keep it somewhere safe, such as cloud
        storage.
      </p>
    );
  return (
    <div className="backup-reminder">
      <p>
        <strong>Keep a copy of your progress.</strong>{" "}
        {last
          ? `Last backup: ${new Date(last).toLocaleDateString()}.`
          : "No backup from this device yet."}{" "}
        Your records live only in this browser until sync is set up.
      </p>
      <Button
        secondary
        onClick={async () => {
          await downloadBackup();
          setDone(true);
        }}
      >
        Export backup
      </Button>
    </div>
  );
}
