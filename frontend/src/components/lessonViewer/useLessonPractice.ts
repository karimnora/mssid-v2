import { useCallback, useEffect, useRef, useState } from "react";
import { parseChildNumber, sameAnswer } from "../../utils/childNumber";
import { CourseLesson } from "../../types";
import type { PracticeResult } from "../../utils/competenceProgress";
import { shuffleOptions } from "./shared";
import {
  playGentleNudge,
  playSuccessChime,
} from "../preschool/usePreschoolAudio";
import { isGuidedPractice, isMatchingPairCorrect } from "./practiceAssessment";

type Exercise = NonNullable<CourseLesson["progressiveExercises"]>[number];

export function useLessonPractice(
  lesson: CourseLesson,
  onCompleteQuiz: (lessonId: string, score: number) => void,
  onPracticeMiss?: (lessonId: string) => void,
  /** Richer report for the parent notebook (alone / with help, missed exercise). Replaces onPracticeMiss when given. */
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void
) {
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>(
    {}
  );
  const [sessionResults, setSessionResults] = useState<
    Record<string, { correct: boolean; helped: boolean }>
  >({});
  const revealHint = useCallback((ex: Exercise) => {
    const max = ex.progressiveHints?.length || (ex.hintsAr.length ? 1 : 0);
    setRevealedHints((prev) => ({
      ...prev,
      [ex.id]: Math.min(max, (prev[ex.id] ?? 0) + 1),
    }));
  }, []);
  const [practiceAnswers, setPracticeAnswers] = useState<
    Record<string, string | number>
  >({});
  const [practiceChecked, setPracticeChecked] = useState<
    Record<string, boolean>
  >({});
  const [practiceCorrect, setPracticeCorrect] = useState<
    Record<string, boolean>
  >({});
  const [awardedExerciseIds, setAwardedExerciseIds] = useState<Set<string>>(
    new Set()
  );
  const missedExerciseIdsRef = useRef(new Set<string>());
  const [matchingRightOrder, setMatchingRightOrder] = useState<
    Record<string, number[]>
  >({});
  const [matchingConnections, setMatchingConnections] = useState<
    Record<string, Record<number, number>>
  >({});
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState<
    Record<string, number | null>
  >({});
  const [orderingShuffled, setOrderingShuffled] = useState<
    Record<string, number[]>
  >({});
  const [orderingSelections, setOrderingSelections] = useState<
    Record<string, number[]>
  >({});
  const [practiceOptionOrder, setPracticeOptionOrder] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    setPracticeAnswers({});
    setRevealedHints({});
    setSessionResults({});
    setPracticeChecked({});
    setPracticeCorrect({});
    setAwardedExerciseIds(new Set());
    missedExerciseIdsRef.current = new Set();
    setMatchingConnections({});
    setMatchingSelectedLeft({});
    setOrderingSelections({});

    const newMatchingRightOrder: Record<string, number[]> = {};
    const newOrderingShuffled: Record<string, number[]> = {};
    const newOptionOrder: Record<string, string[]> = {};
    [
      ...(lesson.progressiveExercises || []),
      ...(lesson.evaluationExercises || []),
    ].forEach((ex) => {
      if (ex.type === "qcm" && ex.options) {
        newOptionOrder[ex.id] = shuffleOptions(
          ex.options.map((option) => option.id)
        );
      }
      if (ex.type === "matching" && ex.matchingPairsAr) {
        newMatchingRightOrder[ex.id] = shuffleOptions(
          ex.matchingPairsAr.map((_, i) => i)
        );
      }
      if (ex.type === "ordering" && ex.orderedItemsAr) {
        newOrderingShuffled[ex.id] = shuffleOptions(
          ex.orderedItemsAr.map((_, i) => i)
        );
      }
    });
    setMatchingRightOrder(newMatchingRightOrder);
    setOrderingShuffled(newOrderingShuffled);
    setPracticeOptionOrder(newOptionOrder);
    // Same contract as before the split: reset only when the lesson changes, not when
    // premium content later merges onto the same id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const canCheckExercise = (ex: Exercise): boolean => {
    const answer = practiceAnswers[ex.id];
    if (ex.type === "qcm" || ex.type === "true_false")
      return !!ex.options?.some((option) => option.id === answer);
    if (ex.type === "fill_blank") return !!String(answer ?? "").trim();
    if (ex.type === "calculation") return answer !== undefined && answer !== "";
    if (ex.type === "matching")
      return (
        Object.keys(matchingConnections[ex.id] || {}).length ===
        (ex.matchingPairsAr?.length || 0)
      );
    if (ex.type === "ordering")
      return (
        (orderingSelections[ex.id] || []).length ===
        (ex.orderedItemsAr?.length || 0)
      );
    return true;
  };

  const practiceStateRef = useRef({
    practiceAnswers,
    matchingConnections,
    orderingSelections,
    awardedExerciseIds,
  });
  practiceStateRef.current = {
    practiceAnswers,
    matchingConnections,
    orderingSelections,
    awardedExerciseIds,
  };

  const checkPracticeExercise = useCallback(
    (ex: Exercise, meta?: { hintsUsed?: number }) => {
      const {
        practiceAnswers: answers,
        matchingConnections: connsMap,
        orderingSelections: orderMap,
        awardedExerciseIds: awarded,
      } = practiceStateRef.current;
      const answer = answers[ex.id];
      if (isGuidedPractice(ex)) {
        // Reading a model correction is useful practice, but does not demonstrate mastery.
        setPracticeChecked((prev) => ({ ...prev, [ex.id]: true }));
        return;
      }
      let isCorrect = false;
      if (ex.type === "qcm" || ex.type === "true_false") {
        const opt = ex.options?.find((o) => o.id === answer);
        isCorrect = !!opt?.isCorrect;
      } else if (ex.type === "fill_blank") {
        // Numbers compare by value: « 5,40 », « 5.4 » and « ٥٫٤ » are the same answer.
        isCorrect = sameAnswer(answer, ex.fillBlankAnswerAr || "");
      } else if (ex.type === "calculation") {
        const value = parseChildNumber(answer);
        isCorrect =
          value !== null &&
          ex.calculationAnswer !== undefined &&
          Math.abs(value - ex.calculationAnswer) < 1e-9;
      } else if (ex.type === "matching" && ex.matchingPairsAr) {
        const conns = connsMap[ex.id] || {};
        isCorrect =
          Object.keys(conns).length === ex.matchingPairsAr.length &&
          new Set(Object.values(conns)).size === ex.matchingPairsAr.length &&
          ex.matchingPairsAr.every((_, leftIdx) =>
            isMatchingPairCorrect(ex, leftIdx, conns[leftIdx])
          );
      } else if (ex.type === "ordering" && ex.orderedItemsAr) {
        const seq = orderMap[ex.id] || [];
        isCorrect =
          seq.length === ex.orderedItemsAr.length &&
          seq.every((originalIdx, position) => originalIdx === position);
      }

      setPracticeChecked((prev) => ({ ...prev, [ex.id]: true }));
      setPracticeCorrect((prev) => ({ ...prev, [ex.id]: isCorrect }));
      setSessionResults((prev) => ({
        ...prev,
        [ex.id]: {
          correct: isCorrect,
          helped:
            (meta?.hintsUsed ?? 0) > 0 ||
            missedExerciseIdsRef.current.has(ex.id),
        },
      }));
      if (isCorrect) playSuccessChime();
      else playGentleNudge();
      if (isCorrect && !awarded.has(ex.id)) {
        onCompleteQuiz(lesson.id, ex.xpReward);
        setAwardedExerciseIds((prev) => new Set(prev).add(ex.id));
        // « Seul » means right on the first try with no hint opened; anything else is « avec aide ».
        const helped =
          (meta?.hintsUsed ?? 0) > 0 || missedExerciseIdsRef.current.has(ex.id);
        onPracticeResult?.(lesson.id, {
          outcome: "success",
          helped,
          exerciseId: ex.id,
        });
      } else if (!isCorrect && !missedExerciseIdsRef.current.has(ex.id)) {
        missedExerciseIdsRef.current.add(ex.id);
        if (onPracticeResult)
          onPracticeResult(lesson.id, { outcome: "fail", exerciseId: ex.id });
        else onPracticeMiss?.(lesson.id);
      }
    },
    [lesson.id, onCompleteQuiz, onPracticeMiss, onPracticeResult]
  );

  const resetPracticeExercise = useCallback((ex: Exercise) => {
    setPracticeChecked((prev) => ({ ...prev, [ex.id]: false }));
    setPracticeAnswers((prev) => ({ ...prev, [ex.id]: "" }));
    if (ex.type === "matching") {
      setMatchingConnections((prev) => ({ ...prev, [ex.id]: {} }));
      setMatchingSelectedLeft((prev) => ({ ...prev, [ex.id]: null }));
    }
    if (ex.type === "ordering") {
      setOrderingSelections((prev) => ({ ...prev, [ex.id]: [] }));
    }
  }, []);

  const handlePracticeAnswerChange = useCallback(
    (exId: string, value: string | number) => {
      setPracticeAnswers((prev) => ({ ...prev, [exId]: value }));
    },
    []
  );
  const handleMatchingSelectLeft = useCallback(
    (exId: string, leftIdx: number | null) => {
      setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: leftIdx }));
    },
    []
  );
  const handleConnectMatching = useCallback(
    (exId: string, leftIdx: number, rightIdx: number) => {
      setMatchingConnections((prev) => ({
        ...prev,
        [exId]: { ...(prev[exId] || {}), [leftIdx]: rightIdx },
      }));
      setMatchingSelectedLeft((prev) => ({ ...prev, [exId]: null }));
    },
    []
  );
  const handleDisconnectMatching = useCallback(
    (exId: string, leftIdx: number) => {
      setMatchingConnections((prev) => {
        const next = { ...(prev[exId] || {}) };
        delete next[leftIdx];
        return { ...prev, [exId]: next };
      });
    },
    []
  );
  const handleToggleOrderingItem = useCallback(
    (exId: string, originalIdx: number) => {
      setOrderingSelections((prev) => {
        const cur = prev[exId] || [];
        if (cur.includes(originalIdx))
          return { ...prev, [exId]: cur.filter((i) => i !== originalIdx) };
        return { ...prev, [exId]: [...cur, originalIdx] };
      });
    },
    []
  );

  const evaluationExercises = lesson.evaluationExercises || [];
  const scoredEvaluationExercises = evaluationExercises.filter(
    (ex) => !isGuidedPractice(ex)
  );
  const evaluationCheckedCount = scoredEvaluationExercises.filter(
    (ex) => practiceChecked[ex.id]
  ).length;
  const evaluationCorrectCount = scoredEvaluationExercises.filter(
    (ex) => practiceChecked[ex.id] && practiceCorrect[ex.id]
  ).length;
  const evaluationComplete =
    scoredEvaluationExercises.length > 0 &&
    evaluationCheckedCount === scoredEvaluationExercises.length;
  const evaluationScorePercent =
    scoredEvaluationExercises.length > 0
      ? Math.round(
          (evaluationCorrectCount / scoredEvaluationExercises.length) * 100
        )
      : 0;

  return {
    revealedHints,
    revealHint,
    sessionResults,
    practiceAnswers,
    practiceChecked,
    practiceCorrect,
    awardedExerciseIds,
    matchingRightOrder,
    matchingConnections,
    matchingSelectedLeft,
    orderingShuffled,
    orderingSelections,
    practiceOptionOrder,
    canCheckExercise,
    checkPracticeExercise,
    resetPracticeExercise,
    handlePracticeAnswerChange,
    handleMatchingSelectLeft,
    handleConnectMatching,
    handleDisconnectMatching,
    handleToggleOrderingItem,
    evaluationExercises,
    scoredEvaluationExercises,
    evaluationCheckedCount,
    evaluationCorrectCount,
    evaluationComplete,
    evaluationScorePercent,
  };
}
