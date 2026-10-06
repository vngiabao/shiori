import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const takes = JSON.parse(readFileSync("src/generated/dialogue-voices.json", "utf8"));

for (const unit of [
  {
    id: "n3-u01", reading: "A week of changes and choices",
    lessons: [
      ["A change you can describe", "n3-u01-d-vlog", "An ability or routine has changed", "A deliberate goal: ために versus ように"],
      ["Choose a purpose and a method", "n3-u01-d-purpose", "A deliberate goal: ために versus ように", "An ability or routine has changed"],
    ],
  },
  {
    id: "n3-u02", reading: "Two calls and a short break",
    lessons: [
      ["Before, during, and just after", "n3-u02-d-phone", "Locate an action in three stages", "Act before a useful state changes"],
      ["Use the time while it lasts", "n3-u02-d-window", "Act before a useful state changes", "Locate an action in three stages"],
    ],
  },
  {
    id: "n3-u03", reading: "A message separating impressions and facts",
    lessons: [
      ["What you saw, and what you heard", "n3-u03-d-preview", "State what was reported, and by whom", "A perceived trait, not an identity"],
      ["A likeness is not an identity", "n3-u03-d-costume", "A perceived trait, not an identity", "State what was reported, and by whom"],
    ],
  },
  {
    id: "n3-u04", reading: "From an expectation to a checked record",
    lessons: [
      ["Expectation, conviction and a checked fact", "n3-u04-d-note", "An expectation with grounds", "Recommend a responsible action"],
      ["Explain the result; choose the responsible action", "n3-u04-d-record", "Recommend a responsible action", "An expectation with grounds"],
    ],
  },
  {
    id: "n3-u05", reading: "Three opinions are not everybody’s opinion",
    lessons: [
      ["Topic, target and two viewpoints", "n3-u05-d-opinions", "Name the topic of a discussion", "Read what によって connects"],
      ["A survey has a scope", "n3-u05-d-survey", "Read what によって connects", "Name the topic of a discussion"],
    ],
  },
  {
    id: "n3-u06", reading: "Decided yesterday; carried out last night",
    lessons: [
      ["An arrangement and a personal choice", "n3-u06-d-meeting", "A decision is not its completed action", "No need is not a prohibition"],
      ["No need, and requested advice", "n3-u06-d-help", "No need is not a prohibition", "A decision is not its completed action"],
    ],
  },
  {
    id: "n3-u07", reading: "Before travel; after arrival",
    lessons: [
      ["A route and its conditions", "n3-u07-d-route", "Describe a regular result or a discovery", "Advice based on a stated plan"],
      ["Preparation before; a message after", "n3-u07-d-plan", "Advice based on a stated plan", "Describe a regular result or a discovery"],
    ],
  },
  {
    id: "n3-u08", reading: "What the screen didn’t tell me",
    lessons: [
      ["A fact and an unmet expectation", "n3-u08-d-screen", "An outcome that stays the same", "Recognise blame; choose how to repair it"],
      ["Recognise blame; repair the conversation", "n3-u08-d-repair", "Recognise blame; choose how to repair it", "An outcome that stays the same"],
    ],
  },
  {
    id: "n3-u09", reading: "Service restored; the session still starts at four",
    lessons: [
      ["A reason, a thank-you and an accusation", "n3-u09-d-route", "Credit a benefit; notice sarcasm", "Read ため as cause or purpose in context"],
      ["A report keeps what is still unknown", "n3-u09-d-report", "Read ため as cause or purpose in context", "Credit a benefit; notice sarcasm"],
    ],
  },
  {
    id: "n3-u10", reading: "A whole session; three days of omissions",
    lessons: [
      ["A span, an interruption and each update", "n3-u10-d-review", "Track what happens each time", "A recurring tendency is not an identity"],
      ["A repeated habit and a slight state", "n3-u10-d-habit", "A recurring tendency is not an identity", "Track what happens each time"],
    ],
  },
  {
    id: "n3-u11", reading: "Thanks for the slot; the copy has been returned",
    lessons: [
      ["Ask for the opportunity to act", "n3-u11-d-request", "Ask to do the action yourself", "Follow the grantor and the doer"],
      ["Granted, completed, or made to do it", "n3-u11-d-followup", "Follow the grantor and the doer", "Ask to do the action yourself"],
    ],
  },
  {
    id: "n3-u12", reading: "A viewing record; the next day is not set",
    lessons: [
      ["Hear what the short forms contain", "n3-u12-d-watch", "Hear the full verb inside a short ending", "Remember a plan; wonder about an answer"],
      ["Recall, wonder and respond among peers", "n3-u12-d-recall", "Remember a plan; wonder about an answer", "Hear the full verb inside a short ending"],
    ],
  },
  {
    id: "n3-u13", reading: "Misaki’s note after the guessing game",
    lessons: [
      ["Guess the character from the line", "n3-u13-d-cast", "Read a bundle of character cues", "A marked style still carries a meaning"],
      ["Play through the gate scene", "n3-u13-d-reading", "A marked style still carries a meaning", "Read a bundle of character cues"],
    ],
  },
  {
    id: "n3-u14", reading: "A home-listening review, not a universal rating",
    lessons: [
      ["Read features and trial conditions", "n3-u14-d-compare", "Add a second feature, without denying the first", "Keep the comparison direction in a negative sentence"],
      ["Choose for a purpose, with a stated condition", "n3-u14-d-decide", "Keep the comparison direction in a negative sentence", "Add a second feature, without denying the first"],
    ],
  },
  {
    id: "n3-u15", reading: "Four panels: the umbrella and the late arrival",
    lessons: [
      ["Read bubbles and printed effects", "n3-u15-d-page", "Separate a line from a printed effect", "Read the word with the action it modifies"],
      ["Recover a casual line from its context", "n3-u15-d-context", "Read the word with the action it modifies", "Separate a line from a printed effect"],
    ],
  },
  {
    id: "n3-u16", reading: "A venue change, two activities and last year’s figures",
    lessons: [
      ["Read a news brief with its source and date", "n3-u16-d-news", "Keep the source attached to the report", "Compare the same quantity and the same period"],
      ["Use the timetable without mixing its quantities", "n3-u16-d-plan", "Compare the same quantity and the same period", "Keep the source attached to the report"],
    ],
  },
  {
    id: "n2-u01", reading: "Sharing a quiet moment",
    secondReading: "The same essay, a different page",
    lessons: [
      ["Edit a plain-style essay", "n2-u01-d-edit", "A plain written predicate: である", "Acknowledge a fact, then a remaining contrast"],
      ["Read the contrast, not just the connector", "n2-u01-d-deadline", "Acknowledge a fact, then a remaining contrast", "A plain written predicate: である"],
    ],
  },
  {
    id: "n2-u02", reading: "Three questions before the shop opens",
    secondReading: "Change the screening, keep the promise",
    lessons: [
      ["A tendency and requested advice", "n2-u02-d-advice", "A tendency, not a rule for everyone", "Correct an inference without saying the opposite"],
      ["An inference and a commitment", "n2-u02-d-promise", "Correct an inference without saying the opposite", "A tendency, not a rule for everyone"],
    ],
  },
  {
    id: "n2-u03", reading: "The library’s relocation notice",
    secondReading: "A workshop open beyond students",
    lessons: [
      ["Read the instructions for a new opening", "n2-u03-d-move", "Read an instruction tied to a significant occasion", "Expand eligibility beyond the named group"],
      ["Who is included, and which case is singled out?", "n2-u03-d-visit", "Expand eligibility beyond the named group", "Read an instruction tied to a significant occasion"],
    ],
  },
  {
    id: "n2-u04", reading: "A fee that keeps the door open",
    secondReading: "One cancellation is not the end",
    lessons: [
      ["A conclusion and an unavoidable action", "n2-u04-d-fee", "State a considered conclusion", "Limit a claim to just that amount or role"],
      ["A limited claim and an added fact", "n2-u04-d-rain", "Limit a claim to just that amount or role", "State a considered conclusion"],
    ],
  },
  {
    id: "n2-u05", reading: "A nine-thirty update on the interrupted line",
    secondReading: "Three extra evening buses for a trial",
    lessons: [
      ["An update and a forecast", "n2-u05-d-train", "Name the source of a report", "Find the event and the response"],
      ["A response and an accompanying change", "n2-u05-d-bus", "Find the event and the response", "Name the source of a report"],
    ],
  },
  {
    id: "n2-u06", reading: "Request a review before ordering the printing",
    secondReading: "Correct the weekday, keep two deadlines separate",
    lessons: [
      ["Send a clear request for review", "n2-u06-d-review", "Offer an action towards the recipient", "Ask to perform an action yourself"],
      ["Correct an error and ask permission", "n2-u06-d-correction", "Ask to perform an action yourself", "Offer an action towards the recipient"],
    ],
  },
  {
    id: "n2-u07", reading: "Visitor information for the demonstration",
    secondReading: "A handover memo: request versus confirmed schedule",
    lessons: [
      ["Confirm a meeting and check availability", "n2-u07-d-meeting", "Recognise a formal identification or statement", "Introduce yourself without changing whose name it is"],
      ["Take a client’s message without promising a change", "n2-u07-d-message", "Introduce yourself without changing whose name it is", "Recognise a formal identification or statement"],
    ],
  },
  {
    id: "n2-u08", reading: "Yui’s diary: a place to sit and a card to post",
    secondReading: "Hana’s message: the long blue umbrella",
    lessons: [
      ["Follow a story through short responses", "n2-u08-d-cafe", "A short response can keep the story going", "Recover the missing noun from this conversation"],
      ["Recover a reference and check it", "n2-u08-d-umbrella", "Recover the missing noun from this conversation", "A short response can keep the story going"],
    ],
  },
]) test(`${unit.id} lessons bind grammar and scenes, recordings decode, reading support and saved themes work`, async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    (window as any).played = [];
    HTMLMediaElement.prototype.play = function () {
      (window as any).played.push(new URL(this.src).pathname);
      queueMicrotask(() => this.dispatchEvent(new Event("ended")));
      return Promise.resolve();
    };
  });
  await page.goto("/");
  const audioFailures = await page.evaluate(async (lines: { url: string; seconds: number }[]) => {
    const ctx = new AudioContext(), failed: string[] = [];
    for (const line of lines) {
      try {
        const response = await fetch(line.url);
        if (!response.ok) throw new Error(String(response.status));
        const audio = await ctx.decodeAudioData(await response.arrayBuffer());
        if (audio.numberOfChannels !== 1 || Math.abs(audio.duration - line.seconds) > .001) throw new Error("Invalid recording");
      } catch { failed.push(line.url); }
    }
    await ctx.close(); return failed;
  }, unit.lessons.flatMap(([, scene]) => takes[scene]));
  expect(audioFailures).toEqual([]);
  if (unit.id === "n2-u08") await page.evaluate(() => {
    // Real WAVs above decode first. Mock only completion for long timed scenes;
    // conversation-timing.spec separately checks real audio-clock overlap.
    const buffers = new WeakMap<ArrayBuffer, string>(), decoded = new WeakMap<AudioBuffer, string>();
    const fetchReal = window.fetch;
    window.fetch = async (...args) => {
      const response = await fetchReal(...args), arrayBuffer = response.arrayBuffer.bind(response);
      response.arrayBuffer = async () => {
        const data = await arrayBuffer(); buffers.set(data, new URL(String(args[0]), location.href).pathname); return data;
      };
      return response;
    };
    const proto = AudioContext.prototype as any, decodeReal = proto.decodeAudioData;
    proto.decodeAudioData = async function (data: ArrayBuffer) {
      const buffer = await decodeReal.call(this, data); decoded.set(buffer, buffers.get(data)!); return buffer;
    };
    AudioBufferSourceNode.prototype.start = function () {
      (window as any).played.push(decoded.get(this.buffer!));
      queueMicrotask(() => this.onended?.call(this, new Event("ended")));
    };
  });
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(page.getByRole("heading", { name: "Your next letter is ready." })).toBeVisible();
  for (const [title, scene, allowed, absent] of unit.lessons) {
    await page.goto("/#library");
    await page.getByLabel("Show lessons").selectOption(unit.id.slice(0, 2));
    await page.locator(".course-lessons > div").filter({ hasText: title }).getByRole("button", { name: "Read", exact: true }).click();
    const counter = page.locator(".lesson-top > span").last();
    for (let step = 0; step < 16; step++) {
      const meet = page.getByRole("button", { name: "I’ve met these" });
      if (!(await meet.count())) break;
      const before = await counter.textContent();
      await meet.click();
      await expect(counter).not.toHaveText(before!);
    }
    await expect(page.getByRole("heading", { name: "Notice how this works." })).toBeVisible();
    await expect(page.getByText(allowed, { exact: true })).toBeVisible();
    await expect(page.getByText(absent, { exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Hear it in context" }).click();
    await expect(page.getByRole("heading", { name: "Listen to the conversation." })).toBeVisible();
    await page.getByRole("button", { name: "Play again", exact: true }).click();
    // Playback retains a 380 ms inter-line pause even with mocked media.
    // Longer scenes must finish without weakening the exact mapping check.
    const playbackTimeout = Math.max(10000, takes[scene].length * 500 + 2000);
    await expect.poll(() => page.evaluate(() => (window as any).played), { timeout: playbackTimeout }).toEqual(expect.arrayContaining(takes[scene].map((t: { url: string }) => t.url)));
    await expect(page.getByRole("button", { name: "Answer questions", exact: true })).toBeEnabled({ timeout: playbackTimeout });
    await page.getByRole("button", { name: "Leave lesson", exact: true }).click();
  }
  for (const [width, theme] of [[1440, "light"], [375, "light"], [1440, "dark"], [375, "dark"]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#settings");
    await page.getByRole("button", { name: theme === "dark" ? "Night post" : "Morning letter" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.goto("/#read");
    await page.reload();
    await page.getByRole("button", { name: "Texts", exact: false }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const readingTitle of unit.secondReading ? [unit.reading, unit.secondReading] : [unit.reading]) {
    const region = page.getByRole("region", { name: readingTitle, exact: true });
    if (!(await region.isVisible())) await page.getByText(readingTitle, { exact: true }).first().click();
    await expect(region).toBeVisible();
    await expect(region.locator("ruby")).toHaveCount(0);
    if (unit.id === "n3-u15") {
      await expect(region.locator("section.notice-note")).toHaveCount(4);
      await expect(region.getByText("Sound effect:", { exact: true })).toHaveCount(5);
      await expect(region.getByText("Yui:", { exact: true })).toHaveCount(3);
    }
    if (unit.id === "n3-u16") {
      await expect(region.getByRole("table")).toHaveCount(1);
      await expect(region.getByRole("row")).toHaveCount(3);
      await expect(region.getByRole("cell", { name: "無料", exact: true })).toBeVisible();
      await expect(region.getByRole("cell", { name: "三百円", exact: true })).toBeVisible();
    }
    await region.getByRole("button", { name: /furigana/i }).click();
    expect(await region.locator("ruby").count()).toBeGreaterThan(0);
    if (unit.id === "n3-u16") {
      const tableScroll = region.getByRole("region", { name: `${unit.reading} table`, exact: true });
      await tableScroll.focus();
      await expect(tableScroll).toBeFocused();
      if (await tableScroll.evaluate(el => el.scrollWidth > el.clientWidth)) {
        await page.keyboard.press("ArrowRight");
        await expect.poll(() => tableScroll.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.locator("h1").click();
    const suffix = readingTitle !== unit.reading ? "-second" : "";
    await page.screenshot({ path: `output/${unit.id}-reading${suffix}-${theme}-${width}.png`, fullPage: true });
    }
  }
});
