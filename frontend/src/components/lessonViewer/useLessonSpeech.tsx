import React, { useEffect, useRef, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { isFeatureEnabled } from '../../featureFlags';
import { speakText, speechLangForSubject, stopSpeech as stopSynth } from '../../utils/speech';

export function useLessonSpeech(lesson: CourseLesson, grade: PrimaryGrade) {
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const isPlayful1AP = grade === '1AP';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakingKeyRef = useRef<string | null>(null);
  const lang = speechLangForSubject(lesson.subject);
  const snippetRate = isPlayful1AP ? 0.78 : 0.9;

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

  const speakSnippet = (key: string, text: string) => {
    if (!isFeatureEnabled('voiceReading') || !text) return;
    if (speakingKeyRef.current === key) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    speakingKeyRef.current = key;
    setSpeakingKey(key);
    setIsSpeaking(false);
    void speakText(text, lang, snippetRate).then(() => {
      if (speakingKeyRef.current === key) {
        speakingKeyRef.current = null;
        setSpeakingKey(null);
      }
    });
  };

  const renderSpeakButton = (text: string | undefined, label: string) =>
    isYoungGrade && text ? (
      <button
        type="button"
        onClick={() => speakBlock(text)}
        title={`استمع: ${label}`}
        className="shrink-0 hit-target rounded-full bg-[var(--brand-blue)]/15 hover:bg-[var(--brand-blue)]/25 text-[var(--brand-blue-dark)] flex items-center justify-center cursor-pointer text-base"
      >
        🔊
      </button>
    ) : null;

  const stopSpeech = () => {
    stopSynth();
    setIsSpeaking(false);
    speakingKeyRef.current = null;
    setSpeakingKey(null);
  };

  useEffect(() => {
    stopSpeech();
    return () => {
      stopSynth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  return {
    isYoungGrade,
    isPlayful1AP,
    isSpeaking,
    speakingKey,
    handleToggleSpeech,
    speakSnippet,
    renderSpeakButton,
    stopSpeech,
  };
}
