import React from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-x-hidden overflow-y-auto font-sans dir-rtl" dir="rtl">
      <div className="web-dialog web-dialog-wide bg-slate-900 border border-slate-800 w-full max-w-4xl min-w-0 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-auto max-h-[min(90dvh,calc(100svh-1.5rem))]">

        <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-start sm:items-center justify-between gap-2">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug break-words">سياسة الخصوصية • Privacy Policy</h2>
              <p className="text-xs text-slate-300 leading-snug break-words">تطبيق مَسيد DZ — التعليم التحضيري والابتدائي الجزائري</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hit-target w-12 shrink-0 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 min-w-0 space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin">

          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-emerald-300 text-base mb-1">حماية بيانات الأطفال</h3>
              <p className="text-sm text-slate-300">
                مَسيد DZ تطبيق تعليمي موجّه للأطفال في الجزائر (التربية التحضيرية حتى السنة الخامسة ابتدائي) ولأوليائهم. لا نبيع البيانات ولا نعرض إعلانات موجّهة. لا ندّعي الامتثال لقانون COPPA الأمريكي ولا لبرنامج Google Play «Designed for Families» ما لم يُعلَن ذلك صراحة بعد مراجعة قانونية مستقلة. نعالج المعطيات وفق القانون الجزائري رقم 18-07.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">•</span>
              الجهة الناشرة
            </h4>
            <p>
              تطبيق ومنصة مَسيد DZ يديرها مطوّر مستقل مقيم في الجزائر. للاستفسار أو لطلب حذف البيانات: <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid.dz.app@gmail.com</code>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
              البيانات التي نجمعها
            </h4>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li><strong className="text-slate-100">الحساب:</strong> الاسم، البريد الإلكتروني، كلمة المرور (مخزّنة مشفّرة)، المستوى الدراسي إن وُجد، وبريد الولي اختيارياً (غير متحقَّق منه).</li>
              <li><strong className="text-slate-100">التقدّم التعليمي:</strong> النقاط، الشارات، الدروس/الامتحانات/التحديات المكتملة، رصيد القطع، وإعدادات الصورة الرمزية.</li>
              <li><strong className="text-slate-100">رسائل «اتصل بنا»:</strong> الاسم والبريد ومحتوى الرسالة إن أرسلتَ نموذجاً.</li>
              <li><strong className="text-slate-100">الاشتراك المدفوع:</strong> غير مفعّل حالياً. إن فُعّل لاحقاً قد نجمع بيانات وصل الدفع بعد تحديث هذه السياسة.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
              ملفات تعريف الارتباط والتخزين المحلي
            </h4>
            <p>
              نستخدم كوكيز جلسة HttpOnly على نطاق الخادم: <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid_auth_token</code> (حوالي 24 ساعة) و<code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid_refresh_token</code> (حوالي 30 يوماً) للإبقاء على تسجيل الدخول. المتصفح يرسلها مع الطلبات نحو واجهتنا؛ شيفرة الصفحة لا تقرأها. على الجهاز قد يُحفظ في التخزين المحلي تقدّم الواجهة وإعدادات اختيارية، وليست كوكيز إعلانية.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
              لا إعلانات موجّهة
            </h4>
            <p>
              لا إعلانات تجارية موجّهة للأطفال ولا تتبع سلوكي من معلنين. على نسخة الويب فقط نستخدم إحصاءات زيارات إجمالية عبر Vercel Analytics دون ملف شخصي فردي. تطبيق أندرويد الأصلي لا يضمّن حزمة التحليلات هذه.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
              مقدّمو خدمات الاستضافة والمعالجة
            </h4>
            <p>لا نبيع بياناتك. نعتمد على مقدّمين لتشغيل التطبيق:</p>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li><strong className="text-slate-100">Vercel:</strong> استضافة الموقع وإحصاءات الزيارات الإجمالية.</li>
              <li><strong className="text-slate-100">Render:</strong> استضافة الخادم.</li>
              <li><strong className="text-slate-100">Neon:</strong> قاعدة البيانات PostgreSQL.</li>
              <li><strong className="text-slate-100">Resend:</strong> البريد المعاملاتي (تأكيد الحساب / إعادة كلمة المرور / إشعار ولي اختياري).</li>
              <li><strong className="text-slate-100">Google Gemini:</strong> المعلّم الذكي — قد يتضمّن الطلب نص السؤال أو سياق الدرس.</li>
              <li><strong className="text-slate-100">Sentry:</strong> تتبّع الأعطال التقنية (تقارير الأخطاء البرمجية فقط — دون اسمك أو بريدك الإلكتروني).</li>
            </ul>
            <p>قد توجد خوادم هؤلاء المقدّمين خارج الجزائر.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">5</span>
              الأمان
            </h4>
            <p>الاتصالات مع الخادم تتم عبر HTTPS. نحدّ من معدّل الطلبات. كلمة المرور لا تُخزَّن بالنص الواضح.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">6</span>
              مدة الاحتفاظ
            </h4>
            <p>
              بيانات الحساب والتقدّم تُحفظ طوال فترة استخدام الحساب. بعد الحذف: الحساب والتقدّم والرموز تُحذف فوراً من قاعدة البيانات التشغيلية. سجلات التدقيق الإدارية ورسائل الاتصال قد تُحفظ حتى 30 يوماً للدعم والأمن ثم تُحذف أو تُجهَّل.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">7</span>
              حذف الحساب
            </h4>
            <ul className="list-disc list-inside space-y-1 mr-4">
              <li><strong className="text-slate-100">من داخل التطبيق:</strong> الملف الشخصي ← حذف الحساب.</li>
              <li><strong className="text-slate-100">بالبريد:</strong> من عنوان الحساب إلى <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid.dz.app@gmail.com</code>. ننفّذ الطلب خلال 30 يوماً كحد أقصى.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">8</span>
              إشراف الولي
            </h4>
            <p>
              يُفترض أن ينشئ الولي الحساب أو يشرف عليه. بريد الولي اختياري وغير متحقَّق. بوابة حساب بسيطة تقلّل الضغط العرضي؛ ليست موافقة قانونية قائمة بذاتها.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 text-center space-y-1">
            <p>آخر تحديث: 28 أوت 2026 • نفس النص منشور أيضاً على /privacy.html</p>
            <p className="opacity-70">© 2026 مَسِيد DZ</p>
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-xs"
          >
            فهمت وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
