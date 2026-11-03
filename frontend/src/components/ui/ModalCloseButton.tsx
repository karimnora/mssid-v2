import React from 'react';
import { useLocaleContext } from '../../context/LocaleContext';

/**
 * The one close button every popup must show (top corner, 48 px round, screen-reader label
 * « أغلق » / « Fermer »). Guarded by ModalCloseButton.test.tsx.
 */
export function ModalCloseButton({ onClose, className = '', tone = 'light' }: { onClose: () => void; className?: string; tone?: 'light' | 'dark' }) {
  const { locale } = useLocaleContext();
  const label = locale === 'fr' ? 'Fermer' : 'أغلق';
  const colors =
    tone === 'dark'
      ? 'bg-white/15 text-white border-white/40 hover:bg-white/25'
      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      title={label}
      data-modal-close
      className={`w-12 h-12 shrink-0 rounded-full border-2 grid place-items-center cursor-pointer shadow-sm ${colors} ${className}`}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
