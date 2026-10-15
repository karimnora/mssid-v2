import { ReceiptStatus } from './ReceiptStatus';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import { SubscriptionStatusPanel } from './SubscriptionStatusPanel';
import React, { useState } from 'react';
import { AuthUser, PaymentReceipt, PaymentMethod } from '../types/auth';
import { AuthService } from '../services/authService';
import { SUBSCRIPTION_PLANS, DEFAULT_SUBSCRIPTION_PLAN, type SubscriptionPlanId } from '../constants/pricing';
import { Lock, ShieldCheck, Upload, CheckCircle2, AlertCircle, Clock, FileText, Smartphone, CreditCard, Sparkles, X, Eye } from 'lucide-react';
import { ParentGateModal, AskAdultScreen } from './ParentGateModal';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface Props {
  user: AuthUser | null;
  onClose: () => void;
  onSuccessUpgrade: (upgradedUser: AuthUser) => void;
  title?: string;
  parentVerified?: boolean;
}

const isDevBuild = typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.DEV);

export const SubscriptionPaywall: React.FC<Props> = props => canUseWebCheckout()
  ? <WebSubscriptionPaywall {...props} />
  : <SubscriptionStatusPanel user={props.user} onClose={props.onClose} />;

const WebSubscriptionPaywall: React.FC<Props> = ({
  user,
  onClose,
  onSuccessUpgrade,
  title,
  parentVerified = false
}) => {
  const t = useTranslation('subscription');
  const { direction } = useLocaleContext();
  const modalTitle = title ?? t('defaultTitle');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BARIDIMOB');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<PaymentReceipt | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);
  const [showParentGate, setShowParentGate] = useState(false);
  const [parentReady, setParentReady] = useState(parentVerified);

  const currentUser = user || AuthService.getCurrentUser();
  const [planId, setPlanId] = useState<SubscriptionPlanId>(DEFAULT_SUBSCRIPTION_PLAN.id);
  const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId)!;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Parent Gate: a real financial action (submitting a payment receipt) — gated here rather than
  // earlier in the flow (e.g. before browsing the pricing screen itself), matching Apple/Google
  // guidance that the gate belongs right before the sensitive action, not before informational content.
  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowParentGate(true);
  };

  const submitReceiptAfterParentGate = async () => {
    setShowParentGate(false);
    if (!currentUser) {
      setCustomError(t('loginRequiredError'));
      return;
    }
    if (!receiptImage.startsWith('data:')) {
      setCustomError(t('receiptRequiredError'));
      return;
    }

    setIsSubmitting(true);
    setCustomError(null);

    const result = await AuthService.submitReceiptAsync({
      paymentMethod,
      amountDzd: selectedPlan.priceDzd,
      planId: selectedPlan.id,
      transactionRef,
      receiptImageUrl: receiptImage,
    });

    setIsSubmitting(false);

    if (!result.success || !result.receipt) {
      setCustomError(result.message || t('genericSubmitError'));
      return;
    }

    setSubmittedReceipt(result.receipt);
  };

  const handleSimulateAdminApproval = () => {
    if (submittedReceipt) {
      const updated = AuthService.verifyReceipt(submittedReceipt.id, true);
      if (updated && updated.status === 'APPROVED') {
        const freshUser = AuthService.getCurrentUser();
        if (freshUser) {
          onSuccessUpgrade(freshUser);
        }
      }
    }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start sm:items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      <div className="web-dialog web-dialog-wide bg-white border-2 border-[#E7E2D7] w-full max-w-3xl min-w-0 rounded-3xl shadow-2xl text-slate-800 flex flex-col max-h-[min(92dvh,calc(100svh-1.5rem))] overflow-y-auto" dir={direction}>
        {!parentReady ? (
          <>
            <div className="h-3.5 w-full bg-[var(--brand-coral)]" />
            <AskAdultScreen onAskAdult={() => setParentReady(true)} onClose={onClose} />
          </>
        ) : (
        <>
        {/* Header Header */}
        <div
          className="text-white p-6 rounded-t-3xl relative overflow-hidden"
          style={{ backgroundImage: 'linear-gradient(to right, #581c87, #312e81, #3b0764)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('exclusiveBadge')}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-sans text-white">{modalTitle}</h2>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            {t('headerSubtitle')}
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6">
          {/* Comparison Cards: Free vs Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-extrabold text-slate-500 block">{t('freePlanTitle')}</span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li className="text-emerald-700 font-bold">{t('freePlanFeature1')}</li>
                <li className="text-emerald-700 font-bold">{t('freePlanFeature2')}</li>
                <li className="text-emerald-700 font-bold">{t('freePlanFeature3')}</li>
                <li className="text-emerald-700 font-bold">{t('freePlanFeature4')}</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 relative overflow-hidden">
              <span className="text-xs font-extrabold text-purple-800 block flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t('premiumPlanTitle')}</span>
              </span>
              <ul className="text-xs text-purple-900 space-y-1.5 list-disc list-inside">
                <li className="font-extrabold">{t('premiumPlanFeature1')}</li>
                <li className="font-extrabold">{t('premiumPlanFeature2')}</li>
                <li className="font-extrabold">{t('premiumPlanFeature3')}</li>
                  <li className="font-extrabold">{t('premiumPlanFeature4')}</li>
                  <li className="font-extrabold">{t('premiumPlanFeature5')}</li>
                <li className="font-extrabold text-amber-700">{t('premiumPlanPrice', { price: selectedPlan.priceDzd, months: selectedPlan.months })}</li>
              </ul>
            </div>
          </div>

          {!submittedReceipt && <fieldset className="space-y-3" disabled={isSubmitting || showParentGate}>
            <legend className="font-extrabold">{t('chooseDuration')}</legend>
            <p className="text-sm text-slate-600">{t('sameServices')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SUBSCRIPTION_PLANS.map(plan => <label key={plan.id} className={`rounded-2xl p-4 border-2 cursor-pointer space-y-2 ${planId === plan.id ? 'border-[#008751] bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                <input type="radio" name="subscription-plan" value={plan.id} checked={planId === plan.id} onChange={() => setPlanId(plan.id)} className="accent-[#008751]" />
                <span className="font-extrabold ms-2">{t('planMonths', { months: plan.months })}</span>
                <p className="text-xl font-extrabold">{t('planTotal', { price: plan.priceDzd })}</p>
                <p className="text-xs">{t('planMonthlyEquivalent', { price: plan.monthlyDzd })}</p>
                {plan.months === 12 && <p className="text-xs font-bold text-emerald-800">{t('annualSaving')}</p>}
              </label>)}
            </div>
            <p className="text-xs text-slate-600">{t('manualRenewal')}</p>
          </fieldset>}

          <ReceiptStatus key={submittedReceipt?.id ?? "receipt"}/>{/* If already submitted receipt */}
          {submittedReceipt ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 text-amber-800">
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm">{t('receiptSubmittedTitle')}</h4>
                  <p className="text-xs font-bold">{t('selectedReceiptPlan', { price: submittedReceipt.amountDzd, months: submittedReceipt.durationMonths ?? selectedPlan.months })}</p>
                  <p className="text-xs text-amber-700">
                    {t('receiptNumberLabel')} <span className="font-mono font-bold">{submittedReceipt.transactionRef}</span> | {t('statusLabel')}
                    <span className="font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md mx-1">
                      {t('pendingStatus')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
                <p>
                  {t('verificationNotePrefix')} <strong>{t('verificationNoteBold')}</strong> {t('verificationNoteSuffix')}
                </p>
                <p>{t('supportNote')}</p>
                {/* SEC-07: dev-only. The real approval path is PUT /api/v1/payments/admin/receipts/{id}/verify,
                    which requires ROLE_ADMIN server-side (@PreAuthorize). This button exists purely so a
                    developer can exercise the "approved" UI state locally without a second admin account —
                    it must never render in a production build, or any free user could self-grant
                    ROLE_PREMIUM with one click regardless of what the backend actually approved. */}
                {isDevBuild && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-500">{t('devTestLabel')}</span>
                    <button
                      onClick={handleSimulateAdminApproval}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('devApproveButton')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmitReceipt} className="space-y-5 bg-slate-50/80 p-5 rounded-3xl border border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>{t('formTitle')}</span>
              </h3>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BARIDIMOB')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'BARIDIMOB'
                      ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t('paymentMethodBaridimob')}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('EDAHABIA')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'EDAHABIA'
                      ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t('paymentMethodEdahabia')}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CCP_OFFICE')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === 'CCP_OFFICE'
                      ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t('paymentMethodCcp')}
                </button>
              </div>

              {/* Account details info card */}
              <div className="p-4 bg-purple-900 text-white rounded-2xl text-xs space-y-1.5 shadow-inner">
                <div className="flex justify-between items-center font-bold text-amber-300">
                  <span>{t('accountInfoLabel', { price: selectedPlan.priceDzd, months: selectedPlan.months })}</span>
                  <span>mssid dz</span>
                </div>
                <p className="text-[11px] text-purple-100 leading-relaxed">{t('accountPendingNote')}</p>
                <p className="text-[11px] text-purple-200 leading-relaxed">{t('edahabiaMethodNote')}</p>
                <p className="text-[11px] text-purple-200 leading-relaxed">{t('ccpNotePrefix')}</p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('transactionRefLabel')}</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder={t('transactionRefPlaceholder')}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('amountLabel')}</label>
                  <input
                    type="text"
                    disabled
                    value={t('amountValue', { price: selectedPlan.priceDzd, months: selectedPlan.months })}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-purple-900 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Upload Receipt Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('receiptImageLabel')}</label>
                <div className="flex items-center gap-4">
                  <label className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-2 border-dashed border-2">
                    <Upload className="w-4 h-4" />
                    <span>{t('uploadReceiptButton')}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <div className="flex items-center gap-2">
                    {receiptImage ? (
                      <img src={receiptImage} alt="" loading="lazy" className="w-12 h-12 object-cover rounded-lg border border-slate-300" />
                    ) : (
                      <span className="w-12 h-12 rounded-lg border border-dashed border-slate-300 bg-white" />
                    )}
                    <span className="text-[11px] text-slate-500 font-bold">
                      {receiptImage ? t('receiptPreviewLabel') : t('receiptEmptyLabel')}
                    </span>
                  </div>
                </div>
              </div>

              {customError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{customError}</span>
                </div>
              )}

              {/* Form Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !receiptImage}
                  className="w-full py-3.5 bg-[var(--brand-emerald)] hover:bg-[var(--brand-emerald-dark)] text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>{isSubmitting ? t('submittingButton') : t('submitButton')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
        </>
        )}
      </div>
    </div>
    <ParentGateModal
      isOpen={showParentGate}
      onClose={() => setShowParentGate(false)}
      onVerified={submitReceiptAfterParentGate}
    />
    </>
  );
};
