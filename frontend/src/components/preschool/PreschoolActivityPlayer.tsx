import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolMascot, MascotMood } from './PreschoolMascot';
import { PreschoolTapChoice } from './PreschoolTapChoice';
import { PreschoolDragDrop } from './PreschoolDragDrop';
import { PreschoolTrace } from './PreschoolTrace';
import { PreschoolFindPath } from './PreschoolFindPath';
import { PreschoolConnectDots } from './PreschoolConnectDots';
import { PreschoolSorting } from './PreschoolSorting';
import { PreschoolMemoryCards } from './PreschoolMemoryCards';
import { PreschoolBubblePop } from './PreschoolBubblePop';
import { PreschoolColoring } from './PreschoolColoring';
import { PreschoolMaze } from './PreschoolMaze';
import { PreschoolJigsaw } from './PreschoolJigsaw';
import { usePreschoolSpeech } from './usePreschoolAudio';

interface PreschoolActivityPlayerProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
  onExit: () => void;
}

// Orchestrates one activity: speaks the prompt on entry, renders the right interaction widget for
// activity.interactionType, and reacts (mascot + voice) on success before handing control back to
// the path view. Session length stays short by construction — one activity, one clear finish line.
export const PreschoolActivityPlayer: React.FC<PreschoolActivityPlayerProps> = ({ activity, language, onComplete, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [mood, setMood] = useState<MascotMood>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showParentTip, setShowParentTip] = useState(false);
  const { speak } = usePreschoolSpeech(language);
  const content = activity.i18n[language];

  useEffect(() => {
    setMood('idle');
    setShowSuccess(false);
    setShowParentTip(false);
    const timer = setTimeout(() => speak(content.promptAudio), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, language]);

  const handleInteractionComplete = () => {
    setMood('happy');
    setShowSuccess(true);
    if (content.successAudio) speak(content.successAudio);
    setTimeout(onComplete, 1400);
  };

  const replayPrompt = () => speak(content.promptAudio);

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-sky-100 px-4 py-6 flex flex-col">
      <div className="flex items-center justify-between max-w-lg w-full mx-auto mb-4">
        <button
          onClick={onExit}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100"
          aria-label="خروج / Retour / Back"
          title="خروج"
        >
          🚪
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={replayPrompt}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100"
            aria-label="إعادة الاستماع / Réécouter / Replay"
            title="استمع للصوت"
          >
            🔊
          </button>

          {/* Direct Skip / Next button so the child or parent is never blocked */}
          <button
            onClick={handleInteractionComplete}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-md text-sm font-black flex items-center gap-2 cursor-pointer transition-all border border-emerald-400"
            title="التالي / Suivant / Next"
          >
            <span>{language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}</span>
            <span className="text-lg">⏩</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 max-w-lg w-full mx-auto flex-1 justify-center">
        <PreschoolMascot mood={mood} />

        <h2 className="text-xl sm:text-2xl font-black text-orange-900 text-center">{content.title}</h2>

        {/* promptText is a caption for the accompanying adult, never required reading for the
            child (see types.ts) — kept collapsed by default so the child's screen only ever shows
            the mascot talking directly to them, not an instruction addressed to a parent. */}
        {content.promptText && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setShowParentTip((v) => !v)}
              className="text-[11px] font-bold text-orange-700/60 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>ℹ️</span>
              <span>{language === 'ar' ? 'نصيحة لولي الأمر' : language === 'fr' ? 'Astuce pour le parent' : 'Tip for the grown-up'}</span>
            </button>
            {showParentTip && (
              <p className="text-xs text-orange-700/70 text-center max-w-xs bg-white/60 rounded-xl px-3 py-2 border border-orange-100">
                {content.promptText}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 w-full flex items-center justify-center">
          {activity.interactionType === 'tap_choice' && (
            <PreschoolTapChoice activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'drag_drop' && (
            <PreschoolDragDrop activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'trace' && (
            <PreschoolTrace activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'find_path' && (
            <PreschoolFindPath activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'connect_dots' && (
            <PreschoolConnectDots activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'sorting' && (
            <PreschoolSorting activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'memory_cards' && (
            <PreschoolMemoryCards activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'creative_extra' && (
            <PreschoolBubblePop activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'coloring' && (
            <PreschoolColoring activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'maze' && (
            <PreschoolMaze activity={activity} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'jigsaw' && (
            <PreschoolJigsaw activity={activity} onComplete={handleInteractionComplete} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-9xl">🌟</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
