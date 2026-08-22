import React, { useEffect, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { isFeatureEnabled } from '../../featureFlags';
import { speakText, speechLangForSubject, stopSpeech as stopSynth } from '../../utils/speech';

export function useLessonSpeech(lesson: CourseLesson, grade: PrimaryGrade) {
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lang = speechLangForSubject(lesson.subject);

  const handleToggleSpeech = () => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSynth();
      setIsSpeaking(false);
      return;
    }
    const textToRead = [lesson.titleAr, lesson.summaryAr, ...(lesson.rulesAr || [])].filter(Boolean).join('. ');
    setIsSpeaking(true);
    void speakText(textToRead, lang).then(() => setIsSpeaking(false));
  };

  const speakBlock = (text: string) => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (!text) return;
    void speakText(text, lang);
  };

  const renderSpeakButton = (text: string | undefined, label: string) =>
    isYoungGrade && text ? (
      <button
        type="button"
        onClick={() => speakBlock(text)}
        title={`استمع: ${label}`}
        className="shrink-0 w-7 h-7 rounded-full bg-[var(--brand-blue)]/15 hover:bg-[var(--brand-blue)]/25 text-[var(--brand-blue-dark)] flex items-center justify-center cursor-pointer text-sm"
      >
        🔊
      </button>
    ) : null;

  const stopSpeech = () => {
    stopSynth();
    setIsSpeaking(false);
  };

  useEffect(() => {
    stopSpeech();
    return () => {
      stopSynth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  return { isYoungGrade, isSpeaking, handleToggleSpeech, renderSpeakButton, stopSpeech };
}
