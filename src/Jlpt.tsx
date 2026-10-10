import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowRight,
  ArrowSquareOut,
  Check,
  LockSimple,
  Timer,
  BookOpen,
  GraduationCap,
} from "@phosphor-icons/react";
import { db } from "./db";
import { Button, Furigana } from "./components";
import teacherLines from "../content/voices/jlpt-teacher.json";
import {
  createRun,
  jlptLevels,
  jlptStages,
  levelInfos,
  newPlan,
  questionMap,
  questionsFor,
  jlptQuestions,
  remainingSeconds,
  scoreRun,
  sourceLinks,
  stageComplete,
  stageLabels,
  stageUnlocked,
  type JlptLevel,
  type JlptLog,
  type JlptPlan,
  type JlptRun,
  type JlptStage,
  type QuizStage,
} from "./jlpt-model";
import "./jlpt.css";

function Teacher({
  line = "welcome",
  compact = false,
}: {
  line?: keyof Omit<typeof teacherLines, "status">;
  compact?: boolean;
}) {
  const text = teacherLines[line];
  return (
    <aside
      className={`jlpt-teacher ${compact ? "compact" : ""}`}
      aria-label="Violetto, your JLPT teacher"
    >
      <img
        src="/mascot/violetto-teacher.png"
        width="1145"
        height="1374"
        alt="Violetto wearing glasses, holding a fountain pen and study folio"
      />
      <div>
        <p lang="ja">
          <Furigana text={text.text} phrases />
        </p>
        <p>{text.meaning}</p>
      </div>
    </aside>
  );
}
function External({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowSquareOut size={16} />
      <span className="sr-only"> (opens a new tab)</span>
    </a>
  );
}

export function JlptRoom({
  level,
  onFocusChange,
}: {
  level: JlptLevel;
  onFocusChange: (focused: boolean) => void;
}) {
  const records = useLiveQuery(async () => ({
    plans: await db.jlptPlans.toArray(),
    logs: await db.jlptLogs.toArray(),
    runs: await db.jlptRuns.toArray(),
  }));
  const [selected, setSelected] = useState<JlptStage | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [selected, reviewId]);
  const focused = !!records?.runs.some(
    (r) => r.level === level && (r.submitted === null || r.id === reviewId),
  );
  useEffect(() => {
    onFocusChange(focused);
  }, [focused, onFocusChange]);
  useEffect(() => () => onFocusChange(false), [onFocusChange]);
  if (!records) return <p role="status">Opening your study record…</p>;
  const { plans, logs, runs } = records;
  const plan = plans.find((p) => p.id === level) ?? newPlan(level);
  const info = levelInfos.find((l) => l.id === level)!;
  const completed = jlptStages.filter((s) =>
    stageComplete(s, plan, logs, runs),
  );
  const stage =
    selected ?? jlptStages.find((s) => !completed.includes(s)) ?? "exam";
  const unlocked = stageUnlocked(stage, plan, logs, runs);
  const currentRuns = runs
    .filter((r) => r.level === level)
    .sort((a, b) => b.started - a.started);
  const active = currentRuns.find((r) => r.submitted === null);
  const run = active ?? currentRuns.find((r) => r.id === reviewId);
  const cycleLogs = logs.filter(
    (l) => l.level === level && l.cycle === plan.cycle,
  );
  const studyLogged = cycleLogs.some((l) => l.stage === stage && l.minutes > 0);
  const otherActive = runs.find(
    (r) => r.level !== level && r.submitted === null,
  );
  const sourceName =
    plan.source === "kanzen" ? "Shin Kanzen Master" : "Nihongo Sō-matome";
  const sourceUrl =
    plan.source === "kanzen" ? sourceLinks.kanzen : info.somatome;
  async function guarded(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch {
      setError(
        "Your changes could not be saved. Please try again; keep this page open.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function begin() {
    if (
      !stageUnlocked(stage, plan, logs, runs) ||
      !["vocabulary", "grammar", "reading", "exam"].includes(stage)
    )
      return;
    if (stage !== "exam" && !studyLogged) return;
    await guarded(async () => {
      await db.transaction("rw", [db.jlptRuns, db.jlptPlans], async () => {
        const existing = (
          await db.jlptRuns.where("level").equals(level).toArray()
        ).find((r) => r.submitted === null);
        if (existing) return;
        await db.jlptPlans.put(plan);
        await db.jlptRuns.add(
          createRun(plan, stage as QuizStage, Date.now(), runs),
        );
      });
      setReviewId(null);
    });
  }
  return (
    <section className="jlpt-room">
      {!run && (
        <>
          <div className="jlpt-title">
            <div>
              <h1>JLPT study room.</h1>
              <p>A clear assignment. A checked answer. The next chapter.</p>
            </div>
            <a href="#today">
              Return to your letters <ArrowRight size={18} />
            </a>
          </div>
          <nav className="jlpt-levels" aria-label="JLPT level">
            {jlptLevels.map((l) => (
              <a
                href={`#jlpt/${l}`}
                key={l}
                aria-current={level === l ? "page" : undefined}
              >
                {l}
                <span>
                  {l === "N5"
                    ? "Foundation"
                    : l === "N4"
                      ? "Elementary"
                      : l === "N3"
                        ? "Bridge"
                        : l === "N2"
                          ? "Advanced"
                          : "Precision"}
                </span>
              </a>
            ))}
          </nav>
        </>
      )}
      {error && (
        <p role="alert" className="jlpt-error">
          {error}
        </p>
      )}
      {run ? (
        <QuestionRun
          key={run.id}
          run={run}
          repeated={currentRuns.some(
            (r) =>
              r.id !== run.id &&
              r.stage === run.stage &&
              r.started < run.started &&
              r.questionIds.some((id) => run.questionIds.includes(id)),
          )}
          onDone={() => setReviewId(run.id)}
          onClose={() => {
            setReviewId(null);
            setSelected(null);
          }}
        />
      ) : (
        <>
          <div className="jlpt-brief">
            <div>
              <h2>
                {level}. {info.title}
              </h2>
              <p>{info.summary}</p>
              <p className="jlpt-cycle">
                Study cycle {plan.cycle} · {completed.length} of 6 milestones
                complete
              </p>
              <Button
                onClick={() => {
                  document
                    .getElementById("jlpt-assignment")
                    ?.scrollIntoView({ behavior: "instant" });
                  heading.current?.focus();
                }}
              >
                Continue {stageLabels[stage].toLowerCase()}{" "}
                <ArrowRight size={18} />
              </Button>
            </div>
            <Teacher />
          </div>
          {otherActive && (
            <p className="jlpt-notice">
              You also have an unfinished {otherActive.level} attempt.{" "}
              <a href={`#jlpt/${otherActive.level}`}>Resume it</a>; a timed
              attempt keeps counting while you are away.
            </p>
          )}
          <div className="jlpt-workspace">
            <aside className="jlpt-syllabus">
              <h2>Your pathway</h2>
              <ol>
                {jlptStages.map((s, i) => {
                  const done = completed.includes(s),
                    open = stageUnlocked(s, plan, logs, runs);
                  return (
                    <li key={s}>
                      <button
                        onClick={() => {
                          setSelected(s);
                          setMessage("");
                        }}
                        aria-current={stage === s ? "step" : undefined}
                      >
                        <span className="jlpt-step-number">
                          {done ? (
                            <Check size={19} />
                          ) : !open ? (
                            <LockSimple size={17} />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span>
                          {stageLabels[s]}
                          <small>
                            {done
                              ? "Complete"
                              : open
                                ? "Available"
                                : `After ${stageLabels[jlptStages[i - 1]]}`}
                          </small>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p>
                Pick any level to begin. Prior-level certificates are not
                required. These are Shiori study gates, not official JLPT
                eligibility rules.
              </p>
            </aside>
            <section
              id="jlpt-assignment"
              className="jlpt-assignment"
              aria-labelledby="jlpt-stage-title"
            >
              <h2 ref={heading} tabIndex={-1} id="jlpt-stage-title">
                {stageLabels[stage]}
              </h2>
              {!unlocked ? (
                <>
                  <Teacher compact line="locked" />
                  <p>Complete these prerequisites before this milestone:</p>
                  <ul>
                    {jlptStages
                      .slice(0, jlptStages.indexOf(stage))
                      .filter((s) => !completed.includes(s))
                      .map((s) => (
                        <li key={s}>
                          <button
                            className="text-button"
                            onClick={() => setSelected(s)}
                          >
                            {stageLabels[s]} <ArrowRight size={16} />
                          </button>
                        </li>
                      ))}
                  </ul>
                </>
              ) : stage === "entry" ? (
                <EntryRequirements
                  key={`${level}-${plan.cycle}`}
                  plan={plan}
                  done={completed.includes("entry")}
                  onSaved={() => {
                    setSelected("vocabulary");
                    setMessage("Entry checks saved as self-report.");
                  }}
                />
              ) : stage === "exam" ? (
                <>
                  <p>
                    Six original questions: two vocabulary, two grammar and two
                    reading. You have <strong>{info.minutes} minutes</strong>.
                    This is a short written sample, not a full mock exam;
                    listening is practised through the linked source materials.
                  </p>
                  <p className="muted">
                    Drawn from {questionsFor(level, "exam").length} sample
                    items; unseen questions are used first. This set does not
                    assess the whole level.
                  </p>
                  <ul className="jlpt-rules">
                    <li>No hints or answer explanations until submission.</li>
                    <li>
                      The clock continues through refreshes and page changes.
                      Unanswered items count as incorrect.
                    </li>
                    <li>
                      Reach 5/6 to finish this study cycle. This is a Shiori
                      practice threshold, not a JLPT pass mark.
                    </li>
                  </ul>
                  <Button disabled={busy} onClick={begin}>
                    <Timer size={19} />
                    Start {info.minutes}-minute sample
                  </Button>
                  {currentRuns.some(
                    (r) => r.stage === "exam" && r.submitted !== null,
                  ) && (
                    <p className="muted">
                      Earlier sample questions may return after the bank has
                      been used. Repeated items measure review, not fresh test
                      performance.
                    </p>
                  )}
                  {completed.length === 6 && (
                    <div className="jlpt-next-cycle">
                      <h3>Take the next chapter.</h3>
                      <p>
                        This cycle is finished. Continue with the next unit in
                        your book; earlier logs and results stay in your
                        history. The in-app bank is finite, so use publisher and
                        official sets for fresh evaluation.
                      </p>
                      <Button
                        secondary
                        disabled={busy}
                        onClick={() =>
                          guarded(async () => {
                            await db.jlptPlans.put({
                              ...plan,
                              cycle: plan.cycle + 1,
                            });
                            setSelected("entry");
                            setMessage("A new study cycle is ready.");
                          })
                        }
                      >
                        Begin next study cycle <ArrowRight size={18} />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="jlpt-assignment-source">
                    Study from{" "}
                    <External
                      href={
                        stage === "listening" ? sourceLinks.official : sourceUrl
                      }
                    >
                      {stage === "listening"
                        ? "official JLPT listening samples"
                        : sourceName}
                    </External>
                  </p>
                  <ul className="jlpt-focus">
                    {info.focus[stage].map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p>
                    {stage === "listening"
                      ? "Listen first without a transcript. Check the official answer, then replay and explain what you missed. Use the publisher’s listening volume for continued practice."
                      : "Work through the next relevant unit in your own edition. Check its answers, correct your errors, and record the unit or page range below."}
                  </p>
                  <StudyLogForm
                    key={`${level}-${plan.cycle}-${stage}`}
                    plan={plan}
                    stage={stage}
                    source={
                      stage === "listening"
                        ? "Official JLPT samples"
                        : sourceName
                    }
                    onSaved={() =>
                      setMessage(
                        "Study block saved. Your record is self-reported.",
                      )
                    }
                  />
                  {stage !== "listening" && (
                    <div className="jlpt-checkpoint">
                      <h3>Then check the essentials.</h3>
                      <p>
                        Two original questions; both must be correct. Drawn from{" "}
                        {questionsFor(level, stage as QuizStage).length} items,
                        with unseen items first. Finishing this checkpoint does
                        not complete the whole bank. Explanations follow
                        submission. These small checkpoints do not establish
                        complete coverage of this skill.
                      </p>
                      <Button disabled={!studyLogged || busy} onClick={begin}>
                        Start checkpoint <ArrowRight size={18} />
                      </Button>
                      {!studyLogged && (
                        <p className="muted">
                          Unlock by logging at least 20 minutes of source study
                          and an error note.
                        </p>
                      )}
                    </div>
                  )}
                  {stage === "listening" && completed.includes("listening") && (
                    <Button onClick={() => setSelected("exam")}>
                      Continue to timed sample <ArrowRight size={18} />
                    </Button>
                  )}
                </>
              )}
              {message && (
                <p role="status" className="jlpt-saved">
                  {message}
                </p>
              )}
            </section>
          </div>
          <section className="jlpt-source-desk">
            <div>
              <h2>Your reference shelf</h2>
              <p>
                Publisher lessons stay at the source or in your own book. Shiori
                supplies the sequence, study record and original practice. Level
                assignments in Shiori are editorial estimates, not an official
                vocabulary syllabus.
              </p>
              <label>
                Primary preparation series
                <select
                  value={plan.source}
                  disabled={busy}
                  onChange={(e) => {
                    const source = e.target.value as JlptPlan["source"];
                    void guarded(() => db.jlptPlans.put({ ...plan, source }));
                  }}
                >
                  <option value="somatome">Nihongo Sō-matome</option>
                  {level !== "N5" && (
                    <option value="kanzen">Shin Kanzen Master</option>
                  )}
                </select>
              </label>
              <label>
                My target test date (optional)
                <input
                  type="date"
                  value={plan.targetDate}
                  disabled={busy}
                  onChange={(e) => {
                    const targetDate = e.target.value;
                    void guarded(() =>
                      db.jlptPlans.put({ ...plan, targetDate }),
                    );
                  }}
                />
              </label>
              <p className="muted">
                Choose your local test date yourself. A target date is a
                planning aid, not a readiness forecast.
              </p>
            </div>
            <ul>
              <li>
                <External href={info.somatome}>{info.book}</External>
                <p>
                  ASK Publishing · publisher overview, previews and audio
                  access. The linked N3–N1 page is the grammar volume; use the
                  series catalogue for the other skills.
                </p>
              </li>
              {level !== "N5" && (
                <li>
                  <External href={sourceLinks.kanzen}>
                    Shin Kanzen Master · {level}
                  </External>
                  <p>
                    3A Network · catalogue of skill-specific preparation books.
                    Choose your level and edition.
                  </p>
                </li>
              )}
              <li>
                <External href={sourceLinks.somatome}>
                  Sō-matome series catalogue & audio
                </External>
              </li>
              <li>
                <External href={sourceLinks.official}>
                  Official JLPT sample questions · all levels
                </External>
              </li>
              <li>
                <External href={sourceLinks.workbook}>
                  Official practice workbooks
                </External>
              </li>
              <li>
                <External href={sourceLinks.format}>
                  Official test sections & timings
                </External>
              </li>
            </ul>
          </section>
          <section className="jlpt-history">
            <h2>Your study record</h2>
            <p>
              {logs
                .filter((l) => l.level === level)
                .reduce((n, l) => n + l.minutes, 0)}{" "}
              logged minutes at {level} · source-study minutes and entry checks
              are self-reported.
            </p>
            {!currentRuns.length && !cycleLogs.length ? (
              <p className="muted">
                Your first assignment will start this record.
              </p>
            ) : (
              <ul>
                {currentRuns
                  .filter((r) => r.submitted !== null)
                  .slice(0, 12)
                  .map((r) => (
                    <li key={r.id}>
                      <span>
                        Cycle {r.cycle} · {stageLabels[r.stage]}
                        <small>
                          {new Date(r.started).toLocaleDateString()} ·{" "}
                          {r.aborted
                            ? "Stopped"
                            : `${scoreRun(r).correct}/${scoreRun(r).total} raw correct`}
                        </small>
                      </span>
                      <button
                        className="text-button"
                        onClick={() => {
                          setReviewId(r.id);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Review answers <ArrowRight size={16} />
                      </button>
                    </li>
                  ))}
                {logs
                  .filter((l) => l.level === level && l.stage !== "entry")
                  .sort((a, b) => b.at - a.at)
                  .slice(0, 12)
                  .map((l) => (
                    <li key={l.id}>
                      <details>
                        <summary>
                          Cycle {l.cycle} · {l.unit} · {l.minutes} min
                        </summary>
                        <p>
                          {l.source} · {stageLabels[l.stage]}
                        </p>
                        <p>{l.notes}</p>
                      </details>
                    </li>
                  ))}
              </ul>
            )}
          </section>
          <p className="jlpt-provenance">
            {jlptQuestions.length} original AI-assisted draft questions across
            N5–N1, including{" "}
            {jlptQuestions.filter((q) => q.stage === "exam").length} sample-test
            questions. Not publisher questions, human-reviewed assessments,
            official scaled scores or a complete JLPT course. Sources checked 4
            October 2026. <a href="#settings">Back up this record</a>.
          </p>
        </>
      )}
    </section>
  );
}

function EntryRequirements({
  plan,
  done,
  onSaved,
}: {
  plan: JlptPlan;
  done: boolean;
  onSaved: () => void;
}) {
  const [checks, setChecks] = useState([false, false, false]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const info = levelInfos.find((l) => l.id === plan.id)!;
  return (
    <form
      className="jlpt-entry"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!checks.every(Boolean)) return;
        setBusy(true);
        setError("");
        try {
          await db.jlptLogs.add({
            id: crypto.randomUUID(),
            level: plan.id,
            cycle: plan.cycle,
            stage: "entry",
            source: "Self-check",
            unit: "Entry prerequisites",
            minutes: 0,
            notes:
              "Entry requirements confirmed by learner; not a diagnostic score.",
            at: Date.now(),
            checks,
          });
          onSaved();
        } catch {
          setError("Could not save the entry check. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p>
        Confirm these starting skills. Choose a lower level if they feel
        unfamiliar. This is a self-check, not placement testing.
      </p>
      {info.prerequisites.map((text, i) => (
        <label key={text}>
          <input
            type="checkbox"
            checked={checks[i]}
            onChange={(e) =>
              setChecks(checks.map((v, j) => (j === i ? e.target.checked : v)))
            }
          />
          <span>{text}</span>
        </label>
      ))}
      {plan.id === "N5" && (
        <p>
          Need the basics first?{" "}
          <a href="#library">Open the kana foundation course.</a>
        </p>
      )}
      <Button type="submit" disabled={busy || !checks.every(Boolean) || done}>
        {done ? "Entry checks already saved" : "Confirm starting skills"}
      </Button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
function StudyLogForm({
  plan,
  stage,
  source,
  onSaved,
}: {
  plan: JlptPlan;
  stage: "vocabulary" | "grammar" | "reading" | "listening";
  source: string;
  onSaved: () => void;
}) {
  const [unit, setUnit] = useState("");
  const [notes, setNotes] = useState("");
  const [minutes, setMinutes] = useState(stage === "listening" ? 15 : 20);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="jlpt-log-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (unit.trim().length < 2 || notes.trim().length < 20) return;
        setBusy(true);
        setError("");
        try {
          await db.jlptPlans.put(plan);
          await db.jlptLogs.add({
            id: crypto.randomUUID(),
            level: plan.id,
            cycle: plan.cycle,
            stage,
            source,
            unit: unit.trim(),
            minutes,
            notes: notes.trim(),
            at: Date.now(),
          });
          setUnit("");
          setNotes("");
          onSaved();
        } catch {
          setError("Could not save this study block. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div>
        <label>
          Book unit, pages or sample item
          <input
            required
            minLength={2}
            maxLength={150}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder={
              stage === "listening"
                ? "N5 sample · task-based comprehension"
                : "Your edition · unit and page range"
            }
          />
        </label>
        <label>
          Minutes studied
          <input
            type="number"
            min={stage === "listening" ? 15 : 20}
            max={600}
            required
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>
      </div>
      <label>
        What did you correct or learn?
        <textarea
          required
          minLength={20}
          maxLength={3000}
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record a specific error, its correction, and the evidence. At least 20 characters."
        />
      </label>
      <Button type="submit" secondary disabled={busy}>
        Save study block
      </Button>
      <span className="muted"> Self-reported work · saved on this device</span>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

function QuestionRun({
  run,
  repeated,
  onDone,
  onClose,
}: {
  run: JlptRun;
  repeated: boolean;
  onDone: () => void;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const finishing = useRef(false);
  const title = useRef<HTMLHeadingElement>(null);
  const seconds = remainingSeconds(run, now);
  const submitted = run.submitted !== null;
  const score = scoreRun(run);
  const question = questionMap.get(run.questionIds[index])!;
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [submitted]);
  useEffect(() => {
    title.current?.focus();
  }, [index, submitted]);
  async function finish(aborted = false) {
    if (finishing.current || submitted) return;
    finishing.current = true;
    setBusy(true);
    setError("");
    try {
      await db.transaction("rw", db.jlptRuns, async () => {
        const latest = await db.jlptRuns.get(run.id);
        if (latest && latest.submitted === null)
          await db.jlptRuns.update(run.id, { submitted: Date.now(), aborted });
      });
      onDone();
    } catch {
      setError(
        "Submission could not be saved. Please retry. Your recorded choices are still on this device.",
      );
    } finally {
      finishing.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (seconds === 0 && !submitted) void finish();
  }, [seconds, submitted, now]);
  async function answer(value: number) {
    if (busy || submitted) return;
    if (run.deadline !== null && Date.now() >= run.deadline) {
      void finish();
      return;
    }
    setBusy(true);
    setError("");
    try {
      await db.transaction("rw", db.jlptRuns, async () => {
        const latest = await db.jlptRuns.get(run.id);
        if (
          !latest ||
          latest.submitted !== null ||
          (latest.deadline !== null && Date.now() >= latest.deadline)
        )
          return;
        const answers = [...latest.answers];
        answers[index] = value;
        await db.jlptRuns.update(run.id, { answers });
      });
    } catch {
      setError("That answer could not be saved. Please select it again.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if (
        submitted ||
        busy ||
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.isComposing
      )
        return;
      if (
        (event.target as HTMLElement).closest(
          'textarea,select,[contenteditable="true"]',
        )
      )
        return;
      if (
        /^[1-4]$/.test(event.key) &&
        Number(event.key) <= question.options.length
      ) {
        event.preventDefault();
        void answer(Number(event.key) - 1);
      }
      if (
        event.key === "Enter" &&
        !(event.target as HTMLElement).closest("button,a")
      ) {
        event.preventDefault();
        if (index < run.questionIds.length - 1) setIndex(index + 1);
        else void finish();
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });
  return (
    <section className="jlpt-exam" aria-labelledby="jlpt-exam-title">
      <header className="lesson-top exam-top">
        <a href="#today" className="text-button">
          Leave sample
        </a>
        <span>
          {run.level} · {stageLabels[run.stage]}
        </span>
        <span>
          {index + 1} / {run.questionIds.length}
        </span>
      </header>
      <div
        className="lesson-progress"
        role="progressbar"
        aria-label="Sample progress"
        aria-valuemin={0}
        aria-valuemax={run.questionIds.length}
        aria-valuenow={submitted ? run.questionIds.length : index}
      >
        <span
          style={{
            width: `${(100 * (submitted ? run.questionIds.length : index)) / run.questionIds.length}%`,
          }}
        />
      </div>
      <div className="exam-task">
        <div className="jlpt-exam-heading">
          <div>
            <h2 ref={title} tabIndex={-1} id="jlpt-exam-title">
              {run.level} · {stageLabels[run.stage]}
            </h2>
            <p>
              {submitted
                ? "Answer review"
                : `Question ${index + 1} of ${run.questionIds.length}`}{" "}
              ·{" "}
              {repeated
                ? "Contains previously seen items"
                : "New items in your saved history"}
            </p>
          </div>
          {!submitted && seconds !== null && (
            <div
              className={`jlpt-timer ${seconds <= 60 ? "urgent" : ""}`}
              role="timer"
              aria-label="Time remaining"
            >
              <Timer size={23} />
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
            </div>
          )}
        </div>
        {error && (
          <p role="alert" className="jlpt-error">
            {error}
          </p>
        )}
        {submitted ? (
          <>
            <Teacher
              compact
              line={score.passed && !run.aborted ? "passed" : "retry"}
            />
            <h3>
              {run.aborted
                ? "Attempt stopped"
                : `${score.correct} / ${score.total} correct`}
            </h3>
            <p>
              {run.aborted
                ? "This attempt does not complete a milestone."
                : score.passed
                  ? "This practice checkpoint is complete. Continue with unfamiliar source material."
                  : "Review the explanations, study the weak points, then try again."}{" "}
              Raw results only; no official JLPT score or proficiency estimate.
            </p>
            <ol className="jlpt-answer-review">
              {run.questionIds.map((id, i) => {
                const q = questionMap.get(id)!;
                const a = run.answers[i];
                return (
                  <li key={id}>
                    <h4>
                      {q.focus} ·{" "}
                      {a === q.answer
                        ? "Correct"
                        : a === null
                          ? "Unanswered"
                          : "Needs review"}
                    </h4>
                    {q.passage && <p lang="ja">{q.passage}</p>}
                    <p lang="ja">{q.prompt}</p>
                    <p>
                      Your answer: {a === null ? "No answer" : q.options[a]}
                      <br />
                      Correct answer:{" "}
                      <strong lang="ja">{q.options[q.answer]}</strong>
                    </p>
                    <p>{q.explanation}</p>
                  </li>
                );
              })}
            </ol>
            <Button onClick={onClose}>
              Back to the pathway <ArrowRight size={18} />
            </Button>
          </>
        ) : (
          <>
            <p className="muted">
              Original Shiori practice · no hints during the attempt · answers
              save as you select them.
            </p>
            {question.passage && (
              <div className="jlpt-passage" lang="ja">
                {question.passage}
              </div>
            )}
            <fieldset className="jlpt-question">
              <legend lang="ja">{question.prompt}</legend>
              {question.options.map((option, i) => (
                <label
                  key={`${question.id}-${i}`}
                  className={run.answers[index] === i ? "selected" : ""}
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={run.answers[index] === i}
                    disabled={busy || seconds === 0}
                    onChange={() => void answer(i)}
                  />
                  <span className="choice-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span lang="ja">{option}</span>
                </label>
              ))}
            </fieldset>
            <div className="jlpt-question-actions">
              <Button
                secondary
                disabled={index === 0 || busy}
                onClick={() => setIndex(index - 1)}
              >
                Previous
              </Button>
              {index < run.questionIds.length - 1 ? (
                <Button disabled={busy} onClick={() => setIndex(index + 1)}>
                  Next question <ArrowRight size={18} />
                </Button>
              ) : (
                <Button disabled={busy} onClick={() => void finish()}>
                  Submit answers ({run.answers.filter((a) => a === null).length}{" "}
                  unanswered)
                </Button>
              )}
            </div>
            <button
              className="text-button jlpt-stop"
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Stop this attempt? Saved answers will remain in history, but this attempt will not complete a milestone.",
                  )
                )
                  void finish(true);
              }}
            >
              Stop attempt
            </button>
          </>
        )}
      </div>
      {!submitted && (
        <aside
          className="exam-companion jlpt-teacher"
          aria-label="Violetto, your JLPT teacher"
        >
          <img
            src="/mascot/violetto-teacher.png"
            width="1145"
            height="1374"
            alt="Violetto wearing glasses, holding a fountain pen and study folio"
          />
        </aside>
      )}
    </section>
  );
}
