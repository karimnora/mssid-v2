import { PreschoolModule } from './types';

// "قِيَمِي وَإِيمَانِي الصَّغِيرُ" — Islamic awakening & social values for ages 3-5.
// Confirmed a genuine, total gap: zero Islamic content existed anywhere in the preschool module
// (grade 1AP-5AP islamic.ts is a completely separate, unrelated catalog). Built on existing
// interactionTypes only: tap_choice for daily formulas of politeness, sorting for good manners /
// cooperation. Deliberately does NOT include Quran verse recitation: the Web Speech API TTS this
// app relies on (no pre-recorded voice assets in the MVP — see LocalizedContent doc comment)
// mispronounces Arabic badly enough that reciting Quranic text through it was judged unacceptable,
// and was removed for that reason (product decision).
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
      id: 'values-good-manners',
      domain: 'values',
      targetValue: 'manners',
      stepNumber: 4,
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
