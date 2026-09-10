// "Reels CMS Studio" — admin-only ad/reel factory (see components/admin/ReelsStudioModule.tsx).
// Trimmed from the AI-Studio reference spec: no likesCount/sharesCount/viewsCount/audioTrack/author
// (those model an in-app social feed for students — this tool instead generates content that gets
// exported as PNG/MP4 and posted manually to real TikTok/Instagram/Facebook accounts).

export type ReelCategory = 'math' | 'science' | 'arabic' | 'french' | 'english' | 'history' | 'general' | 'didou_tips';
export type ReelStatus = 'draft' | 'published' | 'archived';

export interface ReelSlide {
  id: string;
  title: string;
  content: string;
  subtext?: string;
  bulletPoints?: string[];
  durationSec: number;
  /** Tailwind gradient classes for the live editor preview, e.g. "from-blue-600 via-indigo-600 to-purple-700". */
  bgColor: string;
  textColor?: string;
  /** Path into REEL_SCREENSHOTS (data/reelScreenshots.ts) — an admin-picked real app screenshot to
   *  frame on this slide instead of (or alongside) plain text. Never set by Gemini (text-only). */
  screenshotUrl?: string;
}

export interface AdReel {
  id: number | null;
  title: string;
  description: string;
  gradeLevel: string; // '1AP'..'5AP' | 'all'
  category: ReelCategory;
  tags: string[];
  slides: ReelSlide[];
  status: ReelStatus;
  isAiGenerated: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReelGenerateRequest {
  topic: string;
  gradeLevel: string;
  language: 'ar' | 'fr' | 'en' | 'darija' | 'tamazight';
  slideCount: number;
}

export interface ReelScriptDraft {
  status: 'success' | 'error';
  errorMessage?: string;
  title: string;
  description: string;
  category: ReelCategory;
  tags: string[];
  slides: Omit<ReelSlide, 'id'>[];
}

/** Assigns local ids to a freshly generated draft's slides so the editor can key/reorder them. */
export function draftToEditableReel(draft: ReelScriptDraft, gradeLevel: string): AdReel {
  return {
    id: null,
    title: draft.title,
    description: draft.description,
    gradeLevel,
    category: draft.category,
    tags: draft.tags ?? [],
    slides: (draft.slides ?? []).map((slide, index) => ({
      ...slide,
      id: `slide-${Date.now()}-${index}`,
      bgColor: slide.bgColor || 'from-emerald-600 via-teal-600 to-cyan-700',
    })),
    status: 'draft',
    isAiGenerated: true,
  };
}
