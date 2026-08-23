import { CourseLesson } from '../../../types';
import { build4ApPractice } from './4apExercisePack';

type PracticePack = ReturnType<typeof build4ApPractice>;

function genericPack(prefix: string, topicAr: string): PracticePack {
  return build4ApPractice(
    prefix,
    [
      { problemAr: `ما الفكرة الأساسية في درس «${topicAr}»؟`, solutionAr: topicAr, detailedCorrectionAr: `راجع ملخص الدرس حول ${topicAr}.`, options: [{ id: 'a', textAr: topicAr, isCorrect: true }, { id: 'b', textAr: 'موضوع خارج البرنامج', isCorrect: false }] },
      { problemAr: `طبّق قاعدة من درس «${topicAr}» على مثال بسيط.`, solutionAr: 'صحيح', detailedCorrectionAr: 'راجع الأمثلة في الدرس.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
      { problemAr: `أكمل: «${topicAr}» يتعلّق بـ ....`, solutionAr: 'البرنامج الرسمي', detailedCorrectionAr: 'هذا الدرس من منهج 4AP.', type: 'fill_blank', fillBlankAnswerAr: 'البرنامج' },
      { problemAr: `تحدٍّ: اربط «${topicAr}» بوضعية من حياتك اليومية.`, solutionAr: 'وضعية واقعية', detailedCorrectionAr: 'اربط الدرس بسياق جزائري مألوف.', options: [{ id: 'a', textAr: 'وضعية واقعية', isCorrect: true }, { id: 'b', textAr: 'خارج السياق', isCorrect: false }] },
    ],
    [
      { problemAr: `تقويم: ما الهدف الرئيسي لدرس «${topicAr}»؟`, solutionAr: topicAr, detailedCorrectionAr: `الهدف مرتبط بـ ${topicAr}.`, options: [{ id: 'a', textAr: topicAr, isCorrect: true }, { id: 'b', textAr: 'موضوع 5AP', isCorrect: false }] },
      { problemAr: `تقويم: الدرس «${topicAr}» ينتمي إلى برنامج السنة الرابعة. (صح/خطأ)`, solutionAr: 'صحيح', detailedCorrectionAr: '4AP — الجيل الثاني.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    ],
  );
}

const ENGLISH_PACKS: Record<string, PracticePack> = {
  'english-4ap-unit1-family-friends': build4ApPractice('english-4ap-unit1-family-friends', [
    { problemAr: 'My name is Amine. — ما الضمير المناسب؟', solutionAr: 'I / My', detailedCorrectionAr: 'I للمتكلم، My للملكية.', options: [{ id: 'a', textAr: 'I / My', isCorrect: true }, { id: 'b', textAr: 'He / His', isCorrect: false }] },
    { problemAr: 'This is my sister. Her name is Meriem. — His أم Her؟', solutionAr: 'Her', detailedCorrectionAr: 'sister مؤنث → Her.', type: 'fill_blank', fillBlankAnswerAr: 'Her' },
    { problemAr: 'He replaces my brother. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'He للمذكر.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'Nice to meet you! يُستعمل عند التعارف. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'تحية عند اللقاء الأول.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ], [
    { problemAr: 'What\'s your name? — السؤال عن الاسم. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'سؤال تعارف أساسي.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'His name is Yacine. — His للمذكر. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'His = له (مذكر).', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ]),
  'english-4ap-unit1-numbers-colors': build4ApPractice('english-4ap-unit1-numbers-colors', [
    { problemAr: 'What number comes after fifteen?', solutionAr: 'Sixteen', detailedCorrectionAr: '15 → 16.', options: [{ id: 'a', textAr: 'Sixteen', isCorrect: true }, { id: 'b', textAr: 'Fourteen', isCorrect: false }] },
    { problemAr: 'The sky is .... (blue)', solutionAr: 'blue', detailedCorrectionAr: 'blue = أزرق.', type: 'fill_blank', fillBlankAnswerAr: 'blue' },
    { problemAr: 'Red + yellow = orange. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'orange = برتقالي.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'How do you say «عشرة» in English?', solutionAr: 'Ten', detailedCorrectionAr: '10 = ten.', options: [{ id: 'a', textAr: 'Ten', isCorrect: true }, { id: 'b', textAr: 'Twenty', isCorrect: false }] },
  ], [
    { problemAr: 'Numbers 1–20 are in the 4AP program. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'برنامج 4AP.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'Green = ....', solutionAr: 'أخضر', detailedCorrectionAr: 'green = أخضر.', type: 'qcm', options: [{ id: 'a', textAr: 'أخضر', isCorrect: true }, { id: 'b', textAr: 'أحمر', isCorrect: false }] },
  ]),
  'english-4ap-unit2-school-classroom': build4ApPractice('english-4ap-unit2-school-classroom', [
    { problemAr: 'The pen is ... the desk. (on)', solutionAr: 'on', detailedCorrectionAr: 'on = فوق.', type: 'fill_blank', fillBlankAnswerAr: 'on' },
    { problemAr: 'Open your book! = افتح كتابك. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'أمر صفي.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'The ruler is in the pencil case. — in = ؟', solutionAr: 'داخل', detailedCorrectionAr: 'in = في/داخل.', options: [{ id: 'a', textAr: 'داخل', isCorrect: true }, { id: 'b', textAr: 'تحت', isCorrect: false }] },
    { problemAr: 'Stand up! means ....', solutionAr: 'قف', detailedCorrectionAr: 'Stand up = قف.', options: [{ id: 'a', textAr: 'قف', isCorrect: true }, { id: 'b', textAr: 'اجلس', isCorrect: false }] },
  ], [
    { problemAr: 'under = تحت. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'حرف جر مكان.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'Where is the book? — سؤال عن ....', solutionAr: 'المكان', detailedCorrectionAr: 'Where = أين.', options: [{ id: 'a', textAr: 'المكان', isCorrect: true }, { id: 'b', textAr: 'الوقت', isCorrect: false }] },
  ]),
  'english-4ap-unit2-basic-time-routines': build4ApPractice('english-4ap-unit2-basic-time-routines', [
    { problemAr: 'How do you say «أستيقظ»?', solutionAr: 'wake up', detailedCorrectionAr: 'wake up = أستيقظ.', options: [{ id: 'a', textAr: 'wake up', isCorrect: true }, { id: 'b', textAr: 'go to bed', isCorrect: false }] },
    { problemAr: 'I get dressed before school. — get dressed = ....', solutionAr: 'أرتدي ملابسي', detailedCorrectionAr: 'get dressed = أرتدي ملابسي.', type: 'qcm', options: [{ id: 'a', textAr: 'أرتدي ملابسي', isCorrect: true }, { id: 'b', textAr: 'أنام', isCorrect: false }] },
    { problemAr: 'I have breakfast at seven o\'clock. — have breakfast = ....', solutionAr: 'أتناول الفطور', detailedCorrectionAr: 'have breakfast = أتناول الفطور.', type: 'qcm', options: [{ id: 'a', textAr: 'أتناول الفطور', isCorrect: true }, { id: 'b', textAr: 'أذهب للمدرسة', isCorrect: false }] },
    { problemAr: 'It\'s eight o\'clock. — o\'clock = تماماً. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'o\'clock للساعة الكاملة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ], [
    { problemAr: 'Daily routine: wake up, get dressed, have breakfast. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'ترتيب الصباح.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'I go to school at eight o\'clock. — at = ....', solutionAr: 'في (وقت)', detailedCorrectionAr: 'at + time.', options: [{ id: 'a', textAr: 'في (وقت)', isCorrect: true }, { id: 'b', textAr: 'تحت', isCorrect: false }] },
  ]),
  'english-4ap-unit2-telling-time': build4ApPractice('english-4ap-unit2-telling-time', [
    { problemAr: '7:30 = half past ....', solutionAr: 'seven', detailedCorrectionAr: 'half past 7.', type: 'fill_blank', fillBlankAnswerAr: 'seven' },
    { problemAr: 'Quarter past 3 = 3:15. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '15 دقيقة بعد.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'Quarter to 8 = ....', solutionAr: '7:45', detailedCorrectionAr: 'إلا ربع 8 = 7:45.', options: [{ id: 'a', textAr: '7:45', isCorrect: true }, { id: 'b', textAr: '8:15', isCorrect: false }] },
    { problemAr: 'Half past = ....', solutionAr: 'والنصف', detailedCorrectionAr: '30 دقيقة.', options: [{ id: 'a', textAr: 'والنصف', isCorrect: true }, { id: 'b', textAr: 'والربع', isCorrect: false }] },
  ], [
    { problemAr: 'What time is it? — سؤال عن الوقت. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'سؤال أساسي.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: '9:45 = quarter to ten. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'إلا ربع 10.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ]),
  'english-4ap-unit3-home-rooms': build4ApPractice('english-4ap-unit3-home-rooms', [
    { problemAr: 'The kitchen is where we cook. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'kitchen = مطبخ.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'I sleep in the ....', solutionAr: 'bedroom', detailedCorrectionAr: 'bedroom = غرفة النوم.', type: 'fill_blank', fillBlankAnswerAr: 'bedroom' },
    { problemAr: 'The bathroom is for ....', solutionAr: 'washing', detailedCorrectionAr: 'bathroom = حمام.', options: [{ id: 'a', textAr: 'washing', isCorrect: true }, { id: 'b', textAr: 'cooking', isCorrect: false }] },
    { problemAr: 'There is a sofa in the living room. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'living room = صالون.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ], [
    { problemAr: 'Bedroom = غرفة النوم. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'rooms of the house — 4AP.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'We eat in the ....', solutionAr: 'kitchen/dining room', detailedCorrectionAr: 'مطبخ أو غرفة طعام.', options: [{ id: 'a', textAr: 'kitchen', isCorrect: true }, { id: 'b', textAr: 'garage', isCorrect: false }] },
  ]),
  'english-4ap-unit4-food-meals': build4ApPractice('english-4ap-unit4-food-meals', [
    { problemAr: 'Bread and milk are ....', solutionAr: 'food', detailedCorrectionAr: 'طعام.', options: [{ id: 'a', textAr: 'food', isCorrect: true }, { id: 'b', textAr: 'furniture', isCorrect: false }] },
    { problemAr: 'I like .... (apples)', solutionAr: 'apples', detailedCorrectionAr: 'تفاح.', type: 'fill_blank', fillBlankAnswerAr: 'apples' },
    { problemAr: 'Breakfast is in the morning. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'فطور الصباح.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'Do you like couscous? — like = ....', solutionAr: 'أحب', detailedCorrectionAr: 'like = أحب.', options: [{ id: 'a', textAr: 'أحب', isCorrect: true }, { id: 'b', textAr: 'أكره', isCorrect: false }] },
  ], [
    { problemAr: 'Lunch = غداء. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'وجبة منتصف النهار.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'I don\'t like fish. — don\'t = نفي. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'نفي بسيط.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ]),
  'english-4ap-unit5-pets-animals': build4ApPractice('english-4ap-unit5-pets-animals', [
    { problemAr: 'A cat says meow. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'cat = قطة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'A dog is a ....', solutionAr: 'pet', detailedCorrectionAr: 'pet = حيوان أليف.', type: 'fill_blank', fillBlankAnswerAr: 'pet' },
    { problemAr: 'The cow gives ....', solutionAr: 'milk', detailedCorrectionAr: 'milk = حليب.', options: [{ id: 'a', textAr: 'milk', isCorrect: true }, { id: 'b', textAr: 'eggs', isCorrect: false }] },
    { problemAr: 'Domestic animals live with people. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'حيوانات أليفة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ], [
    { problemAr: 'Sheep gives wool. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'wool = صوف.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'A rabbit is a small ....', solutionAr: 'animal', detailedCorrectionAr: 'animal = حيوان.', options: [{ id: 'a', textAr: 'animal', isCorrect: true }, { id: 'b', textAr: 'building', isCorrect: false }] },
  ]),
  'english-4ap-unit6-hobbies-games': build4ApPractice('english-4ap-unit6-hobbies-games', [
    { problemAr: 'I play football. — play = ....', solutionAr: 'ألعب', detailedCorrectionAr: 'play = ألعب.', options: [{ id: 'a', textAr: 'ألعب', isCorrect: true }, { id: 'b', textAr: 'آكل', isCorrect: false }] },
    { problemAr: 'Reading is a hobby. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'hobby = هواية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'I like .... (drawing)', solutionAr: 'drawing', detailedCorrectionAr: 'drawing = رسم.', type: 'fill_blank', fillBlankAnswerAr: 'drawing' },
    { problemAr: 'Do you like swimming? — swimming = ....', solutionAr: 'السباحة', detailedCorrectionAr: 'swimming = سباحة.', options: [{ id: 'a', textAr: 'السباحة', isCorrect: true }, { id: 'b', textAr: 'الطبخ', isCorrect: false }] },
  ], [
    { problemAr: 'Hobbies are free-time activities. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'أنشطة التسلية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'I play chess every Friday. — every = ....', solutionAr: 'كل', detailedCorrectionAr: 'every = كل.', options: [{ id: 'a', textAr: 'كل', isCorrect: true }, { id: 'b', textAr: 'أبداً', isCorrect: false }] },
  ]),
  'english-4ap-unit6-daily-routines-review': build4ApPractice('english-4ap-unit6-daily-routines-review', [
    { problemAr: 'I wake up at six o\'clock. — Present Simple for habits. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'عادة يومية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'After I wake up, I get ....', solutionAr: 'dressed', detailedCorrectionAr: 'get dressed.', type: 'fill_blank', fillBlankAnswerAr: 'dressed' },
    { problemAr: 'I have .... at seven.', solutionAr: 'breakfast', detailedCorrectionAr: 'have breakfast.', type: 'fill_blank', fillBlankAnswerAr: 'breakfast' },
    { problemAr: 'I go to bed at nine o\'clock. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'نهاية اليوم.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ], [
    { problemAr: 'Daily routines use Present Simple. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: '4AP — بدون Present Continuous.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'get dressed, have breakfast, go to school — daily routine verbs. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'أفعال الروتين.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
  ]),
};

const FRENCH_PACKS: Record<string, PracticePack> = Object.fromEntries(
  [
    ['french-4ap-projet1-seq1-presentation-famille', 'Se présenter — Être et Avoir'],
    ['french-4ap-projet1-seq2-maison-quartier', 'Maison et quartier — GNS/GV'],
    ['french-4ap-projet1-seq2-prepositions-lieu', 'Prépositions de lieu'],
    ['french-4ap-projet2-seq1-anniversaire-fete', 'Fêtes — forme négative'],
    ['french-4ap-projet2-seq2-fetes-nationales-possessifs', 'Fêtes nationales — possessifs'],
    ['french-4ap-projet2-adjectifs-qualificatifs', 'Adjectifs qualificatifs'],
    ['french-4ap-projet3-seq1-animaux-domestiques', 'Animaux domestiques'],
    ['french-4ap-projet3-seq2-environnement-imperatif', 'Environnement — impératif'],
    ['french-4ap-projet3-homophones', 'Homophones'],
  ].map(([id, topic]) => [id, genericPack(id, topic)]),
);

const CIVICS_PACKS: Record<string, PracticePack> = Object.fromEntries(
  [
    ['civics-4ap-public-private-property', 'الملكية العامة والخاصة'],
    ['civics-4ap-public-institutions', 'المؤسسات العمومية'],
    ['civics-4ap-road-safety', 'السلامة المرورية'],
    ['civics-4ap-national-identity-symbols', 'الهوية الوطنية والرموز'],
  ].map(([id, topic]) => [id, genericPack(id, topic)]),
);

const TAMAZIGHT_PACKS: Record<string, PracticePack> = Object.fromEntries(
  [
    ['tamazight-4ap-agemmay-tifinagh-lettres', 'الأبجدية التيفيناغ'],
    ['tamazight-4ap-chiffres-comptage', 'الأرقام والعد'],
    ['tamazight-4ap-famille-salutations', 'العائلة والتحيات'],
    ['tamazight-4ap-yennayer-patrimoine', 'يناير والتراث'],
  ].map(([id, topic]) => [id, genericPack(id, topic)]),
);

const ALL_PACKS: Record<string, PracticePack> = {
  ...ENGLISH_PACKS,
  ...FRENCH_PACKS,
  ...CIVICS_PACKS,
  ...TAMAZIGHT_PACKS,
};

function levelsOf(lesson: CourseLesson): number[] {
  return Array.from(new Set((lesson.progressiveExercises || []).map((ex) => ex.level))).sort();
}

function needsEnrichment(lesson: CourseLesson): boolean {
  const levels = levelsOf(lesson);
  return levels.length !== 4 || levels.join(',') !== '1,2,3,4' || (lesson.evaluationExercises?.length ?? 0) < 2;
}

/** Merge standard 4-tier practice into lessons that lack full 4AP exercise batteries. */
export function enrich4ApLessons(lessons: CourseLesson[]): CourseLesson[] {
  return lessons.map((lesson) => {
    const pack = ALL_PACKS[lesson.id];
    if (!pack || !needsEnrichment(lesson)) return lesson;
    return {
      ...lesson,
      progressiveExercises: pack.progressiveExercises,
      evaluationExercises: pack.evaluationExercises,
    };
  });
}
