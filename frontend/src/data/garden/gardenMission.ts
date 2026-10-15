import type { PrimaryGrade } from '../../types';
import type { PreschoolLanguage } from '../preschool/types';
export type GardenBand = 'preschool' | PrimaryGrade;
export type GardenText = Record<PreschoolLanguage, string>;
interface CommonTask {
    id: string;
    title: GardenText;
    prompt: GardenText;
    hint: GardenText;
    explain: GardenText;
    practice: GardenText;
}
export type GardenTask = CommonTask & ({
    kind: 'sow';
    rows: number;
    columns: number;
    target: number;
    layout: 'total' | 'equal' | 'rectangle';
} | {
    kind: 'number';
    accepted: string;
    unit: GardenText;
} | {
    kind: 'water';
    targets: number[];
    doseMl: number | null;
} | {
    kind: 'read';
    passage: GardenText;
    options: {
        id: string;
        label: GardenText;
        art: 'can' | 'plant' | 'sun' | 'basket' | 'seed';
    }[];
    correct: string;
} | {
    kind: 'share';
    targets: number[];
    labels: GardenText[];
    total: number;
} | {
    kind: 'observe';
    action: GardenText;
});
export interface GardenPlan {
    band: GardenBand;
    intro: GardenText;
    tasks: GardenTask[];
}
const t = (fr: string, ar: string, en: string): GardenText => ({ fr, ar, en });
export const GARDEN_SESSIONS = [t('Préparer le jardin', 'أُحَضِّرُ الْحَدِيقَةَ', 'Prepare the garden'), t('Prendre soin des plantes', 'أَعْتَنِي بِالنَّبَاتَاتِ', 'Care for the plants'), t('Partager et raconter', 'أُقَاسِمُ وَأَحْكِي', 'Share and explain')];
const practice = [t('Recompter ou reconstruire avec des jetons.', 'أعد العدّ أو البناء بقطع صغيرة.', 'Count or build again with counters.'), t('Dessiner les groupes avant de refaire le calcul.', 'ارسم المجموعات قبل إعادة الحساب.', 'Draw the groups before calculating again.'), t('Rejouer en vérifiant chaque pot séparément.', 'أعد اللعب مع التحقق من كل أصيص.', 'Play again and check each pot separately.'), t('Réécouter le récit et montrer le passage utile.', 'استمع مجدداً وأشر إلى الجزء المناسب.', 'Listen again and point to the useful part.'), t('Repartager de vrais jetons entre des coupelles.', 'وزّع قطعاً حقيقية بين أوعية صغيرة.', 'Share real counters between small bowls.'), t('Reprendre la même idée hors écran avec un adulte.', 'أعد الفكرة خارج الشاشة مع شخص بالغ.', 'Try the idea off screen with a grown-up.')];
const bands: GardenBand[] = ['preschool', '1AP', '2AP', '3AP', '4AP', '5AP'];
const counts = [3, 6, 12, 12, 6, 15];
const waterTargets = [[1, 1], [2, 2, 2], [3, 3, 3], [2, 2, 2, 2], [2, 2, 2], [3, 3, 3, 3]];
const harvestTargets = [[1, 1, 1], [3, 3], [4, 4, 4], [6, 6, 6], [6, 3, 3], [5, 5, 5, 5]];
const sowPrompts = [
    t('Touche trois emplacements pour planter trois graines.', 'اِلْمَسْ ثَلَاثَ خَانَاتٍ لِتَزْرَعَ ثَلَاثَ بَذَرَاتٍ.', 'Touch three spaces to plant three seeds.'),
    t('Prépare six emplacements dans le potager de Didou.', 'حَضِّرْ سِتَّ خَانَاتٍ فِي حَدِيقَةِ دِيدُو.', 'Prepare six spaces in Didou’s garden.'),
    t('Plante quatre graines dans chacune des trois rangées.', 'ازرع أربع بذرات في كل صف من الصفوف الثلاثة.', 'Plant four seeds in each of the three rows.'),
    t('Dessine un potager rectangulaire de 12 cases, sans trou. Chaque case représente une unité d’aire.', 'كوّن حوضاً مستطيلاً من 12 خانة متصلة بلا فراغات. كل خانة تمثل وحدة مساحة.', 'Build a rectangular garden of 12 connected cells, with no gaps. Each cell represents one unit of area.'),
    t('Réserve la moitié des 12 cases égales aux graines de Didou.', 'خصّص نصف الخانات الاثنتي عشرة المتساوية لبذور ديدو.', 'Reserve half of the 12 equal cells for Didou’s seeds.'),
    t('Réserve 3/4 de ce potager de 20 cases égales aux légumes.', 'خصّص 3/4 من هذا الحوض ذي 20 خانة متساوية للخضروات.', 'Reserve 3/4 of this garden’s 20 equal cells for vegetables.')
];
const numberPrompts = [
    t('Didou a trois graines. Il en ajoute une. Combien de graines a-t-il maintenant ?', 'لِدِيدُو ثَلَاثُ بَذَرَاتٍ. أَضَافَ بَذْرَةً. كَمْ بَذْرَةً أَصْبَحَتْ لَدَيْهِ؟', 'Didou has three seeds. He adds one. How many seeds does he have now?'),
    t('Il faut six graines. Un sachet contient trois graines. Combien de sachets faut-il ?', 'نحتاج إلى ست بذرات. في كل كيس ثلاث بذرات. كم كيساً نحتاج؟', 'We need six seeds. Each bag holds three seeds. How many bags do we need?'),
    t('Un sachet contient quatre graines. Combien de sachets faut-il pour douze graines ?', 'في كل كيس أربع بذرات. كم كيساً نحتاج للحصول على اثنتي عشرة بذرة؟', 'Each bag holds four seeds. How many bags do we need for twelve seeds?'),
    t('Trois sachets coûtent 25 DA chacun. Quel est leur prix total ? Prix fictifs pour ce jeu.', 'ثمن كل كيس 25 دج. ما ثمن ثلاثة أكياس؟ الأسعار افتراضية للعبة.', 'Three bags cost 25 DA each. What is their total price? These are pretend prices.'),
    t('Didou achète trois sachets à 40 DA chacun et donne 200 DA. Combien reçoit-il de monnaie ? Prix fictifs.', 'يشتري ديدو ثلاثة أكياس بثمن 40 دج للكيس ويدفع 200 دج. كم يسترجع؟ الأسعار افتراضية.', 'Didou buys three bags at 40 DA each and pays 200 DA. How much change does he get? Pretend prices.'),
    t('Les légumes occupent 15 m². Les graines coûtent 12 DA par m². Quel est le coût total ? Prix fictifs.', 'تشغل الخضروات 15 m². تكلفة البذور 12 دج لكل m². ما التكلفة الإجمالية؟ الأسعار افتراضية.', 'Vegetables cover 15 m². Seeds cost 12 DA per m². What is the total cost? Pretend prices.')
];
const answers = ['4', '2', '3', '75', '80', '180'];
const methods = [
    t('3 + 1 = 4 graines. Une graine de plus augmente la quantité de un.', '3 + 1 = 4 بذرات. إضافة بذرة تزيد العدد بواحد.', '3 + 1 = 4 seeds. One more seed increases the count by one.'),
    t('3 + 3 = 6. Deux sachets de trois graines suffisent.', '3 + 3 = 6. يكفي كيسان من ثلاث بذرات.', '3 + 3 = 6. Two bags of three seeds are enough.'),
    t('4 + 4 + 4 = 12. Il faut trois sachets.', '4 + 4 + 4 = 12. نحتاج إلى ثلاثة أكياس.', '4 + 4 + 4 = 12. We need three bags.'),
    t('3 × 25 = 75 DA. Le prix total est le prix d’un sachet multiplié par trois.', '3 × 25 = 75 دج. نضرب ثمن الكيس في ثلاثة.', '3 × 25 = 75 DA. Multiply one bag’s price by three.'),
    t('3 × 40 = 120 DA, puis 200 − 120 = 80 DA de monnaie. Vérification : 120 + 80 = 200.', '3 × 40 = 120 دج، ثم 200 − 120 = 80 دج من الباقي. نتحقق: 120 + 80 = 200.', '3 × 40 = 120 DA, then 200 − 120 = 80 DA change. Check: 120 + 80 = 200.'),
    t('15 × 12 = 180 DA. On multiplie la surface cultivée par le coût pour un mètre carré.', '15 × 12 = 180 دج. نضرب المساحة المزروعة في تكلفة المتر المربع.', '15 × 12 = 180 DA. Multiply the planted area by the cost for one square metre.')
];
const passages = [
    t('Didou plante une graine. Il l’arrose. Après plusieurs jours, une petite plante apparaît.', 'يَزْرَعُ دِيدُو بَذْرَةً وَيَسْقِيهَا. بَعْدَ أَيَّامٍ، تَظْهَرُ نَبْتَةٌ صَغِيرَةٌ.', 'Didou plants a seed and waters it. After several days, a little plant appears.'),
    t('Lina sème les graines. Sami apporte l’eau. Ensemble, ils arrosent les pots.', 'تَزْرَعُ لِينَا الْبُذُورَ. يُحْضِرُ سَامِي الْمَاءَ. يَسْقِيَانِ الْأَصَائِصَ مَعاً.', 'Lina plants the seeds. Sami brings water. Together, they water the pots.'),
    t('Lina sème des lentilles et du persil dans des pots. Elle place une étiquette avec le nom de chaque plante. Plus tard, elle retrouve facilement le pot de persil.', 'زَرَعَتْ لِينَا الْعَدَسَ وَالْمَعْدَنُوسَ فِي أَصَائِصَ. وَضَعَتْ بِطَاقَةً بِاسْمِ كُلِّ نَبْتَةٍ. بَعْدَ ذَلِكَ وَجَدَتْ أَصِيصَ الْمَعْدَنُوسِ بِسُهُولَةٍ.', 'Lina plants lentils and parsley in pots. She labels each plant with its name. Later, she easily finds the parsley pot.'),
    t('Sami observe deux pots de lentilles, placés sous la même lumière. Les pots contiennent la même terre. Chaque jour, il donne moins d’eau au deuxième pot et note ses observations.', 'يُرَاقِبُ سَامِي أَصِيصَيْ عَدَسٍ تَحْتَ الضَّوْءِ نَفْسِهِ وَبِالتُّرْبَةِ نَفْسِهَا. كُلَّ يَوْمٍ يُعْطِي الأَصِيصَ الثَّانِي مَاءً أَقَلَّ وَيُسَجِّلُ مُلَاحَظَاتِهِ.', 'Sami observes two lentil pots under the same light, with the same soil. Each day, he gives the second pot less water and records what he sees.'),
    t('Deux groupes cultivent la même espèce, dans des pots identiques et sous la même lumière. Seule la quantité d’eau change. Le premier jour, rien ne permet de distinguer leur croissance. Les élèves poursuivent les observations pendant plusieurs jours.', 'تَزْرَعُ مَجْمُوعَتَانِ النَّوْعَ نَفْسَهُ فِي أَصَائِصَ مُتَمَاثِلَةٍ وَتَحْتَ الضَّوْءِ نَفْسِهِ. تَتَغَيَّرُ كَمِّيَّةُ الْمَاءِ فَقَطْ. فِي الْيَوْمِ الأَوَّلِ لَا يَظْهَرُ فَرْقٌ فِي النُّمُوِّ، فَيُوَاصِلُ التَّلَامِيذُ الْمُلَاحَظَةَ أَيَّاماً.', 'Two groups grow the same species in identical pots under the same light. Only the amount of water changes. On day one, they cannot distinguish their growth. The pupils keep observing for several days.'),
    t('Les élèves comparent quatre pots de lentilles de même taille, avec la même terre et la même lumière. Deux pots reçoivent une dose d’eau et deux autres en reçoivent deux. Après plusieurs jours, les pots les plus arrosés ont davantage poussé dans cet essai. Ils gardent leurs mesures et proposent de répéter la comparaison.', 'يُقَارِنُ التَّلَامِيذُ أَرْبَعَةَ أَصَائِصِ عَدَسٍ بِالْحَجْمِ وَالتُّرْبَةِ وَالضَّوْءِ نَفْسِهَا. يَتَلَقَّى أَصِيصَانِ جُرْعَةَ مَاءٍ وَيَتَلَقَّى الآخَرَانِ جُرْعَتَيْنِ. بَعْدَ أَيَّامٍ، كَانَ نُمُوُّ الأَصِيصَيْنِ الأَكْثَرِ سَقْياً أَكْبَرَ فِي هَذِهِ التَّجْرِبَةِ. يَحْتَفِظُونَ بِالْقِيَاسَاتِ وَيَقْتَرِحُونَ إِعَادَةَ الْمُقَارَنَةِ.', 'Pupils compare four lentil pots of the same size, soil and light. Two pots receive one dose of water and two receive two doses. After several days, the more watered pots have grown more in this trial. They keep their measurements and propose repeating the comparison.')
];
const questions = [t('Que voit Didou après plusieurs jours ?', 'مَاذَا يَرَى دِيدُو بَعْدَ أَيَّامٍ؟', 'What does Didou see after several days?'), t('Qui apporte l’eau ?', 'مَنْ يُحْضِرُ الْمَاءَ؟', 'Who brings water?'), t('Pourquoi Lina met-elle des étiquettes ?', 'لِمَاذَا تَضَعُ لِينَا الْبِطَاقَاتِ؟', 'Why does Lina add labels?'), t('Quel facteur Sami change-t-il ?', 'مَا الْعَامِلُ الَّذِي يُغَيِّرُهُ سَامِي؟', 'Which factor does Sami change?'), t('Que faire avant de conclure sur la croissance ?', 'مَاذَا نَفْعَلُ قَبْلَ اسْتِنْتَاجِ فَرْقٍ فِي النُّمُوِّ؟', 'What should we do before concluding about growth?'), t('Quelle conclusion respecte les observations ?', 'أَيُّ اسْتِنْتَاجٍ يَحْتَرِمُ الْمُلَاحَظَاتِ؟', 'Which conclusion respects the observations?')];
const correctLabels = [t('Une petite plante', 'نَبْتَةٌ صَغِيرَةٌ', 'A little plant'), t('Sami', 'سَامِي', 'Sami'), t('Pour reconnaître chaque plante', 'لِمَعْرِفَةِ كُلِّ نَبْتَةٍ', 'To identify each plant'), t('La quantité d’eau', 'كَمِّيَّةَ الْمَاءِ', 'The amount of water'), t('Observer plusieurs jours dans les mêmes conditions', 'نُلَاحِظُ أَيَّاماً مَعَ ثَبَاتِ الشُّرُوطِ', 'Observe for several days with the same conditions'), t('Dans cet essai, les pots plus arrosés ont davantage poussé ; il faut vérifier à nouveau.', 'فِي هَذِهِ التَّجْرِبَةِ نَمَتِ الأَصَائِصُ الأَكْثَرُ سَقْياً أَكْثَرَ؛ نَتَحَقَّقُ مُجَدَّداً.', 'In this trial, the more watered pots grew more; we should check again.')];
const wrongLabels = [
    [t('Un panier de fruits', 'سَلَّةُ فَوَاكِهَ', 'A fruit basket'), t('Un soleil', 'شَمْسٌ', 'A sun')],
    [t('Lina', 'لِينَا', 'Lina'), t('Didou', 'دِيدُو', 'Didou')],
    [t('Pour remplacer l’eau', 'لِتَعْوِيضِ الْمَاءِ', 'To replace water'), t('Pour cacher les pots', 'لِإِخْفَاءِ الْأَصَائِصِ', 'To hide the pots')],
    [t('La lumière', 'الضَّوْءَ', 'The light'), t('La terre', 'التُّرْبَةَ', 'The soil')],
    [t('Conclure après un seul jour', 'نَسْتَنْتِجُ بَعْدَ يَوْمٍ وَاحِدٍ', 'Conclude after one day'), t('Changer aussi la terre et la lumière', 'نُغَيِّرُ التُّرْبَةَ وَالضَّوْءَ أَيْضاً', 'Also change the soil and light')],
    [t('Toutes les plantes poussent toujours mieux avec plus d’eau.', 'كُلُّ النَّبَاتَاتِ تَنْمو أَفْضَلَ دَائِماً بِمَاءٍ أَكْثَرَ.', 'All plants always grow better with more water.'), t('La lumière explique le résultat, même si elle était identique.', 'الضَّوْءُ يُفَسِّرُ النَّتِيجَةَ رَغْمَ ثَبَاتِهِ.', 'Light explains the result even though it was the same.')]
];
export const GARDEN_PLANS: Record<GardenBand, GardenPlan> = Object.fromEntries(bands.map((band, i) => {
    const total = harvestTargets[i].reduce((a, b) => a + b, 0);
    const base = (step: number, title: GardenText, prompt: GardenText, hint: GardenText, explain: GardenText): CommonTask => ({ id: 'garden-mission:' + band + ':' + step, title, prompt, hint, explain, practice: practice[step] });
    const tasks: GardenTask[] = [
        { ...base(0, t('Semer ensemble', 'نَزْرَعُ مَعاً', 'Plant together'), sowPrompts[i], t('Une case représente un emplacement. Touche-la de nouveau pour retirer la graine.', 'كل خانة مكان لبذرة. المسها مجدداً لحذف البذرة.', 'Each cell is one planting space. Touch it again to remove the seed.'), i === 4 ? t('12 ÷ 2 = 6 cases : la moitié.', '12 ÷ 2 = 6 خانات: النصف.', '12 ÷ 2 = 6 cells: one half.') : i === 5 ? t('20 ÷ 4 × 3 = 15 cases : trois quarts.', '20 ÷ 4 × 3 = 15 خانة: ثلاثة أرباع.', '20 ÷ 4 × 3 = 15 cells: three quarters.') : t('Tu as préparé ' + counts[i] + ' emplacements. ' + (i === 2 ? '3 × 4 = 12.' : i === 3 ? 'Un rectangle plein a des rangées alignées de même longueur.' : ''), 'حضّرت ' + counts[i] + ' خانات. ' + (i === 2 ? '3 × 4 = 12.' : i === 3 ? 'للمستطيل الممتلئ صفوف مصطفة بالطول نفسه.' : ''), 'You prepared ' + counts[i] + ' spaces. ' + (i === 2 ? '3 × 4 = 12.' : i === 3 ? 'A filled rectangle has aligned rows of equal length.' : ''))), kind: 'sow', rows: i === 0 ? 1 : i === 1 ? 2 : i === 3 || i === 5 ? 4 : 3, columns: i === 0 || i === 2 || i === 5 ? 5 : 4, target: counts[i], layout: i === 2 ? 'equal' : i === 3 ? 'rectangle' : 'total' },
        { ...base(1, t('Préparer les réserves', 'أُحَضِّرُ الْمُؤُونَةَ', 'Prepare supplies'), numberPrompts[i], methods[i], methods[i]), kind: 'number', accepted: answers[i], unit: i === 0 ? t('graines', 'بذرات', 'seeds') : i < 3 ? t('sachets', 'أكياس', 'bags') : t('DA', 'دج', 'DA') },
        { ...base(2, t('Distribuer l’eau', 'أُوَزِّعُ الْمَاءَ', 'Distribute water'), i < 3 ? [t('Donne un jeton d’eau à chaque pot.', 'ضَعْ قِطْعَةَ مَاءٍ وَاحِدَةً فِي كُلِّ أَصِيصٍ.', 'Give each pot one water counter.'), t('Donne deux jetons d’eau à chaque pot.', 'ضَعْ قِطْعَتَيْ مَاءٍ فِي كُلِّ أَصِيصٍ.', 'Give each pot two water counters.'), t('Donne trois jetons d’eau à chaque pot.', 'ضَعْ ثَلَاثَ قِطَعِ مَاءٍ فِي كُلِّ أَصِيصٍ.', 'Give each pot three water counters.')][i] : t('Chaque dose représente 250 mL. Prépare ' + waterTargets[i][0] * 250 + ' mL par pot. Ce sont des quantités fictives pour calculer.', 'تمثل كل جرعة 250 mL. حضّر ' + waterTargets[i][0] * 250 + ' mL لكل أصيص. هذه كميات افتراضية للحساب.', 'Each dose represents 250 mL. Prepare ' + waterTargets[i][0] * 250 + ' mL per pot. These are pretend amounts for calculating.'), t('Touche l’arrosoir d’un pot pour ajouter une dose. Le bouton moins en retire une.', 'المس مرش الأصيص لإضافة جرعة. زر الناقص يحذف جرعة.', 'Touch a pot’s watering can to add one dose. Minus removes one.'), t('Chaque pot reçoit la quantité demandée. Pour de vraies plantes, un adulte adapte l’arrosage à l’espèce et à la terre.', 'لكل أصيص الكمية المطلوبة. للنباتات الحقيقية، يضبط شخص بالغ السقي حسب النوع والتربة.', 'Each pot has the requested amount. For real plants, a grown-up adjusts watering to the species and soil.')), kind: 'water', targets: waterTargets[i], doseMl: i >= 3 ? 250 : null },
        { ...base(3, t('L’enquête du jardin', 'تَحَقُّقٌ فِي الْحَدِيقَةِ', 'Garden detective'), questions[i], t('Écoute ou relis le passage. Une seule réponse correspond à ce qu’il raconte.', 'استمع إلى النص أو أعد قراءته. إجابة واحدة توافق ما يرويه.', 'Listen or read again. Only one answer matches the passage.'), correctLabels[i]), kind: 'read', passage: passages[i], correct: 'yes', options: [{ id: 'no-a', label: wrongLabels[i][0], art: i === 0 ? 'basket' as const : 'sun' as const }, { id: 'yes', label: correctLabels[i], art: i === 0 ? 'plant' as const : 'can' as const }, { id: 'no-b', label: wrongLabels[i][1], art: 'seed' as const }].sort((a, b) => ((a.id === 'yes' ? 1 : a.id === 'no-a' ? 0 : 2) + i) % 3 - ((b.id === 'yes' ? 1 : b.id === 'no-a' ? 0 : 2) + i) % 3) },
        { ...base(4, t('Partager la récolte', 'أُقَاسِمُ الْمَحْصُولَ', 'Share the harvest'), i < 4 ? t('Partage ' + total + ' tomates également entre ' + harvestTargets[i].length + ' paniers.', 'وزّع ' + total + ' حبات طماطم بالتساوي بين ' + harvestTargets[i].length + ' سلال.', 'Share ' + total + ' tomatoes equally between ' + harvestTargets[i].length + ' baskets.') : i === 4 ? t('Sur 12 tomates, donne la moitié à l’école, un quart à la maison et un quart aux amis.', 'من أصل 12 حبة طماطم، أعطِ النصف للمدرسة والربع للبيت والربع للأصدقاء.', 'Of 12 tomatoes, give half to school, one quarter to home and one quarter to friends.') : t('Sur 20 tomates, donne 25 % à l’école. Partage le reste également entre trois familles.', 'من أصل 20 حبة طماطم، أعطِ 25 % للمدرسة. وزّع الباقي بالتساوي بين ثلاث عائلات.', 'Of 20 tomatoes, give 25 % to school. Share the rest equally between three families.'), t('Distribue une tomate à la fois. Tu peux en retirer avec le bouton moins.', 'وزّع حبة واحدة كل مرة. يمكنك حذف حبة بزر الناقص.', 'Share one tomato at a time. You can remove one using minus.'), i < 4 ? t(total + ' ÷ ' + harvestTargets[i].length + ' = ' + harvestTargets[i][0] + ' tomates par panier.', total + ' ÷ ' + harvestTargets[i].length + ' = ' + harvestTargets[i][0] + ' حبات لكل سلة.', total + ' ÷ ' + harvestTargets[i].length + ' = ' + harvestTargets[i][0] + ' tomatoes per basket.') : i === 4 ? t('12 ÷ 2 = 6 pour l’école ; 12 ÷ 4 = 3 pour chaque autre panier. 6 + 3 + 3 = 12.', '12 ÷ 2 = 6 للمدرسة؛ 12 ÷ 4 = 3 لكل سلة أخرى. 6 + 3 + 3 = 12.', '12 ÷ 2 = 6 for school; 12 ÷ 4 = 3 for each other basket. 6 + 3 + 3 = 12.') : t('25 % de 20 = 5 pour l’école. Il reste 15 ; 15 ÷ 3 = 5 pour chaque famille.', '25 % من 20 = 5 للمدرسة. يبقى 15؛ 15 ÷ 3 = 5 لكل عائلة.', '25 % of 20 = 5 for school. 15 remain; 15 ÷ 3 = 5 for each family.')), kind: 'share', targets: harvestTargets[i], total, labels: harvestTargets[i].map((_, j) => i >= 4 && j === 0 ? t('École', 'المدرسة', 'School') : i === 4 && j === 1 ? t('Maison', 'البيت', 'Home') : i === 4 ? t('Amis', 'الأصدقاء', 'Friends') : t('Panier ' + (j + 1), 'السلة ' + (j + 1), 'Basket ' + (j + 1))) },
        { ...base(5, t('À toi de transmettre', 'دَوْرُكَ لِتَشْرَحَ', 'Your turn to explain'), t('Raconte à un adulte comment tu as aidé Didou. Puis essaie avec de vrais objets.', 'احكِ لشخص بالغ كيف ساعدت ديدو. ثم جرّب بأشياء حقيقية.', 'Tell a grown-up how you helped Didou. Then try with real objects.'), practice[5], t('Le dernier défi est une observation humaine, pas une note automatique.', 'التحدي الأخير ملاحظة بشرية وليس تنقيطاً آلياً.', 'The last challenge is a human observation, not an automatic score.')), kind: 'observe', action: i === 0 ? t('Avec trois gros cubes et trois assiettes, pose un cube dans chaque assiette et raconte tes gestes.', 'استعمل ثلاثة مكعبات كبيرة وثلاثة أطباق. ضع مكعباً في كل طبق واحكِ ما فعلت.', 'Use three large blocks and three plates. Put one block on each plate and explain your actions.') : i === 1 ? t('Avec six bouchons et deux coupelles, fais deux groupes égaux et raconte les étapes.', 'استعمل ستة أغطية ووعاءين لتكوين مجموعتين متساويتين واحكِ الخطوات.', 'Use six bottle caps and two bowls to make equal groups and tell the steps.') : i < 4 ? t('Dessine un autre potager ou répartis douze jetons entre trois récipients. Explique comment tu vérifies.', 'ارسم حوضاً آخر أو وزّع اثنتي عشرة قطعة بين ثلاثة أوعية. اشرح كيف تتحقق.', 'Draw another garden or share twelve counters between three bowls. Explain how you check.') : t('Dessine une surface partagée en parts égales. Choisis une fraction, montre-la et explique le calcul à un adulte.', 'ارسم مساحة مقسمة إلى أجزاء متساوية. اختر كسراً ومثّله واشرح حسابك لشخص بالغ.', 'Draw a surface divided into equal parts. Choose a fraction, show it and explain your calculation to a grown-up.') }
    ];
    return [band, { band, intro: t('Didou veut transformer une cour vide en jardin à partager. Aide-le à préparer, prendre soin et raconter ce qu’il a appris.', 'يريد ديدو تحويل ساحة فارغة إلى حديقة نتقاسمها. ساعده في التحضير والعناية ثم احكِ ما تعلّمت.', 'Didou wants to turn an empty courtyard into a shared garden. Help him prepare, care for it and explain what he learned.'), tasks }];
})) as Record<GardenBand, GardenPlan>;
export function gardenCellsCorrect(task: Extract<GardenTask, {
    kind: 'sow';
}>, selected: readonly number[]) {
    const cells = [...new Set(selected)];
    if (cells.length !== selected.length || cells.length !== task.target || cells.some(n => !Number.isInteger(n) || n < 0 || n >= task.rows * task.columns))
        return false;
    if (task.layout === 'equal')
        return Array.from({ length: task.rows }, (_, r) => cells.filter(c => Math.floor(c / task.columns) === r).length).every(n => n === task.target / task.rows);
    if (task.layout === 'rectangle') {
        const rs = cells.map(c => Math.floor(c / task.columns));
        const cs = cells.map(c => c % task.columns);
        return (Math.max(...rs) - Math.min(...rs) + 1) * (Math.max(...cs) - Math.min(...cs) + 1) === cells.length;
    }
    return true;
}
