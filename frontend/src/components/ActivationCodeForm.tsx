import React, { useState } from 'react';
import { springBootApi } from '../services/springBootApi';
import { mapAuthProfile } from '../services/authProfile';
import { AuthService } from '../services/authService';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import { useLocaleContext } from '../context/LocaleContext';
import type { AuthUser } from '../types/auth';

/**
 * « عندي كود تفعيل »: prepaid card (bookshop, tutoring school), code sent after a BaridiMob payment,
 * or class licence. Shown on the website only — the Android app never offers a way to pay or unlock
 * outside Google Play; a code redeemed on the site unlocks the same account in the app.
 */
export const ActivationCodeForm: React.FC<{ onRedeemed?: (user: AuthUser) => void }> = ({ onRedeemed }) => {
  const { locale } = useLocaleContext();
  const fr = locale === 'fr';
  const [code, setCode] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'done' | 'error'; message?: string }>({ kind: 'idle' });

  if (!canUseWebCheckout()) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim() || state.kind === 'busy') return;
    setState({ kind: 'busy' });
    const res = await springBootApi.redeemActivationCode(code.trim());
    if (res.error || !res.data) {
      setState({ kind: 'error', message: res.status === 429 ? (fr ? 'Trop d’essais. Réessayez dans 15 minutes.' : 'محاولات كثيرة. أعيدوا بعد 15 دقيقة.') : res.error || (fr ? 'Code non valide.' : 'الكود غير صحيح.') });
      return;
    }
    const end = new Intl.DateTimeFormat(fr ? 'fr-DZ' : 'ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${res.data.endDate}T00:00:00`));
    setState({ kind: 'done', message: fr ? `Compte Famille Premium actif jusqu’au ${end}.` : `حساب العائلة المميّز مفعّل حتى ${end}.` });
    setCode('');
    const profile = await springBootApi.fetchCurrentUser();
    if (profile.data && !profile.error) {
      const user = mapAuthProfile(profile.data);
      AuthService.hydrateCurrentUser(user);
      onRedeemed?.(user);
    }
  };

  return (
    <form onSubmit={submit} data-activation-code-form className="rounded-2xl border-2 border-[#008751]/40 bg-emerald-50 p-4 space-y-2">
      <label htmlFor="activation-code" className="block font-extrabold text-slate-900">
        {fr ? '🎟️ J’ai un code d’activation' : '🎟️ عِنْدِي كُودُ تَفْعِيلٍ'}
      </label>
      <p className="text-xs font-bold text-slate-600">
        {fr ? 'Carte achetée en librairie, code reçu après un paiement BaridiMob, ou code de la classe.' : 'بطاقة من المكتبة، أو كود وصلكم بعد الدفع عبر بريدي موب، أو كود القسم.'}
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          id="activation-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="MSD-XXXX-XXXX"
          dir="ltr"
          autoComplete="off"
          spellCheck={false}
          maxLength={20}
          className="hit-target flex-1 min-w-[12rem] rounded-xl border-2 border-slate-200 bg-white px-3 font-mono text-base tracking-widest"
        />
        <button type="submit" disabled={state.kind === 'busy' || !code.trim()} className="hit-target rounded-xl bg-[#008751] text-white px-5 font-extrabold disabled:opacity-50">
          {state.kind === 'busy' ? (fr ? 'Vérification…' : 'جارٍ التحقق…') : fr ? 'Activer' : 'فعّل'}
        </button>
      </div>
      {state.message && (
        <p role={state.kind === 'error' ? 'alert' : 'status'} className={`text-sm font-bold ${state.kind === 'error' ? 'text-[#92400e]' : 'text-[#0B6B4F]'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
};
