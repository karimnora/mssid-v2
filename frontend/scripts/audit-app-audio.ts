/** Read-only audit: existing assets, connections, known fixed speech and V2 reuse. No generation. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { PRESCHOOL_MODULES } from '../src/data/preschool';
import { DIDOU_DIALOGUES_AR, DIDOU_DIALOGUES_FR } from '../src/data/outfitsData';
import { PRONUNCIATION_MODELS } from '../src/data/pronunciationModels';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { findRecordedSpeechSequence } from '../src/utils/recordedSpeech';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { discoverV2Root, loadRecordingLibrary } from './v2-recording-library';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'docs/audits/audio-2026-11-13');
const publicRoot = resolve(root, 'frontend/public');
const v2 = loadRecordingLibrary(discoverV2Root(root));
const normalize = recordedSpeechKey;
const clean = (text: string) => text.replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u200D\uFE0F\u20E3]/gu, ' ').replace(/\s+/g, ' ').trim();
const metadataBySrc = new Map<string, Set<string>>();
const integrity: { src: string; valid: boolean }[] = [];
for (const file of readdirSync(resolve(root, 'docs/audio-v1')).filter(file => /^enregistrements-.*\.json$/.test(file))) {
  const data = JSON.parse(readFileSync(resolve(root, 'docs/audio-v1', file), 'utf8'));
  for (const language of ['ar', 'fr', 'en']) for (const clip of data[language]?.clips ?? []) {
    const src = `/sounds/preschool/${language}/${clip.fichier}`;
    const texts = metadataBySrc.get(src) ?? new Set<string>(); texts.add(normalize(clip.texte)); metadataBySrc.set(src, texts);
    const path = resolve(publicRoot, src.slice(1));
    integrity.push({ src, valid: existsSync(path) && clip.duration > 0 && createHash('sha256').update(readFileSync(path)).digest('hex') === clip.sha256 });
  }
}
const missing: { zone: string; language: string; text: string; use: string; v2Src?: string; v2Voice?: string }[] = [];
const knownSpeech: { zone: string; language: string; text: string; use: string; recorded: boolean }[] = [];
function checkSpeech(zone: string, language: string, text: string, use: string) {
  const spoken = clean(text); if (!spoken) return;
  const recorded = !!findRecordedSpeechSequence(spoken, language);
  knownSpeech.push({ zone, language, text: spoken, use, recorded });
  if (!recorded) {
    const recording = v2.find(spoken, language);
    missing.push({ zone, language, text: spoken, use, v2Src: recording ? `/sounds/preschool/${recording.language}/${recording.clip.fichier}` : undefined, v2Voice: recording?.clip.voice });
  }
}
const preschool: { module: string; activity: string; language: string; slot: string; recorded: boolean; mismatched: boolean }[] = [];
for (const module of PRESCHOOL_MODULES) for (const activity of module.activities) for (const language of ['ar', 'fr', 'en'] as const) {
  const content = activity.i18n[language];
  for (const slot of ['prompt', 'success'] as const) {
    const text = slot === 'prompt' ? content.promptAudio : content.successAudio;
    if (!text) continue;
    const src = slot === 'prompt' ? content.promptAudioSrc : content.successAudioSrc;
    const effective = src ?? findRecordedSpeechSequence(clean(text), language)?.[0]?.src;
    const expected = metadataBySrc.get(src ?? '');
    // Earlier letter recordings intentionally replaced printed ".." by the ellipsis glyph.
    // Report only real textual disagreements; never discard vowel marks for this comparison.
    const comparable = normalize(text).replaceAll('..', '…');
    const mismatched = !!src && ![...expected ?? []].some(recorded => recorded.replaceAll('..', '…') === comparable);
    preschool.push({ module: module.id, activity: activity.id, language, slot, recorded: !!effective && existsSync(resolve(publicRoot, effective.slice(1))), mismatched });
    if (!effective) checkSpeech('preschool', language, text, `${module.id}:${activity.id}:${slot}`);
  }
}
for (const [language, dialogues] of [['ar', DIDOU_DIALOGUES_AR], ['fr', DIDOU_DIALOGUES_FR]] as const) dialogues.forEach((text, index) => checkSpeech('didou', language, text, `dialogue-${index}`));
for (const language of ['fr', 'en'] as const) for (const model of PRONUNCIATION_MODELS[language]) checkSpeech('pronunciation-models', language, model.text, model.id);

const sources: string[] = [];
function walk(directory: string) { for (const entry of readdirSync(directory, { withFileTypes: true })) { const path = resolve(directory, entry.name); if (entry.isDirectory()) walk(path); else if (/\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name)) sources.push(path); } }
walk(resolve(root, 'frontend/src'));
const assetReferences = new Map<string, string[]>();
const speechCalls: { file: string; line: number; language: string; fixedText: boolean; wrapper: string }[] = [];
for (const file of sources) {
  if (file.endsWith('recordedSpeechCatalog.ts')) continue;
  const code = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const imports = new Set<string>();
  for (const node of source.statements) if (ts.isImportDeclaration(node) && /utils\/speech$/.test((node.moduleSpecifier as ts.StringLiteral).text)) {
    const bindings = node.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) for (const item of bindings.elements) if ((item.propertyName ?? item.name).text === 'speakText') imports.add(item.name.text);
  }
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) && /^\/sounds\/.+\.(mp3|ogg|wav)$/.test(node.text)) {
      const refs = assetReferences.get(node.text) ?? []; refs.push(relative(root, file).replaceAll('\\', '/')); assetReferences.set(node.text, refs);
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && imports.has(node.expression.text)) {
      const input = node.arguments[0]; const languageNode = node.arguments[1];
      const language = languageNode && ts.isStringLiteralLike(languageNode) ? languageNode.text : languageNode ? 'dynamic' : 'fr-FR (default)';
      const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const fixedText = !!input && ts.isStringLiteralLike(input);
      speechCalls.push({ file: relative(root, file).replaceAll('\\', '/'), line, language, fixedText, wrapper: node.expression.text });
      if (fixedText && language !== 'dynamic') checkSpeech('fixed-source-call', language.split(' ')[0], (input as ts.StringLiteralLike).text, `${relative(root, file)}:${line}`);
    }
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'textEn' && ts.isStringLiteralLike(node.initializer) && file.endsWith('EnglishAudioDialoguesLab.tsx')) checkSpeech('english-dialogues', 'en', node.initializer.text, `${relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    if (ts.isPropertyAssignment(node) && ['textSupportFr', 'audioText'].includes(node.name.getText(source)) && ts.isStringLiteralLike(node.initializer) && file.endsWith('FrenchProjectsLabInteractive.tsx')) checkSpeech('french-projects', 'fr', node.initializer.text, `${relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const brokenReferences = [...assetReferences].filter(([src]) => !existsSync(resolve(publicRoot, src.slice(1)))).map(([src, files]) => ({ src, files }));
const soundBoxCode = readFileSync(resolve(root, 'frontend/src/components/preschool/PreschoolSoundBox.tsx'), 'utf8');
const soundBox = [...soundBoxCode.matchAll(/soundKey:\s*'([^']+)'/g)].map(([, key]) => ({ key, mp3: existsSync(resolve(publicRoot, `sounds/box/${key}.mp3`)), ogg: existsSync(resolve(publicRoot, `sounds/box/${key}.ogg`)) }));
const summary = {
  sourceFilesInspected: sources.length, catalogTexts: Object.fromEntries(Object.entries(RECORDED_SPEECH_CATALOG).map(([language, rows]) => [language, Object.keys(rows).length])),
  integrityEntriesChecked: integrity.length, integrityErrors: integrity.filter(row => !row.valid).length,
  localAssetReferences: assetReferences.size, brokenReferences: brokenReferences.length,
  preschool: { modules: PRESCHOOL_MODULES.length, activities: PRESCHOOL_MODULES.reduce((sum, module) => sum + module.activities.length, 0),
    byLanguage: ['ar', 'fr', 'en'].map(language => ({ language, slots: preschool.filter(row => row.language === language).length, recorded: preschool.filter(row => row.language === language && row.recorded).length, mismatches: preschool.filter(row => row.language === language && row.mismatched).length })) },
  soundBox: { items: soundBox.length, missing: soundBox.filter(row => !row.mp3 && !row.ogg).length },
  speechCalls: speechCalls.length, fixedRequestsAudited: knownSpeech.length, fixedRequestsWithoutRecordings: missing.length,
  v2ReusableRequests: missing.filter(row => row.v2Src).length,
};
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'connections.json'), JSON.stringify({ summary, brokenReferences, integrityErrors: integrity.filter(row => !row.valid), preschool, soundBox, speechCalls, knownSpeech, missing }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (summary.integrityErrors || summary.brokenReferences || summary.soundBox.missing) process.exitCode = 1;
