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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 kids-modal-overlay backdrop-blur-sm dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="kids-modal-header p-4 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center text-2xl shrink-0">
              🦊
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold">خزانة وتلبيس ديدو الفنك (Didou Studio)</h2>
              <p className="text-xs text-white/90 font-bold">خصّص مظهر صديقك ديدو بأجمل الأزياء الجزائرية التقليدية</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] px-3 min-h-[40px] rounded-2xl kids-pop">
              <span className="text-lg">🪙</span>
              <span className="font-extrabold text-[#5A3B00] text-sm">{currentCoins} د. ذهبي</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="kids-close cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 overflow-y-auto">
          {/* Outfits selection list (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-sm font-extrabold text-[var(--kids-muted)]">
              الأزياء والألبسة التقليدية الجزائرية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIDOU_OUTFITS_LIST.map((outfit) => {
                const unlocked = unlockedOutfits.includes(outfit.id);
                const equipped = activeOutfitId === outfit.id;
                const isSelected = selectedOutfitId === outfit.id;

                return (
                  <motion.button
                    key={outfit.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOutfitId(outfit.id)}
                    className={`p-3.5 min-h-[var(--hit)] rounded-[22px] border-[3px] text-right flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--kids-grass-2)] bg-[#ECFDF5] kids-pop'
                        : 'border-[#E7E2D7] bg-white'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br ${outfit.accentColor}`}
                    >
                      {outfit.icon}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-[var(--kids-ink)] truncate">{outfit.nameAr}</span>
                        {equipped && (
                          <span className="bg-[var(--kids-grass-2)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            مُرتدى
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center justify-between text-xs">
                        {unlocked ? (
                          <span className="text-[var(--kids-grass-2)] font-extrabold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> متاح
                          </span>
                        ) : (
                          <span className="text-[#5A3B00] font-extrabold flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5" /> {outfit.priceGoldCoins} دينار
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Preview & Action Card (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#E8F6FF] to-[#ECFDF5] rounded-[22px] p-5 border-[3px] border-[#E7E2D7] flex flex-col justify-between text-center space-y-4">
            <div className="space-y-2">
              <span className="bg-white/85 text-[#5A3B00] font-extrabold text-xs px-3 py-1.5 rounded-full inline-block">
                معاينة ديدو الفنك 🦊
              </span>

              {/* Large Didou Avatar Avatar Display */}
              <div className="relative w-36 h-36 mx-auto rounded-[28px] bg-white kids-pop border-[3px] border-white flex items-center justify-center text-6xl">
                <span>🦊</span>
                <span className="absolute bottom-2 right-2 text-3xl p-1.5 bg-gradient-to-br from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] rounded-2xl">
                  {selectedOutfit.icon}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-[var(--kids-ink)]">{selectedOutfit.nameAr}</h4>
              <p className="text-sm text-[var(--kids-muted)] font-bold leading-relaxed">
                {selectedOutfit.descriptionAr}
              </p>
            </div>

            {/* Action button */}
            <div className="space-y-2">
              {isEquipped ? (
                <div className="py-3 kids-msg-ok font-extrabold rounded-2xl text-sm">
                  ✅ ديدو يرتدي هذا الزي حالياً
                </div>
              ) : isUnlocked ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEquip(selectedOutfit.id)}
                  className="kids-cta flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ارتداء هذا الزي الآن</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={currentCoins >= selectedOutfit.priceGoldCoins ? { scale: 0.95 } : undefined}
                  onClick={() => handleBuy(selectedOutfit)}
                  disabled={currentCoins < selectedOutfit.priceGoldCoins}
                  className={`w-full flex items-center justify-center gap-2 cursor-pointer ${
                    currentCoins >= selectedOutfit.priceGoldCoins
                      ? 'kids-cta-amber w-full'
                      : 'min-h-[var(--hit)] rounded-[18px] bg-[#E7E2D7] text-[var(--kids-muted)] font-extrabold cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-4 h-4" />
                  <span>فتح الزي مقابل {selectedOutfit.priceGoldCoins} د. ذهبي</span>
                </motion.button>
              )}

              {feedbackMsg && (
                <p className="text-sm font-extrabold kids-msg-ok p-2">
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
