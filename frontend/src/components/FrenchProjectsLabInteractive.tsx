import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from './ui';
import { speakText } from '../utils/speech';
import {
  Languages,
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Layers,
  FileText,
  HelpCircle,
  PenTool,
} from 'lucide-react';
import { PrimaryGrade } from '../types';

interface FrenchProjectsLabInteractiveProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

interface FrenchProject {
  id: string;
  grade: PrimaryGrade;
  projectNumber: number;
  titleFr: string;
  titleAr: string;
  themeFr: string;
  objectiveFr: string;
  sequences: {
    number: number;
    titleFr: string;
    textSupportFr: string;
    vocabList: { wordFr: string; meaningAr: string; audioText: string }[];
    grammarRuleFr: string;
    conjugationRuleFr: string;
    productionTaskFr: string;
  }[];
}

/** Projets visibles pour le niveau — un 4AP ne voit jamais les textes 5AP. */
export function frenchProjectsForGrade(grade: PrimaryGrade): FrenchProject[] {
  return OFFICIAL_FRENCH_PROJECTS.filter((p) => p.grade === grade);
}

// MEN 2026-2027 curriculum change (CLAUDE.md § 2.B): French now starts in 4AP, not 3AP — these 4
// projects are the 4AP first-year program, not a "3AP revision" fallback for 4AP anymore.
const OFFICIAL_FRENCH_PROJECTS: FrenchProject[] = [
  // ─── 4AP — 4 projets officiels (1re année de français) ───────────────────
  {
    id: 'fr-4ap-p1',
    grade: '4AP',
    projectNumber: 1,
    titleFr: 'Projet 1 : Mon école',
    titleAr: 'المشروع 1 : مدرستي',
    themeFr: 'La classe, la cour de récréation, les objets scolaires et les amis.',
    objectiveFr: 'Se présenter, nommer la classe et les objets de l’école avec les articles définis (le, la, les) et le présent des verbes être et avoir.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Bienvenue à l’école !',
        textSupportFr: 'Je m’appelle Amine. Je suis en classe de 4AP. Mon école est grande et propre. J’ai un cartable bleu, un cahier et un stylo. Ma maîtresse s’appelle Madame Salima.',
        vocabList: [
          { wordFr: 'L’école', meaningAr: 'المدرسة', audioText: 'L’école' },
          { wordFr: 'Le cartable', meaningAr: 'الحقيبة المدرسية', audioText: 'Le cartable' },
          { wordFr: 'La maîtresse', meaningAr: 'المعلّمة', audioText: 'La maîtresse' },
        ],
        grammarRuleFr: 'Les articles définis : le (masculin), la (féminin), les (pluriel). Ex : le stylo, la règle, les cahiers.',
        conjugationRuleFr: 'Être et Avoir au présent : Je suis / J’ai — Tu es / Tu as — Il est / Il a.',
        productionTaskFr: 'Présente ton école en 3 phrases : ton nom, ta classe et un objet que tu as dans ton cartable.',
      },
    ],
  },
  {
    id: 'fr-4ap-p2',
    grade: '4AP',
    projectNumber: 2,
    titleFr: 'Projet 2 : Ma famille et ma maison',
    titleAr: 'المشروع 2 : عائلتي ومنزلي',
    themeFr: 'Les membres de la famille algérienne et les pièces de la maison.',
    objectiveFr: 'Décrire sa famille et sa maison avec les adjectifs possessifs (mon, ma, mes).',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Chez nous à Alger',
        textSupportFr: 'Voici ma famille. Mon père travaille. Ma mère cuisine dans la cuisine. J’ai un frère et une sœur. Notre salon est grand. Ma chambre est petite mais jolie.',
        vocabList: [
          { wordFr: 'Le père / La mère', meaningAr: 'الأب / الأم', audioText: 'Le père' },
          { wordFr: 'La cuisine', meaningAr: 'المطبخ', audioText: 'La cuisine' },
          { wordFr: 'La chambre', meaningAr: 'غرفة النوم', audioText: 'La chambre' },
        ],
        grammarRuleFr: 'Les adjectifs possessifs : mon, ma, mes (devant un nom). Ex : mon frère, ma sœur, mes livres.',
        conjugationRuleFr: 'Les verbes du 1er groupe au présent : habiter → j’habite, tu habites, il habite.',
        productionTaskFr: 'Dessine ta maison et écris 4 phrases : une pièce + un membre de ta famille dans chaque phrase.',
      },
    ],
  },
  {
    id: 'fr-4ap-p3',
    grade: '4AP',
    projectNumber: 3,
    titleFr: 'Projet 3 : Les animaux domestiques',
    titleAr: 'المشروع 3 : الحيوانات الأليفة',
    themeFr: 'Le chat, le chien, le mouton et les animaux de la ferme algérienne.',
    objectiveFr: 'Décrire un animal domestique : couleur, taille, alimentation.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Mon chat Minou',
        textSupportFr: 'J’ai un chat. Il s’appelle Minou. Il est petit et gris. Il aime le lait et le poisson. Il dort sur le tapis du salon. Minou est très gentil.',
        vocabList: [
          { wordFr: 'Le chat', meaningAr: 'القط', audioText: 'Le chat' },
          { wordFr: 'Petit / Grand', meaningAr: 'صغير / كبير', audioText: 'Petit' },
          { wordFr: 'Le lait', meaningAr: 'الحليب', audioText: 'Le lait' },
        ],
        grammarRuleFr: 'L’adjectif qualificatif simple après le nom : un chat gris, une vache blanche.',
        conjugationRuleFr: 'Le verbe aimer au présent : j’aime, tu aimes, il aime.',
        productionTaskFr: 'Choisis un animal domestique algérien et écris 4 phrases pour le décrire.',
      },
    ],
  },
  {
    id: 'fr-4ap-p4',
    grade: '4AP',
    projectNumber: 4,
    titleFr: 'Projet 4 : L’alimentation',
    titleAr: 'المشروع 4 : التغذية',
    themeFr: 'Les plats algériens, les fruits, les légumes et les repas de la journée.',
    objectiveFr: 'Parler des repas, des aliments sains et utiliser « je mange / je bois » au présent.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Un repas équilibré',
        textSupportFr: 'Le matin, je mange du pain avec du beurre et je bois du lait. À midi, je mange du couscous ou de la chorba. Le soir, je mange des fruits : des oranges et des dattes.',
        vocabList: [
          { wordFr: 'Le pain', meaningAr: 'الخبز', audioText: 'Le pain' },
          { wordFr: 'Le couscous', meaningAr: 'الكسكس', audioText: 'Le couscous' },
          { wordFr: 'Les fruits', meaningAr: 'الفواكه', audioText: 'Les fruits' },
        ],
        grammarRuleFr: 'Partitifs : du, de la, des (devant un aliment). Ex : du pain, de la salade, des dattes.',
        conjugationRuleFr: 'Manger et boire au présent : je mange, je bois — tu manges, tu bois.',
        productionTaskFr: 'Écris ton menu d’une journée (petit-déjeuner, déjeuner, dîner) en 3 phrases.',
      },
    ],
  },
  // ─── 5AP — 3 projets officiels ───────────────────────────────────────────
  {
    id: 'fr-5ap-p1',
    grade: '5AP',
    projectNumber: 1,
    titleFr: 'Projet 1 : Au zoo ! / Pauvre petit animal',
    titleAr: 'المشروع 1 : في حديقة الحيوانات وحماية الحيوانات',
    themeFr: 'Les animaux sauvages et domestiques d’Algérie (Le fennec, la gazelle, le lion)',
    objectiveFr: 'Décrire un animal (habitat, nourriture, caractéristiques physiques) et utiliser les adjectifs qualificatifs et le présent de l’indicatif.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Pauvre petite gazelle !',
        textSupportFr: 'La gazelle de l’Atlas est un animal herbivore élégant. Elle vit dans le Sahara et les montagnes du Sud algérien. Elle a de jolies cornes noires et de longues pattes fines pour courir très vite.',
        vocabList: [
          { wordFr: 'Herbivore', meaningAr: 'عاشب (يأكل العشب)', audioText: 'Herbivore' },
          { wordFr: 'Les cornes', meaningAr: 'القرون', audioText: 'Les cornes' },
          { wordFr: 'Le fennec', meaningAr: 'الفنك الصغير', audioText: 'Le fennec' },
        ],
        grammarRuleFr: 'L’adjectif qualificatif s’accorde en genre (féminin -e) et en nombre (pluriel -s) avec le nom qu’il qualifie (ex: une jolie gazelle / de jolies gazelles).',
        conjugationRuleFr: 'Le présent des verbes du 1er groupe (-er) : -e, -es, -e, -ons, -ez, -ent (ex: Elle habite dans le désert).',
        productionTaskFr: 'Rédige un court paragraphe (4 à 5 lignes) pour présenter le fennec en utilisant la boîte à outils (nom, habitat, alimentation, caractéristiques).',
      },
      {
        number: 2,
        titleFr: 'Séquence 2 : C’est un vrai fennec !',
        textSupportFr: 'Le fennec est le plus petit renard du monde. Il vit dans les dunes de sable du Sahara algérien. Ses grandes oreilles lui permettent d’entendre les bruits de très loin et de réguler sa température.',
        vocabList: [
          { wordFr: 'Les dunes', meaningAr: 'الكثبان الرملية', audioText: 'Les dunes' },
          { wordFr: 'Les oreilles', meaningAr: 'الأذنان الكبيرتان', audioText: 'Les oreilles' },
          { wordFr: 'La température', meaningAr: 'درجة الحرارة', audioText: 'La température' },
        ],
        grammarRuleFr: 'Les pronoms personnels sujets (Il, Elle, Ils, Elles) évitent la répétition du nom sujet.',
        conjugationRuleFr: 'Les verbes Être et Avoir au présent : Le fennec est un mammifère, il a de grandes oreilles.',
        productionTaskFr: 'Complète la fiche d’identité du fennec avec les mots manquants.',
      },
    ],
  },
  {
    id: 'fr-5ap-p2',
    grade: '5AP',
    projectNumber: 2,
    titleFr: 'Projet 2 : C’est une catastrophe naturelle !',
    titleAr: 'المشروع 2 : الكوارث الطبيعية والتضامن الوطني والإسعاف',
    themeFr: 'Le tremblement de terre, l’inondation, les incendies de forêt et le travail des pompiers et de la Protection Civile.',
    objectiveFr: 'Raconter un événement passé, comprendre les consignes de sécurité, et utiliser le passé composé et les indicateurs temporels.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Quand la terre tremble !',
        textSupportFr: 'Le séisme est une secousse violente de la terre. Les courageux agents de la Protection Civile algérienne arrivent immédiatement pour secourir les blessés et déblayer les décombres.',
        vocabList: [
          { wordFr: 'Le séisme / Le tremblement de terre', meaningAr: 'الزلزال', audioText: 'Le séisme' },
          { wordFr: 'La Protection Civile', meaningAr: 'الحماية المدنية', audioText: 'La Protection Civile' },
          { wordFr: 'Les secouristes', meaningAr: 'المسعفون', audioText: 'Les secouristes' },
        ],
        grammarRuleFr: 'Les indicateurs de temps et d’espace (Soudain, pendant, après, sous la table).',
        conjugationRuleFr: 'Le passé composé avec l’auxiliaire être et avoir (ex: Les pompiers sont arrivés rapidement / Le médecin a soigné les blessés).',
        productionTaskFr: 'Raconte ce que font les secouristes après une inondation en employant le passé composé.',
      },
    ],
  },
  {
    id: 'fr-5ap-p3',
    grade: '5AP',
    projectNumber: 3,
    titleFr: 'Projet 3 : Protégeons notre planète ! / Les énergies propres',
    titleAr: 'المشروع 3 : حماية البيئة والطاقات النظيفة والمتجددة',
    themeFr: 'Le recyclage des déchets, l’énergie solaire dans le Sahara et la préservation de l’eau.',
    objectiveFr: 'Donner des conseils et des consignes d’écocitoyenneté à l’aide du mode impératif et du futur simple.',
    sequences: [
      {
        number: 1,
        titleFr: 'Séquence 1 : Pourquoi économiser l’eau ?',
        textSupportFr: 'L’eau est la source de la vie. Pour protéger notre pays contre la sécheresse, nous devons fermer le robinet pendant le brossage des dents et réparer les fuites.',
        vocabList: [
          { wordFr: 'Économiser', meaningAr: 'اقتصاد وترشيد الاستهلاك', audioText: 'Économiser' },
          { wordFr: 'L’énergie solaire', meaningAr: 'الطاقة الشمسية', audioText: 'L’énergie solaire' },
          { wordFr: 'Le recyclage', meaningAr: 'إعادة التدوير', audioText: 'Le recyclage' },
        ],
        grammarRuleFr: 'La phrase impérative pour donner un ordre ou un conseil (ex: Ferme le robinet ! Ne jetez pas les plastiques !).',
        conjugationRuleFr: 'Le futur simple des verbes : -ai, -as, -a, -ons, -ez, -ont (ex: Nous protégerons la nature).',
        productionTaskFr: 'Écris 4 conseils écologiques pour garder la cour de ton école propre.',
      },
    ],
  },
];

// A raw character count let a child pass this by typing anything 21+ characters long — a typo-only
// string like "je suis beojg alors bonne nuit" (31 chars, one real French word away from gibberish)
// got the same "Bravo, ta production est riche" praise and the same XP/coins as a real paragraph.
// No AI grading here (this lab runs fully offline, no network call per validation), so this stays a
// heuristic — but requiring several DISTINCT real words is a much higher bar than a length count,
// and roughly matches "4 à 5 lignes" / "4 conseils" worth of actual writing.
export function isWritingRichEnough(text: string): boolean {
  const words = text
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[.,!?;:'"’«»]/g, ''))
    .filter((w) => /[a-zA-ZÀ-ÿ]{2,}/.test(w));
  const distinctWords = new Set(words.map((w) => w.toLowerCase()));
  return words.length >= 8 && distinctWords.size >= 5;
}

export const FrenchProjectsLabInteractive: React.FC<FrenchProjectsLabInteractiveProps> = ({
  grade = '4AP',
  onReward,
  onBack,
}) => {
  const gradeProjects = frenchProjectsForGrade(grade);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => gradeProjects[0]?.id ?? '');
  const [selectedSeqNum, setSelectedSeqNum] = useState<number>(1);
  const [userWritingText, setUserWritingText] = useState<string>('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);

  const currentProject = gradeProjects.find((p) => p.id === selectedProjectId) || gradeProjects[0];
  const currentSequence = currentProject?.sequences.find((s) => s.number === selectedSeqNum) || currentProject?.sequences[0];

  useEffect(() => {
    if (gradeProjects.length > 0 && !gradeProjects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(gradeProjects[0].id);
      setSelectedSeqNum(1);
      setUserWritingText('');
      setWritingFeedback(null);
    }
  }, [grade, gradeProjects, selectedProjectId]);

  // Routed through the shared speakText utility so this gets the same reliable native Android TTS
  // (via Capacitor) as other labs, instead of the Android WebView's own window.speechSynthesis,
  // which commonly reports zero installed voices there.
  const speakFrench = (text: string) => {
    speakText(text, 'fr-FR', 0.9);
  };

  const handleValidateWriting = () => {
    if (isWritingRichEnough(userWritingText)) {
      setWritingFeedback('Bravo ! Ta production est riche et respecte bien les consignes du projet officiel 🌟');
      onReward?.(10, 30);
    } else {
      setWritingFeedback('Essaie d’écrire au moins 3 à 4 phrases complètes, avec au moins 8 mots différents (verbes, adjectifs...).');
    }
  };

  if (!currentProject || !currentSequence) {
    return (
      <div className="rounded-3xl border border-sky-200 bg-sky-50 p-8 text-center text-sm text-sky-900">
        Aucun projet officiel disponible pour {grade}.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="ltr">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-600/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Retour"
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>
                {grade === '5AP'
                  ? 'Programme Officiel de Français — 5AP (3 Projets du Ministère)'
                  : 'Programme Officiel de Français — 4AP (4 Projets du Ministère)'}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">
              Atelier des Projets Officiels de Français
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-3xl">
              {grade === '5AP'
                ? 'Les 3 projets officiels de 5AP : animaux sauvages, catastrophes naturelles et écologie.'
                : 'Les 4 projets de la 1re année de français : Mon école, Ma famille, Les animaux domestiques et L’alimentation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Project Selector Cards */}
      <div className={`grid grid-cols-1 gap-3 ${gradeProjects.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
        {gradeProjects.map((proj) => {
          const isSelected = selectedProjectId === proj.id;
          return (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedProjectId(proj.id);
                setSelectedSeqNum(1);
                setUserWritingText('');
                setWritingFeedback(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-sky-700 text-white border-sky-500 shadow-md scale-[1.02]'
                  : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-sky-400'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/90 text-sky-900' : 'bg-sky-100 text-sky-900'}`}>
                  {proj.grade} • Projet {proj.projectNumber}
                </span>
                <h3 className="font-black text-sm">{proj.titleFr}</h3>
              </div>
              <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-[var(--app-text-muted)]'}`}>
                {proj.titleAr}
              </p>
            </button>
          );
        })}
      </div>

      {/* Sequence Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-2 overflow-x-auto">
        {currentProject.sequences.map((seq) => {
          const isCurrent = seq.number === selectedSeqNum;
          return (
            <button
              key={seq.number}
              onClick={() => {
                setSelectedSeqNum(seq.number);
                setUserWritingText('');
                setWritingFeedback(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
              }`}
            >
              {seq.titleFr}
            </button>
          );
        })}
      </div>

      {/* Active Sequence Content Workspace */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Support Text & Audio Player */}
        <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-400/30 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-black text-sky-900">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Texte de lecture et de compréhension :</span>
            </div>
            <button
              onClick={() => speakFrench(currentSequence.textSupportFr)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Écouter le texte 🗣️</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-[var(--app-text)] font-sans leading-relaxed bg-[var(--app-card-bg)] p-4 rounded-xl border border-sky-300/40">
            {currentSequence.textSupportFr}
          </p>
        </div>

        {/* Thematic Vocabulary with Audio */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-[var(--app-text)] uppercase tracking-wider">
            Boîte à mots & Lexique du projet :
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {currentSequence.vocabList.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] flex items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-black text-[var(--app-text)] block">{item.wordFr}</span>
                  <span className="text-[11px] text-[var(--app-text-muted)]">{item.meaningAr}</span>
                </div>
                <button
                  onClick={() => speakFrench(item.audioText)}
                  className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 cursor-pointer"
                  title="Écouter la prononciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar & Conjugation Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] space-y-1.5">
            <span className="text-xs font-black text-sky-700 block">📐 Règle de Grammaire :</span>
            <p className="text-xs text-[var(--app-text)] leading-relaxed">{currentSequence.grammarRuleFr}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] space-y-1.5">
            <span className="text-xs font-black text-indigo-700 block">⏳ Règle de Conjugaison :</span>
            <p className="text-xs text-[var(--app-text)] leading-relaxed">{currentSequence.conjugationRuleFr}</p>
          </div>
        </div>

        {/* Guided Written Production */}
        <div className="p-5 rounded-2xl bg-[var(--app-card-subtle)] border-2 border-sky-300 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-[var(--app-text)]">
            <PenTool className="w-4 h-4 text-sky-600" />
            <span>Production écrite guidée (Écris ton paragraphe) :</span>
          </div>
          <p className="text-xs text-[var(--app-text-muted)]">{currentSequence.productionTaskFr}</p>

          <textarea
            rows={4}
            value={userWritingText}
            onChange={(e) => setUserWritingText(e.target.value)}
            placeholder="Écris ton paragraphe ici en français..."
            className="w-full p-3.5 rounded-xl border border-[var(--app-card-border)] bg-[var(--app-card-bg)] text-[var(--app-text)] text-xs sm:text-sm focus:ring-2 focus:ring-sky-400 focus:outline-hidden"
          />

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <Button variant="primary" size="sm" onClick={handleValidateWriting}>
              Valider ma production ✨
            </Button>
            {writingFeedback && (
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-3 py-1 rounded-lg">
                {writingFeedback}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
