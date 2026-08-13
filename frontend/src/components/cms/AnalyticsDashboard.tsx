import React from 'react';
import { CmsAnalyticsStats } from '../../types/cms';
import {
  Users,
  UserPlus,
  Timer,
  BookOpen,
  PieChart,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: CmsAnalyticsStats;
}

const GRADE_COLORS: Record<string, string> = {
  '1AP': 'bg-rose-400',
  '2AP': 'bg-amber-400',
  '3AP': 'bg-emerald-400',
  '4AP': 'bg-sky-400',
  '5AP': 'bg-purple-400',
};

// Fully mocked for now — no analytics backend is wired up yet (see cmsData.ts INITIAL_CMS_ANALYTICS).
// Structured so a real event pipeline (Supabase/Firebase/Express) can populate this same
// CmsAnalyticsStats shape later without changing this component.
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const gradeEntries = Object.entries(analytics.gradeDistribution) as [string, number][];
  const gradeTotal = gradeEntries.reduce((sum, [, v]) => sum + v, 0) || 1;

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200">
            Analytics
          </span>
          <h2 className="text-lg font-extrabold text-slate-900">لوحة إحصائيات المنصة</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          نظرة عامة على نشاط المستخدمين واستهلاك المحتوى. (بيانات تجريبية بانتظار ربط خادم الإحصائيات الحقيقي)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">المستخدمون النشطون يومياً (DAU)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{analytics.dailyActiveUsers.toLocaleString('ar-DZ')}</div>
          <p className="text-[11px] text-slate-500">تلميذ متصل خلال آخر 24 ساعة</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">إجمالي التسجيلات</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{analytics.totalSignups.toLocaleString('ar-DZ')}</div>
          <p className="text-[11px] text-slate-500">حساب مسجل منذ الإطلاق</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">متوسط الوقت في الجلسة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{analytics.averageTimeSpentMinutes} د</div>
          <p className="text-[11px] text-slate-500">متوسط مدة الجلسة الواحدة</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Consulted Lessons */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>الدروس الأكثر زيارة</span>
          </h3>
          <div className="space-y-3">
            {analytics.topConsultedLessons.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{item.titleAr}</h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.subject}</span>
                  </div>
                </div>
                <div className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                  {item.views} مشاهدة
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-600" />
            <span>توزيع التلاميذ حسب المستوى</span>
          </h3>

          <div className="flex w-full h-4 rounded-full overflow-hidden border border-slate-200">
            {gradeEntries.map(([grade, value]) => (
              <div
                key={grade}
                className={GRADE_COLORS[grade] || 'bg-slate-400'}
                style={{ width: `${(value / gradeTotal) * 100}%` }}
                title={`${grade}: ${value}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {gradeEntries.map(([grade, value]) => (
              <div key={grade} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${GRADE_COLORS[grade] || 'bg-slate-400'}`} />
                  <span className="text-[11px] font-bold text-slate-700">{grade}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Preschool Usage */}
      <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shrink-0">
            🦊
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">معدل استخدام وضع التحضيري (Mode Éveil)</h3>
            <p className="text-[11px] text-slate-500">عدد الجلسات المسجلة في قسم الروضة (3-5 سنوات)</p>
          </div>
        </div>
        <div className="text-2xl font-black text-amber-700">{analytics.preschoolSessionsCount.toLocaleString('ar-DZ')}</div>
      </div>

    </div>
  );
};
