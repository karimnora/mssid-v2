import { DidouOutfitItem, DidouTreatItem } from '../types/ecosystem';

export const DIDOU_OUTFITS_LIST: DidouOutfitItem[] = [
  {
    id: 'default',
    nameAr: 'ديدو المدرسي الذكي',
    nameFr: 'Didou Écolier',
    descriptionAr: 'الزي المدرسي الأساسي الجميل لديدو مع مئزر العلم والاجتهاد.',
    category: 'clothing',
    priceGoldCoins: 0,
    icon: '🎒',
    accentColor: '#059669',
  },
  {
    id: 'burnous_traditionnel',
    nameAr: 'البرنوس الجزائري الأصيل',
    nameFr: 'Burnous Traditionnel',
    descriptionAr: 'برنوس الهيبة والشهامة الصوفي الأبيض الموشى بالأصالة الجزائرية.',
    category: 'clothing',
    priceGoldCoins: 150,
    icon: '🧣',
    accentColor: '#D97706',
  },
  {
    id: 'cheche_sahara',
    nameAr: 'الشاش التارقي الصحراوي',
    nameFr: 'Chèche Saharien',
    descriptionAr: 'شاش النيل الأزرق وحماية رمال صحراء الجزائر الكبرى الشاسعة.',
    category: 'headwear',
    priceGoldCoins: 120,
    icon: '🏜️',
    accentColor: '#0284C7',
  },
  {
    id: 'robe_kabyle',
    nameAr: 'الجبة القبائلية المطرزة',
    nameFr: 'Robe / Tenue Kabyle',
    descriptionAr: 'زي الألوان الزاهية والنقوش الأمازيغية العريقة في جبال جرجرة.',
    category: 'clothing',
    priceGoldCoins: 180,
    icon: '🌺',
    accentColor: '#E11D48',
  },
  {
    id: 'maillot_verts_dz',
    nameAr: 'قميص الخضر الوطني 🇩🇿',
    nameFr: 'Maillot Verts DZ',
    descriptionAr: 'قميص أبطال الجزائر ومحاربي الصحراء برقم 1 2 3 فيفا لالجيري!',
    category: 'clothing',
    priceGoldCoins: 200,
    icon: '⚽',
    accentColor: '#16A34A',
  },
  {
    id: 'tarbouche_casbah',
    nameAr: 'طربوش القصبة العتيق',
    nameFr: 'Tarbouche de la Casbah',
    descriptionAr: 'طربوش أحمر أصيل من قصبة الجزائر المحروسة وتراثها المعماري الخالد.',
    category: 'headwear',
    priceGoldCoins: 100,
    icon: '🏰',
    accentColor: '#DC2626',
  },
  {
    id: 'chapeau_diplome',
    nameAr: 'قبعة التخرج والتفوق 5AP',
    nameFr: 'Toque de Diplômé',
    descriptionAr: 'قبعة الامتياز لشهادة النجاح والعبور إلى المتوسط بتفوق باهر.',
    category: 'headwear',
    priceGoldCoins: 300,
    icon: '🎓',
    accentColor: '#7C3AED',
  },
  {
    id: 'astronaute_dz',
    nameAr: 'بدلة رائد الفضاء المستكشف',
    nameFr: 'Astronaute de l’Espace',
    descriptionAr: 'بدلة الاستكشاف الفضائي لدراسة الكواكب والنجوم وحلقات كوكب زحل.',
    category: 'clothing',
    priceGoldCoins: 280,
    icon: '👨‍🚀',
    accentColor: '#4F46E5',
  },
  {
    id: 'docteur_savant',
    nameAr: 'معطف الطبيب والباحث العبقري',
    nameFr: 'Docteur & Scientifique',
    descriptionAr: 'معطف العلم الأبيض وسماعة الفحص الطبي لإجراء التجارب المخبرية.',
    category: 'clothing',
    priceGoldCoins: 220,
    icon: '🩺',
    accentColor: '#0EA5E9',
  },
  {
    id: 'chevalier_numidie',
    nameAr: 'درع الفارس النوميدي البطل',
    nameFr: 'Chevalier Numide',
    descriptionAr: 'درع فرسان ماسينيسا الشجعان رمز الشجاعة وعراقة التاريخ الجزائري.',
    category: 'clothing',
    priceGoldCoins: 350,
    icon: '🛡️',
    accentColor: '#B45309',
  },
  {
    id: 'pilote_aerien',
    nameAr: 'سترة طيار الخطوط الجوية',
    nameFr: 'Pilote de Ligne',
    descriptionAr: 'سترة الكابتن الطيار مع نظارات الطيران للتحليق فوق جبال الهقار.',
    category: 'clothing',
    priceGoldCoins: 260,
    icon: '✈️',
    accentColor: '#2563EB',
  },
];

export const DIDOU_TREATS_LIST: DidouTreatItem[] = [
  {
    id: 'deglet_nour',
    nameAr: 'تمر دقلة نور بسكرة 🌴',
    nameFr: 'Dattes Deglet Nour de Biskra',
    icon: '🌴',
    energyBonus: 25,
    xpBonus: 10,
    priceGoldCoins: 15,
    descriptionAr: 'سيدة التمور الجزائرية الذهبية، تمنح ديدو طاقة وحيوية فورية!',
    descriptionFr: 'La reine des dattes algériennes, donne un boost d’énergie immédiat !',
    originWilayaAr: 'ولاية بسكرة (07)',
  },
  {
    id: 'lait_frais',
    nameAr: 'كوب حليب البقرة الطازج 🥛',
    nameFr: 'Verre de Lait Frais',
    icon: '🥛',
    energyBonus: 20,
    xpBonus: 8,
    priceGoldCoins: 10,
    descriptionAr: 'غني بالكالسيوم لتقوية عظام وذكاء ديدو.',
    descriptionFr: 'Riche en calcium pour fortifier le corps et l’esprit.',
    originWilayaAr: 'مزارع متيجة وسهل الهضاب',
  },
  {
    id: 'pomme_medea',
    nameAr: 'تفاحة بساتين المدية المقرمشة 🍎',
    nameFr: 'Pomme Croquante de Médéa',
    icon: '🍎',
    energyBonus: 30,
    xpBonus: 12,
    priceGoldCoins: 20,
    descriptionAr: 'تفاح أحمر لذيذ غني بالفيتامينات والمعادن المنعشة.',
    descriptionFr: 'Pomme juteuse des vergers de Médéa pour une santé de fer.',
    originWilayaAr: 'ولاية المدية (26)',
  },
  {
    id: 'miel_djurdjura',
    nameAr: 'عسل السدر والجبلي النقي 🍯',
    nameFr: 'Miel Pur du Djurdjura',
    icon: '🍯',
    energyBonus: 40,
    xpBonus: 20,
    priceGoldCoins: 35,
    descriptionAr: 'عسل الجبال الشافي اللذيذ، يرفع طاقة وسعادة ديدو لأقصى درجة!',
    descriptionFr: 'Miel pur des montagnes de Kabylie, revitalise Didou au maximum !',
    originWilayaAr: 'جبال جرجرة والأوراس',
  },
  {
    id: 'orange_boufarik',
    nameAr: 'عصير برتقال بوفاريك الطازج 🍊',
    nameFr: 'Jus d’Orange Frais de Boufarik',
    icon: '🍊',
    energyBonus: 25,
    xpBonus: 10,
    priceGoldCoins: 15,
    descriptionAr: 'عصير البرتقال المنعش الغني بفيتامين C لصباح نشيط!',
    descriptionFr: 'Plein de vitamine C pour bien démarrer les révisions du matin !',
    originWilayaAr: 'ولاية البليدة (09)',
  },
];

export interface DidouStageInfo {
  stage: 1 | 2 | 3;
  nameAr: string;
  nameFr: string;
  minLevel: number;
  iconFennec: string;
  iconEagle: string;
  badgeTitleAr: string;
  badgeTitleFr: string;
  perksAr: string[];
  perksFr: string[];
}

export const DIDOU_STAGES: DidouStageInfo[] = [
  {
    stage: 1,
    nameAr: 'المستكشف الصغير (الطفولة والفضول)',
    nameFr: 'Bébé Explorateur',
    minLevel: 1,
    iconFennec: '🐾',
    iconEagle: '🐣',
    badgeTitleAr: 'صديق وفي مبتدئ',
    badgeTitleFr: 'Jeune Apprenti',
    perksAr: ['ردود فعل لطيفة', 'طاقة أساسية 100%', 'تفاعل بصري فوري'],
    perksFr: ['Réactions mignonnes', 'Énergie de base 100%', 'Interactions douces'],
  },
  {
    stage: 2,
    nameAr: 'التلميذ المجتهد ديدو (مرحلة التعلم)',
    nameFr: 'Écolier Brillant',
    minLevel: 4,
    iconFennec: '🦊🎒',
    iconEagle: '🦅📚',
    badgeTitleAr: 'رفيق الدراسة المثالي',
    badgeTitleFr: 'Compagnon d’Étude',
    perksAr: ['مكافأة +10% في قطع الذهب عند حل التمارين', 'أزياء إضافية مفتوحة', 'نصائح ذكية مخصصة'],
    perksFr: ['Bonus +10% de pièces d’or', 'Accès à des tenues exclusives', 'Conseils d’étude personnalisés'],
  },
  {
    stage: 3,
    nameAr: 'الحكيم البطل القائد (قمة التفوق)',
    nameFr: 'Grand Sage & Héros',
    minLevel: 8,
    iconFennec: '👑✨',
    iconEagle: '🦅👑',
    badgeTitleAr: 'أسطورة مسيد والجزائر',
    badgeTitleFr: 'Maître Légendaire',
    perksAr: ['تاج التفوق والبريق الذهبي', 'مكافأة +25% في نقاط الخبرة XP', 'أصوات احتفالية وحركات خاصة'],
    perksFr: ['Couronne royale & étincelles', 'Bonus +25% XP', 'Animations festives exclusives'],
  },
];

export const DIDOU_DIALOGUES_AR = [
  'أهلاً يا بطل! أنا ديدو صديقك المفضل، هل نراجع الرياضيات أو العلوم اليوم؟ 📐',
  'أنت تتقدم بشكل رائع! كل درس تقرؤه يجعلك أقوى وأذكى! 🌟',
  'العقل السليم في الجسم السليم! تذكر شرب الماء والجلوس بوضعية مريحة 💧',
  'العلم نور والجهل ظلام، خطوة بخطوة سنحصل على علامة 10/10 في الامتحان! 💯',
  'ما رأيك في تذوق حبة تمر من بسكرة؟ تعطيني طاقة لأشجعك أكثر! 🌴',
  'أنا فخور بك جداً يا صديقي، شكراً لأنك تجتهد كل يوم! ❤️',
];

export const DIDOU_DIALOGUES_FR = [
  'Salut champion ! Prêt pour une nouvelle aventure d’apprentissage aujourd’hui ? 🚀',
  'Chaque exercice réussi te rapproche de ton grand diplôme de fin d’année ! 🎓',
  'Prends une petite pause, bois un verre d’eau et étire-toi ! 💧',
  'Bravo pour ta persévérance ! Les grands savants ont tous commencé comme toi ! 🌟',
  'Tu peux me donner une datte ou un verre de lait pour recharger mon énergie ? 🥛',
  'Je suis tellement fier d’être ton compagnon d’étude ! Continuons ensemble ! ❤️',
];

