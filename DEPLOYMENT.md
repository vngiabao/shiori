# Cloudflare deployment

The expanded app keeps the existing Shiori hostname and every historical audio URL. Three static-only Workers share the files: `shiori` serves the app and legacy assets; `shiori-audio-a` serves `vv2-0*` through `vv2-7*`; `shiori-audio-b` serves `vv2-8*` through `vv2-f*`. Routes take precedence over the main custom domain. No application Worker code runs for these files.

Cloudflare's current Free plan permits 20,000 static files per Worker, with a 25 MiB maximum per file. Static-asset requests and storage are free. The staging tool enforces both limits, verifies copied bytes and preserves URLs. This is a deployment layout for the existing library, not a paid service or a new data store.

1. Build with the existing production VITE variables. Only the Supabase publishable key belongs in browser variables.
2. Run `npm run deploy:cloudflare`. It stages the built files, deploys both immutable audio Workers first, then deploys the main app. Do not deploy the full `dist` folder directly: the full library exceeds the per-Worker file limit.
3. Workers Builds uses `npm run build` as its build command and `npm run deploy:cloudflare` as its deploy command. Production branch remains `main`; preview URLs remain disabled. Confirm this dashboard configuration before the final production push.
4. Verify the hosted shell, course levels and WAV bytes across all sixteen hash prefixes. Existing files are preserved; browser offline storage is separate from hosting.

The full optional audio download is roughly 2 GB. The initial shell is guarded below 15 MiB; audio loads on demand and offline saving is optional. Browser storage may be insufficient on some devices. A failed or evicted download must report that fact rather than promise complete offline availability.

Current rollout status: staging byte checks and all three dry runs pass. Staged file counts are main 2,901 /audio-a 9,772 /audio-b 9,682, all under the free per-Worker limit. A simulated Workers Builds name/tag environment also passes with explicit account/name/hostname guards; child deployments do not inherit the main Worker name override. The dashboard deploy command was saved as npm run deploy:cloudflare. Live rollout has not completed. The saved-line-unit database update is additive. Removing Shiori's extra Access gate leaves public guest study with Google sync restricted to the owner; Kiyo remains unchanged.

Sources checked 7 October 2026: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ ; https://developers.cloudflare.com/workers/platform/limits/ ; https://developers.cloudflare.com/workers/configuration/routing/routes/ ; https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ .
