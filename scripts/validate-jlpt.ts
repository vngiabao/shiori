import {
  jlptLevels,
  jlptQuestions,
  levelInfos,
  questionsFor,
} from "../src/jlpt-model";
import assert from "node:assert/strict";
import sizes from "../content/jlpt/bank-sizes.json";
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
      sizes[level][stage],
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
  assert.ok(
    q.options.every((o) => o.trim().length > 0),
    q.id,
  );
  if (q.stage === "exam") {
    assert.ok(
      ["vocabulary", "grammar", "reading"].includes(q.section ?? ""),
      q.id,
    );
    if (q.section === "reading")
      assert.ok(q.passage && q.passage.length > 20, q.id);
  }
}
for (const level of jlptLevels) {
  const bank = jlptQuestions.filter((q) => q.level === level);
  const checkpointKeys = new Set(
    bank
      .filter((q) => q.stage !== "exam")
      .map((q) => `${q.passage ?? ""}|${q.prompt}`),
  );
  const sample = questionsFor(level, "exam");
  assert.ok(
    sample.every((q) => !checkpointKeys.has(`${q.passage ?? ""}|${q.prompt}`)),
    `${level}: sample duplicates checkpoint`,
  );
  for (const section of ["vocabulary", "grammar", "reading"] as const)
    assert.equal(
      sample.filter((q) => q.section === section).length,
      sizes[level].exam / 3,
      `${level} ${section} sample balance`,
    );
  for (const stage of ["vocabulary", "grammar", "reading", "exam"] as const) {
    const items = questionsFor(level, stage);
    assert.equal(
      new Set(items.map((q) => `${q.passage ?? ""}|${q.prompt}`)).size,
      items.length,
      `${level} ${stage}: duplicate task`,
    );
    if (items.length >= 20)
      for (let answer = 0; answer < 4; answer++)
        assert.ok(
          items.filter((q) => q.answer === answer).length >=
            Math.floor(items.length / 8),
          `${level} ${stage}: clustered answers`,
        );
  }
}
console.log(
  `JLPT gate passed: five pathways, ${jlptQuestions.length} original questions, balanced written samples, distinct checkpoints, complete answer/explanation metadata.`,
);
