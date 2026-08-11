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
      className={`w-full text-left px-4 py-3 rounded-2xl border transition-all ${
        enabled ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold">{t('tashkeelLabel')}</div>
          <p className="text-[11px] opacity-80 mt-1">{t('tashkeelDescription')}</p>
        </div>
        <div className={`h-8 w-16 rounded-full p-1 transition ${enabled ? 'bg-slate-800' : 'bg-slate-300'}`}>
          <div className={`h-6 w-6 rounded-full bg-white shadow transform transition ${enabled ? 'translate-x-8' : 'translate-x-0'}`} />
        </div>
      </div>
    </button>
  );
};
