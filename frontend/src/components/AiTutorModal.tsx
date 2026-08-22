import React, { useState } from 'react';
import { X, Sparkles, Bot, RefreshCw, ShieldAlert, Lightbulb } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';
import { AI_TUTOR_SUGGESTED_TOPICS } from '../data/aiTutorSuggestedTopics';
import { QuickCheckQuiz, QuickCheckOption } from './QuickCheckQuiz';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: PrimaryGrade;
}

interface AiResult {
  text?: string;
  exerciseText?: string;
  solutionText?: string;
  quickCheck?: { questionAr: string; options: QuickCheckOption[] };
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, grade }) => {
  const [topic, setTopic] = useState('القسمة الأقليدية والكسور');
  const [question, setQuestion] = useState('');
  const [promptType, setPromptType] = useState<'explain' | 'solve' | 'generate'>('explain');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role || 'ROLE_FREE';

  if (!isOpen) return null;

  const handleSendPrompt = async () => {
    if (!topic.trim() && !question.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setAiResult(null);

    try {
      const springRes = await springBootApi.askGeminiExplain({
        topic,
        question,
        grade,
        promptType,
      });

      // The backend always answers 200 OK and puts the failure reason in the SAME text field it
      // uses for real answers (GeminiResponse.responseText) — status is the only reliable signal
      // that this wasn't a genuine explanation. Never surface that raw text to the child as if it
      // were the tutor talking.
      if (springRes.status === 401) {
        setErrorMsg('يجب تسجيل الدخول لاستخدام المعلم الذكي.');
        return;
      }
      if (springRes.status === 429) {
        setErrorMsg(springRes.error || 'لقد استنفدت حصتك اليومية من أسئلة المعلم الذكي. حاول غداً.');
        return;
      }
      if (springRes.error || springRes.data?.status === 'error') {
        setErrorMsg('تعذر الوصول إلى المعلم الذكي حالياً. حاول مرة أخرى بعد قليل.');
        return;
      }

      // "generate" mode asks the backend for structured output (exerciseText/solutionText/quickCheck
      // — see GeminiAiService.generatePracticeExercise) instead of one free-text blob; every other
      // mode still returns a plain responseText/text string.
      const { exerciseText, solutionText, quickCheck, responseText, text } = springRes.data || {};
      if (exerciseText) {
        setAiResult({ exerciseText, solutionText, quickCheck });
        return;
      }

      const plainText = responseText || text;
      if (!plainText) {
        setErrorMsg('لم يصل أي رد من المعلم الذكي. حاول مرة أخرى.');
        return;
      }

      setAiResult({ text: plainText });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('تعذر الاتصال بالخادم. يرجى التحقق من الشبكة وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = AI_TUTOR_SUGGESTED_TOPICS[grade] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 dir-rtl" dir="rtl">
      <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center font-bold text-amber-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black font-sans">المعلّم الذكي "مسيد" 🇩🇿</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Gemini AI
                </span>
                <span className="bg-slate-900/80 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30">
                  {userRole}
                </span>
              </div>
              <p className="text-xs text-amber-100 font-sans">
                مساعدك الشخصي للرياضيات واللغة العربية وفق المنهاج الجزائري ({grade})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Type Selector */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPromptType('explain')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                promptType === 'explain' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              اشرح لي درساً
            </button>
            <button
              onClick={() => setPromptType('solve')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                promptType === 'solve' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              حل مسألة أو سؤال
            </button>
            <button
              onClick={() => setPromptType('generate')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                promptType === 'generate' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              ولّد مسألة تدريبية جديدة
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">الموضوع أو الدرس المطلوب:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: الكسور العشرية، القواعد، السوروبان..."
                className="w-full bg-white border border-slate-300 text-xs font-bold rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {suggestedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {suggestedTopics.map((s) => (
                    <button
                      key={s.labelAr}
                      type="button"
                      onClick={() => setTopic(s.labelAr)}
                      className="flex items-center gap-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      <span>{s.subjectEmoji}</span>
                      <span>{s.labelAr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {promptType === 'solve' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">سؤالك أو نص المسألة بالتفصيل:</label>
                <textarea
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب المسألة أو القاعدة التي تريد حلاً نموذجياً لها..."
                  className="w-full bg-white border border-slate-300 text-xs font-medium rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <button
              onClick={handleSendPrompt}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>المعلم مسيد يفكر ويشرح...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>اطلب الإجابة من المعلم الذكي</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold space-y-2">
              <div className="flex items-center gap-2 text-rose-900">
                <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
                <span className="text-sm font-extrabold">تنبيه:</span>
              </div>
              <p className="leading-relaxed font-sans">{errorMsg}</p>
            </div>
          )}

          {/* AI Output Result Box — plain-text modes (explain/solve) */}
          {aiResult?.text && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-bold text-amber-400">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>شرح المعلم مسيد:</span>
                </div>
                <span className="text-[10px] font-mono text-slate-300">المنهاج الجزائري</span>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line pt-1">
                {aiResult.text}
              </div>
            </div>
          )}

          {/* "generate" mode — structured output: exercise, solution, and an interactive check question */}
          {aiResult?.exerciseText && (
            <div className="space-y-3">
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>التمرين:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line pt-1">
                  {aiResult.exerciseText}
                </p>
              </div>

              {aiResult.solutionText && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>الحل (للتحقق مع الوالدين):</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-sans whitespace-pre-line">
                    {aiResult.solutionText}
                  </p>
                </div>
              )}

              {aiResult.quickCheck && (
                <QuickCheckQuiz
                  questionAr={aiResult.quickCheck.questionAr}
                  options={aiResult.quickCheck.options}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
