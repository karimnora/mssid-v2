import { useState } from 'react';
import {
  FRACTION_LINES,
  type FractionObservation,
  type FractionObservations,
} from './fractionJourneyContent';
export type FractionAnswer = {
  whole: number;
  rest: number;
  lower: number | null;
  factor: number;
  parts: number[];
};
const initialAnswer = (): FractionAnswer => ({
  whole: 0,
  rest: 0,
  lower: null,
  factor: 1,
  parts: [],
});
export const FRACTION_STAGES = [
  { key: 'decompose', lab: false },
  { key: 'bound', lab: false },
  { key: 'equivalent', lab: false },
  { key: 'decompose', lab: true },
  { key: 'bound', lab: true },
  { key: 'equivalent', lab: true },
  { key: 'explain', lab: true },
] as const;
export function useFractionJourney(
  onSpeak: (key: string, text: string) => void
) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, FractionAnswer>>({});
  const [results, setResults] = useState<
    Partial<Record<number, FractionObservation>>
  >({});
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, 'success' | 'retry'>>(
    {}
  );
  const stage = FRACTION_STAGES[step];
  const answer = answers[step] ?? initialAnswer();
  const numerator = stage.lab ? 7 : 17,
    denominator = stage.lab ? 3 : 5;
  const baseNumerator = stage.lab ? 2 : 1,
    baseDenominator = stage.lab ? 3 : 2,
    targetFactor = stage.lab ? 2 : 5;
  const line =
    stage.key === 'explain'
      ? FRACTION_LINES.explain
      : step === 3
      ? FRACTION_LINES.lab
      : FRACTION_LINES[stage.key];
  const update = (patch: Partial<FractionAnswer>) => {
    setAnswers((prev) => ({
      ...prev,
      [step]: { ...(prev[step] ?? initialAnswer()), ...patch },
    }));
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[step];
      return next;
    });
  };
  const togglePart = (index: number) => {
    const parts = answer.parts.includes(index)
      ? answer.parts.filter((i) => i !== index)
      : [...answer.parts, index];
    if (answer.whole * denominator + parts.length > numerator) return;
    if (parts.length === denominator)
      update({ whole: answer.whole + 1, rest: 0, parts: [] });
    else update({ rest: parts.length, parts });
  };
  const takePart = (delta: number) => {
    if (delta > 0) {
      const i = Array.from({ length: denominator }, (_, n) => n).find(
        (n) => !answer.parts.includes(n)
      );
      if (i !== undefined) togglePart(i);
    } else if (answer.parts.length)
      togglePart(answer.parts[answer.parts.length - 1]);
    else if (answer.whole > 0)
      update({
        whole: answer.whole - 1,
        rest: denominator - 1,
        parts: Array.from({ length: denominator - 1 }, (_, n) => n),
      });
  };
  const changeWhole = (delta: number) => {
    const whole = answer.whole + delta;
    if (whole < 0 || whole * denominator + answer.rest > numerator) return;
    update({ whole });
  };
  const revealHint = () => {
    setHints((prev) => ({ ...prev, [step]: true }));
    onSpeak(
      'fraction-hint',
      stage.key === 'explain'
        ? FRACTION_LINES.equivalent
        : FRACTION_LINES[stage.key]
    );
  };
  const record = (correct: boolean) => {
    const previous = results[step];
    setResults((prev) => ({
      ...prev,
      [step]: {
        completed: correct || !!previous?.completed,
        helped:
          !!hints[step] ||
          !!previous?.helped ||
          (!!previous?.attempts && !previous.completed),
        attempts: (previous?.attempts ?? 0) + 1,
      },
    }));
    setFeedback((prev) => ({ ...prev, [step]: correct ? 'success' : 'retry' }));
    onSpeak(
      'fraction-feedback',
      correct ? FRACTION_LINES.success : FRACTION_LINES.retry
    );
  };
  const check = () =>
    record(
      stage.key === 'decompose'
        ? answer.whole === Math.floor(numerator / denominator) &&
            answer.rest === numerator % denominator
        : stage.key === 'bound'
        ? answer.lower === Math.floor(numerator / denominator)
        : answer.factor === targetFactor
    );
  const move = (target: number) => {
    const next = Math.max(0, Math.min(FRACTION_STAGES.length - 1, target));
    setStep(next);
    setFeedback(prev => { const updated = { ...prev }; delete updated[next]; return updated; });
    const s = FRACTION_STAGES[next];
    onSpeak(
      'fraction-stage-' + next,
      next === 3 ? FRACTION_LINES.lab : FRACTION_LINES[s.key]
    );
  };
  const observe = (lab: boolean): FractionObservations =>
    Object.fromEntries(
      FRACTION_STAGES.flatMap((s, i) =>
        s.lab === lab && results[i] ? [[s.key, results[i]]] : []
      )
    );
  return {
    started:
      Object.keys(answers).length > 0 ||
      Object.keys(results).length > 0 ||
      Object.keys(hints).length > 0,
    step,
    stage,
    answer,
    numerator,
    denominator,
    baseNumerator,
    baseDenominator,
    targetFactor,
    line,
    update,
    togglePart,
    takePart,
    changeWhole,
    revealHint,
    check,
    explain: (correct: boolean) => record(correct),
    previous: () => move(step - 1),
    next: () => {
      if (results[step]?.completed && step < 6) move(step + 1);
    },
    start: () => onSpeak('fraction-stage-' + step, line),
    completed: !!results[step]?.completed,
    finished: !!results[6]?.completed,
    helped: !!hints[step],
    feedback: feedback[step],
    learn: observe(false),
    transfer: observe(true),
  };
}
export type FractionJourney = ReturnType<typeof useFractionJourney>;
