export type GameId =
  | 'car_maze' | 'farm' | 'balloon_pop' | 'fruit_catcher' | 'shape_sorter'
  | 'puzzle' | 'little_fisher' | 'dress_dido';

export interface GameCard {
  id: GameId;
  icon: string;
  titleAr: string; titleFr: string; titleEn: string;
  descAr: string;  descFr: string;  descEn: string;
  gradient: string;
  border: string;
  badgeAr: string;
  badgeFr: string;
  badgeEn: string;
  progressId: string;
  maxLevels: number;
}

export const GAMES: GameCard[] = [
  {
    id: 'car_maze',
    icon: '🚦',
    titleAr: 'فِي المَدِينَة', titleFr: 'En ville', titleEn: 'In town',
    descAr: 'دَرَّاجَة، تَاكْسِي، دَرَّاجَة نَارِيَّة وَقِطَار — 10 مَسَارَات!',
    descFr: 'Vélo, taxi, moto et train — 10 parcours !',
    descEn: 'Bike, taxi, motorbike and train — 10 routes!',
    gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-300',
    badgeAr: '🕹️ مَتَاهَة', badgeFr: '🕹️ Labyrinthe', badgeEn: '🕹️ Maze',
    progressId: 'car_maze', maxLevels: 10,
  },
  {
    id: 'farm',
    icon: '🐄',
    titleAr: 'فِي المَزْرَعَة', titleFr: 'À la ferme', titleEn: 'On the farm',
    descAr: 'أَرْنَب، بَطَّة، كَلْب وَحِمَار — 14 مَسَاراً!',
    descFr: 'Lapin, canard, chien, âne — 14 parcours !',
    descEn: 'Rabbit, duck, dog, donkey — 14 routes!',
    gradient: 'from-lime-400 to-green-600', border: 'border-lime-300',
    badgeAr: '🌾 مَزْرَعَة', badgeFr: '🌾 Ferme', badgeEn: '🌾 Farm',
    progressId: 'farm', maxLevels: 14,
  },
  {
    id: 'balloon_pop',
    icon: '🎈',
    titleAr: 'فَرْقِعِ الْبَالُونَات', titleFr: 'Éclate les ballons', titleEn: 'Pop the balloons',
    descAr: '8 عَوَالِم — اِضْغَطِ الْبَالُونَات الضَّاحِكَة!',
    descFr: '8 mondes — éclate les ballons souriants !',
    descEn: '8 worlds — pop the smiley balloons!',
    gradient: 'from-rose-400 to-pink-600', border: 'border-rose-300',
    badgeAr: '🎯 رَدُّ فِعْل', badgeFr: '🎯 Réflexes', badgeEn: '🎯 Reflexes',
    progressId: 'balloon_pop', maxLevels: 8,
  },
  {
    id: 'fruit_catcher',
    icon: '🍎',
    titleAr: 'السَّلَةُ الْجَائِعَة', titleFr: 'Le panier gourmand', titleEn: 'The hungry basket',
    descAr: 'تُفَّاح، تَمْر، بَطِّيخ — 8 سِلَال فِي السُّوق!',
    descFr: 'Pommes, dattes, pastèque — 8 paniers au souk !',
    descEn: 'Apples, dates, watermelon — 8 baskets at the souk!',
    gradient: 'from-emerald-400 to-green-600', border: 'border-emerald-300',
    badgeAr: '⭐ سُرْعَة', badgeFr: '⭐ Réactivité', badgeEn: '⭐ Speed',
    progressId: 'fruit_catcher', maxLevels: 8,
  },
  {
    id: 'shape_sorter',
    icon: '🧩',
    titleAr: 'رَتِّبِ الْأَشْكَال', titleFr: 'Range les formes', titleEn: 'Sort the shapes',
    descAr: 'أَلْوَان، قُلُوب، أَحْجَام — 8 مُسْتَوَيَات!',
    descFr: 'Couleurs, cœurs, tailles — 8 niveaux !',
    descEn: 'Colors, hearts, sizes — 8 levels!',
    gradient: 'from-violet-400 to-purple-600', border: 'border-violet-300',
    badgeAr: '🎨 مَنْطِق', badgeFr: '🎨 Logique', badgeEn: '🎨 Logic',
    progressId: 'shape_sorter', maxLevels: 8,
  },
  {
    id: 'dress_dido',
    icon: '👕',
    titleAr: 'أَلْبِسْ دِيدُو', titleFr: 'Habille Dido', titleEn: 'Dress Dido',
    descAr: 'حَسَبَ الطَّقْس — شَمْس، مَطَر، ثَلْج، صَحْرَاء!',
    descFr: 'Selon le temps — soleil, pluie, neige, Sahara !',
    descEn: 'Dress for the weather — sun, rain, snow, Sahara!',
    gradient: 'from-rose-400 to-orange-500', border: 'border-rose-300',
    badgeAr: '🧥 طَقْس', badgeFr: '🧥 Météo', badgeEn: '🧥 Weather',
    progressId: 'dress_dido', maxLevels: 8,
  },
  {
    id: 'little_fisher',
    icon: '🎣',
    titleAr: 'الصَّيَّادُ الصَّغِير', titleFr: 'Le petit pêcheur', titleEn: 'The little fisherman',
    descAr: 'اِلْمِسِ السَّمَكَ — لَيْسَ الطُّحْلُب! 8 مُسْتَوَيَات',
    descFr: 'Touche les poissons, pas les algues — 8 niveaux',
    descEn: 'Tap the fish, not the seaweed — 8 levels',
    gradient: 'from-sky-400 to-cyan-600', border: 'border-sky-300',
    badgeAr: '🌊 بَحْر', badgeFr: '🌊 Mer', badgeEn: '🌊 Sea',
    progressId: 'little_fisher', maxLevels: 8,
  },
  {
    id: 'puzzle',
    icon: '🧩',
    titleAr: 'بَازِلُ دِيدُو', titleFr: 'Le puzzle de Dido', titleEn: "Dido's puzzle",
    descAr: 'ضَعْ كُلَّ صُورَةٍ عَلَى ظِلِّهَا — 4 أَلْوَاح!',
    descFr: 'Pose chaque image sur son ombre — 4 tableaux !',
    descEn: 'Put each picture on its shadow — 4 boards!',
    gradient: 'from-amber-400 to-orange-500', border: 'border-amber-300',
    badgeAr: '🧠 بَازِل', badgeFr: '🧠 Puzzle', badgeEn: '🧠 Puzzle',
    progressId: 'puzzle', maxLevels: 4,
  },
];
