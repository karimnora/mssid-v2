import React, { useState } from 'react';
import { PrimaryGrade, SubjectId } from '../../types/cms';
import {
  Sparkles,
  RefreshCw,
  Copy,
  PlusCircle,
  CheckCircle2,
  BookOpen,
  FileText,
  HelpCircle,
  PenTool,
  BrainCircuit
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/subjectsData';

interface AiGeneratorModuleProps {
  onInsertGeneratedCourse?: (titleAr: string, summaryAr: string, bodyHtml: string) => void;
}

type AiContentType = 'summary' | 'qcm' | 'math_problem' | 'dictation' | 'revision_sheet';

export const AiGeneratorModule: React.FC<AiGeneratorModuleProps> = ({
  onInsertGeneratedCourse,
}) => {
  const [contentType, setContentType] = useState<AiContentType>('summary');
  const [grade, setGrade] = useState<PrimaryGrade>('5AP');
  const [subject, setSubject] = useState<SubjectId>('math');
  const [topic, setTopic] = useState('الكسور العشرية والتحويل إلى أعداد بالفاصلة');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{ remaining?: number; limit?: number }>({});

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setGeneratedResult(null);
    setIsCached(false);

    const currentUser = JSON.parse(localStorage.getItem('mssid_current_user') || '{}');
    const userRole = currentUser.role || 'ROLE_TEACHER';
    const userId = currentUser.email || 'cms_teacher';

    try {
      const res = await fetch('/api/gemini/cms-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole,
          'x-user-id': userId,
        },
        body: JSON.stringify({
          type: contentType,
          topic,
          grade,
          subject,
          difficulty,
          role: userRole,
          userId,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setGeneratedResult(data.text);
        if (data.cached) {
          setIsCached(true);
        }
        if (data.usage) {
          setUsageInfo(data.usage);
        }
      } else if (data.error) {
        setGeneratedResult(`تنبيه النظام: ${data.message || data.error}`);
      } else {
        setGeneratedResult('حدث خطأ أثناء توليد المحتوى. يرجى إعادة المحاولة.');
      }
    } catch (err) {
      setGeneratedResult('تعذر الاتصال بخدمة الذكاء الاصطناعي Gemini. تحقق من الاتصال بالشبكة.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInsert = () => {
    if (generatedResult && onInsertGeneratedCourse) {
      onInsertGeneratedCourse(
        `درس مولّد بذكاء: ${topic}`,
        `ملخص درس بيداغوجي مولّد بواسطة Gemini 3.6 Flash لمادة ${subject}`,
        `<div class="space-y-4 dir-rtl text-right">${generatedResult.replace(/\n/g, '<br/>')}</div>`
      );
      alert('تم إدراج المحتوى المولّد بنجاح كمسودة درس في محرر الدروس!');
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              Gemini 3.6 Flash Pedagogy AI
            </span>
            <h2 className="text-lg font-extrabold text-white font-sans">
              المولّد الذكي للمحتوى البيداغوجي (AI Content Suite)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            إنشاء ملخصات دروس، أسئلة QCM، وضعيات إدماجية رياضية ونصوص إملاء مشكولة متوافقة مع منهاج وزارة التربية الوطنية.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
          <BrainCircuit className="w-6 h-6 text-slate-950" />
        </div>
      </div>

      {/* Generator Settings Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
        
        {/* Content Type Selector Cards */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-2">نوع المحتوى المراد توليده:</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {[
              { id: 'summary', labelAr: 'ملخص درس', icon: FileText },
              { id: 'qcm', labelAr: 'تمارين QCM', icon: HelpCircle },
              { id: 'math_problem', labelAr: 'وضعية إدماجية', icon: BookOpen },
              { id: 'dictation', labelAr: 'نص إملاء مشكول', icon: PenTool },
              { id: 'revision_sheet', labelAr: 'بطاقة مراجعة', icon: Sparkles },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = contentType === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setContentType(item.id as AiContentType)}
                  className={`p-3 rounded-2xl border text-center font-extrabold text-xs transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.labelAr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade, Subject, Difficulty Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المستوى التعليمي:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
              className="w-full bg-slate-50 border border-slate-300 font-bold text-xs p-2.5 rounded-xl focus:outline-none"
            >
              {(['1AP', '2AP', '3AP', '4AP', '5AP'] as PrimaryGrade[]).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">المادة:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectId)}
              className="w-full bg-slate-50 border border-slate-300 font-bold text-xs p-2.5 rounded-xl focus:outline-none"
            >
              {SUBJECTS_LIST.map((s) => (
                <option key={s.id} value={s.id}>{s.nameAr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">درجة الصعوبة البيداغوجية:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 font-bold text-xs p-2.5 rounded-xl focus:outline-none"
            >
              <option value="easy">سهل مبتدئ</option>
              <option value="medium">متوسط منظم</option>
              <option value="hard">تحدي متقدم</option>
            </select>
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">الموضوع أو الكفاءة المستهدفة:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: التناسبية وحساب معامل التناسبية في الأعياد والمناسبات"
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-xs p-3 rounded-xl focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
              <span>جاري صياغة المحتوى بواسطة Gemini 3.6 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>توليد المحتوى البيداغوجي بالذكاء الاصطناعي</span>
            </>
          )}
        </button>

      </div>

      {/* Generated Result Output Box */}
      {generatedResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-lg space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-extrabold text-sm text-amber-300">المحتوى المولّد بواسطة Gemini AI:</h3>
              {isCached && (
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ⚡ استجابة سريعة من الذاكرة المؤقتة (Cache Hit - بدون استهلاك رصيد)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>

              <button
                onClick={handleInsert}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إدراج في مسودة الدرس</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap dir-rtl">
            {generatedResult}
          </div>

        </div>
      )}

    </div>
  );
};
