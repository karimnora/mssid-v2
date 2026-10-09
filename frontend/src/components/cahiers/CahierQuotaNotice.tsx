import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocaleContext } from '../../context/LocaleContext';
import type { CahierAccess } from '../../services/springBootApi';
export function CahierQuotaNotice({ access }: { access: CahierAccess }) {
  const t = useTranslation('subscription');
  const { locale } = useLocaleContext();
  const date = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-DZ' : 'ar-DZ', { timeZone: 'Africa/Algiers', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(access.resetsAt));
  return <div role="status" className="space-y-1 text-sm font-bold">
    <p>{access.premium ? t('cahierAll') : t('cahierWeekly', { remaining: access.remaining })}</p>
    {!access.premium && <p>{t('cahierReset', { date })}</p>}
    <p className="text-xs">{t('cahierPermanent')}</p>
  </div>;
}
