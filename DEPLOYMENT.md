# Cloudflare deployment

The expanded app keeps the existing Shiori hostname and every historical audio URL. Three static-only Workers share the files: `shiori` serves the app and legacy assets; `shiori-audio-a` serves `vv2-0*` through `vv2-7*`; `shiori-audio-b` serves `vv2-8*` through `vv2-f*`. Routes take precedence over the main custom domain. No application Worker code runs for these files.

Cloudflare's current Free plan permits 20,000 static files per Worker, with a 25 MiB maximum per file. Static-asset requests and storage are free. The staging tool enforces both limits, verifies copied bytes and preserves URLs. This is a deployment layout for the existing library, not a paid service or a new data store.

1. Build with the existing production VITE variables. Only the Supabase publishable key belongs in browser variables.
2. Run `npm run deploy:cloudflare`. It stages the built files, deploys both immutable audio Workers first, then deploys the main app. Do not deploy the full `dist` folder directly: the full library exceeds the per-Worker file limit.
3. Workers Builds uses `npm run build` as its build command and `npm run deploy:cloudflare` as its deploy command. Production branch remains `main`; preview URLs remain disabled. Confirm this dashboard configuration before the final production push.
4. Verify the hosted shell, course levels and WAV bytes across all sixteen hash prefixes. Existing files are preserved; browser offline storage is separate from hosting.

The full optional audio download is roughly 2 GB. The initial shell is guarded below 15 MiB; audio loads on demand and offline saving is optional. Browser storage may be insufficient on some devices. A failed or evicted download must report that fact rather than promise complete offline availability.

Current rollout status, 7 October 2026: Cloudflare build `9e7006eb-e3af-4867-89b9-daaa2c233677` successfully deployed commit `d0dc6c74493023d4f9515da291e6427e2b3b3b1a`. Main version `347cecc0-4c75-46cc-ab61-7f1edbfc34f2`, audio-a version `41a59e28-d2d3-4a19-84a7-61746225d6e6` and audio-b version `475e5267-82a8-4604-b8a3-6f42151a64f6` are active at 100%. Staging byte checks and all three dry runs pass. Staged file counts are main 2,901 /audio-a 9,772 /audio-b 9,682, all under the free per-Worker limit. All sixteen hosted hash-prefix WAV samples match local bytes. Shiori's extra Access application is removed after final user confirmation; Kiyo remains unchanged. The complete hosted audio audit, fourteen focused app/audio cases and fresh public desktop/mobile welcome verification pass. The additive saved-line-unit database update is applied. Google sync stays restricted to the owner and Kiyo remains unchanged.

Sources checked 7 October 2026: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ ; https://developers.cloudflare.com/workers/platform/limits/ ; https://developers.cloudflare.com/workers/configuration/routing/routes/ ; https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ .

Hosted audio evidence at `2026-10-08T00:49:33.542Z` (7 October EDT): all19,517 current/historical WAV URLs pass status/audio-MIME checks, and sixteen full downloads match local SHA256. HEAD Content-Length is omitted by this Cloudflare deployment; the verifier records that fact and validates length only when supplied. The fresh root returns200, guest entry and Google entry are visible, and fourteen live app/audio checks pass. Actual owner OAuth/two-device sync remain separate acceptance tests.
