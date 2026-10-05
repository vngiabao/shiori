# Reading extension design check

2026-10-05 — ordinary content and practice extension; incumbent design retained.

Reviewed PRODUCT.md, DESIGN.md, the impeccable document reference, ReadingPath.tsx, reading-path.ts, Read's button group in Study.tsx, and the appended reading rules in study-layout.css. Rendered evidence: reading-path-desktop.png, reading-path-mobile-dark.png, text-desk-mobile.png, and reading-selected.png in this directory.

- The extension inherits the cool blue desk, paper fields, blue actions, muted secondary text, and theme-aware rules. Its added CSS uses existing semantic variables; it introduces no palette, font, or radius tokens.
- Cormorant headings and Source Sans UI remain inherited. Japanese practice uses the existing Noto Serif JP alias and shared semantic Furigana component. The local responsive reading size is a task-specific role, not a replacement for the letter-reader hierarchy.
- Primary and secondary actions reuse Button. Choices reuse the existing numbered answer rows; the selected state now uses the incumbent accent outline and accent wash. The reading areas retain the existing underlined button group with aria-pressed.
- The path uses flat ruled sections, a restrained 800px content width, wrapping actions, and the existing responsive shell. The text desk inherits standard labels, paper inputs, and textareas. Desktop light and phone dark evidence retain the same identity and hierarchy.
- Copy keeps beginner scope, draft status, optional timing, and supported versus independent evidence explicit, consistent with PRODUCT.md.

Disposition: ship following the two finish fixes: visible selected-answer feedback and text-desk draft recovery across area changes with a separate dirty state. Both are present in the inspected source and were scored resolved by the finish reviewer; the selected-answer screenshot provides visual evidence for the first. Behavioral verification belongs to the implementation checks.

Existing documentation drift remains untouched: DESIGN.md's today-display frontmatter tops out at 58px while its prose says 56px; lesson-heading frontmatter tops out at 48px while prose says 46px. These are incumbent roles outside this extension. Full-page phone captures contain fixed-navigation and focus capture artifacts, so they are not evidence of a new layout regression by themselves.

No design-system refresh was needed. DESIGN.md and .impeccable/design.json were preserved. Only this check record was written by the documenter pass.
