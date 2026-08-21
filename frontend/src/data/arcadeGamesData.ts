import { PrimaryGrade } from '../types';

export interface ArcadeGameDef {
  id: string;
  titleAr: string;
  titleFr: string;
  descAr: string;
  descFr: string;
  icon: string;
  gradient: string;
  grades: PrimaryGrade[];
  xpUnlock: number;
  badgeUnlock?: string;
  xpReward: number;
}

export const ARCADE_GAMES: ArcadeGameDef[] = [
  {
    id: 'number_sort',
    titleAr: 'طابور الأعداد',
    titleFr: 'File de Nombres',
    descAr: 'رتّب الأعداد من الأصغر إلى الأكبر!',
    descFr: 'Trie les nombres du plus petit au plus grand !',
    icon: '🔢',
    gradient: 'from-sky-400 to-blue-600',
    grades: ['1AP', '2AP', '3AP', '4AP', '5AP'],
    xpUnlock: 0,
    xpReward: 15,
  },
  {
    id: 'dido_runner',
    titleAr: 'ديدو العدّاء',
    titleFr: 'Dido le Coureur',
    descAr: 'اقفز فوق العقبات وأطل مسافة الجري!',
    descFr: 'Saute par-dessus les obstacles et cours le plus loin !',
    icon: '🦊',
    gradient: 'from-orange-400 to-rose-500',
    grades: ['1AP', '2AP', '3AP', '4AP', '5AP'],
    xpUnlock: 0,
    xpReward: 20,
  },
  {
    id: 'tower_stack',
    titleAr: 'بناء البرج',
    titleFr: 'Construis la Tour',
    descAr: 'ضع الطوابق بدقة وارفع برجك للسماء!',
    descFr: 'Empile les blocs parfaitement et monte jusqu\'au ciel !',
    icon: '🏗️',
    gradient: 'from-teal-400 to-emerald-600',
    grades: ['1AP', '2AP', '3AP', '4AP', '5AP'],
    xpUnlock: 50,
    xpReward: 20,
  },
  {
    id: 'spelling_champ',
    titleAr: 'بطل الإملاء',
    titleFr: "Champion d'Orthographe",
    descAr: 'اختر الكتابة الصحيحة للكلمة!',
    descFr: 'Choisis la bonne orthographe du mot !',
    icon: '✍️',
    gradient: 'from-violet-400 to-purple-600',
    grades: ['2AP', '3AP', '4AP', '5AP'],
    xpUnlock: 150,
    badgeUnlock: 'b_challenge_master',
    xpReward: 20,
  },
  {
    id: 'galaxy_3d',
    titleAr: 'مجرة النجوم 3D',
    titleFr: 'Galaxie des Étoiles 3D',
    descAr: 'طُف في الفضاء واجمع النجوم ثلاثية الأبعاد!',
    descFr: 'Vole dans l\'espace et collecte les étoiles en 3D !',
    icon: '🌌',
    gradient: 'from-indigo-500 to-purple-800',
    grades: ['1AP', '2AP', '3AP', '4AP', '5AP'],
    xpUnlock: 200,
    xpReward: 25,
  },
  {
    id: 'math_stars',
    titleAr: 'حرب النجوم',
    titleFr: 'Guerre des Étoiles Math',
    descAr: 'أجب على العمليات الحسابية قبل سقوط النيازك!',
    descFr: 'Réponds aux calculs avant que les astéroïdes ne tombent !',
    icon: '⭐',
    gradient: 'from-amber-400 to-orange-600',
    grades: ['3AP', '4AP', '5AP'],
    xpUnlock: 350,
    badgeUnlock: 'b_challenge_legend',
    xpReward: 30,
  },
];
