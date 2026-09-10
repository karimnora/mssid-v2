// Curated real screenshots of the live app (captured via Playwright against the actual routes, see
// the project's screenshot-capture workflow) for the Reels Studio ("usine de pub", see
// components/admin/ReelsStudioModule.tsx) — an admin can attach one of these to a slide instead of
// (or alongside) plain text, so a reel can genuinely show the app rather than just describe it.
export interface ReelScreenshot {
  id: string;
  labelAr: string;
  url: string;
}

export const REEL_SCREENSHOTS: ReelScreenshot[] = [
  { id: 'home', labelAr: 'الصفحة الرئيسية', url: '/reel-screenshots/home.png' },
  { id: 'labs-hub', labelAr: 'قائمة المختبرات التفاعلية', url: '/reel-screenshots/labs-hub.png' },
  { id: 'lab-multiplication', labelAr: 'مختبر جدول الضرب', url: '/reel-screenshots/lab-multiplication.png' },
  { id: 'exams', labelAr: 'بنك الامتحانات والاختبارات', url: '/reel-screenshots/exams.png' },
  { id: 'preschool', labelAr: 'وضع التحضيري', url: '/reel-screenshots/preschool.png' },
];
