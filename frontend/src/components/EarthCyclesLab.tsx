import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { labQuizIsLocked, labQuizOptionClass } from '../utils/labQuizChoice';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface EarthCyclesLabProps {
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

type CyclesTab = 'day_night' | 'seasons' | 'shadow';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const isDaytime = (hour: number) => hour >= 6 && hour < 18;

const SEASONS = [
  { id: 'winter', nameAr: 'الشِّتَاءُ', icon: '❄️', monthsAr: 'ديسمبر - جانفي - فيفري', descAr: 'الجَزَائِرُ بَارِدَةٌ وَمُمْطِرَةٌ، الشَّمْسُ مَائِلَةٌ وَالنَّهَارُ قَصِيرٌ.' },
  { id: 'spring', nameAr: 'الرَّبِيعُ', icon: '🌸', monthsAr: 'مارس - أفريل - ماي', descAr: 'الطَّقْسُ مُعْتَدِلٌ، الأَزْهَارُ تَتَفَتَّحُ وَالنَّهَارُ يَطُولُ تَدْرِيجِيّاً.' },
  { id: 'summer', nameAr: 'الصَّيْفُ', icon: '☀️', monthsAr: 'جوان - جويلية - أوت', descAr: 'حَارٌّ وَجَافٌّ، الشَّمْسُ عَمُودِيَّةٌ وَالنَّهَارُ طَوِيلٌ.' },
  { id: 'autumn', nameAr: 'الخَرِيفُ', icon: '🍂', monthsAr: 'سبتمبر - أكتوبر - نوفمبر', descAr: 'الطَّقْسُ يَبْرُدُ تَدْرِيجِيّاً وَالأَوْرَاقُ تَتَسَاقَطُ مِنَ الأَشْجَارِ.' },
];

const SHADOW_TIMES = [
  { hour: 7, labelAr: 'الصَّبَاحُ البَاكِرُ (7 سَا)', length: 'طَوِيلٌ جِدّاً', pct: 90 },
  { hour: 9, labelAr: 'صَبَاحاً (9 سَا)', length: 'طَوِيلٌ', pct: 65 },
  { hour: 12, labelAr: 'الظُّهْرُ (12 سَا)', length: 'قَصِيرٌ جِدّاً', pct: 15 },
  { hour: 15, labelAr: 'بَعْدَ الظُّهْرِ (15 سَا)', length: 'طَوِيلٌ', pct: 65 },
  { hour: 18, labelAr: 'المَسَاءُ (18 سَا)', length: 'طَوِيلٌ جِدّاً', pct: 90 },
];

const SEASON_QUESTIONS = [
  { id: 1, qAr: 'فِي أَيِّ فَصْلٍ يَكُونُ النَّهَارُ أَطْوَلَ مَا يُمْكِنُ فِي الجَزَائِرِ؟', correct: 'summer', options: ['summer', 'winter', 'autumn'] },
  { id: 2, qAr: 'فِي أَيِّ فَصْلٍ تَتَسَاقَطُ أَوْرَاقُ الأَشْجَارِ؟', correct: 'autumn', options: ['autumn', 'spring', 'summer'] },
];

export const EarthCyclesLab: React.FC<EarthCyclesLabProps> = ({ onReward, onBack }) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsScience');
  const tCommon = useTranslation('common');
  const [activeTab, setActiveTab] = useState<CyclesTab>('day_night');
  const [hour, setHour] = useState<number>(12);
  const [selectedSeason, setSelectedSeason] = useState<string>('summer');
  const [selectedShadowIdx, setSelectedShadowIdx] = useState<number>(2);
  const [seasonAnswers, setSeasonAnswers] = useState<Record<number, string>>({});
  const [hourExplored, setHourExplored] = useState<Set<number>>(new Set([12]));

  const currentSeason = SEASONS.find((s) => s.id === selectedSeason) || SEASONS[0];
  const currentShadow = SHADOW_TIMES[selectedShadowIdx];

  const handleHourChange = (h: number) => {
    setHour(h);
    if (!hourExplored.has(h)) {
      setHourExplored((prev) => {
        const next = new Set(prev);
        next.add(h);
        if (next.size % 6 === 0) onReward?.(3, 10);
        return next;
      });
    }
  };

  const handleSeasonAnswer = (qId: number, optId: string, correct: string) => {
    if (labQuizIsLocked(seasonAnswers[qId], correct)) return;
    setSeasonAnswers((prev) => ({ ...prev, [qId]: optId }));
    if (optId === correct) onReward?.(5, 15);
  };

  return (
    // data-lab-instrument: the header's from-indigo gradient banner otherwise gets forced to a
    // white background by the lab-interior wrapper's override, while its text-indigo-100 subtitle
    // (untouched by that rule) stays light-on-white and becomes unreadable.
    <div data-lab-instrument className="space-y-6 max-w-5xl mx-auto" dir={direction}>
      <div className="bg-gradient-to-r from-indigo-700 via-blue-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-600/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              data-activity-navigation="true" onClick={onBack}
              aria-label={tCommon('backToTools')}
              className="shrink-0 hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              {direction === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{t('earthCyclesBadge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">{t('earthCyclesTitle')}</h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-3xl">
              {t('earthCyclesIntro')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-3 overflow-x-auto">
        {(
          [
            { id: 'day_night', label: t('earthCyclesTabDayNight'), color: 'bg-indigo-600' },
            { id: 'seasons', label: t('earthCyclesTabSeasons'), color: 'bg-amber-600' },
            { id: 'shadow', label: t('earthCyclesTabShadow'), color: 'bg-slate-700' },
          ] as { id: CyclesTab; label: string; color: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === tab.id ? `${tab.color} text-white shadow-md` : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'day_night' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div
            className={`max-w-md mx-auto p-8 rounded-3xl border-2 transition-colors duration-500 ${
              isDaytime(hour) ? 'bg-gradient-to-b from-sky-200 to-amber-100 border-amber-300' : 'border-indigo-500'
            }`}
            // Plain hex linear-gradient via inline style for the night case: Tailwind v4's oklch()-based
            // gradients silently fail to paint on some older Android WebViews.
            style={isDaytime(hour) ? undefined : { backgroundImage: 'linear-gradient(to bottom, #1e1b4b, #1e293b)' }}
          >
            <div className="text-7xl">{isDaytime(hour) ? '☀️' : '🌙'}</div>
            <div className={`font-black text-2xl mt-2 font-sans ${isDaytime(hour) ? 'text-amber-900' : 'text-white'}`}>
              {String(hour).padStart(2, '0')}:00
            </div>
            <p className={`text-xs font-black mt-1 ${isDaytime(hour) ? 'text-amber-800' : 'text-indigo-100'}`}>
              {isDaytime(hour) ? t('earthCyclesDaytimeStatus') : t('earthCyclesNighttimeStatus')}
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => handleHourChange(Number(e.target.value))}
            aria-label="ساعة اليوم"
            className="w-full max-w-md mx-auto cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
            {HOURS.map((h) => (
              <button
                key={h}
                onClick={() => handleHourChange(h)}
                className={`w-6 h-6 rounded-full text-[9px] font-black flex items-center justify-center cursor-pointer transition-all ${
                  h === hour ? 'bg-indigo-600 text-white scale-125' : isDaytime(h) ? 'bg-amber-200 text-amber-900' : 'bg-indigo-900 text-indigo-200'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] font-bold">
            الأَرْضُ تَدُورُ حَوْلَ نَفْسِهَا فِي 24 سَاعَةً، فَتَبْدُو الشَّمْسُ وَكَأَنَّهَا تُشْرِقُ وَتَغْرُبُ.
          </p>
        </div>
      )}

      {activeTab === 'seasons' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEASONS.map((s) => {
              const isSelected = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    isSelected ? 'bg-amber-600 text-white border-amber-500 shadow-md scale-105 ring-2 ring-amber-400' : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)] hover:border-amber-400/50'
                  }`}
                >
                  <span className="text-3xl">{s.icon}</span>
                  <span className="font-black text-xs">{s.nameAr}</span>
                </button>
              );
            })}
          </div>
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-lg font-black text-[var(--app-text)] flex items-center gap-2">
              <span className="text-2xl">{currentSeason.icon}</span> {currentSeason.nameAr}
            </h3>
            <p className="text-xs font-bold text-amber-700">{currentSeason.monthsAr}</p>
            <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] text-sm font-bold text-[var(--app-text)] leading-relaxed">
              💡 {currentSeason.descAr}
            </div>
          </div>
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-[var(--app-text)]">{t('testYourKnowledge')}</h3>
            {SEASON_QUESTIONS.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
                  <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((optId) => {
                      const opt = SEASONS.find((s) => s.id === optId)!;
                      return (
                        <button
                          key={optId}
                          type="button"
                          onClick={() => handleSeasonAnswer(q.id, optId, q.correct)}
                          className={labQuizOptionClass(seasonAnswers[q.id], optId, q.correct)}
                        >
                          {opt.icon} {opt.nameAr}
                        </button>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shadow' && (
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <h2 className="text-lg font-black text-[var(--app-text)]">{t('earthCyclesShadowQuestion')}</h2>
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-sky-100 to-amber-50 border-2 border-amber-300 flex flex-col items-center gap-2">
            <span className="text-5xl">🧍</span>
            <div
              className="bg-slate-700/70 rounded-full transition-all duration-500"
              style={{ width: `${currentShadow.pct}%`, height: '10px' }}
            />
            <p className="font-black text-sm text-amber-900 mt-2">{currentShadow.labelAr}</p>
            <p className="text-xs font-bold text-slate-600">{t('earthCyclesShadowLengthLabel', { length: currentShadow.length })}</p>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {SHADOW_TIMES.map((slot, idx) => (
              <button
                key={slot.hour}
                onClick={() => {
                  setSelectedShadowIdx(idx);
                  onReward?.(2, 5);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                  idx === selectedShadowIdx ? 'bg-slate-700 text-white shadow-md' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                {t('earthCyclesHourAbbrev', { hour: slot.hour })}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] font-bold">
            كُلَّمَا اقْتَرَبَتِ الشَّمْسُ مِنْ وَسَطِ السَّمَاءِ (الظُّهْرِ)، كَانَ الظِّلُّ أَقْصَرَ.
          </p>
        </div>
      )}
    </div>
  );
};
