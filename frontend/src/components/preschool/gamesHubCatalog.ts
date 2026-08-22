export type GameId =
  | 'car_maze' | 'farm' | 'balloon_pop' | 'fruit_catcher' | 'shape_sorter'
  | 'car_wash' | 'puzzle' | 'hide_dido' | 'little_fisher' | 'dress_dido';

export interface GameCard {
  id: GameId;
  icon: string;
  titleAr: string; titleFr: string; titleEn: string;
  descAr: string;  descFr: string;  descEn: string;
  gradient: string;
  border: string;
  badge: string;
  progressId: string;
  maxLevels: number;
}

export const GAMES: GameCard[] = [
  {
    id: 'car_maze',
    icon: '🚦',
    titleAr: 'في المدينة', titleFr: 'En Ville', titleEn: 'Around Town',
    descAr: 'دراجة، تاكسي، دراجة نارية وقطار — 10 مسارات!', descFr: 'Vélo, taxi, moto et train — 10 parcours !', descEn: 'Bike, taxi, moto and train — 10 routes!',
    gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-300', badge: '🕹️ Labyrinthe',
    progressId: 'car_maze', maxLevels: 10,
  },
  {
    id: 'farm',
    icon: '🐄',
    titleAr: 'في المزرعة', titleFr: 'À la Ferme', titleEn: 'On the Farm',
    descAr: 'أرنب، بطة، كلب وحمار — 14 مساراً!', descFr: 'Lapin, canard, chien, âne — 14 parcours !', descEn: 'Rabbit, duck, dog, donkey — 14 routes!',
    gradient: 'from-lime-400 to-green-600', border: 'border-lime-300', badge: '🌾 Ferme',
    progressId: 'farm', maxLevels: 14,
  },
  {
    id: 'balloon_pop',
    icon: '🎈',
    titleAr: 'فرقع البالونات', titleFr: 'Éclate les Ballons', titleEn: 'Pop the Balloons',
    descAr: '8 عوالم — اضغط البالونات الضاحكة!', descFr: '8 mondes — éclate les ballons souriants !', descEn: '8 worlds — pop the smiley balloons!',
    gradient: 'from-rose-400 to-pink-600', border: 'border-rose-300', badge: '🎯 Réflexes',
    progressId: 'balloon_pop', maxLevels: 8,
  },
  {
    id: 'fruit_catcher',
    icon: '🍎',
    titleAr: 'السلة الجائعة', titleFr: 'Le Panier Gourmand', titleEn: 'Hungry Basket',
    descAr: 'تفاح، تمر، بطيخ — 8 سلال في السوق!', descFr: 'Pommes, dattes, pastèque — 8 paniers au souk !', descEn: 'Apples, dates, watermelon — 8 baskets at the souk!',
    gradient: 'from-emerald-400 to-green-600', border: 'border-emerald-300', badge: '⭐ Réactivité',
    progressId: 'fruit_catcher', maxLevels: 8,
  },
  {
    id: 'shape_sorter',
    icon: '🧩',
    titleAr: 'فرّز الأشكال والألوان', titleFr: 'Trieur de Formes', titleEn: 'Shape Sorter',
    descAr: 'ألوان، قلوب، أحجام — 8 مستويات!', descFr: 'Couleurs, cœurs, tailles — 8 niveaux !', descEn: 'Colors, hearts, sizes — 8 levels!',
    gradient: 'from-violet-400 to-purple-600', border: 'border-violet-300', badge: '🎨 Logique',
    progressId: 'shape_sorter', maxLevels: 8,
  },
  {
    id: 'car_wash',
    icon: '🧼',
    titleAr: 'اغسل السيارة الوسخة!', titleFr: 'Lave la Voiture !', titleEn: 'Car Wash Fun!',
    descAr: 'امسح الطين وأضفِ البريق للسيارة', descFr: 'Frotte la voiture et fais-la briller !', descEn: 'Scrub the mud and make it shine!',
    gradient: 'from-cyan-400 to-sky-600', border: 'border-cyan-300', badge: '💧 Amusant',
    progressId: 'car_wash', maxLevels: 4,
  },
  {
    id: 'hide_dido',
    icon: '🦊',
    titleAr: 'أين ديدو؟', titleFr: 'Où est Dido ?', titleEn: 'Where is Dido?',
    descAr: 'صحراء، سوق، قصبة، شاطئ — 8 مشاهد!', descFr: 'Sahara, souk, casbah, plage — 8 scènes !', descEn: 'Sahara, souk, casbah, beach — 8 scenes!',
    gradient: 'from-amber-400 to-orange-600', border: 'border-amber-300', badge: '👀 Cherche',
    progressId: 'hide_dido', maxLevels: 8,
  },
  {
    id: 'dress_dido',
    icon: '👕',
    titleAr: 'أَلْبِسْ دِيدُو', titleFr: 'Habille Dido', titleEn: 'Dress Dido',
    descAr: 'حسب الطقس — شمس، مطر، ثلج، صحراء!', descFr: 'Selon le temps — soleil, pluie, neige, Sahara !', descEn: 'According to the weather — sun, rain, snow, Sahara!',
    gradient: 'from-rose-400 to-orange-500', border: 'border-rose-300', badge: '🧥 Météo',
    progressId: 'dress_dido', maxLevels: 8,
  },
  {
    id: 'little_fisher',
    icon: '🎣',
    titleAr: 'الصياد الصغير', titleFr: 'Le Petit Pêcheur', titleEn: 'The Little Fisher',
    descAr: 'المس السمك — ليس الطحلب! 8 مستويات', descFr: 'Touche les poissons, pas les algues — 8 niveaux', descEn: 'Tap the fish, not the seaweed — 8 levels',
    gradient: 'from-sky-400 to-cyan-600', border: 'border-sky-300', badge: '🌊 Mer',
    progressId: 'little_fisher', maxLevels: 8,
  },
  {
    id: 'puzzle',
    icon: '🧩',
    titleAr: 'أَلْغَازُ دِيدُو', titleFr: 'Le Puzzle de Dido', titleEn: "Dido's Puzzle",
    descAr: 'ضع كل صورة على ظلّها — 4 ألواح!', descFr: 'Pose chaque image sur son ombre — 4 tableaux !', descEn: 'Put each picture on its shadow — 4 boards!',
    gradient: 'from-amber-400 to-orange-500', border: 'border-amber-300', badge: '🧠 Puzzle',
    progressId: 'puzzle', maxLevels: 4,
  },
];
