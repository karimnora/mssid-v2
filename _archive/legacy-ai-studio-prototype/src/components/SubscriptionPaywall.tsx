import React, { useState } from 'react';
import { AuthUser, PaymentReceipt, PaymentMethod } from '../types/auth';
import { AuthService } from '../services/authService';
import { Lock, ShieldCheck, Upload, CheckCircle2, AlertCircle, Clock, FileText, Smartphone, CreditCard, Sparkles, X, Eye } from 'lucide-react';

interface Props {
  user: AuthUser | null;
  onClose: () => void;
  onSuccessUpgrade: (upgradedUser: AuthUser) => void;
  title?: string;
}

export const SubscriptionPaywall: React.FC<Props> = ({
  user,
  onClose,
  onSuccessUpgrade,
  title = 'فتح تصحيح الامتحان الرسمي والشرح التفصيلي'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BARIDIMOB');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<PaymentReceipt | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const currentUser = user || AuthService.getCurrentUser();

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

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setCustomError('يرجى تسجيل الدخول أولاً لإرسال وصل الدفع');
      return;
    }

    setIsSubmitting(true);
    setCustomError(null);

    setTimeout(() => {
      const receipt = AuthService.submitReceipt(
        currentUser.id,
        currentUser.nom,
        currentUser.email,
        paymentMethod,
        1500,
        transactionRef,
        receiptImage
      );
      setSubmittedReceipt(receipt);
      setIsSubmitting(false);
    }, 800);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-purple-200 w-full max-w-3xl rounded-3xl shadow-2xl text-slate-800 flex flex-col max-h-[92vh] overflow-y-auto dir-rtl" dir="rtl">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white p-6 rounded-t-3xl relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>محتوى حصري للمشتركين (mssid dz Premium)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-sans text-white">{title}</h2>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            احصل على التصحيح النموذجي المنقط خطوة بخطوة لجميع امتحانات شهادة التعليم الابتدائي بالجزائر، بالإضافة لخاصية إرشادات المساعد الذكي.
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6">
          {/* Comparison Cards: Free vs Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-extrabold text-slate-500 block">الاشتراك المجاني (ROLE_FREE)</span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li className="text-emerald-700 font-bold">✓ تصفح الدروس والملخصات المجانية</li>
                <li className="text-emerald-700 font-bold">✓ إجراء التمارين والتمارين التفاعلية</li>
                <li className="text-rose-600 font-bold">✗ حجب التصحيحات الرسمية والحلول النموذجية</li>
                <li className="text-rose-600 font-bold">✗ حجب ملفات PDF القابلة للطباعة</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 relative overflow-hidden">
              <span className="text-xs font-extrabold text-purple-800 block flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>اشتراك mssid dz السنوي (ROLE_PREMIUM)</span>
              </span>
              <ul className="text-xs text-purple-900 space-y-1.5 list-disc list-inside">
                <li className="font-extrabold">✓ فتح جميع الحلول والتصحيحات الرسمية</li>
                <li className="font-extrabold">✓ إمكانية تحميل وطباعة أوراق الامتحان</li>
                <li className="font-extrabold">✓ المساعد التربوي الذكي غير المحدود</li>
                <li className="font-extrabold text-amber-700">💰 السعر: 1500 دج / للعام الدراسي الكامل</li>
              </ul>
            </div>
          </div>

          {/* If already submitted receipt */}
          {submittedReceipt ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 text-amber-800">
                <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm">تم إرسال وصل الدفع بنجاح وهو قيد التحقق الإداري</h4>
                  <p className="text-xs text-amber-700">
                    رقم الوصل: <span className="font-mono font-bold">{submittedReceipt.transactionRef}</span> | الحالة:
                    <span className="font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md mr-1">
                      PENDING_VERIFICATION (معلق)
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-2">
                <p>
                  يتم التحقق عادة من التحويلات البريدية عبر <strong>بريدي موب / CCP</strong> خلال مدة قصيرة. سيتم تفعيل حسابك تلقائياً بعد المصادقة.
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="font-bold text-slate-500">اختبار سريع للمطور / المعاين:</span>
                  <button
                    onClick={handleSimulateAdminApproval}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تأكيد الوصل فوراً وتفعيل ROLE_PREMIUM</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmitReceipt} className="space-y-5 bg-slate-50/80 p-5 rounded-3xl border border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>إرسال وصل الدفع عبر بريدي موب (BaridiMob) أو البطاقة الذهبية أو CCP</span>
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
                  📱 بريدي موب BaridiMob
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
                  💳 البطاقة الذهبية Edahabia
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
                  🏛️ الحساب البريدي الجاري CCP
                </button>
              </div>

              {/* Account details info card */}
              <div className="p-4 bg-purple-900 text-white rounded-2xl text-xs space-y-1.5 shadow-inner">
                <div className="flex justify-between items-center font-bold text-amber-300">
                  <span>معلومات الحساب البريدي لتحويل المبلغ (1500 دج):</span>
                  <span>mssid dz Education</span>
                </div>
                <div className="font-mono text-sm tracking-wider font-extrabold bg-slate-950/60 p-2.5 rounded-xl border border-purple-700/50 flex justify-between items-center dir-ltr">
                  <span>RIP: 00799999000123456789</span>
                  <span className="text-xs font-sans text-purple-200">بريدي موب</span>
                </div>
                <div className="text-[11px] text-purple-200">
                  أو الحساب البريدي الجاري CCP: <strong className="text-white font-mono">1234567 Cle 89</strong> (اسم الحساب: مادة التعليم الابتدائي mssid dz)
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم المرجعية أو المعاملة (الوصل):</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="مثال: BM-2026-987456123"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المحول:</label>
                  <input
                    type="text"
                    disabled
                    value="1500 DZD (حقوق الاشتراك السنوي)"
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-purple-900 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Upload Receipt Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">صورة وصل الدفع (Reçu de Paiement):</label>
                <div className="flex items-center gap-4">
                  <label className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-2 border-dashed border-2">
                    <Upload className="w-4 h-4" />
                    <span>تحميل صورة الوصل من الجهاز</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <div className="flex items-center gap-2">
                    <img src={receiptImage} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border border-slate-300" />
                    <span className="text-[11px] text-slate-500 font-bold">معاينة الوصل المرفق</span>
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
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-extrabold rounded-2xl hover:from-purple-800 hover:to-indigo-900 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>{isSubmitting ? 'جاري إرسال الوصل...' : 'إرسال وصل الدفع وبدء التفعيل (ROLE_PREMIUM)'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
