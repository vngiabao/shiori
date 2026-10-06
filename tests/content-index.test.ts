import { expect, it } from "vitest";
import fs from "node:fs";
import { packs } from "../src/content";

it("keeps source-module course data identical to the validated authoring/audio aggregate", () => {
  const aggregate = JSON.parse(fs.readFileSync("src/generated/packs.json", "utf8"));
  expect(packs).toEqual(aggregate);
  expect(new Set(packs.map((pack) => pack.id)).size).toBe(packs.length);
  expect(packs[0].id).toBe("first-post");
});
