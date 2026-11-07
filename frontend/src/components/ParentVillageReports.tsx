import { villageDay } from '../utils/villageSession';
import React from 'react';
import type { UserProfile, PrimaryGrade } from '../types';
import type { FractionObservation } from './lessonViewer/fractionJourneyContent';
const describe = (r?: FractionObservation) => !r ? 'لم تُجرّب' : !r.completed ? 'بحاجة إلى تدريب' : r.helped ? 'نجح مع مساعدة أو بعد محاولة أخرى' : 'نجح دون تلميح ومن المحاولة الأولى';
export function ParentVillageReports({ profile, grade, onReview }: { profile: UserProfile; grade: PrimaryGrade; onReview: (id: string) => void }) {
  const reports = (profile.villageSummaries ?? []).filter(s => s.villageSummary?.grade === grade).slice(-6).reverse();
  if (!reports.length) return null;
  return <section data-saved-village-reports className="space-y-3" dir="rtl">
    <h3 className="text-lg font-extrabold">جلسات التعلّم مع ديدو</h3>
    <p>ملاحظات آخر محاولة لكل درس في اليوم، وليست شهادة إتقان.</p>
    {reports.map(session => { const r = session.villageSummary!; return <article key={session.lessonId + ':' + villageDay(session.at)} className="rounded-2xl border-2 border-[#ddcda7] bg-[#FFFBF0] p-4 space-y-3 text-base">
      <h4 className="font-extrabold">{r.title}</h4><time dateTime={session.at}>{new Date(session.at).toLocaleDateString('ar-DZ', { timeZone: 'Africa/Algiers' })}</time>
      <p>تمارين نجح فيها دون مساعدة ومن المحاولة الأولى: {r.alone} · مع مساعدة أو بعد خطأ: {r.helped} · تحتاج إلى تدريب: {r.needs}</p>
      <ul className="space-y-3">{(['decompose', 'bound', 'equivalent', 'explain'] as const).map((key, i) => <li key={key}>
        <strong>{['تفكيك كسر', 'حصر كسر', 'تكافؤ الكسور', 'تفسير التكافؤ'][i]}</strong>
        <p>أكتشف وأجرّب: {describe(r.learn[key])}</p><p>المختبر: {describe(r.transfer[key])}</p>
      </li>)}</ul>
      {!!r.examples?.length && <div><strong>أمثلة من النشاط:</strong><ul>{r.examples.map((example, i) => <li key={i}><bdi dir="auto">{example}</bdi></li>)}</ul></div>}
      <p>الاختبار في هذه الجلسة: <bdi dir="ltr">{r.quizCorrect} / {r.quizTotal}</bdi></p>
      <p>الخطوة التالية: {r.next === 'interactive' ? 'العودة إلى المختبر وتجربة الأجزاء' : r.next === 'practice' ? 'إكمال التمارين مع ديدو' : 'مراجعة الاختبار'}</p>
      <button type="button" onClick={() => onReview(session.lessonId)} className="min-h-[60px] rounded-2xl bg-[#207958] text-white px-5 font-bold">أفتح الدرس للتدريب</button>
    </article>; })}
  </section>;
}
