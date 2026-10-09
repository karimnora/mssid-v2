import React, { useEffect, useRef, useState } from 'react';
import { springBootApi } from '../../services/springBootApi';
import { downloadCsv, isStatsPeriod, periodCsv, periodError, type StatsPeriod } from './analyticsData';

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days: number) => new Date(Date.parse(today()) - days * 86400000).toISOString().slice(0, 10);

export function AnalyticsPeriod() {
  const [from, setFrom] = useState(() => daysAgo(29));
  const [to, setTo] = useState(today);
  const [period, setPeriod] = useState<StatsPeriod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const load = async (start: string, end: string) => {
    const request = ++generation.current;
    setPeriod(null);
    const invalid = periodError(start, end);
    setError(invalid);
    if (invalid) { setLoading(false); return; }
    setLoading(true);
    try {
      const result = await springBootApi.getAdminStatsPeriod(start, end);
      if (request !== generation.current) return;
      if (result.error || !isStatsPeriod(result.data, start, end)) {
        setError('تعذر تحميل بيانات الفترة. تحقق من تحديث الخادم ثم أعد المحاولة.');
      } else setPeriod(result.data);
    } catch {
      if (request === generation.current) setError('تعذر الاتصال بالخادم. أعد المحاولة.');
    } finally {
      if (request === generation.current) setLoading(false);
    }
  };
  useEffect(() => { void load(from, to); return () => { ++generation.current; }; }, []);
  const preset = (days: number) => { const start = daysAgo(days - 1); const end = today(); setFrom(start); setTo(end); void load(start, end); };
  const totals = period?.days.reduce((sum, day) => ({
    registrations: sum.registrations + day.registrations,
    receipts: sum.receipts + day.submittedReceipts,
  }), { registrations: 0, receipts: 0 });
  const max = Math.max(1, ...(period?.days.flatMap(day => [day.registrations, day.submittedReceipts]) ?? []));
  const points = (key: 'registrations' | 'submittedReceipts') => period?.days.map((day, i, days) =>
    `${days.length === 1 ? 300 : i * 600 / (days.length - 1)},${130 - day[key] * 115 / max}`).join(' ');
  return <section aria-labelledby="analytics-period-title" className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 space-y-4 text-slate-200">
    <h3 id="analytics-period-title" className="font-bold text-white">تطور التسجيلات والمدفوعات / Évolution par période</h3>
    <p className="text-xs text-slate-300">الفترة تشمل تاريخ البداية والنهاية. باقي مؤشرات الصفحة تعرض الحالة الحالية والإجماليات، ولا تتغير بهذا الفلتر.</p>
    <div className="flex flex-wrap gap-2">{[7, 30, 90].map(days => <button key={days} type="button" onClick={() => preset(days)} className="min-h-11 px-4 rounded-lg bg-slate-800 border border-slate-600">{days} أيام / jours</button>)}</div>
    <form onSubmit={event => { event.preventDefault(); void load(from, to); }} className="flex flex-wrap items-end gap-3">
      <label className="text-sm flex flex-col gap-1">من / Du<input type="date" value={from} max={today()} onChange={event => setFrom(event.target.value)} className="min-h-11 bg-slate-800 border border-slate-600 rounded-lg px-3 text-white" required /></label>
      <label className="text-sm flex flex-col gap-1">إلى / Au<input type="date" value={to} max={today()} onChange={event => setTo(event.target.value)} className="min-h-11 bg-slate-800 border border-slate-600 rounded-lg px-3 text-white" required /></label>
      <button type="submit" className="min-h-11 px-4 rounded-lg bg-emerald-700 text-white font-bold">عرض الفترة / Appliquer</button>
      <button type="button" disabled={!period || loading} onClick={() => period && downloadCsv(periodCsv(period), `mssid-periode-${period.from}-${period.to}.csv`)} className="min-h-11 px-4 rounded-lg border border-slate-600 disabled:opacity-50">CSV الفترة / période</button>
    </form>
    {loading && <p role="status" className="text-sm">جاري تحميل الفترة…</p>}
    {error && <p role="alert" className="text-sm text-rose-200">{error}</p>}
    {period && <>
      <p className="text-sm" role="status"><span dir="ltr">{period.from} → {period.to}</span> · {totals?.registrations} تسجيل جديد · {totals?.receipts} وصل مودَع</p>
      <p className="text-xs text-slate-300">التواريخ حسب ساعة الخادم: <span dir="ltr">{period.timezone}</span>. المبالغ حسب تاريخ إيداع الوصل وحالته الحالية، وليست تاريخ التحصيل أو الموافقة.</p>
      <div className="flex flex-wrap gap-4 text-xs"><span className="text-emerald-300">● التسجيلات / Inscriptions</span><span className="text-sky-300">● الوصولات المودعة / Reçus déposés</span></div>
      <p className="text-xs text-slate-300">مقياس الرسم: 0 — {max} / jour. التفاصيل الرقمية متاحة في الجدول أدناه.</p>
      <svg aria-hidden="true" viewBox="-8 0 616 145" className="w-full h-40" preserveAspectRatio="none">
        <path d="M0 130H600" stroke="#64748b" fill="none" />
        <polyline points={points('registrations')} stroke="#6ee7b7" strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
        <polyline points={points('submittedReceipts')} stroke="#7dd3fc" strokeWidth="3" strokeDasharray="6 4" fill="none" vectorEffect="non-scaling-stroke" />
        {period.days.length === 1 && <><circle cx="300" cy={130 - period.days[0].registrations * 115 / max} r="4" fill="#6ee7b7" /><circle cx="300" cy={130 - period.days[0].submittedReceipts * 115 / max} r="4" fill="#7dd3fc" /></>}
      </svg>
      <details><summary className="min-h-11 cursor-pointer font-bold text-sm">البيانات اليومية / Données quotidiennes</summary>
        <div className="overflow-x-auto"><table className="w-full text-xs text-start">
          <caption className="text-start py-2">التسجيلات والوصولات حسب اليوم — المبالغ بالدينار الجزائري</caption>
          <thead><tr>{['التاريخ', 'التسجيلات', 'الوصولات المودعة', 'المبلغ المقبول حالياً', 'المبلغ المعلّق حالياً'].map(label => <th key={label} scope="col" className="p-2 text-start">{label}</th>)}</tr></thead>
          <tbody>{period.days.map(day => <tr key={day.date} className="border-t border-slate-700"><th scope="row" className="p-2 whitespace-nowrap font-normal" dir="ltr">{day.date}</th><td className="p-2">{day.registrations}</td><td className="p-2">{day.submittedReceipts}</td><td className="p-2">{day.approvedSubmittedAmountDzd}</td><td className="p-2">{day.pendingSubmittedAmountDzd}</td></tr>)}</tbody>
        </table></div>
      </details>
    </>}
  </section>;
}
