# GPT follow-up: extend the running task to the whole course

Send everything inside the box in the SAME GPT chat that is running prompts/gpt-course-build.md.

Latest user amendment, 6 October 2026: the exact checkpoint and authoring correction in output/course-progress.md supersede the deck-first sequencing and fixed recycling quota below. Finish/review the N2, N1 and twelve workplace-keigo core units before the remaining N3/N2/N1 decks. Preserve completed material. Dialogue naturalness takes priority: genuine situations, repeated casual target forms, natural English contractions, no model/safety caveats in characters' dialogue or scene descriptions. Lower a unit's recycling target with an explicit editorial reason when needed; never invent references. Push a separate backup branch only after checking Cloudflare cannot deploy it to production. The full expansion is authorized for final deployment after completion; no intermediate production release.

```
AMENDMENT TO YOUR CURRENT TASK. Read it fully and keep everything you have already done. The user wants the WHOLE course, not just N4: N4, N3, N2, N1 and the Keigo at work module from content/COURSE-OUTLINE.md, with vocabulary and kanji decks and JLPT items for every level.

What changes:
- "NOT IN THIS RUN: do not author N3, N2 or N1" is cancelled. Only the AI conversation partner and Kiyo stay out of scope.
- All HARD RULES from the original prompt still apply.
- Where you are now:
  - Still in Phase 0 or 1: finish them. Phase 1.2 (N3–N1 grammar lists from two sources) now matters for authoring, so do it fully.
  - In Phase 2: also build the extra engine items below (2.1–2.8 replace the old Phase 2) before writing N4 units.
  - Already writing or done with N4: finish N4 and its review first. Then build any engine items below that are missing, re-check that N4 still builds unchanged, and continue with N3.
- Progress file: create output/course-progress.md now and keep it current, recording the phase, the last finished unit and the exact next step. This is many sessions of work. When a session ends, the user only needs to send "Continue from course-progress.md".
- Deploy only when the user says "deploy" (Phase 7). The user may say it after any finished level.

The phases below replace Phase 2 and everything after Phase 3 of the original prompt. Phase 3 (N5 gaps) is unchanged and repeated here for completeness.

PHASE 2 — Engine for every level (COURSE-OUTLINE.md §8, all rows)
Build all of these before authoring N4, so later levels don't force rework.
2.1 Extend the draft format and scripts/build-unit.ts. Keep old n5 drafts building unchanged: rebuild all 12 and diff, with zero changes expected.
  - dialogues: an array (keep accepting the single `dialogue` key). Optional per-scene `speed` (1.0–1.25) for natural-speed rendering in render-dialogues.py.
  - readings: an array (see 2.2). Keep `letter` working.
  - lessons: an array, each with its own word ids, so a unit can hold 2–3 lessons (N3 and above). Lesson ids are `${unit}-lesson-N`; a single-lesson unit keeps `${unit}-lesson`.
  - Word id prefix taken from the unit id (n4-uNN-w-…, n3-uNN-w-…).
  - Grammar notes gain optional examples: {ja (ruby), en}[], formation (string), mistake (string).
2.2 Add a Reading type to src/types.ts: { id, lesson, title, genre: "notice"|"message"|"email"|"article"|"diary"|"guide"|"story"|"essay"|"news"|"literature"|"manga", paragraphs: string[] (ruby markup), glosses: {text, kana, meaning}[], table?: {head: string[], rows: string[][]}, pair?: string (id of a second reading, for 統合理解), source?: {title, author, deathYear, url, licence} (literature only) }. Tasks are exercises with `reading: id`. Render readings in the Reader and inside the lesson flow after the scenes. Furigana and gloss lookups count as supported work. The validator checks: well-formed ruby; every word is a course word up to this unit or glossed (≥95% known); task answer keys; answer-position spread; and `source` present for genre "literature", with deathYear ≤ 1967.
  - For genre "manga", add panels: {description (English, what is drawn), lines: {speaker, line (ruby), sfx?: boolean}[]}[]. Render panels as framed text boxes in the existing paper style, with no images.
2.3 Recycling validator: ≥30% of the word ids referenced by a unit's scenes and exercises come from the previous three units. Warn below 30%; error below 15%.
2.4 New exercise types, with validators and renderers in the existing exercise styles:
  - "speaker": play or show a line and choose who says it (character speech, 役割語). Options are cast names.
  - "register": the same message in three styles (casual / です・ます / keigo); either choose the style that fits a stated situation, or choose the correct form for a stated style. The task always states the situation and the listener.
  - "compare": questions over a `pair` of readings (統合理解: which view do both share, where do they differ).
2.5 Speakers: add Kenta, Yamamoto, Mori, Misaki, Ishikawa, Tamura and Matsumoto to content/voices/dialogue-speakers.json, following the outline's cast table. Keep them restrained and distinct from the existing five. Render one sample line each and list them for the user's listening review. Kansai-ben and character speech are written in the text; the voice stays Violetto's (state this limitation in PEDAGOGY.md).
2.6 Course map: group units under level headings N5, N4, N3, N2, N1 and Keigo at work, collapsed except the current level. Use the existing components and styles; no new visual language. Check at 320/375/768/1440 in light and dark, with axe.
2.7 Watch tasks: from N4 on, each unit can carry `watch: {grammar: string[], prompt: string}`. The unit's end screen shows the task and links to Watch; lines saved in Watch while the task is open are tagged with the unit id. Evidence only, never scored.
2.8 Tests: unit tests for every new validator and type, the build-unit back-compat, and multi-lesson units; e2e tests that open an N4 reading, a manga reading and a register task. Keep every existing test passing.

PHASE 3 — Close the N5 gaps
3.1 first-post lessons 6 and 7 have no scene: add one scene each (5–7 lines, existing cast, existing words) and 2–3 scene questions.
3.2 n5-u06 letter: the last sentence "ここに名前を書いてください" has no place to write. Replace it with an action the reader can do.
3.3 Label gap-fill tasks on letters/readings as grammar practice in the UI (an existing small label style). Keep them out of the reading-comprehension evidence.
3.4 Role-plays: label them "Practise this phrase" and add reviewed alternative accept patterns for common polite variants.
3.5 N5 decks: author n5-vocab-01… to bring the N5 total to the chosen list's size, 100 words per pack, each with one original example sentence, JMdict-checked reading and audio. Words already in units are excluded.

PHASE 4 — Author every level, in order: N4 → N3 → N2 → N1 → Keigo at work
Never start a level until the previous level has passed Phase 5 (its review and fixes). Specs per level:

| | N4 | N3 | N2 | N1 | Keigo at work |
|---|---|---|---|---|---|
| Units | 12 (outline §3) | 16 (§4) | 16 (§5) | 12 (§6) | 12 scenarios (§7 keigo track) |
| Lessons per unit | 1 | 2 | 2–3 | 3 | 1 |
| New words per unit | 18–24 | 30–40 | 40–50 | 50–60 | 20–30 |
| Grammar notes | 3 | 4–5 | 4–5 | 4–5 | 3 (keigo forms) |
| Scenes (lines each) | 2 (6–10) | 2 (8–12) | 2–3 (10–16) | 2–3 (12–20) | 2 (8–14) |
| Scene speed | 1.0, ladder steps per §3 | 1.05–1.15 | 1.1–1.2 | 1.15–1.25 | 1.0–1.1 |
| Readings | 1 (5–15 sentences) | 1–2 (200–400 chars) | 2 (400–800 chars) | 2 (800–1500 chars) | 1 email or document |
| Exercises | 10–12 | 14–18 | 16–20 | 16–20 | 12–14 |
| Must include | ≥2 gap, ≥2 reply, ≥1 build, ≥3 scene Qs, register task from u07 | + a speaker task in u12–13, manga panels in u15 | + register tasks in u06–07 and u16, compare in u13 | literature with `source` in u08–09 | a register task in every scenario |
| Watch task | every unit | every unit | every unit | every unit | — |
| Decks to reach (vocab / kanji, cumulative) | ~1,500 / ~300 | ~3,700 / ~650 | ~6,000 / ~1,000 | ~10,000 / ~2,000 | — |
| JLPT items | 60 checkpoint + 30 sample | same | same, + 統合理解 and 主張理解 | same | — |

Keigo at work scenarios (one unit each, ids keigo-u01…u12): reception, phone, email, meeting, request, refusal, apology, negotiation, presentation, interview, visiting a client, seasonal greetings. Each scenario's speakers: Ishikawa-kachō, Matsumoto-buchō, a client and You.

For each unit, in order:
4.1 Write content/units/<id>.json following its outline row (as corrected in Phase 1) and the level spec above. Grammar notes have a formation rule, 3 examples and one common mistake. Story continuity: the learner's life moves university → café job (N4) → internship (end of N4) → job hunting and first job (N2) → working life (N1), with the cast's personalities kept stable.
4.2 Apply the quality bar (outline §9) while writing: one defensible answer per question; distractors grammatical but wrong in context unless the task says it tests form; the requested style and the listener stated in the task; complete formation rules; translations matching tense and aspect. N2+ texts also avoid unsupported cultural generalisations.
4.3 npx tsx scripts/build-unit.ts content/units/<id>.json; npm run packs; npm run validate:content; then python scripts/jmdict_sources.py --cached (refresh the download only if the cache is missing). Fix every JMdict mismatch; never suppress one.
4.4 Audio: .audio-py312/Scripts/python.exe scripts/render-japanese-voice.py, then scripts/render-dialogues.py. Confirm that only new files appeared (file names are content hashes; existing clips must be unchanged), then update lessonManifestSha256 in content/voices/emotion-provenance.json and run check-emotions.py and check-lesson-audio.py.
4.5 After every 3 units, run the full gate (Phase 0.2 list), commit, push and update output/course-progress.md.
4.6 After the level's units: kanji reference pages for every new kanji (KANJIDIC2 + KanjiVG, as in the N5 work); vocabulary decks (100 words per pack, original example sentence, JMdict-checked reading, audio, level from the Phase 1 list) up to the cumulative target; and the level's JLPT items in content/jlpt/ through validate:jlpt.
4.7 Size: if the precache grows past ~15 MB, keep deck and unit audio runtime-cached (it already is) and check that npm run build stays under the PWA limit. Never precache audio.

PHASE 5 — Review each level (run after each level, before starting the next)
5.1 Re-read every unit of the level as a strict reviewer, using the same table format and severity scale as output/review-n5.md. Write output/review-<level>.md (review-n4.md, review-n3.md, review-n2.md, review-n1.md, review-keigo.md).
5.2 Apply every must-fix in the unit sources, rebuild, and re-render only the changed audio. Leave should-fixes you skip listed with a reason.
5.3 Run the full gate again, commit and push.
5.4 Update docs: AGENTS.md (draft format, Reading type, new exercise types, recycling check, speakers), PEDAGOGY.md (readings, the ladder, register tasks, the single-voice limitation), AUDIT.md (counts), README.md (course size), COURSE-OUTLINE.md (status line per level).

PHASE 6 — Final pass over the whole course
6.1 Continuity check across all levels: cast names and personalities consistent, the story timeline consistent, no grammar used in a scored task before the unit that teaches it (report the earliest use of each grammar point).
6.2 Full gate, screenshots of one unit per level at 375 and 1440 (light and dark), commit and push.
6.3 Send the final report, then wait for "deploy".

PHASE 7 — Deploy (only when the user says "deploy")
7.1 Deploy with the SAME method used for the current shiori.gbaonvo.com deployment. Check your records and wrangler.jsonc: either Cloudflare Workers Builds from GitHub, or npm run build with the production VITE_ variables followed by npx wrangler deploy. Production build variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (publishable), VITE_AUTH_PROVIDERS=google, VITE_AUTH_MODE=google-only.
7.2 Post-deploy check (you cannot sign in as the owner; do not try): the site answers behind Cloudflare Access; the new service worker version activates (no stale shell); the u04 key question reads "The key is in the bag when you look for it."; one unit from each level opens, its scene audio plays with the speaker deliveries, readings render (including a table and manga panels), the course map shows every level group, and nothing overflows at 320 px. Write the result to output/deploy-<date>.md.
7.3 Tell the user to run the two-device sync test themselves: sign in on laptop and phone, do one lesson on each, then one lesson offline, and confirm all three appear on both devices.
The user may also say "deploy" after any finished level; deploy the committed state the same way.

NOT IN THIS RUN
The AI conversation partner. Kiyo (the Chinese app) changes.

DO NOT STOP FOR APPROVAL. If something goes wrong:
- A check fails: fix it. If you can't fix it without breaking a hard rule, revert that one item, record it in the report, and continue with the rest.
- A must-fix in a review can't be resolved: remove or rewrite that exercise so no ambiguous item ships, and record it.
- Research moves grammar points: correct the outline, record every move under "Changes after research", and author from the corrected table.
- Something would need a non-additive DB migration, a new paid or live service, or the owner's Google sign-in: don't do it. Record it in the report and continue.
- The session runs out: commit what passes the gate, update output/course-progress.md with the exact next step, and say "Continue from course-progress.md" is all the user needs to send.

FINAL REPORT (plain English)
- Commits pushed, and the ready-to-deploy state (deploys and post-deploy results once the user says deploy).
- Research: what was verified and corrected, sources and licences.
- Engine changes and their tests.
- Counts per level: units, lessons, words, grammar notes, scenes, readings, exercises, deck words, kanji pages, JLPT items, audio clips; precache size.
- Review summaries per level: must-fixes found and applied, should-fixes left.
- What still needs the user: the two-device sync test, listening to the new speaker voices, and native review (N4 first, since it's next).
```

## Notes for the user

- Send this in the same GPT chat that is already running the first prompt. It keeps GPT's work and widens the scope to N3, N2, N1 and Keigo at work.
- GPT reviews and fixes each level before it starts the next.
- It takes many sessions. When a session ends, send "Continue from course-progress.md".
- It deploys only when you say "deploy", which you can do after any finished level.
