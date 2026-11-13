import { useEffect, useRef, useState } from 'react';
import { CourseLesson, PrimaryGrade } from '../../types';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
import { speakText, speechLangForSubject, stopSpeech as stopSynth, stripNonSpokenSymbols, useVoiceAvailable } from '../../utils/speech';
import { findRecordedSpeechSequence } from '../../utils/recordedSpeech';

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
  const voiceReading = useFeatureFlag('voiceReading');
  const voiceReadingEnabled = voiceReading && !isTamazight;
  // Early-grade recordings keep their existing path; upper grades need an installed TTS voice.
  const hasEarlyGradeRecordings = grade === '1AP' || grade === '2AP';
  const canReadAloud = voiceReadingEnabled && (hasEarlyGradeRecordings || rawVoiceAvailable === true);
  const voiceAvailable = isTamazight ? false : rawVoiceAvailable;
  const canSpeakText = (text: string) => voiceReadingEnabled && (
    rawVoiceAvailable === true || (hasEarlyGradeRecordings && !!findRecordedSpeechSequence(stripNonSpokenSymbols(text), lang))
  );

  const speakSnippet = (key: string, text: string) => {
    if (!canReadAloud || !text || !canSpeakText(text)) return;
    if (speakingKeyRef.current === key) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    speakingKeyRef.current = key;
    setSpeakingKey(key);
    const reading = hasEarlyGradeRecordings && rawVoiceAvailable !== true
      ? speakText(text, lang, snippetRate, 1, { recordedOnly: true })
      : speakText(text, lang, snippetRate);
    void reading.then(() => {
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
    canReadAloud,
    canSpeakText,
    voiceReadingEnabled,
    isPlayful1AP,
    speakingKey,
    speakSnippet,
    stopSpeech,
    voiceAvailable,
  };
}
