import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import type { Attempt, Memory, Skill } from "./types";
const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: false });
export function updateMemory(
  previous: Memory | undefined,
  a: Attempt,
): Memory | null {
  if (a.support !== "none" || a.correct === null) return null;
  if (previous && (previous.itemId !== a.itemId || previous.skill !== a.skill))
    throw new Error("Skill memory mismatch");
  const now = new Date(a.at);
  const card = scheduler.next(
    previous?.card ?? createEmptyCard(now),
    now,
    a.correct ? Rating.Good : Rating.Again,
  ).card;
  return {
    id: `${a.itemId}:${a.skill}`,
    itemId: a.itemId,
    skill: a.skill,
    card,
    due: card.due.getTime(),
    successes: (previous?.successes ?? 0) + Number(a.correct),
    failures: (previous?.failures ?? 0) + Number(!a.correct),
  };
}
export function evidence(attempts: Attempt[], skill: Skill) {
  const eligible = attempts.filter(
    (a) => a.skill === skill && a.support === "none" && a.correct !== null,
  );
  return {
    count: eligible.length,
    correct: eligible.filter((a) => a.correct).length,
    supported: attempts.filter((a) => a.skill === skill && a.support !== "none")
      .length,
  };
}
export function buildPlan(
  minutes: number,
  attempts: Attempt[],
  path: "kana" | "sound" | "together",
  due: number,
) {
  const read = evidence(attempts, "reading"),
    listen = evidence(attempts, "listening");
  const weakListen =
    listen.count >= 3 &&
    read.count >= 3 &&
    listen.correct / listen.count < read.correct / read.count - 0.15;
  const routes = due
    ? [
        "practice",
        path === "sound" || weakListen ? "listen" : "read",
        "letters",
        "speak",
      ]
    : ["read", "letters", "listen", "speak"];
  const weights = due
    ? [0.2, 0.35, 0.25, 0.2]
    : path === "sound" || weakListen
      ? [0.2, 0.2, 0.4, 0.2]
      : path === "kana"
        ? [0.4, 0.25, 0.2, 0.15]
        : [0.3, 0.25, 0.25, 0.2];
  let remaining = minutes;
  const items = routes.map((route, i) => {
    const n = i === 3 ? remaining : Math.round(minutes * weights[i]);
    remaining -= n;
    return { route, minutes: n };
  });
  return {
    items,
    reason: weakListen
      ? "More listening today: your recent reading is ahead of your ear."
      : path === "kana"
        ? "Begin with shapes, then meet them in words."
        : path === "sound"
          ? "Hear it first. Let the writing catch up alongside."
          : "Read, listen, then put the words to use.",
  };
}
export function romajiVisible(
  created: number,
  enabled: boolean,
  now = Date.now(),
) {
  return enabled && now - created < 14 * 86400000;
}
export function wordStatus(
  itemId: string,
  memories: Memory[],
  attempts: Attempt[],
) {
  const m = memories.find((m) => m.itemId === itemId && m.skill === "reading");
  return m && m.successes >= 3 && m.card.stability >= 7
    ? "secure"
    : m && m.successes > 0
      ? "recognised"
      : attempts.some((a) => a.itemId === itemId)
        ? "met"
        : "not met";
}
export function coverage(tokens: string[], memories: Memory[]) {
  const known = new Set(
    memories
      .filter((m) => m.skill === "reading" && m.successes > 0)
      .map((m) => m.itemId),
  );
  return tokens.length
    ? tokens.filter((t) => known.has(t)).length / tokens.length
    : 0;
}
