import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Award, Flame, BookOpenCheck, Trophy, Medal, CreditCard, UserPlus, RefreshCw } from 'lucide-react';
import { springBootApi } from '../../services/springBootApi';

// Every field here maps 1:1 to GET /api/v1/admin/stats/overview (see backend
// AdminStatsOverviewDto.java) — no DAU/session-time/top-lessons/preschool widgets exist because no
// real field backs them. Never add a placeholder card for a metric this endpoint doesn't return.
interface AdminStatsOverview {
  totalUsers: number;
  roleDistribution: Record<string, number>;
  gradeDistribution: Record<string, number>;
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
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
    <div className="flex items-center justify-between text-slate-500">
      <span className="text-[11px] font-extrabold uppercase tracking-wider">{labelAr}</span>
      <span className={accent}>{icon}</span>
    </div>
    <div className="text-2xl font-black text-white font-mono">{value}</div>
    {sub && <div className="text-[11px] text-slate-500">{sub}</div>}
  </div>
);

const DistributionCard: React.FC<{ titleAr: string; icon: React.ReactNode; data: Record<string, number> }> = ({ titleAr, icon, data }) => {
  const entries: [string, number][] = Object.entries(data || {});
  const total = entries.reduce((sum: number, [, v]) => sum + v, 0);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        <h3 className="text-xs font-black">{titleAr}</h3>
      </div>
      {entries.length === 0 ? (
        <div className="text-[11px] text-slate-500">لا توجد بيانات بعد.</div>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, value]) => {
            const pct = total > 0 ? Math.round((value / total) * 100) : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-mono">{key}</span>
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

export const AnalyticsModule: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await springBootApi.getAdminStatsOverview();
      if (res.error || !res.data) {
        setError(res.error || 'تعذر تحميل الإحصائيات من الخادم.');
      } else {
        setStats(res.data as AdminStatsOverview);
      }
    } catch (e: any) {
      setError('تعذر الاتصال بالخادم لجلب الإحصائيات.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Analytics
            </span>
            <h2 className="text-lg font-extrabold text-white">إحصائيات المنصة الحقيقية</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            كل رقم هنا مصدره مباشرة قاعدة بيانات المستخدمين والمدفوعات — لا توجد أي بيانات وهمية أو تقديرية.
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'جاري التحديث...' : 'تحديث البيانات'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-4 rounded-2xl">
          {error}
        </div>
      )}

      {isLoading && !stats ? (
        <div className="text-center py-16 text-slate-500 text-xs">جاري تحميل الإحصائيات...</div>
      ) : stats ? (
        <>
          {/* Core user metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="w-5 h-5" />} labelAr="إجمالي المستخدمين" value={stats.totalUsers} />
            <StatCard icon={<UserPlus className="w-5 h-5" />} labelAr="مستخدمون جدد (7 أيام)" value={stats.newUsersLast7Days} accent="text-emerald-400" />
            <StatCard icon={<UserPlus className="w-5 h-5" />} labelAr="مستخدمون جدد (30 يوم)" value={stats.newUsersLast30Days} accent="text-emerald-400" />
            <StatCard icon={<Award className="w-5 h-5" />} labelAr="إجمالي الشارات المفتوحة" value={stats.totalBadgesUnlocked} accent="text-purple-400" />
          </div>

          {/* XP / level / streak aggregates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<TrendingUp className="w-5 h-5" />} labelAr="إجمالي نقاط الخبرة XP" value={stats.totalXp} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} labelAr="متوسط نقاط الخبرة" value={stats.averageXp} />
            <StatCard icon={<Trophy className="w-5 h-5" />} labelAr="متوسط المستوى" value={stats.averageLevel} />
            <StatCard icon={<Flame className="w-5 h-5" />} labelAr="متوسط أيام التتابع" value={stats.averageStreakDays} accent="text-orange-400" />
          </div>

          {/* Self-reported completion counts — not verified telemetry, just summed completion-id lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Role / grade distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DistributionCard titleAr="توزيع المستخدمين حسب الصلاحية (Role)" icon={<Users className="w-4 h-4 text-purple-400" />} data={stats.roleDistribution} />
            <DistributionCard titleAr="توزيع المستخدمين حسب السنة الدراسية" icon={<BookOpenCheck className="w-4 h-4 text-blue-400" />} data={stats.gradeDistribution} />
          </div>

          {/* Payments block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-sm text-white">المدفوعات ووصولات الاشتراك</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-[11px] text-slate-500 font-bold">إجمالي الوصولات</div>
                <div className="text-xl font-black text-white font-mono">{stats.payments.totalReceipts}</div>
              </div>
              <div className="bg-slate-950 border border-emerald-900 rounded-xl p-4">
                <div className="text-[11px] text-slate-500 font-bold">المبلغ المقبول (DZD)</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{stats.payments.totalAmountDzdApproved}</div>
              </div>
              <div className="bg-slate-950 border border-amber-900 rounded-xl p-4">
                <div className="text-[11px] text-slate-500 font-bold">المبلغ قيد الانتظار (DZD)</div>
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
