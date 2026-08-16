import React, { useState } from 'react';
import { CmsCourseItem, WorkflowStatus, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  FileEdit,
  Save,
  Plus,
  Trash2,
  Clock,
  History,
  CheckCircle2,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Calculator,
  Grid,
  ChevronDown,
  Eye,
  RotateCcw
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/subjectsData';

interface CourseEditorProps {
  courses: CmsCourseItem[];
  onSaveCourses: (updated: CmsCourseItem[]) => void;
}

const WORKFLOW_LABELS: Record<WorkflowStatus, string> = {
  draft: 'مسودة (Draft)',
  review: 'قيد المراجعة (In Review)',
  validated: 'معتمد (Validated)',
  published: 'منشور للعامة (Published)',
  archived: 'مؤرشف (Archived)',
};

export const CourseEditor: React.FC<CourseEditorProps> = ({
  courses,
  onSaveCourses,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Editable Form State
  const [titleAr, setTitleAr] = useState(activeCourse?.titleAr || '');
  const [titleFr, setTitleFr] = useState(activeCourse?.titleFr || '');
  const [grade, setGrade] = useState<PrimaryGrade>(activeCourse?.grade || '5AP');
  const [subject, setSubject] = useState<SubjectId>(activeCourse?.subject || 'math');
  const [summaryAr, setSummaryAr] = useState(activeCourse?.summaryAr || '');
  const [bodyHtmlContent, setBodyHtmlContent] = useState(activeCourse?.bodyHtmlContent || '');
  const [rulesArText, setRulesArText] = useState((activeCourse?.rulesAr || []).join('\n'));
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(activeCourse?.workflowStatus || 'draft');
  const [interactiveTool, setInteractiveTool] = useState<string>(activeCourse?.interactiveTool || 'none');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Sync state when selecting a different course
  const handleSelectCourse = (course: CmsCourseItem) => {
    setSelectedCourseId(course.id);
    setTitleAr(course.titleAr);
    setTitleFr(course.titleFr || '');
    setGrade(course.grade);
    setSubject(course.subject);
    setSummaryAr(course.summaryAr);
    setBodyHtmlContent(course.bodyHtmlContent);
    setRulesArText((course.rulesAr || []).join('\n'));
    setWorkflowStatus(course.workflowStatus);
    setInteractiveTool(course.interactiveTool || 'none');
  };

  const handleSaveCurrentCourse = () => {
    if (!activeCourse) return;

    const rulesArray = rulesArText.split('\n').filter((r) => r.trim().length > 0);
    const newVersionNumber = activeCourse.version + 1;

    // Create version snapshot for audit log
    const newVersionSnapshot = {
      versionNumber: activeCourse.version,
      updatedAt: new Date().toISOString().slice(0, 10),
      authorName: activeCourse.authorName || 'المعلم المنسق',
      titleAr: activeCourse.titleAr,
      summaryAr: activeCourse.summaryAr,
      bodyHtmlContent: activeCourse.bodyHtmlContent,
      changeLogAr: `تحديث المحتوى وتمرير الحالة إلى (${WORKFLOW_LABELS[workflowStatus]})`,
    };

    const updatedCourseItem: CmsCourseItem = {
      ...activeCourse,
      titleAr,
      titleFr,
      grade,
      subject,
      summaryAr,
      bodyHtmlContent,
      rulesAr: rulesArray,
      workflowStatus,
      interactiveTool: interactiveTool === 'none' ? undefined : (interactiveTool as any),
      version: newVersionNumber,
      versionsHistory: [newVersionSnapshot, ...(activeCourse.versionsHistory || [])],
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = courses.map((c) => (c.id === activeCourse.id ? updatedCourseItem : c));
    onSaveCourses(updatedList);
    alert('تم حفظ التعديلات وإنشاء نسخة تاريخية جديدة للدرس بنجاح!');
  };

  const handleCreateNewCourse = () => {
    const newCourse: CmsCourseItem = {
      id: `course_${Date.now()}`,
      chapterId: 'chap_math_5ap_01',
      grade: '5AP',
      subject: 'math',
      titleAr: 'عنوان الدرس الجديد',
      titleFr: 'Nouveau Cours',
      summaryAr: 'ملخص موجز للدرس البيداغوجي الجديد...',
      bodyHtmlContent: '<p>محتوى الدرس المفصل هنا...</p>',
      rulesAr: ['القاعدة الأولى...'],
      mediaUrls: [],
      attachments: [],
      version: 1,
      versionsHistory: [],
      workflowStatus: 'draft',
      authorName: 'المعلم المنسق',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = [newCourse, ...courses];
    onSaveCourses(updatedList);
    handleSelectCourse(newCourse);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذا الدرس نهائياً؟')) {
      const updatedList = courses.filter((c) => c.id !== courseId);
      onSaveCourses(updatedList);
      if (updatedList.length > 0) {
        handleSelectCourse(updatedList[0]);
      }
    }
  };

  const handleRollbackVersion = (ver: any) => {
    if (window.confirm(`هل تريد الاسترجاع إلى النسخة v${ver.versionNumber}؟`)) {
      setTitleAr(ver.titleAr);
      setSummaryAr(ver.summaryAr);
      setBodyHtmlContent(ver.bodyHtmlContent);
      setShowHistoryModal(false);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              Éditeur de Cours CMS
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              محرر الدروس التفاعلية البيداغوجية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            دعم تحرير النص العربي المشكول، ربط الأدوات التفاعلية، وإدارة النسخ التاريخية (Versioning).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewCourse}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إنشاء درس جديد</span>
          </button>

          <button
            onClick={handleSaveCurrentCourse}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الدرس والاصدار</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Lessons List Selector */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-2xs h-fit">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center justify-between border-b pb-2">
            <span>فهرس الدروس ({courses.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">DRAFT / PUB</span>
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {courses.map((c) => {
              const isSelected = c.id === activeCourse?.id;

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCourse(c)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-right space-y-1 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {c.grade}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">v{c.version}</span>
                  </div>

                  <h4 className="font-extrabold text-xs truncate">{c.titleAr}</h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {c.summaryAr}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Course Form & Rich Editor */}
        <div className="lg:col-span-3 space-y-5">
          
          {activeCourse ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              
              {/* Meta Row: Grade, Subject, Workflow Status, Versioning Button */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">المستوى الدراسي:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none"
                  >
                    {(['1AP', '2AP', '3AP', '4AP', '5AP'] as PrimaryGrade[]).map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">المادة التعليمية:</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as SubjectId)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none"
                  >
                    {SUBJECTS_LIST.map((s) => (
                      <option key={s.id} value={s.id}>{s.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">حالة اعتماد الدرس:</label>
                  <select
                    value={workflowStatus}
                    onChange={(e) => setWorkflowStatus(e.target.value as WorkflowStatus)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none text-emerald-800"
                  >
                    <option value="draft">مسودة (Draft)</option>
                    <option value="review">قيد المراجعة البيداغوجية</option>
                    <option value="validated">معتمد ومصادق عليه</option>
                    <option value="published">منشور متاح للتلاميذ</option>
                    <option value="archived">مؤرشف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">سجل الإصدارات:</label>
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full flex items-center justify-center gap-1.5 bg-slate-900 text-amber-400 font-bold text-xs p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>الإصدار v{activeCourse.version} ({activeCourse.versionsHistory?.length || 0} نسخ)</span>
                  </button>
                </div>

              </div>

              {/* Title & Translation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الدرس باللغة العربية (مشكول):</label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-black text-sm p-3 rounded-xl focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الدرس بالفرنسية (Traduction FR):</label>
                  <input
                    type="text"
                    value={titleFr}
                    onChange={(e) => setTitleFr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs p-3 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملخص الدرس التمهيدي:</label>
                <textarea
                  rows={2}
                  value={summaryAr}
                  onChange={(e) => setSummaryAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs p-3 rounded-xl focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Rules List Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  القواعد الذهبية والأحكام البيداغوجية (كل قاعدة في سطر مستقل):
                </label>
                <textarea
                  rows={3}
                  value={rulesArText}
                  onChange={(e) => setRulesArText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs p-3 rounded-xl focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Rich Content Body Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">محتوى الدرس التفصيلي (HTML Rich Content):</label>
                  <span className="text-[10px] text-slate-400 font-mono">Supporte les balises HTML & Formules</span>
                </div>
                <textarea
                  rows={6}
                  value={bodyHtmlContent}
                  onChange={(e) => setBodyHtmlContent(e.target.value)}
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl focus:outline-none leading-relaxed border border-slate-800"
                />
              </div>

              {/* Interactive Tool Association */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-extrabold text-amber-400">
                  ربط أداة تفاعلية سريعة بالدرس:
                </label>
                <select
                  value={interactiveTool}
                  onChange={(e) => setInteractiveTool(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold text-xs p-2.5 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="none">بدون أداة تفاعلية (درس نظري)</option>
                  <option value="soroban">🧮 المعداد الياباني السوروبان (Soroban Abacus)</option>
                  <option value="unit_converter">📏 محول الوحدات والمقادير الرسمية (Unit Converter)</option>
                  <option value="geometry_visualizer">📐 مجسمات الهندسة 2D / 3D (Geometry Visualizer)</option>
                </select>
              </div>

              {/* Delete Course Footer Action */}
              <div className="pt-4 border-t flex justify-end">
                <button
                  onClick={() => handleDeleteCourse(activeCourse.id)}
                  className="flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف هذا الدرس نهائياً</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
              اختر درساً من القائمة الجانبية أو قم بإنشاء درس جديد.
            </div>
          )}

        </div>

      </div>

      {/* Version History Modal */}
      {showHistoryModal && activeCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-amber-500" />
                <span>سجل التغيرات والنسخ التاريخية (Version History)</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600 font-black">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(activeCourse.versionsHistory || []).length > 0 ? (
                activeCourse.versionsHistory.map((ver, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>النسخة v{ver.versionNumber} ({ver.updatedAt})</span>
                      <button
                        onClick={() => handleRollbackVersion(ver)}
                        className="flex items-center gap-1 text-emerald-700 hover:underline font-extrabold text-[11px] cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>استرجاع</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 font-sans">{ver.changeLogAr}</p>
                    <span className="text-[10px] text-slate-400 block font-mono">بواسطة: {ver.authorName}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  هذا الدرس في نسخته الأولى المباشرة.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
