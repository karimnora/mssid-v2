import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface TashkeelToggleProps {
  enabled: boolean;
  onToggle: (next: boolean) => void;
}

export const TashkeelToggle: React.FC<TashkeelToggleProps> = ({ enabled, onToggle }) => {
  const t = useTranslation('common');

  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={`w-full px-4 py-3 rounded-2xl border transition-all ${
        enabled ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {/* items-start (not items-center): the description wraps to 2 lines, and centering the
          switch against the whole two-line block put it hovering ambiguously between the label
          and the description with almost no horizontal gap — reads as overlapping text on a real
          phone (remonte utilisateur, capture). Anchoring the switch to the label's line only
          keeps it clearly separate regardless of how many lines the description wraps to. */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold">{t('tashkeelLabel')}</div>
          <p className="text-[11px] opacity-80 mt-1">{t('tashkeelDescription')}</p>
        </div>
        <div className={`shrink-0 h-8 w-16 rounded-full p-1 transition ${enabled ? 'bg-slate-800' : 'bg-slate-300'}`}>
          <div className={`h-6 w-6 rounded-full bg-white shadow transform transition ${enabled ? 'translate-x-8' : 'translate-x-0'}`} />
        </div>
      </div>
    </button>
  );
};
