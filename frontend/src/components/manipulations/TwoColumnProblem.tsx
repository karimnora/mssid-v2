import React, { useState } from 'react';
export interface TwoColumnProblemData {
    statement: string;
    left: number;
    right: number;
    operation: '+' | '-';
    unit: string;
}
export function TwoColumnProblem({ problem }: {
    problem: TwoColumnProblemData;
}) {
    const [answer, setAnswer] = useState(''), [checked, setChecked] = useState(false);
    const expected = problem.operation === '+' ? problem.left + problem.right : problem.left - problem.right;
    return <section aria-label="المسألة في عمودين" dir="rtl"><p>{problem.statement}</p>
    <div className="problem-columns" dir="ltr">
      <section dir="rtl"><h3>الحل / الأجوبة</h3><label>النتيجة ({problem.unit})<input aria-label="نتيجة المسألة" inputMode="numeric" value={answer} onChange={e => { setAnswer(e.target.value.replace(/[^0-9]/g, '').slice(0, 9)); setChecked(false); }}/></label></section>
      <section dir="rtl"><h3>العمليات</h3><div className="written-operation" dir="ltr"><div>{problem.left}</div><div>{problem.operation} {problem.right}</div><hr /><div>{answer || '؟'}</div></div></section>
    </div>
    <button onClick={() => setChecked(true)} disabled={!answer}>أتحقق</button>
    {checked && <p role="status">{Number(answer) === expected ? 'أحسنت! النتيجة صحيحة. اشرح كيف حسبت.' : 'جرّب من جديد. راجع الآحاد ثم العشرات؛ إجابتك باقية لتصححها.'}</p>}
  </section>;
}

/** Prepared corrections share the official left-solution / right-operations layout. */
export function TwoColumnCorrection({ solution, operations }: { solution: React.ReactNode; operations: string }) {
  return <div className="grid grid-cols-2 gap-2 text-base" dir="ltr" data-two-columns>
    <section dir="rtl" className="min-w-0 rounded-lg bg-slate-50 p-2 break-words"><h4 className="font-bold">الحل</h4>{solution}</section>
    <section dir="rtl" className="min-w-0 rounded-lg bg-slate-50 p-2"><h4 className="font-bold">العمليات</h4><pre dir="ltr" className="whitespace-pre-wrap break-words font-sans">{operations}</pre></section>
  </div>;
}
