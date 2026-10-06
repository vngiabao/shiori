# GPT task: research, build and ship the course beyond N5

Paste everything inside the box into the Japanese chat (folder `Language Learning/Japanese`).

```
TASK: commit the current state, verify the course outline with research, extend the engine, finish the N5 gaps, author N4 in full, review it, and get it ready to deploy. Run all phases in one go, in order, without stopping to ask for approval. Do not skip verification steps. Deploy only when the user says "deploy" in this chat (Phase 6).

READ FIRST, IN THIS ORDER
1. AGENTS.md (rules, commands, do-not-touch). 2. content/COURSE-OUTLINE.md (the plan you are executing). 3. content/packs/PLAN-n5.md and one finished unit: content/units/n5-u05.json and its built pack content/packs/n5-u05.json. 4. scripts/build-unit.ts, src/types.ts, src/packs.ts (validatePack, validatePractice), src/PhraseLesson.tsx. 5. output/review-n5.md (the quality rubric; the "Applied" section shows the kinds of mistakes to avoid). 6. supabase/README.md and wrangler.jsonc (live setup).

HARD RULES (any breach = stop and report)
- Never change the DB identity shiori-japanese-v1. Dexie migrations are additive; never clear user data.
- Do not change Violetto's design, artwork, the approved layout, the colour palette or the voice model. One voice only: Violetto. New cast members get a delivery entry in content/voices/dialogue-speakers.json, not a new voice.
- Never hand-edit content/packs/n5-*.json or n4-*.json. Edit content/units/*.json and rebuild with scripts/build-unit.ts. first-post.json is the exception: it is edited directly.
- All new Japanese is labelled "AI-assisted draft". Never mark anything "reviewed".
- Never copy sentences, dialogues or questions from Genki, Sō-matome, Shin Kanzen Master, Tobira, JLPT workbooks, NHK, anime or manga. Use those sources for the grammar inventory and its order only. Write original situations.
- Literature excerpts (N1 only, not in this run): 青空文庫 public-domain works only, with URL and author death year recorded.
- Only the publishable Supabase key may go in VITE_ variables. Never commit .env.local or any secret.
- No paid service or new live service. Cloudflare and Supabase are already live and approved; deploy only with the existing setup.
- Honest evidence rules stay as they are: supported answers never count as unaided, and nothing claims mastery or predicts a JLPT pass.

PHASE 0 — Commit what is already done
0.1 git status. The working tree holds today's verified work: 10 must-fix content corrections plus most should-fixes (see output/review-n5.md "Applied"), the new audio clips, the audio-mapping check, speaker-specific dialogue voices, and doc updates. Review the diff for secrets and stray files (output/*.png and logs: commit only if the repo already tracks that kind of file).
0.2 Run the full gate: npx tsc --noEmit; npm test; npm run validate:content; npm run validate:jlpt; .audio-py312/Scripts/python.exe scripts/check-emotions.py; .audio-py312/Scripts/python.exe scripts/check-lesson-audio.py; npx playwright test; npm run build. All must pass.
0.3 Commit in logical commits (content fixes; audio; dialogue voices; docs). Push to origin (github.com/vngiabao/shiori; already authorised).

PHASE 1 — Research: verify the outline
1.1 N4: check COURSE-OUTLINE.md §3 against the official Genki II 3rd edition table of contents (Japan Times / genki3.japantimes.co.jp). Correct any grammar point that is in the wrong lesson or missing.
1.2 N3, N2, N1: build each level's grammar inventory from TWO independent sources (Shin Kanzen Master or Sō-matome contents pages, plus one of Bunpro, JLPT Sensei or Tanos). List each point once with both sources' level tags. Where the sources disagree, note it and pick the lower level. Check that every point in COURSE-OUTLINE.md §4–§6 is on the list at that level, and add important points the outline is missing to the right unit.
1.3 Vocabulary and kanji lists: choose the JLPT vocabulary and kanji lists to use (for example Jonathan Waller's lists, CC BY). Confirm the licence. Store machine-readable copies under content/sources/ with a provenance JSON (URL, retrieved date, licence, sha256). Never treat KANJIDIC "jlpt" fields as current N-levels.
1.4 Licences: check whether the NPO Tadoku free readers and NHK News Web Easy may be linked (link only; never copy text). Record the answer.
1.5 Write content/sources/grammar-lists.md (sources, dates, disagreements, decisions) and update COURSE-OUTLINE.md in place. Add a "Changes after research" section listing every correction. Keep the outline's structure.

PHASE 2 — Engine for N4 (COURSE-OUTLINE.md §8, rows marked N4)
2.1 Extend the draft format and scripts/build-unit.ts. Keep old n5 drafts building unchanged: rebuild all 12 and diff, with zero changes expected.
  - dialogues: an array (keep accepting the single `dialogue` key).
  - readings: an array (see 2.2). Keep `letter` working.
  - Word id prefix taken from the unit id (n4-uNN-w-…).
  - Grammar notes gain optional examples: {ja (ruby), en}[], formation (string), mistake (string).
2.2 Add a Reading type to src/types.ts: { id, lesson, title, genre: "notice"|"message"|"email"|"article"|"diary"|"guide"|"story", paragraphs: string[] (ruby markup), glosses: {text, kana, meaning}[], table?: {head: string[], rows: string[][]}, tasks via exercises with `reading: id` }. Render it in the Reader and inside the lesson flow after the scenes. Furigana and gloss lookups count as supported work. The validator checks: well-formed ruby; every word in the text is either a course word up to this unit or glossed (target ≥95% known); task answer keys; and the existing answer-position spread.
2.3 Recycling validator: ≥30% of the word ids referenced by a unit's scenes and exercises come from the previous three units. Warn below 30%; error below 15%.
2.4 Add speaker entries for Kenta, Yamamoto and Mori to content/voices/dialogue-speakers.json. Keep them restrained and distinct from the existing five (see the outline's cast table). Render one sample line each and note it for the user's listening review.
2.5 Course map: group units under level headings (N5, N4). Use the existing components and styles; no new visual language. Check at 320/375/768/1440 in light and dark, with axe.
2.6 Tests: unit tests for the new validators and the build-unit back-compat, and an e2e test that opens an N4 reading and answers a task. Keep every existing test passing.

PHASE 3 — Close the N5 gaps
3.1 first-post lessons 6 and 7 have no scene: add one scene each (5–7 lines, existing cast, existing words) and 2–3 scene questions.
3.2 n5-u06 letter: the last sentence "ここに名前を書いてください" has no place to write. Replace it with an action the reader can do.
3.3 Label gap-fill tasks on letters/readings as grammar practice in the UI (an existing small label style). Keep them out of the reading-comprehension evidence.
3.4 Role-plays: label them "Practise this phrase" and add reviewed alternative accept patterns for common polite variants.
3.5 N5 decks: author n5-vocab-01… to bring the N5 total to the chosen list's size, 100 words per pack, each with one original example sentence, JMdict-checked reading and audio. Words already in units are excluded.

PHASE 4 — Author N4 (12 units + decks)
For each unit n4-u01 … n4-u12, in order:
4.1 Write content/units/n4-uNN.json following COURSE-OUTLINE.md §3 (as corrected in Phase 1): 18–24 new words; 3 grammar notes with formation + 3 examples + one common mistake; 2 scenes of 6–10 lines; 10–12 exercises (≥2 gap-fills, ≥2 replies, ≥1 sentence to build, ≥3 scene questions, ≥1 register task from u07 on); one reading of the listed genre with 3–4 tasks; and the listening-ladder step listed for the unit.
4.2 Apply the quality bar (outline §9) while writing: one defensible answer per question; distractors grammatical but wrong in context; the requested style stated in the task; complete formation rules; translations matching tense and aspect.
4.3 npx tsx scripts/build-unit.ts content/units/n4-uNN.json; npm run packs; npm run validate:content; then python scripts/jmdict_sources.py --cached (refresh the download only if the cache is missing). Fix every JMdict mismatch; never suppress one.
4.4 Audio: .audio-py312/Scripts/python.exe scripts/render-japanese-voice.py, then scripts/render-dialogues.py. Confirm that only new files appeared (file names are content hashes; existing clips must be unchanged), then update lessonManifestSha256 in content/voices/emotion-provenance.json and run check-emotions.py and check-lesson-audio.py.
4.5 After every 3 units, run the full gate (Phase 0.2 list) and commit.
Then: N4 kanji reference pages for every new kanji (KANJIDIC2 + KanjiVG, as in the N5 work); N4 vocabulary decks to the chosen list's size; 60 N4 checkpoint items and 30 sample items in content/jlpt/ through validate:jlpt.

PHASE 5 — Review N4
5.1 Re-read every N4 unit as a strict reviewer, using the same table format and severity scale as output/review-n5.md. Write output/review-n4.md.
5.2 Apply every must-fix in the unit sources, rebuild, and re-render only the changed audio. Leave should-fixes you skip listed with a reason.
5.3 Run the full gate again.
5.4 Update docs: AGENTS.md (new draft format, Reading type, recycling check, new speakers), PEDAGOGY.md (readings, the ladder), AUDIT.md (counts), README.md (course size), COURSE-OUTLINE.md (status line: N4 authored).

PHASE 6 — Deploy (only when the user says "deploy")
6.0 Finish Phases 0–5, commit and push, send the final report, then wait. When the user says "deploy":
6.1 Deploy with the SAME method used for the current shiori.gbaonvo.com deployment. Check your records and wrangler.jsonc: either Cloudflare Workers Builds from GitHub, or npm run build with the production VITE_ variables followed by npx wrangler deploy. Production build variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (publishable), VITE_AUTH_PROVIDERS=google, VITE_AUTH_MODE=google-only.
6.2 Post-deploy check (you cannot sign in as the owner; do not try): the site answers behind Cloudflare Access; the new service worker version activates (no stale shell); the u04 key question reads "The key is in the bag when you look for it."; n4-u01 opens, its scene audio plays with the Kenta/Mori deliveries, the reading renders with its table, the course map shows N5 and N4 groups, and nothing overflows at 320 px. Write the result to output/deploy-<date>.md.
6.3 Tell the user to run the two-device sync test themselves: sign in on laptop and phone, do one lesson on each, then one lesson offline, and confirm all three appear on both devices.

NOT IN THIS RUN
Do not author N3, N2 or N1 units. Start N3 when the learner finishes n4-u08 or asks for it; the outline and verified grammar lists from Phase 1 are what it will build from. Do not build the AI conversation partner.

DO NOT STOP FOR APPROVAL. If something goes wrong:
- A check fails: fix it. If you can't fix it without breaking a hard rule, revert that one item, record it in the report, and continue with the rest.
- A must-fix in review-n4.md can't be resolved: remove or rewrite that exercise so no ambiguous item ships, and record it.
- Research moves N4 grammar points: correct the outline, record every move under "Changes after research", and author from the corrected table.
- Something would need a non-additive DB migration, a new paid or live service, or the owner's Google sign-in: don't do it. Record it in the report and continue.

FINAL REPORT (plain English)
- Commits pushed, and the ready-to-deploy state (deploys and post-deploy results once the user says deploy).
- Research: what was verified and corrected, sources and licences.
- Engine changes and their tests.
- Counts: N4 units, words, grammar notes, scenes, readings, exercises, deck words, kanji pages, JLPT items, audio clips.
- review-n4.md summary: must-fixes found and applied, should-fixes left.
- What still needs the user: the two-device sync test, listening to the new speaker voices, and native review of N4.
```

## Notes for the user

- The outline the prompt follows is [content/COURSE-OUTLINE.md](../content/COURSE-OUTLINE.md).
- GPT runs everything in one go and commits and pushes. It deploys only after you check its report and say "deploy" in that chat. That deploy also ships today's N5 fixes.
- The run stops after N4 by design. N3+ is outlined and research-verified, but authored only when you get close to it, so the material is fresh and checked when you need it.
- Things only you can do: the two-device sync test after the deploy; listening to the new Kenta, Yamamoto and Mori voices; and, if possible, having a tutor skim N4.
