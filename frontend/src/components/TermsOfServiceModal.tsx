import React from 'react';
import { X, FileText, CreditCard, RotateCcw, UserX, Copyright, ShieldAlert, Scale, Mail } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Original draft, written for this app's actual product/payment flow — NOT a substitute for legal
// review. Flagged to the team as a draft pending confirmation before being treated as final/binding,
// same "pre-launch, needs a human sign-off" status as the parental-supervision decision it sits next
// to in the audit.
export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-auto max-h-[90vh]">

        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">الشروط والأحكام العامة • Conditions Générales d'Utilisation</h2>
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

          <div className="p-4 bg-blue-950/40 border border-blue-800/60 rounded-2xl flex items-start gap-3">
            <Scale className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-300 text-base mb-1">مسودة أولية — Draft en attente de validation juridique</h3>
              <p className="text-sm text-slate-300">
                هذه صياغة أولية أعدّها فريق مَسيد DZ لتغطية الاستخدام والاشتراك والدفع، بانتظار مراجعة نهائية قبل اعتمادها رسمياً.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              موضوع الخدمة
            </h4>
            <p className="text-sm text-slate-300">
              مَسِيد DZ منصة تعليمية رقمية داعمة للمنهاج الرسمي الجزائري للتعليم الابتدائي (السنة الأولى إلى الخامسة ابتدائي)، توفر دروساً وتمارين ومختبرات تفاعلية وامتحانات نموذجية. هي أداة دعم ومراجعة مكمّلة للتمدرس النظامي، وليست بديلاً عنه ولا عن المدرسة الرسمية.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              إنشاء الحساب والاستخدام
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-4">
              <li>يُفترض أن يتم إنشاء الحساب وتفعيل الاشتراك من طرف ولي الأمر أو تحت إشرافه، نظراً للفئة العمرية المستهدفة (6 إلى 11 سنة تقريباً).</li>
              <li>المعلومات المُدخلة عند التسجيل (الاسم، البريد الإلكتروني، المستوى الدراسي) يجب أن تكون صحيحة وقابلة للتواصل عبرها.</li>
              <li>كلمة المرور شخصية وسرية؛ يتحمل صاحب الحساب مسؤولية الحفاظ عليها وعدم مشاركتها.</li>
            </ul>
          </div>

          {/* Section 3 — Payment */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
              الاشتراك والدفع
            </h4>
            <p className="text-sm text-slate-300">
              جميع محتويات ودروس ومختبرات مَسِيد DZ <strong className="text-slate-100">مجانية بالكامل حالياً</strong>، ولا يوجد أي اشتراك مدفوع فعّال في هذه النسخة من التطبيق. البنود التالية تصف آلية اشتراك مدفوع قد تُفعَّل مستقبلاً، وهي غير مطبَّقة حالياً؛ سيتم إعلام المستخدمين بوضوح داخل التطبيق قبل تفعيل أي عرض مدفوع.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 mr-4">
              <li>عند التفعيل مستقبلاً: يمنح الاشتراك المدفوع الوصول الكامل لمحتوى التطبيق لمدة سنة واحدة من تاريخ التفعيل، بسعر ثابت معلن داخل التطبيق.</li>
              <li>الدفع سيتم عبر التحويل بواسطة BaridiMob أو CCP، ثم رفع صورة وصل الدفع للتحقق منه يدوياً من طرف فريق الإدارة.</li>
              <li>يتم تفعيل الاشتراك بعد التحقق من صحة الوصل، وعادةً خلال مهلة معقولة لا تتجاوز أياماً قليلة من العمل.</li>
              <li>في حال رفض الوصل (وصل غير واضح أو غير مطابق)، يتم إعلام صاحب الحساب بالسبب مع إمكانية إعادة رفع وصل صحيح.</li>
            </ul>
          </div>

          {/* Section 4 — Refunds */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <RotateCcw className="w-3.5 h-3.5" />
              </span>
              سياسة الاسترجاع
            </h4>
            <p className="text-sm text-slate-300">
              لا ينطبق حالياً بما أن التطبيق مجاني بالكامل. عند تفعيل اشتراك مدفوع مستقبلاً: في حال وجود خطأ تقني (تفعيل مزدوج، خصم بمبلغ غير صحيح) أو عدم تفعيل الاشتراك رغم تحقق الدفع الصحيح، يحق لصاحب الحساب طلب استرجاع المبلغ خلال 14 يوماً من تاريخ الدفع، عبر التواصل مع الدعم. لا يُسترجع الاشتراك بعد استخدام فعلي كامل للخدمة لمدة تتجاوز هذه المهلة، إلا في حالة خطأ ثابت من طرف التطبيق.
            </p>
          </div>

          {/* Section 5 — Account deletion / termination */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <UserX className="w-3.5 h-3.5" />
              </span>
              إنهاء الاستخدام وحذف الحساب
            </h4>
            <p className="text-sm text-slate-300">
              يمكن لصاحب الحساب حذف حسابه نهائياً في أي وقت من صفحة الملف الشخصي داخل التطبيق، مما يؤدي لحذف كل بياناته المرتبطة بالحساب بشكل دائم. لا يترتب عن الحذف استرجاع تلقائي لأي اشتراك قائم؛ لطلب الاسترجاع يُرجى التواصل مع الدعم قبل الحذف (انظر البند الرابع).
            </p>
          </div>

          {/* Section 6 — IP */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <Copyright className="w-3.5 h-3.5" />
              </span>
              الملكية الفكرية
            </h4>
            <p className="text-sm text-slate-300">
              محتوى التطبيق (الدروس والتمارين والرسوم والتصميم) هو ملك لفريق مَسِيد DZ، ومُعدّ استناداً إلى المنهاج الرسمي العمومي لوزارة التربية الوطنية الجزائرية. يُمنع نسخ أو إعادة نشر أو استغلال المحتوى تجارياً دون إذن كتابي مسبق.
            </p>
          </div>

          {/* Section 7 — Liability */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <ShieldAlert className="w-3.5 h-3.5" />
              </span>
              حدود المسؤولية
            </h4>
            <p className="text-sm text-slate-300">
              يُقدَّم التطبيق كأداة دعم تعليمي "كما هو"، دون ضمان نتيجة دراسية معينة. لا يتحمل فريق مَسِيد DZ مسؤولية أي انقطاع تقني مؤقت، أو خطأ محتوى تم تداركه لاحقاً، ما دام الفريق يبذل جهداً معقولاً لضمان استمرارية ودقة الخدمة.
            </p>
          </div>

          {/* Section 8 — Changes & law */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">8</span>
              تعديل الشروط والقانون المطبَّق
            </h4>
            <p className="text-sm text-slate-300">
              يمكن تحديث هذه الشروط دورياً؛ سيتم إعلام المستخدمين بأي تعديل جوهري عبر التطبيق. تخضع هذه الشروط للتشريع الجزائري المعمول به، وأي نزاع يُعرض على الجهات القضائية المختصة في الجزائر.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                <Mail className="w-3.5 h-3.5" />
              </span>
              التواصل
            </h4>
            <p className="text-sm text-slate-300">
              لأي استفسار متعلق بالاشتراك أو الاسترجاع أو هذه الشروط، يُرجى التواصل عبر: <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-400 font-mono">support@mssid-dz.com</code>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 text-center">
            آخر تحديث: أوت 2026 — مسودة بانتظار المراجعة النهائية
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all shadow-xs"
          >
            فهمت وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
