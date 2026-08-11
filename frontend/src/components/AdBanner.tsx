import React from 'react';
import { Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

interface AdBannerProps {
  showAds: boolean;
  userRole?: string | null;
  onUpgradeClick: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ showAds, userRole, onUpgradeClick }) => {
  if (!showAds || userRole !== 'ROLE_FREE') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 mx-auto max-w-7xl px-4 md:px-6">
      <div className="rounded-[32px] border border-purple-200/80 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-2xl shadow-purple-900/20 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-3xl bg-white/10 p-3 text-purple-100 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-purple-300 font-semibold">عرض خاص</p>
            <h2 className="font-black text-base sm:text-lg">ترقية مميزة لـ mssid dz بلا إعلانات</h2>
            <p className="text-[11px] text-purple-200 max-w-xl leading-relaxed mt-1">
              احصل على تجربة تعليمية أسرع وأكثر أماناً بدون إعلانات، مع حلول رسمية، محتوى حصري، ودعم الدفع المحلي BaridiMob وEdahabia.
            </p>
          </div>
        </div>
        <button
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-2 rounded-3xl bg-amber-300 text-slate-950 px-4 py-3 font-bold text-xs uppercase tracking-[0.15em] shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all"
        >
          <Lightbulb className="w-4 h-4" />
          ترقية الآن
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
