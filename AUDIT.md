# Can Shiori take you to high JLPT and professional fluency?

Current expansion checkpoint (2026-10-06): 77 packs, 293 lessons, 3,055 dictionary/name/chunk records (3,025 distinct written targets), fifty-six genre readings / 17,924 Japanese characters, 103 scenes / 933 lines, 195 grammar notes and 1,260 kanji references. Suggested first-pass metadata is 4,473 minutes, not measured time. Twenty-two decks add 1,417 form records, including four N3 decks with 400 original contextual examples. N3 decks/final review and remaining N2/N1/keigo are unfinished. All 1,386 beginner source rows have explicit dispositions; related, corrected, attached and excluded forms are not all independently taught vocabulary. Historical seed counts below are not current inventory.

All twelve N4 units and the selected beginner headword decks are authored and mechanically reviewed. Contextual instruction for the attached source patterns, exhaustive grammar coverage and native review remain separate gaps; source accounting does not establish exam readiness. N5, N4 and N3 each now have sixty checkpoint plus thirty distinct sample questions; N2/N1 retain twelve seed questions each. Selection rotates within saved history; two-item checkpoints and six-item samples are still small evidence samples, and completion does not require bank coverage. Beyond beginner courses, N3 units 1–16 and N2 units 1–14 are authored; remaining N2/N1 and keigo remain to be built. No human-reviewed packs, calibrated full exam or broad proficiency guarantee is claimed. Audio mappings and file/phoneme integrity are checked separately from human listening. Course data is split into static level chunks for independent cache reuse. It still loads together; on-demand level downloads and the growing precache budget require further work before the much larger course ships. No expansion has been deployed yet.


Audit date: 4 October 2026. This is an assessment of the code and content in this folder, not a forecast of the learner's ability. Starter-pack counts are reproduced by `npx tsx scripts/audit-content.ts` in `output/content-inventory.json`. The separate JLPT bank is checked by `npm run validate:jlpt`; its scope and sources are recorded in `content/jlpt/provenance.json`.

## Update, 5 October 2026 (afternoon)

Added since the audit below, all AI-assisted drafts awaiting native review:

- **An N5 core course**: 12 units following the grammar order of Genki I lessons 1–12 (original situations and cast). Each unit has a word list, a scene heard before its text, 8–9 exercises in new sentences, two grammar notes and a purposeful letter with comprehension tasks.
- **Totals now**: 13 packs, 33 lessons (21 foundation + 12 N5), 428 entries of which about 270 are words, chunks, particles and names (the rest are kana and sound drills), 17 scenes, 18 letters, 174 exercises. Suggested first-pass time is about 8.4 hours: still a foundation, not the full N5 word list (~800).
- **Learning loop**: words are never quizzed straight after they are met; missed sentence tasks return in mixed review; letters need the text to be answered.
- **Media**: Watch plays your own video with a Japanese subtitle file through three rungs (subtitles, peek-when-stuck, none), counts peeks and saves lines. The Listen page sets out the staged route to films without subtitles, with honest timelines.
- **Durability**: saved lines are in backups; Today reminds you weekly to export a backup until sync exists.

What is still missing for the long term: native review of all units, N4 and beyond, cloud sync, kanji reference pages for the new words, verified JMdict readings for every word (see prompts/gpt-side-tasks.md), and human-recorded listening material.

## Honest verdict

**Not with the currently bundled course.** Shiori now has a functioning study engine and a small starter curriculum. It is not yet a complete N5 course, much less an N2/N1 or professional-Japanese programme. Repeating this material for months would improve familiarity with the material and eventually produce diminishing returns. It would not create broad proficiency.

It can become your long-term study home: the library accepts further validated packs, reviews distinguish skills, Media accepts local files, and the outside-study journal holds reading, conversations and partner feedback. That infrastructure can remain useful for years. The content, assessment and human-feedback programme still have to grow substantially.

## What is actually present

- 21 lessons: 8 hiragana, 6 katakana and 7 phrase lessons.
- The 46 basic kana in each script, with voiced/semi-voiced variants: 142 single-character entries in total. These are **not 142 vocabulary words**.
- 15 sound examples for combinations, small kana and length; not a complete inventory of every possible loanword spelling.
- 66 dictionary words/chunks/grammar/name entries beyond the kana/sound examples; 52 are explicit phrase-lesson targets. Counting particles, names and inflected forms as distinct items would inflate a “vocabulary” headline.
- 10 kanji reference pages, with components/readings and stroke data. Reference pages are not a sequenced 2,000-kanji course.
- 6 extremely short letters: 110 authored tokens and 274 Japanese characters, excluding added punctuation. This is an introduction to reading, not extensive reading.
- 3 role-plays with only 7 scripted response turns total. They check expected typed phrases, not spontaneous speech.
- 6 explanatory notes covering topic/subject, requests, permission, register, vowel length and pitch. They are not six comprehensive grammar units.
- One current VOICEVOX lesson voice, with 285 manifest keys and 12 baseline reaction renders (297 provenance records; some share files). Four older CosyVoice reaction auditions remain available. More clips or acting directions do not equal natural speaker diversity.
- Zero human-reviewed packs, zero verified current JLPT word mappings and zero professional modules.
- The original separate N5–N1 study room shipped sixty questions; the current bank has 294. N5, N4 and N3 each have sixty checkpoint and thirty distinct sample items, while N2/N1 retain their seeds. Two-item checkpoints and six-item samples prefer unseen selections within saved history, then least-seen selections with disclosed repetition. The 8–14-minute timers are unchanged. No human-reviewed, calibrated or full-length exam set is bundled.

The lesson metadata adds up to **264 minutes (4.4 hours) of suggested first-pass lesson time**. These are planning estimates, not measured engagement. Repetition and extra reading add time, but that does not multiply the amount of new curriculum. I would describe the seed as several hours to a few weeks of beginner practice, depending on pace—not months of comprehensive study.

## High JLPT and professional Japanese are different outcomes

JLPT N1 expects comprehension of complex/abstract reading and natural-speed, coherent listening across broad settings. The current short, repetitive letters and controlled TTS do not resemble that demand. See the [official level descriptions](https://www.jlpt.jp/e/about/levelsummary.html).

JLPT does not include conversation or composition tests. It also stopped publishing exhaustive Test Content Specifications after the 2010 revision. Community vocabulary/kanji lists may help organise a course, but they are not official current syllabi. Even a CEFR reference printed on a JLPT result is limited to what JLPT measures. See the [official FAQ](https://www.jlpt.jp/e/faq/index.html).

Professional communication additionally needs interaction: entering a discussion, asking for clarification without derailing it, explaining trade-offs, disagreeing tactfully, handling ambiguity, writing concise emails, and following up on decisions. Keigo must fit the roles and relationships. For your interests, later modules should include engineering explanations, design reviews, interviews, progress updates and startup conversations. These require feedback on actual performances, not a checklist of polite expressions.

“Near fluency” is too vague to use as a product completion state. Define separate capabilities instead: read an unfamiliar article and explain its argument; follow an unrehearsed discussion; give a ten-minute explanation and handle questions; write a work email that a teacher considers accurate and appropriate. Use the [JF Standard's task-based Can-do approach](https://www.jfstandard.jpf.go.jp/summary/ja/render.do) as a planning framework, not a claim that this app administers a certified assessment.

## The largest gaps, in order

1. **Breadth and sequencing of content.** You need progressively harder units, substantially more reading, morphology, collocations and grammar in use. The kickoff's approximate 800/1,500/3,700/6,000/10,000-word and 100/300/650/1,000/2,000-kanji milestones can be internal coverage budgets. They are not official JLPT requirements or guarantees. Canonical lemmas and readings must be deduplicated before reporting totals.
2. **Transfer beyond familiar questions.** The current quizzes mostly use four choices. Typed reading recall helps, but does not prove productive ability. Add delayed unseen checks, varied contexts, sentence construction, dictated transcription and open responses with reviewed scoring rubrics. Keep assessment items out of teaching/review queues until after testing.
3. **Real listening diversity.** TTS is convenient scaffolding. The long-term curriculum needs reviewed human speech, different people, pace, reductions, background conditions and turn-taking. Anime has stylised register; understanding it and speaking appropriately at work are different abilities. Add aligned transcripts and boundary-checked clip loops, then measure help use across new clips.
4. **Human interaction and correction.** Seven scripted turns are not conversation practice at scale. A server-side AI partner could provide more practice, but it would still need error monitoring and cannot establish human social competence. Start manageable live exchanges early; increase their length and unpredictability. A possible routine is one short partner/tutor session weekly at first, later two as time allows—not a prerequisite to defer all speaking until an exam level.
5. **A real writing and pragmatics track.** Replies now save as drafts; they have no feedback or revision history. Add short-message tasks, then explanations/emails, teacher corrections and rewrite comparisons. Teach casual, polite, respectful and humble forms in scenarios with explicit relationships. Check discourse and intention, not only individual forms.
6. **Durability of years of data.** Export/import is present and duplicate imports do not double-count attempts. Local storage can still disappear with browser clearing, a different origin or a failed device. Authenticated sync, backups outside the browser, tested migrations, account isolation and restore drills remain essential before relying on the system as the only record for years.
7. **Editorial quality.** JMdict checks some readings; KANJIDIC2 and KanjiVG support reference data. None verifies that an entire generated paragraph is natural or a role-play response socially appropriate. All seed packs remain visibly AI-assisted drafts. Independent model review is useful but is not native-speaker approval. Obtain competent human review for published course progression, assessment and especially professional register.

## Improvements made during this local audit

The subsequent JLPT extension adds five source-led pathways, six sequential milestones per level, explicit entry self-checks, source-study records, short checkpoints and timed samples with saved deadlines. It links Nihongo Sō-matome, Shin Kanzen Master and official JLPT materials without ingesting their textbook content. Source records and listening reflections are self-report; the internal sample covers vocabulary, grammar and reading only. Raw scores are not converted to official scaled scores. Level estimates, questions and explanations remain unreviewed drafts. This update closes the earlier absence of a timed question runner, not the need for a broad, reviewed curriculum or robust unseen assessment.

JLPT plans, logs and runs are included in backup/restore through additive Dexie schema version 3 under the existing database identity. A new cycle preserves prior records and discloses question repetition. `npm run validate:jlpt` is part of the production build and checks structure and answer metadata, not language naturalness or test validity.

- Added a course library so installing packs exposes their lessons automatically, without requiring a new hand-written screen.
- Added “Beyond the course”: persistent outside-study logs for reading, listening, writing and real conversations, including support use and partner feedback.
- Included that journal and saved reply drafts in backup export/import; immutable records merge by ID and review memories rebuild deterministically.
- Extended validation so later packs can reuse existing vocabulary IDs rather than duplicating words to make a reading work.
- Checked source readings, corrected a letter's paragraph boundaries, and corrected kanji example links that did not contain the relevant character.
- Fixed the phone listening layout and ensured the local-clip transcript can be hidden during the no-text phase.
- Restored usable stroke controls on phones, added nearby mobile word glosses, and removed completion wording that implied demonstrated ability. Reading audio now counts as assistance; the first letter question now requires reading the text rather than looking at the author's label.

These improvements address extensibility, honesty and continuity. They do **not** close the curriculum-volume, human-listening, assessment or professional-communication gaps.

The user subsequently reported extra sounds in the earlier Kokoro pronunciation clips. Inspected G2P sequences were correct, and switching from quantized to full-precision Kokoro did not establish a fix; the root cause was not conclusively isolated. The current replacement uses VOICEVOX Core 0.17.0 / VVM 0.16.4, style 14, with explicit one-mora queries for all 142 single-kana entries, controlled voiced-vowel duration and lossless PCM output. Standalone kana and the topic-particle は now select their respective *ha* and *wa* playback inputs. Full queries and hashes are recorded in `content/voices/lesson-provenance.json`.

`output/lesson-audio-check.json` reports checks passing for all 297 render records and all 142 single-kana queries. A local Whisper small screen covered 56 longer clips; some outputs are ambiguous, so this is machine screening rather than a clean bill of pronunciation quality. Human listening review remains outstanding. The requested calm, precise and reserved performance is a direction, not a verified match to Yui Ishikawa or an authenticated character voice.

Long-term performance also remains unproven: the current UI reads whole attempt collections for several summaries. Before scaling to years of dense activity, add indexed aggregate queries and benchmark large synthetic histories. A backup feature is not the same as an audited multi-device sync system.

## A practical long-term plan

**First expansion: foundation → elementary.** Build 20–30 reviewed communication units as a first batch, approximately 12–20 new words/chunks per unit, with vocabulary recycled across short dialogues and varied readings. This is a production plan, not a claim that 30 units completes N5. Include numbers/counters, basic verb forms, time, location, preferences, invitations, repair phrases and everyday requests. Complement it with the Japan Foundation's [Irodori materials and audio](https://www.irodori.jpf.go.jp/en/) rather than treating generated micro-lessons as the whole course.

**Next: elementary → independent use.** Expand the corpus before increasing difficulty. Move from tiny letters to connected narratives, messages, instructions and simple articles. Add casual contractions, verb-group changes, particles in contrast, giving/receiving, reasons, conditionals and reported speech. Add an unseen reading/listening check after each group of units and a live conversation task with feedback.

**Later: N2/N1-oriented comprehension.** Bring in longer arguments, editorials, explanatory prose and natural multi-speaker listening. Practise inference, speaker intent, textual cohesion and pace. Use official sample questions to calibrate task types; use properly sourced unseen practice sets for evaluation. Do not convert raw percentages from app-authored items into official JLPT scaled scores.

**Alongside it: professional and personal communication.** Build recurring projects: explain your technical work, negotiate a deadline, ask a precise follow-up question, disagree with a design choice, summarise a meeting, and revise an email after feedback. Evaluate comprehensibility, accuracy, appropriateness, organisation and repair—not an invented “fluency percent”.

For a 60-minute study day, a reasonable starting allocation is 10 minutes retrieval, 15 focused learning, 20 comprehensible reading/listening and 15 output or fluency practice. Adjust it to difficulty and feedback; do not force all four blocks into every short session. Let the app's review load set a limit on new items, and reserve some time for enjoyable material.

At one hour every day, the arithmetic is 365 hours a year; at two, 730. That is **not** a completion forecast. Outcome depends on consistency, quality of input, prior language knowledge, feedback and the actual tasks practised. I would plan in years for broad advanced capability, with reassessment every few months, rather than promise N1 or professional fluency after a fixed number of app hours.

## Expansion workflow

Use `prompts/content-prompt.md` for unit planning, strict compatible JSON, independent review, revision and checker repair. Start with one reviewed unit. Verify it in the app, including its audio and every answer. Then batch the next few units. A bulk generation of hundreds of packs without feedback would scale mistakes as quickly as content.

Before calling the app a long-term complete programme, require these release gates: tested durable sync/restore; an explicitly covered curriculum with no hidden empty stages; diverse reviewed audio; a maintained extensive-reading pipeline; unseen exam-style assessments; a speaking/writing feedback process; and documented language review. None of those gates should be inferred from a polished interface.


## N3 editorial correction, 6 October 2026

All thirty-two N3 scenes were reread after the user found stiff vocabulary padding. Units 12–13 now use ordinary peer contractions and a playful character guessing game; 125 Japanese lines across the core were revised, with linked tasks and natural English translations. Passing checks had not established naturalness. Per-unit recycling exceptions have explicit editorial reasons and still require actual referenced forms. Details and verification are in output/review-n3.md; exact remaining work is in output/course-progress.md. All earlier Clear audio, unchanged dialogue takes and replaced-take history are preserved; all 254 new WAVs mapped. Native review pending. Finish N2/N1/workplace-keigo core before remaining decks; production waits for the full expansion.

6 October N2 checkpoint: 77 packs / 3,212 records / 293 lessons / 195 notes / 103 scenes (933 lines) / 56 genre readings (17,924 characters) / 1,260 kanji references. N2 units 1–14 add 615 source-checked pairs; native review pending. Earlier audio and old stroke bytes remain intact.
