import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { canShowRespiratoryAnatomyTab } from '../utils/labGradePolicy';

interface HumanAnatomyLabProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type AnatomyTab = 'digestive' | 'respiratory';

const DIGESTIVE_ORGANS = [
  { id: 'mouth', order: 1, nameAr: 'الفَمُ', icon: '👄', roleAr: 'يَبْدَأُ الهَضْمُ هُنَا: الأَسْنَانُ تَطْحَنُ الطَّعَامَ وَاللُّعَابُ يُلَيِّنُهُ.' },
  { id: 'esophagus', order: 2, nameAr: 'المَرِيءُ', icon: '〰️', roleAr: 'أُنْبُوبٌ يَنْقُلُ الطَّعَامَ المَمْضُوغَ مِنَ الفَمِ إِلَى المَعِدَةِ.' },
  { id: 'stomach', order: 3, nameAr: 'المَعِدَةُ', icon: '🫙', roleAr: 'كِيسٌ عَضَلِيٌّ يَهْضِمُ الطَّعَامَ بِعُصَارَاتٍ خَاصَّةٍ فَيُصْبِحُ سَائِلاً.' },
  { id: 'small_intestine', order: 4, nameAr: 'الأَمْعَاءُ الدَّقِيقَةُ', icon: '🌀', roleAr: 'تَمْتَصُّ العَنَاصِرَ المُفِيدَةَ مِنَ الطَّعَامِ إِلَى الدَّمِ.' },
  { id: 'large_intestine', order: 5, nameAr: 'الأَمْعَاءُ الغَلِيظَةُ', icon: '🟤', roleAr: 'تَمْتَصُّ المَاءَ وَتُخْرِجُ الفَضَلَاتِ غَيْرَ المُفِيدَةِ.' },
];

const RESPIRATORY_ORGANS = [
  { id: 'nose', order: 1, nameAr: 'الأَنْفُ وَالفَمُ', icon: '👃', roleAr: 'يَدْخُلُ الهَوَاءُ مِنْ هُنَا وَيُنَقَّى وَيُدَفَّأُ.' },
  { id: 'trachea', order: 2, nameAr: 'القَصَبَةُ الهَوَائِيَّةُ', icon: '🌬️', roleAr: 'أُنْبُوبٌ يَنْقُلُ الهَوَاءَ نَحْوَ الرِّئَتَيْنِ.' },
  { id: 'lungs', order: 3, nameAr: 'الرِّئَتَانِ', icon: '🫁', roleAr: 'عُضْوَانِ إِسْفَنْجِيَّانِ يَمْتَلِئَانِ بِالهَوَاءِ وَيُبَادِلَانِ الأُكْسِجِينَ وَثَانِي أُكْسِيدِ الكَرْبُونِ.' },
  { id: 'heart_blood', order: 4, nameAr: 'الدَّمُ', icon: '❤️', roleAr: 'يَحْمِلُ الأُكْسِجِينَ مِنَ الرِّئَتَيْنِ إِلَى كُلِّ خَلَايَا الجِسْمِ.' },
];

const DIGESTIVE_QUESTIONS = [
  { id: 1, qAr: 'أَيْنَ يَبْدَأُ الهَضْمُ؟', correct: 'mouth', options: ['mouth', 'stomach', 'small_intestine'] },
  { id: 2, qAr: 'مَاذَا يَنْقُلُ الطَّعَامَ مِنَ الفَمِ إِلَى المَعِدَةِ؟', correct: 'esophagus', options: ['esophagus', 'large_intestine', 'nose'] },
  { id: 3, qAr: 'أَيُّ عُضْوٍ يَمْتَصُّ العَنَاصِرَ المُفِيدَةَ إِلَى الدَّمِ؟', correct: 'small_intestine', options: ['small_intestine', 'mouth', 'esophagus'] },
];

const RESPIRATORY_QUESTIONS = [
  { id: 1, qAr: 'أَيُّ عُضْوٍ يُبَادِلُ الأُكْسِجِينَ مَعَ الدَّمِ؟', correct: 'lungs', options: ['lungs', 'trachea', 'nose'] },
  { id: 2, qAr: 'مِنْ أَيْنَ يَدْخُلُ الهَوَاءُ إِلَى الجِسْمِ؟', correct: 'nose', options: ['nose', 'lungs', 'heart_blood'] },
];

const ORGAN_LABEL: Record<string, string> = Object.fromEntries(
  [...DIGESTIVE_ORGANS, ...RESPIRATORY_ORGANS].map((o) => [o.id, o.nameAr])
);

export const HumanAnatomyLab: React.FC<HumanAnatomyLabProps> = ({ grade = '4AP', onReward, onBack }) => {
  const showRespiratory = canShowRespiratoryAnatomyTab(grade);
  const [activeTab, setActiveTab] = useState<AnatomyTab>('digestive');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('mouth');
  const [answers, setAnswers] = useState<Record<string, Record<number, boolean>>>({ digestive: {}, respiratory: {} });
  const [breathState, setBreathState] = useState<'idle' | 'inhale' | 'exhale'>('idle');

  const organs = activeTab === 'digestive' ? DIGESTIVE_ORGANS : RESPIRATORY_ORGANS;
  const questions = activeTab === 'digestive' ? DIGESTIVE_QUESTIONS : RESPIRATORY_QUESTIONS;
  const currentOrgan = organs.find((o) => o.id === selectedOrgan) || organs[0];

  const switchTab = (tab: AnatomyTab) => {
    if (tab === 'respiratory' && !showRespiratory) return;
    setActiveTab(tab);
    setSelectedOrgan(tab === 'digestive' ? 'mouth' : 'nose');
  };

  useEffect(() => {
    if (!showRespiratory && activeTab === 'respiratory') {
      setActiveTab('digestive');
      setSelectedOrgan('mouth');
    }
  }, [showRespiratory, activeTab]);

  const handleAnswer = (qId: number, optionId: string, correctId: string) => {
    setAnswers((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [qId]: true } }));
    if (optionId === correctId) onReward?.(5, 15);
  };

  const doBreath = (state: 'inhale' | 'exhale') => {
    setBreathState(state);
    onReward?.(2, 5);
  };

  return (
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-rose-700 via-pink-800 to-fuchsia-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-600/40 relative overflow-hidden">
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
              <span>{grade === '4AP' ? 'مختبر الجهاز الهضمي (4AP)' : 'مختبر جسم الإنسان (4AP–5AP)'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">
              {showRespiratory ? 'الجهاز الهضمي والجهاز التنفسي' : 'الجهاز الهضمي'}
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed max-w-3xl">
              {showRespiratory
                ? 'اكتشف مسار الطعام داخل جسمك، وتعرّف على كيفية تنفسك وتبادل الهواء في رئتيك.'
                : 'اكتشف مسار الطعام خطوة بخطوة من الفم إلى الأمعاء — برنامج السنة الرابعة.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        <button
          onClick={() => switchTab('digestive')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'digestive' ? 'bg-rose-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>🍽️ الجهاز الهضمي</span>
        </button>
        {showRespiratory && (
        <button
          onClick={() => switchTab('respiratory')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'respiratory' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
          }`}
        >
          <span>🫁 الجهاز التنفسي</span>
        </button>
        )}
      </div>

      {/* Organ path selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {organs.map((organ) => {
          const isSelected = selectedOrgan === organ.id;
          return (
            <button
              key={organ.id}
              onClick={() => setSelectedOrgan(organ.id)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-105 ring-2 ring-rose-400'
                  : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-rose-400/50'
              }`}
            >
              <span className="text-3xl">{organ.icon}</span>
              <span className="font-black text-[11px] leading-tight">{organ.order}. {organ.nameAr}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-4xl shrink-0">
            {currentOrgan.icon}
          </div>
          <h3 className="text-lg font-black text-[var(--app-text)]">{currentOrgan.nameAr}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-sm font-bold text-[var(--app-text)] leading-relaxed">
          💡 {currentOrgan.roleAr}
        </div>
      </div>

      {activeTab === 'respiratory' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 text-center">
          <h2 className="text-lg font-black text-[var(--app-text)]">جَرِّبِ التَّنَفُّسَ: راقِبِ الرِّئَتَيْنِ</h2>
          <div className="max-w-xs mx-auto p-6 rounded-3xl bg-gradient-to-b from-sky-100 to-rose-100 border-2 border-fuchsia-300">
            <div
              className={`text-7xl transition-transform duration-700 ${
                breathState === 'inhale' ? 'scale-125' : breathState === 'exhale' ? 'scale-90' : ''
              }`}
            >
              🫁
            </div>
            <p className="text-xs font-black text-fuchsia-900 mt-2">
              {breathState === 'inhale'
                ? 'شَهِيقٌ: تَمْتَلِئُ الرِّئَتَانِ بِالأُكْسِجِينِ! 💨'
                : breathState === 'exhale'
                ? 'زَفِيرٌ: يَخْرُجُ ثَانِي أُكْسِيدِ الكَرْبُونِ! 🌬️'
                : 'اِضْغَطْ عَلَى شَهِيقٍ أَوْ زَفِيرٍ لِتُشَاهِدَ الرِّئَتَيْنِ'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => doBreath('inhale')}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              شَهِيقٌ (استنشاق) 💨
            </button>
            <button
              onClick={() => doBreath('exhale')}
              className="px-5 py-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              زَفِيرٌ (زفير) 🌬️
            </button>
            <button
              onClick={() => setBreathState('idle')}
              className="p-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
              title="إعادة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-[var(--app-text)]">اختبر معلوماتك:</h3>
        <div className="space-y-4">
          {questions.map((q) => {
            const isAnswered = !!answers[activeTab]?.[q.id];
            return (
              <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
                <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {q.options.map((optId) => {
                    const isCorrect = optId === q.correct;
                    return (
                      <button
                        key={optId}
                        onClick={() => !isAnswered && handleAnswer(q.id, optId, q.correct)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                            : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-rose-400'
                        }`}
                      >
                        {ORGAN_LABEL[optId]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
