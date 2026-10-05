# Shiori curriculum expansion — compatible content packs

Use this alongside `AUDIT.md`. The first course is a seed, not an N5–N1 programme. These prompts help extend it without pretending that generated quantity is verified teaching quality.

## Files to attach to your content-writing chat

- This file.
- `src/types.ts` (the exact supported data structure).
- `content/packs/first-post.json` (a passing example).
- `output/content-inventory.json` (what exists).
- A list of existing word IDs, text and kana, plus the previous units' targets.
- Any dictionary/source extracts and community JLPT mapping you actually want used.

Generate that reusable context with `npm run author:context`. It writes `output/author-context.json`. Do not attach your learner backup: curriculum writers do not need personal attempts, name, recordings or journal entries.

## Prompt 0 — master brief

```text
You are drafting Japanese teaching materials for Shiori, a personal learning app with a chibi letter-writing companion named Violetto. The learner is an adult English/Vietnamese speaker starting from zero and aiming over years at reading native material, understanding conversation and media, speaking naturally with friends, communicating professionally, and strong JLPT results as a secondary benchmark.

Use the attached TypeScript Pack type and passing JSON pack exactly. Output one compatible JSON pack at a time. Do not invent unsupported product capabilities, a native-speaker review, JLPT levels, etymologies, pitch patterns or source citations.

Communication is the spine. Every lesson has an observable canDo goal. Teach useful chunks as chunks. Introduce grammar because it enables the task. Keep Japanese natural for the relationship and setting rather than merely easy to translate into English.

Violetto is polite, precise and gently encouraging. Recurring cast: Yui runs a bookshop and notices details; Ren runs a café and is practical and friendly; Hana is a fellow adult learner who asks clear questions. Keep their facts stable. The target language is contemporary Japanese. Explain regional or social variation instead of universalising one preference.

New targets: usually 12–20 words/chunks in an elementary unit. This is an editorial budget, not a learning-speed promise. Recycle earlier words in different situations. Do not count names, particles, inflections and the same spelling under new IDs as new vocabulary for coverage statistics.

New written words need kana and valid ruby parts. Kana/kanji/meaning/register must agree. parts must concatenate to text; each part's reading, or text when no reading exists, must concatenate to kana. Mixed strings need explicit reading support for every kanji. Use natural kana orthography. Explain that は and を have particle pronunciations; do not corrupt dictionary spellings to encode pronunciation.

Romaji is temporary scaffolding, not the lesson's answer language. Use consistent Hepburn with long-vowel marks where appropriate. Do not use romaji as evidence that someone can read Japanese.

Register values supported now: neutral, polite, casual, formal. These labels are simplifications. Explain recipient, relationship and situation in the role-play scene. Professional/keigo items need an explicit account of who is doing what for whom; do not equate formal with respectful or humble speech.

Keep jlpt:null unless the supplied mapping contains an exact supported entry. The current JLPT does not publish a definitive vocabulary/kanji/grammar syllabus. A community mapping is an approximate organisational aid, not an official requirement. KANJIDIC2's historical JLPT field must not be relabelled as current N1–N5.

Keep pitch:null unless a reliable supplied source establishes the word, reading and accent variety. Pitch numbers represent the downstep after a mora, with zero for heiban; do not guess from kana spelling. TTS is not a validated pitch reference.

Label all new packs status:"AI-assisted draft". An independent model review does not authorise changing this to reviewed. That requires a recorded human language review.

For each reading, reference vocabulary by exact IDs. All tokens must resolve. The prerequisites list is the intended prior knowledge, not a declaration about what the learner knows. At least 95% token coverage against intended prerequisites must be demonstrable, and every other token still needs a dictionary gloss. Newly introduced unit words are not already known at the start of a unit: place the reading after their encounters. Actual learner coverage is calculated separately by the app.

Never add content that is only an empty advanced-stage label. A unit must contain usable words, teaching, a reading and a conversation. Request a schema/renderer extension before producing unsupported exercise types. Do not stuff professional assessment, multi-speaker timing or answer explanations into ignored arbitrary JSON fields and claim they work.

Confirm the constraints and list any required missing source material. Do not generate a full course yet.
```

## Prompt 1 — design one stage before writing units

```text
Plan a coherent stage for these practical outcomes: [PASTE OUTCOMES].
Existing units and word inventory: [ATTACH author-context.json].
Supplied source list/mapping, if any: [ATTACH OR STATE NONE].

First identify prerequisite gaps. Then propose a numbered sequence of units. For each give: stable unit ID, title, three observable can-do outcomes, 12–20 candidate new lexical targets with readings, reusable existing word IDs, 2–3 communication-driven grammar patterns, reading setting, role-play relationship, and what an unseen transfer task would ask.

Separate “course coverage goals” from “JLPT estimate” and from “performance evidence”. Do not assert an official word quota. Distinguish lemmas/chunks from forms, names and particles. Report target count, duplicates, unassigned candidates and unverified mappings honestly.

Build one starter batch of 4–6 units for review before planning hundreds. Add a cumulative checkpoint after the batch. Include later needs for authentic input and human interaction. Do not invent a completion date or pass probability.

Output the unit plan and the assumptions. Wait for the chosen unit before drafting JSON.
```

## Prompt 2 — write one compatible pack

```text
Draft unit [ID] from the approved plan, using the attached Pack type.
Known vocabulary and exact IDs: [ATTACH author-context.json].
Review feedback from the last unit: [PASTE].

Return ONE JSON object, no fences or commentary. Use these top-level keys:
id, version (1), status ("AI-assisted draft"), title, words, lessons, letters, roleplays, grammar, kanji, dialogues, exercises.

Rules:
- Prefix every NEW ID with this unit ID, such as s1-u02-w-station. Reuse existing word IDs without copying those entries into words.
- words: id, text, kana, romaji, meaning, register, example, pitch, jlpt, parts. example must be a natural sentence showing the target, not merely a copy of the headword. Unknown pitch and JLPT values are null.
- parts: [{text,reading?}]. Use correct reading alignment; do not put a reading on kana just for decoration.
- lessons: id, title, description, kind (kana|phrase|kanji), words (IDs), canDo, minutes. Suggested minutes are estimates, not measured completion times. Keep one lesson manageable; a unit can have several.
- letters: id, title, from, subject, tokens (word IDs), paragraphs (ascending exclusive token-end indexes), prerequisites (IDs), question, options (distinct strings), answer (zero-based integer). The renderer joins each paragraph's tokens and adds 。. Keep paragraph boundaries at real sentence ends. Do not insert unsupported punctuation tokens unless they are correctly represented by the existing schema. If this constraint harms natural prose, request a schema change instead of shipping broken text.
- roleplays: id, title, partner, scene, turns. Each turn: line, kana, meaning, task, example, accept (anchored regex patterns), register (context text). Include obvious natural alternatives while preserving the task. Every pattern set must accept its own example. Reject wrong-intent answers, not harmless punctuation. Describe unsupported natural alternatives as out of pattern, not automatically bad Japanese.
- grammar: id, title, explanation, example, translation. Keep explanations specific and accurate. The current app displays these as notes, not scored grammar lessons. Do not claim otherwise.
- kanji: char, meaning, components, on, kun, words (IDs). Separate readings with 、. Words must actually contain that character. Distinguish structural observations from etymology; mnemonics must be called memory aids. Prefer useful word readings over exhaustive lists.

- Ruby markup: every Japanese string in dialogues and exercises writes kanji as {漢字|かんじ} (furigana over kanji only), e.g. {私|わたし}は{学生|がくせい}です。 Kana stay plain.
- dialogues (one per phrase lesson): id, lesson, title, scene (one English sentence), lines [{speaker, line (ruby), romaji, meaning}]. 4–6 lines, realistic, using the lesson's words in context. One narrator voices every speaker, so the questions must be answerable from the words, never from telling voices apart.
- exercises (6–8 per phrase lesson, 2–3 per letter): id, lesson OR letter, type, skill, explain (one or two sentences: why the answer is right), words (word IDs; the FIRST is the one credited), plus per type:
  - cloze (skill reading): context (English situation that decides the answer), line (ruby, exactly one ＿＿), meaning (the full sentence in English), options (3–4), answer (index). Prefer particle gaps (は/が/を/の/に/で/と/も) and words that only fit because of the situation.
  - reply (skill listening): optional context, line (heard first, text hidden), meaning, options (3–4 replies in ruby), answer. Exactly one natural reply; distractors must be real Japanese that fits a different situation.
  - dialogue (skill listening): dialogue (its id), prompt (English question), options (English), answer. Ask gist first, then detail and inference ("why did she say…").
  - truefalse: prompt (an English statement), answer (true/false), optional dialogue or letter. Base false statements on likely misreadings (も vs は, と meaning "with").
  - order (skill recall): meaning (English), tiles (ruby chunks in the correct order, 4–7 tiles).
  - choice (skill reading or politeness): context, prompt, options, answer. Use for register ("which fits your manager?") and letter inference.
- Never test a word in the same form the learner just saw: use a new sentence, a different speaker or a situation. Spread correct answers across positions; the content gate rejects packs where more than half sit in one position.
- Letter questions must need the text to answer them: don't let the subject line or title give the answer away.

Include 2–3 short readings/letters with different purposes, 2 role-plays, and appropriate kanji references. Recycle a meaningful selection of the previous units' targets. Ensure no unglossed token and no ambiguous reading question. Preserve status as AI-assisted draft.

Do a self-check before output, but do not describe that as independent review or verification by a native speaker.
```

## Prompt 3 — independent review in a fresh chat

```text
Review the attached Japanese course pack critically. You are an editorial assistant, not evidence of a human native-speaker review. Use supplied references; flag uncertainty instead of inventing certainty.

Return a JSON object with verdict (revise|ready-for-human-review|rewrite), fixes, and unresolvedQuestions.
Each fix: path, severity (error|unnatural|register|assessment|source|style), problem, replacement, reason, confidence.

Check:
1. Natural Japanese in the stated relationship and situation, including collocations, omission, register and discourse flow.
2. Kana, ruby segmentation, on/kun examples, romanisation, particles and contextual readings. A dictionary match alone does not check conjugation or sentence correctness.
3. Explanations: no false universal rules, no invented origins, no oversimplified keigo roles.
4. Reading tokens and actual paragraph joins: reconstruct exactly what the renderer displays. Does every resulting sentence work? Does each paragraph end at the right token?
5. The comprehension key: one defensible answer; plausible distractors; not merely answering from a visible English title or author label.
6. Role-play patterns: positive cases, alternate valid answers, and wrong-intent negative cases. Do not reward a yes/no or negated response by accident.
7. Coverage: declared prerequisites, new words and unglossed terms. Names and particles still need lookup support.
8. Source claims: exact supplied dictionary/mapping evidence; any inferred readings, pitch or JLPT levels stay unverified.
9. Repetition vs transfer: is the same word used in more than one meaningful context? What is missing before this unit can support generalisation?

End with what a human Japanese teacher should specifically check. Never change status to reviewed yourself.
```

## Prompt 4 — apply review findings

```text
Apply the attached review to the attached pack. Fix all error, unnatural, register, assessment and source issues. Preserve IDs unless a collision or wrong reference requires a change. Output the entire corrected JSON and nothing else. Keep unresolved source-dependent values null and status AI-assisted draft.
```

## Prompt 5 — repair automatic validation errors

```text
The Shiori checker rejected this pack:
[PASTE EXACT OUTPUT]

Fix the underlying data problem. Do not weaken the validator, delete checks, fabricate sources or remove difficult content solely to make the command pass. Return the whole corrected JSON.
[ATTACH PACK AND RELEVANT SOURCE EXTRACT]
```

## Integrate and actually test

1. Save a new unit under `content/packs/<unit-id>.json`. Never overwrite existing progress IDs to silently change what an old answer meant.
2. Run `npm run packs`. Invalid packs are not written into the generated app bundle. `npm run build` runs the gate again.
3. Check the unit in **Course library**. Run every reading and conversation, not just the first screen. The dictionary checker currently uses a local subset; expand source extracts for new words.
4. Run the unit and browser tests. Test positive and negative role-play examples; preserve unaffected skill memories.
5. Generate and listen to its audio; confirm particles, names, numbers, clipping and pauses. For serious accent training, obtain verified human exemplars.
6. Ask a competent human reviewer to check naturalness and pragmatics. Record reviewer, date, scope and unresolved issues in a sidecar review file. Only then change the status.
7. Update the inventory. Track lexical breadth separately from forms and token exposure. Add a genuinely unseen checkpoint after a group of units.

## Professional modules — plan now, extend the schema first

```text
Design a Japanese communication module for [engineering review / project update / interview / email / deadline negotiation]. Specify the interlocutors, hierarchy, in-group/out-group relationships, intended outcome and information asymmetry.

Provide a content design, NOT a falsely compatible pack: a 3-person conversation, casual/polite/respectful/humble variants where appropriate, an email and its revision, clarification/repair moves, one disagreement, an open role-play rubric and transfer task. Explain pragmatic risks and valid alternative formulations.

Identify which pieces fit today's schema and which require new renderer/validation support. Give exact proposed schema additions and acceptance tests before implementation. Keep AI-assisted draft status. Do not conflate passing JLPT with success at this task.
```

## Exam preparation — a separate assessment bank

```text
Using the official JLPT descriptions and sample task types supplied here, design ORIGINAL [N-level]-oriented questions. Do not call a community vocabulary boundary official. Require a clear construct, keyed answer, explanation, distractor rationale, source/provenance and a novelty tag.

Keep these items separate from teaching and FSRS until the assessment is complete. Report raw results by task type only; do not invent JLPT scaled scores, pass probabilities or speaking levels. Identify required schema/player changes before generating a large bank.
```

## What not to do

Do not generate “10,000 words” in one chat and call it a complete course. Do not count menus or roadmap labels as lessons. Do not replace human review with a model claiming to be a native teacher. Do not expand unsupported JSON while leaving its content invisible in the app. A small reviewed release with good recycling is more useful than a huge unverified dump.
