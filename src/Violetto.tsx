import { useState } from "react";
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
import { postalProgress } from "./rewards";
import { db } from "./db";
import type { Attempt, Completion, Profile } from "./types";
export function ViolettoBubble({ kind }: { kind: Reaction }) {
  const line = violetto.lines[kind];
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
        <Furigana text={line.ruby} />
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
  const line = violetto.lines[kind];
  const [error, setError] = useState("");
  return (
    <aside className="violetto-panel" aria-label="A word from Violetto">
      <header>
        <h2>Violetto</h2>
        <span lang="ja">言葉を届ける</span>
      </header>
      <a
        className="panel-portrait"
        href="#companion"
        aria-label="Meet Violetto"
      >
        <Mascot pose={pose} size={208} />
      </a>
      <p className="panel-japanese">
        <Furigana text={line.ruby} />
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
  const line = violetto.lines[kind];
  const [error, setError] = useState("");
  return (
    <div className={`violetto-line ${compact ? "compact" : ""}`}>
      <p className="reaction-japanese">
        <Furigana text={line.ruby} />
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
          The voice you liked now has a warmer welcome, gentle reassurance,
          quiet delight, teacher focus and a thoughtful close. Reactions
          alternate between two deliveries of the same words. Kana and lesson
          speech stay steady.
        </p>
        <p className="content-note">
          Small changes in pace, intonation and pauses, all in the same voice.
        </p>
      </div>
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
          <Furigana text={line.ruby} />
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
                setStatus("Expressive Violetto selected for reactions.");
              } catch {
                setStatus("Selection could not be saved. Please try again.");
              }
            }}
          >
            {!profile.voicePreview || profile.voicePreview === "baseline" ? (
              <>
                <Check /> Active for reactions
              </>
            ) : (
              "Use expressive Violetto"
            )}
          </button>
        </div>
      </section>
      <h2>Earlier voice auditions</h2>
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
          The rebuilt Japanese lesson voice also has a composed reaction set.
          Selecting an earlier audition changes reactions only. Words and
          lessons keep the new pronunciation-controlled voice.
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
