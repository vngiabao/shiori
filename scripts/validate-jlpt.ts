import {
  jlptLevels,
  jlptQuestions,
  levelInfos,
  questionsFor,
} from "../src/jlpt-model";
import assert from "node:assert/strict";
assert.equal(
  new Set(jlptQuestions.map((q) => q.id)).size,
  jlptQuestions.length,
  "Duplicate question IDs",
);
assert.equal(levelInfos.length, 5);
for (const level of jlptLevels) {
  assert.equal(levelInfos.filter((l) => l.id === level).length, 1);
  assert.equal(levelInfos.find((l) => l.id === level)!.prerequisites.length, 3);
  for (const stage of ["vocabulary", "grammar", "reading", "exam"] as const)
    assert.equal(
      questionsFor(level, stage).length,
      stage === "exam" ? 6 : 2,
      `${level} ${stage} bank size`,
    );
}
for (const q of jlptQuestions) {
  assert.ok(jlptLevels.includes(q.level));
  assert.equal(q.options.length, 4, q.id);
  assert.equal(new Set(q.options).size, 4, q.id);
  assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4, q.id);
  assert.ok(
    q.explanation.length > 20 && q.prompt.length > 3 && q.focus.length > 2,
    q.id,
  );
  if (q.stage === "reading")
    assert.ok(q.passage && q.passage.length > 20, q.id);
}
console.log(
  "JLPT gate passed: five pathways, 60 original questions, unique IDs, complete answer/explanation metadata.",
);
