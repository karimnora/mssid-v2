import React, { useState } from 'react';
import { CmsExamSpec, CmsExercise, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  Award,
  Plus,
  Trash2,
  Save,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface ExamBuilderProps {
  exams: CmsExamSpec[];
  exercises: CmsExercise[];
  onSaveExams: (updated: CmsExamSpec[]) => void;
}

export const ExamBuilder: React.FC<ExamBuilderProps> = ({
  exams,
  exercises,
  onSaveExams,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Form State
  const [titleAr, setTitleAr] = useState(activeExam?.titleAr || '');
  const [sessionAr, setSessionAr] = useState(activeExam?.sessionAr || '');
  const [year, setYear] = useState<number>(activeExam?.year || 2026);
  const [grade, setGrade] = useState<PrimaryGrade>(activeExam?.grade || '5AP');
  const [subject, setSubject] = useState<SubjectId>(activeExam?.subject || 'math');
  const [durationMinutes, setDurationMinutes] = useState<number>(activeExam?.durationMinutes || 90);
  const [totalPoints, setTotalPoints] = useState<number>(activeExam?.totalPoints || 10);
  const [passingScore, setPassingScore] = useState<number>(activeExam?.passingScore || 5);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(activeExam?.exerciseIds || []);
  const [autoGradingEnabled, setAutoGradingEnabled] = useState<boolean>(activeExam?.autoGradingEnabled ?? true);

  const handleSelectExam = (ex: CmsExamSpec) => {
    setSelectedExamId(ex.id);
    setTitleAr(ex.titleAr);
    setSessionAr(ex.sessionAr);
    setYear(ex.year);
    setGrade(ex.grade);
    setSubject(ex.subject);
    setDurationMinutes(ex.durationMinutes);
    setTotalPoints(ex.totalPoints);
    setPassingScore(ex.passingScore);
    setSelectedExerciseIds(ex.exerciseIds || []);
    setAutoGradingEnabled(ex.autoGradingEnabled);
  };

  const handleSaveCurrentExam = () => {
    if (!activeExam) return;

    const updatedExam: CmsExamSpec = {
      ...activeExam,
      titleAr,
      sessionAr,
      year,
      grade,
      subject,
      durationMinutes,
      totalPoints,
      passingScore,
      exerciseIds: selectedExerciseIds,
      autoGradingEnabled,
    };

    const updatedList = exams.map((e) => (e.id === activeExam.id ? updatedExam : e));
    onSaveExams(updatedList);
    alert('تم حفظ موصفات الامتحان وشبكة التنقيط بنجاح!');
  };

  const handleCreateNewExam = () => {
    const newExam: CmsExamSpec = {
      id: `exam_spec_${Date.now()}`,
      grade: '5AP',
      subject: 'math',
      year: 2026,
      sessionAr: 'دورة جوان التجريبية',
      titleAr: 'امتحان شهادة التعليم الابتدائي - رياضيات',
      durationMinutes: 90,
      totalPoints: 10,
      passingScore: 5,
      exerciseIds: exercises.slice(0, 2).map((e) => e.id),
      autoGradingEnabled: true,
      authorName: 'المفتش التربوي',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = [newExam, ...exams];
    onSaveExams(updatedList);
    handleSelectExam(newExam);
  };

  const toggleExerciseSelection = (exId: string) => {
    if (selectedExerciseIds.includes(exId)) {
      setSelectedExerciseIds(selectedExerciseIds.filter((id) => id !== exId));
    } else {
      setSelectedExerciseIds([...selectedExerciseIds, exId]);
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              Générateur d'Examens 5AP
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              منشئ ومجمّع الامتحانات الرسمية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            تركيب مواضيع الامتحانات، ضبط الوقت، السلم المئوي، والتصحيح الآلي الفوري.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewExam}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إنشاء موضوع امتحان</span>
          </button>

          <button
            onClick={handleSaveCurrentExam}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ موضوع الامتحان</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Exams List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-2xs h-fit">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center justify-between border-b pb-2">
            <span>مواضيع الامتحانات ({exams.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">2008-2026</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {exams.map((ex) => {
              const isSelected = ex.id === activeExam?.id;

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectExam(ex)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-right space-y-1 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-900">
                      {ex.year}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400">{ex.durationMinutes} دقيقة</span>
                  </div>

                  <h4 className="font-extrabold text-xs truncate">{ex.titleAr}</h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {ex.sessionAr}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-3 space-y-5">
          {activeExam ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              
              {/* Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">السنة الدراسية:</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">المدة الزمني بالدقائق:</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">النقطة الإجمالية:</label>
                  <input
                    type="number"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">علامة الاستحقاق (النجاح):</label>
                  <input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono text-emerald-700"
                  />
                </div>
              </div>

              {/* Title & Session */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عنوان موضوع الامتحان:</label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-extrabold text-sm p-3 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدورة والدفعة البيداغوجية:</label>
                  <input
                    type="text"
                    value={sessionAr}
                    onChange={(e) => setSessionAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs p-3 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Exercises Picker */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-slate-900">
                    تجميع التمارين المدرجة في الامتحان ({selectedExerciseIds.length} تمارين مختارة):
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">اختر من بنك التمارين</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {exercises.map((ex) => {
                    const isChecked = selectedExerciseIds.includes(ex.id);

                    return (
                      <div
                        key={ex.id}
                        onClick={() => toggleExerciseSelection(ex.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked ? 'bg-purple-50 border-purple-300 text-purple-950 font-bold' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handled by div click
                            className="w-4 h-4 rounded text-purple-600 focus:ring-0"
                          />
                          <span className="text-xs">{ex.titleAr}</span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          +{ex.pointsXp} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auto grading toggle */}
              <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white">التصحيح التلقائي المباشر (Auto-Grading)</h4>
                  <p className="text-[11px] text-slate-400">تفعيل التصحيح الآلي الفوري وإبراز السلم المئوي للحل النموذج فور تسليم الإجابات.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoGradingEnabled}
                  onChange={(e) => setAutoGradingEnabled(e.target.checked)}
                  className="w-5 h-5 text-emerald-500 rounded focus:ring-0 cursor-pointer"
                />
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
              اختر موضوع امتحان لتعديله.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
