import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface AreaPerimeterGridLabProps {
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

const GRID_SIZE = 8;
const CHALLENGES = [
  { id: 1, area: 4, labelAr: 'ابنِ شكلاً مساحته 4 مربعات' },
  { id: 2, area: 6, labelAr: 'ابنِ شكلاً مساحته 6 مربعات' },
  { id: 3, area: 9, labelAr: 'ابنِ شكلاً مساحته 9 مربعات' },
];

const key = (r: number, c: number) => `${r}-${c}`;

export const AreaPerimeterGridLab: React.FC<AreaPerimeterGridLabProps> = ({ onReward, onBack }) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsMath');
  const tCommon = useTranslation('common');
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [achieved, setAchieved] = useState<boolean>(false);

  const challenge = CHALLENGES[challengeIdx];

  const toggleCell = (r: number, c: number) => {
    setCells((prev) => {
      const next = new Set(prev);
      const k = key(r, c);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
    setAchieved(false);
  };

  const perimeter = useMemo(() => {
    let p = 0;
    cells.forEach((k) => {
      const [r, c] = k.split('-').map(Number);
      const neighbors = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
      neighbors.forEach(([nr, nc]) => {
        if (!cells.has(key(nr, nc))) p += 1;
      });
    });
    return p;
  }, [cells]);

  const area = cells.size;

  const checkChallenge = () => {
    if (area === challenge.area) {
      setAchieved(true);
      onReward?.(5, 15);
    } else {
      setAchieved(false);
    }
  };

  const nextChallenge = () => {
    setChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
    setCells(new Set());
    setAchieved(false);
  };

  const resetGrid = () => {
    setCells(new Set());
    setAchieved(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir={direction}>
      <div className="bg-gradient-to-r from-lime-700 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-lime-600/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label={tCommon('backToTools')}
              className="shrink-0 hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              {direction === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{t('areaPerimeterBadge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">{t('areaPerimeterTitle')}</h1>
            <p className="text-xs sm:text-sm text-lime-100 leading-relaxed max-w-3xl">
              {t('areaPerimeterSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-center min-w-[110px]">
            <p className="text-[10px] font-black text-emerald-700">{t('areaPerimeterAreaStat')}</p>
            <p className="text-2xl font-black text-emerald-900 font-sans">{area}</p>
            <p className="text-[10px] font-black text-emerald-800">{area === 1 ? 'مربع' : 'مربعات'}</p>
          </div>
          <div className="p-3 rounded-2xl bg-teal-100 border border-teal-300 text-center min-w-[110px]">
            <p className="text-[10px] font-black text-teal-700">{t('areaPerimeterPerimeterStat')}</p>
            <p className="text-2xl font-black text-teal-900 font-sans">{perimeter}</p>
            <p className="text-[10px] font-black text-teal-800">{perimeter === 1 ? 'ضلع' : 'أضلاع'}</p>
          </div>
          <button
            onClick={resetGrid}
            className="p-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
            title={t('areaPerimeterResetTitle')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div
          className="grid gap-1 mx-auto w-fit"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID_SIZE }, (_, r) =>
            Array.from({ length: GRID_SIZE }, (_, c) => {
              const isFilled = cells.has(key(r, c));
              return (
                <button
                  key={key(r, c)}
                  onClick={() => toggleCell(r, c)}
                  aria-label={`مربع الصف ${r + 1} العمود ${c + 1}${isFilled ? ' ممتلئ' : ' فارغ'}`}
                  aria-pressed={isFilled}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md border transition-all cursor-pointer ${
                    isFilled ? 'bg-emerald-500 border-emerald-600 shadow-xs' : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] hover:bg-emerald-100'
                  }`}
                />
              );
            })
          )}
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4 text-center">
        <h3 className="text-sm font-black text-[var(--app-text)]">🎯 {t('areaPerimeterChallengePrefix')} {challenge.labelAr}</h3>
        {achieved && (
          <div className="text-sm font-black p-3 rounded-xl bg-emerald-100 text-emerald-900">
            {t('areaPerimeterAchievedMessage', { area: challenge.area })}
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={checkChallenge}
            className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            {t('areaPerimeterCheckButton')}
          </button>
          {achieved && (
            <button
              onClick={nextChallenge}
              className="px-5 py-3 rounded-2xl bg-[var(--app-card-subtle)] text-[var(--app-text)] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              {t('areaPerimeterNextChallengeButton')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
