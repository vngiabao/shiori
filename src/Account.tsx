import { SyncPanel } from "./SyncPanel";
import { startSync, getSyncStatus, subscribeSync } from "./sync";
import { authConfigured } from "./auth";
// This module is part of the app shell; the worker remains active between routes.
const stopSyncWorker = authConfigured ? startSync() : undefined;
if (import.meta.hot) import.meta.hot.dispose(() => stopSyncWorker?.());
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Download,
  Upload,
  Sun,
  Moon,
  Check,
} from "@phosphor-icons/react";
import { Brand, Button, Mascot, PageHeading } from "./components";
import { db, importBackup } from "./db";
import { downloadBackup } from "./backup";
import { lessonAudioUrls, saveAudioOffline } from "./offline";
import { brand } from "./brand";
import { evidence, wordStatus } from "./learning";
import { stopAudio, configureVoice } from "./audio";
import { ReactionLine } from "./Violetto";
import { lessons, words, stages } from "./content";
import type {
  Attempt,
  Completion,
  Memory,
  Profile,
  Skill,
  MediaAttempt,
} from "./types";
export function Welcome() {
  const syncStatus = useSyncExternalStore(
    subscribeSync,
    getSyncStatus,
    getSyncStatus,
  );
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [path, setPath] = useState<Profile["path"]>("together");
  const [minutes, setMinutes] = useState(20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (step === 1) document.getElementById("name")?.focus();
  }, [step]);
  async function begin() {
    setBusy(true);
    try {
      await db.profiles.put({
        id: "local",
        name: name.trim() || "friend",
        path,
        minutes,
        created: Date.now(),
        theme: "light",
        romaji: true,
        streak: true,
        furigana: true,
      });
      location.hash = "today";
    } catch {
      setError(
        "Your browser could not save local progress. Allow site storage and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="welcome">
      <main className="welcome-entry-layout">
        <section className="welcome-showcase" aria-label="Meet Violetto">
          <div className="welcome-bubble">
            <ReactionLine kind="welcome" compact />
          </div>
          <Mascot size={340} />
        </section>
        <section className="welcome-form">
          <Brand />
          {step === 0 ? (
            <>
              <h1>
                Every word,
                <br />a little closer.
              </h1>
              <p>
                Read your first kana. Hear the words take shape. With Violetto,
                work towards the stories and songs you want to understand.
              </p>
              {syncStatus.account ? (
                <>
                  <p>Signed in as {syncStatus.account.email}</p>
                  <Button onClick={() => setStep(1)}>
                    Continue to study
                    <ArrowRight />
                  </Button>
                  <small>
                    Choose your learning path next. Your current sync choice is
                    kept. You can change it later in Settings.
                  </small>
                  <details>
                    <summary>Cloud sync options</summary>
                    <SyncPanel entry />
                  </details>
                </>
              ) : (
                <>
                  <SyncPanel entry />
                  <div className="welcome-divider">
                    <span>or</span>
                  </div>
                  <Button secondary onClick={() => setStep(1)}>
                    Start without an account
                    <ArrowRight />
                  </Button>
                  <small>
                    Guest progress stays in this browser. With cloud sync, you
                    choose whether to add this device’s history to your account.
                  </small>
                </>
              )}
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                begin();
              }}
            >
              <h2>Make yourself at home.</h2>
              <label htmlFor="name">What should Violetto call you?</label>
              <input
                id="name"
                value={name}
                maxLength={40}
                autoComplete="given-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
              />
              <fieldset>
                <legend>How would you like to begin?</legend>
                {(
                  [
                    [
                      "kana",
                      "Kana first",
                      "Start with shapes. Let them become sounds.",
                    ],
                    [
                      "sound",
                      "Sound first",
                      "Hear useful phrases, with kana alongside.",
                    ],
                    [
                      "together",
                      "Side by side",
                      "A little reading. A little listening.",
                    ],
                  ] as const
                ).map(([value, title, desc]) => (
                  <label
                    key={value}
                    className={`path-choice ${path === value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="path"
                      checked={path === value}
                      onChange={() => setPath(value)}
                    />
                    <span>
                      <strong>{title}</strong>
                      <small>{desc}</small>
                    </span>
                    {path === value && <Check />}
                  </label>
                ))}
              </fieldset>
              <label htmlFor="minutes">A little time each day</label>
              <select
                id="minutes"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              >
                {[10, 20, 30, 45, 60].map((n) => (
                  <option key={n} value={n}>
                    {n} minutes
                  </option>
                ))}
              </select>
              <Button type="submit" disabled={busy}>
                Open my first letter
                <ArrowRight />
              </Button>
              <small>
                You can change your path and study time whenever you like.
              </small>
              {error && <p role="alert">{error}</p>}
            </form>
          )}
        </section>
      </main>
      <footer>
        <span>{brand.name} · 栞</span>
        <span>A quieter way into Japanese.</span>
      </footer>
    </div>
  );
}
export function Settings({ profile: storedProfile }: { profile: Profile }) {
  const [profile, setProfile] = useState(storedProfile);
  useEffect(() => setProfile(storedProfile), [storedProfile]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function update(p: Partial<Profile>) {
    setStatus("");
    setProfile((previous) => ({ ...previous, ...p }));
    configureVoice({ ...profile, ...p });
    try {
      await db.profiles.update("local", p);
      setStatus("Settings saved.");
    } catch {
      setProfile(storedProfile);
      configureVoice(storedProfile);
      setStatus("Could not save settings. Please try again.");
    }
  }
  return (
    <>
      <PageHeading
        title="Settings."
        description="Theme, voice, romaji and your backups."
      />
      <div className="settings-layout">
        <section>
          <h2>Your study</h2>
          <label htmlFor="profile-name">Your name</label>
          <input
            id="profile-name"
            defaultValue={profile.name}
            maxLength={40}
            onBlur={(e) => update({ name: e.target.value.trim() || "friend" })}
          />
          <label htmlFor="profile-path">Learning path</label>
          <select
            id="profile-path"
            value={profile.path}
            onChange={(e) =>
              update({ path: e.target.value as Profile["path"] })
            }
          >
            <option value="kana">Kana first</option>
            <option value="sound">Sound first</option>
            <option value="together">Side by side</option>
          </select>
          <label htmlFor="profile-minutes">Daily study time</label>
          <select
            id="profile-minutes"
            value={profile.minutes}
            onChange={(e) => update({ minutes: Number(e.target.value) })}
          >
            {[10, 20, 30, 45, 60].map((n) => (
              <option key={n} value={n}>
                {n} minutes
              </option>
            ))}
          </select>
          <label className="setting-check">
            <input
              type="checkbox"
              checked={profile.romaji}
              onChange={(e) => update({ romaji: e.target.checked })}
            />
            <span>
              Romaji during the first two weeks
              <small>After 14 days, kana and furigana take its place.</small>
            </span>
          </label>
          <label className="setting-check">
            <input
              type="checkbox"
              checked={profile.streak}
              onChange={(e) => update({ streak: e.target.checked })}
            />
            <span>
              Show days in a row
              <small>
                A gentle marker, never a penalty for taking a break.
              </small>
            </span>
          </label>
          <h2 className="settings-subhead">Theme</h2>
          <div className="theme-options">
            <button
              className={profile.theme === "light" ? "selected" : ""}
              onClick={() => update({ theme: "light" })}
            >
              <Sun />
              <span>Morning letter</span>
            </button>
            <button
              className={profile.theme === "dark" ? "selected" : ""}
              onClick={() => update({ theme: "dark" })}
            >
              <Moon />
              <span>Night post</span>
            </button>
          </div>
        </section>
        <section>
          <h2>Violetto’s voice</h2>
          <fieldset className="voice-preferences">
            <legend className="sr-only">Violetto’s voice</legend>
            <label className="setting-check">
              <input
                type="checkbox"
                checked={profile.spokenReactions !== false}
                onChange={(e) => {
                  stopAudio();
                  update({ spokenReactions: e.target.checked });
                }}
              />
              <span>
                Speak praise and encouragement
                <small>
                  A short spoken line after answers and completed lessons.
                </small>
              </span>
            </label>
            <label className="setting-check">
              <input
                type="checkbox"
                checked={profile.wordAudio !== false}
                onChange={(e) => {
                  stopAudio();
                  update({ wordAudio: e.target.checked });
                }}
              />
              <span>
                Read tapped words aloud
                <small>
                  Word details and letter glosses speak when you open them.
                </small>
              </span>
            </label>
            <a className="text-button" href="#voice">
              Compare Violetto's voice auditions <ArrowRight />
            </a>
          </fieldset>
          <OfflineAudio />
          <h2>Keep your progress safe</h2>
          <p>
            Progress is saved in this browser’s local storage database. Export a
            backup before switching devices or clearing site data.
          </p>
          <div className="actions">
            <Button
              secondary
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await downloadBackup();
                  setStatus("Backup exported.");
                } catch {
                  setStatus("Could not export a backup. Please try again.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Download />
              Export backup
            </Button>
            <label className="button secondary file-button">
              <Upload />
              Import backup
              <input
                type="file"
                accept="application/json,.json"
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    await importBackup(JSON.parse(await file.text()));
                    setStatus(
                      "Backup merged. Existing attempts were preserved.",
                    );
                  } catch (err) {
                    setStatus((err as Error).message);
                  } finally {
                    setBusy(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>
          <p className="muted">
            Imports merge by record ID and rebuild review schedules. Existing
            settings stay in place.
          </p>
          <h2>Account & cloud sync</h2>
          <SyncPanel />
          <a className="text-button" href="#companion">
            Spend a moment with Violetto
            <ArrowRight />
          </a>
        </section>
      </div>
      <p role="status" className="settings-status">
        {status}
      </p>
    </>
  );
}
export function Progress({
  attempts,
  memories,
  completions,
  media,
}: {
  attempts: Attempt[];
  memories: Memory[];
  completions: Completion[];
  media: MediaAttempt[];
}) {
  const skills: Skill[] = [
    "reading",
    "reading-aloud",
    "listening",
    "recall",
    "typing",
    "politeness",
  ];
  const completed = completions.filter((c) =>
    lessons.some((l) => l.id === c.id),
  );
  return (
    <>
      <PageHeading
        title="Progress."
        description="What you have done, skill by skill. Completion is not mastery."
      />
      <div className="progress-intro">
        <div>
          <h2>
            {completed.length === 0
              ? "No lessons finished yet."
              : `${completed.length} ${completed.length === 1 ? "lesson" : "lessons"} finished.`}
          </h2>
          <p>
            {completed.length
              ? `Most recent goal: ${completed[completed.length - 1].canDo}`
              : "Begin one from Today. The first takes about twelve minutes."}
          </p>
          <p className="content-note">
            A finished lesson shows practice, not mastery.
          </p>
        </div>
        <Mascot pose="review" size={150} />
      </div>
      <h2>Evidence by skill</h2>
      <div className="skill-ledger">
        {skills.map((s) => {
          const e = evidence(attempts, s);
          return (
            <div key={s}>
              <h3>
                {s === "reading-aloud"
                  ? "Reading recall"
                  : s[0].toUpperCase() + s.slice(1)}
              </h3>
              <div className="evidence-track">
                <span
                  style={{
                    width: e.count ? `${(e.correct / e.count) * 100}%` : "0%",
                  }}
                />
              </div>
              <p>
                {e.count
                  ? `${e.correct} / ${e.count} unaided answers correct`
                  : "No unaided evidence yet"}
                <small>{e.supported} supported attempts</small>
              </p>
            </div>
          );
        })}
      </div>
      <p className="content-note">
        Answer history is not a fluency score. Speaking practice and reading
        recall do not demonstrate pronunciation accuracy.
      </p>
      <div className="progress-bottom">
        <section>
          <h2>Kana</h2>
          {["not met", "met", "recognised", "secure"].map((s) => (
            <div className="ledger-row" key={s}>
              <span>{s}</span>
              <strong>
                {
                  words.filter(
                    (w) =>
                      (w.id.startsWith("h-") || w.id.startsWith("k-")) &&
                      wordStatus(w.id, memories, attempts) === s,
                  ).length
                }
              </strong>
            </div>
          ))}
          <small>
            Secure means at least 3 unaided successes and FSRS stability of 7+
            days, not permanent mastery.
          </small>
        </section>
        <section>
          <h2>Media</h2>
          <div className="ledger-row">
            <span>Media encounters</span>
            <strong>{media.length}</strong>
          </div>
          <div className="ledger-row">
            <span>With transcript</span>
            <strong>{media.filter((m) => m.transcript).length}</strong>
          </div>
          <div className="ledger-row">
            <span>Without transcript</span>
            <strong>{media.filter((m) => !m.transcript).length}</strong>
          </div>
          <small>
            Self-reported encounters, not comprehension or JLPT predictions.
          </small>
        </section>
      </div>
      <h2>The route ahead</h2>
      <p className="muted">
        JLPT mapping pending. Later stages are the course roadmap; the
        foundation is available now.
      </p>
      <ol className="journey-list">
        {stages.map(([title, detail, level], i) => (
          <li key={title}>
            <span>{i + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
            <small>{i === 0 ? "Available now" : `${level} · planned`}</small>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Opt-in download of every lesson clip, so study works with no connection. */
function OfflineAudio() {
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  return (
    <section className="offline-audio" aria-labelledby="offline-audio">
      <h2 id="offline-audio">Offline audio</h2>
      <p>
        Lessons are saved as you open them, and clips as you hear them. To study
        anywhere, save all course text and {lessonAudioUrls().length} audio
        clips now. A large course may take several minutes to download.
      </p>
      <Button
        secondary
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          setProgress(null);
          setStatus("");
          try {
            await saveAudioOffline((done, total) => setProgress([done, total]));
            setStatus("All lesson audio is saved for offline use.");
          } catch (e) {
            setStatus(
              (e as Error).message || "Could not save audio. Try again online.",
            );
          } finally {
            setSaving(false);
          }
        }}
      >
        {saving
          ? progress
            ? `Saving ${progress[0]} of ${progress[1]}…`
            : "Preparing download…"
          : "Save lesson audio for offline"}
      </Button>
      {status && <p role="status">{status}</p>}
    </section>
  );
}
