import { readdirSync, statSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve('.');
const dist = resolve(root, 'dist');
const stage = resolve(root, 'output/cloudflare-assets');
if (relative(root, stage).startsWith('..') || stage !== join(root, 'output', 'cloudflare-assets'))
  throw new Error('Unexpected deployment staging path');
// This generated directory alone is replaceable; never alter source assets.
rmSync(stage, { recursive: true, force: true });
for (const part of ['main', 'audio-a', 'audio-b']) mkdirSync(join(stage, part), { recursive: true });
const counts = { main: 0, 'audio-a': 0, 'audio-b': 0 };
const bytes = { main: 0, 'audio-a': 0, 'audio-b': 0 };
const manifest = [];
function visit(dir) {
  for (const name of readdirSync(dir)) {
    const source = join(dir, name), stat = statSync(source);
    if (stat.isDirectory()) { visit(source); continue; }
    const url = relative(dist, source).replaceAll('\\', '/');
    const hash = /^audio\/vv2-([0-9a-f])[0-9a-f]+\.wav$/.exec(url);
    const part = hash ? (parseInt(hash[1], 16) < 8 ? 'audio-a' : 'audio-b') : 'main';
    if (stat.size > 25 * 1024 * 1024) throw new Error(`File exceeds free asset size: ${url}`);
    const destination = join(stage, part, url);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(source, destination);
    const digest = buffer => createHash('sha256').update(buffer).digest('hex');
    if (digest(readFileSync(source)) !== digest(readFileSync(destination)))
      throw new Error(`Staging changed bytes: ${url}`);
    counts[part]++; bytes[part] += stat.size;
    manifest.push({ url: '/' + url, part, bytes: stat.size });
  }
}
visit(dist);
for (const part of ['audio-a', 'audio-b']) {
  writeFileSync(join(stage, part, '_headers'), '/audio/*\n  Cache-Control: public, max-age=31536000, immutable\n  X-Content-Type-Options: nosniff\n');
  counts[part]++;
}
for (const part of Object.keys(counts))
  if (counts[part] > 20000) throw new Error(`${part} exceeds the free 20,000-file limit`);
const report = { counts, bytes, files: manifest, noUrlChanges: true, copiedBytesVerified: true };
writeFileSync(join(stage, 'manifest.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ counts, bytes, copiedBytesVerified: true }));
