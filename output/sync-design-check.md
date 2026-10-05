# Sync controls: ordinary-extension design check

Date: 2026-10-05

Disposition: consistent with the existing Settings design for bounded, locally tested sync groundwork. This is a consistency record, not approval of a new visual identity or confirmation of a live cloud service.

## Authority and evidence

Reviewed `PRODUCT.md`, `DESIGN.md`, the impeccable document reference, `src/SyncPanel.tsx`, and its integration in `src/Account.tsx`. Inspected `output/sync-consent-desktop.png` (a cropped consent panel) and `output/sync-settings-mobile.png` (the Settings page at 375px capture width). The parent task reports local testing and the reviewer's bounded-groundwork disposition; the complete test suite was pending at this documentation pass. SQL deployment and live authentication/sync were not verified here.

The user approved sync controls within existing Settings, with personal text opt-in off. The established Violetto correspondence direction, semantic palette, typography and component rules remain authoritative. `DESIGN.md` and `.impeccable/design.json` are preserved: this extension introduces no new design-system decision requiring either file to be regenerated.

## Consistency findings

- The account section follows the existing backup controls in Settings. It retains the page's upright serif headings, practical sans-serif controls, pale blue canvas and restrained blue primary action. It introduces no new brand plane, artwork, decorative card system or navigation surface.
- Shared `Button` primitives distinguish the primary progress-consent/sync action from secondary local-only, deletion and sign-out actions. The phone capture shows natural wrapping, readable long consent text and stacked lower actions within the existing single-column Settings layout; no horizontal clipping is visible.
- The consent screenshot shows an unchecked personal-text checkbox. Source uses `settings?.includeText ?? false`, and nearby copy explains what is included, the consequence of disabling future transfer, and that unsaved drafts and letter replies remain local. This is consistent with explicit consent and the product's honest local-storage language.
- Status and error outputs use `role="status"` and `role="alert"`. Email/code fields and the checkbox have enclosing labels. Actions expose disabled states while busy; the primary sync action and personal-text control also disable during sync. Cloud deletion presents an explicit native confirmation that local progress remains.
- Without cloud configuration, the component says local guest mode is active and refers to the backups above, rather than presenting a working cloud connection.

## Evidence limits

The screenshots establish the displayed light-theme consent and mobile synced states only. The desktop evidence is a panel crop, not a complete desktop Settings composition. Dark-theme rendering, keyboard traversal, contrast measurement, and every loading/error/account-mismatch state were not independently exercised during this documentation pass. The mobile capture includes a visible skip-to-content focus link over part of the backup explanation; this records the captured focus state, not a new sync style.

Treat any displayed synced status, account address or timestamp in these local captures as local test evidence. They do not establish successful production authentication, deployed SQL policies or cross-device service behavior. Full-suite results and live-service verification belong in the implementation validation record when available.
