import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Check,
  Coins,
  Volume2,
  Heart,
  Utensils,
  Shirt,
  Award,
  MessageCircle,
  Zap,
  Star,
  Info,
} from 'lucide-react';
import { DIDOU_OUTFITS_LIST, DIDOU_TREATS_LIST, DIDOU_STAGES, DIDOU_DIALOGUES_AR, DIDOU_DIALOGUES_FR } from '../data/outfitsData';
import { getDidouEnergy, getDidouFriendshipLevel, getDidouStage } from '../utils/didouCompanion';
import { DidouOutfitItem, DidouOutfitId, DidouPetSpecies, DidouAvatarConfig } from '../types/ecosystem';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { speakText, stopSpeech } from '../utils/speech';
import { useLocaleContext } from '../context/LocaleContext';
import { Didou3DAvatar } from './Didou3DAvatar';

interface DidouDressingRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: any;
  onUpdateProfile?: (updated: any) => void;
}

type ModalTab = 'wardrobe' | 'nutrition' | 'evolution' | 'wisdom';

export const DidouDressingRoomModal: React.FC<DidouDressingRoomModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const { authUser } = useAuth();
  const { locale, direction } = useLocaleContext();
  const isFrench = locale === 'fr';

  const [activeTab, setActiveTab] = useState<ModalTab>('wardrobe');
  const [selectedOutfitId, setSelectedOutfitId] = useState<DidouOutfitId>(
    userProfile?.avatarConfig?.activeOutfit || authUser?.avatarConfig?.activeOutfit || 'default'
  );
  const [activeSpecies, setActiveSpecies] = useState<DidouPetSpecies>(
    userProfile?.avatarConfig?.species || authUser?.avatarConfig?.species || 'fennec'
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [outfitCategory, setOutfitCategory] = useState<'all' | 'clothing' | 'headwear'>('all');
  const [playingDialogueIndex, setPlayingDialogueIndex] = useState<number | null>(null);
  const [isChangingOutfitAnim, setIsChangingOutfitAnim] = useState<boolean>(false);
  const [isEatingAnim, setIsEatingAnim] = useState<boolean>(false);
  const [eatingFoodIcon, setEatingFoodIcon] = useState<string>('🌴');

  // Stop any in-flight "Écouter la voix" dialogue when the modal unmounts (parent unmounts it
  // entirely on close) — otherwise Didou's voice keeps talking over the rest of the app with no
  // visible control left to stop it.
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!isOpen) return null;

  const currentCoins = userProfile?.goldCoins ?? authUser?.goldCoins ?? 150;
  const currentXp = userProfile?.xp ?? authUser?.xp ?? 0;
  const userLevel = userProfile?.level ?? authUser?.level ?? Math.floor(currentXp / 100) + 1;
  const activeAvatarConfig = userProfile?.avatarConfig || authUser?.avatarConfig;
  const currentEnergy = getDidouEnergy(activeAvatarConfig);
  const friendshipLevel = getDidouFriendshipLevel(activeAvatarConfig);

  const unlockedOutfits: DidouOutfitId[] =
    userProfile?.avatarConfig?.unlockedOutfits ||
    authUser?.avatarConfig?.unlockedOutfits || ['default'];
  const activeOutfitId: DidouOutfitId =
    userProfile?.avatarConfig?.activeOutfit ||
    authUser?.avatarConfig?.activeOutfit || 'default';

  const selectedOutfit = DIDOU_OUTFITS_LIST.find((o) => o.id === selectedOutfitId) || DIDOU_OUTFITS_LIST[0];
  const isUnlocked = unlockedOutfits.includes(selectedOutfit.id);
  const isEquipped = activeOutfitId === selectedOutfit.id;

  const currentStage = getDidouStage(userLevel);

  const handleSpeciesChange = (species: DidouPetSpecies) => {
    setActiveSpecies(species);
    const prevConfig = userProfile?.avatarConfig || authUser?.avatarConfig || {
      activeOutfit: 'default',
      unlockedOutfits: ['default'],
    };
    const newConfig: DidouAvatarConfig = {
      ...prevConfig,
      species,
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(currentCoins, newConfig);
    setFeedbackMsg(
      isFrench
        ? `Espèce changée : ${species === 'eagle' ? "Aiglon de l'Atlas 🦅" : 'Fennec des Sables 🦊'}`
        : `تم تغيير الرفيق إلى: ${species === 'eagle' ? 'عقاب الأطلس الشامخ 🦅' : 'الفنك الجزائري الذكي 🦊'}`
    );
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleEquip = (outfitId: DidouOutfitId) => {
    if (!unlockedOutfits.includes(outfitId)) return;

    setIsChangingOutfitAnim(true);
    setTimeout(() => setIsChangingOutfitAnim(false), 900);

    const prevConfig = userProfile?.avatarConfig || authUser?.avatarConfig || {};
    const newConfig: DidouAvatarConfig = {
      ...prevConfig,
      species: activeSpecies,
      activeOutfit: outfitId,
      unlockedOutfits: unlockedOutfits,
      mood: 'celebrating',
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(currentCoins, newConfig);
    setFeedbackMsg(
      isFrench
        ? `Didou a revêtu : ${selectedOutfit.nameFr} ! ✨`
        : `تم ارتداء ${selectedOutfit.nameAr} بنجاح! 🦊✨`
    );
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleBuy = (outfit: DidouOutfitItem) => {
    if (currentCoins < outfit.priceGoldCoins) {
      setFeedbackMsg(
        isFrench
          ? `Pièces insuffisantes ! Il te manque ${outfit.priceGoldCoins - currentCoins} pièces.`
          : `رصيدك غير كافٍ! تحتاج ${outfit.priceGoldCoins - currentCoins} دينار ذهبي إضافي.`
      );
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    setIsChangingOutfitAnim(true);
    setTimeout(() => setIsChangingOutfitAnim(false), 900);

    const newCoins = currentCoins - outfit.priceGoldCoins;
    const newUnlocked = [...unlockedOutfits, outfit.id];
    const prevConfig = userProfile?.avatarConfig || authUser?.avatarConfig || {};
    const newConfig: DidouAvatarConfig = {
      ...prevConfig,
      species: activeSpecies,
      activeOutfit: outfit.id,
      unlockedOutfits: newUnlocked,
      mood: 'celebrating',
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        goldCoins: newCoins,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(newCoins, newConfig);

    setFeedbackMsg(
      isFrench
        ? `Félicitations ! Tu as débloqué ${outfit.nameFr} ! 🎉`
        : `مبروك! لقد فتحت وارتديت ${outfit.nameAr}! 🎉`
    );
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleFeedTreat = (treat: typeof DIDOU_TREATS_LIST[0]) => {
    if (currentCoins < treat.priceGoldCoins) {
      setFeedbackMsg(
        isFrench
          ? `Pas assez de pièces ! Il te manque ${treat.priceGoldCoins - currentCoins} pièces 🪙`
          : `رصيدك غير كافٍ! تحتاج ${treat.priceGoldCoins - currentCoins} دينار ذهبي 🪙`
      );
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    setEatingFoodIcon(treat.icon);
    setIsEatingAnim(true);
    setTimeout(() => setIsEatingAnim(false), 2200);

    const newCoins = currentCoins - treat.priceGoldCoins;
    const newEnergy = Math.min(100, currentEnergy + treat.energyBonus);
    const newXp = currentXp + treat.xpBonus;
    const prevConfig = userProfile?.avatarConfig || authUser?.avatarConfig || {};
    const newConfig: DidouAvatarConfig = {
      ...prevConfig,
      species: activeSpecies,
      activeOutfit: activeOutfitId,
      unlockedOutfits: unlockedOutfits,
      energy: newEnergy,
      mood: 'celebrating',
      // Same fields the home-card feeding path writes (App.tsx's handleFeedDidou) — both paths must
      // agree on what "fed recently" means, since getDidouEnergy/getDidouFriendshipLevel read these.
      totalTreatsGiven: (prevConfig.totalTreatsGiven || 0) + 1,
      lastFedAt: new Date().toISOString(),
    };

    if (userProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        goldCoins: newCoins,
        xp: newXp,
        avatarConfig: newConfig,
      });
    }

    AuthService.syncGoldCoinsAndAvatar(newCoins, newConfig);
    setFeedbackMsg(
      isFrench
        ? `Yummy ! Didou a adoré ${treat.nameFr} (+${treat.energyBonus}% Énergie, +${treat.xpBonus} XP) ! 🌴`
        : `صحة وهنا! استمتع ديدو بـ ${treat.nameAr} (+${treat.energyBonus}% طاقة، +${treat.xpBonus} خبرة)! 🌴`
    );
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handlePlayDialogue = (text: string, index: number) => {
    stopSpeech();
    setPlayingDialogueIndex(index);
    const langCode = isFrench ? 'fr-FR' : 'ar-SA';
    void speakText(text, langCode, 0.95).then(() => {
      setPlayingDialogueIndex(null);
    });
  };

  const filteredOutfits = DIDOU_OUTFITS_LIST.filter((o) => {
    if (outfitCategory === 'all') return true;
    return o.category === outfitCategory;
  });

  const mainPetEmoji = activeSpecies === 'eagle' ? '🦅' : '🦊';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 kids-modal-overlay backdrop-blur-md"
      dir={direction}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] bg-white dark:bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl"
      >
        {/* HEADER */}
        <div className="kids-modal-header p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {mainPetEmoji}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black truncate">
                  {isFrench ? "Sanctuaire & Studio de Didou" : "مملكة واستوديو ديدو الافتراضي"}
                </h2>
                <span className="bg-white/25 px-2 py-0.5 rounded-full text-[11px] font-extrabold">
                  {isFrench ? currentStage.nameFr : currentStage.nameAr}
                </span>
              </div>
              <p className="text-xs text-white/90 font-bold truncate">
                {isFrench
                  ? "Personnalise, nourris et fais évoluer ton compagnon d'apprentissage"
                  : "خصّص مظهر صديقك، أطعمه من خيرات الجزائر، وتابِع تطوره الدراسي"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-white text-amber-950 px-3 py-1.5 rounded-2xl font-black text-xs shadow-md">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>{currentCoins} {isFrench ? 'pièces' : 'د. ذهبي'}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={isFrench ? 'Fermer' : 'إغلاق'}
              className="w-[60px] h-[60px] rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 p-2.5 bg-amber-50 dark:bg-slate-800 border-b border-amber-200 dark:border-slate-700 overflow-x-auto text-xs font-black">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'wardrobe'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>{isFrench ? 'Garde-robe & Espèces' : 'الأزياء والألبسة 👗'}</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'nutrition'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>{isFrench ? 'Nutrition & Énergie' : 'الغذاء والرعاية 🌴'}</span>
          </button>

          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'evolution'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isFrench ? 'Évolution & Amitié' : 'مراحل التطور والصداقة 🌟'}</span>
          </button>

          <button
            onClick={() => setActiveTab('wisdom')}
            className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'wisdom'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isFrench ? 'Dialogues & Sagesse' : 'حكمة وكلمات ديدو 💬'}</span>
          </button>
        </div>

        {/* BODY CONTENT BY TAB */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto">
          {/* FEEDBACK TOAST */}
          <AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-400 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-black text-center shadow-md"
              >
                {feedbackMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB 1: WARDROBE */}
          {activeTab === 'wardrobe' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* SPECIES SWITCHER & OUTFIT LIST (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Species Choice */}
                <div className="p-3 bg-amber-50 dark:bg-slate-800/60 rounded-2xl border border-amber-200 dark:border-slate-700">
                  <div className="text-xs font-black text-slate-700 dark:text-slate-300 mb-2">
                    {isFrench ? "Choisis l'animal compagnon :" : "اختر حيوانك الرفيق :"}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSpeciesChange('fennec')}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer ${
                        activeSpecies === 'fennec'
                          ? 'border-amber-500 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-sm'
                          : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xl">🦊</span>
                      <span>{isFrench ? 'Fennec des Sables' : 'الفنك الجزائري'}</span>
                    </button>

                    <button
                      onClick={() => handleSpeciesChange('eagle')}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer ${
                        activeSpecies === 'eagle'
                          ? 'border-amber-500 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 shadow-sm'
                          : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-xl">🦅</span>
                      <span>{isFrench ? "Aiglon de l'Atlas" : 'عقاب الأطلس'}</span>
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {isFrench ? 'Tenues & Accessoires algériens' : 'الأزياء والألبسة التراثية والعصرية'}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <button
                      onClick={() => setOutfitCategory('all')}
                      className={`px-2.5 py-1 rounded-xl ${outfitCategory === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      {isFrench ? 'Tous' : 'الكل'}
                    </button>
                    <button
                      onClick={() => setOutfitCategory('clothing')}
                      className={`px-2.5 py-1 rounded-xl ${outfitCategory === 'clothing' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      {isFrench ? 'Tenues' : 'أزياء'}
                    </button>
                    <button
                      onClick={() => setOutfitCategory('headwear')}
                      className={`px-2.5 py-1 rounded-xl ${outfitCategory === 'headwear' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                    >
                      {isFrench ? 'Coiffes' : 'قبعات'}
                    </button>
                  </div>
                </div>

                {/* Outfit Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredOutfits.map((outfit) => {
                    const unlocked = unlockedOutfits.includes(outfit.id);
                    const equipped = activeOutfitId === outfit.id;
                    const isSelected = selectedOutfitId === outfit.id;

                    return (
                      <button
                        key={outfit.id}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                        className={`p-3 rounded-2xl border-2 text-start flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                        }`}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                          style={{ backgroundColor: `${outfit.accentColor}20`, color: outfit.accentColor }}
                        >
                          {outfit.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                              {isFrench ? outfit.nameFr : outfit.nameAr}
                            </span>
                            {equipped && (
                              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                                {isFrench ? 'Équipé' : 'مُرتدى'}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-[11px] font-bold">
                            {unlocked ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Check className="w-3 h-3" /> {isFrench ? 'Débloqué' : 'متاح'}
                              </span>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-mono">
                                <Coins className="w-3 h-3" /> {outfit.priceGoldCoins} {isFrench ? 'pièces' : 'دينار'}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PREVIEW & ACTION PANEL (5 cols) */}
              <div className="md:col-span-5 bg-gradient-to-b from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl p-5 border-2 border-amber-300 dark:border-slate-700 flex flex-col justify-between text-center space-y-4">
                <div className="space-y-3">
                  <span className="bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 font-black text-xs px-3 py-1 rounded-full border border-amber-300 dark:border-slate-700 inline-block shadow-sm">
                    {isFrench ? 'Aperçu en direct' : 'معاينة مباشرة للرفيق'}
                  </span>

                  {/* Large 3D Avatar Display */}
                  <div className="relative mx-auto flex items-center justify-center p-2">
                    <Didou3DAvatar
                      species={activeSpecies}
                      outfitId={selectedOutfit.id}
                      mood={isChangingOutfitAnim ? 'celebrating' : isEatingAnim ? 'celebrating' : 'happy'}
                      isChangingOutfit={isChangingOutfitAnim}
                      isEating={isEatingAnim}
                      eatingFoodIcon={eatingFoodIcon}
                      size="lg"
                    />
                  </div>

                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                      {isFrench ? selectedOutfit.nameFr : selectedOutfit.nameAr}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1 leading-relaxed">
                      {selectedOutfit.descriptionAr}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {isEquipped ? (
                    <div className="py-2.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-400 font-black rounded-2xl text-xs">
                      ✅ {isFrench ? 'Déjà équipé sur Didou' : 'ديدو يرتدي هذا الزي حالياً'}
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleEquip(selectedOutfit.id)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isFrench ? 'Revêtir cette tenue' : 'ارتداء هذا الزي الآن'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(selectedOutfit)}
                      disabled={currentCoins < selectedOutfit.priceGoldCoins}
                      className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                        currentCoins >= selectedOutfit.priceGoldCoins
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white active:scale-95 cursor-pointer'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span>
                        {isFrench
                          ? `Débloquer (${selectedOutfit.priceGoldCoins} pièces)`
                          : `فتح الزي مقابل ${selectedOutfit.priceGoldCoins} د. ذهبي`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NUTRITION & ENERGY */}
          {activeTab === 'nutrition' && (
            <div className="space-y-5">
              {/* Energy Status Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-cyan-500/15 border-2 border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-start">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                      {isFrench ? "Jauge d'énergie de Didou" : "مؤشر حيوية وطاقة ديدو"}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                      {isFrench
                        ? "Nourris Didou avec des délices locaux pour maintenir son enthousiasme et gagner des bonus !"
                        : "أطعم ديدو بتمور وفواكه ولايات الجزائر لزيادة نشاطه وربح نقاط خبرة إضافية!"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-36 h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentEnergy}%` }}
                    />
                  </div>
                  <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                    {currentEnergy}%
                  </span>
                </div>
              </div>

              {/* Treats Catalog */}
              <div>
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 mb-3">
                  {isFrench ? "Spécialités régionales d'Algérie :" : "قائمة الأغذية والخيرات الجزائرية المباركة:"}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {DIDOU_TREATS_LIST.map((treat) => (
                    <div
                      key={treat.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-400 flex flex-col justify-between gap-3 shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                          {treat.icon}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                            {isFrench ? treat.nameFr : treat.nameAr}
                          </h5>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-extrabold mt-0.5">
                            📍 {treat.originWilayaAr}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 line-clamp-2 leading-relaxed">
                            {isFrench ? treat.descriptionFr : treat.descriptionAr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] font-bold">
                          <span className="text-emerald-600 font-extrabold">+{treat.energyBonus}% ⚡</span>
                          <span className="text-purple-600 font-extrabold ml-2">+{treat.xpBonus} XP ⭐</span>
                        </div>

                        <button
                          onClick={() => handleFeedTreat(treat)}
                          disabled={currentCoins < treat.priceGoldCoins}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm transition-all ${
                            currentCoins >= treat.priceGoldCoins
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>{treat.priceGoldCoins}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EVOLUTION & STAGES */}
          {activeTab === 'evolution' && (
            <div className="space-y-5">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-blue-500/15 border-2 border-purple-400/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-start">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-3xl shadow-md">
                    👑
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                      {isFrench ? `Stade actuel : ${currentStage.nameFr}` : `المرحلة الحالية: ${currentStage.nameAr}`}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                      {isFrench
                        ? `Ton compagnon évolue au fil de tes leçons et exercices (Niveau ${userLevel} • ${currentXp} XP)`
                        : `يتطور رفيقك وينمو مع تقدمك في الدروس والامتحانات (المستوى ${userLevel} • ${currentXp} نقطة خبرة)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-purple-300 dark:border-slate-700 shadow-sm">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                  <div className="text-start">
                    <div className="text-[10px] text-slate-500 font-bold">{isFrench ? 'Amitié' : 'الصداقة'}</div>
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200">{friendshipLevel} / 10 ⭐</div>
                  </div>
                </div>
              </div>

              {/* 3 Evolution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DIDOU_STAGES.map((st) => {
                  const isCurrent = currentStage.stage === st.stage;
                  const isReached = userLevel >= st.minLevel;

                  return (
                    <div
                      key={st.stage}
                      className={`p-5 rounded-3xl border-2 flex flex-col justify-between gap-4 relative overflow-hidden transition-all ${
                        isCurrent
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-lg scale-102'
                          : isReached
                          ? 'border-emerald-400 bg-white dark:bg-slate-900'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-75'
                      }`}
                    >
                      <div className="space-y-2 text-start">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{activeSpecies === 'eagle' ? st.iconEagle : st.iconFennec}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              isCurrent
                                ? 'bg-purple-600 text-white'
                                : isReached
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isCurrent
                              ? (isFrench ? 'Actuel' : 'المرحلة الحالية')
                              : isReached
                              ? (isFrench ? 'Atteint' : 'تم الوصول')
                              : (isFrench ? `Niveau ${st.minLevel}` : `المستوى ${st.minLevel}`)}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                          {isFrench ? st.nameFr : st.nameAr}
                        </h4>
                        <p className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300">
                          🎖️ {isFrench ? st.badgeTitleFr : st.badgeTitleAr}
                        </p>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block">
                            {isFrench ? 'Avantages & Bonus :' : 'المزايا والمكافآت :'}
                          </span>
                          {(isFrench ? st.perksFr : st.perksAr).map((perk, i) => (
                            <div key={i} className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <Star className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-center">
                        {isCurrent ? (
                          <span className="text-xs font-black text-purple-600 dark:text-purple-300">
                            ✨ {isFrench ? 'Forme active' : 'هيئة ديدو الحالية'}
                          </span>
                        ) : isReached ? (
                          <span className="text-xs font-bold text-emerald-600">
                            ✓ {isFrench ? 'Débloqué avec succès' : 'مكتمل بنجاح'}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            🔒 {isFrench ? `Nécessite le niveau ${st.minLevel}` : `يتطلب الوصول للمستوى ${st.minLevel}`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: WISDOM & AUDIO DIALOGUES */}
          {activeTab === 'wisdom' && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-500/15 via-orange-500/15 to-amber-500/15 border-2 border-rose-400/50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  💬
                </div>
                <div className="text-start">
                  <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                    {isFrench ? "Paroles & Conseils d'encouragement de Didou" : "نصائح وكلمات ديدو المشجعة للأبطال"}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                    {isFrench
                      ? "Clique sur n'importe quel conseil pour l'écouter avec la voix audio de Didou !"
                      : "انقر على أي نصيحة للاستماع إليها بصوت ديدو المشجع والمبهج!"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isFrench ? DIDOU_DIALOGUES_FR : DIDOU_DIALOGUES_AR).map((quote, idx) => {
                  const isPlaying = playingDialogueIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePlayDialogue(quote, idx)}
                      className={`p-4 rounded-2xl border-2 text-start flex items-start gap-3 transition-all cursor-pointer ${
                        isPlaying
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 shadow-md scale-101'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          isPlaying ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                        }`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                          « {quote} »
                        </p>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 block">
                          {isPlaying ? (isFrench ? 'Lecture en cours...' : 'جاري الاستماع...') : (isFrench ? 'Écouter la voix' : 'انقر للاستماع')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
