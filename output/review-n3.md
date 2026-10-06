# N3 editorial review

Updated 6 October 2026. Only units 1–5 are authored. This is an AI-assisted internal review, not independent native review, complete N3 coverage or JLPT readiness.

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

## Unit 3 — impressions, reports and roles

Two sixteen-word lessons; five notes, each with formation/three original examples/common mistake; two ten-line scenes at 1.10 speed; a 226-character message; eighteen tasks. All thirty-two new dictionary pairs match the pinned source; twenty-five new character references use the existing archive and stroke commit. First meeting with Misaki uses her existing delivery in Violetto’s single voice.

- Must fix: 台詞を忘れっぽい treated an adjective as a transitive verb. Changed the grammar example and reading to 忘れっぽいので、台詞のメモを使う. The character’s scene already used a self-description.
- Must fix: the reported sentence-build referenced 保存, absent from its tiles. Removed the unrelated credit. This exercise practices reported syntax, not mastery of its associated information word.
- Added explicitly reviewed 見直せる/冷めない/区切って to recycling metadata. This is conjugation accounting, not new dictionary evidence or prefix guessing.
- Corrected 雰囲気’s romaji to fun’iki, retaining the dictionary-checked ふんいき audio input. Added Japanese question punctuation where the dialogue meaning and romaji explicitly ask a question.
- Appearance stems versus full reported propositions are explicit form tasks. ようだ/みたい/らしい are not competing synonyms. っぽい uses established forms only, with its adjective negative taught before testing.
- Three preview keys state the seen amount, named source and remaining unchecked date. Three costume keys distinguish role/reality, self-described memory tendency and the actual practice method. Reading keys all have explicit text support; no calendar date, diagnosis or profession is invented.

Mechanical gates and browser checks are recorded in course-progress.md after the full milestone run. Old Clear recordings, dialogue takes and strokes are unchanged. Human/native listening and naturalness review remains pending; this is an internal AI-assisted review of three units, not complete N3 coverage.


## Unit 4 — expectations, conclusions and responsibility

Two sixteen-word lessons; four formation notes with three examples and a common mistake each; two ten-line scenes; a 231-character diary; eighteen tasks. All thirty-two new spelling/reading pairs match the pinned dictionary. Twenty-two added reference pages preserve earlier dictionary and stroke data. はず retrieves N4 unit 7; it is not a newly invented N3 requirement.

- Replaced a grammar example that introduced the second lesson’s detective word early with the already introduced character name.
- Removed an unrelated 事実/記憶 credit from the heard reply and bound it to the actual record/conviction message. Replaced an unrelated 繰り返す credit in the form cloze with the previous unit’s 台詞, actually present in the sentence.
- Added the exact reviewed 繰り返します surface form to recycling metadata; this is not dictionary headword verification.
- Conviction is explicitly unconfirmed until Kenta’s account and the record check. No numerical certainty scale, synonym contest or claim that confident language proves a fact.
- Scene keys identify yesterday’s note, the pending check, university ownership, morning movement, the return deadline and the past update recommendation. Reading keys have explicit sequence/deadline/date evidence.
- Noun のはず, direct に違いない, な-adjective なわけ and dictionary verb + べきでした are explicitly named form tasks. Grammatical overlap does not create competing comprehension keys. Wider negative わけ constructions are deferred.

TypeScript, 112 unit tests, content/dictionary/kanji/JLPT gates, five audio validators, browser lesson/reading checks and production build/offline playback pass. All 90 added WAV files are mapped; 4,673 prior Clear keys, 4,685 prior synthesis records and 323 dialogue takes are preserved. Browser decodes all twenty new scene takes, verifies both lessons’ own notes, and checks saved themes/support/axe/overflow at 375/1440. Screenshots inspected. These checks do not certify native pronunciation or naturalness. Grammar-task metadata is not independent lexical mastery.


## Unit 5 — topic, target, viewpoint and a survey’s scope

Two sixteen-word lessons; four notes with complete attachments and three or four original examples; two ten-line scenes; a 214-character opinion message; sixteen tasks. Thirty-two new pairs match the pinned dictionary. The viewpoint note is bound to both lessons because its use is tested in the first scene; topic/target belong to lesson one, dependence/method to lesson two. This is deliberate retrieval, not a fifth new grammar note.

- Replaced untaught early 要望 in the first scene with existing 質問. Replaced early によって with familiar で until its lesson, and an untaught negative わけ construction with an explicit という意味ではありません paraphrase.
- Replaced two less useful planned words with 字幕 and 画面, which the learner actually needs in these scenes. Added explicit reading support for 読む, ケンタ, 案, たち and 数; surface coverage is still supported work, not a claim of independent knowledge.
- Removed unrelated previous-unit credits from scenes and form exercises. Added actual 調査 and 作業 references in the survey/check sequence, reaching the recycling target with real text rather than guessed aliases.
- Listening keys distinguish Bao’s reading-first preference, Kenta’s listening-first preference, shared selectable subtitles, the three-person survey scope and a pending screen check.
- Reading keys state the shared proposal, the limit on generalising and the next comparison. No public consensus, completed screen check, exam readiness or causal learning gain is invented.
- Topic/target attachments and the two noun modifiers are explicitly named form tasks; no competing natural synonym is marked wrong. Viewpoint differs from topic/recipient. によって’s four functions are labelled; によると is not silently substituted.

Old clips, mapping records and stroke bytes are preserved. All 87 new WAV files are mapped. TypeScript, 112 unit tests, content/dictionary/JLPT, five audio validators, focused browser and production build/offline checks pass. Browser decodes twenty new dialogue files and checks both lessons plus the message at 375/1440 in saved light/dark themes with axe and overflow checks; screenshots inspected. Native listening/naturalness remains pending. Full level review remains pending.


## Unit 6 — a decision, an arrangement and requested advice

Two sixteen-word lessons; four formation notes with three original examples each; two ten-line scenes at 1.10 speed; a 225-character message; seventeen tasks. All thirty-two new spelling/reading pairs match the pinned dictionary. The unit retrieves personal decisions from N4 and records the publishers' N3/N4 and N3/N2 tag disagreements. It is not an official JLPT membership claim.

- Replaced a duplicate planned headword 実行 with new 実施. Scene references for 実行 use its existing N3 unit 2 id. The archived first-draft example recording stays mapped; no historical recording is deleted.
- Replaced the prematurely used だけでなく with an already taught も…も pairing. Removed an unnecessary contrast with a teacher from a manager's scene.
- At the meeting, Bao has decided to compare the screens tonight but has not done it. Next morning, Bao explicitly reports last night's completed comparison. The message and listening keys preserve this relative timeline.
- A received reply makes a duplicate call unnecessary; it does not ban calls or claim no lifetime phone experience. The manager's authoritative ことです advice follows an explicit request for help.
- Negative choice, arrangement, reassurance and advice tasks name their required construction. They do not score overlapping constructions as competing synonyms. Friday's registration deadline and Kenta's duty remain unchanged from the prior unit.
- The two こと constructions are described by their presentation of choice/result, not an absolute rule that external agency is always required by なる. Advisory and identifying ことです are distinguished.

TypeScript, 112 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT gates, beginner ledger/alias checks, five audio validators, preservation, the full browser suite, build and production offline reload/playback pass. All 85 added WAV files are mapped; 4,873 prior Clear keys / 4,885 synthesis records, 363 dialogue takes and prior stroke bytes are unchanged. The browser case decodes twenty scene takes and checks lesson-specific grammar plus reading support, saved light/dark themes, accessibility and overflow at 375/1440. Human language and listening review remains pending. This is the six-unit checkpoint, not a completed N3 course.


## Unit 7 — directions and the timing of advice

Two sixteen-word lessons; four formation notes with three original examples each; two ten-line scenes at 1.10; a 231-character guide; eighteen tasks. Thirty-two new pairs match the pinned dictionary. The four conditional patterns are contextual retrieval of N4 teaching, not newly invented N3 requirements. The source brief also records Wasabi's teacher-authored comparison of overlap and request restrictions.

- Before authoring, excluded already taught 交差点, 到着, 出発 and 遅延 from the new headword list. Use existing 到着 references where arrival is needed.
- Added reviewed 焦らず as the actual negative-linking surface of 焦る. Added real provisional-case, improvement and consideration references to the scene, plus an explicit registration/deadline question. Previous-three-unit retrieval meets the target without fake credits.
- Both scenes take place on Friday; Kenta's registration deadline is today, and the film gathering remains Saturday at three. Bao's comparison is already complete. A hypothetical train suspension is explicitly distinguished from an actual report.
- Timetable, fare and boarding point must be checked before boarding; arrival message follows reaching the café. The guide does not invent bus times or fares: one question explicitly asks readers to identify missing lookup details.
- Form clozes name と/ば/たら/なら and test attachment. They never force a choice between interchangeable valid conditionals. Requests after a state/negative condition with ば are accepted; no blanket prohibition or logical if-and-only-if rule.
- と's actual discovery, たら's future use and だ→だら, いい irregular forms, and noun/na-adjective attachments are explicit. Separate purpose/quotation constructions are not silently conflated.

TypeScript, 112 tests, content/dictionary/kanji/JLPT, ledger/aliases, five audio validators, preservation, focused browser, build and production offline reload/playback pass. All 89 new WAV files are mapped; previous 4,970 Clear keys / 4,982 synthesis records, 383 dialogues and stroke bytes remain unchanged. Browser decodes all twenty new scene takes and checks both lessons/guide, saved themes, accessibility and overflow at 375/1440; screenshots inspected. Precache 1,282 entries / 11,947.64 KiB. Latest full-suite milestone is unit 6: 45 tests passed. Native review and the remaining course remain pending.


## Unit 8 — contrast, reproach and repair

Two sixteen-word lessons; four notes with three original examples each; two ten-line scenes at 1.10; a 220-character diary; eighteen tasks. All thirty-two new written/reading pairs match the pinned JMdict. Native review pending.

- Distinguish the concessive のに-despite source from homonymous purpose のに. ても/のに retrieve N4; both publishers tag くせに/ながらも N3. Form clozes explicitly name the construction instead of forcing a synonym choice.
- Counterfactual ていれば and ずにすむ in an initial diary draft were removed before rendering; the diary retrieves N4 聞けばよかった instead. No unintroduced counterfactual is scored.
- The Saturday film starts at three only after selectable subtitles are checked. The initially empty screen is a temporary test, not a verified changed policy. Misaki's pointed remark occurs between scenes and is quoted/apologised for in the second; earlier scene does not falsely claim to contain it.
- Reproach is a speaker's claim, never certified private intention. Examples avoid identity stereotypes. Casual apology between friends and polite clarification identify listeners; the teacher does not recommend くせに to a manager.
- Complete nominal attachments contrast なのに / のくせに; concessive state stems 小さいながらも / 不器用ながらも are kept distinct from ordinary simultaneous-action ながら. Gratitude or blame is not a narrator's truth certificate.
- Removed an unrelated 方針 exercise credit. Reviewed 引き受けます as the actual surface of 引き受ける in the scene. Previous-three-unit recycling clears the target with actual text.

Gates pass: types, 112 tests, content/dictionary/kanji/JLPT, alias decisions/ledger, five audio validators, historical preservation, focused browser, build and production offline playback. All 87 new WAV files mapped; previous 5,071 Clear keys / 5,083 synthesis records, 403 dialogue takes and 929 dictionary entries preserved, old stroke bytes unchanged. Total 5,169 Clear keys / 5,181 synthesis records and 423 dialogue takes. Browser decodes twenty new recordings and checks both lessons plus diary at 375/1440 in both saved themes; screenshots inspected, no accessibility/overflow failures. Precache 1,296 entries / 12,017.19 KiB. Initial test during unfinished rendering correctly reported missing dialogue takes; after rendering all 112 pass. Latest full browser milestone remains unit 6; next full run unit 9. No human listening or native naturalness certification.
