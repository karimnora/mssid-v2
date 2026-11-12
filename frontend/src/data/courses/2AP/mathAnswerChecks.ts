import type { CourseLesson, ProgressiveExercise } from '../../../types';

/**
 * 2AP maths exercises were "think, then look at the correction": nothing checked the child's answer.
 * A number is now typed and verified; a word answer becomes a choice with plausible wrong answers
 * taken from the same lesson's ideas.
 */
const CHECKS: Record<string, number | string[]> = {
  'ex1-math2ap-numbers': 7,
  'ex2-math2ap-numbers': 45,
  'ex1-math2ap-position': ['تَحْتَ', 'أَمَامَ'],
  'ex2-math2ap-position': 10,
  'ex1-math2ap-add1': 18,
  'ex2-math2ap-add1': 59,
  'ex1-math2ap-numbers2': 65,
  'ex2-math2ap-numbers2': ['77 > 78 > 87', '78 > 87 > 77'],
  'ex1-math2ap-numbers3': 4,
  'ex2-math2ap-numbers3': 629,
  'ex1-math2ap-add2': 1,
  'ex2-math2ap-add2': 73,
  'ex1-math2ap-sub1': 23,
  'ex2-math2ap-sub1': 33,
  'ex1-math2ap-shapes': 4,
  'ex2-math2ap-shapes': ['مُرَبَّعٌ', 'مُثَلَّثٌ'],
  'ex1-math2ap-doublehalf': 6,
  'ex2-math2ap-doublehalf': 8,
  'ex1-math2ap-measures': ['الزَّهْرَةُ'],
  'ex2-math2ap-measures': ['القِطَّةُ'],
  'ex1-math2ap-ruler': ['م', 'كغ'],
  'ex2-math2ap-ruler': 12,
  'ex1-math2ap-clock': ['الكَبِيرُ'],
  'ex2-math2ap-clock': ['الثانية عشرة تماماً (12:00)', 'التاسعة والنصف (9:30)'],
  'ex1-math2ap-halfhour': 30,
  'ex2-math2ap-halfhour': ['العاشرة والنصف (10:30)', 'التاسعة تماماً (9:00)'],
  'ex1-math2ap-currency': 60,
  'ex2-math2ap-currency': 50,
  'ex1-math2ap-subcarry': 12,
  'ex2-math2ap-subcarry': 34,
  'ex1-math2ap-frame': 50,
  'ex2-math2ap-frame': ['300 < 215 < 400', '100 < 215 < 200'],
  'ex1-math2ap-rightangle': ['الدَّائِرَةُ'],
  'ex2-math2ap-rightangle': ['المِسْطَرَةُ', 'المِيزَانُ'],
  'ex1-math2ap-meter': 100,
  'ex2-math2ap-meter': ['بِالسَّنْتِيمِتْرِ'],
  'ex1-math2ap-kg': ['عُلْبَةُ البَسْكَوِيتِ'],
  'ex2-math2ap-kg': ['غ'],
  'ex1-math2ap-mult': 6,
  'ex2-math2ap-mult': 12,
};

function withCheck(ex: ProgressiveExercise): ProgressiveExercise {
  const check = CHECKS[ex.id];
  if (check === undefined || ex.type) return ex;
  if (typeof check === 'number') return { ...ex, type: 'calculation', calculationAnswer: check };
  return {
    ...ex,
    type: 'qcm',
    options: [
      { id: 'a', textAr: ex.solutionAr, isCorrect: true },
      ...check.map((textAr, index) => ({ id: String.fromCharCode(98 + index), textAr, isCorrect: false })),
    ],
  };
}

export const withCheckedMathAnswers = (lessons: CourseLesson[]): CourseLesson[] =>
  lessons.map(lesson => ({ ...lesson, progressiveExercises: lesson.progressiveExercises?.map(withCheck) }));
