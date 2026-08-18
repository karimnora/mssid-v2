import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryGrade } from '../types';

interface TopographyMapLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

interface ReliefRegion {
  id: string;
  nameAr: string;
  icon: string;
  reliefAr: string;
  climateAr: string;
  rainfallAr: string;
  vegetationAr: string;
  heightPct: number;
  color: string;
}

const REGIONS: ReliefRegion[] = [
  {
    id: 'tell',
    nameAr: 'التَّلُّ (المُنَاطِقُ السَّاحِلِيَّةُ)',
    icon: '🏔️🌊',
    reliefAr: 'جِبَالٌ سَاحِلِيَّةٌ وَسُهُولٌ خِصْبَةٌ عَلَى البَحْرِ الأَبْيَضِ المُتَوَسِّطِ.',
    climateAr: 'مُعْتَدِلٌ رَطْبٌ (مَتَوَسِّطِيٌّ)',
    rainfallAr: 'عَالِيَةٌ 🌧️',
    vegetationAr: '🌳🍇 غَابَاتٌ وَبَسَاتِينُ',
    heightPct: 45,
    color: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'high_plateaus',
    nameAr: 'الهِضَابُ العُلْيَا',
    icon: '⛰️',
    reliefAr: 'سُهُولٌ مُرْتَفِعَةٌ وَشُطُوطٌ مِلْحِيَّةٌ بَيْنَ سِلْسِلَتَيِ الأَطْلَسِ.',
    climateAr: 'قَارِّيٌّ: صَيْفٌ حَارٌّ وَشِتَاءٌ بَارِدٌ',
    rainfallAr: 'مُتَوَسِّطَةٌ ⛅',
    vegetationAr: '🌾 حَلْفَاءُ وَمَرَاعٍ',
    heightPct: 60,
    color: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'saharan_atlas',
    nameAr: 'الأَطْلَسُ الصَّحْرَاوِيُّ',
    icon: '🏞️',
    reliefAr: 'سِلْسِلَةٌ جَبَلِيَّةٌ تَفْصِلُ الهِضَابَ العُلْيَا عَنِ الصَّحْرَاءِ.',
    climateAr: 'بَارِدٌ شِتَاءً، جَافٌّ صَيْفاً',
    rainfallAr: 'ضَعِيفَةٌ 🌤️',
    vegetationAr: '🌲 غَابَاتٌ جَبَلِيَّةٌ قَلِيلَةٌ',
    heightPct: 75,
    color: 'from-orange-600 to-amber-800',
  },
  {
    id: 'sahara',
    nameAr: 'الصَّحْرَاءُ الكُبْرَى',
    icon: '🏜️',
    reliefAr: 'كُثْبَانٌ رَمْلِيَّةٌ (العِرْقُ) وَهِضَابٌ صَخْرِيَّةٌ (الطَّاسِيلِي وَالهَقَّارُ).',
    climateAr: 'صَحْرَاوِيٌّ: حَارٌّ جِدّاً نَهَاراً وَبَارِدٌ لَيْلاً',
    rainfallAr: 'نَادِرَةٌ جِدّاً ☀️',
    vegetationAr: '🌴 وَاحَاتُ النَّخِيلِ فَقَطْ',
    heightPct: 20,
    color: 'from-rose-600 to-red-800',
  },
];

const QUIZ_QUESTIONS = [
  { id: 1, qAr: 'أَيْنَ نَجِدُ أَعْلَى نِسْبَةِ أَمْطَارٍ فِي الجَزَائِرِ؟', correct: 'tell', options: ['tell', 'sahara', 'high_plateaus'] },
  { id: 2, qAr: 'أَيْنَ تَقَعُ وَاحَاتُ النَّخِيلِ؟', correct: 'sahara', options: ['sahara', 'tell', 'saharan_atlas'] },
  { id: 3, qAr: 'أَيْنَ نَجِدُ الشُّطُوطَ المِلْحِيَّةَ؟', correct: 'high_plateaus', options: ['high_plateaus', 'tell', 'sahara'] },
];

export const TopographyMapLab: React.FC<TopographyMapLabProps> = ({ onReward }) => {
  const [selectedId, setSelectedId] = useState<string>('tell');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const selected = REGIONS.find((r) => r.id === selectedId) || REGIONS[0];

  const handleAnswer = (qId: number, optId: string, correct: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: true }));
    if (optId === correct) onReward?.(5, 15);
  };

  return (
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-orange-700 via-red-800 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-600/40 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>خريطة تضاريس ومناخ الجزائر (4AP - 5AP)</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black font-sans">مِنَ السَّاحِلِ إِلَى الصَّحْرَاءِ: تَضَارِيسُ الجَزَائِرِ</h1>
          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed max-w-3xl">
            استكشف المقطع التضاريسي للجزائر من الشمال إلى الجنوب، وتعرّف على المناخ والأمطار والنباتات في كل منطقة.
          </p>
        </div>
      </div>

      {/* Relief cross-section (north → south) */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <p className="text-xs font-black text-[var(--app-text-muted)] text-center">
          ⬆️ الشَّمَالُ (البَحْرُ) — اضْغَطْ عَلَى مِنْطَقَةٍ لِاسْتِكْشَافِهَا — الجَنُوبُ (الصَّحْرَاءُ) ⬇️
        </p>
        <div className="flex items-end gap-2 h-40 sm:h-48">
          {REGIONS.map((region) => {
            const isSelected = selectedId === region.id;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedId(region.id)}
                className={`flex-1 rounded-t-2xl bg-gradient-to-t ${region.color} text-white flex flex-col items-center justify-end pb-3 gap-1 transition-all cursor-pointer relative ${
                  isSelected ? 'ring-4 ring-amber-300 ring-offset-2 scale-[1.03] shadow-xl z-10' : 'hover:scale-[1.02] opacity-90 hover:opacity-100'
                }`}
                style={{ height: `${region.heightPct}%` }}
              >
                <span className="text-2xl">{region.icon}</span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {REGIONS.map((region) => (
            <p key={region.id} className="text-[10px] sm:text-[11px] font-black text-center text-[var(--app-text-muted)] leading-tight">
              {region.nameAr}
            </p>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-[var(--app-text)] flex items-center gap-2">
          <span className="text-2xl">{selected.icon}</span> {selected.nameAr}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">التَّضَارِيسُ</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.reliefAr}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">المُنَاخُ وَالأَمْطَارُ</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.climateAr}</p>
            <p className="text-xs font-black text-sky-700 mt-1">{selected.rainfallAr}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">الغِطَاءُ النَّبَاتِيُّ</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.vegetationAr}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-[var(--app-text)]">اختبر معلوماتك:</h3>
        {QUIZ_QUESTIONS.map((q) => {
          const isAnswered = !!answers[q.id];
          return (
            <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
              <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {q.options.map((optId) => {
                  const isCorrect = optId === q.correct;
                  const opt = REGIONS.find((r) => r.id === optId)!;
                  return (
                    <button
                      key={optId}
                      onClick={() => !isAnswered && handleAnswer(q.id, optId, q.correct)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                          : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-orange-400'
                      }`}
                    >
                      {opt.icon} {opt.nameAr}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
