import React from 'react';
import { MathWorkedExample } from './MathWorkedExample';
import type { FractionJourney } from './useFractionJourney';
export {
  FRACTION_LINES,
  type FractionObservation,
  type FractionObservations,
} from './fractionJourneyContent';

function FractionBars({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}) {
  return (
    <div
      className="fraction-bars"
      dir="ltr"
      role="img"
      aria-label={'كسر بسطه ' + numerator + ' ومقامه ' + denominator}
    >
      {Array.from(
        { length: Math.max(1, Math.ceil(numerator / denominator)) },
        (_, whole) => (
          <div
            className="fraction-whole"
            key={whole}
            style={{ gridTemplateColumns: 'repeat(' + denominator + ', 1fr)' }}
          >
            {Array.from({ length: denominator }, (_, part) => (
              <span
                key={part}
                className={
                  whole * denominator + part < numerator ? 'filled' : ''
                }
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
export function FractionWorkshop({ journey: j }: { journey: FractionJourney }) {
  const { answer: a, stage, numerator: n, denominator: d } = j;
  const quotient = Math.floor(n / d),
    rest = n % d;
  const remaining = n - a.whole * d - a.rest;
  return (
    <section
      data-fraction-workshop={stage.lab ? 'lab' : 'learn'}
      data-fraction-step={j.step}
      className="fraction-workshop"
    >
      <p className="fraction-current-mission">
        {j.step < 3 ? 'أكتشف وأجرّب' : 'مختبر الحديقة'} · {j.step + 1} / 7
      </p>
      <h2>
        {stage.key === 'decompose'
          ? 'أجمع الأجزاء في وحدات'
          : stage.key === 'bound'
          ? 'أجد مكان الكسر'
          : stage.key === 'equivalent'
          ? 'نفس الكمية، أجزاء أكثر'
          : 'أشرح فكرتي'}
      </h2>
      {stage.key === 'decompose' && (
        <>
          <h3 dir="ltr">
            {n} / {d}
          </h3>
          <p>
            كل وحدة فيها {d} أجزاء متساوية. المس الأجزاء؛ عندما تكتمل الوحدة
            نجمعها.
          </p>
          <div
            className="fraction-loose-pool"
            role="img"
            aria-label={'أجزاء متاحة لم أجمعها: ' + remaining}
            data-fraction-pool
          >
            {Array.from({ length: n }, (_, i) => (
              <span
                key={i}
                data-loose-part={i < remaining ? 'available' : 'used'}
                aria-hidden="true"
              />
            ))}
          </div>
          <p aria-live="polite">أجزاء لم أجمعها بعد: {remaining}</p>
          <div
            className="fraction-parts-tray"
            dir="ltr"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
            }}
            aria-label="أكوّن وحدة من الأجزاء"
          >
            {Array.from({ length: d }, (_, i) => (
              <button
                type="button"
                data-fraction-part={i}
                key={i}
                aria-label={'جزء ' + (i + 1)}
                aria-pressed={a.parts.includes(i)}
                disabled={remaining === 0 && !a.parts.includes(i)}
                onClick={() => j.togglePart(i)}
              >
                {a.parts.includes(i) ? '✓' : '+'}
                <small>1/{d}</small>
              </button>
            ))}
          </div>
          <div className="fraction-steppers">
            <div>
              <p>الوحدات</p>
              <div className="fraction-stepper">
                <button
                  type="button"
                  aria-label="أنقص وحدة"
                  disabled={a.whole === 0}
                  onClick={() => j.changeWhole(-1)}
                >
                  −
                </button>
                <output data-fraction-whole>{a.whole}</output>
                <button
                  type="button"
                  aria-label="أضيف وحدة"
                  disabled={remaining < d}
                  onClick={() => j.changeWhole(1)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <p>الأجزاء</p>
              <div className="fraction-stepper">
                <button
                  type="button"
                  aria-label="أنقص جزءًا"
                  disabled={a.whole === 0 && a.rest === 0}
                  onClick={() => j.takePart(-1)}
                >
                  −
                </button>
                <output data-fraction-rest>{a.rest}</output>
                <button
                  type="button"
                  aria-label="أضيف جزءًا"
                  disabled={remaining === 0}
                  onClick={() => j.takePart(1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <output
            className="fraction-construction"
            dir="ltr"
            aria-live="polite"
          >
            {a.whole} + {a.rest}/{d}
          </output>
          <div className="fraction-unit-tray" aria-label="وحداتي الكاملة">
            {Array.from({ length: a.whole }, (_, i) => (
              <button
                type="button"
                data-return-whole
                key={i}
                aria-label="أفكّك وحدة كاملة"
                onClick={() => j.changeWhole(-1)}
              >
                <strong>واحد صحيح</strong>
                <FractionBars numerator={d} denominator={d} />
              </button>
            ))}
          </div>
        </>
      )}
      {stage.key === 'bound' && (
        <>
          <h3 dir="ltr">
            {n}/{d}
          </h3>
          <FractionBars numerator={n} denominator={d} />
          <p>المس المجال الذي يحتوي الكسر.</p>
          <div className="fraction-numberline" dir="ltr">
            {[0, 1, 2, 3, 4].map((v) => (
              <button
                type="button"
                data-fraction-lower={v}
                key={v}
                aria-pressed={a.lower === v}
                onClick={() => j.update({ lower: v })}
              >
                {v} — {v + 1}
              </button>
            ))}
          </div>
          {a.lower !== null && (
            <output dir="ltr">
              {a.lower} &lt; {n}/{d} &lt; {a.lower + 1}
            </output>
          )}
        </>
      )}
      {stage.key === 'equivalent' && (
        <>
          <p>
            أقسّم كل جزء لأحصل على مقام {j.baseDenominator * j.targetFactor}.
          </p>
          <div className="fraction-equivalence">
            <div>
              <h3 dir="ltr">
                {j.baseNumerator}/{j.baseDenominator}
              </h3>
              <FractionBars
                numerator={j.baseNumerator}
                denominator={j.baseDenominator}
              />
            </div>
            <span aria-hidden="true">=</span>
            <div>
              <h3 dir="ltr">
                {j.baseNumerator * a.factor}/{j.baseDenominator * a.factor}
              </h3>
              <FractionBars
                numerator={j.baseNumerator * a.factor}
                denominator={j.baseDenominator * a.factor}
              />
            </div>
          </div>
          <div className="pilot-row">
            {[1, 2, 5].map((v) => (
              <button
                type="button"
                data-fraction-factor={v}
                key={v}
                aria-pressed={a.factor === v}
                onClick={() => j.update({ factor: v })}
              >
                × {v}
              </button>
            ))}
          </div>
        </>
      )}
      {stage.key === 'explain' && (
        <>
          <p>لماذا يبقى الكسر المكافئ مساويًا للكسر الأول؟</p>
          <div className="fraction-equivalence"><div><h3 dir="ltr">{j.baseNumerator}/{j.baseDenominator}</h3><FractionBars numerator={j.baseNumerator} denominator={j.baseDenominator}/></div><span aria-hidden="true">=</span><div><h3 dir="ltr">{j.baseNumerator * j.targetFactor}/{j.baseDenominator * j.targetFactor}</h3><FractionBars numerator={j.baseNumerator * j.targetFactor} denominator={j.baseDenominator * j.targetFactor}/></div></div>
          {[
            'قسّمنا الأجزاء بالتساوي، وضربنا البسط والمقام في العدد نفسه.',
            'غيّرنا المقام وحده.',
          ].map((text, i) => (
            <button
              type="button"
              data-fraction-explain={i}
              key={text}
              onClick={() => j.explain(i === 0)}
            >
              {text}
            </button>
          ))}
        </>
      )}
      {stage.key !== 'explain' && (
        <button type="button" data-fraction-check onClick={j.check}>
          أتحقّق من فكرتي
        </button>
      )}
      {j.helped && (
        <p className="fraction-feedback">
          {stage.key === 'decompose'
            ? 'اجمع كل ' + d + ' أجزاء في واحد صحيح.'
            : stage.key === 'bound'
            ? 'عدّ الوحدات الكاملة، ثم حدّد العدد الذي يليها.'
            : 'نضرب البسط والمقام في العدد نفسه.'}
        </p>
      )}
      {j.feedback && (
        <div role="status" className="fraction-feedback">
          {j.feedback === 'success'
            ? 'أحسنت! يمكنك متابعة الرحلة.'
            : 'جرّب مرة أخرى. ديدو هنا ليساعدك.'}
          {j.feedback === 'success' && stage.key !== 'explain' && (
            <MathWorkedExample
              tone="light"
              operationsAr={
                stage.key === 'equivalent'
                  ? j.baseNumerator +
                    ' × ' +
                    a.factor +
                    ' = ' +
                    j.baseNumerator * a.factor +
                    '\n' +
                    j.baseDenominator +
                    ' × ' +
                    a.factor +
                    ' = ' +
                    j.baseDenominator * a.factor
                  : n + ' = ' + d + ' × ' + quotient + ' + ' + rest
              }
              solution={
                stage.key === 'equivalent'
                  ? j.baseNumerator +
                    '/' +
                    j.baseDenominator +
                    ' = ' +
                    j.baseNumerator * a.factor +
                    '/' +
                    j.baseDenominator * a.factor
                  : stage.key === 'decompose'
                  ? n + '/' + d + ' = ' + quotient + ' + ' + rest + '/' + d
                  : quotient + ' < ' + n + '/' + d + ' < ' + (quotient + 1)
              }
            />
          )}
        </div>
      )}
      {j.finished && <button type="button" data-new-fraction-challenge className="hit-target rounded-2xl border-2 border-[#207958] px-4 font-bold" onClick={j.newChallenge}>أجرّب كسورًا أخرى</button>}
      <p className="fraction-unscored">
        تدريب للفهم. نتيجة الدرس تعتمد على التمارين والاختبار.
      </p>
    </section>
  );
}
