import React from 'react';
import { X, ShieldCheck, Lock, Camera, UserCheck, FileText, Smartphone } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">سياسة الخصوصية • Privacy Policy</h2>
              <p className="text-xs text-slate-300">تطبيق مَسيد DZ (Mssid DZ) - التعليم الابتدائي الجزائري</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin">
          
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-emerald-300 text-base mb-1">تعهد بحماية خصوصية الأطفال (COPPA & Google Play Families Policy)</h3>
              <p className="text-sm text-slate-300">
                يلتزم تطبيق مَسيد DZ لحماية خصوصية الأطفال والتلاميذ (1AP حتى 5AP) وأولياء الأمور وفق معايير جوجل وسياسة برنامج "Designed for Families". نحن لا نجمع أو نبيع أي بيانات شخصية حساسة للأطفال.
              </p>
            </div>
          </div>

          {/* Publisher identity */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">•</span>
              الجهة الناشرة
            </h4>
            <p className="text-sm text-slate-300">
              تطبيق ومنصة مَسيد DZ يديرها ويطوّرها مطوّر مستقل مقيم في الجزائر. للتواصل بخصوص أي استفسار قانوني أو تقني: <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid.dz.app@gmail.com</code>.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
              البيانات المجمعة وأسباب جمعها
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-4">
              <li><strong className="text-slate-100">بيانات الحساب الشخصي (البريد والاسم والصف):</strong> تُستخدم فقط لتوثيق التسجيل ولتخصيص المحتوى التعليمي للمستوى الدراسي المقابل.</li>
              <li><strong className="text-slate-100">رمز الجلسة المشفر:</strong> يتم تخزينه محلياً لتفادي إعادة تسجيل الدخول في كل مرة ولتوفير تجربة سريعة بدون إنترنت.</li>
              <li><strong className="text-slate-100">التطبيق مجاني بالكامل حالياً:</strong> لا يوجد أي اشتراك مدفوع فعّال في هذه النسخة، وبالتالي لا يُطلب أي إذن وصول للكاميرا أو معرض الصور. إن تم تفعيل اشتراك مدفوع لاحقاً، سيتم تحديث هذه السياسة قبل ذلك ليوضح أي بيانات إضافية قد تُجمع (مثل صورة وصل دفع).</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
              عدم وجود إعلانات موجهة أو تتبع
            </h4>
            <p className="text-sm text-slate-300">
              تطبيق مَسيد DZ خالي تماماً من الإعلانات التجارية الموجهة للأطفال أو أدوات التتبع السلوكي الخارجية (AdMob / Facebook Pixel Tracker).
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
              الأمان والتشفير
            </h4>
            <p className="text-sm text-slate-300">
              جميع الاتصالات بين تطبيق المحمول والسيرفر الرئيسي تتطلب تشفير SSL (HTTPS) وضوابط أمان صارمة على الخادم مع تحديد معدلات الطلب لحماية بيانات المستخدمين من أي اختراق.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">4</span>
              عدم بيع البيانات لأطراف ثالثة
            </h4>
            <p className="text-sm text-slate-300">
              لا يقوم تطبيق مَسيد DZ ببيع أو تأجير أو مشاركة بيانات المستخدمين الشخصية مع أي طرف ثالث لأغراض تجارية أو إعلانية.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">5</span>
              مدة الاحتفاظ بالبيانات
            </h4>
            <p className="text-sm text-slate-300">
              تُحفظ بيانات الحساب طوال فترة استخدام التطبيق النشط. عند حذف الحساب، تُحذف جميع البيانات المرتبطة به نهائياً من قواعد بياناتنا خلال مدة أقصاها 30 يوماً من تاريخ طلب الحذف.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">6</span>
              حذف البيانات والحساب
            </h4>
            <p className="text-sm text-slate-300">
              يمكن لأي ولي أمر أو مستخدم طلب حذف حسابه وكافة بياناته نهائياً بطريقتين:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-4">
              <li><strong className="text-slate-100">من داخل التطبيق:</strong> صفحة الملف الشخصي ← حذف الحساب.</li>
              <li><strong className="text-slate-100">من خارج التطبيق (بدون الحاجة لتثبيته أو تسجيل الدخول):</strong> أرسل بريداً إلكترونياً إلى <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-mono">mssid.dz.app@gmail.com</code> من نفس عنوان البريد المسجل بالحساب، تحديداً بطلب حذف الحساب. يتم تنفيذ الطلب وحذف كافة البيانات المرتبطة خلال مدة أقصاها 30 يوماً.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 text-center space-y-1">
            <p>آخر تحديث: أوت 2026 • متوافق مع سياسات Google Play Console لعام 2026</p>
            <p className="opacity-70">© 2026 مَسِيد DZ</p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
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
