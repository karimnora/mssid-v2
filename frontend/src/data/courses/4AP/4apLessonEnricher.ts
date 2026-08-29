import { CourseLesson } from '../../../types';
import { build4ApPractice } from './4apExercisePack';

type PracticePack = ReturnType<typeof build4ApPractice>;

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

const FRENCH_PACKS: Record<string, PracticePack> = {
  'french-4ap-projet1-seq1-presentation-famille': build4ApPractice('french-4ap-projet1-seq1-presentation-famille', [
    { problemAr: 'Complète : Je ___ Yacine. (verbe Être)', solutionAr: 'suis', detailedCorrectionAr: 'Je suis — 1re personne du singulier du verbe Être.', options: [{ id: 'a', textAr: 'suis', isCorrect: true }, { id: 'b', textAr: 'as', isCorrect: false }] },
    { problemAr: 'Tu ___ dix ans. (verbe Avoir)', solutionAr: 'as', detailedCorrectionAr: 'Tu as — 2e personne du singulier du verbe Avoir.', type: 'fill_blank', fillBlankAnswerAr: 'as' },
    { problemAr: '"Il est" s\'écrit avec un "t". (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Il/Elle est se termine par "t", contrairement à "Tu es".', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Quel article utiliser : "___ garçon que je connais bien" (précis) ?', solutionAr: 'Le', detailedCorrectionAr: 'On connaît déjà ce garçon précis : article défini "Le".', options: [{ id: 'a', textAr: 'Le', isCorrect: true }, { id: 'b', textAr: 'Un', isCorrect: false }] },
  ], [
    { problemAr: '"un/une/des" sont des articles indéfinis. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Ils désignent une personne ou chose non précisée.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Comment conjugue-t-on "avoir" avec "Nous" ?', solutionAr: 'Nous avons', detailedCorrectionAr: 'Nous avons — 1re personne du pluriel.', options: [{ id: 'a', textAr: 'Nous avons', isCorrect: true }, { id: 'b', textAr: 'Nous ont', isCorrect: false }] },
  ]),
  'french-4ap-projet1-seq2-maison-quartier': build4ApPractice('french-4ap-projet1-seq2-maison-quartier', [
    { problemAr: 'Dans "Le chat dort", quel est le GNS ?', solutionAr: 'Le chat', detailedCorrectionAr: '"Le chat" fait l\'action de dormir : c\'est le sujet (GNS).', options: [{ id: 'a', textAr: 'Le chat', isCorrect: true }, { id: 'b', textAr: 'dort', isCorrect: false }] },
    { problemAr: 'Conjugue "habiter" avec "Nous" : Nous ___.', solutionAr: 'habitons', detailedCorrectionAr: 'Nous habitons — terminaison -ons au présent.', type: 'fill_blank', fillBlankAnswerAr: 'habitons' },
    { problemAr: 'Le GV contient toujours le verbe. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Le Groupe Verbal se construit autour du verbe.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Dans "Amine joue dans le jardin", que représente "joue dans le jardin" ?', solutionAr: 'le GV', detailedCorrectionAr: 'Tout ce qui suit le sujet, à partir du verbe, forme le GV.', options: [{ id: 'a', textAr: 'le GV', isCorrect: true }, { id: 'b', textAr: 'le GNS', isCorrect: false }] },
  ], [
    { problemAr: 'Une phrase simple = GNS + GV. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'C\'est la structure de base de la phrase simple.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Conjugue "trouver" avec "Elle" :', solutionAr: 'Elle trouve', detailedCorrectionAr: 'Elle trouve — terminaison -e au présent.', options: [{ id: 'a', textAr: 'Elle trouve', isCorrect: true }, { id: 'b', textAr: 'Elle trouves', isCorrect: false }] },
  ]),
  'french-4ap-projet1-seq2-prepositions-lieu': build4ApPractice('french-4ap-projet1-seq2-prepositions-lieu', [
    { problemAr: 'Le livre est ___ la table (au-dessus).', solutionAr: 'sur', detailedCorrectionAr: '"sur" indique une position au-dessus.', type: 'fill_blank', fillBlankAnswerAr: 'sur' },
    { problemAr: 'Le chat est ... le lit (en dessous).', solutionAr: 'sous', detailedCorrectionAr: '"sous" indique une position en dessous.', options: [{ id: 'a', textAr: 'sous', isCorrect: true }, { id: 'b', textAr: 'sur', isCorrect: false }] },
    { problemAr: '"devant" et "derrière" veulent dire la même chose. (vrai/faux)', solutionAr: 'faux', detailedCorrectionAr: '"devant" = en face, "derrière" = à l\'arrière : ce sont des contraires.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: false }, { id: 'false', textAr: 'faux', isCorrect: true }] },
    { problemAr: 'Traduis : « أمام المدرسة »', solutionAr: 'devant l\'école', detailedCorrectionAr: '"أمام" se traduit par "devant".', options: [{ id: 'a', textAr: 'devant l\'école', isCorrect: true }, { id: 'b', textAr: 'derrière l\'école', isCorrect: false }] },
  ], [
    { problemAr: '"dans" se traduit par "داخل" en arabe. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: '"dans" indique l\'intérieur d\'un lieu.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Complète : Le stylo est ... le cartable.', solutionAr: 'dans', detailedCorrectionAr: 'Le stylo est à l\'intérieur du cartable : "dans".', type: 'fill_blank', fillBlankAnswerAr: 'dans' },
  ]),
  'french-4ap-projet2-seq1-anniversaire-fete': build4ApPractice('french-4ap-projet2-seq1-anniversaire-fete', [
    { problemAr: 'Mets à la forme négative : « Il fait un gâteau. »', solutionAr: 'Il ne fait pas un gâteau.', detailedCorrectionAr: 'On encadre le verbe avec "ne" et "pas".', options: [{ id: 'a', textAr: 'Il ne fait pas un gâteau.', isCorrect: true }, { id: 'b', textAr: 'Il fait pas ne un gâteau.', isCorrect: false }] },
    { problemAr: 'Je ___ un gâteau pour la fête. (verbe Faire)', solutionAr: 'fais', detailedCorrectionAr: 'Je fais — 1re personne du singulier.', type: 'fill_blank', fillBlankAnswerAr: 'fais' },
    { problemAr: 'La forme négative encadre le verbe avec "ne...pas". (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'C\'est la structure de base de la négation.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Quelle phrase est correcte à la forme négative ?', solutionAr: 'Je ne mange pas de gâteau.', detailedCorrectionAr: '"ne" avant le verbe, "pas" après.', options: [{ id: 'a', textAr: 'Je ne mange pas de gâteau.', isCorrect: true }, { id: 'b', textAr: 'Je mange ne pas de gâteau.', isCorrect: false }] },
  ], [
    { problemAr: '« Vous faites vos devoirs. » — le verbe Faire est bien conjugué. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Vous faites — 2e personne du pluriel.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Comment conjugue-t-on "faire" avec "Ils" ?', solutionAr: 'Ils font', detailedCorrectionAr: 'Ils font — forme irrégulière du verbe Faire.', options: [{ id: 'a', textAr: 'Ils font', isCorrect: true }, { id: 'b', textAr: 'Ils faisent', isCorrect: false }] },
  ]),
  'french-4ap-projet2-seq2-fetes-nationales-possessifs': build4ApPractice('french-4ap-projet2-seq2-fetes-nationales-possessifs', [
    { problemAr: 'Complète : « ___ anniversaire est demain » (le mien).', solutionAr: 'Mon', detailedCorrectionAr: '"Mon" indique que l\'anniversaire m\'appartient.', options: [{ id: 'a', textAr: 'Mon', isCorrect: true }, { id: 'b', textAr: 'Ton', isCorrect: false }] },
    { problemAr: '___ fête est très belle. (celle-ci, féminin)', solutionAr: 'Cette', detailedCorrectionAr: '"Cette" désigne une chose précise au féminin singulier.', type: 'fill_blank', fillBlankAnswerAr: 'Cette' },
    { problemAr: 'L\'Aïd et Yennayer sont des fêtes célébrées en Algérie. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Ce sont deux fêtes importantes du calendrier algérien.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Comment conjugue-t-on "aller" avec "Nous" ?', solutionAr: 'Nous allons', detailedCorrectionAr: 'Nous allons — forme irrégulière du verbe Aller.', options: [{ id: 'a', textAr: 'Nous allons', isCorrect: true }, { id: 'b', textAr: 'Nous allez', isCorrect: false }] },
  ], [
    { problemAr: '"ces" est un adjectif démonstratif pluriel. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: '"ces" désigne plusieurs choses précises.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Quel mot indique que le cadeau m\'appartient ?', solutionAr: 'mon cadeau', detailedCorrectionAr: '"mon" est un adjectif possessif.', options: [{ id: 'a', textAr: 'mon cadeau', isCorrect: true }, { id: 'b', textAr: 'ce cadeau', isCorrect: false }] },
  ]),
  'french-4ap-projet2-adjectifs-qualificatifs': build4ApPractice('french-4ap-projet2-adjectifs-qualificatifs', [
    { problemAr: 'Accorde : « une ___ fête » (grand).', solutionAr: 'grande', detailedCorrectionAr: 'fête est féminin : on ajoute un "e".', options: [{ id: 'a', textAr: 'grande', isCorrect: true }, { id: 'b', textAr: 'grand', isCorrect: false }] },
    { problemAr: 'Féminin de "beau" : un beau cadeau → une ___ fête.', solutionAr: 'belle', detailedCorrectionAr: 'beau devient belle au féminin.', type: 'fill_blank', fillBlankAnswerAr: 'belle' },
    { problemAr: 'L\'adjectif qualificatif s\'accorde avec le nom qu\'il décrit. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Accord en genre et en nombre.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Pluriel de « un beau cadeau » :', solutionAr: 'de beaux cadeaux', detailedCorrectionAr: 'beau devient beaux au pluriel.', options: [{ id: 'a', textAr: 'de beaux cadeaux', isCorrect: true }, { id: 'b', textAr: 'des beau cadeau', isCorrect: false }] },
  ], [
    { problemAr: '"grand/grande" : le féminin ajoute un "e". (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'C\'est la règle générale du féminin des adjectifs.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Accorde : « des ___ gâteaux » (petit).', solutionAr: 'petits', detailedCorrectionAr: 'gâteaux est masculin pluriel : on ajoute un "s".', options: [{ id: 'a', textAr: 'petits', isCorrect: true }, { id: 'b', textAr: 'petit', isCorrect: false }] },
  ]),
  'french-4ap-projet3-seq1-animaux-domestiques': build4ApPractice('french-4ap-projet3-seq1-animaux-domestiques', [
    { problemAr: 'Dans "un petit chat", quel mot est l\'adjectif épithète ?', solutionAr: 'petit', detailedCorrectionAr: '"petit" est collé au nom "chat" sans verbe entre eux.', options: [{ id: 'a', textAr: 'petit', isCorrect: true }, { id: 'b', textAr: 'chat', isCorrect: false }] },
    { problemAr: 'Conjugue "finir" avec "Je" : Je ___.', solutionAr: 'finis', detailedCorrectionAr: 'Je finis — terminaison -is au présent (2e groupe).', type: 'fill_blank', fillBlankAnswerAr: 'finis' },
    { problemAr: 'L\'adjectif épithète est collé au nom sans verbe entre eux. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Contrairement à l\'attribut, relié par le verbe être.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Quel est un verbe du 2ème groupe (-ir) ?', solutionAr: 'finir', detailedCorrectionAr: 'finir se termine en -ir et se conjugue comme les verbes du 2e groupe.', options: [{ id: 'a', textAr: 'finir', isCorrect: true }, { id: 'b', textAr: 'habiter', isCorrect: false }] },
  ], [
    { problemAr: 'Le chat, le chien, le lapin sont des animaux domestiques. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Ce sont des animaux qui vivent avec les humains.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Conjugue "choisir" avec "Nous" :', solutionAr: 'Nous choisissons', detailedCorrectionAr: 'Nous choisissons — terminaison -issons au présent.', options: [{ id: 'a', textAr: 'Nous choisissons', isCorrect: true }, { id: 'b', textAr: 'Nous choisissez', isCorrect: false }] },
  ]),
  'french-4ap-projet3-seq2-environnement-imperatif': build4ApPractice('french-4ap-projet3-seq2-environnement-imperatif', [
    { problemAr: 'Quelle phrase est à l\'impératif ?', solutionAr: 'Nettoie ta classe !', detailedCorrectionAr: 'L\'impératif donne un ordre sans exprimer le sujet.', options: [{ id: 'a', textAr: 'Nettoie ta classe !', isCorrect: true }, { id: 'b', textAr: 'Tu nettoies ta classe.', isCorrect: false }] },
    { problemAr: 'Donne un ordre avec "jeter" : « Ne ___ pas les papiers par terre ! »', solutionAr: 'jette', detailedCorrectionAr: 'Ne jette pas — impératif du verbe jeter.', type: 'fill_blank', fillBlankAnswerAr: 'jette' },
    { problemAr: 'On n\'exprime pas le sujet à l\'impératif. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'C\'est la particularité de ce mode verbal.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Dans "maison", la lettre "s" se prononce...', solutionAr: '[z]', detailedCorrectionAr: 'Entre deux voyelles, le "s" se prononce [z].', options: [{ id: 'a', textAr: '[z]', isCorrect: true }, { id: 'b', textAr: '[s]', isCorrect: false }] },
  ], [
    { problemAr: 'Dans "salle", le "s" se prononce [s]. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'En début de mot, le "s" se prononce [s].', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Quelle consigne protège l\'environnement ?', solutionAr: 'Ne jette pas de déchets par terre !', detailedCorrectionAr: 'C\'est une consigne de propreté à l\'impératif.', options: [{ id: 'a', textAr: 'Ne jette pas de déchets par terre !', isCorrect: true }, { id: 'b', textAr: 'Jette tes déchets partout !', isCorrect: false }] },
  ]),
  'french-4ap-projet3-homophones': build4ApPractice('french-4ap-projet3-homophones', [
    { problemAr: 'Complète : « Il ___ un chat » (verbe avoir).', solutionAr: 'a', detailedCorrectionAr: '"a" est une forme du verbe avoir.', options: [{ id: 'a', textAr: 'a', isCorrect: true }, { id: 'b', textAr: 'à', isCorrect: false }] },
    { problemAr: 'Complète : « Il va ___ l\'école » (préposition).', solutionAr: 'à', detailedCorrectionAr: '"à" est une préposition de lieu.', type: 'fill_blank', fillBlankAnswerAr: 'à' },
    { problemAr: '"est" est une forme du verbe être. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Il/Elle est — verbe être.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Complète : « Sami ___ son frère jouent. »', solutionAr: 'ont', detailedCorrectionAr: 'Ils "ont" un jeu (verbe avoir), pas "on" (pronom).', options: [{ id: 'a', textAr: 'ont', isCorrect: true }, { id: 'b', textAr: 'on', isCorrect: false }] },
  ], [
    { problemAr: '"son" peut être un adjectif possessif. (vrai/faux)', solutionAr: 'vrai', detailedCorrectionAr: 'Ex : "son cahier" — le cahier de lui/elle.', type: 'true_false', options: [{ id: 'true', textAr: 'vrai', isCorrect: true }, { id: 'false', textAr: 'faux', isCorrect: false }] },
    { problemAr: 'Complète : « Le chat ___ noir. »', solutionAr: 'est', detailedCorrectionAr: '"est" — verbe être, ici pas de liaison "et".', options: [{ id: 'a', textAr: 'est', isCorrect: true }, { id: 'b', textAr: 'et', isCorrect: false }] },
  ]),
};

const CIVICS_PACKS: Record<string, PracticePack> = {
  'civics-4ap-public-private-property': build4ApPractice('civics-4ap-public-private-property', [
    { problemAr: 'المدرسة والحديقة العامة أمثلة على:', solutionAr: 'ملكية عامة', detailedCorrectionAr: 'المدرسة والحديقة تخدمان جميع المواطنين، فهما ملكية عامة.', options: [{ id: 'a', textAr: 'ملكية عامة', isCorrect: true }, { id: 'b', textAr: 'ملكية خاصة', isCorrect: false }] },
    { problemAr: 'بيتي وسيارة أبي هما ملكية ....', solutionAr: 'خاصة', detailedCorrectionAr: 'تخص عائلتي فقط، فهي ملكية خاصة.', type: 'fill_blank', fillBlankAnswerAr: 'خاصة' },
    { problemAr: 'يحق لأي شخص إتلاف الملكية العامة لأنها لا تخص أحداً. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'الملكية العامة تخص الجميع، ويجب على الجميع احترامها والحفاظ عليها.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
    { problemAr: 'لماذا نحترم الملكية العامة؟', solutionAr: 'لأنها تخدم جميع المواطنين', detailedCorrectionAr: 'الملكية العامة (المدارس، الحدائق...) ملك للجميع.', options: [{ id: 'a', textAr: 'لأنها تخدم جميع المواطنين', isCorrect: true }, { id: 'b', textAr: 'لأنها ملك شخص واحد', isCorrect: false }] },
  ], [
    { problemAr: 'الملكية الخاصة تخص شخصاً أو عائلة معينة. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'بعكس الملكية العامة التي تخص الجميع.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'أي من هذه ملكية خاصة؟', solutionAr: 'دراجة أخي', detailedCorrectionAr: 'دراجة أخي تخصه هو وحده، فهي ملكية خاصة.', options: [{ id: 'a', textAr: 'دراجة أخي', isCorrect: true }, { id: 'b', textAr: 'الحديقة العمومية', isCorrect: false }] },
  ]),
  'civics-4ap-public-institutions': build4ApPractice('civics-4ap-public-institutions', [
    { problemAr: 'أين نرسل الطرود والرسائل؟', solutionAr: 'البريد', detailedCorrectionAr: 'مؤسسة البريد مسؤولة عن الطرود والرسائل.', options: [{ id: 'a', textAr: 'البريد', isCorrect: true }, { id: 'b', textAr: 'البلدية', isCorrect: false }] },
    { problemAr: 'نتوجه إلى ... لإصدار وثائق الحالة المدنية.', solutionAr: 'البلدية', detailedCorrectionAr: 'البلدية مسؤولة عن وثائق الحالة المدنية للمواطنين.', type: 'fill_blank', fillBlankAnswerAr: 'البلدية' },
    { problemAr: 'المؤسسات العمومية تخدم جميع المواطنين. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'مثل المدرسة والبريد والبلدية، كلها في خدمة المواطنين.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'ما دور المدرسة كمؤسسة عمومية؟', solutionAr: 'التعليم والتربية', detailedCorrectionAr: 'المدرسة مؤسسة عمومية دورها التعليم والتربية.', options: [{ id: 'a', textAr: 'التعليم والتربية', isCorrect: true }, { id: 'b', textAr: 'بيع المنتجات', isCorrect: false }] },
  ], [
    { problemAr: 'البريد مؤسسة عمومية. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'البريد يخدم جميع المواطنين، فهو مؤسسة عمومية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'من يدير شؤون الحي والمواطنين محلياً؟', solutionAr: 'البلدية', detailedCorrectionAr: 'البلدية هي المؤسسة المحلية المسؤولة عن شؤون السكان.', options: [{ id: 'a', textAr: 'البلدية', isCorrect: true }, { id: 'b', textAr: 'المكتبة', isCorrect: false }] },
  ]),
  'civics-4ap-road-safety': build4ApPractice('civics-4ap-road-safety', [
    { problemAr: 'ماذا يعني اللون الأحمر في إشارة المرور؟', solutionAr: 'قف', detailedCorrectionAr: 'الأحمر يعني التوقف الفوري.', options: [{ id: 'a', textAr: 'قف', isCorrect: true }, { id: 'b', textAr: 'انطلق', isCorrect: false }] },
    { problemAr: 'نعبر الطريق من ... المخصص للراجلين.', solutionAr: 'الممر', detailedCorrectionAr: 'ممر الراجلين هو المكان الآمن لعبور الطريق.', type: 'fill_blank', fillBlankAnswerAr: 'الممر' },
    { problemAr: 'يجوز عبور الطريق دون النظر يميناً وشمالاً. (صح/خطأ)', solutionAr: 'خطأ', detailedCorrectionAr: 'يجب النظر يميناً وشمالاً قبل العبور لتجنب الحوادث.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: false }, { id: 'false', textAr: 'خطأ', isCorrect: true }] },
    { problemAr: 'ماذا يعني اللون الأخضر في إشارة المرور؟', solutionAr: 'يمكن السير', detailedCorrectionAr: 'الأخضر يعني أن الطريق آمن للعبور أو السير.', options: [{ id: 'a', textAr: 'يمكن السير', isCorrect: true }, { id: 'b', textAr: 'قف فوراً', isCorrect: false }] },
  ], [
    { problemAr: 'احترام قواعد المرور يحمي حياتنا وحياة الآخرين. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'قواعد المرور وُضعت للسلامة العامة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'أين يجب أن يمشي الراجل؟', solutionAr: 'على الرصيف المخصص للمشاة', detailedCorrectionAr: 'الرصيف مكان آمن بعيداً عن حركة السيارات.', options: [{ id: 'a', textAr: 'على الرصيف المخصص للمشاة', isCorrect: true }, { id: 'b', textAr: 'في منتصف الطريق', isCorrect: false }] },
  ]),
  'civics-4ap-national-identity-symbols': build4ApPractice('civics-4ap-national-identity-symbols', [
    { problemAr: 'ما لون علم الجزائر؟', solutionAr: 'أخضر وأبيض بهلال ونجمة حمراء', detailedCorrectionAr: 'العلم الجزائري أخضر وأبيض، ويتوسطه هلال ونجمة حمراء.', options: [{ id: 'a', textAr: 'أخضر وأبيض بهلال ونجمة حمراء', isCorrect: true }, { id: 'b', textAr: 'أزرق وأصفر', isCorrect: false }] },
    { problemAr: 'نشيد بلادنا الوطني اسمه ....', solutionAr: 'قسماً', detailedCorrectionAr: '«قسماً» هو النشيد الوطني الجزائري.', type: 'fill_blank', fillBlankAnswerAr: 'قسماً' },
    { problemAr: 'العلم الوطني رمز يحترمه جميع المواطنين. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'العلم رمز للسيادة الوطنية يستحق الاحترام.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'ماذا يرمز اللون الأخضر في العلم الجزائري؟', solutionAr: 'الخير والطبيعة', detailedCorrectionAr: 'الأخضر يرمز إلى الخير والطبيعة والإسلام.', options: [{ id: 'a', textAr: 'الخير والطبيعة', isCorrect: true }, { id: 'b', textAr: 'الحرب', isCorrect: false }] },
  ], [
    { problemAr: 'الهلال والنجمة الحمراء يظهران في علم الجزائر. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'هما جزء أساسي من رمزية العلم الوطني.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'لماذا نحترم الرموز الوطنية؟', solutionAr: 'لأنها تمثل هويتنا وبلادنا', detailedCorrectionAr: 'الرموز الوطنية تعبّر عن هوية وسيادة البلاد.', options: [{ id: 'a', textAr: 'لأنها تمثل هويتنا وبلادنا', isCorrect: true }, { id: 'b', textAr: 'لأنها مجرد ألوان بلا معنى', isCorrect: false }] },
  ]),
};

const TAMAZIGHT_PACKS: Record<string, PracticePack> = {
  'tamazight-4ap-agemmay-tifinagh-lettres': build4ApPractice('tamazight-4ap-agemmay-tifinagh-lettres', [
    { problemAr: 'ما اسم الأبجدية الأمازيغية الرسمية؟', solutionAr: 'تيفيناغ', detailedCorrectionAr: 'تيفيناغ (Tifinagh) هي الأبجدية الأمازيغية الرسمية.', options: [{ id: 'a', textAr: 'تيفيناغ', isCorrect: true }, { id: 'b', textAr: 'اللاتينية', isCorrect: false }] },
    { problemAr: 'كلمة Agemmay تعني ....', solutionAr: 'الأبجدية', detailedCorrectionAr: 'Agemmay = الأبجدية / الحروف الهجائية.', type: 'fill_blank', fillBlankAnswerAr: 'الأبجدية' },
    { problemAr: 'التيفيناغ من أقدم أنظمة الكتابة في شمال إفريقيا. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'تيفيناغ نظام كتابة عريق موجود منذ زمن بعيد.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'أشكال حروف التيفيناغ مستوحاة من:', solutionAr: 'الطبيعة والرموز التراثية', detailedCorrectionAr: 'الدوائر والخطوط والصلبان مستوحاة من الطبيعة والتراث.', options: [{ id: 'a', textAr: 'الطبيعة والرموز التراثية', isCorrect: true }, { id: 'b', textAr: 'الحروف الصينية', isCorrect: false }] },
  ], [
    { problemAr: 'لكل حرف تيفيناغي نسخ لاتيني مقابل. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'يُستعمل النسخ اللاتيني للمساعدة على النطق والكتابة.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'حروف التيفيناغ تتميز بأشكالها:', solutionAr: 'الهندسية (دوائر وخطوط)', detailedCorrectionAr: 'أشكال هندسية متقنة من دوائر وخطوط وصلبان.', options: [{ id: 'a', textAr: 'الهندسية (دوائر وخطوط)', isCorrect: true }, { id: 'b', textAr: 'المستديرة فقط', isCorrect: false }] },
  ]),
  'tamazight-4ap-chiffres-comptage': build4ApPractice('tamazight-4ap-chiffres-comptage', [
    { problemAr: 'كيف نقول «واحد» بالأمازيغية؟', solutionAr: 'Yiwen', detailedCorrectionAr: 'Yiwen = واحد (1).', options: [{ id: 'a', textAr: 'Yiwen', isCorrect: true }, { id: 'b', textAr: 'Sin', isCorrect: false }] },
    { problemAr: 'العدد Kraḍ بالأمازيغية يعني ....', solutionAr: 'ثلاثة', detailedCorrectionAr: 'Kraḍ = ثلاثة (3).', type: 'fill_blank', fillBlankAnswerAr: 'ثلاثة' },
    { problemAr: 'Semmus تعني خمسة بالأمازيغية. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'Semmus = خمسة (5).', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'ما ترتيب هذه الأعداد تصاعدياً: Sa, Yiwen, Ttam؟', solutionAr: 'Yiwen، Sa، Ttam', detailedCorrectionAr: 'Yiwen(1) < Sa(7) < Ttam(8).', options: [{ id: 'a', textAr: 'Yiwen، Sa، Ttam', isCorrect: true }, { id: 'b', textAr: 'Ttam، Sa، Yiwen', isCorrect: false }] },
  ], [
    { problemAr: 'Mraw تعني عشرة بالأمازيغية. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'Mraw = عشرة (10).', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'كيف نكتب الأعداد الأمازيغية؟', solutionAr: 'بالخط التيفيناغي واللاتيني', detailedCorrectionAr: 'يمكن كتابتها بالطريقتين.', options: [{ id: 'a', textAr: 'بالخط التيفيناغي واللاتيني', isCorrect: true }, { id: 'b', textAr: 'بالخط الصيني فقط', isCorrect: false }] },
  ]),
  'tamazight-4ap-famille-salutations': build4ApPractice('tamazight-4ap-famille-salutations', [
    { problemAr: 'كلمة Azul تعني:', solutionAr: 'مرحباً / السلام', detailedCorrectionAr: 'Azul تحية شائعة تعني مرحباً أو السلام.', options: [{ id: 'a', textAr: 'مرحباً / السلام', isCorrect: true }, { id: 'b', textAr: 'وداعاً', isCorrect: false }] },
    { problemAr: 'كلمة Yemma تعني ....', solutionAr: 'الأم', detailedCorrectionAr: 'Yemma = الأم.', type: 'fill_blank', fillBlankAnswerAr: 'الأم' },
    { problemAr: 'Baba تعني الأب بالأمازيغية. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'Baba = الأب.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'كلمة Tanemmirt تعني:', solutionAr: 'شكراً', detailedCorrectionAr: 'Tanemmirt = شكراً.', options: [{ id: 'a', textAr: 'شكراً', isCorrect: true }, { id: 'b', textAr: 'أخي', isCorrect: false }] },
  ], [
    { problemAr: 'Gma تعني الأخ. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'Gma = الأخ.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'ما معنى Weltma؟', solutionAr: 'أختي', detailedCorrectionAr: 'Weltma = أختي.', options: [{ id: 'a', textAr: 'أختي', isCorrect: true }, { id: 'b', textAr: 'جدي', isCorrect: false }] },
  ]),
  'tamazight-4ap-yennayer-patrimoine': build4ApPractice('tamazight-4ap-yennayer-patrimoine', [
    { problemAr: 'متى يحتفل الجزائريون بعيد يناير؟', solutionAr: '12 جانفي', detailedCorrectionAr: 'يُحتفل بعيد يناير في 12 جانفي من كل سنة.', options: [{ id: 'a', textAr: '12 جانفي', isCorrect: true }, { id: 'b', textAr: '1 نوفمبر', isCorrect: false }] },
    { problemAr: 'إلى ماذا يرمز عيد يناير بالإضافة إلى الأرض؟', solutionAr: 'الخير والخصوبة', detailedCorrectionAr: 'يرمز إلى الأرض والخير والخصوبة وتجدد الطبيعة.', options: [{ id: 'a', textAr: 'الخير والخصوبة', isCorrect: true }, { id: 'b', textAr: 'الحرب', isCorrect: false }] },
    { problemAr: 'يناير هو رأس السنة الفلاحية الأمازيغية. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'يناير (Yennayer) رأس السنة الأمازيغية الفلاحية.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'من الأطباق التقليدية المرتبطة بعيد يناير:', solutionAr: 'Seksu (كسكس)', detailedCorrectionAr: 'الكسكس من الأطباق التقليدية لهذا العيد.', options: [{ id: 'a', textAr: 'Seksu (كسكس)', isCorrect: true }, { id: 'b', textAr: 'البيتزا', isCorrect: false }] },
  ], [
    { problemAr: 'عيد يناير عيد وطني رسمي في الجزائر. (صح/خطأ)', solutionAr: 'صحيح', detailedCorrectionAr: 'أصبح عيد يناير عطلة وطنية رسمية في الجزائر.', type: 'true_false', options: [{ id: 'true', textAr: 'صحيح', isCorrect: true }, { id: 'false', textAr: 'خطأ', isCorrect: false }] },
    { problemAr: 'ماذا يعبّر عنه الاحتفال بيناير؟', solutionAr: 'التضامن والبهجة الوطنية', detailedCorrectionAr: 'يجسد الاحتفال روح التضامن والفرح الجماعي.', options: [{ id: 'a', textAr: 'التضامن والبهجة الوطنية', isCorrect: true }, { id: 'b', textAr: 'الحزن والعزلة', isCorrect: false }] },
  ]),
};

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
