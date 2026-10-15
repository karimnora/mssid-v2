import { findRecordedSpeech } from "../../utils/recordedSpeech";
import type {
  PreschoolActivity,
  PreschoolModule,
  PreschoolVisualAssets,
} from "./types";
import { withRecordedAudio } from "./withRecordedAudio";
const t = (fr: string, ar: string, en: string) => ({ fr, ar, en });
interface Theme {
  id: string;
  title: ReturnType<typeof t>;
  domain: PreschoolModule["domain"];
  icon: string;
  words: { asset: string; label: ReturnType<typeof t> }[];
  target: number;
  bins: { asset: string; label: ReturnType<typeof t>; items: string[] }[];
  pattern: string[];
  next: string;
  story: { asset: string; caption: ReturnType<typeof t> }[];
  storyPrompt: ReturnType<typeof t>;
}
const themes: Theme[] = [
  {
    id: "school",
    title: t("Mon cartable malin", "حقيبتي الذكية", "My clever school bag"),
    domain: "world",
    icon: "🎒",
    words: [
      { asset: "📘", label: t("Livre", "كِتَاب", "Book") },
      { asset: "✏️", label: t("Crayon", "قَلَم", "Pencil") },
      { asset: "🎒", label: t("Cartable", "حَقِيبَة", "School bag") },
      { asset: "📏", label: t("Règle", "مِسْطَرَة", "Ruler") },
    ],
    target: 2,
    bins: [
      {
        asset: "✏️",
        label: t(
          "Pour écrire ou lire",
          "لِلْكِتَابَةِ أَوِ الْقِرَاءَة",
          "For writing or reading"
        ),
        items: ["📘", "✏️"],
      },
      {
        asset: "🍎",
        label: t("À manger", "لِلْأَكْل", "Food"),
        items: ["🍎", "🍞"],
      },
    ],
    pattern: ["📘", "✏️", "📘", "✏️", "📘"],
    next: "✏️",
    story: [
      {
        asset: "📄",
        caption: t(
          "Je prends une feuille.",
          "آخُذُ وَرَقَةً.",
          "I take a sheet of paper."
        ),
      },
      {
        asset: "🖍️",
        caption: t(
          "Je dessine sur la feuille.",
          "أَرْسُمُ عَلَى الْوَرَقَةِ.",
          "I draw on the paper."
        ),
      },
      {
        asset: "🖼️",
        caption: t(
          "J’affiche mon dessin.",
          "أَعْرِضُ رَسْمِي.",
          "I display my drawing."
        ),
      },
    ],
    storyPrompt: t(
      "Remets notre histoire dans l’ordre : prends une feuille, dessine dessus, puis affiche ton dessin.",
      "رَتِّبْ قِصَّتَنَا: خُذْ وَرَقَةً ثُمَّ ارْسُمْ عَلَيْهَا ثُمَّ اعْرِضْ رَسْمَكَ.",
      "Put our story in order: take some paper, draw on it, then display your drawing."
    ),
  },
  {
    id: "home",
    title: t("Les objets de la maison", "أَشْيَاءُ الْبَيْت", "Things at home"),
    domain: "world",
    icon: "🏠",
    words: [
      { asset: "🛏️", label: t("Lit", "سَرِير", "Bed") },
      { asset: "🪑", label: t("Chaise", "كُرْسِيّ", "Chair") },
      { asset: "🚪", label: t("Porte", "بَاب", "Door") },
      { asset: "🔑", label: t("Clé", "مِفْتَاح", "Key") },
    ],
    target: 3,
    bins: [
      {
        asset: "🪑",
        label: t("Meubles", "أَثَاث", "Furniture"),
        items: ["🪑", "🛏️"],
      },
      {
        asset: "🍎",
        label: t("Aliments", "أَغْذِيَة", "Food"),
        items: ["🍎", "🍞"],
      },
    ],
    pattern: ["🪑", "🚪", "🪑", "🚪", "🪑"],
    next: "🚪",
    story: [
      {
        asset: "🔑",
        caption: t(
          "L’adulte prend la clé.",
          "يَأْخُذُ الْبَالِغُ الْمِفْتَاحَ.",
          "The grown-up takes the key."
        ),
      },
      {
        asset: "🚪",
        caption: t(
          "L’adulte ouvre la porte.",
          "يَفْتَحُ الْبَالِغُ الْبَابَ.",
          "The grown-up opens the door."
        ),
      },
      {
        asset: "🏠",
        caption: t(
          "Nous entrons dans la maison.",
          "نَدْخُلُ الْبَيْتَ.",
          "We enter the house."
        ),
      },
    ],
    storyPrompt: t(
      "Dans notre histoire, l’adulte prend la clé, ouvre la porte, puis nous entrons. Remets les images dans cet ordre.",
      "فِي قِصَّتِنَا يَأْخُذُ الْبَالِغُ الْمِفْتَاحَ وَيَفْتَحُ الْبَابَ ثُمَّ نَدْخُلُ. رَتِّبِ الصُّوَرَ.",
      "In our story, the grown-up takes the key, opens the door, then we enter. Put the pictures in that order."
    ),
  },
  {
    id: "transport",
    title: t("Les voyages de Didou", "رِحْلَاتُ دِيدُو", "Didou’s journeys"),
    domain: "world",
    icon: "🚆",
    words: [
      { asset: "✈️", label: t("Avion", "طَائِرَة", "Plane") },
      { asset: "🚁", label: t("Hélicoptère", "مِرْوَحِيَّة", "Helicopter") },
      { asset: "🚲", label: t("Vélo", "دَرَّاجَة", "Bicycle") },
      { asset: "⛵", label: t("Voilier", "قَارِبٌ شِرَاعِيّ", "Sailboat") },
    ],
    target: 0,
    bins: [
      {
        asset: "☁️",
        label: t("Dans les airs", "فِي الْجَوّ", "In the air"),
        items: ["✈️", "🚁"],
      },
      {
        asset: "🌊",
        label: t("Sur l’eau", "عَلَى الْمَاء", "On water"),
        items: ["⛵", "🚢"],
      },
    ],
    pattern: ["🚲", "🚲", "✈️", "🚲", "🚲"],
    next: "✈️",
    story: [
      {
        asset: "🚉",
        caption: t(
          "Le train arrive en gare.",
          "يَصِلُ الْقِطَارُ إِلَى الْمَحَطَّةِ.",
          "The train arrives at the station."
        ),
      },
      {
        asset: "🚶",
        caption: t(
          "Didou monte avec un adulte.",
          "يَرْكَبُ دِيدُو مَعَ بَالِغٍ.",
          "Didou gets on with a grown-up."
        ),
      },
      {
        asset: "🚆",
        caption: t(
          "Le train part.",
          "يَنْطَلِقُ الْقِطَارُ.",
          "The train leaves."
        ),
      },
    ],
    storyPrompt: t(
      "Le train arrive, Didou monte avec un adulte, puis le train part. Retrouve cet ordre.",
      "يَصِلُ الْقِطَارُ ثُمَّ يَرْكَبُ دِيدُو مَعَ بَالِغٍ ثُمَّ يَنْطَلِقُ الْقِطَارُ. رَتِّبِ الصُّوَرَ.",
      "The train arrives, Didou gets on with a grown-up, then the train leaves. Find this order."
    ),
  },
  {
    id: "nature",
    title: t("J’observe la nature", "أُلَاحِظُ الطَّبِيعَة", "I notice nature"),
    domain: "world",
    icon: "🍃",
    words: [
      { asset: "🍃", label: t("Feuille", "وَرَقَةُ شَجَر", "Leaf") },
      { asset: "🌼", label: t("Fleur", "زَهْرَة", "Flower") },
      { asset: "🌳", label: t("Arbre", "شَجَرَة", "Tree") },
      { asset: "🪨", label: t("Pierre", "حَجَر", "Stone") },
    ],
    target: 1,
    bins: [
      {
        asset: "🌱",
        label: t("Plantes", "نَبَاتَات", "Plants"),
        items: ["🌼", "🌳"],
      },
      {
        asset: "📘",
        label: t("Objets fabriqués", "أَشْيَاءُ مَصْنُوعَة", "Made objects"),
        items: ["📘", "📏"],
      },
    ],
    pattern: ["🌼", "🍃", "🍃", "🌼", "🍃"],
    next: "🍃",
    story: [
      {
        asset: "🌧️",
        caption: t("La pluie tombe.", "يَنْزِلُ الْمَطَرُ.", "The rain falls."),
      },
      {
        asset: "💧",
        caption: t(
          "Une flaque se forme.",
          "تَتَكَوَّنُ بِرْكَةٌ صَغِيرَةٌ.",
          "A puddle forms."
        ),
      },
      {
        asset: "☀️",
        caption: t(
          "La pluie cesse et le soleil revient.",
          "يَتَوَقَّفُ الْمَطَرُ وَتَعُودُ الشَّمْسُ.",
          "The rain stops and the sun returns."
        ),
      },
    ],
    storyPrompt: t(
      "Dans cette histoire, la pluie tombe, une flaque se forme, puis la pluie cesse et le soleil revient.",
      "فِي هَذِهِ الْقِصَّةِ يَنْزِلُ الْمَطَرُ وَتَتَكَوَّنُ بِرْكَةٌ صَغِيرَةٌ ثُمَّ يَتَوَقَّفُ الْمَطَرُ وَتَعُودُ الشَّمْسُ.",
      "In this story, rain falls, a puddle forms, then the rain stops and the sun returns."
    ),
  },
  {
    id: "shapes",
    title: t(
      "Les motifs des bâtisseurs",
      "أَنْماطُ الْبَنَّائِينَ",
      "Builders’ patterns"
    ),
    domain: "shapes",
    icon: "🔺",
    words: [
      { asset: "🔴", label: t("Rond", "دَائِرَة", "Circle") },
      { asset: "🟦", label: t("Carré", "مُرَبَّع", "Square") },
      { asset: "🔺", label: t("Triangle", "مُثَلَّث", "Triangle") },
      {
        asset: "🟨",
        label: t("Carré jaune", "مُرَبَّعٌ أَصْفَر", "Yellow square"),
      },
    ],
    target: 2,
    bins: [
      {
        asset: "🔴",
        label: t("Ronds", "دَوَائِر", "Circles"),
        items: ["🔴", "🔵"],
      },
      {
        asset: "🟦",
        label: t("Carrés", "مُرَبَّعَات", "Squares"),
        items: ["🟦", "🟥"],
      },
    ],
    pattern: ["🔺", "🔴", "🔺", "🔴", "🔺"],
    next: "🔴",
    story: [
      {
        asset: "✏️",
        caption: t(
          "Je trace un rond.",
          "أَرْسُمُ دَائِرَةً.",
          "I draw a circle."
        ),
      },
      {
        asset: "🔴",
        caption: t(
          "Je colorie le rond.",
          "أُلَوِّنُ الدَّائِرَةَ.",
          "I colour the circle."
        ),
      },
      {
        asset: "🖼️",
        caption: t(
          "J’affiche le dessin terminé.",
          "أَعْرِضُ الرَّسْمَ الْمُكْتَمِلَ.",
          "I display the finished drawing."
        ),
      },
    ],
    storyPrompt: t(
      "Trace un rond, colorie-le, puis affiche ton dessin. Dans notre histoire, c’est cet ordre.",
      "اُرْسُمْ دَائِرَةً ثُمَّ لَوِّنْهَا ثُمَّ اعْرِضْ رَسْمَكَ. هَذَا تَرْتِيبُ قِصَّتِنَا.",
      "Draw a circle, colour it, then display your drawing. That is the order in our story."
    ),
  },
  {
    id: "feelings",
    title: t(
      "Les visages et les histoires",
      "وُجُوهٌ وَحِكَايَات",
      "Faces and stories"
    ),
    domain: "values",
    icon: "🙂",
    words: [
      { asset: "🙂", label: t("Content", "فَرِح", "Happy") },
      { asset: "😢", label: t("Triste", "حَزِين", "Sad") },
      { asset: "😠", label: t("En colère", "غَاضِب", "Angry") },
      { asset: "😮", label: t("Surpris", "مُتَفَاجِئ", "Surprised") },
    ],
    target: 0,
    bins: [
      {
        asset: "🙂",
        label: t("Visages", "وُجُوه", "Faces"),
        items: ["🙂", "😢"],
      },
      {
        asset: "📘",
        label: t("Autres images", "صُوَرٌ أُخْرَى", "Other pictures"),
        items: ["📘", "⚽"],
      },
    ],
    pattern: ["🙂", "😮", "🙂", "😮", "🙂"],
    next: "😮",
    story: [
      {
        asset: "😢",
        caption: t(
          "Dans l’histoire, Nour est triste.",
          "فِي الْقِصَّةِ نُورٌ حَزِينَةٌ.",
          "In the story, Nour is sad."
        ),
      },
      {
        asset: "👂",
        caption: t(
          "Sami l’écoute.",
          "يَسْتَمِعُ إِلَيْهَا سَامِي.",
          "Sami listens to her."
        ),
      },
      {
        asset: "🙂",
        caption: t(
          "Nour décide de rejouer.",
          "تُقَرِّرُ نُورٌ أَنْ تَلْعَبَ مُجَدَّدًا.",
          "Nour decides to play again."
        ),
      },
    ],
    storyPrompt: t(
      "Écoute cette histoire : Nour est triste, Sami l’écoute, puis Nour décide de rejouer. Retrouve les images.",
      "اِسْتَمِعْ لِلْقِصَّةِ: نُورٌ حَزِينَةٌ وَسَامِي يَسْتَمِعُ إِلَيْهَا ثُمَّ تُقَرِّرُ نُورٌ أَنْ تَلْعَبَ مُجَدَّدًا. رَتِّبِ الصُّوَرَ.",
      "Listen to this story: Nour is sad, Sami listens, then Nour decides to play again. Find the pictures in order."
    ),
  },
];
function activity(
  theme: Theme,
  step: number,
  kind: PreschoolActivity["interactionType"],
  title: ReturnType<typeof t>,
  prompt: ReturnType<typeof t>,
  assets: Omit<PreschoolVisualAssets, "mainSvgOrImage">
): PreschoolActivity {
  const parent = t(
    "Observe le choix et laisse l’enfant expliquer ou montrer. La réussite à l’écran reste une observation, pas une preuve de maîtrise durable.",
    "لاحظ الاختيار ودع الطفل يشرح أو يشير. النجاح على الشاشة ملاحظة وليس دليلاً على اكتساب دائم.",
    "Observe the choice and let the child explain or point. Screen success is an observation, not proof of lasting learning."
  );
  const success = t("Bravo !", "أَحْسَنْتَ!", "Well done!");
  return {
    id: "explore-" + theme.id + "-" + step,
    domain: theme.domain,
    targetValue: theme.id,
    stepNumber: step,
    interactionType: kind,
    i18n: Object.fromEntries(
      (["fr", "ar", "en"] as const).map((language) => [
        language,
        {
          title: title[language],
          promptAudio: prompt[language],
          instructionText: prompt[language],
          promptText: parent[language],
          successAudio: success[language],
        },
      ])
    ) as PreschoolActivity["i18n"],
    visualAssets: {
      mainSvgOrImage: kind === "tap_choice" ? "" : theme.icon,
      ...assets,
    },
  };
}
export const EXPLORATION_MODULES: PreschoolModule[] = themes.map(
  (theme, index) => {
    // Common vocabulary may already have a recording with a lowercase initial.
    // Keep accents and Arabic vowel marks intact; never merge different words.
    for (const word of theme.words)
      for (const language of ["fr", "en"] as const) {
        const label = word.label[language],
          lower = label.toLocaleLowerCase();
        if (
          !findRecordedSpeech(label, language) &&
          findRecordedSpeech(lower, language)
        )
          word.label[language] = lower;
      }
    const word = theme.words[theme.target];
    const choices = theme.words
      .filter((_, i) => i !== theme.target)
      .slice(0, 2)
      .map((w) => ({ id: w.asset, asset: w.asset, isCorrect: false }));
    choices.splice(index % 3, 0, {
      id: word.asset,
      asset: word.asset,
      isCorrect: true,
    });
    const sequenceChoices = [
      ...new Set([...theme.pattern, theme.words[3].asset]),
    ].slice(0, 3);
    if (!sequenceChoices.includes(theme.next)) sequenceChoices[0] = theme.next;
    const activities = [
      activity(
        theme,
        1,
        "listen_tap",
        t(
          "J’écoute les mots",
          "أَسْتَمِعُ لِلْكَلِمَات",
          "I listen to the words"
        ),
        t(
          "Touche chaque image pour écouter son nom.",
          "اِلْمَسْ كُلَّ صُورَةٍ لِتَسْمَعَ اسْمَهَا.",
          "Touch each picture to hear its name."
        ),
        {
          listenCards: theme.words.map((w, i) => ({
            id: theme.id + "-word-" + i,
            asset: w.asset,
            label: w.label,
          })),
        }
      ),
      activity(
        theme,
        2,
        "tap_choice",
        t("Je retrouve le mot", "أَجِدُ الْكَلِمَة", "I find the word"),
        t(
          "Touche l’image : " + word.label.fr + ".",
          "اِلْمَسِ الصُّورَةَ: " + word.label.ar + ".",
          "Touch the picture: " + word.label.en + "."
        ),
        { choices }
      ),
      activity(
        theme,
        3,
        index % 2 === 0 ? "connect_dots" : "memory_cards",
        t(
          "Je retrouve les mêmes images",
          "أَجِدُ الصُّوَرَ الْمُتَمَاثِلَة",
          "I find matching pictures"
        ),
        index % 2 === 0
          ? t(
              "Relie chaque image à la même image.",
              "صِلْ كُلَّ صُورَةٍ بِالصُّورَةِ الْمُمَاثِلَةِ.",
              "Match each picture to the same picture."
            )
          : t(
              "Retourne les cartes et retrouve les paires.",
              "اِقْلِبِ الْبِطَاقَاتِ وَاجْمَعِ الْأَزْوَاجَ.",
              "Turn the cards over and find the pairs."
            ),
        index % 2 === 0
          ? {
              connectPairs: theme.words.slice(0, 3).map((w, i) => ({
                id: theme.id + "-pair-" + i,
                leftAsset: w.asset,
                rightAsset: w.asset,
              })),
            }
          : {
              memoryPairs: theme.words.slice(0, 3).map((w, i) => ({
                id: theme.id + "-memory-" + i,
                asset: w.asset,
              })),
            }
      ),
      activity(
        theme,
        4,
        "sorting",
        t(
          "Je classe avec une règle",
          "أُصَنِّفُ بِقَاعِدَة",
          "I sort using a rule"
        ),
        t(
          "Fais glisser chaque image dans la boîte de sa famille.",
          "اِسْحَبْ كُلَّ صُورَةٍ إِلَى صُنْدُوقِ مَجْمُوعَتِهَا.",
          "Drag each picture into the box for its group."
        ),
        {
          sortBins: theme.bins.map((bin, i) => ({
            id: theme.id + "-bin-" + i,
            labelAsset: bin.asset,
            label: bin.label,
          })),
          sortItems: theme.bins.flatMap((bin, i) =>
            bin.items.map((asset, j) => ({
              id: theme.id + "-item-" + i + "-" + j,
              asset,
              correctBinId: theme.id + "-bin-" + i,
            }))
          ),
        }
      ),
      activity(
        theme,
        5,
        "sequence",
        t(
          "Je continue le motif",
          "أُكْمِلُ النَّمَط",
          "I continue the pattern"
        ),
        t(
          "Regarde le groupe qui se répète. Quelle image vient ensuite ?",
          "اُنْظُرْ إِلَى الْمَجْمُوعَةِ الْمُتَكَرِّرَةِ. أَيُّ صُورَةٍ تَأْتِي بَعْدَهَا؟",
          "Look at the repeating group. Which picture comes next?"
        ),
        {
          sequencePattern: theme.pattern,
          choices: sequenceChoices.map((asset, i) => ({
            id: theme.id + "-next-" + i,
            asset,
            isCorrect: asset === theme.next,
          })),
        }
      ),
      activity(
        theme,
        6,
        "story_order",
        t(
          "Je raconte dans l’ordre",
          "أَحْكِي بِالتَّرْتِيب",
          "I tell the story in order"
        ),
        theme.storyPrompt,
        {
          storyFrames: theme.story.map((frame, i) => ({
            id: theme.id + "-frame-" + i,
            asset: frame.asset,
            order: (i + 1) as 1 | 2 | 3,
            caption: frame.caption,
          })),
        }
      ),
    ];
    return withRecordedAudio({
      id: "preschool-explore-" + theme.id,
      domain: theme.domain,
      titleI18n: theme.title,
      icon: theme.icon,
      totalSteps: activities.length,
      activities,
    });
  }
);
