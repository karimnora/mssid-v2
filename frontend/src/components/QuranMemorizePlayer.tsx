import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Pause, Play, Square, Volume2 } from 'lucide-react';
import type { IslamicQuranVerseItem } from '../types';
import {
  BASMALA_AR,
  QURAN_RECITER_AR,
  QURAN_RECITER_RIWAYAH_AR,
  surahNumberFromName,
} from '../data/quranRecitation';
import { useQuranRecitation } from '../hooks/useQuranRecitation';
import { useVoiceEcho } from '../hooks/useVoiceEcho';
import { ConfettiBurst } from './lessonViewer/ConfettiBurst';
import { playSuccessChime } from './preschool/usePreschoolAudio';

export const QuranMemorizePlayer: React.FC<{
  verses: IslamicQuranVerseItem[];
  variant?: 'kid' | 'lab';
  onSurahComplete?: () => void;
}> = ({ verses, variant = 'lab', onSurahComplete }) => {
  const kid = variant === 'kid';
  const nameAr = verses[0]?.surahAr ?? '';
  const surahNumber = surahNumberFromName(nameAr);
  const [ayahIdx, setAyahIdx] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const echo = useVoiceEcho();
  const recitation = useQuranRecitation({
    surahNumber,
    ayahCount: verses.length,
    onAyahIndex: setAyahIdx,
    onSurahComplete: () => {
      setCelebrate(true);
      playSuccessChime();
      window.setTimeout(() => setCelebrate(false), 2200);
      onSurahComplete?.();
    },
  });

  if (!verses.length) return null;

  const playing = recitation.mode !== 'idle';
  const hit = 'w-full min-h-[72px] text-base sm:text-lg';
  const selected = verses[Math.min(ayahIdx, verses.length - 1)]!;
  const firstIsBasmala = verses[0]?.verseAr.includes('بِسْمِ');
  const barBg = kid ? 'bg-[#FFFBF0]' : 'bg-emerald-950';

  const stopAll = () => {
    recitation.stop();
    if (echo.phase === 'recording') echo.stop();
    if (echo.phase === 'playing') echo.reset();
  };

  return (
    <div className="space-y-4 min-w-0" dir="rtl" data-quran-player={variant}>
      <div className={`sticky top-0 z-20 -mx-1 px-1 pt-1 pb-3 space-y-2 ${barBg}`}>
        <motion.button
          type="button"
          data-quran-recite="surah"
          aria-label={playing && recitation.mode === 'surah' ? 'إيقاف تلاوة السورة' : 'استمع لتلاوة السورة'}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            echo.reset();
            playing && recitation.mode === 'surah' ? recitation.stop() : recitation.playSurah(0);
          }}
          className={`${hit} rounded-3xl px-4 font-black cursor-pointer inline-flex items-center justify-center gap-2 bg-[#008751] text-white border-2 border-emerald-300`}
        >
          {playing && recitation.mode === 'surah' ? <Pause className="w-7 h-7 shrink-0" /> : <Play className="w-7 h-7 shrink-0" />}
          {playing && recitation.mode === 'surah' ? 'إيقاف' : kid ? '▶ اسمَع السورة' : 'استمع للسورة'}
        </motion.button>
        <motion.button
          type="button"
          data-quran-recite="ayah"
          aria-label={playing && recitation.mode === 'ayah' ? 'إيقاف تلاوة الآية' : 'استمع لتلاوة الآية'}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            echo.reset();
            playing && recitation.mode === 'ayah' ? recitation.stop() : recitation.playAyah(ayahIdx);
          }}
          className={`${hit} rounded-3xl px-4 font-black cursor-pointer inline-flex items-center justify-center gap-2 bg-[#F59E0B] text-slate-950 border-2 border-amber-300`}
        >
          {playing && recitation.mode === 'ayah' ? <Pause className="w-7 h-7 shrink-0" /> : <Play className="w-7 h-7 shrink-0" />}
          {playing && recitation.mode === 'ayah' ? 'إيقاف الآية' : kid ? '▶ اسمَع الآية' : 'استمع للآية'}
        </motion.button>

        {echo.phase === 'unsupported' ? (
          <p className="text-xs font-bold text-center text-[#0f172a] bg-white rounded-2xl px-3 py-3 border-2 border-[#E7E2D7]">
            الميكروفون غير متاح هنا. يمكنك الاستماع للشيخ.
          </p>
        ) : echo.phase !== 'recording' ? (
          <motion.button
            type="button"
            data-quran-mic="record"
            aria-label="سجّل صوتك"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              recitation.stop();
              void echo.start();
            }}
            className={`${hit} rounded-3xl px-4 font-black cursor-pointer inline-flex items-center justify-center gap-2 bg-white text-[#0f172a] border-2 border-[#E7E2D7]`}
          >
            <Mic className="w-7 h-7 shrink-0 text-[#C42A23]" />
            {kid ? '🎤 أنا أقرأ' : 'سجّل صوتك'}
          </motion.button>
        ) : (
          <motion.button
            type="button"
            data-quran-mic="stop"
            aria-label="إيقاف التسجيل"
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.stop()}
            className={`${hit} rounded-3xl px-4 font-black cursor-pointer inline-flex items-center justify-center gap-2 bg-[#C42A23] text-white`}
          >
            <Square className="w-6 h-6 shrink-0" />
            {kid ? '⏹ توقّف' : 'إيقاف التسجيل'}
          </motion.button>
        )}
        {(echo.phase === 'ready' || echo.phase === 'playing') && (
          <motion.button
            type="button"
            data-quran-mic="play"
            aria-label="استمع لصوتك"
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.play()}
            className={`${hit} rounded-3xl px-4 font-black cursor-pointer inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white`}
          >
            <Volume2 className="w-7 h-7 shrink-0" />
            {kid ? '👂 صوتي' : 'استمع لصوتك'}
          </motion.button>
        )}
      </div>

      {echo.phase === 'denied' && (
        <p className="text-xs font-bold text-center text-[#C42A23] bg-white rounded-2xl px-3 py-2">
          لم يُسمح بالميكروفون. يمكنك الاستماع للشيخ دون تسجيل.
        </p>
      )}
      {echo.failed && echo.phase !== 'denied' && (
        <p className="text-xs font-bold text-center text-[#C42A23] bg-white rounded-2xl px-3 py-2">
          تعذّر سماع صوتك. أعد التسجيل ثم اضغط «استمع لصوتك».
        </p>
      )}

      <p className={`text-center font-bold text-emerald-800 ${kid ? 'text-sm' : 'text-xs'}`}>
        {QURAN_RECITER_RIWAYAH_AR} — {QURAN_RECITER_AR}
      </p>
      {recitation.failed && (
        <p className="text-xs font-bold text-center text-[#C42A23] bg-white/90 rounded-2xl px-3 py-2">
          تعذّر تشغيل التلاوة. تحقّق من الاتصال ثم أعد المحاولة.
        </p>
      )}

      <div className={`relative p-4 sm:p-5 rounded-3xl border space-y-3 ${
        kid ? 'bg-white border-[#E7E2D7]' : 'bg-slate-950 border-emerald-800'
      }`}>
        <p className={`text-center font-black ${kid ? 'text-base text-emerald-800' : 'text-xs text-amber-400'}`}>
          {nameAr}
        </p>
        {!firstIsBasmala && (
          <p
            data-quran-basmala
            className={`w-full p-3 rounded-2xl font-serif text-center ${
              kid ? 'text-emerald-900 bg-[#FFF8E7]' : 'text-amber-100/80'
            }`}
          >
            {BASMALA_AR}
          </p>
        )}
        <div className="space-y-2" data-full-surah={nameAr} data-quran-playing-ayah={recitation.playingAyah ?? undefined}>
          {verses.map((v, idx) => (
            <button
              key={`${v.surahAr}-${idx}`}
              type="button"
              onClick={() => {
                stopAll();
                setAyahIdx(idx);
              }}
              className={`w-full min-w-0 min-h-[60px] p-3 sm:p-4 rounded-2xl border text-right cursor-pointer font-serif leading-loose text-lg ${
                ayahIdx === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md font-bold'
                  : kid
                    ? 'bg-[#FFFBF0] border-[#E7E2D7] text-[#0f172a]'
                    : 'bg-emerald-900/80 border-emerald-800 text-amber-100'
              }`}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/10 text-xs font-sans font-black ml-2 align-middle">
                {idx + 1}
              </span>
              <span className="break-words">{v.verseAr}</span>
            </button>
          ))}
        </div>
      </div>

      {!kid && (
        <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-800 space-y-1">
          <p className="text-xs font-black text-emerald-400">المعنى البسيط:</p>
          <p className="text-sm font-bold text-slate-200 leading-relaxed">{selected.meaningAr}</p>
        </div>
      )}

      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden rounded-3xl bg-[#008751] text-white text-center py-6 px-4 font-black text-xl"
            data-quran-celebrate
          >
            <ConfettiBurst />
            {kid ? '🌟 أحسنت! أحفظتَ السورة 🌟' : 'أحسنت — أكملتَ تلاوة السورة'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
