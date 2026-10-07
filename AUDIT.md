# Can Shiori take you to high JLPT and professional fluency?

Current expansion checkpoint (2026-10-06): 79 packs, 297 lessons, 3,143 dictionary/name/chunk records (3,113 distinct written targets), sixty genre readings / 19,613 Japanese characters, 107 scenes / 989 lines, 204 grammar notes and 1,273 kanji references. Suggested first-pass metadata is 4,633 minutes, not measured time. Twenty-two decks add 1,417 form records, including four N3 decks with 400 original contextual examples. N3 decks/final review and remaining N2/N1/keigo are unfinished. All 1,386 beginner source rows have explicit dispositions; related, corrected, attached and excluded forms are not all independently taught vocabulary. Historical seed counts below are not current inventory.

All twelve N4 units and the selected beginner headword decks are authored and mechanically reviewed. Contextual instruction for the attached source patterns, exhaustive grammar coverage and native review remain separate gaps; source accounting does not establish exam readiness. N5, N4 and N3 each now have sixty checkpoint plus thirty distinct sample questions; N2/N1 retain twelve seed questions each. Selection rotates within saved history; two-item checkpoints and six-item samples are still small evidence samples, and completion does not require bank coverage. Beyond beginner courses, N3 units 1–16 and N2 units 1–15 are authored; remaining N2/N1 and keigo remain to be built. No human-reviewed packs, calibrated full exam or broad proficiency guarantee is claimed. Audio mappings and file/phoneme integrity are checked separately from human listening. Course data is split into static level chunks for independent cache reuse. It still loads together; on-demand level downloads and the growing precache budget require further work before the much larger course ships. No expansion has been deployed yet.


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

6 October N2 checkpoint: 79 packs / 3,300 records / 297 lessons / 200 notes / 105 scenes (961 lines) / 58 genre readings (19,613 characters) / 1,273 kanji references. N2 units 1–16 add 703 source-checked pairs; native review pending. Earlier audio and old stroke bytes remain intact.


N1 unit 1 adds 54 original source-checked pairs, three lessons, four notes, 39 scene lines, two original readings (1062/1120 characters) and twenty tasks. Sources and review: content/sources/grammar/n1-u01.json / output/review-n1.md. Formation references are consulted, never copied as lesson prose. Current inventory: 80 packs, 3,354 records, 300 lessons, 208 notes, 110 scenes / 1,028 lines, 62 readings / 21,795 characters and 1,292 kanji pages. All prior audio and reference bytes preserved; all 151 new WAVs mapped, including two indexed superseded takes. Native review and the rest of N1/keigo/decks/final deploy remain unfinished. Precache 14,424.09 KiB; production offline verification 2026-10-07T02:05:25.761Z.


N1 unit 2 adds 54 source-checked pairs, three lessons, four notes, 39 scene lines, two original readings (1096/1067 characters) and twenty tasks. Formation brief: content/sources/grammar/n1-u02.json; editorial/audio review: output/review-n1.md. All prior audio preserved; 151 new WAVs mapped (147 active / four indexed archived). Current: 81 packs / 3,408 records / 303 lessons / 212 notes / 113 scenes (1,067 lines) / 64 readings (23,958 characters) / 1,316 runtime kanji pages. Precache 14,553.94 KiB; real offline verification 2026-10-07T02:28:41.187Z. Native review, remaining N1/keigo/decks and final deployment are unfinished. No publisher example, exam item or real voice recording was imported.

N1 unit 3 adds 54 restricted-JMdict-verified pairs, three lessons, five notes, 39 scene lines, two original readings (1077/1050 characters) and twenty tasks. Source brief: content/sources/grammar/n1-u03.json; review: output/review-n1.md. All earlier recordings/reference bytes preserved; all 147 new WAVs mapped. Current: 82 packs / 3,462 records / 306 lessons / 217 notes / 116 scenes (1,106 lines) / 66 readings (26,085 characters) / 1,326 runtime kanji pages; 9,721 Clear keys / 9,733 synthesis records / 1,106 scene takes / 131 historical takes. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/ledger/JLPT294, five audio validators, preservation, focused browser, build and real offline playback pass. Precache 1,689 entries / 14,657.87 KiB; offline 2026-10-07T02:56:41.069Z. Native review, remaining N1/keigo/decks and final deploy remain unfinished. No publisher prose or voice recording imported.


## N1 unit 4 verified checkpoint

N1 unit 4: 54 source-checked pairs, three lessons, four notes, 39 scene lines, two original editorials (955/1013 characters) and twenty tasks, including two heard replies. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/JLPT294/ledger, five audio validators and preservation pass. All 9,721 earlier Clear keys and 1,106 earlier scene mappings preserved; all 142 new WAVs mapped; 131 historical takes retained. Current 9,879 Clear keys / 9,891 synthesis records / 1,145 scene takes / 1,330 runtime kanji pages. Focused browser decoded all 39 scene files and checked all three note sets, both readings at 375/1440 in saved light/dark themes, axe and overflow; detail screenshots inspected. Production build and real offline playback pass: 1,693 entries / 14,756.67 KiB; offline verification 2026-10-07T03:34:18.609Z. Queries checked, not native intonation. Native review pending; no production deployment.

Exact next: N1 unit 5 negotiation keigo. Relevant formation sections inspected: Bunpro and J-nihongo n1-index-b5fbac6b4f を前提に; Bunpro and Nihongo-bu n1-demosashitsukaenai ても差し支えない; MLC business_japanese and JapanesePod101 upper-intermediate S4 lesson 5 conditional requests/restated confirmation; Culture Agency keigo chapter3 actor/permission/request distinctions. Use an original client negotiation with explicit proposal, conditions, permission actor, deadline and corrected understanding; do not treat a question or silence as completed agreement. Guessed J-nihongo/NihongoNET URLs failed and are not evidence. N1 then twelve keigo cores BEFORE remaining decks. Static level chunks still load together; implement actual on-demand delivery before larger deck expansion/cap breach. Never rerun ignored author-n1-u04.py over corrected canonical sources.
