import { PreschoolModule } from './types';

// "قِيَمِي وَإِيمَانِي الصَّغِيرُ" — Islamic awakening & social values for ages 3-5.
// Confirmed a genuine, total gap: zero Islamic content existed anywhere in the preschool module
// (grade 1AP-5AP islamic.ts is a completely separate, unrelated catalog). Built on existing
// interactionTypes only: tap_choice for daily formulas of politeness and short-surah listening
// moments (promptAudio is read aloud via TTS — see LocalizedContent doc comment), sorting for
// good manners / cooperation.
export const ISLAMIC_VALUES_MODULE: PreschoolModule = {
  id: 'preschool-islamic-values',
  domain: 'values',
  icon: '🕌',
  totalSteps: 7,
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
          promptText: 'علّم طفلك قول البسملة قبل الأكل والشرب.',
          successAudio: 'أَحْسَنْت! بِسْمِ اللَّهِ قَبْلَ كُلِّ أَكْلَة!',
        },
        fr: {
          title: 'Bismillah avant de Manger',
          promptAudio: 'Avant de manger, on dit : Bismillah ! Quand le dit-on ? Touche la nourriture !',
          promptText: 'Apprenez à votre enfant à dire la basmala avant de manger et boire.',
          successAudio: 'Bravo ! Bismillah avant chaque repas !',
        },
        en: {
          title: 'Bismillah Before Eating',
          promptAudio: 'Before we eat, we say: Bismillah! When do we say it? Tap the food!',
          promptText: 'Teach your child to say Bismillah before eating and drinking.',
          successAudio: 'Well done! Bismillah before every meal!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🤲',
        choices: [
          { id: 'food', asset: '🍽️', isCorrect: true },
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
          promptAudio: 'بَعْدَ الاِنْتِهَاءِ مِنَ الأَكْلِ نَقُولُ: الحَمْدُ لِلَّه! اِلْمِسِ الوَجْهَ السَّعِيد!',
          promptText: 'علّم طفلك قول الحمد لله بعد الانتهاء من الأكل.',
          successAudio: 'مُمْتَاز! الحَمْدُ لِلَّهِ عَلَى كُلِّ نِعْمَة!',
        },
        fr: {
          title: 'Alhamdulillah après Manger',
          promptAudio: 'Après avoir mangé, on dit : Alhamdulillah ! Touche le visage content !',
          promptText: 'Apprenez à votre enfant à dire Alhamdulillah après le repas.',
          successAudio: 'Super ! Alhamdulillah pour chaque bienfait !',
        },
        en: {
          title: 'Alhamdulillah After Eating',
          promptAudio: 'After finishing our food, we say: Alhamdulillah! Tap the happy face!',
          promptText: 'Teach your child to say Alhamdulillah after eating.',
          successAudio: 'Excellent! Alhamdulillah for every blessing!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🙌',
        choices: [
          { id: 'happy', asset: '😊', isCorrect: true },
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
          promptAudio: 'عِنْدَمَا نَلْتَقِي بِصَدِيقٍ نَقُولُ: السَّلَامُ عَلَيْكُم! اِلْمِسِ اليَدَ الَّتِي تُصَافِح!',
          promptText: 'علّم طفلك إلقاء السلام ومصافحة الأصدقاء.',
          successAudio: 'رَائِع! السَّلَامُ عَلَيْكُمْ تُدْخِلُ السَّعَادَةَ لِلْقُلُوب!',
        },
        fr: {
          title: 'As-salamu \'alaykum',
          promptAudio: 'Quand on rencontre un ami, on dit : As-salamu \'alaykum ! Touche la main qui salue !',
          promptText: 'Apprenez à votre enfant à saluer et serrer la main de ses amis.',
          successAudio: 'Bravo ! Le salam apporte la joie dans les cœurs !',
        },
        en: {
          title: 'As-salamu \'alaykum',
          promptAudio: 'When we meet a friend, we say: As-salamu \'alaykum! Tap the hand that greets!',
          promptText: 'Teach your child to greet and shake hands with friends.',
          successAudio: 'Wonderful! The salam brings joy to hearts!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👋',
        choices: [
          { id: 'handshake', asset: '🤝', isCorrect: true },
          { id: 'turnaway', asset: '🙈', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-surah-fatiha',
      domain: 'values',
      targetValue: 'al-fatiha',
      stepNumber: 4,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اِسْتَمِعْ لِسُورَةِ الفَاتِحَةِ',
          promptAudio: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيم. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِين. اِلْمِسِ المُصْحَفَ لِتَسْتَمِعَ بِهُدُوء!',
          promptText: 'رتّل الآيات ببطء واطلب من طفلك الإنصات بهدوء.',
          successAudio: 'مَا شَاءَ اللَّه! اِسْتَمَعْتَ بِهُدُوءٍ وَأَدَب!',
        },
        fr: {
          title: 'Écoute Sourate Al-Fatiha',
          promptAudio: 'Bismillah ar-Rahman ar-Rahim. Al-hamdu lillahi Rabbil \'alamin. Touche le Coran pour écouter calmement !',
          promptText: 'Récitez lentement les versets et invitez l\'enfant à écouter en silence.',
          successAudio: 'Mashallah ! Tu as écouté calmement et poliment !',
        },
        en: {
          title: 'Listen to Surah Al-Fatiha',
          promptAudio: 'Bismillah ar-Rahman ar-Rahim. Al-hamdu lillahi Rabbil \'alamin. Tap the Quran to listen calmly!',
          promptText: 'Recite the verses slowly and ask your child to listen quietly.',
          successAudio: 'Mashallah! You listened calmly and politely!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        choices: [
          { id: 'quran', asset: '📖', isCorrect: true },
          { id: 'toy', asset: '🧸', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-surah-ikhlas',
      domain: 'values',
      targetValue: 'al-ikhlas',
      stepNumber: 5,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اِسْتَمِعْ لِسُورَةِ الإِخْلَاصِ',
          promptAudio: 'قُلْ هُوَ اللَّهُ أَحَد. اللَّهُ الصَّمَد. اِلْمِسِ المُصْحَفَ لِتَسْتَمِعَ بِهُدُوء!',
          promptText: 'رتّل الآيات ببطء واطلب من طفلك الإنصات بهدوء.',
          successAudio: 'مَا شَاءَ اللَّه! قَلْبُكَ يُحِبُّ سَمَاعَ القُرْآن!',
        },
        fr: {
          title: 'Écoute Sourate Al-Ikhlas',
          promptAudio: 'Qul Huwa Allahu Ahad. Allahu-s-Samad. Touche le Coran pour écouter calmement !',
          promptText: 'Récitez lentement les versets et invitez l\'enfant à écouter en silence.',
          successAudio: 'Mashallah ! Ton cœur aime écouter le Coran !',
        },
        en: {
          title: 'Listen to Surah Al-Ikhlas',
          promptAudio: 'Qul Huwa Allahu Ahad. Allahu-s-Samad. Tap the Quran to listen calmly!',
          promptText: 'Recite the verses slowly and ask your child to listen quietly.',
          successAudio: 'Mashallah! Your heart loves listening to the Quran!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        choices: [
          { id: 'quran', asset: '📖', isCorrect: true },
          { id: 'ball', asset: '⚽', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-surah-kawthar',
      domain: 'values',
      targetValue: 'al-kawthar',
      stepNumber: 6,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'اِسْتَمِعْ لِسُورَةِ الكَوْثَرِ',
          promptAudio: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَر. فَصَلِّ لِرَبِّكَ وَانْحَر. اِلْمِسِ المُصْحَفَ لِتَسْتَمِعَ بِهُدُوء!',
          promptText: 'رتّل الآيات ببطء واطلب من طفلك الإنصات بهدوء.',
          successAudio: 'بَارَكَ اللَّهُ فِيك! اِسْتَمَعْتَ بِإِنْصَاتٍ جَمِيل!',
        },
        fr: {
          title: 'Écoute Sourate Al-Kawthar',
          promptAudio: 'Inna a\'taynaka-l-Kawthar. Fasalli li-Rabbika wanhar. Touche le Coran pour écouter calmement !',
          promptText: 'Récitez lentement les versets et invitez l\'enfant à écouter en silence.',
          successAudio: 'Baraka Allahou fik ! Tu as écouté avec une belle attention !',
        },
        en: {
          title: 'Listen to Surah Al-Kawthar',
          promptAudio: 'Inna a\'taynaka-l-Kawthar. Fasalli li-Rabbika wanhar. Tap the Quran to listen calmly!',
          promptText: 'Recite the verses slowly and ask your child to listen quietly.',
          successAudio: 'Barakallahu feek! You listened with lovely attention!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        choices: [
          { id: 'quran', asset: '📖', isCorrect: true },
          { id: 'phone', asset: '📱', isCorrect: false },
        ],
      },
    },
    {
      id: 'values-good-manners',
      domain: 'values',
      targetValue: 'manners',
      stepNumber: 7,
      interactionType: 'sorting',
      i18n: {
        ar: {
          title: 'أَخْلَاقِي الجَمِيلَةُ',
          promptAudio: 'ضَعِ التَّصَرُّفَاتِ اللَّطِيفَةَ مَعَ الوَجْهِ السَّعِيد، وَالتَّصَرُّفَاتِ الَّتِي تَحْتَاجُ تَحْسِيناً مَعَ الوَجْهِ الآخَر!',
          promptText: 'ساعد طفلك على تمييز السلوكات الحسنة كالمساعدة والتعاون.',
          successAudio: 'يَا لَكَ مِنْ طِفْلٍ مُهَذَّب! أَخْلَاقُكَ جَمِيلَة!',
        },
        fr: {
          title: 'Mes Belles Manières',
          promptAudio: 'Mets les gestes gentils avec le visage content, et ceux à améliorer avec l\'autre visage !',
          promptText: 'Aidez l\'enfant à reconnaître les bons comportements comme l\'entraide.',
          successAudio: 'Quel enfant bien élevé ! Tes manières sont magnifiques !',
        },
        en: {
          title: 'My Nice Manners',
          promptAudio: 'Put the kind actions with the happy face, and the ones to improve with the other face!',
          promptText: 'Help your child recognize good behavior like helping and cooperation.',
          successAudio: 'What a well-mannered child! Your manners are lovely!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🕌',
        sortBins: [
          { id: 'kind', labelAsset: '😊' },
          { id: 'needs-practice', labelAsset: '😕' },
        ],
        sortItems: [
          { id: 'share', asset: '🤝', correctBinId: 'kind' },
          { id: 'help', asset: '🫂', correctBinId: 'kind' },
          { id: 'grab', asset: '🙅', correctBinId: 'needs-practice' },
          { id: 'ignore', asset: '🙈', correctBinId: 'needs-practice' },
        ],
      },
    },
  ],
};
