import React, { useState } from 'react';
import { DocumentImportSession, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  FileUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  UploadCloud
} from 'lucide-react';
import { INITIAL_IMPORT_SESSIONS } from '../../data/cmsData';

interface PdfImporterProps {
  onCommitImportedChapters: (session: DocumentImportSession) => void;
}

export const PdfImporter: React.FC<PdfImporterProps> = ({
  onCommitImportedChapters,
}) => {
  const [sessions, setSessions] = useState<DocumentImportSession[]>(INITIAL_IMPORT_SESSIONS);
  const [activeSession, setActiveSession] = useState<DocumentImportSession | null>(sessions[0] || null);
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSimulatingAnalysis(true);

    setTimeout(() => {
      const newSession: DocumentImportSession = {
        id: `imp_${Date.now()}`,
        filename: file.name,
        fileType: file.name.endsWith('.pdf')
          ? 'pdf'
          : file.name.endsWith('.docx')
          ? 'docx'
          : file.name.endsWith('.json')
          ? 'json'
          : 'markdown',
        fileSizeBytes: file.size || 2400000,
        extractedTextPreview: `مستخرج نصي من الوثيقة المرفوقة "${file.name}"... يتضمن الفصول التعليمية ومصفوفة الكفاءات لوزارة التربية الوطنية.`,
        detectedGrade: '5AP',
        detectedSubject: 'math',
        detectedChapters: [
          {
            titleAr: 'الميدان الأول: الأعداد والحساب والكسور العشرية',
            competenciesAr: ['حل مشكلات الأعداد الطبيعية والعشرية والتككيك'],
            lessonsAr: ['الأعداد إلى 999 999 999', 'مقارنة وترتيب الكسور العشرية'],
          },
          {
            titleAr: 'الميدان الثاني: الهندسة والأشكال المستوية',
            competenciesAr: ['حساب المساحة والمحيط للأشكال الاعتيادية'],
            lessonsAr: ['خواص المربع والمستطيل', 'المثلثات والدوائر'],
          },
        ],
        status: 'preview',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setSessions([newSession, ...sessions]);
      setActiveSession(newSession);
      setIsSimulatingAnalysis(false);
    }, 1500);
  };

  const handleCommitCurrentSession = () => {
    if (!activeSession) return;

    const committedSession = { ...activeSession, status: 'committed' as const };
    setSessions(sessions.map((s) => (s.id === activeSession.id ? committedSession : s)));
    setActiveSession(committedSession);

    onCommitImportedChapters(committedSession);
    alert('تم اعتماد وإدراج جميع فصول الميدان والكفاءات المستخرجة من الوثيقة في قاعدة البيانات الرسمية بنجاح!');
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              Module d'Importation Intelligente
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              مستورد مناهج الوزارة من PDF ووثائق Word / JSON
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            استخراج تلقائي بالذكاء الاصطناعي للفصول، الدروس ومصفوفة الكفاءات مع معاينة قبل الاعتماد.
          </p>
        </div>
      </div>

      {/* Drag & Drop File Upload Area */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-3xl p-8 text-center text-white transition-all space-y-4 shadow-md">
        <div className="w-14 h-14 bg-amber-500/20 text-amber-400 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-extrabold font-sans">اسحب وأسقط ملف المنهاج الرسمي هنا</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
            يدعم ملفات PDF، Word (.docx)، Markdown (.md)، JSON، و CSV الخاصة بالمنهاج الدراسي لوزارة التربية الوطنية.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <label className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:brightness-110 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all">
            <span>اختيار ملف من الجهاز</span>
            <input
              type="file"
              accept=".pdf,.docx,.json,.md,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {isSimulatingAnalysis && (
          <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold pt-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>جاري تحليل الوثيقة واستخراج الكفاءات والميادين بالذكاء الاصطناعي...</span>
          </div>
        )}
      </div>

      {/* Interactive Preview & Verification Zone */}
      {activeSession && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md uppercase">
                  {activeSession.fileType.toUpperCase()}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{activeSession.filename}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">تاريخ الرفع: {activeSession.createdAt}</p>
            </div>

            <div className="flex items-center gap-2">
              {activeSession.status === 'committed' ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم الاعتماد والإدراج بالنظام</span>
                </span>
              ) : (
                <button
                  onClick={handleCommitCurrentSession}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>اعتماد وإدراج الميادين المكتشفة</span>
                </button>
              )}
            </div>
          </div>

          {/* Extracted Chapters & Competencies Breakdown Preview */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>الميادين والكفاءات المكتشفة من الوثيقة (Pre-Import Preview):</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSession.detectedChapters.map((chap, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      ميدان #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{chap.titleAr}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">الكفاءات المستخرجة:</span>
                    {chap.competenciesAr.map((comp, cIdx) => (
                      <div key={cIdx} className="text-xs text-slate-800 bg-white p-2 rounded-xl border border-slate-200/80 flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">الدروس الفرعية الكاشفة:</span>
                    {chap.lessonsAr.map((les, lIdx) => (
                      <div key={lIdx} className="text-xs text-slate-700 font-sans pl-2 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-amber-500" />
                        <span>{les}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
