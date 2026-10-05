# Shiori logo documentation pass

Scope: document the implemented logo without changing the product direction,
UI, artwork or palette system.

Updated DESIGN.md with the original folded bookmark-S, outlined Cormorant 600
wordmark, theme selection, accessible home link and observed responsive sizes.
Removed the stale claim that the wordmark has a metal dot. Updated the visual
attribution in THIRD_PARTY_NOTICES.md, added the short README brand entry and
created public/brand/README.txt with asset inventory, usage and regeneration.

Sources checked: scripts/build-brand.py, src/components.tsx,
src/violet-theme.css, public/brand/index.html, public/brand/FONT-LICENSE.txt,
DESIGN.md and .impeccable/design.json. The sidecar has no brand component and
its narrative contains no obsolete wordmark description; it remains unchanged.
The 144px lockup minimum, 16px mark minimum and S-stem clear space are asset
usage guidance; they are not claimed to be CSS constraints.

System summary:
- Palette: existing blue-led UI; primary identity uses blue, violet and red.
- Type: outlined Cormorant Garamond 600; existing UI type ramp is unchanged.
- Identity: original folded bookmark-S with two bookmark-shaped i dots.
- Variants: primary, inverse and monochrome; one visible app lockup at a time.
- Scale: 174px default, 208px Welcome, 152px at phone widths up to 767px.

Not canonized or repaired: no unrelated palette, ramp or component changes;
this bounded pass records only the newly implemented identity.
