import { describe, expect, it } from 'vitest';
import { CourseLesson, LessonMediaAsset } from '../types';
import { getCoursePublicationIssues, getMediaPublicationIssues } from './courseQuality';

const lesson: CourseLesson = {
  id: 'quality-sample', grade: '4AP', subject: 'science', categoryAr: 'علوم', titleAr: 'درس', summaryAr: 'ملخص', rulesAr: ['قاعدة'], quiz: [],
};

describe('course publication quality gate', () => {
  it('blocks a course without explicit curriculum verification and alignment', () => {
    expect(getCoursePublicationIssues(lesson)).toEqual(['curriculum_not_officially_verified', 'curriculum_alignment_missing']);
  });

  it('requires a traceable, reviewed and accessible media asset', () => {
    const image: LessonMediaAsset = { id: 'image-1', type: 'image', src: '', altAr: '', pedagogicalPurposeAr: '', source: '', reviewedAt: '' };
    expect(getMediaPublicationIssues(image)).toEqual(['source_file_missing', 'pedagogical_purpose_missing', 'asset_source_missing', 'review_date_missing', 'alt_text_missing']);
  });
});
