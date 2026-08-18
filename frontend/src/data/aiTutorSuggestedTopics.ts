import { PrimaryGrade } from '../types';

export interface SuggestedTopic {
  labelAr: string;
  subjectEmoji: string;
}

// One-tap topic suggestions per grade for the AI tutor's topic field — saves a child from typing in
// Arabic on a school tablet, and keeps suggestions anchored to the official Algerian curriculum
// (see CLAUDE.md) rather than whatever a blank text box happens to invite. Four per grade, spanning
// a mix of subjects rather than one — this is a quick-pick list, not a subject-by-subject catalog.
export const AI_TUTOR_SUGGESTED_TOPICS: Record<PrimaryGrade, SuggestedTopic[]> = {
  '1AP': [
    { labelAr: 'حرف الباء وحركاته', subjectEmoji: '📖' },
    { labelAr: 'الأعداد من 6 إلى 10', subjectEmoji: '🔢' },
    { labelAr: 'الحواس الخمس', subjectEmoji: '🧪' },
    { labelAr: 'أركان الإسلام الخمسة', subjectEmoji: '🕌' },
  ],
  '2AP': [
    { labelAr: 'الشدة والتنوين', subjectEmoji: '📖' },
    { labelAr: 'الجمع بالاحتفاظ', subjectEmoji: '🔢' },
    { labelAr: 'حالات المادة الثلاث', subjectEmoji: '🧪' },
    { labelAr: 'حقوق الطفل', subjectEmoji: '🇩🇿' },
  ],
  '3AP': [
    { labelAr: 'الجملة الفعلية', subjectEmoji: '📖' },
    { labelAr: 'جدول الضرب', subjectEmoji: '🔢' },
    { labelAr: 'الدارة الكهربائية البسيطة', subjectEmoji: '🧪' },
    { labelAr: 'Les voyelles en français', subjectEmoji: '🇫🇷' },
  ],
  '4AP': [
    { labelAr: 'كان وأخواتها', subjectEmoji: '📖' },
    { labelAr: 'القسمة الإقليدية', subjectEmoji: '🔢' },
    { labelAr: 'تضاريس الجزائر', subjectEmoji: '🗺️' },
    { labelAr: 'Family in English', subjectEmoji: '🇬🇧' },
  ],
  '5AP': [
    { labelAr: 'إنّ وأخواتها', subjectEmoji: '📖' },
    { labelAr: 'حساب حجم متوازي المستطيلات', subjectEmoji: '🔢' },
    { labelAr: 'ثورة أول نوفمبر 1954', subjectEmoji: '🇩🇿' },
    { labelAr: 'Le passé composé', subjectEmoji: '🇫🇷' },
  ],
};
