import { PremiumFunnelPanel } from './PremiumFunnelPanel';
import React, { useEffect, useRef, useState } from 'react';
import { Users, TrendingUp, Award, Flame, BookOpenCheck, Trophy, Medal, CreditCard, UserPlus, RefreshCw, Activity, Repeat, Star, MapPin, Download, Mail, UserCheck, Moon, Percent } from 'lucide-react';
import { springBootApi } from '../../services/springBootApi';
import { WILAYAS_LIST } from '../../data/wilayasData';
import { generatePartnerCatalogHtml, downloadHtmlFile } from '../../utils/partnerCatalogExport';
import { downloadCsv, isStatsOverview, overviewCsv } from './analyticsData';
import { AnalyticsPeriod } from './AnalyticsPeriod';

// wilayaDistribution groups by the wilaya's official code ("16"), see AuthModal.tsx — resolve it to
// a readable "16 - الجزائر" label for the admin console rather than showing a bare number.
const WILAYA_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  WILAYAS_LIST.map((w) => [w.codeStr, w.nameAr])
);
const formatWilayaKey = (code: string): string =>
  code === 'UNKNOWN' ? 'غير محدَّدة' : `${code} - ${WILAYA_NAME_BY_CODE[code] || code}`;
const PROVIDER_LABEL: Record<string, string> = {
  LOCAL: 'بريد إلكتروني',
  GOOGLE: 'Google',
  UNKNOWN: 'غير محدَّد',
};
const ROLE_LABEL: Record<string, string> = {
  ROLE_FREE: 'حساب مجاني',
  ROLE_PREMIUM: 'اشتراك مدفوع',
  ROLE_ADMIN: 'مشرف',
};

// Every field here maps 1:1 to GET /api/v1/admin/stats/overview (see backend
// AdminStatsOverviewDto.java) — session-time/preschool-usage widgets still don't exist because no
// real field backs them. Never add a placeholder card for a metric this endpoint doesn't return.
export interface AdminStatsOverview {
  totalUsers: number;
  roleDistribution: Record<string, number>;
  gradeDistribution: Record<string, number>;
  wilayaDistribution: Record<string, number>;
  totalXp: number;
  averageXp: number;
  averageLevel: number;
  averageStreakDays: number;
  totalCompletedLessons: number;
  totalCompletedExams: number;
  totalCompletedChallenges: number;
  totalBadgesUnlocked: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  newUsersToday: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate7Days: number;
  retentionRate30Days: number;
  stickinessDauMau: number;
  activatedUsers: number;
  activationRate: number;
  neverActiveUsers: number;
  inactive30DaysUsers: number;
  emailVerifiedUsers: number;
  parentEmailSetUsers: number;
  providerDistribution: Record<string, number>;
  /** lessonId -> completion count, top 10, already sorted descending by the backend. */
  topCompletedLessons: Record<string, number>;
  topCompletedExams: Record<string, number>;
  topCompletedChallenges: Record<string, number>;
  payments: {
    totalReceipts: number;
    receiptsByStatus: Record<string, number>;
    receiptsByMethod: Record<string, number>;
    totalAmountDzdApproved: number;
    totalAmountDzdPending: number;
  };
}

const StatCard: React.FC<{ icon: React.ReactNode; labelAr: string; value: React.ReactNode; sub?: string; accent?: string }> = ({
  icon,
  labelAr,
  value,
  sub,
  accent = 'text-amber-400',
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 space-y-2 min-w-0">
    <div className="flex items-center justify-between text-slate-300">
      <span className="text-[11px] font-extrabold uppercase tracking-wider">{labelAr}</span>
      <span className={accent}>{icon}</span>
    </div>
    <div className="text-xl sm:text-2xl font-black text-white font-mono break-all">{value}</div>
    {sub && <div className="text-[11px] text-slate-300">{sub}</div>}
  </div>
);

const DistributionCard: React.FC<{ titleAr: string; icon: React.ReactNode; data: Record<string, number>; formatKey?: (key: string) => string }> = ({ titleAr, icon, data, formatKey }) => {
  const entries: [string, number][] = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum: number, [, v]) => sum + v, 0);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <h3 className="text-xs font-black">{titleAr}</h3>
      </div>
      {entries.length === 0 ? (
        <div className="text-[11px] text-slate-300">لا توجد بيانات بعد.</div>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, value]) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-mono">{formatKey ? formatKey(key) : key}</span>
                  <span className="font-bold text-slate-200">{value} ({pct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Resolves lessonId -> titleAr by dynamically importing the ~4.6MB lesson catalog only when this
// card actually has entries to show — same lazy-import pattern already used by badgeEngine.ts, so
// the admin console's initial bundle never pays for the full catalog just to render a few titles.
const TopLessonsCard: React.FC<{ titleAr: string; data: Record<string, number> }> = ({ titleAr, data }) => {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const entries = Object.entries(data || {});

  useEffect(() => {
    if (entries.length === 0) return;
    let cancelled = false;
    import('../../data/coursesData').then(({ COURSES_DATA }) => {
      if (cancelled) return;
      const map: Record<string, string> = {};
      entries.forEach(([id]) => {
        const lesson = COURSES_DATA.find((l) => l.id === id);
        if (lesson) map[id] = lesson.titleAr;
      });
      setTitles(map);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-slate-300">
        <Star className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-black">{titleAr}</h3>
      </div>
      {entries.length === 0 ? (
        <div className="text-[11px] text-slate-300">لا توجد بيانات بعد.</div>
      ) : (
        <ol className="space-y-2">
          {entries.map(([id, count], idx) => (
            <li key={id} className="flex items-center justify-between gap-2 text-[11px]">
              <span className="flex items-center gap-2 min-w-0 text-slate-300">
                <span className="shrink-0 w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-black flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="truncate font-bold">{titles[id] || id}</span>
              </span>
              <span className="shrink-0 font-mono font-bold text-slate-200">{count}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export const AnalyticsModule: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const requestGeneration = useRef(0);

  const handleExportPartnerCatalog = async () => {
    if (!stats) return;
    setIsExporting(true);
    try {
      const html = await generatePartnerCatalogHtml(stats);
      const date = new Date().toISOString().slice(0, 10);
      downloadHtmlFile(html, `mssid-catalogue-partenaire-${date}.html`);
    } catch {
      setError('تعذر تصدير الكتالوج. أعد المحاولة.');
    } finally {
      setIsExporting(false);
    }
  };

  const loadStats = async () => {
    const request = ++requestGeneration.current;
    setIsLoading(true);
    setError(null);
    setStats(null);
    try {
      const res = await springBootApi.getAdminStatsOverview();
      if (request !== requestGeneration.current) return;
      if (res.error || !res.data) {
        setError(res.error || 'تعذر تحميل الإحصائيات من الخادم.');
      } else if (!isStatsOverview(res.data)) {
        setError('بيانات الإحصائيات غير مكتملة. تحقق من تحديث الخادم ثم أعد المحاولة.');
      } else {
        setStats(res.data);
      }
    } catch (e: any) {
      if (request === requestGeneration.current) setError('تعذر الاتصال بالخادم لجلب الإحصائيات.');
    } finally {
      if (request === requestGeneration.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    return () => { ++requestGeneration.current; };
  }, []);

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Analytics
            </span>
            <h2 className="text-lg font-extrabold text-white">إحصائيات المنصة الحقيقية</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            كل رقم هنا مصدره قاعدة المستخدمين والمدفوعات — بلا تقديرات.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
          <button type="button" disabled={!stats || isLoading} onClick={() => stats && downloadCsv(overviewCsv(stats), `mssid-statistiques-${new Date().toISOString().slice(0, 10)}.csv`)} className="min-h-11 px-4 rounded-xl border border-slate-600 text-slate-200 text-xs font-bold disabled:opacity-50">CSV الإجماليات / totaux</button>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 font-bold text-xs min-h-[var(--hit)] px-4 rounded-xl transition-all cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
          </button>
          <button
            onClick={handleExportPartnerCatalog}
            disabled={!stats || isExporting}
            className="flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-300 border border-amber-500/40 font-bold text-xs min-h-[var(--hit)] px-4 rounded-xl transition-all cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
            <span>{isExporting ? 'Export en cours...' : 'Exporter le catalogue partenaire'}</span>
          </button>
        </div>
      </div>

      <AnalyticsPeriod />
      <PremiumFunnelPanel />
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
        <p>نطاق الإحصائيات: الحسابات والتقدم المحفوظ على الخادم. الزوار بدون حساب والنشاط غير المتزامن لا يدخلان في هذه الأرقام. النشاط التعليمي يعتمد على آخر تحديث للتقدم، وليس مجرد فتح التطبيق. أيام النشاط محسوبة بتوقيت UTC.</p>
        <p>معدل العودة يقيس نشاط الحسابات القديمة خلال آخر 7 أو 30 يوماً، وليس الاحتفاظ الدقيق في اليوم السابع أو الثلاثين بعد التسجيل. فتح الدروس وتركها، استخدام التحضيري ومصدر الزيارات غير مسجّلة في هذا التقرير حالياً.</p>
      </div>

      {error && (
        <div role="alert" className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-4 rounded-2xl">
          {error}
        </div>
      )}

      {isLoading && !stats ? (
        <div className="text-center py-16 text-slate-300 text-xs">جاري تحميل الإحصائيات...</div>
      ) : stats ? (
        <>
          {/* Core user metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={<Users className="w-5 h-5" />} labelAr="إجمالي المستخدمين" value={stats.totalUsers} />
            <StatCard icon={<UserPlus className="w-5 h-5" />} labelAr="جدد اليوم" value={stats.newUsersToday} accent="text-emerald-400" />
            <StatCard icon={<UserPlus className="w-5 h-5" />} labelAr="مستخدمون جدد (7 أيام)" value={stats.newUsersLast7Days} accent="text-emerald-400" />
            <StatCard icon={<UserPlus className="w-5 h-5" />} labelAr="مستخدمون جدد (30 يوم)" value={stats.newUsersLast30Days} accent="text-emerald-400" />
          </div>

          {/* Active users & retention — derived from lastActiveDate, which the frontend bumps to
              today on every XP-earning action (quiz, lesson...), not a bare page load. So this reads
              as "did real learning activity today/this week/this month", a stricter bar than a raw
              app-open ping. Retention is a rolling window (old-enough accounts still active
              recently), not per-cohort same-day-offset tracking — see AdminStatsOverviewDto's javadoc. */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard icon={<Activity className="w-5 h-5" />} labelAr="نشيطون اليوم (DAU)" value={stats.dailyActiveUsers} accent="text-emerald-400" />
            <StatCard icon={<Activity className="w-5 h-5" />} labelAr="نشيطون آخر 7 أيام" value={stats.weeklyActiveUsers} accent="text-emerald-400" />
            <StatCard icon={<Activity className="w-5 h-5" />} labelAr="نشيطون آخر 30 يوماً" value={stats.monthlyActiveUsers} accent="text-emerald-400" />
            <StatCard
              icon={<Percent className="w-5 h-5" />}
              labelAr="الالتصاق اليومي (DAU/MAU)"
              value={`${(stats.stickinessDauMau ?? 0).toFixed(1)}%`}
              sub="نسبة النشيطين اليوم من نشيطي هذا الشهر"
              accent="text-sky-400"
            />
            <StatCard
              icon={<Repeat className="w-5 h-5" />}
              labelAr="معدل العودة (7 أيام)"
              value={`${stats.retentionRate7Days.toFixed(1)}%`}
              sub="من الحسابات الأقدم من أسبوع، النشيطة خلال آخر 7 أيام"
              accent="text-sky-400"
            />
            <StatCard
              icon={<Repeat className="w-5 h-5" />}
              labelAr="معدل العودة (30 يوم)"
              value={`${stats.retentionRate30Days.toFixed(1)}%`}
              sub="من الحسابات الأقدم من شهر، النشيطة خلال آخر 30 يوم"
              accent="text-sky-400"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<UserCheck className="w-5 h-5" />}
              labelAr="أكملوا درساً واحداً على الأقل"
              value={stats.activatedUsers ?? 0}
              sub={`${(stats.activationRate ?? 0).toFixed(1)}٪ من الحسابات`}
              accent="text-emerald-400"
            />
            <StatCard
              icon={<Moon className="w-5 h-5" />}
              labelAr="بلا تاريخ تقدم متزامن"
              value={stats.neverActiveUsers ?? 0}
              sub="بدون تاريخ نشاط تعليمي"
            />
            <StatCard
              icon={<Moon className="w-5 h-5" />}
              labelAr="بلا نشاط خلال آخر 30 يوماً"
              value={stats.inactive30DaysUsers ?? 0}
              sub="حسابات أقدم من شهر بلا عودة"
              accent="text-orange-400"
            />
            <StatCard
              icon={<Mail className="w-5 h-5" />}
              labelAr="بريد مؤكَّد"
              value={stats.emailVerifiedUsers ?? 0}
              sub={stats.totalUsers > 0 ? `${Math.round(((stats.emailVerifiedUsers ?? 0) / stats.totalUsers) * 100)}٪ من الحسابات` : undefined}
            />
            <StatCard
              icon={<Mail className="w-5 h-5" />}
              labelAr="بريد ولي الأمر"
              value={stats.parentEmailSetUsers ?? 0}
            />
            <StatCard icon={<Award className="w-5 h-5" />} labelAr="إجمالي الشارات المفتوحة" value={stats.totalBadgesUnlocked} accent="text-purple-400" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={<TrendingUp className="w-5 h-5" />} labelAr="إجمالي نقاط الخبرة XP" value={stats.totalXp} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} labelAr="متوسط نقاط الخبرة" value={stats.averageXp} />
            <StatCard icon={<Trophy className="w-5 h-5" />} labelAr="متوسط المستوى" value={stats.averageLevel} />
            <StatCard icon={<Flame className="w-5 h-5" />} labelAr="متوسط أيام التتابع" value={stats.averageStreakDays} accent="text-orange-400" />
          </div>

          {/* Self-reported completion counts — not verified telemetry, just summed completion-id lists */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<BookOpenCheck className="w-5 h-5" />}
              labelAr="دروس مكتملة (مُصرَّح بها)"
              value={stats.totalCompletedLessons}
              sub="مجموع قوائم الدروس المكتملة عبر كل المستخدمين"
            />
            <StatCard
              icon={<Medal className="w-5 h-5" />}
              labelAr="امتحانات مكتملة (مُصرَّح بها)"
              value={stats.totalCompletedExams}
              sub="تصريح ذاتي — لا يوجد تصحيح آلي للامتحانات"
            />
            <StatCard
              icon={<Trophy className="w-5 h-5" />}
              labelAr="تحديات مكتملة (مُصرَّح بها)"
              value={stats.totalCompletedChallenges}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TopLessonsCard titleAr="الدروس الأكثر إتماماً" data={stats.topCompletedLessons} />
            <TopLessonsCard titleAr="الامتحانات الأكثر إتماماً" data={stats.topCompletedExams || {}} />
            <TopLessonsCard titleAr="التحديات الأكثر إتماماً" data={stats.topCompletedChallenges || {}} />
          </div>

          {/* Role / grade / signup */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DistributionCard titleAr="توزيع المستخدمين حسب الصلاحية" icon={<Users className="w-4 h-4 text-purple-400" />} data={stats.roleDistribution} formatKey={(key) => ROLE_LABEL[key] || key} />
            <DistributionCard titleAr="توزيع المستخدمين حسب السنة الدراسية" icon={<BookOpenCheck className="w-4 h-4 text-blue-400" />} data={stats.gradeDistribution} />
            <DistributionCard titleAr="طريقة إنشاء الحساب" icon={<UserPlus className="w-4 h-4 text-emerald-400" />} data={stats.providerDistribution || {}} formatKey={(key) => PROVIDER_LABEL[key] || key} />
          </div>

          {/* B2B partner reporting: which wilayas the active accounts are actually in. "غير محدَّدة"
              covers every account created before this field existed, plus any Google sign-up that
              skipped the one-time "complete your profile" step — expect it to shrink over time, not
              be zero right away. */}
          <DistributionCard titleAr="توزيع المستخدمين حسب الولاية" icon={<MapPin className="w-4 h-4 text-rose-400" />} data={stats.wilayaDistribution} formatKey={formatWilayaKey} />

          {/* Payments block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-sm text-white">المدفوعات ووصولات الاشتراك</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] text-slate-300 font-bold">إجمالي الوصولات</div>
                <div className="text-xl font-black text-white font-mono">{stats.payments.totalReceipts}</div>
              </div>
              <div className="bg-slate-950 border border-emerald-900 rounded-xl p-4">
                <div className="text-[11px] text-slate-300 font-bold">المبلغ المقبول (DZD)</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{stats.payments.totalAmountDzdApproved}</div>
              </div>
              <div className="bg-slate-950 border border-amber-900 rounded-xl p-4">
                <div className="text-[11px] text-slate-300 font-bold">المبلغ قيد الانتظار (DZD)</div>
                <div className="text-xl font-black text-amber-400 font-mono">{stats.payments.totalAmountDzdPending}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <DistributionCard titleAr="الوصولات حسب الحالة" icon={<CreditCard className="w-4 h-4 text-emerald-400" />} data={stats.payments.receiptsByStatus} />
              <DistributionCard titleAr="الوصولات حسب وسيلة الدفع" icon={<CreditCard className="w-4 h-4 text-amber-400" />} data={stats.payments.receiptsByMethod} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
