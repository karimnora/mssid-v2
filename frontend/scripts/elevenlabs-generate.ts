/**
 * Generates missing voice clips with ElevenLabs and files them like the existing recordings, so
 * `npm run audio:index` makes speakText() play them automatically (lookup by exact text).
 *
 *   npx tsx scripts/elevenlabs-generate.ts                 → dry run: lists what is missing and the cost, sends nothing
 *   npx tsx scripts/elevenlabs-generate.ts --generate      → calls ElevenLabs (needs the env vars below)
 *   options: --lang ar|fr|en   --voice didou|didou-darija   --limit 20
 *
 * Environment (never commit them; a local, git-ignored .env.local is fine):
 *   ELEVENLABS_API_KEY            required with --generate
 *   ELEVENLABS_VOICE_AR           Didou, Arabic (fusha)
 *   ELEVENLABS_VOICE_AR_DARIJA    Didou, Algerian darija (falls back to ELEVENLABS_VOICE_AR)
 *   ELEVENLABS_VOICE_FR           Didou, French
 *   ELEVENLABS_VOICE_EN           English narrator (3AP–5AP English)
 *   ELEVENLABS_MODEL              default eleven_multilingual_v2
 *
 * Sources, deduplicated and skipped when already recorded:
 *   docs/audio-v1/REUTILISATION-AUDIO.json (pending), docs/v2-*-voix-todo.json (toRecord),
 *   docs/audio-v2/didou-phrases.json, and the 8 journey world welcomes.
 * Output: frontend/public/sounds/preschool/<lang>/v2-<hash>.mp3 and
 *         docs/audio-v1/enregistrements-v2-elevenlabs.json (same shape as the other recordings).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { JOURNEYS } from '../src/data/journey/journeyWorlds';

type Lang = 'ar' | 'fr' | 'en';
type Voice = 'didou' | 'didou-darija';
export interface VoiceJob { language: Lang; voice: Voice; text: string; uses: string[] }
interface Clip { texte: string; fichier: string; duration: number; sha256: string; voice: Voice; model: string; generatedAt: string }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_META = resolve(root, 'docs/audio-v1/enregistrements-v2-elevenlabs.json');
const readJson = (path: string) => JSON.parse(readFileSync(path, 'utf8'));
const isLang = (v: unknown): v is Lang => v === 'ar' || v === 'fr' || v === 'en';

export function collectJobs(): VoiceJob[] {
  const jobs = new Map<string, VoiceJob>();
  const add = (language: unknown, text: unknown, voice: Voice, use: string) => {
    if (!isLang(language) || typeof text !== 'string' || !text.trim()) return;
    const key = JSON.stringify([language, voice, recordedSpeechKey(text)]);
    const job = jobs.get(key) ?? { language, voice, text: recordedSpeechKey(text), uses: [] };
    job.uses.push(use);
    jobs.set(key, job);
  };
  const reuse = resolve(root, 'docs/audio-v1/REUTILISATION-AUDIO.json');
  if (existsSync(reuse)) for (const p of readJson(reuse).pending ?? []) add(p.language, p.text, 'didou', `v1:${(p.targets ?? [])[0] ?? ''}`);
  for (const file of readdirSync(resolve(root, 'docs')).filter((n) => /^v2-.*-voix-todo\.json$/.test(n))) {
    for (const item of readJson(resolve(root, 'docs', file)).toRecord ?? []) add(item.language, item.text, 'didou', file);
  }
  const phrases = resolve(root, 'docs/audio-v2/didou-phrases.json');
  if (existsSync(phrases)) for (const p of readJson(phrases).phrases ?? []) add(p.language, p.text, p.voice === 'didou-darija' ? 'didou-darija' : 'didou', p.use ?? 'didou-phrases');
  for (const [grade, worlds] of Object.entries(JOURNEYS)) {
    for (const w of worlds) {
      add('ar', w.welcome.ar, 'didou', `journey:${grade}:${w.id}`);
      add('fr', w.welcome.fr, 'didou', `journey:${grade}:${w.id}`);
    }
  }
  return [...jobs.values()];
}

function alreadyGenerated(): Record<Lang, Clip[]> {
  if (!existsSync(OUT_META)) return { ar: [], fr: [], en: [] };
  const meta = readJson(OUT_META);
  return { ar: meta.ar?.clips ?? [], fr: meta.fr?.clips ?? [], en: meta.en?.clips ?? [] };
}

export function missingJobs(jobs: VoiceJob[], generated = alreadyGenerated()): VoiceJob[] {
  return jobs.filter((job) => {
    const key = recordedSpeechKey(job.text);
    const catalog = (RECORDED_SPEECH_CATALOG as Record<string, Record<string, unknown>>)[job.language] ?? {};
    if (Object.hasOwn(catalog, key)) return false;
    return !generated[job.language].some((c) => recordedSpeechKey(c.texte) === key);
  });
}

function voiceId(job: VoiceJob): string | undefined {
  const env = process.env;
  if (job.language === 'ar') return job.voice === 'didou-darija' ? env.ELEVENLABS_VOICE_AR_DARIJA ?? env.ELEVENLABS_VOICE_AR : env.ELEVENLABS_VOICE_AR;
  return job.language === 'fr' ? env.ELEVENLABS_VOICE_FR : env.ELEVENLABS_VOICE_EN;
}

async function synthesize(job: VoiceJob, apiKey: string, model: string): Promise<Buffer> {
  const id = voiceId(job);
  if (!id) throw new Error(`No voice id for ${job.language}/${job.voice} (see the env vars at the top of this script)`);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: job.text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3 } }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

async function main() {
  try {
    process.loadEnvFile(resolve(root, 'frontend/.env.local'));
  } catch {
    /* no .env.local: rely on the shell environment */
  }
  const args = process.argv.slice(2);
  const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const generate = args.includes('--generate');
  const lang = opt('--lang');
  const voice = opt('--voice');
  const limit = Number(opt('--limit') ?? Infinity);
  let jobs = missingJobs(collectJobs()).filter((j) => (!lang || j.language === lang) && (!voice || j.voice === voice));
  jobs = jobs.slice(0, limit);
  const chars = jobs.reduce((s, j) => s + j.text.length, 0);
  const by = (k: (j: VoiceJob) => string) => jobs.reduce<Record<string, number>>((acc, j) => ((acc[k(j)] = (acc[k(j)] ?? 0) + 1), acc), {});
  console.log(JSON.stringify({ missingClips: jobs.length, characters: chars, byLanguage: by((j) => j.language), byVoice: by((j) => j.voice) }, null, 2));
  if (!generate) {
    console.log('Dry run: nothing sent to ElevenLabs. Add --generate to create the clips (about 1 credit per character).');
    return;
  }
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set');
  const model = process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2';
  const meta = existsSync(OUT_META) ? readJson(OUT_META) : {};
  for (const l of ['ar', 'fr', 'en'] as const) meta[l] ??= { clips: [] };
  let done = 0;
  for (const job of jobs) {
    const audio = await synthesize(job, apiKey, model);
    const sha256 = createHash('sha256').update(audio).digest('hex');
    const fichier = `v2-${createHash('sha1').update(`${job.voice}:${job.text}`).digest('hex').slice(0, 12)}.mp3`;
    const dir = resolve(root, 'frontend/public/sounds/preschool', job.language);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, fichier), audio);
    // mp3_44100_128 is constant bitrate: 16,000 bytes per second.
    const duration = Math.round((audio.length / 16000) * 100) / 100;
    const clip: Clip = { texte: job.text, fichier, duration, sha256, voice: job.voice, model, generatedAt: new Date().toISOString() };
    meta[job.language].clips.push(clip);
    writeFileSync(OUT_META, JSON.stringify(meta, null, 2) + '\n'); // saved after each clip: safe to stop and resume
    console.log(`${++done}/${jobs.length} ${job.language} ${job.voice} ${fichier}`);
  }
  console.log('Done. Now run: npm run audio:index');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
