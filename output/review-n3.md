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


## Unit 9 — reasons, appreciation and the update time

Two sixteen-word lessons; four formation notes with three original examples each; two ten-line scenes at 1.10; a 245-character fictional news-lite report; eighteen tasks. All 32 new pairs match the pinned dictionary. Separate form-specific sources verify おかげで, せいで, causal ため(に), and から/ので retrieval. Purpose ため is already taught. Attribution and sarcastic recognition are contextual, not universal positive/negative rules; suitable requests with ので are allowed.

- Excluded previously taught 故障, 事故, 効率, 負担, 中断 and 再開 from new targets. Actual route, division and summary references retrieve units 6–8 without manufactured credits.
- Saturday's film ended as planned. Sunday's power outage precedes Monday's cancelled morning trains. At the three-o'clock update service is restored, but the session still starts at four and another notice is planned before it.
- Thunder is reported on the same night, but its causal relationship to the equipment problem remains unknown. A thank-you credits route guidance; it never establishes a culprit.
- Form clozes name the construction and test noun/na-adjective attachment. No forced choice between interchangeable valid reason connectors. Replies state the listener/register; reading answers depend on the Japanese timeline and explicit uncertainty.
- Glosses support formal linking 終わっており and negative linking 省略せずに. The report is an original fictional course event, not a real news claim.

TypeScript, 112 tests / 17 files, 24 Python source tests, content/dictionary/kanji/JLPT, ledger/aliases, five audio validators, preservation, all 48 browser tests, build and production offline checks pass. Browser tests decode scene audio, exercise the lessons/readings, and check accessibility, saved themes and overflow. Unit 9 light 1440 and dark 375 screenshots inspected. All 85 new WAV files mapped; previous HEAD 6bc73c0 recordings, query records and stroke bytes unchanged. Total 5,266 Clear keys / 5,278 synthesis records and 443 dialogue takes. Precache 1,313 entries / 12,089.45 KiB, below 15 MB. These checks do not certify native listening or sentence naturalness. No expansion pushed or deployed.


## Unit 10 — whole spans, repeated events and slight states

Two sixteen-word lessons, five complete notes with three original examples each, two ten-line scenes at 1.10, a 218-character diary and eighteen tasks. All 32 new pairs match the pinned dictionary. Source brief verifies たびに, 間/間に/最中, both うちに uses, がち and 気味. Interval constructions retrieve N4; Bunpro's generalized の間に has a different editorial level. No permanent/temporary or negative/positive absolute is imposed on the tendency suffixes.

- The four-o'clock Monday session happens as planned. Tuesday's review separates Bao's continuous notes, the colleague's response to a call, and the completion of summary reading during the break.
- Kenta reports one omission per day across three consecutive days last week. Monday's tiredness is a separately dated account; he explicitly attended the session. The diary's answers depend on those dates and the new checking practice.
- Named formation clozes test のたびに, ている最中 and the stems before がち/気味. They do not force a context-free choice between interchangeable time forms or tendency suffixes.
- Actual inspection, route and consideration references recycle units 7–9. Previous words retain IDs; no aliases or credits were invented. Glosses support linking 読み終え and decision ことにした. Replies state teacher/peer and intended action.
- Product explanations were shortened to practical time/recurrence cues rather than repeated warnings about personal identity or diagnosis.

TypeScript, 112 tests, 24 Python source tests, content/dictionary/kanji/JLPT, beginner ledger, five audio validators, preservation, focused browser, build and production offline reload/playback pass. Browser decodes all twenty new scene takes and checks lesson-specific notes, reading support, saved themes, accessibility and overflow. Light 1440 and dark 375 screenshots inspected. All 88 new WAV files mapped; HEAD 4d66956 Clear/query/scene/stroke bytes preserved. Total 5,366 Clear keys / 5,378 synthesis records, 463 dialogue takes, 967 kanji references. Precache 1,321 entries / 12,152.93 KiB. Latest full-browser milestone remains unit 9, 48 tests. Native review pending; no expansion deployed.


## Unit 11 — requests, grants and completed opportunities

Two sixteen-word lessons, four complete notes with three original examples each, two ten-line scenes at 1.10, a 242-character email and eighteen tasks. All 32 new pairs match the pinned dictionary. Japan Foundation and Agency for Cultural Affairs guidance checks permission, actor roles and perceived benefit; publisher explanations cross-check causative and causative-passive formation. Sensei's 聞く kana-table typo is recorded in the source brief rather than copied.

- Tuesday's request leads to Wednesday's ten-minute practice at three. Thursday's scene/email reports that completed presentation. Permission to read/copy a single anonymized record in the room does not become permission to photograph, take outside or distribute it.
- Speaker requests, listener requests, granting permission and past reports are distinguished by actor and function. Named formation exercises avoid scoring interchangeable polite requests as wrong.
- Kenta's separately quoted one-hour wait last week is not his three-day omission account. The causative-passive note includes both the long form and allowed contracted godan forms, with the す exception.
- Continuity correction: Yamamoto is the host mother, not a manager/teacher. Units 6, 9 and 10 now use the correct English organizer/host labels and -san. Their spoken Japanese, answer keys and all recordings are unchanged. Unit 11 uses Mori, the established internship engineer, for workplace practice. Its new takes were rendered with Mori's existing delivery. Seven obsolete untracked intermediate takes were removed; no tracked recording was deleted.
- Every scored answer follows an explicit scene statement, requested formation or reading detail. New/previous word IDs are real references, with no aliases invented for recycling. Reading questions require dates, copy disposition and the next action.

TypeScript, 112 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT, beginner ledger, five audio validators, preservation, browser cases for units 6/9/10/11, build and production offline reload/playback pass. Light 1440 and dark 375 reading screenshots inspected. All 93 new WAV files mapped; HEAD 4f3f495's 5,366 Clear keys / 5,378 records, 463 dialogue takes and 967 dictionary/stroke references preserved. Current 5,471 Clear keys / 5,483 records, 483 dialogue takes and 980 kanji references. Precache 1,334 entries / 12,224.98 KiB. Full-browser milestone remains unit 9. Native review pending; no expansion deployed.


## Unit 12 — contracted forms with their full meanings

Two sixteen-word lessons, five complete notes with three original examples each, two ten-line scenes at 1.10, a 248-character message and eighteen tasks. All 32 new written/reading pairs match the pinned dictionary. Publisher explanations and teacher-authored contraction guides cross-check the forms. The lower-level tags are retained as N5/N4 retrieval inside an N3 peer/media bridge, not relabelled an official syllabus.

- ちゃう/じゃう derives from the te-form, not the masu stem. Completion and regret are distinguished; preparatory とく/どく is not ongoing/resulting てる/でる. Named-form tasks do not mark equivalent contractions wrong.
- Recall っけ can retrieve a future arrangement; かな wonders. The expanded nonpast んだっけ is taught, with colloquial variation acknowledged. Affirmative じゃん is not negative じゃない. Bunpro's direct の-question page supplements the search-indexed Tae Kim source.
- Saturday viewing is reported Sunday: seven thirty, pause every ten minutes, normal speed, low but audible volume, preview then main feature, no sequel. Bao initially missed the preview while answering a call and watched it after putting the phone away. Kenta was absent Saturday; his separately seen preview was Friday. The next date remains unset.
- The speaker task binds to Misaki's exact second-scene line. A dedicated browser test walks the actual lesson, confirms Hear line plays that cast URL, checks Right/Misaki feedback and advances the step. It does not infer a speaker from voice timbre alone.
- Explicit reviewed surface forms for 控える cover actual contractions; absent recycling annotations were removed. Dates, actions, playback and reply distractors follow the stated scene or message.

Full milestone passes: TypeScript, 112 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT, beginner ledger, five audio validators, preservation, all 52 browser tests, build and production offline reload/playback. Light 1440 and dark 375 reading screenshots inspected. All 94 new WAV files mapped; HEAD 4d20446's 5,471 Clear keys / 5,483 records, 483 dialogue takes and 980 dictionary/stroke references preserved. Current 5,574 Clear keys / 5,586 records, 503 dialogue takes and 987 kanji references. Precache 1,341 entries / 12,289.55 KiB, below 15 MB. Native review pending; no expansion deployed.


## Unit 13 — a fictional role is not the actual speaker

Two sixteen-word lessons, five notes with three original examples each, two ten-line scenes at 1.10, a 214-character casting message and eighteen tasks. All new target pairs match the pinned dictionary. Japan Foundation role-language instruction and primary teacher/publisher guides cross-check the patterns; source-access and disputed prescriptions are explicit in the source brief.

- Actors are explicitly cast: Kenta performs samurai and elder, Misaki princess, Bao ninja. No costumes. Both speaker tasks identify the actual labelled actor and exact recording, not an inferred age or gender.
- ぜ/ぞ noun predicates retain だ; wondering かしら is not certainty. わ has contextual and regional uses. Explanatory のだ/んだ includes affirmative noun な and is normal beyond fiction. Quoted じゃ/でござる is recognition practice, not a workplace model.
- The fictional gate is closed, departure is tomorrow, the letter remains undelivered, and the ending is absent. Magic cannot be used because it has not been practised: that reason is now explicit in the dialogue. Correct answers do not depend on unstated facts.
- Formation clozes name the requested pattern; the old-copula task is not incorrectly classified as a register decision. Only surface forms actually present retain recycling references.

Passes: TypeScript, 112 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT, beginner ledger, five audio validators, preservation, focused unit-13 browser decode/playback/themes/accessibility, build and production offline playback. Light 1440 and dark 375 reading screenshots inspected. Earlier HEAD 23207d3 mappings, 5,586 synthesis records, 503 dialogue takes and 987 kanji/strokes unchanged. All 95 new WAVs referenced. Current 5,680 Clear keys / 5,692 records, 523 dialogues and 1,004 kanji references. Precache 1,358 entries / 12,365.60 KiB. Full browser milestone remains unit 12; next after unit 15. Native review pending; nothing deployed.
