import React, { useState, useSyncExternalStore } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import {
  FeatureFlagName,
  getFeatureFlags,
  subscribeFeatureFlags,
  setFeatureFlagOverride,
  resetFeatureFlagOverride,
  isFlagOverridden,
} from '../../featureFlags';
import { springBootApi } from '../../services/springBootApi';

interface FlagMeta {
  labelAr: string;
  descriptionAr: string;
  // Set when this flag's effect is conditional on another flag also being on (see isLessonLocked in
  // trimesterAccess.ts, which requires BOTH enablePayments and enableTrimesterPaywall). Without
  // surfacing this in the UI, toggling either flag alone silently does nothing — which is exactly the
  // "the flag has no effect" bug report this dependsOn/blocked machinery exists to fix.
  dependsOn?: FeatureFlagName;
  dependsOnLabelAr?: string;
}

// Copied verbatim from the deleted components/cms/FeatureFlagsConfig.tsx — this catalog stays
// frontend-owned (the backend only persists per-key overrides, see featureFlags.ts).
// Every description below follows the same "ON: ... / OFF: ..." shape so an admin never has to
// guess what a toggle actually does before clicking it — the flag report that led to Phase 44/45
// found that half the catalog (advancedLabs, voiceReading, educationalCalculator, writingLab,
// interactiveVideo, pwa) wasn't wired to anything at all, so this discipline also nets out as a
// forcing function: writing an honest ON/OFF line makes an unwired flag obvious immediately.
const CORE_FLAGS: { id: FeatureFlagName; meta: FlagMeta }[] = [
  { id: 'enablePreschoolModule', meta: { labelAr: '🦊 وضع التحضيري / الإيقاظ (3-5 سنوات)', descriptionAr: 'ON: زر «الروضة» ظاهر على الصفحة الرئيسية. OFF: الزر مخفي تماماً، ولا وصول لقسم الروضة.' } },
  { id: 'enablePayments', meta: { labelAr: '💳 المدفوعات والاشتراكات', descriptionAr: 'المفتاح الرئيسي لنظام الدفع بالكامل. ON: يسمح لقفل الفصلين (أدناه) بالعمل إن كان مفعّلاً هو أيضاً — لا أثر مرئي بمفرده. OFF: يوقف نظام الدفع فوراً مهما كانت حالة القفل، وتصبح كل الدروس مجانية.' } },
  { id: 'enableTrimesterPaywall', meta: { labelAr: '🔒 قفل الفصلين الثاني والثالث', descriptionAr: 'ON (مع تفعيل «المدفوعات» أعلاه): دروس الفصلين الثاني والثالث تتطلب اشتراك ROLE_PREMIUM، الفصل الأول يبقى مجانياً دائماً. OFF: الفصول الثلاثة مجانية للجميع.', dependsOn: 'enablePayments', dependsOnLabelAr: 'المدفوعات والاشتراكات' } },
  { id: 'enablePrintablePDFs', meta: { labelAr: '🖨️ فيشات المراجعة القابلة للطباعة', descriptionAr: 'ON: زر طباعة/تحميل فيشة المراجعة ظاهر داخل الدروس. OFF: الزر مخفي تماماً.' } },
  { id: 'enableAITutor', meta: { labelAr: '🤖 المعلم الافتراضي أمين الفنك (Gemini)', descriptionAr: 'ON: زر المساعد الذكي ظاهر في شريط التنقل. OFF: الزر مخفي، ولا وصول للمعلم الافتراضي.' } },
  { id: 'enableExamSection', meta: { labelAr: '📜 قسم الامتحانات الرسمية (5AP)', descriptionAr: 'ON: تبويب الامتحانات الرسمية ظاهر لدى التلميذ. OFF: التبويب مخفي تماماً.' } },
];

const OTHER_FLAGS: { id: FeatureFlagName; meta: FlagMeta }[] = [
  { id: 'advancedLabs', meta: { labelAr: 'المختبرات المتقدمة', descriptionAr: 'ON: مختبرات الكهرباء، الهندسة، والمختبر العلمي الشامل ظاهرة في قائمة «الأدوات». OFF: الثلاثة مخفية من تلك القائمة (لا يشمل التجارب المدمجة داخل الدروس نفسها، تلك تبقى ظاهرة بغض النظر عن هذا الفلاغ).' } },
  { id: 'voiceReading', meta: { labelAr: 'القراءة الصوتية', descriptionAr: 'ON: زر النطق الصوتي ظاهر (الحاسبة التعليمية، لوحة الكتابة...) والنطق يعمل في كل مختبر يستعمله (السوق، المتحف، المختبر العلمي، خريطة الولايات). OFF: كل نطق صوتي متوقف في التطبيق بالكامل، وزر النطق مخفي.' } },
  { id: 'educationalCalculator', meta: { labelAr: 'الآلة الحاسبة التعليمية', descriptionAr: 'ON: أداة «الحاسبة التعليمية المفسرة» ظاهرة في قائمة الأدوات. OFF: مخفية تماماً.' } },
  { id: 'writingLab', meta: { labelAr: 'مخبر الكتابة', descriptionAr: 'ON: «أستوديو الكتابة والخط وتتبع الحروف» ظاهر في قائمة الأدوات. OFF: مخفي تماماً.' } },
  { id: 'tamazight', meta: { labelAr: 'اللغة الأمازيغية (تجريبي)', descriptionAr: 'ON: مادة الأمازيغية ودروسها، مختبرها التفاعلي، ومنهاجها الرسمي ظاهرة في الدروس والأدوات. OFF: الثلاثة مخفية تماماً من واجهة التلميذ.' } },
];

// Toggle = instant local effect via setFeatureFlagOverride/resetFeatureFlagOverride (unchanged UX,
// no redeploy needed), THEN a best-effort PUT/DELETE against the server so the change is shared
// across admins/devices. On network failure the local toggle still stands (never silently reverted)
// but an inline warning tells the admin it didn't reach the server.
const ToggleRow: React.FC<{ id: FeatureFlagName; meta: FlagMeta; enabled: boolean; overridden: boolean; dormant: boolean }> = ({
  id,
  meta,
  enabled,
  overridden,
  dormant,
}) => {
  const [syncError, setSyncError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleToggle = async () => {
    setSyncError(false);
    setFeatureFlagOverride(id, !enabled);
    setIsSyncing(true);
    try {
      const res = await springBootApi.updateFeatureFlag(id, !enabled);
      if (res.error) setSyncError(true);
    } catch {
      setSyncError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReset = async () => {
    setSyncError(false);
    resetFeatureFlagOverride(id);
    setIsSyncing(true);
    try {
      const res = await springBootApi.deleteFeatureFlagOverride(id);
      if (res.error) setSyncError(true);
    } catch {
      setSyncError(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-extrabold text-white">{meta.labelAr}</h4>
            {overridden && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                معدّل يدوياً
              </span>
            )}
            {dormant && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                ⏸️ بلا تأثير حالياً
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300">{meta.descriptionAr}</p>
          {dormant && (
            <p className="text-[10px] font-bold text-rose-300">
              يتطلب تفعيل «{meta.dependsOnLabelAr}» أولاً ليُطبَّق هذا التبديل فعلياً.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {overridden && (
            <button
              onClick={handleReset}
              disabled={isSyncing}
              title="إعادة الضبط الافتراضي"
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-300 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            role="switch"
            aria-checked={enabled}
            onClick={handleToggle}
            disabled={isSyncing}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer disabled:opacity-70 ${enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                enabled ? 'translate-x-0.5' : 'translate-x-5'
              }`}
            />
          </button>
        </div>
      </div>
      {syncError && (
        <div className="flex items-center gap-1.5 px-2 text-[10px] font-bold text-rose-300">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>لم تتم مزامنة هذا التعديل مع الخادم — لن يظهر لبقية المشرفين</span>
        </div>
      )}
    </div>
  );
};

// Live view of the runtime feature-flag store (see ../../featureFlags.ts). Toggling here calls
// setFeatureFlagOverride, which persists to localStorage and notifies every useFeatureFlag()
// subscriber across the app immediately — no redeploy needed to switch a section on/off. The server
// PUT/DELETE happens on top, for shared state across admins/devices (see AuthContext's boot hydration).
export const FeatureFlagsModule: React.FC = () => {
  const flags = useSyncExternalStore(subscribeFeatureFlags, getFeatureFlags);

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Feature Flags
          </span>
          <h2 className="text-lg font-extrabold text-white">الإعدادات والتحكم بالمزايا</h2>
        </div>
        <p className="text-xs text-slate-300 mt-1">
          فعّل أو عطّل أي قسم من المنصة فورياً دون الحاجة لإعادة نشر الكود. التعديلات تُطبَّق محلياً فوراً في هذا المتصفح، ثم تُزامَن مع الخادم لتصل إلى بقية المشرفين والأجهزة.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 px-1">المزايا الأساسية</h3>
        <div className="space-y-2">
          {CORE_FLAGS.map(({ id, meta }) => (
            <ToggleRow
              key={id}
              id={id}
              meta={meta}
              enabled={flags[id]}
              overridden={isFlagOverridden(id)}
              dormant={!!meta.dependsOn && flags[id] && !flags[meta.dependsOn]}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 px-1">مزايا إضافية</h3>
        <div className="space-y-2">
          {OTHER_FLAGS.map(({ id, meta }) => (
            <ToggleRow key={id} id={id} meta={meta} enabled={flags[id]} overridden={isFlagOverridden(id)} dormant={false} />
          ))}
        </div>
      </div>
    </div>
  );
};
