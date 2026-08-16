import React, { useState } from 'react';
import { CmsCurriculumProgram, CmsChapter, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  GitFork,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  BookOpen,
  Award,
  Layers,
  ChevronDown,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/subjectsData';

interface CurriculumManagerProps {
  curriculum: CmsCurriculumProgram;
  onSaveCurriculum: (updated: CmsCurriculumProgram) => void;
}

export const CurriculumManager: React.FC<CurriculumManagerProps> = ({
  curriculum,
  onSaveCurriculum,
}) => {
  const [prog, setProg] = useState<CmsCurriculumProgram>(curriculum);
  const [selectedGrade, setSelectedGrade] = useState<PrimaryGrade>(prog.grade || '5AP');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(prog.subject || 'math');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // New chapter form inputs
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterCode, setNewChapterCode] = useState('');
  const [newCompetencyDesc, setNewCompetencyDesc] = useState('');

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;

    const newChap: CmsChapter = {
      id: `chap_${Date.now()}`,
      grade: selectedGrade,
      subject: selectedSubject,
      code: newChapterCode || `CH-${Date.now().toString().slice(-3)}`,
      titleAr: newChapterTitle,
      order: prog.chapters.length + 1,
      competencies: newCompetencyDesc
        ? [
            {
              id: `comp_${Date.now()}`,
              code: `COMP-${Date.now().toString().slice(-4)}`,
              domainAr: 'المجال البيداغوجي العام',
              descriptionAr: newCompetencyDesc,
            },
          ]
        : [],
      subLessons: [],
    };

    const updated = {
      ...prog,
      grade: selectedGrade,
      subject: selectedSubject,
      updatedAt: new Date().toISOString().slice(0, 10),
      chapters: [...prog.chapters, newChap],
    };

    setProg(updated);
    onSaveCurriculum(updated);
    setNewChapterTitle('');
    setNewChapterCode('');
    setNewCompetencyDesc('');
  };

  const handleDeleteChapter = (chapId: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذا المحور والميادين الملحقة به؟')) {
      const updated = {
        ...prog,
        chapters: prog.chapters.filter((c) => c.id !== chapId),
      };
      setProg(updated);
      onSaveCurriculum(updated);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              المنهاج الوطني الرسمي
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              إدارة الهيكلة التعليمية والميادين البيداغوجية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            المنظومة: {prog.schoolSystem} ({prog.country}) — السنة الدراسية: {prog.academicYear}
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={() => onSaveCurriculum(prog)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التغييرات في الهيكلة</span>
        </button>
      </div>

      {/* Selectors Bar: Grade Level & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
        
        {/* Grade Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">المستوى الدراسي المستهدف:</label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['1AP', '2AP', '3AP', '4AP', '5AP'] as PrimaryGrade[]).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">المادة التعليمية:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
            className="w-full bg-slate-800 text-amber-300 border border-slate-700 font-bold text-xs p-2.5 rounded-xl focus:outline-none cursor-pointer"
          >
            {SUBJECTS_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameAr} ({s.nameFr})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Chapters & Competencies Tree Hierarchy */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>ميادين وفصول المنهاج المعتمدة ({selectedGrade} - {SUBJECTS_LIST.find((s) => s.id === selectedSubject)?.nameAr})</span>
        </h3>

        {/* Existing Chapters List */}
        <div className="space-y-4">
          {prog.chapters
            .filter((c) => c.grade === selectedGrade && c.subject === selectedSubject)
            .map((chap, idx) => (
              <div
                key={chap.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{chap.code}</span>
                        <h4 className="font-extrabold text-sm text-slate-900">{chap.titleAr}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteChapter(chap.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف الفصل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Competencies Section */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block">المركبات والكفاءات البيداغوجية المكتسبة:</span>
                  {chap.competencies.length > 0 ? (
                    <div className="space-y-2">
                      {chap.competencies.map((comp) => (
                        <div key={comp.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-sans flex items-start gap-2">
                          <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono font-bold text-emerald-700 ml-1">[{comp.code}]</span>
                            <span className="text-slate-800">{comp.descriptionAr}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">لم يتم إدراج كفاءات صريحة لهذا الفصل بعد.</p>
                  )}
                </div>

                {/* Sub-lessons list inside chapter */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">الدروس المندرجة تحت هذا الميدان:</span>
                  {chap.subLessons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chap.subLessons.map((sub) => (
                        <div key={sub.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                            <span>{sub.titleAr}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">درس #{sub.order}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">لا توجد دروس فرعية مسجلة.</p>
                  )}
                </div>

              </div>
            ))}
        </div>

        {/* Add New Chapter Card Form */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-5 space-y-4 shadow-md">
          <h4 className="font-extrabold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إضافة ميدان / فصل تعليمي جديد ({selectedGrade})</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">رمز الفصل (رمز الكود):</label>
              <input
                type="text"
                placeholder="مثال: CH-M504"
                value={newChapterCode}
                onChange={(e) => setNewChapterCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs p-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-400 mb-1">عنوان الميدان / الفصل:</label>
              <input
                type="text"
                placeholder="عنوان الميدان (مثال: الميدان الرابع: القياس والتحويل)"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs p-2.5 rounded-xl focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">الكفاءة الختامية المستهدفة:</label>
            <textarea
              rows={2}
              placeholder="شرح الكفاءات البيداغوجية المستهدفة التي يجب أن يتحصل عليها التلميذ نهاية الفصل..."
              value={newCompetencyDesc}
              onChange={(e) => setNewCompetencyDesc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs p-2.5 rounded-xl focus:outline-none font-sans"
            />
          </div>

          <button
            onClick={handleAddChapter}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-xs"
          >
            إضافة الميدان إلى المنهاج الرسمي
          </button>
        </div>

      </div>

    </div>
  );
};
