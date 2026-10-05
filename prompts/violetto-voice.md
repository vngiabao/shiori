# Violetto voice and persona expansion

Continue the existing Japanese app, reading AGENTS.md, PERSONA.md, DESIGN.md and content/voices/violetto.json first. Chinese is a read-only implementation reference, not a personality template. The user's target is the composed, precise, quietly caring performance of Violet Evergarden; Violetto is the app companion.

Start from the selected audition identity. Ask for a listening choice only if none has been given; do not silently pick a voice based on an attractive label. There are four rendered directions on /#voice. Once the user chooses a timbre, use it for the full-course render; preserve the baseline for reversible comparison. Selecting a reaction preview alone does not run that render.

Preserve the same synthetic anchor, transcript, seed, model revision and acting instructions. Render all new words and complete sentences in clear teaching delivery; use composed/warm/proud/precise/reflective modes for character lines. Keep pronunciation independent of emotional flourish. Never convert Mandarin tone instructions from Sayo's prompt into Japanese pitch claims. Kana/word readings, mora length, gemination, natural phrasing and pragmatic register need Japanese review.

Keep an immutable baseline and a versioned candidate manifest. Generate offline with scripts/generate-violetto.py and the installed sibling CosyVoice runtime, or a separately configured supported model if quality requires it. Reuse the synthetic reference only; no performer recording is needed for the current pipeline. Save local outputs under Japanese. Do not change Chinese environments or files.

Before full-course replacement, compare: a welcome, understated praise, an error, a supported answer, a politeness correction, a completion, a rest line, a normal sentence, and vowel-length/small-っ contrasts. Inspect technical audio quality with scripts/check-violetto-audio.py; passing it checks files, not language quality or voice resemblance. Retain exact metadata and label editorial status honestly.

Wire reactions to actual events, including correct versus supported distinction, completion, and return after a break. Word audio must not reveal answers in an unaided reading-recall/typing quiz. Stop previous audio on a new utterance or navigation. Offer independent mute controls for automatic reactions and word taps, explicit replay, and visible recoverable audio errors.

Keep the postal motivation model: meaningful practice assignments, permanent collected postmarks and correspondence levels based on completed lessons. No disappearing rewards, learner shaming, false fluency scores or artificial paid currencies. All earned-state calculations must survive repeated imports and not award distinct-word achievements for one repeated word.

Verify old-backup compatibility, new preference restore, muting, reaction selection, offline playback, keyboard controls, reduced motion and responsive layouts. Keep the design system and character consistent. Write what changed and what remains awaiting listening review.
