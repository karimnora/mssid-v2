import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Lock, Award, Coins, Volume2 } from 'lucide-react';
import { DIDOU_OUTFITS_LIST } from '../data/outfitsData';
import { DidouOutfitItem, DidouOutfitId } from '../types/ecosystem';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';

interface DidouDressingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
  onUpdateProfile?: (updated: any) => void;
}

export const DidouDressingRoomModal: React.FC<DidouDressingRoomModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const { authUser } = useAuth();
  const [selectedOutfitId, setSelectedOutfitId] = useState<DidouOutfitId>(
    userProfile?.avatarConfig?.activeOutfit || authUser?.avatarConfig?.activeOutfit || 'default'
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Deliberately not derived from XP/score here — gold coins are a separate cosmetic-shop currency,
  // not a second progression metric (see AuthUser.goldCoins' doc comment). 150 matches the default
  // used everywhere else a fresh profile's balance is read (App.tsx, entity default on the backend).
  const currentCoins = userProfile?.goldCoins ?? authUser?.goldCoins ?? 150;
  const unlockedOutfits: DidouOutfitId[] =
    userProfile?.avatarConfig?.unlockedOutfits ||
    authUser?.avatarConfig?.unlockedOutfits || ['default'];
  const activeOutfitId: DidouOutfitId =
    userProfile?.avatarConfig?.activeOutfit ||
    authUser?.avatarConfig?.activeOutfit || 'default';

  const selectedOutfit = DIDOU_OUTFITS_LIST.find((o) => o.id === selectedOutfitId) || DIDOU_OUTFITS_LIST[0];
  const isUnlocked = unlockedOutfits.includes(selectedOutfit.id);
  const isEquipped = activeOutfitId === selectedOutfit.id;

  const handleEquip = (outfitId: DidouOutfitId) => {
    if (!unlockedOutfits.includes(outfitId)) return;
    
    const newConfig = {
      activeOutfit: outfitId,
      unlockedOutfits: unlockedOutfits,
      mood: 'happy' as const,
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(currentCoins, newConfig);
    setFeedbackMsg(`تم ارتداء ${selectedOutfit.nameAr} بنجاح! 🦊✨`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleBuy = (outfit: DidouOutfitItem) => {
    if (currentCoins < outfit.priceGoldCoins) {
      setFeedbackMsg(`رصيدك غير كافٍ! تحتاج ${outfit.priceGoldCoins - currentCoins} دينار ذهبي إضافي.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    const newCoins = currentCoins - outfit.priceGoldCoins;
    const newUnlocked = [...unlockedOutfits, outfit.id];
    const newConfig = {
      activeOutfit: outfit.id,
      unlockedOutfits: newUnlocked,
      mood: 'celebrating' as const,
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        goldCoins: newCoins,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(newCoins, newConfig);

    setFeedbackMsg(`مبروك! لقد فتحت وارتديت ${outfit.nameAr}! 🎉`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
              🦊
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">خزانة وتلبيس ديدو الفنك (Didou Studio)</h2>
              <p className="text-xs text-slate-500 font-bold">خصّص مظهر صديقك ديدو بأجمل الأزياء الجزائرية التقليدية</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl shadow-xs">
              <span className="text-lg">🪙</span>
              <span className="font-black text-amber-950 text-sm">{currentCoins} د. ذهبي</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 overflow-y-auto">
          {/* Outfits selection list (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              الأزياء والألبسة التقليدية الجزائرية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIDOU_OUTFITS_LIST.map((outfit) => {
                const unlocked = unlockedOutfits.includes(outfit.id);
                const equipped = activeOutfitId === outfit.id;
                const isSelected = selectedOutfitId === outfit.id;

                return (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfitId(outfit.id)}
                    className={`p-3.5 rounded-2xl border-2 text-right transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner bg-gradient-to-br ${outfit.accentColor}`}
                    >
                      {outfit.icon}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 truncate">{outfit.nameAr}</span>
                        {equipped && (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                            مُرتدى
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        {unlocked ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> متاح
                          </span>
                        ) : (
                          <span className="text-amber-800 font-black flex items-center gap-1">
                            <Coins className="w-3 h-3" /> {outfit.priceGoldCoins} دينار
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview & Action Card (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-b from-amber-50/80 to-emerald-50/60 rounded-3xl p-5 border border-amber-200 flex flex-col justify-between text-center space-y-4">
            <div className="space-y-2">
              <span className="bg-white/80 border border-amber-200 text-amber-900 font-black text-xs px-3 py-1 rounded-full inline-block">
                معاينة ديدو الفنك 🦊
              </span>

              {/* Large Didou Avatar Avatar Display */}
              <div className="relative w-36 h-36 mx-auto rounded-3xl bg-white shadow-lg border-2 border-emerald-500 flex items-center justify-center text-6xl">
                <span className="animate-pulse">🦊</span>
                <span className="absolute bottom-2 right-2 text-3xl p-1 bg-amber-100 rounded-xl border border-amber-300 shadow-sm">
                  {selectedOutfit.icon}
                </span>
              </div>

              <h4 className="font-black text-base text-slate-900">{selectedOutfit.nameAr}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {selectedOutfit.descriptionAr}
              </p>
            </div>

            {/* Action button */}
            <div className="space-y-2">
              {isEquipped ? (
                <div className="py-2.5 bg-emerald-100 text-emerald-900 font-black rounded-2xl text-xs border border-emerald-300">
                  ✅ ديدو يرتدي هذا الزي حالياً
                </div>
              ) : isUnlocked ? (
                <button
                  onClick={() => handleEquip(selectedOutfit.id)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ارتداء هذا الزي الآن</span>
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(selectedOutfit)}
                  disabled={currentCoins < selectedOutfit.priceGoldCoins}
                  className={`w-full py-3 font-black rounded-2xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer ${
                    currentCoins >= selectedOutfit.priceGoldCoins
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>فتح الزي مقابل {selectedOutfit.priceGoldCoins} د. ذهبي</span>
                </button>
              )}

              {feedbackMsg && (
                <p className="text-xs font-black text-emerald-800 bg-emerald-100 p-2 rounded-xl animate-fade-in">
                  {feedbackMsg}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
