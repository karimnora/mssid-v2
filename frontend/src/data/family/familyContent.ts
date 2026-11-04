import type { PrimaryGrade } from '../../types';
export type Bilingual = { fr: string; ar: string };
export type FamilyDomain = 'numbers' | 'operations' | 'measures' | 'reading' | 'writing' | 'french' | 'english' | 'decimals' | 'proportion' | 'logic' | 'science';
export interface FamilyTask { id: string; prompt: Bilingual; answer: Bilingual; hint: Bilingual; method: Bilingual; accepted?: string[]; language?: 'ar' | 'fr' | 'en'; options?: {id:string;label:Bilingual}[]; }
export interface FamilyModule { id: string; grade: PrimaryGrade; domain: FamilyDomain; title: Bilingual; objective: Bilingual; tasks: FamilyTask[]; competenceIds: string[]; text?: Bilingual; language?: 'ar' | 'fr' | 'en'; }
export const FAMILY_MODULES: FamilyModule[] = [
  {
    "id": "1AP-numbers",
    "grade": "1AP",
    "domain": "numbers",
    "title": {
      "fr": "Nombres et repérage",
      "ar": "الأعداد والترتيب"
    },
    "objective": {
      "fr": "Lire les positions et justifier un ordre.",
      "ar": "تمييز المراتب وتبرير الترتيب."
    },
    "tasks": [
      {
        "id": "1AP-n1",
        "prompt": {
          "fr": "Écris le nombre qui suit 24.",
          "ar": "اكتب العدد الذي يأتي بعد 24."
        },
        "answer": {
          "fr": "25",
          "ar": "25"
        },
        "hint": {
          "fr": "Avance d’une unité.",
          "ar": "أضف وحدة واحدة."
        },
        "method": {
          "fr": "24 + 1 = 25. Le nombre augmente d’une unité.",
          "ar": "24 + 1 = 25. نزيد وحدة واحدة."
        },
        "accepted": [
          "25"
        ]
      },
      {
        "id": "1AP-n2",
        "prompt": {
          "fr": "Dans 24, quel est le chiffre des dizaines ?",
          "ar": "ما رقم العشرات في 24؟"
        },
        "answer": {
          "fr": "2",
          "ar": "2"
        },
        "hint": {
          "fr": "Repère le deuxième chiffre en partant de la droite.",
          "ar": "ابحث عن الرقم الثاني من اليمين."
        },
        "method": {
          "fr": "Le chiffre des dizaines est 2 ; sa valeur est 20. Ne confonds pas chiffre et valeur.",
          "ar": "رقم العشرات هو 2 وقيمته 20. نفرّق بين الرقم وقيمته."
        },
        "accepted": [
          "2"
        ]
      },
      {
        "id": "1AP-n3",
        "prompt": {
          "fr": "Range du plus petit au plus grand : 34, 23, 24.",
          "ar": "رتّب تصاعدياً: 34، 23، 24."
        },
        "answer": {
          "fr": "23 < 24 < 34",
          "ar": "23 < 24 < 34"
        },
        "hint": {
          "fr": "Compare d’abord les positions de plus grande valeur.",
          "ar": "قارن المراتب الأكبر أولاً."
        },
        "method": {
          "fr": "Compare les chiffres de gauche à droite. Explique pourquoi le premier nombre est le plus petit.",
          "ar": "قارن الأرقام من اليسار إلى اليمين واشرح لماذا العدد الأول هو الأصغر."
        }
      }
    ],
    "competenceIds": [
      "math-1ap-c-place-value",
      "math-1ap-c-number-order"
    ]
  },
  {
    "id": "1AP-operations",
    "grade": "1AP",
    "domain": "operations",
    "title": {
      "fr": "Calcul et problèmes",
      "ar": "الحساب والمسائل"
    },
    "objective": {
      "fr": "Choisir une opération, calculer puis vérifier.",
      "ar": "اختيار العملية والحساب والتحقق."
    },
    "tasks": [
      {
        "id": "1AP-o1",
        "prompt": {
          "fr": "Calcule 13 + 5.",
          "ar": "احسب 13 + 5."
        },
        "answer": {
          "fr": "18",
          "ar": "18"
        },
        "hint": {
          "fr": "Décompose en dizaines et unités ; aligne les positions.",
          "ar": "فكّك الأعداد وحاذِ المراتب."
        },
        "method": {
          "fr": "13 + 5 = 18. Vérifie en retirant 5 : tu retrouves 13.",
          "ar": "13 + 5 = 18. للتحقق نطرح 5 فنجد 13."
        },
        "accepted": [
          "18"
        ]
      },
      {
        "id": "1AP-o2",
        "prompt": {
          "fr": "Calcule 13 − 5.",
          "ar": "احسب 13 − 5."
        },
        "answer": {
          "fr": "8",
          "ar": "8"
        },
        "hint": {
          "fr": "Tu peux chercher ce qu’il faut ajouter au plus petit nombre.",
          "ar": "يمكن البحث عما نضيفه إلى العدد الأصغر."
        },
        "method": {
          "fr": "13 − 5 = 8. Vérification : 8 + 5 = 13.",
          "ar": "13 − 5 = 8. التحقق: 8 + 5 = 13."
        },
        "accepted": [
          "8"
        ]
      },
      {
        "id": "1AP-o3",
        "prompt": {
          "fr": "Sami a 8 dattes, en reçoit 5 puis en mange 3. Combien en reste-t-il ?",
          "ar": "لسامي 8 تمرات، أخذ 5 أخرى ثم أكل 3. كم بقي؟"
        },
        "answer": {
          "fr": "10",
          "ar": "10"
        },
        "hint": {
          "fr": "Identifie ce qui entre et ce qui sort.",
          "ar": "حدّد ما نضيفه وما نحذفه."
        },
        "method": {
          "fr": "8 + 5 − 3 = 10. Le nombre de dattes doit tenir compte des deux actions.",
          "ar": "8 + 5 − 3 = 10. نأخذ العمليتين في الحساب."
        },
        "accepted": [
          "10"
        ]
      }
    ],
    "competenceIds": [
      "math-1ap-c-addition",
      "math-1ap-c-subtraction"
    ]
  },
  {
    "id": "1AP-measures",
    "grade": "1AP",
    "domain": "measures",
    "title": {
      "fr": "Mesures dans la vie quotidienne",
      "ar": "القياس في الحياة اليومية"
    },
    "objective": {
      "fr": "Résoudre une situation et écrire son unité.",
      "ar": "حل وضعية مع كتابة الوحدة."
    },
    "tasks": [
      {
        "id": "1AP-m1",
        "prompt": {
          "fr": "Un crayon mesure 8 cm, un autre 5 cm. Lequel est le plus long ?",
          "ar": "طول قلم 8 سم وطول آخر 5 سم. أيّهما أطول؟"
        },
        "answer": {
          "fr": "Le crayon de 8 cm.",
          "ar": "القلم ذو 8 سم."
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "8 > 5 ; compare des longueurs dans la même unité.",
          "ar": "8 > 5؛ نقارن طولين بالوحدة نفسها."
        }
      },
      {
        "id": "1AP-m2",
        "prompt": {
          "fr": "Tu as 20 DA et dépenses 10 DA. Combien reste-t-il ?",
          "ar": "معك 20 دج، أنفقت 10 دج. كم بقي؟"
        },
        "answer": {
          "fr": "10 DA",
          "ar": "10 دج"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "20 − 10 = 10 DA. Vérifie : 10 + 10 = 20.",
          "ar": "20 − 10 = 10 دج. التحقق: 10 + 10 = 20."
        },
        "accepted": [
          "10"
        ]
      },
      {
        "id": "1AP-m3",
        "prompt": {
          "fr": "Dessine un carré puis un triangle. Combien de côtés a chaque forme ?",
          "ar": "ارسم مربعاً ثم مثلثاً. كم ضلعاً لكل شكل؟"
        },
        "answer": {
          "fr": "Carré : 4 ; triangle : 3.",
          "ar": "المربع: 4؛ المثلث: 3."
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "Compte les segments droits : un carré en a quatre, un triangle trois.",
          "ar": "نعدّ القطع المستقيمة: للمربع أربعة أضلاع وللمثلث ثلاثة."
        }
      }
    ],
    "competenceIds": []
  },
  {
    "id": "2AP-numbers",
    "grade": "2AP",
    "domain": "numbers",
    "title": {
      "fr": "Nombres et repérage",
      "ar": "الأعداد والترتيب"
    },
    "objective": {
      "fr": "Lire les positions et justifier un ordre.",
      "ar": "تمييز المراتب وتبرير الترتيب."
    },
    "tasks": [
      {
        "id": "2AP-n1",
        "prompt": {
          "fr": "Écris le nombre qui suit 248.",
          "ar": "اكتب العدد الذي يأتي بعد 248."
        },
        "answer": {
          "fr": "249",
          "ar": "249"
        },
        "hint": {
          "fr": "Avance d’une unité.",
          "ar": "أضف وحدة واحدة."
        },
        "method": {
          "fr": "248 + 1 = 249. Le nombre augmente d’une unité.",
          "ar": "248 + 1 = 249. نزيد وحدة واحدة."
        },
        "accepted": [
          "249"
        ]
      },
      {
        "id": "2AP-n2",
        "prompt": {
          "fr": "Dans 248, quel est le chiffre des dizaines ?",
          "ar": "ما رقم العشرات في 248؟"
        },
        "answer": {
          "fr": "4",
          "ar": "4"
        },
        "hint": {
          "fr": "Repère le deuxième chiffre en partant de la droite.",
          "ar": "ابحث عن الرقم الثاني من اليمين."
        },
        "method": {
          "fr": "Le chiffre des dizaines est 4 ; sa valeur est 40. Ne confonds pas chiffre et valeur.",
          "ar": "رقم العشرات هو 4 وقيمته 40. نفرّق بين الرقم وقيمته."
        },
        "accepted": [
          "4"
        ]
      },
      {
        "id": "2AP-n3",
        "prompt": {
          "fr": "Range du plus petit au plus grand : 258, 247, 248.",
          "ar": "رتّب تصاعدياً: 258، 247، 248."
        },
        "answer": {
          "fr": "247 < 248 < 258",
          "ar": "247 < 248 < 258"
        },
        "hint": {
          "fr": "Compare d’abord les positions de plus grande valeur.",
          "ar": "قارن المراتب الأكبر أولاً."
        },
        "method": {
          "fr": "Compare les chiffres de gauche à droite. Explique pourquoi le premier nombre est le plus petit.",
          "ar": "قارن الأرقام من اليسار إلى اليمين واشرح لماذا العدد الأول هو الأصغر."
        }
      }
    ],
    "competenceIds": [
      "math-2ap-c-numbers-999"
    ]
  },
  {
    "id": "2AP-operations",
    "grade": "2AP",
    "domain": "operations",
    "title": {
      "fr": "Calcul et problèmes",
      "ar": "الحساب والمسائل"
    },
    "objective": {
      "fr": "Choisir une opération, calculer puis vérifier.",
      "ar": "اختيار العملية والحساب والتحقق."
    },
    "tasks": [
      {
        "id": "2AP-o1",
        "prompt": {
          "fr": "Calcule 157 + 38.",
          "ar": "احسب 157 + 38."
        },
        "answer": {
          "fr": "195",
          "ar": "195"
        },
        "hint": {
          "fr": "Décompose en dizaines et unités ; aligne les positions.",
          "ar": "فكّك الأعداد وحاذِ المراتب."
        },
        "method": {
          "fr": "157 + 38 = 195. Vérifie en retirant 38 : tu retrouves 157.",
          "ar": "157 + 38 = 195. للتحقق نطرح 38 فنجد 157."
        },
        "accepted": [
          "195"
        ]
      },
      {
        "id": "2AP-o2",
        "prompt": {
          "fr": "Calcule 157 − 38.",
          "ar": "احسب 157 − 38."
        },
        "answer": {
          "fr": "119",
          "ar": "119"
        },
        "hint": {
          "fr": "Tu peux chercher ce qu’il faut ajouter au plus petit nombre.",
          "ar": "يمكن البحث عما نضيفه إلى العدد الأصغر."
        },
        "method": {
          "fr": "157 − 38 = 119. Vérification : 119 + 38 = 157.",
          "ar": "157 − 38 = 119. التحقق: 119 + 38 = 157."
        },
        "accepted": [
          "119"
        ]
      },
      {
        "id": "2AP-o3",
        "prompt": {
          "fr": "7 boîtes contiennent chacune 4 crayons. Combien de crayons en tout ?",
          "ar": "لدينا 7 علب، في كل علبة 4 أقلام. كم قلماً في المجموع؟"
        },
        "answer": {
          "fr": "28",
          "ar": "28"
        },
        "hint": {
          "fr": "Dessine des groupes égaux.",
          "ar": "ارسم مجموعات متساوية."
        },
        "method": {
          "fr": "7 × 4 = 28. Chaque boîte contient la même quantité.",
          "ar": "7 × 4 = 28. العلب تحتوي العدد نفسه."
        },
        "accepted": [
          "28"
        ]
      }
    ],
    "competenceIds": [
      "math-2ap-c-addition-carry",
      "math-2ap-c-subtraction",
      "math-2ap-c-multiplication"
    ]
  },
  {
    "id": "2AP-measures",
    "grade": "2AP",
    "domain": "measures",
    "title": {
      "fr": "Mesures dans la vie quotidienne",
      "ar": "القياس في الحياة اليومية"
    },
    "objective": {
      "fr": "Résoudre une situation et écrire son unité.",
      "ar": "حل وضعية مع كتابة الوحدة."
    },
    "tasks": [
      {
        "id": "2AP-m1",
        "prompt": {
          "fr": "Une bouteille contient 1 L. Combien de litres dans 3 bouteilles identiques ?",
          "ar": "في قارورة 1 لتر. كم لتراً في 3 قوارير مماثلة؟"
        },
        "answer": {
          "fr": "3 L",
          "ar": "3 لترات"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "1 + 1 + 1 = 3 L.",
          "ar": "1 + 1 + 1 = 3 لترات."
        },
        "accepted": [
          "3"
        ]
      },
      {
        "id": "2AP-m2",
        "prompt": {
          "fr": "Tu paies 65 DA avec 100 DA. Quelle monnaie reçoit-on ?",
          "ar": "دفعت 100 دج لشراء شيء ثمنه 65 دج. كم تُرجع لك؟"
        },
        "answer": {
          "fr": "35 DA",
          "ar": "35 دج"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "100 − 65 = 35 DA. Vérifie 65 + 35 = 100.",
          "ar": "100 − 65 = 35 دج. نتحقق: 65 + 35 = 100."
        },
        "accepted": [
          "35"
        ]
      },
      {
        "id": "2AP-m3",
        "prompt": {
          "fr": "Il est 8 h. Une sortie dure 2 heures. À quelle heure finit-elle ?",
          "ar": "الساعة الثامنة. تدوم الرحلة ساعتين. متى تنتهي؟"
        },
        "answer": {
          "fr": "10 h",
          "ar": "الساعة 10"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "8 + 2 = 10 : on ajoute la durée à l’heure de départ.",
          "ar": "8 + 2 = 10. نضيف المدة إلى وقت البداية."
        },
        "accepted": [
          "10"
        ]
      }
    ],
    "competenceIds": []
  },
  {
    "id": "3AP-numbers",
    "grade": "3AP",
    "domain": "numbers",
    "title": {
      "fr": "Nombres et repérage",
      "ar": "الأعداد والترتيب"
    },
    "objective": {
      "fr": "Lire les positions et justifier un ordre.",
      "ar": "تمييز المراتب وتبرير الترتيب."
    },
    "tasks": [
      {
        "id": "3AP-n1",
        "prompt": {
          "fr": "Écris le nombre qui suit 748.",
          "ar": "اكتب العدد الذي يأتي بعد 748."
        },
        "answer": {
          "fr": "749",
          "ar": "749"
        },
        "hint": {
          "fr": "Avance d’une unité.",
          "ar": "أضف وحدة واحدة."
        },
        "method": {
          "fr": "748 + 1 = 749. Le nombre augmente d’une unité.",
          "ar": "748 + 1 = 749. نزيد وحدة واحدة."
        },
        "accepted": [
          "749"
        ]
      },
      {
        "id": "3AP-n2",
        "prompt": {
          "fr": "Dans 748, quel est le chiffre des dizaines ?",
          "ar": "ما رقم العشرات في 748؟"
        },
        "answer": {
          "fr": "4",
          "ar": "4"
        },
        "hint": {
          "fr": "Repère le deuxième chiffre en partant de la droite.",
          "ar": "ابحث عن الرقم الثاني من اليمين."
        },
        "method": {
          "fr": "Le chiffre des dizaines est 4 ; sa valeur est 40. Ne confonds pas chiffre et valeur.",
          "ar": "رقم العشرات هو 4 وقيمته 40. نفرّق بين الرقم وقيمته."
        },
        "accepted": [
          "4"
        ]
      },
      {
        "id": "3AP-n3",
        "prompt": {
          "fr": "Range du plus petit au plus grand : 758, 747, 748.",
          "ar": "رتّب تصاعدياً: 758، 747، 748."
        },
        "answer": {
          "fr": "747 < 748 < 758",
          "ar": "747 < 748 < 758"
        },
        "hint": {
          "fr": "Compare d’abord les positions de plus grande valeur.",
          "ar": "قارن المراتب الأكبر أولاً."
        },
        "method": {
          "fr": "Compare les chiffres de gauche à droite. Explique pourquoi le premier nombre est le plus petit.",
          "ar": "قارن الأرقام من اليسار إلى اليمين واشرح لماذا العدد الأول هو الأصغر."
        }
      }
    ],
    "competenceIds": []
  },
  {
    "id": "3AP-operations",
    "grade": "3AP",
    "domain": "operations",
    "title": {
      "fr": "Calcul et problèmes",
      "ar": "الحساب والمسائل"
    },
    "objective": {
      "fr": "Choisir une opération, calculer puis vérifier.",
      "ar": "اختيار العملية والحساب والتحقق."
    },
    "tasks": [
      {
        "id": "3AP-o1",
        "prompt": {
          "fr": "Calcule 356 + 178.",
          "ar": "احسب 356 + 178."
        },
        "answer": {
          "fr": "534",
          "ar": "534"
        },
        "hint": {
          "fr": "Décompose en dizaines et unités ; aligne les positions.",
          "ar": "فكّك الأعداد وحاذِ المراتب."
        },
        "method": {
          "fr": "356 + 178 = 534. Vérifie en retirant 178 : tu retrouves 356.",
          "ar": "356 + 178 = 534. للتحقق نطرح 178 فنجد 356."
        },
        "accepted": [
          "534"
        ]
      },
      {
        "id": "3AP-o2",
        "prompt": {
          "fr": "Calcule 356 − 178.",
          "ar": "احسب 356 − 178."
        },
        "answer": {
          "fr": "178",
          "ar": "178"
        },
        "hint": {
          "fr": "Tu peux chercher ce qu’il faut ajouter au plus petit nombre.",
          "ar": "يمكن البحث عما نضيفه إلى العدد الأصغر."
        },
        "method": {
          "fr": "356 − 178 = 178. Vérification : 178 + 178 = 356.",
          "ar": "356 − 178 = 178. التحقق: 178 + 178 = 356."
        },
        "accepted": [
          "178"
        ]
      },
      {
        "id": "3AP-o3",
        "prompt": {
          "fr": "6 boîtes contiennent chacune 8 crayons. Combien de crayons en tout ?",
          "ar": "لدينا 6 علب، في كل علبة 8 أقلام. كم قلماً في المجموع؟"
        },
        "answer": {
          "fr": "48",
          "ar": "48"
        },
        "hint": {
          "fr": "Dessine des groupes égaux.",
          "ar": "ارسم مجموعات متساوية."
        },
        "method": {
          "fr": "6 × 8 = 48. Chaque boîte contient la même quantité.",
          "ar": "6 × 8 = 48. العلب تحتوي العدد نفسه."
        },
        "accepted": [
          "48"
        ]
      }
    ],
    "competenceIds": []
  },
  {
    "id": "3AP-measures",
    "grade": "3AP",
    "domain": "measures",
    "title": {
      "fr": "Mesures dans la vie quotidienne",
      "ar": "القياس في الحياة اليومية"
    },
    "objective": {
      "fr": "Résoudre une situation et écrire son unité.",
      "ar": "حل وضعية مع كتابة الوحدة."
    },
    "tasks": [
      {
        "id": "3AP-m1",
        "prompt": {
          "fr": "Convertis 2 m et 35 cm en cm.",
          "ar": "حوّل 2 م و35 سم إلى سم."
        },
        "answer": {
          "fr": "235 cm",
          "ar": "235 سم"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "2 m = 200 cm ; 200 + 35 = 235 cm.",
          "ar": "2 م = 200 سم؛ 200 + 35 = 235 سم."
        },
        "accepted": [
          "235"
        ]
      },
      {
        "id": "3AP-m2",
        "prompt": {
          "fr": "Un rectangle mesure 8 cm sur 4 cm. Calcule son périmètre.",
          "ar": "مستطيل طوله 8 سم وعرضه 4 سم. احسب محيطه."
        },
        "answer": {
          "fr": "24 cm",
          "ar": "24 سم"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "8 + 4 + 8 + 4 = 24 cm. Le périmètre est le tour, pas la surface.",
          "ar": "8 + 4 + 8 + 4 = 24 سم. المحيط هو طول الحدود وليس المساحة."
        },
        "accepted": [
          "24"
        ]
      },
      {
        "id": "3AP-m3",
        "prompt": {
          "fr": "3 cahiers coûtent chacun 125 DA. Calcule le prix total.",
          "ar": "ثمن الكراس 125 دج. ما ثمن 3 كراسات؟"
        },
        "answer": {
          "fr": "375 DA",
          "ar": "375 دج"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "125 × 3 = 375 DA ; vérifie par addition répétée.",
          "ar": "125 × 3 = 375 دج. نتحقق بالجمع المتكرر."
        },
        "accepted": [
          "375"
        ]
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-numbers",
    "grade": "4AP",
    "domain": "numbers",
    "title": {
      "fr": "Nombres et repérage",
      "ar": "الأعداد والترتيب"
    },
    "objective": {
      "fr": "Lire les positions et justifier un ordre.",
      "ar": "تمييز المراتب وتبرير الترتيب."
    },
    "tasks": [
      {
        "id": "4AP-n1",
        "prompt": {
          "fr": "Écris le nombre qui suit 12348.",
          "ar": "اكتب العدد الذي يأتي بعد 12348."
        },
        "answer": {
          "fr": "12349",
          "ar": "12349"
        },
        "hint": {
          "fr": "Avance d’une unité.",
          "ar": "أضف وحدة واحدة."
        },
        "method": {
          "fr": "12348 + 1 = 12349. Le nombre augmente d’une unité.",
          "ar": "12348 + 1 = 12349. نزيد وحدة واحدة."
        },
        "accepted": [
          "12349"
        ]
      },
      {
        "id": "4AP-n2",
        "prompt": {
          "fr": "Dans 12348, quel est le chiffre des dizaines ?",
          "ar": "ما رقم العشرات في 12348؟"
        },
        "answer": {
          "fr": "4",
          "ar": "4"
        },
        "hint": {
          "fr": "Repère le deuxième chiffre en partant de la droite.",
          "ar": "ابحث عن الرقم الثاني من اليمين."
        },
        "method": {
          "fr": "Le chiffre des dizaines est 4 ; sa valeur est 40. Ne confonds pas chiffre et valeur.",
          "ar": "رقم العشرات هو 4 وقيمته 40. نفرّق بين الرقم وقيمته."
        },
        "accepted": [
          "4"
        ]
      },
      {
        "id": "4AP-n3",
        "prompt": {
          "fr": "Range du plus petit au plus grand : 12358, 12347, 12348.",
          "ar": "رتّب تصاعدياً: 12358، 12347، 12348."
        },
        "answer": {
          "fr": "12347 < 12348 < 12358",
          "ar": "12347 < 12348 < 12358"
        },
        "hint": {
          "fr": "Compare d’abord les positions de plus grande valeur.",
          "ar": "قارن المراتب الأكبر أولاً."
        },
        "method": {
          "fr": "Compare les chiffres de gauche à droite. Explique pourquoi le premier nombre est le plus petit.",
          "ar": "قارن الأرقام من اليسار إلى اليمين واشرح لماذا العدد الأول هو الأصغر."
        }
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-operations",
    "grade": "4AP",
    "domain": "operations",
    "title": {
      "fr": "Calcul et problèmes",
      "ar": "الحساب والمسائل"
    },
    "objective": {
      "fr": "Choisir une opération, calculer puis vérifier.",
      "ar": "اختيار العملية والحساب والتحقق."
    },
    "tasks": [
      {
        "id": "4AP-o1",
        "prompt": {
          "fr": "Calcule 2468 + 1579.",
          "ar": "احسب 2468 + 1579."
        },
        "answer": {
          "fr": "4047",
          "ar": "4047"
        },
        "hint": {
          "fr": "Décompose en dizaines et unités ; aligne les positions.",
          "ar": "فكّك الأعداد وحاذِ المراتب."
        },
        "method": {
          "fr": "2468 + 1579 = 4047. Vérifie en retirant 1579 : tu retrouves 2468.",
          "ar": "2468 + 1579 = 4047. للتحقق نطرح 1579 فنجد 2468."
        },
        "accepted": [
          "4047"
        ]
      },
      {
        "id": "4AP-o2",
        "prompt": {
          "fr": "Calcule 2468 − 1579.",
          "ar": "احسب 2468 − 1579."
        },
        "answer": {
          "fr": "889",
          "ar": "889"
        },
        "hint": {
          "fr": "Tu peux chercher ce qu’il faut ajouter au plus petit nombre.",
          "ar": "يمكن البحث عما نضيفه إلى العدد الأصغر."
        },
        "method": {
          "fr": "2468 − 1579 = 889. Vérification : 889 + 1579 = 2468.",
          "ar": "2468 − 1579 = 889. التحقق: 889 + 1579 = 2468."
        },
        "accepted": [
          "889"
        ]
      },
      {
        "id": "4AP-o3",
        "prompt": {
          "fr": "8 boîtes contiennent chacune 12 crayons. Combien de crayons en tout ?",
          "ar": "لدينا 8 علب، في كل علبة 12 أقلام. كم قلماً في المجموع؟"
        },
        "answer": {
          "fr": "96",
          "ar": "96"
        },
        "hint": {
          "fr": "Dessine des groupes égaux.",
          "ar": "ارسم مجموعات متساوية."
        },
        "method": {
          "fr": "8 × 12 = 96. Chaque boîte contient la même quantité.",
          "ar": "8 × 12 = 96. العلب تحتوي العدد نفسه."
        },
        "accepted": [
          "96"
        ]
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-measures",
    "grade": "4AP",
    "domain": "measures",
    "title": {
      "fr": "Mesures dans la vie quotidienne",
      "ar": "القياس في الحياة اليومية"
    },
    "objective": {
      "fr": "Résoudre une situation et écrire son unité.",
      "ar": "حل وضعية مع كتابة الوحدة."
    },
    "tasks": [
      {
        "id": "4AP-m1",
        "prompt": {
          "fr": "Convertis 3 kg et 250 g en grammes.",
          "ar": "حوّل 3 كغ و250 غ إلى الغرام."
        },
        "answer": {
          "fr": "3 250 g",
          "ar": "3250 غ"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "3 kg = 3 000 g ; ajoute 250 g.",
          "ar": "3 كغ = 3000 غ. نضيف 250 غ."
        },
        "accepted": [
          "3250"
        ]
      },
      {
        "id": "4AP-m2",
        "prompt": {
          "fr": "Un rectangle mesure 12 cm sur 6 cm. Calcule son périmètre.",
          "ar": "مستطيل طوله 12 سم وعرضه 6 سم. احسب محيطه."
        },
        "answer": {
          "fr": "36 cm",
          "ar": "36 سم"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "2 × (12 + 6) = 36 cm. Ne multiplie pas longueur et largeur pour le périmètre.",
          "ar": "2 × (12 + 6) = 36 سم. لا نضرب الطول في العرض لحساب المحيط."
        },
        "accepted": [
          "36"
        ]
      },
      {
        "id": "4AP-m3",
        "prompt": {
          "fr": "24 biscuits sont partagés équitablement entre 6 enfants. Combien chacun reçoit-il ?",
          "ar": "نوزّع 24 قطعة حلوى بالتساوي على 6 أطفال. كم يأخذ كل طفل؟"
        },
        "answer": {
          "fr": "4 biscuits",
          "ar": "4 قطع"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "24 ÷ 6 = 4. Vérifie 6 × 4 = 24.",
          "ar": "24 ÷ 6 = 4. التحقق: 6 × 4 = 24."
        },
        "accepted": [
          "4"
        ]
      }
    ],
    "competenceIds": []
  },
  {
    "id": "5AP-numbers",
    "grade": "5AP",
    "domain": "numbers",
    "title": {
      "fr": "Nombres et repérage",
      "ar": "الأعداد والترتيب"
    },
    "objective": {
      "fr": "Lire les positions et justifier un ordre.",
      "ar": "تمييز المراتب وتبرير الترتيب."
    },
    "tasks": [
      {
        "id": "5AP-n1",
        "prompt": {
          "fr": "Écris le nombre qui suit 123456.",
          "ar": "اكتب العدد الذي يأتي بعد 123456."
        },
        "answer": {
          "fr": "123457",
          "ar": "123457"
        },
        "hint": {
          "fr": "Avance d’une unité.",
          "ar": "أضف وحدة واحدة."
        },
        "method": {
          "fr": "123456 + 1 = 123457. Le nombre augmente d’une unité.",
          "ar": "123456 + 1 = 123457. نزيد وحدة واحدة."
        },
        "accepted": [
          "123457"
        ]
      },
      {
        "id": "5AP-n2",
        "prompt": {
          "fr": "Dans 123456, quel est le chiffre des dizaines ?",
          "ar": "ما رقم العشرات في 123456؟"
        },
        "answer": {
          "fr": "5",
          "ar": "5"
        },
        "hint": {
          "fr": "Repère le deuxième chiffre en partant de la droite.",
          "ar": "ابحث عن الرقم الثاني من اليمين."
        },
        "method": {
          "fr": "Le chiffre des dizaines est 5 ; sa valeur est 50. Ne confonds pas chiffre et valeur.",
          "ar": "رقم العشرات هو 5 وقيمته 50. نفرّق بين الرقم وقيمته."
        },
        "accepted": [
          "5"
        ]
      },
      {
        "id": "5AP-n3",
        "prompt": {
          "fr": "Range du plus petit au plus grand : 123466, 123455, 123456.",
          "ar": "رتّب تصاعدياً: 123466، 123455، 123456."
        },
        "answer": {
          "fr": "123455 < 123456 < 123466",
          "ar": "123455 < 123456 < 123466"
        },
        "hint": {
          "fr": "Compare d’abord les positions de plus grande valeur.",
          "ar": "قارن المراتب الأكبر أولاً."
        },
        "method": {
          "fr": "Compare les chiffres de gauche à droite. Explique pourquoi le premier nombre est le plus petit.",
          "ar": "قارن الأرقام من اليسار إلى اليمين واشرح لماذا العدد الأول هو الأصغر."
        }
      }
    ],
    "competenceIds": [
      "math-5ap-c-large-numbers"
    ]
  },
  {
    "id": "5AP-operations",
    "grade": "5AP",
    "domain": "operations",
    "title": {
      "fr": "Calcul et problèmes",
      "ar": "الحساب والمسائل"
    },
    "objective": {
      "fr": "Choisir une opération, calculer puis vérifier.",
      "ar": "اختيار العملية والحساب والتحقق."
    },
    "tasks": [
      {
        "id": "5AP-o1",
        "prompt": {
          "fr": "Calcule 3750 + 1485.",
          "ar": "احسب 3750 + 1485."
        },
        "answer": {
          "fr": "5235",
          "ar": "5235"
        },
        "hint": {
          "fr": "Décompose en dizaines et unités ; aligne les positions.",
          "ar": "فكّك الأعداد وحاذِ المراتب."
        },
        "method": {
          "fr": "3750 + 1485 = 5235. Vérifie en retirant 1485 : tu retrouves 3750.",
          "ar": "3750 + 1485 = 5235. للتحقق نطرح 1485 فنجد 3750."
        },
        "accepted": [
          "5235"
        ]
      },
      {
        "id": "5AP-o2",
        "prompt": {
          "fr": "Calcule 3750 − 1485.",
          "ar": "احسب 3750 − 1485."
        },
        "answer": {
          "fr": "2265",
          "ar": "2265"
        },
        "hint": {
          "fr": "Tu peux chercher ce qu’il faut ajouter au plus petit nombre.",
          "ar": "يمكن البحث عما نضيفه إلى العدد الأصغر."
        },
        "method": {
          "fr": "3750 − 1485 = 2265. Vérification : 2265 + 1485 = 3750.",
          "ar": "3750 − 1485 = 2265. التحقق: 2265 + 1485 = 3750."
        },
        "accepted": [
          "2265"
        ]
      },
      {
        "id": "5AP-o3",
        "prompt": {
          "fr": "12 boîtes contiennent chacune 25 crayons. Combien de crayons en tout ?",
          "ar": "لدينا 12 علب، في كل علبة 25 أقلام. كم قلماً في المجموع؟"
        },
        "answer": {
          "fr": "300",
          "ar": "300"
        },
        "hint": {
          "fr": "Dessine des groupes égaux.",
          "ar": "ارسم مجموعات متساوية."
        },
        "method": {
          "fr": "12 × 25 = 300. Chaque boîte contient la même quantité.",
          "ar": "12 × 25 = 300. العلب تحتوي العدد نفسه."
        },
        "accepted": [
          "300"
        ]
      }
    ],
    "competenceIds": [
      "math-5ap-c-operations"
    ]
  },
  {
    "id": "5AP-measures",
    "grade": "5AP",
    "domain": "measures",
    "title": {
      "fr": "Mesures dans la vie quotidienne",
      "ar": "القياس في الحياة اليومية"
    },
    "objective": {
      "fr": "Résoudre une situation et écrire son unité.",
      "ar": "حل وضعية مع كتابة الوحدة."
    },
    "tasks": [
      {
        "id": "5AP-m1",
        "prompt": {
          "fr": "Une sortie de 2,5 km se poursuit sur 750 m. Quelle distance totale en mètres ?",
          "ar": "قطعنا 2,5 كم ثم 750 م. ما المسافة الكلية بالمتر؟"
        },
        "answer": {
          "fr": "3 250 m",
          "ar": "3250 م"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "2,5 km = 2 500 m ; 2 500 + 750 = 3 250 m.",
          "ar": "2,5 كم = 2500 م؛ 2500 + 750 = 3250 م."
        },
        "accepted": [
          "3250"
        ]
      },
      {
        "id": "5AP-m2",
        "prompt": {
          "fr": "Un rectangle mesure 25 m sur 8 m. Calcule son aire.",
          "ar": "مستطيل طوله 25 م وعرضه 8 م. احسب مساحته."
        },
        "answer": {
          "fr": "200 m²",
          "ar": "200 م²"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "25 × 8 = 200 m². L’aire mesure la surface ; le périmètre serait 66 m.",
          "ar": "25 × 8 = 200 م². المساحة تقيس السطح، أما المحيط فهو 66 م."
        },
        "accepted": [
          "200"
        ]
      },
      {
        "id": "5AP-m3",
        "prompt": {
          "fr": "Une famille achète 3 billets à 1 250 DA et paie avec 5 000 DA. Quelle monnaie reçoit-elle ?",
          "ar": "اشترت أسرة 3 تذاكر بثمن 1250 دج للتذكرة ودفعت 5000 دج. كم تُرجع لها؟"
        },
        "answer": {
          "fr": "1 250 DA",
          "ar": "1250 دج"
        },
        "hint": {
          "fr": "Écris les données et conserve la bonne unité.",
          "ar": "اكتب المعطيات وحافظ على الوحدة الصحيحة."
        },
        "method": {
          "fr": "3 × 1 250 = 3 750 DA ; 5 000 − 3 750 = 1 250 DA.",
          "ar": "3 × 1250 = 3750 دج؛ 5000 − 3750 = 1250 دج."
        },
        "accepted": [
          "1250"
        ]
      }
    ],
    "competenceIds": [
      "math-5ap-c-measures",
      "math-5ap-c-areas"
    ]
  },
  {
    "id": "1AP-reading",
    "grade": "1AP",
    "domain": "reading",
    "title": {
      "fr": "Arabe : lire, comprendre, justifier",
      "ar": "أقرأ وأفهم وأبرّر"
    },
    "objective": {
      "fr": "Distinguer ce qui est écrit de ce que l’on déduit.",
      "ar": "التمييز بين المعلومة الصريحة والاستنتاج."
    },
    "tasks": [
      {
        "id": "1AP-r1",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : أَيْنَ الْقِطَّةُ؟",
          "ar": "أَيْنَ الْقِطَّةُ؟"
        },
        "answer": {
          "fr": "تَحْتَ الشَّجَرَةِ.",
          "ar": "تَحْتَ الشَّجَرَةِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "1AP-r2",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَنْ سَقَى الشَّجَرَةَ؟",
          "ar": "مَنْ سَقَى الشَّجَرَةَ؟"
        },
        "answer": {
          "fr": "سَامِي.",
          "ar": "سَامِي."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "1AP-r3",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : لِمَاذَا نَسْقِي الشَّجَرَةَ؟",
          "ar": "لِمَاذَا نَسْقِي الشَّجَرَةَ؟"
        },
        "answer": {
          "fr": "لِكَيْ تَنْمُوَ. يُقْبَلُ: لِأَنَّهَا تَحْتَاجُ الْمَاءَ.",
          "ar": "لِكَيْ تَنْمُوَ. يُقْبَلُ: لِأَنَّهَا تَحْتَاجُ الْمَاءَ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [
      "ar-1ap-c-themes"
    ],
    "text": {
      "fr": "فِي الْحَدِيقَةِ شَجَرَةٌ. تَحْتَ الشَّجَرَةِ قِطَّةٌ. سَقَى سَامِي الشَّجَرَةَ.",
      "ar": "فِي الْحَدِيقَةِ شَجَرَةٌ. تَحْتَ الشَّجَرَةِ قِطَّةٌ. سَقَى سَامِي الشَّجَرَةَ."
    },
    "language": "ar"
  },
  {
    "id": "1AP-writing",
    "grade": "1AP",
    "domain": "writing",
    "title": {
      "fr": "Arabe : écrire et se relire",
      "ar": "أكتب وأراجع"
    },
    "objective": {
      "fr": "Produire une réponse puis la vérifier avec des critères.",
      "ar": "كتابة إجابة ومراجعتها وفق معايير."
    },
    "tasks": [
      {
        "id": "1AP-w1",
        "prompt": {
          "fr": "Réponds en arabe : أَكْمِلْ: ذَهَبَ سَامِي إِلَى …",
          "ar": "أَكْمِلْ: ذَهَبَ سَامِي إِلَى …"
        },
        "answer": {
          "fr": "الْمَدْرَسَةِ. تُقْبَلُ كَلِمَةٌ مُنَاسِبَةٌ أُخْرَى.",
          "ar": "الْمَدْرَسَةِ. تُقْبَلُ كَلِمَةٌ مُنَاسِبَةٌ أُخْرَى."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : جُمْلَةٌ مُفِيدَةٌ؛ يُسَاعِدُ الْوَالِدُ فِي قِرَاءَةِ التَّعْلِيمَةِ.",
          "ar": "جُمْلَةٌ مُفِيدَةٌ؛ يُسَاعِدُ الْوَالِدُ فِي قِرَاءَةِ التَّعْلِيمَةِ."
        },
        "language": "ar"
      },
      {
        "id": "1AP-w2",
        "prompt": {
          "fr": "Réponds en arabe : رَتِّبْ: الْقِطَّةُ — تَنَامُ.",
          "ar": "رَتِّبْ: الْقِطَّةُ — تَنَامُ."
        },
        "answer": {
          "fr": "تَنَامُ الْقِطَّةُ. أَوْ: الْقِطَّةُ تَنَامُ.",
          "ar": "تَنَامُ الْقِطَّةُ. أَوْ: الْقِطَّةُ تَنَامُ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : يُقْبَلُ التَّرْتِيبَانِ لِأَنَّ الْمَعْنَى صَحِيحٌ.",
          "ar": "يُقْبَلُ التَّرْتِيبَانِ لِأَنَّ الْمَعْنَى صَحِيحٌ."
        },
        "language": "ar"
      },
      {
        "id": "1AP-w3",
        "prompt": {
          "fr": "Réponds en arabe : قُلْ جُمْلَةً عَنْ حَدِيقَتِكَ ثُمَّ اكْتُبْهَا بِمُسَاعَدَةٍ.",
          "ar": "قُلْ جُمْلَةً عَنْ حَدِيقَتِكَ ثُمَّ اكْتُبْهَا بِمُسَاعَدَةٍ."
        },
        "answer": {
          "fr": "مِثَالٌ: فِي حَدِيقَتِي شَجَرَةٌ.",
          "ar": "مِثَالٌ: فِي حَدِيقَتِي شَجَرَةٌ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نُقَيِّمُ الْمَعْنَى، وَالْفَصْلَ بَيْنَ الْكَلِمَاتِ، وَوُضُوحَ الْحُرُوفِ؛ لَا نَفْرِضُ نَصّاً وَاحِداً.",
          "ar": "نُقَيِّمُ الْمَعْنَى، وَالْفَصْلَ بَيْنَ الْكَلِمَاتِ، وَوُضُوحَ الْحُرُوفِ؛ لَا نَفْرِضُ نَصّاً وَاحِداً."
        },
        "language": "ar"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "2AP-reading",
    "grade": "2AP",
    "domain": "reading",
    "title": {
      "fr": "Arabe : lire, comprendre, justifier",
      "ar": "أقرأ وأفهم وأبرّر"
    },
    "objective": {
      "fr": "Distinguer ce qui est écrit de ce que l’on déduit.",
      "ar": "التمييز بين المعلومة الصريحة والاستنتاج."
    },
    "tasks": [
      {
        "id": "2AP-r1",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَتَى زَارَتْ لَيْلَى الْمَكْتَبَةَ؟",
          "ar": "مَتَى زَارَتْ لَيْلَى الْمَكْتَبَةَ؟"
        },
        "answer": {
          "fr": "يَوْمَ الْخَمِيسِ.",
          "ar": "يَوْمَ الْخَمِيسِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "2AP-r2",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : عَمَّ تَتَحَدَّثُ الْقِصَّةُ؟",
          "ar": "عَمَّ تَتَحَدَّثُ الْقِصَّةُ؟"
        },
        "answer": {
          "fr": "عَنِ الْبَحْرِ.",
          "ar": "عَنِ الْبَحْرِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "2AP-r3",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : لِمَاذَا أَعَادَتِ الْكِتَابَ؟",
          "ar": "لِمَاذَا أَعَادَتِ الْكِتَابَ؟"
        },
        "answer": {
          "fr": "لِتَقْرَأَهُ صَدِيقَتُهَا أَيْضاً.",
          "ar": "لِتَقْرَأَهُ صَدِيقَتُهَا أَيْضاً."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [],
    "text": {
      "fr": "زَارَتْ لَيْلَى الْمَكْتَبَةَ يَوْمَ الْخَمِيسِ. اخْتَارَتْ قِصَّةً عَنِ الْبَحْرِ. أَعَادَتِ الْكِتَابَ بَعْدَ أَنْ قَرَأَتْهُ لِتَتْرُكَ فُرْصَةً لِصَدِيقَتِهَا.",
      "ar": "زَارَتْ لَيْلَى الْمَكْتَبَةَ يَوْمَ الْخَمِيسِ. اخْتَارَتْ قِصَّةً عَنِ الْبَحْرِ. أَعَادَتِ الْكِتَابَ بَعْدَ أَنْ قَرَأَتْهُ لِتَتْرُكَ فُرْصَةً لِصَدِيقَتِهَا."
    },
    "language": "ar"
  },
  {
    "id": "2AP-writing",
    "grade": "2AP",
    "domain": "writing",
    "title": {
      "fr": "Arabe : écrire et se relire",
      "ar": "أكتب وأراجع"
    },
    "objective": {
      "fr": "Produire une réponse puis la vérifier avec des critères.",
      "ar": "كتابة إجابة ومراجعتها وفق معايير."
    },
    "tasks": [
      {
        "id": "2AP-w1",
        "prompt": {
          "fr": "Réponds en arabe : رَتِّبْ: الْحَدِيقَةَ — نَظَّفَ — أَمِينٌ.",
          "ar": "رَتِّبْ: الْحَدِيقَةَ — نَظَّفَ — أَمِينٌ."
        },
        "answer": {
          "fr": "نَظَّفَ أَمِينٌ الْحَدِيقَةَ.",
          "ar": "نَظَّفَ أَمِينٌ الْحَدِيقَةَ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نَبْدَأُ بِالْفِعْلِ ثُمَّ مَنْ قَامَ بِهِ ثُمَّ الْمَفْعُولِ.",
          "ar": "نَبْدَأُ بِالْفِعْلِ ثُمَّ مَنْ قَامَ بِهِ ثُمَّ الْمَفْعُولِ."
        },
        "language": "ar"
      },
      {
        "id": "2AP-w2",
        "prompt": {
          "fr": "Réponds en arabe : أَكْمِلْ بِجَمْعِ كَلِمَةِ كِتَابٍ: هَذِهِ … مُفِيدَةٌ.",
          "ar": "أَكْمِلْ بِجَمْعِ كَلِمَةِ كِتَابٍ: هَذِهِ … مُفِيدَةٌ."
        },
        "answer": {
          "fr": "كُتُبٌ.",
          "ar": "كُتُبٌ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : جَمْعُ كِتَابٍ هُوَ كُتُبٌ.",
          "ar": "جَمْعُ كِتَابٍ هُوَ كُتُبٌ."
        },
        "language": "ar"
      },
      {
        "id": "2AP-w3",
        "prompt": {
          "fr": "Réponds en arabe : اكْتُبْ جُمْلَتَيْنِ عَنْ زِيَارَةِ الْمَكْتَبَةِ.",
          "ar": "اكْتُبْ جُمْلَتَيْنِ عَنْ زِيَارَةِ الْمَكْتَبَةِ."
        },
        "answer": {
          "fr": "مِثَالٌ: زُرْتُ الْمَكْتَبَةَ. قَرَأْتُ قِصَّةً.",
          "ar": "مِثَالٌ: زُرْتُ الْمَكْتَبَةَ. قَرَأْتُ قِصَّةً."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : جُمْلَتَانِ مُفِيدَتَانِ، تَرْتِيبٌ مَنْطِقِيٌّ، وَنُقْطَةٌ فِي النِّهَايَةِ.",
          "ar": "جُمْلَتَانِ مُفِيدَتَانِ، تَرْتِيبٌ مَنْطِقِيٌّ، وَنُقْطَةٌ فِي النِّهَايَةِ."
        },
        "language": "ar"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "3AP-reading",
    "grade": "3AP",
    "domain": "reading",
    "title": {
      "fr": "Arabe : lire, comprendre, justifier",
      "ar": "أقرأ وأفهم وأبرّر"
    },
    "objective": {
      "fr": "Distinguer ce qui est écrit de ce que l’on déduit.",
      "ar": "التمييز بين المعلومة الصريحة والاستنتاج."
    },
    "tasks": [
      {
        "id": "3AP-r1",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَاذَا جَمَعَ الطِّفْلَانِ؟",
          "ar": "مَاذَا جَمَعَ الطِّفْلَانِ؟"
        },
        "answer": {
          "fr": "الْوَرَقَ وَالْقَوَارِيرَ.",
          "ar": "الْوَرَقَ وَالْقَوَارِيرَ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "3AP-r2",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : لِمَاذَا اسْتَعْمَلَا كِيسَيْنِ مُخْتَلِفَيْنِ؟",
          "ar": "لِمَاذَا اسْتَعْمَلَا كِيسَيْنِ مُخْتَلِفَيْنِ؟"
        },
        "answer": {
          "fr": "لِفَرْزِ النُّفَايَاتِ؛ وَهُوَ اسْتِنْتَاجٌ مِنَ الْكِيسَيْنِ.",
          "ar": "لِفَرْزِ النُّفَايَاتِ؛ وَهُوَ اسْتِنْتَاجٌ مِنَ الْكِيسَيْنِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "3AP-r3",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَا السُّلُوكُ الَّذِي يَدُلُّ عَلَى الْحَذَرِ؟",
          "ar": "مَا السُّلُوكُ الَّذِي يَدُلُّ عَلَى الْحَذَرِ؟"
        },
        "answer": {
          "fr": "أَخْبَرَا أَبَاهُمَا وَلَمْ يَلْمِسَا الزُّجَاجَ.",
          "ar": "أَخْبَرَا أَبَاهُمَا وَلَمْ يَلْمِسَا الزُّجَاجَ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [],
    "text": {
      "fr": "خَرَجَ أَمِينٌ وَأُخْتُهُ لِتَنْظِيفِ الشَّاطِئِ. جَمَعَا الْوَرَقَ وَالْقَوَارِيرَ فِي كِيسَيْنِ مُخْتَلِفَيْنِ. لَمْ يَلْمِسَا قِطْعَةَ زُجَاجٍ مَكْسُورَةً، بَلْ أَخْبَرَا أَبَاهُمَا.",
      "ar": "خَرَجَ أَمِينٌ وَأُخْتُهُ لِتَنْظِيفِ الشَّاطِئِ. جَمَعَا الْوَرَقَ وَالْقَوَارِيرَ فِي كِيسَيْنِ مُخْتَلِفَيْنِ. لَمْ يَلْمِسَا قِطْعَةَ زُجَاجٍ مَكْسُورَةً، بَلْ أَخْبَرَا أَبَاهُمَا."
    },
    "language": "ar"
  },
  {
    "id": "3AP-writing",
    "grade": "3AP",
    "domain": "writing",
    "title": {
      "fr": "Arabe : écrire et se relire",
      "ar": "أكتب وأراجع"
    },
    "objective": {
      "fr": "Produire une réponse puis la vérifier avec des critères.",
      "ar": "كتابة إجابة ومراجعتها وفق معايير."
    },
    "tasks": [
      {
        "id": "3AP-w1",
        "prompt": {
          "fr": "Réponds en arabe : اسْتَخْرِجِ الْفِعْلَ وَالْفَاعِلَ: جَمَعَ أَمِينٌ الْوَرَقَ.",
          "ar": "اسْتَخْرِجِ الْفِعْلَ وَالْفَاعِلَ: جَمَعَ أَمِينٌ الْوَرَقَ."
        },
        "answer": {
          "fr": "الْفِعْلُ: جَمَعَ؛ الْفَاعِلُ: أَمِينٌ.",
          "ar": "الْفِعْلُ: جَمَعَ؛ الْفَاعِلُ: أَمِينٌ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نَسْأَلُ: مَاذَا حَدَثَ؟ وَمَنْ قَامَ بِهِ؟",
          "ar": "نَسْأَلُ: مَاذَا حَدَثَ؟ وَمَنْ قَامَ بِهِ؟"
        },
        "language": "ar"
      },
      {
        "id": "3AP-w2",
        "prompt": {
          "fr": "Réponds en arabe : حَوِّلْ إِلَى الْجَمْعِ: الطِّفْلُ نَشِيطٌ.",
          "ar": "حَوِّلْ إِلَى الْجَمْعِ: الطِّفْلُ نَشِيطٌ."
        },
        "answer": {
          "fr": "الْأَطْفَالُ نَشِيطُونَ.",
          "ar": "الْأَطْفَالُ نَشِيطُونَ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نُغَيِّرُ الِاسْمَ وَنُرَاعِي مُطَابَقَةَ الْخَبَرِ.",
          "ar": "نُغَيِّرُ الِاسْمَ وَنُرَاعِي مُطَابَقَةَ الْخَبَرِ."
        },
        "language": "ar"
      },
      {
        "id": "3AP-w3",
        "prompt": {
          "fr": "Réponds en arabe : اكْتُبْ 3 جُمَلٍ عَنْ حِمَايَةِ الشَّاطِئِ.",
          "ar": "اكْتُبْ 3 جُمَلٍ عَنْ حِمَايَةِ الشَّاطِئِ."
        },
        "answer": {
          "fr": "مِثَالٌ: نَجْمَعُ الْوَرَقَ. نَفْرِزُ النُّفَايَاتِ. لَا نَلْمِسُ الزُّجَاجَ الْمَكْسُورَ.",
          "ar": "مِثَالٌ: نَجْمَعُ الْوَرَقَ. نَفْرِزُ النُّفَايَاتِ. لَا نَلْمِسُ الزُّجَاجَ الْمَكْسُورَ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : 3 أَفْكَارٍ مُتَرَابِطَةٍ، جُمَلٌ مُفِيدَةٌ، وَتَرْقِيمٌ مُنَاسِبٌ.",
          "ar": "3 أَفْكَارٍ مُتَرَابِطَةٍ، جُمَلٌ مُفِيدَةٌ، وَتَرْقِيمٌ مُنَاسِبٌ."
        },
        "language": "ar"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-reading",
    "grade": "4AP",
    "domain": "reading",
    "title": {
      "fr": "Arabe : lire, comprendre, justifier",
      "ar": "أقرأ وأفهم وأبرّر"
    },
    "objective": {
      "fr": "Distinguer ce qui est écrit de ce que l’on déduit.",
      "ar": "التمييز بين المعلومة الصريحة والاستنتاج."
    },
    "tasks": [
      {
        "id": "4AP-r1",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَا الْمُشْكِلَةُ قَبْلَ الإِصْلَاحِ؟",
          "ar": "مَا الْمُشْكِلَةُ قَبْلَ الإِصْلَاحِ؟"
        },
        "answer": {
          "fr": "تَسَرُّبُ الْمَاءِ وَجَفَافُ الْحَدَائِقِ.",
          "ar": "تَسَرُّبُ الْمَاءِ وَجَفَافُ الْحَدَائِقِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "4AP-r2",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : اذْكُرْ نَتِيجَةً لِلْعَمَلِ الْجَمَاعِيِّ.",
          "ar": "اذْكُرْ نَتِيجَةً لِلْعَمَلِ الْجَمَاعِيِّ."
        },
        "answer": {
          "fr": "عَادَ الْمَاءُ إِلَى الْحُقُولِ.",
          "ar": "عَادَ الْمَاءُ إِلَى الْحُقُولِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "4AP-r3",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : اسْتَخْرِجْ جُمْلَةً تُعَبِّرُ عَنِ الرَّأْيِ.",
          "ar": "اسْتَخْرِجْ جُمْلَةً تُعَبِّرُ عَنِ الرَّأْيِ."
        },
        "answer": {
          "fr": "الْعَمَلُ مَعاً يَحْمِي مَوَارِدَنَا.",
          "ar": "الْعَمَلُ مَعاً يَحْمِي مَوَارِدَنَا."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [],
    "text": {
      "fr": "فِي قَرْيَةٍ قَرِيبَةٍ مِنْ تِيزِي وَزُّو، أَصْلَحَ السُّكَّانُ قَنَاةَ مَاءٍ قَدِيمَةً. قَبْلَ الإِصْلَاحِ كَانَ الْمَاءُ يَتَسَرَّبُ وَتَجِفُّ الْحَدَائِقُ. بَعْدَهُ عَادَ الْمَاءُ إِلَى الْحُقُولِ. قَالَتْ مَرْيَمُ: الْعَمَلُ مَعاً يَحْمِي مَوَارِدَنَا.",
      "ar": "فِي قَرْيَةٍ قَرِيبَةٍ مِنْ تِيزِي وَزُّو، أَصْلَحَ السُّكَّانُ قَنَاةَ مَاءٍ قَدِيمَةً. قَبْلَ الإِصْلَاحِ كَانَ الْمَاءُ يَتَسَرَّبُ وَتَجِفُّ الْحَدَائِقُ. بَعْدَهُ عَادَ الْمَاءُ إِلَى الْحُقُولِ. قَالَتْ مَرْيَمُ: الْعَمَلُ مَعاً يَحْمِي مَوَارِدَنَا."
    },
    "language": "ar"
  },
  {
    "id": "4AP-writing",
    "grade": "4AP",
    "domain": "writing",
    "title": {
      "fr": "Arabe : écrire et se relire",
      "ar": "أكتب وأراجع"
    },
    "objective": {
      "fr": "Produire une réponse puis la vérifier avec des critères.",
      "ar": "كتابة إجابة ومراجعتها وفق معايير."
    },
    "tasks": [
      {
        "id": "4AP-w1",
        "prompt": {
          "fr": "Réponds en arabe : اسْتَخْرِجِ الْمُبْتَدَأَ وَالْخَبَرَ: الْمَاءُ ثَمِينٌ.",
          "ar": "اسْتَخْرِجِ الْمُبْتَدَأَ وَالْخَبَرَ: الْمَاءُ ثَمِينٌ."
        },
        "answer": {
          "fr": "الْمُبْتَدَأُ: الْمَاءُ؛ الْخَبَرُ: ثَمِينٌ.",
          "ar": "الْمُبْتَدَأُ: الْمَاءُ؛ الْخَبَرُ: ثَمِينٌ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : الْمُبْتَدَأُ مَا نَتَحَدَّثُ عَنْهُ، وَالْخَبَرُ مَا نَقُولُهُ عَنْهُ.",
          "ar": "الْمُبْتَدَأُ مَا نَتَحَدَّثُ عَنْهُ، وَالْخَبَرُ مَا نَقُولُهُ عَنْهُ."
        },
        "language": "ar"
      },
      {
        "id": "4AP-w2",
        "prompt": {
          "fr": "Réponds en arabe : حَوِّلْ إِلَى الْمَاضِي: يُصْلِحُ السُّكَّانُ الْقَنَاةَ.",
          "ar": "حَوِّلْ إِلَى الْمَاضِي: يُصْلِحُ السُّكَّانُ الْقَنَاةَ."
        },
        "answer": {
          "fr": "أَصْلَحَ السُّكَّانُ الْقَنَاةَ.",
          "ar": "أَصْلَحَ السُّكَّانُ الْقَنَاةَ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نُغَيِّرُ زَمَنَ الْفِعْلِ وَنُحَافِظُ عَلَى الْمَعْنَى.",
          "ar": "نُغَيِّرُ زَمَنَ الْفِعْلِ وَنُحَافِظُ عَلَى الْمَعْنَى."
        },
        "language": "ar"
      },
      {
        "id": "4AP-w3",
        "prompt": {
          "fr": "Réponds en arabe : اكْتُبْ 4 إِلَى 5 جُمَلٍ تَدْعُو فِيهَا إِلَى تَرْشِيدِ الْمَاءِ.",
          "ar": "اكْتُبْ 4 إِلَى 5 جُمَلٍ تَدْعُو فِيهَا إِلَى تَرْشِيدِ الْمَاءِ."
        },
        "answer": {
          "fr": "مِثَالٌ: الْمَاءُ ثَمِينٌ. نُغْلِقُ الصُّنْبُورَ بَعْدَ الِاسْتِعْمَالِ. نُصْلِحُ التَّسَرُّبَاتِ. نَحْمِي مَوَارِدَنَا مَعاً.",
          "ar": "مِثَالٌ: الْمَاءُ ثَمِينٌ. نُغْلِقُ الصُّنْبُورَ بَعْدَ الِاسْتِعْمَالِ. نُصْلِحُ التَّسَرُّبَاتِ. نَحْمِي مَوَارِدَنَا مَعاً."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : فِكْرَةٌ وَاضِحَةٌ، نَصِيحَتَانِ عَمَلِيَّتَانِ، تَسَلْسُلٌ وَتَرْقِيمٌ؛ لَا يُشْتَرَطُ نَسْخُ الْمِثَالِ.",
          "ar": "فِكْرَةٌ وَاضِحَةٌ، نَصِيحَتَانِ عَمَلِيَّتَانِ، تَسَلْسُلٌ وَتَرْقِيمٌ؛ لَا يُشْتَرَطُ نَسْخُ الْمِثَالِ."
        },
        "language": "ar"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "5AP-reading",
    "grade": "5AP",
    "domain": "reading",
    "title": {
      "fr": "Arabe : lire, comprendre, justifier",
      "ar": "أقرأ وأفهم وأبرّر"
    },
    "objective": {
      "fr": "Distinguer ce qui est écrit de ce que l’on déduit.",
      "ar": "التمييز بين المعلومة الصريحة والاستنتاج."
    },
    "tasks": [
      {
        "id": "5AP-r1",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : مَا الْحُجَّةُ الَّتِي جَعَلَتِ الزُّمَلَاءَ يَتَرَدَّدُونَ؟",
          "ar": "مَا الْحُجَّةُ الَّتِي جَعَلَتِ الزُّمَلَاءَ يَتَرَدَّدُونَ؟"
        },
        "answer": {
          "fr": "الْخَوْفُ مِنْ ضَيَاعِ الْكُتُبِ.",
          "ar": "الْخَوْفُ مِنْ ضَيَاعِ الْكُتُبِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "5AP-r2",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : كَيْفَ عَالَجَتْ نُورُ هَذَا التَّخَوُّفَ؟",
          "ar": "كَيْفَ عَالَجَتْ نُورُ هَذَا التَّخَوُّفَ؟"
        },
        "answer": {
          "fr": "وَضَعَتْ سِجِلّاً لِلإِعَارَةِ وَمَوْعِداً لِلإِرْجَاعِ.",
          "ar": "وَضَعَتْ سِجِلّاً لِلإِعَارَةِ وَمَوْعِداً لِلإِرْجَاعِ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      },
      {
        "id": "5AP-r3",
        "prompt": {
          "fr": "Lis le texte arabe puis réponds en arabe : اقْتَرِحْ عُنْوَاناً وَبَرِّرْهُ بِدَلِيلٍ مِنَ النَّصِّ.",
          "ar": "اقْتَرِحْ عُنْوَاناً وَبَرِّرْهُ بِدَلِيلٍ مِنَ النَّصِّ."
        },
        "answer": {
          "fr": "مِثَالٌ: الْقِرَاءَةُ وَالثِّقَةُ؛ لِأَنَّ التَّنْظِيمَ وَالثِّقَةَ زَادَا عَدَدَ الْقُرَّاءِ. تُقْبَلُ عَنَاوِينُ أُخْرَى مُبَرَّرَةٌ.",
          "ar": "مِثَالٌ: الْقِرَاءَةُ وَالثِّقَةُ؛ لِأَنَّ التَّنْظِيمَ وَالثِّقَةَ زَادَا عَدَدَ الْقُرَّاءِ. تُقْبَلُ عَنَاوِينُ أُخْرَى مُبَرَّرَةٌ."
        },
        "hint": {
          "fr": "Relis le passage utile. Pour une déduction, donne un indice du texte.",
          "ar": "أعد قراءة الجزء المناسب. للاستنتاج اذكر دليلاً من النص."
        },
        "method": {
          "fr": "Une réponse équivalente est acceptée si elle respecte le texte. Demande à l’enfant de montrer son indice.",
          "ar": "تُقبل إجابة مكافئة توافق النص. نطلب من الطفل تحديد الدليل."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [],
    "text": {
      "fr": "اقْتَرَحَتْ نُورُ إِنْشَاءَ رُكْنٍ لِتَبَادُلِ الْكُتُبِ فِي الْمَدْرَسَةِ. رَفَضَ بَعْضُ الزُّمَلَاءِ أَوَّلاً خَوْفاً مِنْ ضَيَاعِهَا. وَضَعَتْ نُورُ سِجِلّاً لِلإِعَارَةِ وَمَوْعِداً لِلإِرْجَاعِ. بَعْدَ شَهْرٍ، تَضَاعَفَ عَدَدُ الْقُرَّاءِ. لَمْ يَكُنِ النَّجَاحُ فِي كَثْرَةِ الْكُتُبِ وَحْدَهَا، بَلْ فِي الثِّقَةِ وَالتَّنْظِيمِ.",
      "ar": "اقْتَرَحَتْ نُورُ إِنْشَاءَ رُكْنٍ لِتَبَادُلِ الْكُتُبِ فِي الْمَدْرَسَةِ. رَفَضَ بَعْضُ الزُّمَلَاءِ أَوَّلاً خَوْفاً مِنْ ضَيَاعِهَا. وَضَعَتْ نُورُ سِجِلّاً لِلإِعَارَةِ وَمَوْعِداً لِلإِرْجَاعِ. بَعْدَ شَهْرٍ، تَضَاعَفَ عَدَدُ الْقُرَّاءِ. لَمْ يَكُنِ النَّجَاحُ فِي كَثْرَةِ الْكُتُبِ وَحْدَهَا، بَلْ فِي الثِّقَةِ وَالتَّنْظِيمِ."
    },
    "language": "ar"
  },
  {
    "id": "5AP-writing",
    "grade": "5AP",
    "domain": "writing",
    "title": {
      "fr": "Arabe : écrire et se relire",
      "ar": "أكتب وأراجع"
    },
    "objective": {
      "fr": "Produire une réponse puis la vérifier avec des critères.",
      "ar": "كتابة إجابة ومراجعتها وفق معايير."
    },
    "tasks": [
      {
        "id": "5AP-w1",
        "prompt": {
          "fr": "Réponds en arabe : أَعْرِبْ: الْقِرَاءَةُ مُفِيدَةٌ.",
          "ar": "أَعْرِبْ: الْقِرَاءَةُ مُفِيدَةٌ."
        },
        "answer": {
          "fr": "الْقِرَاءَةُ: مُبْتَدَأٌ مَرْفُوعٌ بِالضَّمَّةِ. مُفِيدَةٌ: خَبَرٌ مَرْفُوعٌ بِالضَّمَّةِ.",
          "ar": "الْقِرَاءَةُ: مُبْتَدَأٌ مَرْفُوعٌ بِالضَّمَّةِ. مُفِيدَةٌ: خَبَرٌ مَرْفُوعٌ بِالضَّمَّةِ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : الْجُمْلَةُ اسْمِيَّةٌ، نُحَدِّدُ الْوَظِيفَةَ وَعَلَامَةَ الإِعْرَابِ.",
          "ar": "الْجُمْلَةُ اسْمِيَّةٌ، نُحَدِّدُ الْوَظِيفَةَ وَعَلَامَةَ الإِعْرَابِ."
        },
        "language": "ar"
      },
      {
        "id": "5AP-w2",
        "prompt": {
          "fr": "Réponds en arabe : لِمَاذَا كُتِبَتِ الْهَمْزَةُ عَلَى وَاوٍ فِي سُؤَالٍ؟",
          "ar": "لِمَاذَا كُتِبَتِ الْهَمْزَةُ عَلَى وَاوٍ فِي سُؤَالٍ؟"
        },
        "answer": {
          "fr": "لِأَنَّ الْهَمْزَةَ مَفْتُوحَةٌ وَمَا قَبْلَهَا مَضْمُومٌ، وَالضَّمَّةُ أَقْوَى مِنَ الْفَتْحَةِ.",
          "ar": "لِأَنَّ الْهَمْزَةَ مَفْتُوحَةٌ وَمَا قَبْلَهَا مَضْمُومٌ، وَالضَّمَّةُ أَقْوَى مِنَ الْفَتْحَةِ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : نُقَارِنُ حَرَكَةَ الْهَمْزَةِ بِحَرَكَةِ مَا قَبْلَهَا.",
          "ar": "نُقَارِنُ حَرَكَةَ الْهَمْزَةِ بِحَرَكَةِ مَا قَبْلَهَا."
        },
        "language": "ar"
      },
      {
        "id": "5AP-w3",
        "prompt": {
          "fr": "Réponds en arabe : اكْتُبْ نَصّاً مِنْ 8 إِلَى 12 سَطْراً تَقْتَرِحُ فِيهِ مَشْرُوعاً لِمَدْرَسَتِكَ.",
          "ar": "اكْتُبْ نَصّاً مِنْ 8 إِلَى 12 سَطْراً تَقْتَرِحُ فِيهِ مَشْرُوعاً لِمَدْرَسَتِكَ."
        },
        "answer": {
          "fr": "لَيْسَ لِهَذَا النَّصِّ جَوَابٌ وَحِيدٌ. مِثَالُ خُطَّةٍ: مُشْكِلَةٌ، حَلٌّ، خُطُوَاتُ التَّنْفِيذِ، فَائِدَةٌ مُنْتَظَرَةٌ.",
          "ar": "لَيْسَ لِهَذَا النَّصِّ جَوَابٌ وَحِيدٌ. مِثَالُ خُطَّةٍ: مُشْكِلَةٌ، حَلٌّ، خُطُوَاتُ التَّنْفِيذِ، فَائِدَةٌ مُنْتَظَرَةٌ."
        },
        "hint": {
          "fr": "Dis d’abord ta réponse à voix haute, puis écris-la.",
          "ar": "قُلْ إِجَابَتَكَ شَفَهِيّاً ثُمَّ اكْتُبْهَا."
        },
        "method": {
          "fr": "Critères pour le parent : شَبَكَةُ التَّقْيِيمِ: احْتِرَامُ الْمَوْضُوعِ، أَفْكَارٌ مُرَتَّبَةٌ، حُجَّةٌ وَاضِحَةٌ، رَوَابِطُ، إِمْلَاءٌ وَتَرْقِيمٌ. يُمْكِنُ إِتْمَامُ الْكِتَابَةِ فِي جَلْسَةٍ أُخْرَى.",
          "ar": "شَبَكَةُ التَّقْيِيمِ: احْتِرَامُ الْمَوْضُوعِ، أَفْكَارٌ مُرَتَّبَةٌ، حُجَّةٌ وَاضِحَةٌ، رَوَابِطُ، إِمْلَاءٌ وَتَرْقِيمٌ. يُمْكِنُ إِتْمَامُ الْكِتَابَةِ فِي جَلْسَةٍ أُخْرَى."
        },
        "language": "ar"
      }
    ],
    "competenceIds": [
      "ar-5ap-c-writing",
      "ar-5ap-c-irab",
      "ar-5ap-c-spelling"
    ]
  },
  {
    "id": "3AP-french",
    "grade": "3AP",
    "domain": "french",
    "title": {
      "fr": "Français : lire et communiquer",
      "ar": "الفرنسية: القراءة والتواصل"
    },
    "objective": {
      "fr": "Comprendre et écrire en français.",
      "ar": "الفهم والكتابة بالفرنسية."
    },
    "tasks": [
      {
        "id": "3AP-f1",
        "prompt": {
          "fr": "Lis : « Lina a un chat. Le chat dort sur le tapis. » Où dort le chat ?",
          "ar": "Lis : « Lina a un chat. Le chat dort sur le tapis. » Où dort le chat ?"
        },
        "answer": {
          "fr": "Sur le tapis.",
          "ar": "Sur le tapis."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Relève les mots qui donnent le lieu.",
          "ar": "Relève les mots qui donnent le lieu."
        },
        "language": "fr"
      },
      {
        "id": "3AP-f2",
        "prompt": {
          "fr": "Complète : un chat → deux …",
          "ar": "Complète : un chat → deux …"
        },
        "answer": {
          "fr": "chats",
          "ar": "chats"
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Le nom prend ici un s au pluriel.",
          "ar": "Le nom prend ici un s au pluriel."
        },
        "language": "fr"
      },
      {
        "id": "3AP-f3",
        "prompt": {
          "fr": "Présente-toi en deux phrases.",
          "ar": "Présente-toi en deux phrases."
        },
        "answer": {
          "fr": "Exemple : Je m’appelle Lina. Je suis en 3AP.",
          "ar": "Exemple : Je m’appelle Lina. Je suis en 3AP."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Deux phrases compréhensibles, majuscules et points. Accepte un autre prénom.",
          "ar": "Deux phrases compréhensibles, majuscules et points. Accepte un autre prénom."
        },
        "language": "fr"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "3AP-english",
    "grade": "3AP",
    "domain": "english",
    "title": {
      "fr": "English : petites conversations",
      "ar": "الإنجليزية: محادثات قصيرة"
    },
    "objective": {
      "fr": "Comprendre et produire de courtes phrases en anglais.",
      "ar": "فهم وإنتاج جمل قصيرة بالإنجليزية."
    },
    "tasks": [
      {
        "id": "3AP-e1",
        "prompt": {
          "fr": "Read: My name is Adam. I am eight. What is his name?",
          "ar": "Read: My name is Adam. I am eight. What is his name?"
        },
        "answer": {
          "fr": "Adam.",
          "ar": "Adam."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Look after “My name is”.",
          "ar": "Look after “My name is”."
        },
        "language": "en"
      },
      {
        "id": "3AP-e2",
        "prompt": {
          "fr": "Complete: one book, two …",
          "ar": "Complete: one book, two …"
        },
        "answer": {
          "fr": "books",
          "ar": "books"
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Add s to book for this plural.",
          "ar": "Add s to book for this plural."
        },
        "language": "en"
      },
      {
        "id": "3AP-e3",
        "prompt": {
          "fr": "Say and write your name in English.",
          "ar": "Say and write your name in English."
        },
        "answer": {
          "fr": "Example: My name is Lina.",
          "ar": "Example: My name is Lina."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Accept the child’s own name. Check that “My name is” is understandable.",
          "ar": "Accept the child’s own name. Check that “My name is” is understandable."
        },
        "language": "en"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-french",
    "grade": "4AP",
    "domain": "french",
    "title": {
      "fr": "Français : lire et communiquer",
      "ar": "الفرنسية: القراءة والتواصل"
    },
    "objective": {
      "fr": "Comprendre et écrire en français.",
      "ar": "الفهم والكتابة بالفرنسية."
    },
    "tasks": [
      {
        "id": "4AP-f1",
        "prompt": {
          "fr": "Lis : « Rayan ferme le robinet pendant qu’il se brosse les dents. » Pourquoi ce geste est-il utile ?",
          "ar": "Lis : « Rayan ferme le robinet pendant qu’il se brosse les dents. » Pourquoi ce geste est-il utile ?"
        },
        "answer": {
          "fr": "Il évite de gaspiller l’eau.",
          "ar": "Il évite de gaspiller l’eau."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "La réponse est une déduction : relie fermer le robinet à économiser l’eau.",
          "ar": "La réponse est une déduction : relie fermer le robinet à économiser l’eau."
        },
        "language": "fr"
      },
      {
        "id": "4AP-f2",
        "prompt": {
          "fr": "Conjugue : Nous … (planter) un arbre.",
          "ar": "Conjugue : Nous … (planter) un arbre."
        },
        "answer": {
          "fr": "plantons",
          "ar": "plantons"
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Au présent, nous + verbe planter donne nous plantons.",
          "ar": "Au présent, nous + verbe planter donne nous plantons."
        },
        "language": "fr"
      },
      {
        "id": "4AP-f3",
        "prompt": {
          "fr": "Écris trois conseils pour économiser l’eau.",
          "ar": "Écris trois conseils pour économiser l’eau."
        },
        "answer": {
          "fr": "Exemple : Ferme le robinet. Répare les fuites. Utilise seulement l’eau nécessaire.",
          "ar": "Exemple : Ferme le robinet. Répare les fuites. Utilise seulement l’eau nécessaire."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Trois conseils cohérents. D’autres formulations sont possibles.",
          "ar": "Trois conseils cohérents. D’autres formulations sont possibles."
        },
        "language": "fr"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "4AP-english",
    "grade": "4AP",
    "domain": "english",
    "title": {
      "fr": "English : petites conversations",
      "ar": "الإنجليزية: محادثات قصيرة"
    },
    "objective": {
      "fr": "Comprendre et produire de courtes phrases en anglais.",
      "ar": "فهم وإنتاج جمل قصيرة بالإنجليزية."
    },
    "tasks": [
      {
        "id": "4AP-e1",
        "prompt": {
          "fr": "Read: The cat is under the table. Where is the cat?",
          "ar": "Read: The cat is under the table. Where is the cat?"
        },
        "answer": {
          "fr": "Under the table.",
          "ar": "Under the table."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Under tells you the position.",
          "ar": "Under tells you the position."
        },
        "language": "en"
      },
      {
        "id": "4AP-e2",
        "prompt": {
          "fr": "Complete: I … a blue bag. (have / has)",
          "ar": "Complete: I … a blue bag. (have / has)"
        },
        "answer": {
          "fr": "have",
          "ar": "have"
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Use I have; use he/she has.",
          "ar": "Use I have; use he/she has."
        },
        "language": "en"
      },
      {
        "id": "4AP-e3",
        "prompt": {
          "fr": "Describe your school bag in two sentences.",
          "ar": "Describe your school bag in two sentences."
        },
        "answer": {
          "fr": "Example: I have a bag. My bag is blue.",
          "ar": "Example: I have a bag. My bag is blue."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Accept other colours. Check meaning and complete sentences.",
          "ar": "Accept other colours. Check meaning and complete sentences."
        },
        "language": "en"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "5AP-french",
    "grade": "5AP",
    "domain": "french",
    "title": {
      "fr": "Français : lire et communiquer",
      "ar": "الفرنسية: القراءة والتواصل"
    },
    "objective": {
      "fr": "Comprendre et écrire en français.",
      "ar": "الفهم والكتابة بالفرنسية."
    },
    "tasks": [
      {
        "id": "5AP-f1",
        "prompt": {
          "fr": "Lis : « Une classe échange ses livres. Chaque emprunt est inscrit dans un carnet afin de retrouver les livres. » À quoi sert le carnet ?",
          "ar": "Lis : « Une classe échange ses livres. Chaque emprunt est inscrit dans un carnet afin de retrouver les livres. » À quoi sert le carnet ?"
        },
        "answer": {
          "fr": "À suivre les emprunts et retrouver les livres.",
          "ar": "À suivre les emprunts et retrouver les livres."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Le groupe « afin de » indique le but ; justifie avec ce passage.",
          "ar": "Le groupe « afin de » indique le but ; justifie avec ce passage."
        },
        "language": "fr"
      },
      {
        "id": "5AP-f2",
        "prompt": {
          "fr": "Mets au passé composé : Elle visite la bibliothèque.",
          "ar": "Mets au passé composé : Elle visite la bibliothèque."
        },
        "answer": {
          "fr": "Elle a visité la bibliothèque.",
          "ar": "Elle a visité la bibliothèque."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Auxiliaire avoir au présent + participe passé visité.",
          "ar": "Auxiliaire avoir au présent + participe passé visité."
        },
        "language": "fr"
      },
      {
        "id": "5AP-f3",
        "prompt": {
          "fr": "Écris 4 à 5 phrases pour inviter un ami à une activité de lecture.",
          "ar": "Écris 4 à 5 phrases pour inviter un ami à une activité de lecture."
        },
        "answer": {
          "fr": "Exemple de plan : salutation, activité, lieu, moment, invitation.",
          "ar": "Exemple de plan : salutation, activité, lieu, moment, invitation."
        },
        "hint": {
          "fr": "Relis la consigne et repère les mots importants.",
          "ar": "أعد قراءة التعليمة وحدّد الكلمات المهمة."
        },
        "method": {
          "fr": "Vérifie le destinataire, les informations pratiques, les phrases complètes et la ponctuation.",
          "ar": "Vérifie le destinataire, les informations pratiques, les phrases complètes et la ponctuation."
        },
        "language": "fr"
      }
    ],
    "competenceIds": []
  },
  {
    "id": "5AP-english",
    "grade": "5AP",
    "domain": "english",
    "title": {
      "fr": "English : petites conversations",
      "ar": "الإنجليزية: محادثات قصيرة"
    },
    "objective": {
      "fr": "Comprendre et produire de courtes phrases en anglais.",
      "ar": "فهم وإنتاج جمل قصيرة بالإنجليزية."
    },
    "tasks": [
      {
        "id": "5AP-e1",
        "prompt": {
          "fr": "Read: Sara goes to school by bus because it is far from her home. Why does she take the bus?",
          "ar": "Read: Sara goes to school by bus because it is far from her home. Why does she take the bus?"
        },
        "answer": {
          "fr": "Because her school is far from her home.",
          "ar": "Because her school is far from her home."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Because introduces a reason.",
          "ar": "Because introduces a reason."
        },
        "language": "en"
      },
      {
        "id": "5AP-e2",
        "prompt": {
          "fr": "Complete: He … football on Friday. (play / plays)",
          "ar": "Complete: He … football on Friday. (play / plays)"
        },
        "answer": {
          "fr": "plays",
          "ar": "plays"
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "In the present simple, he + plays.",
          "ar": "In the present simple, he + plays."
        },
        "language": "en"
      },
      {
        "id": "5AP-e3",
        "prompt": {
          "fr": "Write three sentences about your weekly routine.",
          "ar": "Write three sentences about your weekly routine."
        },
        "answer": {
          "fr": "Example: I go to school. I read on Tuesday. I play on Friday.",
          "ar": "Example: I go to school. I read on Tuesday. I play on Friday."
        },
        "hint": {
          "fr": "Read slowly and use the words you know.",
          "ar": "اقرأ ببطء واستعمل الكلمات التي تعرفها."
        },
        "method": {
          "fr": "Accept another real routine. Check meaning, days and sentence boundaries.",
          "ar": "Accept another real routine. Check meaning, days and sentence boundaries."
        },
        "language": "en"
      }
    ],
    "competenceIds": []
  }
,
 {id:'5AP-decimals',grade:'5AP',domain:'decimals',title:{fr:'Fractions et décimaux',ar:'الكسور والأعداد العشرية'},objective:{fr:'Relier une fraction à une quantité et vérifier les positions décimales.',ar:'ربط الكسر بكمية والتحقق من المراتب العشرية.'},competenceIds:['math-5ap-c-decimals','math-5ap-c-fractions'],tasks:[
  {id:'5AP-d1',prompt:{fr:'Calcule 2,75 + 1,5. Écris seulement le nombre.',ar:'احسب 2,75 + 1,5. اكتب العدد فقط.'},answer:{fr:'4,25',ar:'4,25'},hint:{fr:'Écris 1,50 et aligne les virgules.',ar:'اكتب 1,50 وحاذِ الفواصل.'},method:{fr:'2,75 + 1,50 = 4,25. On additionne les mêmes positions, pas les chaînes de chiffres.',ar:'2,75 + 1,50 = 4,25. نجمع المراتب المتشابهة.'},accepted:['4.25']},
  {id:'5AP-d2',prompt:{fr:'Une bouteille de 1 L est remplie aux trois quarts. Combien de mL contient-elle ?',ar:'قارورة سعتها لتر واحد مملوءة إلى ثلاثة أرباعها. كم ملل فيها؟'},answer:{fr:'750 mL',ar:'750 ملل'},hint:{fr:'1 L = 1 000 mL. Partage en 4 parts, puis prends 3 parts.',ar:'1 لتر = 1000 ملل. قسّم إلى 4 أجزاء ثم خذ 3 أجزاء.'},method:{fr:'1 000 ÷ 4 = 250 ; 250 × 3 = 750 mL. Trois quarts valent 0,75 L.',ar:'1000 ÷ 4 = 250؛ 250 × 3 = 750 ملل. ثلاثة أرباع تساوي 0,75 لتر.'},accepted:['750']},
  {id:'5AP-d3',prompt:{fr:'Compare 0,8 et 0,75. Explique sans compter seulement les chiffres.',ar:'قارن 0,8 و0,75. علّل دون الاكتفاء بعدّ الأرقام.'},answer:{fr:'0,8 > 0,75',ar:'0,8 > 0,75'},hint:{fr:'Écris 0,8 sous la forme 0,80.',ar:'اكتب 0,8 بالشكل 0,80.'},method:{fr:'80 centièmes sont plus grands que 75 centièmes. Avoir plus de chiffres ne rend pas un décimal plus grand.',ar:'80 جزءاً من المئة أكبر من 75 جزءاً من المئة. كثرة الأرقام لا تعني أن العدد العشري أكبر.'}}
 ]},
 {id:'5AP-proportion',grade:'5AP',domain:'proportion',title:{fr:'Proportionnalité et pourcentages',ar:'التناسبية والنسب المئوية'},objective:{fr:'Passer par l’unité et distinguer une relation proportionnelle.',ar:'المرور بالوحدة وتمييز العلاقة التناسبية.'},competenceIds:['math-5ap-c-proportion','math-5ap-c-percentage'],tasks:[
  {id:'5AP-p1',prompt:{fr:'4 cahiers identiques coûtent 600 DA. Combien coûtent 7 cahiers au même prix unitaire ?',ar:'ثمن 4 كراسات متماثلة 600 دج. ما ثمن 7 كراسات بالسعر الفردي نفسه؟'},answer:{fr:'1 050 DA',ar:'1050 دج'},hint:{fr:'Trouve d’abord le prix d’un cahier.',ar:'أوجد أولاً ثمن كراس واحد.'},method:{fr:'600 ÷ 4 = 150 DA ; 150 × 7 = 1 050 DA. Le prix unitaire reste constant.',ar:'600 ÷ 4 = 150 دج؛ 150 × 7 = 1050 دج. الثمن الفردي ثابت.'},accepted:['1050']},
  {id:'5AP-p2',prompt:{fr:'Un livre de 800 DA bénéficie d’une réduction de 25 %. Quel est son nouveau prix ?',ar:'ثمن كتاب 800 دج مع تخفيض 25٪. ما الثمن الجديد؟'},answer:{fr:'600 DA',ar:'600 دج'},hint:{fr:'25 % est un quart. Calcule la réduction puis retire-la.',ar:'25٪ تساوي الربع. احسب التخفيض ثم اطرحه.'},method:{fr:'800 ÷ 4 = 200 DA de réduction ; 800 − 200 = 600 DA. La réduction n’est pas le prix final.',ar:'800 ÷ 4 = 200 دج تخفيض؛ 800 − 200 = 600 دج. التخفيض ليس الثمن النهائي.'},accepted:['600']},
  {id:'5AP-p3',prompt:{fr:'À 2 ans un arbre mesure 1 m ; à 4 ans il mesure 1,5 m. La hauteur est-elle proportionnelle à l’âge ? Justifie.',ar:'طول شجرة في عمر سنتين 1 م، وفي عمر 4 سنوات 1,5 م. هل الطول متناسب مع العمر؟ علّل.'},answer:{fr:'Non : doubler l’âge n’a pas doublé la hauteur.',ar:'لا، مضاعفة العمر لم تضاعف الطول.'},hint:{fr:'Une relation proportionnelle conserve le même multiplicateur.',ar:'في العلاقة التناسبية نحافظ على معامل الضرب نفسه.'},method:{fr:'Si la relation était proportionnelle, 4 ans donneraient 2 m. Ici 1,5 m ≠ 2 m. Une croissance n’est pas forcément proportionnelle.',ar:'لو كانت العلاقة تناسبية لكان الطول في 4 سنوات 2 م. لكن 1,5 م لا تساوي 2 م. النمو ليس دائماً تناسبياً.'}}
 ]}
];
