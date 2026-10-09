import type { CourseLesson, QuizQuestion } from '../types';
import { getCompetence, getLessonCompetences } from './competences';
export type HelpText = {fr:string;ar:string};
export interface GuidedMathHelp {competenceId:string;hints:HelpText[];steps:HelpText[];example:{prompt:HelpText;options:HelpText[];correct:number;explanation:HelpText};}
export const GUIDED_MATH_HELP: GuidedMathHelp[] = [
  {
    "competenceId": "math-1ap-c-spatial-position",
    "hints": [
      {
        "fr": "Choisis un objet comme repère.",
        "ar": "اختر شيئاً مرجعاً."
      },
      {
        "fr": "Regarde où se trouve l’autre objet.",
        "ar": "لاحظ مكان الشيء الآخر."
      },
      {
        "fr": "Distingue au-dessus, au-dessous, dedans et dehors.",
        "ar": "ميّز فوق وتحت وداخل وخارج."
      }
    ],
    "steps": [
      {
        "fr": "Nomme le repère.",
        "ar": "سمّ المرجع."
      },
      {
        "fr": "Décris la position de l’objet par rapport à lui.",
        "ar": "صف مكان الشيء بالنسبة إليه."
      },
      {
        "fr": "Vérifie en montrant les deux objets.",
        "ar": "تحقّق بالإشارة إلى الشيئين."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Une balle est sous une chaise. Où est la balle ?",
        "ar": "كرة تحت كرسي. أين الكرة؟"
      },
      "options": [
        {
          "fr": "Sous la chaise.",
          "ar": "تحت الكرسي."
        },
        {
          "fr": "Sur la chaise.",
          "ar": "فوق الكرسي."
        },
        {
          "fr": "Dans la chaise.",
          "ar": "داخل الكرسي."
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Le mot sous indique une position plus basse que le siège.",
        "ar": "كلمة تحت تدل على مكان أسفل المقعد."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-shapes",
    "hints": [
      {
        "fr": "Observe le contour.",
        "ar": "لاحظ الحدود."
      },
      {
        "fr": "Compte les côtés droits.",
        "ar": "عدّ الأضلاع المستقيمة."
      },
      {
        "fr": "Une forme ronde n’a pas de côté droit.",
        "ar": "الشكل الدائري ليس له ضلع مستقيم."
      }
    ],
    "steps": [
      {
        "fr": "Compte les côtés.",
        "ar": "عدّ الأضلاع."
      },
      {
        "fr": "Observe les coins et les longueurs.",
        "ar": "لاحظ الزوايا والأطوال."
      },
      {
        "fr": "Compare avec les propriétés de la forme.",
        "ar": "قارن بخصائص الشكل."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Quel nom donne-t-on à une forme fermée de 3 côtés droits ?",
        "ar": "ما اسم شكل مغلق له 3 أضلاع مستقيمة؟"
      },
      "options": [
        {
          "fr": "Un triangle.",
          "ar": "مثلث."
        },
        {
          "fr": "Un carré.",
          "ar": "مربع."
        },
        {
          "fr": "Un cercle.",
          "ar": "دائرة."
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Un triangle a trois côtés ; un carré en a quatre.",
        "ar": "للمثلث ثلاثة أضلاع وللمربع أربعة."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-ruler-lines",
    "hints": [
      {
        "fr": "Repère les deux points.",
        "ar": "حدّد النقطتين."
      },
      {
        "fr": "Place le bord de la règle sur les deux points.",
        "ar": "ضع حافة المسطرة على النقطتين."
      },
      {
        "fr": "Garde la règle immobile.",
        "ar": "ثبّت المسطرة."
      }
    ],
    "steps": [
      {
        "fr": "Aligne la règle.",
        "ar": "حاذِ المسطرة."
      },
      {
        "fr": "Trace le long du bord.",
        "ar": "ارسم بمحاذاة الحافة."
      },
      {
        "fr": "Vérifie que le trait passe par les deux points.",
        "ar": "تحقّق أن الخط يمر بالنقطتين."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Quel outil aide à tracer un trait droit entre deux points ?",
        "ar": "ما الأداة التي تساعد على رسم خط مستقيم بين نقطتين؟"
      },
      "options": [
        {
          "fr": "Une règle.",
          "ar": "مسطرة."
        },
        {
          "fr": "Une gomme.",
          "ar": "ممحاة."
        },
        {
          "fr": "Un bol.",
          "ar": "وعاء."
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Le bord droit de la règle guide le crayon.",
        "ar": "الحافة المستقيمة للمسطرة توجّه القلم."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-compare-magnitudes",
    "hints": [
      {
        "fr": "Choisis ce que tu compares : longueur ou masse.",
        "ar": "حدّد ما تقارنه: الطول أم الكتلة."
      },
      {
        "fr": "Pour les longueurs, aligne les points de départ.",
        "ar": "لمقارنة الأطوال حاذِ نقطة البداية."
      },
      {
        "fr": "Ne déduis pas la masse seulement de la taille.",
        "ar": "لا تستنتج الكتلة من الحجم فقط."
      }
    ],
    "steps": [
      {
        "fr": "Compare la même grandeur.",
        "ar": "قارن المقدار نفسه."
      },
      {
        "fr": "Utilise un repère commun ou une balance pour la masse.",
        "ar": "استعمل مرجعاً مشتركاً أو ميزاناً للكتلة."
      },
      {
        "fr": "Explique avec plus long, plus court, plus lourd ou plus léger.",
        "ar": "اشرح بأطول أو أقصر أو أثقل أو أخف."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Deux rubans partent du même point. Le rouge mesure 9 cm, le bleu 6 cm. Lequel est plus long ?",
        "ar": "شريطان لهما البداية نفسها. الأحمر 9 سم والأزرق 6 سم. أيّهما أطول؟"
      },
      "options": [
        {
          "fr": "Le rouge.",
          "ar": "الأحمر."
        },
        {
          "fr": "Le bleu.",
          "ar": "الأزرق."
        },
        {
          "fr": "Ils sont égaux.",
          "ar": "متساويان."
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "9 cm est plus grand que 6 cm, avec la même unité.",
        "ar": "9 سم أكبر من 6 سم بالوحدة نفسها."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-count-quantities",
    "hints": [
      {
        "fr": "Touche chaque objet une fois.",
        "ar": "المس كل شيء مرة واحدة."
      },
      {
        "fr": "Dis un nombre à chaque objet.",
        "ar": "قل عدداً لكل شيء."
      },
      {
        "fr": "Le dernier nombre dit donne la quantité.",
        "ar": "العدد الأخير يدل على الكمية."
      }
    ],
    "steps": [
      {
        "fr": "Organise les objets pour ne pas en oublier.",
        "ar": "رتّب الأشياء كي لا تنسى شيئاً."
      },
      {
        "fr": "Compte sans repasser sur le même objet.",
        "ar": "عدّ دون تكرار الشيء نفسه."
      },
      {
        "fr": "Recompte pour vérifier.",
        "ar": "أعد العدّ للتحقّق."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Compte : ● ● ● ● ●. Combien y a-t-il de points ?",
        "ar": "عدّ: ● ● ● ● ●. كم نقطة؟"
      },
      "options": [
        {
          "fr": "5",
          "ar": "5"
        },
        {
          "fr": "4",
          "ar": "4"
        },
        {
          "fr": "6",
          "ar": "6"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "On compte 1, 2, 3, 4, 5 : il y a cinq points.",
        "ar": "نعدّ 1، 2، 3، 4، 5. لدينا خمس نقاط."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-numbers-read-write",
    "hints": [
      {
        "fr": "Repère les dizaines et les unités.",
        "ar": "حدّد العشرات والآحاد."
      },
      {
        "fr": "Lis le nombre sans changer l’ordre des chiffres.",
        "ar": "اقرأ العدد دون تغيير ترتيب الأرقام."
      },
      {
        "fr": "Pour écrire, retrouve les chiffres correspondant au nombre.",
        "ar": "للكتابة ابحث عن الأرقام المناسبة للعدد."
      }
    ],
    "steps": [
      {
        "fr": "Décompose le nombre si besoin.",
        "ar": "فكّك العدد عند الحاجة."
      },
      {
        "fr": "Associe la quantité à son écriture.",
        "ar": "اربط الكمية بكتابتها."
      },
      {
        "fr": "Relis ce que tu as écrit.",
        "ar": "أعد قراءة ما كتبت."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Quel nombre écrit-on pour vingt-sept ?",
        "ar": "كيف نكتب سبعة وعشرين بالأرقام؟"
      },
      "options": [
        {
          "fr": "27",
          "ar": "27"
        },
        {
          "fr": "72",
          "ar": "72"
        },
        {
          "fr": "20",
          "ar": "20"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Vingt-sept correspond à 2 dizaines et 7 unités.",
        "ar": "سبعة وعشرون تساوي عشرتين و7 آحاد."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-place-value",
    "hints": [
      {
        "fr": "Commence par les unités à droite.",
        "ar": "ابدأ بالآحاد يميناً."
      },
      {
        "fr": "Chaque dizaine contient 10 unités.",
        "ar": "كل عشرة فيها 10 آحاد."
      },
      {
        "fr": "Un chiffre change de valeur selon sa position.",
        "ar": "تتغيّر قيمة الرقم حسب مرتبته."
      }
    ],
    "steps": [
      {
        "fr": "Sépare dizaines et unités.",
        "ar": "افصل العشرات والآحاد."
      },
      {
        "fr": "Écris la valeur de chaque position.",
        "ar": "اكتب قيمة كل مرتبة."
      },
      {
        "fr": "Réunis les valeurs pour retrouver le nombre.",
        "ar": "اجمع القيم لتجد العدد."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Dans 46, combien y a-t-il de dizaines complètes ?",
        "ar": "كم عشرة كاملة في 46؟"
      },
      "options": [
        {
          "fr": "4",
          "ar": "4"
        },
        {
          "fr": "6",
          "ar": "6"
        },
        {
          "fr": "46",
          "ar": "46"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "46 = 40 + 6 : quatre dizaines et six unités.",
        "ar": "46 = 40 + 6. أربع عشرات وستة آحاد."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-number-order",
    "hints": [
      {
        "fr": "Suivant : avance d’une unité.",
        "ar": "التالي: زد وحدة."
      },
      {
        "fr": "Précédent : recule d’une unité.",
        "ar": "السابق: احذف وحدة."
      },
      {
        "fr": "Tu peux utiliser une file de nombres.",
        "ar": "يمكن استعمال شريط الأعداد."
      }
    ],
    "steps": [
      {
        "fr": "Lis le nombre de départ.",
        "ar": "اقرأ العدد الأول."
      },
      {
        "fr": "Choisis le sens demandé.",
        "ar": "اختر الاتجاه المطلوب."
      },
      {
        "fr": "Vérifie l’ordre des voisins.",
        "ar": "تحقّق من ترتيب الأعداد المجاورة."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Quel nombre vient juste avant 32 ?",
        "ar": "ما العدد الذي يأتي قبل 32 مباشرة؟"
      },
      "options": [
        {
          "fr": "31",
          "ar": "31"
        },
        {
          "fr": "33",
          "ar": "33"
        },
        {
          "fr": "30",
          "ar": "30"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "31, 32, 33 : le voisin précédent est 31.",
        "ar": "31، 32، 33. العدد السابق هو 31."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-compare-numbers",
    "hints": [
      {
        "fr": "Compare les dizaines d’abord.",
        "ar": "قارن العشرات أولاً."
      },
      {
        "fr": "Si elles sont égales, compare les unités.",
        "ar": "إذا تساوت فقارن الآحاد."
      },
      {
        "fr": "Le signe s’ouvre vers le plus grand nombre.",
        "ar": "فتحة الرمز تتّجه إلى العدد الأكبر."
      }
    ],
    "steps": [
      {
        "fr": "Aligne les positions.",
        "ar": "حاذِ المراتب."
      },
      {
        "fr": "Cherche la première différence.",
        "ar": "ابحث عن أول اختلاف."
      },
      {
        "fr": "Relis la comparaison avec plus petit, plus grand ou égal.",
        "ar": "اقرأ المقارنة بأصغر أو أكبر أو يساوي."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Complète : 42 … 39.",
        "ar": "أكمل: 42 … 39."
      },
      "options": [
        {
          "fr": ">",
          "ar": ">"
        },
        {
          "fr": "<",
          "ar": "<"
        },
        {
          "fr": "=",
          "ar": "="
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "42 a quatre dizaines ; 39 en a trois. Donc 42 > 39.",
        "ar": "في 42 أربع عشرات وفي 39 ثلاث. إذن 42 > 39."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-addition",
    "hints": [
      {
        "fr": "On réunit ou on ajoute des objets.",
        "ar": "نجمع الأشياء أو نضيف إليها."
      },
      {
        "fr": "Compte à partir du premier nombre.",
        "ar": "عدّ انطلاقاً من العدد الأول."
      },
      {
        "fr": "Aligne les unités et les dizaines.",
        "ar": "حاذِ الآحاد والعشرات."
      }
    ],
    "steps": [
      {
        "fr": "Repère les quantités à réunir.",
        "ar": "حدّد الكميات التي نجمعها."
      },
      {
        "fr": "Additionne les unités puis les dizaines, sans retenue dans ce parcours.",
        "ar": "اجمع الآحاد ثم العشرات دون احتفاظ في هذا المسار."
      },
      {
        "fr": "Vérifie avec des objets ou une soustraction.",
        "ar": "تحقّق بالأشياء أو بالطرح."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Calcule 28 + 11.",
        "ar": "احسب 28 + 11."
      },
      "options": [
        {
          "fr": "39",
          "ar": "39"
        },
        {
          "fr": "38",
          "ar": "38"
        },
        {
          "fr": "17",
          "ar": "17"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "8 + 1 = 9 unités ; 2 + 1 = 3 dizaines : 39.",
        "ar": "8 + 1 = 9 آحاد و2 + 1 = 3 عشرات. النتيجة 39."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-subtraction",
    "hints": [
      {
        "fr": "On enlève ou on cherche ce qui reste.",
        "ar": "نحذف أو نبحث عما بقي."
      },
      {
        "fr": "Pars de la quantité du début.",
        "ar": "ابدأ بكمية البداية."
      },
      {
        "fr": "Retire seulement la quantité indiquée.",
        "ar": "احذف الكمية المذكورة فقط."
      }
    ],
    "steps": [
      {
        "fr": "Représente le nombre initial.",
        "ar": "مثّل العدد الأول."
      },
      {
        "fr": "Enlève les objets ou recule sur une file.",
        "ar": "احذف الأشياء أو ارجع على شريط الأعداد."
      },
      {
        "fr": "Ajoute ce qui a été retiré pour vérifier.",
        "ar": "أضف ما حذفت للتحقّق."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Il y a 17 crayons. On en retire 4. Combien restent ?",
        "ar": "لدينا 17 قلماً. حذفنا 4. كم بقي؟"
      },
      "options": [
        {
          "fr": "13",
          "ar": "13"
        },
        {
          "fr": "21",
          "ar": "21"
        },
        {
          "fr": "14",
          "ar": "14"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "17 − 4 = 13. Vérification : 13 + 4 = 17.",
        "ar": "17 − 4 = 13. التحقّق: 13 + 4 = 17."
      }
    }
  },
  {
    "competenceId": "math-1ap-c-problem-solving",
    "hints": [
      {
        "fr": "Cherche ce que demande la question.",
        "ar": "حدّد المطلوب في السؤال."
      },
      {
        "fr": "Distingue les quantités données.",
        "ar": "ميّز الكميات المعطاة."
      },
      {
        "fr": "Dessine ce qui arrive avant de choisir l’opération.",
        "ar": "ارسم ما يحدث قبل اختيار العملية."
      }
    ],
    "steps": [
      {
        "fr": "Dis la situation avec tes mots.",
        "ar": "احكِ الوضعية بكلماتك."
      },
      {
        "fr": "Choisis ajouter ou retirer selon l’action.",
        "ar": "اختر الجمع أو الطرح حسب الحدث."
      },
      {
        "fr": "Calcule puis réponds avec l’objet ou l’unité.",
        "ar": "احسب وأجب مع الشيء أو الوحدة."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Meriem a 9 livres et reçoit 3 livres. Combien de livres a-t-elle ?",
        "ar": "لمريم 9 كتب وأخذت 3 كتب أخرى. كم كتاباً لديها؟"
      },
      "options": [
        {
          "fr": "12 livres.",
          "ar": "12 كتاباً."
        },
        {
          "fr": "6 livres.",
          "ar": "6 كتب."
        },
        {
          "fr": "3 livres.",
          "ar": "3 كتب."
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Recevoir augmente la quantité : 9 + 3 = 12 livres.",
        "ar": "الأخذ يزيد الكمية: 9 + 3 = 12 كتاباً."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-numbers-999",
    "hints": [
      {
        "fr": "Lis centaines, dizaines, unités.",
        "ar": "اقرأ المئات والعشرات والآحاد."
      },
      {
        "fr": "Une centaine contient 10 dizaines.",
        "ar": "المئة تحتوي 10 عشرات."
      },
      {
        "fr": "Un zéro garde une position même sans quantité.",
        "ar": "الصفر يحفظ المرتبة ولو لم توجد كمية."
      }
    ],
    "steps": [
      {
        "fr": "Place les chiffres dans un tableau de positions.",
        "ar": "ضع الأرقام في جدول المراتب."
      },
      {
        "fr": "Décompose en centaines, dizaines et unités.",
        "ar": "فكّك إلى مئات وعشرات وآحاد."
      },
      {
        "fr": "Vérifie en réunissant les valeurs.",
        "ar": "تحقّق بجمع القيم."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Quel nombre vaut 6 centaines, 0 dizaine et 8 unités ?",
        "ar": "ما العدد الذي فيه 6 مئات و0 عشرة و8 آحاد؟"
      },
      "options": [
        {
          "fr": "608",
          "ar": "608"
        },
        {
          "fr": "680",
          "ar": "680"
        },
        {
          "fr": "68",
          "ar": "68"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "600 + 0 + 8 = 608. Le zéro garde la place des dizaines.",
        "ar": "600 + 0 + 8 = 608. الصفر يحفظ مرتبة العشرات."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-addition-carry",
    "hints": [
      {
        "fr": "Aligne les positions.",
        "ar": "حاذِ المراتب."
      },
      {
        "fr": "Commence par les unités.",
        "ar": "ابدأ بالآحاد."
      },
      {
        "fr": "10 unités deviennent 1 dizaine.",
        "ar": "10 آحاد تصبح عشرة واحدة."
      }
    ],
    "steps": [
      {
        "fr": "Additionne les unités.",
        "ar": "اجمع الآحاد."
      },
      {
        "fr": "Échange dix unités contre une dizaine si nécessaire.",
        "ar": "بدّل 10 آحاد بعشرة عند الحاجة."
      },
      {
        "fr": "Ajoute les dizaines, y compris la retenue, puis vérifie.",
        "ar": "اجمع العشرات مع الاحتفاظ ثم تحقّق."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Calcule 58 + 27.",
        "ar": "احسب 58 + 27."
      },
      "options": [
        {
          "fr": "85",
          "ar": "85"
        },
        {
          "fr": "75",
          "ar": "75"
        },
        {
          "fr": "815",
          "ar": "815"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "8 + 7 = 15 : écris 5 unités, garde 1 dizaine. 5 + 2 + 1 = 8 dizaines. Résultat : 85.",
        "ar": "8 + 7 = 15. نكتب 5 آحاد ونحتفظ بعشرة. 5 + 2 + 1 = 8 عشرات. النتيجة: 85."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-subtraction",
    "hints": [
      {
        "fr": "Aligne les unités et les dizaines.",
        "ar": "حاذِ الآحاد والعشرات."
      },
      {
        "fr": "Compare les unités avant de les soustraire.",
        "ar": "قارن الآحاد قبل طرحها."
      },
      {
        "fr": "Si besoin, échange une dizaine contre dix unités.",
        "ar": "عند الحاجة بدّل عشرة بعشرة آحاد."
      }
    ],
    "steps": [
      {
        "fr": "Représente les positions du premier nombre.",
        "ar": "مثّل مراتب العدد الأول."
      },
      {
        "fr": "Fais l’échange si les unités ne suffisent pas.",
        "ar": "بدّل إذا لم تكفِ الآحاد."
      },
      {
        "fr": "Soustrais et vérifie avec une addition.",
        "ar": "اطرح وتحقّق بالجمع."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Calcule 62 − 28.",
        "ar": "احسب 62 − 28."
      },
      "options": [
        {
          "fr": "34",
          "ar": "34"
        },
        {
          "fr": "46",
          "ar": "46"
        },
        {
          "fr": "44",
          "ar": "44"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "62 = 5 dizaines et 12 unités. 12 − 8 = 4 ; 5 − 2 = 3. Vérifie 34 + 28 = 62.",
        "ar": "62 = 5 عشرات و12 وحدة. 12 − 8 = 4 و5 − 2 = 3. التحقّق: 34 + 28 = 62."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-multiplication",
    "hints": [
      {
        "fr": "Les groupes doivent avoir la même quantité.",
        "ar": "يجب أن تكون المجموعات متساوية العدد."
      },
      {
        "fr": "Compte le nombre de groupes.",
        "ar": "عدّ المجموعات."
      },
      {
        "fr": "Additionne la quantité de chaque groupe.",
        "ar": "اجمع كمية كل مجموعة."
      }
    ],
    "steps": [
      {
        "fr": "Dessine les groupes égaux.",
        "ar": "ارسم مجموعات متساوية."
      },
      {
        "fr": "Écris l’addition répétée.",
        "ar": "اكتب الجمع المتكرر."
      },
      {
        "fr": "Écris la multiplication et vérifie par comptage.",
        "ar": "اكتب الضرب وتحقّق بالعدّ."
      }
    ],
    "example": {
      "prompt": {
        "fr": "4 sacs contiennent chacun 3 pommes. Combien de pommes en tout ?",
        "ar": "في 4 أكياس، بكل كيس 3 تفاحات. كم تفاحة في المجموع؟"
      },
      "options": [
        {
          "fr": "12",
          "ar": "12"
        },
        {
          "fr": "7",
          "ar": "7"
        },
        {
          "fr": "3",
          "ar": "3"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "3 + 3 + 3 + 3 = 12, soit 4 × 3 = 12 pommes.",
        "ar": "3 + 3 + 3 + 3 = 12، أي 4 × 3 = 12 تفاحة."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-right-angle",
    "hints": [
      {
        "fr": "Observe le coin.",
        "ar": "لاحظ الزاوية."
      },
      {
        "fr": "Utilise le coin d’une feuille rectangulaire comme repère.",
        "ar": "استعمل زاوية ورقة مستطيلة كمرجع."
      },
      {
        "fr": "Compare les deux côtés au coin du repère.",
        "ar": "قارن ضلعي الزاوية بزاوية المرجع."
      }
    ],
    "steps": [
      {
        "fr": "Place le coin du repère au sommet.",
        "ar": "ضع زاوية المرجع على الرأس."
      },
      {
        "fr": "Aligne un côté.",
        "ar": "حاذِ ضلعاً."
      },
      {
        "fr": "Vérifie si l’autre côté coïncide.",
        "ar": "تحقّق من تطابق الضلع الآخر."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Combien d’angles droits possède un rectangle ?",
        "ar": "كم زاوية قائمة للمستطيل؟"
      },
      "options": [
        {
          "fr": "4",
          "ar": "4"
        },
        {
          "fr": "3",
          "ar": "3"
        },
        {
          "fr": "2",
          "ar": "2"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "Les quatre coins du rectangle sont des angles droits.",
        "ar": "زوايا المستطيل الأربع قائمة."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-units",
    "hints": [
      {
        "fr": "Lis la grandeur et l’unité.",
        "ar": "اقرأ المقدار والوحدة."
      },
      {
        "fr": "Ne mélange pas longueur et masse.",
        "ar": "لا تخلط الطول والكتلة."
      },
      {
        "fr": "Avant d’additionner, utilise la même unité.",
        "ar": "وحّد الوحدة قبل الجمع."
      }
    ],
    "steps": [
      {
        "fr": "Choisis m/cm pour une longueur ou kg/g pour une masse.",
        "ar": "اختر م/سم للطول أو كغ/غ للكتلة."
      },
      {
        "fr": "Utilise 1 m = 100 cm ou 1 kg = 1 000 g quand nécessaire.",
        "ar": "استعمل 1 م = 100 سم أو 1 كغ = 1000 غ عند الحاجة."
      },
      {
        "fr": "Calcule puis écris l’unité.",
        "ar": "احسب ثم اكتب الوحدة."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Combien de centimètres font 3 m ?",
        "ar": "كم سنتيمتراً في 3 م؟"
      },
      "options": [
        {
          "fr": "300 cm",
          "ar": "300 سم"
        },
        {
          "fr": "30 cm",
          "ar": "30 سم"
        },
        {
          "fr": "3 cm",
          "ar": "3 سم"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "1 m = 100 cm, donc 3 m = 3 × 100 = 300 cm.",
        "ar": "1 م = 100 سم. إذن 3 م = 3 × 100 = 300 سم."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-clock",
    "hints": [
      {
        "fr": "Repère la petite aiguille puis la grande.",
        "ar": "حدّد العقرب الصغير ثم الكبير."
      },
      {
        "fr": "La petite indique les heures.",
        "ar": "الصغير يدل على الساعات."
      },
      {
        "fr": "À la demi-heure, la grande est sur 6 et la petite entre deux heures.",
        "ar": "في نصف الساعة الكبير على 6 والصغير بين ساعتين."
      }
    ],
    "steps": [
      {
        "fr": "Lis l’heure déjà passée.",
        "ar": "اقرأ الساعة التي مضت."
      },
      {
        "fr": "Lis les minutes indiquées par la grande aiguille.",
        "ar": "اقرأ الدقائق بالعقرب الكبير."
      },
      {
        "fr": "Vérifie la position de la petite aiguille.",
        "ar": "تحقّق من مكان العقرب الصغير."
      }
    ],
    "example": {
      "prompt": {
        "fr": "La grande aiguille est sur 6 et la petite entre 3 et 4. Quelle heure est-il ?",
        "ar": "العقرب الكبير على 6 والصغير بين 3 و4. كم الساعة؟"
      },
      "options": [
        {
          "fr": "3 h 30",
          "ar": "3:30"
        },
        {
          "fr": "6 h 30",
          "ar": "6:30"
        },
        {
          "fr": "4 h",
          "ar": "4:00"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "La grande sur 6 indique 30 minutes ; la petite a dépassé 3 : 3 h 30.",
        "ar": "الكبير على 6 يدل على 30 دقيقة. الصغير تجاوز 3. الساعة 3:30."
      }
    }
  },
  {
    "competenceId": "math-2ap-c-money",
    "hints": [
      {
        "fr": "Repère le prix et le montant payé.",
        "ar": "حدّد الثمن والمبلغ المدفوع."
      },
      {
        "fr": "Si on demande la monnaie, cherche ce qui reste après le paiement.",
        "ar": "لحساب الباقي ابحث عما بقي بعد الدفع."
      },
      {
        "fr": "Vérifie que prix + monnaie = montant donné.",
        "ar": "تحقّق أن الثمن + الباقي = المبلغ المعطى."
      }
    ],
    "steps": [
      {
        "fr": "Calcule le prix total si plusieurs objets sont achetés.",
        "ar": "احسب الثمن الكلي إذا تعدّدت المشتريات."
      },
      {
        "fr": "Soustrais le prix du montant donné.",
        "ar": "اطرح الثمن من المبلغ المعطى."
      },
      {
        "fr": "Écris DA et vérifie l’égalité.",
        "ar": "اكتب دج وتحقّق من المساواة."
      }
    ],
    "example": {
      "prompt": {
        "fr": "Un cahier coûte 35 DA. Tu donnes 50 DA. Quelle monnaie reçoit-on ?",
        "ar": "ثمن كراس 35 دج. أعطيت 50 دج. كم يُرجع لك؟"
      },
      "options": [
        {
          "fr": "15 DA",
          "ar": "15 دج"
        },
        {
          "fr": "85 DA",
          "ar": "85 دج"
        },
        {
          "fr": "25 DA",
          "ar": "25 دج"
        }
      ],
      "correct": 0,
      "explanation": {
        "fr": "50 − 35 = 15 DA. Vérifie 35 + 15 = 50.",
        "ar": "50 − 35 = 15 دج. التحقّق: 35 + 15 = 50."
      }
    }
  }
];
export function guidedHelpForGrade(grade:string) { return GUIDED_MATH_HELP.filter(g=>getCompetence(g.competenceId)?.grade===grade); }
const beginnerExamples: Record<string, GuidedMathHelp['example']> = {
 'math-1ap-c-numbers-read-write': {prompt:{fr:'Quel nombre représente trois objets ?',ar:'أي عدد يمثل ثلاثة أشياء؟'},options:[{fr:'3',ar:'3'},{fr:'2',ar:'2'},{fr:'4',ar:'4'}],correct:0,explanation:{fr:'Trois objets correspondent au nombre 3.',ar:'ثلاثة أشياء تمثل العدد 3.'}},
 'math-1ap-c-number-order': {prompt:{fr:'Quel nombre vient juste avant 8 ?',ar:'ما العدد الذي يسبق 8 مباشرة؟'},options:[{fr:'7',ar:'7'},{fr:'9',ar:'9'},{fr:'6',ar:'6'}],correct:0,explanation:{fr:'6, 7, 8 : le nombre juste avant 8 est 7.',ar:'6، 7، 8. العدد الذي يسبق 8 هو 7.'}},
 'math-1ap-c-addition': {prompt:{fr:'Tu as 3 jetons et tu en ajoutes 2. Combien en as-tu ?',ar:'لديك 3 أقراص وتضيف قرصين. كم صار لديك؟'},options:[{fr:'5',ar:'5'},{fr:'1',ar:'1'},{fr:'6',ar:'6'}],correct:0,explanation:{fr:'Réunis les deux groupes : 3 + 2 = 5.',ar:'نجمع المجموعتين: 3 + 2 = 5.'}},
 'math-1ap-c-compare-numbers': {prompt:{fr:'Quel groupe contient le plus de jetons : 5 ou 3 ?',ar:'أي مجموعة فيها أقراص أكثر: 5 أم 3؟'},options:[{fr:'5',ar:'5'},{fr:'3',ar:'3'},{fr:'Autant',ar:'متساويان'}],correct:0,explanation:{fr:'Après avoir associé trois paires, il reste deux jetons dans le groupe de 5.',ar:'بعد مقابلة ثلاثة أزواج تبقى قرصان في مجموعة 5.'}},
 'math-1ap-c-place-value': {prompt:{fr:'12 objets : combien de dizaines complètes ?',ar:'12 شيئاً: كم عشرة كاملة؟'},options:[{fr:'1',ar:'1'},{fr:'2',ar:'2'},{fr:'12',ar:'12'}],correct:0,explanation:{fr:'12 = 10 + 2 : une dizaine et deux unités.',ar:'12 = 10 + 2. عشرة واحدة ووحدتان.'}}
};
export function guidedHelpForLesson(lesson:CourseLesson,question?:QuizQuestion):GuidedMathHelp[] {
 if(lesson.subject!=='math'||!['1AP','2AP'].includes(lesson.grade))return [];
 const ids=getLessonCompetences(lesson.id).filter(c=>c.grade===lesson.grade&&c.subject==='math').map(c=>c.id);
 if(question?.competenceId){return ids.includes(question.competenceId)?guidedHelpForLesson(lesson).filter(g=>g.competenceId===question.competenceId):[];}
 return GUIDED_MATH_HELP.filter(g=>ids.includes(g.competenceId)).map(g=>{
  const introductory = lesson.grade==='1AP' && /-t[12]-/.test(lesson.id);
  return introductory && beginnerExamples[g.competenceId] ? {...g,example:beginnerExamples[g.competenceId]} : g;
 });
}
