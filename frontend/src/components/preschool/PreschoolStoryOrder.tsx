import { usePreschoolEvidence } from './preschoolEvidence';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { PreschoolActivity, PreschoolLanguage, PreschoolStoryFrame } from '../../data/preschool/types';
import { playGentleNudge, playSuccessChime, usePreschoolSpeech } from './usePreschoolAudio';
import { PreschoolAsset } from './PreschoolAsset';
import { useVoiceEcho } from '../../hooks/useVoiceEcho';

interface PreschoolStoryOrderProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };
const hit = 'w-full min-h-[72px] text-base font-black';

function shuffleFrames(list: PreschoolStoryFrame[]): PreschoolStoryFrame[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PreschoolStoryOrder: React.FC<PreschoolStoryOrderProps> = ({
  activity, language, onComplete,
}) => {
  const frames = activity.visualAssets.storyFrames ?? [];
  const reportEvidence = usePreschoolEvidence();
  const [order, setOrder] = useState<PreschoolStoryFrame[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [retell, setRetell] = useState(false);
  const doneRef = useRef(false);
  const echo = useVoiceEcho();
  const { speak } = usePreschoolSpeech(language);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  useEffect(() => {
    setOrder(shuffleFrames(frames));
    setPicked([]);
    setWrongId(null);
    setSolved(false);
    setRetell(false);
    setShowModel(false);
    doneRef.current = false;
    echo.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id]);

  useEffect(() => {
    if (!retell) return;
    const line = t('اِحْكِ القِصَّة!', 'Raconte l’histoire !', 'Tell the story!');
    const timer = window.setTimeout(() => speak(line), 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retell, language]);

  const handleTap = (frame: PreschoolStoryFrame) => {
    if (solved || wrongId || picked.includes(frame.id)) return;
    const nextIndex = picked.length + 1;
    if (frame.order !== nextIndex) {
      playGentleNudge();
      reportEvidence();
      setWrongId(frame.id);
      setTimeout(() => {
        setWrongId(null);
        // Keep the successful steps: an error does not erase the story already built.
      }, 450);
      return;
    }
    const next = [...picked, frame.id];
    setPicked(next);
    if (next.length === frames.length && !doneRef.current) {
      doneRef.current = true;
      setSolved(true);
      playSuccessChime();
      setTimeout(() => setRetell(true), 700);
    }
  };

  const ordered = [...frames].sort((a, b) => a.order - b.order);

  if (retell) {
    const micOk = echo.phase !== 'unsupported' && echo.phase !== 'denied';
    return (
      <div
        className="flex flex-col items-center gap-4 w-full max-w-sm rounded-3xl bg-[#FFFBF0] border-2 border-[#E7E2D7] p-4"
        data-preschool-story="retell"
      >
        <p className="text-lg font-black text-center text-[#0f172a]">
          {t('اِحْكِ القِصَّة', 'Raconte l’histoire', 'Tell the story')}
        </p>
        <div className="grid grid-cols-3 gap-2 w-full">
          {ordered.map((frame) => (
            <div
              key={frame.id}
              className="min-h-24 rounded-3xl bg-white border-4 border-emerald-200 flex flex-col items-center justify-center gap-1 px-1 py-2"
            >
              <PreschoolAsset asset={frame.asset} size={44} textClassName="text-3xl leading-none" />
              <span className="text-sm font-black text-[#1E293B] text-center">
                {frame.caption?.[language]}
              </span>
            </div>
          ))}
        </div>

        {micOk && echo.phase !== 'recording' && (
          <motion.button
            type="button"
            data-preschool-story="record"
            aria-label={t('سَجِّلْ صَوْتَك', 'Enregistre ta voix', 'Record your voice')}
            whileTap={{ scale: 0.95 }}
            onClick={() => void echo.start()}
            className={`min-h-[60px] min-w-[60px] ${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-[#0f172a] border-2 border-[#E7E2D7]`}
          >
            <Mic className="w-7 h-7 shrink-0 text-[#C42A23]" />
            {t('🎤 أَنَا أَحْكِي', '🎤 Je raconte', '🎤 I tell it')}
          </motion.button>
        )}
        {micOk && echo.phase === 'recording' && (
          <motion.button
            type="button"
            data-preschool-story="stop"
            aria-label={t('تَوَقَّفْ', 'Stop', 'Stop')}
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.stop()}
            className={`min-h-[60px] min-w-[60px] ${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-[#C42A23] text-white`}
          >
            <Square className="w-6 h-6 shrink-0" />
            {t('⏹ تَوَقَّفْ', '⏹ Stop', '⏹ Stop')}
          </motion.button>
        )}

        {micOk && (echo.phase === 'ready' || echo.phase === 'playing') && (
          <motion.button
            type="button"
            data-preschool-story="play"
            aria-label={t('اِسْمَعْ صَوْتَك', 'Écoute ta voix', 'Hear your voice')}
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.play()}
            className={`min-h-[60px] min-w-[60px] ${hit} rounded-3xl px-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white`}
          >
            <Volume2 className="w-7 h-7 shrink-0" />
            {t('👂 صَوْتِي', '👂 Ma voix', '👂 My voice')}
          </motion.button>
        )}

        <motion.button
          type="button"
          data-preschool-story="done"
          aria-label={t('قُلْتُهَا', "C'est dit !", 'I told it')}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className={`min-h-[60px] min-w-[60px] ${hit} rounded-3xl px-4 cursor-pointer bg-[#008751] text-white border-2 border-emerald-300`}
        >
          {t('قُلْتُهَا', "C'est dit !", 'I told it')}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <button type="button" aria-expanded={showModel} onClick={() => setShowModel(value => !value)} className="min-h-12 rounded-2xl px-4 border border-sky-200 bg-sky-50 text-sky-950 font-bold">
        {t('👀 أَرَى القِصَّة', '👀 Voir l’histoire', '👀 See the story')}
      </button>
      {showModel && <div className="grid grid-cols-3 gap-2 w-full rounded-3xl bg-sky-50 p-3" data-story-model>
        {ordered.map(frame => <div key={frame.id} className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-bold text-sky-900">{frame.order}</span>
          <PreschoolAsset asset={frame.asset} size={44} />
          <span className="text-sm font-bold text-slate-800">{frame.caption?.[language]}</span>
        </div>)}
      </div>}
      <div className="flex items-center gap-2 text-lg font-black text-orange-800">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`min-h-10 min-w-10 rounded-full flex items-center justify-center border-2 ${
              picked.length >= n ? 'bg-emerald-400 border-emerald-600 text-white' : 'bg-white border-amber-200'
            }`}
          >
            {n}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 w-full">
        {order.map((frame) => {
          const caption = frame.caption?.[language];
          const isPicked = picked.includes(frame.id);
          const isWrong = wrongId === frame.id;
          return (
            <motion.button
              key={frame.id}
              type="button"
              onClick={() => handleTap(frame)}
              animate={isWrong ? { x: [0, -8, 8, -8, 0] } : isPicked ? { scale: 1.06 } : { scale: 1 }}
              whileTap={solved ? undefined : { scale: 0.95 }}
              transition={isWrong ? { duration: 0.4 } : spring}
              disabled={solved}
              aria-label={caption ?? frame.asset}
              className={`min-w-[60px] min-h-28 rounded-3xl flex flex-col items-center justify-center gap-1
 shadow-md border-4 cursor-pointer select-none px-1 py-2
 ${isPicked
 ? 'bg-emerald-100 border-emerald-400'
 : isWrong
 ? 'bg-rose-100 border-rose-400'
 : 'bg-white border-amber-200'}`}
            >
              <PreschoolAsset asset={frame.asset} size={52} textClassName="text-4xl leading-none" />
              {caption && (
                <span className="text-sm font-black text-[#1E293B] leading-tight text-center">
                  {caption}
                </span>
              )}
              {isPicked && (
                <span className="text-xs font-black text-emerald-800">
                  {picked.indexOf(frame.id) + 1}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
