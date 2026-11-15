/** Read-only technical checks of every local media file. No provider or API key. */
import { readdirSync, readFileSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ffmpeg = execFileSync('python', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
const execute = promisify(execFile);
const files = [];
function walk(directory) { for (const item of readdirSync(directory, { withFileTypes: true })) { const path = resolve(directory, item.name); if (item.isDirectory()) walk(path); else if (/\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(item.name)) files.push(path); } }
walk(resolve(root, 'frontend/public')); walk(resolve(root, 'frontend/src/assets'));
const importsOnly = process.argv.includes('--imports');
if (importsOnly) {
  const metadata = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1/enregistrements-reutilises-v2.json'), 'utf8'));
  const imported = new Set(Object.entries(metadata).flatMap(([language, data]) => data.clips.map(clip => resolve(root, 'frontend/public/sounds/preschool', language, clip.fichier))));
  files.splice(0, files.length, ...files.filter(file => imported.has(file)));
}
const results = []; let index = 0;
async function worker() {
  while (index < files.length) {
    const file = files[index++];
    try {
      const { stderr } = await execute(ffmpeg, ['-hide_banner', '-nostdin', '-i', file, '-af', 'volumedetect', '-f', 'null', '-'], { timeout: 30_000, maxBuffer: 200_000, windowsHide: true });
      const mean = stderr.match(/mean_volume:\s*(-?[\d.]+|inf) dB/)?.[1];
      const max = stderr.match(/max_volume:\s*(-?[\d.]+|inf) dB/)?.[1];
      results.push({ file: relative(root, file).replaceAll('\\', '/'), bytes: statSync(file).size, decoded: true, meanDb: Number(mean), peakDb: Number(max), suspiciousSilence: !mean || Number(mean) < -70, warning: /invalid|corrupt|error/i.test(stderr) });
    } catch { results.push({ file: relative(root, file).replaceAll('\\', '/'), decoded: false }); }
    if (results.length % 200 === 0) console.log(JSON.stringify({ checked: results.length, total: files.length }));
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
results.sort((a, b) => a.file.localeCompare(b.file));
const summary = { total: results.length, decoded: results.filter(row => row.decoded).length, failed: results.filter(row => !row.decoded).length,
  suspiciousSilence: results.filter(row => row.suspiciousSilence).length, decodeWarnings: results.filter(row => row.warning).length,
  totalBytes: results.reduce((sum, row) => sum + (row.bytes ?? 0), 0) };
const output = resolve(root, 'docs/audits/audio-2026-11-13'); mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, importsOnly ? 'media-reused-checks.json' : 'media-checks.json'), JSON.stringify({ summary, results }, null, 2) + '\n');
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
