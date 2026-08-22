import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PreschoolModule, PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';
import { PreschoolSpecialTool } from './PreschoolApp';
import { PreschoolPrintablesModal } from './PreschoolPrintablesModal';
import { DailyChallengeBanner } from './DailyChallengeBanner';
import { ChallengeItem } from './useDailyChallenge';

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
}

type HubView = 'home' | 'ateliers' | 'apprendre';
type LearnGroupId = 'foundations' | 'science' | 'civics' | 'create';

const spring = { type: 'spring' as const, stiffness: 280, damping: 22 };

const LEARN_GROUPS: { id: LearnGroupId; moduleIds: string[] }[] = [
  {
    id: 'foundations',
    moduleIds: ['preschool-letters', 'preschool-numbers-0-10', 'preschool-shapes', 'preschool-colors'],
  },
  {
    id: 'science',
    moduleIds: ['preschool-animals', 'preschool-body', 'preschool-seasons', 'preschool-food', 'preschool-world'],
  },
  {
    id: 'civics',
    moduleIds: ['preschool-family', 'preschool-algeria', 'preschool-islamic-values', 'preschool-emotions'],
  },
  {
    id: 'create',
    moduleIds: [
      'preschool-pre-writing',
      'preschool-logic-spatial',
      'preschool-sequences',
      'preschool-art-drawing',
      'preschool-creative-games',
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
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [showPrintables, setShowPrintables] = useState(false);
  const [view, setView] = useState<HubView>('home');
  const [learnGroup, setLearnGroup] = useState<LearnGroupId | null>(null);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const labels = {
    printables: t('أوراق للطباعة 🖨️', 'Fiches à imprimer 🖨️', 'Printable Worksheets 🖨️'),
    title: t('ركن الإيقاظ والبراعم 🎈', 'Monde des Petits (3-5 ans) 🎈', 'Toddler World (3-5 yo) 🎈'),
    subtitle: t(
      'اختر باباً واحداً والعب مع ديدو!',
      'Choisis une porte et amuse-toi avec Dido !',
      'Pick a door and play with Dido!',
    ),
    ateliers: t('الورشات', 'Ateliers', 'Studios'),
    ateliersDesc: t('رسم، موسيقى وأصوات', 'Dessin, musique et sons', 'Drawing, music and sounds'),
    learn: t('أتعلّم', 'Apprendre', 'Learn'),
    learnDesc: t('حروف، أرقام والعالم', 'Lettres, nombres et le monde', 'Letters, numbers and the world'),
    play: t('ألعب', 'Jouer', 'Play'),
    playDesc: t('10 ألعاب مع ديدو', '10 jeux avec Dido', '10 games with Dido'),
    magicBoard: t('اللوحة السحرية والرسم', 'Tableau Magique & Dessin', 'Magic Board & Drawing'),
    magicBoardDesc: t(
      'رسم حر، سبورة، تتبع الحروف، تلوين والعالم السحري',
      'Dessin libre, ardoise, traçage, coloriage et Monde Magique',
      'Free drawing, slate, tracing, coloring and Magic World',
    ),
    xylophone: t('عازف الألحان والبيانو الجزائري', 'Piano, Xylophone & Mélodies', 'Piano, Xylophone & Folk Melodies'),
    xylophoneDesc: t(
      'بيانو، زيلوفون، دربوكة وبندير مع أهازيج سهلة',
      'Piano, darbouka, gasba et jolies comptines',
      'Piano, Darbuka, Gasba and nursery songs',
    ),
    soundBox: t('صندوق الأصوات', 'Boîte à Sons', 'Sound Box'),
    soundBoxDesc: t(
      'أصوات حقيقية: حيوانات، سيارة، مطر والبيت',
      'Vrais enregistrements : animaux, voiture, pluie, maison',
      'Real recordings: animals, cars, rain and home',
    ),
    completed: t('مكتمل 🎉', 'Terminé 🎉', 'Done 🎉'),
    pickWorld: t('اختر عالماً', 'Choisis un monde', 'Pick a world'),
    pickPath: t('اختر مسارك', 'Choisis ton parcours', 'Pick your path'),
    foundations: t('الحروف والأرقام', 'Lettres & Nombres', 'Letters & Numbers'),
    science: t('العلوم والعالم', 'Sciences & Monde', 'Science & World'),
    civics: t('العائلة والقيم', 'Famille & Valeurs', 'Family & Values'),
    create: t('الخطّ والإبداع', 'Tracé & Créatif', 'Writing & Creative'),
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
      setLearnGroup(null);
      return;
    }
    if (view !== 'home') {
      setView('home');
      setLearnGroup(null);
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
    <div dir={dir} className="min-h-screen bg-[#F8F9FA] px-4 py-6 sm:py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={goBack}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
            aria-label={view === 'home' ? 'خروج / Quitter / Exit' : 'رجوع / Retour / Back'}
          >
            {view === 'home' ? '🚪' : dir === 'rtl' ? '▶' : '◀'}
          </button>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-sm border border-orange-200">
            {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => onSelectLanguage?.(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  language === l ? 'bg-orange-500 text-white' : 'text-[#1E293B] hover:bg-orange-100'
                }`}
              >
                {PRESCHOOL_LANGUAGE_LABELS[l].flag} {l.toUpperCase()}
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

        {view === 'home' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <DoorCard
              icon="🎨"
              title={labels.ateliers}
              desc={labels.ateliersDesc}
              gradient="from-amber-400 to-orange-500"
              onClick={() => setView('ateliers')}
            />
            <DoorCard
              icon="📚"
              title={labels.learn}
              desc={labels.learnDesc}
              gradient="from-sky-400 to-indigo-500"
              onClick={() => setView('apprendre')}
            />
            <DoorCard
              icon="🎮"
              title={labels.play}
              desc={labels.playDesc}
              gradient="from-violet-400 to-fuchsia-500"
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
                  onClick={() => setLearnGroup(group.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring}
                  className={`min-h-36 rounded-3xl bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-md
                              flex flex-col justify-between cursor-pointer text-start`}
                >
                  <span className="text-5xl">{meta.icon}</span>
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
                    {mod.icon}
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
      <p className="text-sm font-medium text-white/90 leading-snug">{desc}</p>
    </div>
  </motion.button>
);
