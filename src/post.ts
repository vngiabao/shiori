// The daily post: a forgiving weekly rhythm instead of a fragile streak, a
// reminder the learner's own calendar delivers, and a small way back after
// time away. Everything here is computed from saved history; nothing is sent.
import { dayKey } from "./rewards";
import type { Attempt, Completion } from "./types";

export const goalChoices = [3, 4, 5, 6, 7] as const;
export const defaultGoal = 4;
/** Away this many days since the last study day = the welcome-back state. */
export const AWAY_DAYS = 3;

/** Days on which the learner answered something or finished a lesson. */
export function studyDays(attempts: Attempt[], completions: Completion[]) {
  const days = new Set<string>();
  for (const a of attempts) if (a.correct !== null) days.add(dayKey(a.at));
  for (const c of completions) days.add(dayKey(c.at));
  return days;
}

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** Monday to Sunday of the week containing `now`, each at local midnight. */
export function weekOf(now = Date.now()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const monday = addDays(d, -((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function weekProgress(
  days: Set<string>,
  goal = defaultGoal,
  now = Date.now(),
) {
  const today = dayKey(now);
  const week = weekOf(now);
  const slots = week.map((date) => {
    const key = dayKey(date.getTime());
    return {
      key,
      date,
      studied: days.has(key),
      today: key === today,
      future: key > today,
    };
  });
  const done = slots.filter((s) => s.studied).length;
  // This week counts once it is met; an unfinished week never breaks the run.
  let weeks = done >= goal ? 1 : 0;
  for (
    let start = addDays(week[0], -7);
    weeks < 520;
    start = addDays(start, -7)
  ) {
    let count = 0;
    for (let i = 0; i < 7; i++)
      if (days.has(dayKey(addDays(start, i).getTime()))) count++;
    if (count < goal) break;
    weeks++;
  }
  return { slots, done, goal, met: done >= goal, weeks };
}

/** Whole days since the last study day: 0 today, 1 yesterday. */
export function daysAway(days: Set<string>, now = Date.now()) {
  if (!days.size || days.has(dayKey(now))) return 0;
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  for (let n = 1; n < 3650; n++)
    if (days.has(dayKey(addDays(d, -n).getTime()))) return n;
  return 3650;
}

/** Valid "HH:MM" (24-hour) or undefined. */
export function cleanTime(t: unknown) {
  return typeof t === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(t)
    ? t
    : undefined;
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return new Date(2026, 0, 1, h, m).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The next time the reminder fires: today if still ahead, else tomorrow. */
export function nextAt(time: string, now = new Date()) {
  const [h, m] = time.split(":").map(Number);
  const at = new Date(now);
  at.setHours(h, m, 0, 0);
  return at > now ? at : addDays(at, 1);
}

const pad = (n: number) => String(n).padStart(2, "0");
const local = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utc = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
const icsText = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
// RFC 5545: lines longer than 75 octets continue on a line starting with a space.
const fold = (line: string) => {
  const parts: string[] = [];
  let rest = line;
  while (new TextEncoder().encode(rest).length > 74) {
    let cut = 74;
    while (new TextEncoder().encode(rest.slice(0, cut)).length > 74) cut--;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  parts.push(rest);
  return parts.join("\r\n ");
};

export type ReminderText = { title: string; details: string; alarm: string };

/** A daily repeating event in floating local time, so it follows the
 *  learner across time zones, with an alert when it starts. */
export function calendarFile(
  time: string,
  minutes: number,
  text: ReminderText,
  now = new Date(),
) {
  const start = nextAt(time, now);
  const end = new Date(start.getTime() + minutes * 60_000);
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Shiori//Daily post//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:shiori-daily-post-${now.getTime()}@shiori`,
      `DTSTAMP:${utc(now)}`,
      `DTSTART:${local(start)}`,
      `DTEND:${local(end)}`,
      "RRULE:FREQ=DAILY",
      `SUMMARY:${icsText(text.title)}`,
      `DESCRIPTION:${icsText(text.details)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsText(text.alarm)}`,
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}

export function googleCalendarUrl(
  time: string,
  minutes: number,
  text: ReminderText,
  now = new Date(),
) {
  const start = nextAt(time, now);
  const end = new Date(start.getTime() + minutes * 60_000);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: text.title,
    dates: `${local(start)}/${local(end)}`,
    details: text.details,
    recur: "RRULE:FREQ=DAILY",
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

type Badging = Navigator & {
  setAppBadge?: (n?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};
/** Installed app only: a dot on the home-screen icon while today's stamp is
 *  still open, for learners who asked for a reminder. */
export function updateBadge(waiting: boolean) {
  const n = navigator as Badging;
  if (!n.setAppBadge || !n.clearAppBadge) return;
  (waiting ? n.setAppBadge() : n.clearAppBadge()).catch(() => undefined);
}

const STAMPED = "shiori.post.stamped";
/** The last day whose stamp has already landed on Today. */
export function stampedDay() {
  try {
    return localStorage.getItem(STAMPED);
  } catch {
    return null;
  }
}
export function markStamped(day: string) {
  try {
    localStorage.setItem(STAMPED, day);
  } catch {
    // Private windows may refuse storage; the stamp simply lands again.
  }
}
