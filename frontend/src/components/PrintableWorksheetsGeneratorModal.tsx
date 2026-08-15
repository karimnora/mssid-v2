import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Printer, FileText, Download, CheckSquare, Sparkles, BookOpen } from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';

interface PrintableWorksheetsGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: PrimaryGrade;
}

export const PrintableWorksheetsGeneratorModal: React.FC<PrintableWorksheetsGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultGrade = '5AP',
}) => {
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGrade>(defaultGrade);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [sheetTitle, setSheetTitle] = useState('فرض المراقبة المستمرة وتقويم الكفاءات');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">مولّد الفروض والبطاقات الرسمية للطباعة A4</h2>
              <p className="text-xs text-slate-500 font-bold">بترويسة وزارة التربية الوطنية وسلم التنقيط مع الحل النموذجي</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الورقة A4 (Imprimer)</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-slate-100 text-xs">
          <div>
            <label className="font-black text-slate-700 block mb-1">المستوى:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as PrimaryGrade)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="1AP">1AP — الأولى ابتدائي</option>
              <option value="2AP">2AP — الثانية ابتدائي</option>
              <option value="3AP">3AP — الثالثة ابتدائي</option>
              <option value="4AP">4AP — الرابعة ابتدائي</option>
              <option value="5AP">5AP — الخامسة ابتدائي</option>
            </select>
          </div>

          <div>
            <label className="font-black text-slate-700 block mb-1">المادة:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="math">الرياضيات (Mathématiques)</option>
              <option value="arabic">اللغة العربية (Arabe)</option>
              <option value="science">التربية العلمية (Sciences)</option>
              <option value="history_geo">التاريخ والجغرافيا (Histoire-Géo)</option>
              <option value="islamic">التربية الإسلامية (Islamique)</option>
              <option value="civics">التربية المدنية (Civique)</option>
              <option value="french">اللغة الفرنسية (Français)</option>
              <option value="tamazight">اللغة الأمازيغية (Tamaziɣt / ⵜⴰⵎⴰⵣⵉⵖⵜ)</option>
            </select>
          </div>

          <div>
            <label className="font-black text-slate-700 block mb-1">الفصل الدراسي:</label>
            <select
              value={trimester}
              onChange={(e) => setTrimester(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value={1}>الفصل الأول (1er Trimestre)</option>
              <option value={2}>الفصل الثاني (2ème Trimestre)</option>
              <option value={3}>الفصل الثالث (3ème Trimestre)</option>
            </select>
          </div>
        </div>

        {/* Live A4 Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 rounded-2xl mt-3">
          <div className="printable-sheet bg-white max-w-[210mm] mx-auto p-8 border border-slate-300 shadow-lg rounded-xl text-slate-900 font-sans space-y-6">
            {/* Republic & Ministry Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
              <h3 className="text-sm font-black tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
              <h4 className="text-xs font-bold">وزارة التربية الوطنية — مديرية التعليم الابتدائي</h4>
              <div className="flex items-center justify-between text-xs font-black pt-2 px-2">
                <span>المدرسة الابتدائية: .......................................</span>
                <span>المستوى: {selectedGrade}</span>
                <span>السنة الدراسية: 2025 / 2026</span>
              </div>
            </div>

            {/* Assessment Title & Student Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1 text-right flex-1">
                <span className="text-xs font-bold text-slate-500">موضوع الاختبار والتقويم المستمر:</span>
                <h3 className="text-base font-black text-slate-900">
                  اختبار الفصل {trimester === 1 ? 'الأول' : trimester === 2 ? 'الثاني' : 'الثالث'} في مادة {
                    selectedSubject === 'math' ? 'الرياضيات' :
                    selectedSubject === 'arabic' ? 'اللغة العربية' :
                    selectedSubject === 'science' ? 'التربية العلمية' :
                    selectedSubject === 'tamazight' ? 'اللغة الأمازيغية (Tutlayt Tamaziɣt / ⵜⵓⵜⵍⴰⵢⵜ ⵜⴰⵎⴰⵣⵉⵖⵜ)' :
                    'المادة المقررة'
                  }
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="border border-slate-300 bg-white p-2 rounded-lg text-xs font-bold space-y-1 text-right min-w-36">
                  <div>اسم ولقب التلميذ(ة): ...................</div>
                  <div>القسم: ........... الفوج: .......</div>
                </div>

                <div className="border-2 border-slate-800 bg-white px-4 py-2 rounded-lg text-center">
                  <span className="text-[10px] font-black block">العلامة</span>
                  <span className="text-lg font-black text-emerald-800">..... / 10</span>
                </div>
              </div>
            </div>

            {/* Sample Ministry Exercises */}
            {selectedSubject === 'tamazight' ? (
              <div className="space-y-5 text-sm">
                {/* Exercise 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>التمرين الأول (02.5 نقطة) — Agemmay n Tifinagh:</span>
                    <span className="text-xs text-slate-500">قراءة ومطابقة خط التيفيناغ</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    اربط بسهم كل رمز تيفيناغي بالاسم اللاتيني المقابل ومعناه باللغة العربية:
                  </p>
                  <div className="grid grid-cols-3 gap-3 py-2 text-center font-bold text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="p-2 border border-slate-200 bg-white rounded space-y-1">
                      <div className="text-lg font-black text-blue-700">ⵣ (Yaz)</div>
                      <div className="text-slate-500">Amaziɣ (الإنسان الحر)</div>
                    </div>
                    <div className="p-2 border border-slate-200 bg-white rounded space-y-1">
                      <div className="text-lg font-black text-blue-700">ⵔ (Yar)</div>
                      <div className="text-slate-500">Argaz (الرجل)</div>
                    </div>
                    <div className="p-2 border border-slate-200 bg-white rounded space-y-1">
                      <div className="text-lg font-black text-blue-700">ⵜ (Yat)</div>
                      <div className="text-slate-500">Taddart (القرية)</div>
                    </div>
                  </div>
                </div>

                {/* Exercise 2 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>التمرين الثاني (02.5 نقطة) — Taseddast:</span>
                    <span className="text-xs text-slate-500">قواعد التحويل من المذكر للمؤنث</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    أكمل تحويل الكلمات التالية بإضافة علامة التأنيث (T...T):
                  </p>
                  <div className="space-y-1 text-xs font-medium pr-4">
                    <p>1. Axxam (منزل) ➔ ..................................................... (Taxxamt)</p>
                    <p>2. Amcic (قط) ➔ ..................................................... (Tamcict)</p>
                  </div>
                </div>

                {/* Problem Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>الوضعية الإدماجية (05 نقاط) — Tinfusin d Tira:</span>
                    <span className="text-xs text-slate-500">التعبير والإنتاج الكتابي التراثي</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200 font-medium">
                    اكتب فقرة من 3 أسطر باللغة الأمازيغية (أو بحروف التيفيناغ) تصف فيها عائلة الفنك الذهبي "ديدو" في احتفال رأس السنة الأمازيغية (Yennayer 2976).
                  </p>
                  <div className="space-y-2 text-xs font-bold pr-4">
                    <div className="border-b border-dashed border-slate-300 h-6"></div>
                    <div className="border-b border-dashed border-slate-300 h-6"></div>
                    <div className="border-b border-dashed border-slate-300 h-6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-sm">
                {/* Exercise 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>التمرين الأول (02.5 نقطة):</span>
                    <span className="text-xs text-slate-500">الحساب والعمليات الأساسية</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    أنجز العمليات الحسابية التالية عمودياً مع كتابة الاحتفاظ بدقة:
                  </p>
                  <div className="grid grid-cols-3 gap-4 py-2 text-center font-mono font-bold text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="p-2 border border-slate-200 bg-white rounded">5 480 + 3 750 = .........</div>
                    <div className="p-2 border border-slate-200 bg-white rounded">9 840 - 4 395 = .........</div>
                    <div className="p-2 border border-slate-200 bg-white rounded">425 × 12 = .........</div>
                  </div>
                </div>

                {/* Exercise 2 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>التمرين الثاني (02.5 نقطة):</span>
                    <span className="text-xs text-slate-500">الهندسة والمقادير والقياس</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    حقل مستطيل الشكل طوله 120 متراً وعرضه 45 متراً.
                  </p>
                  <div className="space-y-1 text-xs font-medium pr-4">
                    <p>1. احسب محيط هذا الحقل بالمتر (m).</p>
                    <p>2. أراد الفلاح تسييجه بسياج مع ترك مدخل عرضه 4 أمتار. احسب طول السياج اللازم.</p>
                  </div>
                </div>

                {/* Problem Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>الوضعية الإدماجية المركبة (05 نقاط):</span>
                    <span className="text-xs text-slate-500">حل المشكلات اليومية</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200 font-medium">
                    بمناسبة الدخول المدرسي، اشترى الأب لأبنائه 3 محافظ بسعر 1 500 دج للمحفظة الواحدة، ومجموعة كتب وأدوات بمبلغ 4 850 دج. دفع الأب للتاجر مبلغا قدره 10 000 دج.
                  </p>
                  <div className="space-y-2 text-xs font-bold pr-4">
                    <p>أ) احسب ثمن شراء المحافظ الثلاثة.</p>
                    <p>ب) احسب المبلغ الإجمالي للمشتريات.</p>
                    <p>ج) احسب كم ديناراً سيرجع التاجر للأب.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Detachable Answer Key (Correction Guide) */}
            <div className="border-t-2 border-dashed border-slate-400 pt-4 mt-6 space-y-2 text-xs bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center justify-between font-black text-slate-800">
                <span>✂️ قسيمة التصحيح النموذجي وسلم التنقيط (تنزع من طرف الأستاذ أو الولي)</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[10px]">مَسِيد DZ 🇩🇿</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 font-medium pt-1">
                {selectedSubject === 'tamazight' ? (
                  <>
                    <div>• التم 1: الربط السليم لرموز التيفيناغ ⵣ و ⵔ و ⵜ (0.83ن لكل ربط).</div>
                    <div>• التم 2: Taxxamt و Tamcict (1.25ن لكل تحويل صحيح).</div>
                    <div>• الوضعية: سلامة لغة التعبير والخط والالتزام بالموضوع (5 نقاط كاملة).</div>
                  </>
                ) : (
                  <>
                    <div>• التم 1: ناتج الجمع 9230 (0.75ن) | الطرح 5445 (0.75ن) | الضرب 5100 (1ن).</div>
                    <div>• التم 2: المحيط = (120+45)×2 = 330m (1.5ن) | السياج = 330 - 4 = 326m (1ن).</div>
                    <div>• الوضعية: المحافظ = 4500 دج (1.5ن) | المجموع = 9350 دج (1.5ن) | الصرف = 650 دج (2ن).</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
