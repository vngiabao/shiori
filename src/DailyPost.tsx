import { useEffect, useId, useRef, useState } from "react";
import { CalendarPlus, GoogleLogo, ArrowRight } from "@phosphor-icons/react";
import { Button } from "./components";
import { db } from "./db";
import { useStampLanding } from "./motion";
import { stampSound } from "./sfx";
import {
  calendarFile,
  cleanTime,
  defaultGoal,
  formatTime,
  goalChoices,
  googleCalendarUrl,
  markStamped,
  stampedDay,
  weekProgress,
} from "./post";
import type { Profile } from "./types";

// Final copy drafted by GPT from a brief, then edited to Shiori's voice.
export const postCopy = {
  weekTitle: "The daily post",
  weekEmpty: "Begin with two minutes. Earn this week’s first stamp.",
  weekReturn: "This week’s stamps can start today.",
  weekFirst: "Your first lesson earns this week’s first stamp.",
  weekProgress: "{done} of {goal} days this week.",
  weekMet: "Your weekly goal is met. Rest, or study a little more.",
  weeksRunning: "Weekly goal met for {weeks} weeks in a row.",
  quickButton: "Study for two minutes",
  quickHelp: "Five familiar words still earn today’s stamp.",
  remindPrompt: "When should Violetto write to you each day?",
  remindHelp: "Tie it to a daily habit. Your calendar will remind you.",
  remindSet: "Your calendar reminds you at {time} each day.",
  remindInvalid: "Choose a time first.",
  addCalendar: "Apple or Outlook",
  addCalendarLabel: "Add to Apple Calendar or Outlook",
  googleCalendar: "Google Calendar",
  googleCalendarLabel: "Add to Google Calendar",
  changeTime: "Change time",
  eventTitle: "Shiori · your daily post",
  eventDetails:
    "Your next letter is ready. Spend two quiet minutes with Shiori: {link}",
  eventAlarm: "Your next letter is ready.",
  backTitle: "Your desk is as you left it.",
  backLine: "After {days} days away, begin with five familiar words.",
  backButton: "Begin with five words",
  stampedNote: "Today’s stamp is in place.",
  settingsTitle: "The daily post",
  settingsGoal: "Weekly study goal",
  settingsGoalHelp: "A weekly goal leaves room for rest.",
};
const fill = (s: string, v: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

const dayName = (d: Date, style: "short" | "long") =>
  d.toLocaleDateString("en-US", { weekday: style });

/** Twelve seasonal stamps on one 4 x 3 sheet, January first. */
function stampStyle(month: number) {
  return {
    backgroundPosition: `${((month % 4) * 100) / 3}% ${Math.floor(month / 4) * 50}%`,
  };
}

export function WeekPost({
  profile,
  days,
  quick,
  returning = false,
}: {
  profile: Profile;
  days: Set<string>;
  quick?: () => void;
  /** Welcome back: Today's heading already offers the two minutes. */
  returning?: boolean;
}) {
  const goal = profile.weekGoal ?? defaultGoal;
  const week = weekProgress(days, goal);
  const today = week.slots.find((s) => s.today)!;
  const scope = useRef<HTMLElement>(null);
  // Decided once per mount, before paint, so a re-render never replays it
  // and the stamp never flashes in place before it lands.
  const [landing] = useState(() => today.studied && stampedDay() !== today.key);
  const [settled, setSettled] = useState(!landing);
  const [note, setNote] = useState("");
  useStampLanding(scope, landing, {
    start: () => markStamped(today.key),
    impact: stampSound,
    done: () => {
      setSettled(true);
      setNote(postCopy.stampedNote);
    },
  });
  const summary = week.met
    ? postCopy.weekMet
    : week.done
      ? fill(postCopy.weekProgress, { done: week.done, goal })
      : returning
        ? postCopy.weekReturn
        : quick
          ? postCopy.weekEmpty
          : postCopy.weekFirst;
  return (
    <section
      className="week-post"
      ref={scope}
      aria-labelledby="week-post-title"
    >
      <div className="section-title">
        <h2 id="week-post-title">{postCopy.weekTitle}</h2>
        <label>
          <span className="sr-only">{postCopy.settingsGoal}</span>
          <select
            value={goal}
            onChange={(e) =>
              db.profiles.update("local", { weekGoal: Number(e.target.value) })
            }
          >
            {goalChoices.map((n) => (
              <option key={n} value={n}>
                {n} days a week
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="week-album">
        <ol className="week-stamps">
          {week.slots.map((s) => (
            <li
              key={s.key}
              className={`week-slot${s.studied ? " is-stamped" : ""}${s.today ? " is-today" : ""}${s.future ? " is-future" : ""}${s.today && !settled ? " is-landing" : ""}`}
              aria-current={s.today ? "date" : undefined}
            >
              <span className="sr-only">
                {`${dayName(s.date, "long")} ${s.date.getDate()}${s.studied ? ", stamped" : s.today ? ", today" : ""}`}
              </span>
              <span className="week-day" aria-hidden="true">
                {dayName(s.date, "short")}
              </span>
              <span className="week-frame" aria-hidden="true">
                {s.studied ? (
                  <>
                    <span
                      className="week-stamp"
                      style={{
                        ...stampStyle(s.date.getMonth()),
                        transform: `rotate(${((s.date.getDate() * 7) % 9) - 4}deg)`,
                      }}
                    />
                    <span className="week-cancel">{s.date.getDate()}</span>
                  </>
                ) : (
                  <>
                    {s.today && (
                      // The stamp today will earn, shown faintly in its slot.
                      <span
                        className="week-stamp is-ghost"
                        style={stampStyle(s.date.getMonth())}
                      />
                    )}
                    <span className="week-date">{s.date.getDate()}</span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
        <p className="week-summary">
          {summary}
          {week.weeks >= 2 && (
            <span className="week-run">
              {fill(postCopy.weeksRunning, { weeks: week.weeks })}
            </span>
          )}
        </p>
        <p className="sr-only" role="status">
          {note}
        </p>
        {quick && !returning && (
          <div className="week-quick">
            <Button secondary onClick={quick}>
              {postCopy.quickButton}
              <ArrowRight />
            </Button>
            <span>{postCopy.quickHelp}</span>
          </div>
        )}
      </div>
    </section>
  );
}

/** A daily reminder delivered by the learner's own calendar: an .ics file
 *  (Apple Calendar, Outlook) or a Google Calendar event, repeating daily and
 *  opening Today. The chosen time stays on this device. */
export function Reminder({
  profile,
  settings = false,
  save = (p) => db.profiles.update("local", p),
}: {
  profile: Profile;
  /** In Settings the section heading already asks the question. */
  settings?: boolean;
  save?: (p: Partial<Profile>) => unknown;
}) {
  const id = useId();
  const saved = cleanTime(profile.postTime);
  const [editing, setEditing] = useState(!saved);
  const [time, setTime] = useState(saved ?? "08:00");
  useEffect(() => {
    if (saved) setTime(saved);
  }, [saved]);
  const text = {
    title: postCopy.eventTitle,
    details: fill(postCopy.eventDetails, {
      link: `${location.origin}/#today`,
    }),
    alarm: postCopy.eventAlarm,
  };
  const minutes = Math.min(profile.minutes, 30);
  const clean = cleanTime(time);
  const keep = (e: React.MouseEvent) => {
    if (!clean) return e.preventDefault();
    save({ postTime: clean });
    setEditing(false);
  };
  if (!editing && saved)
    return (
      <p className={`post-reminder is-set${settings ? " in-settings" : ""}`}>
        {fill(postCopy.remindSet, { time: formatTime(saved) })}
        <button className="text-button" onClick={() => setEditing(true)}>
          {postCopy.changeTime}
        </button>
      </p>
    );
  return (
    <div className={`post-reminder${settings ? " in-settings" : ""}`}>
      {!settings && <h3>{postCopy.remindPrompt}</h3>}
      {/* The help line becomes the error when the time is empty, so the
          card never grows or shifts. */}
      <p
        id={`${id}-help`}
        className={clean ? undefined : "post-reminder-error"}
        aria-live="polite"
      >
        {clean ? postCopy.remindHelp : postCopy.remindInvalid}
      </p>
      <div className="post-reminder-row">
        <label>
          <span className="sr-only">Reminder time</span>
          <input
            type="time"
            value={time}
            required
            aria-invalid={!clean}
            aria-describedby={`${id}-help`}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <a
          className="button secondary"
          aria-label={postCopy.addCalendarLabel}
          aria-disabled={!clean}
          role="link"
          tabIndex={0}
          download={clean ? "shiori-daily-post.ics" : undefined}
          href={
            clean
              ? `data:text/calendar;charset=utf-8,${encodeURIComponent(
                  calendarFile(clean, minutes, text),
                )}`
              : undefined
          }
          onClick={keep}
        >
          <CalendarPlus />
          {postCopy.addCalendar}
        </a>
        <a
          className="button secondary"
          aria-label={postCopy.googleCalendarLabel}
          aria-disabled={!clean}
          role="link"
          tabIndex={0}
          href={clean ? googleCalendarUrl(clean, minutes, text) : undefined}
          target="_blank"
          rel="noreferrer"
          onClick={keep}
        >
          <GoogleLogo />
          {postCopy.googleCalendar}
        </a>
      </div>
    </div>
  );
}
