import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Bot, RefreshCw, ShieldAlert, Lightbulb, Lock } from 'lucide-react';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';
import { AI_TUTOR_SUGGESTED_TOPICS, defaultAiTutorTopicForGrade } from '../data/aiTutorSuggestedTopics';
import { QuickCheckQuiz, QuickCheckOption } from './QuickCheckQuiz';
import { ParentGateModal } from './ParentGateModal';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, stopSpeech as stopSynth } from '../utils/speech';

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

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

function isYoungTutorGrade(grade: PrimaryGrade): boolean {
  return grade === '1AP' || grade === '2AP';
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({ isOpen, onClose, grade }) => {
  const young = isYoungTutorGrade(grade);
  const [topic, setTopic] = useState(() => defaultAiTutorTopicForGrade(grade));
  const [question, setQuestion] = useState('');
  const [promptType, setPromptType] = useState<'explain' | 'solve' | 'generate'>('explain');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [quota, setQuota] = useState<{ remaining: number; limit: number } | null>(null);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speakingKeyRef = useRef<string | null>(null);

  const currentUser = AuthService.getCurrentUser();
  const userRole = currentUser?.role || 'ROLE_FREE';

  useEffect(() => {
    if (!isOpen) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    setTopic(defaultAiTutorTopicForGrade(grade));
    setQuestion('');
    setAiResult(null);
    setErrorMsg(null);
    setSolutionUnlocked(false);
    setShowParentGate(false);
    setPromptType('explain');
    void springBootApi.getAiQuota().then((res) => {
      if (res.data && typeof res.data.remaining === 'number' && typeof res.data.limit === 'number') {
        setQuota({ remaining: res.data.remaining, limit: res.data.limit });
      }
    });
  }, [isOpen, grade]);

  const speakSnippet = (key: string, text: string) => {
    if (!text) return;
    if (speakingKeyRef.current === key) {
      stopSynth();
      speakingKeyRef.current = null;
      setSpeakingKey(null);
      return;
    }
    speakingKeyRef.current = key;
    setSpeakingKey(key);
    void speakText(text, 'ar-SA', grade === '1AP' ? 0.78 : 0.9).then(() => {
      if (speakingKeyRef.current === key) {
        speakingKeyRef.current = null;
        setSpeakingKey(null);
      }
    });
  };

  if (!isOpen) return null;

  const applyQuotaFromPayload = (payload?: { quotaRemaining?: number; quotaLimit?: number }) => {
    if (payload && typeof payload.quotaRemaining === 'number' && typeof payload.quotaLimit === 'number') {
      setQuota({ remaining: payload.quotaRemaining, limit: payload.quotaLimit });
    }
  };

  const handleSendPrompt = async () => {
    if (!topic.trim() && !question.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setAiResult(null);
    setSolutionUnlocked(false);

    try {
      const springRes = await springBootApi.askGeminiExplain({
        topic,
        question: young ? '' : question,
        grade,
        promptType: young ? 'explain' : promptType,
      });

      applyQuotaFromPayload(springRes.data);

      // The backend always answers 200 OK and puts the failure reason in the SAME text field it
      // uses for real answers (GeminiResponse.responseText) — status is the only reliable signal
      // that this wasn't a genuine explanation. Never surface that raw text to the child as if it
      // were the tutor talking.
      if (springRes.status === 401) {
        setErrorMsg('يجب تسجيل الدخول لاستخدام المعلم الذكي.');
        return;
      }
      if (springRes.status === 429) {
        setQuota((prev) => (prev ? { ...prev, remaining: 0 } : { remaining: 0, limit: 3 }));
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
  const quotaLabel = quota
    ? `باقي ${quota.remaining} من ${quota.limit} أسئلة اليوم`
    : null;

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
                {!young && (
                  <>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Gemini AI
                    </span>
                    <span className="bg-slate-900/80 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-amber-400/30">
                      {userRole}
                    </span>
                  </>
                )}
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

        {!young && (
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
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className={`space-y-3 p-3.5 rounded-2xl border ${young ? 'bg-[#F8F9FA] border-amber-100' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <label className={`font-bold text-slate-600 block mb-2 ${young ? 'text-sm' : 'text-[11px]'}`}>
                {young ? 'اختر درساً:' : 'الموضوع أو الدرس المطلوب:'}
              </label>
              {!young && (
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: الكسور العشرية، القواعد، السوروبان..."
                  className="w-full bg-white border border-slate-300 text-xs font-bold rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
              {suggestedTopics.length > 0 && (
                <div className={`flex flex-wrap ${young ? 'gap-2.5' : 'gap-1.5 mt-2'}`}>
                  {suggestedTopics.map((s) => {
                    const selected = topic === s.labelAr;
                    if (young) {
                      return (
                        <motion.button
                          key={s.labelAr}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setTopic(s.labelAr)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={spring}
                          className={`min-h-[60px] flex items-center gap-2 text-base font-bold px-4 py-3 rounded-2xl cursor-pointer ${
                            selected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-800 border border-slate-200 hover:bg-amber-50'
                          }`}
                        >
                          <span>{s.subjectEmoji}</span>
                          <span>{s.labelAr}</span>
                        </motion.button>
                      );
                    }
                    return (
                      <button
                        key={s.labelAr}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setTopic(s.labelAr)}
                        className="flex items-center gap-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        <span>{s.subjectEmoji}</span>
                        <span>{s.labelAr}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!young && promptType === 'solve' && (
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

            {quotaLabel && (
              <p className={`font-bold text-slate-600 ${young ? 'text-sm' : 'text-xs'}`}>{quotaLabel}</p>
            )}

            <motion.button
              onClick={handleSendPrompt}
              disabled={loading || quota?.remaining === 0}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              transition={spring}
              className={`w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                young ? 'min-h-[60px] text-base py-3' : 'text-xs py-2.5 shadow-xs'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>المعلم مسيد يفكر ويشرح...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{young ? 'اشرح لي' : 'اطلب الإجابة من المعلم الذكي'}</span>
                </>
              )}
            </motion.button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
                <span className="text-sm font-extrabold">تنبيه:</span>
              </div>
              <p className="leading-relaxed font-sans">{errorMsg}</p>
            </div>
          )}

          {aiResult?.text && (
            <div className={`p-5 rounded-2xl space-y-3 ${young ? 'bg-[#F8F9FA] border border-amber-100 text-slate-900' : 'bg-slate-900 text-white border border-slate-800 shadow-inner'}`}>
              <div className={`flex items-center justify-between pb-2 text-xs font-bold ${young ? 'border-b border-amber-100 text-emerald-800' : 'border-b border-slate-800 text-amber-400'}`}>
                <div className="flex items-center gap-1.5">
                  {young && (
                    <TapSpeakButton
                      snippetKey="tutor-answer"
                      text={aiResult.text}
                      speakingKey={speakingKey}
                      onSpeak={speakSnippet}
                      size="lg"
                    />
                  )}
                  <Bot className={`w-4 h-4 ${young ? 'text-emerald-600' : 'text-emerald-400'}`} />
                  <span>شرح المعلم مسيد:</span>
                </div>
                <span className={`text-[10px] font-mono ${young ? 'text-slate-500' : 'text-slate-300'}`}>المنهاج الجزائري</span>
              </div>

              <div className={`leading-relaxed font-sans whitespace-pre-line pt-1 ${young ? 'text-lg text-slate-800' : 'text-xs text-slate-200'}`}>
                {aiResult.text}
              </div>
            </div>
          )}

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

              {aiResult.quickCheck && (
                <QuickCheckQuiz
                  questionAr={aiResult.quickCheck.questionAr}
                  options={aiResult.quickCheck.options}
                />
              )}

              {aiResult.solutionText && !solutionUnlocked && (
                <button
                  type="button"
                  onClick={() => setShowParentGate(true)}
                  className="w-full min-h-[60px] bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 text-slate-700 hover:text-emerald-800 font-bold text-sm py-3 px-4 rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5 shrink-0" />
                  <span>عرض الحل للوالدين</span>
                </button>
              )}

              {aiResult.solutionText && solutionUnlocked && (
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
            </div>
          )}
        </div>
      </div>

      <ParentGateModal
        isOpen={showParentGate}
        onClose={() => setShowParentGate(false)}
        onVerified={() => {
          setShowParentGate(false);
          setSolutionUnlocked(true);
        }}
      />
    </div>
  );
};
