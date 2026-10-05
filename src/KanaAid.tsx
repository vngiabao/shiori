import { kanaKind, kanaNote } from "./kana";
import type { Word } from "./types";

/** Memory aid, look-alikes and origin for one kana. Nothing renders for phrases. */
export function KanaAid({ word }: { word: Word }) {
  const note = kanaNote(word.text);
  if (!note) return null;
  return (
    <>
      <section className="kana-aid">
        <h2>{note.rule ? "How it is built" : "Memory aid"}</h2>
        <p>{note.aid}</p>
      </section>
      {note.lookalikes && note.lookalikes.length > 0 && (
        <section className="kana-aid">
          <h2>Don’t mix it up</h2>
          <p className="lookalike-row" lang="ja">
            <b>{word.text}</b>
            {note.lookalikes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </p>
          {note.tell && <p>{note.tell}</p>}
        </section>
      )}
      {note.origin && (
        <p className="kana-origin">
          Grew from the kanji <span lang="ja">{note.origin}</span>
          {kanaKind(word) === "katakana"
            ? ", keeping one part of it."
            : ", written quickly in cursive."}
        </p>
      )}
    </>
  );
}
