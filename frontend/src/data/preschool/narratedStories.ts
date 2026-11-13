import type { PreschoolActivity, PreschoolStoryText } from './types';

const text = (ar: string, fr: string, en: string): PreschoolStoryText => ({ ar, fr, en });
export const STORY_SPEECH = {
  retry: text('لِنُحَاوِلْ مَرَّةً أُخْرَى. اِسْتَمِعْ إِلَى السُّؤَالِ.', 'Essayons encore. Écoute la question.', 'Let’s try again. Listen to the question.'),
  retell: text('اِحْكِ القِصَّةَ بِكَلِمَاتِكَ لِشَخْصٍ مِنْ عَائِلَتِكَ.', 'Raconte l’histoire avec tes mots à une personne de ta famille.', 'Tell the story in your own words to someone in your family.'),
  success: text('أَحْسَنْتَ!', 'Bravo !', 'Well done!'),
};

type Scene = [string, PreschoolStoryText];
type Question = [PreschoolStoryText, Scene, Scene]; // First authored choice is correct; the player shuffles.
function story(id: string, title: PreschoolStoryText, narration: PreschoolStoryText, scenes: [Scene, Scene, Scene], questions: [Question, Question]): PreschoolActivity {
  return {
    id: `story-${id}`, domain: 'creative', targetValue: id, stepNumber: 0, interactionType: 'story_order',
    i18n: Object.fromEntries((['ar', 'fr', 'en'] as const).map(language => [language, {
      title: title[language], promptAudio: narration[language], successAudio: STORY_SPEECH.success[language],
    }])) as PreschoolActivity['i18n'],
    visualAssets: { mainSvgOrImage: scenes[1][0], storyFrames: scenes.map(([asset, caption], i) => ({ id: `${id}-${i}`, asset, caption, order: ([1, 2, 3] as const)[i] })) },
    narratedStory: { questions: questions.map(([prompt, correct, other], i) => ({
      id: `${id}-q${i + 1}`, prompt, correctId: 'a', choices: [correct, other].map(([asset, label], index) => ({ id: index === 0 ? 'a' : 'b', asset, label })),
    })) },
  };
}

const apple: Scene = ['🍎', text('تُفَّاح', 'Des pommes', 'Apples')];
const basket: Scene = ['🧺', text('سَلَّة', 'Un panier', 'A basket')];
const book: Scene = ['📖', text('كِتَاب', 'Un livre', 'A book')];
const water: Scene = ['💧', text('مَاء', 'De l’eau', 'Water')];
const grandma: Scene = ['👵', text('الْجَدَّة', 'Sa grand-mère', 'His grandmother')];
const cake: Scene = ['🍪', text('حَلْوَى', 'Des gâteaux', 'Cakes')];
const beach: Scene = ['🏖️', text('الشَّاطِئ', 'La plage', 'The beach')];
const dates: Scene = ['story:dates', text('تَمْر', 'Des dattes', 'Dates')];
const olives: Scene = ['🫒', text('زَيْتُون', 'Des olives', 'Olives')];
const hat: Scene = ['🧢', text('قُبَّعَة', 'Un chapeau', 'A hat')];
const umbrella: Scene = ['☂️', text('مِظَلَّة', 'Un parapluie', 'An umbrella')];
const inBasket: Scene = ['🧺', text('فِي السَّلَّة', 'Dans un panier', 'In a basket')];
const onShelf: Scene = ['📚', text('عَلَى الرَّفّ', 'Sur l’étagère', 'On the shelf')];
// A wrong choice must be plausible: if it is absurd (a ball, a bed), the child answers without listening.

export const NARRATED_STORIES: PreschoolActivity[] = [
  story('market', text('دِيدُو فِي السُّوقِ', 'Didou au marché', 'Didou at the market'),
    text('ذَهَبَ دِيدُو مَعَ أُمِّهِ إِلَى سُوقِ الْحَيِّ. رَأَى تُفَّاحاً أَحْمَرَ. اِخْتَارَتْ أُمُّهُ التُّفَّاحَ، وَوَضَعَهُ دِيدُو فِي السَّلَّةِ. شَكَرَا الْبَائِعَ وَعَادَا إِلَى الْبَيْتِ. هُنَاكَ غَسَلَا التُّفَّاحَ قَبْلَ أَكْلِهِ.',
      'Didou va au marché du quartier avec sa maman. Il voit des pommes rouges. Maman choisit les pommes et Didou les met dans le panier. Ils remercient le marchand et rentrent à la maison. Ils lavent les pommes avant de les manger.',
      'Didou goes to the neighbourhood market with Mum. He sees red apples. Mum chooses the apples and Didou puts them in the basket. They thank the seller and go home. They wash the apples before eating them.'),
    [['🏪', text('السُّوق', 'Le marché', 'The market')], apple, basket],
    [[text('مَاذَا اشْتَرَى دِيدُو مَعَ أُمِّهِ؟', 'Qu’achètent Didou et sa maman ?', 'What do Didou and Mum buy?'), apple, olives],
      [text('أَيْنَ وَضَعَ دِيدُو التُّفَّاحَ؟', 'Où Didou met-il les pommes ?', 'Where does Didou put the apples?'), inBasket, onShelf]]),
  story('grandma', text('زِيَارَةُ الْجَدَّةِ', 'Chez grand-mère', 'Visiting Grandma'),
    text('زَارَ دِيدُو جَدَّتَهُ مَعَ أَبِيهِ. قَالَ لَهَا: السَّلَامُ عَلَيْكِ يَا جَدَّتِي! فَرِحَتْ بِهِ وَقَدَّمَتْ لَهُ تَمْراً. تَقَاسَمَ دِيدُو التَّمْرَ مَعَ أَبِيهِ. ثُمَّ جَلَسَا يَسْتَمِعَانِ إِلَى قِصَّةٍ تَحْكِيهَا الْجَدَّةُ.',
      'Didou rend visite à sa grand-mère avec son papa. Il lui dit bonjour. Grand-mère est contente et lui offre des dattes. Didou partage les dattes avec son papa. Puis ils écoutent une histoire racontée par grand-mère.',
      'Didou visits Grandma with Dad. He says hello to her. Grandma is happy and offers him some dates. Didou shares the dates with Dad. Then they listen to Grandma telling a story.'),
    [grandma, dates, book],
    [[text('عِنْدَ مَنْ ذَهَبَ دِيدُو؟', 'À qui Didou rend-il visite ?', 'Who does Didou visit?'), grandma, ['👩‍🏫', text('الْمُعَلِّمَة', 'Sa maîtresse', 'His teacher')]],
      [text('مَاذَا قَدَّمَتِ الْجَدَّةُ لِدِيدُو؟', 'Que lui offre grand-mère ?', 'What does Grandma offer him?'), dates, cake]]),
  story('beach', text('يَوْمٌ عَلَى الشَّاطِئِ', 'Une journée à la plage', 'A day at the beach'),
    text('ذَهَبَ دِيدُو إِلَى الشَّاطِئِ مَعَ أَبِيهِ. جَلَسَا عَلَى الرَّمْلِ. مَلَأَ دِيدُو دَلْوَهُ بِالرَّمْلِ وَبَنَى قَصْراً صَغِيراً. ظَلَّ قُرْبَ أَبِيهِ. عِنْدَ الْعَوْدَةِ، أَخَذَ دَلْوَهُ وَتَرَكَ الْمَكَانَ نَظِيفاً.',
      'Didou va à la plage avec son papa. Ils s’installent sur le sable. Didou remplit son seau de sable et construit un petit château. Il reste près de son papa. En partant, il reprend son seau et laisse la plage propre.',
      'Didou goes to the beach with Dad. They sit on the sand. Didou fills his bucket with sand and builds a little castle. He stays near Dad. When they leave, he takes his bucket and leaves the beach clean.'),
    [beach, ['🏰', text('قَصْرٌ مِنَ الرَّمْل', 'Un château de sable', 'A sandcastle')], ['🪣', text('دَلْو', 'Un seau', 'A bucket')]],
    [[text('أَيْنَ لَعِبَ دِيدُو؟', 'Où Didou joue-t-il ?', 'Where does Didou play?'), beach, ['🌳', text('الْغَابَة', 'La forêt', 'The forest')]],
      [text('مَاذَا أَخَذَ دِيدُو مَعَهُ عِنْدَ الْعَوْدَةِ؟', 'Que reprend Didou en partant ?', 'What does Didou take when leaving?'), ['🪣', text('دَلْوَه', 'Son seau', 'His bucket')], ['🐟', text('سَمَكَة', 'Un poisson', 'A fish')]]]),
  story('eid', text('فَرْحَةُ الْعِيدِ', 'La joie de l’Aïd', 'The joy of Eid'),
    text('فِي صَبَاحِ الْعِيدِ، لَبِسَ دِيدُو قَمِيصَهُ النَّظِيفَ. قَالَ لِعَائِلَتِهِ: عِيدٌ مُبَارَكٌ! وَضَعَتْ أُمُّهُ حَلْوَى فِي طَبَقٍ. حَمَلَ دِيدُو الطَّبَقَ مَعَ أَبِيهِ إِلَى الْجَارَةِ. فَرِحَتِ الْجَارَةُ وَشَكَرَتْهُمَا.',
      'Le matin de l’Aïd, Didou met sa chemise propre. Il souhaite une bonne fête à sa famille. Maman pose des gâteaux sur une assiette. Avec son papa, Didou apporte l’assiette à leur voisine. Elle sourit et les remercie.',
      'On Eid morning, Didou puts on his clean shirt. He wishes his family a happy Eid. Mum puts cakes on a plate. Didou and Dad take the plate to their neighbour. She smiles and thanks them.'),
    [['👕', text('قَمِيص', 'Une chemise', 'A shirt')], cake, ['🏠', text('بَيْتُ الْجَارَة', 'Chez la voisine', 'The neighbour’s home')]],
    [[text('مَاذَا لَبِسَ دِيدُو؟', 'Que met Didou ?', 'What does Didou put on?'), ['👕', text('قَمِيصَه', 'Sa chemise', 'His shirt')], ['🧤', text('قُفَّازَيْن', 'Des gants', 'Gloves')]],
      [text('مَاذَا قَدَّمَ دِيدُو لِلْجَارَةِ؟', 'Qu’apporte Didou à la voisine ?', 'What does Didou bring the neighbour?'), cake, dates]]),
  story('garden', text('بَذْرَةُ دِيدُو', 'La graine de Didou', 'Didou’s seed'),
    text('وَضَعَ دِيدُو بَذْرَةً فِي تُرْبَةِ الْحَدِيقَةِ مَعَ جَدِّهِ. غَطَّيَاهَا بِقَلِيلٍ مِنَ التُّرَابِ. سَقَاهَا دِيدُو بِقَلِيلٍ مِنَ الْمَاءِ. بَعْدَ أَيَّامٍ، ظَهَرَتْ نَبْتَةٌ صَغِيرَةٌ. فَرِحَ دِيدُو وَاسْتَمَرَّ فِي الْعِنَايَةِ بِهَا.',
      'Avec son grand-père, Didou met une graine dans la terre du jardin. Ils la recouvrent d’un peu de terre. Didou verse un peu d’eau. Après plusieurs jours, une petite pousse apparaît. Didou est content et continue à prendre soin de sa plante.',
      'With Grandpa, Didou puts a seed in the garden soil. They cover it with a little soil. Didou adds a little water. After several days, a small shoot appears. Didou is happy and keeps looking after his plant.'),
    [['🌰', text('بَذْرَة', 'Une graine', 'A seed')], water, ['🌱', text('نَبْتَة', 'Une pousse', 'A shoot')]],
    [[text('مَاذَا وَضَعَ دِيدُو فِي التُّرْبَةِ؟', 'Que met Didou dans la terre ?', 'What does Didou put in the soil?'), ['🌰', text('بَذْرَة', 'Une graine', 'A seed')], apple],
      [text('بِمَاذَا سَقَى دِيدُو الْبَذْرَةَ؟', 'Avec quoi Didou arrose-t-il la graine ?', 'What does Didou give the seed?'), water, ['🥛', text('حَلِيب', 'Du lait', 'Milk')]]]),
  story('olives', text('فِي بُسْتَانِ الزَّيْتُونِ', 'Dans le verger d’oliviers', 'In the olive grove'),
    text('زَارَ دِيدُو بُسْتَانَ زَيْتُونٍ مَعَ جَدِّهِ. بَسَطَ الْجَدُّ غِطَاءً تَحْتَ شَجَرَةٍ. جَمَعَا حَبَّاتِ الزَّيْتُونِ الَّتِي سَقَطَتْ عَلَيْهِ. وَضَعَ دِيدُو الزَّيْتُونَ فِي سَلَّةٍ. ثُمَّ عَادَا إِلَى الْبَيْتِ مَعاً.',
      'Didou visite un verger d’oliviers avec son grand-père. Grand-père étale une toile sous un arbre. Ils ramassent les olives tombées sur la toile. Didou les met dans un panier. Puis ils rentrent ensemble à la maison.',
      'Didou visits an olive grove with Grandpa. Grandpa spreads a cloth under a tree. They collect olives that have fallen onto the cloth. Didou puts them in a basket. Then they go home together.'),
    [['🌳', text('شَجَرَة', 'Un arbre', 'A tree')], ['🫒', text('زَيْتُون', 'Des olives', 'Olives')], basket],
    [[text('مَاذَا جَمَعَ دِيدُو مَعَ جَدِّهِ؟', 'Que ramassent Didou et son grand-père ?', 'What do Didou and Grandpa collect?'), ['🫒', text('زَيْتُون', 'Des olives', 'Olives')], apple],
      [text('أَيْنَ وَضَعَ دِيدُو الزَّيْتُونَ؟', 'Où Didou met-il les olives ?', 'Where does Didou put the olives?'), inBasket, onShelf]]),
  story('sahara', text('رِحْلَةٌ إِلَى الصَّحْرَاءِ', 'Une sortie au Sahara', 'A trip to the Sahara'),
    text('ذَهَبَ دِيدُو مَعَ عَائِلَتِهِ لِرُؤْيَةِ كُثْبَانِ الصَّحْرَاءِ. لَبِسَ قُبَّعَتَهُ وَمَشَى قُرْبَ أَبِيهِ. رَأَى الرَّمْلَ يَلْمَعُ فِي الشَّمْسِ. عِنْدَمَا عَطِشَ، أَعْطَاهُ أَبُوهُ مَاءً. جَلَسُوا مَعاً فِي الظِّلِّ لِلرَّاحَةِ.',
      'Didou découvre les dunes du Sahara avec sa famille. Il porte son chapeau et marche près de son papa. Le sable brille au soleil. Quand Didou a soif, son papa lui donne de l’eau. Ils se reposent ensemble à l’ombre.',
      'Didou visits the Sahara dunes with his family. He wears his hat and walks near Dad. The sand shines in the sun. When Didou is thirsty, Dad gives him water. They rest together in the shade.'),
    [['🏜️', text('كُثْبَان', 'Des dunes', 'Dunes')], hat, water],
    [[text('مَاذَا لَبِسَ دِيدُو عَلَى رَأْسِهِ؟', 'Que porte Didou sur la tête ?', 'What does Didou wear on his head?'), hat, ['👟', text('حِذَاء', 'Une chaussure', 'A shoe')]],
      [text('مَاذَا شَرِبَ دِيدُو؟', 'Que boit Didou ?', 'What does Didou drink?'), water, ['🥛', text('حَلِيب', 'Du lait', 'Milk')]]]),
  story('rain', text('دِيدُو وَالْمَطَرُ', 'Didou et la pluie', 'Didou and the rain'),
    text('نَظَرَ دِيدُو مِنَ النَّافِذَةِ. كَانَ الْمَطَرُ يَنْزِلُ. لَبِسَ مِعْطَفَهُ وَخَرَجَ مَعَ أُمِّهِ تَحْتَ مِظَلَّةٍ. سَمِعَ صَوْتَ الْقَطَرَاتِ عَلَيْهَا. عِنْدَمَا عَادَا، عَلَّقَ دِيدُو مِعْطَفَهُ لِيَجِفَّ.',
      'Didou regarde par la fenêtre. Il pleut. Il met son manteau et sort avec sa maman sous un parapluie. Il écoute les gouttes qui tapent dessus. En rentrant, Didou suspend son manteau pour le faire sécher.',
      'Didou looks out of the window. It is raining. He puts on his coat and goes out with Mum under an umbrella. He listens to the drops tapping on it. Back home, Didou hangs up his coat to dry.'),
    [['🌧️', text('مَطَر', 'La pluie', 'Rain')], umbrella, ['🧥', text('مِعْطَف', 'Un manteau', 'A coat')]],
    [[text('مَاذَا اسْتَعْمَلَ دِيدُو وَأُمُّهُ تَحْتَ الْمَطَرِ؟', 'Qu’utilisent Didou et sa maman sous la pluie ?', 'What do Didou and Mum use in the rain?'), umbrella, hat],
      [text('مَاذَا عَلَّقَ دِيدُو لِيَجِفَّ؟', 'Que suspend Didou pour le faire sécher ?', 'What does Didou hang up to dry?'), ['🧥', text('مِعْطَفَه', 'Son manteau', 'His coat')], umbrella]]),
  story('library', text('كِتَابٌ مِنَ الْمَكْتَبَةِ', 'Un livre à la bibliothèque', 'A book at the library'),
    text('ذَهَبَ دِيدُو مَعَ أُمِّهِ إِلَى مَكْتَبَةِ الْحَيِّ. اِخْتَارَ كِتَاباً فِيهِ صُوَرُ حَيَوَانَاتٍ. قَلَّبَ الصَّفَحَاتِ بِرِفْقٍ، وَتَحَدَّثَ بِصَوْتٍ هَادِئٍ. بَعْدَ الْقِرَاءَةِ، أَعَادَ الْكِتَابَ إِلَى الرَّفِّ بِمُسَاعَدَةِ أُمِّهِ.',
      'Didou va à la bibliothèque du quartier avec sa maman. Il choisit un livre avec des images d’animaux. Il tourne doucement les pages et parle à voix basse. Après la lecture, il remet le livre sur l’étagère avec l’aide de sa maman.',
      'Didou goes to the neighbourhood library with Mum. He chooses a book with animal pictures. He turns the pages gently and speaks quietly. After reading, he puts the book back on the shelf with Mum’s help.'),
    [book, ['🐾', text('حَيَوَانَات', 'Des animaux', 'Animals')], ['📚', text('رَفُّ الْكُتُب', 'L’étagère', 'The bookshelf')]],
    [[text('مَاذَا اخْتَارَ دِيدُو فِي الْمَكْتَبَةِ؟', 'Que choisit Didou à la bibliothèque ?', 'What does Didou choose at the library?'), book, apple],
      [text('أَيْنَ أَعَادَ دِيدُو الْكِتَابَ؟', 'Où Didou remet-il le livre ?', 'Where does Didou put the book back?'), onShelf, inBasket]]),
];
