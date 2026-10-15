import type { PrimaryGrade } from "../../types";
import type {
  Bilingual,
  FamilyDomain,
  FamilyModule,
  FamilyTask,
} from "./familyContent";
const b = (fr: string, ar: string): Bilingual => ({ fr, ar });
interface Item {
  prompt: Bilingual;
  correct: Bilingual;
  wrong: Bilingual[];
  hint: Bilingual;
  method: Bilingual;
  accepted?: string[];
}
const q = (
  prompt: Bilingual,
  correct: Bilingual,
  wrong: Bilingual[],
  hint: Bilingual,
  method: Bilingual
): Item => ({ prompt, correct, wrong, hint, method });
const n = (
  prompt: Bilingual,
  answer: number,
  hint: Bilingual,
  method: Bilingual
): Item => ({
  prompt,
  correct: b(String(answer), String(answer)),
  wrong: [],
  hint,
  method,
  accepted: [String(answer)],
});
const mono = (value: string) => b(value, value);
const lq = (
  prompt: string,
  correct: string,
  wrong: string[],
  hint: string,
  method: string
) => q(mono(prompt), mono(correct), wrong.map(mono), mono(hint), mono(method));
const modules: FamilyModule[] = [];
function add(
  grade: PrimaryGrade,
  slug: string,
  domain: FamilyDomain,
  title: Bilingual,
  objective: Bilingual,
  items: Item[],
  language?: "ar" | "fr" | "en",
  text?: Bilingual
) {
  const id = "explore:" + grade + ":" + slug;
  modules.push({
    id,
    grade,
    domain,
    title,
    objective,
    competenceIds: [],
    language,
    text,
    tasks: items.map((item, i): FamilyTask => {
      const taskId = id + ":" + i;
      if (item.accepted)
        return {
          id: taskId,
          prompt: item.prompt,
          answer: item.correct,
          hint: item.hint,
          method: item.method,
          accepted: item.accepted,
          language,
        };
      if (!item.wrong.length)
        return {
          id: taskId,
          prompt: item.prompt,
          answer: item.correct,
          hint: item.hint,
          method: item.method,
          language,
        };
      const candidates = [item.correct, ...item.wrong],
        shift = (i + Number(grade[0])) % candidates.length;
      const options = candidates.map((_, j) => ({
        id: String(j + 1),
        label: candidates[(j + shift) % candidates.length],
      }));
      return {
        id: taskId,
        prompt: item.prompt,
        answer: item.correct,
        hint: item.hint,
        method: item.method,
        language,
        options,
        accepted: [
          String(((candidates.length - shift) % candidates.length) + 1),
        ],
      };
    }),
  });
}
const math: Record<PrimaryGrade, Item[]> = {
  "1AP": [
    n(
      b(
        "Il y a 7 crayons. Tu en donnes 2. Combien en reste-t-il ?",
        "عندك 7 أقلام. تعطي قلمين. كم بقي؟"
      ),
      5,
      b("Enlève deux objets parmi sept.", "احذف شيئين من سبعة."),
      b(
        "7 − 2 = 5 crayons. Vérifie : 5 + 2 = 7.",
        "7 − 2 = 5 أقلام. نتحقق: 5 + 2 = 7."
      )
    ),
    n(
      b(
        "Lina a 4 cubes et Sami lui donne 3 cubes. Combien a-t-elle de cubes ?",
        "عند لينا 4 مكعبات ويعطيها سامي 3 مكعبات. كم صار عندها؟"
      ),
      7,
      b("Réunis les deux groupes.", "اجمع المجموعتين."),
      b("4 + 3 = 7 cubes.", "4 + 3 = 7 مكعبات.")
    ),
    n(
      b(
        "Une boîte contient 10 places. 6 sont occupées. Combien de places sont libres ?",
        "في علبة 10 خانات، منها 6 مشغولة. كم خانة فارغة؟"
      ),
      4,
      b(
        "Cherche combien ajouter à 6 pour arriver à 10.",
        "ابحث عما تضيفه إلى 6 للوصول إلى 10."
      ),
      b("10 − 6 = 4 places ; 6 + 4 = 10.", "10 − 6 = 4 خانات و6 + 4 = 10.")
    ),
    n(
      b(
        "Nour a 8 images. Amine en a 5. Combien Nour a-t-elle d’images de plus ?",
        "عند نور 8 صور وعند أمين 5. بكم تزيد صور نور؟"
      ),
      3,
      b(
        "Associe une image de chaque enfant. Compte celles qui restent.",
        "قابل صورة بصورة ثم عدّ الصور الزائدة."
      ),
      b(
        "8 − 5 = 3 images de plus. On compare, on ne réunit pas les collections.",
        "8 − 5 = 3 صور إضافية. نقارن المجموعتين ولا نجمعهما."
      )
    ),
  ],
  "2AP": [
    n(
      b(
        "Un cahier coûte 25 DA et un crayon 15 DA. Quel est le total ?",
        "ثمن كراس 25 دج وقلم 15 دج. ما المجموع؟"
      ),
      40,
      b(
        "Additionne les unités, puis les dizaines.",
        "اجمع الوحدات ثم العشرات."
      ),
      b(
        "25 + 15 = 40 DA. 5 + 5 = 10 unités, soit une dizaine.",
        "25 + 15 = 40 دج. 5 + 5 = 10 وحدات أي عشرة واحدة."
      )
    ),
    n(
      b(
        "Tu paies 40 DA avec 50 DA. Combien récupères-tu ?",
        "تدفع ثمن 40 دج بقطعة 50 دج. كم تسترجع؟"
      ),
      10,
      b("Complète 40 pour arriver à 50.", "أكمل 40 للوصول إلى 50."),
      b(
        "50 − 40 = 10 DA. Vérifie : 40 + 10 = 50.",
        "50 − 40 = 10 دج. نتحقق: 40 + 10 = 50."
      )
    ),
    n(
      b(
        "Trois boîtes contiennent chacune 4 billes. Combien de billes en tout ?",
        "في كل علبة من 3 علب توجد 4 كرات. كم كرة في المجموع؟"
      ),
      12,
      b("Dessine trois groupes de quatre.", "ارسم ثلاث مجموعات من أربع."),
      b("4 + 4 + 4 = 12 billes.", "4 + 4 + 4 = 12 كرة.")
    ),
    n(
      b(
        "Un ruban mesure 80 cm. On utilise 30 cm. Quelle longueur reste, en cm ?",
        "طول شريط 80 سم. نستعمل 30 سم. كم بقي بالسنتيمتر؟"
      ),
      50,
      b(
        "Les deux longueurs sont déjà dans la même unité.",
        "الطولان بالوحدة نفسها."
      ),
      b("80 − 30 = 50 cm.", "80 − 30 = 50 سم.")
    ),
  ],
  "3AP": [
    n(
      b(
        "4 boîtes contiennent chacune 6 crayons. Combien de crayons ?",
        "في كل علبة من 4 علب توجد 6 أقلام. كم قلماً؟"
      ),
      24,
      b("Calcule quatre fois six.", "احسب أربع مرات ستة."),
      b("4 × 6 = 24 crayons.", "4 × 6 = 24 قلماً.")
    ),
    n(
      b(
        "On partage 24 crayons également entre 3 groupes. Combien par groupe ?",
        "نوزع 24 قلماً بالتساوي على 3 مجموعات. كم قلماً لكل مجموعة؟"
      ),
      8,
      b(
        "Cherche le nombre qui, multiplié par 3, donne 24.",
        "ابحث عن عدد نضربه في 3 فنحصل على 24."
      ),
      b("24 ÷ 3 = 8 ; 3 × 8 = 24.", "24 ÷ 3 = 8 و3 × 8 = 24.")
    ),
    n(
      b(
        "Une séance commence à 9 h 10 et dure 25 minutes. À quelle minute de 9 h se termine-t-elle ? Réponds par le nombre de minutes.",
        "تبدأ جلسة في 9 و10 دقائق وتدوم 25 دقيقة. عند أي دقيقة من الساعة التاسعة تنتهي؟ اكتب عدد الدقائق."
      ),
      35,
      b(
        "Ajoute la durée aux minutes de départ.",
        "أضف المدة إلى دقائق البداية."
      ),
      b(
        "10 + 25 = 35 : la séance finit à 9 h 35.",
        "10 + 25 = 35: تنتهي الجلسة في 9 و35 دقيقة."
      )
    ),
    n(
      b(
        "Un sac contient 1 kg de lentilles. On prend 250 g. Combien reste-t-il en grammes ?",
        "في كيس 1 كغ من العدس. نأخذ 250 غ. كم بقي بالغرام؟"
      ),
      750,
      b("1 kg = 1 000 g.", "1 كغ = 1000 غ."),
      b("1 000 − 250 = 750 g.", "1000 − 250 = 750 غ.")
    ),
  ],
  "4AP": [
    n(
      b(
        "Une classe a 28 élèves. Un quart va à la bibliothèque. Combien d’élèves ?",
        "في قسم 28 تلميذاً. يذهب ربعهم إلى المكتبة. كم تلميذاً؟"
      ),
      7,
      b(
        "Partage 28 en quatre groupes égaux.",
        "اقسم 28 إلى أربع مجموعات متساوية."
      ),
      b("28 ÷ 4 = 7 élèves.", "28 ÷ 4 = 7 تلاميذ.")
    ),
    n(
      b(
        "Un rectangle mesure 8 cm sur 5 cm. Quel est son périmètre en cm ?",
        "طول مستطيل 8 سم وعرضه 5 سم. ما محيطه بالسنتيمتر؟"
      ),
      26,
      b(
        "Additionne les quatre côtés, pas la surface.",
        "اجمع الأضلاع الأربعة لا المساحة."
      ),
      b(
        "8 + 5 + 8 + 5 = 26 cm, ou 2 × (8 + 5).",
        "8 + 5 + 8 + 5 = 26 سم أو2 × (8 + 5)."
      )
    ),
    n(
      b(
        "Un trajet de 180 km est partagé en 3 étapes de même longueur. Quelle longueur par étape, en km ?",
        "نقسم مسافة 180 كم إلى 3 مراحل متساوية. ما طول كل مرحلة بالكيلومتر؟"
      ),
      60,
      b(
        "Vérifie en multipliant le résultat par trois.",
        "تحقق بضرب النتيجة في ثلاثة."
      ),
      b("180 ÷ 3 = 60 km ; 3 × 60 = 180.", "180 ÷ 3 = 60 كم و3 × 60 = 180.")
    ),
    n(
      b(
        "4 livres coûtent chacun 125 DA. Quel est le total ?",
        "ثمن كل كتاب من 4 كتب هو 125 دج. ما المجموع؟"
      ),
      500,
      b("Double 125, puis double encore.", "ضاعف 125 ثم ضاعف النتيجة."),
      b("4 × 125 = 500 DA.", "4 × 125 = 500 دج.")
    ),
  ],
  "5AP": [
    n(
      b(
        "Un article coûte 800 DA. La réduction est de 15 %. Quel est le nouveau prix ?",
        "ثمن سلعة 800 دج والتخفيض 15 %. ما السعر الجديد؟"
      ),
      680,
      b(
        "Calcule 10 % puis 5 %, additionne les réductions et soustrais-les.",
        "احسب 10 % ثم5 % واجمع التخفيضين ثم اطرحهما."
      ),
      b(
        "10 % = 80 DA ; 5 % = 40 DA ; 800 − (80 + 40) = 680 DA.",
        "10 % = 80 دج و5 % = 40 دج؛ 800 − (80 + 40) = 680 دج."
      )
    ),
    n(
      b(
        "3 cahiers coûtent 180 DA au total. Au même prix unitaire, combien coûtent 5 cahiers ?",
        "ثمن 3 كراريس معاً 180 دج. بالسعر الفردي نفسه، كم ثمن 5 كراريس؟"
      ),
      300,
      b(
        "Trouve le prix d’un cahier avant celui de cinq.",
        "احسب ثمن كراس واحد ثم ثمن خمسة."
      ),
      b(
        "180 ÷ 3 = 60 DA ; 5 × 60 = 300 DA.",
        "180 ÷ 3 = 60 دج و5 × 60 = 300 دج."
      )
    ),
    n(
      b(
        "Un rectangle mesure 12 m sur 7 m. Quelle est son aire en m² ?",
        "طول مستطيل 12 م وعرضه 7 م. ما مساحته بالمتر المربع؟"
      ),
      84,
      b(
        "L’aire compte les carrés unités : longueur × largeur.",
        "المساحة تعد المربعات الوحدية: الطول × العرض."
      ),
      b(
        "12 × 7 = 84 m². Ce n’est pas le périmètre.",
        "12 × 7 = 84 م². هذه مساحة وليست محيطاً."
      )
    ),
    n(
      b(
        "Une bouteille contient 1,5 L. On verse 350 mL. Combien reste-t-il en mL ?",
        "في قارورة 1.5 لتر. نفرغ منها 350 مل. كم بقي بالملليلتر؟"
      ),
      1150,
      b(
        "Convertis tout en millilitres avant de soustraire.",
        "حوّل الكميات إلى الملليلتر قبل الطرح."
      ),
      b(
        "1,5 L = 1 500 mL ; 1 500 − 350 = 1 150 mL.",
        "1.5 لتر = 1500 مل؛ 1500 − 350 = 1150 مل."
      )
    ),
  ],
};
for (const grade of Object.keys(math) as PrimaryGrade[])
  add(
    grade,
    "daily-maths",
    "operations",
    b("Mes problèmes du quotidien", "مسائل من حياتي اليومية"),
    b(
      "Choisir une opération et vérifier avec une autre représentation.",
      "أختار العملية وأتحقق بتمثيل آخر."
    ),
    math[grade]
  );
const arStories: Record<
  PrimaryGrade,
  [string, [string, string, string[], string][]]
> = {
  "1AP": [
    "فِي الصَّبَاحِ، حَمَلَتْ لِينَا كِتَابًا أَزْرَقَ. جَلَسَتْ قُرْبَ نُورٍ. قَرَأَتْ لَهَا قِصَّةً عَنِ الْقِطَّةِ.",
    [
      [
        "مَنْ حَمَلَ الْكِتَابَ؟",
        "لِينَا",
        ["نُورٌ", "سَامِي"],
        "يَذْكُرُ النَّصُّ أَنَّ لِينَا حَمَلَتِ الْكِتَابَ.",
      ],
      [
        "مَا لَوْنُ الْكِتَابِ؟",
        "أَزْرَقُ",
        ["أَحْمَرُ", "أَخْضَرُ"],
        "نَقْرَأُ «كِتَابًا أَزْرَقَ».",
      ],
      [
        "مَتَى حَمَلَتْهُ؟",
        "فِي الصَّبَاحِ",
        ["فِي اللَّيْلِ", "فِي الْمَسَاءِ"],
        "تَبْدَأُ الْقِصَّةُ بِعِبَارَةِ «فِي الصَّبَاحِ».",
      ],
      [
        "عَنْ أَيِّ حَيَوَانٍ تَتَحَدَّثُ الْقِصَّةُ؟",
        "عَنِ الْقِطَّةِ",
        ["عَنِ الْكَلْبِ", "عَنِ السَّمَكَةِ"],
        "تَذْكُرُ الْجُمْلَةُ الأَخِيرَةُ الْقِطَّةَ.",
      ],
    ],
  ],
  "2AP": [
    "زَرَعَ سَامِي بَذْرَةً فِي أَصِيصٍ. وَضَعَ الأَصِيصَ قُرْبَ النَّافِذَةِ. كُلَّ صَبَاحٍ، يَنْظُرُ إِلَى التُّرْبَةِ. بَعْدَ أَيَّامٍ، ظَهَرَتْ نَبْتَةٌ صَغِيرَةٌ. رَسَمَهَا فِي دَفْتَرِهِ.",
    [
      [
        "أَيْنَ زَرَعَ سَامِي الْبَذْرَةَ؟",
        "فِي أَصِيصٍ",
        ["فِي كِتَابٍ", "فِي حَقِيبَةٍ"],
        "الْجُمْلَةُ الأُولَى تَذْكُرُ الأَصِيصَ.",
      ],
      [
        "مَتَى يُرَاقِبُ سَامِي التُّرْبَةَ؟",
        "كُلَّ صَبَاحٍ",
        ["كُلَّ لَيْلَةٍ", "مَرَّةً فِي الشَّهْرِ"],
        "نَقْرَأُ «كُلَّ صَبَاحٍ».",
      ],
      [
        "هَلْ ظَهَرَتِ النَّبْتَةُ فَوْرًا؟",
        "لَا، بَعْدَ أَيَّامٍ",
        ["نَعَمْ، فِي اللَّحْظَةِ نَفْسِهَا", "لَمْ تَظْهَرْ أَبَدًا"],
        "الْعِبَارَةُ «بَعْدَ أَيَّامٍ» تَدُلُّ عَلَى مُرُورِ الْوَقْتِ.",
      ],
      [
        "مَاذَا فَعَلَ سَامِي فِي النِّهَايَةِ؟",
        "رَسَمَ النَّبْتَةَ",
        ["أَخْفَى الأَصِيصَ", "مَزَّقَ الدَّفْتَرَ"],
        "رَسْمُ النَّبْتَةِ هُوَ الْحَدَثُ الأَخِيرُ الْمَذْكُورُ.",
      ],
    ],
  ],
  "3AP": [
    "زَارَ تَلَامِيذُ الْقِسْمِ مَتْحَفًا. تَوَقَّفُوا أَمَامَ إِنَاءٍ فَخَّارِيٍّ قَدِيمٍ. قَرَأَتْ هُدَى الْبِطَاقَةَ الْمَوْضُوعَةَ قُرْبَهُ، ثُمَّ رَسَمَتْ شَكْلَهُ فِي دَفْتَرِهَا. شَرَحَ الدَّلِيلُ أَنَّ الْبِطَاقَةَ تُعَرِّفُ الزَّائِرَ بِالْقِطْعَةِ الْمَعْرُوضَةِ.",
    [
      [
        "إِلَى أَيْنَ ذَهَبَ التَّلَامِيذُ؟",
        "إِلَى مَتْحَفٍ",
        ["إِلَى الْمَلْعَبِ", "إِلَى الْمَطْبَخِ"],
        "الْجُمْلَةُ الأُولَى تَذْكُرُ الْمَتْحَفَ.",
      ],
      [
        "مَا الْقِطْعَةُ الَّتِي تَوَقَّفُوا أَمَامَهَا؟",
        "إِنَاءٌ فَخَّارِيٌّ قَدِيمٌ",
        ["كِتَابٌ جَدِيدٌ", "دَرَّاجَةٌ جَدِيدَةٌ"],
        "يَصِفُ النَّصُّ الإِنَاءَ وَمَادَّتَهُ.",
      ],
      [
        "مَاذَا فَعَلَتْ هُدَى بَعْدَ قِرَاءَةِ الْبِطَاقَةِ؟",
        "رَسَمَتْ شَكْلَ الإِنَاءِ",
        ["نَقَلَتِ الإِنَاءَ إِلَى بَيْتِهَا", "مَزَّقَتِ الْبِطَاقَةَ"],
        "كَلِمَةُ «ثُمَّ» تُرَتِّبُ الْحَدَثَيْنِ.",
      ],
      [
        "مَا فَائِدَةُ الْبِطَاقَةِ حَسَبَ الدَّلِيلِ؟",
        "تَعْرِيفُ الزَّائِرِ بِالْقِطْعَةِ",
        ["إِخْفَاءُ الْقِطْعَةِ", "تَغْيِيرُ شَكْلِ الإِنَاءِ"],
        "الْجُمْلَةُ الأَخِيرَةُ تُفَسِّرُ وَظِيفَةَ الْبِطَاقَةِ.",
      ],
    ],
  ],
  "4AP": [
    "أَعَدَّ فَرِيقُ الإِذَاعَةِ الْمَدْرَسِيَّةِ خَبَرًا عَنْ رِحْلَةٍ. وَجَدَ أَمِينُ مُلْصَقًا قَدِيمًا يَذْكُرُ مَوْعِدًا مُخْتَلِفًا. قَبْلَ بَثِّ الْخَبَرِ، رَاجَعَتِ الْمُعَلِّمَةُ بَرْنَامَجَ الأُسْبُوعِ الْحَالِيِّ مَعَ الإِدَارَةِ. صَحَّحَ التَّلَامِيذُ الْمَوْعِدَ وَذَكَرُوا تَارِيخَ الْبَرْنَامَجِ فِي خَبَرِهِمْ.",
    [
      [
        "مَا الَّذِي أَثَارَ الشَّكَّ فِي الْمَوْعِدِ؟",
        "مُلْصَقٌ قَدِيمٌ يَذْكُرُ مَوْعِدًا مُخْتَلِفًا",
        ["لَوْنُ الْمِيكْرُوفُونِ", "عَدَدُ الْكُرَاسِيِّ"],
        "الْمُلْصَقُ يَحْمِلُ مَعْلُومَةً مُخْتَلِفَةً وَهُوَ قَدِيمٌ.",
      ],
      [
        "مَتَى رَاجَعُوا الْمَعْلُومَةَ؟",
        "قَبْلَ بَثِّ الْخَبَرِ",
        ["بَعْدَ عَامٍ", "لَمْ يُرَاجِعُوهَا"],
        "النَّصُّ يَرْبِطُ التَّحَقُّقَ بِمَا قَبْلَ الْبَثِّ.",
      ],
      [
        "أَيُّ مَصْدَرٍ رَاجَعَتِ الْمُعَلِّمَةُ؟",
        "بَرْنَامَجَ الأُسْبُوعِ الْحَالِيِّ مَعَ الإِدَارَةِ",
        ["تَخْمِينَ أَمِينٍ فَقَطْ", "لَوْنَ الْمُلْصَقِ"],
        "الْمَصْدَرُ مُحَدَّدٌ وَحَدِيثٌ وَرُوجِعَ مَعَ الإِدَارَةِ.",
      ],
      [
        "لِمَاذَا يَهُمُّ ذِكْرُ تَارِيخِ الْبَرْنَامَجِ؟",
        "لِتَمْيِيزِ الْمَعْلُومَةِ الْحَالِيَّةِ مِنَ الْقَدِيمَةِ",
        [
          "لِإِثْبَاتِ أَنَّ كُلَّ مُلْصَقٍ خَاطِئٌ",
          "لِتَغْيِيرِ مَكَانِ الرِّحْلَةِ",
        ],
        "نَرْبِطُ التَّارِيخَ بِاخْتِلَافِ الْمَوْعِدَيْنِ دُونَ تَعْمِيمٍ عَلَى كُلِّ مُلْصَقٍ.",
      ],
    ],
  ],
  "5AP": [
    "أَحْصَى التَّلَامِيذُ الأَوْرَاقَ الْمُبَعْثَرَةَ فِي السَّاحَةِ ثَلَاثَةَ أَيَّامٍ. ثُمَّ وَضَعُوا سَلَّةً قُرْبَ رُكْنِ الْقِرَاءَةِ وَأَعَادُوا الإِحْصَاءَ ثَلَاثَةَ أَيَّامٍ أُخْرَى. انْخَفَضَ الْعَدَدُ، لَكِنَّ عَدَدَ الْحَاضِرِينَ كَانَ أَقَلَّ أَيْضًا. سَجَّلُوا الْمُلَاحَظَتَيْنِ، وَقَرَّرُوا تَكْرَارَ الْمُقَارَنَةِ فِي أَيَّامٍ يَتَقَارَبُ فِيهَا عَدَدُ الْحَاضِرِينَ.",
    [
      [
        "مَاذَا أَحْصَى التَّلَامِيذُ؟",
        "الأَوْرَاقَ الْمُبَعْثَرَةَ فِي السَّاحَةِ",
        ["عَدَدَ الْكُتُبِ فِي الْبُيُوتِ", "كُلَّ نَفَايَاتِ الْمَدِينَةِ"],
        "نُحَدِّدُ مَا قِيسَ فِعْلًا دُونَ تَوْسِيعِ نِطَاقِهِ.",
      ],
      [
        "مَا التَّغْيِيرُ الَّذِي أَجْرَوْهُ؟",
        "وَضَعُوا سَلَّةً قُرْبَ رُكْنِ الْقِرَاءَةِ",
        ["أَغْلَقُوا الْمَدْرَسَةَ", "أَلْغَوُا الْقِرَاءَةَ"],
        "هَذَا هُوَ التَّغْيِيرُ الْمَذْكُورُ بَعْدَ الإِحْصَاءِ الأَوَّلِ.",
      ],
      [
        "لِمَاذَا لَا يَكْفِي انْخِفَاضُ الأَوْرَاقِ لِنَنْسُبَهُ إِلَى السَّلَّةِ وَحْدَهَا؟",
        "لِأَنَّ عَدَدَ الْحَاضِرِينَ انْخَفَضَ أَيْضًا",
        [
          "لِأَنَّ الإِحْصَاءَ مُسْتَحِيلٌ دَائِمًا",
          "لِأَنَّ السِّلَالَ لَا تُسْتَعْمَلُ أَبَدًا",
        ],
        "تَغَيَّرَ عَامِلٌ آخَرُ قَدْ يُؤَثِّرُ فِي الْمُقَارَنَةِ.",
      ],
      [
        "مَا الْخُطْوَةُ التَّالِيَةُ الْمُقْتَرَحَةُ؟",
        "تَكْرَارُ الْمُقَارَنَةِ مَعَ تَقَارُبِ عَدَدِ الْحَاضِرِينَ",
        [
          "اخْتِلَاقُ أَعْدَادٍ أَكْبَرَ",
          "إِعْلَانُ نَتِيجَةٍ عَامَّةٍ نِهَائِيَّةٍ",
        ],
        "نُحَسِّنُ قَابِلِيَّةَ الْمُقَارَنَةِ قَبْلَ اسْتِنْتَاجِ السَّبَبِ.",
      ],
    ],
  ],
};
for (const [grade, [story, questions]] of Object.entries(arStories))
  add(
    grade as PrimaryGrade,
    "arabic-reading",
    "reading",
    b("Je lis et je cherche des preuves", "أقرأ وأبحث عن الدليل"),
    b(
      "Retrouver une information et distinguer texte et supposition.",
      "أستخرج معلومة وأميّز النص عن التخمين."
    ),
    questions.map(([p, c, w, why]) =>
      lq(
        p,
        c,
        w,
        "أَعِدْ قِرَاءَةَ الْجُمْلَةِ الَّتِي تَحْمِلُ الدَّلِيلَ.",
        why
      )
    ),
    "ar",
    mono(story)
  );
const frenchStories: Record<
  PrimaryGrade,
  [string, [string, string, string[], string][]]
> = {
  "1AP": [
    "Lina a un sac bleu. Dans le sac, il y a un livre et un crayon. Lina prête le livre à Sami.",
    [
      [
        "Qui a le sac ?",
        "Lina",
        ["Sami", "Nour"],
        "La première phrase nomme Lina.",
      ],
      [
        "De quelle couleur est le sac ?",
        "Bleu",
        ["Rouge", "Vert"],
        "Le texte dit « un sac bleu ».",
      ],
      [
        "Quel objet Lina prête-t-elle ?",
        "Le livre",
        ["Le sac", "Le crayon"],
        "Le dernier verbe est « prête » : son complément est « le livre ».",
      ],
      [
        "Qui reçoit le livre ?",
        "Sami",
        ["Nour", "Amine"],
        "Le texte dit « à Sami ».",
      ],
    ],
  ],
  "2AP": [
    "Sami cherche son crayon jaune. Il regarde sous la table, mais le crayon n’y est pas. Lina le trouve dans la boîte verte. Elle rend le crayon à Sami, qui la remercie.",
    [
      [
        "Que cherche Sami ?",
        "Son crayon jaune",
        ["Son livre rouge", "Son sac bleu"],
        "Le début donne l’objet et sa couleur.",
      ],
      [
        "Où le crayon est-il trouvé ?",
        "Dans la boîte verte",
        ["Sous la table", "Dans le cartable bleu"],
        "Le crayon n’est pas sous la table : Lina le trouve dans la boîte.",
      ],
      [
        "Qui trouve le crayon ?",
        "Lina",
        ["Sami", "Le maître"],
        "Le sujet de « trouve » est Lina.",
      ],
      [
        "Pourquoi Sami remercie-t-il Lina ?",
        "Elle lui a rendu son crayon",
        ["Elle a caché la boîte", "Elle a changé de table"],
        "Relie le remerciement à l’aide reçue, sans inventer un autre événement.",
      ],
    ],
  ],
  "3AP": [
    "La classe prépare une exposition de dessins. Amine écrit les titres sur des cartes. Nour range les dessins par thème : animaux, maisons et jardins. Les visiteurs utilisent les cartes pour retrouver les dessins qu’ils cherchent.",
    [
      [
        "Que prépare la classe ?",
        "Une exposition de dessins",
        ["Une course", "Un spectacle de danse"],
        "La première phrase donne le projet.",
      ],
      [
        "Quel est le rôle d’Amine ?",
        "Écrire les titres",
        ["Dessiner toutes les maisons", "Fermer la salle"],
        "Son action est explicitement donnée.",
      ],
      [
        "Comment Nour range-t-elle les dessins ?",
        "Par thème",
        ["Par prix", "Par nom du visiteur"],
        "Le texte donne trois thèmes.",
      ],
      [
        "À quoi servent les cartes ?",
        "À retrouver les dessins recherchés",
        ["À cacher les dessins", "À compter les fenêtres"],
        "La dernière phrase indique leur fonction.",
      ],
    ],
  ],
  "4AP": [
    "La bibliothèque reçoit douze livres. Quatre titres sont déjà présents. Les élèves proposent de prêter les exemplaires en double à une autre classe. Ils établissent une liste avant le prêt. Un mois plus tard, les livres reviennent et les deux classes échangent leurs avis de lecture.",
    [
      [
        "Pourquoi certains exemplaires peuvent-ils être prêtés ?",
        "Leurs titres sont déjà présents",
        ["Ils n’ont aucune page", "Tous les livres sont abîmés"],
        "Quatre titres sont déjà présents : il y a des doublons.",
      ],
      [
        "Que font les élèves avant le prêt ?",
        "Ils établissent une liste",
        ["Ils effacent les titres", "Ils rangent tous les livres dehors"],
        "L’ordre est donné par « avant le prêt ».",
      ],
      [
        "Que se passe-t-il un mois plus tard ?",
        "Les livres reviennent",
        ["La bibliothèque ferme", "Les élèves achètent douze livres"],
        "Le texte l’indique dans sa dernière phrase.",
      ],
      [
        "Quel bénéfice est explicitement mentionné ?",
        "Les classes échangent leurs avis de lecture",
        [
          "Les livres deviennent gratuits partout",
          "Chaque élève apprend toutes les histoires",
        ],
        "Choisis la conséquence réellement écrite, sans généraliser.",
      ],
    ],
  ],
  "5AP": [
    "Pour choisir un coin lecture, les élèves observent deux emplacements pendant trois matinées. Le premier est calme mais en plein soleil. Le second reste à l’ombre, près d’un passage bruyant. Ils proposent un troisième emplacement et prévoient de l’observer aussi. Ils n’ont donc pas encore choisi de lieu définitif.",
    [
      [
        "Qu’ont-ils observé ?",
        "Deux emplacements pendant trois matinées",
        ["Tous les lieux pendant un an", "Un seul lieu pendant une minute"],
        "La durée et le nombre de lieux sont précisés au début.",
      ],
      [
        "Quel est l’inconvénient du second emplacement ?",
        "Il est près d’un passage bruyant",
        ["Il est toujours au soleil", "Il n’a aucune ombre"],
        "Le second est ombragé, mais le passage est bruyant.",
      ],
      [
        "Pourquoi observer le troisième lieu ?",
        "Pour le comparer avec les mêmes critères",
        [
          "Pour éviter toute comparaison",
          "Parce que le choix est déjà définitif",
        ],
        "La comparaison doit porter sur le calme et l’ombre, critères déjà utilisés.",
      ],
      [
        "Quelle conclusion respecte le texte ?",
        "Le choix reste à faire après une nouvelle observation",
        [
          "Le troisième lieu est certainement parfait",
          "L’ombre suffit toujours à choisir un lieu",
        ],
        "La dernière phrase exclut un choix définitif.",
      ],
    ],
  ],
};
for (const [grade, [story, questions]] of Object.entries(frenchStories))
  add(
    grade as PrimaryGrade,
    "french-reading",
    "french",
    b("Lire une histoire en français", "أقرأ قصة بالفرنسية"),
    b(
      "Écouter, comprendre et justifier avec le texte ; découverte accompagnée en 1AP–2AP.",
      "أستمع وأفهم وأبرر بالنص؛ اكتشاف بمرافقة في 1AP و2AP."
    ),
    questions.map(([p, c, w, why]) =>
      lq(p, c, w, "Relis la phrase qui apporte la preuve.", why)
    ),
    "fr",
    mono(story)
  );
const logic: Record<PrimaryGrade, Item[]> = {
  "1AP": [
    q(
      b(
        "La suite est : rond, carré, rond, carré. Que vient-il ensuite ?",
        "السلسلة: دائرة، مربع، دائرة، مربع. ماذا يأتي بعدها؟"
      ),
      b("Un rond", "دائرة"),
      [b("Un carré", "مربع"), b("Un triangle", "مثلث")],
      b("Le groupe de deux formes se répète.", "تتكرر مجموعة من شكلين."),
      b(
        "Après chaque carré vient un rond dans cette règle.",
        "بعد كل مربع تأتي دائرة في هذه القاعدة."
      )
    ),
    q(
      b(
        "Nour est devant Sami. Qui est derrière Nour ?",
        "نور أمام سامي. من خلف نور؟"
      ),
      b("Sami", "سامي"),
      [b("Nour", "نور"), b("On ne peut jamais savoir", "لا يمكن معرفته أبداً")],
      b("Dessine les deux enfants en file.", "ارسم الطفلين في صف."),
      b(
        "Si Nour est devant Sami, Sami est derrière Nour.",
        "إذا كانت نور أمام سامي فسامي خلف نور."
      )
    ),
    q(
      b(
        "Dans la règle « un objet dans chaque boîte », où mettre le troisième objet ?",
        "حسب قاعدة «شيء واحد في كل علبة»، أين نضع الشيء الثالث؟"
      ),
      b("Dans une troisième boîte vide", "في علبة ثالثة فارغة"),
      [
        b("Dans la première boîte déjà pleine", "في العلبة الأولى المشغولة"),
        b("Dans les deux boîtes à la fois", "في العلبتين معاً"),
      ],
      b("Respecte un seul objet par boîte.", "احترم وجود شيء واحد في كل علبة."),
      b(
        "Une nouvelle boîte garde la correspondance un objet / une boîte.",
        "علبة جديدة تحافظ على المقابلة: شيء واحد لكل علبة."
      )
    ),
    q(
      b(
        "Quel objet appartient au groupe « fournitures pour écrire » ?",
        "أيّ شيء ينتمي إلى مجموعة «أدوات الكتابة»؟"
      ),
      b("Un crayon", "قلم"),
      [b("Une chaussure", "حذاء"), b("Une assiette", "صحن")],
      b("Pense à l’usage de l’objet.", "فكر في وظيفة الشيء."),
      b(
        "Le crayon permet d’écrire. La règle porte sur l’usage, pas la couleur.",
        "يسمح القلم بالكتابة. القاعدة تتعلق بالوظيفة لا اللون."
      )
    ),
  ],
  "2AP": [
    n(
      b(
        "La règle est « ajouter 5 ». Complète : 10, 15, 20, …",
        "القاعدة «أضف 5». أكمل: 10،15،20،…"
      ),
      25,
      b("Fais le même saut.", "كرر القفزة نفسها."),
      b("20 + 5 = 25.", "20 + 5 = 25.")
    ),
    q(
      b(
        "Quel nombre n’appartient pas au groupe des nombres pairs : 12, 15, 18 ?",
        "أيّ عدد لا ينتمي إلى الأعداد الزوجية: 12،15،18؟"
      ),
      b("15", "15"),
      [b("12", "12"), b("18", "18")],
      b(
        "Un nombre pair peut être partagé en deux groupes égaux sans reste.",
        "يمكن تقسيم العدد الزوجي إلى مجموعتين متساويتين دون باق."
      ),
      b(
        "12 et 18 se partagent en deux groupes entiers égaux ; 15 laisse un objet.",
        "يمكن تقاسم 12 و18 بالتساوي بين اثنين؛ يترك 15 شيئاً زائداً."
      )
    ),
    q(
      b(
        "Ali est avant Lina. Lina est avant Sami. Qui est le premier ?",
        "علي قبل لينا ولينا قبل سامي. من الأول؟"
      ),
      b("Ali", "علي"),
      [b("Lina", "لينا"), b("Sami", "سامي")],
      b("Écris les noms dans l’ordre donné.", "اكتب الأسماء بالترتيب المعطى."),
      b(
        "Ali → Lina → Sami. Ali est premier.",
        "الترتيب من الأول إلى الأخير: علي ثم لينا ثم سامي. علي هو الأول."
      )
    ),
    q(
      b(
        "Une figure a trois côtés droits. Laquelle est-ce ?",
        "شكل له ثلاثة أضلاع مستقيمة. ما هو؟"
      ),
      b("Un triangle", "مثلث"),
      [b("Un cercle", "دائرة"), b("Un carré", "مربع")],
      b("Compte les côtés, pas les couleurs.", "عدّ الأضلاع لا الألوان."),
      b("Un triangle a exactement trois côtés.", "للمثلث ثلاثة أضلاع بالضبط.")
    ),
  ],
  "3AP": [
    n(
      b(
        "La règle est « multiplier par 2 ». Complète : 3, 6, 12, …",
        "القاعدة «اضرب في2». أكمل:3،6،12،…"
      ),
      24,
      b("Double le dernier nombre.", "ضاعف العدد الأخير."),
      b("12 × 2 = 24.", "12 × 2 = 24.")
    ),
    q(
      b(
        "Trois boîtes ont des contenus différents : livre, ballon, crayon. La rouge contient le livre ; la bleue ne contient pas le ballon. Que contient la bleue ?",
        "ثلاث علب مختلفة المحتوى: كتاب وكرة وقلم. الحمراء فيها الكتاب والزرقاء ليس فيها الكرة. ماذا في الزرقاء؟"
      ),
      b("Le crayon", "القلم"),
      [b("Le livre", "الكتاب"), b("Le ballon", "الكرة")],
      b("Retire les deux possibilités exclues.", "احذف الاحتمالين المستبعدين."),
      b(
        "Le livre est dans la rouge ; le ballon est exclu de la bleue. Il reste le crayon.",
        "الكتاب في الحمراء والكرة مستبعدة من الزرقاء؛ يبقى القلم."
      )
    ),
    q(
      b(
        "Un carré est tourné sans le déformer. Combien garde-t-il de côtés ?",
        "نُدير مربعاً دون تشويهه. كم ضلعاً يحتفظ به؟"
      ),
      b("4", "4"),
      [b("3", "3"), b("5", "5")],
      b(
        "Tourner ne coupe ni n’ajoute de côté.",
        "التدوير لا يحذف ضلعاً ولا يضيفه."
      ),
      b(
        "La position change, mais le carré garde quatre côtés.",
        "يتغير الوضع لكن المربع يحتفظ بأربعة أضلاع."
      )
    ),
    n(
      b(
        "Deux équipes doivent avoir le même nombre de joueurs. Il y en a 5 dans chaque équipe. Combien de joueurs au total ?",
        "لفريقين العدد نفسه من اللاعبين. في كل فريق 5. كم لاعباً في المجموع؟"
      ),
      10,
      b("Deux groupes de cinq.", "مجموعتان من خمسة."),
      b("5 + 5 = 10 joueurs.", "5 + 5 = 10 لاعبين.")
    ),
  ],
  "4AP": [
    n(
      b(
        "La règle alterne « + 2, + 3 ». Complète : 10, 12, 15, 17, …",
        "القاعدة بالتناوب «+2 ثم+3». أكمل:10،12،15،17،…"
      ),
      20,
      b(
        "Le dernier saut était + 2. Quel saut suit ?",
        "القفزة الأخيرة +2. ما القفزة التالية؟"
      ),
      b(
        "17 + 3 = 20. La règle annoncée fixe le prochain saut.",
        "17 + 3 = 20. القاعدة المعلنة تحدد القفزة التالية."
      )
    ),
    q(
      b(
        "Les trois livres ont des couleurs différentes. Celui d’Ali est rouge. Celui de Nour n’est ni rouge ni bleu. Quelle est la couleur du livre de Nour parmi rouge, bleu et vert ?",
        "للكتب الثلاثة ألوان مختلفة: أحمر وأزرق وأخضر. كتاب علي أحمر وكتاب نور ليس أحمر ولا أزرق. ما لون كتاب نور؟"
      ),
      b("Vert", "أخضر"),
      [b("Rouge", "أحمر"), b("Bleu", "أزرق")],
      b("Élimine les couleurs interdites.", "استبعد اللونين الممنوعين."),
      b(
        "Parmi les trois couleurs, seul le vert reste possible.",
        "من الألوان الثلاثة يبقى الأخضر وحده ممكناً."
      )
    ),
    q(
      b(
        "Tous les carrés ont quatre côtés. Peut-on en conclure que toute figure à quatre côtés est un carré ?",
        "كل مربع له أربعة أضلاع. هل كل شكل له أربعة أضلاع مربع؟"
      ),
      b(
        "Non : un rectangle non carré a aussi quatre côtés",
        "لا؛ للمستطيل غير المربع أربعة أضلاع أيضاً"
      ),
      [
        b("Oui, toujours", "نعم دائماً"),
        b("Oui, si on le tourne", "نعم إذا أدرناه"),
      ],
      b("Cherche un contre-exemple.", "ابحث عن مثال مضاد."),
      b(
        "Avoir quatre côtés est nécessaire, mais ne suffit pas pour être un carré.",
        "وجود أربعة أضلاع ضروري لكنه غير كاف ليكون الشكل مربعاً."
      )
    ),
    n(
      b(
        "Une activité dure 20 minutes, puis une pause dure 10 minutes. Combien de minutes entre le début et la fin de la pause ?",
        "نشاط يدوم20 دقيقة ثم استراحة10 دقائق. كم دقيقة من البداية إلى نهاية الاستراحة؟"
      ),
      30,
      b(
        "Le temps total comprend l’activité et la pause.",
        "تشمل المدة النشاط والاستراحة."
      ),
      b("20 + 10 = 30 minutes.", "20 + 10 = 30 دقيقة.")
    ),
  ],
  "5AP": [
    n(
      b(
        "La règle est « × 2 puis + 1 » à chaque étape. Complète : 2, 5, 11, …",
        "القاعدة في كل خطوة «×2 ثم+1». أكمل:2،5،11،…"
      ),
      23,
      b(
        "Applique les deux opérations dans cet ordre.",
        "طبّق العمليتين بالترتيب."
      ),
      b("11 × 2 + 1 = 23.", "11 × 2 + 1 = 23.")
    ),
    q(
      b(
        "Tous les livres de l’étagère A sont des contes. Un livre est un conte. Doit-il forcément venir de A ?",
        "كل كتب الرف أ قصص. وجدنا كتاباً قصصياً. هل يجب أن يكون من الرف أ؟"
      ),
      b(
        "Non : d’autres étagères peuvent aussi avoir des contes",
        "لا؛ قد توجد قصص في رفوف أخرى"
      ),
      [
        b("Oui, obligatoirement", "نعم بالضرورة"),
        b("Aucun conte ne peut être dans A", "لا يمكن وجود قصة في أ"),
      ],
      b(
        "La règle dit ce qu’il y a dans A, pas où sont tous les contes.",
        "تحدد القاعدة محتوى أ لا مكان جميع القصص."
      ),
      b(
        "On ne peut pas inverser cette implication sans information supplémentaire.",
        "لا نعكس هذا الاستنتاج دون معلومة إضافية."
      )
    ),
    q(
      b(
        "Deux essais ont la même quantité d’eau et la même plante, mais des lumières différentes. Quelle comparaison cherche-t-on à faire ?",
        "لتجربتين النبات نفسه وكمية الماء نفسها لكن إضاءة مختلفة. ماذا نقارن؟"
      ),
      b("L’effet de la lumière dans ces conditions", "أثر الضوء في هذه الظروف"),
      [
        b("L’effet de la quantité d’eau", "أثر كمية الماء"),
        b("L’effet du prix des pots", "أثر ثمن الأصائص"),
      ],
      b(
        "Repère ce qui change entre les deux essais.",
        "حدد ما يتغير بين التجربتين."
      ),
      b(
        "Le facteur modifié est la lumière. Les autres conditions citées restent identiques.",
        "العامل المعدّل هو الضوء وتبقى الظروف المذكورة الأخرى متماثلة."
      )
    ),
    n(
      b(
        "Lina lit 12 pages par jour pendant 4 jours, puis 8 pages le cinquième jour. Combien lit-elle de pages ?",
        "تقرأ لينا12 صفحة يومياً خلال4 أيام ثم8 صفحات في اليوم الخامس. كم صفحة قرأت؟"
      ),
      56,
      b(
        "Calcule les quatre jours réguliers avant d’ajouter le cinquième.",
        "احسب الأيام الأربعة ثم أضف اليوم الخامس."
      ),
      b("4 × 12 + 8 = 56 pages.", "4 × 12 + 8 = 56 صفحة.")
    ),
  ],
};
for (const grade of Object.keys(logic) as PrimaryGrade[])
  add(
    grade,
    "reasoning",
    "logic",
    b("Les détectives du raisonnement", "محققو التفكير"),
    b(
      "Décrire une règle, éliminer une possibilité et justifier.",
      "أصف قاعدة وأستبعد احتمالاً وأبرر."
    ),
    logic[grade]
  );
const science: Record<
  PrimaryGrade,
  [Bilingual, Bilingual, Bilingual[], Bilingual][]
> = {
  "1AP": [
    [
      b("Quel animal a une coquille ?", "أيّ حيوان له قوقعة؟"),
      b("L’escargot", "الحلزون"),
      [b("Le chat", "القط"), b("Le poisson", "السمكة")],
      b(
        "L’escargot porte une coquille. Le poisson a des écailles, pas une coquille.",
        "يحمل الحلزون قوقعة وللسمكة حراشف لا قوقعة."
      ),
    ],
    [
      b(
        "Que peut-on observer sur une jeune plante au fil des jours ?",
        "ماذا يمكن ملاحظته على نبتة صغيرة عبر الأيام؟"
      ),
      b("De nouvelles feuilles", "أوراق جديدة"),
      [b("Des roues", "عجلات"), b("Des pages imprimées", "صفحات مطبوعة")],
      b(
        "Une plante peut grandir et former de nouvelles feuilles ; on observe le changement sur plusieurs jours.",
        "قد تنمو النبتة وتكوّن أوراقاً جديدة؛ نلاحظ التغير عبر أيام."
      ),
    ],
    [
      b("Quel objet mesure une longueur ?", "أيّ أداة تقيس طولاً؟"),
      b("Une règle", "مسطرة"),
      [b("Une cuillère", "ملعقة"), b("Un ballon", "كرة")],
      b(
        "Les graduations d’une règle servent à mesurer des longueurs.",
        "تستعمل تدريجات المسطرة لقياس الأطوال."
      ),
    ],
    [
      b(
        "Dans quel état l’eau que l’on verse dans un verre est-elle ?",
        "ما حالة الماء الذي نصبه في كأس؟"
      ),
      b("Liquide", "سائلة"),
      [b("Solide", "صلبة"), b("Un livre", "كتاب")],
      b(
        "L’eau liquide peut couler et prend la forme de son récipient.",
        "يسيل الماء السائل ويأخذ شكل الوعاء."
      ),
    ],
  ],
  "2AP": [
    [
      b(
        "Quelle partie d’une plante absorbe habituellement l’eau du sol ?",
        "أيّ جزء من النبات يمتص عادة ماء التربة؟"
      ),
      b("Les racines", "الجذور"),
      [
        b("Les pétales seulement", "البتلات فقط"),
        b("L’étiquette du pot", "بطاقة الأصيص"),
      ],
      b(
        "Les racines absorbent l’eau du sol. L’étiquette ne fait pas partie de la plante.",
        "تمتص الجذور ماء التربة والبطاقة ليست جزءاً من النبات."
      ),
    ],
    [
      b(
        "Quelle phrase décrit une observation, et non une supposition ?",
        "أيّ جملة تصف ملاحظة لا تخميناً؟"
      ),
      b("Je compte trois feuilles aujourd’hui", "أعدّ ثلاث أوراق اليوم"),
      [
        b(
          "Il y aura sûrement vingt feuilles demain",
          "ستوجد حتماً عشرون ورقة غداً"
        ),
        b(
          "Cette plante sera toujours la plus grande",
          "ستكون هذه النبتة الأكبر دائماً"
        ),
      ],
      b(
        "Le nombre de feuilles comptées aujourd’hui peut être vérifié. Les autres phrases prédisent l’avenir.",
        "يمكن التحقق من عدد أوراق اليوم؛ أما الجملتان الأخريان فتتنبآن بالمستقبل."
      ),
    ],
    [
      b(
        "Pourquoi noter la date d’un dessin de plante ?",
        "لماذا نكتب تاريخ رسم النبتة؟"
      ),
      b(
        "Pour comparer son évolution au fil du temps",
        "لمقارنة تطورها عبر الزمن"
      ),
      [
        b("Pour faire pousser la plante instantanément", "لتنمو النبتة فوراً"),
        b("Pour remplacer ses racines", "لتعويض جذورها"),
      ],
      b(
        "La date relie chaque observation à un moment précis.",
        "يربط التاريخ كل ملاحظة بوقت محدد."
      ),
    ],
    [
      b(
        "Quel ordre correspond à la croissance observée d’une graine qui germe ?",
        "أيّ ترتيب يوافق نمو بذرة تنبت؟"
      ),
      b("Graine, petite pousse, jeune plante", "بذرة ثم بادرة ثم نبتة صغيرة"),
      [
        b("Jeune plante, graine, petite pousse", "نبتة ثم بذرة ثم بادرة"),
        b("Petite pousse, jeune plante, graine", "بادرة ثم نبتة ثم بذرة"),
      ],
      b(
        "La germination précède le développement de la jeune plante ; elle n’est pas instantanée.",
        "يسبق الإنبات نمو النبتة الصغيرة ولا يحدث كل ذلك فوراً."
      ),
    ],
  ],
  "3AP": [
    [
      b(
        "Quand un glaçon fond, que devient-il ?",
        "ماذا يصبح مكعب الجليد عندما ينصهر؟"
      ),
      b("De l’eau liquide", "ماءً سائلاً"),
      [b("Du sable", "رملاً"), b("Du papier", "ورقاً")],
      b(
        "La fusion transforme l’eau solide en eau liquide.",
        "يحوّل الانصهار الماء الصلب إلى ماء سائل."
      ),
    ],
    [
      b(
        "L’eau liquide dans deux récipients de formes différentes garde-t-elle forcément la même forme ?",
        "هل يحتفظ الماء السائل بالشكل نفسه في وعاءين مختلفي الشكل؟"
      ),
      b("Non, elle prend la forme de chaque récipient", "لا؛ يأخذ شكل كل وعاء"),
      [
        b(
          "Oui, elle garde toujours la forme d’un cube",
          "نعم يبقى مكعباً دائماً"
        ),
        b("Elle devient du bois", "يصبح خشباً"),
      ],
      b(
        "Un liquide s’adapte à la forme de son récipient.",
        "يتخذ السائل شكل الوعاء الذي يحتويه."
      ),
    ],
    [
      b(
        "Lors de l’évaporation, l’eau liquide devient…",
        "عند التبخر يصبح الماء السائل…"
      ),
      b("De la vapeur d’eau, un gaz invisible", "بخار ماء، وهو غاز غير مرئي"),
      [
        b("Un métal", "معدناً"),
        b("De la glace à chaque fois", "جليداً في كل مرة"),
      ],
      b(
        "La vapeur d’eau est gazeuse et invisible. Les petits nuages visibles sont constitués de gouttelettes.",
        "بخار الماء غازي وغير مرئي؛ أما الغيمات المرئية فتتكون من قطيرات."
      ),
    ],
    [
      b(
        "Comment nomme-t-on le passage de la vapeur d’eau à des gouttelettes liquides ?",
        "كيف نسمي تحول بخار الماء إلى قطيرات سائلة؟"
      ),
      b("La condensation", "التكاثف"),
      [b("La fusion", "الانصهار"), b("Le découpage", "القص")],
      b(
        "La condensation est le passage du gaz au liquide ; la fusion va du solide au liquide.",
        "التكاثف انتقال من الغاز إلى السائل والانصهار من الصلب إلى السائل."
      ),
    ],
  ],
  "4AP": [
    [
      b(
        "Pour tester l’effet de la lumière, quelle comparaison est la mieux contrôlée ?",
        "لاختبار أثر الضوء، أيّ مقارنة أضبط؟"
      ),
      b(
        "Même type de plante, même sol et même eau ; lumière différente",
        "نوع النبات والتربة والماء متماثلة والضوء مختلف"
      ),
      [
        b(
          "Changer la plante, le sol et l’eau en même temps",
          "تغيير النبات والتربة والماء معاً"
        ),
        b(
          "Changer seulement l’étiquette sans observer",
          "تغيير البطاقة فقط دون ملاحظة"
        ),
      ],
      b(
        "On fait varier le facteur étudié et on garde les autres conditions comparables.",
        "نغير العامل المدروس ونحافظ على قابلية مقارنة الظروف الأخرى."
      ),
    ],
    [
      b(
        "Quelle phrase est une hypothèse à tester ?",
        "أيّ جملة فرضية قابلة للاختبار؟"
      ),
      b("La lumière pourrait modifier la croissance", "قد يؤثر الضوء في النمو"),
      [
        b("J’ai mesuré 8 cm aujourd’hui", "قست 8 سم اليوم"),
        b("Il y a deux pots sur la table", "يوجد أصيصان على الطاولة"),
      ],
      b(
        "Une hypothèse propose une explication ou une prévision à tester ; les deux autres phrases rapportent des observations.",
        "تقترح الفرضية تفسيراً أو توقعاً نختبره؛ والجملتان الأخريان ملاحظتان."
      ),
    ],
    [
      b(
        "Un pot mesure 8 cm au début et 11 cm ensuite. Quelle croissance a été mesurée ?",
        "كان طول نبتة8 سم ثم صار11 سم. ما الزيادة المقاسة؟"
      ),
      b("3 cm", "3 سم"),
      [b("19 cm", "19 سم"), b("11 cm de plus", "11 سم إضافية")],
      b(
        "11 − 8 = 3 cm. On mesure une différence, pas la somme.",
        "11 − 8 = 3 سم. نقيس الفرق لا المجموع."
      ),
    ],
    [
      b(
        "Un seul essai suffit-il à prouver une règle pour toutes les plantes ?",
        "هل تكفي تجربة واحدة لإثبات قاعدة لكل النباتات؟"
      ),
      b(
        "Non, il faut répéter et préciser les conditions",
        "لا؛ نكرر التجربة ونحدد الظروف"
      ),
      [
        b("Oui, sans aucune limite", "نعم دون حدود"),
        b("Oui, si le pot est joli", "نعم إذا كان الأصيص جميلاً"),
      ],
      b(
        "Une conclusion reste limitée aux observations et aux conditions étudiées.",
        "يبقى الاستنتاج مقيداً بالملاحظات والظروف المدروسة."
      ),
    ],
  ],
  "5AP": [
    [
      b(
        "Quel mouvement de la Terre explique principalement l’alternance du jour et de la nuit ?",
        "أيّ حركة للأرض تفسر أساساً تعاقب الليل والنهار؟"
      ),
      b("Sa rotation sur elle-même", "دورانها حول نفسها"),
      [
        b("Le fait que la Lune s’éteint", "انطفاء القمر"),
        b("Le mouvement des nuages seulement", "حركة السحب فقط"),
      ],
      b(
        "La partie tournée vers le Soleil reçoit sa lumière ; la rotation change les parties éclairées.",
        "تتلقى الجهة المواجهة للشمس ضوءها ويغير الدوران الجهات المضاءة."
      ),
    ],
    [
      b("Pourquoi voit-on la Lune éclairée ?", "لماذا نرى القمر مضيئاً؟"),
      b("Elle réfléchit la lumière du Soleil", "يعكس ضوء الشمس"),
      [
        b("Elle est une lampe électrique", "هو مصباح كهربائي"),
        b(
          "Elle fabrique la même lumière qu’une étoile",
          "ينتج ضوءاً مثل النجم"
        ),
      ],
      b(
        "La Lune renvoie une partie de la lumière solaire. Elle n’est pas une étoile.",
        "يعكس القمر جزءاً من ضوء الشمس وليس نجماً."
      ),
    ],
    [
      b(
        "Une ombre de poteau change au cours de la journée. Quel facteur contribue à ce changement ?",
        "يتغير ظل عمود خلال اليوم. ما العامل الذي يسهم في ذلك؟"
      ),
      b(
        "La position apparente du Soleil dans le ciel",
        "الموقع الظاهري للشمس في السماء"
      ),
      [b("Le nom du poteau", "اسم العمود"), b("Le prix du sol", "ثمن الأرض")],
      b(
        "L’orientation de l’éclairage change la direction et la longueur de l’ombre.",
        "يغير اتجاه الإضاءة اتجاه الظل وطوله."
      ),
    ],
    [
      b(
        "Pour comparer des photos d’une même ombre à plusieurs heures, que faut-il noter ?",
        "لمقارنة صور الظل نفسه في ساعات مختلفة، ماذا نسجل؟"
      ),
      b(
        "L’heure et la position du même objet fixe",
        "الساعة وموضع الجسم الثابت نفسه"
      ),
      [
        b("Seulement la couleur du cahier", "لون الدفتر فقط"),
        b(
          "Une heure inventée identique partout",
          "ساعة مختلقة واحدة لكل الصور"
        ),
      ],
      b(
        "Des repères fiables permettent une comparaison ; on n’invente pas les mesures manquantes.",
        "تسمح المعالم الموثوقة بالمقارنة ولا نختلق القياسات الناقصة."
      ),
    ],
  ],
};
for (const grade of Object.keys(science) as PrimaryGrade[])
  add(
    grade,
    "science-enquiry",
    "science",
    b("J’observe, je teste, j’explique", "ألاحظ وأختبر وأشرح"),
    b(
      "Distinguer fait, hypothèse et conclusion, avec un vocabulaire précis.",
      "أميز المعلومة والفرضية والاستنتاج بمفردات دقيقة."
    ),
    science[grade].map(([p, c, w, why]) =>
      q(
        p,
        c,
        w,
        b(
          "Repère ce qui est observé et ce qui est seulement supposé.",
          "ميّز ما لوحظ عما افترض فقط."
        ),
        why
      )
    )
  );
const writing: Record<PrimaryGrade, [string, string, string][]> = {
  "1AP": [
    [
      "انْسَخْ كَلِمَةَ «بَابٌ».",
      "بَابٌ",
      "نلاحظ ترتيب الحروف واتجاه الكتابة، دون الحكم على جمال الخط.",
    ],
    [
      "اكْتُبِ اسْمًا تَخْتَارُهُ، حَقِيقِيًّا أَوْ خَيَالِيًّا.",
      "مثال: لِينَا",
      "تُقبل أسماء متعددة؛ نلاحظ محاولة الكتابة لا هوية الطفل.",
    ],
    [
      "أَكْمِلْ بِكَلِمَةٍ: هَذَا …",
      "مثال: كِتَابٌ",
      "تُقبل كلمة مناسبة للصيغة، مع مساعدة شفوية عند الحاجة.",
    ],
    [
      "ارْسُمْ شَيْئًا وَاكْتُبْ اسْمَهُ بِمُسَاعَدَةِ نَمُوذَجٍ.",
      "مثال: رسم باب وكتابة «بَابٌ».",
      "نلاحظ الربط بين الشيء واسمه، ونسمح بالنسخ من نموذج.",
    ],
  ],
  "2AP": [
    [
      "اكتب جملة تصف حقيبة باستعمال لون.",
      "مثال: حقيبتي زرقاء.",
      "نبحث عن جملة مفهومة تصف الحقيبة؛ ليست هناك إجابة وحيدة.",
    ],
    [
      "رتب هذه الكلمات في جملة: سامي / كتاباً / يقرأ.",
      "يقرأ سامي كتاباً. أو: سامي يقرأ كتاباً.",
      "تُقبل البنيتان السليمتان؛ نلاحظ المعنى وترابط الكلمات.",
    ],
    [
      "اكتب جملة تبدأ بـ«في الصباح».",
      "مثال: في الصباح أذهب إلى المدرسة.",
      "نلاحظ استعمال بداية الجملة في سياق مفهوم.",
    ],
    [
      "اكتب طلباً لطيفاً لاستعارة قلم.",
      "مثال: هل تعيرني قلمك من فضلك؟",
      "نلاحظ وضوح الطلب وصيغة مناسبة للمخاطب، دون فرض عبارة وحيدة.",
    ],
  ],
  "3AP": [
    [
      "اكتب جملتين تدعو فيهما صديقاً إلى ركن القراءة، مع ذكر وقت ومكان.",
      "مثال: أدعوك إلى ركن القراءة في القسم يوم الثلاثاء صباحاً. سنقرأ قصة معاً.",
      "معايير الملاحظة: دعوة واضحة ووقت ومكان، ولو بصياغة مختلفة.",
    ],
    [
      "صف طريقة ترتيب كتابين باستعمال «أولاً» و«ثم».",
      "مثال: أولاً أقرأ العنوانين ثم أضع الكتابين على الرف المناسب.",
      "نلاحظ ترتيب خطوتين واستعمال رابطين مناسبين.",
    ],
    [
      "اكتب سؤالاً يساعدك على فهم قصة.",
      "مثال: لماذا أعاد سامي الكتاب إلى المكتبة؟",
      "تُقبل أسئلة متعددة ترتبط بقصة يختارها الطفل.",
    ],
    [
      "راجع جملة كتبتها: أضف علامة نهاية مناسبة.",
      "مثال: أين كتابي؟ أو: هذا كتابي.",
      "نربط علامة الاستفهام بالسؤال والنقطة بالجملة الخبرية.",
    ],
  ],
  "4AP": [
    [
      "اكتب رأياً عن تنظيم الكتب وأضف سبباً.",
      "مثال: أفضل ترتيب الكتب حسب الموضوع لأن ذلك يسهل العثور عليها.",
      "نلاحظ رأياً واضحاً وسبباً مرتبطاً به، لا موافقة الطفل على رأي معين.",
    ],
    [
      "حوّل ملاحظة «الماء خارج الأصيص» إلى سؤال يمكن بحثه.",
      "مثال: هل يقل الماء المتسرب إذا سَقينا ببطء؟",
      "يجب أن يرتبط السؤال بالملاحظة وأن يسمح بمقارنة قابلة للملاحظة.",
    ],
    [
      "اكتب رسالة قصيرة لاستعارة كتاب، تتضمن عنوانه وموعد إرجاعه.",
      "مثال: أود استعارة كتاب الحيوانات وسأعيده يوم الأحد. شكراً.",
      "نلاحظ غرض الرسالة والمعلومتين المطلوبتين وصيغة احترام.",
    ],
    [
      "اكتب جملة تلخص نتيجة تجربة محدودة دون تعميم.",
      "مثال: قل التسرب في أصصنا خلال هذا الأسبوع.",
      "نلاحظ تحديد المكان أو المدة وتجنب كلمات مثل دائماً وكل النباتات دون دليل.",
    ],
  ],
  "5AP": [
    [
      "اكتب رأياً ودليلاً ومثالاً عن تبادل الكتب.",
      "مثال: أؤيد تبادل الكتب لأنه يزيد التنوع دون شراء. في قسمنا تبادلنا نسختين مكررتين.",
      "نميز الرأي عن الدليل والمثال، ونقبل موقفاً مخالفاً إذا كان معللاً.",
    ],
    [
      "راجع العبارة «تجربتنا تثبت أن كل النباتات تحتاج الكمية نفسها من الماء». اكتب صياغة أدق.",
      "مثال: تصف تجربتنا هذه النباتات وفي هذه الظروف، ونحتاج اختبارات أخرى قبل التعميم.",
      "نلاحظ تخفيف التعميم وذكر حدود المعطيات.",
    ],
    [
      "اكتب تعليمات من ثلاث خطوات للتحقق من وصل شراء.",
      "مثال: أراجع الكميات. أحسب ثمن كل صنف. أجمع الأثمان وأقارن المجموع بالوصل.",
      "نلاحظ خطوات مرتبة قابلة للتطبيق، لا نتيجة حسابية مخترعة.",
    ],
    [
      "اكتب ملخصاً من جملتين لموقف قرأته، مع فصل المشكلة عن الحل.",
      "مثال: تكررت عناوين الكتب في المكتبة. اقترح التلاميذ تبادل النسخ الزائدة.",
      "نبحث عن المشكلة والحل دون إضافة حدث غير موجود في النص المختار.",
    ],
  ],
};
for (const grade of Object.keys(writing) as PrimaryGrade[])
  add(
    grade,
    "writing-workshop",
    "writing",
    b("J’écris, je relis, j’améliore", "أكتب وأراجع وأحسن"),
    b(
      "Produire un écrit court ; un adulte observe selon des critères explicites.",
      "أنتج كتابة قصيرة ويلاحظ بالغ وفق معايير واضحة."
    ),
    writing[grade].map(([p, c, why]) => ({
      prompt: mono(p),
      correct: mono(c),
      wrong: [],
      hint: mono("قُلْ فكرتك شفوياً أولاً ثم اكتبها. يمكنك مراجعة المحاولة."),
      method: mono(why),
    })),
    "ar"
  );
const english: Record<
  "3AP" | "4AP" | "5AP",
  [string, [string, string, string[], string][]]
> = {
  "3AP": [
    "Hello! My name is Nour. I have a red pencil and a blue bag. My friend Sami has a green book. We go to school together.",
    [
      [
        "What is her name?",
        "Nour",
        ["Sami", "Lina"],
        "The text says: My name is Nour.",
      ],
      [
        "What colour is the pencil?",
        "Red",
        ["Blue", "Green"],
        "Nour has a red pencil. The bag is blue.",
      ],
      [
        "Who has a green book?",
        "Sami",
        ["Nour", "Amine"],
        "The text says that Sami has a green book.",
      ],
      [
        "Where do the friends go together?",
        "To school",
        ["To the beach", "To the market"],
        "The last sentence says they go to school together.",
      ],
    ],
  ],
  "4AP": [
    "Our library is next to the school. The park is behind the library. On Tuesday, Lina walks to the library with her brother. They borrow two books and return home before lunch.",
    [
      [
        "Where is the library?",
        "Next to the school",
        ["Inside the park", "Behind Lina’s house"],
        "The first sentence gives its position.",
      ],
      [
        "Where is the park?",
        "Behind the library",
        ["Inside the school", "In front of the library"],
        "The second sentence says behind, not in front of.",
      ],
      [
        "Who walks with Lina?",
        "Her brother",
        ["Her teacher", "Her neighbour"],
        "The text names her brother.",
      ],
      [
        "When do they return home?",
        "Before lunch",
        ["After dinner", "At midnight"],
        "The last sentence gives the time.",
      ],
    ],
  ],
  "5AP": [
    "Our class wants more books for its reading corner. We already have two copies of the same story. Instead of buying everything new, we exchange one copy with another class. We write down the titles before the exchange. Afterwards, both classes have a wider choice of books.",
    [
      [
        "Why can the class exchange one copy?",
        "It has two copies of the same story",
        ["It has no books", "All its books are damaged"],
        "The text gives the repeated copy as the reason.",
      ],
      [
        "What do the pupils do before the exchange?",
        "They write down the titles",
        ["They hide all the books", "They close the school"],
        "The fourth sentence gives the preparation.",
      ],
      [
        "What is the result of the exchange?",
        "Both classes have a wider choice",
        ["Both classes lose every book", "The stories become shorter"],
        "The final sentence states the result.",
      ],
      [
        "Which statement is supported by the text?",
        "Exchanging a spare copy increased the choice in these classes",
        ["Every school must stop buying books", "All books are the same"],
        "Choose the limited conclusion supported by this exchange, not a rule about every school.",
      ],
    ],
  ],
};
for (const [grade, [story, questions]] of Object.entries(english))
  add(
    grade as PrimaryGrade,
    "english-reading",
    "english",
    b("Stories in English", "قصص بالإنجليزية"),
    b(
      "Lire et écouter une histoire en anglais ; chercher une preuve dans le texte.",
      "أقرأ وأستمع إلى قصة بالإنجليزية وأبحث عن الدليل في النص."
    ),
    questions.map(([p, c, w, why]) =>
      lq(p, c, w, "Read the sentence that gives the evidence.", why)
    ),
    "en",
    mono(story)
  );
export { modules as ENRICHMENT_MODULES };
