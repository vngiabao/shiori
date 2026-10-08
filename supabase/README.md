# Shiori optional cloud sync

Live setup (2026-10-05): project `brepokoccawgqtxqxuwg` in Bao's Website is shared
with Kiyo. Both migrations were applied and rolled-back two-user isolation checks
passed against the hosted database, including anonymous denial and cross-app
deletion isolation. Cloudflare build variables connect each app to this project.
An actual learner sign-in and two-device progress round trip still require manual
acceptance; database tests alone do not prove the whole browser flow.

Shiori uses `shiori_sync_state`, `shiori_learning_records` and `shiori_sync_*` RPCs.
Kiyo uses the separate `kiyo_` equivalents. Auth identities and project quotas are
shared; learning records, revisions, deletion markers and browser storage are not.
Deleting a Supabase Auth user deletes that user's data in BOTH apps. Each app's
cloud-data deletion button deletes only its own records. Keep backup exports.
Shiori's extra Access gate was removed with final user confirmation on 7 October 2026; guest study pages are public, while sync stays owner-only. Kiyo is unchanged. Repository visibility has no effect on sync.

Allowed Auth redirects: `https://shiori.gbaonvo.com/` and
`https://kiyo.gbaonvo.com/`. Site URL defaults to Shiori; each app sends its own
origin as the redirect. Hosted login is Google-only for `gbao.n.vo@gmail.com`.
`shared-project/owner-only.sql` is applied: a before-user-created hook, restrictive
RLS policies and all six definer RPCs check the exact email and Google provider.
`shared-project/owner-only.test.sql` passed in the hosted SQL editor with all
fixtures rolled back. Email and Apple login are disabled. Google OAuth credential
setup is saved and Google is enabled in Supabase. Google Cloud client `Kiyo & Shiori web` uses both app origins and the shared Supabase callback. The only Google test user is the owner. For the deployments,
set `VITE_AUTH_PROVIDERS=google`, `VITE_AUTH_MODE=google-only` in both builds.
Only the publishable key belongs in VITE variables, never a secret/service-role key.

## Additive saved-line update — 7 October 2026

Applied migrations/202610050002_saved_line_unit.sql to the shared hosted project through its SQL editor. Only Shiori's learning_payload_keys constraint changed: `lines` now permits optional `unit`; all other allowed fields remain the same. The transaction committed and the post-check returned true for constraint validation, optional-unit allowance, RLS enabled and RLS forced. Existing records were validated, not rewritten or deleted. Kiyo tables, owner-only policies and Auth configuration were unchanged. This is schema validation, not the owner's two-device browser acceptance test.

## Historical standalone setup instructions

1. Start a local Supabase stack using the Supabase CLI and Docker.
2. Apply `migrations/202610050001_learning_sync.sql` to that LOCAL database as
   administrator. This is a first migration, not a repeatable seed.
3. Run `psql --set ON_ERROR_STOP=1 --file supabase/tests/rls.sql` against that
   local database. Fixtures and temporary grants roll back. Confirm two-user
   isolation, anonymous denial, null revision rejection and deletion isolation.
4. Only when you want hosted sync, create a Supabase project in your own account.
   Review the current plan and usage limits before enabling it. Small personal
   use may fit the free tier; pricing, quotas and inactive-project behavior can
   change. This app does not promise free hosting forever.
5. Apply the reviewed migration through that project's SQL editor. Re-run the
   equivalent isolation checks there before trusting it with learning history.
6. Copy `.env.example` to `.env.local`. Enter your project's API URL and public
   anon/publishable key. NEVER put service-role/secret credentials in VITE_ vars.
7. Auth: enable email. The default Magic Link template works; an email code is
   optional if your configured template includes `{{ .Token }}`.
   Set the site URL and allowed redirect to `http://127.0.0.1:5174` for this app.
   Enable Google only after configuring its OAuth client and provider callback
   in Supabase; client secrets belong in provider settings, not the browser.
8. Restart Vite. Settings → Account & cloud sync now shows sign-in controls.
   Sign in, then explicitly choose Add this device’s progress. Test with two
   browser profiles, including offline changes and an interrupted upload.

Official references:
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/database/postgres/row-level-security

## What travels

By default: attempts, completions, media session metadata (including clip label),
JLPT plans/runs, reading runs and core profile preferences. Review schedules are
rebuilt from attempts; voice settings stay device-local. No audio, recording or
video bytes sync. Personal-text opt-in additionally includes text desk passages,
translations/reference notes, saved subtitle lines, field-session notes and
JLPT study logs. Unsaved recovery drafts and local letter replies never sync.
Disabling personal text stops future transfers but does not remove previously
uploaded content. Delete cloud learning data removes all synced records; it
keeps Auth and local data, and other devices pause on the deletion epoch.

Database identity remains `shiori-japanese-v1`; additive version 6 introduces
only syncState. Backup export excludes auth identity, consent and sync ownership.
An account cannot claim a database already bound to a different account.
Use another browser profile for a different learner; no automatic data clearing.

Local records are the durable offline queue. A persisted snapshot fingerprint
tracks acknowledged work. Reconnect and periodic checks retry; server revision
locks avoid overwriting a concurrently changed snapshot. Attempts/media/reading
runs are immutable (conflicting same IDs raise an error). Completions choose the
first completion. Mutable text chooses latest at; profiles choose updatedAt,
then writer ID and canonical content for ties. JLPT plans choose highest cycle,
then canonical content; quiz runs prefer submitted results, then more answered
items and canonical content. These deterministic tie-breaks are not semantic
conflict resolution: export a backup before editing the same draft on two
machines. Device clocks affect last-write-wins fields.

Ported from the Chinese sibling's Auth/transport/revision/consent architecture;
record schemas and data validation are Shiori-specific. SQL enables and forces
RLS on both tables. Authenticated direct access is SELECT only, confined to the
user; RPC writes derive auth.uid(), check revisions and use an empty search path.
