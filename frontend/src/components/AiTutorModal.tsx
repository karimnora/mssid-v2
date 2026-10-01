import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, RefreshCw, ShieldAlert, Lightbulb, Lock } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 dir-rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel kids-modal-wide w-full max-w-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="kids-modal-header p-4 sm:p-5 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center text-2xl shrink-0">
              🦊
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold truncate">المعلّم الذكي "مسيد" 🇩🇿</h2>
                {!young && (
                  <>
                    <span className="bg-gradient-to-r from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-[#5A3B00] text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      Gemini AI
                    </span>
                    <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                      {userRole === 'ROLE_ADMIN' ? 'ADMIN' : userRole === 'ROLE_PREMIUM' ? 'PREMIUM' : 'FREE'}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-white/90 font-bold truncate">
                مساعدك الشخصي للرياضيات واللغة العربية وفق المنهاج الجزائري ({grade})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="kids-close cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!young && (
          <div className="bg-[#FFF8E7] p-3 flex items-center flex-wrap gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPromptType('explain')}
              className={`hit-target px-3 rounded-2xl text-sm font-extrabold cursor-pointer ${
                promptType === 'explain'
                  ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                  : 'bg-white text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
              }`}
            >
              اشرح لي درساً
            </button>
            <button
              type="button"
              onClick={() => setPromptType('solve')}
              className={`hit-target px-3 rounded-2xl text-sm font-extrabold cursor-pointer ${
                promptType === 'solve'
                  ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                  : 'bg-white text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
              }`}
            >
              حل مسألة أو سؤال
            </button>
            <button
              type="button"
              onClick={() => setPromptType('generate')}
              className={`hit-target px-3 rounded-2xl text-sm font-extrabold cursor-pointer ${
                promptType === 'generate'
                  ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                  : 'bg-white text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
              }`}
            >
              ولّد مسألة تدريبية جديدة
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="kids-modal-body p-4 sm:p-5 space-y-4">
          <div className="space-y-3 p-3.5 rounded-[22px] border-2 border-[#E7E2D7] bg-white">
            <div>
              <label className={`font-extrabold text-[var(--kids-ink)] block mb-2 ${young ? 'text-base' : 'text-sm'}`}>
                {young ? 'اختر درساً:' : 'الموضوع أو الدرس المطلوب:'}
              </label>
              {!young && (
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: الكسور العشرية، القواعد، السوروبان..."
                  className="kids-input"
                />
              )}
              {suggestedTopics.length > 0 && (
                <div className={`flex flex-wrap ${young ? 'gap-2.5' : 'gap-2 mt-2'}`}>
                  {suggestedTopics.map((s) => {
                    const selected = topic === s.labelAr;
                    if (young) {
                      return (
                        <motion.button
                          key={s.labelAr}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setTopic(s.labelAr)}
                          whileTap={{ scale: 0.95 }}
                          transition={spring}
                          className={`min-h-[60px] flex items-center gap-2 text-base font-extrabold px-4 py-3 rounded-2xl cursor-pointer ${
                            selected
                              ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                              : 'bg-[#FFFBF0] text-[var(--kids-ink)] border-2 border-[#E7E2D7]'
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
                        className={`flex items-center gap-1 min-h-[40px] text-sm font-extrabold px-3 py-1.5 rounded-full cursor-pointer ${
                          selected
                            ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                            : 'bg-[#FFFBF0] text-[var(--kids-ink)] border-2 border-[#E7E2D7]'
                        }`}
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
                <label className="text-sm font-extrabold text-[var(--kids-ink)] block mb-1.5">سؤالك أو نص المسألة بالتفصيل:</label>
                <textarea
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب المسألة أو القاعدة التي تريد حلاً نموذجياً لها..."
                  className="kids-input min-h-[72px] py-3"
                />
              </div>
            )}

            {quotaLabel && (
              <p className={`font-extrabold text-[var(--kids-muted)] ${young ? 'text-sm' : 'text-xs'}`}>{quotaLabel}</p>
            )}

            <motion.button
              type="button"
              onClick={handleSendPrompt}
              disabled={loading || quota?.remaining === 0}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              transition={spring}
              className={`kids-cta flex items-center justify-center gap-2 cursor-pointer ${
                young ? '!min-h-[60px] text-base' : ''
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>المعلم مسيد يفكر ويشرح...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[var(--kids-sun-1)]" />
                  <span>{young ? 'اشرح لي' : 'اطلب الإجابة من المعلم الذكي'}</span>
                </>
              )}
            </motion.button>
          </div>

          {errorMsg && (
            <div className="kids-msg-err p-4 text-sm font-bold space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-extrabold">تنبيه:</span>
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {aiResult?.text && (
            <div className="p-5 rounded-[22px] space-y-3 bg-white border-2 border-[#E7E2D7]">
              <div className="flex items-center justify-between pb-2 text-sm font-extrabold border-b-2 border-[#E7E2D7] text-[var(--kids-grass-2)]">
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
                  <span>🦊</span>
                  <span>شرح المعلم مسيد:</span>
                </div>
                <span className="text-[10px] font-bold text-[var(--kids-muted)]">المنهاج الجزائري</span>
              </div>

              <div className={`leading-relaxed whitespace-pre-line pt-1 text-[var(--kids-ink)] ${young ? 'text-lg' : 'text-sm'}`}>
                {aiResult.text}
              </div>
            </div>
          )}

          {aiResult?.exerciseText && (
            <div className="space-y-3">
              <div className="bg-white text-[var(--kids-ink)] p-5 rounded-[22px] border-2 border-[#E7E2D7] space-y-2">
                <div className="flex items-center gap-1.5 border-b-2 border-[#E7E2D7] pb-2 text-sm font-extrabold text-[var(--kids-grass-2)]">
                  <Sparkles className="w-4 h-4" />
                  <span>التمرين:</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line pt-1 font-bold">
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
                  className="w-full min-h-[60px] bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)] font-extrabold text-sm py-3 px-4 rounded-2xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5 shrink-0 text-[var(--kids-muted)]" />
                  <span>عرض الحل للوالدين</span>
                </button>
              )}

              {aiResult.solutionText && solutionUnlocked && (
                <div className="kids-msg-ok p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm font-extrabold">
                    <Lightbulb className="w-4 h-4 shrink-0" />
                    <span>الحل (للتحقق مع الوالدين):</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line font-bold">
                    {aiResult.solutionText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

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
