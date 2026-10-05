import { describe, it, expect } from "vitest";
import { dictionaryReadingKey } from "../src/packs";

describe("dictionary reading equivalence", () => {
  it("accepts kana script and width variants", () => {
    expect(dictionaryReadingKey("ｺｰﾋｰ")).toBe(dictionaryReadingKey("こーひー"));
  });
  it("does not erase sound or contextual particle differences", () => {
    for (const [a, b] of [["きや", "きゃ"], ["か", "が"], ["は", "わ"], ["を", "お"], ["こう", "こー"]])
      expect(dictionaryReadingKey(a)).not.toBe(dictionaryReadingKey(b));
  });
});
