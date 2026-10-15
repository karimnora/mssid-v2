import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolModule, PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';
import { PreschoolSpecialTool } from './PreschoolApp';
import { PreschoolPrintablesModal } from './PreschoolPrintablesModal';
import { DailyChallengeBanner } from './DailyChallengeBanner';
import { ChallengeItem } from './useDailyChallenge';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import { PreschoolAsset } from './PreschoolAsset';
import { PreschoolFlagMark, isFlagEmoji } from './PreschoolFlagMark';
import { ParentGateButton } from './PreschoolParentBilan';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

interface DailyChallengeData {
  items: ChallengeItem[];
  completedIds: string[];
  streak: number;
}

interface PreschoolModulePickerProps {
  modules: PreschoolModule[];
  language: PreschoolLanguage;
  completedByModule: Record<string, number>;
  onSelectModule: (moduleId: string) => void;
  onSelectSpecialTool: (tool: PreschoolSpecialTool) => void;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onResetLanguage?: () => void;
  onExit: () => void;
  dailyChallenge?: DailyChallengeData;
  onNavigateToActivity?: (moduleId: string, activityId: string) => void;
  view: PreschoolHubView;
  onViewChange: (view: PreschoolHubView) => void;
  learnGroup: PreschoolLearnGroupId | null;
  onLearnGroupChange: (group: PreschoolLearnGroupId | null) => void;
  onOpenParentBilan?: () => void;
}

export type PreschoolHubView = 'home' | 'ateliers' | 'apprendre';
export type PreschoolLearnGroupId = 'foundations' | 'science' | 'civics' | 'create';
type LearnGroupId = PreschoolLearnGroupId;

const spring = { type: 'spring' as const, stiffness: 280, damping: 22 };

const LEARN_GROUPS: { id: LearnGroupId; moduleIds: string[] }[] = [
  {
    id: 'foundations',
    moduleIds: [
      'preschool-letters',
      'preschool-letters-2',
      'preschool-numbers-0-5',
      'preschool-numbers-6-10',
      'preschool-shapes',
      'preschool-colors',
    ],
  },
  {
    id: 'science',
    moduleIds: ['preschool-animals', 'preschool-body', 'preschool-seasons', 'preschool-calendar', 'preschool-food', 'preschool-world'],
  },
  {
    id: 'civics',
    moduleIds: ['preschool-family', 'preschool-algeria', 'preschool-islamic-values', 'preschool-short-surahs', 'preschool-emotions'],
  },
  {
    id: 'create',
    moduleIds: [
      'preschool-pre-writing',
      'preschool-logic-spatial',
      'preschool-sequences',
      'preschool-stories',
      'preschool-art-drawing',
      'preschool-creative-games',
      'preschool-discovery-garden',
      'preschool-discovery-picnic',
      'preschool-discovery-tiles',
    ],
  },
];

export const PreschoolModulePicker: React.FC<PreschoolModulePickerProps> = ({
  modules,
  language,
  completedByModule,
  onSelectModule,
  onSelectSpecialTool,
  onSelectLanguage,
  onExit,
  dailyChallenge,
  onNavigateToActivity,
  view,
  onViewChange,
  learnGroup,
  onLearnGroupChange,
  onOpenParentBilan,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [showPrintables, setShowPrintables] = useState(false);
  const parentBilanEnabled = useFeatureFlag('preschoolParentBilan');

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const labels = {
    printables: t('أَوْرَاقٌ لِلطِّبَاعَةِ 🖨️', 'Fiches à imprimer 🖨️', 'Printable sheets 🖨️'),
    printablesDesc: t(
      'اطْبَعْ أَوْرَاقَ تَمَارِينَ وَرَقِيَّة لِطِفْلِكَ',
      'Imprime des fiches d’exercices papier pour ton enfant',
      'Print paper worksheets for your child',
    ),
    title: t('عَالَمُ الصِّغَار (3-5 سَنَوَات) 🎈', 'Monde des Petits (3-5 ans) 🎈', 'Little Ones World (3-5 years) 🎈'),
    subtitle: t(
      'اِخْتَرْ بَاباً وَالْعَبْ مَعَ دِيدُو!',
      'Choisis une porte et joue avec Dido !',
      'Pick a door and play with Dido!',
    ),
    ateliers: t('الْوَرَشَات', 'Ateliers', 'Create'),
    ateliersDesc: t('رَسْم، مُوسِيقَى وَأَصْوَات', 'Dessin, musique et sons', 'Drawing, music and sounds'),
    learn: t('أَتَعَلَّم', 'Apprendre', 'Learn'),
    learnDesc: t('حُرُوف، أَرْقَام وَالْعَالَم', 'Lettres, nombres et le monde', 'Letters, numbers and the world'),
    play: t('أَلْعَب', 'Jouer', 'Play'),
    playDesc: t('8 أَلْعَاب مَعَ دِيدُو', '8 jeux avec Dido', '8 games with Dido'),
    magicBoard: t('اللَّوْحَةُ السِّحْرِيَّة', 'Tableau Magique', 'Magic Board'),
    magicBoardDesc: t(
      'رَسْم، سَبُّورَة، تَتَبُّع، تَلْوِين وَالْعَالَمُ السِّحْرِيّ',
      'Dessin, ardoise, traçage, coloriage et Monde Magique',
      'Drawing, slate, tracing, coloring and Magic World',
    ),
    xylophone: t('الْبِيَانُو وَالْمُوسِيقَى', 'Piano et mélodies', 'Piano and songs'),
    xylophoneDesc: t(
      'بِيَانُو، دَرْبُوكَة وَأُغْنِيَات جَزَائِرِيَّة',
      'Piano, darbouka et jolies comptines algériennes',
      'Piano, darbuka and Algerian nursery songs',
    ),
    soundBox: t('صُنْدُوقُ الْأَصْوَات', 'Boîte à sons', 'Sound Box'),
    soundBoxDesc: t(
      'أَصْوَات حَقِيقِيَّة: حَيَوَانَات، سَيَّارَة، مَطَر وَالْبَيْت',
      'Vrais sons : animaux, voiture, pluie, maison',
      'Real sounds: animals, car, rain and home',
    ),
    completed: t('مُكْتَمِل 🎉', 'Terminé 🎉', 'Done 🎉'),
    pickWorld: t('اِخْتَرْ عَالَماً', 'Choisis un monde', 'Pick a world'),
    pickPath: t('اِخْتَرْ مَسَارَك', 'Choisis ton parcours', 'Pick your path'),
    foundations: t('حُرُوف، أَرْقَام وَأَشْكَال', 'Lettres, chiffres et formes', 'Letters, numbers and shapes'),
    science: t('الْعُلُوم وَالْعَالَم', 'Sciences et monde', 'Science and world'),
    civics: t('الْعَائِلَة وَالْقِيَم', 'Famille et valeurs', 'Family and values'),
    create: t('الْخَطّ وَالْإِبْدَاع', 'Tracé et créatif', 'Writing and art'),
  };

  const ATELIERS: {
    id: Exclude<PreschoolSpecialTool, 'games'>;
    title: string;
    desc: string;
    icon: string;
    gradient: string;
    border: string;
  }[] = [
    {
      id: 'board',
      title: labels.magicBoard,
      desc: labels.magicBoardDesc,
      icon: '🎨',
      gradient: 'from-amber-400 to-orange-500',
      border: 'border-orange-300',
    },
    {
      id: 'xylophone',
      title: labels.xylophone,
      desc: labels.xylophoneDesc,
      icon: '🎹',
      gradient: 'from-violet-400 to-indigo-500',
      border: 'border-violet-300',
    },
    {
      id: 'soundbox',
      title: labels.soundBox,
      desc: labels.soundBoxDesc,
      icon: '🔊',
      gradient: 'from-teal-400 to-emerald-500',
      border: 'border-teal-300',
    },
  ];

  const GROUP_META: Record<LearnGroupId, { title: string; icon: string; gradient: string }> = {
    foundations: { title: labels.foundations, icon: '🔤', gradient: 'from-sky-400 to-indigo-500' },
    science: { title: labels.science, icon: '🌱', gradient: 'from-lime-400 to-emerald-500' },
    civics: { title: labels.civics, icon: '🇩🇿', gradient: 'from-amber-400 to-rose-400' },
    create: { title: labels.create, icon: '✏️', gradient: 'from-violet-400 to-fuchsia-500' },
  };

  const goBack = () => {
    if (view === 'apprendre' && learnGroup) {
      onLearnGroupChange(null);
      return;
    }
    if (view !== 'home') {
      onViewChange('home');
      onLearnGroupChange(null);
      return;
    }
    onExit();
  };

  const sectionTitle =
    view === 'ateliers'
      ? labels.ateliers
      : view === 'apprendre' && !learnGroup
        ? labels.pickWorld
        : view === 'apprendre' && learnGroup
          ? GROUP_META[learnGroup].title
          : labels.title;

  const visibleModules = learnGroup
    ? LEARN_GROUPS.find((g) => g.id === learnGroup)!.moduleIds
        .map((id) => modules.find((m) => m.id === id))
        .filter((m): m is PreschoolModule => Boolean(m))
    : [];

  return (
    <div dir={dir} className="preschool-safe-top min-h-screen bg-[#F8F9FA] px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
              aria-label={view === 'home' ? 'خروج / Quitter / Exit' : 'رجوع / Retour / Back'}
            >
              {view === 'home' ? '🚪' : dir === 'rtl' ? '▶' : '◀'}
            </button>
            <PreschoolMuteButton language={language} />
            {parentBilanEnabled && onOpenParentBilan && (
              <ParentGateButton language={language} onUnlock={onOpenParentBilan} />
            )}
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-sm border border-orange-200">
            {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => onSelectLanguage?.(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  language === l ? 'bg-orange-700 text-white' : 'text-[#1E293B] hover:bg-orange-100'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <PreschoolFlagMark asset={PRESCHOOL_LANGUAGE_LABELS[l].flag} size={18} />
                  {l.toUpperCase()}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowPrintables(true)}
            className="bg-white border border-orange-300 text-orange-800 hover:bg-orange-50 font-black text-xs px-3.5 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            {labels.printables}
          </button>
        </div>

        <div className="flex flex-col items-center text-center gap-3 px-2">
          <PreschoolMascot mood="idle" size="md" />
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B]">{sectionTitle}</h1>
          {view === 'home' && (
            <p className="text-sm font-bold text-slate-600">{labels.subtitle}</p>
          )}
        </div>

        {view === 'home' && dailyChallenge && onNavigateToActivity && dailyChallenge.items.length > 0 && (
          <DailyChallengeBanner
            items={dailyChallenge.items}
            completedIds={dailyChallenge.completedIds}
            streak={dailyChallenge.streak}
            language={language}
            onNavigateToActivity={onNavigateToActivity}
          />
        )}

        {/* Parent-facing feature (printing needs an adult) — was buried as a small toolbar pill
            up top, easy to miss next to the back/mute/language controls. A proper banner here
            gives it the visual weight it needs, same treatment as the daily challenge above it. */}
        {view === 'home' && (
          <motion.button
            onClick={() => setShowPrintables(true)}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-3xl shadow-md border border-sky-300 bg-gradient-to-r from-sky-700 to-cyan-800 px-4 py-3.5 flex items-center gap-3 cursor-pointer text-start"
          >
            <span className="text-3xl shrink-0">🖨️</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base">{labels.printables}</p>
              <p className="text-white text-xs font-bold leading-snug">{labels.printablesDesc}</p>
            </div>
            <span className="text-white text-xl shrink-0">{dir === 'rtl' ? '◀' : '▶'}</span>
          </motion.button>
        )}

        {view === 'home' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <DoorCard
              icon="🎨"
              title={labels.ateliers}
              desc={labels.ateliersDesc}
              gradient="from-amber-700 to-orange-800"
              onClick={() => onViewChange('ateliers')}
            />
            <DoorCard
              icon="📚"
              title={labels.learn}
              desc={labels.learnDesc}
              gradient="from-sky-700 to-indigo-800"
              onClick={() => onViewChange('apprendre')}
            />
            <DoorCard
              icon="🎮"
              title={labels.play}
              desc={labels.playDesc}
              gradient="from-violet-700 to-fuchsia-800"
              onClick={() => onSelectSpecialTool('games')}
            />
          </div>
        )}

        {view === 'ateliers' && (
          <div className="grid grid-cols-1 gap-5">
            {ATELIERS.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => onSelectSpecialTool(tool.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={spring}
                className={`min-h-32 rounded-3xl bg-gradient-to-br ${tool.gradient} p-6 text-white shadow-md border-2 ${tool.border}
                            flex items-center gap-5 cursor-pointer text-start`}
              >
                <span className="text-5xl">{tool.icon}</span>
                <div className="space-y-1">
                  <p className="text-xl font-black">{tool.title}</p>
                  <p className="text-sm font-medium text-white/90 leading-snug">{tool.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {view === 'apprendre' && !learnGroup && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {LEARN_GROUPS.map((group) => {
              const groupModules = group.moduleIds
                .map((id) => modules.find((m) => m.id === id))
                .filter((m): m is PreschoolModule => Boolean(m));
              const total = groupModules.reduce((sum, m) => sum + m.activities.length, 0);
              const done = groupModules.reduce((sum, m) => sum + (completedByModule[m.id] || 0), 0);
              const meta = GROUP_META[group.id];
              return (
                <motion.button
                  key={group.id}
                  onClick={() => onLearnGroupChange(group.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className={`min-h-36 rounded-3xl bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-md
                              flex flex-col justify-between cursor-pointer text-start`}
                >
                  <span className="text-5xl">
                    {isFlagEmoji(meta.icon)
                      ? <PreschoolFlagMark asset={meta.icon} size={56} />
                      : meta.icon}
                  </span>
                  <div className="mt-4 space-y-1">
                    <p className="text-xl font-black">{meta.title}</p>
                    <p className="text-sm font-bold text-white/85">
                      {done} / {total} ⭐
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {view === 'apprendre' && learnGroup && (
          <div className="grid grid-cols-1 gap-4">
            {visibleModules.map((mod) => {
              const total = mod.activities.length;
              const done = completedByModule[mod.id] || 0;
              const isAllDone = done === total && total > 0;
              return (
                <motion.button
                  key={mod.id}
                  onClick={() => onSelectModule(mod.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className="min-h-24 rounded-3xl bg-white shadow-md border-2 border-amber-200 hover:border-amber-400
                             flex items-center gap-4 px-5 py-4 cursor-pointer text-start"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shrink-0">
                    <PreschoolAsset asset={mod.icon} size={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-[#1E293B] truncate">{mod.titleI18n[language]}</p>
                    <div className="mt-2 h-2 bg-amber-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isAllDone ? 'bg-emerald-400' : 'bg-amber-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
                        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-bold text-slate-600">
                        {done} / {total} ⭐
                      </span>
                      {isAllDone && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {labels.completed}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xl text-amber-500">{dir === 'rtl' ? '◀' : '▶'}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {showPrintables && (
        <PreschoolPrintablesModal language={language} onExit={() => setShowPrintables(false)} />
      )}
    </div>
  );
};

const DoorCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  onClick: () => void;
}> = ({ icon, title, desc, gradient, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={spring}
    className={`min-h-40 rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-md
                flex flex-col justify-between cursor-pointer text-start`}
  >
    <span className="text-5xl">{icon}</span>
    <div className="mt-6 space-y-1">
      <p className="text-2xl font-black">{title}</p>
      <p className="text-sm font-medium text-white leading-snug">{desc}</p>
    </div>
  </motion.button>
);
