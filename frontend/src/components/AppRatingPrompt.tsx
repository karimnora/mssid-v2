import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, MessageCircle } from 'lucide-react';
import { Card, Button } from './ui';

const STORAGE_KEY = 'mssid_rating_prompt_status'; // undefined | 'rated' | 'dismissed'

// Store URLs are intentionally NOT hardcoded — the app isn't published on either store yet. Once it
// is, set VITE_PLAY_STORE_URL / VITE_APP_STORE_URL (see frontend/.env.example) and this component
// picks them up automatically; until then, a 4-5 star tap just shows a thank-you instead of a dead link.
const PLAY_STORE_URL: string | undefined =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PLAY_STORE_URL) || undefined;
const APP_STORE_URL: string | undefined =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_APP_STORE_URL) || undefined;

function pickStoreUrl(): string | undefined {
  if (typeof navigator === 'undefined') return PLAY_STORE_URL || APP_STORE_URL;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isIOS ? (APP_STORE_URL || PLAY_STORE_URL) : (PLAY_STORE_URL || APP_STORE_URL);
}

interface AppRatingPromptProps {
  /** Bump this (e.g. new value each time) after a quiz is fully validated or a badge is unlocked — a genuinely good moment to ask. The prompt only actually appears if the student hasn't rated/dismissed it before. */
  trigger: number;
  /** Routes a low rating (1-3 stars) into the real feedback channel instead of a dead-end thank-you. */
  onOpenContact?: () => void;
}

// Discreet rating nudge — appears once, low in the corner, after a genuine success moment (never on
// app boot / never interrupting a task in progress). Never shown again once rated or dismissed.
export const AppRatingPrompt: React.FC<AppRatingPromptProps> = ({ trigger, onOpenContact }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (trigger <= 0) return;
    if (typeof window === 'undefined') return;
    const status = window.localStorage.getItem(STORAGE_KEY);
    if (status) return; // already rated or dismissed — never ask again
    setIsVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    setIsVisible(false);
  };

  const handleStarClick = (stars: number) => {
    setSelectedStars(stars);
    setHasSubmitted(true);
    window.localStorage.setItem(STORAGE_KEY, 'rated');
    if (stars >= 4) {
      const storeUrl = pickStoreUrl();
      if (storeUrl) window.open(storeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-28 md:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-80 z-30 dir-rtl"
          dir="rtl"
        >
          <Card padding="md" className="shadow-2xl border-2 border-[var(--brand-amber)]/40 space-y-3 relative">
            <button
              onClick={dismiss}
              aria-label="إغلاق"
              className="absolute top-3 left-3 text-[var(--app-text-muted)] hover:text-[var(--app-text)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!hasSubmitted ? (
              <>
                <h3 className="font-black text-sm text-[var(--app-text)] pl-5">هل يعجبك تطبيق مَسِيد؟ 🌟</h3>
                <p className="text-xs text-[var(--app-text-muted)]">قيّم تجربتك معنا بنجمة واحدة إلى خمس نجوم</p>
                <div className="flex items-center justify-center gap-1.5" dir="ltr">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleStarClick(n)}
                      aria-label={`${n} نجوم`}
                      className="cursor-pointer active:scale-90 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          n <= selectedStars ? 'fill-[var(--brand-amber)] text-[var(--brand-amber)]' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : selectedStars >= 4 ? (
              <div className="text-center space-y-1.5">
                <p className="text-sm font-black text-[var(--app-text)]">شكراً جزيلاً! 🎉</p>
                <p className="text-xs text-[var(--app-text-muted)]">
                  نتمنى أن تترك لنا تقييماً على المتجر ليستفيد المزيد من التلاميذ.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm font-black text-[var(--app-text)]">شكراً على رأيك!</p>
                <p className="text-xs text-[var(--app-text-muted)]">يسعدنا أن تخبرنا كيف يمكننا التحسين.</p>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={<MessageCircle className="w-4 h-4" />}
                  onClick={() => {
                    setIsVisible(false);
                    onOpenContact?.();
                  }}
                >
                  أرسل ملاحظاتك
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
