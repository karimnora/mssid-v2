import React, { useMemo, useState } from 'react';
import { CmsCourseItem, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  Save,
  Plus,
  Trash2,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/subjectsData';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

interface CourseEditorProps {
  courses: CmsCourseItem[];
  onSaveCourses: (updated: CmsCourseItem[]) => void;
}

const GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

// Deliberately minimal by design: courses are already fully authored and typed in
// src/data/courses/ (the shipped curriculum). This CMS editor is a lightweight overlay for
// quick text tweaks and visibility toggles on the demo/backend content model — no draft/review/
// approval workflow, no version history. See spec: "Ne conserver qu'une vue en lecture/édition
// rapide (recherche, filtres par matière/niveau, édition rapide du texte ou masquage/activation)."
export const CourseEditor: React.FC<CourseEditorProps> = ({
  courses,
  onSaveCourses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<PrimaryGrade | 'all'>('all');
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');

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
  const [isHidden, setIsHidden] = useState<boolean>(activeCourse?.isHidden ?? false);
  const [interactiveTool, setInteractiveTool] = useState<string>(activeCourse?.interactiveTool || 'none');

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery = !q || c.titleAr.toLowerCase().includes(q) || c.summaryAr.toLowerCase().includes(q);
      const matchesGrade = filterGrade === 'all' || c.grade === filterGrade;
      const matchesSubject = filterSubject === 'all' || c.subject === filterSubject;
      return matchesQuery && matchesGrade && matchesSubject;
    });
  }, [courses, searchQuery, filterGrade, filterSubject]);

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
    setIsHidden(course.isHidden ?? false);
    setInteractiveTool(course.interactiveTool || 'none');
  };

  const handleSaveCurrentCourse = () => {
    if (!activeCourse) return;

    const rulesArray = rulesArText.split('\n').filter((r) => r.trim().length > 0);

    const updatedCourseItem: CmsCourseItem = {
      ...activeCourse,
      titleAr,
      titleFr,
      grade,
      subject,
      summaryAr,
      // SEC-02: sanitized on the way in — bodyHtmlContent is explicitly HTML meant to be rendered,
      // so it's cleaned here rather than trusting every future rendering site to remember to.
      bodyHtmlContent: sanitizeHtml(bodyHtmlContent),
      rulesAr: rulesArray,
      isHidden,
      interactiveTool: interactiveTool === 'none' ? undefined : (interactiveTool as any),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = courses.map((c) => (c.id === activeCourse.id ? updatedCourseItem : c));
    onSaveCourses(updatedList);
    alert('تم حفظ التعديلات بنجاح!');
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
      isHidden: false,
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

  const handleToggleVisibility = (course: CmsCourseItem) => {
    const updatedList = courses.map((c) => (c.id === course.id ? { ...c, isHidden: !c.isHidden } : c));
    onSaveCourses(updatedList);
    if (course.id === activeCourse?.id) {
      setIsHidden(!course.isHidden);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">

      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              إدارة الدروس
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              محرر الدروس السريع
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            بحث، تصفية حسب المادة والمستوى، تعديل سريع للنص، وإظهار/إخفاء الدرس عن التلاميذ.
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
            <span>حفظ التعديلات</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Sidebar: Search, Filters & Lessons List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-2xs h-fit">
          <h3 className="font-extrabold text-xs text-slate-900 border-b pb-2">
            فهرس الدروس ({filteredCourses.length} / {courses.length})
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالعنوان أو الملخص..."
              className="w-full bg-slate-50 border border-slate-300 text-xs pr-9 pl-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value as PrimaryGrade | 'all')}
              className="w-full bg-slate-50 border border-slate-300 font-bold text-[11px] p-2 rounded-xl focus:outline-none"
            >
              <option value="all">كل المستويات</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value as SubjectId | 'all')}
              className="w-full bg-slate-50 border border-slate-300 font-bold text-[11px] p-2 rounded-xl focus:outline-none"
            >
              <option value="all">كل المواد</option>
              {SUBJECTS_LIST.map((s) => (
                <option key={s.id} value={s.id}>{s.nameAr}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredCourses.map((c) => {
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
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(c); }}
                      title={c.isHidden ? 'إظهار الدرس' : 'إخفاء الدرس'}
                      className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded cursor-pointer ${
                        c.isHidden
                          ? 'bg-slate-700 text-slate-300'
                          : isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {c.isHidden ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                      <span>{c.isHidden ? 'مخفي' : 'مرئي'}</span>
                    </button>
                  </div>

                  <h4 className="font-extrabold text-xs truncate">{c.titleAr}</h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {c.summaryAr}
                  </p>
                </div>
              );
            })}

            {filteredCourses.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">لا توجد دروس مطابقة لبحثك.</p>
            )}
          </div>
        </div>

        {/* Right Area: Quick Edit Form */}
        <div className="lg:col-span-3 space-y-5">

          {activeCourse ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">

              {/* Meta Row: Grade, Subject, Visibility Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">المستوى الدراسي:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none"
                  >
                    {GRADES.map((g) => (
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
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">ظهور الدرس للتلاميذ:</label>
                  <button
                    onClick={() => setIsHidden(!isHidden)}
                    className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs p-2 rounded-xl cursor-pointer transition-colors ${
                      isHidden ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isHidden ? 'مخفي (غير مرئي)' : 'مرئي (منشور)'}</span>
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

    </div>
  );
};
