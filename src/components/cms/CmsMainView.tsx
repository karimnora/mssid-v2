import React, { useState, useEffect } from 'react';
import {
  CmsUser,
  CmsCurriculumProgram,
  CmsCourseItem,
  CmsExercise,
  CmsExamSpec,
  CmsAnalyticsStats,
} from '../../types/cms';
import {
  INITIAL_CMS_USERS,
  INITIAL_CURRICULUM_PROGRAM,
  INITIAL_CMS_COURSES,
  INITIAL_CMS_EXERCISES,
  INITIAL_CMS_EXAMS,
  INITIAL_CMS_ANALYTICS,
} from '../../data/cmsData';

import { CmsHeaderNav, CmsTabId } from './CmsHeaderNav';
import { AdminDashboard } from './AdminDashboard';
import { CurriculumManager } from './CurriculumManager';
import { CourseEditor } from './CourseEditor';
import { ExerciseBuilder } from './ExerciseBuilder';
import { ExamBuilder } from './ExamBuilder';
import { PdfImporter } from './PdfImporter';
import { AiGeneratorModule } from './AiGeneratorModule';
import { MediaLibrary } from './MediaLibrary';
import { SystemAuditView } from './SystemAuditView';

interface CmsMainViewProps {
  onExitCms: () => void;
}

export const CmsMainView: React.FC<CmsMainViewProps> = ({ onExitCms }) => {
  const [activeTab, setActiveTab] = useState<CmsTabId>('dashboard');
  const [currentUser, setCurrentUser] = useState<CmsUser>(INITIAL_CMS_USERS[0]);

  // Persistent States
  const [curriculum, setCurriculum] = useState<CmsCurriculumProgram>(() => {
    const saved = localStorage.getItem('mssid_cms_curriculum');
    return saved ? JSON.parse(saved) : INITIAL_CURRICULUM_PROGRAM;
  });

  const [courses, setCourses] = useState<CmsCourseItem[]>(() => {
    const saved = localStorage.getItem('mssid_cms_courses');
    return saved ? JSON.parse(saved) : INITIAL_CMS_COURSES;
  });

  const [exercises, setExercises] = useState<CmsExercise[]>(() => {
    const saved = localStorage.getItem('mssid_cms_exercises');
    return saved ? JSON.parse(saved) : INITIAL_CMS_EXERCISES;
  });

  const [exams, setExams] = useState<CmsExamSpec[]>(() => {
    const saved = localStorage.getItem('mssid_cms_exams');
    return saved ? JSON.parse(saved) : INITIAL_CMS_EXAMS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mssid_cms_curriculum', JSON.stringify(curriculum));
  }, [curriculum]);

  useEffect(() => {
    localStorage.setItem('mssid_cms_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('mssid_cms_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('mssid_cms_exams', JSON.stringify(exams));
  }, [exams]);

  // Derived Analytics stats
  const analyticsStats: CmsAnalyticsStats = {
    ...INITIAL_CMS_ANALYTICS,
    totalCourses: courses.length,
    totalExercises: exercises.length,
    totalExams: exams.length,
  };

  const handleInsertGeneratedCourse = (titleAr: string, summaryAr: string, bodyHtml: string) => {
    const newCourseItem: CmsCourseItem = {
      id: `gen_course_${Date.now()}`,
      chapterId: 'chap_math_5ap_01',
      grade: '5AP',
      subject: 'math',
      titleAr,
      summaryAr,
      bodyHtmlContent: bodyHtml,
      rulesAr: ['قاعدة مولدة تلقائياً...'],
      mediaUrls: [],
      attachments: [],
      version: 1,
      versionsHistory: [],
      workflowStatus: 'draft',
      authorName: currentUser.name,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setCourses([newCourseItem, ...courses]);
    setActiveTab('courses');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      
      {/* CMS Header Navigation */}
      <CmsHeaderNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onChangeUser={setCurrentUser}
        allUsers={INITIAL_CMS_USERS}
        onExitCms={onExitCms}
      />

      {/* Active Tab Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {activeTab === 'dashboard' && (
          <AdminDashboard
            analytics={analyticsStats}
            courses={courses}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumManager
            curriculum={curriculum}
            onSaveCurriculum={setCurriculum}
          />
        )}

        {activeTab === 'courses' && (
          <CourseEditor
            courses={courses}
            onSaveCourses={setCourses}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseBuilder
            exercises={exercises}
            onSaveExercises={setExercises}
          />
        )}

        {activeTab === 'exams' && (
          <ExamBuilder
            exams={exams}
            exercises={exercises}
            onSaveExams={setExams}
          />
        )}

        {activeTab === 'import_pdf' && (
          <PdfImporter
            onCommitImportedChapters={(session) => {
              // Automatically convert detected chapters into curriculum chapters
              const newChapters = session.detectedChapters.map((c, idx) => ({
                id: `chap_imp_${Date.now()}_${idx}`,
                grade: session.detectedGrade,
                subject: session.detectedSubject,
                code: `CH-IMP-${idx + 1}`,
                titleAr: c.titleAr,
                order: curriculum.chapters.length + idx + 1,
                competencies: c.competenciesAr.map((comp, cIdx) => ({
                  id: `comp_imp_${Date.now()}_${cIdx}`,
                  code: `COMP-${cIdx + 1}`,
                  domainAr: 'الميدان المستورد',
                  descriptionAr: comp,
                })),
                subLessons: c.lessonsAr.map((les, lIdx) => ({
                  id: `sub_imp_${Date.now()}_${lIdx}`,
                  titleAr: les,
                  order: lIdx + 1,
                  objectives: [],
                  contentAr: 'محتوى مستورد من وثيقة الوزارة...',
                })),
              }));

              setCurriculum({
                ...curriculum,
                chapters: [...curriculum.chapters, ...newChapters],
              });
            }}
          />
        )}

        {activeTab === 'ai_generator' && (
          <AiGeneratorModule
            onInsertGeneratedCourse={handleInsertGeneratedCourse}
          />
        )}

        {activeTab === 'media_library' && (
          <MediaLibrary />
        )}

        {activeTab === 'audit' && (
          <SystemAuditView
            courses={courses}
            exercises={exercises}
            exams={exams}
            curriculum={curriculum}
          />
        )}

      </main>

    </div>
  );
};
