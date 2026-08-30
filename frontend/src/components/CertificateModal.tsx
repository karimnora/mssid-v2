import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Share2, Loader2 } from 'lucide-react';
import { Badge, PrimaryGrade } from '../types';
import { renderCertificateCanvas, canvasToPngBlob, shareOrDownloadCertificate } from '../utils/certificateImage';

interface CertificateModalProps {
  /** Badge being celebrated; the modal is closed whenever this is null. */
  badge: Badge | null;
  childName: string;
  grade: PrimaryGrade;
  onClose: () => void;
}

type GenerationStatus = 'generating' | 'ready' | 'error';

/** Renders a shareable "diploma" PNG for a badge (see utils/certificateImage.ts) and offers a one-tap
 * share/download action — the app's own viral loop: parents post it to WhatsApp/Facebook Stories. */
export const CertificateModal: React.FC<CertificateModalProps> = ({ badge, childName, grade, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('generating');
  const [isSharing, setIsSharing] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!badge) return;
    let cancelled = false;
    setStatus('generating');
    setImageUrl(null);
    (async () => {
      try {
        const canvas = await renderCertificateCanvas({ childName: childName || 'بطل مَسِيد', grade, badge });
        if (cancelled) return;
        // A data: URL (not an object URL) for the <img> preview — the app's CSP img-src allows
        // 'self' data: https: but not blob:, so URL.createObjectURL() renders as a broken image.
        setImageUrl(canvas.toDataURL('image/png'));
        blobRef.current = await canvasToPngBlob(canvas);
        setStatus('ready');
      } catch (e) {
        console.error('Certificate generation failed:', e);
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [badge, childName, grade]);

  if (!badge) return null;

  const handleShare = async () => {
    if (!blobRef.current) return;
    setIsSharing(true);
    try {
      await shareOrDownloadCertificate(
        blobRef.current,
        `mssid-dz-${badge.id}.png`,
        `حصلت على وسام "${badge.titleAr}" في تطبيق مَسِيد DZ! 🎉`,
      );
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[70] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="bg-white border border-[#E7E2D7] rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden max-h-[92vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E7E2D7] shrink-0">
          <h2 className="text-base font-extrabold text-[#5A3B00]">شهادة قابلة للمشاركة 🎉</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center">
          {status === 'generating' && (
            <div className="aspect-square w-full rounded-2xl bg-[#FFF8E7] border-2 border-[#F5D98A] flex flex-col items-center justify-center gap-2 text-[#92400E]">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold">جارٍ تجهيز الشهادة...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="aspect-square w-full rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center p-4">
              <p className="text-xs font-bold text-rose-700 text-center">تعذّر إنشاء الشهادة. حاول مرة أخرى.</p>
            </div>
          )}
          {status === 'ready' && imageUrl && (
            <img src={imageUrl} alt={`شهادة وسام ${badge.titleAr}`} className="w-full rounded-2xl border-2 border-[#F5D98A] shadow-md" />
          )}
        </div>

        <div className="p-4 border-t border-[#E7E2D7] shrink-0">
          <button
            onClick={handleShare}
            disabled={status !== 'ready' || isSharing}
            className="w-full hit-target rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm cursor-pointer flex items-center justify-center gap-2 py-3"
          >
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span>مشاركة الشهادة</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
