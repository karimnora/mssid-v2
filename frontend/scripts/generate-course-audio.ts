/** Offline production only. Dry-run by default; no browser import and no secret in output. */
import { constants, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRecordedSpeechSequence } from '../src/utils/recordedSpeech';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { writeAudioJson } from './audio-atomic-json';
import { recordingNormalizationDb } from './audio-recording-levels';
import { runAudioQueue } from './audio-production-queue';
import { discoverV2Root, importV2Recording, loadRecordingLibrary } from './v2-recording-library';

const execute = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const option = (name: string) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const model = 'gpt-4o-mini-tts';
const voice = 'cedar'; // Didou V2: keep the voice explicitly requested by Karim.
const instructions = (language: string) => `Read exactly the provided text in ${language === 'ar' ? 'Modern Standard Arabic (fusha), accurate Arabic vowels and consonants, no dialect' : language === 'fr' ? 'clear natural French' : 'clear natural English'}. You are Didou, a warm, patient educational guide for primary school children. Sound natural and expressive, with cheerful energy, warm encouragement, gentle pauses and a clear pace suitable for young children. No exaggerated cartoon voice, singing, music, extra words or sound effects.`;
type Job = { texte: string; spokenText?: string; language?: 'ar' | 'fr' | 'en'; uses?: string[]; targets?: { lessonId: string; grade: string; key: string }[] };
type Clip = { texte: string; fichier: string; duration: number; sha256: string; voice: string; model: string; generatedAt: string; synthetic: true; reviewStatus: string; sourceWavSha256: string; spokenText?: string; normalizationDb?: number; uses: string[] };
const digest = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
function wavStats(audio: Buffer) {
  if (audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Invalid WAV response');
  let rate = 0, bits = 0, data: Buffer | undefined;
  for (let offset = 12; offset + 8 <= audio.length;) {
    const size = audio.readUInt32LE(offset + 4);
    const name = audio.toString('ascii', offset, offset + 4);
    if (name === 'fmt ' && size >= 16) { rate = audio.readUInt32LE(offset + 16); bits = audio.readUInt16LE(offset + 22); }
    if (name === 'data') data = audio.subarray(offset + 8, Math.min(audio.length, offset + 8 + size));
    offset += 8 + size + (size % 2);
  }
  if (!rate || bits !== 16 || !data?.length) throw new Error('Unsupported or empty PCM');
  let sum = 0, peak = 0;
  for (let i = 0; i + 1 < data.length; i += 2) {
    const sample = data.readInt16LE(i) / 32768;
    sum += sample ** 2; peak = Math.max(peak, Math.abs(sample));
  }
  const rms = Math.sqrt(sum / Math.floor(data.length / 2));
  const duration = data.length / rate;
  return { duration, rms, peak };
}
async function main() {
  if (args.includes('--generate') && existsSync(resolve(root, 'output/course-audio-completion/hold'))) throw new Error('Production held between batches; no new request started');
  const limit = Number(option('--limit') ?? 3);
  const concurrency = Number(option('--concurrency') ?? 1);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new Error('Concurrency must be an integer from 1 to 4');
  if (!Number.isInteger(limit) || limit < 1 || limit > 24) throw new Error('Limit must be an integer from 1 to 24');
  const plan = resolve(root, option('--plan') ?? 'docs/audio-v1/cours-1ap-2ap/openai-lot-01-demande.json');
  const jobs: Job[] = JSON.parse(readFileSync(plan, 'utf8'));
  const metadataPath = resolve(root, 'docs/audio-v1/enregistrements-cours-openai.json');
  const meta: Partial<Record<'ar' | 'fr' | 'en', { clips: Clip[] }>> = existsSync(metadataPath) ? JSON.parse(readFileSync(metadataPath, 'utf8')) : { ar: { clips: [] } };
  const deferredPath = resolve(root, 'docs/audio-v1/cours-1ap-2ap/completion/reprises-necessaires.json');
  const deferred: { texte: string; language: string; reason: string; sourceWavSha256: string; reviewRequired: boolean }[] = existsSync(deferredPath) ? JSON.parse(readFileSync(deferredPath, 'utf8')) : [];
  let deferredSkipped = 0;
  // Fail closed if V2 cannot be inspected: never bill for a possibly existing clip.
  const v2 = loadRecordingLibrary(discoverV2Root(root));
  const reusableV2: ReturnType<typeof v2.find>[] = [];
  const pending = jobs.filter(job => {
    if (job.language && !['ar', 'fr', 'en'].includes(job.language)) throw new Error('Unsupported language');
    if (job.spokenText !== undefined && (!job.spokenText || job.spokenText.length > 2000)) throw new Error('Unexpected spoken input size');
    if (!job.texte || job.texte.length > 2000) throw new Error('Unexpected input size');
    if (findRecordedSpeechSequence(job.texte, job.language ?? 'ar')) return false;
    const clip = meta[job.language ?? 'ar']?.clips.find(clip => recordedSpeechKey(clip.texte) === recordedSpeechKey(job.texte));
    if (!clip) {
      const existing = v2.find(job.texte, job.language ?? 'ar', voice);
      if (existing) { reusableV2.push(existing); return false; }
      if (!args.includes('--include-deferred') && deferred.some(entry => entry.language === (job.language ?? 'ar') && recordedSpeechKey(entry.texte) === recordedSpeechKey(job.texte))) { deferredSkipped++; return false; }
      return true;
    }
    const path = resolve(root, 'frontend/public/sounds/preschool', job.language ?? 'ar', clip.fichier);
    if (!existsSync(path) || digest(readFileSync(path)) !== clip.sha256) throw new Error('Previously produced file failed integrity check; refusing overwrite');
    return false;
  });
  const selected = args.includes('--complete-plan') ? pending : pending.slice(0, limit);
  console.log(JSON.stringify({ model, voice, v2Checked: true, v2Reusable: reusableV2.length, total: jobs.length, reused: jobs.length - pending.length - deferredSkipped, deferred: deferredSkipped, pending: pending.length, selected: selected.length, characters: selected.reduce((sum, job) => sum + job.texte.length, 0), generate: args.includes('--generate') }));
  if (!args.includes('--generate')) return;
  for (const recording of reusableV2) if (recording) importV2Recording(root, recording);
  if (!selected.length) return;
  // Local secret already provided by the user. Never load it into Vite/client code.
  const envFile = resolve(root, 'frontend/.env.local');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
  const ffmpeg = execFileSync('python', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();
  const archive = resolve(root, 'output/course-audio-originals');
  mkdirSync(archive, { recursive: true });
  for (let batchOffset = 0; batchOffset < selected.length; batchOffset += limit) {
  await runAudioQueue(selected.slice(batchOffset, batchOffset + limit), concurrency, async job => {
    const language = job.language ?? 'ar';
    const destination = resolve(root, 'frontend/public/sounds/preschool', language);
    const languageArchive = resolve(archive, language);
    mkdirSync(destination, { recursive: true }); mkdirSync(languageArchive, { recursive: true });
    meta[language] ??= { clips: [] };
    const isPhoneme = language === 'ar' && (job.texte.replace(/\u0640/gu, '').match(/\p{L}/gu)?.length ?? 0) === 1;
    const stem = `course-cedar-${digest(`${voice}:${job.texte}`).slice(0, 16)}`;
    const target = resolve(destination, `${stem}.mp3`);
    const wavPath = resolve(languageArchive, `${stem}.wav`);
    if (existsSync(target)) throw new Error('Existing output detected; refusing overwrite');
    let audio: Buffer;
    if (existsSync(wavPath)) {
      // Recover an already billed original locally; never request the same sound twice.
      audio = readFileSync(wavPath);
    } else {
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/audio/speech', { method: 'POST', signal: AbortSignal.timeout(120_000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, voice, input: job.spokenText ?? job.texte, response_format: 'wav', instructions: instructions(language) + (isPhoneme ? ' The input is one isolated Arabic sound. Pronounce it clearly at normal speaking volume with exactly its written vowel. Do not say the letter name, repeat it or add any other words.' : '') }),
      });
    } catch { throw new Error('OpenAI network request failed; no automatic retry to avoid duplicate charges'); }
    if (!response.ok) {
      let code = 'unknown';
      try { const body = await response.json(); code = String(body.error?.code ?? body.error?.type ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80); } catch { /* Never print raw provider responses. */ }
      throw new Error(`OpenAI speech failed: HTTP ${response.status}, code ${code}. Completed clips are saved.`);
    }
    audio = Buffer.from(await response.arrayBuffer());
    writeFileSync(wavPath, audio, { flag: 'wx' });
    }
    let stats: ReturnType<typeof wavStats>, normalizationDb: number;
    try {
      stats = wavStats(audio);
      normalizationDb = recordingNormalizationDb(stats.rms, stats.peak, stats.duration, isPhoneme);
    } catch {
      if (!args.includes('--defer-invalid')) throw new Error('Unusable recording; no automatic paid retry');
      const rejected = { texte: job.texte, language, reason: 'Unusable recording; excluded from the child audio index', sourceWavSha256: digest(audio), reviewRequired: true };
      const prior = deferred.findIndex(entry => entry.language === language && recordedSpeechKey(entry.texte) === recordedSpeechKey(job.texte));
      if (prior >= 0) deferred[prior] = rejected; else deferred.push(rejected);
      mkdirSync(dirname(deferredPath), { recursive: true });
      writeAudioJson(deferredPath, deferred);
      console.log(JSON.stringify({ deferred: stem, reason: 'recording-quality', retried: false }));
      return;
    }
    const compressed = resolve(languageArchive, `${stem}.mp3`);
    if (!existsSync(compressed)) await execute(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-n', '-i', wavPath, ...(normalizationDb ? ['-af', `volume=${normalizationDb}dB`] : []), '-codec:a', 'libmp3lame', '-b:a', '80k', '-ar', '24000', '-ac', '1', compressed]);
    await execute(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', compressed, '-f', 'null', '-']);
    copyFileSync(compressed, target, constants.COPYFILE_EXCL);
    meta[language]!.clips.push({ texte: job.texte, fichier: `${stem}.mp3`, duration: stats.duration, sha256: digest(readFileSync(target)), voice, model,
      generatedAt: new Date().toISOString(), synthetic: true, reviewStatus: 'listening-required', sourceWavSha256: digest(audio), ...(job.spokenText ? { spokenText: job.spokenText } : {}), ...(normalizationDb ? { normalizationDb } : {}),
      uses: job.uses ?? job.targets?.map(target => `course:${target.lessonId}:${target.key}`) ?? [],
    });
    writeAudioJson(metadataPath, meta);
    console.log(JSON.stringify({ saved: `${stem}.mp3`, seconds: Number(stats.duration.toFixed(2)), rms: Number(stats.rms.toFixed(4)), totalSaved: meta[language]!.clips.length }));
  });
  console.log(JSON.stringify({ batchCompleted: Math.min(batchOffset + limit, selected.length), batchTotal: selected.length }));
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message.replace(/sk-[a-zA-Z0-9_-]+/g, '[REDACTED]') : 'Audio generation failed'); process.exitCode = 1; });
