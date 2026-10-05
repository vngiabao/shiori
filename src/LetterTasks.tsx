import { useState } from "react";
import { Check } from "@phosphor-icons/react";
import { exercises } from "./content";
import { Furigana } from "./components";
import { recordAttempt } from "./db";
import type { Exercise } from "./types";
import "./phrase-lesson.css";

/** Comprehension tasks under a letter: the reading has to be understood, not matched. */
export function LetterTasks({
  letterId,
  supported,
}: {
  letterId: string;
  supported: boolean;
}) {
  const tasks = exercises.filter((x) => x.letter === letterId);
  if (!tasks.length) return null;
  return (
    <section className="letter-tasks" aria-labelledby="letter-tasks">
      <h2 id="letter-tasks">Check what you read</h2>
      <p>
        Answer from the letter. The particles carry the meaning: は, も, と, の.
      </p>
      {tasks.map((t) => (
        <LetterTask key={t.id} task={t} supported={supported} />
      ))}
    </section>
  );
}

function LetterTask({
  task,
  supported,
}: {
  task: Exercise;
  supported: boolean;
}) {
  const [picked, setPicked] = useState<number | boolean | null>(null);
  const [error, setError] = useState("");
  const options: (number | boolean)[] =
    task.type === "truefalse" ? [true, false] : task.options!.map((_, i) => i);
  const label = (o: number | boolean) =>
    typeof o === "boolean" ? (o ? "◯ True" : "✕ False") : task.options![o];
  async function answer(o: number | boolean) {
    setError("");
    try {
      await recordAttempt({
        itemId: task.words[0],
        skill: task.skill,
        correct: o === task.answer,
        support: supported ? "furigana" : "none",
        source: task.letter ?? "letter",
      });
      setPicked(o);
    } catch {
      setError("Could not save your answer. Please try again.");
    }
  }
  const right = picked === task.answer;
  return (
    <div className="letter-task">
      <h3>{task.type === "cloze" ? task.context : task.prompt}</h3>
      {task.type === "cloze" && (
        <p className="cloze-line" lang="ja">
          {task.line!.split("＿＿").map((part, i) => (
            <span key={i}>
              {i > 0 && (
                <span
                  className={`cloze-gap ${picked !== null ? "filled" : ""}`}
                >
                  {picked !== null ? (
                    <Furigana text={task.options![task.answer as number]} />
                  ) : (
                    "　"
                  )}
                </span>
              )}
              <Furigana text={part} />
            </span>
          ))}
        </p>
      )}
      <div
        className={`answer-options ${task.type === "truefalse" ? "tf-options" : ""}`}
      >
        {options.map((o, i) => (
          <button
            key={String(o)}
            className={`answer-option ${picked === o ? "selected" : ""} ${picked !== null && o === task.answer ? "correct" : ""}`}
            disabled={picked !== null}
            aria-pressed={picked === o}
            onClick={() => answer(o)}
          >
            {task.type !== "truefalse" && <span>{i + 1}</span>}
            {task.type === "cloze" ? (
              <Furigana text={label(o) as string} />
            ) : (
              label(o)
            )}
            {picked !== null && o === task.answer && <Check />}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p
          className={`letter-task-result ${right ? "" : "wrong"}`}
          role="status"
        >
          <strong>{right ? "Right." : "Not quite."}</strong> {task.explain}{" "}
          {supported
            ? "Saved as supported reading."
            : "Saved as unaided reading."}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
