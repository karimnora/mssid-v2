import { describe, expect, it } from 'vitest';
import {
  allowedCalculatorKeys,
  allowedEnglishTenses,
  allowedFrenchTenses,
  canShowColumnCarryOps,
  canShowDecimalsTab,
  canShowFrenchInLab,
  primaryMathNumberStripMax,
} from './labGradePolicy';

describe('labGradePolicy', () => {
  it('hides French content before 3AP', () => {
    expect(canShowFrenchInLab('1AP')).toBe(false);
    expect(canShowFrenchInLab('2AP')).toBe(false);
    expect(canShowFrenchInLab('3AP')).toBe(true);
  });

  it('limits French tenses by grade', () => {
    expect(allowedFrenchTenses('3AP')).toEqual(['presents', 'futur']);
    expect(allowedFrenchTenses('4AP')).toContain('passeCompose');
    expect(allowedFrenchTenses('4AP')).not.toContain('imparfait');
    expect(allowedFrenchTenses('5AP')).toContain('imparfait');
  });

  it('limits English tenses by grade', () => {
    expect(allowedEnglishTenses('3AP')).not.toContain('pastSimple');
    expect(allowedEnglishTenses('4AP')).toContain('pastSimple');
    expect(allowedEnglishTenses('5AP')).toContain('futureSimple');
  });

  it('hides decimals before 5AP', () => {
    expect(canShowDecimalsTab('4AP')).toBe(false);
    expect(canShowDecimalsTab('5AP')).toBe(true);
  });

  it('limits primary math strip for 1AP', () => {
    expect(primaryMathNumberStripMax('1AP')).toBe(20);
    expect(primaryMathNumberStripMax('2AP')).toBe(99);
    expect(canShowColumnCarryOps('1AP')).toBe(false);
    expect(canShowColumnCarryOps('2AP')).toBe(true);
  });

  it('restricts calculator keys for young grades', () => {
    expect(allowedCalculatorKeys('1AP').has('*')).toBe(false);
    expect(allowedCalculatorKeys('2AP').has('/')).toBe(false);
    expect(allowedCalculatorKeys('3AP').has('*')).toBe(true);
  });
});
