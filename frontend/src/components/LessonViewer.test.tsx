import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseLesson } from '../types';
import { LessonViewer } from './LessonViewer';
import { LocaleProvider } from '../context/LocaleContext';
import { ActivityExitProvider } from '../context/ActivityExitContext';

const lesson: CourseLesson = {
  id: 'math-1ap-t1-spatial-relations',
  grade: '1AP',
  subject: 'math',
  categoryAr: 'فضاء',
  titleAr: 'الفَضَاءُ 🔺',
  summaryAr: 'فوق وتحت',
  discoveryAr: 'أين يوجد المصباح؟',
  sourceNoteAr: 'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ.',
  objectivesAr: [
    'أُمَيِّزُ بَيْنَ "فَوْقَ" وَ "تَحْتَ".',
    'أَقُولُ «بَيْنَ» عِنْدَمَا يَكُونُ الشَّيْءُ فِي الوَسَطِ.',
  ],
  rulesAr: ['فَوْقَ: الشيء في الأعلى.', 'تَحْتَ: الشيء في الأسفل.'],
  examplesAr: [{ problem: 'أين تجلس القطة؟', solution: 'فوق الكرسي.' }],
  quiz: [],
  progressiveExercises: [],
};

const renderViewer = () =>
  render(
    <LocaleProvider><ActivityExitProvider>
      <LessonViewer
        lesson={lesson}
        onBack={vi.fn()}
        onCompleteQuiz={vi.fn()}
      />
    </ActivityExitProvider></LocaleProvider>,
  );

describe('LessonViewer — navigation after lesson content', () => {
  it('places compact navigation after the active lesson content', () => {
    const lesson2ap: CourseLesson = {
      ...lesson,
      id: 'math-2ap-sample',
      grade: '2AP',
      titleAr: 'الأعداد',
      quiz: [{ id: 'q1', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'نعم', isCorrect: true }] }],
    };

    const { container } = render(
      <LocaleProvider><ActivityExitProvider>
        <LessonViewer lesson={lesson2ap} onBack={vi.fn()} onCompleteQuiz={vi.fn()} />
      </ActivityExitProvider></LocaleProvider>,
    );

    const contentPanel = container.querySelector('#lesson-active-step-container')!;
    const footer = container.querySelector('[data-lesson-footer="compact"]')!;
    expect(footer).toHaveClass('static');
    expect(contentPanel.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('places full navigation after the active lesson content on 5AP', () => {
    const lesson5ap: CourseLesson = {
      ...lesson,
      id: 'math-5ap-sample',
      grade: '5AP',
      titleAr: 'الأعداد العشرية',
      quiz: [{ id: 'q1', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'نعم', isCorrect: true }] }],
    };

    const { container } = render(
      <LocaleProvider><ActivityExitProvider>
        <LessonViewer lesson={lesson5ap} onBack={vi.fn()} onCompleteQuiz={vi.fn()} />
      </ActivityExitProvider></LocaleProvider>,
    );

    const contentPanel = container.querySelector('#lesson-active-step-container')!;
    const footer = container.querySelector('[data-lesson-footer="full"]')!;
    expect(footer).toHaveClass('static');
    expect(contentPanel.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe('LessonViewer — printable revision sheet', () => {
  it('exposes the revision-sheet print entry on 1AP (compact grade)', () => {
    renderViewer();
    expect(document.querySelector('[data-lesson-print="true"]')).toBeTruthy();
  });

  it('opens a printable-sheet fiche when the print button is clicked', () => {
    renderViewer();
    fireEvent.click(document.querySelector('[data-lesson-print="true"]') as HTMLElement);
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(document.querySelector('.revision-sheet-toolbar')).toBeTruthy();
    expect(screen.getAllByText(/فيشة مراجعة/).length).toBeGreaterThan(0);
  });
});

describe('LessonViewer — 1AP parent info panel', () => {
  it('offers the parent-info toggle when the lesson has objectives even without a source note', () => {
    renderViewer();
    expect(screen.getByText('معلومة لولي الأمر')).toBeInTheDocument();
  });

  it('shows the learning objectives to a parent who opens the panel, not just the sourcing note', () => {
    renderViewer();
    fireEvent.click(screen.getByText('معلومة لولي الأمر'));
    expect(screen.getByText('سيتعلم طفلك في هذا الدرس:')).toBeInTheDocument();
    expect(screen.getByText(/أُمَيِّزُ بَيْنَ/)).toBeInTheDocument();
    expect(screen.getByText(/مَسِيد DZ/)).toBeInTheDocument();
  });

  it('does not turn the title snippet into a second, redundant tap-to-speak zone', () => {
    const { container } = renderViewer();
    const heroTitle = container.querySelector('[data-lesson-hero="1ap"] h1');
    expect(heroTitle).toBeTruthy();
    expect(heroTitle?.closest('button')).toBeNull();
  });
});

describe('LessonViewer — quiz-in-progress exit guard', () => {
  const quizLesson: CourseLesson = {
    ...lesson,
    id: 'math-3ap-quiz-guard',
    grade: '3AP',
    titleAr: 'الجمع',
    quiz: [
      { id: 'q1', questionAr: 'كم يساوي 2+2؟', options: [{ id: 'a', textAr: '4', isCorrect: true }, { id: 'b', textAr: '5', isCorrect: false }] },
      { id: 'q2', questionAr: 'كم يساوي 3+3؟', options: [{ id: 'a', textAr: '6', isCorrect: true }, { id: 'b', textAr: '7', isCorrect: false }] },
    ],
  };

  const renderQuizLesson = (onBack = vi.fn()) => {
    render(
      <LocaleProvider><ActivityExitProvider>
        <LessonViewer lesson={quizLesson} grade="3AP" onBack={onBack} onCompleteQuiz={vi.fn()} />
      </ActivityExitProvider></LocaleProvider>,
    );
    return onBack;
  };

  // The step strip's AnimatePresence (mode="wait") mounts the quiz panel asynchronously — reading
  // the question/options right after the tab-switch click can miss it entirely.
  const answerFirstQuestionCorrectly = async () => {
    fireEvent.click(screen.getByText('الاختبار التفاعلي (2)'));
    await waitFor(() => expect(screen.getByText('كم يساوي 2+2؟')).toBeInTheDocument());
    fireEvent.click(screen.getByText('4'));
  };

  it('asks for confirmation before leaving once one (but not all) questions are answered correctly', async () => {
    const onBack = renderQuizLesson();
    await answerFirstQuestionCorrectly();

    fireEvent.click(screen.getByText('قائمة الدروس'));

    expect(onBack).not.toHaveBeenCalled();
    expect(screen.getByText('هل تريد الخروج؟')).toBeInTheDocument();
  });

  it('actually leaves once the child confirms', async () => {
    const onBack = renderQuizLesson();
    await answerFirstQuestionCorrectly();
    fireEvent.click(screen.getByText('قائمة الدروس'));

    fireEvent.click(screen.getByText('خروج'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('stays on the lesson when the child chooses to keep going', async () => {
    const onBack = renderQuizLesson();
    await answerFirstQuestionCorrectly();
    fireEvent.click(screen.getByText('قائمة الدروس'));

    fireEvent.click(screen.getByText('متابعة'));

    expect(onBack).not.toHaveBeenCalled();
    expect(screen.queryByText('هل تريد الخروج؟')).not.toBeInTheDocument();
  });

  it('never blocks leaving before any question has been answered', () => {
    const onBack = renderQuizLesson();
    fireEvent.click(screen.getByText('قائمة الدروس'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

// Same guard, same underlying risk (in-memory-only progress), for the progressive exercises tab —
// checkPracticeExercise() feeds the very same kind of awardedExerciseIds set as the quiz does.
describe('LessonViewer — practice-exercise-in-progress exit guard', () => {
  const practiceLesson: CourseLesson = {
    ...lesson,
    id: 'math-3ap-practice-guard',
    grade: '3AP',
    titleAr: 'الطرح',
    quiz: [],
    progressiveExercises: [
      {
        id: 'ex1', level: 1, levelLabelAr: 'أكتشف', type: 'qcm', problemAr: 'كم يساوي 5-2؟', hintsAr: [],
        options: [{ id: 'a', textAr: 'ثلاثة', isCorrect: true }, { id: 'b', textAr: 'اثنان', isCorrect: false }],
        solutionAr: 'ثلاثة', detailedCorrectionAr: '5-2=3', xpReward: 5,
      },
      {
        id: 'ex2', level: 1, levelLabelAr: 'أكتشف', type: 'qcm', problemAr: 'كم يساوي 6-1؟', hintsAr: [],
        options: [{ id: 'a', textAr: 'خمسة', isCorrect: true }, { id: 'b', textAr: 'أربعة', isCorrect: false }],
        solutionAr: 'خمسة', detailedCorrectionAr: '6-1=5', xpReward: 5,
      },
    ],
  };

  const renderPracticeLesson = (onBack = vi.fn()) => {
    render(
      <LocaleProvider><ActivityExitProvider>
        <LessonViewer lesson={practiceLesson} grade="3AP" onBack={onBack} onCompleteQuiz={vi.fn()} />
      </ActivityExitProvider></LocaleProvider>,
    );
    return onBack;
  };

  const answerFirstExerciseCorrectly = async () => {
    fireEvent.click(screen.getByText('أتدرب (2)'));
    await waitFor(() => expect(screen.getByText(/كم يساوي .*5-2.*؟/)).toBeInTheDocument());
    fireEvent.click(screen.getByText('ثلاثة'));
    fireEvent.click(screen.getAllByText('تحقق من الإجابة')[0]);
  };

  it('protects an answer before it has been checked', async () => {
    const onBack = renderPracticeLesson();
    fireEvent.click(screen.getByText('أتدرب (2)'));
    await waitFor(() => expect(screen.getByText(/كم يساوي .*5-2.*؟/)).toBeInTheDocument());
    fireEvent.click(screen.getByText('ثلاثة'));
    fireEvent.click(screen.getByText('قائمة الدروس'));
    expect(onBack).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
    fireEvent.click(screen.getByText('متابعة'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('asks for confirmation before leaving once one (but not all) exercises are answered correctly', async () => {
    const onBack = renderPracticeLesson();
    await answerFirstExerciseCorrectly();

    fireEvent.click(screen.getByText('قائمة الدروس'));

    expect(onBack).not.toHaveBeenCalled();
    expect(screen.getByText('هل تريد الخروج؟')).toBeInTheDocument();
  });

  it('actually leaves once the child confirms', async () => {
    const onBack = renderPracticeLesson();
    await answerFirstExerciseCorrectly();
    fireEvent.click(screen.getByText('قائمة الدروس'));

    fireEvent.click(screen.getByText('خروج'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('LessonViewer — 3AP complete pedagogical path', () => {
  it('keeps every available stage visible rather than hiding an interaction or evaluation', () => {
    const lesson3ap: CourseLesson = {
      ...lesson,
      id: 'math-3ap-sample',
      grade: '3AP',
      titleAr: 'الضرب',
      quiz: [{ id: 'q1', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'نعم', isCorrect: true }] }],
      progressiveExercises: [
        {
          id: 'ex1',
          level: 1,
          levelLabelAr: 'أكتشف',
          problemAr: '2×3',
          hintsAr: [],
          solutionAr: '6',
          detailedCorrectionAr: '2+2+2',
          xpReward: 5,
        },
      ],
      evaluationExercises: [
        {
          id: 'ev1',
          level: 4,
          levelLabelAr: 'أتحدى',
          problemAr: '4×5',
          hintsAr: [],
          solutionAr: '20',
          detailedCorrectionAr: '20',
          xpReward: 8,
        },
      ],
    };

    const { container } = render(
      <LocaleProvider><ActivityExitProvider>
        <LessonViewer lesson={lesson3ap} grade="3AP" onBack={vi.fn()} onCompleteQuiz={vi.fn()} />
      </ActivityExitProvider></LocaleProvider>,
    );

    const strip = container.querySelector('[data-lesson-step-count]');
    expect(strip).toBeTruthy();
    expect(Number(strip?.getAttribute('data-lesson-step-count'))).toBe(5);
  });
});
