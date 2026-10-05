import { beforeEach, describe, expect, it, vi } from "vitest";
import "fake-indexeddb/auto";
import Dexie from "dexie";
import { db, ShioriDB, exportBackup, importBackup } from "../src/db";
import {
  createRun,
  newPlan,
  questionMap,
  remainingSeconds,
  scoreRun,
  stageComplete,
  stageUnlocked,
  validJlptRun,
  validJlptPlan,
  type JlptLog,
} from "../src/jlpt-model";
vi.stubGlobal("localStorage", {
  getItem: () => null,
  setItem: () => undefined,
});
const plan = newPlan("N5");
const entry: JlptLog = {
  id: "entry",
  level: "N5",
  cycle: 1,
  stage: "entry",
  source: "Self-check",
  unit: "Entry",
  notes: "Self-reported entry skills",
  minutes: 0,
  at: 100,
  checks: [true, true, true],
};
const study: JlptLog = {
  id: "study",
  level: "N5",
  cycle: 1,
  stage: "vocabulary",
  source: "Book",
  unit: "Unit one",
  notes: "Corrected two readings and compared them.",
  minutes: 20,
  at: 101,
};
function passed(stage: "vocabulary" | "grammar" | "reading" | "exam") {
  const r = createRun(plan, stage, 1000);
  r.answers = r.questionIds.map((id) => questionMap.get(id)!.answer);
  r.submitted = 2000;
  return r;
}
describe("JLPT progression and timing", () => {
  it("requires entry, source study and passing checkpoint in order", () => {
    const r = passed("vocabulary");
    expect(stageUnlocked("vocabulary", plan, [], [])).toBe(false);
    expect(stageUnlocked("vocabulary", plan, [entry], [])).toBe(true);
    expect(stageComplete("vocabulary", plan, [entry], [r])).toBe(false);
    expect(stageComplete("vocabulary", plan, [entry, study], [r])).toBe(true);
    expect(stageUnlocked("grammar", plan, [entry, study], [r])).toBe(true);
    expect(stageUnlocked("exam", plan, [entry, study], [r])).toBe(false);
    expect(
      stageComplete("vocabulary", { ...plan, cycle: 2 }, [entry, study], [r]),
    ).toBe(false);
  });
  it("does not award a stopped or unanswered attempt", () => {
    const r = passed("exam");
    r.answers[0] = null;
    r.answers[1] = null;
    expect(scoreRun(r)).toEqual({ correct: 4, total: 6, passed: false });
    r.answers = r.questionIds.map((id) => questionMap.get(id)!.answer);
    r.aborted = true;
    expect(stageComplete("exam", plan, [], [r])).toBe(false);
  });
  it("uses a fixed wall-clock deadline through refresh and sleep", () => {
    const r = createRun(plan, "exam", 1000);
    expect(remainingSeconds(r, 1000)).toBe(480);
    expect(remainingSeconds(JSON.parse(JSON.stringify(r)), 121000)).toBe(360);
    expect(remainingSeconds(r, 900000)).toBe(0);
    expect(remainingSeconds(createRun(plan, "grammar"))).toBeNull();
  });
  it("rejects changed question IDs, impossible answers and unsupported source levels", () => {
    const r = createRun(plan, "exam");
    expect(validJlptRun(r)).toBe(true);
    expect(validJlptRun({ ...r, answers: [9, ...r.answers.slice(1)] })).toBe(
      false,
    );
    expect(
      validJlptRun({ ...r, questionIds: ["other", ...r.questionIds.slice(1)] }),
    ).toBe(false);
    expect(validJlptPlan({ ...plan, source: "kanzen" })).toBe(false);
  });
});
describe("JLPT durability", () => {
  beforeEach(async () => {
    await db.jlptPlans.clear();
    await db.jlptLogs.clear();
    await db.jlptRuns.clear();
  });
  it("round trips all evidence and does not duplicate imports or undo a submission", async () => {
    const r = passed("exam");
    await db.jlptPlans.put(plan);
    await db.jlptLogs.bulkPut([entry, study]);
    await db.jlptRuns.put(r);
    const backup = await exportBackup();
    await db.jlptPlans.clear();
    await db.jlptLogs.clear();
    await db.jlptRuns.clear();
    await importBackup(backup);
    await importBackup(backup);
    expect(await db.jlptPlans.get("N5")).toEqual(plan);
    expect(await db.jlptLogs.count()).toBe(2);
    expect(await db.jlptRuns.count()).toBe(1);
    backup.jlptRuns[0].submitted = null;
    await importBackup(backup);
    expect((await db.jlptRuns.get(r.id))!.submitted).toBe(2000);
  });
  it("accepts legacy backups and rejects invalid new records before mutation", async () => {
    const backup = await exportBackup();
    const { jlptPlans, jlptLogs, jlptRuns, ...legacy } = backup;
    await expect(importBackup(legacy)).resolves.toBeUndefined();
    backup.jlptPlans = [{ ...plan, cycle: -1 }];
    await expect(importBackup(backup)).rejects.toThrow("invalid JLPT");
    expect(await db.jlptPlans.count()).toBe(0);
  });
  it("upgrades existing storage without removing earlier learner records", async () => {
    const name = "jlpt-migration-test";
    const old = new Dexie(name);
    old.version(2).stores({
      attempts: "id,at,itemId,skill",
      memories: "id,due,itemId,skill",
      profiles: "id",
      completions: "id,at",
      media: "id,at,clip",
      fieldSessions: "id,at,kind",
    });
    await old
      .table("completions")
      .put({ id: "old-lesson", at: 123, canDo: "read kana" });
    old.close();
    const upgraded = new ShioriDB(name);
    expect(await upgraded.completions.get("old-lesson")).toEqual({
      id: "old-lesson",
      at: 123,
      canDo: "read kana",
    });
    await upgraded.jlptPlans.put(plan);
    expect(await upgraded.jlptPlans.count()).toBe(1);
    await upgraded.delete();
  });
});
