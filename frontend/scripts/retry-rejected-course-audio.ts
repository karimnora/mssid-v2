/** Only the ten explicitly authorized extra takes. No original is deleted, no text retried twice. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reserveAudioRetry } from './audio-retry-budget';
import { writeAudioJson } from './audio-atomic-json';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { discoverV2Root, importV2Recording, loadRecordingLibrary } from './v2-recording-library';

const execute = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directory = resolve(root, 'docs/audio-v1/cours-1ap-2ap/completion');
const rejectedPath = resolve(directory, 'reprises-necessaires.json');
type Rejected = { texte: string; language: string; reason: string; sourceWavSha256: string; reviewRequired: boolean };
// Name an isolated written mark explicitly, rather than asking a voice to pronounce empty vowels.
const markNames: Record<string, string> = { 'ً': 'تَنْوِينُ الفَتْحِ', 'ٍ': 'تَنْوِينُ الكَسْرِ', 'ٌ': 'تَنْوِينُ الضَّمِّ', 'َ': 'الفَتْحَةُ', 'ِ': 'الكَسْرَةُ', 'ُ': 'الضَّمَّةُ', 'ْ': 'السُّكُونُ', 'ّ': 'الشَّدَّةُ', '>': 'أَكْبَرُ مِنْ', '<': 'أَصْغَرُ مِنْ', '38': 'ثَمَانِيَةٌ وَثَلَاثُونَ' };
async function main() {
  if (!process.argv.includes('--generate')) throw new Error('Explicit --generate required for the authorized retries');
  const rejected: Rejected[] = existsSync(rejectedPath) ? JSON.parse(readFileSync(rejectedPath, 'utf8')) : [];
  const v2 = loadRecordingLibrary(discoverV2Root(root));
  const clearRejected = (job: Rejected) => {
    const remaining: Rejected[] = JSON.parse(readFileSync(rejectedPath, 'utf8'));
    writeAudioJson(rejectedPath, remaining.filter(entry => entry.language !== job.language || recordedSpeechKey(entry.texte) !== recordedSpeechKey(job.texte)));
  };
  mkdirSync(resolve(root, 'output/course-audio-completion'), { recursive: true });
  for (const job of rejected) {
    const label = job.language === 'ar' ? markNames[job.texte] : undefined;
    if (label) {
      // Recheck the actual spoken name too, not only the written symbol, before reserving a call.
      const local = loadRecordingLibrary(root).find(label, job.language, 'cedar');
      const existing = local ?? v2.find(label, job.language, 'cedar');
      if (existing) {
        if (!local) importV2Recording(root, existing);
        const path = resolve(root, 'docs/audio-v1/enregistrements-cours-openai.json');
        const metadata = JSON.parse(readFileSync(path, 'utf8'));
        metadata[job.language].clips.push({ ...existing.clip, texte: job.texte, spokenText: label, reusedFrom: local ? 'v1' : 'v2', uses: ['explicit-symbol-label-reuse'] });
        writeAudioJson(path, metadata); clearRejected(job);
        console.log(JSON.stringify({ reusedLabel: job.texte, spokenText: label, billed: false }));
        continue;
      }
    }
    const reservation = reserveAudioRetry(resolve(directory, 'reprises-autorisees.json'), job.texte, job.language);
    if (!reservation) { console.log(JSON.stringify({ skipped: job.texte, reason: 'Budget exhausted or this text already retried' })); continue; }
    const stem = `course-cedar-${createHash('sha256').update(`cedar:${job.texte}`).digest('hex').slice(0, 16)}`;
    const archive = resolve(root, 'output/course-audio-originals', job.language);
    const original = resolve(archive, `${stem}.wav`);
    const backup = resolve(archive, `${stem}-before-authorized-retry-01.wav`);
    if (existsSync(backup)) throw new Error('Retry backup already exists; refusing another paid take');
    if (!existsSync(original)) throw new Error('Rejected original missing; inspect before any paid retry');
    renameSync(original, backup);
    const plan = resolve(root, 'output/course-audio-completion/authorized-retry-job.json');
    writeFileSync(plan, JSON.stringify([{ texte: job.texte, language: job.language, ...(markNames[job.texte] ? { spokenText: markNames[job.texte] } : {}), uses: ['authorized-quality-retry'] }], null, 2) + '\n');
    const result = await execute(process.execPath, [resolve(root, 'frontend/node_modules/tsx/dist/cli.mjs'), 'frontend/scripts/generate-course-audio.ts', '--plan', plan, '--limit', '1', '--include-deferred', '--defer-invalid', '--generate'], { cwd: root, maxBuffer: 1024 * 1024 });
    console.log(result.stdout.trim());
    const metadata = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1/enregistrements-cours-openai.json'), 'utf8'));
    const saved = metadata[job.language]?.clips.some((clip: { texte: string }) => recordedSpeechKey(clip.texte) === recordedSpeechKey(job.texte));
    if (saved) {
      clearRejected(job);
    }
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message.replace(/sk-[a-zA-Z0-9_-]+/g, '[REDACTED]') : 'Authorized retry stopped'); process.exitCode = 1; });
