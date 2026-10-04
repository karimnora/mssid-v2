export type MosqueChoice = 'right_foot' | 'left_foot' | 'quiet' | 'run' | 'eat' | 'listen' | 'shout';

export interface MosqueScene {
  id: string;
  titleAr: string;
  promptAr: string;
  options: { id: MosqueChoice; labelAr: string }[];
  correct: MosqueChoice;
}

export const MOSQUE_SCENES: MosqueScene[] = [
  {
    id: 'enter',
    titleAr: 'دُخُولُ المَسْجِدِ',
    promptAr: 'أَصِلُ إِلَى بَابِ المَسْجِدِ. بِأَيِّ قَدَمٍ أَدْخُلُ؟',
    options: [
      { id: 'right_foot', labelAr: 'أَدْخُلُ بِالقَدَمِ اليُمْنَى' },
      { id: 'left_foot', labelAr: 'أَدْخُلُ بِالقَدَمِ اليُسْرَى' },
      { id: 'run', labelAr: 'أَرْكُضُ مِنَ البَابِ' },
    ],
    correct: 'right_foot',
  },
  {
    id: 'inside',
    titleAr: 'دَاخِلَ المَسْجِدِ',
    promptAr: 'دَخَلْتُ. كَيْفَ أَتَصَرَّفُ؟',
    options: [
      { id: 'quiet', labelAr: 'أَمْشِي بِهُدُوءٍ وَلَا أَرْفَعُ صَوْتِي' },
      { id: 'run', labelAr: 'أَجْرِي بَيْنَ الصُّفُوفِ' },
      { id: 'eat', labelAr: 'آكُلُ شِيبْس فِي الزَّاوِيَةِ' },
    ],
    correct: 'quiet',
  },
  {
    id: 'adhan',
    titleAr: 'عِنْدَ الأَذَانِ',
    promptAr: 'سَمِعْتُ الأَذَانَ وَأَنَا فِي السَّاحَةِ. مَاذَا أَفْعَلُ؟',
    options: [
      { id: 'listen', labelAr: 'أُنْصِتُ وَأُكَرِّرُ مَعَ المُؤَذِّنِ' },
      { id: 'shout', labelAr: 'أَصْرُخُ لِأَصْدِقَائِي' },
      { id: 'run', labelAr: 'أُكْمِلُ لُعْبَةَ الكُرَةِ' },
    ],
    correct: 'listen',
  },
  {
    id: 'after',
    titleAr: 'بَعْدَ الصَّلَاةِ',
    promptAr: 'انْتَهَتِ الصَّلَاةُ. كَيْفَ أَخْرُجُ؟',
    options: [
      { id: 'quiet', labelAr: 'أُسَلِّمُ بِهُدُوءٍ وَأَخْرُجُ دُونَ زَحْمَةٍ' },
      { id: 'run', labelAr: 'أَدْفَعُ النَّاسَ لِأَخْرُجَ الأَوَّلَ' },
      { id: 'shout', labelAr: 'أُنَادِي بِصَوْتٍ عَالٍ' },
    ],
    correct: 'quiet',
  },
];

export function isMosqueAnswerCorrect(sceneId: string, choice: MosqueChoice): boolean {
  return MOSQUE_SCENES.find((scene) => scene.id === sceneId)?.correct === choice;
}
