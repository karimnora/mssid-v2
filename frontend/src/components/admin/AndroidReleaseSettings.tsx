import React, { useEffect, useState } from 'react';
import { springBootApi } from '../../services/springBootApi';

export const AndroidReleaseSettings: React.FC = () => {
  const [latest, setLatest] = useState('');
  const [min, setMin] = useState('');
  const [savedLatest, setSavedLatest] = useState<number | null>(null);
  const [savedMin, setSavedMin] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void springBootApi.getAndroidRelease().then((res) => {
      if (cancelled || !res.data) return;
      setLatest(String(res.data.latestVersionCode));
      setMin(String(res.data.minVersionCode));
      setSavedLatest(res.data.latestVersionCode);
      setSavedMin(res.data.minVersionCode);
    });
    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    const latestVersionCode = Number(latest);
    const minVersionCode = Number(min);
    if (!Number.isInteger(latestVersionCode) || latestVersionCode < 1) return;
    if (!Number.isInteger(minVersionCode) || minVersionCode < 0) return;
    setBusy(true);
    setError(false);
    const res = await springBootApi.updateAndroidRelease({ latestVersionCode, minVersionCode });
    setBusy(false);
    if (res.error || !res.data) {
      setError(true);
      return;
    }
    setLatest(String(res.data.latestVersionCode));
    setMin(String(res.data.minVersionCode));
    setSavedLatest(res.data.latestVersionCode);
    setSavedMin(res.data.minVersionCode);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black text-slate-500 px-1">تطبيق أندرويد (Google Play)</h3>
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <p className="text-[11px] text-slate-300">
          بعد قبول Play للنسخة الجديدة، ارفع رقم versionCode هنا. 0 في الحد الأدنى = يمكن تجاهل التحديث.
          الرقم الحالي المضمّن في هذا البناء: {__APP_BUILD__}.
        </p>
        <label className="block space-y-1">
          <span className="text-[11px] font-extrabold text-white">آخر versionCode على Play</span>
          <input
            type="number"
            min={1}
            value={latest}
            onChange={(e) => setLatest(e.target.value)}
            className="w-full min-h-12 rounded-xl bg-slate-800 border border-slate-700 px-3 text-white"
            aria-label="آخر versionCode على Play"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[11px] font-extrabold text-white">الحد الأدنى الإلزامي (0 = اختياري)</span>
          <input
            type="number"
            min={0}
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full min-h-12 rounded-xl bg-slate-800 border border-slate-700 px-3 text-white"
            aria-label="الحد الأدنى الإلزامي"
          />
        </label>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="min-h-12 px-4 rounded-xl bg-emerald-600 text-white text-sm font-extrabold disabled:opacity-50 cursor-pointer"
        >
          حفظ أرقام أندرويد
        </button>
        {savedLatest !== null && (
          <p className="text-[11px] text-slate-400">المحفوظ: {savedLatest} / إلزامي {savedMin}</p>
        )}
        {error && <p className="text-[11px] font-bold text-rose-300">تعذّر حفظ أرقام أندرويد. أعد المحاولة.</p>}
      </div>
    </div>
  );
};
