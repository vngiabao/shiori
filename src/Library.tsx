import { useRef, useState } from "react";
import { usePathBoard } from "./motion";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  Check,
  ArrowSquareOut,
  Headphones,
} from "@phosphor-icons/react";
import { courseCatalog as packs, wordMap } from "./content";
const lessons = packs.flatMap((p) => p.lessons);
import { db } from "./db";
import { Button, PageHeading } from "./components";
import type { Lesson, Skill, Completion, FieldSession } from "./types";
export function Library({
  start,
  completions,
}: {
  start: (l: Lesson, s?: Skill) => void;
  completions: Completion[];
}) {
  const [filter, setFilter] = useState("all");
  const boardRef = useRef<HTMLElement>(null);
  usePathBoard(boardRef);
  const levelOf = (id: string) =>
    /^(n[1-5]|keigo)-/.exec(id)?.[1] ?? "foundation";
  const currentLevel = levelOf(
    packs.find((p) =>
      p.lessons.some((l) => !completions.some((c) => c.id === l.id)),
    )?.id ?? "foundation",
  );
  const levels = ["foundation", "n5", "n4", "n3", "n2", "n1", "keigo"];
  const levelNames: Record<string, [string, string]> = {
    foundation: ["Kana & first exchanges", "Read the script, say hello."],
    n5: ["N5", "Everyday exchanges"],
    n4: ["N4", "Make yourself understood"],
    n3: ["N3", "Follow the conversation"],
    n2: ["N2", "Read between the lines"],
    n1: ["N1", "Find your own voice"],
    keigo: ["Keigo at work", "Respectful Japanese for the office"],
  };
  // Sections the learner has opened or closed by hand; the rest follow progress.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const isOpen = (level: string) =>
    toggled[level] ??
    (level === "foundation" ||
      level === currentLevel ||
      (level === "n5" && currentLevel === "foundation") ||
      filter === level);
  const showsLesson = (l: Lesson) =>
    filter === "all" ||
    levels.includes(filter) ||
    filter === l.kind ||
    (filter === "unfinished" && !completions.some((c) => c.id === l.id));
  // Deck sets are small and alike, so they read as tiles: name, a glimpse of
  // the words, size, one tap to open. The headphones open the listening pass.
  const deckSets = (p: (typeof packs)[number]) => (
    <div className="deck-sets">
      {p.lessons.filter(showsLesson).map((l) => {
        const done = completions.some((c) => c.id === l.id);
        const preview = l.words
          .map((id) => wordMap[id]?.text)
          .filter(Boolean)
          .slice(0, 4);
        return (
          <div className={`deck-set ${done ? "done" : ""}`} key={l.id}>
            <button className="deck-set-open" onClick={() => start(l)}>
              <span className="deck-set-title">
                {l.title.replace(/^.*· /, "")}
                {done && <Check aria-label="finished" />}
              </span>
              {preview.length > 0 && (
                <span lang="ja" className="deck-set-preview">
                  {preview.join("・")}
                </span>
              )}
              <small>{l.words.length} words</small>
            </button>
            <button
              className="deck-set-listen"
              aria-label={`Listen: ${l.title}`}
              onClick={() => start(l, "listening")}
            >
              <Headphones />
            </button>
          </div>
        );
      })}
    </div>
  );
  const lessonRows = (p: (typeof packs)[number]) => (
    <div className="course-lessons">
      {p.lessons.filter(showsLesson).map((l) => (
        <div key={l.id}>
          <div>
            <h3>
              {l.title}
              {completions.some((c) => c.id === l.id) && (
                <Check className="lesson-done" aria-label="finished" />
              )}
            </h3>
            <p>{l.description}</p>
            <small>
              {l.words.length} items · {l.minutes} min suggested pace
            </small>
          </div>
          <div className="actions">
            <button className="text-button" onClick={() => start(l)}>
              Read
              <ArrowRight />
            </button>
            <button
              className="text-button"
              onClick={() => start(l, "listening")}
            >
              Listen
              <ArrowRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <PageHeading
        title="Course library."
        description="Your kana foundation, N5–N1 courses, vocabulary decks and keigo at work. Choose a level, then open a lesson."
      />
      {/* The path at a glance: one stop per level, progress under each, the
          current one marked. A tap opens that level below. */}
      <nav
        className="path-board"
        aria-label="Your path through the course"
        ref={boardRef}
      >
        {levels
          .filter((level) => packs.some((p) => levelOf(p.id) === level))
          .map((level) => {
            const all = packs
              .filter((p) => levelOf(p.id) === level)
              .flatMap((p) => p.lessons);
            const done = all.filter((l) =>
              completions.some((c) => c.id === l.id),
            ).length;
            const complete = all.length > 0 && done === all.length;
            return (
              <button
                key={level}
                className={`path-stop ${level === currentLevel ? "current" : ""} ${complete ? "done" : ""}`}
                aria-current={level === currentLevel ? "step" : undefined}
                onClick={() => {
                  setFilter(level === "foundation" ? "all" : level);
                  setToggled((t) => ({ ...t, [level]: true }));
                  requestAnimationFrame(() =>
                    document
                      .getElementById(`level-${level}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                  );
                }}
              >
                <span className="path-label">
                  {level === "foundation"
                    ? "Kana"
                    : level === "keigo"
                      ? "Keigo"
                      : level.toUpperCase()}
                  {complete && <Check aria-label="complete" />}
                </span>
                <span className="path-bar" aria-hidden="true">
                  <span
                    style={{
                      width: `${all.length ? (done / all.length) * 100 : 0}%`,
                    }}
                  />
                </span>
                <small>
                  {done} / {all.length}
                </small>
              </button>
            );
          })}
      </nav>
      <div className="library-summary">
        <p>
          <strong>{packs.length}</strong> content packs ·{" "}
          <strong>{lessons.length}</strong> lessons · {completions.length}{" "}
          finished
        </p>
        <a href="#fieldwork" className="text-button">
          Beyond the course
          <ArrowRight />
        </a>
      </div>
      <label htmlFor="course-filter">Show lessons</label>
      <select
        id="course-filter"
        className="library-filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All lessons</option>
        <option value="kana">Kana & sound</option>
        <option value="phrase">Words & conversations</option>
        <option value="unfinished">Not finished yet</option>
        <option value="n5">N5 course</option>
        <option value="n4">N4 course</option>
        <option value="n3">N3 course</option>
        <option value="n2">N2 course</option>
        <option value="n1">N1 course</option>
        <option value="keigo">Keigo at work</option>
      </select>
      {levels
        .filter(
          (level) =>
            packs.some((p) => levelOf(p.id) === level) &&
            (!levels.includes(filter) || filter === level),
        )
        .map((level) => {
          const own = packs.filter((p) => levelOf(p.id) === level);
          const all = own.flatMap((p) => p.lessons);
          const done = all.filter((l) =>
            completions.some((c) => c.id === l.id),
          ).length;
          const units = own.filter((p) => p.category !== "vocabulary").length;
          return (
            <details
              className="course-level"
              id={`level-${level}`}
              key={`${level}-${filter}`}
              open={isOpen(level)}
              onToggle={(e) => {
                const open = e.currentTarget.open;
                setToggled((t) =>
                  t[level] === open ? t : { ...t, [level]: open },
                );
              }}
            >
              <summary>
                <h2>{levelNames[level][0]}</h2>
                <span className="level-summary">
                  <span>{levelNames[level][1]}</span>
                  <small>
                    {units} {level === "foundation" ? "packs" : "units"} ·{" "}
                    {all.length} lessons · {done} finished
                  </small>
                </span>
              </summary>
              {own.map((p) =>
                p.category === "vocabulary" ? (
                  // A deck's dozen short sets stay folded; units show their lessons.
                  <section className="course-unit deck-pack" key={p.id}>
                    <details>
                      <summary>
                        <span className="section-title">
                          <h2>{p.title}</h2>
                          <small className="deck-count">
                            {p.lessons.length} sets ·{" "}
                            {p.lessons.reduce((n, x) => n + x.words.length, 0)}{" "}
                            words
                          </small>
                        </span>
                      </summary>
                      {deckSets(p)}
                    </details>
                  </section>
                ) : (
                  <section className="course-unit" key={p.id}>
                    <div className="section-title">
                      <h2>{p.title}</h2>
                      {(() => {
                        const n = p.lessons.filter((l) =>
                          completions.some((c) => c.id === l.id),
                        ).length;
                        return n > 0 ? (
                          <small className="unit-status">
                            {n === p.lessons.length ? <Check /> : null}
                            {n} / {p.lessons.length} finished
                          </small>
                        ) : null;
                      })()}
                    </div>
                    {lessonRows(p)}
                  </section>
                ),
              )}
            </details>
          );
        })}
      <p className="content-note">
        These N5–N1 courses and decks are AI-assisted drafts awaiting
        native-speaker review. Finishing lessons does not establish proficiency;
        continue reading and listening to real Japanese alongside the course.
      </p>
    </>
  );
}
export function Fieldwork() {
  const sessions =
    useLiveQuery(() => db.fieldSessions.orderBy("at").reverse().toArray()) ??
    [];
  const [kind, setKind] = useState<FieldSession["kind"]>("reading");
  const [minutes, setMinutes] = useState(20);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [support, setSupport] = useState<FieldSession["support"]>("supported");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeading
        title="Beyond the course."
        description="Log the reading, listening and conversations you do outside the app."
      />
      <div className="fieldwork-intro">
        <h2>The practice that travels with you.</h2>
        <p>
          {sessions.length} encounters logged ·{" "}
          {sessions.reduce((s, x) => s + x.minutes, 0)} minutes of self-reported
          study. These records document practice; they do not certify fluency.
        </p>
      </div>
      <div className="fieldwork-layout">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!title.trim() || minutes < 1 || minutes > 600) return;
            setBusy(true);
            try {
              await db.fieldSessions.add({
                id: crypto.randomUUID(),
                at: Date.now(),
                kind,
                minutes,
                title: title.trim(),
                note: note.trim(),
                feedback: feedback.trim(),
                support,
              });
              setTitle("");
              setNote("");
              setFeedback("");
              setStatus("Encounter saved, including your feedback notes.");
            } catch {
              setStatus("Could not save the encounter. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2>Add an encounter</h2>
          <label htmlFor="field-kind">What did you practise?</label>
          <select
            id="field-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as FieldSession["kind"])}
          >
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
            <option value="conversation">Conversation with a person</option>
            <option value="writing">Writing</option>
          </select>
          <label htmlFor="field-title">Book, clip, task, or conversation</label>
          <input
            required
            id="field-title"
            maxLength={160}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A chapter, a café conversation, a work email…"
          />
          <div className="field-row">
            <label>
              Minutes
              <input
                type="number"
                required
                min={1}
                max={600}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </label>
            <label>
              Support
              <select
                value={support}
                onChange={(e) =>
                  setSupport(e.target.value as FieldSession["support"])
                }
              >
                <option value="supported">With help</option>
                <option value="independent">Without help</option>
              </select>
            </label>
          </div>
          <label htmlFor="field-note">
            What could you do? What was difficult?
          </label>
          <textarea
            id="field-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe something observable, not a level guess."
          />
          <label htmlFor="field-feedback">
            Feedback from a teacher or conversation partner
          </label>
          <textarea
            id="field-feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional: a correction, a more natural phrase, or a next step."
          />
          <Button type="submit" disabled={busy}>
            Save encounter
            <Check />
          </Button>
          <p role="status">{status}</p>
        </form>
        <aside>
          <h2>A useful next step.</h2>
          <div className="resource-list">
            {[
              [
                "Irodori · Japanese for Life in Japan",
                "Free Japan Foundation coursebooks and audio for daily-life communication.",
                "https://www.irodori.jpf.go.jp/en/",
              ],
              [
                "JLPT · official sample questions",
                "Use unseen questions to check exam comprehension separately from conversation.",
                "https://www.jlpt.jp/e/samples/forlearners.html",
              ],
              [
                "JF Standard · Can-do",
                "Plan tasks you want to perform, beyond a vocabulary count.",
                "https://www.jfstandard.jpf.go.jp/summary/ja/render.do",
              ],
            ].map(([name, description, url]) => (
              <a href={url} key={name} target="_blank" rel="noreferrer">
                <h3>
                  {name}
                  <ArrowSquareOut size={18} />
                </h3>
                <p>{description}</p>
              </a>
            ))}
          </div>
          <h2>Your recent encounters</h2>
          {sessions.length ? (
            sessions.slice(0, 20).map((s) => (
              <article className="field-session" key={s.id}>
                <small>
                  {new Date(s.at).toLocaleDateString()} · {s.kind} · {s.minutes}{" "}
                  min · {s.support}
                </small>
                <h3>{s.title}</h3>
                {s.note && <p>{s.note}</p>}
                {s.feedback && (
                  <p>
                    <strong>Partner feedback:</strong> {s.feedback}
                  </p>
                )}
              </article>
            ))
          ) : (
            <p className="muted">
              Your first real-world encounter will appear here. A five-minute
              exchange counts as a beginning.
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
