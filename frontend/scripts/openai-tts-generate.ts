/** Offline voice production. Never import this file from the browser application.
 * Dry run by default; --generate calls OpenAI. --env-file accepts a local secret file.
 * --scope labs limits to laboratory guidance; --limit N bounds a batch.
 * Existing recordings remain unchanged. Output can be indexed by audio:index.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectJobs, type VoiceJob } from './elevenlabs-generate';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { ROAD_SCENES } from '../src/data/immersive/roadCode';
import { MOSQUE_SCENES } from '../src/data/immersive/mosqueAdab';
import { labsImmersive as labCopy } from '../src/locales/ar/labsImmersive';
import { LAB_GUIDE_HINTS } from '../src/data/labGuideHints';
import { WUDU_STEPS, WUDU_QUIZ } from '../src/data/immersive/wudu';
import { SALAT_POSTURES, SALAT_QUIZ, SALAT_PRAYERS, salatPrayerNarration } from '../src/data/immersive/salat';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outMeta = resolve(root, 'docs/audio-v1/enregistrements-v2-openai.json');
type Clip = { texte: string; fichier: string; duration: number; sha256: string; voice: string; model: string; generatedAt: string; uses: string[]; synthetic: true };
type Meta = Record<string, { clips: Clip[] }>;
const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
function wavDuration(audio: Buffer): number {
  if (audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE') throw new Error('Invalid WAV response');
  let byteRate = 0, dataBytes = 0;
  for (let offset = 12; offset + 8 <= audio.length;) {
    const name = audio.toString('ascii', offset, offset + 4);
    const size = audio.readUInt32LE(offset + 4);
    if (name === 'fmt ' && size >= 16 && offset + 24 <= audio.length) byteRate = audio.readUInt32LE(offset + 16);
    if (name === 'data') dataBytes += Math.min(size, audio.length - offset - 8);
    offset += 8 + size + (size % 2);
  }
  if (!byteRate || dataBytes / byteRate < 0.15) throw new Error('Empty or malformed WAV response');
  return dataBytes / byteRate;
}
async function main() {
  const envFile = opt('--env-file') ?? resolve(root, 'frontend/.env.local');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const meta: Meta = existsSync(outMeta) ? JSON.parse(readFileSync(outMeta, 'utf8')) : {};
  const jobs: VoiceJob[] = [];
  const add = (text: string, use: string) => jobs.push({ language: 'ar', voice: 'didou', text, uses: [use] });
  // Keep the original vocalized text as model input; normalization is only for lookup.
  for (const step of WUDU_STEPS) add(step.descAr, `lab:wudu:${step.id}`);
  for (const step of SALAT_POSTURES) add(step.descAr, `lab:salat:${step.id}`);
  for (const p of SALAT_PRAYERS) add(p.timeAr, `lab:salat:${p.id}`);
  for (const p of SALAT_PRAYERS) add(salatPrayerNarration(p), 'lab:salat:prayer-narration');
  for (const scene of [...ROAD_SCENES, ...MOSQUE_SCENES]) {
    add(scene.promptAr, 'lab:scene:prompt');
    const correct = scene.options.find(option => option.id === scene.correct);
    if (correct) add(correct.labelAr, 'lab:scene:correct-action');
  }
  for (const key of ['wuduIntro', 'wuduDone', 'salatIntro', 'salatRakahDone', 'roadIntro', 'roadLookLeft', 'roadLookRight', 'roadCross', 'roadCrossDone', 'soukIntro', 'flagsIntro', 'mosqueIntro', 'cemIntro', 'cahierIntro'] as const) add(labCopy[key], 'lab:copy:' + key);
  for (const [id, text] of Object.entries(LAB_GUIDE_HINTS)) add(text, `lab:${id}`);
  for (const [name, questions] of [['wudu', WUDU_QUIZ], ['salat', SALAT_QUIZ]] as const) {
    for (const q of questions) {
      add(q.questionAr, `lab:${name}:question:${q.id}`);
      if (q.explanationAr) add(q.explanationAr, `lab:${name}:explanation:${q.id}`);
    }
  }
  if (opt('--scope') !== 'labs') jobs.push(...collectJobs());
  const unique = new Map<string, VoiceJob>();
  for (const job of jobs) {
    const key = `${job.language}:${recordedSpeechKey(job.text)}`;
    const previous = unique.get(key);
    if (previous) previous.uses.push(...job.uses); else unique.set(key, job);
  }
  const pending = [...unique.values()].filter(job => {
    const key = recordedSpeechKey(job.text);
    if (Object.hasOwn(RECORDED_SPEECH_CATALOG[job.language] ?? {}, key)) return false;
    return !(meta[job.language]?.clips ?? []).some(clip => recordedSpeechKey(clip.texte) === key && existsSync(resolve(root, 'frontend/public/sounds/preschool', job.language, clip.fichier)) && createHash('sha256').update(readFileSync(resolve(root, 'frontend/public/sounds/preschool', job.language, clip.fichier))).digest('hex') === clip.sha256);
  });
  const limit = Number(opt('--limit') ?? Infinity);
  if (!(limit > 0)) throw new Error('--limit must be positive');
  const selected = pending.filter(job => !opt('--lang') || job.language === opt('--lang')).slice(0, limit);
  console.log(JSON.stringify({ sourceRequests: jobs.length, duplicatesAvoided: jobs.length - unique.size, uniquePhrases: unique.size, reused: unique.size - pending.length, missing: pending.length, batch: selected.length, characters: selected.reduce((sum, job) => sum + job.text.length, 0) }));
  if (!args.includes('--generate')) return;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
  const model = process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts';
  const voice = process.env.OPENAI_TTS_VOICE ?? 'cedar';
  for (const job of selected) {
    const language = job.language === 'ar' ? 'Modern Standard Arabic (fusha), accurate Arabic vowels and consonants, no dialect' : job.language === 'fr' ? 'clear natural French' : 'clear natural English';
    for (let attempt = 0; ; attempt++) {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST', signal: AbortSignal.timeout(120000),
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, voice, input: job.text, response_format: 'wav', instructions: `Read exactly the provided text in ${language}. You are Didou, a warm, patient educational guide for primary school children. Sound natural and expressive, with calm encouragement, gentle pauses and a moderate pace. No exaggerated cartoon voice, singing, music, extra words or sound effects.` }),
    });
    // Never print provider response bodies: a proxy could echo credentials.
    if (!response.ok) {
      let code = 'unknown';
      try { const body = await response.json(); code = String(body.error?.code ?? body.error?.type ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80); } catch { /* status suffices */ }
      if (response.status === 429 && code === 'rate_limit_exceeded' && attempt < 4) {
        const delay = Math.min(60, Math.max(10, Number(response.headers.get('retry-after')) || 60));
        console.log(JSON.stringify({ rateLimited: true, retryInSeconds: delay, attempt: attempt + 1 }));
        await new Promise(resolveDelay => setTimeout(resolveDelay, delay * 1000));
        continue;
      }
      throw new Error(`OpenAI speech request failed: HTTP ${response.status}, code ${code}. Completed clips are saved.`);
    }
    const audio = Buffer.from(await response.arrayBuffer());
    const duration = wavDuration(audio);
    const fichier = `openai-v2-${createHash('sha256').update(`${voice}:${job.text}`).digest('hex').slice(0, 16)}.wav`;
    const directory = resolve(root, 'frontend/public/sounds/preschool', job.language);
    mkdirSync(directory, { recursive: true });
    writeFileSync(resolve(directory, fichier), audio);
    meta[job.language] ??= { clips: [] };
    meta[job.language].clips.push({ texte: job.text, fichier, duration, sha256: createHash('sha256').update(audio).digest('hex'), voice, model, generatedAt: new Date().toISOString(), uses: job.uses, synthetic: true });
    writeFileSync(outMeta, JSON.stringify(meta, null, 2) + '\n');
    console.log(JSON.stringify({ language: job.language, fichier, duration: Math.round(duration * 100) / 100 }));
    break;
    }
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Audio generation failed'); process.exitCode = 1; });
