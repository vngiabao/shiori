# Finish confirmation — Shiori / Violetto

## Disposition

**SHIP within the stated beginner-prototype scope.** All five material findings from finish-review.md are resolved. This is the bounded confirmation pass, not a new broad audit.

## Fix scores

1. **Stroke tool — resolved.** Recaptured lesson-1440, lesson-768 and lesson-375 show normal-size Play/Reset icons, readable attribution and a retained phone stroke diagram/control. The direct-child SVG selector fixes the actual cause. Phone Violetto no longer collides with the heading. The supplied browser test clicks the phone stroke tool and checks the control icon is under 40px wide.
2. **Responsive gloss feedback — resolved.** gloss-1440 retains the desktop sidebar. gloss-768 and gloss-375 visibly present the selected word and meaning above the fixed navigation, with Listen and Close meaning. The source gives this a named region and polite announcement, and the browser test checks it is in the viewport. The revised comprehension question now asks what the writer reads rather than exposing the answer in the page metadata.
3. **Completion/capability distinction — resolved.** completion-supported-375 explicitly shows “You practised this goal”, 0 unaided answers and 5 with support. Progress now describes practised topics and says completion is not mastery. Source and the supplied test agree with the rendered state; completing supported practice no longer asserts an achieved capability.
4. **Unavailable sync label — resolved.** Welcome at desktop and phone sizes now says “Cloud sync · coming later” before activation. Guest entry remains the clear primary action. Source retains the explanatory disclosure.
5. **Reading-area semantics — resolved.** The controls now use a labelled group of ordinary buttons with aria-pressed, matching their Tab/Enter behavior. The selected-state CSS follows the new attribute. The supplied browser test checks focus moves to Katakana with Tab and Enter updates its pressed state.

The small kana-copy refinement is also resolved: lesson renders say “Meet a new character”, display the romanised sound once, and the source/test flow uses character-specific continuation labels.

## Evidence and limits

I directly inspected the updated affected screenshots and source, including the supported completion and responsive selected-word states. Full-page captures still show the fixed navigation once at the initial viewport seam; this is capture behavior, not a renewed layout defect. The relevant Playwright assertions were inspected. The implementation agent reports seven passing browser tests, dark-theme axe checks, a production offline reload/lesson/audio check, and an asset provenance scan with one raster asset and no missing records. These runs were not repeated by this reviewer.

## Brief fidelity

The fixes preserve the requested antique writing-desk world, Morning letter/Night post palette, classical type, postal details and Violetto character. The working Shiori brand remains appropriate pending the user's final naming choice. The repairs improve teaching access and evidence honesty without replacing the established direction.

## Actual verdict scope

Ship the reviewed local, responsive **21-lesson beginner prototype** with its existing draft and scope disclosures. This verdict closes the five finish-review findings. It does not certify a complete N5–N1 programme, native-speaker editorial review, diverse authentic listening, cloud sync, long-term cross-device durability, or spontaneous speaking proficiency. No additional polishing or broad audit is requested by this confirmation. No application source was edited by the reviewer.
