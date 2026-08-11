import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Zap, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthUser } from '../types/auth';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPaymentEnabled?: boolean;
  onRequestCheckout: (providerName: string, paymentMethod: string, amountDzd: number) => Promise<any>;
  currentUser: AuthUser | null;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, isPaymentEnabled = true, onRequestCheckout, currentUser }) => {
  const t = useTranslation('pricing');
  const { direction } = useLocaleContext();
  const ForwardArrow = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const PAYMENT_PLANS = [
    {
      id: 'annual',
      title: t('planAnnualTitle'),
      price: 1500,
      description: t('planAnnualDescription'),
      savings: t('planAnnualSavings'),
    },
    {
      id: 'monthly',
      title: t('planMonthlyTitle'),
      price: 250,
      description: t('planMonthlyDescription'),
      savings: t('planMonthlySavings'),
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(PAYMENT_PLANS[0].id);
  const [selectedMethod, setSelectedMethod] = useState('BARIDIMOB');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  if (!isPaymentEnabled || !isOpen) return null;

  const plan = PAYMENT_PLANS.find((p) => p.id === selectedPlan) || PAYMENT_PLANS[0];

  const handleCheckout = async () => {
    if (!isPaymentEnabled) {
      setErrorMessage(t('errorPaymentDisabled'));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await onRequestCheckout('ChargilyPayV2', selectedMethod, plan.price);
      if (response?.data?.checkoutUrl) {
        setCheckoutUrl(response.data.checkoutUrl);
        window.open(response.data.checkoutUrl, '_blank');
      } else {
        throw new Error(response?.error || t('errorCheckoutFailed'));
      }
    } catch (error: any) {
      setErrorMessage(error?.message || t('errorCheckoutOpenFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" dir={direction}>
      <div className="bg-white w-full max-w-3xl rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between bg-purple-950 text-white p-5">
          <div>
            <h2 className="text-xl font-black">{t('title')}</h2>
            <p className="text-xs text-purple-200 mt-1 max-w-lg">{t('subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {PAYMENT_PLANS.map((item) => {
              const isActive = item.id === selectedPlan;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPlan(item.id)}
                  className={`rounded-3xl border p-5 text-left transition-all ${isActive ? 'border-purple-700 bg-purple-50 shadow-md' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{item.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-1">{item.savings}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-3xl font-black text-purple-800">{item.price}</span>
                      <span className="text-xs text-slate-500">{t('currency')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-3">{item.description}</p>
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em] mb-3">{t('paymentMethodLabel')}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {['BARIDIMOB', 'EDAHABIA', 'CCP_OFFICE'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-bold transition-all ${selectedMethod === method ? 'border-purple-700 bg-purple-100 text-purple-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                  {method === 'BARIDIMOB' ? t('methodBaridimob') : method === 'EDAHABIA' ? t('methodEdahabia') : t('methodCcp')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-[0.2em]">{t('whyPremium')}</p>
              <ul className="text-xs text-emerald-900 mt-3 space-y-2 list-disc list-inside">
                <li>{t('benefit1')}</li>
                <li>{t('benefit2')}</li>
                <li>{t('benefit3')}</li>
                <li>{t('benefit4')}</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase font-bold tracking-[0.2em] text-slate-500">{t('customPlanLabel')}</p>
              <div className="mt-3 space-y-3 text-xs text-slate-700">
                <p>{t('subscriberNameLabel')} <strong>{currentUser?.nom || t('defaultSubscriberName')}</strong></p>
                <p>{t('emailLabel')} <strong>{currentUser?.email || t('defaultEmail')}</strong></p>
                <p>{t('currentRoleLabel')} <strong>{currentUser?.role || 'ROLE_FREE'}</strong></p>
                <p>{t('durationLabel')} <strong>{plan.id === 'annual' ? t('durationAnnual') : t('durationMonthly')}</strong></p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-3xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm font-bold">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 text-xs text-slate-600">
              <p>{t('popupHint')}</p>
              <p>{t('trackingHint')}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-5 py-3 font-black tracking-tight shadow-lg shadow-purple-500/20 hover:brightness-110 transition-all disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? t('checkoutButtonLoading') : t('checkoutButton')}
              <ForwardArrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
