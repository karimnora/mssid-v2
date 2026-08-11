import { springBootApi } from './springBootApi';
import type {
  CmsCourseItem,
  CmsExamSpec,
  CmsExercise,
  CmsCurriculumProgram,
} from '../types/cms';

export const cmsApi = {
  getCourses() {
    return springBootApi.request<CmsCourseItem[]>('/v1/cms/courses', { method: 'GET' });
  },

  bulkSaveCourses(courses: CmsCourseItem[]) {
    return springBootApi.request<CmsCourseItem[]>('/v1/cms/courses/bulk', {
      method: 'PUT',
      body: JSON.stringify(courses),
    });
  },

  getExercises() {
    return springBootApi.request<CmsExercise[]>('/v1/cms/exercises', { method: 'GET' });
  },

  bulkSaveExercises(exercises: CmsExercise[]) {
    return springBootApi.request<CmsExercise[]>('/v1/cms/exercises/bulk', {
      method: 'PUT',
      body: JSON.stringify(exercises),
    });
  },

  getExams() {
    return springBootApi.request<CmsExamSpec[]>('/v1/cms/exams', { method: 'GET' });
  },

  bulkSaveExams(exams: CmsExamSpec[]) {
    return springBootApi.request<CmsExamSpec[]>('/v1/cms/exams/bulk', {
      method: 'PUT',
      body: JSON.stringify(exams),
    });
  },

  getCurriculum() {
    return springBootApi.request<CmsCurriculumProgram[]>('/v1/cms/curriculum', { method: 'GET' });
  },

  bulkSaveCurriculum(curricula: CmsCurriculumProgram[]) {
    return springBootApi.request<CmsCurriculumProgram[]>('/v1/cms/curriculum/bulk', {
      method: 'PUT',
      body: JSON.stringify(curricula),
    });
  },
};
