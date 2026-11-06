import React, { useState } from "react";
import { MathWorkedExample } from "./MathWorkedExample";
export type FractionObservation = {
  completed: boolean;
  helped: boolean;
  attempts: number;
};
export type FractionObservations = Partial<
  Record<"decompose" | "bound" | "equivalent" | "explain", FractionObservation>
>;
type Props = {
  transfer?: boolean;
  onObserve: (
    key: keyof FractionObservations,
    result: FractionObservation
  ) => void;
  onSpeak: (key: string, text: string) => void;
};
export const FRACTION_LINES = {
  decompose: "كوّن أعدادًا صحيحة، ثم عدّ الأجزاء الباقية.",
  bound: "ضع الكسر بين عددين صحيحين متتاليين.",
  equivalent: "قسّم كل جزء بالتساوي. تتغيّر الأعداد وتبقى المساحة نفسها.",
  retry: "انظر إلى الرسم وجرّب مرة أخرى. يمكنك طلب تلميح.",
  success: "أحسنت! الرسم والعملية يعبّران عن الكمية نفسها.",
  lab: "في مختبر الحديقة، أطبّق ما تعلّمته على كسور جديدة.",
} as const;
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
      aria-label={
        numerator + " أجزاء من أجزاء الواحد المقسّم إلى " + denominator
      }
    >
      {Array.from(
        { length: Math.max(1, Math.ceil(numerator / denominator)) },
        (_, whole) => (
          <div
            className="fraction-whole"
            key={whole}
            style={{ gridTemplateColumns: "repeat(" + denominator + ", 1fr)" }}
          >
            {Array.from({ length: denominator }, (_, part) => (
              <span
                key={part}
                className={
                  whole * denominator + part < numerator ? "filled" : ""
                }
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
export function FractionWorkshop({
  transfer = false,
  onObserve,
  onSpeak,
}: Props) {
  const [explainAttempts, setExplainAttempts] = useState(0);
  const [explain, setExplain] = useState<boolean | null>(null);
  const [mission, setMission] = useState<0 | 1 | 2>(0);
  const [whole, setWhole] = useState(0),
    [remainder, setRemainder] = useState(0),
    [lower, setLower] = useState<number | null>(null),
    [factor, setFactor] = useState(1);
  const [results, setResults] = useState<FractionObservations>({});
  const [hinted, setHinted] = useState<
    Partial<Record<keyof FractionObservations, boolean>>
  >({});
  const [feedback, setFeedback] = useState<"success" | "retry" | null>(null);
  const numerator = transfer ? 7 : 17,
    denominator = transfer ? 3 : 5;
  const keys = ["decompose", "bound", "equivalent"] as const;
  const key = keys[mission];
  const helped = !!hinted[key];
  const quotient = Math.floor(numerator / denominator),
    rest = numerator % denominator;
  const baseNumerator = transfer ? 2 : 1,
    baseDenominator = transfer ? 3 : 2,
    targetFactor = transfer ? 2 : 5;
  const hint =
    mission === 0
      ? "اجمع كل " + denominator + " أجزاء في واحد صحيح."
      : mission === 1
      ? "عدّ الوحدات الكاملة في الرسم، ثم حدّد العدد الذي يليها."
      : "اضرب البسط والمقام في العدد نفسه.";
  const check = () => {
    const correct =
      mission === 0
        ? whole === quotient && remainder === rest
        : mission === 1
        ? lower === quotient
        : factor === targetFactor;
    const result = {
      completed: correct || !!results[key]?.completed,
      helped:
        helped ||
        !!results[key]?.helped ||
        (!!results[key]?.attempts && !results[key]?.completed),
      attempts: (results[key]?.attempts ?? 0) + 1,
    };
    setResults((prev) => ({ ...prev, [key]: result }));
    onObserve(key, result);
    setFeedback(correct ? "success" : "retry");
    onSpeak(
      "fraction-feedback",
      correct ? FRACTION_LINES.success : FRACTION_LINES.retry
    );
  };
  const select = (index: 0 | 1 | 2) => {
    setMission(index);
    setFeedback(null);
  };
  return (
    <section
      data-fraction-workshop={transfer ? "lab" : "learn"}
      className="fraction-workshop"
    >
      <h2>{transfer ? "مختبر حديقة الكسور" : "أبني الكسر وأفهمه"}</h2>
      <p>
        {transfer
          ? FRACTION_LINES.lab
          : "أجرّب ثلاث أفكار، ثم أطبّقها في المختبر."}
      </p>
      <div className="pilot-row" role="group" aria-label="مهمات الكسور">
        {["أفكّك", "أحصر", "أكافئ"].map((label, index) => (
          <button
            type="button"
            key={label}
            data-fraction-mission={index}
            aria-pressed={mission === index}
            onClick={() => select(index as 0 | 1 | 2)}
          >
            {results[keys[index]]?.completed ? "✓ " : ""}
            {label}
          </button>
        ))}
      </div>
      <p>{FRACTION_LINES[key]}</p>
      <button
        type="button"
        onClick={() => onSpeak("fraction-instruction", FRACTION_LINES[key])}
      >
        اسمع التعليمات
      </button>
      {mission !== 2 ? (
        <>
          <h3 dir="ltr">
            {numerator} / {denominator}
          </h3>
          <FractionBars numerator={numerator} denominator={denominator} />
          {mission === 0 ? (
            <>
              <p>كم واحدًا صحيحًا؟ وكم جزءًا يبقى؟</p>
              <div className="fraction-answer" dir="ltr">
                <label>
                  الأعداد الصحيحة{" "}
                  <select
                    data-fraction-whole
                    aria-label="عدد الوحدات الكاملة"
                    value={whole}
                    onChange={(e) => {
                      setWhole(Number(e.target.value));
                      setFeedback(null);
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <span>+</span>
                <label>
                  الأجزاء الباقية{" "}
                  <select
                    data-fraction-rest
                    aria-label="عدد الأجزاء الباقية"
                    value={remainder}
                    onChange={(e) => {
                      setRemainder(Number(e.target.value));
                      setFeedback(null);
                    }}
                  >
                    {Array.from({ length: denominator }, (_, n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>{" "}
                  / {denominator}
                </label>
              </div>
              <output dir="ltr">
                {whole} + {remainder}/{denominator}
              </output>
              <p>الكسر الذي بنيته:</p>
              <FractionBars
                numerator={whole * denominator + remainder}
                denominator={denominator}
              />
            </>
          ) : (
            <>
              <p>المس بداية المجال الذي يحتوي الكسر.</p>
              <div className="fraction-numberline" dir="ltr">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    type="button"
                    key={n}
                    data-fraction-lower={n}
                    aria-pressed={lower === n}
                    onClick={() => {
                      setLower(n);
                      setFeedback(null);
                    }}
                  >
                    {n} — {n + 1}
                  </button>
                ))}
              </div>
              {lower !== null && (
                <output dir="ltr">
                  {lower} &lt; {numerator}/{denominator} &lt; {lower + 1}
                </output>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p>أقسّم كل جزء لأحصل على مقام {baseDenominator * targetFactor}.</p>
          <div className="fraction-equivalence">
            <div>
              <h3 dir="ltr">
                {baseNumerator}/{baseDenominator}
              </h3>
              <FractionBars
                numerator={baseNumerator}
                denominator={baseDenominator}
              />
            </div>
            <span aria-hidden="true">=</span>
            <div>
              <h3 dir="ltr">
                {baseNumerator * factor}/{baseDenominator * factor}
              </h3>
              <FractionBars
                numerator={baseNumerator * factor}
                denominator={baseDenominator * factor}
              />
            </div>
          </div>
          <p>إلى كم جزءًا أقسّم كل جزء؟</p>
          <div className="pilot-row">
            {[1, 2, 5].map((n) => (
              <button
                type="button"
                key={n}
                data-fraction-factor={n}
                aria-pressed={factor === n}
                onClick={() => {
                  setFactor(n);
                  setFeedback(null);
                }}
              >
                × {n}
              </button>
            ))}
          </div>
        </>
      )}
      <div className="pilot-row">
        <button type="button" data-fraction-check onClick={check}>
          أتحقّق من فكرتي
        </button>
        <button
          type="button"
          data-fraction-hint
          onClick={() => {
            setHinted((prev) => ({ ...prev, [key]: true }));
            onSpeak("fraction-hint", FRACTION_LINES[key]);
          }}
        >
          تلميح
        </button>
      </div>
      {helped && <p className="fraction-feedback">{hint}</p>}
      {feedback && (
        <div role="status" className="fraction-feedback">
          {feedback === "success"
            ? FRACTION_LINES.success
            : FRACTION_LINES.retry}
          {feedback === "success" && (
            <MathWorkedExample
              tone="light"
              operationsAr={
                mission === 2
                  ? baseNumerator +
                    " × " +
                    factor +
                    " = " +
                    baseNumerator * factor +
                    "\n" +
                    baseDenominator +
                    " × " +
                    factor +
                    " = " +
                    baseDenominator * factor
                  : numerator +
                    " = " +
                    denominator +
                    " × " +
                    quotient +
                    " + " +
                    rest
              }
              solution={
                mission === 2
                  ? baseNumerator +
                    "/" +
                    baseDenominator +
                    " = " +
                    baseNumerator * factor +
                    "/" +
                    baseDenominator * factor
                  : mission === 0
                  ? numerator +
                    "/" +
                    denominator +
                    " = " +
                    quotient +
                    " + " +
                    rest +
                    "/" +
                    denominator
                  : quotient +
                    " < " +
                    numerator +
                    "/" +
                    denominator +
                    " < " +
                    (quotient + 1)
              }
            />
          )}
        </div>
      )}
      {Object.values(results).filter((r) => r.completed).length === 3 && (
        <p role="status">
          أنهيت المهمات الثلاث.{" "}
          {transfer
            ? "هل تستطيع شرح فكرتك لشخص آخر؟"
            : "جرّب الآن مختبر الحديقة."}
        </p>
      )}
      {transfer &&
        Object.values(results).filter((r) => r.completed).length === 3 && (
          <section className="fraction-feedback">
            <h3>أشرح فكرتي</h3>
            <p>لماذا يبقى الكسر المكافئ مساويًا للكسر الأول؟</p>
            {[
              "قسّمنا الأجزاء بالتساوي، وضربنا البسط والمقام في العدد نفسه.",
              "غيّرنا المقام وحده.",
            ].map((text, i) => (
              <button
                type="button"
                key={text}
                data-fraction-explain={i}
                onClick={() => {
                  const correct = i === 0;
                  setExplain(correct);
                  setExplainAttempts((n) => n + 1);
                  onObserve("explain", {
                    completed: correct,
                    helped: explainAttempts > 0,
                    attempts: explainAttempts + 1,
                  });
                  onSpeak(
                    "fraction-explain",
                    correct ? FRACTION_LINES.success : FRACTION_LINES.retry
                  );
                }}
              >
                {text}
              </button>
            ))}
            {explain !== null && (
              <p role="status">
                {explain
                  ? "صحيح: تغيّر عدد الأجزاء وحجمها، وبقيت المساحة نفسها."
                  : "لنعد إلى الرسم: يجب أن نغيّر البسط والمقام معًا."}
              </p>
            )}
          </section>
        )}
      <p className="fraction-unscored">
        تدريب للفهم. نتيجة الدرس تعتمد على التمارين والاختبار.
      </p>
    </section>
  );
}
