import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import sentences from "../content/reading/sentences.json";
import { words } from "../src/content";
import { rubyIsWellFormed } from "../src/text";
import {
  checkpointStatus,
  selectQuestions,
  validReadingRun,
  validTextDraft,
  wordQuestions,
  gapText,
  exactTextAnswer,
  type ReadingRun,
} from "../src/reading-path";
import { db, exportBackup, importBackup } from "../src/db";
const run = (at: number, supported = false): ReadingRun => ({
  id: String(at),
  at,
  stage: "sentences",
  checkpoint: true,
  responses: Array.from({ length: 8 }, (_, i) => ({
    itemId: String(i),
    correct: true,
    supported,
    elapsedMs: 1000,
    fresh: true,
  })),
});
describe("reading practice evidence", () => {
  it("requires independent success separated by a day", () => {
    expect(
      checkpointStatus([run(0, true), run(86400000, true)], "sentences"),
    ).toBe("practice");
    expect(checkpointStatus([run(0), run(1000)], "sentences")).toBe("once");
    expect(checkpointStatus([run(0), run(86400000)], "sentences")).toBe(
      "repeated",
    );
  });
  it("validates question banks and keeps unseen material first", () => {
    const bank = [
      ...sentences,
      ...wordQuestions(words, "kana"),
      ...wordQuestions(words, "words"),
    ];
    expect(new Set(bank.map((q) => q.id)).size).toBe(bank.length);
    for (const q of bank) {
      expect(rubyIsWellFormed(q.line)).toBe(true);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options.filter((o) => o === q.answer)).toHaveLength(1);
    }
    const seen = {
      ...run(0),
      responses: sentences
        .slice(0, 8)
        .map((q) => ({ ...run(0).responses[0], itemId: q.id })),
    };
    expect(
      selectQuestions(sentences, [seen]).every(
        (q) => !seen.responses.some((r) => r.itemId === q.id),
      ),
    ).toBe(true);
  });
  it("rejects malformed imports and checks exact cloze text", () => {
    expect(validReadingRun({ ...run(0), responses: [null] })).toBe(false);
    expect(
      validTextDraft({
        id: "x",
        at: 0,
        title: "x",
        text: "{猫|ねこ",
        blank: "猫",
        translation: "",
        reference: "",
      }),
    ).toBe(false);
    expect(gapText("{猫|ねこ}と猫", "猫")).toBe("＿＿と＿＿");
    expect(gapText("犬", "猫")).toBeNull();
    expect(exactTextAnswer("　ネコ ", "ネコ")).toBe(true);
    expect(exactTextAnswer("ねこ", "猫")).toBe(false);
  });
  it("backs up and merges reading history and newest text without replacing newer drafts", async () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: () => null, setItem: () => {} },
    });
    await db.readingRuns.clear();
    await db.textDrafts.clear();
    const d = {
      id: "desk-test",
      at: 2,
      title: "Lyric",
      text: "猫",
      blank: "猫",
      translation: "cat",
      reference: "",
    };
    await db.readingRuns.put(run(42));
    await db.textDrafts.put(d);
    const b = await exportBackup();
    expect(b.readingRuns).toHaveLength(1);
    expect(b.textDrafts).toEqual([d]);
    await db.textDrafts.put({ ...d, at: 3, translation: "newer" });
    await importBackup(b);
    expect((await db.textDrafts.get(d.id))?.translation).toBe("newer");
    expect(await db.readingRuns.count()).toBe(1);
    await expect(importBackup({ ...b, readingRuns: [null] })).rejects.toThrow();
    const { readingRuns, textDrafts, ...old } = b;
    await importBackup(old);
  });
});
