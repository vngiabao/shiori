import levelData from "../content/jlpt/levels.json";
import questionData from "../content/jlpt/questions.json";

export const jlptLevels = ["N5", "N4", "N3", "N2", "N1"] as const;
export type JlptLevel = (typeof jlptLevels)[number];
export const jlptStages = [
  "entry",
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "exam",
] as const;
export type JlptStage = (typeof jlptStages)[number];
export type QuizStage = "vocabulary" | "grammar" | "reading" | "exam";
export type JlptLevelInfo = {
  id: JlptLevel;
  title: string;
  summary: string;
  prerequisites: string[];
  focus: Record<"vocabulary" | "grammar" | "reading" | "listening", string[]>;
  minutes: number;
  somatome: string;
  book: string;
};
export type JlptQuestion = {
  id: string;
  level: JlptLevel;
  stage: QuizStage;
  prompt: string;
  passage?: string;
  options: string[];
  answer: number;
  explanation: string;
  focus: string;
  /** Timed samples draw two items from each written section. */
  section?: "vocabulary" | "grammar" | "reading";
};
export const levelInfos = levelData as JlptLevelInfo[];
export const jlptQuestions = questionData as JlptQuestion[];
export const questionMap = new Map(jlptQuestions.map((q) => [q.id, q]));
export type JlptPlan = {
  id: JlptLevel;
  cycle: number;
  source: "somatome" | "kanzen";
  targetDate: string;
};
export type JlptLog = {
  id: string;
  level: JlptLevel;
  cycle: number;
  stage: Exclude<JlptStage, "exam">;
  source: string;
  unit: string;
  minutes: number;
  notes: string;
  at: number;
  checks?: boolean[];
};
export type JlptRun = {
  id: string;
  level: JlptLevel;
  cycle: number;
  stage: QuizStage;
  questionIds: string[];
  answers: (number | null)[];
  started: number;
  deadline: number | null;
  submitted: number | null;
  aborted: boolean;
};
export const stageLabels: Record<JlptStage, string> = {
  entry: "Entry requirements",
  vocabulary: "Vocabulary & kanji",
  grammar: "Grammar in context",
  reading: "Reading with evidence",
  listening: "Listen beyond the page",
  exam: "Timed sample",
};
export const sourceLinks = {
  kanzen: "https://www.3anet.co.jp/np/list.html?series_id=4",
  somatome: "https://ask-books.com/somatome/",
  official: "https://www.jlpt.jp/e/samples/forlearners.html",
  workbook: "https://www.jlpt.jp/e/samples/sampleindex.html",
  format: "https://www.jlpt.jp/e/guideline/testsections.html",
};
export function newPlan(id: JlptLevel): JlptPlan {
  return { id, cycle: 1, source: "somatome", targetDate: "" };
}
export function questionsFor(level: JlptLevel, stage: QuizStage) {
  return jlptQuestions.filter((q) => q.level === level && q.stage === stage);
}
export function scoreRun(run: JlptRun) {
  const correct = run.questionIds.reduce(
    (n, id, i) => n + Number(questionMap.get(id)?.answer === run.answers[i]),
    0,
  );
  return {
    correct,
    total: run.questionIds.length,
    passed: correct / run.questionIds.length >= 0.8,
  };
}
export function stageComplete(
  stage: JlptStage,
  plan: JlptPlan,
  logs: JlptLog[],
  runs: JlptRun[],
) {
  const evidence = logs.filter(
    (l) => l.level === plan.id && l.cycle === plan.cycle && l.stage === stage,
  );
  if (stage === "entry")
    return evidence.some(
      (l) => l.checks?.length === 3 && l.checks.every(Boolean),
    );
  if (stage === "listening")
    return evidence.some((l) => l.minutes >= 15 && l.notes.trim().length >= 20);
  const pass = runs.some(
    (r) =>
      r.level === plan.id &&
      r.cycle === plan.cycle &&
      r.stage === stage &&
      r.submitted !== null &&
      !r.aborted &&
      scoreRun(r).passed,
  );
  return (
    pass &&
    (stage === "exam" ||
      evidence.some(
        (l) =>
          l.minutes >= 20 &&
          l.unit.trim().length >= 2 &&
          l.notes.trim().length >= 20,
      ))
  );
}
export function stageUnlocked(
  stage: JlptStage,
  plan: JlptPlan,
  logs: JlptLog[],
  runs: JlptRun[],
) {
  return jlptStages
    .slice(0, jlptStages.indexOf(stage))
    .every((s) => stageComplete(s, plan, logs, runs));
}
export function createRun(
  plan: JlptPlan,
  stage: QuizStage,
  now = Date.now(),
  history: JlptRun[] = [],
): JlptRun {
  const pool = questionsFor(plan.id, stage);
  const seen = new Map<string, number>();
  for (const run of history.filter(
    (r) => r.level === plan.id && r.stage === stage,
  ))
    for (const id of run.questionIds) seen.set(id, (seen.get(id) ?? 0) + 1);
  // Prefer unseen items, then the least repeated. Persist the selection so
  // refresh, backup and sync never replace a question midway through a run.
  const select = (items: JlptQuestion[]) =>
    items
      .map((question, order) => ({ question, order }))
      .sort(
        (a, b) =>
          (seen.get(a.question.id) ?? 0) - (seen.get(b.question.id) ?? 0) ||
          a.order - b.order,
      )
      .slice(0, 2)
      .map((x) => x.question);
  const qs =
    stage === "exam"
      ? (["vocabulary", "grammar", "reading"] as const).flatMap((section) =>
          select(pool.filter((q) => q.section === section)),
        )
      : select(pool);
  return {
    id: crypto.randomUUID(),
    level: plan.id,
    cycle: plan.cycle,
    stage,
    questionIds: qs.map((q) => q.id),
    answers: qs.map(() => null),
    started: now,
    deadline:
      stage === "exam"
        ? now + levelInfos.find((l) => l.id === plan.id)!.minutes * 60000
        : null,
    submitted: null,
    aborted: false,
  };
}
export function remainingSeconds(run: JlptRun, now = Date.now()) {
  return run.deadline === null
    ? null
    : Math.max(0, Math.ceil((run.deadline - now) / 1000));
}
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const positiveInt = (v: unknown): v is number =>
  finite(v) && Number.isInteger(v) && v >= 1;
export function validJlptPlan(value: unknown): value is JlptPlan {
  const p = value as JlptPlan;
  return (
    !!p &&
    jlptLevels.includes(p.id) &&
    positiveInt(p.cycle) &&
    ["somatome", "kanzen"].includes(p.source) &&
    !(p.id === "N5" && p.source === "kanzen") &&
    typeof p.targetDate === "string" &&
    (p.targetDate === "" || /^\d{4}-\d{2}-\d{2}$/.test(p.targetDate))
  );
}
export function validJlptLog(value: unknown): value is JlptLog {
  const l = value as JlptLog;
  return (
    !!l &&
    typeof l.id === "string" &&
    jlptLevels.includes(l.level) &&
    positiveInt(l.cycle) &&
    ["entry", "vocabulary", "grammar", "reading", "listening"].includes(
      l.stage,
    ) &&
    [l.source, l.unit, l.notes].every((v) => typeof v === "string") &&
    finite(l.at) &&
    Number.isInteger(l.minutes) &&
    l.minutes >= 0 &&
    l.minutes <= 600 &&
    (l.checks === undefined ||
      (Array.isArray(l.checks) &&
        l.checks.length === 3 &&
        l.checks.every((v) => typeof v === "boolean")))
  );
}
export function validJlptRun(value: unknown): value is JlptRun {
  const r = value as JlptRun;
  if (
    !r ||
    typeof r.id !== "string" ||
    !jlptLevels.includes(r.level) ||
    !positiveInt(r.cycle) ||
    !["vocabulary", "grammar", "reading", "exam"].includes(r.stage) ||
    !Array.isArray(r.questionIds) ||
    !Array.isArray(r.answers) ||
    !finite(r.started) ||
    typeof r.aborted !== "boolean"
  )
    return false;
  const expected = new Set(questionsFor(r.level, r.stage).map((q) => q.id));
  const count = r.stage === "exam" ? 6 : 2;
  return (
    r.questionIds.length === count &&
    new Set(r.questionIds).size === count &&
    r.questionIds.every((id) => expected.has(id)) &&
    (r.stage !== "exam" ||
      (["vocabulary", "grammar", "reading"] as const).every(
        (section) =>
          r.questionIds.filter((id) => questionMap.get(id)?.section === section)
            .length === 2,
      )) &&
    r.answers.length === count &&
    r.answers.every(
      (a) => a === null || (Number.isInteger(a) && a >= 0 && a < 4),
    ) &&
    (r.submitted === null ||
      (finite(r.submitted) && r.submitted >= r.started)) &&
    (r.stage === "exam"
      ? finite(r.deadline) && r.deadline > r.started
      : r.deadline === null)
  );
}
