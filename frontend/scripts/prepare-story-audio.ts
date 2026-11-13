/** Text-only plan. Generation uses the existing V1/V2 reuse-first audio pipeline. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NARRATED_STORIES, STORY_SPEECH } from '../src/data/preschool/narratedStories';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';

const jobs = new Map<string, { texte: string; language: string; uses: string[] }>();
for (const language of ['ar', 'fr', 'en'] as const) {
  const add = (texte: string, use: string) => {
    const key = `${language}:${recordedSpeechKey(texte)}`;
    const previous = jobs.get(key);
    if (previous) previous.uses.push(use); else jobs.set(key, { texte, language, uses: [use] });
  };
  for (const activity of NARRATED_STORIES) {
    add(activity.i18n[language].promptAudio, `${activity.id}:narration`);
    for (const question of activity.narratedStory!.questions) {
      add(question.prompt[language], `${activity.id}:${question.id}`);
      for (const choice of question.choices) add(choice.label[language], `${activity.id}:choice`);
    }
  }
  for (const [name, line] of Object.entries(STORY_SPEECH)) add(line[language], `story-common:${name}`);
}
const directory = resolve('docs/audio-v1/histoires-prescolaire');
mkdirSync(directory, { recursive: true });
writeFileSync(resolve(directory, 'demande.json'), JSON.stringify([...jobs.values()], null, 2) + '\n');
console.log(JSON.stringify({ uniquePhrases: jobs.size, characters: [...jobs.values()].reduce((sum, job) => sum + job.texte.length, 0) }));
