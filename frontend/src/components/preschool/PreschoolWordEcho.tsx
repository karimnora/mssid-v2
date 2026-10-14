import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { useVoiceEcho } from '../../hooks/useVoiceEcho';
import { usePreschoolSpeech } from './usePreschoolAudio';
import { PreschoolAsset } from './PreschoolAsset';

interface PreschoolWordEchoProps {
  picture: string;
  word: string;
  language: PreschoolLanguage;
  onDone: () => void;
}

const hit = 'w-full min-h-[72px] text-base font-black';

/** Hear the word, say it, hear yourself — never a gate: Continuer always works. */
export const PreschoolWordEcho: React.FC<PreschoolWordEchoProps> = ({
  picture, word, language, onDone,
}) => {
  const echo = useVoiceEcho();
  const { speak, stop } = usePreschoolSpeech(language);

  useEffect(() => {
    const t = window.setTimeout(() => speak(word), 250);
    return () => { window.clearTimeout(t); stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, language]);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm px-2" data-preschool-echo="word">
      <PreschoolAsset asset={picture} size={96} textClassName="text-7xl leading-none" />
      <p className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center">{word}</p>

      {echo.phase === 'unsupported' || echo.phase === 'denied' ? (
        <>
        <p className="text-sm font-bold text-center text-orange-800 bg-white rounded-2xl px-3 py-2 border-2 border-amber-200">
          {echo.phase === 'denied'
            ? t('لَمْ يُسْمَحْ بِالمِيكْرُوفُون. قُلِ الكَلِمَةَ بِصَوْتٍ عَالٍ!', 'Micro refusé. Dis le mot tout fort !', 'Mic denied. Say the word out loud!')
            : t('قُلِ الكَلِمَةَ بِصَوْتٍ عَالٍ!', 'Dis le mot tout fort !', 'Say the word out loud!')}
        </p>
        {echo.phase === 'denied' && <button type="button" onClick={() => { stop(); void echo.start(); }}
          className={`${hit} rounded-3xl px-4 cursor-pointer bg-white text-[#0f172a] border-2 border-amber-300`}>
          {t('أَعِدْ مُحَاوَلَةَ المِيكْرُوفُون', 'Réessayer le micro', 'Retry microphone')}
        </button>}
        </>
      ) : echo.phase !== 'recording' ? (
        <motion.button
          type="button"
          data-preschool-echo="record"
          aria-label={t('سَجِّلْ صَوْتَك', 'Enregistre ta voix', 'Record your voice')}
          whileTap={{ scale: 0.95 }}
          onClick={() => { stop(); void echo.start(); }}
          className={`${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-[#0f172a] border-2 border-[#E7E2D7]`}
        >
          <Mic className="w-7 h-7 shrink-0 text-[#C42A23]" />
          {t('🎤 أَنَا أَقُول', '🎤 Je dis le mot', '🎤 I say the word')}
        </motion.button>
      ) : (
        <motion.button
          type="button"
          data-preschool-echo="stop"
          aria-label={t('تَوَقَّفْ', 'Stop', 'Stop')}
          whileTap={{ scale: 0.95 }}
          onClick={() => echo.stop()}
          className={`${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-[#C42A23] text-white`}
        >
          <Square className="w-6 h-6 shrink-0" />
          {t('⏹ تَوَقَّفْ', '⏹ Stop', '⏹ Stop')}
        </motion.button>
      )}

      {(echo.phase === 'ready' || echo.phase === 'playing') && (
        <motion.button
          type="button"
          data-preschool-echo="play"
          aria-label={t('اِسْمَعْ صَوْتَك', 'Écoute ta voix', 'Hear your voice')}
          whileTap={{ scale: 0.95 }}
          onClick={() => { stop(); echo.play(); }}
          className={`${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white`}
        >
          <Volume2 className="w-7 h-7 shrink-0" />
          {t('👂 صَوْتِي', '👂 Ma voix', '👂 My voice')}
        </motion.button>
      )}

      {echo.failed && (
        <p role="status" className="text-sm font-bold text-center text-[#C42A23]">
          {t('تَعَذَّرَ تَسْجِيلُ صَوْتِكَ أَوْ تَشْغِيلُهُ. حَاوِلْ مَرَّةً أُخْرَى.', 'Impossible d’enregistrer ou de lire ta voix. Réessaie.', 'Unable to record or play your voice. Try again.')}
        </p>
      )}

      <motion.button
        type="button"
        data-preschool-echo="done"
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        className={`${hit} rounded-3xl px-4 cursor-pointer bg-[#008751] text-white border-2 border-emerald-300`}
      >
        {t('بَعْد!', 'C\'est dit !', 'I said it!')}
      </motion.button>
    </div>
  );
};
