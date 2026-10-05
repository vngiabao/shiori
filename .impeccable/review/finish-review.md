# Impeccable finish review — Shiori / Violetto

## 1. Disposition

**FIX, then confirm the affected renders.** The direction is coherent and the supplied screenshots are valid application evidence. This does not need a new visual concept or a rebuild. A small set of interaction and honesty defects prevents an unconditional ship verdict.

Review basis: PRODUCT.md, ../Chinese/prompts/japanese-kickoff.md, AUDIT.md, the Impeccable craft floor, current source, and the supplied PNG captures. No separate surface brief exists in .impeccable. This is code-led work with a user-pinned world, not an approved image composition. I inspected Today, Welcome, Night, Lesson, Quiz, Read, Letter 1, Library and Fieldwork at all three requested widths (1440, 768, 375), plus phone Listen/Speak/Practice/Media/Settings and desktop Progress. The detector report is an empty array; that establishes no detector findings, not the absence of defects.

Evidence caveat: these are full-page captures. The fixed phone/tablet navigation appears once at the original viewport seam; that is normal screenshot behavior, not proof that navigation is incorrectly positioned in a live viewport. All required captures show the intended app with loaded fonts and assets, rather than browser failures, placeholders, or loading screens. Long images are downscaled by the review viewer, so very small apparent text in those images is not itself a measured font-size failure. The parent has already changed Letter 1's question and audio-assistance accounting since the supplied capture; those changes require the planned confirmation capture.

## 2. Brief fidelity

The antique-letter direction is clearly present: ivory paper, Prussian-blue ink, emerald actions, ribbon-red active navigation, restrained postmarks, classical upright headings, airy Mincho reading text and typewriter accents. Night post is a convincing counterpart with legible warm text and brighter emerald. Violetto is recognisable across the welcome, reading and thinking poses, with blonde braids, navy coat, ivory skirt, red ribbons, blue eyes and emerald brooch. The working Shiori name is consistently applied without pretending that the user has finalised it.

Today offers a distinct next lesson, a timed plan, letters and a postal lesson route. Read is a reference-and-lesson workspace; Fieldwork is a simple journal rather than an ornamental dashboard. The different structures avoid a generic equal-card scaffold. There is good restraint around the mascot: helpful prominence at onboarding and secondary presence during study.

The reviewed deliverable is a **local beginner prototype with 21 lessons**, not a complete N5-to-N1 programme. Library, the planned journey labels, TTS disclosures, draft labels and AUDIT.md mostly express that distinction honestly. The missing later curriculum, human-reviewed audio, cloud sync and spontaneous conversation scoring are acknowledged scope limitations, not a reason to discard this visual direction. The remaining misleading controls/claims below should nevertheless be corrected in the actual interface.

## 3. Craft findings

- The desktop and tablet lesson stroke controls are visibly broken. Their Play and Reset icons are almost as large as the teaching glyph, displace the labels and collide with the attribution. This is visible at both 1440 and 768, not just a tablet anomaly. `src/styles.css` applies the 150px diagram dimensions through `.stroke-demo svg`, which also matches nested control icons.
- Phone lesson composition removes the stroke demonstration entirely and positions Violetto very close to the heading. The result loses a requested teaching aid and gives the single-line “Meet a new word.” heading an awkward collision at 375. This needs a compact phone arrangement, not another decorative pass.
- Reading has attractive line spacing and clear furigana. However, below the desktop breakpoint the glossary becomes a distant block after the letter and comprehension question. Selecting an unknown word does not show its meaning near the reading position. This is the most consequential responsive interaction issue because glossing is central to the learning loop.
- The long Library and Fieldwork pages remain coherent and avoid horizontal clipping. Desktop whitespace is intentional and consistent with the brief; no material justification exists for filling it with additional cards or metrics.
- The underlying palette, typography, dividers and button hierarchy can ship after focused fixes. There is no material evidence for redoing the brand, mascot or page architecture.

## 4. Functional / accessibility risks grounded in evidence

`src/Study.tsx` gloss-token clicks only update selected/support state. At narrower sizes, CSS puts the entire reader aside after the letter. There is no nearby presentation, scrolling instruction or visible feedback to connect a tap to the out-of-view definition. The existing polite live region helps some screen-reader users but does not solve the sighted phone interaction. Preserve reading position and provide a reachable close action if adding a temporary gloss surface.

`src/LessonPlayer.tsx` completes a lesson after the final response regardless of correctness and then says “Now you can…”. `src/Account.tsx` reinforces this with “Each one, something you can do.” A user who misses every answer still receives the capability claim. Counting completion is legitimate; treating completion as demonstrated capability conflicts with the evidence principle. Show what was practised or make stronger claims conditional on appropriate evidence.

Welcome's “Sign in & sync” is an apparently available action. In `src/Account.tsx` it only reveals that cloud sign-in is not connected. The limitation should be visible before activating the control. Settings already makes that limitation clear.

The Read controls declare `role="tablist"` / `role="tab"` but do not implement arrow-key navigation, roving tabindex, or associated tabpanels. They are ordinary focusable buttons underneath, so they remain operable with Tab and Enter; however, the announced tab semantics promise a different keyboard pattern. Either complete the tab pattern or retain a simpler button group. This was a source finding, not a claimed live keyboard test.

Positive evidence: named icon actions, a skip link, visible focus styling, native dialog use, audio/error status messages, explicit input labels, themed selection/caret/scrollbars and reduced-motion overrides are present in source. I did not run browser interaction, axe, contrast computation or audio playback in this review, and therefore do not certify those behaviors from screenshots alone.

## 5. Numbered material fixes / verdict scope

1. **P1 — Restore a usable stroke tool.** Scope diagram dimensions to the diagram SVG; keep Play/Reset icons at normal control scale. Retain the stroke affordance on phone with a compact placement or explicit disclosure, and separate the mascot from the heading. Confirm lesson at 1440, 768 and 375, including an actionable phone stroke control.
2. **P1 — Put gloss feedback at the reading position on tablet/phone.** Keep the desktop sidebar if desired; use an inline or anchored accessible presentation on small screens. Confirm selecting a word at 768 and 375 reveals its meaning without hunting below the comprehension task. Include the already revised comprehension question in fresh evidence.
3. **P2 — Separate completion from capability claims.** Keep finished lessons and actual answer counts, but describe a completed topic as practice when evidence does not support “Now you can”. Check a zero-correct or fully supported completion, plus the corresponding Progress copy.
4. **P2 — Label unavailable cloud sync before click.** Present it as planned/unavailable rather than an active sign-in offer. Confirm Welcome at least at desktop and phone widths.
5. **P2 — Make reading-area keyboard semantics truthful.** Complete the ARIA tabs pattern or use a labelled button group with pressed/current state; verify keyboard operation and visible focus through all four reading areas.

Small copy refinement alongside these fixes: kana items should say “Meet a new character” and ask for the sound, rather than “word” and “meaning”; omit the duplicate romanised sound displayed as both romaji and meaning. This is a bounded accuracy improvement, not a request to expand curriculum.

After the listed fixes and targeted confirmation, the visual work can ship **as an honest local beginner prototype**. The verdict does not certify a complete advanced course, Japanese editorial correctness, authentic listening breadth, durable cloud backups, spontaneous speaking assessment, or unobserved browser states. No source was edited during this review.
