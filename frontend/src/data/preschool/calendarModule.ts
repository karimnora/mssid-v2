import { PreschoolActivity, PreschoolListenCard, PreschoolModule, PreschoolSortItem } from './types';

/**
 * Days and months for Mode Éveil (3–5): hear each name, then sort the Algerian week.
 * Week starts Sunday. School Sunday–Thursday. Weekend Friday + Saturday.
 * Maghrebi month names (جانفي…ديسمبر). Ramadan is not a calendar month.
 */

const DAY_NAME = {
  sunday:    { ar: 'الأَحَد',     fr: 'Dimanche',  en: 'Sunday' },
  monday:    { ar: 'الإِثْنَيْن', fr: 'Lundi',     en: 'Monday' },
  tuesday:   { ar: 'الثُّلَاثَاء', fr: 'Mardi',     en: 'Tuesday' },
  wednesday: { ar: 'الأَرْبِعَاء', fr: 'Mercredi',  en: 'Wednesday' },
  thursday:  { ar: 'الخَمِيس',    fr: 'Jeudi',     en: 'Thursday' },
  friday:    { ar: 'الجُمُعَة',    fr: 'Vendredi',  en: 'Friday' },
  saturday:  { ar: 'السَّبْت',     fr: 'Samedi',    en: 'Saturday' },
} as const;

const MONTH_NAME = {
  january:   { ar: 'جَانْفِي',   fr: 'Janvier',   en: 'January' },
  february:  { ar: 'فِيفْرِي',   fr: 'Février',   en: 'February' },
  march:     { ar: 'مَارْس',     fr: 'Mars',      en: 'March' },
  april:     { ar: 'أَفْرِيل',   fr: 'Avril',     en: 'April' },
  may:       { ar: 'مَاي',       fr: 'Mai',       en: 'May' },
  june:      { ar: 'جُوَان',     fr: 'Juin',      en: 'June' },
  july:      { ar: 'جُوِيلِيَة', fr: 'Juillet',   en: 'July' },
  august:    { ar: 'أُوت',       fr: 'Août',      en: 'August' },
  september: { ar: 'سِبْتَمْبِر', fr: 'Septembre', en: 'September' },
  october:   { ar: 'أُكْتُوبَر',  fr: 'Octobre',   en: 'October' },
  november:  { ar: 'نُوفَمْبِر',  fr: 'Novembre',  en: 'November' },
  december:  { ar: 'دِيسَمْبِر',  fr: 'Décembre',  en: 'December' },
} as const;

const DAYS: { id: keyof typeof DAY_NAME; asset: string; school: boolean }[] = [
  { id: 'sunday',    asset: '☀️', school: true },
  { id: 'monday',    asset: '📘', school: true },
  { id: 'tuesday',   asset: '📗', school: true },
  { id: 'wednesday', asset: '📙', school: true },
  { id: 'thursday',  asset: '📕', school: true },
  { id: 'friday',    asset: '🕌', school: false },
  { id: 'saturday',  asset: '🧸', school: false },
];

const MONTHS: { id: keyof typeof MONTH_NAME; asset: string }[] = [
  { id: 'january',   asset: '❄️' },
  { id: 'february',  asset: '🌧️' },
  { id: 'march',     asset: '🌱' },
  { id: 'april',     asset: '🌸' },
  { id: 'may',       asset: '🌼' },
  { id: 'june',      asset: '☀️' },
  { id: 'july',      asset: '🍉' },
  { id: 'august',    asset: '🏖️' },
  { id: 'september', asset: '🎒' },
  { id: 'october',   asset: '🍂' },
  { id: 'november',  asset: '🌫️' },
  { id: 'december',  asset: '🧣' },
];

function listenCardsForDays(): PreschoolListenCard[] {
  return DAYS.map((day) => ({ id: day.id, asset: day.asset, label: DAY_NAME[day.id] }));
}

function listenCardsForMonths(slice: typeof MONTHS): PreschoolListenCard[] {
  return slice.map((month) => ({ id: month.id, asset: month.asset, label: MONTH_NAME[month.id] }));
}

function listenActivity(
  id: string,
  targetValue: string,
  stepNumber: number,
  cards: PreschoolListenCard[],
  i18n: PreschoolActivity['i18n'],
  mainSvgOrImage: string,
): PreschoolActivity {
  return {
    id,
    domain: 'world',
    targetValue,
    stepNumber,
    interactionType: 'listen_tap',
    i18n,
    visualAssets: { mainSvgOrImage, listenCards: cards },
  };
}

const sortItems: PreschoolSortItem[] = DAYS.map((day) => ({
  id: `day-${day.id}`,
  asset: day.asset,
  correctBinId: day.school ? 'school-bin' : 'weekend-bin',
  label: DAY_NAME[day.id],
}));

export const CALENDAR_MODULE: PreschoolModule = {
  id: 'preschool-calendar',
  domain: 'world',
  icon: '📅',
  totalSteps: 4,
  titleI18n: {
    ar: 'الأَيَّامُ وَالشُّهُور',
    fr: 'Jours et mois',
    en: 'Days and months',
  },
  activities: [
    listenActivity(
      'calendar-days',
      'days',
      1,
      listenCardsForDays(),
      {
        ar: {
          title: 'أَيَّامُ الأُسْبُوع',
          promptAudio: 'اِلْمَسْ كُلَّ يَوْمٍ لِتَسْمَعَ اسْمَه! نَبْدَأُ مِنَ الأَحَد!',
          promptText: 'الأسبوع الجزائري يبدأ يوم الأحد. المس كل بطاقة لسماع الاسم.',
          successAudio: 'أَحْسَنْت! سَمِعْتَ أَسْمَاءَ الأَيَّام!',
        },
        fr: {
          title: 'Les jours de la semaine',
          promptAudio: 'Touche chaque jour pour entendre son nom ! On commence par dimanche !',
          promptText: 'En Algérie, la semaine commence dimanche. L’enfant touche chaque carte pour entendre le nom.',
          successAudio: 'Bravo ! Tu as entendu les noms des jours !',
        },
        en: {
          title: 'Days of the week',
          promptAudio: 'Touch each day to hear its name! We start with Sunday!',
          promptText: 'In Algeria the week starts on Sunday. Tap each card to hear the name.',
          successAudio: 'Well done! You heard the names of the days!',
        },
      },
      '📅',
    ),
    listenActivity(
      'calendar-months-1',
      'months-1',
      2,
      listenCardsForMonths(MONTHS.slice(0, 6)),
      {
        ar: {
          title: 'الشُّهُورُ ١',
          promptAudio: 'اِلْمَسْ كُلَّ شَهْرٍ: جَانْفِي، فِيفْرِي، مَارْس، أَفْرِيل، مَاي، جُوَان!',
          promptText: 'أسماء الأشهر المغاربية: جانفي إلى جوان.',
          successAudio: 'مُمْتَاز! سَمِعْتَ أَوَّلَ سِتَّةِ أَشْهُر!',
        },
        fr: {
          title: 'Les mois 1',
          promptAudio: 'Touche chaque mois : janvier, février, mars, avril, mai, juin !',
          promptText: 'Noms maghrébins : جانفي … جوان.',
          successAudio: 'Super ! Tu as entendu les six premiers mois !',
        },
        en: {
          title: 'The months 1',
          promptAudio: 'Touch each month: January, February, March, April, May, June!',
          promptText: 'Maghrebi month names: جانفي to جوان.',
          successAudio: 'Great! You heard the first six months!',
        },
      },
      '❄️',
    ),
    listenActivity(
      'calendar-months-2',
      'months-2',
      3,
      listenCardsForMonths(MONTHS.slice(6)),
      {
        ar: {
          title: 'الشُّهُورُ ٢',
          promptAudio: 'اِلْمَسْ كُلَّ شَهْرٍ: جُوِيلِيَة، أُوت، سِبْتَمْبِر، أُكْتُوبَر، نُوفَمْبِر، دِيسَمْبِر!',
          promptText: 'جويلية إلى ديسمبر. أوت هو اسم الشهر في الجزائر.',
          successAudio: 'رَائِع! سَمِعْتَ كُلَّ الشُّهُور!',
        },
        fr: {
          title: 'Les mois 2',
          promptAudio: 'Touche chaque mois : juillet, août, septembre, octobre, novembre, décembre !',
          promptText: 'Juillet à décembre. Août se dit أوت en arabe maghrébin.',
          successAudio: 'Bravo ! Tu as entendu tous les mois !',
        },
        en: {
          title: 'The months 2',
          promptAudio: 'Touch each month: July, August, September, October, November, December!',
          promptText: 'July to December. August is أوت in Maghrebi Arabic.',
          successAudio: 'Wonderful! You heard all the months!',
        },
      },
      '🍉',
    ),
    {
      id: 'calendar-school-weekend',
      domain: 'world',
      targetValue: 'school-days',
      stepNumber: 4,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'مَدْرَسَة أَمْ عُطْلَة؟',
          promptAudio: 'الأَحَدُ إِلَى الخَمِيسِ مَعَ المَدْرَسَة. الجُمُعَةُ وَالسَّبْتُ عُطْلَة!',
          promptText: 'بداية الأسبوع: الأحد. مدرسة: الأحد–الخميس. عطلة نهاية الأسبوع: الجمعة والسبت.',
          successAudio: 'مُمْتَاز! تَعْرِفُ أُسْبُوعَ الجَزَائِر!',
        },
        fr: {
          title: 'École ou week-end ?',
          promptAudio: 'Dimanche à jeudi avec l\'école. Vendredi et samedi, c\'est le week-end !',
          promptText: 'La semaine commence dimanche. École : dimanche–jeudi. Week-end : vendredi et samedi.',
          successAudio: 'Super ! Tu connais la semaine algérienne !',
        },
        en: {
          title: 'School or weekend?',
          promptAudio: 'Sunday to Thursday with school. Friday and Saturday are the weekend!',
          promptText: 'The week starts Sunday. School: Sunday–Thursday. Weekend: Friday and Saturday.',
          successAudio: 'Excellent! You know the Algerian week!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏫',
        sortBins: [
          {
            id: 'school-bin',
            labelAsset: '🏫',
            label: { ar: 'مَدْرَسَة', fr: 'École', en: 'School' },
          },
          {
            id: 'weekend-bin',
            labelAsset: '🏠',
            label: { ar: 'عُطْلَة', fr: 'Week-end', en: 'Weekend' },
          },
        ],
        sortItems,
      },
    },
  ],
};
