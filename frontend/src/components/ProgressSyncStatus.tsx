import React, { useSyncExternalStore } from 'react';
import { progressSync } from '../services/progressSync';
import { useLocaleContext } from '../context/LocaleContext';

export function ProgressSyncStatus({ authenticated }: { authenticated: boolean }) {
  const status = useSyncExternalStore(progressSync.subscribe, progressSync.getSnapshot);
  const { locale } = useLocaleContext();
  const state = authenticated ? status.status : 'local';
  const copy = locale === 'fr' ? {
    local: 'Progression enregistrée sur cet appareil.', saving: 'Enregistrement en cours…',
    pending: 'Sauvegarde en attente. Tes progrès sont conservés sur cet appareil. Utilise Actualiser pour réessayer.',
    synced: 'Progression synchronisée avec ton compte.',
  } : {
    local: 'تقدمك محفوظ على هذا الجهاز.', saving: 'جارٍ حفظ التقدم…',
    pending: 'الحفظ على الخادم في الانتظار. تقدمك محفوظ على هذا الجهاز. اضغط تحديث لإعادة المحاولة.',
    synced: 'تمت مزامنة تقدمك مع حسابك.',
  };
  return <p role="status" data-progress-sync={state}
    className={`text-xs font-bold leading-relaxed rounded-xl p-3 ${state === 'pending' ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'}`}>
    {copy[state]}
  </p>;
}
