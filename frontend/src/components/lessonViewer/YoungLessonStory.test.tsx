import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseLesson } from '../../types';
import { YoungLessonStory } from './YoungLessonStory';
import { LessonQuizPanel } from './LessonQuizPanel';
import { LessonExplanationView } from '../LessonExplanationView';
import {
  buildPlayful1APSteps,
  isPlayful1AP,
  parsePlayfulSnippet,
  splitPlayfulLines,
  stripLatinGlosses,
} from './youngLessonLayout';

const spatial: CourseLesson = {
  id: 'math-1ap-t1-spatial-relations',
  grade: '1AP',
  subject: 'math',
  categoryAr: 'فضاء',
  titleAr: 'الفَضَاءُ',
  summaryAr: 'فوق وتحت',
  discoveryAr: 'أين يوجد المصباح؟',
  rulesAr: [
    'فَوْقَ (Sur): الشيء في الأعلى.',
    'تَحْتَ (Sous): الشيء في الأسفل.',
  ],
  examplesAr: [{ problem: 'أين تجلس القطة؟', solution: 'فوق الكرسي.' }],
  quiz: [
    {
      id: 'q1',
      questionAr: 'العصفور فوق الغصن؟',
      options: [
        { id: 'a', textAr: 'فَوْقَ', isCorrect: true, explanationAr: 'نعم' },
        { id: 'b', textAr: 'تَحْتَ', isCorrect: false },
      ],
    },
  ],
  progressiveExercises: [
    {
      id: 'ex1',
      level: 1,
      levelLabelAr: '1',
      problemAr: 'أين العصفور؟',
      hintsAr: [],
      solutionAr: 'فوق',
      detailedCorrectionAr: '',
      xpReward: 10,
    },
  ],
};

const math2ap: CourseLesson = {
  ...spatial,
  id: 'math-2ap-t1-numbers-0-49',
  grade: '2AP',
  titleAr: 'الأعداد',
  discoveryAr: 'عند سارة 3 حزم أقلام.',
  objectiveAr: 'أفكك العدد.',
};

describe('1AP playful lesson layout', () => {
  it('isolates 1AP from 2AP and older grades', () => {
    expect(isPlayful1AP('1AP')).toBe(true);
    expect(isPlayful1AP('2AP')).toBe(false);
    expect(isPlayful1AP('5AP')).toBe(false);
  });

  it('keeps three child steps when there is no dedicated lab: look, play, answer', () => {
    expect(buildPlayful1APSteps(spatial).map((s) => s.id)).toEqual([
      'explanation',
      'practice',
      'quiz',
    ]);
  });

  it('keeps the dedicated interactive tool in 1AP when the lesson has one', () => {
    expect(
      buildPlayful1APSteps(spatial, { hasInteractive: true }).map((s) => s.id),
    ).toEqual(['explanation', 'interactive', 'practice', 'quiz']);
    expect(buildPlayful1APSteps(spatial, { hasInteractive: true })[1].labelAr).toBe(
      'الأداة التفاعلية المخصصة',
    );
  });

  it('strips French glosses a 6-year-old cannot read', () => {
    expect(stripLatinGlosses('فَوْقَ (Sur): الشيء في الأعلى.')).toBe('فَوْقَ: الشيء في الأعلى.');
  });

  it('turns a haraka name into a picture card', () => {
    const snippet = parsePlayfulSnippet('الفَتْحَةُ: خَطٌّ صَغِيرٌ فَوْقَ الحَرْفِ. نَقْرَأُ بَ.');
    expect(snippet.headline).toBe('الفَتْحَةُ');
    expect(snippet.emoji).toBe('🍋');
  });

  it('turns a long rule into a picture, a short word, and a dedicated audio line', () => {
    const snippet = parsePlayfulSnippet('فَوْقَ (Sur): الشيء الموجود في الأعلى (مثل: القطة فوق الطاولة).');
    expect(snippet.headline).toBe('فَوْقَ');
    expect(snippet.emoji).toBe('☝️');
    expect(snippet.speak).not.toMatch(/Sur/);
    expect(snippet.speak.length).toBeLessThan(80);
  });

  it('splits a discovery into tap-sized lines so the child never hears the whole course', () => {
    expect(
      splitPlayfulLines('أين يوجد المصباح 💡؟ وأين يوجد السجاد 🧶؟'),
    ).toHaveLength(2);
  });

  it('shows the discovery story without supermarket copy', () => {
    const onSpeak = vi.fn();
    render(<YoungLessonStory lesson={spatial} onSpeak={onSpeak} />);
    expect(document.querySelector('[data-lesson-story="1ap"]')).toBeTruthy();
    expect(screen.getByText(/أين يوجد المصباح/)).toBeInTheDocument();
    expect(screen.queryByText(/DZD/)).not.toBeInTheDocument();
    expect(screen.queryByText(/سوبرماركت/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sur/)).not.toBeInTheDocument();
    expect(screen.queryByText('إستمع للدرس')).not.toBeInTheDocument();
  });

  it('puts a dedicated speaker on each snippet and never reads the rest of the lesson', () => {
    const onSpeak = vi.fn();
    render(<YoungLessonStory lesson={spatial} onSpeak={onSpeak} speakingKey={null} />);
    const speakers = document.querySelectorAll('[data-tap-speak]');
    expect(speakers.length).toBeGreaterThan(3);

    fireEvent.click(document.querySelector('[data-tap-speak="rule-0"]')!);
    expect(onSpeak).toHaveBeenCalledTimes(1);
    expect(onSpeak.mock.calls[0][0]).toBe('rule-0');
    expect(onSpeak.mock.calls[0][1]).toMatch(/فَوْقَ/);
    expect(onSpeak.mock.calls[0][1]).not.toMatch(/تَحْتَ/);
  });

  it('uses a child quiz title without shuffle jargon', () => {
    render(
      <LessonQuizPanel
        lesson={spatial}
        shuffledQuiz={spatial.quiz}
        selectedAnswers={{}}
        recentAnswerId={null}
        renderArabicText={(t) => t || ''}
        onSelectOption={() => {}}
        onShuffle={() => {}}
        onReset={() => {}}
        playful
        onSpeak={vi.fn()}
        speakingKey={null}
      />
    );
    expect(screen.getByText('هَيَّا نَلْعَبُ!')).toBeInTheDocument();
    expect(document.querySelector('[data-tap-speak="quiz-q1"]')).toBeTruthy();
    expect(screen.queryByText(/المتقدم/)).not.toBeInTheDocument();
    expect(screen.queryByText(/خلط الخيارات/)).not.toBeInTheDocument();
  });

  it('offers the next lesson on the quiz banner so the child never has to leave', () => {
    const onContinueNext = vi.fn();
    render(
      <LessonQuizPanel
        lesson={spatial}
        shuffledQuiz={spatial.quiz}
        selectedAnswers={{ q1: 'a' }}
        recentAnswerId={null}
        renderArabicText={(t) => t || ''}
        onSelectOption={() => {}}
        onShuffle={() => {}}
        onReset={() => {}}
        playful
        nextLessonTitle="الأَعْدَادُ"
        onContinueNext={onContinueNext}
      />
    );
    expect(screen.getByText('أَحْسَنْتَ!')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /الدَّرْسُ التَّالِي/ }));
    expect(onContinueNext).toHaveBeenCalledTimes(1);
  });
});

describe('2AP explainer keeps compact sheet but drops generic supermarket', () => {
  it('uses the lesson discovery instead of 1000 DZD shopping', () => {
    render(<LessonExplanationView lesson={math2ap} />);
    expect(screen.getAllByText(/عند سارة 3 حزم أقلام/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/DZD/)).not.toBeInTheDocument();
    expect(screen.queryByText(/سوبرماركت/)).not.toBeInTheDocument();
    expect(screen.queryByText(/الامتحانات/)).not.toBeInTheDocument();
  });
});
