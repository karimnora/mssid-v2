import { PreschoolModule, PreschoolStoryFrame } from './types';

function frames(
  a: Omit<PreschoolStoryFrame, 'order'>,
  b: Omit<PreschoolStoryFrame, 'order'>,
  c: Omit<PreschoolStoryFrame, 'order'>,
): PreschoolStoryFrame[] {
  return [
    { ...a, order: 1 },
    { ...b, order: 2 },
    { ...c, order: 3 },
  ];
}

export const STORIES_MODULE: PreschoolModule = {
  id: 'preschool-stories',
  domain: 'creative',
  icon: '📖',
  totalSteps: 3,
  titleI18n: {
    ar: 'قِصَصٌ صَغِيرَة',
    fr: 'Petites histoires',
    en: 'Little stories',
  },
  activities: [
    {
      id: 'story-couscous',
      domain: 'creative',
      targetValue: 'couscous',
      stepNumber: 1,
      interactionType: 'story_order',
      i18n: {
        ar: {
          title: 'دِيدُو يَأْكُلُ الكُسْكُس',
          promptAudio: 'رَتِّبِ الصُّوَرَ: دِيدُو جَائِع، ثُمَّ الكُسْكُس، ثُمَّ يَبْتَسِم! بَعْدَهَا احْكِ القِصَّةَ لِبَابَا أَوْ مَامَا!',
          promptText: 'ثلاث صور فقط. اطلب من الطفل أن يحكي القصة بصوته بعد الترتيب.',
          successAudio: 'أَحْسَنْت! الآنْ احْكِ القِصَّةَ لِبَابَا أَوْ مَامَا!',
        },
        fr: {
          title: 'Dido mange le couscous',
          promptAudio: 'Range les images : Dido a faim, puis le couscous, puis il sourit ! Ensuite raconte l’histoire à papa ou maman !',
          promptText: 'Trois images seulement. Après l’ordre, invitez l’enfant à raconter l’histoire à voix haute.',
          successAudio: 'Bravo ! Maintenant raconte l’histoire à papa ou maman !',
        },
        en: {
          title: 'Dido eats couscous',
          promptAudio: 'Put the pictures in order: Dido is hungry, then couscous, then he smiles! Then tell the story to a grown-up!',
          promptText: 'Only three pictures. After the order, invite the child to tell the story out loud.',
          successAudio: 'Well done! Now tell the story to a grown-up!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🍲',
        storyFrames: frames(
          { id: 'hungry', asset: '🥺', caption: { ar: 'جَائِع', fr: 'Faim', en: 'Hungry' } },
          { id: 'couscous', asset: '🍲', caption: { ar: 'كُسْكُس', fr: 'Couscous', en: 'Couscous' } },
          { id: 'smile', asset: '😋', caption: { ar: 'سَعِيد', fr: 'Content', en: 'Happy' } },
        ),
      },
    },
    {
      id: 'story-wash-hands',
      domain: 'creative',
      targetValue: 'wash',
      stepNumber: 2,
      interactionType: 'story_order',
      i18n: {
        ar: {
          title: 'نَغْسِلُ اليَدَيْن',
          promptAudio: 'رَتِّبِ الصُّوَرَ: يَدَانِ مُتَّسِخَتَان، ثُمَّ الصَّابُون، ثُمَّ يَدَانِ نَظِيفَتَان! بَعْدَهَا احْكِ القِصَّة!',
          promptText: 'نفس المهارة: ترتيب ثم حكي. لا تطلب كتابة.',
          successAudio: 'يَدَانِ نَظِيفَتَان! احْكِ القِصَّةَ لِمَامَا!',
        },
        fr: {
          title: 'On se lave les mains',
          promptAudio: 'Range les images : mains sales, puis le savon, puis mains propres ! Ensuite raconte l’histoire !',
          promptText: 'Même geste : ordonner puis raconter. Pas d’écriture.',
          successAudio: 'Mains propres ! Raconte l’histoire à maman !',
        },
        en: {
          title: 'We wash our hands',
          promptAudio: 'Put the pictures in order: dirty hands, then soap, then clean hands! Then tell the story!',
          promptText: 'Same skill: order then tell. No writing.',
          successAudio: 'Clean hands! Tell the story to a grown-up!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧼',
        storyFrames: frames(
          { id: 'dirty', asset: '🖐️', caption: { ar: 'مُتَّسِخ', fr: 'Sales', en: 'Dirty' } },
          { id: 'soap', asset: '🧼', caption: { ar: 'صَابُون', fr: 'Savon', en: 'Soap' } },
          { id: 'clean', asset: '🙌', caption: { ar: 'نَظِيف', fr: 'Propres', en: 'Clean' } },
        ),
      },
    },
    {
      id: 'story-school-day',
      domain: 'creative',
      targetValue: 'school',
      stepNumber: 3,
      interactionType: 'story_order',
      i18n: {
        ar: {
          title: 'يَوْمٌ فِي المَدْرَسَة',
          promptAudio: 'رَتِّبِ الصُّوَرَ: نَسْتَيْقِظ، ثُمَّ المَدْرَسَة، ثُمَّ حَضْنُ بَابَا! بَعْدَهَا احْكِ القِصَّة!',
          promptText: 'Début, milieu, fin. L’enfant raconte ensuite à l’adulte.',
          successAudio: 'قِصَّةٌ جَمِيلَة! احْكِهَا لِبَابَا!',
        },
        fr: {
          title: 'Une journée d’école',
          promptAudio: 'Range les images : on se réveille, puis l’école, puis un câlin ! Ensuite raconte l’histoire !',
          promptText: 'Début, milieu, fin. L’enfant raconte ensuite à l’adulte.',
          successAudio: 'Belle histoire ! Raconte-la à papa !',
        },
        en: {
          title: 'A school day',
          promptAudio: 'Put the pictures in order: we wake up, then school, then a hug! Then tell the story!',
          promptText: 'Beginning, middle, end. Then the child tells a grown-up.',
          successAudio: 'A lovely story! Tell it to a grown-up!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏫',
        storyFrames: frames(
          { id: 'wake', asset: '🌅', caption: { ar: 'صَبَاح', fr: 'Réveil', en: 'Wake up' } },
          { id: 'school', asset: '🏫', caption: { ar: 'مَدْرَسَة', fr: 'École', en: 'School' } },
          { id: 'hug', asset: '🤗', caption: { ar: 'حَضْن', fr: 'Câlin', en: 'Hug' } },
        ),
      },
    },
  ],
};
