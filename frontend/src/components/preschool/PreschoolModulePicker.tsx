import React from 'react';
import { motion } from 'motion/react';
import { PreschoolModule, PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';

interface PreschoolModulePickerProps {
  modules: PreschoolModule[];
  language: PreschoolLanguage;
  completedByModule: Record<string, number>;
  onSelectModule: (moduleId: string) => void;
  onExit: () => void;
}

const PICK_A_GAME_LABEL: Record<PreschoolLanguage, string> = {
  ar: 'اختر لعبة!',
  fr: 'Choisis un jeu !',
  en: 'Pick a game!',
};

// Hub screen listing every available module as one big, playful card — the child (with a parent
// nearby) picks a whole world to play in, rather than being dropped into a single fixed path.
export const PreschoolModulePicker: React.FC<PreschoolModulePickerProps> = ({ modules, language, completedByModule, onSelectModule, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-sky-100 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-white shadow-md text-xl cursor-pointer"
            aria-label="خروج / Quitter / Exit"
          >
            🚪
          </button>
          <div className="w-11" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <PreschoolMascot mood="idle" size="md" />
          <h1 className="text-xl sm:text-2xl font-black text-orange-900">{PICK_A_GAME_LABEL[language]}</h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod) => {
            const total = mod.activities.length;
            const done = completedByModule[mod.id] || 0;
            return (
              <motion.button
                key={mod.id}
                onClick={() => onSelectModule(mod.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="min-h-24 rounded-3xl bg-white shadow-lg border-4 border-amber-200 hover:border-amber-400 flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
              >
                <span className="text-5xl">{mod.icon}</span>
                <div className="flex-1 text-start">
                  <p className="text-lg font-black text-orange-900">{mod.titleI18n[language]}</p>
                  <p className="text-xs text-orange-700/70">{done} / {total} ⭐</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
