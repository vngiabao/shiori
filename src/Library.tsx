import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, Check, ArrowSquareOut } from "@phosphor-icons/react";
import { courseCatalog as packs } from "./content";
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
  const levelOf = (id: string) =>
    /^(n[1-5]|keigo)-/.exec(id)?.[1] ?? "foundation";
  const currentLevel = levelOf(
    packs.find((p) =>
      p.lessons.some((l) => !completions.some((c) => c.id === l.id)),
    )?.id ?? "foundation",
  );
  const levels = ["foundation", "n5", "n4", "n3", "n2", "n1", "keigo"];
  return (
    <>
      <PageHeading
        title="Course library."
        description="Every installed lesson. New validated content packs appear here automatically."
      />
      <div className="library-summary">
        <p>
          <strong>{packs.length}</strong> content pack ·{" "}
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
        .map((level) => (
          <details
            className="course-level"
            key={`${level}-${filter}`}
            open={
              level === "foundation" ||
              level === currentLevel ||
              (level === "n5" && currentLevel === "foundation") ||
              filter === level
            }
          >
            <summary>
              <h2>
                {level === "foundation"
                  ? "Kana & first exchanges"
                  : level === "keigo"
                    ? "Keigo at work"
                    : level.toUpperCase()}
              </h2>
            </summary>
            {packs
              .filter((p) => levelOf(p.id) === level)
              .map((p) => (
                <section className="course-unit" key={p.id}>
                  <div className="section-title">
                    <h2>{p.title}</h2>
                    <span className="register">{p.status}</span>
                  </div>
                  <div className="course-lessons">
                    {p.lessons
                      .filter(
                        (l) =>
                          filter === "all" ||
                          levels.includes(filter) ||
                          filter === l.kind ||
                          (filter === "unfinished" &&
                            !completions.some((c) => c.id === l.id)),
                      )
                      .map((l) => (
                        <div key={l.id}>
                          <div>
                            <h3>{l.title}</h3>
                            <p>{l.description}</p>
                            <small>
                              {l.words.length} items · {l.minutes} min suggested
                              pace
                              {completions.some((c) => c.id === l.id)
                                ? " · finished"
                                : ""}
                            </small>
                          </div>
                          <div className="actions">
                            <button
                              className="text-button"
                              onClick={() => start(l)}
                            >
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
                </section>
              ))}
          </details>
        ))}
      <p className="content-note">
        The starter course is a foundation, not a complete N5–N1 curriculum.
        Later stages require additional reviewed packs and substantial practice
        with real material and people.
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
