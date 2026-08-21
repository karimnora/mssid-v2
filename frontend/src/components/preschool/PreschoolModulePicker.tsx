import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PreschoolModule, PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';
import { PreschoolSpecialTool } from './PreschoolApp';
import { PreschoolPrintablesModal } from './PreschoolPrintablesModal';

interface PreschoolModulePickerProps {
  modules: PreschoolModule[];
  language: PreschoolLanguage;
  completedByModule: Record<string, number>;
  onSelectModule: (moduleId: string) => void;
  onSelectSpecialTool: (tool: PreschoolSpecialTool) => void;
  onSelectLanguage?: (lang: PreschoolLanguage) => void;
  onResetLanguage?: () => void;
  onExit: () => void;
}

export const PreschoolModulePicker: React.FC<PreschoolModulePickerProps> = ({
  modules,
  language,
  completedByModule,
  onSelectModule,
  onSelectSpecialTool,
  onSelectLanguage,
  onResetLanguage,
  onExit,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [showPrintables, setShowPrintables] = useState(false);

  const labels = {
    printables:
      language === 'ar'
        ? 'أوراق للطباعة 🖨️'
        : language === 'fr'
        ? 'Fiches à imprimer 🖨️'
        : 'Printable Worksheets 🖨️',
    title:
      language === 'ar'
        ? 'ركن الإيقاظ والبراعم 🎈'
        : language === 'fr'
        ? 'Monde des Petits (3-5 ans) 🎈'
        : 'Toddler World (3-5 yo) 🎈',
    subtitle:
      language === 'ar'
        ? 'اختر نشاطك المفضل والعب مع ديدو الفنك!'
        : language === 'fr'
        ? 'Choisis ton activité et amuse-toi avec Dido le Fennec !'
        : 'Pick your favorite game and have fun with Dido!',
    creativeTools:
      language === 'ar'
        ? '✨ ورشات الإبداع والموسيقى'
        : language === 'fr'
        ? '✨ Ateliers Créatifs, Musique & Sons'
        : '✨ Creative Labs, Music & Sounds',
    learningWorlds:
      language === 'ar'
        ? '🚀 مسارات التعلم والمرح'
        : language === 'fr'
        ? '🚀 Parcours d\'Éveil & Découverte'
        : '🚀 Learning Paths & Discoveries',
    magicBoard:
      language === 'ar'
        ? 'اللوحة السحرية والرسم'
        : language === 'fr'
        ? 'Tableau Magique & Dessin'
        : 'Magic Board & Drawing',
    magicBoardDesc:
      language === 'ar'
        ? 'رسم حر، سبورة المدرسة، تتبع الحروف وتلوين التراث الجزائري'
        : language === 'fr'
        ? 'Dessin libre, ardoise, traçage et coloriage algérien'
        : 'Free drawing, slate, tracing and Algerian coloring',
    xylophone:
      language === 'ar'
        ? 'عازف الألحان والبيانو الجزائري'
        : language === 'fr'
        ? 'Piano, Xylophone & Mélodies'
        : 'Piano, Xylophone & Folk Melodies',
    xylophoneDesc:
      language === 'ar'
        ? 'بيانو، زيلوفون، دربوكة وبندير مع أهازيج وأناشيد سهلة ومبهجة'
        : language === 'fr'
        ? 'Piano, darbouka, gasba et jolies comptines algériennes'
        : 'Piano, Darbuka, Gasba and cheerful Algerian nursery songs',
    soundBox:
      language === 'ar'
        ? 'صندوق الأصوات والتراث'
        : language === 'fr'
        ? 'Boîte à Sons & Éveil Sensoriel'
        : 'Heritage Sound Box & Quiz',
    soundBoxDesc:
      language === 'ar'
        ? 'الفنك، الجمل، والمركبات مع مسابقة خمن الصوت'
        : language === 'fr'
        ? 'Fennec, dromadaire et mini-quiz sonore'
        : 'Fennec, camel and guess the sound quiz',
    games:
      language === 'ar'
        ? 'قسم الألعاب والمتاهات'
        : language === 'fr'
        ? 'Espace Jeux & Labyrinthes'
        : 'Games & Mazes Hub',
    gamesDesc:
      language === 'ar'
        ? 'ألعاب السيارة، المتاهات، والألغاز التفاعلية الشيقة'
        : language === 'fr'
        ? 'Jeux de voiture, labyrinthes et puzzles interactifs'
        : 'Car maze games, puzzles and fun challenges',
    completed: language === 'ar' ? 'مكتمل 🎉' : language === 'fr' ? 'Terminé 🎉' : 'Done 🎉',
    changeLanguage: language === 'ar' ? 'تغيير اللغة' : language === 'fr' ? 'Changer langue' : 'Language',
  };

  const SPECIAL_TOOLS = [
    {
      id: 'board' as PreschoolSpecialTool,
      title: labels.magicBoard,
      desc: labels.magicBoardDesc,
      icon: '🎨',
      bgGradient: 'from-amber-500 via-orange-500 to-rose-500',
      border: 'border-orange-300',
      badge: language === 'ar' ? 'إبداع & رسم' : language === 'fr' ? 'Dessin & Tracé' : 'Art & Tracing',
    },
    {
      id: 'xylophone' as PreschoolSpecialTool,
      title: labels.xylophone,
      desc: labels.xylophoneDesc,
      icon: '🎹',
      bgGradient: 'from-purple-500 via-indigo-500 to-pink-500',
      border: 'border-purple-300',
      badge: language === 'ar' ? 'موسيقى' : language === 'fr' ? 'Musique' : 'Music',
    },
    {
      id: 'soundbox' as PreschoolSpecialTool,
      title: labels.soundBox,
      desc: labels.soundBoxDesc,
      icon: '🔊',
      bgGradient: 'from-teal-500 via-emerald-500 to-cyan-600',
      border: 'border-teal-300',
      badge: language === 'ar' ? 'أصوات' : language === 'fr' ? 'Quiz & Sons' : 'Sounds',
    },
    {
      id: 'games' as PreschoolSpecialTool,
      title: labels.games,
      desc: labels.gamesDesc,
      icon: '🎮',
      bgGradient: 'from-blue-600 via-indigo-600 to-violet-600',
      border: 'border-blue-300',
      badge: language === 'ar' ? 'ألعاب & مرح' : language === 'fr' ? 'Jeux & Labyrinthe' : 'Fun & Mazes',
    },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-sky-100 px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={onExit}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-200"
            aria-label="خروج / Quitter / Exit"
          >
            🚪
          </button>

          {/* Trilingual Language Selector */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl shadow-sm border border-orange-200">
            {(['ar', 'fr', 'en'] as PreschoolLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  if (onSelectLanguage) onSelectLanguage(l);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  language === l
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-orange-950 hover:bg-orange-100'
                }`}
              >
                {PRESCHOOL_LANGUAGE_LABELS[l].flag} {l.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintables(true)}
              className="bg-white border border-orange-300 text-orange-800 hover:bg-orange-50 font-black text-xs px-3.5 py-2 rounded-full shadow-xs transition-colors cursor-pointer"
            >
              {labels.printables}
            </button>
            <span className="bg-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-xs">
              👶 3 - 5 {language === 'ar' ? 'سنوات' : language === 'fr' ? 'ans' : 'years'}
            </span>
          </div>
        </div>

        {/* Mascot Greeting */}
        <div className="flex flex-col items-center text-center gap-2">
          <PreschoolMascot mood="idle" size="md" />
          <h1 className="text-2xl sm:text-3xl font-black text-orange-950">{labels.title}</h1>
          <p className="text-xs sm:text-sm font-bold text-orange-800/80">{labels.subtitle}</p>
        </div>

        {/* 1. Creative Tools & Games Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-orange-950">{labels.creativeTools}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SPECIAL_TOOLS.map((tool) => (
              <motion.button
                key={tool.id}
                onClick={() => onSelectSpecialTool(tool.id)}
                whileHover={{ scale: 1.03, translateY: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`min-h-36 rounded-3xl bg-gradient-to-br ${tool.bgGradient} p-4 text-white shadow-lg border-2 ${tool.border} flex flex-col justify-between text-start cursor-pointer transition-all relative overflow-hidden`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl sm:text-5xl drop-shadow-sm">{tool.icon}</span>
                  <span className="bg-white/25 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                </div>

                <div className="space-y-0.5 mt-3">
                  <p className="text-base font-black drop-shadow-xs">{tool.title}</p>
                  <p className="text-[11px] font-medium text-white/90 line-clamp-2 leading-tight">
                    {tool.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 2. Pedagogical Worlds */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-orange-950">{labels.learningWorlds}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {modules.map((mod) => {
              const total = mod.activities.length;
              const done = completedByModule[mod.id] || 0;
              const isAllDone = done === total && total > 0;

              return (
                <motion.button
                  key={mod.id}
                  onClick={() => onSelectModule(mod.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="min-h-24 rounded-3xl bg-white shadow-md border-3 border-amber-200 hover:border-amber-400 flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all text-start group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-3xl shrink-0 transition-colors">
                    {mod.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-orange-950 truncate">
                      {mod.titleI18n[language]}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-orange-700/80">
                        {done} / {total} ⭐
                      </span>
                      {isAllDone && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {labels.completed}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xl text-amber-500 group-hover:translate-x-1 transition-transform">
                    {dir === 'rtl' ? '◀' : '▶'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {showPrintables && (
        <PreschoolPrintablesModal language={language} onExit={() => setShowPrintables(false)} />
      )}
    </div>
  );
};