import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const wrangler = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));
const dryRun = process.argv.includes('--dry-run');
const account = 'c171df5a2c42c7c28825bc0d2e64698b';
function deploy(config, expectedName, auxiliary) {
  const settings = JSON.parse(readFileSync(config, 'utf8'));
  if (settings.name !== expectedName || settings.account_id !== account ||
      settings.routes.some(route => !route.pattern.startsWith('shiori.gbaonvo.com')))
    throw new Error(`Unexpected deployment destination in ${config}`);
  const env = { ...process.env };
  if (auxiliary) {
    // Workers Builds injects the connected MAIN Worker's name/tag. Carrying
    // those into an auxiliary deploy would overwrite the main app. Keep the
    // original guards for main; auxiliary targets are asserted above.
    delete env.WRANGLER_CI_OVERRIDE_NAME;
    delete env.WRANGLER_CI_MATCH_TAG;
  } else if (env.WRANGLER_CI_OVERRIDE_NAME && env.WRANGLER_CI_OVERRIDE_NAME !== expectedName) {
    throw new Error('This build is connected to an unexpected main Worker');
  }
  const args = [wrangler, 'deploy', '--config', config];
  if (dryRun) args.push('--dry-run');
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
// Deploy the immutable audio first, then publish the app that references it.
deploy('wrangler.audio-a.jsonc', 'shiori-audio-a', true);
deploy('wrangler.audio-b.jsonc', 'shiori-audio-b', true);
deploy('wrangler.jsonc', 'shiori', false);
