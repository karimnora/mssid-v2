import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { useVoiceEcho } from '../hooks/useVoiceEcho';
import { speakText, stopSpeech } from '../utils/speech';

export type VoiceEchoLang = 'ar' | 'fr' | 'en';

const BCP: Record<VoiceEchoLang, 'ar-SA' | 'fr-FR' | 'en-US'> = {
  ar: 'ar-SA',
  fr: 'fr-FR',
  en: 'en-US',
};

const COPY: Record<VoiceEchoLang, {
  hint: string;
  listen: string;
  record: string;
  stop: string;
  play: string;
  unsupported: string;
  denied: string;
  failed: string;
}> = {
  ar: {
    hint: 'اسمع ثم قُل مثل النموذج',
    listen: 'أسمع النموذج',
    record: 'أقول',
    stop: 'توقّف',
    play: 'صوتي',
    unsupported: 'قُل بصوت عالٍ — الميكروفون غير متاح هنا.',
    denied: 'لم يُسمح بالميكروفون. قُل بصوت عالٍ!',
    failed: 'لم يُحفظ التسجيل. جرّب مرة أخرى.',
  },
  fr: {
    hint: 'Écoute, puis répète le modèle',
    listen: "J'écoute",
    record: 'Je parle',
    stop: 'Stop',
    play: 'Ma voix',
    unsupported: 'Dis-le à voix haute — micro indisponible ici.',
    denied: 'Micro refusé. Dis-le à voix haute !',
    failed: 'Enregistrement vide. Réessaie.',
  },
  en: {
    hint: 'Listen, then say it like the model',
    listen: 'Listen',
    record: 'I speak',
    stop: 'Stop',
    play: 'My voice',
    unsupported: 'Say it out loud — mic unavailable here.',
    denied: 'Mic denied. Say it out loud!',
    failed: 'Nothing recorded. Try again.',
  },
};

export interface VoiceEchoBarProps {
  modelText: string;
  language: VoiceEchoLang;
  /** Extra key so a new word clears the previous take. Defaults to modelText. */
  resetKey?: string;
  /** Parent already has a listen button next to the word. */
  includeListen?: boolean;
  className?: string;
}

const hit = 'min-h-12 min-w-12 px-3 rounded-2xl text-sm font-black cursor-pointer inline-flex items-center justify-center gap-1.5';

/** Optional listen → record → playback. Never a gate — skip by simply not using it. */
export const VoiceEchoBar: React.FC<VoiceEchoBarProps> = ({
  modelText,
  language,
  resetKey,
  includeListen = true,
  className = '',
}) => {
  const echo = useVoiceEcho();
  const copy = COPY[language];
  const text = modelText.trim();
  const identity = resetKey ?? text;

  useEffect(() => {
    echo.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  if (!text) return null;

  const playModel = () => {
    if (echo.phase === 'recording') echo.stop();
    stopSpeech();
    void speakText(text, BCP[language], 0.85);
  };

  const startRecord = () => {
    stopSpeech();
    void echo.start();
  };

  const micBlocked = echo.phase === 'unsupported' || echo.phase === 'denied';

  return (
    <div
      className={`w-full space-y-2 ${className}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      data-voice-echo="bar"
    >
      <p className="text-xs font-bold text-center text-[#0f172a]">{copy.hint}</p>
      <div className="flex flex-wrap items-stretch justify-center gap-2">
        {includeListen && (
          <motion.button
            type="button"
            data-voice-echo="listen"
            aria-label={copy.listen}
            whileTap={{ scale: 0.95 }}
            onClick={playModel}
            className={`${hit} bg-[#008751] text-white border-2 border-emerald-300`}
          >
            <Volume2 className="w-5 h-5 shrink-0" />
            {copy.listen}
          </motion.button>
        )}

        {micBlocked ? (
          <p className="flex-1 min-w-[12rem] text-xs font-bold text-center text-orange-900 bg-white rounded-2xl px-3 py-3 border-2 border-amber-200">
            {echo.phase === 'denied' ? copy.denied : copy.unsupported}
          </p>
        ) : echo.phase !== 'recording' ? (
          <motion.button
            type="button"
            data-voice-echo="record"
            aria-label={copy.record}
            whileTap={{ scale: 0.95 }}
            onClick={startRecord}
            className={`${hit} bg-white text-[#0f172a] border-2 border-[#E7E2D7]`}
          >
            <Mic className="w-5 h-5 shrink-0 text-[#C42A23]" />
            {copy.record}
          </motion.button>
        ) : (
          <motion.button
            type="button"
            data-voice-echo="stop"
            aria-label={copy.stop}
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.stop()}
            className={`${hit} bg-[#C42A23] text-white`}
          >
            <Square className="w-4 h-4 shrink-0" />
            {copy.stop}
          </motion.button>
        )}

        {(echo.phase === 'ready' || echo.phase === 'playing') && (
          <motion.button
            type="button"
            data-voice-echo="play"
            aria-label={copy.play}
            whileTap={{ scale: 0.95 }}
            onClick={() => echo.play()}
            className={`${hit} bg-[#2563EB] text-white`}
          >
            <Volume2 className="w-5 h-5 shrink-0" />
            {copy.play}
          </motion.button>
        )}
      </div>
      {echo.failed && (
        <p className="text-xs font-bold text-center text-[#C42A23]">{copy.failed}</p>
      )}
    </div>
  );
};
