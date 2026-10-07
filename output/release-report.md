# Shiori whole-course release — 7 October 2026

All local release checks pass. Production deployment and removal of Shiori's extra Cloudflare Access gate are the remaining rollout steps. `course-progress.md` records the exact current step; older checkpoint reports are historical.

## Authored scope

- N5: twelve core units; N4: twelve; N3: sixteen; N2: sixteen; N1: twelve. Twelve additional workplace-keigo scenarios follow a separate contextual track.
- Seventy-three vocabulary decks. The complete inventory is 154 packs, 963 lessons, 8,777 word/chunk/name records plus 157 sound drills, 96 genre readings containing 46,620 Japanese characters, 167 scenes containing 1,695 lines, 289 grammar notes and 2,013 kanji reference pages.
- Ninety original written JLPT practice items at each level: 450 total. Short checkpoints and samples are not calibrated full exams or predicted official scores.
- All five pinned community vocabulary lists have explicit source-row dispositions. Exact matches, corrected source cells, related candidates, attached patterns and compositional exclusions remain distinct. Source accounting does not establish learner mastery or an official modern JLPT vocabulary list. The approximate ten-thousand-word target was not padded to meet a number.

## Voice and interactions

Violetto remains one voice. Clear is used for words and drills; composed, warm, proud, precise and reflective deliveries supply character and teacher variation. There are 100 teacher reactions and speaker-specific dialogue deliveries. Pitch remains within the existing half-semitone limit; delivery speed is restricted to the configured 0.96–1.03 range. No new character artwork or palette changes were introduced by this content release.

Current Clear mappings: 24,948 keys / 24,960 lossless synthesis records. All 1,695 active dialogue mappings and 133 historical takes remain. The last expansion preserved all 23,325 earlier Clear URLs, 23,337 earlier lossless records and prior stroke/dictionary bytes; all 1,143 new WAV files are referenced. Exact speech-input corrections apply only to new clips. Kana and lesson audio are checked for mapping, decoding and phoneme integrity; those checks do not certify human perception, natural intonation or resemblance to an actor.

The final production test found and fixed an initial-scene playback race. Previous-step cancellation now runs before child autoplay. The real-recording timing regression checks authored spacing/overlap, unchanged playback rate and cancellation without completion credit. Existing settings tests now distinguish settings feedback from cloud-sync feedback; eleven development-only module fixtures are tested separately rather than counted as production passes.

## Evidence already complete

Content, dictionary readings, four vocabulary ledgers, grammar-note binding, all 450 written practice items, five audio validators and preservation checks pass. TypeScript, 183 unit tests, 31 Python source tests and the production build pass. The full production browser suite passes all 175 applicable cases; eleven development-only module fixtures are separately verified on the development server. All three deployment dry runs and the simulated CI name/tag guard check pass. Final-build offline verification passes at 2026-10-07T22:49:07.000Z: interrupted download/retry, all 19,361 required recordings retained, all 32 course chunks cached, examples played from all 73 decks, advanced lessons/JLPT/teacher audio available after offline reload and zero page errors. The completed content is backed up at commit 02489634 on the non-production course-build branch.

The production shell precaches 2,369 entries / 14,756.83 KiB, below 15 MiB. The complete optional offline audio library is about 2 GB; limited browser storage can prevent or later evict it. Retry, storage failure and retention are checked explicitly. Course text loads by level; audio caches on use unless the learner requests the optional complete download.

## Hosting and sync

Deployment keeps `shiori.gbaonvo.com` and every historical audio URL. The main static Worker and two static audio Workers stay below Cloudflare's free 20,000-file limit. Final staging byte verification passes: main 2,901 files; audio-a 9,772; audio-b 9,682. The dashboard production branch remains main; preview builds are disabled; the saved deployment command uses the guarded three-Worker wrapper.

The additive saved-line-unit migration has been applied to the shared Supabase project. Its constraint is validated, optional unit references are allowed and row security remains enabled and forced. Kiyo, owner Google authentication and the stable Shiori database identity are preserved. Only Shiori's extra Access application will be removed at the final browser-confirmed step. Google cloud progress remains restricted to the owner, and guest study is local. Two-device owner sync still requires an actual user acceptance test.

## Practical limits

All course content is an internally checked AI-assisted draft; zero packs have native-speaker review. Dictionary readings do not validate sentence nuance, difficulty or naturalness. Synthetic speaker moods are not a substitute for varied real speakers. This is a much larger long-term study base, not a promise of N1/N2, professional fluency or karaoke speed. Continue extensive real reading/listening and practise user-provided lyrics for the reading pace needed to sing without romaji. Native review and the owner's two-device sync test remain separate acceptance work.
