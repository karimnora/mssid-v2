import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface OfflinePacksManagerModalProps { isOpen: boolean; onClose: () => void; }

// Informational only: no simulated downloads, fabricated scores or unimplemented sync endpoint.
export const OfflinePacksManagerModal: React.FC<OfflinePacksManagerModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  if (!isOpen) return null;
  return (
    <div dir={direction} className="fixed inset-0 z-50 kids-modal-overlay flex items-start sm:items-center justify-center p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="offline-title" className="kids-modal-panel kids-modal-body w-full max-w-lg p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 id="offline-title" className="font-extrabold text-lg">{t('offlineTitle')}</h2>
          <button type="button" onClick={onClose} className="kids-close" aria-label={t('pwaCloseAriaLabel')}><X className="w-5 h-5" /></button>
        </div>
        <p role="status" className="flex items-center gap-2 font-bold text-sm">{online ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}{t(online ? 'offlineOnline' : 'offlineDisconnected')}</p>
        <p className="text-sm">{t('offlineContent')}</p>
        <p className="text-sm">{t('offlineLimits')}</p>
        <p className="text-sm text-[var(--kids-muted)]">{t('offlineNoSync')}</p>
        <button type="button" onClick={onClose} className="kids-cta w-full">{t('offlineBack')}</button>
      </section>
    </div>
  );
};
