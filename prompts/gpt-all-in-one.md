# One prompt for the GPT (Codex) chat: all side tasks in order

Paste the box once. GPT works through the five parts in order, runs the full checks after each, and stops only before anything live (Supabase keys or a project).

```
ALL SIDE TASKS, IN ORDER. Work through parts A–E without waiting for me, except where a part says STOP.

RULES (apply to every part)
- Work only in the Japanese folder. Claude also edits this project. Do NOT edit: src/PhraseLesson.tsx, src/Watch.tsx, src/Route.tsx, src/LetterTasks.tsx, src/Study.tsx, src/App.tsx, src/phrase-lesson.css, src/watch.css, src/study-layout.css, src/offline.ts, src/backup.ts, e2e/practice.spec.ts, e2e/watch.spec.ts, content/packs/first-post.json (except "lemma" fields in part A), content/units/* (except "lemma" fields in part A), content/packs/n5-*.json (these are generated: rebuild with npx tsx scripts/build-unit.ts content/units/n5-uNN.json, never hand-edit). In vite.config.ts keep the audio runtimeCaching block exactly as it is. If a part truly needs one of these files, explain which line and why in your report instead of editing it.
- Database identity stays shiori-japanese-v1. Additive Dexie migrations only (the next free version is 5). Never clear user data.
- After EACH part run: npx tsc --noEmit, npm test, npm run validate:content, npm run validate:jlpt, npx playwright test, npm run build. Fix what you broke before moving on. Report exact pass/fail counts per part.
- Record sources and licences (THIRD_PARTY_NOTICES.md and provenance files). Say plainly what was machine-checked and what was not.
- No live services, accounts, keys or deployment.

PART A: finish the dictionary reading checks
1. Exclude kana drills (word ids h-*, k-*, sound-*) from the JMdict audit; they are sound drills, not dictionary words.
2. For inflected forms and set phrases containing kanji (e.g. 読みます, 住んでいます, 撮ってもいいですか, 食べすぎました), add an optional "lemma": { "text": "読む", "kana": "よむ" } to those words in content/units/n5-uNN.json and content/packs/first-post.json, and verify the lemma against JMdict. Add only "lemma" fields to those files; change nothing else. Make the field pass through scripts/build-unit.ts and the Word type (optional, additive), rebuild the n5 packs, and have the content gate check lemmas.
3. Check names (佐藤, and any others) against JMnedict, or list them separately as names.
4. Update output/jmdict-mismatches.md. Report how many kanji-bearing words are now verified and any reading that disagrees with ours (do not "fix" course readings yourself; list them).

PART B: kanji reference pages and stroke order
1. List every kanji in the "text" of all course words (all packs), minus the ten already in first-post's kanji list.
2. For each, fetch the KanjiVG data (CC BY-SA 3.0) and write public/strokes/<5-digit hex codepoint>.json in the existing format (char, paths, source, license). Extend scripts/fetch-sources.py rather than duplicating it.
3. Create content/kanji/n5.json: [{ char, meaning, components, on, kun, words }]. meaning, on and kun come FROM KANJIDIC2, not from memory; readings separated by 、; words = ids of course words containing the character; components only where KanjiVG/KANJIDIC2 data supports them, else "". No mnemonics.
4. Load this file alongside the pack kanji so the pages appear on Read → Kanji (do this in src/content.ts or a new module; do not edit src/Study.tsx). Make the KANJIDIC check in scripts/build-packs.ts cover this file.
5. Add a unit test: every kanji in course words has stroke data and a KANJIDIC-checked entry.

PART C: cloud sync, ported from Kiyo (build and test locally only)
1. Read ../Chinese read-only: src/auth.ts, src/sync.ts, src/sync-model.ts, src/sync-transport.ts, src/SyncPanel.tsx, supabase/migrations/202610040001_learning_sync.sql, supabase/tests, supabase/README.md and its sync tests. Mirror that design for Shiori.
2. Sync: attempts, completions, media sessions, field sessions, saved lines (db.lines), JLPT plans/logs/runs as immutable or id-keyed records merged by id; profile last-write-wins; memories rebuilt deterministically from attempts (as importBackup in src/db.ts does); an offline queue; never sync audio or recordings; explicit consent before merging an existing guest record into an account. Sign-in (email code, Google) stays off until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY exist.
3. Add the Supabase SQL migration with row-level security (each user reads and writes only their own rows) under supabase/.
4. Settings → "Account & cloud sync": real controls that appear only when the env vars are set; otherwise keep the honest "not configured" text. Settings lives in src/Account.tsx (you may edit it; keep the existing Offline audio and backup sections as they are).
5. Tests: unit tests for merge (duplicate ids, two devices, out-of-order arrival), memory rebuild equals local, the consent gate; an e2e test with a mocked Supabase client.
6. README: .env.example, exact steps to create a free Supabase project, and a cost note.
STOP before creating any project or entering keys. List the steps I must do myself.

PART D: independent review of the N5 units (review only, no edits)
For each content/units/n5-u01.json … n5-u12.json and the practice content in content/packs/first-post.json (dialogues, exercises, letters), check:
- Naturalness: would a Japanese speaker say each line this way in this situation? Flag stiff or unnatural lines with a better alternative.
- Register: polite/casual consistency per speaker and situation.
- Readings: every {漢字|かな} pair correct in context (何 なん vs なに, 一日, counters, sound changes like 三百 さんびゃく).
- Answer keys: exactly one defensible answer; distractors wrong in context but real Japanese (except "which form is correct" items); true/false unambiguous.
- Letters: the word-id sentences read naturally once joined (the renderer adds 。 after each sentence); questions need the text.
Write output/review-n5.md: one table per unit with issue | location (id) | severity (must fix / should fix / optional) | suggested fix. No praise sections. Do not edit the units; Claude will apply fixes.

PART E: final report
Give me: what changed per part, the check counts after each part, kanji count and any characters missing from KanjiVG/KANJIDIC2, verified-reading counts, the review's must-fix count, and the exact steps I must do for Supabase.
```
