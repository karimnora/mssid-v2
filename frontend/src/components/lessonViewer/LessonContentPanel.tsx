import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourseLesson } from '../../types';
import { Card, Badge } from '../ui';
import { LoadingFallback } from '../LoadingFallback';
import { formatEducationalText } from '../../utils/textFormatter';
import { BookOpen, GraduationCap, Lightbulb, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { tabTransition } from './shared';
import { TapSpeakButton } from './TapSpeakButton';
import { MathWorkedExample } from './MathWorkedExample';
import { IrabTable, irabAnalysisHeaderForGrade } from './IrabTable';

const ScientificInquiryFlow = lazy(() => import('../ScientificInquiryFlow').then((m) => ({ default: m.ScientificInquiryFlow })));

interface LessonContentPanelProps {
  lesson: CourseLesson;
  renderArabicText: (text: string | undefined | null) => string;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  selectedExampleTier: 1 | 2 | 3 | 4 | 5;
  onSelectExampleTier: (tier: 1 | 2 | 3 | 4 | 5) => void;
  visibleSolutions: Record<number, boolean>;
  onToggleSolution: (index: number) => void;
  onGoToSimulation: () => void;
}

export const LessonContentPanel: React.FC<LessonContentPanelProps> = ({
  lesson,
  renderArabicText,
  speakingKey = null,
  onSpeak,
  selectedExampleTier,
  onSelectExampleTier,
  visibleSolutions,
  onToggleSolution,
  onGoToSimulation,
}) => {
  const speak = (key: string, text: string | undefined) =>
    onSpeak && text ? (
      <TapSpeakButton
        snippetKey={key}
        text={renderArabicText(text)}
        speakingKey={speakingKey}
        onSpeak={onSpeak}
      />
    ) : null;

  return (
  <div className="space-y-6">
    {lesson.scientificInquiry && (
      <Suspense fallback={<LoadingFallback label="جاري التحميل..." minHeight="160px" />}>
        <ScientificInquiryFlow
          inquiry={lesson.scientificInquiry}
          renderArabicText={renderArabicText}
          hasSimulation={!!lesson.gameplay_simulation}
          onGoToSimulation={onGoToSimulation}
        />
      </Suspense>
    )}

    {lesson.summaryAr && (
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-800/80 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            {speak('summary', lesson.summaryAr)}
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">ملخص الدرس المفاهيمي الشامل</h3>
          </div>
          <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            مادة {lesson.subject === 'math' ? 'الرياضيات' : lesson.subject === 'arabic' ? 'اللغة العربية' : lesson.subject === 'science' ? 'العلوم' : 'المنهج الدراسي'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
          {formatEducationalText(lesson.summaryAr)}
        </p>
      </div>
    )}

    {lesson.detailedCourse && (
      <Card padding="none" className="p-5 sm:p-6 space-y-4">
        <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[var(--brand-blue)]" />
          <span>الكورس المفصّل</span>
        </h3>
        <div className="flex items-start gap-2 bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)]/25 rounded-2xl p-4">
          {speak('intro', lesson.detailedCourse.introAr)}
          <p className="flex-1 text-sm text-[var(--app-text)] leading-relaxed">
            {renderArabicText(lesson.detailedCourse.introAr)}
          </p>
        </div>

        {lesson.detailedCourse.vocabulary && lesson.detailedCourse.vocabulary.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[var(--app-text-muted)] block">📖 كلمات مهمة أتذكرها:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.detailedCourse.vocabulary.map((v, i) => (
                <div key={i} className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-xl p-3 text-xs flex items-start gap-2">
                  {speak(`vocab-${i}`, v.termAr)}
                  <div className="min-w-0">
                    <span className="font-black text-[var(--brand-blue-dark)] block">{renderArabicText(v.termAr)}</span>
                    <span className="text-[var(--app-text-muted)]">{renderArabicText(v.definitionAr)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lesson.detailedCourse.visualizationHintAr && (
          <p className="text-xs text-[var(--brand-blue-dark)] bg-[var(--brand-blue)]/10 border border-[var(--brand-blue)]/25 rounded-xl p-3 flex items-start gap-2">
            <span>🖼️</span>
            <span>{renderArabicText(lesson.detailedCourse.visualizationHintAr)}</span>
          </p>
        )}

        {lesson.detailedCourse.commonMistakes && lesson.detailedCourse.commonMistakes.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[var(--brand-coral-dark)] block">⚠️ أخطاء شائعة يجب الانتباه إليها:</span>
            {lesson.detailedCourse.commonMistakes.map((m, i) => (
              <div key={i} className="bg-[var(--brand-coral)]/10 border border-[var(--brand-coral)]/25 rounded-xl p-3 text-xs space-y-1 flex items-start gap-2">
                {speak(`mistake-${i}`, m.correctionAr)}
                <div className="min-w-0 space-y-1">
                  <p className="text-[var(--brand-coral-dark)]"><span className="font-bold">❌ </span>{renderArabicText(m.mistakeAr)}</p>
                  <p className="text-[var(--brand-emerald-dark)]"><span className="font-bold">✅ </span>{renderArabicText(m.correctionAr)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/35 rounded-2xl p-4 text-sm font-bold text-[var(--brand-amber-dark)]">
          {speak('takeaway', lesson.detailedCourse.takeawayAr)}
          <span className="flex-1">💡 أتذكر: {renderArabicText(lesson.detailedCourse.takeawayAr)}</span>
        </div>
      </Card>
    )}

    {lesson.progressiveWorkedExamples && lesson.progressiveWorkedExamples.length > 0 && (
      <Card padding="none" className="p-5 sm:p-6 space-y-4">
        <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[var(--brand-amber)]" />
          <span>أمثلة متدرّجة (من الأسهل إلى التحدي)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {lesson.progressiveWorkedExamples.map((ex) => (
            <button
              key={ex.tier}
              onClick={() => onSelectExampleTier(ex.tier)}
              className={`min-h-10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedExampleTier === ex.tier
                  ? 'bg-[var(--brand-amber)] text-slate-950 font-black shadow-xs'
                  : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:opacity-80'
              }`}
            >
              {ex.labelAr}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {(() => {
            const activeExample = lesson.progressiveWorkedExamples!.find((ex) => ex.tier === selectedExampleTier) || lesson.progressiveWorkedExamples![0];
            return (
              <motion.div
                key={selectedExampleTier}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={tabTransition}
                className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-2xl p-4 space-y-2"
              >
                <p className="text-xs sm:text-sm font-bold text-[var(--app-text)] whitespace-pre-line">
                  {activeExample.isRealLife && <span className="text-[var(--brand-emerald)]">🏠 </span>}
                  {renderArabicText(activeExample.problem)}
                </p>
                {activeExample.stepsAr && activeExample.stepsAr.length > 0 && (
                  <ol className="list-decimal list-inside text-xs text-[var(--app-text-muted)] space-y-1 pr-1">
                    {activeExample.stepsAr.map((step, i) => (
                      <li key={i}>{renderArabicText(step)}</li>
                    ))}
                  </ol>
                )}
                <div className="bg-[var(--brand-emerald)]/10 border border-[var(--brand-emerald)]/30 rounded-xl p-3 text-xs text-[var(--brand-emerald-dark)] whitespace-pre-line">
                  <span className="font-bold">✅ الحل: </span>
                  {renderArabicText(activeExample.solution)}
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </Card>
    )}

    {lesson.irabTableAr && lesson.irabTableAr.length > 0 && (
      <Card padding="none" className="p-5 sm:p-6 space-y-4">
        <h3 className="font-extrabold text-base sm:text-lg text-[var(--app-text)]">
          {lesson.grade === '3AP' ? 'دَوْرُ كُلِّ كَلِمَةٍ فِي الجُمْلَةِ' : 'جَدْوَلُ الإِعْرَابِ'}
        </h3>
        <IrabTable
          rows={lesson.irabTableAr}
          analysisLabelAr={irabAnalysisHeaderForGrade(lesson.grade)}
        />
      </Card>
    )}

    <Card padding="none" className="p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[var(--app-text)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--brand-emerald)]" />
            <span>القواعد الذهبية للدرس مدعومة بالأمثلة المبسطة</span>
          </h3>
          <p className="text-xs text-[var(--app-text-muted)] font-sans mt-0.5">
            شرح ميسر لكل قاعدة مع أمثلة تطبيقية مباشرة لترسيخ الفهم
          </p>
        </div>
        <Badge variant="success">
          {lesson.rulesAr.length} قواعد أساسية
        </Badge>
      </div>

      <div className="space-y-4">
        {lesson.rulesAr.map((rule, idx) => {
          const colonIdx = rule.indexOf(':');
          let title = '';
          let body = rule;
          if (colonIdx > 0 && colonIdx < 50) {
            title = rule.substring(0, colonIdx).trim();
            body = rule.substring(colonIdx + 1).trim();
          }
          const hasExplicitExample = rule.includes('مثال') || rule.includes('مثال:');
          const matchingExample = lesson.examplesAr && lesson.examplesAr[idx];

          return (
            <div key={idx} className="bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] rounded-2xl p-4 sm:p-5 space-y-3 hover:border-[var(--brand-emerald)]/60 transition-all">
              <div className="flex items-start gap-3">
                {speak(`rule-${idx}`, rule)}
                <span className="w-8 h-8 rounded-xl bg-[var(--brand-emerald)] text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  {title && (
                    <h4 className="font-black text-sm sm:text-base text-[var(--app-text)] flex items-center gap-2">
                      <span>{title}</span>
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-[var(--app-text)] font-sans leading-relaxed font-semibold whitespace-pre-line">
                    {formatEducationalText(renderArabicText(body))}
                  </p>
                </div>
              </div>

              <div className="bg-[var(--brand-emerald)]/10 border border-[var(--brand-emerald)]/25 rounded-xl p-3.5 text-xs text-[var(--app-text)] font-sans space-y-1.5 mr-0 sm:mr-11">
                <div className="flex items-center gap-1.5 font-extrabold text-[var(--brand-emerald-dark)] text-xs">
                  <Lightbulb className="w-4 h-4 text-[var(--brand-amber)] shrink-0" />
                  <span>📌 مثال تطبيقي مبسط ومباشر:</span>
                </div>
                <div className="bg-[var(--app-card-bg)] p-3 rounded-lg border border-[var(--brand-emerald)]/25 text-[var(--app-text)] font-medium leading-relaxed font-sans whitespace-pre-line">
                  {matchingExample ? (
                    <div className="space-y-3">
                      <p>
                        <strong className="text-[var(--brand-emerald-dark)]">التطبيق: </strong>
                        {formatEducationalText(matchingExample.problem)}
                      </p>
                      <MathWorkedExample
                        solution={matchingExample.solution}
                        operationsAr={matchingExample.operationsAr}
                        renderArabicText={renderArabicText}
                        tone="light"
                      />
                    </div>
                  ) : hasExplicitExample ? (
                    <span>
                      تطبيق القاعدة مبيّن أعلاه في الجزء المحدد بكلمة (مثال)، حيث تلاحظ تحويل النظرية إلى نتيجة حاسمة بسيطة.
                    </span>
                  ) : lesson.subject === 'math' ? (
                    <span>
                      تطبيقيّاً: نطبق القاعدة مباشرة في المسائل عن طريق التعويض العددي ومراعاة الترتيب والخطوات التدرجية.
                    </span>
                  ) : lesson.subject === 'arabic' ? (
                    <span>
                      تطبيقيّاً: في الجملة الشفهية والكتابية، يُضبط الحرف الأخير حسب موقعه الإعرابي وفق هذه القاعدة بالضبط.
                    </span>
                  ) : (
                    <span>
                      تطبيقيّاً: هذه القاعدة تشرح الظاهرة العلمية أو المفهوم بشكل عملي يمكن ملاحظته واختباره بالعين المجردة.
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>

    {lesson.keyFormulas && lesson.keyFormulas.length > 0 && (
      <Card padding="none" className="p-5 space-y-3">
        <h3 className="font-extrabold text-sm text-[var(--app-text)] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[var(--brand-amber)]" />
          <span>القوانين والعبارات المفتاحية للدرس:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lesson.keyFormulas.map((kf, kIdx) => (
            <div key={kIdx} className="bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/25 p-4 rounded-2xl space-y-1.5">
              <span className="text-xs font-extrabold text-[var(--brand-amber-dark)] block">{kf.labelAr}</span>
              <span dir="ltr" className="text-xs sm:text-sm font-mono font-black text-[var(--app-text)] block bg-[var(--app-card-bg)] p-2.5 rounded-xl border border-[var(--brand-amber)]/25 shadow-2xs whitespace-pre-line text-right">
                {formatEducationalText(kf.formulaAr)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    )}

    {lesson.examplesAr && lesson.examplesAr.length > 0 && (
      <Card padding="none" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-extrabold text-base text-[var(--app-text)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--brand-emerald)]" />
              <span>أمثلة وتمارين نموذجية محلولة بالتفصيل</span>
            </h3>
            <p className="text-xs text-[var(--app-text-muted)]">
              حاول حل المسألة بنفسك أولاً، ثم اكشف عن الحل النموذجي المفصل
            </p>
          </div>
        </div>

        {lesson.examplesAr.map((ex, exIdx) => {
          const isVisible = !!visibleSolutions[exIdx];
          return (
            <div key={exIdx} className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
              <div className="text-xs sm:text-sm font-bold text-amber-300 font-sans leading-relaxed whitespace-pre-line bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                ❓ المشكلة / الوضعية {exIdx + 1}: {formatEducationalText(ex.problem)}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  onClick={() => onToggleSolution(exIdx)}
                  className="min-h-12 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 cursor-pointer shadow-xs"
                >
                  {isVisible ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  <span>{isVisible ? 'إخفاء الحل النموذجي' : 'إظهار الحل النموذجي المفصل 💡'}</span>
                </motion.button>

                {!isVisible && (
                  <span className="text-[11px] text-slate-400 italic">
                    🔒 الحل مخفي للتفكير الشخصي
                  </span>
                )}
              </div>

              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={tabTransition}
                    className="border-t border-emerald-900/60 pt-3 overflow-hidden"
                  >
                    <MathWorkedExample
                      solution={ex.solution}
                      operationsAr={ex.operationsAr}
                      renderArabicText={renderArabicText}
                      tone="dark"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Card>
    )}
  </div>
  );
};
