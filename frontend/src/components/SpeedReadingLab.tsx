import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';

interface SpeedReadingLabProps {
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

interface Passage {
  id: number;
  titleAr: string;
  textAr: string;
  questions: { id: number; qAr: string; correct: string; options: string[] }[];
}

const PASSAGES: Passage[] = [
  {
    id: 1,
    titleAr: 'الجَمَلُ سَفِينَةُ الصَّحْرَاءِ',
    textAr:
      'يَعِيشُ الجَمَلُ فِي الصَّحْرَاءِ الجَزَائِرِيَّةِ الكُبْرَى. يَتَحَمَّلُ الجَمَلُ العَطَشَ لِأَيَّامٍ طَوِيلَةٍ بِفَضْلِ سَنَامِهِ الَّذِي يُخَزِّنُ الدُّهُونَ. يُسَاعِدُ التُّرْكِيبُونَ سُكَّانَ الصَّحْرَاءِ عَلَى التَّنَقُّلِ وَنَقْلِ البَضَائِعِ، لِذَلِكَ يُسَمَّى سَفِينَةَ الصَّحْرَاءِ.',
    questions: [
      { id: 1, qAr: 'أَيْنَ يَعِيشُ الجَمَلُ؟', correct: 'الصحراء', options: ['الصحراء', 'البحر', 'الجبل'] },
      { id: 2, qAr: 'مَاذَا يُخَزِّنُ الجَمَلُ فِي سَنَامِهِ؟', correct: 'الدهون', options: ['الدهون', 'الماء', 'الرمل'] },
    ],
  },
  {
    id: 2,
    titleAr: 'غَابَاتُ الجَزَائِرِ الخَضْرَاءُ',
    textAr:
      'تَمْتَلِكُ الجَزَائِرُ غَابَاتٍ جَمِيلَةً فِي مِنْطَقَةِ الأَطْلَسِ التَّلِّيِّ. تُغَطِّي أَشْجَارُ الصَّنَوْبَرِ وَالبَلُّوطِ مِسَاحَاتٍ وَاسِعَةً. تُوَفِّرُ هَذِهِ الغَابَاتُ مَأْوَى لِلْحَيَوَانَاتِ البَرِّيَّةِ مِثْلِ الأَيِّلِ وَالنِّسْرِ، وَيَجِبُ عَلَيْنَا حِمَايَتُهَا مِنَ الحَرَائِقِ.',
    questions: [
      { id: 1, qAr: 'أَيْنَ تَقَعُ الغَابَاتُ المَذْكُورَةُ؟', correct: 'الأطلس التلي', options: ['الأطلس التلي', 'الصحراء الكبرى', 'الهضاب العليا'] },
      { id: 2, qAr: 'مِمَّ يَجِبُ حِمَايَةُ الغَابَاتِ؟', correct: 'الحرائق', options: ['الحرائق', 'الثلوج', 'الرياح'] },
    ],
  },
  {
    id: 3,
    titleAr: 'نَظَافَتِي صِحَّتِي',
    textAr:
      'أَغْسِلُ يَدَيَّ قَبْلَ الأَكْلِ وَبَعْدَهُ لِأَتَجَنَّبَ الجَرَاثِيمَ. أُنَظِّفُ أَسْنَانِي بِالفُرْشَاةِ مَرَّتَيْنِ فِي اليَوْمِ. النَّظَافَةُ تَحْمِينِي مِنَ الأَمْرَاضِ وَتَجْعَلُنِي نَشِيطاً فِي المَدْرَسَةِ.',
    questions: [
      { id: 1, qAr: 'مَتَى أَغْسِلُ يَدَيَّ؟', correct: 'قبل الأكل وبعده', options: ['قبل الأكل وبعده', 'مرة في الأسبوع', 'عند النوم فقط'] },
      { id: 2, qAr: 'كَمْ مَرَّةً أُنَظِّفُ أَسْنَانِي فِي اليَوْمِ؟', correct: 'مرتين', options: ['مرتين', 'مرة واحدة', 'خمس مرات'] },
    ],
  },
];

export const SpeedReadingLab: React.FC<SpeedReadingLabProps> = ({ onReward, onBack }) => {
  const [passageIdx, setPassageIdx] = useState<number>(0);
  const [phase, setPhase] = useState<'ready' | 'reading' | 'quiz' | 'results'>('ready');
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passage = PASSAGES[passageIdx];

  useEffect(() => {
    if (phase === 'reading') {
      intervalRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const startReading = () => {
    setElapsedSec(0);
    setAnswers({});
    setPhase('reading');
  };

  const finishReading = () => {
    setReadingTime(elapsedSec);
    setPhase('quiz');
  };

  const handleAnswer = (qId: number, optAr: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optAr }));
  };

  const submitQuiz = () => {
    const correctCount = passage.questions.filter((q) => answers[q.id] === q.correct).length;
    if (correctCount === passage.questions.length) onReward?.(5, 15);
    else if (correctCount > 0) onReward?.(2, 5);
    setPhase('results');
  };

  const nextPassage = () => {
    setPassageIdx((prev) => (prev + 1) % PASSAGES.length);
    setPhase('ready');
    setElapsedSec(0);
  };

  const score = passage.questions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <div className="space-y-6 dir-rtl max-w-4xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-600/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="العودة للأدوات"
              className="shrink-0 hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>مُدَرِّبُ القِرَاءَةِ السَّرِيعَةِ وَالفَهْمِ (3AP - 5AP)</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">القِرَاءَةُ السَّرِيعَةُ وَاختِبَارُ الفَهْمِ</h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-3xl">
              اقرأ النص بسرعة وتركيز، ثم أجب عن أسئلة الفهم لترى كم فهمت مما قرأت.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        {phase === 'ready' && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-black text-[var(--app-text)]">{passage.titleAr}</h2>
            <p className="text-xs font-bold text-[var(--app-text-muted)]">
              اضغط "ابدأ القراءة" عندما تكون مستعداً. سيتم قياس الوقت الذي تستغرقه، ثم ستُجيب عن أسئلة الفهم.
            </p>
            <button
              onClick={startReading}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              ابْدَأِ القِرَاءَةَ 📖
            </button>
          </div>
        )}

        {phase === 'reading' && (
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-3 py-1.5 rounded-full text-xs font-black">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-sans tabular-nums">{elapsedSec} ثا</span>
            </div>
            <h2 className="text-base font-black text-[var(--app-text)]">{passage.titleAr}</h2>
            <p className="text-base sm:text-lg leading-loose font-bold text-[var(--app-text)] bg-[var(--app-card-subtle)] p-5 rounded-2xl border border-[var(--app-card-border)] text-right">
              {passage.textAr}
            </p>
            <button
              onClick={finishReading}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              اِنْتَهَيْتُ مِنَ القِرَاءَةِ ✅
            </button>
          </div>
        )}

        {phase === 'quiz' && (
          <div className="space-y-4">
            <h2 className="text-sm font-black text-[var(--app-text)] text-center">أَجِبْ عَنِ الأَسْئِلَةِ دُونَ الرُّجُوعِ إِلَى النَّصِّ:</h2>
            {passage.questions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
                <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        answers[q.id] === opt
                          ? 'bg-blue-600 text-white border-blue-700 font-black'
                          : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-blue-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                onClick={submitQuiz}
                disabled={Object.keys(answers).length < passage.questions.length}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                تَحَقَّقْ مِنَ النَّتِيجَةِ ✅
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && (
          <div className="text-center space-y-4">
            <h2 className="text-lg font-black text-[var(--app-text)]">النَّتِيجَةُ</h2>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="p-4 rounded-2xl bg-blue-100 border border-blue-300 min-w-[120px]">
                <p className="text-[10px] font-black text-blue-700">وَقْتُ القِرَاءَةِ</p>
                <p className="text-2xl font-black text-blue-900 font-sans">{readingTime} ثا</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 min-w-[120px]">
                <p className="text-[10px] font-black text-emerald-700">الإِجَابَاتُ الصَّحِيحَةُ</p>
                <p className="text-2xl font-black text-emerald-900 font-sans">
                  {score}/{passage.questions.length}
                </p>
              </div>
            </div>
            <button
              onClick={nextPassage}
              className="px-6 py-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-black text-sm shadow-xs transition-all cursor-pointer"
            >
              نَصٌّ جَدِيدٌ ⟵
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
