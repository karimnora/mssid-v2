import React, { useMemo, useState } from 'react';
import { Play, Pause, Square, Speaker, ChevronDown } from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';
import { useLocaleContext } from '../context/LocaleContext';

const SPEED_OPTIONS = [0.75, 1, 1.25] as const;

export const TextToSpeechButton: React.FC<{ text: string }> = ({ text }) => {
  const { locale, t } = useLocaleContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [speed, setSpeed] = useState< (typeof SPEED_OPTIONS)[number] >(1);

  const lang = useMemo(() => {
    if (locale === 'ar') return 'ar-SA';
    if (locale === 'fr') return 'fr-FR';
    return 'en-US';
  }, [locale]);

  const handlePlay = async () => {
    if (isPaused) {
      handleResume();
      return;
    }
    setIsPlaying(true);
    setIsPaused(false);
    await speakText(text, lang, speed);
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100/90 border border-slate-300 p-2 shadow-sm text-slate-700 text-xs">
      <button
        type="button"
        onClick={isPlaying ? handlePause : handlePlay}
        className="inline-flex items-center gap-1 rounded-2xl bg-indigo-600 text-white px-3 py-2 font-bold shadow-sm hover:bg-indigo-700 transition"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
        {isPlaying ? t('common', 'pause') : t('common', 'play')}
      </button>
      <button
        type="button"
        onClick={handleStop}
        className="inline-flex items-center gap-1 rounded-2xl bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300 transition"
      >
        <Square className="w-4 h-4" /> {t('common', 'stop')}
      </button>
      <div className="flex items-center gap-1 text-[11px] text-slate-600">
        <Speaker className="w-4 h-4" />
        <span>{speed}x</span>
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsSpeedMenuOpen((open) => !open)}
          className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
        >
          {t('common', 'speed')}
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {isSpeedMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 rounded-2xl border border-slate-200 bg-white shadow-lg p-2 z-10">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSpeed(option);
                  setIsSpeedMenuOpen(false);
                }}
                className={`w-full text-left px-2 py-1 rounded-xl text-xs ${speed === option ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {option}x
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
