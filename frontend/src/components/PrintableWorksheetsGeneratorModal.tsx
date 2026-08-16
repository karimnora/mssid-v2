import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Printer, FileText, Download, CheckSquare, Sparkles, BookOpen, Layers } from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';

interface PrintableWorksheetsGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGrade?: PrimaryGrade;
}

type SheetType = 'exam' | 'summary_card';

export const PrintableWorksheetsGeneratorModal: React.FC<PrintableWorksheetsGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultGrade = '5AP',
}) => {
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGrade>(defaultGrade);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [sheetType, setSheetType] = useState<SheetType>('exam');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[94vh] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-xl shrink-0">
              📄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">مولّد الفروض وبطاقات التلخيص الرسمية (A4)</h2>
              <p className="text-xs text-slate-500 font-bold">جاهزة للطباعة المنزلية أو المدرسية وفق معايير وزارة التربية الوطنية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-b border-slate-100 text-xs">
          <div>
            <label className="font-black text-slate-700 block mb-1">المستوى الدراسي:</label>
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
              <option value="english">اللغة الإنجليزية (English)</option>
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

          <div>
            <label className="font-black text-slate-700 block mb-1">نوع المستند:</label>
            <select
              value={sheetType}
              onChange={(e) => setSheetType(e.target.value as SheetType)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-800"
            >
              <option value="exam">موضوع امتحان / فرض تقويمي</option>
              <option value="summary_card">بطاقة مراجعة وخلاصة قواعد</option>
            </select>
          </div>
        </div>

        {/* Live A4 Preview Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-100 rounded-2xl mt-3">
          <div className="printable-sheet bg-white max-w-[210mm] mx-auto p-6 sm:p-8 border border-slate-300 shadow-lg rounded-xl text-slate-900 font-sans space-y-5">
            {/* Republic & Ministry Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-3 space-y-1">
              <h3 className="text-xs sm:text-sm font-black tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
              <h4 className="text-[11px] sm:text-xs font-bold text-slate-700">وزارة التربية الوطنية — مديرية التعليم الابتدائي</h4>
              <div className="flex items-center justify-between text-[11px] font-black pt-2 px-2 text-slate-800 flex-wrap gap-1">
                <span>المدرسة الابتدائية: .......................................</span>
                <span>المستوى: {selectedGrade}</span>
                <span>السنة الدراسية: 2025 / 2026</span>
              </div>
            </div>

            {/* Assessment / Summary Title & Student Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="space-y-0.5 text-right flex-1">
                <span className="text-[10px] font-bold text-slate-500">
                  {sheetType === 'exam' ? 'موضوع التقويم المستمر والاختبار الرسمي:' : 'بطاقة المراجعة المركزة للمكتسبات:'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {sheetType === 'exam' ? 'اختبار' : 'خلاصة دروس'} الفصل {trimester === 1 ? 'الأول' : trimester === 2 ? 'الثاني' : 'الثالث'} في مادة {
                    selectedSubject === 'math' ? 'الرياضيات' :
                    selectedSubject === 'arabic' ? 'اللغة العربية' :
                    selectedSubject === 'science' ? 'التربية العلمية والتكنولوجية' :
                    selectedSubject === 'history_geo' ? 'التاريخ والجغرافيا' :
                    selectedSubject === 'islamic' ? 'التربية الإسلامية' :
                    selectedSubject === 'civics' ? 'التربية المدنية' :
                    selectedSubject === 'french' ? 'اللغة الفرنسية (Français)' :
                    selectedSubject === 'english' ? 'اللغة الإنجليزية (English)' :
                    selectedSubject === 'tamazight' ? 'اللغة الأمازيغية (Tamaziɣt / ⵜⴰⵎⴰⵣⵉⵖⵜ)' :
                    'المادة المقررة'
                  }
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="border border-slate-300 bg-white p-2 rounded-lg text-[11px] font-bold space-y-1 text-right min-w-32">
                  <div>اسم ولقب التلميذ(ة): ...................</div>
                  <div>القسم: {selectedGrade} الفوج: .......</div>
                </div>

                {sheetType === 'exam' && (
                  <div className="border-2 border-slate-800 bg-white px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[9px] font-black block text-slate-600">العلامة</span>
                    <span className="text-base font-black text-emerald-800">..... / 10</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Subject Content */}
            {selectedSubject === 'arabic' ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs leading-relaxed space-y-1">
                  <span className="font-black text-amber-900 block">📖 السند والنص القرائي:</span>
                  <p className="font-arabic text-slate-800">
                    الجزائرُ وَطَنٌ عَزِيزٌ تَزْخَرُ أَرْضُهُ بِالخَيْرَاتِ وَالجَمَالِ. فِي الشَّمَالِ تَمْتَدُّ السُّهُولُ الخَضْرَاءُ وَالبَحْرُ الأَزْرَقُ، وَفِي الجَنُوبِ تَسْتَقِرُّ الرِّمَالُ الذَّهَبِيَّةُ وَوَاحَاتُ النَّخِيلِ الشَّامِخَةِ. عَلَى كُلِّ تِلْمِيذٍ أَنْ يَجْتَهِدَ فِي دِرَاسَتِهِ لِيَبْنِيَ مُسْتَقْبَلَ بِلادِهِ الحَبِيبَةِ.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>الجزء الأول: البناء الفكري واللغوي (05 نقاط):</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p>1. هَاتِ عُنْوَانًا مُنَاسِبًا لِلنَّصِّ: ..............................................................</p>
                    <p>2. اسْتَخْرِجْ مِنْ النَّصِّ مُرَادِفَ كَلِمَةِ (يَعْمَلُ بِجِدٍّ): ....................... وضِدَّ (الشَّمَال): .......................</p>
                    <p>3. أَعْرِبْ مَا تَحْتَهُ خَطٌّ فِي النَّصِّ (الجزائرُ - يَجْتَهِدَ): ..............................................................</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-black border-b border-slate-200 pb-1">
                    <span>الجزء الثاني: الوضعية الإدماجية (05 نقاط):</span>
                  </div>
                  <p className="text-xs leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    اكتب فقرة من 6 إلى 8 أسطر تتحدث فيها عن واجبك نحو وطنك الجزائر للمحافظة على بيئته ونظافة مدرستك، موظفاً جملة اسمية وحرف عطف.
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="border-b border-dashed border-slate-300 h-5"></div>
                    <div className="border-b border-dashed border-slate-300 h-5"></div>
                    <div className="border-b border-dashed border-slate-300 h-5"></div>
                  </div>
                </div>
              </div>
            ) : selectedSubject === 'french' ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs leading-relaxed space-y-1">
                  <span className="font-black text-blue-900 block">📖 Texte de lecture: Le Fennec du Sahara</span>
                  <p className="text-slate-800 font-sans">
                    Le fennec est un petit animal qui vit dans le grand désert algérien. Il a de grandes oreilles pour écouter et chasser la nuit. Il se nourrit de plantes, de lézards et d'insectes. C'est un animal protégé.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs font-sans">
                  <p><strong>1. Compréhension de l'écrit (3 pts):</strong></p>
                  <p>• Où vit le fennec ? ➔ .....................................................................</p>
                  <p>• De quoi se nourrit-il ? ➔ .....................................................................</p>
                  <p><strong>2. Activités de langue (3 pts):</strong></p>
                  <p>• Souligne le sujet et encadre le verbe : <em>Le fennec vit dans le désert.</em></p>
                  <p>• Mets au pluriel : <em>Le grand animal</em> ➔ <em>Les .....................................................</em></p>
                  <p><strong>3. Production écrite (4 pts):</strong> Complète la fiche de la Gazelle avec les mots : <em>(cornes, herbe, rapide, désert)</em>.</p>
                </div>
              </div>
            ) : selectedSubject === 'science' ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-black text-slate-900 block border-b pb-1">التمرين الأول (03 نقاط) — دورة حياة النبات الأخضر:</span>
                  <p className="text-xs">رتب مراحل إنتاش البذرة ونمو النبتة من 1 إلى 4 مع ذكر الشروط الضرورية للإنتاش (الماء، الحرارة، سلامة الرشيم):</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                    <div className="p-2 border rounded bg-slate-50">(...) ظهور السويقة</div>
                    <div className="p-2 border rounded bg-slate-50">(...) انتفاخ البذرة</div>
                    <div className="p-2 border rounded bg-slate-50">(...) نمو الجذير للأسفل</div>
                    <div className="p-2 border rounded bg-slate-50">(...) تفتح الأوراق الخضراء</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-black text-slate-900 block border-b pb-1">التمرين الثاني (03 نقاط) — الدارة الكهربائية والأمن:</span>
                  <p className="text-xs">صنّف المواد التالية في جدول (نواقل / عوازل للتيار الكهربائي): <em>(مسمار حديدي، مسطرة خشبية، ماء نقي، سلك نحاسي، ممحاة مطاطية، ماء مالح)</em>.</p>
                </div>

                <div className="space-y-2">
                  <span className="font-black text-slate-900 block border-b pb-1">الوضعية الإدماجية (04 نقاط) — المحافظة على الصحة:</span>
                  <p className="text-xs bg-teal-50 p-2.5 rounded-lg border border-teal-200">
                    أصيب زميلك بالإرهاق وضيق في التنفس أثناء حصة التربية البدنية. قدم له 3 نصائح للحفاظ على سلامة الجهاز التنفسي والقلب.
                  </p>
                </div>
              </div>
            ) : selectedSubject === 'tamazight' ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-black border-b pb-1 block">التمرين الأول (02.5 نقطة) — Agemmay n Tifinagh:</span>
                  <p className="text-xs">اربط بسهم كل رمز تيفيناغي بالاسم اللاتيني المقابل ومعناه باللغة العربية:</p>
                  <div className="grid grid-cols-3 gap-2 text-center font-bold text-xs bg-slate-50 p-2 rounded-lg border">
                    <div className="p-1.5 border bg-white rounded"><span className="text-lg font-black text-blue-700">ⵣ (Yaz)</span><br/><span className="text-slate-500">Amaziɣ (الإنسان الحر)</span></div>
                    <div className="p-1.5 border bg-white rounded"><span className="text-lg font-black text-blue-700">ⵔ (Yar)</span><br/><span className="text-slate-500">Argaz (الرجل)</span></div>
                    <div className="p-1.5 border bg-white rounded"><span className="text-lg font-black text-blue-700">ⵜ (Yat)</span><br/><span className="text-slate-500">Taddart (القرية)</span></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-black border-b pb-1 block">التمرين الثاني (02.5 نقطة) — Taseddast (المذكر والمؤنث):</span>
                  <p className="text-xs">حوّل من المذكر إلى المؤنث بإضافة (T...T): 1. Axxam ➔ Taxxamt | 2. Amcic ➔ Tamcict.</p>
                </div>
              </div>
            ) : (
              /* Default Math View */
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <span className="font-black border-b pb-1 block">التمرين الأول (02.5 نقطة) — الحساب والعمليات العمودية:</span>
                  <div className="grid grid-cols-3 gap-3 py-1 text-center font-mono font-bold text-xs bg-slate-50 p-2.5 rounded-lg border">
                    <div className="p-2 border bg-white rounded">5 480 + 3 750 = .......</div>
                    <div className="p-2 border bg-white rounded">9 840 - 4 395 = .......</div>
                    <div className="p-2 border bg-white rounded">425 × 12 = .......</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-black border-b pb-1 block">التمرين الثاني (02.5 نقطة) — الهندسة والمقادير:</span>
                  <p className="text-xs">حقل مستطيل الشكل طوله 120 متراً وعرضه 45 متراً. احسب محيط الحقل (m) ثم احسب طول السياج إذا ترك مدخلاً عرضه 4 أمتار.</p>
                </div>

                <div className="space-y-2">
                  <span className="font-black border-b pb-1 block">الوضعية الإدماجية المركبة (05 نقاط) — سوق الدينار الجزائري:</span>
                  <p className="text-xs bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                    بمناسبة الدخول المدرسي، اشترى الأب 3 محافظ بسعر 1 500 دج للمحفظة الواحدة، ومجموعة كتب بمبلغ 4 850 دج. دفع للتاجر ورقة من فئة 10 000 دج. احسب ثمن المحافظ، المبلغ الإجمالي، والمبلغ الذي يرجعه التاجر.
                  </p>
                </div>
              </div>
            )}

            {/* Detachable Answer Key (Correction Guide) */}
            <div className="border-t-2 border-dashed border-slate-400 pt-3 mt-4 space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl">
              <div className="flex items-center justify-between font-black text-slate-800">
                <span>✂️ قسيمة التصحيح وسلّم التنقيط النموذجي (تنزع من طرف الأستاذ أو الولي)</span>
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-bold">مَسِيد DZ 🇩🇿</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                • التمارين (1 و 2): تطبيق القواعد الحسابية واللغوية الدقيقة وفق المنهاج (5 نقاط كاملة).<br/>
                • الوضعية الإدماجية: الالتزام بالتعليمة، تسلسل الأفكار، وسلامة الخط والحساب بالدينار الجزائري (5 نقاط كاملة).
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
