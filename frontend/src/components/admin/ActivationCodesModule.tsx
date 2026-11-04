import React, { useCallback, useEffect, useState } from 'react';
import { springBootApi } from '../../services/springBootApi';

type Kind = 'CARD' | 'RECEIPT' | 'SCHOOL';
type Batch = { label: string; kind: string; planId: string; codes: number; seats: number; used: number; validUntil: string | null; revoked: number };

const KIND_AR: Record<Kind, string> = { CARD: 'بطاقات مسبقة الدفع (مكتبة)', RECEIPT: 'كود بعد دفع بريدي موب', SCHOOL: 'رخصة قسم (مدرسة)' };
const PLAN_AR: Record<string, string> = { P3M: '3 أشهر — 900 دج', P12M: '12 شهراً — 2 400 دج' };

function csv(codes: string[], label: string, planId: string) {
  return ['code,lot,formule', ...codes.map((code) => `${code},"${label.replace(/"/g, '""')}",${planId}`)].join('\n');
}

/**
 * كود التفعيل (admin): generate a batch, copy or download it, print the cards, follow the uses and
 * revoke a batch. The plain codes are shown once — the server keeps only their hash.
 */
export const ActivationCodesModule: React.FC = () => {
  const [planId, setPlanId] = useState('P12M');
  const [kind, setKind] = useState<Kind>('CARD');
  const [count, setCount] = useState(20);
  const [seats, setSeats] = useState(1);
  const [label, setLabel] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{ codes: string[]; label: string; planId: string } | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  const load = useCallback(async () => {
    const res = await springBootApi.getActivationBatches();
    if (res.data) setBatches(res.data);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await springBootApi.generateActivationCodes({ planId, count, seats: kind === 'SCHOOL' ? seats : 1, kind, label: label.trim(), validUntil: validUntil || null });
    setBusy(false);
    if (res.error || !res.data) {
      setError(res.error ?? 'تعذّر إنشاء الأكواد.');
      return;
    }
    setGenerated({ codes: res.data.codes, label: label.trim(), planId });
    void load();
  };

  const download = () => {
    if (!generated) return;
    const blob = new Blob(['﻿' + csv(generated.codes, generated.label, generated.planId)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes-${generated.label.replace(/[^\p{L}\p{N}]+/gu, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const revoke = async (batchLabel: string) => {
    if (!window.confirm(`إلغاء كل الأكواد غير المستعملة في «${batchLabel}»؟`)) return;
    await springBootApi.revokeActivationBatch(batchLabel);
    void load();
  };

  return (
    <section dir="rtl" className="space-y-6 text-slate-100" data-activation-codes-admin>
      <header className="space-y-1">
        <h2 className="text-xl font-black">🎟️ أكواد التفعيل</h2>
        <p className="text-sm text-slate-400">بطاقات المكتبات، أكواد بعد الدفع عبر بريدي موب، ورخص الأقسام. تظهر الأكواد مرة واحدة فقط: احفظها أو اطبعها الآن.</p>
      </header>

      <form onSubmit={generate} className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <label className="space-y-1 text-sm font-bold">النوع
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)} className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3">
            {(Object.keys(KIND_AR) as Kind[]).map((k) => <option key={k} value={k}>{KIND_AR[k]}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-bold">الصيغة
          <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3">
            {Object.entries(PLAN_AR).map(([id, text]) => <option key={id} value={id}>{text}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-sm font-bold">عدد الأكواد
          <input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3" />
        </label>
        {kind === 'SCHOOL' && (
          <label className="space-y-1 text-sm font-bold">عدد التلاميذ لكل كود
            <input type="number" min={1} max={60} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3" />
          </label>
        )}
        <label className="space-y-1 text-sm font-bold sm:col-span-2">اسم الدفعة (المكتبة، المدرسة، الولي…)
          <input required maxLength={120} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="مكتبة النور — باب الوادي — نوفمبر 2026" className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3" />
        </label>
        <label className="space-y-1 text-sm font-bold">صالح للاستعمال حتى (اختياري)
          <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full min-h-11 rounded-xl bg-slate-800 border border-slate-600 px-3" />
        </label>
        <div className="flex items-end">
          <button type="submit" disabled={busy || !label.trim()} className="min-h-11 w-full rounded-xl bg-emerald-600 font-extrabold disabled:opacity-50">{busy ? 'جارٍ الإنشاء…' : 'أنشئ الأكواد'}</button>
        </div>
        {error && <p role="alert" className="sm:col-span-2 text-amber-300 font-bold">{error}</p>}
      </form>

      {generated && (
        <div className="rounded-2xl border border-emerald-700 bg-slate-900 p-4 space-y-3" data-generated-codes>
          <p className="font-extrabold text-emerald-300">{generated.codes.length} كود — {generated.label}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void navigator.clipboard?.writeText(generated.codes.join('\n'))} className="min-h-11 px-4 rounded-xl border border-slate-600">نسخ</button>
            <button type="button" onClick={download} className="min-h-11 px-4 rounded-xl border border-slate-600">تحميل CSV</button>
            <button type="button" onClick={() => window.print()} className="min-h-11 px-4 rounded-xl border border-slate-600">طباعة البطاقات</button>
          </div>
          <div className="printable-sheet grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white text-slate-900 p-3 rounded-xl">
            {generated.codes.map((code) => (
              <div key={code} className="border-2 border-dashed border-slate-400 rounded-lg p-3 text-center space-y-1 break-inside-avoid">
                <p className="text-xs font-extrabold text-emerald-800">مَسِيد DZ — حساب العائلة المميّز</p>
                <p dir="ltr" className="font-mono text-lg font-black tracking-widest">{code}</p>
                <p className="text-[10px] font-bold">{PLAN_AR[generated.planId]?.split(' — ')[0]} · فعّلوه في الموقع: «عندي كود تفعيل»</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-extrabold">الدفعات</h3>
        {batches.length === 0 ? <p className="text-sm text-slate-400">لا توجد دفعات بعد.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-slate-400 text-right"><th className="p-2">الدفعة</th><th className="p-2">النوع</th><th className="p-2">الصيغة</th><th className="p-2">المستعمل / المقاعد</th><th className="p-2">حتى</th><th className="p-2" /></tr></thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={`${b.label}-${b.kind}-${b.planId}`} className="border-t border-slate-800">
                    <td className="p-2 font-bold">{b.label}</td>
                    <td className="p-2">{KIND_AR[b.kind as Kind] ?? b.kind}</td>
                    <td className="p-2">{b.planId}</td>
                    <td className="p-2" dir="ltr">{b.used} / {b.seats}</td>
                    <td className="p-2">{b.validUntil ?? '—'}</td>
                    <td className="p-2">{b.revoked < b.codes ? <button type="button" onClick={() => void revoke(b.label)} className="min-h-10 px-3 rounded-lg border border-amber-700 text-amber-300">إلغاء</button> : <span className="text-slate-500">ملغاة</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
