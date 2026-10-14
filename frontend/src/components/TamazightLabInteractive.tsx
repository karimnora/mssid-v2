import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Award,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  Search,
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { speakText } from '../utils/speech';

interface TamazightLabProps {
  grade?: string;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

interface TifinaghLetter {
  tifinagh: string;
  latin: string;
  arabicEquiv: string;
  name: string;
  exampleTif: string;
  exampleAr: string;
  exampleFr: string;
}

const TIFINAGH_ALPHABET: TifinaghLetter[] = [
  { tifinagh: 'ⴰ', latin: 'a', arabicEquiv: 'أ / ا', name: 'Ya', exampleTif: 'ⴰⵎⴰⵏ (Aman)', exampleAr: 'ماء', exampleFr: 'Eau' },
  { tifinagh: 'ⴱ', latin: 'b', arabicEquiv: 'ب', name: 'Yab', exampleTif: 'ⴱⴰⴱⴰ (Baba)', exampleAr: 'أبي', exampleFr: 'Père' },
  { tifinagh: 'ⴳ', latin: 'g', arabicEquiv: 'ڨ', name: 'Yag', exampleTif: 'ⴳⵎⴰ (Gma)', exampleAr: 'أخي', exampleFr: 'Frère' },
  { tifinagh: 'ⴷ', latin: 'd', arabicEquiv: 'د', name: 'Yad', exampleTif: 'ⴷⴰⴷⴷⴰ (Dadda)', exampleAr: 'عمي / جدي', exampleFr: 'Grand-père' },
  { tifinagh: 'ⴹ', latin: 'ḍ', arabicEquiv: 'ض', name: 'Yaḍ', exampleTif: 'ⴹⴰⵕ (Ḍar)', exampleAr: 'رجل / قدم', exampleFr: 'Pied' },
  { tifinagh: 'ⴻ', latin: 'e', arabicEquiv: 'ـَ', name: 'Yey', exampleTif: 'ⴻⵍⵍⵉ (Elli)', exampleAr: 'ابنتي', exampleFr: 'Fille' },
  { tifinagh: 'ⴼ', latin: 'f', arabicEquiv: 'ف', name: 'Yaf', exampleTif: 'ⴼⵓⵙ (Fus)', exampleAr: 'يد', exampleFr: 'Main' },
  { tifinagh: 'ⴽ', latin: 'k', arabicEquiv: 'ك', name: 'Yak', exampleTif: 'ⴽⵓⵙⴽⵓ (Kusku)', exampleAr: 'كسكسي', exampleFr: 'Couscous' },
  { tifinagh: 'ⵍ', latin: 'l', arabicEquiv: 'ل', name: 'Yal', exampleTif: 'ⵍⴻⵙⵙ (Less)', exampleAr: 'ارتدِ / البس', exampleFr: 'Habille-toi' },
  { tifinagh: 'ⵎ', latin: 'm', arabicEquiv: 'م', name: 'Yam', exampleTif: 'ⵎⴻⵎⵎⵉ (Memmi)', exampleAr: 'ابني', exampleFr: 'Fils' },
  { tifinagh: 'ⵏ', latin: 'n', arabicEquiv: 'ن', name: 'Yan', exampleTif: 'ⵏⴻⴽ (Nek)', exampleAr: 'أنا', exampleFr: 'Moi' },
  { tifinagh: 'ⵓ', latin: 'u / w', arabicEquiv: 'و', name: 'Yaw', exampleTif: 'ⵓⵍ (Ul)', exampleAr: 'قلب', exampleFr: 'Cœur' },
  { tifinagh: 'ⵔ', latin: 'r', arabicEquiv: 'ر', name: 'Yar', exampleTif: 'ⵔⵓ (Ru)', exampleAr: 'اكتب', exampleFr: 'Écris' },
  { tifinagh: 'ⵙ', latin: 's', arabicEquiv: 'س', name: 'Yas', exampleTif: 'ⵙⵉⵏ (Sin)', exampleAr: 'اثنان', exampleFr: 'Deux' },
  { tifinagh: 'ⵜ', latin: 't', arabicEquiv: 'ت', name: 'Yat', exampleTif: 'ⵜⴰⴷⴷⴰⵔⵜ (Taddart)', exampleAr: 'قرية / بيت', exampleFr: 'Village / Maison' },
  { tifinagh: 'ⵣ', latin: 'z', arabicEquiv: 'ز', name: 'Yaz', exampleTif: 'ⵣⴻⴷⴷⵉⵖ (Zeddiɣ)', exampleAr: 'أسكن', exampleFr: 'J\'habite' },
  { tifinagh: 'ⵥ', latin: 'ẓ', arabicEquiv: 'ظ', name: 'Yaẓ', exampleTif: 'ⵥⴰⵍ (Ẓal)', exampleAr: 'صلّ', exampleFr: 'Prie' },
  { tifinagh: 'ⵉ', latin: 'i', arabicEquiv: 'ي', name: 'Yi', exampleTif: 'ⵉⵜⵔⵉ (Itri)', exampleAr: 'نجم', exampleFr: 'Étoile' },
];

const VOCABULARY_THEMES = [
  {
    theme: 'الأرقام (Uṭṭunen)',
    words: [
      { tif: 'ⵢⵉⵡⴻⵏ', lat: 'Yiwen', ar: 'واحد (1)', fr: 'Un' },
      { tif: 'ⵙⵉⵏ', lat: 'Sin', ar: 'اثنان (2)', fr: 'Deux' },
      { tif: 'ⴽⵔⴰⴹ', lat: 'Kraḍ', ar: 'ثلاثة (3)', fr: 'Trois' },
      { tif: 'ⴽⵓⵥ', lat: 'Kuẓ', ar: 'أربعة (4)', fr: 'Quatre' },
      { tif: 'ⵙⵎⵎⵓⵙ', lat: 'Semmus', ar: 'خمسة (5)', fr: 'Cinq' },
    ],
  },
  {
    theme: 'العائلة (Tawacult)',
    words: [
      { tif: 'ⵢⴻⵎⵎⴰ', lat: 'Yemma', ar: 'أمي', fr: 'Maman' },
      { tif: 'ⴱⴰⴱⴰ', lat: 'Baba', ar: 'أبي', fr: 'Papa' },
      { tif: 'ⴳⵎⴰ', lat: 'Gma', ar: 'أخي', fr: 'Mon frère' },
      { tif: 'ⵓⵍⵜⵎⴰ', lat: 'Ultma', ar: 'أختي', fr: 'Ma sœur' },
      { tif: 'ⵊⴻⴷⴷⵉ', lat: 'Jeddi', ar: 'جدي', fr: 'Mon grand-père' },
    ],
  },
  {
    theme: 'الطبيعة والوطن (Tamazirt)',
    words: [
      { tif: 'ⵉⵜⵔⵉ', lat: 'Itri', ar: 'نجمة', fr: 'Étoile' },
      { tif: 'ⴰⵢⵢⵓⵔ', lat: 'Ayyur', ar: 'قمر / هلال', fr: 'Lune' },
      { tif: 'ⵉⵟⵉⵊ', lat: 'Iṭij', ar: 'شمس', fr: 'Soleil' },
      { tif: 'ⴰⴷⵔⴰⵔ', lat: 'Adrar', ar: 'جبل', fr: 'Montagne' },
      { tif: 'ⴰⵙⵉⴼ', lat: 'Asif', ar: 'نهر / واد', fr: 'Rivière' },
    ],
  },
];

export const TamazightLabInteractive: React.FC<TamazightLabProps> = ({
  grade = '4AP',
  onBack,
  onReward,
}) => {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'vocabulary' | 'quiz'>('alphabet');
  const [selectedLetter, setSelectedLetter] = useState<TifinaghLetter>(TIFINAGH_ALPHABET[0]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const QUIZ_ITEMS = [
    {
      question: 'ما هو الحرف التيفيناغ الذي يطابق حرف (الزاي ⵣ / Yaz) في الهوية الأمازيغية؟',
      options: ['ⵣ', 'ⵎ', 'ⵜ', 'ⴼ'],
      correct: 'ⵣ',
      explanation: 'حرف الياز (ⵣ) يرمز للإنسان الحر في الخط التيفيناغي العريق.',
    },
    {
      question: 'ماذا تعني كلمة "Aman (ⴰⵎⴰⵏ)" باللغة العربية؟',
      options: ['ماء', 'شمس', 'جبل', 'طعام'],
      correct: 'ماء',
      explanation: 'أمان (Aman) تعني الماء وسر الحياة في اللغة الأمازيغية.',
    },
    {
      question: 'ما هو المقابل العربي للعدد "Sin (ⵙⵉⵏ)"؟',
      options: ['اثنان (2)', 'واحد (1)', 'خمسة (5)', 'عشرة (10)'],
      correct: 'اثنان (2)',
      explanation: 'سين (Sin) تعني الرقم اثنان.',
    },
    {
      question: 'ماذا تعني كلمة "Adrar (ⴰⴷⵔⴰⵔ)" في الجغرافيا الجزائرية؟',
      options: ['جبل', 'بحر', 'صحراء', 'غابة'],
      correct: 'جبل',
      explanation: 'أدرار تعني الجبل الشامخ، ومنها سميت مدينة أدرار الجزائرية العريقة.',
    },
  ];

  const currentQuiz = QUIZ_ITEMS[quizIndex % QUIZ_ITEMS.length];

  const handleAnswerQuiz = (option: string) => {
    if (feedback) return;
    setSelectedAnswer(option);
    const isCorrect = option === currentQuiz.correct;
    if (isCorrect) {
      setFeedback({ isCorrect: true, msg: `ممتاز! إجابة صحيحة: ${currentQuiz.explanation}` });
      AuthService.addScore(25);
      if (onReward) onReward(10, 25);
    } else {
      setFeedback({ isCorrect: false, msg: `إجابة غير دقيقة. الجواب الصحيح هو: ${currentQuiz.correct}. ${currentQuiz.explanation}` });
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((p) => p + 1);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
            ⵣ
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">
                المختبر التفاعلي للغة الأمازيغية (Tamazight)
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full">
                تيفيناغ • Tifinagh {grade}
              </span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 font-medium">
              تعلم حروف التيفيناغ، المفردات اللغوية، الأرقام والعائلة بالصوت والتمارين التفاعلية الشاملة.
            </p>
          </div>
        </div>

        {onBack && (
          <button
            data-activity-navigation="true" onClick={onBack}
            aria-label="العودة للأدوات"
            className="hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl transition-all border border-white/30 shadow-sm cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('alphabet')}
          className={`hit-target flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === 'alphabet'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          حروف التيفيناغ (Agemmay) ⵣ
        </button>
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`hit-target flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === 'vocabulary'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          قاموس المفردات المصورة 📚
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`hit-target flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          تحدي الأمازيغية 🏆
        </button>
      </div>

      {/* Tab 1: Alphabet */}
      {activeTab === 'alphabet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[var(--app-card-bg)] p-5 rounded-3xl border border-[var(--app-card-border)] shadow-md space-y-4">
            <h2 className="font-black text-base text-[var(--app-text)]">
              اضغط على الحرف لاكتشاف نطقه ومثاله:
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
              {TIFINAGH_ALPHABET.map((item) => (
                <button
                  key={item.tifinagh}
                  onClick={() => setSelectedLetter(item)}
                  className={`p-3 rounded-2xl text-center transition-all cursor-pointer border ${
                    selectedLetter.tifinagh === item.tifinagh
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-105'
                      : 'bg-[var(--app-card-subtle)] text-[var(--app-text)] border-[var(--app-card-border)] hover:bg-emerald-50'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl font-black mb-1">{item.tifinagh}</div>
                  <div className="text-[10px] font-mono opacity-80">{item.latin}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-6 border border-emerald-200 shadow-md flex flex-col justify-between space-y-4">
            <div className="text-center space-y-3">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-700 text-white flex items-center justify-center text-5xl font-black shadow-lg">
                {selectedLetter.tifinagh}
              </div>
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-xl font-black text-slate-800">حرف: {selectedLetter.name} ({selectedLetter.latin})</h3>
                <button
                  onClick={() => speakText(selectedLetter.name, 'fr-FR', 0.8)}
                  aria-label="استمع لنطق الحرف"
                  className="hit-target shrink-0 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-800 font-bold mt-1">المقابل بالعربية: {selectedLetter.arabicEquiv}</p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">مثال تطبيقي:</span>
                <button
                  onClick={() => speakText(selectedLetter.exampleTif.replace(/[^a-zA-Zḍẓ\s]/g, ''), 'fr-FR', 0.75)}
                  aria-label="استمع للمثال"
                  className="hit-target shrink-0 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-black text-emerald-700">{selectedLetter.exampleTif}</div>
              <div className="text-slate-600">المعنى بالعربية: <strong>{selectedLetter.exampleAr}</strong></div>
              <div className="text-slate-500 text-[11px]">Français: <em>{selectedLetter.exampleFr}</em></div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  AuthService.addScore(10);
                  if (onReward) onReward(5, 10);
                }}
                className="hit-target w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                تدربت على الحرف (+10 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary */}
      {activeTab === 'vocabulary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VOCABULARY_THEMES.map((theme) => (
            <div
              key={theme.theme}
              className="bg-[var(--app-card-bg)] rounded-3xl p-5 border border-[var(--app-card-border)] shadow-md space-y-4"
            >
              <h2 className="font-black text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {theme.theme}
              </h2>
              <div className="space-y-2">
                {theme.words.map((w) => (
                  <div
                    key={w.lat}
                    className="p-3 bg-[var(--app-card-subtle)] rounded-xl border border-[var(--app-card-border)] flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => speakText(w.lat, 'fr-FR', 0.8)}
                      aria-label="استمع للكلمة"
                      className="hit-target shrink-0 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1">
                      <div className="text-base font-black text-emerald-800">{w.tif}</div>
                      <div className="text-[10px] font-mono text-[var(--app-text-muted)]">{w.lat}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[var(--app-text)]">{w.ar}</div>
                      <div className="text-[10px] text-[var(--app-text-muted)]">{w.fr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-lg max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-[var(--app-text-muted)] border-b border-[var(--app-card-border)] pb-3">
            <span>السؤال {(quizIndex % QUIZ_ITEMS.length) + 1} من {QUIZ_ITEMS.length}</span>
            <span className="text-amber-600 font-black">+25 XP لكل إجابة صحيحة</span>
          </div>

          <h2 className="text-lg font-black text-[var(--app-text)] leading-relaxed">
            {currentQuiz.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswerQuiz(opt)}
                className={`hit-target p-4 rounded-2xl font-black text-base transition-all text-center cursor-pointer border-2 ${
                  selectedAnswer === opt
                    ? opt === currentQuiz.correct
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-rose-50 border-rose-500 text-rose-900'
                    : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] hover:border-emerald-400 text-[var(--app-text)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold space-y-2 border ${
                feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <p>{feedback.msg}</p>
              <button
                onClick={handleNextQuiz}
                className="hit-target px-4 bg-emerald-700 text-white rounded-xl font-black text-xs cursor-pointer hover:bg-emerald-800"
              >
                السؤال التالي ➔
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
