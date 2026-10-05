# Shiori optional cloud sync

Status: implemented and tested with fake transport and mocked browser Auth/RPCs.
No hosted project, account, keys or deployment were created. The SQL migration
and isolation script have NOT been executed against Postgres: psql/Supabase CLI
were unavailable and the installed Docker client had no running daemon.
Static SQL checks are not a substitute for executing the isolation tests.

## Before connecting any live service

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
7. Auth: enable email. Edit the Magic Link email template to include
   `{{ .Token }}` so the interface receives a one-time code, not just a link.
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
