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
  INITIAL_CMS_CURRICULUM_PROGRAM,
  INITIAL_CMS_ANALYTICS,
} from '../../data/cmsData';
import { cmsApi } from '../../services/cmsApi';

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
  const [curriculum, setCurriculum] = useState<CmsCurriculumProgram>(INITIAL_CMS_CURRICULUM_PROGRAM);
  const [courses, setCourses] = useState<CmsCourseItem[]>([]);
  const [exercises, setExercises] = useState<CmsExercise[]>([]);
  const [exams, setExams] = useState<CmsExamSpec[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCmsData() {
      setIsLoading(true);
      setError(null);

      try {
        const [coursesRes, exercisesRes, examsRes, curriculumRes] = await Promise.all([
          cmsApi.getCourses(),
          cmsApi.getExercises(),
          cmsApi.getExams(),
          cmsApi.getCurriculum(),
        ]);

        if (coursesRes.error || exercisesRes.error || examsRes.error || curriculumRes.error) {
          throw new Error(
            coursesRes.error || exercisesRes.error || examsRes.error || curriculumRes.error || 'Erreur de chargement CMS'
          );
        }

        setCourses(coursesRes.data || []);
        setExercises(exercisesRes.data || []);
        setExams(examsRes.data || []);
        setCurriculum((curriculumRes.data || [])[0] || INITIAL_CMS_CURRICULUM_PROGRAM);
      } catch (fetchError: any) {
        console.error('Erreur de chargement CMS:', fetchError);
        setError(fetchError?.message || 'Impossible de charger les données CMS');
      } finally {
        setIsLoading(false);
      }
    }

    loadCmsData();
  }, []);

  const handleSaveCourses = async (updatedCourses: CmsCourseItem[]) => {
    setCourses(updatedCourses);
    const result = await cmsApi.bulkSaveCourses(updatedCourses);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setCourses(result.data);
    }
  };

  const handleSaveExercises = async (updatedExercises: CmsExercise[]) => {
    setExercises(updatedExercises);
    const result = await cmsApi.bulkSaveExercises(updatedExercises);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setExercises(result.data);
    }
  };

  const handleSaveExams = async (updatedExams: CmsExamSpec[]) => {
    setExams(updatedExams);
    const result = await cmsApi.bulkSaveExams(updatedExams);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setExams(result.data);
    }
  };

  const handleSaveCurriculum = async (updatedCurriculum: CmsCurriculumProgram) => {
    setCurriculum(updatedCurriculum);
    const result = await cmsApi.bulkSaveCurriculum([updatedCurriculum]);
    if (result.error) {
      setError(result.error);
    } else if (result.data && result.data.length > 0) {
      setCurriculum(result.data[0]);
    }
  };

  // Derived Analytics stats
  const analyticsStats: CmsAnalyticsStats = {
    ...INITIAL_CMS_ANALYTICS,
    totalCourses: courses.length,
    totalExercises: exercises.length,
    totalExams: exams.length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700">
        <div className="text-center space-y-3 p-6 rounded-3xl bg-white shadow-lg">
          <div className="animate-pulse text-3xl font-black">Chargement CMS...</div>
          <p className="text-sm text-slate-500">Connexion au serveur et synchronisation des contenus pédagogiques.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-700 p-6">
        <div className="max-w-xl text-center space-y-4 p-6 rounded-3xl bg-white shadow-lg border border-rose-200">
          <h2 className="text-xl font-black text-rose-700">Erreur CMS</h2>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-bold hover:bg-slate-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const handleInsertGeneratedCourse = async (titleAr: string, summaryAr: string, bodyHtml: string) => {
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

    const updated = [newCourseItem, ...courses];
    await handleSaveCourses(updated);
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
            onSaveCurriculum={handleSaveCurriculum}
          />
        )}

        {activeTab === 'courses' && (
          <CourseEditor
            courses={courses}
            onSaveCourses={handleSaveCourses}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseBuilder
            exercises={exercises}
            onSaveExercises={handleSaveExercises}
          />
        )}

        {activeTab === 'exams' && (
          <ExamBuilder
            exams={exams}
            exercises={exercises}
            onSaveExams={handleSaveExams}
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
