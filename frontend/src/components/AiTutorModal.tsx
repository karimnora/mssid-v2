import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw, MessageSquare, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: PrimaryGrade;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, grade }) => {
  const [topic, setTopic] = useState('القسمة الأقليدية والكسور');
  const [question, setQuestion] = useState('');
  const [promptType, setPromptType] = useState<'explain' | 'solve' | 'generate'>('explain');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quota & Cache Meta state
  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role || 'ROLE_FREE';
  const userId = currentUser?.email || 'anonymous_user';

  const [usageInfo, setUsageInfo] = useState<{ remaining: number; limit: number; resetHours?: number }>({
    remaining: (userRole as string) === 'ROLE_PREMIUM' ? 50 : (userRole as string) === 'ROLE_TEACHER' ? 100 : (userRole as string) === 'ROLE_ADMIN' ? 1000 : 3,
    limit: (userRole as string) === 'ROLE_PREMIUM' ? 50 : (userRole as string) === 'ROLE_TEACHER' ? 100 : (userRole as string) === 'ROLE_ADMIN' ? 1000 : 3,
  });
  const [isCachedHit, setIsCachedHit] = useState<boolean>(false);
  const [cacheHitsCount, setCacheHitsCount] = useState<number>(0);

  // Fetch initial quota on open
  useEffect(() => {
    if (isOpen) {
      fetch(`/api/gemini/quota?role=${userRole}&userId=${encodeURIComponent(userId)}`, {
        headers: {
          'x-user-role': userRole,
          'x-user-id': userId,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.limit !== undefined) {
            setUsageInfo({
              remaining: data.remaining,
              limit: data.limit,
              resetHours: data.resetHours,
            });
          }
        })
        .catch((err) => console.warn('Could not fetch quota status:', err));
    }
  }, [isOpen, userRole, userId]);

  if (!isOpen) return null;

  const handleSendPrompt = async () => {
    if (!topic.trim() && !question.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setIsCachedHit(false);

    try {
      // 1. Try Spring Boot API endpoint first
      const springRes = await springBootApi.askGeminiExplain({
        topic,
        question,
        grade,
        promptType,
      });

      if (springRes.status === 200 && (springRes.data?.responseText || springRes.data?.text)) {
        setAiResponse(springRes.data.responseText || springRes.data.text || '');
        if (springRes.data.cached) {
          setIsCachedHit(true);
        }
        return;
      }

      // 2. Fallback to Express backend proxy (/api/gemini/explain)
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': userRole,
          'x-user-id': userId,
        },
        body: JSON.stringify({
          topic,
          question,
          grade,
          promptType,
          role: userRole,
          userId,
        }),
      });

      const data = await res.json();

      if (res.status === 429 || data.error === 'RATE_LIMIT_EXCEEDED') {
        setErrorMsg(data.message || 'لقد تجاوزت الحد اليومي المسموح به لأسئلة الذكاء الاصطناعي.');
        if (data.limit !== undefined) {
          setUsageInfo({
            remaining: 0,
            limit: data.limit,
            resetHours: data.resetHours,
          });
        }
      } else if (data.error) {
        setErrorMsg(data.error);
      } else {
        setAiResponse(data.text);
        if (data.cached) {
          setIsCachedHit(true);
          setCacheHitsCount(data.cacheHitsCount || 1);
        }
        if (data.usage) {
          setUsageInfo({
            remaining: data.usage.remaining,
            limit: data.usage.limit,
            resetHours: data.usage.resetHours,
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('تعذر الاتصال بالخادم. يرجى التحقق من الشبكة وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

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
                  Gemini 3.6 AI
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
            {/* Quota Indicator Badge */}
            <div className="hidden sm:flex flex-col items-end text-left font-mono">
              <span className="text-[10px] text-emerald-200 uppercase font-bold">الرصيد اليومي:</span>
              <span className="text-xs font-black text-amber-300">
                {usageInfo.remaining} / {usageInfo.limit}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Type Selector & Quota Banner */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold shrink-0">
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

          <div className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
            الحد: <span className="font-bold text-emerald-700">{usageInfo.remaining}/{usageInfo.limit}</span>
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
                <span className="text-sm font-extrabold">تنبيه نظام الحماية والحد اليومي:</span>
              </div>
              <p className="leading-relaxed font-sans">{errorMsg}</p>
              {userRole === 'ROLE_FREE' && (
                <p className="text-[11px] text-rose-700 pt-1 border-t border-rose-200">
                  💡 <strong>نصيحة:</strong> يمكنك الترقية إلى حساب <span className="underline">ROLE_PREMIUM</span> للحصول على 50 سؤالاً يومياً وعرض إجابات فورية بدون انتظار!
                </p>
              )}
            </div>
          )}

          {/* AI Output Result Box */}
          {aiResponse && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-bold text-amber-400">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>شرح المعلم مسيد:</span>
                </div>

                {/* Cache Badge Indicator */}
                {isCachedHit ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>إجابة فورية مخزنة (Cache Hit #{cacheHitsCount}) • لم يستهلك رصيداً</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-300">المنهاج الجزائري</span>
                )}
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line pt-1">
                {aiResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
