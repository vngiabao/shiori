import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowCounterClockwise,
  BookmarkSimple,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  Eye,
  Repeat,
  Trash,
} from "@phosphor-icons/react";
import { Button, PageHeading } from "./components";
import { db } from "./db";
import { dialogues, packs } from "./content";
import { stopLines } from "./audio";
import { playDialogueLine } from "./dialogueAudio";
import { plain } from "./text";
import { clock, cueAt, parseSubtitles, type Cue } from "./subtitles";
import "./watch.css";

/* Watch: your own film or episode with its Japanese subtitle file. Three rungs:
   subtitles on, peek only when stuck (every peek is counted), and none.
   Nothing leaves the device; files are read in the browser and forgotten on reload. */
type Mode = "ja" | "peek" | "none";
const modes: [Mode, string, string][] = [
  [
    "ja",
    "Japanese subtitles",
    "Read along. Replay lines until the sound matches the text.",
  ],
  [
    "peek",
    "Peek when stuck",
    "Lines are hidden. Open one only when you are lost; each peek is counted.",
  ],
  [
    "none",
    "No subtitles",
    "Listen only. Rate how much you followed when you finish.",
  ],
];
const sample: Cue[] = dialogues.flatMap((d, i) =>
  d.lines.map((l, j) => ({
    start: i * 100 + j * 5,
    end: i * 100 + j * 5 + 4,
    text: plain(l.line),
  })),
);
const sampleRoles = dialogues.flatMap((dialogue) =>
  dialogue.lines.map((_, index) => ({ dialogue, index })),
);

export function Watch({ unit }: { unit?: string } = {}) {
  const task = packs.find(p => p.id === unit && p.watch);
  const [media, setMedia] = useState<{
    url: string;
    name: string;
    video: boolean;
  } | null>(null);
  const [subName, setSubName] = useState("");
  const [cues, setCues] = useState<Cue[]>([]);
  const [usingSample, setUsingSample] = useState(false);
  const [mode, setMode] = useState<Mode>("ja");
  const [current, setCurrent] = useState(-1);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [played, setPlayed] = useState<Set<number>>(new Set());
  const [loop, setLoop] = useState(false);
  const [rate, setRate] = useState(1);
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const player = useRef<HTMLMediaElement | null>(null);
  const attach = (el: HTMLMediaElement | null) => {
    player.current = el;
  };
  const clip = usingSample ? "Course conversations" : (media?.name ?? "");
  const saved = useLiveQuery(
    () => (clip ? db.lines.where("clip").equals(clip).sortBy("start") : []),
    [clip],
  );
  const history = useLiveQuery(
    () =>
      clip ? db.media.where("clip").equals(clip).reverse().sortBy("at") : [],
    [clip],
  );
  useEffect(
    () => () => {
      if (media) URL.revokeObjectURL(media.url);
    },
    [media],
  );
  const ready = cues.length > 0 && (usingSample || media);
  const peekShare = played.size
    ? Math.round((revealed.size / played.size) * 100)
    : 0;

  function resetSession() {
    setRevealed(new Set());
    setPlayed(new Set());
    setRating(null);
    setCurrent(-1);
  }
  function enter(i: number) {
    setCurrent(i);
    if (i >= 0) setPlayed((p) => (p.has(i) ? p : new Set(p).add(i)));
  }
  function playCue(i: number) {
    if (i < 0 || i >= cues.length) return;
    enter(i);
    if (usingSample) {
      const role = sampleRoles[i];
      playDialogueLine(role.dialogue, role.index).catch(() =>
        setStatus("This line could not play. Please try again."),
      );
      return;
    }
    const v = player.current;
    if (!v) return;
    v.currentTime = cues[i].start;
    void v.play();
  }
  function reveal(i: number) {
    if (i < 0) return;
    setRevealed((r) => (r.has(i) ? r : new Set(r).add(i)));
  }
  async function saveLine(i: number) {
    if (i < 0) return;
    const c = cues[i];
    if (saved?.some((l) => l.start === c.start)) {
      setStatus("Already saved.");
      return;
    }
    await db.lines.add({
      id: crypto.randomUUID(),
      at: Date.now(),
      clip,
      start: c.start,
      end: c.end,
      text: c.text,
      note: "",
      ...(task ? { unit: task.id } : {}),
    });
    if (mode === "peek") reveal(i);
    setStatus("Line saved. Add a note about what made it hard.");
  }
  async function finish() {
    if (!played.size) {
      setStatus("Play at least one line first.");
      return;
    }
    if (mode === "none" && rating === null) {
      setStatus("Choose how much you followed, then finish.");
      return;
    }
    await db.media.add({
      id: crypto.randomUUID(),
      at: Date.now(),
      clip,
      phase: mode,
      transcript: mode === "ja" || revealed.size > 0,
      lines: played.size,
      revealed: mode === "ja" ? played.size : revealed.size,
      followed: rating ?? undefined,
    });
    setStatus(
      mode === "peek"
        ? `Session saved: you opened ${revealed.size} of ${played.size} lines (${peekShare}%).`
        : `Session saved: ${played.size} lines.`,
    );
    resetSession();
  }

  // Keep the line in step with playback; loop the current line when asked.
  function onTime() {
    const v = player.current;
    if (!v) return;
    if (loop && current >= 0 && v.currentTime >= cues[current].end) {
      v.currentTime = cues[current].start;
      return;
    }
    const i = cueAt(cues, v.currentTime);
    if (i !== current) enter(i);
  }

  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (
        !ready ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        el.closest("input,textarea,select")
      )
        return;
      const k = e.key.toLowerCase();
      const act: Record<string, () => void> = {
        arrowleft: () => playCue(Math.max(0, current - 1)),
        arrowright: () => playCue(Math.min(cues.length - 1, current + 1)),
        r: () => playCue(Math.max(0, current)),
        l: () => setLoop((v) => !v),
        s: () => mode === "peek" && reveal(current),
        m: () => void saveLine(current),
      };
      if (act[k]) {
        e.preventDefault();
        act[k]();
      }
    };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  });

  const lineShown = (i: number) =>
    mode === "ja" || (mode === "peek" && revealed.has(i));
  const sessions = useMemo(
    () => (history ?? []).filter((h) => h.lines),
    [history],
  );

  return (
    <>
      <PageHeading
        title="Watch."
        description="Your own films and episodes: Japanese subtitles first, then peeks only, then none."
      />
      {task?.watch && <section className="notice-note"><h2>{task.title} · Outside practice</h2><p>{task.watch.prompt}</p><p>Lines saved here are tagged to {task.id}. This records practice, not comprehension.</p></section>}
      {!ready ? (
        <section className="watch-setup">
          <ol className="watch-steps">
            <li>
              <strong>Choose a video or audio file you own.</strong>
              <label className="file-pick">
                <span>Video or audio</span>
                <input
                  type="file"
                  accept="video/*,audio/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setUsingSample(false);
                    setMedia({
                      url: URL.createObjectURL(f),
                      name: f.name,
                      video: f.type.startsWith("video"),
                    });
                    resetSession();
                  }}
                />
              </label>
              {media && <small>{media.name}</small>}
            </li>
            <li>
              <strong>Add its Japanese subtitle file (.srt or .vtt).</strong>
              <label className="file-pick">
                <span>Japanese subtitles</span>
                <input
                  type="file"
                  accept=".srt,.vtt,text/vtt,application/x-subrip"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const parsed = parseSubtitles(await f.text());
                    setSubName(f.name);
                    setCues(parsed);
                    setStatus(
                      parsed.length
                        ? ""
                        : "No subtitle lines were found in that file.",
                    );
                  }}
                />
              </label>
              {subName && (
                <small>
                  {subName} · {cues.length} lines
                </small>
              )}
            </li>
          </ol>
          <p className="watch-privacy">
            Files stay on this device and are read only by this page; nothing is
            uploaded. Choose them again after reloading. Use material and
            subtitles you have the right to use.
          </p>
          <div className="watch-or">
            <span>No film to hand?</span>
            <Button
              secondary
              onClick={() => {
                setUsingSample(true);
                setMedia(null);
                setCues(sample);
                resetSession();
              }}
            >
              Practise the workflow on the course conversations
            </Button>
          </div>
          {status && <p role="status">{status}</p>}
        </section>
      ) : (
        <div className="watch-layout">
          <section className="watch-stage" aria-label="Player">
            {!usingSample &&
              media &&
              (media.video ? (
                <video
                  ref={attach}
                  src={media.url}
                  controls
                  onTimeUpdate={onTime}
                  onRateChange={() =>
                    player.current && setRate(player.current.playbackRate)
                  }
                />
              ) : (
                <audio
                  ref={attach}
                  src={media.url}
                  controls
                  onTimeUpdate={onTime}
                />
              ))}
            <div className="watch-line" aria-live="polite">
              {current < 0 ? (
                <span className="watch-line-empty">
                  {usingSample
                    ? "Play the first line to begin."
                    : "Press play. The current line follows the video."}
                </span>
              ) : lineShown(current) ? (
                <p lang="ja">{cues[current].text}</p>
              ) : mode === "peek" ? (
                <button className="peek-button" onClick={() => reveal(current)}>
                  <Eye size={18} /> Show this line <kbd>S</kbd>
                </button>
              ) : (
                <span className="watch-line-empty">Listening only</span>
              )}
            </div>
            <div
              className="watch-controls"
              role="group"
              aria-label="Line controls"
            >
              <button
                onClick={() => playCue(Math.max(0, current - 1))}
                aria-label="Previous line"
              >
                <CaretLeft /> <kbd>←</kbd>
              </button>
              <button
                onClick={() => playCue(Math.max(0, current))}
                aria-label="Replay this line"
              >
                <ArrowCounterClockwise /> Replay <kbd>R</kbd>
              </button>
              <button
                onClick={() => playCue(Math.min(cues.length - 1, current + 1))}
                aria-label="Next line"
              >
                <kbd>→</kbd> <CaretRight />
              </button>
              {!usingSample && (
                <button aria-pressed={loop} onClick={() => setLoop(!loop)}>
                  <Repeat /> Loop line <kbd>L</kbd>
                </button>
              )}
              <button
                onClick={() => void saveLine(current)}
                disabled={current < 0}
              >
                <BookmarkSimple /> Save line <kbd>M</kbd>
              </button>
              {!usingSample && (
                <label className="watch-rate">
                  Speed
                  <select
                    value={rate}
                    onChange={(e) => {
                      const r = Number(e.target.value);
                      setRate(r);
                      if (player.current) player.current.playbackRate = r;
                    }}
                  >
                    {[0.7, 0.85, 1].map((r) => (
                      <option key={r} value={r}>
                        {r === 1 ? "Normal" : `${r}×`}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            {status && (
              <p role="status" className="watch-status">
                {status}
              </p>
            )}
          </section>
          <aside className="watch-side">
            <fieldset className="watch-modes">
              <legend>Subtitles</legend>
              {modes.map(([id, label, hint]) => (
                <label key={id} className={mode === id ? "selected" : ""}>
                  <input
                    type="radio"
                    name="watch-mode"
                    checked={mode === id}
                    onChange={() => {
                      setMode(id);
                      resetSession();
                    }}
                  />
                  <span>
                    <strong>{label}</strong>
                    <small>{hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="watch-session">
              <p>
                {played.size} {played.size === 1 ? "line" : "lines"} this
                session
                {mode === "peek" &&
                  ` · ${revealed.size} opened (${peekShare}%)`}
              </p>
              {mode === "none" && (
                <div
                  className="watch-rating"
                  role="group"
                  aria-label="How much did you follow?"
                >
                  <span>How much did you follow?</span>
                  {["Lost", "A little", "The gist", "Most", "Nearly all"].map(
                    (t, i) => (
                      <button
                        key={t}
                        aria-pressed={rating === i}
                        onClick={() => setRating(i)}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              )}
              <Button onClick={finish}>Finish session</Button>
              <button
                className="text-button"
                onClick={() => {
                  stopLines();
                  player.current?.pause();
                  setCues([]);
                  setMedia(null);
                  setUsingSample(false);
                  setSubName("");
                  resetSession();
                }}
              >
                Choose different files
              </button>
            </div>
            {sessions.length > 0 && (
              <div className="watch-history">
                <h2>Your sessions with this clip</h2>
                <ol>
                  {sessions.slice(0, 6).map((s) => (
                    <li key={s.id}>
                      <span>{new Date(s.at).toLocaleDateString()}</span>
                      <span>
                        {modes.find(([m]) => m === s.phase)?.[1] ?? s.phase}
                      </span>
                      <span>
                        {s.phase === "peek"
                          ? `opened ${Math.round(((s.revealed ?? 0) / (s.lines || 1)) * 100)}%`
                          : s.phase === "none"
                            ? `followed: ${["lost", "a little", "the gist", "most", "nearly all"][s.followed ?? 0]}`
                            : `${s.lines} lines`}
                      </span>
                    </li>
                  ))}
                </ol>
                <small>
                  Move down a rung when you open under 10% of lines on new
                  episodes three sessions running. Self-reported, not a
                  comprehension score.
                </small>
              </div>
            )}
          </aside>
          <section className="watch-transcript" aria-label="Lines">
            <h2>Lines</h2>
            {mode === "none" ? (
              <p className="muted">
                Hidden while you listen. Switch rungs to see them again.
              </p>
            ) : (
              <ol>
                {cues.map((c, i) => (
                  <li key={i} className={i === current ? "current" : ""}>
                    <button onClick={() => playCue(i)}>
                      <span className="watch-time">
                        {usingSample ? i + 1 : clock(c.start)}
                      </span>
                      {lineShown(i) ? (
                        <span lang="ja">{c.text}</span>
                      ) : (
                        <span className="masked" aria-label="Hidden line" />
                      )}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
          <section className="watch-saved" aria-label="Saved lines">
            <div className="watch-saved-head">
              <h2>Saved lines</h2>
              {(saved?.length ?? 0) > 0 && (
                <button
                  className="text-button"
                  onClick={() => {
                    const tsv = (saved ?? [])
                      .map((l) =>
                        [
                          l.text.replace(/\s+/g, " "),
                          l.note.replace(/\s+/g, " "),
                          `${clip} ${clock(l.start)}`,
                        ].join("\t"),
                      )
                      .join("\n");
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(
                      new Blob([tsv], { type: "text/tab-separated-values" }),
                    );
                    a.download = `${clip.replace(/\.[^.]+$/, "")}-lines.tsv`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                  }}
                >
                  <DownloadSimple /> Export for Anki (.tsv)
                </button>
              )}
            </div>
            {saved?.length ? (
              <ol>
                {saved.map((l) => (
                  <li key={l.id}>
                    <button
                      className="watch-saved-line"
                      onClick={() =>
                        playCue(cues.findIndex((c) => c.start === l.start))
                      }
                    >
                      <span className="watch-time">{clock(l.start)}</span>
                      <span lang="ja">{l.text}</span>
                    </button>
                    <input
                      aria-label="Note for this line"
                      placeholder="Meaning, a word to look up, why it was hard…"
                      defaultValue={l.note}
                      onBlur={(e) =>
                        db.lines.update(l.id, { note: e.target.value })
                      }
                    />
                    <button
                      className="icon-button"
                      aria-label="Remove saved line"
                      onClick={() => db.lines.delete(l.id)}
                    >
                      <Trash />
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="muted">
                Save lines worth keeping: a phrase you want to say, or one you
                could not catch.
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
