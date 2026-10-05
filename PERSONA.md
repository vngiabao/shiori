# Violetto: character, voice and motivation

Violetto follows the user's Violet Evergarden direction. She is a composed letter-writer: formal and precise, observant, dutiful, sometimes literal, quietly curious about what words mean to people. Her warmth grows through small, sincere acknowledgments. She is not Sayo's rebellious, teasing, high-energy mentor transplanted into Japanese clothes.

The official character reference is https://tv.violet-evergarden.jp/character/ . It identifies the original Japanese performer as Yui Ishikawa and describes Violet's work with letters and her search to understand feelings. The app is a character-inspired interpretation; no claim of an authenticated performer voice is made.

## Delivery

Use one female voice identity, with six acting directions: clear teaching, composed welcome, warm reassurance, restrained pride, precise correction and reflective rest. Clear mid-register, complete vowels, audible consonants, measured Japanese rhythm. Emotions should be evident in timing and slight changes of colour, without rock-style grit, shouted praise, theatrical sobbing or a permanently breathy whisper. Lesson intelligibility takes precedence over acting.

The user's Violet/Mikasa performance references mean calm, precise and reserved delivery. They are acting direction, not evidence that this synthetic voice clones or matches the characters or Yui Ishikawa. The current lesson and baseline-reaction voice is VOICEVOX:冥鳴ひまり, style 14; modest intonation changes distinguish the six directions. Its resemblance and naturalness have not been established through human listening review.

Her own speech normally uses natural polite Japanese. Casual and keigo teaching examples must retain the register appropriate to the scenario; do not make every lesson sentence formal merely because the narrator is formal. Characters in role-play are textual roles; this voice system does not claim diverse speaker training.

## Behavior in the app

- Welcome the learner as a returning correspondent. Never guilt them for being away.
- Correct answer: acknowledge the specific successful recall. Supported answer: acknowledge progress and invite trying without help next time.
- Error: calmly check the word together. No scolding, ridicule or implied disappointment in the learner.
- Politeness error: explain the relationship and setting, not a simplistic claim that every casual word is rude.
- Completion: acknowledge work delivered. A correspondence level counts distinct finished lessons, not language proficiency.
- Rest: she can offer a stopping point without a loss threat.
- Praise, encouragement and completion are spoken as well as written when enabled. Reading/meaning remain available; audio can be replayed or muted. Word taps speak only outside unaided answer prompts; glossing marks reading as supported.

Exact Japanese lines, kana readings, English meanings, pose mappings and acting instructions live in `content/voices/violetto.json`. Keep those together when editing. Generated Japanese still needs editorial review.

## Teacher Violetto in the JLPT room

The JLPT study room uses a separate full-body teacher pose at `public/mascot/violetto-teacher.png`: slim oval glasses, a closed folio and a fountain pen, retaining the established chibi proportions, navy coat, ivory skirt, emerald brooch and red ribbons. The original 16-pose atlas remains in use elsewhere. The adjacent `.prompt.txt` and the PNG metadata preserve the generation prompt; this is generated artwork without a recorded human asset review.

Here Violetto is precise and composed: explain the next requirement, invite reflection on mistakes and acknowledge completed practice. Never present a study-cycle milestone as a passed JLPT level. Entry checks and external listening records remain self-report, while quiz feedback describes only the submitted questions. Teacher copy is an AI-assisted draft awaiting human language review.

## Gamification that fits the character

Correspondence levels count unique lesson completions. Postmarks celebrate first dispatch, three/eight lessons, distinct unaided reading/listening items, receiving a letter, a delayed recall, and practice on three separate days. Three daily assignments offer structure. Collected marks remain through missed days and browser backup/restore because they derive from persisted learning events.

Do not convert them into JLPT levels, fake fluency, currencies, competitive leaderboards, hearts or time pressure. No accuracy award for hints; no repeat-one-item route to the distinct-item stamps. The daily attempt mission accepts mistakes because attempting retrieval is useful work.

## Voice audition and production

The user approved the rebuilt VOICEVOX voice on 4 October 2026 and requested more emotional variety while preserving its identity. `content/voices/emotions.json` now defines composed welcome, gentle reassurance, quiet delight, teacher focus and thoughtful rest. The ten non-teaching reaction lines each have two deliveries; new reaction events alternate between them. Manual feedback replay repeats the last delivery for that line and voice. Text, reading, meaning and spoken phonemes stay aligned. Clear lesson and contrast examples retain their approved recordings.

These deliveries use the same style 14 speaker, with bounded changes to synthesis pace, pitch range and phrase pauses. They do not introduce Sayo's growl, shouted praise or teasing correction. `content/voices/emotion-provenance.json` records the settings and audio hashes; it does not claim measured emotion recognition. `scripts/generate-emotions.py` creates only these clips, and `scripts/check-emotions.py` checks unchanged lesson assets, matching phoneme sequences and audio integrity. The default reaction voice uses them; earlier explicitly selected auditions remain available.

Four CosyVoice directions have twelve short samples each, plus a fixed generated anchor. They are based on a locally generated Japanese synthetic reference and descriptive acting instructions. Their labels describe the target, not a verified resemblance rating. Exact seeds, model revision, instructions, references and file hashes are preserved in the voice provenance.

`/#voice` plays the same line across all four retained takes alongside the current VOICEVOX baseline. A selection saves to the profile and enables those recorded reactions only; course words and sentences keep the current lesson renderer. `src/generated/violetto-baseline.json` points to the 12 newly rendered VOICEVOX reactions. Their full synthesis settings and hashes live with lesson provenance in `content/voices/lesson-provenance.json`; older audition provenance retains its Kokoro synthetic reference history.

A different delivery of one narrator is not speaker diversity. Explicit one-mora kana queries, decoding and hash checks are engineering evidence. Whisper screening of longer clips is fallible and produced some ambiguous interpretations. Neither establishes naturalness, pitch accuracy or performer resemblance. Human/native listening review remains needed for mora length, small っ, kana readings, volume and unwanted voice changes.

## Four-part design discipline

Taste preserves the purposeful antique desk and removes decorative clutter. Hallmark gives auditions an ordered listening sheet and achievements a postmark album, with distinct task structures inside the existing DESIGN.md system. Impeccable checks hierarchy, states, responsive teaching controls and accessibility. Emil Kowalski guides immediate feedback, a restrained completion seal, short purposeful transitions and reduced-motion behavior. These are implementation practices, not badges to show in the learner UI.
