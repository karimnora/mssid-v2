/** Read-only inventory of the exact published catalog. No AI/API calls or content mutations. */
import { COURSES_DATA } from '../src/data/coursesData';
import { RECORDED_SPEECH_CATALOG } from '../src/data/recordedSpeechCatalog';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
const root = path.resolve(import.meta.dirname, '../..');
const out = path.resolve(process.argv[2] ?? path.join(root, 'docs/design/audit-5ap'));
const normalize = (s: string) => s.normalize('NFC').replace(/[\u064b-\u065f\u0670]/g, '').replace(/[أإآ]/g, 'ا').replace(/\s+/g, ' ').trim();
const banks = new Set<string>();
for (const file of ['villagePilotVoices.ts', 'sharedDidouVoices.ts']) {
    const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, 'frontend/src/components/lessonViewer', file), 'utf8'), ts.ScriptTarget.Latest, true);
    const visit = (node: ts.Node) => { if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'text' && ts.isStringLiteral(node.initializer))
        banks.add(recordedSpeechKey(node.initializer.text)); ts.forEachChild(node, visit); };
    visit(source);
}
const lessons = COURSES_DATA.filter(l => l.grade === '5AP');
const rows = lessons.map(l => {
    const exercises = [...(l.progressiveExercises ?? []), ...(l.evaluationExercises ?? [])];
    const ids = exercises.map(e => e.id);
    const lang = l.subject === 'french' ? 'fr' : l.subject === 'english' ? 'en' : 'ar';
    const readTexts = [l.summaryAr, ...l.rulesAr, ...exercises.flatMap(e => [e.problemAr, ...(e.hintsAr ?? [])])].filter(Boolean);
    const recorded = readTexts.filter(text => RECORDED_SPEECH_CATALOG[lang]?.[recordedSpeechKey(text)] || (l.id === 'math-5ap-fractions' && banks.has(recordedSpeechKey(text)))).length;
    const issues = [...(!l.summaryAr?.trim() ? ['Résumé vide'] : []), ...(!l.rulesAr.length ? ['Règles vides'] : []), ...(!l.quiz.length ? ['Quiz vide'] : []), ...(new Set(ids).size !== ids.length ? ['Identifiants exercices répétés'] : []), ...l.quiz.filter(q => q.options.filter(o => o.isCorrect).length !== 1).map(q => 'QCM à vérifier : ' + q.id), ...(!l.sourceReference ? ['Référence absente'] : []), ...(l.trimester && /trimestre non renseigné|trimestre.*non détaillé|تُرك غير محدد/i.test((l.sourceReference ?? '') + ' ' + (l.sourceNoteAr ?? '')) ? ['Trimestre renseigné malgré une note disant non confirmé'] : []), ...(l.sourceType === 'secondary_corroboration' ? ['Source secondaire, non validation officielle'] : [])];
    return { id: l.id, title: l.titleAr, subject: l.subject, trimester: l.trimester ?? null, sourceType: l.sourceType ?? 'unknown', sourceReference: l.sourceReference ?? null, contentSource: l.contentSource, exercises: exercises.length, quiz: l.quiz.length, interactiveTool: l.interactiveTool ?? null, simulation: l.gameplay_simulation?.type ?? null, recordedExact: recorded, spokenTextsChecked: readTexts.length, issues };
});
const source = { title: 'Ministère de l’Éducation nationale - مناهج مرحلة التعليم الابتدائي (2016)', url: 'https://eddirasa.com/wp-content/uploads/2018/03/primaire_gen2-manahij.pdf', hosting: 'Copie sur un hébergeur tiers ; auteur ministériel identifié sur la couverture et les pages. Pas une publication du site du ministère.', pages: [68, 69, 73], verification: 'Page 68 inspectée visuellement ; pages 69 et 73 lues. Ne certifie pas les mises à jour 2026 ni toute la progression annuelle.' };
const topics = [
    { label: 'Nombres jusqu’au milliard et décimaux', terms: ['المليار', 'العشرية'], pages: [68] },
    { label: 'Opérations et calcul', terms: ['الجمع', 'القسمة'], pages: [68] },
    { label: 'Proportionnalité, pourcentage et échelle', terms: ['التناسبية', 'النسبة المئوية', 'المقياس'], pages: [69, 73] },
    { label: 'Données organisées et représentations', terms: ['المعطيات', 'جداول'], pages: [69, 73] },
    { label: 'Géométrie et grandeurs', terms: ['التناظر', 'المساحة', 'الحجوم'], pages: [69, 73] },
].map(t => ({ ...t, candidates: lessons.filter(l => l.subject === 'math' && t.terms.some(term => normalize(JSON.stringify(l)).includes(normalize(term)))).map(l => l.id), status: 'Rapprochement lexical à relire, pas validation de la leçon' }));
const priorityIds = ['math-5ap-large-numbers', 'math-5ap-decimals', 'math-5ap-operations', 'math-5ap-division', 'math-5ap-proportionality-ruleofthree', 'math-5ap-percentage-scale', 'math-5ap-perimeters-areas', 'math-5ap-durations', 'arabic-5ap-sentence-components', 'arabic-5ap-integration-writing'];
const reasons = ['Valeur de position ; moteur numération', 'Lien fraction/décimal ; droite et numération', 'Retenues et justification ; problème en deux colonnes', 'Quotient/reste et interprétation', 'Transfert et raisonnement multiplicatif', 'Pourcentage/échelle à faire relire avant scénarisation', 'Unités et distinction périmètre/surface', 'Unités de temps et problème contextualisé', 'Identifier la structure et justifier l’analyse', 'Production écrite et critères explicites'];
const priorities = priorityIds.map((id, i) => { const row = rows.find(l => l.id === id); if (!row)
    throw Error('Leçon prioritaire absente : ' + id); return { ...row, reason: reasons[i], decision: 'Sélection validée par Karim le 7 novembre 2026 ; application après retours familles' }; });
fs.mkdirSync(out, { recursive: true });
const catalogHash = crypto.createHash('sha256').update(JSON.stringify(lessons)).digest('hex');
const report = { catalogHash, scope: 'Toutes les leçons 5AP du catalogue publié, après les transformations existantes', source, limitations: ['Inventaire structurel, pas correction automatique des réponses ni validation pédagogique.', 'Le document de 2016 mentionne le milliard page 68 mais le million page 73 : différence à arbitrer avec le guide 5AP et un enseignant, sans modifier automatiquement les cours.', 'Audio : correspondance exacte du catalogue et banques du pilote seulement ; les autres lectures peuvent utiliser la synthèse locale. Absence de correspondance ne signifie pas bouton muet.', 'Comparaison officielle partielle des axes mathématiques. Autres matières, détails des fractions et programmes de langues actualisés : non vérifiés dans ce lot.', 'Le pilote fractions existe déjà ; il ne fait pas partie des dix extensions proposées.'], topics, priorities, lessons: rows };
fs.writeFileSync(path.join(out, 'audit.json'), JSON.stringify(report, null, 2) + '\n');
const safe = (s: unknown) => String(s ?? '—').replace(/\|/g, '/').replace(/\n/g, ' ');
const table = (headers: string[], data: unknown[][]) => ['| ' + headers.join(' | ') + ' |', '| ' + headers.map(() => '---').join(' | ') + ' |', ...data.map(row => '| ' + row.map(safe).join(' | ') + ' |')].join('\n');
const md = ['# Audit 5AP - inventaire réel et sélection validée', `Catalogue : ${rows.length} leçons ; empreinte ${catalogHash}. Aucun cours modifié.`, ...report.limitations.map(l => '- ' + l), '## Répartition du catalogue', table(['Matière', 'Leçons', 'Comparaison officielle'], [...new Set(rows.map(r => r.subject))].map(subject => [subject, rows.filter(r => r.subject === subject).length, subject === 'math' ? 'Axes partiellement rapprochés' : 'Non vérifiée dans ce lot'])), '## Source du rapprochement', `[${source.title}](${source.url}) - ${source.hosting} ${source.verification}`, '## Comparaison partielle au programme', table(['Axe', 'Pages PDF', 'Leçons candidates'], topics.map(t => [t.label, t.pages.join(', '), t.candidates.join(', ') || 'Aucune candidate trouvée ; vérifier manuellement'])), '## Dix extensions validées par Karim - application après retours familles', table(['Ordre', 'Identifiant réel', 'Titre', 'Pourquoi'], priorities.map((p, i) => [i + 1, p.id, p.title, p.reason])), '## Inventaire complet', table(['ID', 'Matière / trimestre', 'Exercices / quiz', 'Audio exact / textes contrôlés', 'Outil déclaré', 'Points à relire'], rows.map(l => [l.id, l.subject + ' / ' + (l.trimester ?? '?'), l.exercises + ' / ' + l.quiz, l.recordedExact + ' / ' + l.spokenTextsChecked, l.interactiveTool ?? 'aucun', l.issues.join('; ') || 'Aucune anomalie structurelle détectée ; pédagogie à relire']))].join('\n\n');
fs.writeFileSync(path.join(out, 'README.md'), md + '\n');
console.log(JSON.stringify({ lessons: rows.length, priorities: priorities.length, lessonsToReview: rows.filter(r => r.issues.length).length, out }));
