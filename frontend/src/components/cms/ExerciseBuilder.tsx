import React, { useState } from 'react';
import { CmsExercise, ExerciseType, ExerciseDifficulty, PrimaryGrade, SubjectId } from '../../types/cms';
import {
  CheckSquare,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { SUBJECTS_LIST } from '../../data/subjectsData';

interface ExerciseBuilderProps {
  exercises: CmsExercise[];
  onSaveExercises: (updated: CmsExercise[]) => void;
}

const TYPE_LABELS: Record<ExerciseType, string> = {
  qcm: 'اختيارات متعددة (QCM)',
  true_false: 'صحيح أو خطأ (Vrai/Faux)',
  fill_blanks: 'تعبئة الفراغات (Fill Blanks)',
  drag_drop: 'سحب وإفلات (Drag & Drop)',
  matching: 'ربط العبارات (Matching)',
  calculation: 'حساب وتطبيق عددي',
  free_response: 'إجابة حرة وتقييم معتمد',
};

export const ExerciseBuilder: React.FC<ExerciseBuilderProps> = ({
  exercises,
  onSaveExercises,
}) => {
  const [selectedExId, setSelectedExId] = useState<string>(exercises[0]?.id || '');
  const activeEx = exercises.find((e) => e.id === selectedExId) || exercises[0];

  // Editable Form State
  const [titleAr, setTitleAr] = useState(activeEx?.titleAr || '');
  const [type, setType] = useState<ExerciseType>(activeEx?.type || 'qcm');
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>(activeEx?.difficulty || 'easy');
  const [grade, setGrade] = useState<PrimaryGrade>(activeEx?.grade || '5AP');
  const [subject, setSubject] = useState<SubjectId>(activeEx?.subject || 'math');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(activeEx?.estimatedMinutes || 5);
  const [pointsXp, setPointsXp] = useState<number>(activeEx?.pointsXp || 15);
  const [questionAr, setQuestionAr] = useState(activeEx?.questionAr || '');
  const [fillBlanksTextAr, setFillBlanksTextAr] = useState(activeEx?.fillBlanksTextAr || '');
  const [correctSolutionAr, setCorrectSolutionAr] = useState(activeEx?.correctSolutionAr || '');
  const [stepByStepExplanationAr, setStepByStepExplanationAr] = useState(activeEx?.stepByStepExplanationAr || '');

  // QCM Options State
  const [qcmOptions, setQcmOptions] = useState(activeEx?.options || [
    { id: 'opt_1', textAr: 'خيار 1', isCorrect: true, explanationAr: 'تعليل الخيار الصحيح' },
    { id: 'opt_2', textAr: 'خيار 2', isCorrect: false },
  ]);

  const handleSelectEx = (ex: CmsExercise) => {
    setSelectedExId(ex.id);
    setTitleAr(ex.titleAr);
    setType(ex.type);
    setDifficulty(ex.difficulty);
    setGrade(ex.grade);
    setSubject(ex.subject);
    setEstimatedMinutes(ex.estimatedMinutes);
    setPointsXp(ex.pointsXp);
    setQuestionAr(ex.questionAr);
    setFillBlanksTextAr(ex.fillBlanksTextAr || '');
    setCorrectSolutionAr(ex.correctSolutionAr);
    setStepByStepExplanationAr(ex.stepByStepExplanationAr);
    setQcmOptions(ex.options || []);
  };

  const handleSaveCurrentExercise = () => {
    if (!activeEx) return;

    const updatedEx: CmsExercise = {
      ...activeEx,
      titleAr,
      type,
      difficulty,
      grade,
      subject,
      estimatedMinutes,
      pointsXp,
      questionAr,
      fillBlanksTextAr: type === 'fill_blanks' ? fillBlanksTextAr : undefined,
      options: type === 'qcm' || type === 'true_false' ? qcmOptions : undefined,
      correctSolutionAr,
      stepByStepExplanationAr,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = exercises.map((e) => (e.id === activeEx.id ? updatedEx : e));
    onSaveExercises(updatedList);
    alert('تم حفظ التمرين التفاعلي في بنك التمارين بنجاح!');
  };

  const handleCreateNewExercise = () => {
    const newEx: CmsExercise = {
      id: `ex_${Date.now()}`,
      chapterId: 'chap_math_5ap_01',
      grade: '5AP',
      subject: 'math',
      titleAr: 'تمرين جديد',
      type: 'qcm',
      difficulty: 'easy',
      estimatedMinutes: 5,
      pointsXp: 15,
      questionAr: 'نص السؤال الجديد...',
      options: [
        { id: 'o1', textAr: 'إجابة صحيحة', isCorrect: true },
        { id: 'o2', textAr: 'إجابة خاطئة', isCorrect: false },
      ],
      correctSolutionAr: 'الحل النهائي...',
      stepByStepExplanationAr: 'الشرح والتوضيح خطوة بخطوة...',
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = [newEx, ...exercises];
    onSaveExercises(updatedList);
    handleSelectEx(newEx);
  };

  const handleDeleteExercise = (id: string) => {
    if (window.confirm('هل أنت تأكد من حذف هذا التمرين من البنك؟')) {
      const updatedList = exercises.filter((e) => e.id !== id);
      onSaveExercises(updatedList);
      if (updatedList.length > 0) {
        handleSelectEx(updatedList[0]);
      }
    }
  };

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              Banque d'Exercices CMS
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              منشئ التمارين والأسئلة التفاعلية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إنشاء وتعديل التمارين بمختلف الأنواع (QCM، Vrai/Faux، Fill-blanks) مع سلم نقاط XP والتعليل البيداغوجي.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewExercise}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>تمرين جديد</span>
          </button>

          <button
            onClick={handleSaveCurrentExercise}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التمرين</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left List of Exercises */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-4 space-y-3 shadow-2xs h-fit">
          <h3 className="font-extrabold text-xs text-slate-900 flex items-center justify-between border-b pb-2">
            <span>بنك التمارين ({exercises.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">QCM / CALC</span>
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {exercises.map((ex) => {
              const isSelected = ex.id === activeEx?.id;

              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectEx(ex)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-right space-y-1 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ex.grade}
                    </span>
                    <span className="text-[9px] font-mono text-amber-400">+{ex.pointsXp} XP</span>
                  </div>

                  <h4 className="font-extrabold text-xs truncate">{ex.titleAr}</h4>
                  <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {TYPE_LABELS[ex.type]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor Form */}
        <div className="lg:col-span-3 space-y-5">
          
          {activeEx ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-5">
              
              {/* Properties Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">نوع التمرين:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ExerciseType)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none"
                  >
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">درجة الصعوبة:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none"
                  >
                    <option value="easy">سهل (Débutant)</option>
                    <option value="medium">متوسط (Moyen)</option>
                    <option value="hard">متقدم (Avancé)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">الزمن التقديري (دقائق):</label>
                  <input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">نقاط المكافأة (XP):</label>
                  <input
                    type="number"
                    value={pointsXp}
                    onChange={(e) => setPointsXp(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 font-bold text-xs p-2 rounded-xl focus:outline-none font-mono text-amber-600"
                  />
                </div>

              </div>

              {/* Title & Question text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان التمرين:</label>
                <input
                  type="text"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm p-3 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نص السؤال / الإشكالية البيداغوجية:</label>
                <textarea
                  rows={3}
                  value={questionAr}
                  onChange={(e) => setQuestionAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs p-3 rounded-xl focus:outline-none font-sans leading-relaxed"
                />
              </div>

              {/* Dynamic Sub-Form based on Type */}
              {type === 'fill_blanks' && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <label className="block text-xs font-bold text-amber-900">
                    نص الأقواس التفاعلي (ضع الكلمات المراد ملؤها داخل أقواس مربع [مثال]):
                  </label>
                  <textarea
                    rows={2}
                    value={fillBlanksTextAr}
                    onChange={(e) => setFillBlanksTextAr(e.target.value)}
                    className="w-full bg-white border border-amber-300 text-slate-900 text-xs p-3 rounded-xl focus:outline-none font-mono"
                  />
                </div>
              )}

              {(type === 'qcm' || type === 'true_false') && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">خيارات السؤال (QCM Options):</label>
                    <button
                      onClick={() => setQcmOptions([...qcmOptions, { id: `opt_${Date.now()}`, textAr: 'خيار جديد', isCorrect: false }])}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      + إضافة خيار
                    </button>
                  </div>

                  <div className="space-y-2">
                    {qcmOptions.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            const updated = qcmOptions.map((o) => (o.id === opt.id ? { ...o, isCorrect: e.target.checked } : o));
                            setQcmOptions(updated);
                          }}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt.textAr}
                          onChange={(e) => {
                            const updated = qcmOptions.map((o) => (o.id === opt.id ? { ...o, textAr: e.target.value } : o));
                            setQcmOptions(updated);
                          }}
                          className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
                        />
                        <button
                          onClick={() => setQcmOptions(qcmOptions.filter((o) => o.id !== opt.id))}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution & Step by Step Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الحل والنتيجة النهائية المختصرة:</label>
                  <textarea
                    rows={3}
                    value={correctSolutionAr}
                    onChange={(e) => setCorrectSolutionAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-emerald-900 font-bold text-xs p-3 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الشرح والتعليل البيداغوجي المنهجي:</label>
                  <textarea
                    rows={3}
                    value={stepByStepExplanationAr}
                    onChange={(e) => setStepByStepExplanationAr(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs p-3 rounded-xl focus:outline-none font-sans"
                  />
                </div>
              </div>

              {/* Delete Action */}
              <div className="pt-3 border-t flex justify-end">
                <button
                  onClick={() => handleDeleteExercise(activeEx.id)}
                  className="flex items-center gap-1 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف هذا التمرين</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500">
              اختر تمرين من القائمة أو أضف تمرين جديد.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
