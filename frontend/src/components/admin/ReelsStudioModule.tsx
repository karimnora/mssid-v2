import React, { useEffect, useRef, useState } from 'react';
import { Clapperboard, RefreshCw, Sparkles, Save, Image as ImageIcon, Film, Trash2, Pencil, Plus, X, AlertTriangle, Volume2, Loader2 } from 'lucide-react';
import { springBootApi } from '../../services/springBootApi';
import { AdReel, ReelCategory, ReelGenerateRequest, ReelSlide, draftToEditableReel } from '../../types/reels';
import { downloadReelAsImages } from '../../utils/reelSlideImage';
import { downloadReelAsVideo } from '../../utils/reelVideoExport';
import { pcmBase64ToWavBlob } from '../../utils/reelAudio';
import { Didou3DAvatar } from '../Didou3DAvatar';
import { REEL_SCREENSHOTS } from '../../data/reelScreenshots';

type SlideNarrationState = 'idle' | 'loading' | 'ready' | 'error';

const GRADE_OPTIONS = ['1AP', '2AP', '3AP', '4AP', '5AP', 'all'];
const CATEGORY_OPTIONS: { id: ReelCategory; labelAr: string }[] = [
  { id: 'math', labelAr: 'رياضيات' },
  { id: 'science', labelAr: 'علوم' },
  { id: 'arabic', labelAr: 'عربية' },
  { id: 'french', labelAr: 'فرنسية' },
  { id: 'english', labelAr: 'إنجليزية' },
  { id: 'history', labelAr: 'تاريخ وجغرافيا' },
  { id: 'didou_tips', labelAr: 'نصائح ديدو' },
  { id: 'general', labelAr: 'عام / ترويجي' },
];
const LANGUAGE_OPTIONS: { id: ReelGenerateRequest['language']; labelAr: string }[] = [
  { id: 'ar', labelAr: 'عربية فصحى' },
  { id: 'darija', labelAr: 'دارجة جزائرية' },
  { id: 'fr', labelAr: 'فرنسية' },
  { id: 'en', labelAr: 'إنجليزية' },
  { id: 'tamazight', labelAr: 'أمازيغية' },
];
const BG_PRESETS = [
  'from-emerald-600 via-teal-600 to-cyan-700',
  'from-amber-600 via-orange-600 to-rose-700',
  'from-indigo-600 via-purple-600 to-pink-600',
  'from-violet-700 via-purple-800 to-slate-900',
  'from-blue-600 via-sky-600 to-cyan-600',
  'from-rose-600 via-pink-700 to-purple-800',
];

function emptyReel(): AdReel {
  return {
    id: null,
    title: '',
    description: '',
    gradeLevel: '5AP',
    category: 'general',
    tags: [],
    slides: [],
    status: 'draft',
    isAiGenerated: false,
  };
}

// Admin-only "usine de pub" — generates a 9:16 reel script via the independently-keyed Gemini call
// (GeminiAiService.generateReelScript, never the student AI Tutor's key — Gemini only ever writes
// text, it has no access to the app's own components/assets to draw Didou itself), lets the admin
// edit every field, persists it server-side (shared across admins/devices, unlike the AI-Studio
// reference code's localStorage-only approach), then exports client-side to high-resolution PNG
// slides and/or a WebM video — both with the real Didou mascot composited onto every slide (see
// getMascotSvgDataUrl below), ready to post manually to TikTok/Instagram/Facebook.
export const ReelsStudioModule: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('5AP');
  const [category, setCategory] = useState<ReelCategory>('general');
  const [language, setLanguage] = useState<ReelGenerateRequest['language']>('ar');
  // Kept as free text (not a controlled number) so a mobile keyboard can clear-then-retype a digit —
  // a plain `type="number"` bound straight to a numeric state snapped back to the old value on every
  // keystroke while the field was momentarily empty, which made it feel impossible to edit on mobile.
  const [slideCountInput, setSlideCountInput] = useState('4');
  const slideCount = Math.min(8, Math.max(2, parseInt(slideCountInput, 10) || 4));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // A hidden, real Didou3DAvatar instance (see below) whose live-rendered SVG we serialize into a
  // data: URL once per export — the actual on-brand mascot, not a static/stale copy of its markup.
  const didouRef = useRef<HTMLDivElement>(null);
  const getMascotSvgDataUrl = (): string | undefined => {
    const svg = didouRef.current?.querySelector('svg');
    if (!svg) return undefined;
    const markup = new XMLSerializer().serializeToString(svg);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  };

  const [draft, setDraft] = useState<AdReel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [savedReels, setSavedReels] = useState<AdReel[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [isExportingImages, setIsExportingImages] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  // Per-slide-id narration clips (Gemini TTS via /v1/admin/reels/narrate, wrapped to WAV — see
  // utils/reelAudio.ts). Keyed by slide.id, so switching drafts naturally invalidates stale entries
  // instead of needing an explicit reset.
  const [narrationState, setNarrationState] = useState<Record<string, SlideNarrationState>>({});
  const narrationBlobsRef = useRef<Record<string, Blob>>({});
  const narrationUrlsRef = useRef<Record<string, string>>({});
  const [isGeneratingVoices, setIsGeneratingVoices] = useState(false);

  const getNarrationUrl = (slideId: string): string | undefined => {
    if (!narrationBlobsRef.current[slideId]) return undefined;
    if (!narrationUrlsRef.current[slideId]) {
      narrationUrlsRef.current[slideId] = URL.createObjectURL(narrationBlobsRef.current[slideId]);
    }
    return narrationUrlsRef.current[slideId];
  };

  const generateNarrationForSlide = async (slide: ReelSlide) => {
    setNarrationState((s) => ({ ...s, [slide.id]: 'loading' }));
    const text = [slide.title, slide.content].filter(Boolean).join('. ');
    try {
      const res = await springBootApi.generateReelNarration(text);
      if (res.error || !res.data || res.data.status !== 'success' || !res.data.audioBase64) {
        setNarrationState((s) => ({ ...s, [slide.id]: 'error' }));
        return;
      }
      if (narrationUrlsRef.current[slide.id]) {
        URL.revokeObjectURL(narrationUrlsRef.current[slide.id]);
        delete narrationUrlsRef.current[slide.id];
      }
      narrationBlobsRef.current[slide.id] = pcmBase64ToWavBlob(res.data.audioBase64, res.data.mimeType);
      setNarrationState((s) => ({ ...s, [slide.id]: 'ready' }));
    } catch {
      setNarrationState((s) => ({ ...s, [slide.id]: 'error' }));
    }
  };

  const generateAllNarrations = async () => {
    if (!draft) return;
    setIsGeneratingVoices(true);
    try {
      for (const slide of draft.slides) {
        await generateNarrationForSlide(slide);
      }
    } finally {
      setIsGeneratingVoices(false);
    }
  };

  const loadReels = async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      const res = await springBootApi.listReels();
      if (res.error) setListError(res.error);
      else setSavedReels(res.data || []);
    } catch {
      setListError('تعذر الاتصال بالخادم لجلب قائمة الـ Reels.');
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadReels();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await springBootApi.generateReelScript({ topic: topic.trim(), gradeLevel, language, slideCount });
      if (res.error || !res.data || res.data.status !== 'success') {
        setGenerateError(res.data?.errorMessage || res.error || 'تعذر توليد سيناريو الـ Reel.');
        return;
      }
      setDraft(draftToEditableReel(res.data, gradeLevel));
    } catch {
      setGenerateError('تعذر الاتصال بالخادم لتوليد الـ Reel.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateDraft = (patch: Partial<AdReel>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const updateSlide = (index: number, patch: Partial<ReelSlide>) =>
    setDraft((d) => (d ? { ...d, slides: d.slides.map((s, i) => (i === index ? { ...s, ...patch } : s)) } : d));
  const removeSlide = (index: number) =>
    setDraft((d) => (d ? { ...d, slides: d.slides.filter((_, i) => i !== index) } : d));
  const addSlide = () =>
    setDraft((d) =>
      d
        ? {
            ...d,
            slides: [
              ...d.slides,
              { id: `slide-${Date.now()}`, title: '', content: '', durationSec: 6, bgColor: BG_PRESETS[0] },
            ],
          }
        : d
    );

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await springBootApi.saveReel(draft);
      if (res.error || !res.data) {
        setSaveError(res.error || 'تعذر حفظ الـ Reel.');
        return;
      }
      setDraft(res.data);
      await loadReels();
    } catch {
      setSaveError('تعذر الاتصال بالخادم للحفظ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('حذف هذا الـ Reel نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    const res = await springBootApi.deleteReel(id);
    if (!res.error) {
      if (draft?.id === id) setDraft(null);
      await loadReels();
    }
  };

  const handleDownloadImages = async () => {
    if (!draft || draft.slides.length === 0) return;
    setExportError(null);
    setIsExportingImages(true);
    try {
      await downloadReelAsImages(draft, getMascotSvgDataUrl());
    } catch {
      setExportError('تعذر إنشاء صور الـ Reel — أعد المحاولة.');
    } finally {
      setIsExportingImages(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!draft || draft.slides.length === 0) return;
    setExportError(null);
    setIsExportingVideo(true);
    setVideoProgress(0);
    try {
      await downloadReelAsVideo(draft, setVideoProgress, getMascotSvgDataUrl(), narrationBlobsRef.current);
    } catch {
      setExportError('تعذر إنشاء فيديو الـ Reel — قد لا يدعم متصفحك هذه الميزة.');
    } finally {
      setIsExportingVideo(false);
    }
  };

  return (
    <div className="space-y-6 dir-rtl font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
          <Clapperboard className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">استوديو الإعلانات (Reels)</h2>
          <p className="text-xs text-slate-300 mt-1">
            وّلد سيناريو Reel تعليمي بالذكاء الاصطناعي، أضف لقطة شاشة حقيقية من التطبيق واختر ديدو الفنك ليقدّمها، ثم نزّله كصور عالية الجودة أو فيديو لنشره يدوياً على تيك توك، إنستغرام وفيسبوك.
          </p>
        </div>
      </div>

      {/* Hidden, real Didou3DAvatar instance — captured into every exported slide/video (see
          getMascotSvgDataUrl above). Kept in normal document flow (not display:none) so its SVG
          renders properly, just moved off-screen. */}
      <div ref={didouRef} className="fixed -top-[9999px] left-0 pointer-events-none" aria-hidden="true">
        <Didou3DAvatar species="fennec" outfitId="default" mood="encouraging" size="xl" />
      </div>

      {/* Generation form */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
        <h3 className="text-xs font-black text-slate-400">توليد سيناريو جديد</h3>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="الموضوع: مثال — جدول الضرب في 3 بطريقة ممتعة"
          rows={2}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 resize-none"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} aria-label="المستوى الدراسي"
            className="min-h-[var(--hit)] bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-2">
            {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g === 'all' ? 'كل المستويات' : g}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value as ReelCategory)} aria-label="الفئة"
            className="min-h-[var(--hit)] bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-2">
            {CATEGORY_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.labelAr}</option>)}
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value as ReelGenerateRequest['language'])} aria-label="اللغة"
            className="min-h-[var(--hit)] bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-2">
            {LANGUAGE_OPTIONS.map((l) => <option key={l.id} value={l.id}>{l.labelAr}</option>)}
          </select>
          <input type="number" inputMode="numeric" min={2} max={8} value={slideCountInput}
            onChange={(e) => setSlideCountInput(e.target.value)}
            onBlur={() => setSlideCountInput(String(slideCount))}
            aria-label="عدد الشرائح (من 2 إلى 8)"
            className="min-h-[var(--hit)] bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-2" />
        </div>
        {generateError && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /><span>{generateError}</span>
          </div>
        )}
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}
          className="flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl shadow-md transition-all cursor-pointer w-full sm:w-auto">
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
          <span>{isGenerating ? 'جاري التوليد...' : 'توليد بالذكاء الاصطناعي'}</span>
        </button>
      </div>

      {/* Editable draft */}
      {draft && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-xs font-black text-slate-400">تحرير الـ Reel {draft.id ? `#${draft.id}` : '(مسودة جديدة)'}</h3>
            <button onClick={() => setDraft(null)} className="text-slate-500 hover:text-slate-300 min-w-[var(--hit)] min-h-[var(--hit)] flex items-center justify-center cursor-pointer" aria-label="إغلاق التحرير">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} placeholder="العنوان"
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-600" />
          <textarea value={draft.description} onChange={(e) => updateDraft({ description: e.target.value })} placeholder="الوصف" rows={2}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-600 resize-none" />
          <input value={draft.tags.join(', ')} onChange={(e) => updateDraft({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="الكلمات المفتاحية (مفصولة بفاصلة)"
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-600" />

          <div className="space-y-3">
            {draft.slides.map((slide, i) => (
              <div key={slide.id} className="grid sm:grid-cols-[160px_1fr] gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className={`relative aspect-[9/16] w-full max-w-[140px] mx-auto rounded-lg bg-gradient-to-br ${slide.bgColor} p-2 flex flex-col items-center justify-center text-center overflow-hidden`}>
                  {slide.screenshotUrl && (
                    <img src={slide.screenshotUrl} alt="" className="absolute inset-2 top-1/2 -translate-y-1/2 h-[70%] w-auto mx-auto rounded-md border-2 border-white/90 object-cover" />
                  )}
                  <p className="relative text-white font-black text-[10px] leading-tight line-clamp-3 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">{slide.title || '...'}</p>
                  {!slide.screenshotUrl && <p className="relative text-white/80 text-[8px] mt-1 line-clamp-3">{slide.content}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500">شريحة {i + 1}</span>
                    <button onClick={() => removeSlide(i)} className="text-rose-400 hover:text-rose-300 min-w-[var(--hit)] min-h-[var(--hit)] flex items-center justify-center cursor-pointer" aria-label="حذف الشريحة">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input value={slide.title} onChange={(e) => updateSlide(i, { title: e.target.value })} placeholder="عنوان الشريحة"
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" />
                  <textarea value={slide.content} onChange={(e) => updateSlide(i, { content: e.target.value })} placeholder="النص الرئيسي" rows={2}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 resize-none" />
                  <input value={slide.subtext || ''} onChange={(e) => updateSlide(i, { subtext: e.target.value })} placeholder="ملاحظة إضافية (اختياري)"
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200" />
                  <select value={slide.screenshotUrl || ''} onChange={(e) => updateSlide(i, { screenshotUrl: e.target.value || undefined })}
                    aria-label="لقطة شاشة من التطبيق (اختياري)"
                    className="w-full min-h-[var(--hit)] bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 px-2">
                    <option value="">بدون لقطة شاشة (نص فقط)</option>
                    {REEL_SCREENSHOTS.map((s) => <option key={s.id} value={s.url}>📱 {s.labelAr}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <select value={slide.bgColor} onChange={(e) => updateSlide(i, { bgColor: e.target.value })} aria-label="لون الخلفية"
                      className="flex-1 min-h-[var(--hit)] bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-200 px-2">
                      {BG_PRESETS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                    <input type="number" inputMode="numeric" min={2} max={15}
                      value={Number.isNaN(slide.durationSec) ? '' : slide.durationSec}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') { updateSlide(i, { durationSec: NaN }); return; }
                        const n = Number(raw);
                        if (!Number.isNaN(n)) updateSlide(i, { durationSec: n });
                      }}
                      onBlur={() => updateSlide(i, { durationSec: Math.min(15, Math.max(2, slide.durationSec || 6)) })}
                      aria-label="المدة بالثواني (من 2 إلى 15)"
                      className="w-16 min-h-[var(--hit)] bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-200 px-2" />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => generateNarrationForSlide(slide)} disabled={narrationState[slide.id] === 'loading'}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-sky-300 hover:text-sky-200 disabled:opacity-50 cursor-pointer">
                      {narrationState[slide.id] === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>
                        {narrationState[slide.id] === 'loading' ? 'جاري توليد الصوت...' : narrationState[slide.id] === 'ready' ? 'إعادة توليد الصوت' : 'توليد الصوت (TTS)'}
                      </span>
                    </button>
                    {narrationState[slide.id] === 'error' && <span className="text-[10px] font-bold text-rose-400">تعذر التوليد</span>}
                  </div>
                  {narrationState[slide.id] === 'ready' && getNarrationUrl(slide.id) && (
                    <audio controls src={getNarrationUrl(slide.id)} className="w-full h-8" />
                  )}
                </div>
              </div>
            ))}
            <button onClick={addSlide} className="flex items-center justify-center gap-1.5 w-full min-h-[var(--hit)] rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-xs font-bold cursor-pointer">
              <Plus className="w-4 h-4" /><span>إضافة شريحة</span>
            </button>
          </div>

          <button onClick={generateAllNarrations} disabled={isGeneratingVoices || draft.slides.length === 0}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl cursor-pointer w-full sm:w-auto">
            {isGeneratingVoices ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
            <span>{isGeneratingVoices ? 'جاري توليد كل الأصوات...' : 'توليد الصوت لكل الشرائح'}</span>
          </button>

          {saveError && <p className="text-[11px] font-bold text-rose-300">{saveError}</p>}
          {exportError && <p className="text-[11px] font-bold text-rose-300">{exportError}</p>}
          {isExportingVideo && (
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-500 transition-all" style={{ width: `${Math.round(videoProgress * 100)}%` }} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl cursor-pointer">
              <Save className="w-4 h-4" /><span>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
            </button>
            <button onClick={handleDownloadImages} disabled={isExportingImages || draft.slides.length === 0}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl cursor-pointer">
              <ImageIcon className="w-4 h-4" /><span>{isExportingImages ? 'جاري التصدير...' : 'تنزيل (صور HD)'}</span>
            </button>
            <button onClick={handleDownloadVideo} disabled={isExportingVideo || draft.slides.length === 0}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl cursor-pointer">
              <Film className="w-4 h-4" /><span>{isExportingVideo ? `جاري التسجيل... ${Math.round(videoProgress * 100)}%` : 'تنزيل (فيديو WebM)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Saved reels list */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-800">
          <h3 className="text-xs font-black text-slate-400">الـ Reels المحفوظة ({savedReels.length})</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setDraft(emptyReel())} className="flex items-center gap-1.5 text-[11px] font-bold text-fuchsia-300 hover:text-fuchsia-200 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /><span>Reel فارغ يدوياً</span>
            </button>
            <button onClick={loadReels} disabled={isLoadingList} className="min-w-[var(--hit)] min-h-[var(--hit)] flex items-center justify-center text-slate-400 hover:text-slate-200 cursor-pointer" aria-label="تحديث القائمة">
              <RefreshCw className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {isLoadingList && savedReels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">جاري التحميل...</div>
        ) : listError ? (
          <div className="p-4"><div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-3 rounded-xl">{listError}</div></div>
        ) : savedReels.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">لا توجد Reels محفوظة بعد.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {savedReels.map((reel) => (
              <div key={reel.id} className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{reel.title}</p>
                  <p className="text-[10px] text-slate-500">{reel.gradeLevel} · {reel.slides.length} شرائح · {reel.status}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => setDraft(reel)} className="min-w-[var(--hit)] min-h-[var(--hit)] flex items-center justify-center text-slate-300 hover:text-white cursor-pointer" aria-label="تعديل">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => reel.id != null && handleDelete(reel.id)} className="min-w-[var(--hit)] min-h-[var(--hit)] flex items-center justify-center text-rose-400 hover:text-rose-300 cursor-pointer" aria-label="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
