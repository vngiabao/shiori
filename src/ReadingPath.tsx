import { useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Furigana } from "./components";
import { words } from "./content";
import { db } from "./db";
import { plain } from "./text";
import sentences from "../content/reading/sentences.json";
import {
  stages,
  wordQuestions,
  selectQuestions,
  summary,
  checkpointStatus,
  type ReadingStage,
  type ReadingRun,
  type ReadingQuestion,
  type ReadingResponse,
  type TextDraft,
  validTextDraft,
  gapText,
  exactTextAnswer,
} from "./reading-path";

export function ReadingPath() {
  const runs = useLiveQuery(() => db.readingRuns.toArray(), []) ?? [];
  const [session, setSession] = useState<{
    stage: ReadingStage;
    checkpoint: boolean;
    questions: ReadingQuestion[];
  } | null>(null);
  const [index, setIndex] = useState(0),
    [responses, setResponses] = useState<ReadingResponse[]>([]);
  const [chosen, setChosen] = useState(""),
    [checked, setChecked] = useState(false),
    [support, setSupport] = useState(false);
  const [done, setDone] = useState<ReadingRun | null>(null),
    [error, setError] = useState("");
  const [timed, setTimed] = useState(false);
  const started = useRef(0);
  function begin(stage: ReadingStage, checkpoint: boolean) {
    const bank =
      stage === "sentences"
        ? sentences.filter(
            (q) => q.set === (checkpoint ? "checkpoint" : "practice"),
          )
        : wordQuestions(words, stage);
    setSession({ stage, checkpoint, questions: selectQuestions(bank, runs) });
    setIndex(0);
    setResponses([]);
    setChosen("");
    setChecked(false);
    setSupport(false);
    setDone(null);
    setError("");
    started.current = performance.now();
  }
  async function save(run: ReadingRun) {
    try {
      await db.readingRuns.put(run);
      setError("");
    } catch {
      setError("Could not save this session. Keep this page open and retry.");
    }
  }
  if (done) {
    const s = summary(done);
    return (
      <section className="reading-path">
        <h2>A little clearer.</h2>
        <p>
          {s.correct} of {s.total} correct · {s.independent} without hints or
          furigana.
        </p>
        <p>
          {done.responses.filter((r) => r.fresh).length} items were new to this
          practice history.
        </p>
        {timed && s.medianMs !== null && (
          <p>
            Median response: {(s.medianMs / 1000).toFixed(1)} seconds. This
            includes reading the choices; it is not a karaoke speed score.
          </p>
        )}
        <p>
          Come back another day. Two checkpoints of at least 7/8 without
          support, a day apart, are a cue to progress—not a proficiency
          certificate.
        </p>
        {error && (
          <p role="alert">
            {error}{" "}
            <Button onClick={() => void save(done)}>Retry saving</Button>
          </p>
        )}
        <Button
          onClick={() => {
            setSession(null);
            setDone(null);
          }}
        >
          Back to reading path
        </Button>
      </section>
    );
  }
  if (session) {
    const q = session.questions[index];
    return (
      <section className="reading-path" aria-label="Reading practice">
        <p>
          {session.checkpoint ? "Checkpoint" : "Practice"} · {index + 1} /{" "}
          {session.questions.length}
        </p>
        <h2>{q.prompt}</h2>
        <p className="reading-line" lang="ja">
          {support ? <Furigana text={q.line} /> : plain(q.line)}
        </p>
        <Button secondary disabled={checked} onClick={() => setSupport(true)}>
          Show reading or hint
        </Button>
        {support && <p>{q.hint}</p>}
        <div className="reading-choices">
          {q.options.map((o, i) => (
            <button
              className="answer-option"
              key={o}
              disabled={checked}
              aria-pressed={chosen === o}
              onClick={() => setChosen(o)}
            >
              <span>{i + 1}</span>
              {o}
            </button>
          ))}
        </div>
        {!checked ? (
          <Button
            disabled={!chosen}
            onClick={() => {
              setResponses([
                ...responses,
                {
                  itemId: q.id,
                  correct: chosen === q.answer,
                  supported: support,
                  elapsedMs: performance.now() - started.current,
                  fresh: !runs.some((r) =>
                    r.responses.some((x) => x.itemId === q.id),
                  ),
                },
              ]);
              setChecked(true);
            }}
          >
            Check answer
          </Button>
        ) : (
          <>
            <div role="status">
              <h3>
                {chosen === q.answer
                  ? "That is correct."
                  : "Let us look again."}
              </h3>
              <p>{q.explanation}</p>
            </div>
            <Button
              onClick={() => {
                if (index + 1 === session.questions.length) {
                  const run: ReadingRun = {
                    id: crypto.randomUUID(),
                    at: Date.now(),
                    stage: session.stage,
                    checkpoint: session.checkpoint,
                    responses,
                  };
                  setDone(run);
                  void save(run);
                } else {
                  setIndex(index + 1);
                  setChosen("");
                  setChecked(false);
                  setSupport(false);
                  started.current = performance.now();
                }
              }}
            >
              {index + 1 === session.questions.length
                ? "Finish practice"
                : "Next sentence or word"}
            </Button>
          </>
        )}
        <Button secondary onClick={() => setSession(null)}>
          Leave practice
        </Button>
      </section>
    );
  }
  return (
    <section className="reading-path">
      <div className="split-intro">
        <h2>Read without romaji.</h2>
        <p>
          Build accuracy, then ease. These beginner drills support your course;
          they are not a complete N2 or N1 curriculum.
        </p>
      </div>
      <label>
        <input
          type="checkbox"
          checked={timed}
          onChange={(e) => setTimed(e.target.checked)}
        />{" "}
        Show response-time summary (optional)
      </label>
      {stages.map((s, i) => (
        <article className="reading-stage" key={s.id}>
          <p className="muted">
            Step {i + 1} ·{" "}
            {checkpointStatus(runs, s.id) === "repeated"
              ? "Repeated on separate days"
              : checkpointStatus(runs, s.id) === "once"
                ? "One strong checkpoint"
                : "Ready to practise"}
          </p>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <p className="muted">Before you begin: {s.prerequisite}</p>
          <div className="reading-actions">
            <Button onClick={() => begin(s.id, false)}>Practise {s.id}</Button>
            <Button secondary onClick={() => begin(s.id, true)}>
              Check {s.id}
            </Button>
          </div>
        </article>
      ))}
      <p className="muted">
        Sentence checks use a separate 16-item bank and prefer unseen questions.
        Repeats are identified in your summary. Content is an AI-assisted draft
        awaiting native review.
      </p>
    </section>
  );
}
const empty = (): TextDraft => ({
  id: crypto.randomUUID(),
  at: Date.now(),
  title: "",
  text: "",
  blank: "",
  translation: "",
  reference: "",
});
const recoveryKey = "shiori-text-desk-recovery";
let pendingDraft: TextDraft | null = null;
function recoverDraft(): TextDraft | null {
  if (pendingDraft) return pendingDraft;
  try {
    const raw = JSON.parse(localStorage.getItem(recoveryKey) ?? "null");
    if (
      raw &&
      typeof raw.text === "string" &&
      raw.text.length <= 20000 &&
      validTextDraft({ ...raw, text: "" })
    )
      return raw;
  } catch {
    /* Keep the desk available if browser storage is unavailable. */
  }
  return null;
}
function cacheDraft(draft: TextDraft | null) {
  pendingDraft = draft;
  try {
    if (draft) localStorage.setItem(recoveryKey, JSON.stringify(draft));
    else localStorage.removeItem(recoveryKey);
  } catch {
    /* In-memory recovery still survives tab changes. */
  }
}
export function TextDesk() {
  const drafts =
    useLiveQuery(() => db.textDrafts.orderBy("at").reverse().toArray(), []) ??
    [];
  const [draft, setDraft] = useState<TextDraft>(
      () => recoverDraft() ?? empty(),
    ),
    [status, setStatus] = useState(""),
    [practice, setPractice] = useState(false),
    [answer, setAnswer] = useState(""),
    [reveal, setReveal] = useState(false);
  const [dirty, setDirty] = useState(() => !!recoverDraft());
  const gap = gapText(draft.text, draft.blank);
  const change = (key: keyof TextDraft, value: string) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setDirty(true);
    cacheDraft(next);
    setStatus("Unsaved changes");
    setReveal(false);
  };
  return (
    <section className="reading-path text-desk">
      <h2>Your text desk.</h2>
      <p>
        Bring a lyric, a short passage or a line you want to understand. Add
        your own readings and reference translation. Everything stays on this
        device. Saved passages are included in your backup.
      </p>
      {practice ? (
        <>
          <p className="reading-line" lang="ja">
            {gap}
          </p>
          <label>
            Missing text
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </label>
          <Button onClick={() => setReveal(true)}>Check missing text</Button>
          {reveal && (
            <p role="status">
              {exactTextAnswer(answer, draft.blank)
                ? "Exact match."
                : `The source uses: ${draft.blank}`}{" "}
              This checks the written text only.
            </p>
          )}
          <Button
            secondary
            onClick={() => {
              setPractice(false);
              setReveal(false);
            }}
          >
            Return to my text
          </Button>
        </>
      ) : (
        <>
          <label>
            Title
            <input
              maxLength={200}
              value={draft.title}
              onChange={(e) => change("title", e.target.value)}
            />
          </label>
          <label>
            Japanese text
            <textarea
              maxLength={20000}
              rows={6}
              value={draft.text}
              onChange={(e) => change("text", e.target.value)}
            />
          </label>
          <p className="muted">
            Optional furigana: {"{漢字|かんじ}"}. Readings are supplied by you,
            not guessed.
          </p>
          {validTextDraft(draft) && (
            <p className="reading-line">
              <Furigana text={draft.text} />
            </p>
          )}
          <label>
            Text to hide (exact word or phrase)
            <input
              maxLength={200}
              value={draft.blank}
              onChange={(e) => change("blank", e.target.value)}
            />
          </label>
          {draft.blank && !gap && (
            <p>
              Choose text that appears in the passage, without furigana markup.
            </p>
          )}
          <Button
            secondary
            disabled={!gap}
            onClick={() => {
              setPractice(true);
              setAnswer("");
              setReveal(false);
            }}
          >
            Practise missing text
          </Button>
          <label>
            My translation
            <textarea
              rows={3}
              maxLength={20000}
              value={draft.translation}
              onChange={(e) => change("translation", e.target.value)}
            />
          </label>
          <details>
            <summary>Reference translation and notes</summary>
            <p>
              Your own reference, not an automatically verified translation.
              Compare meaning, omitted subjects and verb endings.
            </p>
            <textarea
              aria-label="Reference translation"
              rows={3}
              maxLength={20000}
              value={draft.reference}
              onChange={(e) => change("reference", e.target.value)}
            />
          </details>
          <div className="reading-actions">
            <Button
              onClick={async () => {
                if (
                  !draft.title.trim() ||
                  !draft.text.trim() ||
                  !validTextDraft(draft)
                ) {
                  setStatus(
                    "Add a title and valid Japanese text; check any furigana brackets.",
                  );
                  return;
                }
                try {
                  const next = { ...draft, at: Date.now() };
                  await db.textDrafts.put(next);
                  setDraft(next);
                  setDirty(false);
                  cacheDraft(null);
                  setStatus("Saved on this device.");
                } catch {
                  setStatus("Save failed. Your text is still here; try again.");
                }
              }}
            >
              Save text
            </Button>
            <Button
              secondary
              onClick={() => {
                if (dirty && !window.confirm("Leave unsaved changes?")) return;
                setDraft(empty());
                setDirty(false);
                cacheDraft(null);
                setStatus("");
              }}
            >
              New text
            </Button>
          </div>
          <p role="status">{status}</p>
          <h3>Saved texts</h3>
          {drafts.length === 0 ? (
            <p className="muted">Your saved passages will appear here.</p>
          ) : (
            drafts.map((d) => (
              <Button
                key={d.id}
                secondary
                onClick={() => {
                  if (dirty && !window.confirm("Leave unsaved changes?"))
                    return;
                  setDraft(d);
                  setDirty(false);
                  cacheDraft(null);
                  setStatus("");
                }}
              >
                {d.title}
              </Button>
            ))
          )}
        </>
      )}
    </section>
  );
}
