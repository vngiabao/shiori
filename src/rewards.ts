import type { Attempt, Completion } from "./types";
export function dayKey(at: number) {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function postalProgress(
  attempts: Attempt[],
  completions: Completion[],
  now = Date.now(),
) {
  const unique = [...new Map(completions.map((c) => [c.id, c])).values()].sort(
    (a, b) => a.at - b.at,
  );
  const answered = [
    ...new Map(
      attempts.filter((a) => a.correct !== null).map((a) => [a.id, a]),
    ).values(),
  ].sort((a, b) => a.at - b.at);
  const days = [...new Set(answered.map((a) => dayKey(a.at)))];
  const today = dayKey(now);
  let streak = 0;
  const cursor = new Date(now);
  if (!days.includes(today)) cursor.setDate(cursor.getDate() - 1);
  while (days.includes(dayKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const counted = (kind: string) => {
    const first = new Map<string, Attempt>();
    for (const a of answered)
      if (
        a.skill === kind &&
        a.correct === true &&
        a.support === "none" &&
        a.source !== "letter" &&
        !first.has(a.itemId)
      )
        first.set(a.itemId, a);
    return [...first.values()];
  };
  const letters = answered.filter((a) => a.source === "letter");
  let delayed: Attempt | undefined;
  const firstRecall = new Map<string, number>();
  for (const a of answered) {
    if (a.correct !== true || a.support !== "none") continue;
    const key = a.itemId + ":" + a.skill,
      first = firstRecall.get(key);
    if (first === undefined) firstRecall.set(key, a.at);
    else if (!delayed && a.at - first >= 86400000) delayed = a;
  }
  const stamps = [
    {
      id: "first-post",
      title: "First dispatch",
      description: "Finish your first lesson.",
      symbol: "一",
      at: unique[0]?.at,
    },
    {
      id: "correspondent",
      title: "A correspondence begins",
      description: "Finish three different lessons.",
      symbol: "三",
      at: unique[2]?.at,
    },
    {
      id: "reader",
      title: "Words recognised",
      description: "Answer five reading items correctly without hints.",
      symbol: "読",
      at: counted("reading")[4]?.at,
    },
    {
      id: "listener",
      title: "Words heard",
      description: "Answer five listening items correctly without text.",
      symbol: "聴",
      at: counted("listening")[4]?.at,
    },
    {
      id: "letter",
      title: "A letter received",
      description: "Try a letter comprehension question; support is welcome.",
      symbol: "便",
      at: letters[0]?.at,
    },
    {
      id: "return",
      title: "A memory returns",
      description:
        "Recall the same item unaided on two occasions at least 24 hours apart.",
      symbol: "再",
      at: delayed?.at,
    },
    {
      id: "regular",
      title: "Three days of correspondence",
      description:
        "Answer questions on three different days. They need not be consecutive.",
      symbol: "日",
      at:
        days.length >= 3
          ? answered.find((a) => dayKey(a.at) === days[2])?.at
          : undefined,
    },
    {
      id: "foundation",
      title: "A growing collection",
      description: "Finish eight different lessons.",
      symbol: "八",
      at: unique[7]?.at,
    },
  ];
  const todays = answered.filter((a) => dayKey(a.at) === today);
  const missions = [
    {
      id: "lesson",
      title: "Send one lesson",
      detail: "Finish a new lesson.",
      current: Math.min(1, unique.filter((c) => dayKey(c.at) === today).length),
      target: 1,
      route: "library",
    },
    {
      id: "retrieval",
      title: "Try five without help",
      detail: "Five unaided answers; mistakes still count as honest attempts.",
      current: Math.min(5, todays.filter((a) => a.support === "none").length),
      target: 5,
      route: "practice",
    },
    {
      id: "letter",
      title: "Receive a letter",
      detail: "Read and answer a letter question, with any support you need.",
      current: Math.min(1, todays.filter((a) => a.source === "letter").length),
      target: 1,
      route: "letters",
    },
  ];
  const n = unique.length;
  return {
    level: n,
    title:
      n >= 21
        ? "Keeper of the first correspondence"
        : n >= 14
          ? "A familiar correspondent"
          : n >= 8
            ? "Words taking shape"
            : n >= 3
              ? "The correspondence begins"
              : n >= 1
                ? "A first letter sent"
                : "A desk waiting for you",
    stamps,
    missions,
    streak,
    days: days.length,
  };
}
