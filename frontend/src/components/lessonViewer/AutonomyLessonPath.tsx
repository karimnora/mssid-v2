import React, { useEffect, useRef, useState } from 'react';
import type { CourseLesson, LearningPath, LearningPathStep, LearningPathVisual } from '../../types';
import { BoundPracticeCard, type PracticeBindings } from './practiceBindings';
import { MathWorkedExample } from './MathWorkedExample';
import { IrabTable } from './IrabTable';
import { TapSpeakButton } from './TapSpeakButton';
import { isolateMathRuns, latinTextDir, stripArabicGlosses } from '../../utils/textFormatter';
import didouGuide from '../../assets/v2-reused/didou-point.webp';

interface Props {
  lesson: CourseLesson;
  path: LearningPath;
  practice: PracticeBindings;
  renderArabicText: (text: string | undefined | null) => string;
  onGoToPractice: () => void;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  onStopSpeech?: () => void;
}

// One short child verb per stage, so the five dots read as a route rather than a bare counter.
const STEP_KIND_LABELS: Record<LearningPathStep['kind'], { icon: string; labelAr: string }> = {
  observe: { icon: '👀', labelAr: 'أنظر' },
  model: { icon: '🧩', labelAr: 'أفهم الطريقة' },
  guided: { icon: '🤝', labelAr: 'أكمل مع ديدو' },
  independent: { icon: '💪', labelAr: 'أحاول وحدي' },
  transfer: { icon: '🚀', labelAr: 'وضعية جديدة' },
};

const groupThousands = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');

/** Tap a digit to see what it is worth in its column: the child discovers the rule before reading it. */
function PlaceValueTable({ visual, renderText }: { visual: Extract<LearningPathVisual, { type: 'place_value' }>; renderText: Props['renderArabicText'] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const select = (index: number) => {
    setSelected(index);
    setSeen(prev => new Set(prev).add(index));
  };
  const digit = selected === null ? null : visual.digits[selected];
  const value = selected === null || digit === null ? null : digit * 10 ** (visual.digits.length - 1 - selected);
  return (
    <div className="space-y-3" data-place-value-explorer>
      <table className="w-full table-fixed border-separate border-spacing-1 text-center" dir="ltr">
        <caption className="caption-bottom pt-3 text-sm text-[var(--app-text)]" dir="rtl">{renderText(visual.captionAr)}</caption>
        <thead><tr>{visual.columnsAr.map(column => <th key={column} scope="col" dir="rtl" className="p-1 text-xs sm:text-sm font-bold text-[var(--app-text-muted)]">{renderText(column)}</th>)}</tr></thead>
        <tbody><tr>{visual.digits.map((cellDigit, i) => (
          <td key={i} className="p-0">
            <button
              type="button"
              aria-pressed={selected === i}
              aria-label={`${cellDigit} — ${visual.columnsAr[i]}`}
              onClick={() => select(i)}
              className={`w-full min-h-[60px] rounded-xl text-2xl font-black cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                selected === i
                  ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500'
                  : seen.has(i)
                    ? 'bg-emerald-200 text-emerald-950'
                    : 'bg-emerald-100 text-emerald-950 shadow-[0_3px_0_#6ee7b7]'
              }`}
            >
              {cellDigit}
            </button>
          </td>
        ))}</tr></tbody>
      </table>
      <p role="status" dir="rtl" data-place-value-result className="min-h-[60px] rounded-2xl bg-amber-100 p-3 text-base font-bold leading-relaxed text-amber-950">
        {selected === null || digit === null || value === null
          ? '👆 اضغط على رقم في الجدول.'
          : digit === 0
            ? <>الرقم 0 في عمود «{renderText(visual.columnsAr[selected])}»: لا يضيف شيئاً، لكنه يحفظ المكان.</>
            : <>الرقم {digit} في عمود «{renderText(visual.columnsAr[selected])}»: قيمته <span dir="ltr" className="font-black">{groupThousands(value)}</span></>}
      </p>
      {seen.size === visual.digits.length && (
        <p className="text-sm font-bold text-[var(--app-text)]">🌟 اكتشفت قيمة كل الأرقام. الرقم نفسه يساوي أكثر كلما اتجه مكانه نحو اليسار.</p>
      )}
    </div>
  );
}

/** Tap a word to see whether it is a noun, a verb or a particle, and the clue that tells. */
function SentenceParts({ visual, renderText }: { visual: Extract<LearningPathVisual, { type: 'sentence_parts' }>; renderText: Props['renderArabicText'] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const word = selected === null ? null : visual.words[selected];
  return (
    <figure className="space-y-3" data-sentence-parts>
      <div className="flex flex-wrap gap-2" dir={latinTextDir(visual.words.map(item => item.textAr).join(' ')) ?? 'rtl'}>
        {visual.words.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={selected === index}
            onClick={() => { setSelected(index); setSeen(prev => new Set(prev).add(index)); }}
            className={`min-h-[60px] rounded-2xl px-4 text-xl font-black cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              selected === index
                ? 'bg-amber-200 text-amber-950 ring-2 ring-amber-500'
                : seen.has(index)
                  ? 'bg-emerald-200 text-emerald-950'
                  : 'bg-emerald-100 text-emerald-950 shadow-[0_3px_0_#6ee7b7]'
            }`}
          >
            {renderText(item.textAr)}
          </button>
        ))}
      </div>
      <p role="status" data-sentence-part-result dir={word ? latinTextDir(`${word.textAr} ${word.kindAr} ${word.clueAr}`) : undefined} className="min-h-[60px] rounded-2xl bg-amber-100 p-3 text-base font-bold leading-relaxed text-amber-950">
        {word
          ? <>«{renderText(word.textAr)}»: <span className="font-black">{renderText(word.kindAr)}</span>. {renderText(word.clueAr)}</>
          : '👆 اضغط على كلمة من الجملة.'}
      </p>
      {seen.size === visual.words.length && <figcaption dir={latinTextDir(visual.captionAr)} className="text-sm font-bold text-[var(--app-text)]">🌟 {renderText(visual.captionAr)}</figcaption>}
    </figure>
  );
}

function ConceptVisual({ visual, renderText }: { visual: LearningPathVisual; renderText: Props['renderArabicText'] }) {
  if (visual.type === 'place_value') return <PlaceValueTable visual={visual} renderText={renderText} />;
  if (visual.type === 'sentence_parts') return <SentenceParts visual={visual} renderText={renderText} />;
  if (visual.type === 'fraction_bar') {
    return (
      <figure className="space-y-3" data-fraction-bar>
        <div className="flex gap-1" dir="ltr" aria-hidden="true">
          {Array.from({ length: visual.parts }, (_, part) => (
            <div key={part} className={`h-14 flex-1 rounded-lg border-2 ${part < visual.shaded ? 'border-emerald-700 bg-emerald-500' : 'border-emerald-300 bg-emerald-50'}`} />
          ))}
        </div>
        <figcaption className="text-sm text-[var(--app-text)]">{renderText(visual.captionAr)}</figcaption>
      </figure>
    );
  }
  const emoji = visual.itemEmoji ?? '✏️';
  const itemLabel = visual.itemLabelAr ?? 'أقلام';
  const groupLabel = visual.groupLabelAr ?? 'حصة';
  return (
    <figure className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: visual.groups }, (_, group) => (
          <div key={group} className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-center text-emerald-950">
            <p className="font-bold text-sm">{groupLabel} {group + 1}</p>
            <p className="my-2 text-xl" aria-hidden="true">{Array.from({ length: visual.perGroup }, () => emoji).join(' ')}</p>
            <p className="text-sm">{visual.perGroup} {itemLabel}</p>
          </div>
        ))}
      </div>
      {visual.remainder !== undefined && (
        <p className="rounded-xl bg-amber-100 p-3 font-bold text-amber-950">الباقي: {visual.remainder} <span aria-hidden="true">{emoji}</span></p>
      )}
      <figcaption className="text-sm text-[var(--app-text)]">{renderText(visual.captionAr)}</figcaption>
    </figure>
  );
}

/** Reading a model never awards XP. Exercise state is shared with the ordinary practice panel. */
export function AutonomyLessonPath({ lesson, path, practice, renderArabicText, onGoToPractice, speakingKey = null, onSpeak, onStopSpeech }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(0);
  useEffect(() => {
    if (previousStepRef.current !== stepIndex) headingRef.current?.focus();
    previousStepRef.current = stepIndex;
  }, [stepIndex]);

  const step = path.steps[stepIndex];
  if (!step) return null;
  const isExerciseStep = 'exerciseId' in step;
  const exercise = isExerciseStep
    ? [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []].find(ex => ex.id === step.exerciseId)
    : undefined;
  const canContinue = !isExerciseStep || !!(exercise && practice.practiceCorrect[exercise.id]);
  const isLast = stepIndex === path.steps.length - 1;
  const displayText = (text: string) => isolateMathRuns(renderArabicText(text));
  // A French or English voice reads its own language only: Arabic glosses stay on screen but are not spoken.
  const spoken = (text: string) => (path.lang ? stripArabicGlosses(text) : text);
  const stepSpeech = spoken(renderArabicText([
    step.titleAr, step.textAr,
    !isExerciseStep ? step.visual?.captionAr : undefined,
    !isExerciseStep ? step.workedExample?.solution : undefined,
  ].filter(Boolean).join('. ')));
  const moveToStep = (index: number) => {
    onStopSpeech?.();
    setStepIndex(index);
  };

  return (
    <section className="space-y-5" dir="rtl" data-autonomy-path={lesson.id} aria-label={renderArabicText(path.titleAr)}>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <img src={didouGuide} alt="" width={56} height={80} loading="lazy" decoding="async" className="w-14 h-20 shrink-0 object-contain" />
          <h2 dir={latinTextDir(path.titleAr)} className="min-w-0 flex-1 text-lg font-black text-[var(--app-text)]">{renderArabicText(path.titleAr)}</h2>
        </div>
        <div className="flex items-start gap-2 rounded-2xl bg-[var(--app-card-subtle)] p-4 text-sm text-[var(--app-text)]">
          {onSpeak && <TapSpeakButton snippetKey="path-prerequisite" text={spoken(renderArabicText(path.prerequisiteAr))} speakingKey={speakingKey} onSpeak={onSpeak} />}
          <p className="min-w-0 flex-1 leading-relaxed"><strong>أتذكر أولاً: </strong><bdi>{displayText(path.prerequisiteAr)}</bdi></p>
        </div>
        <div className="space-y-2" data-path-progress>
          <ol className="flex items-center gap-1.5" aria-hidden="true">
            {path.steps.map((pathStep, index) => (
              <li
                key={index}
                data-path-dot={index < stepIndex ? 'done' : index === stepIndex ? 'current' : 'todo'}
                className={`flex h-9 flex-1 items-center justify-center rounded-full text-base ${
                  index < stepIndex
                    ? 'bg-emerald-700 text-white'
                    : index === stepIndex
                      ? 'bg-amber-200 ring-2 ring-amber-500'
                      : 'bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] opacity-70'
                }`}
              >
                {index < stepIndex ? '✓' : STEP_KIND_LABELS[pathStep.kind].icon}
              </li>
            ))}
          </ol>
          <p className="text-sm font-bold text-[var(--app-text-muted)]" aria-live="polite">
            الخطوة {stepIndex + 1} من {path.steps.length}: {STEP_KIND_LABELS[step.kind].labelAr}
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-[var(--app-card-border)] bg-[var(--app-card-bg)] p-4 sm:p-6" data-learning-step={step.kind}>
        <div className="flex items-start gap-2">
          {onSpeak && <TapSpeakButton snippetKey={`path-step-${stepIndex}`} text={stepSpeech} speakingKey={speakingKey} onSpeak={onSpeak} />}
          <div className="min-w-0 flex-1 space-y-2">
            <h3 ref={headingRef} tabIndex={-1} dir={latinTextDir(step.titleAr)} className="text-lg font-extrabold text-[var(--app-text)] focus-visible:outline-2 focus-visible:outline-emerald-600">{renderArabicText(step.titleAr)}</h3>
            <p dir={latinTextDir(step.textAr)} className="text-base leading-relaxed text-[var(--app-text)] whitespace-pre-line">{displayText(step.textAr)}</p>
          </div>
        </div>

        {!isExerciseStep && step.visual && <ConceptVisual visual={step.visual} renderText={text => isolateMathRuns(renderArabicText(text))} />}
        {!isExerciseStep && step.workedExample && (
          <MathWorkedExample solution={step.workedExample.solution} operationsAr={step.workedExample.operationsAr} renderArabicText={renderArabicText} tone="light" />
        )}
        {!isExerciseStep && step.irabTable && (
          <IrabTable
            rows={step.irabTable.map(row => ({ wordAr: renderArabicText(row.wordAr), analysisAr: renderArabicText(row.analysisAr) }))}
            // 3AP names a word's role; case analysis (iʿrāb) starts in 4AP.
            analysisLabelAr={step.irabTableLabels?.[1] ?? (lesson.grade === '3AP' ? renderArabicText('دَوْرُهَا فِي الجُمْلَةِ') : undefined)}
            wordLabelAr={step.irabTableLabels?.[0]}
            dir={path.lang ? 'ltr' : 'rtl'}
          />
        )}
        {isExerciseStep && exercise && (
          <BoundPracticeCard
            key={exercise.id} ex={exercise} practice={practice} renderArabicText={renderArabicText} retryFirst
            leadAudio={onSpeak ? <TapSpeakButton snippetKey={`path-exercise-${exercise.id}`} text={spoken(renderArabicText(exercise.problemAr))} speakingKey={speakingKey} onSpeak={onSpeak} /> : undefined}
          />
        )}
        {isExerciseStep && !exercise && <p role="alert">تعذّر عرض التمرين. يمكنك فتح قسم «أتدرب» من خطوات الدرس.</p>}
      </div>

      {isExerciseStep && !canContinue && (
        <p className="text-sm text-[var(--app-text-muted)]">أجيب ثم أتحقق. إذا أخطأت، يساعدني ديدو وأحاول مرة أخرى. يمكنني الرجوع إلى المثال.</p>
      )}
      {isLast && canContinue && (
        <div role="status" data-path-complete className="flex items-center gap-3 rounded-3xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950">
          <span className="text-3xl" aria-hidden="true">🌟</span>
          <p className="text-base font-extrabold leading-relaxed">أحسنت! أنهيت هذه المهمة وحدك. أواصل التدريب على بقية أفكار الدرس.</p>
        </div>
      )}
      <div className="flex gap-3">
        <button type="button" disabled={stepIndex === 0} onClick={() => moveToStep(stepIndex - 1)} className="min-h-[60px] flex-1 rounded-2xl border border-[var(--app-card-border)] px-4 font-bold text-[var(--app-text)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-emerald-600">أرجع</button>
        <button type="button" disabled={!canContinue} onClick={() => { onStopSpeech?.(); if (isLast) onGoToPractice(); else setStepIndex(stepIndex + 1); }} className="min-h-[60px] flex-1 rounded-2xl bg-emerald-700 px-4 font-bold text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">{isLast ? 'أنتقل إلى التدريبات' : 'أتابع'}</button>
      </div>
    </section>
  );
}
