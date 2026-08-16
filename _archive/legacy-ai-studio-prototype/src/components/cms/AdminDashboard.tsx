import React from 'react';
import { CmsAnalyticsStats, CmsCourseItem, WorkflowStatus } from '../../types/cms';
import {
  FileText,
  CheckSquare,
  Award,
  Users,
  TrendingUp,
  Sparkles,
  FileUp,
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { CmsTabId } from './CmsHeaderNav';

interface AdminDashboardProps {
  analytics: CmsAnalyticsStats;
  courses: CmsCourseItem[];
  onNavigateTab: (tab: CmsTabId) => void;
}

const WORKFLOW_LABELS: Record<WorkflowStatus, { labelAr: string; color: string }> = {
  published: { labelAr: 'منشور متاح للجميع', color: 'bg-emerald-500 text-white' },
  validated: { labelAr: 'معتمد ومصدق', color: 'bg-blue-500 text-white' },
  review: { labelAr: 'قيد المراجعة البيداغوجية', color: 'bg-amber-500 text-slate-950' },
  draft: { labelAr: 'مسودة قيد الإنشاء', color: 'bg-slate-500 text-white' },
  archived: { labelAr: 'مؤرشف', color: 'bg-slate-700 text-slate-300' },
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  courses,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              لوحة التحكم البيداغوجية
            </span>
            <h2 className="text-xl font-extrabold font-sans">
              مرحباً بك في مركز إدارة المنهاج التعليمي الجزائري
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            إدارة كاملة للدروس، التمارين، الامتحانات الأكاديمية واستيراد الوثائق الرسمية بالذكاء الاصطناعي.
          </p>
        </div>

        {/* Quick Launch Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigateTab('import_pdf')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>استيراد PDF رسمي</span>
          </button>

          <button
            onClick={() => onNavigateTab('ai_generator')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>المولّد الذكي Gemini</span>
          </button>

          <button
            onClick={() => onNavigateTab('courses')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>إضافة درس جديد</span>
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="flex items-center gap-1.5 bg-purple-900/80 hover:bg-purple-800 border border-purple-700 text-purple-200 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>التقرير الفني والتدقيق</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">إجمالي الدروس</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{analytics.totalCourses}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {Math.round(analytics.publishedRatio * 100)}% منشور
            </span>
          </div>
          <p className="text-[11px] text-slate-500">موزعة عبر المواد والمستويات (1AP - 5AP)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">بنك التمارين التفاعلية</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{analytics.totalExercises}</span>
            <span className="text-[11px] font-bold text-slate-500">تمارين متنوعة</span>
          </div>
          <p className="text-[11px] text-slate-500">QCM، سحب وإفلات، وتطبيقات حسابية</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">الامتحانات والأعمال الرسمية</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{analytics.totalExams}</span>
            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              شهادة 5AP
            </span>
          </div>
          <p className="text-[11px] text-slate-500">مع السلم الرسمي للتنقيط والحلول النموذجية</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">نسبة نجاح التلاميذ</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{analytics.averagePassRatePercent}%</span>
            <span className="text-[11px] font-bold text-emerald-600">+{analytics.activeStudentsCount} تلميذ</span>
          </div>
          <p className="text-[11px] text-slate-500">متوسط معدل الإجابات الصحيحة في الاختبارات</p>
        </div>

      </div>

      {/* Workflow Status Distribution Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <span>حالة تدفق المحتوى البيداغوجي (Content Workflow)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Brouillon ➔ Relecture ➔ Validé ➔ Publié</span>
        </div>

        {/* Progress Bars Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['published', 'validated', 'review', 'draft', 'archived'] as WorkflowStatus[]).map((st) => {
            const count = analytics.statusBreakdown[st] || 0;
            const meta = WORKFLOW_LABELS[st];

            return (
              <div key={st} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.color}`}>
                  {meta.labelAr}
                </span>
                <div className="text-xl font-black text-slate-900 mt-1">{count} عناصر</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Top Consulted Lessons & Recent Content Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Consulted Lessons */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>الدروس الأكثر مراجعة من التلاميذ</span>
            </h3>
            <span className="text-xs text-slate-400">إحصائيات المنصة الحية</span>
          </div>

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

        {/* Recent Courses Registered */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span>أحدث الدروس المسجلة بالنظام</span>
            </h3>
            <button
              onClick={() => onNavigateTab('courses')}
              className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
            >
              عرض الكل ➔
            </button>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.2 rounded-md">
                      {course.grade}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{course.titleAr}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-xs">{course.summaryAr}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${WORKFLOW_LABELS[course.workflowStatus].color}`}>
                    {WORKFLOW_LABELS[course.workflowStatus].labelAr}
                  </span>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">v{course.version}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
