import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const VoiceUnavailableBanner: React.FC<{ visible: boolean }> = ({ visible }) => {
  const t = useTranslation('meta');
  if (!visible) return null;
  return (
    <div
      role="status"
      className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-2xl px-4 py-2.5 min-w-0"
    >
      <span aria-hidden="true">🔇</span>
      <span className="leading-snug break-words">{t('voiceUnavailable')}</span>
    </div>
  );
};
