import React from 'react';
import type { DesignMode } from '../../utils/designMode';

interface DesignModeSwitchProps {
  mode: DesignMode;
  locale: string;
  onChange: (mode: DesignMode) => void;
}

/**
 * Home corner switch between Didou's world and the classic interface, opposite the map shortcut
 * (start side). Always offers the other design, so the family can go back at any time.
 */
export function DesignModeSwitch({ mode, locale, onChange }: DesignModeSwitchProps) {
  const ar = locale === 'ar';
  const toClassic = mode === 'world';
  const label = toClassic ? (ar ? 'الواجهة الكلاسيكية' : 'Accueil classique') : ar ? 'عالم ديدو' : 'Monde de Didou';
  return (
    <button
      type="button"
      data-design-switch={toClassic ? 'classic' : 'world'}
      onClick={() => onChange(toClassic ? 'classic' : 'world')}
      className="design-mode-switch fixed z-40 start-4 flex items-center gap-2 min-h-[60px] rounded-full ps-2 pe-4 font-extrabold text-sm cursor-pointer border-2 border-white/80"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 104px)' }}
      data-tone={toClassic ? 'classic' : 'world'}
    >
      <span className="grid place-items-center w-11 h-11 rounded-full bg-white/90" aria-hidden="true">
        {toClassic ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <rect x="4" y="4" width="7" height="7" rx="2" fill="#0f766e" />
            <rect x="13" y="4" width="7" height="7" rx="2" fill="#f59e0b" />
            <rect x="4" y="13" width="7" height="7" rx="2" fill="#2563eb" />
            <rect x="13" y="13" width="7" height="7" rx="2" fill="#db2777" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <circle cx="12" cy="12" r="8" fill="#2f8cff" />
            <path d="M7 10c2-1 3 1 5 0s2-3 4-2M8 15c2 0 3-2 5-1s2 2 3 1" stroke="#4ade80" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M18 4l.6 1.4L20 6l-1.4.6L18 8l-.6-1.4L16 6l1.4-.6z" fill="#ffd23f" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
