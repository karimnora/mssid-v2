import { describe, expect, it } from 'vitest';
import { clockTrainerForGrade } from './ClockTrainerLab';

describe('clockTrainerForGrade', () => {
  it('keeps 2AP on hour and half-hour only', () => {
    const cfg = clockTrainerForGrade('2AP');
    expect(cfg.minuteStep).toBe(30);
    expect(cfg.quizTimes.every((t) => t.minute === 0 || t.minute === 30)).toBe(true);
    expect(cfg.quizTimes.some((t) => t.labelAr.includes('رُبُع'))).toBe(false);
  });

  it('keeps quarter hours for 3AP and the tools hub', () => {
    expect(clockTrainerForGrade('3AP').quizTimes.some((t) => t.minute === 15)).toBe(true);
    expect(clockTrainerForGrade(undefined).minuteStep).toBe(5);
  });
});
