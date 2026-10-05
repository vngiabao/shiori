import { ArrowRight } from "@phosphor-icons/react";

/* The route from first sounds to films without subtitles. Stages are a study
   plan with move-on rules, not levels the app certifies. Named materials are
   examples to look for; Shiori does not host or link copies of them. */
const stages: {
  title: string;
  level: string;
  what: string;
  how: string;
  next: string;
  here?: (done: number, total: number) => boolean;
}[] = [
  {
    title: "Foundation",
    level: "Kana → N5",
    what: "This course: kana, the phrase lessons and their scenes, mixed review every day.",
    how: "On Watch, practise the three rungs with the course conversations.",
    next: "Move on when the N5 units are finished and mixed review rarely shows a word you have forgotten.",
    here: (done, total) => done < total,
  },
  {
    title: "Learner listening",
    level: "N5 → N4",
    what: "Podcasts and videos made for beginners, spoken slowly with pictures or gestures: for example Nihongo con Teppei for Beginners or the Comprehensible Japanese channel.",
    how: "20–30 minutes a day. Japanese subtitles when they exist; replay what you miss.",
    next: "Move on when you follow most of a new beginner episode with no text.",
  },
  {
    title: "Simple native shows, Japanese subtitles",
    level: "N4",
    what: "Slow, everyday shows: children's anime and gentle slice-of-life (for example ちびまる子ちゃん, しろくまカフェ) or a Ghibli film you already know in English.",
    how: "Watch an episode with Japanese subtitles, save lines worth keeping, then rewatch it on Peek.",
    next: "Move on when a rewatch needs fewer than 1 peek in 10 lines.",
  },
  {
    title: "New episodes on Peek",
    level: "N3",
    what: "Keep the same series: familiar voices, places and vocabulary make new episodes possible.",
    how: "Peek only when lost. Review your saved lines; export them to Anki if you use it.",
    next: "Move on after three new episodes in a row under 10% peeks.",
  },
  {
    title: "Natural speech",
    level: "N3 → N2",
    what: "Unscripted Japanese: reality and variety shows, vlogs, interviews, dramas. Faster, overlapping, casual (〜ちゃう, じゃん, って).",
    how: "Peek on new material; No subtitles for shows you know.",
    next: "Move on when you rate most No-subtitle sessions as ‘most’ or better.",
  },
  {
    title: "Without subtitles",
    level: "N2 → N1",
    what: "Films and new series with no subtitles at all. News (NHK) for formal Japanese.",
    how: "No subtitles first; check a scene afterwards only if it mattered.",
    next: "You are here when new films are followable. Keep a show you love going.",
  },
];

export function SubtitleFreeRoute({
  courseDone,
  courseTotal,
}: {
  courseDone: number;
  courseTotal: number;
}) {
  return (
    <section className="subtitle-route" aria-labelledby="route-title">
      <h2 id="route-title">The route to films without subtitles</h2>
      <p className="route-honest">
        This takes years of daily listening, not weeks. For English, research
        (Webb &amp; Rodgers, 2009) found about 3,000 word families cover 95% of
        TV dialogue and about 6,000 cover 98% of films; comparable figures for
        Japanese are not established, so expect at least as many. Each stage
        below has a rule for moving on, so you never have to guess.
      </p>
      <ol>
        {stages.map((s, i) => {
          const here = s.here?.(courseDone, courseTotal);
          return (
            <li key={s.title} className={here ? "here" : ""}>
              <span className="route-number">{i + 1}</span>
              <div>
                <h3>
                  {s.title} <small>{s.level}</small>
                </h3>
                {here && (
                  <p className="route-here">
                    You are here · {courseDone} of {courseTotal} course lessons
                    finished
                  </p>
                )}
                <p>{s.what}</p>
                <p>
                  <strong>How:</strong> {s.how}
                </p>
                <p className="route-next">{s.next}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="route-reading">
        Read alongside: NHK News Web Easy from about N4, and a gentle manga such
        as よつばと!. Reading and listening feed each other.
      </p>
      <a className="text-button" href="#media">
        Open Watch <ArrowRight />
      </a>
    </section>
  );
}
