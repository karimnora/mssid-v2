import React, { useEffect, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { isFeatureEnabled } from '../../featureFlags';

export function useLessonSpeech(lesson: CourseLesson, grade: PrimaryGrade) {
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeech = () => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const textToRead = [lesson.titleAr, lesson.summaryAr, ...(lesson.rulesAr || [])].filter(Boolean).join('. ');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const speakBlock = (text: string) => {
    if (!isFeatureEnabled('voiceReading')) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    stopSpeech();
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  return { isYoungGrade, isSpeaking, handleToggleSpeech, renderSpeakButton, stopSpeech };
}
