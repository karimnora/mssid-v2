import type { PreschoolDomain, PreschoolLanguage, PreschoolModule } from './types';

type Idea = Record<PreschoolLanguage, string>;
const ideas: Record<PreschoolDomain, Idea> = {
  numbers: { ar: 'عند تحضير المائدة، ضعوا ملعقة لكل شخص وعدّوها معاً.', fr: 'À table, donnez une cuillère à chaque personne et comptez ensemble.', en: 'At the table, give each person one spoon and count together.' },
  letters: { ar: 'اختاروا كلمة من النشاط وابحثوا عن شيء يبدأ بالصوت نفسه.', fr: 'Choisissez un mot de l’activité et cherchez un objet qui commence par le même son.', en: 'Choose a word from the activity and find an object starting with the same sound.' },
  colors: { ar: 'اختاروا لوناً وابحثوا معاً عن ثلاثة أشياء بهذا اللون.', fr: 'Choisissez une couleur et cherchez ensemble trois objets de cette couleur.', en: 'Choose a colour and find three objects of that colour together.' },
  shapes: { ar: 'ابحثوا عن شكل دائري وآخر مربع في البيت.', fr: 'Cherchez une forme ronde et une forme carrée dans la maison.', en: 'Find a round shape and a square shape at home.' },
  animals: { ar: 'قلّدوا صوت حيوان ودعوا الطفل يخمّن اسمه، ثم بدّلوا الأدوار.', fr: 'Imitez un animal et laissez l’enfant deviner, puis échangez les rôles.', en: 'Make an animal sound and let your child guess, then swap roles.' },
  writing: { ar: 'ارسموا خطوطاً كبيرة بالإصبع في الهواء، ثم قلّدوا بعضكم.', fr: 'Dessinez de grands chemins du doigt dans l’air, puis imitez-vous.', en: 'Draw big paths in the air with a finger, then copy each other.' },
  values: { ar: 'اختاروا موقفاً من النشاط ومثّلوه معاً، ثم بدّلوا الأدوار.', fr: 'Choisissez une situation de l’activité, jouez-la ensemble puis échangez les rôles.', en: 'Choose a situation from the activity, act it out together and swap roles.' },
  creative: { ar: 'ارسموا ثلاث صور لحدث من يومكم ودعوا الطفل يحكي ما حدث.', fr: 'Dessinez trois moments de votre journée et laissez l’enfant raconter.', en: 'Draw three moments from your day and let your child tell the story.' },
  world: { ar: 'اطلبوا من الطفل أن يريكم شيئاً في البيت يشبه ما اكتشفه اليوم.', fr: 'Invitez l’enfant à vous montrer dans la maison quelque chose lié à sa découverte du jour.', en: 'Ask your child to show you something at home linked to today’s discovery.' },
};

const specific: Record<string, Idea> = {
  'preschool-calendar': { ar: 'عند المساء، احكوا ما فعلتم أولاً وما فعلتم بعده.', fr: 'Le soir, racontez ce que vous avez fait d’abord, puis ensuite.', en: 'In the evening, talk about what you did first and what came next.' },
  'preschool-body': { ar: 'قبل الأكل، اغسلوا اليدين معاً: ماء، صابون، فرك، شطف وتجفيف.', fr: 'Avant le repas, lavez-vous les mains ensemble : eau, savon, frotter, rincer, sécher.', en: 'Before a meal, wash hands together: water, soap, rub, rinse and dry.' },
  'preschool-emotions': { ar: 'اسألوا: كيف شعرت اليوم؟ استمعوا دون الحكم على الشعور.', fr: 'Demandez : « Comment t’es-tu senti aujourd’hui ? » Écoutez sans juger l’émotion.', en: 'Ask: “How did you feel today?” Listen without judging the feeling.' },
  'preschool-stories': { ar: 'دعوا الطفل يحكي القصة بطريقته واسألوه: ماذا يمكن أن يحدث بعدها؟', fr: 'Laissez l’enfant raconter à sa façon, puis demandez : « Que pourrait-il se passer ensuite ? »', en: 'Let your child tell the story their way, then ask: “What might happen next?”' },
};

export function preschoolHomeIdea(module: PreschoolModule, language: PreschoolLanguage): string {
  return (specific[module.id] ?? ideas[module.domain])[language];
}
