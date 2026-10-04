/** Official 2AP pedagogical wudu order (islamic-2ap-t1-wudu-steps). */

export interface WuduStep {
  id: string;
  order: number;
  target: 'niyyah' | 'hands' | 'mouth' | 'face' | 'arms' | 'head' | 'feet';
  titleAr: string;
  descAr: string;
}

export const WUDU_STEPS: WuduStep[] = [
  {
    id: 'niyyah',
    order: 1,
    target: 'niyyah',
    titleAr: 'النِّيَّةُ وَالبَسْمَلَةُ',
    descAr: 'أَنْوِي التَّوَضُّؤَ بِقَلْبِي وَأَقُولُ «بِسْمِ اللهِ».',
  },
  {
    id: 'hands',
    order: 2,
    target: 'hands',
    titleAr: 'غَسْلُ اليَدَيْنِ',
    descAr: 'أَغْسِلُ كَفَّيَّ إِلَى الرُّسْغَيْنِ ثَلَاثَ مَرَّاتٍ.',
  },
  {
    id: 'mouth',
    order: 3,
    target: 'mouth',
    titleAr: 'المَضْمَضَةُ وَالاسْتِنْشَاقُ',
    descAr: 'أُدْخِلُ المَاءَ إِلَى فَمِي وَأَنْفِي ثُمَّ أُخْرِجُهُ.',
  },
  {
    id: 'face',
    order: 4,
    target: 'face',
    titleAr: 'غَسْلُ الوَجْهِ',
    descAr: 'أَغْسِلُ وَجْهِي كَامِلاً مِنْ مَنْبَتِ الشَّعْرِ إِلَى الذَّقَنِ.',
  },
  {
    id: 'arms',
    order: 5,
    target: 'arms',
    titleAr: 'غَسْلُ الذِّرَاعَيْنِ',
    descAr: 'أَغْسِلُ اليَدَيْنِ إِلَى المِرْفَقَيْنِ.',
  },
  {
    id: 'head',
    order: 6,
    target: 'head',
    titleAr: 'مَسْحُ الرَّأْسِ',
    descAr: 'أَمْسَحُ رَأْسِي بِيَدَيَّ المُبَلَّلَتَيْنِ.',
  },
  {
    id: 'feet',
    order: 7,
    target: 'feet',
    titleAr: 'غَسْلُ القَدَمَيْنِ',
    descAr: 'أَغْسِلُ قَدَمَيَّ إِلَى الكَعْبَيْنِ.',
  },
];

export function wuduStepAt(doneCount: number): WuduStep | undefined {
  return WUDU_STEPS[doneCount];
}

export function isWuduTargetCorrect(doneCount: number, target: WuduStep['target']): boolean {
  return WUDU_STEPS[doneCount]?.target === target;
}

export const WUDU_QUIZ = [
  {
    id: 'q1',
    questionAr: 'مَاذَا أَقُولُ قَبْلَ أَنْ أَبْدَأَ الوُضُوءَ؟',
    optionsAr: ['بِسْمِ اللهِ', 'الحَمْدُ لِلَّهِ', 'السَّلَامُ عَلَيْكُمْ'],
    correctAr: 'بِسْمِ اللهِ',
  },
  {
    id: 'q2',
    questionAr: 'مَا آخِرُ عُضْوٍ نَغْسِلُهُ فِي الوُضُوءِ؟',
    optionsAr: ['القَدَمَانِ إِلَى الكَعْبَيْنِ', 'اليَدَانِ', 'الوَجْهُ'],
    correctAr: 'القَدَمَانِ إِلَى الكَعْبَيْنِ',
  },
  {
    id: 'q3',
    questionAr: 'لِمَاذَا نَتَوَضَّأُ؟',
    optionsAr: ['لِنَكُونَ عَلَى طَهَارَةٍ قَبْلَ الصَّلَاةِ', 'لِنَلْعَبَ بِالمَاءِ', 'لِنَأْكُلَ فَقَطْ'],
    correctAr: 'لِنَكُونَ عَلَى طَهَارَةٍ قَبْلَ الصَّلَاةِ',
  },
] as const;
