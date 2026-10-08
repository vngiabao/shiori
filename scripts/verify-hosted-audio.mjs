import fs from 'node:fs';
import { createHash } from 'node:crypto';
const origin = 'https://shiori.gbaonvo.com';
const report = JSON.parse(fs.readFileSync('output/cloudflare-assets/manifest.json', 'utf8'));
const files = report.files.filter(file => file.url.endsWith('.wav'));
if (!files.length) throw new Error('No staged audio files to verify');
const preflight = await fetch(origin + files[0].url, {
  method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(20000),
});
if (preflight.status !== 200)
  throw new Error(`Hosted audio is not ready: HTTP ${preflight.status}. Check deployment and Access before the full audit.`);
const issues = []; let next = 0, checked = 0;
const lengthHeaders = { present: 0, omitted: 0 };
async function inspect(file) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(origin + file.url, {
        method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(20000),
        headers: { 'Accept-Encoding': 'identity' },
      });
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      // Cloudflare may omit Content-Length on HEAD, even for immutable WAVs.
      // Validate it when supplied; exact sample bytes are verified by GET below.
      const length = response.headers.get('content-length');
      if (length !== null && Number(length) !== file.bytes)
        throw new Error('Hosted length differs from the staged file');
      if (!/audio|wav|octet-stream/.test(response.headers.get('content-type') ?? ''))
        throw new Error('Unexpected content type');
      lengthHeaders[length === null ? 'omitted' : 'present']++;
      return;
    } catch (error) { last = String(error); }
  }
  issues.push({ url: file.url, error: last });
}
await Promise.all(Array.from({ length: 16 }, async () => {
  while (next < files.length) {
    const file = files[next++]; await inspect(file);
    if (++checked % 1000 === 0) console.log(`Verified ${checked}/${files.length} hosted WAV headers`);
  }
}));
const samples = [];
const sampleUrls = new Set();
for (const prefix of '0123456789abcdef') {
  const file = files.find(file => file.url.startsWith(`/audio/vv2-${prefix}`));
  if (!file) throw new Error(`Missing local hash prefix ${prefix}`);
  sampleUrls.add(file.url);
}
// Also verify exact bytes for the revised accent targets and every reaction
// mood, plus the two roles whose similarity prompted this refresh.
const clear = JSON.parse(fs.readFileSync('src/generated/audio.json', 'utf8'));
for (const text of ['雨', '飴']) sampleUrls.add(clear[text]);
const teacher = JSON.parse(fs.readFileSync('src/generated/violetto-teacher.json', 'utf8'));
for (const mood of new Set(teacher.map(line => line.mood)))
  sampleUrls.add(teacher.find(line => line.mood === mood).url);
const cast = JSON.parse(fs.readFileSync('src/generated/cast-auditions.json', 'utf8'));
for (const speaker of ['Yui', 'You']) sampleUrls.add(cast.find(line => line.speaker === speaker).url);
for (const url of sampleUrls) {
  const file = files.find(file => file.url === url);
  if (!file) throw new Error(`Current sample was not staged: ${url}`);
  const response = await fetch(origin + file.url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  const bytes = Buffer.from(await response.arrayBuffer());
  const local = fs.readFileSync('public' + file.url);
  const hash = value => createHash('sha256').update(value).digest('hex');
  if (response.status !== 200 || hash(bytes) !== hash(local))
    issues.push({ url: file.url, error: 'Hosted sample differs from preserved local bytes' });
  else samples.push({ url: file.url, sha256: hash(bytes), bytes: bytes.length });
}
const result = { checkedAt: new Date().toISOString(), origin, wavFilesChecked: checked,
  issues, lengthHeaders, exactByteSamples: samples, includesHistoricalFiles: true, ownerSignInTested: false };
fs.writeFileSync('output/hosted-audio-verification.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ checked, issues: issues.length, exactByteSamples: samples.length }));
if (issues.length) process.exitCode = 1;
