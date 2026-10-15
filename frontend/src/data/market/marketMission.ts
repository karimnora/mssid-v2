import type { PrimaryGrade } from "../../types";
import type { PreschoolLanguage } from "../preschool/types";
export type MarketBand = "preschool" | PrimaryGrade;
export type MarketText = Record<PreschoolLanguage, string>;
export const mt = (fr: string, ar: string, en: string): MarketText => ({
  fr,
  ar,
  en,
});
interface Base {
  id: string;
  title: MarketText;
  prompt: MarketText;
  hint: MarketText;
  explain: MarketText;
}
export type MarketTask = Base &
  (
    | { kind: "pack"; targets: [number, number] }
    | { kind: "compare"; options: [MarketText, MarketText]; correct: number }
    | { kind: "pay"; total: number; coins: number[]; tokens: boolean }
    | {
        kind: "read";
        passage: MarketText;
        options: MarketText[];
        correct: number;
      }
    | { kind: "share"; total: number; targets: number[] }
    | { kind: "observe"; action: MarketText }
  );
export const MARKET_SESSIONS = [
  mt("Préparer ma commande", "أحضّر طلبي", "Prepare my order"),
  mt("Choisir et payer", "أختار وأدفع", "Choose and pay"),
  mt("Partager et expliquer", "أقاسم وأشرح", "Share and explain"),
];
const bands: MarketBand[] = ["preschool", "1AP", "2AP", "3AP", "4AP", "5AP"];
const amounts = [
  [3, 2],
  [4, 2],
  [6, 3],
  [12, 6],
  [9, 3],
  [15, 3],
] as const;
const totals = [4, 20, 35, 75, 145, 180];
const coins = [
  [1],
  [10, 5],
  [20, 10, 5],
  [50, 20, 10, 5],
  [100, 50, 20, 10, 5],
  [100, 50, 20, 10, 5],
];
const packPrompts = [
  mt(
    "Prépare 3 pommes et 2 carottes. Touche + pour ajouter, − pour retirer.",
    "حضّر 3 تفاحات وجزرتين. المس + للإضافة و− للحذف.",
    "Pack 3 apples and 2 carrots. Touch + to add and − to remove."
  ),
  mt(
    "La commande demande 4 pommes et 2 carottes.",
    "يحتاج الطلب إلى 4 تفاحات وجزرتين.",
    "The order needs 4 apples and 2 carrots."
  ),
  mt(
    "Chaque panier contient 3 pommes. Pour 2 paniers, prépare les pommes, puis ajoute 3 carottes.",
    "في كل سلة 3 تفاحات. حضّر التفاح لسلتين ثم أضف 3 جزرات.",
    "Each basket needs 3 apples. Pack enough apples for 2 baskets, then add 3 carrots."
  ),
  mt(
    "Prépare 3 lots de 4 pommes et 2 lots de 3 carottes.",
    "حضّر 3 مجموعات من 4 تفاحات ومجموعتين من 3 جزرات.",
    "Pack 3 groups of 4 apples and 2 groups of 3 carrots."
  ),
  mt(
    "Prends la moitié de 18 pommes et le quart de 12 carottes.",
    "خذ نصف 18 تفاحة وربع 12 جزرة.",
    "Take half of 18 apples and one quarter of 12 carrots."
  ),
  mt(
    "Prends les trois quarts de 20 pommes et 25 % de 12 carottes.",
    "خذ ثلاثة أرباع 20 تفاحة و25 % من 12 جزرة.",
    "Take three quarters of 20 apples and 25% of 12 carrots."
  ),
];
const compares: {
  options: [MarketText, MarketText];
  correct: number;
  prompt: MarketText;
  explain: MarketText;
}[] = [
  {
    options: [
      mt("3 pommes", "3 تفاحات", "3 apples"),
      mt("5 pommes", "5 تفاحات", "5 apples"),
    ],
    correct: 1,
    prompt: mt(
      "Quel panier contient le plus de pommes ?",
      "أيّ سلة تحتوي على تفاح أكثر؟",
      "Which basket has more apples?"
    ),
    explain: mt(
      "5 est plus grand que 3. Compte les pommes une à une.",
      "5 أكبر من 3. عدّ التفاحات واحدة واحدة.",
      "5 is greater than 3. Count the apples one by one."
    ),
  },
  {
    options: [
      mt("7 carottes", "7 جزرات", "7 carrots"),
      mt("5 carottes", "5 جزرات", "5 carrots"),
    ],
    correct: 0,
    prompt: mt(
      "Quel lot contient le plus de carottes ?",
      "أيّ مجموعة تحتوي على جزر أكثر؟",
      "Which group has more carrots?"
    ),
    explain: mt(
      "7 > 5 : le premier lot contient 2 carottes de plus.",
      "7 > 5: المجموعة الأولى تحتوي على جزرتين إضافيتين.",
      "7 > 5: the first group has 2 more carrots."
    ),
  },
  {
    options: [mt("12 DA", "12 دج", "12 DA"), mt("15 DA", "15 دج", "15 DA")],
    correct: 0,
    prompt: mt(
      "Deux lots identiques coûtent 12 DA ou 15 DA. Lequel coûte moins cher ?",
      "مجموعتان متماثلتان بسعر 12 دج و15 دج. أيهما أقل ثمناً؟",
      "Two identical packs cost 12 DA or 15 DA. Which costs less?"
    ),
    explain: mt(
      "12 < 15 : le premier lot coûte 3 DA de moins.",
      "12 < 15: المجموعة الأولى أقل بـ3 دج.",
      "12 < 15: the first pack costs 3 DA less."
    ),
  },
  {
    options: [
      mt("3 × 20 DA", "3 × 20 دج", "3 × 20 DA"),
      mt("2 × 35 DA", "2 × 35 دج", "2 × 35 DA"),
    ],
    correct: 0,
    prompt: mt(
      "Chaque offre donne 6 pommes de même qualité. Quelle offre a le plus petit prix total ?",
      "كل عرض يعطي 6 تفاحات بالجودة نفسها. أيهما أقل سعراً إجمالياً؟",
      "Each offer gives 6 apples of the same quality. Which total is lower?"
    ),
    explain: mt(
      "3 × 20 = 60 ; 2 × 35 = 70. La première offre coûte 10 DA de moins.",
      "3 × 20 = 60 و2 × 35 = 70. العرض الأول أقل بـ10 دج.",
      "3 × 20 = 60; 2 × 35 = 70. The first offer costs 10 DA less."
    ),
  },
  {
    options: [
      mt("1 kg : 180 DA", "1 كغ: 180 دج", "1 kg: 180 DA"),
      mt("500 g : 100 DA", "500 غ: 100 دج", "500 g: 100 DA"),
    ],
    correct: 0,
    prompt: mt(
      "Pour acheter 1 kg de pommes de même qualité, quelle offre coûte moins cher ?",
      "لشراء 1 كغ من التفاح بالجودة نفسها، أيّ عرض أقل سعراً؟",
      "To buy 1 kg of apples of the same quality, which offer costs less?"
    ),
    explain: mt(
      "Il faut 2 lots de 500 g : 2 × 100 = 200 DA. 180 < 200.",
      "نحتاج مجموعتين من 500 غ: 2 × 100 = 200 دج. 180 < 200.",
      "You need two 500 g packs: 2 × 100 = 200 DA. 180 < 200."
    ),
  },
  {
    options: [
      mt("750 g : 150 DA", "750 غ: 150 دج", "750 g: 150 DA"),
      mt("1 kg : 180 DA", "1 كغ: 180 دج", "1 kg: 180 DA"),
    ],
    correct: 1,
    prompt: mt(
      "On peut acheter au poids au même tarif. Quelle offre a le plus petit prix par kilogramme ?",
      "يمكن الشراء بالوزن بالتعريفة نفسها. أيّ عرض أقل سعراً لكل كيلوغرام؟",
      "You may buy any weight at the same rate. Which offer has the lower price per kilogram?"
    ),
    explain: mt(
      "150 ÷ 0,75 = 200 DA/kg ; l’autre offre est à 180 DA/kg. Compare la même masse.",
      "150 ÷ 0.75 = 200 دج/كغ؛ والعرض الآخر 180 دج/كغ. نقارن الكتلة نفسها.",
      "150 ÷ 0.75 = 200 DA/kg; the other offer is 180 DA/kg. Compare the same mass."
    ),
  },
];
const payPrompts = [
  mt(
    "Dans notre jeu de marchand, la commande coûte 4 jetons. Pose exactement 4 jetons.",
    "في لعبة السوق، ثمن الطلب 4 رموز. ضع 4 رموز بالضبط.",
    "In our pretend shop, the order costs 4 tokens. Put down exactly 4 tokens."
  ),
  mt(
    "Le panier coûte 20 DA. Compose le montant exact avec les pièces du jeu.",
    "ثمن السلة 20 دج. كوّن المبلغ بالضبط بقطع اللعبة.",
    "The basket costs 20 DA. Make the exact amount with play coins."
  ),
  mt(
    "La commande coûte 35 DA. Compose le montant exact.",
    "ثمن الطلب 35 دج. كوّن المبلغ بالضبط.",
    "The order costs 35 DA. Make the exact amount."
  ),
  mt(
    "Deux lots coûtent 30 DA chacun et un sac coûte 15 DA. Compose le montant total.",
    "ثمن كل مجموعة من مجموعتين 30 دج وثمن كيس 15 دج. كوّن المبلغ الإجمالي.",
    "Two packs cost 30 DA each and a bag costs 15 DA. Make the total amount."
  ),
  mt(
    "Trois lots coûtent 40 DA chacun et un sac coûte 25 DA. Compose le total.",
    "ثمن كل مجموعة من ثلاث مجموعات 40 دج وثمن كيس 25 دج. كوّن المجموع.",
    "Three packs cost 40 DA each and a bag costs 25 DA. Make the total."
  ),
  mt(
    "Le prix de 240 DA baisse de 25 %. Compose le nouveau prix, pas la réduction.",
    "ينخفض سعر 240 دج بنسبة 25 %. كوّن السعر الجديد لا قيمة التخفيض.",
    "A price of 240 DA is reduced by 25%. Make the new price, not the discount."
  ),
];
const payExplain = [
  mt(
    "4 jetons de valeur 1 font 4.",
    "4 رموز بقيمة 1 تعطينا 4.",
    "Four tokens worth 1 make 4."
  ),
  mt(
    "10 + 10 = 20 DA. D’autres combinaisons sont possibles.",
    "10 + 10 = 20 دج. توجد تركيبات أخرى.",
    "10 + 10 = 20 DA. Other combinations are possible."
  ),
  mt("20 + 10 + 5 = 35 DA.", "20 + 10 + 5 = 35 دج.", "20 + 10 + 5 = 35 DA."),
  mt("2 × 30 + 15 = 75 DA.", "2 × 30 + 15 = 75 دج.", "2 × 30 + 15 = 75 DA."),
  mt("3 × 40 + 25 = 145 DA.", "3 × 40 + 25 = 145 دج.", "3 × 40 + 25 = 145 DA."),
  mt(
    "25 % de 240 = 60 DA de réduction ; 240 − 60 = 180 DA à payer.",
    "25 % من 240 = 60 دج تخفيضاً؛ 240 − 60 = 180 دج للدفع.",
    "25% of 240 = 60 DA off; 240 − 60 = 180 DA to pay."
  ),
];
const readings = [
  {
    passage: mt(
      "Lina apporte une liste. Elle cherche des pommes. Elle garde son panier pour les porter.",
      "تُحْضِرُ لِينَا قَائِمَةً. تَبْحَثُ عَنِ التُّفَّاحِ. تَحْمِلُهُ فِي سَلَّتِهَا.",
      "Lina brings a list. She looks for apples. She keeps her basket to carry them."
    ),
    prompt: mt(
      "Que cherche Lina ?",
      "عَمَّ تَبْحَثُ لِينَا؟",
      "What is Lina looking for?"
    ),
    options: [
      mt("Du pain", "خُبْز", "Bread"),
      mt("Des pommes", "تُفَّاح", "Apples"),
      mt("Des livres", "كُتُب", "Books"),
    ],
    correct: 1,
  },
  {
    passage: mt(
      "Sami a du pain et des pommes. Sa liste demande aussi des carottes. Il regarde son panier avant de payer.",
      "عِنْدَ سَامِي خُبْزٌ وَتُفَّاحٌ. فِي قَائِمَتِهِ جَزَرٌ أَيْضاً. يَنْظُرُ فِي سَلَّتِهِ قَبْلَ الدَّفْعِ.",
      "Sami has bread and apples. His list also asks for carrots. He checks his basket before paying."
    ),
    prompt: mt(
      "Que manque-t-il dans son panier ?",
      "مَاذَا يَنْقُصُ سَلَّتَهُ؟",
      "What is missing from his basket?"
    ),
    options: [
      mt("Du pain", "خُبْز", "Bread"),
      mt("Des pommes", "تُفَّاح", "Apples"),
      mt("Des carottes", "جَزَر", "Carrots"),
    ],
    correct: 2,
  },
  {
    passage: mt(
      "Nour prépare le goûter pour six enfants. Elle choisit une pomme par enfant. Deux pommes sont déjà dans le panier. Elle ajoute les pommes manquantes.",
      "تُحَضِّرُ نُورُ وَجْبَةً لِسِتَّةِ أَطْفَالٍ. تَخْتَارُ تُفَّاحَةً لِكُلِّ طِفْلٍ. فِي السَّلَّةِ تُفَّاحَتَانِ. تُضِيفُ مَا يَنْقُصُ.",
      "Nour prepares a snack for six children. She chooses one apple per child. Two apples are already in the basket. She adds the missing apples."
    ),
    prompt: mt(
      "Combien de pommes doit-elle ajouter ?",
      "كَمْ تُفَّاحَةً تُضِيفُ؟",
      "How many apples must she add?"
    ),
    options: [mt("4", "4", "4"), mt("6", "6", "6"), mt("8", "8", "8")],
    correct: 0,
  },
  {
    passage: mt(
      "Le reçu indique deux lots à 30 DA et un sac à 15 DA. Le vendeur demande 85 DA. Lina recalcule avant de payer.",
      "في الوصل مجموعتان بسعر 30 دج لكل مجموعة وكيس بـ15 دج. يطلب البائع 85 دج. تعيد لينا الحساب قبل الدفع.",
      "The receipt lists two packs at 30 DA each and a bag at 15 DA. The seller asks for 85 DA. Lina recalculates before paying."
    ),
    prompt: mt(
      "Quel total correspond au reçu ?",
      "أيّ مجموع يطابق الوصل؟",
      "Which total matches the receipt?"
    ),
    options: [
      mt("85 DA", "85 دج", "85 DA"),
      mt("75 DA", "75 دج", "75 DA"),
      mt("45 DA", "45 دج", "45 DA"),
    ],
    correct: 1,
  },
  {
    passage: mt(
      "La commande de Didou coûte 145 DA. Il donne 200 DA. Le vendeur prépare la monnaie. Didou vérifie en additionnant le prix et la monnaie.",
      "ثمن طلب ديدو 145 دج. يدفع 200 دج. يحضّر البائع الباقي. يتحقق ديدو بجمع الثمن والباقي.",
      "Didou’s order costs 145 DA. He gives 200 DA. The seller prepares the change. Didou checks by adding the price and the change."
    ),
    prompt: mt(
      "Quelle monnaie doit-il recevoir ?",
      "كم يجب أن يسترجع؟",
      "How much change should he receive?"
    ),
    options: [
      mt("45 DA", "45 دج", "45 DA"),
      mt("65 DA", "65 دج", "65 DA"),
      mt("55 DA", "55 دج", "55 DA"),
    ],
    correct: 2,
  },
  {
    passage: mt(
      "Les pommes coûtent 200 DA par kilogramme. Amine achète 750 g. La balance affiche 0,75 kg. Il veut vérifier le prix avant de payer.",
      "سعر التفاح 200 دج للكيلوغرام. يشتري أمين 750 غ. يعرض الميزان 0.75 كغ. يريد التحقق من الثمن قبل الدفع.",
      "Apples cost 200 DA per kilogram. Amine buys 750 g. The scale shows 0.75 kg. He wants to check the price before paying."
    ),
    prompt: mt(
      "Quel prix correspond à cette masse ?",
      "أيّ ثمن يطابق هذه الكتلة؟",
      "Which price matches this weight?"
    ),
    options: [
      mt("150 DA", "150 دج", "150 DA"),
      mt("200 DA", "200 دج", "200 DA"),
      mt("175 DA", "175 دج", "175 DA"),
    ],
    correct: 0,
  },
];
const shares = [
  [2, 2],
  [3, 3],
  [4, 4, 4],
  [6, 6, 6],
  [6, 6, 6, 6],
  [5, 5, 5],
];
const sharePrompts = [
  mt(
    "Partage 4 pommes entre 2 paniers : chacun doit en avoir autant.",
    "وزّع 4 تفاحات على سلتين بالتساوي.",
    "Share 4 apples equally between 2 baskets."
  ),
  mt(
    "Partage 6 pommes entre 2 paniers, en parts égales.",
    "وزّع 6 تفاحات على سلتين بالتساوي.",
    "Share 6 apples equally between 2 baskets."
  ),
  mt(
    "Partage 12 pommes entre 3 familles, en parts égales.",
    "وزّع 12 تفاحة على 3 عائلات بالتساوي.",
    "Share 12 apples equally between 3 families."
  ),
  mt(
    "Partage 18 pommes entre 3 familles, en parts égales.",
    "وزّع 18 تفاحة على 3 عائلات بالتساوي.",
    "Share 18 apples equally between 3 families."
  ),
  mt(
    "Partage 24 pommes entre 4 familles, en parts égales.",
    "وزّع 24 تفاحة على 4 عائلات بالتساوي.",
    "Share 24 apples equally between 4 families."
  ),
  mt(
    "Sur 20 pommes, 25 % ont déjà été donnés. Il reste 15 pommes : répartis-les également entre 3 familles.",
    "من 20 تفاحة تم التبرع بـ25 %. بقيت 15 تفاحة: وزّعها على 3 عائلات بالتساوي.",
    "Of 20 apples, 25% have already been donated. There are 15 left: share them equally between 3 families."
  ),
];
const packHints: MarketText[] = [
  mt(
    "Prépare une sorte à la fois. Compte les objets un à un.",
    "حضّر نوعاً واحداً في كل مرة وعدّ الأشياء واحداً واحداً.",
    "Pack one kind at a time. Count the objects one by one."
  ),
  mt(
    "Compte 4 pommes, puis 2 carottes. Vérifie chaque sorte séparément.",
    "عدّ 4 تفاحات ثم جزرتين. تحقق من كل نوع على حدة.",
    "Count 4 apples, then 2 carrots. Check each kind separately."
  ),
  mt(
    "Pour les pommes, fais 3 + 3. Compte ensuite les 3 carottes.",
    "للتفاح احسب 3 + 3 ثم عدّ الجزرات الثلاث.",
    "For the apples, work out 3 + 3. Then count the 3 carrots."
  ),
  mt(
    "Pommes : 4 + 4 + 4. Carottes : 3 + 3. Garde les deux calculs séparés.",
    "التفاح: 4 + 4 + 4. الجزر: 3 + 3. افصل الحسابين.",
    "Apples: 4 + 4 + 4. Carrots: 3 + 3. Keep the two calculations separate."
  ),
  mt(
    "La moitié : partage 18 en 2 groupes égaux. Le quart : partage 12 en 4 groupes égaux.",
    "للنصف اقسم 18 إلى مجموعتين متساويتين. للربع اقسم 12 إلى 4 مجموعات متساوية.",
    "For one half, split 18 into 2 equal groups. For one quarter, split 12 into 4 equal groups."
  ),
  mt(
    "Trois quarts : 20 ÷ 4 puis × 3. Et 25 % signifie un quart : 12 ÷ 4.",
    "لثلاثة أرباع احسب 20 ÷ 4 ثم × 3. و25 % تعني الربع: 12 ÷ 4.",
    "Three quarters: 20 ÷ 4, then × 3. And 25% means one quarter: 12 ÷ 4."
  ),
];
const compareHints: MarketText[] = [
  mt(
    "Compte chaque groupe séparément.",
    "عدّ كل مجموعة على حدة.",
    "Count each group separately."
  ),
  mt(
    "Compte chaque groupe séparément.",
    "عدّ كل مجموعة على حدة.",
    "Count each group separately."
  ),
  mt(
    "Compare 12 et 15 sur une ligne de nombres. Le prix le plus petit coûte moins cher.",
    "قارن 12 و15 على خط الأعداد. العدد الأصغر هو الثمن الأقل.",
    "Compare 12 and 15 on a number line. The smaller price costs less."
  ),
  mt(
    "Calcule séparément 3 × 20 et 2 × 35, puis compare les totaux.",
    "احسب 3 × 20 و2 × 35 كلّاً على حدة ثم قارن المجموعين.",
    "Work out 3 × 20 and 2 × 35 separately, then compare the totals."
  ),
  mt(
    "1 kg = 2 lots de 500 g. Calcule 2 × 100 avant de comparer avec 180.",
    "1 كغ = مجموعتان من 500 غ. احسب 2 × 100 ثم قارن مع 180.",
    "1 kg = two 500 g packs. Work out 2 × 100 before comparing with 180."
  ),
  mt(
    "750 g = 0,75 kg. Calcule 150 ÷ 0,75 pour trouver le prix d’un kilogramme, puis compare avec 180.",
    "750 غ = 0.75 كغ. احسب 150 ÷ 0.75 لإيجاد سعر الكيلوغرام ثم قارن مع 180.",
    "750 g = 0.75 kg. Work out 150 ÷ 0.75 to find the price per kilogram, then compare with 180."
  ),
];

export const MARKET_PLANS = Object.fromEntries(
  bands.map((band, i) => {
    const base = (
      n: number,
      title: MarketText,
      prompt: MarketText,
      hint: MarketText,
      explain: MarketText
    ): Base => ({
      id: "market-mission:" + band + ":" + n,
      title,
      prompt,
      hint,
      explain,
    });
    const c = compares[i],
      r = readings[i],
      target = shares[i];
    const tasks: MarketTask[] = [
      {
        ...base(
          0,
          mt("Le panier de la liste", "سلة القائمة", "The shopping list"),
          packPrompts[i],
          packHints[i],
          mt(
            "Le panier contient " +
              amounts[i][0] +
              " pommes et " +
              amounts[i][1] +
              " carottes : il correspond à la liste.",
            "تحتوي السلة على " +
              amounts[i][0] +
              " من التفاح و" +
              amounts[i][1] +
              " من الجزر: تطابق القائمة.",
            "The basket has " +
              amounts[i][0] +
              " apples and " +
              amounts[i][1] +
              " carrots: it matches the list."
          )
        ),
        kind: "pack",
        targets: [...amounts[i]],
      },
      {
        ...base(
          1,
          mt(
            "Je compare avant de choisir",
            "أقارن قبل الاختيار",
            "Compare before choosing"
          ),
          c.prompt,
          compareHints[i],
          c.explain
        ),
        kind: "compare",
        options: c.options,
        correct: c.correct,
      },
      {
        ...base(
          2,
          mt("Le juste montant", "المبلغ الصحيح", "The exact amount"),
          payPrompts[i],
          i === 5
            ? mt(
                "Cherche d’abord le quart de 240, puis retire-le du prix.",
                "احسب ربع 240 ثم اطرحه من الثمن.",
                "First find one quarter of 240, then subtract it from the price."
              )
            : mt(
                "Additionne les valeurs. Tu peux retirer la dernière pièce si tu dépasses.",
                "اجمع القيم. يمكنك حذف آخر قطعة إذا تجاوزت المبلغ.",
                "Add the values. You can remove the last coin if you go over."
              ),
          payExplain[i]
        ),
        kind: "pay",
        total: totals[i],
        coins: coins[i],
        tokens: i === 0,
      },
      {
        ...base(
          3,
          mt("Je vérifie mon achat", "أتحقق من الشراء", "Check the purchase"),
          r.prompt,
          mt(
            "Relis les informations utiles du récit.",
            "أعد قراءة المعلومات المفيدة في القصة.",
            "Read the useful details in the story again."
          ),
          i < 2
            ? mt(
                "La réponse est donnée par la liste du récit.",
                "تجد الإجابة في قائمة القصة.",
                "The story’s list gives the answer."
              )
            : i === 2
            ? mt(
                "6 − 2 = 4 pommes à ajouter.",
                "6 − 2 = 4 تفاحات نضيفها.",
                "6 − 2 = 4 apples to add."
              )
            : i === 3
            ? payExplain[3]
            : i === 4
            ? mt(
                "200 − 145 = 55 ; et 145 + 55 = 200.",
                "200 − 145 = 55 و145 + 55 = 200.",
                "200 − 145 = 55; and 145 + 55 = 200."
              )
            : mt(
                "750 g = 0,75 kg ; 200 × 0,75 = 150 DA.",
                "750 غ = 0.75 كغ و200 × 0.75 = 150 دج.",
                "750 g = 0.75 kg; 200 × 0.75 = 150 DA."
              )
        ),
        kind: "read",
        ...r,
      },
      {
        ...base(
          4,
          mt("Un partage équitable", "تقاسم عادل", "A fair share"),
          sharePrompts[i],
          mt(
            "Distribue une pomme dans chaque panier, puis recommence.",
            "ضع تفاحة في كل سلة ثم كرّر.",
            "Put one apple in each basket, then repeat."
          ),
          mt(
            target.reduce((a, b) => a + b, 0) +
              " ÷ " +
              target.length +
              " = " +
              target[0] +
              ". Chaque panier reçoit la même quantité.",
            "" +
              target.reduce((a, b) => a + b, 0) +
              " ÷ " +
              target.length +
              " = " +
              target[0] +
              ". تحصل كل سلة على الكمية نفسها.",
            "" +
              target.reduce((a, b) => a + b, 0) +
              " ÷ " +
              target.length +
              " = " +
              target[0] +
              ". Each basket gets the same amount."
          )
        ),
        kind: "share",
        total: target.reduce((a, b) => a + b, 0),
        targets: target,
      },
      {
        ...base(
          5,
          mt("À toi de raconter", "دورك لتحكي", "Your turn to explain"),
          mt(
            "Explique une de tes décisions à un adulte.",
            "اشرح أحد اختياراتك لشخص بالغ.",
            "Explain one of your choices to a grown-up."
          ),
          mt(
            "Montre les objets, puis explique comment tu as vérifié.",
            "أرِ الأشياء ثم اشرح كيف تحققت.",
            "Show the objects, then explain how you checked."
          ),
          mt(
            "L’adulte note ce qui a été expliqué avec ou sans aide.",
            "يسجل البالغ ما شُرح بمساعدة أو دونها.",
            "The grown-up records what was explained with or without help."
          )
        ),
        kind: "observe",
        action:
          i < 2
            ? mt(
                "Avec 4 gros cubes et 2 assiettes, refais un partage égal. Explique comment tu sais que les deux groupes sont égaux.",
                "باستعمال 4 مكعبات كبيرة وصحنين، أعد التقاسم بالتساوي واشرح كيف تحققت.",
                "Use 4 large blocks and 2 plates to make equal groups. Explain how you checked."
              )
            : mt(
                "Invente une petite commande avec des objets de la maison. Explique le total ou le partage, puis montre une façon de vérifier. Aucun achat réel nécessaire.",
                "ابتكر طلباً صغيراً بأشياء المنزل. اشرح المجموع أو التقاسم ثم بيّن طريقة للتحقق. لا حاجة لشراء حقيقي.",
                "Make up a small order with things at home. Explain the total or the sharing, then show a way to check. No real purchase needed."
              ),
      },
    ];
    return [band, { band, tasks }];
  })
) as Record<MarketBand, { band: MarketBand; tasks: MarketTask[] }>;
export const marketSucceeded = (
  r: { outcome: string; completedAt?: string } | undefined
) =>
  Boolean(r?.completedAt) ||
  r?.outcome === "independent" ||
  r?.outcome === "helped";
