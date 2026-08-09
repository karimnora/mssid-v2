import React from 'react';
import { PrimaryGrade, SubjectId, CourseLesson } from '../types';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Home, ChevronLeft, GraduationCap, BookOpen, FileText, Layers } from 'lucide-react';

interface CourseBreadcrumbProps {
  grade: PrimaryGrade;
  subjectId: SubjectId;
  trimester?: number | 'all';
  currentLesson?: CourseLesson | null;
  onHomeClick: () => void;
  onSubjectClick?: () => void;
  onTrimesterClick?: (trimester: number | 'all') => void;
  theme?: string;
}

const GRADE_LABELS: Record<PrimaryGrade, string> = {
  '1AP': 'السنة الأولى ابتدائي (1AP)',
  '2AP': 'السنة الثانية ابتدائي (2AP)',
  '3AP': 'السنة الثالثة ابتدائي (3AP)',
  '4AP': 'السنة الرابعة ابتدائي (4AP)',
  '5AP': 'السنة الخامسة ابتدائي (5AP)',
};

export const CourseBreadcrumb: React.FC<CourseBreadcrumbProps> = ({
  grade,
  subjectId,
  trimester = 'all',
  currentLesson,
  onHomeClick,
  onSubjectClick,
  onTrimesterClick,
}) => {
  const subjectInfo = SUBJECTS_LIST.find((s) => s.id === subjectId);
  const subjectName = subjectInfo ? subjectInfo.nameAr : subjectId;

  return (
    <nav aria-label="Fil d'ariane / مسار التصفح" className="dir-rtl" dir="rtl">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-bold text-slate-600 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xs p-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
        {/* 1. Accueil / الرئيسية */}
        <li className="flex items-center gap-1">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-1 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-extrabold transition-colors cursor-pointer px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60"
            title="العودة للصفحة الرئيسية"
          >
            <Home className="w-3.5 h-3.5 text-indigo-500" />
            <span>الرئيسية</span>
          </button>
        </li>

        {/* Separator */}
        <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* 2. Grade / المستوى الدراسي */}
        <li className="flex items-center gap-1">
          <button
            onClick={() => {
              if (onSubjectClick) onSubjectClick();
            }}
            className="flex items-center gap-1 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-bold transition-colors cursor-pointer px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60"
            title={`تصفح دروس ${GRADE_LABELS[grade]}`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
            <span>{grade}</span>
          </button>
        </li>

        {/* Separator */}
        <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* 3. Subject / المادة */}
        <li className="flex items-center gap-1">
          <button
            onClick={() => {
              if (onSubjectClick) onSubjectClick();
            }}
            className={`flex items-center gap-1 font-bold transition-colors cursor-pointer px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
              !currentLesson && trimester === 'all'
                ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'
            }`}
            title={`مادة ${subjectName}`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>{subjectName}</span>
          </button>
        </li>

        {/* 4. Trimester / الفصل (Optional) */}
        {trimester !== 'all' && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (onTrimesterClick) onTrimesterClick(trimester);
                  if (onSubjectClick) onSubjectClick();
                }}
                className={`flex items-center gap-1 font-bold transition-colors cursor-pointer px-1.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 ${
                  !currentLesson
                    ? 'text-purple-600 dark:text-purple-400 font-black bg-purple-50 dark:bg-purple-950/40'
                    : 'text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>الفصل {trimester}</span>
              </button>
            </li>
          </>
        )}

        {/* 5. Current Lesson / الدرس الحالي */}
        {currentLesson && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="flex items-center gap-1 max-w-[200px] sm:max-w-[320px] truncate">
              <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 font-extrabold bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-1 rounded-lg border border-indigo-200/80 dark:border-indigo-800/80 truncate">
                <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{currentLesson.titleAr}</span>
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
