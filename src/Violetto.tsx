import { useRef, useState } from "react";
import { daypart, useWatcher } from "./playful";
// Hallmark · design-system: DESIGN.md · designed-as-app: listening sheet and postmark album.
import {
  Check,
  ArrowRight,
  SpeakerHigh,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import {
  Mascot,
  PageHeading,
  Button,
  AudioButton,
  Furigana,
  type Pose,
} from "./components";
import {
  violetto,
  voiceCandidates,
  baselineLines,
  emotionalLines,
  emotionMoods,
  type Reaction,
} from "./persona";
import { speakReaction, playClip, stopAudio } from "./audio";
import { teacherLines, useReactionLine } from "./reactionState";
import castAuditions from "./generated/cast-auditions.json";
import { postalProgress } from "./rewards";
import { db } from "./db";
import type { Attempt, Completion, Profile } from "./types";
export function ViolettoBubble({ kind }: { kind: Reaction }) {
  const line = useReactionLine(kind);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className={`violetto-bubble ${expanded ? "expanded" : ""}`}>
      <button
        className="bubble-toggle"
        aria-expanded={expanded}
        aria-label="Expand Violetto’s message"
        onClick={() => setExpanded(!expanded)}
      >
        <span lang="ja">{line.text}</span>
        <SpeakerHigh size={18} />
      </button>
      <p className="bubble-japanese">
        <Furigana text={line.ruby} phrases />
      </p>
      <div className="bubble-details">
        <p className="bubble-reading">{line.romaji}</p>
        <p className="bubble-meaning">{line.meaning}</p>
        <button
          className="text-button"
          onClick={() => {
            setError("");
            speakReaction(kind, true).catch((e) => {
              if (e.name !== "AbortError")
                setError("Voice could not play. Please try again.");
            });
          }}
        >
          <SpeakerHigh size={18} />
          Hear Violetto
        </button>
        {error && <p role="status">{error}</p>}
      </div>
    </div>
  );
}
/** Today's companion: Violetto's Prussian-blue letter panel. */
export function ViolettoPanel({ kind, pose }: { kind: Reaction; pose: Pose }) {
  const line = useReactionLine(kind);
  const [error, setError] = useState("");
  const figure = useRef<HTMLSpanElement>(null);
  useWatcher(figure, 0.8, true);
  return (
    <aside
      className="violetto-panel"
      aria-label="A word from Violetto"
      data-daypart={daypart()}
    >
      <header>
        <h2>Violetto</h2>
        <span lang="ja">言葉を届ける</span>
      </header>
      <a
        className="panel-portrait"
        href="#companion"
        aria-label="Meet Violetto"
      >
        <Mascot ref={figure} pose={pose} size={208} />
      </a>
      <p className="panel-japanese">
        <Furigana text={line.ruby} phrases />
      </p>
      <p className="panel-romaji">{line.romaji}</p>
      <p className="panel-meaning">{line.meaning}</p>
      <button
        className="panel-hear"
        onClick={() => {
          setError("");
          speakReaction(kind, true).catch((e) => {
            if (e.name !== "AbortError")
              setError("Voice could not play. Please try again.");
          });
        }}
      >
        <SpeakerHigh size={18} />
        Hear Violetto
      </button>
      {error && <p role="status">{error}</p>}
    </aside>
  );
}
export function ReactionLine({
  kind,
  compact = false,
}: {
  kind: Reaction;
  compact?: boolean;
}) {
  const line = useReactionLine(kind);
  const [error, setError] = useState("");
  return (
    <div className={`violetto-line ${compact ? "compact" : ""}`}>
      <p className="reaction-japanese">
        <Furigana text={line.ruby} phrases />
      </p>
      {!compact && <p className="reaction-reading">{line.romaji}</p>}
      <p className="reaction-meaning">{line.meaning}</p>
      <button
        className="text-button"
        onClick={() => {
          setError("");
          speakReaction(kind, true).catch((e) => {
            if (e.name !== "AbortError")
              setError("Voice could not play. Please try again.");
          });
        }}
      >
        <SpeakerHigh size={18} />
        Hear Violetto
      </button>
      {error && <small role="status">{error}</small>}
    </div>
  );
}
export function Postmarks({
  attempts,
  completions,
  go,
}: {
  attempts: Attempt[];
  completions: Completion[];
  go: (route: string) => void;
}) {
  const post = postalProgress(attempts, completions);
  return (
    <>
      <PageHeading
        title="Postmarks."
        description="Each one records something you did. A missed day never removes one."
      >
        <Mascot pose="review" size={150} />
      </PageHeading>
      <section className="postal-level">
        <div>
          <p className="postal-number">{post.level}</p>
          <h2>{post.title}</h2>
          <p>Correspondence level · {post.level} different lessons finished.</p>
          <small>
            A record of practice, separate from Japanese proficiency.
          </small>
        </div>
        <ReactionLine kind={post.level ? "milestone" : "welcome"} />
      </section>
      <section className="postal-missions">
        <h2>Today's three small assignments</h2>
        <p>They renew each day. Your collected postmarks stay with you.</p>
        {post.missions.map((m) => (
          <button
            key={m.id}
            className="postal-mission"
            onClick={() => go(m.route)}
          >
            <span
              className={`mission-mark ${m.current === m.target ? "delivered" : ""}`}
            >
              {m.current === m.target ? <Check /> : <EnvelopeSimple />}
            </span>
            <span>
              <strong>{m.title}</strong>
              <small>{m.detail}</small>
            </span>
            <span>
              {m.current} / {m.target}
            </span>
            <ArrowRight />
          </button>
        ))}
      </section>
      <section className="postmark-collection">
        <h2>A collection of small beginnings</h2>
        <p>
          {post.stamps.filter((s) => s.at !== undefined).length} of{" "}
          {post.stamps.length} postmarks collected. These do not expire.
        </p>
        <div className="stamp-album">
          {post.stamps.map((s) => (
            <article
              key={s.id}
              className={
                s.at !== undefined ? "stamp-entry earned" : "stamp-entry"
              }
            >
              <span className="postmark-symbol" lang="ja">
                {s.symbol}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <small>
                  {s.at !== undefined
                    ? "Postmarked " + new Date(s.at).toLocaleDateString()
                    : "Still to collect"}
                </small>
              </div>
              {s.at !== undefined && <Check aria-label="Collected" />}
            </article>
          ))}
        </div>
      </section>
      <p className="notice-note">
        A missed day never removes a postmark. Accuracy, supported practice and
        each skill's memory stay separate in Progress.
      </p>
    </>
  );
}
export function VoiceStudio({ profile }: { profile: Profile }) {
  const [sample, setSample] = useState<Reaction>("welcome");
  const [playing, setPlaying] = useState("");
  const [status, setStatus] = useState("");
  const [teacherSample, setTeacherSample] = useState(teacherLines[0].id);
  const teacherLine = teacherLines.find((l) => l.id === teacherSample)!;
  const [castSpeaker, setCastSpeaker] = useState(castAuditions[0].speaker);
  const castTake = castAuditions.find((t) => t.speaker === castSpeaker)!;
  const choices: [Reaction, string][] = [
    ["welcome", "Greeting"],
    ["correct", "Quiet praise"],
    ["retry", "After a mistake"],
    ["politeness", "A precise correction"],
    ["complete", "A letter delivered"],
    ["rest", "A moment of rest"],
    ["lesson", "Clear lesson speech"],
    ["contrast", "Length & small っ"],
  ];
  const line = violetto.lines[sample];
  const mood =
    line.mood in emotionMoods
      ? emotionMoods[line.mood as keyof typeof emotionMoods]
      : null;
  async function hear(id: string, url?: string) {
    setStatus("");
    if (!url) {
      setStatus("This audition is not ready yet.");
      return;
    }
    setPlaying(id);
    try {
      await playClip(url);
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setStatus("Could not play this take. Try again.");
    } finally {
      setPlaying("");
    }
  }
  return (
    <>
      <PageHeading
        title="Violetto’s voice."
        description="One voice, with small changes in feeling."
      >
        <Mascot pose="listen" size={160} />
      </PageHeading>
      <section className="voice-baseline" aria-labelledby="pronunciation-check">
        <h2 id="pronunciation-check">Start with the sounds.</h2>
        <p>
          The lesson voice has been rebuilt. Single kana use one explicit sound,
          with short, voiced vowels. Check あ and い separately, then together;
          each should end cleanly without an extra syllable.
        </p>
        <div className="actions">
          {["あ", "い", "う", "え", "お", "あ、い。"].map((text) => (
            <AudioButton key={text} text={text} label={`Hear ${text}`} />
          ))}
        </div>
        <div className="actions">
          <AudioButton
            text="おばさん。おばあさん。きて。きって。"
            label="Vowel length & small っ"
          />
          <AudioButton
            text="切手を二枚お願いします。明日、手紙を出します。"
            label="Hear a full sentence"
          />
        </div>
        <p className="content-note">
          Lesson voice: VOICEVOX:冥鳴ひまり. A composed female voice with
          restrained warmth and clear diction. Machine-checked; native listening
          review is still needed.
        </p>
      </section>
      <div className="voice-studio-intro">
        <h2>One voice. A little more feeling.</h2>
        <p>
          A composed teacher who can sound sincerely pleased, warmly reassuring
          or quietly thoughtful. Her 100 messages mix brief replies with fuller
          encouragement. Kana and vocabulary keep their clear teaching voice.
        </p>
        <p>
          Conversation scenes use small, consistent differences for each
          speaker: Ren is warmer, Satō-sensei more formal, Hana a little
          brighter. Yui has a brighter, quicker delivery; You is lower and more
          measured. Scene difficulty changes the pace while preserving each
          role’s cadence. All are performed in Violetto’s one voice.
        </p>
        <p className="content-note">
          Small changes in pace, intonation and pauses, all in the same voice.
        </p>
      </div>
      <section className="voice-baseline" aria-label="Course cast auditions">
        <h2>The people in your course.</h2>
        <p>
          Compare the same sentence in each role. These are small delivery
          differences in Violetto’s voice; the character names also stay visible
          during scenes.
        </p>
        <label htmlFor="cast-speaker">Choose a character</label>
        <select
          id="cast-speaker"
          value={castSpeaker}
          onChange={(e) => {
            stopAudio();
            setCastSpeaker(e.target.value);
          }}
        >
          {castAuditions.map((t) => (
            <option key={t.speaker} value={t.speaker}>
              {t.speaker}
            </option>
          ))}
        </select>
        <p>{castTake.description}</p>
        <p lang="ja">
          <Furigana text="{今日|きょう}はよろしくお{願|ねが}いします。{予定|よてい}を{確認|かくにん}しましょう。" />
        </p>
        <p className="muted">
          Thank you for working with me today. Let's check the schedule.
        </p>
        <Button
          secondary
          onClick={() => hear(`cast-${castSpeaker}`, castTake.url)}
        >
          <SpeakerHigh /> Hear this character
        </Button>
      </section>
      <section className="voice-baseline" aria-label="Teacher messages">
        <h2>A teacher with a little personality.</h2>
        <p>
          Precise, patient and genuinely pleased by a good answer. Sometimes
          “お見事です！” is enough. Longer remarks belong to moments that need
          them. Every message has its own recording. Praise is brighter;
          reassurance is gentler. The wording, mood and pose are chosen
          together. During practice, brief replies break up fuller remarks
          rather than several long responses in a row.
        </p>
        <label htmlFor="teacher-message">Explore the 100 messages</label>
        <select
          id="teacher-message"
          value={teacherSample}
          onChange={(e) => {
            stopAudio();
            setTeacherSample(e.target.value);
          }}
        >
          {teacherLines.map((l) => (
            <option key={l.id} value={l.id}>
              {l.category} · {l.mood} · {l.meaning}
            </option>
          ))}
        </select>
        <p lang="ja">
          <Furigana text={teacherLine.ruby} phrases />
        </p>
        <p className="muted">{teacherLine.romaji}</p>
        <p>{teacherLine.meaning}</p>
        <Button secondary onClick={() => hear(teacherLine.id, teacherLine.url)}>
          <SpeakerHigh /> Hear this message
        </Button>
        <p className="content-note">
          Subtle changes in feeling and pace, in the same voice. These Japanese
          messages are an AI-assisted draft awaiting listening review.
        </p>
      </section>
      <section className="voice-script">
        <label htmlFor="voice-script">Compare the same line</label>
        <select
          id="voice-script"
          value={sample}
          onChange={(e) => {
            stopAudio();
            setSample(e.target.value as Reaction);
          }}
        >
          {choices.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <p className="voice-line">
          <Furigana text={line.ruby} phrases />
        </p>
        <p className="muted">{line.romaji}</p>
        <p>{line.meaning}</p>
      </section>
      <section className="voice-baseline" aria-label="Expressive Violetto">
        <h2>{mood?.label ?? "Clear lesson speech"}</h2>
        <p>
          {mood?.description ??
            "Pronunciation examples keep their original, clear delivery."}
        </p>
        <div className="actions">
          {emotionalLines[sample].map((take, i) => (
            <Button
              key={take.url}
              secondary
              onClick={() => hear(`emotion-${i}`, take.url)}
            >
              <SpeakerHigh /> {take.name}
            </Button>
          ))}
          <button
            className="text-button"
            onClick={async () => {
              try {
                stopAudio();
                await db.profiles.update("local", { voicePreview: "baseline" });
                setStatus(
                  "The varied teacher voice is selected for reactions.",
                );
              } catch {
                setStatus("Selection could not be saved. Please try again.");
              }
            }}
          >
            {!profile.voicePreview || profile.voicePreview === "baseline" ? (
              <>
                <Check /> Current teacher voice active
              </>
            ) : (
              "Use the current teacher voice"
            )}
          </button>
        </div>
      </section>
      <h2>Earlier voice auditions</h2>
      <p>
        These earlier auditions use one fixed message per situation. Select the
        current teacher voice above for the full 100-message library.
      </p>
      <div className="voice-audition-list">
        {violetto.candidates.map((c, i) => {
          const ready = voiceCandidates.find((v) => v.id === c.id);
          return (
            <article key={c.id} className="voice-audition">
              <span className="audition-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{c.name}</h2>
                <p>{c.description}</p>
                <div className="actions">
                  <Button
                    secondary
                    disabled={!ready || playing === c.id}
                    onClick={() => hear(c.id, ready?.lines[sample]?.url)}
                  >
                    <SpeakerHigh />
                    Listen to this take
                  </Button>
                  <button
                    className="text-button"
                    disabled={!ready}
                    onClick={async () => {
                      try {
                        stopAudio();
                        await db.profiles.update("local", {
                          voicePreview: c.id,
                        });
                        setStatus(
                          c.name +
                            " selected for reaction previews. Lesson audio is unchanged.",
                        );
                      } catch {
                        setStatus(
                          "Selection could not be saved. Please try again.",
                        );
                      }
                    }}
                  >
                    {profile.voicePreview === c.id ? (
                      <>
                        <Check />
                        Selected for reactions
                      </>
                    ) : (
                      "Try in reactions"
                    )}
                  </button>
                </div>
                {!ready && <small>Generation in progress</small>}
              </div>
            </article>
          );
        })}
      </div>
      <div className="voice-baseline">
        <h2>The current lesson voice</h2>
        <p>
          Words and drills use the clear lesson voice. The current teacher voice
          uses all 100 varied reactions. Selecting an earlier audition changes
          reactions to its fixed script; lesson speech stays the same.
        </p>
        <div className="actions">
          <Button
            secondary
            onClick={() => hear("baseline", baselineLines[sample]?.url)}
          >
            Hear the baseline
          </Button>
          <button
            className="text-button"
            onClick={async () => {
              try {
                stopAudio();
                await db.profiles.update("local", { voicePreview: "baseline" });
                setStatus("Current lesson voice selected for reactions.");
              } catch {
                setStatus("Could not restore the voice. Please try again.");
              }
            }}
          >
            Restore baseline
          </button>
          <button
            className="text-button"
            onClick={() => {
              stopAudio();
              setPlaying("");
            }}
          >
            Stop audio
          </button>
        </div>
        <p>
          Check the lesson and length examples as well as the reactions. A
          pleasing voice can still mispronounce a word. The auditions await your
          listening review.
        </p>
      </div>
      <p role="status">{status}</p>
    </>
  );
}
