import React from 'react';
import { Flag } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ReportErrorButtonProps {
  /** Human-readable identification of exactly what's being flagged (exam title + question,
   * lesson title + grade...) — embedded in the pre-filled contact message so ContactMessagesModule
   * doesn't have to guess which content a report refers to. */
  contextLabel: string;
  onReport: (contextLabel: string) => void;
  className?: string;
}

/** Discreet "report an error" trigger — placed directly on exam corrigés and grammar rules, the two
 * content types where a mistake most directly costs the app credibility with parents/teachers. */
export const ReportErrorButton: React.FC<ReportErrorButtonProps> = ({ contextLabel, onReport, className = '' }) => {
  const t = useTranslation('contact');
  return (
    <button
      type="button"
      onClick={() => onReport(contextLabel)}
      title={t('reportErrorButton')}
      className={`inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ${className}`}
    >
      <Flag className="w-3 h-3" />
      <span>{t('reportErrorButton')}</span>
    </button>
  );
};
