import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CourseLesson, PrimaryGrade } from '../../types';
import { useLessonSpeech } from './useLessonSpeech';
import { speakText } from '../../utils/speech';

const voiceFlag = vi.hoisted(() => ({ enabled: true, available: true as boolean | null }));
vi.mock('../../hooks/useFeatureFlag', () => ({ useFeatureFlag: () => voiceFlag.enabled }));
vi.mock('../../utils/speech', () => ({
  speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn(), useVoiceAvailable: () => voiceFlag.available,
  speechLangForSubject: (subject: string) => subject === 'french' ? 'fr-FR' : subject === 'english' ? 'en-US' : 'ar-SA',
}));
const lesson: CourseLesson = { id: 'speech-test', grade: '5AP', subject: 'math', categoryAr: '', titleAr: '', summaryAr: '', rulesAr: [], quiz: [] };

describe('optional lesson reading', () => {
  it.each([false, null])('hides 3AP and upper-grade speakers when the voice availability is %s', available => {
    voiceFlag.enabled = true;
    voiceFlag.available = available;
    const { result } = renderHook(() => useLessonSpeech(lesson, '5AP'));
    expect(result.current.canReadAloud).toBe(false);
    expect(result.current.voiceReadingEnabled).toBe(true);
    const thirdGrade = renderHook(() => useLessonSpeech({ ...lesson, grade: '3AP' }, '3AP'));
    expect(thirdGrade.result.current.canReadAloud).toBe(false);
    voiceFlag.available = true;
  });
  it.each<PrimaryGrade>(['1AP', '2AP'])('preserves early recordings in %s without a TTS voice', grade => {
    voiceFlag.enabled = true;
    voiceFlag.available = false;
    const { result } = renderHook(() => useLessonSpeech({ ...lesson, grade }, grade));
    expect(result.current.canReadAloud).toBe(true);
    voiceFlag.available = true;
  });
  it.each([['english', 'en-US'], ['french', 'fr-FR'], ['science', 'ar-SA']] as const)('reads 3AP %s using %s only on request', async (subject, lang) => {
    voiceFlag.enabled = true;
    voiceFlag.available = true;
    vi.mocked(speakText).mockClear();
    const { result } = renderHook(() => useLessonSpeech({ ...lesson, grade: '3AP', subject }, '3AP'));
    expect(speakText).not.toHaveBeenCalled();
    await act(async () => result.current.speakSnippet('intro', 'Example'));
    expect(speakText).toHaveBeenCalledWith('Example', lang, 0.9);
  });
  it.each<PrimaryGrade>(['1AP', '2AP', '3AP', '4AP', '5AP'])('offers reading in %s', grade => {
    voiceFlag.enabled = true;
    const { result } = renderHook(() => useLessonSpeech({ ...lesson, grade }, grade));
    expect(result.current.canReadAloud).toBe(true);
  });
  it('does not offer an Arabic substitute for Tamazight', () => {
    voiceFlag.enabled = true;
    const { result } = renderHook(() => useLessonSpeech({ ...lesson, subject: 'tamazight' }, '5AP'));
    expect(result.current.canReadAloud).toBe(false);
  });
  it('uses the subject language and respects the voice feature switch', async () => {
    voiceFlag.enabled = true;
    vi.mocked(speakText).mockClear();
    const { result, rerender } = renderHook(() => useLessonSpeech({ ...lesson, subject: 'french' }, '5AP'));
    await act(async () => result.current.speakSnippet('intro', 'Bonjour'));
    expect(speakText).toHaveBeenCalledWith('Bonjour', 'fr-FR', 0.9);
    voiceFlag.enabled = false;
    rerender();
    expect(result.current.canReadAloud).toBe(false);
    vi.mocked(speakText).mockClear();
    await act(async () => result.current.speakSnippet('intro', 'Bonjour'));
    expect(speakText).not.toHaveBeenCalled();
  });
});
