import { useEffect, useRef, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { isFeatureEnabled } from '../../featureFlags';
import { speakText, speechLangForSubject, stopSpeech as stopSynth, useVoiceAvailable } from '../../utils/speech';

export function useLessonSpeech(lesson: CourseLesson, grade: PrimaryGrade) {
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const isPlayful1AP = grade === '1AP';
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakingKeyRef = useRef<string | null>(null);
  const lang = speechLangForSubject(lesson.subject);
  const snippetRate = isPlayful1AP ? 0.78 : 0.9;
  const voiceAvailable = useVoiceAvailable(lang);

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
    void speakText(text, lang, snippetRate).then(() => {
      if (speakingKeyRef.current === key) {
        speakingKeyRef.current = null;
        setSpeakingKey(null);
      }
    });
  };

  const stopSpeech = () => {
    stopSynth();
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
    speakingKey,
    speakSnippet,
    stopSpeech,
    voiceAvailable,
  };
}
