import React, { useEffect, useState } from 'react';
import { Server, CheckCircle2, XCircle, RefreshCw, ScrollText, Filter, RotateCcw, Mail, Database, Cloud } from 'lucide-react';
import { springBootApi, InfraProviderQuota, InfraQuotasResponse } from '../../services/springBootApi';

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
  GOOGLE_REGISTERED: 'إنشاء حساب عبر Google',
  GOOGLE_LOGIN: 'تسجيل الدخول عبر Google',
  GOOGLE_LINK_REJECTED: 'رفض ربط حساب Google بحساب موجود',
  AI_REEL_GENERATED: 'توليد إعلان بالذكاء الاصطناعي',
  AI_NARRATION_GENERATED: 'توليد تعليق صوتي',
  AI_ILLUSTRATION_GENERATED: 'توليد رسم توضيحي',
  AD_REEL_SAVED: 'حفظ إعلان',
  AD_REEL_DELETED: 'حذف إعلان',
  AI_REEL_GENERATION_FAILED: 'فشل توليد إعلان',
  AI_NARRATION_FAILED: 'فشل توليد التعليق الصوتي',
  AI_ILLUSTRATION_FAILED: 'فشل توليد الرسم',
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

// Supervision log: live server + provider quotas + business events. Reachability is a timed call
// to the admin stats endpoint; the table reads real rows and never fabricates them.
export const TechnicalLogsModule: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'error'>('checking');
  const [serverPingMs, setServerPingMs] = useState<number | null>(null);

  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoadingLog, setIsLoadingLog] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);
  const [hideRoutineLogins, setHideRoutineLogins] = useState(true);
  const [expandedDetailId, setExpandedDetailId] = useState<number | null>(null);

  const [draftFilters, setDraftFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);

  const [infraQuotas, setInfraQuotas] = useState<InfraQuotasResponse | null>(null);
  const [infraQuotasError, setInfraQuotasError] = useState<string | null>(null);
  const [isLoadingQuotas, setIsLoadingQuotas] = useState(true);

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

  const loadInfraQuotas = async () => {
    setIsLoadingQuotas(true);
    setInfraQuotasError(null);
    try {
      const res = await springBootApi.getAdminInfraQuotas();
      if (res.error) {
        setInfraQuotasError(res.error);
        setInfraQuotas(null);
      } else {
        setInfraQuotas(res.data || null);
      }
    } catch {
      setInfraQuotasError('تعذر جلب حصص الخدمات السحابية.');
      setInfraQuotas(null);
    } finally {
      setIsLoadingQuotas(false);
    }
  };

  const loadAuditLog = async (filters: Filters, hideLogins = hideRoutineLogins) => {
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
        excludeActionType: hideLogins && !filters.actionType ? 'GOOGLE_LOGIN' : undefined,
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
    checkServerReachability();
    loadInfraQuotas();
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
    checkServerReachability();
    loadInfraQuotas();
    loadAuditLog(appliedFilters);
  };

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  return (
    <div className="space-y-6 dir-rtl font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ScrollText className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">سجل الأحداث</h2>
            <p className="text-xs text-slate-300 mt-1">
              حالة الخادم، حصص البريد وقاعدة البيانات والاستضافة، وأحداث الحسابات والمدفوعات — بلا تفاصيل تقنية خام.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefreshAll}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl shadow-md transition-all cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة الفحص</span>
        </button>
      </div>

      {/* Live Health Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-extrabold uppercase tracking-wider">الخادم</span>
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
                ? `يرد خلال ${serverPingMs} ملّي ثانية`
                : serverStatus === 'error'
                ? 'تعذر الاتصال بالخادم'
                : 'قيد الفحص...'}
            </span>
          </div>
        </div>

      </div>

      {/* Live provider quotas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 gap-2">
          <h3 className="font-extrabold text-sm text-white">حصص الخدمات</h3>
        </div>
        {isLoadingQuotas ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-500">جاري تحميل الحصص من المزودين...</div>
        ) : infraQuotasError ? (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-4 rounded-2xl">{infraQuotasError}</div>
        ) : infraQuotas ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <ProviderQuotaCard
              title="البريد الإلكتروني"
              icon={<Mail className="w-5 h-5 text-amber-400" />}
              quota={infraQuotas.resend}
            />
            <ProviderQuotaCard
              title="قاعدة البيانات"
              icon={<Database className="w-5 h-5 text-emerald-400" />}
              quota={infraQuotas.neon}
            />
            <ProviderQuotaCard
              title="الاستضافة"
              icon={<Cloud className="w-5 h-5 text-sky-400" />}
              quota={infraQuotas.render}
            />
          </div>
        ) : null}
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-amber-400 shrink-0" />
            <span>سجل الأحداث</span>
          </h3>
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
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 min-h-[var(--hit)] cursor-pointer w-full"
            >
              <option value="">كل أنواع الأحداث</option>
              {KNOWN_ACTION_TYPES.map((type) => (
                <option key={type} value={type}>{ACTION_LABELS_AR[type]}</option>
              ))}
            </select>

            <select
              value={draftFilters.outcome}
              onChange={(e) => setDraftFilters((f) => ({ ...f, outcome: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 min-h-[var(--hit)] cursor-pointer w-full"
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
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 min-h-[var(--hit)] placeholder:text-slate-600 w-full"
              dir="ltr"
            />

            <input
              type="date"
              value={draftFilters.dateFrom}
              onChange={(e) => setDraftFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 min-h-[var(--hit)] w-full"
              title="من تاريخ"
            />

            <input
              type="date"
              value={draftFilters.dateTo}
              onChange={(e) => setDraftFilters((f) => ({ ...f, dateTo: e.target.value }))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 min-h-[var(--hit)] w-full"
              title="إلى تاريخ"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs min-h-[var(--hit)] px-4 rounded-xl transition-all cursor-pointer"
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
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 ms-auto cursor-pointer min-h-[var(--hit)]">
              <input
                type="checkbox"
                checked={hideRoutineLogins}
                onChange={(e) => {
                  const next = e.target.checked;
                  setHideRoutineLogins(next);
                  loadAuditLog(appliedFilters, next);
                }}
                className="rounded border-slate-600"
              />
              <span>إخفاء تسجيلات الدخول عبر Google</span>
            </label>
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
                {auditLog.map((entry) => {
                  const friendly = humanizeLogDetails(entry.details);
                  const showRaw = expandedDetailId === entry.id && friendly !== entry.details;
                  return (
                  <tr key={entry.id} className="border-b border-slate-800/60 hover:bg-slate-950/60">
                    <td className="py-2.5 px-2 text-slate-300 whitespace-nowrap">{formatLogTime(entry.createdAt)}</td>
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
                    <td className="py-2.5 px-2 text-slate-300">
                      <div className="space-y-1 max-w-md">
                        <p className="leading-relaxed">{friendly}</p>
                        {entry.details && friendly !== entry.details && (
                          <button
                            type="button"
                            className="text-[10px] font-bold text-amber-400 hover:text-amber-300"
                            onClick={() => setExpandedDetailId(showRaw ? null : entry.id)}
                          >
                            {showRaw ? 'إخفاء التفاصيل التقنية' : 'عرض التفاصيل التقنية'}
                          </button>
                        )}
                        {showRaw && <p className="font-mono text-[10px] text-slate-500 break-all" dir="ltr">{entry.details}</p>}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const PROVIDER_STATUS_AR: Record<string, string> = {
  ok: 'محدَّث',
  not_configured: 'غير متاحة حالياً',
  error: 'تعذر الجلب',
};

const ProviderQuotaCard: React.FC<{ title: string; icon: React.ReactNode; quota: InfraProviderQuota }> = ({
  title,
  icon,
  quota,
}) => {
  const meters = quota.meters || [];
  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-extrabold uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      {meters.length === 0 ? (
        <p className="text-sm text-slate-300 font-bold leading-relaxed">
          {quota.status === 'error'
            ? PROVIDER_STATUS_AR.error
            : (quota.note && !looksTechnical(quota.note) ? quota.note : PROVIDER_STATUS_AR[quota.status] || PROVIDER_STATUS_AR.not_configured)}
        </p>
      ) : (
        meters.map((meter) => {
          const remaining = Math.max(0, meter.limit - meter.used);
          const pct = meter.limit > 0 ? Math.min(100, (meter.used / meter.limit) * 100) : 0;
          const bar =
            pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
          return (
            <div key={meter.id} className="space-y-1.5">
              <div className="flex flex-col items-end sm:flex-row sm:items-baseline sm:justify-between gap-1 min-w-0">
                <span className="text-[11px] font-bold text-slate-400 self-start">{meter.label}</span>
                <span className="text-sm font-black text-white font-mono shrink-0" dir="ltr">
                  متبقي {formatQuotaNumber(remaining)} / {formatQuotaNumber(meter.limit)} {meter.unit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-slate-500">
                استُخدم {formatQuotaNumber(meter.used)} · {Math.round(pct)}٪
              </p>
            </div>
          );
        })
      )}
      {quota.note && meters.length > 0 && !looksTechnical(quota.note) && (
        <p className="text-[10px] text-slate-500 leading-relaxed">{quota.note}</p>
      )}
      {quota.dashboardUrl && (
        <a
          href={quota.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center min-h-[var(--hit)] text-[11px] font-bold text-amber-400 hover:text-amber-300"
        >
          فتح لوحة المتابعة ↗
        </a>
      )}
    </div>
  );
};

function formatQuotaNumber(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Number.isInteger(value) || Math.abs(value) >= 10) return String(Math.round(value * 10) / 10);
  return String(Math.round(value * 100) / 100);
}

function formatLogTime(iso: string | undefined): string {
  if (!iso) return '—';
  const [date, time] = iso.split('T');
  if (!date) return iso;
  const [year, month, day] = date.split('-');
  const hm = (time || '').slice(0, 5);
  return hm ? `${day}/${month}/${year} ${hm}` : `${day}/${month}/${year}`;
}

function looksTechnical(text: string): boolean {
  return /api[-.]|exception|stack|sql|http|key|token|render\.com|neon\.tech/i.test(text);
}

function humanizeLogDetails(details: string | undefined | null): string {
  if (!details || !details.trim()) return '—';
  const d = details.trim();
  if (/api-key.*pas configur|n'est pas configurée/i.test(d)) return 'تعذّر إرسال البريد: خدمة البريد غير معدّة';
  if (/échec Resend|timeout/i.test(d)) return 'تعذّر إرسال البريد (انتهت المهلة أو الخدمة غير متاحة)';
  if (/envoyé via Resend/i.test(d)) return 'أُرسل البريد بنجاح';
  if (/^grade=/i.test(d)) return `المستوى ${d.replace(/^grade=/i, '')}`;
  if (/provider=GOOGLE/i.test(d)) return 'عبر Google';
  if (/user upgraded to ROLE_PREMIUM/i.test(d)) return 'ترقية الحساب إلى اشتراك مدفوع';
  if (/ROLE_FREE\s*->\s*ROLE_PREMIUM/i.test(d)) return 'من حساب مجاني إلى اشتراك مدفوع';
  if (/ROLE_FREE\s*->\s*ROLE_ADMIN/i.test(d)) return 'من حساب مجاني إلى مشرف';
  if (/ROLE_PREMIUM\s*->\s*ROLE_FREE/i.test(d)) return 'من اشتراك مدفوع إلى حساب مجاني';
  if (/rejected:\s*/i.test(d)) return `سبب الرفض: ${d.replace(/rejected:\s*/i, '')}`;
  if (/enabled=true/i.test(d)) return 'الميزة مفعّلة';
  if (/enabled=false/i.test(d)) return 'الميزة معطّلة';
  if (/reset to code default/i.test(d)) return 'أُعيدت القيمة الافتراضية';
  if (/already linked/i.test(d)) return 'الحساب مرتبط مسبقاً بحساب Google آخر';
  if (looksTechnical(d) || d.length > 180) return 'حدث تقني — يمكن عرض التفاصيل عند الحاجة';
  return d;
}
