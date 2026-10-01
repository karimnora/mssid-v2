import { useEffect, useRef, useState } from 'react';
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
  onQuizMiss?: (lessonId: string) => void;
}) {
  const { lesson, quizAlreadyValidated, onCompleteQuiz, onQuizFullyValidated, onQuizMiss } = options;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [shuffledQuiz, setShuffledQuiz] = useState<CourseLesson['quiz']>([]);
  const [awardedQuizIds, setAwardedQuizIds] = useState<Set<string>>(new Set());
  const missedQuizIdsRef = useRef(new Set<string>());
  const [gameAnswers, setGameAnswers] = useState<Record<number, string>>({});
  const [gameXpAwarded, setGameXpAwarded] = useState(false);
  const [recentAnswerId, setRecentAnswerId] = useState<string | null>(null);
  const [visibleSolutions, setVisibleSolutions] = useState<Record<number, boolean>>({});
  const selectedAnswersRef = useRef<Record<string, string>>({});
  const awardedQuizIdsRef = useRef<Set<string>>(new Set());

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
    selectedAnswersRef.current = {};
    setSelectedAnswers({});
    const storedAwards = new Set(loadAwardedQuestionIds(lesson.id));
    awardedQuizIdsRef.current = storedAwards;
    setAwardedQuizIds(storedAwards);
    missedQuizIdsRef.current = new Set();
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
    const currentQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
    const question = currentQuiz.find((q) => q.id === questionId);
    const correctOpt = question?.options.find((o) => o.isCorrect);
    const alreadyCorrectThisAttempt = !!correctOpt && selectedAnswersRef.current[questionId] === correctOpt.id;
    // Lock the current attempt after a correct pick so the child cannot swap answers after
    // seeing "الصواب". Rewards live in awardedQuizIds / localStorage and must not freeze a
    // reset or a later revision — those start a new attempt with empty selectedAnswers.
    if (alreadyCorrectThisAttempt) return;
    selectedAnswersRef.current = { ...selectedAnswersRef.current, [questionId]: optionId };
    setSelectedAnswers(selectedAnswersRef.current);
    const isCorrect = !!correctOpt && correctOpt.id === optionId;
    setRecentAnswerId(questionId);
    if (isCorrect) playSuccessChime(); else playGentleNudge();
    if (!isCorrect) {
      if (!missedQuizIdsRef.current.has(questionId)) {
        missedQuizIdsRef.current.add(questionId);
        onQuizMiss?.(lesson.id);
      }
      return;
    }

    if (quizAlreadyValidated) {
      if (claimDailyLessonRevisionBonus(lesson.id)) {
        onCompleteQuiz(lesson.id, 5);
      }
      return;
    }

    if (awardedQuizIdsRef.current.has(questionId)) return;
    onCompleteQuiz(lesson.id, 15);
    persistAwardedQuestionId(lesson.id, questionId);
    const newAwarded = new Set(awardedQuizIdsRef.current).add(questionId);
    awardedQuizIdsRef.current = newAwarded;
    setAwardedQuizIds(newAwarded);
    if (newAwarded.size === currentQuiz.length) {
      onQuizFullyValidated?.(lesson.id);
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
    selectedAnswersRef.current = {};
    setSelectedAnswers({});
    setRecentAnswerId(null);
    missedQuizIdsRef.current = new Set();
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
      lesson.quiz.length > 0 &&
      lesson.quiz.every((q) => {
        const selected = selectedAnswers[q.id];
        const correct = q.options.find((o) => o.isCorrect);
        return !!selected && !!correct && selected === correct.id;
      }),
    quizAnswered:
      lesson.quiz.length > 0 &&
      Object.keys(selectedAnswers).length === lesson.quiz.length,
  };
}
