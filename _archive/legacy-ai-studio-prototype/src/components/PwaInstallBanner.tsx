import React, { useState, useEffect } from 'react';
import { DownloadCloud, X, Smartphone, CheckCircle, Sparkles } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-4 py-3 border-b border-emerald-800/60 shadow-md dir-rtl flex items-center justify-between gap-3 text-xs" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30 shrink-0">
          <Smartphone className="w-5 h-5 text-emerald-300 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold">
            <span>تثبيت تطبيق مَسيد DZ على هاتفك</span>
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">مجاناً</span>
          </div>
          <p className="text-[11px] text-slate-300 opacity-90">
            تصفح الدروس والتمارين بسرعة فائقة ودون الحاجة للاتصال الدائم بالإنترنت.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>تثبيت الآن</span>
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
