import React, { useState } from 'react';
import { ParentGateModal } from '../ParentGateModal';
import { motion } from 'motion/react';
import { PreschoolLanguage, PRESCHOOL_LANGUAGE_LABELS } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';
import { PreschoolFlagMark } from './PreschoolFlagMark';

interface PreschoolLanguagePickerProps {
  onSelect: (language: PreschoolLanguage) => void;
}

// First screen of Mode Éveil — a parent picks the learning language once. Deliberately not a
// child-facing decision: the labels are in each language's own script/name (a 4 year-old can't
// read "Français" or "العربية"), so this step assumes an adult is present, which matches the
// "co-play" design principle for this age band (never leave a toddler to navigate settings alone).
export const PreschoolLanguagePicker: React.FC<PreschoolLanguagePickerProps> = ({ onSelect }) => {
  const [pending, setPending] = useState<PreschoolLanguage | null>(null);
  const languages: PreschoolLanguage[] = ['ar', 'fr', 'en'];

  return (
    <div className="preschool-safe-top min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-10 bg-gradient-to-b from-amber-100 via-orange-50 to-sky-100">
      <PreschoolMascot mood="idle" />

      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-orange-900">اختر اللغة · Choisis ta langue · Choose your language</h1>
        <p className="text-sm text-orange-700/80">للولي: اختر لغة التعلّم لطفلك — Pour le parent : choisissez la langue d&apos;apprentissage — For the parent: choose your child&apos;s learning language</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl">
        {languages.map((lang) => {
          const info = PRESCHOOL_LANGUAGE_LABELS[lang];
          return (
            <motion.button
              key={lang}
              onClick={() => setPending(lang)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[60px] min-w-[60px] min-h-32 rounded-[2rem] bg-white shadow-lg border-4 border-amber-200 hover:border-amber-400 flex flex-col items-center justify-center gap-2 py-6 cursor-pointer transition-colors"
            >
              <PreschoolFlagMark asset={info.flag} size={64} />
              <span className="text-xl font-black text-orange-900" dir={info.dir}>{info.nativeLabel}</span>
            </motion.button>
          );
        })}
      </div>
      {pending !== null && <ParentGateModal isOpen onClose={() => setPending(null)} onVerified={() => { onSelect(pending); setPending(null); }} />}
    </div>
  );
};
