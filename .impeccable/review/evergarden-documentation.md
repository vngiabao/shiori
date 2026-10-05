# Evergarden palette documentation refresh

Updated DESIGN.md and .impeccable/design.json from the current src/styles.css tokens and src/violet-theme.css usage. Corrected the last fidelity sentence in .impeccable/surface-briefs/violet-correspondence.md. The original ../Chinese/prompts/japanese-kickoff.md was read only.

Prussian blue #1F2A44, ivory #F6F1E7, emerald #1F6B57, ribbon red #A8323E and honey gold #C9A15A are restored in token names, descriptive prose, component previews and eight-step OKLCH tonal metadata. Night post follows the shipped navy and emerald variants. Existing typography, layout, shape and motion documentation is preserved.

Validation passed: all 34 frontmatter colors match CSS exactly; every color metadata key and component color reference resolves; all 50 preview color fallbacks match CSS; all ramps have eight steps; no stale --violet-* token references remain. The ambient shadow now matches the blue CSS shadow. Narrative mirrors the refreshed Markdown. No app/build tests were run in this documentation pass.

Visually inspected evergarden-today-1440.png and evergarden-night-375.png: blue framing, ivory/cream light paper, navy night paper and emerald actions agree with the documentation.

Not canonized or repaired: unrelated detector advisories and inherited small-metadata treatments are outside this palette correction. No new prohibitions were inferred from them.

Role execution: fresh documenter subagent, using the degraded documenter guidance; its inline-role substitution was unnecessary because delegation is available.
