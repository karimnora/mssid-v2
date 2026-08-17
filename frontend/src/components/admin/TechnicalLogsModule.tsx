import React, { useEffect, useState } from 'react';
import { HardDrive, Server, CheckCircle2, XCircle, RefreshCw, ScrollText, Filter, RotateCcw } from 'lucide-react';
import { springBootApi } from '../../services/springBootApi';

interface AuditLogEntry {
  id: number;
  actorEmail: string;
  actionType: string;
  targetType: string;
  targetId: string | number;
  details: string;
  outcome: 'SUCCESS' | 'FAILURE' | string;
  createdAt: string;
}

const ACTION_LABELS_AR: Record<string, string> = {
  ROLE_CHANGE: 'تغيير دور مستخدم',
  RECEIPT_APPROVED: 'قبول وصل دفع',
  RECEIPT_REJECTED: 'رفض وصل دفع',
  RECEIPT_SUBMITTED: 'تقديم وصل دفع',
  FEATURE_FLAG_CHANGED: 'تعديل ميزة',
  EMAIL_SEND: 'إرسال بريد إلكتروني',
  USER_REGISTERED: 'إنشاء حساب جديد',
  REGISTRATION_FAILED: 'فشل إنشاء حساب',
  LOGIN_FAILED: 'فشل تسجيل الدخول',
  AI_TUTOR_CALL_FAILED: 'فشل استدعاء المعلم الافتراضي',
};

// Every actionType this codebase actually emits (see AdminAuditLogService.record call sites) — kept
// as an explicit list rather than derived from whatever happens to be in the last N rows, so the
// filter dropdown always offers every possibility even when the visible page has none of a given type.
const KNOWN_ACTION_TYPES = Object.keys(ACTION_LABELS_AR);

interface Filters {
  actionType: string;
  outcome: string;
  actorEmail: string;
  dateFrom: string;
  dateTo: string;
}

const EMPTY_FILTERS: Filters = { actionType: '', outcome: '', actorEmail: '', dateFrom: '', dateTo: '' };

// Rebuilt from the deleted components/cms/SystemAuditView.tsx: keeps the genuinely real bits (the
// localStorage byte-counting loop, now scoped to the whole app instead of only CMS keys) and
// replaces the fake bits — no more hardcoded "10 requests/min", no hardcoded Soroban "12" lesson
// count, no /api/health ping (that route only exists on the legacy Express dev proxy, not the real
// Spring Boot backend, and its catch block used to report "online" even on failure). Reachability is
// now a real timed call to the admin stats endpoint, and the audit table reads real rows or honestly
// says there are none yet — never a fabricated row.
//
// Broadened (see AdminAuditLog.java) from "admin actions only" to a general system event log —
// email delivery, registration/login failures, receipt submissions, AI tutor failures — with real
// server-side filtering (actionType/outcome/actorEmail/date range), not just a "last N rows" cap.
export const TechnicalLogsModule: React.FC = () => {
  const [storageUsedKb, setStorageUsedKb] = useState<number>(0);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'error'>('checking');
  const [serverPingMs, setServerPingMs] = useState<number | null>(null);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);

  const [draftFilters, setDraftFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);

  const computeStorageUsage = () => {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        totalBytes += key.length + value.length;
      }
    }
    setStorageUsedKb(Math.round(totalBytes / 1024));
  };

  const checkServerReachability = async () => {
    setServerStatus('checking');
    const start = performance.now();
    try {
      const res = await springBootApi.getAdminStatsOverview();
      const end = performance.now();
      if (res.error) {
        setServerStatus('error');
        setServerPingMs(null);
      } else {
        setServerStatus('online');
        setServerPingMs(Math.round(end - start));
      }
    } catch {
      setServerStatus('error');
      setServerPingMs(null);
    }
  };

  const loadAuditLog = async (filters: Filters) => {
    setIsLoadingLog(true);
    setLogError(null);
    try {
      const res = await springBootApi.getAdminAuditLog({
        limit: 100,
        actionType: filters.actionType || undefined,
        outcome: filters.outcome || undefined,
        actorEmail: filters.actorEmail || undefined,
        dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00` : undefined,
        dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59` : undefined,
      });
      if (res.error) {
        setLogError(res.error);
      } else {
        setAuditLog((res.data as AuditLogEntry[]) || []);
      }
    } catch {
      setLogError('تعذر الاتصال بالخادم لجلب سجل الأحداث.');
    } finally {
      setIsLoadingLog(false);
    }
  };

  useEffect(() => {
    computeStorageUsage();
    checkServerReachability();
    loadAuditLog(EMPTY_FILTERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    loadAuditLog(draftFilters);
  };

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    loadAuditLog(EMPTY_FILTERS);
  };

  const handleRefreshAll = () => {
    computeStorageUsage();
    checkServerReachability();
    loadAuditLog(appliedFilters);
  };

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  return (
    <div className="space-y-6 dir-rtl font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ScrollText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">السجلات التقنية (Technical Logs)</h2>
            <p className="text-xs text-slate-300 mt-1">
              حالة اتصال الخادم، سعة التخزين المحلية، وسجل أحداث حقيقي (تسجيل، دخول، بريد إلكتروني، مدفوعات...) — كل رقم هنا مصدره فعلي، لا توجد أي قيم ثابتة.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshAll}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة الفحص</span>
        </button>
      </div>

      {/* Live Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">اتصال خادم Spring Boot</span>
            <Server className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {serverStatus === 'online' ? 'متصل' : serverStatus === 'error' ? 'غير متصل' : 'جاري التحقق'}
            </span>
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-lg border ${
              serverStatus === 'online'
                ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800'
                : serverStatus === 'error'
                ? 'text-rose-300 bg-rose-950/60 border-rose-800'
                : 'text-slate-300 bg-slate-950 border-slate-800'
            }`}
          >
            {serverStatus === 'online' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : serverStatus === 'error' ? (
              <XCircle className="w-4 h-4 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
            )}
            <span>
              {serverStatus === 'online'
                ? `زمن الاستجابة الحقيقي: ${serverPingMs}ms (GET /v1/admin/stats/overview)`
                : serverStatus === 'error'
                ? 'فشل الاتصال بـ GET /v1/admin/stats/overview'
                : 'قيد الفحص...'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">سعة التخزين المحلي (localStorage)</span>
            <HardDrive className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{storageUsedKb} KB</span>
            <span className="text-xs text-slate-500 font-mono">مستخدمة في هذا المتصفح</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800">
            <HardDrive className="w-4 h-4 shrink-0" />
            <span>قياس فعلي لجميع مفاتيح localStorage الخاصة بهذا التطبيق</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-400" />
            <span>سجل الأحداث (Event Log)</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">GET /v1/admin/audit-log</span>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>تصفية السجل</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <select
              value={draftFilters.actionType}
              onChange={(e) => setDraftFilters((f) => ({ ...f, actionType: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer"
            >
              <option value="">كل أنواع الأحداث</option>
              {KNOWN_ACTION_TYPES.map((type) => (
                <option key={type} value={type}>{ACTION_LABELS_AR[type]}</option>
              ))}
            </select>

            <select
              value={draftFilters.outcome}
              onChange={(e) => setDraftFilters((f) => ({ ...f, outcome: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 cursor-pointer"
            >
              <option value="">كل النتائج</option>
              <option value="SUCCESS">✅ نجاح فقط</option>
              <option value="FAILURE">❌ فشل فقط</option>
            </select>

            <input
              type="text"
              placeholder="البحث بالبريد الإلكتروني..."
              value={draftFilters.actorEmail}
              onChange={(e) => setDraftFilters((f) => ({ ...f, actorEmail: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 placeholder:text-slate-600"
              dir="ltr"
            />

            <input
              type="date"
              value={draftFilters.dateFrom}
              onChange={(e) => setDraftFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2"
              title="من تاريخ"
            />

            <input
              type="date"
              value={draftFilters.dateTo}
              onChange={(e) => setDraftFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2"
              title="إلى تاريخ"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>تطبيق الفلترة</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء الفلترة</span>
              </button>
            )}
          </div>
        </div>

        {isLoadingLog ? (
          <div className="text-center py-10 text-slate-500 text-xs">جاري تحميل سجل الأحداث...</div>
        ) : logError ? (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-4 rounded-2xl">{logError}</div>
        ) : auditLog.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            {hasActiveFilters ? 'لا توجد أحداث مطابقة لهذه الفلترة.' : 'لا توجد أحداث مسجلة بعد.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="text-slate-500 border-b border-slate-800">
                  <th className="py-2 px-2 font-bold">التاريخ</th>
                  <th className="py-2 px-2 font-bold">الفاعل</th>
                  <th className="py-2 px-2 font-bold">نوع الحدث</th>
                  <th className="py-2 px-2 font-bold">النتيجة</th>
                  <th className="py-2 px-2 font-bold">التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-800/60 hover:bg-slate-950/60">
                    <td className="py-2.5 px-2 font-mono text-slate-300 whitespace-nowrap">{entry.createdAt}</td>
                    <td className="py-2.5 px-2 font-mono text-purple-300">{entry.actorEmail}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        {ACTION_LABELS_AR[entry.actionType] || entry.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] border whitespace-nowrap ${
                          entry.outcome === 'FAILURE'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {entry.outcome === 'FAILURE' ? '❌ فشل' : '✅ نجاح'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-300">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
