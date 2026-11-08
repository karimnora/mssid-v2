import { PreschoolEvidence, resolvedPlayQuality } from './preschoolEvidence';
import { PreschoolDiscoveryScene } from './PreschoolDiscoveryArt';
import React, { useEffect, useRef, useState } from 'react';
import { useActivityExitGuard } from '../../context/ActivityExitContext';
import { motion, AnimatePresence } from 'motion/react';
import { Info, RotateCcw } from 'lucide-react';
import { isPlaySuccess, PreschoolActivity, PreschoolLanguage, PreschoolPlayQuality } from '../../data/preschool/types';
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
import { PreschoolSequence } from './PreschoolSequence';
import { PreschoolListenTap } from './PreschoolListenTap';
import { PreschoolStoryOrder } from './PreschoolStoryOrder';
import { PreschoolQuranListen } from './PreschoolQuranListen';
import { PreschoolWordEcho } from './PreschoolWordEcho';
import { usePreschoolSpeech } from './usePreschoolAudio';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import { voiceEchoSupported } from '../../hooks/useVoiceEcho';
import { activityPicture } from './preschoolGlyphs';

interface PreschoolActivityPlayerProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  hasNext: boolean;
  /** Real success: marks the activity done (badges, daily challenge, path stars). */
  onComplete: (quality?: PreschoolPlayQuality) => void;
  /** Record an attempt without leaving the current activity or awarding completion. */
  onAttempt?: (quality: PreschoolPlayQuality) => void;
  /** Advance without marking done — parent/child is never blocked, progress stays honest. */
  onSkip: () => void;
  onExit: () => void;
}

// Orchestrates one activity: speaks the prompt on entry, renders the right interaction widget for
// activity.interactionType, and reacts (mascot + voice) on success before handing control back to
// the path view. Session length stays short by construction — one activity, one clear finish line.
export const PreschoolActivityPlayer: React.FC<PreschoolActivityPlayerProps> = ({
  activity, language, hasNext, onComplete, onAttempt, onSkip, onExit,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [mood, setMood] = useState<MascotMood>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEcho, setShowEcho] = useState(false);
  const [showParentTip, setShowParentTip] = useState(false);
  const [showAttemptNotice, setShowAttemptNotice] = useState(false);
  const [hasWork, setHasWork] = useState(false);
  const requestLeave = useActivityExitGuard(hasWork && !showSuccess && !showEcho, language);
  const { speak, stop, hasVoice } = usePreschoolSpeech(language);
  const content = activity.i18n[language];
  const echoWord = activity.echoWord?.[language];
  const wantsEcho = Boolean(echoWord) && voiceEchoSupported();
  // Previously gated on `language === 'ar'`, so a missing French/English TTS voice failed silently
  // — the child would get no audio at all and the parent had no idea why. Arabic voices are the
  // rarest on-device (hence the original focus), but the same device-settings fix applies to all 3.
  const missingVoice = !hasVoice && !content.promptAudioSrc;
  const interactedRef = useRef(false);
  const replayUsedRef = useRef(false);
  const assistedRef = useRef(false);
  const mistakeReportedRef = useRef(false);
  const qualityRef = useRef<PreschoolPlayQuality>('done');
  const completionTimerRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(true);
  const completionRequestedRef = useRef(false);
  const completionPublishedRef = useRef(false);
  const activityKey = `${activity.id}:${language}`;
  const currentActivityRef = useRef(activityKey);
  currentActivityRef.current = activityKey;

  const isCurrentActivity = () => mountedRef.current && currentActivityRef.current === activityKey;
  const finishActivity = (quality: PreschoolPlayQuality) => {
    if (!isCurrentActivity() || completionPublishedRef.current) return;
    completionPublishedRef.current = true;
    onComplete(quality);
  };

  useEffect(() => {
    mountedRef.current = true;
    completionRequestedRef.current = false;
    completionPublishedRef.current = false;
    qualityRef.current = 'done';
    assistedRef.current = false;
    mistakeReportedRef.current = false;
    setMood('idle');
    setShowSuccess(false);
    setShowEcho(false);
    setShowParentTip(false);
    setShowAttemptNotice(false);
    setHasWork(false);
    interactedRef.current = false;
    replayUsedRef.current = false;
    const first = window.setTimeout(() => speak(content.promptAudio, content.promptAudioSrc), 350);
    const skipReplay = activity.interactionType === 'quran_listen';
    const replay = skipReplay
      ? undefined
      : window.setTimeout(() => {
        if (interactedRef.current || replayUsedRef.current) return;
        replayUsedRef.current = true;
        speak(content.promptAudio, content.promptAudioSrc);
      }, 8350);
    return () => {
      mountedRef.current = false;
      window.clearTimeout(first);
      if (replay) window.clearTimeout(replay);
      window.clearTimeout(completionTimerRef.current);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity.id, language]);

  const markInteracted = () => {
    interactedRef.current = true;
  };

  const handleInteractionComplete = (quality: PreschoolPlayQuality = 'done') => {
    if (!isCurrentActivity() || completionRequestedRef.current) return;
    interactedRef.current = true;
    if (!isPlaySuccess(quality)) assistedRef.current = true;
    quality = resolvedPlayQuality(activity, quality, assistedRef.current);
    qualityRef.current = quality;
    if (!isPlaySuccess(quality)) {
      setMood('idle');
      setShowSuccess(false);
      setShowAttemptNotice(true);
      speak(t(
        'أَحْسَنْتَ أَنَّكَ جَرَّبْتَ. نُعِيدُ مَرَّةً أُخْرَى؟',
        'Bravo d’avoir essayé. On peut recommencer.',
        'Nice try. We can do it again.',
      ));
      onAttempt?.(quality);
      return;
    }
    completionRequestedRef.current = true;
    setShowAttemptNotice(false);
    setMood('happy');
    setShowSuccess(true);
    if (content.successAudio) speak(content.successAudio, content.successAudioSrc);
    const recordedRewardDelay = content.successAudioSrc && content.successAudioDurationMs
      ? content.successAudioDurationMs + 150 : 0;
    if (wantsEcho && echoWord) {
      completionTimerRef.current = window.setTimeout(() => {
        if (!isCurrentActivity()) return;
        setShowSuccess(false);
        setShowEcho(true);
      }, Math.max(900, recordedRewardDelay));
      return;
    }
    completionTimerRef.current = window.setTimeout(() => finishActivity(quality), Math.max(1400, recordedRewardDelay));
  };

  const reportMistake = () => {
    assistedRef.current = true;
    if (mistakeReportedRef.current) return;
    mistakeReportedRef.current = true;
    // Some mechanics detect a drop inside a state updater. Publish after that render finishes.
    queueMicrotask(() => { if (isCurrentActivity()) onAttempt?.('tried'); });
  };

  const replayPrompt = () => speak(content.promptAudio, content.promptAudioSrc);

  return (
    <PreschoolEvidence.Provider value={reportMistake}>
    <div dir={dir} className="preschool-safe-top min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-sky-100 px-4 py-6 flex flex-col">
      {['values-bismillah', 'values-alhamdulillah'].includes(activity.id) && <p role="status" className="max-w-lg mx-auto text-base font-bold text-orange-900 mb-3">{t('التسجيل البشري لهذا النشاط قيد الإعداد. رافق طفلك في النطق.', 'L’enregistrement humain de cette activité est en préparation. Accompagnez votre enfant à l’oral.', 'The human recording is being prepared. Please guide your child aloud.')}</p>}
      <div className="flex items-center justify-between max-w-lg w-full mx-auto mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => requestLeave(onExit)}
            className="min-h-[60px] min-w-[60px] flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100"
            aria-label={t('رُجُوع', 'Retour', 'Back')}
            title={t('رُجُوع', 'Retour', 'Back')}
          >
            {dir === 'rtl' ? '▶' : '◀'}
          </button>
          <PreschoolMuteButton language={language} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={replayPrompt}
            className="min-h-[60px] min-w-[60px] flex items-center justify-center rounded-2xl bg-white shadow-md hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100 text-orange-700"
            aria-label={missingVoice ? t('لا يوجد صوت', 'Pas de voix', 'No voice') : t('إعادة الاستماع', 'Réécouter', 'Replay')}
            title={missingVoice ? t('لا يوجد صوت على هذا الجهاز، اضغط على "نصيحة لولي الأمر"', 'Pas de voix sur cet appareil — voir « Astuce pour le parent »', 'No voice on this device — see "Tip for the grown-up"') : t('استمع للصوت', 'Écouter à nouveau', 'Listen again')}
          >
            {missingVoice ? <Info className="w-5 h-5" strokeWidth={2.5} /> : <RotateCcw className="w-5 h-5" strokeWidth={2.5} />}
          </button>

          {/* Skip never blocks — but it must not count as a success (badges / défi / path stars). */}
          <button
            onClick={() => hasNext ? onSkip() : requestLeave(onSkip)}
            className="min-h-[60px] min-w-[60px] px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-50 active:scale-95 text-orange-800 shadow-md text-sm font-black flex items-center gap-2 cursor-pointer transition-all border border-orange-200"
            title={hasNext ? t('تخطي', 'Passer', 'Skip') : t('خروج', 'Quitter', 'Leave')}
          >
            <span>{hasNext ? t('تخطي', 'Passer', 'Skip') : t('خروج', 'Quitter', 'Leave')}</span>
            <span className="text-lg">{hasNext ? '⏩' : '🏠'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 max-w-lg w-full mx-auto flex-1 justify-start">
        <PreschoolDiscoveryScene activityId={activity.id}/>
        <PreschoolMascot mood={mood} />

        <h2 className="text-xl sm:text-2xl font-black text-orange-900 text-center">{content.title}</h2>
        {content.instructionText && <p className="text-base font-bold leading-relaxed text-orange-900 text-center max-w-md" data-preschool-instruction>{content.instructionText}</p>}

        {/* promptText is a caption for the accompanying adult, never required reading for the
            child (see types.ts) — kept collapsed by default so the child's screen only ever shows
            the mascot talking directly to them, not an instruction addressed to a parent. */}
        {(content.promptText || missingVoice) && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => { assistedRef.current = true; if (!showParentTip) onAttempt?.('helped'); setShowParentTip((v) => !v); }}
              className="min-h-[60px] min-w-[60px] text-[11px] font-bold text-orange-700/60 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>ℹ️</span>
              <span>{t('نصيحة لولي الأمر', 'Astuce pour le parent', 'Tip for the grown-up')}</span>
            </button>
            {showParentTip && (
              <div className="text-xs text-orange-700/70 text-center max-w-xs bg-white/60 rounded-xl px-3 py-2 border border-orange-100 space-y-1.5">
                {content.promptText && <p>{content.promptText}</p>}
                {missingVoice && (
                  <p>
                    {t(
                      'لا يوجد صوت عربي على هذا الجهاز. ثبّت حزمة تحويل النص إلى كلام (العربية) من إعدادات الهاتف.',
                      'Pas de voix française sur cet appareil. Installe la voix française dans les réglages du téléphone.',
                      'No English voice on this device. Install the English voice pack in your phone settings.',
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div
          key={activity.id}
          onPointerDownCapture={() => setHasWork(true)}
          onClickCapture={() => setHasWork(true)}
          className="mt-4 w-full flex items-center justify-center"
          onPointerDown={markInteracted}
        >
          {showEcho && echoWord ? (
            <PreschoolWordEcho
              picture={activityPicture(activity, language)}
              word={echoWord}
              language={language}
              onDone={() => finishActivity(qualityRef.current)}
            />
          ) : (
            <>
          {activity.interactionType === 'tap_choice' && (
            <PreschoolTapChoice activity={activity} language={language} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'drag_drop' && (
            <PreschoolDragDrop activity={activity} language={language} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'trace' && (
            <PreschoolTrace activity={activity} language={language} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'find_path' && (
            <PreschoolFindPath activity={activity} language={language} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'connect_dots' && (
            <PreschoolConnectDots activity={activity} language={language} onComplete={handleInteractionComplete} />
          )}
          {activity.interactionType === 'sorting' && (
            <PreschoolSorting activity={activity} language={language} onComplete={handleInteractionComplete} />
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
          {activity.interactionType === 'sequence' && (
            <PreschoolSequence
              activity={activity}
              language={language}
              onComplete={handleInteractionComplete}
            />
          )}
          {activity.interactionType === 'listen_tap' && (
            <PreschoolListenTap
              activity={activity}
              language={language}
              onComplete={handleInteractionComplete}
            />
          )}
          {activity.interactionType === 'quran_listen' && (
            <PreschoolQuranListen
              activity={activity}
              language={language}
              onComplete={handleInteractionComplete}
            />
          )}
          {activity.interactionType === 'story_order' && (
            <PreschoolStoryOrder
              activity={activity}
              language={language}
              onComplete={handleInteractionComplete}
            />
          )}
            </>
          )}
        </div>
        {showAttemptNotice && (
          <p role="status" className="mt-4 text-center font-bold text-orange-900">
            {t('يُمْكِنُكَ مُوَاصَلَةُ الرَّسْمِ أَوِ المُحَاوَلَةُ مِنْ جَدِيد.',
              'Tu peux continuer à tracer ou recommencer.',
              'You can keep tracing or try again.')}
          </p>
        )}
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
    </PreschoolEvidence.Provider>
  );
};
