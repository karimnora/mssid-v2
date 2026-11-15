import React from 'react';
import type { PrimaryGrade, SubjectId, CourseLesson } from '../types';
import { SUBJECTS_LIST } from '../data/subjectsData';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { stripArabicTashkeel } from '../utils/textFormatter';
import { useLocaleContext } from '../context/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';

interface CourseBreadcrumbProps {
  grade: PrimaryGrade;
  subjectId: SubjectId;
  trimester?: number | 'all';
  currentLesson?: CourseLesson | null;
  onHomeClick: () => void;
  onSubjectClick?: () => void;
  onTrimesterClick?: (trimester: number | 'all') => void;
  theme?: string;
  tashkeelEnabled?: boolean;
}

export const CourseBreadcrumb: React.FC<CourseBreadcrumbProps> = ({
  grade, subjectId, trimester = 'all', currentLesson, onHomeClick, onSubjectClick,
  onTrimesterClick, tashkeelEnabled = true,
}) => {
  const t = useTranslation('courses');
  const { locale, direction } = useLocaleContext();
  const subject = SUBJECTS_LIST.find(item => item.id === subjectId);
  const subjectName = (locale === 'fr' ? subject?.nameFr : subject?.nameAr) ?? subjectId;
  const Separator = direction === 'rtl' ? ChevronLeft : ChevronRight;
  return <nav aria-label={t('breadcrumbAriaLabel')} dir={direction} className="course-breadcrumb">
    <ol className="flex flex-wrap items-center gap-1 text-xs font-bold">
      <li><button type="button" onClick={onHomeClick} aria-label={t('homeTitle')}>
        <Home className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline">{t('homeLabel')}</span>
      </button></li>
      <li aria-hidden="true" className="hidden sm:block"><span className="course-breadcrumb-grade">{grade}</span></li>
      <li className="flex items-center gap-1 min-w-0">
        <Separator className="w-4 h-4 shrink-0" aria-hidden="true" />
        {onSubjectClick ? <button type="button" onClick={onSubjectClick}>{subjectName}</button> : <span>{subjectName}</span>}
      </li>
      {trimester !== 'all' && <li className="flex items-center gap-1">
        <Separator className="w-4 h-4" aria-hidden="true" />
        {onTrimesterClick || onSubjectClick
          ? <button type="button" aria-current={!currentLesson ? 'page' : undefined} onClick={() => onTrimesterClick ? onTrimesterClick(trimester) : onSubjectClick?.()}>{t('trimesterPrefixLabel')} {trimester}</button>
          : <span>{t('trimesterPrefixLabel')} {trimester}</span>}
      </li>}
      {currentLesson && <li className="sr-only" aria-current="page">{tashkeelEnabled ? currentLesson.titleAr : stripArabicTashkeel(currentLesson.titleAr)}</li>}
    </ol>
  </nav>;
};
