/** Read-only audit. Writes reports only; no network, no content generation. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { COURSES_DATA } from '../src/data/coursesData';
import { auditMusaidiCoverage } from './lib/musaidiCoverage';
const root=path.resolve(import.meta.dirname,'../..');
const out=path.resolve(process.argv[2] ?? path.join(root,'docs/design/musaidi-lot3'));
fs.mkdirSync(out,{recursive:true});
const scenarios=[auditMusaidiCoverage(COURSES_DATA,false),auditMusaidiCoverage(COURSES_DATA,true)];
const full=scenarios[0];
const previous=JSON.parse(fs.readFileSync(path.join(root,'docs/design/audit-5ap/audit.json'),'utf8')) as {priorities:{id:string;reason:string;decision:string}[]};
const extensions=previous.priorities.map(p=>({...p,coverage:full.rows.find(r=>r.id===p.id)??null}));
const rank=(r:typeof full.rows[number])=>r.subject==='math'&&r.grade==='5AP'?0:r.subject==='math'&&r.grade==='4AP'?1:r.grade==='5AP'&&r.subject==='arabic'?2:3;
const gaps=full.rows.filter(r=>r.questions===0||r.withFullHelp<r.questions||r.withApplicableGuide<r.questions||r.withExactCompetence<r.questions).sort((a,b)=>rank(a)-rank(b)||a.grade.localeCompare(b.grade)||a.subject.localeCompare(b.subject)||(a.trimester??4)-(b.trimester??4)||a.id.localeCompare(b.id)).map(r=>({...r,missingHints:r.questions-r.withHint,missingRules:r.questions-r.withRule,missingDetailedCorrections:r.questions-r.withDetailedCorrection,missingGuides:r.questions-r.withApplicableGuide,missingCompetenceLinks:r.questions-r.withExactCompetence}));
const report={catalogHash:crypto.createHash('sha256').update(JSON.stringify(COURSES_DATA)).digest('hex'),scope:'Catalogue local après transformations, même filtre curriculumReviewGate que App.tsx. État distant du réglage non interrogé.',definitions:{question:'Une entrée réellement produite par buildMusaidiBank ; quiz et exercices progressifs uniquement.',detailedCorrection:'Au moins une étape non vide distincte de la réponse finale. Présence structurelle, pas validation pédagogique.',rule:'Au moins une règle non vide dans la leçon ; commune à toutes ses questions.',guidedCompetence:'Compétence distincte renvoyée par guidedHelpForLesson, réellement accessible dans cette leçon.',applicableGuide:'Même sélection que MusaidiPanel : compétence explicite de la question ou méthode unique de la leçon.',exclusions:'Exercices d’évaluation exclus, comme dans la banque actuelle. Brouillons non vérifiés exclus uniquement dans le scénario gate=true.'},scenarios,extensions,gaps};
fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(report,null,2)+'\n');
const table=(headers:string[],rows:unknown[][])=>[headers,...rows].map((r,n)=>'| '+r.map(v=>String(v??'—').replaceAll('|','/').replaceAll('\n',' ')).join(' | ')+' |'+(n===0?'\n| '+headers.map(()=>'---').join(' | ')+' |':'')).join('\n');
const summary=(s:typeof full)=>table(['Classe','Matière','Leçons','Questions','Indice','Règle','Correction détaillée','Les trois','Compétences guidées / liées','Questions avec guide'],s.groups.map(g=>[g.grade,g.subject,g.lessons,g.questions,g.withHint,g.withRule,g.withDetailedCorrection,g.withFullHelp,`${g.guidedCompetences} / ${g.mappedCompetences}`,g.withApplicableGuide]));
fs.writeFileSync(path.join(out,'README.md'),[
'# Audit مساعدي — lot 3',
'Aucun contenu pédagogique ni écran modifié par cet audit. Empreinte SHA-256 : `'+report.catalogHash+'`.',
'## Méthode',report.scope,'Le réglage vaut false par défaut dans le code ; une configuration distante peut le remplacer. Les deux scénarios sont donc calculés, sans annoncer un état de production non vérifié.',...Object.entries(report.definitions).map(([k,v])=>`- **${k}** : ${v}`),
'## Catalogue avec filtre de vérification désactivé',`${full.lessons} leçons ; ${full.questions} questions.`,summary(full),
'## Catalogue avec filtre de vérification activé',`${scenarios[1].lessons} leçons ; ${scenarios[1].questions} questions.`,summary(scenarios[1]),
'## Dix leçons de l’audit 5AP précédent',
'Attention : la sélection comprend huit leçons de maths et deux d’arabe. Ce ne sont pas dix leçons de maths. Elle prévoyait une application après les retours familles ; cet audit ne déclare pas cette condition satisfaite.',
table(['Leçon','Questions','Indice','Règle','Correction','Guide applicable','Règles / formules disponibles'],extensions.map(p=>[p.id,p.coverage?.questions,p.coverage?.withHint,p.coverage?.withRule,p.coverage?.withDetailedCorrection,p.coverage?.withApplicableGuide,`${p.coverage?.hasRules?'oui':'non'} / ${p.coverage?.keyFormulas??0}`])),
'## Détail et reproductibilité','`audit.json` contient chaque leçon, les manques et les deux scénarios ; `lecons.csv` est le tableau exportable. Relancer depuis frontend : `node node_modules/tsx/dist/cli.mjs scripts/audit-musaidi-coverage.ts`.',
'Les volumes ne certifient ni la justesse, ni la pertinence d’un indice, ni la conformité au programme. Aucune capture mobile supplémentaire : le lot ne change pas l’interface.'
].join('\n\n')+'\n');
const fields=['id','grade','subject','trimester','questions','withHint','withRule','withDetailedCorrection','withFullHelp','withApplicableGuide','withExactCompetence','skippedQuestions'] as const;
fs.writeFileSync(path.join(out,'lecons.csv'),[fields.join(','),...full.rows.map(r=>fields.map(f=>JSON.stringify(r[f])).join(','))].join('\n')+'\n');
const math5=full.groups.find(g=>g.grade==='5AP'&&g.subject==='math')!;
const math4=full.groups.find(g=>g.grade==='4AP'&&g.subject==='math')!;
const mathPriorities=extensions.filter(p=>p.coverage?.subject==='math');
fs.writeFileSync(path.join(out,'PRIORITES.md'),[
'# Manques prioritaires — à valider avant rédaction',
'## 1. Maths 5AP',
`${math5.lessons} leçons et ${math5.questions} questions : ${math5.questions-math5.withHint} indices manquants, aucune question avec méthode guidée accessible. Les règles et une étape de correction sont présentes sur toutes les questions ; cela ne certifie pas leur qualité pédagogique.`,
'Proposition : compléter les indices manquants et créer les méthodes des huit leçons de maths de la sélection 5AP précédente, à partir de leurs règles et formules existantes. Les deux autres leçons de cette sélection sont en arabe et doivent être traitées séparément ; ne pas les présenter comme dix méthodes de maths.',
table(['Ordre','Leçon proposée','Questions','Indices manquants','Formules existantes'],mathPriorities.map((p,i)=>[i+1,p.id,p.coverage!.questions,p.coverage!.questions-p.coverage!.withHint,p.coverage!.keyFormulas])),
'Les fractions ne figurent pas dans ces huit extensions : elles étaient déjà le pilote visuel. Elles restent néanmoins sans méthode dans guidedMath et figurent dans l’inventaire des manques.',
'La leçon `math-5ap-symmetry-solides` a deux compétences liées mais aucune de ses douze questions n’a de liaison précise dans la banque. Il faut attribuer ces questions à la compétence réellement travaillée après relecture, plutôt que de choisir automatiquement.',
'## 2. Maths 4AP',
`${math4.lessons} leçons et ${math4.questions} questions : ${math4.questions-math4.withHint} indices manquants, aucune compétence liée et aucun guide.`,
'Proposition : établir et faire relire les liens leçon → compétence, puis compléter les indices, avant d’ajouter des méthodes. Sans ces liens, les suggestions personnalisées et les questions jumelles ne peuvent pas couvrir ces leçons de façon fiable.',
'## Détail des questions à compléter en maths 5AP puis 4AP',
table(['Classe','Leçon','Questions sans indice','Questions sans compétence précise'],gaps.filter(r=>r.subject==='math'&&['5AP','4AP'].includes(r.grade)).map(r=>[r.grade,r.id,r.missingHintQuestionIds.join(', ')||'aucune',r.missingCompetenceQuestionIds.length])),
'## 3. Autres classes et matières',
'La couverture complète est fournie dans README.md, audit.json et lecons.csv. Traiter les autres manques après les maths 5AP puis 4AP. L’absence de méthode en arabe ne justifie pas de réutiliser une méthode de maths.',
'## Publication : point à clarifier',
`Avec curriculumReviewGate activé, ${scenarios[1].lessons} leçons restent visibles dans ce catalogue local. Aucun statut official_verified n’est présent. C’est un constat de métadonnées, pas une preuve que tout le contenu est faux. L’état du réglage distant n’a pas été interrogé et aucun réglage n’a été modifié.`,
'## Validation demandée',
'Valider cette priorité avant de rédiger : indices et huit méthodes de maths 5AP ; puis liens de compétences et indices de maths 4AP. Les autres guides 5AP, dont fractions, viennent ensuite. Les deux leçons d’arabe sont un travail distinct.',
'Règle source : docs/v2-todo-tuteur-musaidi.md, lot 3 : « à faire valider par Karim avant d’écrire du contenu ». L’audit 5AP précédent conditionne par ailleurs ses extensions aux retours familles ; leur achèvement n’est pas présumé.',
'## Vérification',
'Le script ne modifie aucun énoncé, indice, correction, règle ou XP. Cinq tests couvrent le filtre de publication, les entrées invalides, les règles vides, les réponses répétées et les guides réellement accessibles. Le contrôle TypeScript final est rapporté dans le chat.'
].join('\n\n')+'\n');
console.log(JSON.stringify({out,catalogHash:report.catalogHash,scenarios:scenarios.map(s=>({gate:s.curriculumReviewGate,lessons:s.lessons,questions:s.questions})),priorityGroups:full.groups.filter(g=>g.subject==='math'&&['5AP','4AP'].includes(g.grade)),extensions:extensions.map(p=>({id:p.id,hasRules:p.coverage?.hasRules,formulas:p.coverage?.keyFormulas}))},null,2));
