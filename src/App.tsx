import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Sun,
  BookOpen,
  Books,
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
import { AppUpdateNotice } from "./AppUpdateNotice";
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
import { jlptLevels, type JlptLevel } from "./jlpt-model";
// The exam room and Watch carry their own data and styles; they load on demand.
const JlptRoom = lazy(() =>
  import("./Jlpt").then((m) => ({ default: m.JlptRoom })),
);
const Watch = lazy(() => import("./Watch").then((m) => ({ default: m.Watch })));
const routeFallback = <p role="status">Opening…</p>;
import { LessonPlayer } from "./LessonPlayer";
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
import {
  lessons,
  letters,
  wordMap,
  courseCatalog,
  courseLevels,
  levelOf,
  loadThroughLevel,
  loadAllCourse,
  subscribeContent,
  contentRevision,
} from "./content";
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
  ["library", "Course library", Books],
  ["read", "Read", BookOpen],
  ["listen", "Listen", Headphones],
  ["speak", "Speak", ChatsCircle],
  ["jlpt", "JLPT", GraduationCap],
  ["practice", "Practice", ArrowClockwise],
  ["media", "Media", PlayCircle],
  ["progress", "Progress", ChartBar],
] as const;
const mobileTabs = ["today", "library", "read", "listen", "speak"];
const extraNav = [
  ["letters", "Letters", EnvelopeSimple],
  ["fieldwork", "Beyond the course", EnvelopeSimple],
  ["dictionary", "Dictionary", MagnifyingGlass],
  ["settings", "Settings", Gear],
  ["companion", "Violetto", EnvelopeSimple],
  ["postmarks", "Postmark collection", EnvelopeSimple],
  ["voice", "Violetto's voice", Headphones],
] as const;
export default function App() {
  useSyncExternalStore(subscribeContent, contentRevision, contentRevision);
  const opening = useRef(0);
  const [readyKey, setReadyKey] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentBusy, setContentBusy] = useState(false);
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
  const moreTrigger = useRef<HTMLButtonElement | null>(null);
  function toggleMore(event: React.MouseEvent<HTMLButtonElement>) {
    moreTrigger.current = event.currentTarget;
    setMore((open) => !open);
  }
  useEffect(() => {
    if (!more) return;
    const menu = document.getElementById("study-navigation");
    menu?.querySelector<HTMLAnchorElement>("a")?.focus();
    const outside = (event: PointerEvent) => {
      if (
        !menu?.contains(event.target as Node) &&
        !moreTrigger.current?.contains(event.target as Node)
      )
        setMore(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [more]);
  const [mixed, setMixed] = useState<Step[] | null>(null);
  const [examFocus, setExamFocus] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [audioError, setAudioError] = useState("");
  const savedIds = state
    ? [
        ...state.memories.map((m) => m.itemId),
        ...state.completions.map((c) => c.id),
        ...state.attempts.map((a) => a.itemId),
      ]
    : [];
  const latestLevel = savedIds.reduce(
    (rank, id) => Math.max(rank, courseLevels.indexOf(levelOf(id))),
    0,
  );
  const nextLesson = courseCatalog
    .flatMap((p) => p.lessons)
    .find((l) => !state?.completions.some((c) => c.id === l.id));
  const requiredLevel = Math.max(
    latestLevel,
    courseLevels.indexOf(levelOf(nextLesson?.id ?? "")),
  );
  const fullShelf =
    // Read opens on the kana charts; its Letters, Texts and Kanji shelves load the rest themselves.
    ["listen", "letters", "dictionary", "speak", "progress"].includes(
      route,
    ) ||
    route.startsWith("letter/") ||
    route.startsWith("media");
  // Keyed by what must be loaded, not by route: switching pages never blanks the
  // screen when the content it needs is already here.
  // After a failed download, moving to another page clears the notice and tries again.
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (contentError) {
      setContentError("");
      setRetry((n) => n + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
  const requiredKey = `${Boolean(state?.profile)}:${fullShelf ? "all" : requiredLevel}:${retry}`;
  useEffect(() => {
    if (!state?.profile) return;
    let cancelled = false;
    setContentError("");
    (fullShelf
      ? loadAllCourse()
      : loadThroughLevel(courseLevels[requiredLevel])
    )
      .then(() => {
        if (!cancelled) setReadyKey(requiredKey);
      })
      .catch(() => {
        if (!cancelled)
          setContentError(
            "These lessons couldn’t load. Connect to the internet and reload Shiori. Saved lessons and progress are kept.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [requiredKey]);
  useEffect(() => {
    const hash = () => {
      opening.current++;
      setContentBusy(false);
      setRoute(location.hash.slice(1) || "today");
      setMore(false);
      setActive(null);
      setMixed(null);
      stopAudio();
      window.scrollTo(0, 0);
    };
    const net = () => setOnline(navigator.onLine);
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.getElementById("study-navigation")) {
        setMore(false);
        moreTrigger.current?.focus();
        return;
      }
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
    opening.current++;
    setContentBusy(false);
    location.hash = r;
    setRoute(r);
    setMore(false);
    setActive(null);
    stopAudio();
    window.scrollTo(0, 0);
  }
  async function start(
    lesson: Lesson,
    skill: Skill = "reading",
    ids?: string[],
  ) {
    const token = ++opening.current;
    setContentBusy(true);
    setContentError("");
    try {
      await loadThroughLevel(levelOf(lesson.id));
    } catch {
      if (token === opening.current) {
        setContentBusy(false);
        setContentError(
          "This lesson couldn’t load. Connect to the internet and reload Shiori. Your progress is kept.",
        );
      }
      return;
    }
    if (token !== opening.current) return;
    setContentBusy(false);
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
      <AppUpdateNotice
        studying={Boolean(
          active ||
          mixed ||
          examFocus ||
          route === "speak" ||
          route === "media" ||
          route.startsWith("letter/"),
        )}
      />
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
            <button
              className="header-more-button"
              aria-expanded={more}
              aria-controls="study-navigation"
              onClick={toggleMore}
            >
              More <DotsThree size={23} aria-hidden="true" />
            </button>
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
          {contentError ? (
            <div className="notice-note" role="alert">
              <p>{contentError}</p>
              <Button secondary onClick={() => location.reload()}>
                Reload Shiori
              </Button>
            </div>
          ) : null}
          {(readyKey !== requiredKey && !contentError) || contentBusy ? (
            <p role="status">Opening your lessons…</p>
          ) : route === "today" ? (
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
          ) : route === "media" || route.startsWith("media?unit=") ? (
            <Suspense fallback={routeFallback}>
              <Watch
                key={route}
                unit={
                  route.startsWith("media?unit=")
                    ? decodeURIComponent(route.split("=")[1])
                    : undefined
                }
              />
            </Suspense>
          ) : route === "jlpt" || route.startsWith("jlpt/") ? (
            <Suspense fallback={routeFallback}>
              <JlptRoom
                onFocusChange={setExamFocus}
                key={route}
                level={
                  jlptLevels.includes(route.split("/")[1] as JlptLevel)
                    ? (route.split("/")[1] as JlptLevel)
                    : "N5"
                }
              />
            </Suspense>
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
              .filter(([id]) => mobileTabs.includes(id))
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
                  {id === "library" ? "Courses" : label}
                  <small lang="ja">
                    {
                      {
                        today: "今日",
                        library: "授業",
                        read: "読む",
                        listen: "聴く",
                        speak: "話す",
                      }[id as "today" | "library" | "read" | "listen" | "speak"]
                    }
                  </small>
                </a>
              ))}
            <button
              aria-expanded={more}
              aria-controls="study-navigation"
              onClick={toggleMore}
            >
              <DotsThree size={24} />
              More
              <small aria-hidden="true">⋯</small>
            </button>
          </nav>
          {more && (
            <nav
              className="more-panel"
              id="study-navigation"
              aria-label="More navigation"
            >
              <div>
                <h2>Your study desk</h2>
                <button
                  className="icon-button"
                  aria-label="Close menu"
                  onClick={() => {
                    setMore(false);
                    moreTrigger.current?.focus();
                  }}
                >
                  <X />
                </button>
              </div>
              {[
                ...nav.filter(([id]) => !mobileTabs.includes(id)),
                ...extraNav,
              ].map(([id, label, Icon]) => (
                <a
                  key={id}
                  href={"#" + id}
                  aria-current={route === id ? "page" : undefined}
                  onClick={() => setMore(false)}
                >
                  <Icon size={22} />
                  {String(label)}
                  <ArrowRight />
                </a>
              ))}
            </nav>
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
  const nextPack = courseCatalog.find((p) =>
    p.lessons.some((l) => l.id === next.id),
  );
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
              {next.kind === "kana"
                ? "Sounds and kana"
                : (nextPack?.title ?? "Course")}{" "}
              · {next.minutes} min
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
        description="Your teacher: composed, precise, and learning what words mean to people."
      />
      <div className="companion-intro">
        <Mascot size={225} />
        <div>
          <h2>Every feeling starts with a word.</h2>
          <p>
            Violetto treats every answer as a small responsibility. She checks
            carefully, corrects patiently, and lets a little warmth through when
            you get it right. Occasionally, she is rather pleased that her
            corrections have something to do. There is always time for another
            try, or a cup of tea.
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
