import type { PrimaryGrade } from '../../types';

/** Algeria drives on the right: a pedestrian looks left first, then right. */

export type RoadAction = 'stop' | 'wait' | 'cross' | 'look_left' | 'look_right' | 'sit' | 'run';

export interface RoadScene {
  id: string;
  titleAr: string;
  promptAr: string;
  options: { id: RoadAction; labelAr: string }[];
  correct: RoadAction;
  minGrade: PrimaryGrade;
}

export const ROAD_SCENES: RoadScene[] = [
  {
    id: 'red',
    titleAr: 'الضَّوْءُ الأَحْمَرُ',
    promptAr: 'الضَّوْءُ أَحْمَرُ فِي مَمَرِّ الرَّاجِلِينَ. مَاذَا أَفْعَلُ؟',
    options: [
      { id: 'stop', labelAr: 'أَتَوَقَّفُ عَلَى الرَّصِيفِ' },
      { id: 'cross', labelAr: 'أَعْبُرُ بِسُرْعَةٍ' },
      { id: 'run', labelAr: 'أَرْكُضُ وَسَطَ الشَّارِعِ' },
    ],
    correct: 'stop',
    minGrade: '2AP',
  },
  {
    id: 'green',
    titleAr: 'الضَّوْءُ الأَخْضَرُ',
    promptAr: 'الضَّوْءُ أَخْضَرُ وَنَظَرْتُ يَسَاراً ثُمَّ يَمِيناً. مَاذَا أَفْعَلُ؟',
    options: [
      { id: 'cross', labelAr: 'أَعْبُرُ فِي المَمَرِّ بِهُدُوءٍ' },
      { id: 'run', labelAr: 'أَلْعَبُ بَيْنَ السَّيَّارَاتِ' },
      { id: 'stop', labelAr: 'أَبْقَى وَسَطَ الطَّرِيقِ' },
    ],
    correct: 'cross',
    minGrade: '2AP',
  },
  {
    id: 'look',
    titleAr: 'أَنْظُرُ قَبْلَ العُبُورِ',
    promptAr: 'فِي الجَزَائِرِ السَّيَّارَاتُ تَأْتِي أَوَّلاً مِنَ اليَسَارِ. أَيْنَ أَنْظُرُ أَوَّلاً؟',
    options: [
      { id: 'look_left', labelAr: 'أَنْظُرُ يَسَاراً أَوَّلاً' },
      { id: 'look_right', labelAr: 'أَنْظُرُ يَمِيناً أَوَّلاً' },
      { id: 'run', labelAr: 'لَا أَنْظُرُ وَأَعْبُرُ' },
    ],
    correct: 'look_left',
    minGrade: '2AP',
  },
  {
    id: 'school',
    titleAr: 'أَمَامَ المَدْرَسَةِ',
    promptAr: 'وَصَلْتُ أَمَامَ المَدْرَسَةِ وَالحَافِلَةُ وَاقِفَةٌ. مَاذَا أَفْعَلُ؟',
    options: [
      { id: 'wait', labelAr: 'أَنْتَظِرُ خَلْفَ الخَطِّ وَأَعْبُرُ مَعَ الرَّشِيدِ' },
      { id: 'run', labelAr: 'أَمُرُّ مِنْ أَمَامِ الحَافِلَةِ' },
      { id: 'cross', labelAr: 'أَلْعَبُ كُرَةً فِي الطَّرِيقِ' },
    ],
    correct: 'wait',
    minGrade: '2AP',
  },
  {
    id: 'bus',
    titleAr: 'فِي الحَافِلَةِ أَوِ التِّرَامِ',
    promptAr: 'رَكِبْتُ الحَافِلَةَ وَرَأَيْتُ شَخْصاً أَكْبَرَ مِنِّي وَاقِفاً. مَاذَا أَفْعَلُ؟',
    options: [
      { id: 'sit', labelAr: 'أَتْرُكُ لَهُ مَكَانِي' },
      { id: 'run', labelAr: 'أَصْرُخُ وَأَتَحَرَّكُ' },
      { id: 'stop', labelAr: 'أُغْلِقُ البَابَ بِيَدِي' },
    ],
    correct: 'sit',
    minGrade: '5AP',
  },
];

const GRADE_RANK: Record<PrimaryGrade, number> = { '1AP': 1, '2AP': 2, '3AP': 3, '4AP': 4, '5AP': 5 };

export function roadScenesForGrade(grade: PrimaryGrade): RoadScene[] {
  return ROAD_SCENES.filter((scene) => GRADE_RANK[grade] >= GRADE_RANK[scene.minGrade]);
}

export function isRoadAnswerCorrect(sceneId: string, action: RoadAction): boolean {
  return ROAD_SCENES.find((scene) => scene.id === sceneId)?.correct === action;
}

export type CrossingStep = 'left' | 'right' | 'cross';

export function nextCrossingStep(done: CrossingStep[]): CrossingStep | 'done' {
  if (!done.includes('left')) return 'left';
  if (!done.includes('right')) return 'right';
  if (!done.includes('cross')) return 'cross';
  return 'done';
}
