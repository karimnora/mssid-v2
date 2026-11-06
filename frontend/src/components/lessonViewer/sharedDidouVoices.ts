import voice0 from "../../assets/audio/didou-shared/42f02365fc39ba70.mp3";
import voice1 from "../../assets/audio/didou-shared/5e512cbfd791540a.mp3";
import voice2 from "../../assets/audio/didou-shared/26d41b7aaf308346.mp3";
import voice3 from "../../assets/audio/didou-shared/c446a9058941fde4.mp3";
import voice4 from "../../assets/audio/didou-shared/8a8a28ba03899e06.mp3";
import voice5 from "../../assets/audio/didou-shared/fff18a6d74e314b8.mp3";
import voice6 from "../../assets/audio/didou-shared/a6e900c4dc33e875.mp3";
import voice7 from "../../assets/audio/didou-shared/07fbd3f70e0db017.mp3";
import voice8 from "../../assets/audio/didou-shared/8450c8a70fea0744.mp3";
import voice9 from "../../assets/audio/didou-shared/f0f01b7cd228fbd3.mp3";
import voice10 from "../../assets/audio/didou-shared/13c6dfa5e14a62ac.mp3";
import voice11 from "../../assets/audio/didou-shared/3c57044e32dee833.mp3";
import voice12 from "../../assets/audio/didou-shared/1045ccd83e023071.mp3";
import voice13 from "../../assets/audio/didou-shared/e663a8f6869311ad.mp3";
import voice14 from "../../assets/audio/didou-shared/c21b021ecec87623.mp3";
import voice15 from "../../assets/audio/didou-shared/162c84345d7b6022.mp3";
import voice16 from "../../assets/audio/didou-shared/73430603f758c55e.mp3";
import voice17 from "../../assets/audio/didou-shared/520df63bd699664a.mp3";
import voice18 from "../../assets/audio/didou-shared/b562d36eea2c3c1e.mp3";
import voice19 from "../../assets/audio/didou-shared/b2bd934ff5617f79.mp3";
import voice20 from "../../assets/audio/didou-shared/33449552969ea930.mp3";
import voice21 from "../../assets/audio/didou-shared/ae8cdbf54ac034d9.mp3";
import voice22 from "../../assets/audio/didou-shared/f133dc8d75e707fc.mp3";
export const SHARED_DIDOU_VOICES = [
  {
    text: "كوّن أعدادًا صحيحة، ثم عدّ الأجزاء الباقية.",
    src: voice0,
    durationMs: 5250,
  },
  {
    text: "ضع الكسر بين عددين صحيحين متتاليين.",
    src: voice1,
    durationMs: 4650,
  },
  {
    text: "قسّم كل جزء بالتساوي. تتغيّر الأعداد وتبقى المساحة نفسها.",
    src: voice2,
    durationMs: 6550,
  },
  {
    text: "انظر إلى الرسم وجرّب مرة أخرى. يمكنك طلب تلميح.",
    src: voice3,
    durationMs: 3850,
  },
  {
    text: "أحسنت! الرسم والعملية يعبّران عن الكمية نفسها.",
    src: voice4,
    durationMs: 5450,
  },
  {
    text: "في مختبر الحديقة، أطبّق ما تعلّمته على كسور جديدة.",
    src: voice5,
    durationMs: 5600,
  },
  { text: "مهمّة اليوم: نراجع معًا.", src: voice6, durationMs: 3350 },
  { text: "مهمّة اليوم: نكمل من حيث توقّفنا.", src: voice7, durationMs: 4650 },
  { text: "مهمّة اليوم: نكتشف درسًا جديدًا.", src: voice8, durationMs: 4000 },
  { text: "أحسنت! أنجزت مهمّة اليوم.", src: voice9, durationMs: 3100 },
  { text: "استرح قليلًا، أنت بطل!", src: voice10, durationMs: 2500 },
  {
    text: "العنوان والتفاصيل في البطاقة. اضغط أكمل لنبدأ.",
    src: voice11,
    durationMs: 4450,
  },
  { text: "نحضّر دروسك. انتظر لحظة.", src: voice12, durationMs: 3000 },
  { text: "الرياضيات", src: voice13, durationMs: 2000 },
  { text: "اللغة العربية", src: voice14, durationMs: 1950 },
  { text: "اللغة الأمازيغية", src: voice15, durationMs: 1700 },
  { text: "التربية العلمية والتكنولوجية", src: voice16, durationMs: 3650 },
  { text: "التربية الفنية والموسيقية", src: voice17, durationMs: 3150 },
  { text: "التاريخ والجغرافيا", src: voice18, durationMs: 2300 },
  { text: "التربية الإسلامية", src: voice19, durationMs: 2250 },
  { text: "التربية المدنية", src: voice20, durationMs: 2750 },
  { text: "اللغة الفرنسية", src: voice21, durationMs: 2350 },
  { text: "اللغة الإنجليزية", src: voice22, durationMs: 2200 },
] as const;
const strip = (s: string) =>
  s
    .replace(/[\u064b-\u065f\u0670]/g, "")
    .replace(/\s+/g, " ")
    .trim();
export const sharedVoiceFor = (text: string) =>
  SHARED_DIDOU_VOICES.find((clip) => strip(clip.text) === strip(text));
