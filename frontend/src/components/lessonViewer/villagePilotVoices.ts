import { sharedVoiceFor, SHARED_DIDOU_VOICES } from './sharedDidouVoices';
import voice0 from "../../assets/lessons/5ap-fractions/voice/5aaa84c562fc5e82.mp3";
import voice1 from "../../assets/lessons/5ap-fractions/voice/bc171d56e200993b.mp3";
import voice2 from "../../assets/lessons/5ap-fractions/voice/28839420805fc631.mp3";
import voice3 from "../../assets/lessons/5ap-fractions/voice/2c59aae0f3bf6e8a.mp3";
import voice4 from "../../assets/lessons/5ap-fractions/voice/17f8b82ee4ec5e64.mp3";
import voice5 from "../../assets/lessons/5ap-fractions/voice/87131e5d346fd0dd.mp3";
import voice6 from "../../assets/lessons/5ap-fractions/voice/0c434a59930644f6.mp3";
import voice7 from "../../assets/lessons/5ap-fractions/voice/574ea9cb998a5563.mp3";
import voice8 from "../../assets/lessons/5ap-fractions/voice/e1d30e4da8e1deb5.mp3";
import voice9 from "../../assets/lessons/5ap-fractions/voice/9281e9aa337aa3fb.mp3";
import voice10 from "../../assets/lessons/5ap-fractions/voice/6a3274d2b4d32055.mp3";
import voice11 from "../../assets/lessons/5ap-fractions/voice/4714ebda3b620b5b.mp3";
import voice12 from "../../assets/lessons/5ap-fractions/voice/b5663712e9f2369e.mp3";
import voice13 from "../../assets/lessons/5ap-fractions/voice/9dde231169bfd783.mp3";
import voice14 from "../../assets/lessons/5ap-fractions/voice/8493091eb18b02ef.mp3";
import voice15 from "../../assets/lessons/5ap-fractions/voice/3b0346f7732f76b3.mp3";
import voice16 from "../../assets/lessons/5ap-fractions/voice/8f7225e263711651.mp3";
import voice17 from "../../assets/lessons/5ap-fractions/voice/e2ac2b02e0b37247.mp3";
import voice18 from "../../assets/lessons/5ap-fractions/voice/f7b336eaeb2fdc9f.mp3";
import voice19 from "../../assets/lessons/5ap-fractions/voice/b6da34e939e6fe94.mp3";
import voice20 from "../../assets/lessons/5ap-fractions/voice/335c1b5a0b2ea253.mp3";
import voice21 from "../../assets/lessons/5ap-fractions/voice/155b659eaa8e9421.mp3";
import voice22 from "../../assets/lessons/5ap-fractions/voice/c5201a25e5812ebf.mp3";
import voice23 from "../../assets/lessons/5ap-fractions/voice/1bc1d54c7715b196.mp3";
import voice24 from "../../assets/lessons/5ap-fractions/voice/ee857d87b2592867.mp3";
import voice25 from "../../assets/lessons/5ap-fractions/voice/f6506ea7e10a04e7.mp3";
import voice26 from "../../assets/lessons/5ap-fractions/voice/b22b0945ba971fb2.mp3";
export const PILOT_VOICES = [
{ text:"الكسر يمثل جزءاً من كل — مثل قطعة من كعكة أو حصة من أرض. سنتعلم كيف نقرأ الكسور ونقارنها ونجد كسوراً أخرى تساويها في القيمة.", src:voice0, durationMs:12200 },
{ text:"حصر كسر بين عددين طبيعيين متتاليين:\n - إذا كان البسط < المقام ➔ 0 < الكسر < 1.\n - إذا كان البسط > المقام ➔ نقسم البسط على المقام لإيجاد الجزء الصحيح (مثال: 17/5 = 3 + 2/5 ➔ 3 < 17/5 < 4).", src:voice1, durationMs:22900 },
{ text:"أنواع الكسور بالنسبة للواحد الصحيح (1):\n - إذا كان البسط أصغر من المقام: الكسر أصغر من 1 (مثال: 3/5 < 1).\n - إذا كان البسط يساوي المقام: الكسر يساوي 1 (مثال: 5/5 = 1).\n - إذا كان البسط أكبر من المقام: الكسر أكبر من 1 (مثال: 8/5 > 1).", src:voice2, durationMs:27600 },
{ text:"الكسور العشريّة وتفكيكها: 438/100 = 4 + 3/10 + 8/100 = 4 + 38/100.", src:voice3, durationMs:16200 },
{ text:"تكافؤ الكسور: نضرب أو نقسم البسط والمقام في نفس العدد غير المعدوم للحصول على كسر مكافئ (مثال: 1/2 = 5/10 = 50/100).", src:voice4, durationMs:13350 },
{ text:"مقارنة كسور بنفس المقام: نقارن البسطين مباشرة؛ الكسر ذو البسط الأكبر هو الأكبر (مثال: 5/8 > 3/8).", src:voice5, durationMs:11650 },
{ text:"لنجرّب مرة أخرى. المقام هو العدد الموجود أسفل خط الكسر.", src:voice6, durationMs:6250 },
{ text:"لنجرّب مرة أخرى. قارن البسط بالمقام: أيهما أكبر؟", src:voice7, durationMs:5550 },
{ text:"لنجرّب مرة أخرى. قارن البسط بالمقام في كل كسر.", src:voice8, durationMs:5650 },
{ text:"لنجرّب مرة أخرى. اضرب البسط والمقام في نفس العدد الذي يحوّل 5 إلى 15.", src:voice9, durationMs:7350 },
{ text:"لنجرّب مرة أخرى. اقسم البسط على المقام لتجد الجزء الصحيح.", src:voice10, durationMs:6550 },
{ text:"لنجرّب مرة أخرى. عندما تتساوى المقامات، قارن البسوط مباشرة.", src:voice11, durationMs:5900 },
{ text:"لنجرّب مرة أخرى. مساحة الجزء = المساحة الكلية × (البسط ÷ المقام).", src:voice12, durationMs:7350 },
{ text:"هَيَّا نَتَدَرَّبُ! اِبْدَأْ بِالمُسْتَوَى الأَوَّلِ، ثُمَّ اصْعَدْ خُطْوَةً خُطْوَةً.", src:voice13, durationMs:6500 },
{ text:"جَرِّبْ بِيَدِكَ: اُنْقُرْ وَاكْتَشِفْ.", src:voice14, durationMs:4650 },
{ text:"حَانَ وَقْتُ التَّقْوِيمِ. اِقْرَأْ كُلَّ سُؤَالٍ بِهُدُوءٍ.", src:voice15, durationMs:5600 },
{ text:"آخِرُ مَرْحَلَةٍ! أَجِبْ، وَإِنْ أَخْطَأْتَ أُسَاعِدُكَ.", src:voice16, durationMs:4850 },
{ text:"هيّا نتعلّم معاً درس «الكسور العادية والعشرية: التفكيك، الحصر والتكافؤ». سأرافقك خطوة بخطوة!", src:voice17, durationMs:11150 },
{ text:"المقام هو العدد الموجود أسفل خط الكسر.", src:voice18, durationMs:3900 },
{ text:"قارن البسط بالمقام: أيهما أكبر؟", src:voice19, durationMs:4050 },
{ text:"اضرب البسط والمقام في نفس العدد الذي يحوّل 5 إلى 15.", src:voice20, durationMs:6650 },
{ text:"قارن البسط بالمقام في كل كسر.", src:voice21, durationMs:3550 },
{ text:"اقسم البسط على المقام لتجد الجزء الصحيح.", src:voice22, durationMs:5000 },
{ text:"عندما تتساوى المقامات، قارن البسوط مباشرة.", src:voice23, durationMs:6550 },
{ text:"مساحة الجزء = المساحة الكلية × (البسط ÷ المقام).", src:voice24, durationMs:5500 },
{ text:"يملك عمّك مزرعة كبيرة في متيجة، ويريد تقسيم أرضه بين محاصيل مختلفة (بطاطا، طماطم، قمح). ساعده على فهم الكسور خطوة بخطوة لتحديد المساحة الصحيحة لكل محصول.", src:voice25, durationMs:15750 },
{ text:"انظر دائماً إلى المقام قبل الحكم على حجم الكسر: بسط أصغر من المقام يعني كسر أصغر من 1، وبسط أكبر يعني كسر أكبر من 1.", src:voice26, durationMs:12300 }
] as const;
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const stripMarks = (text: string) => text.replace(/[\u064b-\u065f\u0670]/g, "");
const recordings = new Map<string, string>(
  PILOT_VOICES.map((clip) => [normalize(clip.text), clip.src])
);
const sharedRecordings = new Map<string, string>(SHARED_DIDOU_VOICES.map(clip => [normalize(clip.text), clip.src]));
const plain = new Map<string, string | null>();
for (const clip of PILOT_VOICES) {
  const key = stripMarks(normalize(clip.text));
  plain.set(key, plain.has(key) ? null : clip.src);
}
export function pilotVoiceFor(text: string) {
  const key = normalize(text);
  return (
    recordings.get(key) ?? sharedRecordings.get(key) ??
    (key === stripMarks(key)
      ? plain.get(key) ?? sharedVoiceFor(text)?.src
      : undefined)
  );
}
