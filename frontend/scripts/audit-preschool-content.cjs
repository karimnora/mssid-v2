/** Read-only preschool catalog audit: quantities are definitions, not tested learning outcomes. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const req = require('tsx/cjs/api').require;
const { PRESCHOOL_MODULES: modules } = req('../src/data/preschool/index.ts', __filename);
const { GAMES: games } = req('../src/components/preschool/gamesHubCatalog.ts', __filename);
const { findRecordedSpeech } = req('../src/utils/recordedSpeech.ts', __filename);
const { getPrintableWorksheets } = req('../src/data/preschool/printablesData.ts', __filename);
const out = path.resolve(process.argv[2] || path.join(root, 'docs/design/audit-prescolaire/inventory.json'));
const languages = ['ar', 'fr', 'en'];
const activities = modules.flatMap(m => m.activities);
const countBy = (rows, field) => rows.reduce((all, row) => { all[row[field]] = (all[row[field]] || 0) + 1; return all; }, {});
const checkFile = src => !src ? 'synthesis' : /^https?:/.test(src) ? 'external-unverified' : fs.existsSync(path.join(root, 'frontend/public', src)) ? 'present' : 'broken';
const audio = Object.fromEntries(languages.map(language => {
  const rows = activities.map(activity => {
    const c = activity.i18n[language];
    const prompt = c.promptAudioSrc || findRecordedSpeech(c.promptAudio, language)?.src;
    const success = c.successAudioSrc || (c.successAudio && findRecordedSpeech(c.successAudio, language)?.src);
    return { id: activity.id, promptStatus: checkFile(prompt), successStatus: c.successAudio ? checkFile(success) : 'not-declared' };
  });
  const missing = new Map();
  for (const activity of activities) for (const field of ['prompt', 'success']) {
    const c = activity.i18n[language], text = c[field + 'Audio'];
    if (!text) continue;
    const src = c[field + 'AudioSrc'] || findRecordedSpeech(text, language)?.src;
    if (checkFile(src) === 'present') continue;
    const key = text.normalize('NFC').replace(/\s+/g, ' ').trim();
    const entry = missing.get(key) || { text: key, references: [] };
    entry.references.push({ activityId: activity.id, field }); missing.set(key, entry);
  }
  return [language, { prompts: countBy(rows, 'promptStatus'), successes: countBy(rows, 'successStatus'), uniqueTextsToReview: missing.size, textsToReview: [...missing.values()] }];
}));
const staticArrays = {};
for (const name of ['CarMazeGame','FarmGame','BalloonPopGame','FruitCatcherGame','ShapeSorterGame','DressDidoGame','LittleFisherGame','PuzzleGame','PreschoolMagicBoard','PreschoolXylophone','PreschoolSoundBox']) {
  const file = path.join(root, 'frontend/src/components/preschool', name + '.tsx');
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = {};
  const visit = node => { if (ts.isVariableDeclaration(node) && node.initializer && ts.isArrayLiteralExpression(node.initializer)) found[node.name.getText(source)] = node.initializer.elements.length; ts.forEachChild(node, visit); };
  visit(source); staticArrays[name] = found;
}
const checks = [];
for (const module of modules) {
  if (module.totalSteps !== module.activities.length) checks.push({ id: module.id, issue: 'Step-count mismatch' });
  for (const activity of module.activities) for (const language of languages) {
    const c = activity.i18n[language];
    if (!c?.promptAudio?.trim()) checks.push({ id: activity.id, language, issue: 'Empty instruction' });
    const choices = c?.choices || activity.visualAssets.choices;
    if (['tap_choice','sequence'].includes(activity.interactionType) && choices && choices.filter(c => c.isCorrect).length !== 1) checks.push({ id: activity.id, language, issue: 'Choice correctness needs review' });
  }
}
const sheets = Object.fromEntries(languages.map(language => [language, { count: getPrintableWorksheets(language).length, categories: countBy(getPrintableWorksheets(language), 'category') }]));
const result = {
  catalogHash: crypto.createHash('sha256').update(JSON.stringify(modules)).digest('hex'),
  scope: 'Published catalog definitions, explicit files plus runtime exact-lookup audio fallback. Not a clinical or learning-efficacy evaluation.',
  moduleCount: modules.length, activityCount: activities.length, uniqueActivityIds: new Set(activities.map(a => a.id)).size,
  modules: modules.map(m => ({ id: m.id, title: m.titleI18n.fr, domain: m.domain, activities: m.activities.length, interactions: countBy(m.activities, 'interactionType') })),
  interactions: countBy(activities, 'interactionType'), domains: countBy(activities, 'domain'),
  games: games.map(g => ({ id: g.id, title: g.titleFr, declaredLevels: g.maxLevels })), totalDeclaredGameLevels: games.reduce((n, g) => n + g.maxLevels, 0),
  printables: sheets, audio, staticArrays, structuralChecks: checks,
  limits: ['Translations are not additional unique activities.', 'Catalog activities, game levels, drawing templates and paper worksheets overlap and must not be added as a unique activity total.', 'File presence does not establish pronunciation quality.', 'No game was played by a real child for this audit.']
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ modules: result.moduleCount, activities: result.activityCount, gameLevels: result.totalDeclaredGameLevels, sheets: sheets.ar.count, structuralIssues: checks.length, uniqueMissingTexts: Object.fromEntries(languages.map(l => [l, audio[l].uniqueTextsToReview])) }));
