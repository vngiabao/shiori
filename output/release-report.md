# Shiori whole-course release — 7 October 2026

The whole-course release is deployed and Shiori's extra Cloudflare Access gate has been removed after the user's fresh confirmation. Kiyo's Access application remains unchanged. Guest study is public; Google sync remains owner-only. Functional release commit: `d0dc6c74493023d4f9515da291e6427e2b3b3b1a`, successful Cloudflare build `9e7006eb-e3af-4867-89b9-daaa2c233677`. Final documentation and checker corrections are additive and do not change app assets.

The complete hosted audio audit passes at `2026-10-08T00:49:33.542Z` (7 October EDT): all **19,517 current and historical WAV URLs** return200 with an audio content type, zero issues, and sixteen downloaded hash-prefix samples exactly match local SHA256. Cloudflare omits Content-Length on these HEAD responses; the verifier records omissions and validates lengths when supplied. The earlier failure was that checker's assumption, not missing recordings. Report: `output/hosted-audio-verification.json`.

All **fourteen focused hosted interaction tests** pass in 4.2minutes: guest onboarding/complete lesson/persistence, settings and backups, vowel/drill decoding, teacher feedback/mapped replay and all100teacher clips decoded, all character auditions, speaker-specific scene/Watch mapping, genuine recording-clock timing/cancellation, N1 prerequisite loading, a contextual N4 register task and representative N3/N2/N1/keigo lessons. Some interaction checks intentionally mock playback completion; the recording-clock test and decoding checks are separate real-audio evidence. Log: `output/browser-hosted-release.log`.

The fresh public welcome returns200 with enabled Google and visible guest entry. Desktop1440 and phone375 screenshots were inspected after fonts and the mascot image decoded: `output/shiori-public-welcome-1440.png` and `output/shiori-public-welcome-375.png`. Access-removal proof: `output/shiori-access-removed.jpg`. An existing in-app browser can still show an earlier offline app; no user browser data was cleared. Reload normally, or use a hard refresh in a normal browser if an old library persists. Actual owner Google OAuth and two-device sync have not been certified by these guest tests.

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

The additive saved-line-unit migration has been applied to the shared Supabase project. Its constraint is validated, optional unit references are allowed and row security remains enabled and forced. Kiyo, owner Google authentication and the stable Shiori database identity are preserved. Only Shiori's extra Access application was removed at the confirmed final step. Google cloud progress remains restricted to the owner, and guest study is local. Two-device owner sync still requires an actual user acceptance test.

## Practical limits

All course content is an internally checked AI-assisted draft; zero packs have native-speaker review. Dictionary readings do not validate sentence nuance, difficulty or naturalness. Synthetic speaker moods are not a substitute for varied real speakers. This is a much larger long-term study base, not a promise of N1/N2, professional fluency or karaoke speed. Continue extensive real reading/listening and practise user-provided lyrics for the reading pace needed to sing without romaji. Native review and the owner's two-device sync test remain separate acceptance work.
