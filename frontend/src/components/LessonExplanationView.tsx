import React, { Suspense, lazy, useEffect, useState } from 'react';
import { CourseLesson } from '../types';
import { BookOpen, Lightbulb, Sparkles, CheckCircle2, ArrowLeft, ArrowRight, Zap, Target, HelpCircle, Glasses, Calculator, Play, RefreshCw, Layers } from 'lucide-react';
import { LoadingFallback } from './LoadingFallback';
import { formatEducationalText, stripArabicTashkeel } from '../utils/textFormatter';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { MathWorkedExample } from './lessonViewer/MathWorkedExample';
import { IrabTable, irabAnalysisHeaderForGrade } from './lessonViewer/IrabTable';

// R2.1 — same lazy split as LessonViewer.tsx (this was the other static import forcing
// ScienceLabSimulation, and transitively ElectricityLabInteractive, back into the main chunk).
const ScienceLabSimulation = lazy(() => import('./ScienceLabSimulation').then((m) => ({ default: m.ScienceLabSimulation })));

interface LessonExplanationViewProps {
  lesson: CourseLesson;
  tashkeelEnabled?: boolean;
  availableSteps?: {
    id: string;
    labelAr: string;
    icon?: React.ReactNode;
    activeClass?: string;
    badgeColor?: string;
  }[];
  activeStepId?: string;
  onSelectStep?: (stepId: string) => void;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
}

export const LessonExplanationView: React.FC<LessonExplanationViewProps> = ({
  lesson,
  tashkeelEnabled = true,
  availableSteps,
  activeStepId,
  onSelectStep,
  speakingKey = null,
  onSpeak,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  // Switching to a lesson with fewer explanation steps while deep in the previous lesson's
  // steps left activeStepIndex pointing past content.steps, crashing content.steps[activeStepIndex]
  // (remonte utilisateur : erreur nécessitant un refresh après avoir changé de leçon).
  useEffect(() => {
    setActiveStepIndex(0);
  }, [lesson.id]);
  const [interactiveMode, setInteractiveMode] = useState<'real_world' | 'step_by_step' | 'interactive_demo'>('real_world');
  const [demoValue, setDemoValue] = useState<number>(10);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [grammarPronoun, setGrammarPronoun] = useState<string>('هو');
  const [grammarTense, setGrammarTense] = useState<'past' | 'present' | 'imperative'>('present');
  const [scienceCondition, setScienceCondition] = useState<number>(1);
  const [geoEraIndex, setGeoEraIndex] = useState<number>(0);

  // Generate subject-specific smart real-world scenarios and interactive demonstrations
  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const getSubjectRealWorldContent = () => {
    if (lesson.grade === '1AP' || lesson.grade === '2AP') {
      const ruleSteps = lesson.rulesAr.slice(0, 3).map((rule, idx) => ({
        title: `أَتَذَكَّرُ ${idx + 1}`,
        detail: rule,
        icon: ['💡', '👀', '✅'][idx] || '⭐',
      }));
      return {
        whyLearn: lesson.discoveryAr || lesson.summaryAr || '',
        realLifeTitle: 'فِي حَيَاتِنَا',
        realLifeDescription: lesson.objectiveAr || lesson.summaryAr || '',
        steps: ruleSteps.length > 0
          ? ruleSteps
          : [{ title: 'أَنْظُرُ', detail: lesson.summaryAr || '', icon: '💡' }],
        demoControlLabel: 'جَرِّبْ',
        demoType: 'number_slider' as const,
      };
    }

    switch (lesson.subject) {
      case 'math':
        return {
          whyLearn: 'نستخدم هذا الدرس يومياً عند الشراء والبيع في الدكان، حساب المسافات والأطوال في الرياضة والبناء، وقراءة الوقت والأوقات!',
          realLifeTitle: '🛒 وضعية واقعية: الشراء في السوبرماركت الحقيقي',
          realLifeDescription: `تخيل أنك تشتري مستلزمات المدرسة بمبلغ ${demoValue * 100} DZD. كيف يساعدك درس "${renderArabicText(lesson.titleAr)}" على الحساب بدقة بدون أخطاء؟`,
          steps: [
            {
              title: 'الخطوة 1: فهم المشكلة أو القيمة',
              detail: `نبدأ بتحديد الأرقام الأساسية وتقسيمها إلى أجزاء بسيطة (آلاف، مئات، عشرات) لنسهل حسابها في الذهن.`,
              icon: '💡'
            },
            {
              title: 'الخطوة 2: تطبيق القاعدة الرياضية بالذكاء',
              detail: `نطبق عملية الحساب أو التفكيك أو التحويل تدريجياً لضمان عدم نسيان أي مرتبة.`,
              icon: '⚙️'
            },
            {
              title: 'الخطوة 3: التحقق والتأكد من النتيجة',
              detail: `نقارن النتيجة مع الواقع للتأكد من منطقيتها (مثلاً: الباقي من نقودك يجب أن يكون أصغر من المبلغ الكلي).`,
              icon: '✅'
            }
          ],
          demoControlLabel: 'غيّر القيمة الممثلة في التجربة:',
          demoType: 'number_slider'
        };

      case 'arabic':
        return {
          whyLearn: 'اللغة العربية هي لغة التواصل والتعبير اليومي، وتساعدنا التراكيب وقواعد الصرف على كتابة رسائل وقصص سليمة وإلقاء أحاديث بثقة!',
          realLifeTitle: '💬 وضعية واقعية: الحوار اليومي والتعبير الفصيح',
          realLifeDescription: `عندما تتحدث مع زملائك أو تكتب موضوع تعبير عن الجزائر أو المدرسة، يمنحك درس "${renderArabicText(lesson.titleAr)}" قوة في اختيار الكلمات وضبط أواخرها.`,
          steps: [
            {
              title: 'الخطوة 1: اكتشاف نوع الكلمة أو القاعدة',
              detail: 'نميز أولاً هل نستخدم اسم، فعل، أم حرف، وما هي العلامة الإعرابية أو الصيغة الصرفية المناسبة.',
              icon: '📝'
            },
            {
              title: 'الخطوة 2: تطبيق الضبط التفاعلي',
              detail: 'نطابق الفاعل مع الفعل (أو المبتدأ مع الخبر) في التذكير والتأنيث والإفراد والجمع.',
              icon: '🎯'
            },
            {
              title: 'الخطوة 3: التحدث بأناقة وفصاحة',
              detail: 'نضع الجملة في سياقها الصحيح لنوصل المعنى بأعلى درجة من الجمال والوضوح.',
              icon: '✨'
            }
          ],
          demoControlLabel: 'اختر الجملة أو الصيغة لتجربتها:',
          demoType: 'grammar_toggle'
        };

      case 'science':
        return {
          whyLearn: 'العلوم هي مفتاح فهم العالم من حولنا! تشرح لنا كيف تعمل الكهرباء، وكيف تنمو الكائنات الحية، وكيف نضمن السلامة في منازلنا.',
          realLifeTitle: '🔬 وضعية واقعية: مختبر الأمان والاستكشاف العلمي',
          realLifeDescription: `في حياتنا اليومية عند تشغيل الأجهزة أو دراسة الكائنات الحية، يبسط هذا الدرس (${renderArabicText(lesson.titleAr)}) الأسباب والنتائج العلمية.`,
          steps: [
            {
              title: 'الخطوة 1: الملاحظة وطرح السؤال العلمي',
              detail: 'لماذا يحدث هذا التغير؟ وما هي العوامل المسببة له في الطبيعة أو التجربة؟',
              icon: '🔍'
            },
            {
              title: 'الخطوة 2: إجراء التجربة والمحاكاة',
              detail: 'نربط السبب بالنتيجة (مثلاً: إغلاق الدارة الكهربائية يضيء المصباح، أو تصفية الخليط تفصل المواد).',
              icon: '🧪'
            },
            {
              title: 'الخطوة 3: استنتاج القاعدة العلمية',
              detail: 'نستخلص القانون العام الذي ينطبق على كل الحالات المماثلة في حياتنا.',
              icon: '🌟'
            }
          ],
          demoControlLabel: 'تفاعل مع التجربة العلمية:',
          demoType: 'science_toggle'
        };

      case 'history_geo':
        return {
          whyLearn: 'التاريخ والجغرافيا يعلموننا حب الوطن الجزائر، ومعرفة مراحل نضال أجدادنا وتضاريس مناخ بلادنا الرائعة!',
          realLifeTitle: '🗺️ وضعية واقعية: رحلة عبر خريطة الجزائر وتاريخها',
          realLifeDescription: `كيف نفهم التوزع السكاني، المناخ، أو الأحداث التاريخية العظيمة لدرس "${renderArabicText(lesson.titleAr)}"؟`,
          steps: [
            {
              title: 'الخطوة 1: تحديد الزمان والمكان',
              detail: 'نضع الحدث على السلم الزمني أو نحدد الموقع على الخريطة الجغرافية.',
              icon: '📍'
            },
            {
              title: 'الخطوة 2: فهم العوامل والأسباب',
              detail: 'نحلل لماذا اختار السكان هذه المنطقة أو كيف جرت الأحداث التاريخية.',
              icon: '📜'
            },
            {
              title: 'الخطوة 3: الربط بالحاضر والمستقبل',
              detail: 'نستفيد من التاريخ لتطوير حاضرنا ونحافظ على موارد وطننا الجغرافية.',
              icon: '🇩🇿'
            }
          ],
          demoControlLabel: 'استكشف معالم الدرس:',
          demoType: 'history_toggle'
        };

      case 'french':
      case 'english':
        return {
          whyLearn: 'تعلم اللغات الأجنبية يفتح لنا آفاقاً واسعة للتواصل مع العالم وقراءة الكتب والمشاركة في الحوارات العالمية!',
          realLifeTitle: '🌍 Real Life Scenario: Daily Communication & Dialogue',
          realLifeDescription: `This lesson "${renderArabicText(lesson.titleAr)}" gives you practical phrases and vocabulary to introduce yourself, ask directions, or describe objects easily.`,
          steps: [
            {
              title: 'Step 1: Understand Key Words (المفردات المفتاحية)',
              detail: 'Listen to the correct pronunciation and understand the context in everyday situations.',
              icon: '🗣️'
            },
            {
              title: 'Step 2: Practice Grammar Patterns (أنماط التركيب)',
              detail: 'Combine words into clear, natural full sentences.',
              icon: '🧩'
            },
            {
              title: 'Step 3: Real Dialogue (الحوار التفاعلي)',
              detail: 'Apply the lesson in interactive roleplay with friends or family.',
              icon: '💬'
            }
          ],
          demoControlLabel: 'Switch language interaction context:',
          demoType: 'language_toggle'
        };

      default:
        return {
          whyLearn: 'يقدم هذا الدرس مفاهيم تربوية وقيمية تثري زاد التلميذ المعرفي والأخلاقي في حياته اليومية.',
          realLifeTitle: '🌱 وضعية واقعية: التطبيق في الحياة اليومية',
          realLifeDescription: `يتناول درس "${renderArabicText(lesson.titleAr)}" أفكاراً عملية يمكن تطبيقها في السلوك اليومي والتواصل الإيجابي.`,
          steps: [
            {
              title: 'الخطوة 1: استيعاب المعنى',
              detail: 'فهم الدرس الأساسي والقيمة المستفادة منه.',
              icon: '📖'
            },
            {
              title: 'الخطوة 2: التطبيق العملي',
              detail: 'ممارسة المعنى في التعامل اليومي مع الأسرة والزملاء.',
              icon: '🤝'
            },
            {
              title: 'الخطوة 3: التثبيت والاستمرار',
              detail: 'الالتزام بالسلوك السليم والقواعد المكتسبة.',
              icon: '⭐'
            }
          ],
          demoControlLabel: 'تفاعل مع أفكار الدرس:',
          demoType: 'default_toggle'
        };
    }
  };

  const content = getSubjectRealWorldContent();
  const usesAuthoredRules = lesson.grade === '1AP' || lesson.grade === '2AP';
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
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Compact mode marker — no title/summary here: LessonViewer's Hero banner directly above this
          tab already shows both, repeating them in a second big gradient box just added scroll
          without new information (exactly the "fiche trop dense" complaint this pass addresses). */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>شرح وتبسيط الدرس والتطبيقات الواقعية</span>
        </span>
        <span className="bg-slate-900 text-slate-200 text-xs font-bold px-3 py-1 rounded-full border border-slate-800">
          المستوى المقرر: {lesson.grade}
        </span>
      </div>

      {/* REAL LESSON OBJECTIVE, DISCOVERY HOOK & GUIDED EXAMPLE (when authored for this specific lesson) */}
      {(lesson.objectiveAr || lesson.discoveryAr || lesson.guidedExampleAr) && (
        <div className="bg-indigo-50 border border-indigo-200/80 rounded-3xl p-5 shadow-xs space-y-4">
          {lesson.objectiveAr && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                {speak('objective', lesson.objectiveAr)}
                <Target className="w-4 h-4" />
                <span>هدف الدرس</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 font-sans leading-relaxed">{renderArabicText(lesson.objectiveAr)}</p>
            </div>
          )}
          {lesson.discoveryAr && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                {speak('discovery', lesson.discoveryAr)}
                <Sparkles className="w-4 h-4" />
                <span>هل تعلم؟ (اكتشف الدرس)</span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-950 font-sans leading-relaxed bg-white/70 p-3 rounded-xl border border-indigo-200/60">
                {renderArabicText(lesson.discoveryAr)}
              </p>
            </div>
          )}
          {lesson.guidedExampleAr && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                {speak('guided-problem', lesson.guidedExampleAr.problem)}
                <BookOpen className="w-4 h-4" />
                <span>مثال موجّه خطوة بخطوة</span>
              </div>
              <div className="bg-white rounded-xl border border-indigo-200/60 p-3 space-y-2 text-xs sm:text-sm font-sans">
                <p className="text-slate-800"><span className="font-bold text-indigo-700">❓ المسألة: </span>{renderArabicText(lesson.guidedExampleAr.problem)}</p>
                <p className="text-slate-600"><span className="font-bold text-amber-700">💡 تلميح: </span>{renderArabicText(lesson.guidedExampleAr.hint)}</p>
                <p className="text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 whitespace-pre-line"><span className="font-bold">✅ الحل: </span>{renderArabicText(lesson.guidedExampleAr.solution)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* WHY LEARN THIS CONCEPT (لماذا نتعلم هذا الدرس؟) */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-extrabold text-sm">
          <div className="w-8 h-8 rounded-xl bg-amber-400/30 text-amber-900 flex items-center justify-center text-lg">
            💡
          </div>
          <h3>لماذا ندرس هذا المفهوم وكيف يساعدنا في الحياة؟</h3>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 font-sans leading-relaxed pr-2 font-medium">
          {content.whyLearn}
        </p>
      </div>

      {/* INTERACTIVE MODE TOGGLE BUTTONS */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setInteractiveMode('real_world')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            interactiveMode === 'real_world'
              ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>الوضعية الواقعية الذكية</span>
        </button>

        <button
          onClick={() => setInteractiveMode('step_by_step')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            interactiveMode === 'step_by_step'
              ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>خطوات الفهم التفاعلي ({content.steps.length})</span>
        </button>

        <button
          onClick={() => setInteractiveMode('interactive_demo')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            interactiveMode === 'interactive_demo'
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>التجربة والتبسيط المباشر</span>
        </button>
      </div>

      {/* MODE 1: SMART REAL WORLD SCENARIO */}
      {interactiveMode === 'real_world' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span className="text-xl">🏪</span>
              <span>{content.realLifeTitle}</span>
            </h3>
            <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              تطبيق عملي واقعي
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {renderArabicText(content.realLifeDescription)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {content.steps.map((st, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  activeStepIndex === idx
                    ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{st.icon}</span>
                  <div className="flex items-center gap-1.5">
                    {usesAuthoredRules && speak(`rule-${idx}`, st.detail)}
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      مرحلة {idx + 1}
                    </span>
                  </div>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-600 font-sans leading-relaxed">{st.detail}</p>
              </div>
            ))}
          </div>

          {lesson.grade !== '1AP' && lesson.grade !== '2AP' && (
          <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl border border-emerald-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>الخلاصة الواقعية الذكية:</span>
            </div>
            <p className="text-xs font-sans leading-relaxed text-emerald-200">
              عندما نفهم الأسباب والتطبيقات بدلاً من الحفظ المجرد، يصبح التلميذ قادراً على حل المشكلات والوضعيات الإدماجية بكل سهولة وثقة في الامتحانات وفي الحياة اليومية!
            </p>
          </div>
          )}
        </div>
      )}

      {/* MODE 2: STEP BY STEP INTERACTIVE WALKTHROUGH */}
      {interactiveMode === 'step_by_step' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>خطوات الفهم والمرحلية التفاعلية</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              الخطوة {activeStepIndex + 1} من {content.steps.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((activeStepIndex + 1) / content.steps.length) * 100}%` }}
            />
          </div>

          {/* Active Step Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-5 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              {usesAuthoredRules && speak(`rule-step-${activeStepIndex}`, content.steps[activeStepIndex].detail)}
              <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                {activeStepIndex + 1}
              </span>
              <div>
                <h4 className="font-black text-sm text-emerald-950">
                  {content.steps[activeStepIndex].title}
                </h4>
                <p className="text-xs text-emerald-800 font-sans mt-0.5">
                  انتبه لهذه النقطة المحورية لضمان الفهم الشامل
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed font-medium">
              {content.steps[activeStepIndex].detail}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الخطوة السابقة</span>
            </button>

            <button
              disabled={activeStepIndex === content.steps.length - 1}
              onClick={() => setActiveStepIndex((prev) => Math.min(content.steps.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>الخطوة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: INTERACTIVE DEMO & VALUE SIMULATOR */}
      {interactiveMode === 'interactive_demo' && (
        <div className="space-y-5">
          {/* If the lesson has a full custom gameplay_simulation, embed ScienceLabSimulation directly */}
          {lesson.gameplay_simulation ? (
            <Suspense fallback={<LoadingFallback label="جاري تحميل المحاكاة..." />}>
              <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
            </Suspense>
          ) : (
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                      <span>مختبر التبسيط المباشر والتجربة الحية:</span>
                      <span className="text-amber-300">{lesson.titleAr}</span>
                    </h3>
                    <p className="text-[11px] text-slate-300">تفاعل مباشر واختبار القواعد والأرقام في الوقت الحقيقي</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                  تفاعلي 100%
                </span>
              </div>

              {/* 1. MATH SUBJECT SIMULATOR */}
              {lesson.subject === 'math' && (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-amber-400" />
                        <span>غيّر القيمة التفاعلية لاختبار القاعدة الرياضية:</span>
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                        المدخل الحالي: {demoValue}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={demoValue}
                        onChange={(e) => setDemoValue(Number(e.target.value))}
                        className="w-full accent-amber-400 h-2.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                        <span>1</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>

                    {/* Step-by-step Math Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-300 block font-bold">1. المعطى الأول (القيمة):</span>
                        <p className="text-sm font-bold text-amber-300 font-mono">{demoValue}</p>
                      </div>
                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-300 block font-bold">2. تطبيق قاعدة الدرس:</span>
                        <p className="text-xs font-bold text-sky-300 font-mono">
                          {lesson.keyFormulas?.[0]?.formulaAr || `حساب متناسب × 10`}
                        </p>
                      </div>
                      <div className="bg-emerald-950/80 p-3.5 rounded-xl border border-emerald-800/90 space-y-1">
                        <span className="text-[10px] text-emerald-300 block font-bold">3. النتيجة المحسوبة فوراً:</span>
                        <p className="text-base font-black text-emerald-400 font-mono">
                          {demoValue * (lesson.keyFormulas ? 100 : 10)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Interactive Examples Explorer */}
                  {lesson.examplesAr && lesson.examplesAr.length > 0 && (
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>أمثلة وتطبيقات الدرس الحية ({lesson.examplesAr.length}):</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.examplesAr.map((ex, exIdx) => (
                          <button
                            key={exIdx}
                            onClick={() => setSelectedExampleIndex(exIdx)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                              selectedExampleIndex === exIdx
                                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span>مثال {exIdx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {lesson.examplesAr[selectedExampleIndex] && (
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                          <div className="text-xs text-slate-200 font-bold whitespace-pre-line">
                            <span className="text-amber-400">❓ المسألة / التطبيق: </span>
                            {formatEducationalText(lesson.examplesAr[selectedExampleIndex].problem)}
                          </div>
                          <MathWorkedExample
                            solution={lesson.examplesAr[selectedExampleIndex].solution}
                            operationsAr={lesson.examplesAr[selectedExampleIndex].operationsAr}
                            tone="dark"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 2. ARABIC SUBJECT SIMULATOR */}
              {lesson.subject === 'arabic' && (
                <div className="space-y-5">
                  {lesson.irabTableAr && lesson.irabTableAr.length > 0 && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-3">
                      <h4 className="text-xs font-extrabold text-amber-800">
                        {lesson.grade === '3AP' ? 'دَوْرُ كُلِّ كَلِمَةٍ فِي الجُمْلَةِ' : 'جَدْوَلُ الإِعْرَابِ'}
                      </h4>
                      <IrabTable
                        rows={lesson.irabTableAr}
                        analysisLabelAr={irabAnalysisHeaderForGrade(lesson.grade)}
                      />
                    </div>
                  )}
                  <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-amber-300 block">
                        اختر الضمير وزمن الفعل لتجربة الضبط التفاعلي والإعراب:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['أَنَا', 'نَحْنُ', 'أَنْتَ', 'أَنْتِ', 'هُوَ', 'هِيَ', 'هُمْ'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setGrammarPronoun(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              grammarPronoun === p
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        {[
                          { id: 'past', label: 'المَاضِي' },
                          { id: 'present', label: 'المُضَارِع' },
                          { id: 'imperative', label: 'الأَمْر' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setGrammarTense(t.id as any)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              grammarTense === t.id
                                ? 'bg-indigo-500 text-white font-black'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">الجملة والتطبيق بعد التصريف والضبط:</span>
                        <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                          مضبوط بالشكل
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-black text-amber-300 text-center py-2 bg-slate-950 rounded-lg border border-slate-800 font-sans">
                        {grammarPronoun} {grammarTense === 'past' ? 'كَتَبَ الدَّرْسَ بِبَرَاعَةٍ' : grammarTense === 'present' ? 'يَكْتُبُ الدَّرْسَ بِبَرَاعَةٍ' : 'اكْتُبْ الدَّرْسَ بِنَشَاطٍ'}
                      </p>
                      <div className="text-xs text-slate-300 bg-indigo-950/50 p-3 rounded-lg border border-indigo-900/60 leading-relaxed font-sans">
                        <span className="font-extrabold text-indigo-300 block mb-1">🔍 الإعراب المباشر الميسّر:</span>
                        تطبيق القاعدة الإعرابية المباشرة لدرس ({lesson.titleAr}): الكلمة الرئيسية مرفوعة وعلامة رفعتها الضمة الظاهرة على آخرها.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SCIENCE SUBJECT SIMULATOR (IF NO GAMEPLAY SIMULATION) */}
              {lesson.subject === 'science' && (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                    <label className="text-xs font-extrabold text-amber-300 block">
                      اختر الوضعية العلمية للملاحظة المباشرة:
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 1, label: '🧪 الوضعية العادية (التفاعل الأساسي)' },
                        { id: 2, label: '🔥 زيادة العامل المساعد (التسريع)' },
                        { id: 3, label: '❄️ انخفاض المؤثر (التوقف)' }
                      ].map((sc) => (
                        <button
                          key={sc.id}
                          onClick={() => setScienceCondition(sc.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            scienceCondition === sc.id
                              ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {sc.label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                        <Sparkles className="w-4 h-4" />
                        <span>نتيجة التجربة العلمية للحالة {scienceCondition}:</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg text-xs text-emerald-300 leading-relaxed font-sans border border-slate-800">
                        {scienceCondition === 1 && 'تأثير متوازن وسليم يؤدي لإضاءة المصباح واستمرار النشاط الحسي المباشر بشكل مستقر.'}
                        {scienceCondition === 2 && 'تفاعل سريع يرفع من شدة التيار/المادة ويمكّن التلميذ من استنتاج القوانين الفيزيائية الكبرى.'}
                        {scienceCondition === 3 && 'انقطاع التفاعل المباشر بسبب غياب الناقل السليم أو انخفاض درجة الحرارة المطلوب.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. HISTORY / GEOGRAPHY / FRENCH / ENGLISH / OTHER SIMULATOR */}
              {['history_geo', 'french', 'english', 'islamic'].includes(lesson.subject) && (
                <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300">محاكي التطبيقات الحية للمادة:</span>
                    <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                      تطبيقي
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['المفهوم الأول', 'المفهوم الثاني', 'تطبيق الشواهد'].map((stLabel, stIdx) => (
                      <button
                        key={stIdx}
                        onClick={() => setGeoEraIndex(stIdx)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          geoEraIndex === stIdx
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {stLabel}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
                    <span className="font-extrabold text-emerald-400 block">📌 النتيجة المباشرة والشرح:</span>
                    <p>
                      درس ({lesson.titleAr}): يوضح التطبيق العملي والمفاهيمي لكيفية ترسيخ أفكار هذه المرحلة في الذاكرة بأسلوب تفاعلي ميسر.
                    </p>
                  </div>
                </div>
              )}

              {/* Conclusion Note */}
              <div className="text-xs text-slate-300 font-sans leading-relaxed bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/60 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 block mb-0.5">🔍 خلاصة التجربة التفاعلية:</span>
                  تلاحظ كيف تتغير المعطيات حياً أمامك، مما يثبت القاعدة النظرية ويمنحك فهمًا راسخًا قبل خوض الاختبار التفاعلي!
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
