import { CourseLesson, LessonMediaAsset } from '../types';

/** Publication blockers; never infer official compliance from a title or an emoji. */
export function getCoursePublicationIssues(lesson: CourseLesson): string[] {
  const issues: string[] = [];
  if (lesson.contentSource !== 'official_verified') issues.push('curriculum_not_officially_verified');
  if (!lesson.curriculumAlignment) issues.push('curriculum_alignment_missing');
  for (const asset of lesson.mediaAssets ?? []) {
    issues.push(...getMediaPublicationIssues(asset).map((issue) => `${asset.id}:${issue}`));
  }
  return issues;
}

export function getMediaPublicationIssues(asset: LessonMediaAsset): string[] {
  const issues: string[] = [];
  if (!asset.src) issues.push('source_file_missing');
  if (!asset.pedagogicalPurposeAr) issues.push('pedagogical_purpose_missing');
  if (!asset.source) issues.push('asset_source_missing');
  if (!asset.reviewedAt) issues.push('review_date_missing');
  if (asset.type !== 'audio' && !asset.altAr) issues.push('alt_text_missing');
  if (asset.type === 'audio' && (!asset.language || !asset.transcript)) issues.push('audio_review_data_missing');
  return issues;
}
