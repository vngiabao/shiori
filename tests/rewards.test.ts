import { describe, it, expect } from "vitest";
import { postalProgress, dayKey } from "../src/rewards";
import { reactionFor } from "../src/persona";
import type { Attempt } from "../src/types";
const now = new Date(2026, 9, 4, 12).getTime();
const a = (id: string, extra: Partial<Attempt> = {}): Attempt => ({
  id,
  itemId: id,
  at: now,
  skill: "reading",
  correct: true,
  support: "none",
  source: "lesson",
  ...extra,
});
describe("Postal rewards preserve honest evidence", () => {
  it("does not award reading postmarks for hints or passive encounters", () => {
    const p = postalProgress(
      Array.from({ length: 8 }, (_, i) => a("w" + i, { support: "furigana" })),
      [],
      now,
    );
    expect(p.stamps.find((s) => s.id === "reader")?.at).toBeUndefined();
    expect(p.missions.find((m) => m.id === "retrieval")?.current).toBe(0);
    expect(postalProgress([a("seen", { correct: null })], [], now).days).toBe(
      0,
    );
  });
  it("cannot collect reading postmark by repeating one word", () => {
    const p = postalProgress(
      Array.from({ length: 8 }, (_, i) =>
        a("attempt" + i, { itemId: "one-word" }),
      ),
      [],
      now,
    );
    expect(p.stamps.find((s) => s.id === "reader")?.at).toBeUndefined();
  });
  it("keeps independent skill postmarks separate", () => {
    const p = postalProgress(
      Array.from({ length: 5 }, (_, i) => a("w" + i, { skill: "listening" })),
      [],
      now,
    );
    expect(p.stamps.find((s) => s.id === "listener")?.at).toBe(now);
    expect(p.stamps.find((s) => s.id === "reader")?.at).toBeUndefined();
  });
  it("deduplicates imported records and counts lesson completion without claiming accuracy", () => {
    const c = { id: "hiragana-1", at: now, canDo: "Practice kana" };
    const p = postalProgress([a("x"), a("x")], [c, c], now);
    expect(p.level).toBe(1);
    expect(p.missions[1].current).toBe(1);
  });
  it("a missed day does not erase earned stamps", () => {
    const rows = [
      a("one", { at: now - 4 * 86400000 }),
      a("two", { at: now - 2 * 86400000 }),
      a("three", { at: now - 86400000 }),
    ];
    expect(
      postalProgress(rows, [], now).stamps.find((s) => s.id === "regular")?.at,
    ).toBe(now - 86400000);
    expect(
      postalProgress(rows, [], now + 3 * 86400000).stamps.find(
        (s) => s.id === "regular",
      )?.at,
    ).toBe(now - 86400000);
    expect(postalProgress(rows, [], now + 3 * 86400000).streak).toBe(0);
  });
  it("requires delayed unaided retrieval for the return stamp", () => {
    const early = a("earlier", { itemId: "word", at: now - 86400000 });
    expect(
      postalProgress(
        [early, a("later", { itemId: "word" })],
        [],
        now,
      ).stamps.find((s) => s.id === "return")?.at,
    ).toBe(now);
    expect(
      postalProgress(
        [early, a("later", { itemId: "word", support: "meaning" })],
        [],
        now,
      ).stamps.find((s) => s.id === "return")?.at,
    ).toBeUndefined();
  });
  it("uses local calendar dates and renews only daily assignments", () => {
    expect(dayKey(now)).toBe("2026-10-04");
    expect(
      postalProgress([a("x")], [], now + 86400000).missions[1].current,
    ).toBe(0);
  });
  it("uses distinct supportive and unaided praise", () => {
    expect(reactionFor(true, true)).toBe("supported");
    expect(reactionFor(true, false)).toBe("correct");
    expect(reactionFor(false, false)).toBe("retry");
  });
});
