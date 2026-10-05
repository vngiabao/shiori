import { describe, it, expect } from "vitest";
import { buildReviewSteps } from "../src/PhraseLesson";
import { updateMemory } from "../src/learning";
import type { Attempt, Skill } from "../src/types";

const due = (itemId: string, skill: Skill, correct = false) => {
  const a: Attempt = {
    id: itemId + skill,
    at: 1791100000000,
    itemId,
    skill,
    correct,
    support: "none",
    source: "test",
  };
  return { ...updateMemory(undefined, a)!, due: 0 };
};

describe("Mixed review", () => {
  it("brings a due word back inside a sentence task when one exists", () => {
    const [step] = buildReviewSteps([due("morning", "reading")]);
    expect(step.kind).toBe("exercise");
    if (step.kind === "exercise") {
      expect(step.ex.words[0]).toBe("morning");
      expect(step.ex.skill).toBe("reading");
    }
  });
  it("falls back to a recognition check for words without tasks", () => {
    const [step] = buildReviewSteps([due("tree", "listening")]);
    expect(step).toMatchObject({ kind: "check", skill: "listening" });
  });
  it("ignores memories that are not due yet", () => {
    const later = { ...due("morning", "reading"), due: Date.now() + 86400000 };
    expect(buildReviewSteps([later])).toEqual([]);
  });
});
