import { useEffect, useState } from 'react';
import { CourseLesson } from '../../types';
import { playSuccessChime, playGentleNudge } from '../preschool/usePreschoolAudio';
import {
  claimDailyLessonRevisionBonus,
  hasAwardedGameXp,
  loadAwardedQuestionIds,
  persistAwardedQuestionId,
  persistGameXpAwarded,
} from '../../utils/quizRewards';
import { shuffleOptions } from './shared';

export function useLessonQuiz(options: {
  lesson: CourseLesson;
  quizAlreadyValidated: boolean;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  onQuizFullyValidated?: (lessonId: string) => void;
}) {
  const { lesson, quizAlreadyValidated, onCompleteQuiz, onQuizFullyValidated } = options;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [shuffledQuiz, setShuffledQuiz] = useState<CourseLesson['quiz']>([]);
  const [awardedQuizIds, setAwardedQuizIds] = useState<Set<string>>(new Set());
  const [gameAnswers, setGameAnswers] = useState<Record<number, string>>({});
  const [gameXpAwarded, setGameXpAwarded] = useState(false);
  const [recentAnswerId, setRecentAnswerId] = useState<string | null>(null);
  const [visibleSolutions, setVisibleSolutions] = useState<Record<number, boolean>>({});

  const initializeShuffledQuiz = () => {
    if (!lesson.quiz || lesson.quiz.length === 0) {
      setShuffledQuiz([]);
      return;
    }
    const shuffled = lesson.quiz.map((q) => ({
      ...q,
      options: shuffleOptions(q.options),
    }));
    setShuffledQuiz(shuffled);
  };

  useEffect(() => {
    setVisibleSolutions({});
    setSelectedAnswers({});
    setAwardedQuizIds(new Set(loadAwardedQuestionIds(lesson.id)));
    setRecentAnswerId(null);
    setGameAnswers({});
    setGameXpAwarded(hasAwardedGameXp(lesson.id));
    initializeShuffledQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  useEffect(() => {
    if (!recentAnswerId) return;
    const t = setTimeout(() => setRecentAnswerId(null), 900);
    return () => clearTimeout(t);
  }, [recentAnswerId]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    // Locked only once answered CORRECTLY (XP already awarded) — a wrong guess must never be a
    // dead end: the student can keep trying instead of the question freezing forever (remonte
    // revue externe : principe "zero frustration" du cahier des charges pour les 6-11 ans).
    if (awardedQuizIds.has(questionId)) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    const currentQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
    const question = currentQuiz.find((q) => q.id === questionId);
    const correctOpt = question?.options.find((o) => o.isCorrect);
    const isCorrect = !!correctOpt && correctOpt.id === optionId;
    setRecentAnswerId(questionId);
    if (isCorrect) playSuccessChime(); else playGentleNudge();
    if (isCorrect) {
      if (quizAlreadyValidated) {
        if (claimDailyLessonRevisionBonus(lesson.id)) {
          onCompleteQuiz(lesson.id, 5);
        }
      } else {
        onCompleteQuiz(lesson.id, 15);
        persistAwardedQuestionId(lesson.id, questionId);
      }
      const newAwarded = new Set(awardedQuizIds).add(questionId);
      setAwardedQuizIds(newAwarded);
      if (!quizAlreadyValidated && newAwarded.size === currentQuiz.length) {
        onQuizFullyValidated?.(lesson.id);
      }
    }
  };

  const handleSelectGameOption = (itemIndex: number, optionAr: string) => {
    const game = lesson.educationalGame;
    if (!game) return;
    const alreadyCorrect = gameAnswers[itemIndex] === game.items[itemIndex]?.correctAnswerAr;
    if (alreadyCorrect) return;
    setGameAnswers((prev) => {
      const next = { ...prev, [itemIndex]: optionAr };
      if (!gameXpAwarded && game.items.every((item, i) => next[i] === item.correctAnswerAr)) {
        setGameXpAwarded(true);
        persistGameXpAwarded(lesson.id);
        onCompleteQuiz(lesson.id, game.xpReward);
      }
      return next;
    });
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRecentAnswerId(null);
    initializeShuffledQuiz();
  };

  return {
    selectedAnswers,
    awardedQuizIds,
    shuffledQuiz,
    recentAnswerId,
    visibleSolutions,
    setVisibleSolutions,
    gameAnswers,
    setGameAnswers,
    handleSelectOption,
    handleSelectGameOption,
    handleResetQuiz,
    initializeShuffledQuiz,
    quizFullyPassed:
      lesson.quiz.length > 0 && awardedQuizIds.size === lesson.quiz.length,
    quizAnswered:
      lesson.quiz.length > 0 &&
      Object.keys(selectedAnswers).length === lesson.quiz.length,
  };
}
