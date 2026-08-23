import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseLesson } from '../../types';
import { YoungLessonStory } from './YoungLessonStory';
import { LessonQuizPanel } from './LessonQuizPanel';
import { LessonExplanationView } from '../LessonExplanationView';
import { LocaleProvider } from '../../context/LocaleContext';
import {
  buildPlayful1APSteps,
  isPlayful1AP,
  parsePlayfulSnippet,
  splitPlayfulLines,
  stripLatinGlosses,
} from './youngLessonLayout';
import { MATH_1AP } from '../../data/courses/1AP/math';

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

  it('shows a car for number 4, not the five-finger hand used for 5', () => {
    const lesson = MATH_1AP.find((item) => item.id === 'math-1ap-t1-numbers-0-5');
    const four = lesson?.rulesAr.find((rule) => rule.startsWith('4 '));
    const five = lesson?.rulesAr.find((rule) => rule.startsWith('5 '));
    expect(four).toBeTruthy();
    expect(five).toBeTruthy();
    expect(parsePlayfulSnippet(four!).emoji).toBe('🚗');
    expect(parsePlayfulSnippet(four!).emoji).not.toBe(parsePlayfulSnippet(five!).emoji);
    expect(four).not.toMatch(/🖐️|✋/);
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

  it('does not treat the illustration/text as a second tap zone — only the speaker button speaks', () => {
    const onSpeak = vi.fn();
    render(<YoungLessonStory lesson={spatial} onSpeak={onSpeak} speakingKey={null} />);
    const ruleHeadline = screen.getByText('فَوْقَ');
    expect(ruleHeadline.closest('button')).toBeNull();
    fireEvent.click(ruleHeadline);
    expect(onSpeak).not.toHaveBeenCalled();
  });

  it('falls back to the lesson title emoji, not an unrelated default tile, when a card has none of its own', () => {
    const noEmojiLesson: CourseLesson = {
      ...spatial,
      titleAr: 'الأَشْكَالُ 🔺',
      discoveryAr: 'ما شكل عجلة الدراجة؟ وما شكل قطعة البيتزا؟',
      // Cleared: spatial's own rulesAr/examplesAr contain فوق/تحت, which FALLBACK_EMOJI already
      // maps to real icons — keeping them would confound this test with unrelated matches.
      rulesAr: [],
      examplesAr: [],
    };
    render(<YoungLessonStory lesson={noEmojiLesson} onSpeak={vi.fn()} />);
    // Both discovery lines lack their own emoji entirely — they must reuse the title's 🔺,
    // never the old positional DEFAULT_TILES pick (⭐ then 🎈).
    expect(screen.getAllByText('🔺').length).toBe(2);
    expect(screen.queryByText('⭐')).not.toBeInTheDocument();
    expect(screen.queryByText('🎈')).not.toBeInTheDocument();
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

  it('puts a speaker on each essential part and never concatenates the whole lesson', () => {
    const onSpeak = vi.fn();
    render(
      <LessonExplanationView lesson={math2ap} speakingKey={null} onSpeak={onSpeak} />,
    );
    expect(screen.queryByText('إستمع للدرس')).not.toBeInTheDocument();
    expect(document.querySelector('[data-tap-speak="discovery"]')).toBeTruthy();
    expect(document.querySelector('[data-tap-speak="rule-0"]')).toBeTruthy();

    fireEvent.click(document.querySelector('[data-tap-speak="rule-0"]')!);
    expect(onSpeak).toHaveBeenCalledTimes(1);
    expect(onSpeak.mock.calls[0][0]).toBe('rule-0');
    expect(onSpeak.mock.calls[0][1]).toMatch(/فَوْقَ/);
    expect(onSpeak.mock.calls[0][1]).not.toMatch(/تَحْتَ/);
    expect(onSpeak.mock.calls[0][1]).not.toMatch(/عند سارة/);
  });

  it('lets 2AP hear a quiz question without the 1AP play chrome', () => {
    const onSpeak = vi.fn();
    render(
      <LocaleProvider>
        <LessonQuizPanel
          lesson={math2ap}
          shuffledQuiz={math2ap.quiz}
          selectedAnswers={{}}
          recentAnswerId={null}
          renderArabicText={(t) => t || ''}
          onSelectOption={() => {}}
          onShuffle={() => {}}
          onReset={() => {}}
          onSpeak={onSpeak}
          speakingKey={null}
        />
      </LocaleProvider>,
    );
    expect(screen.queryByText('هَيَّا نَلْعَبُ!')).not.toBeInTheDocument();
    fireEvent.click(document.querySelector('[data-tap-speak="quiz-q1"]')!);
    expect(onSpeak).toHaveBeenCalledTimes(1);
    expect(onSpeak.mock.calls[0][1]).toMatch(/العصفور/);
  });
});
