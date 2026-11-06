import { useEffect, useRef, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { villageLessonConfig } from './villageLessonConfig';
import { pilotVoiceFor } from './villagePilotVoices';
import { isFeatureEnabled } from '../../featureFlags';
import { speakText, speechLangForSubject, stopSpeech as stopSynth, useVoiceAvailable } from '../../utils/speech';

export function useLessonSpeech(lesson: CourseLesson, grade: PrimaryGrade) {
  const isYoungGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const isPlayful1AP = grade === '1AP';
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakingKeyRef = useRef<string | null>(null);
  const lang = speechLangForSubject(lesson.subject);
  const snippetRate = isPlayful1AP ? 0.78 : 0.9;
  const rawVoiceAvailable = useVoiceAvailable(lang);
  // Tamazight content is mostly Tifinagh/Latin-script amazigh — no TTS voice can read it correctly,
  // so the arabic fallback voice would just mispronounce it. Report unavailable instead of guessing.
  const isTamazight = lesson.subject === 'tamazight';
  const voiceAvailable = isTamazight ? false : rawVoiceAvailable;

  const speakSnippet = (key: string, text: string) => {
    if (!isFeatureEnabled('voiceReading') || !text || isTamazight) return;
    if (speakingKeyRef.current === key) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    speakingKeyRef.current = key;
    setSpeakingKey(key);
    void speakText(text, lang, snippetRate, 1, { preferredRecording: villageLessonConfig(lesson) ? pilotVoiceFor(text) : undefined }).then(() => {
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
      speakingKeyRef.current = null;
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
