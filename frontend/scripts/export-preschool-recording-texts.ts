import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRESCHOOL_MODULES } from '../src/data/preschool/index';
import type { PreschoolLanguage } from '../src/data/preschool/types';

// Export the current catalog without rewriting the child's instructions.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const destination = resolve(root, 'docs/audio-v1/prochains');
const languages: PreschoolLanguage[] = ['fr', 'ar', 'en'];
const clean = (text: string) => text.replace(/ـ/g, '').replace(/\.{2,}/g, '…').trim();
type Cue = {
  ordre: number; fichier: string; texte: string; activite: string;
  activiteId: string; moduleId: string; type: string;
};
const catalog: { dossier: string; moduleId: string; titre: string; activites: number;
  phrasesParLangue: number; motsParLangue: Record<string, number> }[] = [];
const totals: Record<string, number> = {};
mkdirSync(destination, { recursive: true });

function save(folder: string, prefix: string, cues: Cue[]) {
  mkdirSync(folder, { recursive: true });
  const names = cues.map(c => c.fichier);
  if (new Set(names).size !== names.length) throw new Error(`Duplicate filenames in ${prefix}`);
  writeFileSync(resolve(folder, `${prefix}-texte-complet.txt`), cues.map(c => c.texte).join('\n\n') + '\n', 'utf8');
  writeFileSync(resolve(folder, `${prefix}-decoupage.json`), JSON.stringify(cues, null, 2) + '\n', 'utf8');
}

const modules = PRESCHOOL_MODULES.filter(module => module.domain !== 'letters');
for (const [index, module] of modules.entries()) {
  const folderName = `${String(index + 1).padStart(2, '0')}-${module.id.replace(/^preschool-/, '')}`;
  const folder = resolve(destination, folderName);
  const wordCounts: Record<string, number> = {};
  let count = 0;
  for (const language of languages) {
    const cues: Cue[] = [];
    for (const activity of module.activities) {
      const content = activity.i18n[language];
      for (const [type, text] of [['prompt', content.promptAudio], ['success', content.successAudio]] as const) {
        if (!text) continue;
        cues.push({ ordre: cues.length + 1, fichier: `${activity.id}-${type}.mp3`, texte: clean(text),
          activite: content.title, activiteId: activity.id, moduleId: module.id, type });
      }
    }
    if (!cues.length || cues.some(cue => !cue.texte)) throw new Error(`Empty content: ${module.id}/${language}`);
    if (language !== 'fr' && cues.length !== count) throw new Error(`Unequal language coverage: ${module.id}`);
    count = cues.length;
    wordCounts[language] = cues.reduce((sum, cue) => sum + cue.texte.split(/\s+/u).length, 0);
    totals[language] = (totals[language] ?? 0) + count;
    save(folder, language, cues);
  }
  catalog.push({ dossier: folderName, moduleId: module.id, titre: module.titleI18n.fr,
    activites: module.activities.length, phrasesParLangue: count, motsParLangue: wordCounts });
}

// Small, separate recordings for the words actually spoken by listen_tap / mic echo.
// They include letter cards, whose prompts and rewards are already recorded.
const wordCounts: Record<string, number> = {};
for (const language of languages) {
  const cues: Cue[] = [];
  for (const module of PRESCHOOL_MODULES) {
    for (const activity of module.activities) {
      const add = (file: string, text: string, type: string) => cues.push({ ordre: cues.length + 1,
        fichier: file, texte: clean(text), activite: activity.i18n[language].title,
        activiteId: activity.id, moduleId: module.id, type });
      for (const card of activity.visualAssets.listenCards ?? []) {
        add(`${activity.id}-card-${card.id}.mp3`, card.label[language], 'card');
      }
      if (activity.echoWord?.[language]) add(`${activity.id}-echo.mp3`, activity.echoWord[language], 'echo');
    }
  }
  wordCounts[language] = cues.length;
  save(resolve(destination, '22-mots-cartes-et-micro'), language, cues);
}

writeFileSync(resolve(destination, 'catalogue.json'), JSON.stringify({
  scope: 'Consignes et félicitations des modules hors lettres ; cartes listen_tap et mots du micro en lot séparé.',
  modules: catalog, totalPhrasesParLangue: totals, motsCartesEtMicroParLangue: wordCounts,
}, null, 2) + '\n', 'utf8');

const table = catalog.map(item => `| ${item.dossier} | ${item.titre} | ${item.activites} | ${item.phrasesParLangue} |`).join('\n');
const recorded = modules.filter(module => module.activities.every(activity => languages.every(language => activity.i18n[language].promptAudioSrc && activity.i18n[language].successAudioSrc)));
const nextModule = modules.find(module => !recorded.includes(module));
writeFileSync(resolve(destination, 'COMMENCER-ICI.md'), `# Prochains enregistrements — préscolaire V1

Ces textes viennent du contenu actuel de l'application. Chaque dossier contient trois textes complets (fr, ar, en) et leurs plans de découpage JSON. Les rapports INTEGRATION dans le dossier parent indiquent quels lots ont déjà été enregistrés et intégrés.

Lots enregistrés dans les trois langues : ${recorded.map(module => module.titleI18n.fr).join(', ') || 'aucun'}. Prochain module : ${nextModule?.titleI18n.fr ?? 'aucun'}.

## Commencer par les quatre premiers lots

Nombres de zéro à cinq, nombres de six à dix, formes, puis couleurs. Ensuite suivre les dossiers dans l'ordre. Un MP3 par dossier et par langue permet de contrôler et refaire un petit lot facilement.

## Dans ElevenLabs

1. Ouvrir le fichier \`fr-texte-complet.txt\`, \`ar-texte-complet.txt\` ou \`en-texte-complet.txt\` du lot choisi.
2. Copier uniquement son contenu. Garder les paragraphes et l'ordre, sans ajouter de titre ni de numéro.
3. Utiliser Léa pour le français, Asmaa pour l'arabe et Quentin pour l'anglais, avec les mêmes réglages que les lettres. Débit calme, ton chaleureux, sans musique.
4. Préserver une petite pause entre les paragraphes. Si la limite de l'outil impose plusieurs générations, couper entre deux paragraphes et conserver leur ordre.
5. Nommer le résultat avec le dossier et la langue : par exemple \`01-numbers-0-5-fr.mp3\`. Pour plusieurs parties : \`…-fr-partie-01.mp3\`, \`…-fr-partie-02.mp3\`.
6. Fournir les MP3 pour le découpage et l'intégration. Les JSON servent à repérer les extraits ; ne pas les faire lire par la voix.

Pour l'arabe, conserver les voyelles présentes et écouter les noms des nombres et les accords. Les consignes correspondent aux gestes réels de l'activité : ne pas supprimer les quantités ou les indications « j'ai fini ».

## Lots

| Dossier | Module | Activités | Phrases par langue |
| --- | --- | ---: | ---: |
${table}

Total hors lettres : **${modules.reduce((sum, module) => sum + module.activities.length, 0)} activités, ${totals.fr} phrases par langue**, soit ${(totals.fr ?? 0) * 3} extraits futurs.

## Mots des cartes et du micro

Le dossier \`22-mots-cartes-et-micro\` contient ${wordCounts.fr} mots ou courtes expressions par langue, séparés des consignes. Il inclut aussi les cartes des lettres. Lire chaque paragraphe isolément et laisser une pause nette. Ces extraits demanderont leur propre raccordement dans les composants après réception des voix.

## Périmètre

Le lot des petites sourates contient uniquement les consignes et les félicitations. La récitation Warsh professionnelle déjà utilisée par l'app reste séparée.

Ces exports ne couvrent pas les missions dynamiques des mini-jeux libres, les messages techniques de l'interface ni les cours 1AP–5AP. Les audios des lettres déjà intégrés restent en place. Si un texte de cours change avant l'enregistrement, relancer l'export pour garder le texte et l'activité synchronisés.

Export reproductible depuis frontend : \`node --import tsx scripts/export-preschool-recording-texts.ts\`.
`, 'utf8');
console.log(JSON.stringify({ modules: modules.length, phrasesParLangue: totals, motsCartesEtMicroParLangue: wordCounts, destination }, null, 2));
