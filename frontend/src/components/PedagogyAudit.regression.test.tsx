import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { ExamsViewer } from './ExamsViewer';
import { speakText } from '../utils/speech';
import { ChallengesArena } from './ChallengesArena';
import { LessonQuizPanel } from './lessonViewer/LessonQuizPanel';
import { LocaleProvider } from '../context/LocaleContext';
import { CHALLENGES_DATA } from '../data/challengesData';
import { COURSES_DATA } from '../data/coursesData';
import { stripArabicTashkeel } from '../utils/textFormatter';
vi.mock('./preschool/usePreschoolAudio', () => ({ playSuccessChime: vi.fn(), playGentleNudge: vi.fn(), playModuleCompleteFanfare: vi.fn() }));

vi.mock('../utils/speech', async importOriginal => ({ ...(await importOriginal<typeof import('../utils/speech')>()), speakText: vi.fn().mockResolvedValue(undefined), useVoiceAvailable: () => true }));

describe('pedagogy audit regressions', () => {
  it('keeps challenge speakers outside answer buttons and preserves the recorded cue', () => {
    render(<LocaleProvider><ChallengesArena grade="1AP" onChallengeComplete={vi.fn()} /></LocaleProvider>);
    fireEvent.click(document.querySelector('[data-challenge-id]')!);
    expect(document.querySelector('button button')).toBeNull();
    const speaker = document.querySelector('[data-tap-speak="q-0"]')!;
    expect(speaker).toBeTruthy();
    fireEvent.click(speaker);
    const spoken = vi.mocked(speakText).mock.calls.at(-1)?.[0];
    const card = document.querySelector('[data-tap-speak="q-0"]')?.parentElement;
    const question = card?.querySelector('h3')?.textContent;
    expect(spoken).toBe(question?.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
    cleanup();
  });
  it('reads French exam content using French', () => {
    render(<LocaleProvider><ExamsViewer grade="3AP" /></LocaleProvider>);
    fireEvent.click(document.querySelector('[data-exam-subject="french"]')!);
    fireEvent.click(screen.getAllByText('فتح ورقة الامتحان')[0]);
    fireEvent.click(document.querySelector('[data-tap-speak="ex-0-body"]')!);
    expect(speakText).toHaveBeenLastCalledWith(expect.any(String), 'fr-FR', 0.85);
    cleanup();
  });
  it.each([
    ['arabic-1ap-t3-tanween', 3], ['arabic-2ap-t2-personal-pronouns', 3],
    ['arabic-2ap-t2-tanween-three-types', 0], ['arabic-3ap-t1-conjugation-past-present', 2],
  ] as const)('keeps quiz choices distinct with vocalization off: %s', (id, index) => {
    const lesson = COURSES_DATA.find(item => item.id === id)!;
    render(<LocaleProvider><LessonQuizPanel lesson={lesson} shuffledQuiz={[lesson.quiz[index]]} selectedAnswers={{}} recentAnswerId={null}
      renderArabicText={text => stripArabicTashkeel(text ?? '')} onSelectOption={vi.fn()} onShuffle={vi.fn()} onReset={vi.fn()} /></LocaleProvider>);
    const labels = [...document.querySelectorAll('button span.min-w-0.break-words')].map(node => node.textContent);
    expect(labels.length).toBe(lesson.quiz[index].options.length);
    expect(labels.every(label => !!label?.trim())).toBe(true);
    expect(new Set(labels).size).toBe(labels.length);
    cleanup();
  });
});
