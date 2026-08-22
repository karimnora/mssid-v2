import { PreschoolModule } from './types';

/**
 * "عَائِلَتِي الحَبِيبَة" — Ma Famille (Éducation Civique 0AP).
 * Name family members with a concrete tap (maman, papa, papi, bébé).
 * Roles are objects of daily life (story, bottle, ball, tea) — not gendered jobs.
 *
 * Sentences describe family roles in general ("a mom hugs her children", "we are gentle with the
 * baby") rather than asserting the listening child's own household ("MY mom hugs ME", "your
 * grandpa"). Not every child lives with grandparents or a baby sibling — this module teaches the
 * vocabulary and the values, not a claim about any specific child's family shape.
 */
export const FAMILY_MODULE: PreschoolModule = {
  id: 'preschool-family',
  domain: 'values',
  // 👪 (single codepoint, Unicode 6.0) instead of a ZWJ family sequence: multi-person ZWJ emoji
  // (👨‍👩‍👧, 👨‍👩‍👧‍👦) render as broken/separate glyphs on older Android WebViews, which this app
  // ships in via Capacitor — a real risk for the budget devices common in the target market.
  icon: '👪',
  totalSteps: 6,
  titleI18n: {
    ar: 'عَائِلَتِي الحَبِيبَة',
    fr: 'Ma Chère Famille',
    en: 'My Dear Family',
  },
  activities: [
    {
      id: 'family-fennec-home',
      domain: 'values',
      targetValue: 'family',
      stepNumber: 1,
      interactionType: 'find_path',
      i18n: {
        ar: {
          title: 'الفَنَكُ يَعُودُ إِلَى البَيْت',
          promptAudio: 'اِسْحَبِ الفَنَكَ: بَاب، صَالُون، مَطْبَخ، غُرْفَة، ثُمَّ العَائِلَة!',
          promptText: 'اسحب الفنك من غرفة إلى غرفة حتى يجد عائلته.',
          successAudio: 'أَهْلاً بِالعَائِلَة! البَيْتُ دَافِئ!',
        },
        fr: {
          title: 'Le Fennec Rentre Chez Lui',
          promptAudio: 'Glisse le fennec : porte, salon, cuisine, chambre, puis la famille !',
          promptText: 'Aidez l\'enfant à visiter chaque pièce jusqu\'à la famille.',
          successAudio: 'Bienvenue à la maison ! Rien de mieux que sa famille !',
        },
        en: {
          title: 'The Fennec Goes Home',
          promptAudio: 'Drag the fennec: door, living room, kitchen, bedroom, then the family!',
          promptText: 'Help the child visit each room until the family.',
          successAudio: 'Welcome home! Nothing is better than family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🦊',
        pathTheme: 'home',
        pathToken: { startAsset: '🚪', endAsset: '👪', travelerAsset: '🦊' },
        pathStops: [
          { x: 14, y: 32, asset: '🚪', color: '#fed7aa' },
          { x: 40, y: 18, asset: '🛋️', color: '#e9d5ff' },
          { x: 74, y: 28, asset: '🍳', color: '#fecaca' },
          { x: 84, y: 60, asset: '🛏️', color: '#bae6fd' },
          { x: 48, y: 78, asset: '👪', color: '#bbf7d0' },
        ],
      },
    },
    {
      id: 'family-mom',
      domain: 'values',
      targetValue: 'mom',
      stepNumber: 2,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أُمِّي',
          // Generic "a mom hugs her children" rather than "MY mom hugs ME" — teaches the word and
          // the role, without assuming this exact affectionate relationship is the listening
          // child's own daily reality.
          promptAudio: 'اِلْمَسِ الأُمّ! الأُمُّ تَحْضُنُ أَطْفَالَهَا بِحُبّ!',
          promptText: 'ساعد الطفل على تمييز صورة الأم.',
          successAudio: 'أَحْسَنْت! هَذِهِ الأُمّ!',
        },
        fr: {
          title: 'Maman',
          promptAudio: 'Touche la maman ! Une maman aime câliner ses enfants !',
          promptText: 'Aidez l\'enfant à reconnaître maman.',
          successAudio: 'Bravo ! Voici une maman !',
        },
        en: {
          title: 'Mom',
          promptAudio: 'Touch the mom! A mom loves hugging her children!',
          promptText: 'Help the child recognise mom.',
          successAudio: 'Well done! That is a mom!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👩',
        choices: [
          { id: 'mom', asset: '👩', isCorrect: true },
          { id: 'dad', asset: '👨', isCorrect: false },
          { id: 'granny', asset: '👵', isCorrect: false },
        ],
      },
    },
    {
      id: 'family-dad',
      domain: 'values',
      targetValue: 'dad',
      stepNumber: 3,
      interactionType: 'tap_choice',
      i18n: {
        ar: {
          title: 'أَبِي',
          // Same generalization as family-mom: "a dad plays with his children" rather than "MY dad
          // plays with ME".
          promptAudio: 'اِلْمَسِ الأَبّ! الأَبُ يُحِبُّ اللَّعِبَ مَعَ أَطْفَالِه!',
          promptText: 'ساعد الطفل على تمييز صورة الأب.',
          successAudio: 'بَرَاوَ! هَذَا الأَبّ!',
        },
        fr: {
          title: 'Papa',
          promptAudio: 'Touche le papa ! Un papa aime jouer avec ses enfants !',
          promptText: 'Aidez l\'enfant à reconnaître papa.',
          successAudio: 'Bravo ! Voici un papa !',
        },
        en: {
          title: 'Dad',
          promptAudio: 'Touch the dad! A dad loves playing with his children!',
          promptText: 'Help the child recognise dad.',
          successAudio: 'Bravo! That is a dad!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👨',
        choices: [
          { id: 'dad', asset: '👨', isCorrect: true },
          { id: 'mom', asset: '👩', isCorrect: false },
          { id: 'grandpa', asset: '👴', isCorrect: false },
        ],
      },
    },
    {
      // Replaces three back-to-back tap_choice steps (grandpa / grandma / baby, formerly steps
      // 4-6): five tap_choice in a row was the most repetitive stretch in the module and the most
      // likely point for a 3-5 yo to disengage. listen_tap has no wrong answer and a different
      // rhythm (tap-to-hear rather than tap-to-guess), so it breaks up the run while still
      // introducing all three family members before family-roles and family-memory rely on them.
      id: 'family-elders-baby',
      domain: 'values',
      targetValue: 'family-elders',
      stepNumber: 4,
      interactionType: 'listen_tap',
      i18n: {
        ar: {
          title: 'مَنْ فِي العَائِلَة؟',
          promptAudio: 'اِلْمَسْ كُلَّ بِطَاقَةٍ وَاسْتَمِعْ لِاسْمِهَا!',
          promptText: 'نحترم الجد والجدة ونرفق بالرضيع: إنه أصغر فرد في العائلة.',
          successAudio: 'أَحْسَنْت! تَعْرِفُ كُلَّ العَائِلَة!',
        },
        fr: {
          title: 'Qui Est Dans La Famille ?',
          promptAudio: 'Touche chaque carte et écoute son nom !',
          promptText: 'On respecte et on aime papi et mamie, et on est doux avec le bébé.',
          successAudio: 'Bravo ! Tu connais toute la famille !',
        },
        en: {
          title: 'Who Is in the Family?',
          promptAudio: 'Tap each card and listen to its name!',
          promptText: 'We respect and love grandpa and grandma, and we are gentle with the baby.',
          successAudio: 'Well done! You know the whole family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '👴',
        listenCards: [
          { id: 'grandpa', asset: '👴', label: { ar: 'جَدِّي', fr: 'Papi', en: 'Grandpa' } },
          { id: 'granny',  asset: '👵', label: { ar: 'جَدَّتِي', fr: 'Mamie', en: 'Grandma' } },
          { id: 'baby',    asset: '👶', label: { ar: 'الرَّضِيع', fr: 'Le Bébé', en: 'The Baby' } },
        ],
      },
    },
    {
      id: 'family-roles',
      domain: 'values',
      targetValue: 'family-roles',
      stepNumber: 5,
      interactionType: 'connect_dots',
      i18n: {
        ar: {
          title: 'مَنْ يُحِبُّ مَاذَا؟',
          promptAudio: 'اِرْبِطِ الجَدَّ بِالقِصَّة، وَالرَّضِيعَ بِالقَارُورَة!',
          promptText: 'جد↔قصة، رضيع↔رضاعة، طفل↔كرة، جدة↔شاي.',
          successAudio: 'كُلُّ وَاحِدٍ فِي العَائِلَةِ مَحْبُوب!',
        },
        fr: {
          title: 'Qui Aime Quoi ?',
          promptAudio: 'Relie papi au livre, et le bébé au biberon !',
          promptText: 'Papi↔histoire, bébé↔biberon, enfant↔ballon, mamie↔thé.',
          successAudio: 'Chacun dans la famille est aimé !',
        },
        en: {
          title: 'Who Loves What?',
          promptAudio: 'Match grandpa to the book, and the baby to the bottle!',
          promptText: 'Grandpa↔story, baby↔bottle, child↔ball, grandma↔tea.',
          successAudio: 'Everyone in the family is loved!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🏡',
        connectPairs: [
          // Swapped from an earlier version that always paired grandma with the storybook and
          // grandpa with tea — a small but avoidable gendered-role default. Neither pairing is
          // more "correct" than the other, which is the point.
          { id: 'grandpa-story', leftAsset: '👴', rightAsset: '📖' },
          { id: 'baby-bottle',   leftAsset: '👶', rightAsset: '🍼' },
          { id: 'child-ball',    leftAsset: '👦', rightAsset: '⚽' },
          { id: 'granny-tea',    leftAsset: '👵', rightAsset: '🍵' },
        ],
      },
    },
    {
      id: 'family-memory',
      domain: 'values',
      targetValue: 'family-memory',
      stepNumber: 6,
      interactionType: 'memory_cards',
      i18n: {
        ar: {
          title: 'تَذَكَّرْ أَفْرَادَ العَائِلَة',
          promptAudio: 'اِقْلِبِ البِطَاقَاتِ! قُلْ: أُمّ، أَب، رَضِيع!',
          promptText: 'ثلاث أزواج فقط — اللعبة لا تعرض أكثر.',
          successAudio: 'عَظِيم! أَنْتَ تَعْرِفُ عَائِلَتَك!',
        },
        fr: {
          title: 'Mémo de la Famille',
          promptAudio: 'Retourne les cartes ! Dis : maman, papa, bébé !',
          promptText: 'Trois paires seulement — le jeu n\'en affiche pas plus.',
          successAudio: 'Formidable ! Tu connais ta famille !',
        },
        en: {
          title: 'Family Memory Game',
          promptAudio: 'Flip the cards! Say: mom, dad, baby!',
          promptText: 'Three pairs only — the game does not show more.',
          successAudio: 'Amazing! You know your family!',
        },
      },
      visualAssets: {
        mainSvgOrImage: '🧩',
        memoryPairs: [
          { id: 'fam-mom',  asset: '👩' },
          { id: 'fam-dad',  asset: '👨' },
          { id: 'fam-baby', asset: '👶' },
        ],
      },
    },
  ],
};
