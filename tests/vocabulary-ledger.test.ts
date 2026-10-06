import { it, expect } from "vitest";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { words } from "../src/content";
import ledger from "../content/sources/decks/beginner-coverage.json";

it("accounts for every pinned beginner row without claiming alias or pattern mastery", () => {
  const ids = new Set(words.map((w) => w.id));
  for (const [level, count] of [
    ["n5", 718],
    ["n4", 668],
  ] as const) {
    const rows = ledger.rows.filter((r) => r.level === level);
    expect(rows).toHaveLength(count);
    expect(new Set(rows.map((r) => r.sourceRow)).size).toBe(count);
    expect(
      createHash("sha256")
        .update(fs.readFileSync(`content/sources/jlpt-vocabulary/${level}.csv`))
        .digest("hex"),
    ).toBe(ledger.csvSha256[`${level}.csv`]);
    for (const row of rows) {
      expect(row.independentMasteryEvidence).toBe(false);
      expect(row.courseIds.every((id) => ids.has(id))).toBe(true);
      if (
        ["pattern-not-headword", "excluded-with-reason"].includes(
          row.disposition,
        )
      ) {
        expect(row.courseIds).toEqual([]);
        expect(row.reason!.length).toBeGreaterThan(20);
      }
    }
  }
});
