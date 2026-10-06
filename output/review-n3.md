# N3 editorial review

Updated 6 October 2026. Only unit 1 is authored. This is an AI-assisted internal review, not independent native review, complete N3 coverage or JLPT readiness.

## Unit 1 — Getting better at it

32 dictionary-checked headword records split 16/16 across two lessons; four grammar notes with formation, three original examples and a common mistake each; two original ten-line scenes at 1.05/1.10 synthesis speed; one 215-character original diary; sixteen tasks (five scene questions, four clozes, two heard replies, two builds, three reading questions). The first scene is deliberately a single-speaker vlog; the second contrasts teacher and learner deliveries.

Source review: content/sources/grammar/n3-u01.json records two editorial references per note. ようになる and ようにする are N4-mapped bridge forms missing from the installed core, not described as new N3 requirements. Purpose ように has a mapping disagreement. Cause ために is deferred; no cause question is scored here. Existing potential forms and noun-comparison ように are prerequisites, not replaced.

| Severity | Finding | Applied resolution |
|---|---|---|
| Must fix | Internal speaker key used Satō-sensei, which the renderer does not recognise | Bound the display to the existing Satō cast key; no new voice |
| Must fix | A changed-ability distractor used a strained potential-purpose form | Replaced it with a grammatical wish; the prompt explicitly asks for an achieved result |
| Must fix | Reading questions temporarily used heard-reply type with English prompt text | Use existing reading choice tasks; English instructions do not enter Japanese synthesis |
| Must fix | First-lesson scene referenced 見直す assigned to lesson 2 | Move it into the first sixteen introduced words |
| Must fix | First-lesson grammar example introduced 聞き取る before lesson 2 | Use previously taught 発表 in that example; introduce 聞き取る in lesson 2 |
| Should fix | Rest question initially credited a record word, unrelated to the answer | Credit the reviewed 疲れる surface form in the text |

Question-key audit: each listening answer is stated in its scene. The limited reading improvement is contrasted with continuing difficulty, the enlarged writing has an explicit audience, and the course has an explicit purpose. Grammar prompts specify achieved result, ongoing effort or purpose rather than accepting several equally defensible readings. No claimed exam score or fluent state. Reading questions are comprehension, not translated gap-fills. Vocabulary/grammar within this unit is an instructional bridge, not a timed proficiency sample.

The surface coverage gate counts taught plus glossed words, not unaided comprehension. The glossary supports inflections and function chunks; it does not count as a new dictionary deck or mastery. Native naturalness and perceived speed/intonation remain unverified. TypeScript, 112 unit tests, content/reference gates, five audio validators, build and production offline checks pass. The browser test verifies both lessons' own grammar/scenes, decodes all twenty new dialogue takes, and checks the diary's support control, accessibility and overflow at 375/1440 in both saved themes. Previous audio records and mappings are unchanged; ninety new WAV files are mapped. This is a unit checkpoint, not a review of the still-unwritten N3 level.

## Unit 2 — action stages and a useful window

Two sixteen-word lessons, four notes with three original examples each, two ten-line scenes, a 262-character diary and sixteen tasks. Thirty-two new headword/reading pairs match the pinned dictionary. Eight additional kanji references use the previous archive/commit. This remains an AI-assisted draft awaiting native review.

- Changed the たばかり retrieval into an explicit attributive-form task. It does not compete against たところ in a context where both would work. No invented minute/day cutoff.
- The action-stage questions use explicit not-yet/in-progress/completed cues. A plan to save is not credited as a completed save.
- A noun-window example originally used the less idiomatic 休憩のうちに. Replaced it with 今週のうちに; the scene itself uses natural 今のうちに with an explicit five-minute window.
- Removed an unrelated 目安 credit from the tea question. The nominal-recency question now practices 保存したばかりのメモ and credits 保存, which actually occurs.
- Added reviewed 見直す/慣れる conjugations to recycling accounting rather than pretending that exact dictionary headwords appear unchanged. No guessed prefix matching.
- The diary explicitly gives call/save/tidy/leave order, the break constraint and the reason to recheck steps. No inferred holiday, exam result or complete listening mastery.
- The repeated-activity use of うちに has an emerging result. The useful-window use has an intended action; they are not translated as one indistinguishable “while”.

Gates: TypeScript, 112 tests, content/reference coverage, beginner ledger and alias preservation, five audio validators, old-record preservation, production build/offline all pass. Both N3 units pass the browser lesson binding/playback/reading support checks in saved light/dark themes at 375 and 1440. Ninety-one new WAV files are referenced; 4,467 earlier Clear URLs / 4,479 synthesis records and 283 old dialogue takes remain unchanged. Native listening/naturalness remains unverified. Full N3 review is pending because fourteen units and the level decks/banks are still unwritten.
