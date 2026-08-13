import React, { useSyncExternalStore } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  FeatureFlagName,
  getFeatureFlags,
  subscribeFeatureFlags,
  setFeatureFlagOverride,
  resetFeatureFlagOverride,
  isFlagOverridden,
} from '../../featureFlags';

interface FlagMeta {
  labelAr: string;
  descriptionAr: string;
}

const CORE_FLAGS: { id: FeatureFlagName; meta: FlagMeta }[] = [
  { id: 'enablePreschoolModule', meta: { labelAr: '🦊 وضع التحضيري / الإيقاظ (3-5 سنوات)', descriptionAr: 'إظهار أو إخفاء زر الدخول إلى قسم الروضة على الصفحة الرئيسية.' } },
  { id: 'enablePayments', meta: { labelAr: '💳 المدفوعات والاشتراكات', descriptionAr: 'تفعيل أو تعطيل نافذة الاشتراك المدفوع — عطّلها لإطلاق نسخة مجانية بالكامل.' } },
  { id: 'enablePrintablePDFs', meta: { labelAr: '🖨️ فيشات المراجعة القابلة للطباعة', descriptionAr: 'إظهار زر طباعة / تحميل فيشة المراجعة داخل الدروس.' } },
  { id: 'enableAITutor', meta: { labelAr: '🤖 المعلم الافتراضي أمين الفنك (Gemini)', descriptionAr: 'تفعيل أو تعطيل زر المساعد الذكي في شريط التنقل.' } },
  { id: 'enableExamSection', meta: { labelAr: '📜 قسم الامتحانات الرسمية (5AP)', descriptionAr: 'إظهار أو إخفاء تبويب الامتحانات الرسمية على واجهة التلميذ.' } },
];

const OTHER_FLAGS: { id: FeatureFlagName; meta: FlagMeta }[] = [
  { id: 'SHOW_ADS', meta: { labelAr: 'الإعلانات (Ads)', descriptionAr: 'عرض بانرات إعلانية للمستخدمين غير المشتركين.' } },
  { id: 'advancedLabs', meta: { labelAr: 'المختبرات المتقدمة', descriptionAr: 'أدوات المحاكاة المتقدمة (الكهرباء، الهندسة...).' } },
  { id: 'voiceReading', meta: { labelAr: 'القراءة الصوتية', descriptionAr: 'نطق الدروس والتعليمات صوتياً.' } },
  { id: 'educationalCalculator', meta: { labelAr: 'الآلة الحاسبة التعليمية', descriptionAr: 'أداة الحساب التفاعلية المستقلة.' } },
  { id: 'writingLab', meta: { labelAr: 'مخبر الكتابة', descriptionAr: 'لوحة التدرب على الكتابة اليدوية.' } },
  { id: 'interactiveVideo', meta: { labelAr: 'الفيديو التفاعلي', descriptionAr: 'مقاطع فيديو تعليمية تفاعلية.' } },
  { id: 'tamazight', meta: { labelAr: 'اللغة الأمازيغية (تجريبي)', descriptionAr: 'دعم أولي للغة الأمازيغية.' } },
  { id: 'pwa', meta: { labelAr: 'تطبيق ويب تقدمي (PWA)', descriptionAr: 'السماح بتثبيت المنصة كتطبيق على الهاتف.' } },
];

const ToggleRow: React.FC<{ id: FeatureFlagName; meta: FlagMeta; enabled: boolean; overridden: boolean }> = ({
  id,
  meta,
  enabled,
  overridden,
}) => (
  <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl">
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="text-xs font-extrabold text-slate-900">{meta.labelAr}</h4>
        {overridden && (
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 border border-amber-200">
            معدّل يدوياً
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-500">{meta.descriptionAr}</p>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {overridden && (
        <button
          onClick={() => resetFeatureFlagOverride(id)}
          title="إعادة الضبط الافتراضي"
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => setFeatureFlagOverride(id, !enabled)}
        className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
            enabled ? 'translate-x-0.5' : 'translate-x-5'
          }`}
        />
      </button>
    </div>
  </div>
);

// Live view of the runtime feature-flag store (see ../../featureFlags.ts). Toggling here calls
// setFeatureFlagOverride, which persists to localStorage and notifies every useFeatureFlag()
// subscriber across the app immediately — no redeploy needed to switch a section on/off.
export const FeatureFlagsConfig: React.FC = () => {
  const flags = useSyncExternalStore(subscribeFeatureFlags, getFeatureFlags);

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
            Feature Flags
          </span>
          <h2 className="text-lg font-extrabold text-slate-900">الإعدادات والتحكم بالمزايا</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          فعّل أو عطّل أي قسم من المنصة فورياً دون الحاجة لإعادة نشر الكود. التعديلات تُحفظ محلياً في هذا المتصفح وتُطبّق مباشرة على واجهة التلميذ.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 px-1">المزايا الأساسية</h3>
        <div className="space-y-2">
          {CORE_FLAGS.map(({ id, meta }) => (
            <ToggleRow key={id} id={id} meta={meta} enabled={flags[id]} overridden={isFlagOverridden(id)} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 px-1">مزايا إضافية</h3>
        <div className="space-y-2">
          {OTHER_FLAGS.map(({ id, meta }) => (
            <ToggleRow key={id} id={id} meta={meta} enabled={flags[id]} overridden={isFlagOverridden(id)} />
          ))}
        </div>
      </div>
    </div>
  );
};
