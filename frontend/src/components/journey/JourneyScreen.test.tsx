import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { JourneyScreen } from './JourneyScreen';
import { LocaleProvider } from '../../context/LocaleContext';
import type { CourseLesson, UserProfile } from '../../types';
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ authUser: { id: 7, role: 'ROLE_FREE' } }) }));
vi.mock('../../utils/speech', () => ({ stopSpeech: vi.fn(), speakText: vi.fn().mockResolvedValue(undefined) }));
vi.mock('../home/DidouVillageHome', () => ({ DidouVillageHome: ({ connection }: any) => <><button onClick={connection.onOpenPilot}>Cours réel</button><button onClick={connection.onOpenDemo}>Démo séparée</button></> }));
vi.mock('../LessonViewer', () => ({ LessonViewer: (props: any) => <><p>{props.demo ? 'Démonstration' : 'Leçon normale'}</p><button onClick={() => { props.onCompleteQuiz(props.lesson.id, 15); props.onQuizFullyValidated?.(props.lesson.id); props.onPracticeResult?.(props.lesson.id, { outcome: 'success', helped: false }); }}>Terminer</button></> }));
beforeEach(() => { localStorage.clear(); localStorage.setItem('mssid_locale_preference', 'ar'); });
function mount() {
  const onCompleteQuiz = vi.fn(), onQuizFullyValidated = vi.fn(), onPracticeResult = vi.fn();
  render(<LocaleProvider><JourneyScreen grade="5AP" courses={[{ id: 'math-5ap-fractions', grade: '5AP', subject: 'math', titleAr: 'Fractions', quiz: [] } as unknown as CourseLesson]} userProfile={{ name: 'Test', quizFullyValidatedLessonIds: [] } as unknown as UserProfile} onExit={vi.fn()} onOpenCourses={vi.fn()} onOpenStories={vi.fn()} onOpenMath={vi.fn()} onOpenLabs={vi.fn()} onOpenGames={vi.fn()} onOpenExams={vi.fn()} onOpenParents={vi.fn()} isLessonLocked={() => false} onLessonLocked={vi.fn()} onCompleteQuiz={onCompleteQuiz} onQuizFullyValidated={onQuizFullyValidated} onQuizMiss={vi.fn()} onPracticeResult={onPracticeResult} /></LocaleProvider>);
  return { onCompleteQuiz, onQuizFullyValidated, onPracticeResult };
}
it('a free child opening the actual village course keeps normal scores, validation and notebook callbacks', () => {
  const actions = mount(); fireEvent.click(screen.getByRole('button', { name: 'Cours réel' }));
  expect(screen.getByText('Leçon normale')).toBeVisible(); fireEvent.click(screen.getByRole('button', { name: 'Terminer' }));
  expect(actions.onCompleteQuiz).toHaveBeenCalledWith('math-5ap-fractions', 15);
  expect(actions.onQuizFullyValidated).toHaveBeenCalledWith('math-5ap-fractions');
  expect(actions.onPracticeResult).toHaveBeenCalled();
});
it('only the explicitly separate demo is isolated from the child profile', () => {
  const actions = mount(); fireEvent.click(screen.getByRole('button', { name: 'Démo séparée' }));
  expect(screen.getByText('Démonstration')).toBeVisible(); fireEvent.click(screen.getByRole('button', { name: 'Terminer' }));
  expect(actions.onCompleteQuiz).not.toHaveBeenCalled(); expect(actions.onQuizFullyValidated).not.toHaveBeenCalled(); expect(actions.onPracticeResult).not.toHaveBeenCalled();
});
