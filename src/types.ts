import type { Card } from "ts-fsrs";
export type Skill =
  | "reading"
  | "reading-aloud"
  | "listening"
  | "recall"
  | "typing"
  | "politeness";
export type Support =
  "none" | "furigana" | "romaji" | "transcript" | "meaning" | "example";
export type Word = {
  lemma?: { text: string; kana: string };
  id: string;
  text: string;
  kana: string;
  romaji: string;
  meaning: string;
  register: "neutral" | "polite" | "casual" | "formal";
  example: string;
  /** Optional reviewed-context teaching example; ruby and translation are support. */
  exampleRuby?: string;
  exampleMeaning?: string;
  pitch: number | null;
  jlpt: number | null;
  parts: { text: string; reading?: string }[];
  source?: string;
};
export type Lesson = {
  id: string;
  title: string;
  description: string;
  kind: "kana" | "phrase" | "kanji";
  words: string[];
  canDo: string;
  minutes: number;
};
export type Letter = {
  id: string;
  title: string;
  from: string;
  subject: string;
  tokens: string[];
  paragraphs: number[];
  prerequisites: string[];
  question: string;
  options: string[];
  answer: number;
};
export type Roleplay = {
  id: string;
  title: string;
  partner: string;
  scene: string;
  turns: {
    line: string;
    kana: string;
    meaning: string;
    task: string;
    example: string;
    exampleMeaning?: string;
    accept: string[];
    alternatives?: string[];
    register: string;
  }[];
};
export type Pack = {
  category?: "vocabulary";
  /** Editorial exception: authentic situations take priority over vocabulary quotas. */
  recycling?: { target: number; reason: string };
  id: string;
  version: number;
  status: "AI-assisted draft" | "reviewed";
  title: string;
  words: Word[];
  lessons: Lesson[];
  letters: Letter[];
  roleplays: Roleplay[];
  grammar: {
    id: string;
    lessons?: string[];
    title: string;
    explanation: string;
    example: string;
    translation: string;
    formation?: string;
    mistake?: string;
    examples?: { ja: string; en: string }[];
  }[];
  kanji: {
    char: string;
    meaning: string;
    components: string;
    on: string;
    kun: string;
    words: string[];
  }[];
  /** Short scenes heard before their text is shown. */
  dialogues?: Dialogue[];
  readings?: Reading[];
  watch?: { grammar: string[]; prompt: string };
  /** Practice in new sentences; lessons and letters reference these by id. */
  exercises?: Exercise[];
};
export type Reading = {
  id: string;
  lesson: string;
  title: string;
  genre:
    | "notice"
    | "message"
    | "email"
    | "article"
    | "diary"
    | "guide"
    | "story"
    | "essay"
    | "news"
    | "literature"
    | "manga";
  paragraphs: string[];
  glosses: { text: string; kana: string; meaning: string }[];
  table?: { head: string[]; rows: string[][] };
  pair?: string;
  source?: {
    title: string;
    author: string;
    deathYear: number;
    url: string;
    licence: string;
  };
  panels?: {
    description: string;
    lines: { speaker: string; line: string; sfx?: boolean }[];
  }[];
};
/** Japanese lines use ruby markup: {漢字|かんじ}. One narrator voices every speaker. */
export type Dialogue = {
  id: string;
  lesson: string;
  title: string;
  scene: string;
  speed?: number;
  words?: string[];
  lines: { speaker: string; line: string; romaji: string; meaning: string }[];
};
export type Exercise = {
  id: string;
  lesson?: string;
  letter?: string;
  reading?: string;
  /** Dialogue questions replay this scene without its text. */
  dialogue?: string;
  type:
    | "cloze"
    | "reply"
    | "dialogue"
    | "truefalse"
    | "order"
    | "choice"
    | "speaker"
    | "register"
    | "compare";
  skill: Skill;
  /** An English situation, so the right answer depends on meaning. */
  context?: string;
  prompt?: string;
  /** Ruby markup. Cloze sentences hold one ＿＿ gap. */
  line?: string;
  meaning?: string;
  options?: string[];
  answer?: number | boolean;
  /** Order exercises: the tiles in their correct order. */
  tiles?: string[];
  explain: string;
  /** Word ids whose memories this exercise counts toward. */
  words: string[];
};
export type Attempt = {
  id: string;
  at: number;
  itemId: string;
  skill: Skill;
  correct: boolean | null;
  support: Support;
  source: string;
};
export type Memory = {
  id: string;
  itemId: string;
  skill: Skill;
  card: Card;
  due: number;
  successes: number;
  failures: number;
};
export type Profile = {
  updatedAt?: number;
  updatedBy?: string;
  id: "local";
  name: string;
  path: "kana" | "sound" | "together";
  minutes: number;
  created: number;
  theme: "light" | "dark";
  romaji: boolean;
  streak: boolean;
  furigana: boolean;
  spokenReactions?: boolean;
  wordAudio?: boolean;
  voicePreview?: string;
};
export type Completion = { id: string; at: number; canDo: string };
export type MediaAttempt = {
  id: string;
  at: number;
  clip: string;
  phase: string;
  transcript: boolean;
  /** Watch sessions: subtitle lines in the stretch watched, and how many you opened. */
  lines?: number;
  revealed?: number;
  /** Self-rating after a no-subtitle stretch: how much you followed (0–4). */
  followed?: number;
};
/** A subtitle line saved from your own film or episode. */
export type SavedLine = {
  id: string;
  at: number;
  clip: string;
  start: number;
  end: number;
  text: string;
  note: string;
  unit?: string;
};
export type FieldSession = {
  id: string;
  at: number;
  kind: "reading" | "listening" | "conversation" | "writing";
  minutes: number;
  title: string;
  support: "independent" | "supported";
  note: string;
  feedback: string;
};
