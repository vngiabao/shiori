import { describe, it, expect } from "vitest";
import {
  calendarFile,
  cleanTime,
  daysAway,
  googleCalendarUrl,
  nextAt,
  studyDays,
  weekOf,
  weekProgress,
} from "../src/post";
import { dayKey } from "../src/rewards";
import type { Attempt } from "../src/types";

// Friday 30 October 2026, midday local time.
const now = new Date(2026, 9, 30, 12).getTime();
const day = 864e5;
const ago = (n: number) => dayKey(now - n * day);
const attempt = (at: number, correct: boolean | null = true): Attempt => ({
  id: String(at),
  itemId: "h-あ",
  at,
  skill: "reading",
  correct,
  support: "none",
  source: "lesson",
});
const text = {
  title: "Shiori · your daily post",
  details: "Two minutes, then rest; see https://x/#today",
  alarm: "Ready.",
};

describe("The daily post keeps a forgiving weekly rhythm", () => {
  it("counts answered work and finished lessons, not passive views", () => {
    const days = studyDays(
      [attempt(now), attempt(now - 2 * day, null)],
      [{ id: "hiragana-1", at: now - 3 * day, canDo: "" }],
    );
    expect([...days].sort()).toEqual([ago(3), ago(0)].sort());
  });
  it("runs Monday to Sunday", () => {
    const week = weekOf(now);
    expect(week.map((d) => d.getDay())).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(dayKey(week[4].getTime())).toBe(ago(0));
  });
  it("meets the goal by days, and an unfinished week never breaks the run", () => {
    const days = new Set([ago(0), ago(1), ago(3)]);
    const w = weekProgress(days, 4, now);
    expect(w.done).toBe(3);
    expect(w.met).toBe(false);
    expect(w.slots.find((s) => s.today)?.studied).toBe(true);
    expect(w.slots.filter((s) => s.future).length).toBe(2);
    // Last week (Mon 19 to Sun 25) had four days: the run holds at one.
    for (const n of [5, 6, 8, 10]) days.add(ago(n));
    expect(weekProgress(days, 4, now).weeks).toBe(1);
    days.add(ago(2));
    expect(weekProgress(days, 4, now)).toMatchObject({ met: true, weeks: 2 });
  });
  it("measures time away from the last study day", () => {
    expect(daysAway(new Set(), now)).toBe(0);
    expect(daysAway(new Set([ago(0)]), now)).toBe(0);
    expect(daysAway(new Set([ago(1)]), now)).toBe(1);
    expect(daysAway(new Set([ago(9), ago(4)]), now)).toBe(4);
  });
});

describe("The reminder is a calendar event the learner owns", () => {
  it("accepts only real 24-hour times", () => {
    expect(cleanTime("07:30")).toBe("07:30");
    expect(cleanTime("24:00")).toBeUndefined();
    expect(cleanTime("7:30")).toBeUndefined();
    expect(cleanTime(undefined)).toBeUndefined();
  });
  it("starts today when the time is still ahead, otherwise tomorrow", () => {
    const at = new Date(now);
    expect(nextAt("18:00", at).getDate()).toBe(30);
    expect(nextAt("08:00", at).getDate()).toBe(31);
  });
  it("writes a valid daily .ics in floating local time with an alert", () => {
    const ics = calendarFile("08:00", 10, text, new Date(now));
    const lines = ics.split("\r\n");
    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(ics).toContain("DTSTART:20261031T080000\r\n");
    expect(ics).toContain("DTEND:20261031T081000\r\n");
    expect(ics).toContain("RRULE:FREQ=DAILY\r\n");
    expect(ics).toContain("TRIGGER:PT0M\r\n");
    expect(ics).toContain("rest\\; see");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    for (const l of lines)
      expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
    // Folded lines rejoin to the original text.
    expect(ics.replace(/\r\n /g, "")).toContain(
      "SUMMARY:Shiori · your daily post",
    );
  });
  it("opens a repeating Google Calendar event", () => {
    const url = new URL(googleCalendarUrl("21:15", 20, text, new Date(now)));
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe(
      "20261030T211500/20261030T213500",
    );
    expect(url.searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
  });
});
