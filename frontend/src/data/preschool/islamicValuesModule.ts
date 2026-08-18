import { PreschoolModule } from './types';

/**
 * "قِيَمِي وَإِيمَانِي الصَّغِيرُ" — Éveil islamique & valeurs sociales (3-5 ans).
 *
 * NOTE DE CONCEPTION :
 * - Aucune récitation de versets coraniques n'est incluse par choix produit
 *   (évite les déformations liées à la synthèse vocale Web Speech API sans voix préenregistrées).
 * - Utilisation exclusive des interactions `tap_choice` et `sorting`.
 * - Diacritisme arabe (تَشْكِيل) ajusté spécifiquement pour une prononciation TTS fluide.
 */
export const ISLAMIC_VALUES_MODULE: PreschoolModule = {
  id: 'preschool-islamic-values',
  domain: 'values',
  icon: '🕌',
  totalSteps: 4,
  titleI18n: {
    ar: 'قِيَمِي وَإِيمَانِي الصَّغِيرُ',
    fr: 'Mes Valeurs & Ma Petite Foi',
    en: 'My Values & My Little Faith',
  },
  activities: [
    {
      id: 'values-bismillah',
      domain: 'values',
      targetValue: 'bismillah',
      stepNumber: 1,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'بِسْمِ اللَّهِ قَبْلَ الأَكْلِ',
          promptAudio: 'قَبْلَ أَنْ نَأْكُلَ نَقُولُ: بِسْمِ اللَّهِ! مَتَى نَقُولُهَا؟ اِلْمِسِ الطَّعَامَ!',
          promptText: 'علّم طفلك قول "بِسْمِ اللَّهِ" قبل البدء في الأكل أو الشرب.',
          successAudio: 'أَحْسَنْتَ يَا بَطَل! بِسْمِ اللَّهِ قَبْلَ كُلِّ طَعَام!',
        },
        fr: {
          title: 'Bismillah (Au nom de Dieu)',
          promptAudio: 'Avant de manger, on dit : Bismillah ! Touche la nourriture !',
          promptText: 'Apprenez à votre enfant à dire "Bismillah" avant de manger et boire.',
          successAudio: 'Bravo ! Bismillah avant chaque repas !',
        },
        en: {
          title: 'Bismillah (In the name of Allah)',
          promptAudio: 'Before we eat, we say: Bismillah! Tap the food!',
          promptText: 'Teach your child to say Bismillah before eating and drinking.',
          successAudio: 'Well done! Bismillah before every meal!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍱',
        choices: [
          { id: 'food', asset: '🍎', isCorrect: true },
          { id: 'car', asset: '🚗', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-alhamdulillah',
      domain: 'values',
      targetValue: 'alhamdulillah',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'الحَمْدُ لِلَّهِ بَعْدَ الأَكْلِ',
          promptAudio: 'عِنْدَمَا نَنْتَهِي مِنَ الأَكْلِ نَقُولُ: الحَمْدُ لِلَّهِ! اِلْمِسِ الوَجْهَ السَّعِيد!',
          promptText: 'شجّع طفلك على شكر الله وقول "الحَمْدُ لِلَّهِ" بعد الشبع.',
          successAudio: 'مُمْتَاز! الحَمْدُ لِلَّهِ المُنْعِمِ الكَرِيم!',
        },
        fr: {
          title: 'Alhamdulillah (Louange à Dieu)',
          promptAudio: 'Quand on a fini de manger, on dit : Alhamdulillah ! Touche le visage joyeux !',
          promptText: 'Apprenez à votre enfant à remercier Allah en disant "Alhamdulillah".',
          successAudio: 'Super ! Alhamdulillah pour tous ces bienfaits !',
        },
        en: {
          title: 'Alhamdulillah (Praise be to Allah)',
          promptAudio: 'When we finish eating, we say: Alhamdulillah! Tap the happy face!',
          promptText: 'Encourage your child to thank Allah by saying "Alhamdulillah".',
          successAudio: 'Excellent! Alhamdulillah for all blessings!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🤲',
        choices: [
          { id: 'happy', asset: '😋', isCorrect: true },
          { id: 'sad', asset: '😢', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-salam',
      domain: 'values',
      targetValue: 'salam',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'السَّلَامُ عَلَيْكُمْ',
          promptAudio: 'عِنْدَمَا نَلْتَقِي بِالأَصْدِقَاءِ نَقُولُ: السَّلَامُ عَلَيْكُمْ! اِلْمِسِ اليَدَيْنِ المَُصَافِحَتَيْن!',
          promptText: 'علّم طفلك إفشاء السلام ومصافحة الآخرين بأدب.',
          successAudio: 'رَائِع! السَّلَامُ يَنْشُرُ المَحَبَّةَ بَيْنَنَا!',
        },
        fr: {
          title: 'As-salamu \'alaykum (La paix soit sur vous)',
          promptAudio: 'Quand on croise un ami, on dit : As-salamu \'alaykum ! Touche les mains qui saluent !',
          promptText: 'Apprenez à votre enfant à saluer les autres avec le sourire.',
          successAudio: 'Bravo ! Le Salam répand l\'amour autour de nous !',
        },
        en: {
          title: 'As-salamu \'alaykum (Peace be upon you)',
          promptAudio: 'When we meet a friend, we say: As-salamu \'alaykum! Tap the shaking hands!',
          promptText: 'Teach your child to greet others politely.',
          successAudio: 'Wonderful! Saying Salam spreads love and joy!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🙋‍♂️',
        choices: [
          { id: 'handshake', asset: '🤝', isCorrect: true },
          { id: 'turnaway', asset: '🙈', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-good-manners',
      domain: 'values',
      targetValue: 'manners',
      stepNumber: 4,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أَخْلَاقِي الجَمِيلَةُ',
          promptAudio: 'ضَعِ التَّصَرُّفَ الطَّيِّبَ مَعَ الوَجْهِ الضَّاحِك، وَالتَّصَرُّفَ الخَاطِئَ مَعَ الوَجْهِ الحَزِين!',
          promptText: 'ساعد طفلك على التمييز بين السلوك الإيجابي (كالمشاركة) والسلوك السلبي.',
          successAudio: 'يَا لَكَ مِنْ طِفْلٍ مُهَذَّبٍ وَرَائِع! أَخْلَاقُكَ جَمِيلَة!',
        },
        fr: {
          title: 'Mes Bonnes Manières',
          promptAudio: 'Mets les bons gestes avec le visage joyeux, et les mauvais gestes avec le visage triste !',
          promptText: 'Aidez l\'enfant à reconnaître les bons comportements au quotidien.',
          successAudio: 'Quel enfant bien élevé ! Tes manières sont magnifiques !',
        },
        en: {
          title: 'My Good Manners',
          promptAudio: 'Put the good actions with the happy face, and the bad ones with the sad face!',
          promptText: 'Help your child distinguish between positive and negative behaviors.',
          successAudio: 'What a well-mannered child! Your behavior is great!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '⭐',
        sortBins: [
          { id: 'kind', labelAsset: '😄' },
          { id: 'needs-practice', labelAsset: '🙁' },
        ],
        sortItems: [
          { id: 'share', asset: '🎁', correctBinId: 'kind' },
          { id: 'help', asset: '🫂', correctBinId: 'kind' },
          { id: 'grab', asset: '💥', correctBinId: 'needs-practice' },
          { id: 'ignore', asset: '😤', correctBinId: 'needs-practice' },
        ],
      },
    },
  ],
};
