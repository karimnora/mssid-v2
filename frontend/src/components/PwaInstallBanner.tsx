import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadCloud, X, Smartphone, Sparkles, Tablet, CheckCircle } from 'lucide-react';

const PWA_DISMISSED_KEY = 'mssid_pwa_dismissed_time';
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days cooldown

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed PWA)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // 2. Check if user dismissed banner recently
    const dismissedTime = localStorage.getItem(PWA_DISMISSED_KEY);
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < DISMISS_COOLDOWN_MS) {
      // Still in cooldown
      return;
    }

    // 3. Capture beforeinstallprompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Friendly delay (4 seconds) so the child can explore first
      setTimeout(() => {
        setShowBanner(true);
      }, 4000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setJustInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instruction for iOS / Safari if prompt not natively supported
      alert('لتثبيت التطبيق على جهازك: اضغط على زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) 📲');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
      setJustInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(PWA_DISMISSED_KEY, Date.now().toString());
  };

  if (isInstalled && !justInstalled) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white px-4 py-3 border-b-2 border-emerald-400/40 shadow-xl dir-rtl sticky top-0 z-40 backdrop-blur-md"
          dir="rtl"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Kid-friendly Visual & Text */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 flex items-center justify-center font-black text-xl shadow-md shrink-0 ring-2 ring-white/30">
                📱
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">ثبّت لعبة ودروس مَسيد على لوحتك أو هاتفك</span>
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    سريع وخفيف 🚀
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 font-medium">
                  الوصول السريع بكبسة واحدة والتعلم بسهولة بدون انقطاع!
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer ring-2 ring-amber-300/40"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>تثبيت التطبيق الآن 🚀</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                title="لاحقاً"
              >
                لاحقاً
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Banner when just installed */}
      {justInstalled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-black shadow-md flex items-center justify-center gap-2 dir-rtl"
          dir="rtl"
        >
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>رائع! تم تثبيت تطبيق مَسيد DZ بنجاح على جهازك يا بطل 🎉</span>
          <button
            onClick={() => setJustInstalled(false)}
            className="mr-3 text-emerald-200 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

