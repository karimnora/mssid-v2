import { PrimaryGrade } from '../types';
import { GRADE_ORDER } from '../data/subjectsData';

export function gradeAtLeast(grade: PrimaryGrade, min: PrimaryGrade): boolean {
  return GRADE_ORDER.indexOf(grade) >= GRADE_ORDER.indexOf(min);
}

/** Programme 1AP/2AP : pas de français dans les labs langue. */
export function canShowFrenchInLab(grade: PrimaryGrade): boolean {
  return gradeAtLeast(grade, '3AP');
}

export function canShowEnglishInLab(grade: PrimaryGrade): boolean {
  return gradeAtLeast(grade, '3AP');
}

export type FrenchTense = 'presents' | 'futur' | 'passeCompose' | 'imparfait';

/** 3AP = présent + futur ; 4AP = + passé composé ; 5AP = + imparfait. */
export function allowedFrenchTenses(grade: PrimaryGrade): FrenchTense[] {
  if (grade === '3AP') return ['presents', 'futur'];
  if (grade === '4AP') return ['presents', 'futur', 'passeCompose'];
  return ['presents', 'futur', 'passeCompose', 'imparfait'];
}

export type EnglishTense = 'presentSimple' | 'presentContinuous' | 'pastSimple' | 'futureSimple';

/** 3AP = présents ; 4AP = + past ; 5AP = + future. */
export function allowedEnglishTenses(grade: PrimaryGrade): EnglishTense[] {
  if (grade === '3AP') return ['presentSimple', 'presentContinuous'];
  if (grade === '4AP') return ['presentSimple', 'presentContinuous', 'pastSimple'];
  return ['presentSimple', 'presentContinuous', 'pastSimple', 'futureSimple'];
}

/** Décimaux = programme 5AP uniquement. */
export function canShowDecimalsTab(grade: PrimaryGrade): boolean {
  return grade === '5AP';
}

/** Respiration / sang = 5AP ; digestion seule en 4AP. */
export function canShowRespiratoryAnatomyTab(grade: PrimaryGrade): boolean {
  return gradeAtLeast(grade, '5AP');
}

/** 1AP : 0–20 ; 2AP+ : 0–99. */
export function primaryMathNumberStripMax(grade: PrimaryGrade): number {
  return grade === '1AP' ? 20 : 99;
}

/** Juxtaposition / pose avec retenue = 2AP+. */
export function canShowColumnCarryOps(grade: PrimaryGrade): boolean {
  return gradeAtLeast(grade, '2AP');
}

const CALC_BASIC = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'C']);
const CALC_STANDARD = new Set([...CALC_BASIC, '*', '/', '%', '.', '(', ')', 'x']);

/** 1AP : addition/soustraction simple ; 2AP+ : opérations complètes. */
export function allowedCalculatorKeys(grade: PrimaryGrade): Set<string> {
  if (grade === '1AP' || grade === '2AP') return CALC_BASIC;
  return CALC_STANDARD;
}
