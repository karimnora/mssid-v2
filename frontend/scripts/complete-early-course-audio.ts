/** Explicitly invoked offline production, one verified local commit per grade/subject. No push. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, mkdirSync, appendFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const execute = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directory = 'docs/audio-v1/cours-1ap-2ap/completion';
const manifest: { sections: { section: string; file: string; texts: number }[] } = JSON.parse(readFileSync(resolve(root, directory, 'manifest.json'), 'utf8'));
const tsx = resolve(root, 'frontend/node_modules/tsx/dist/cli.mjs');
const run = async (program: string, args: string[]) => (await execute(program, args, { cwd: root, maxBuffer: 4 * 1024 * 1024 })).stdout;
const script = (file: string, args: string[] = []) => run(process.execPath, [tsx, `frontend/scripts/${file}`, ...args]);
async function main() {
  if (!process.argv.includes('--generate')) throw new Error('Explicit --generate required. Plans are already frozen and V2 checked.');
  if ((await run('git', ['diff', '--cached', '--name-only'])).trim()) throw new Error('Staging area is not empty; refusing to include unrelated work.');
  mkdirSync(resolve(root, 'output/course-audio-completion'), { recursive: true });
  for (const section of manifest.sections) {
    const plan = `${directory}/${section.file}`;
    while (true) {
      const output = await script('generate-course-audio.ts', ['--plan', plan, '--limit', '24', '--concurrency', '4', '--complete-plan', '--defer-invalid', '--generate']);
      appendFileSync(resolve(root, 'output/course-audio-completion/production.log'), output);
      const summary = JSON.parse(output.split(/\r?\n/).find(line => line.startsWith('{'))!);
      console.log(JSON.stringify({ section: section.section, pendingBeforeBatch: summary.pending, produced: summary.selected, remaining: summary.pending - summary.selected }));
      if (summary.pending === 0) break;
    }
    await script('index-recorded-speech.ts');
    await script('audit-early-grade-audio.ts');
    const jobs: { texte: string }[] = JSON.parse(readFileSync(resolve(root, plan), 'utf8'));
    const meta = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1/enregistrements-cours-openai.json'), 'utf8'));
    const files = jobs.flatMap(job => {
      const clip = meta.ar.clips.find((clip: { texte: string }) => clip.texte === job.texte);
      return clip ? [`frontend/public/sounds/preschool/ar/${clip.fichier}`] : [];
    });
    if ((await run('git', ['diff', '--cached', '--name-only'])).trim()) throw new Error('Another process staged files; stopping before commit.');
    // Explicit paths only: other agents may be changing course source files in parallel.
    const paths = [...files, ...(existsSync(resolve(root, directory, 'reprises-necessaires.json')) ? [`${directory}/reprises-necessaires.json`] : []), plan, 'docs/audio-v1/enregistrements-cours-openai.json', 'docs/audio-v1/REUTILISATION-AUDIO.json',
      'frontend/src/data/recordedSpeechCatalog.ts', ...['couverture.json', 'ar-manquants.json', 'prochain-lot-ar-decoupage.json', 'prochain-lot-ar-texte-a-relire.txt'].map(file => `docs/audio-v1/cours-1ap-2ap/${file}`)];
    // Keep Windows command lines below their length limit.
    for (let i = 0; i < paths.length; i += 30) await run('git', ['add', '--', ...paths.slice(i, i + 30)]);
    await run('git', ['diff', '--cached', '--check']);
    if ((await run('git', ['diff', '--cached', '--name-only'])).trim()) {
      await run('git', ['commit', '-m', `feat(audio): record ${section.section} lesson passages with Didou`]);
      console.log(JSON.stringify({ committed: section.section, head: (await run('git', ['rev-parse', '--short', 'HEAD'])).trim() }));
    }
  }
}
main().catch(error => { console.error(error instanceof Error ? error.message.replace(/sk-[a-zA-Z0-9_-]+/g, '[REDACTED]') : 'Production stopped'); process.exitCode = 1; });
