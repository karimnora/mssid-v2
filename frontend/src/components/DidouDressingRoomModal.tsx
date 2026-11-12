import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
import { getDidouEnergy, getDidouEnergyAfterTreat, getDidouFriendshipLevel, getDidouStage } from '../utils/didouCompanion';
import { DidouOutfitItem, DidouOutfitId, DidouPetSpecies, DidouAvatarConfig } from '../types/ecosystem';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { speakText, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { useLocaleContext } from '../context/LocaleContext';
import { DidouPortrait } from './DidouPortrait';

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
  const reducedMotion = useReducedMotion();
  const voiceAvailable = useVoiceAvailable(isFrench ? 'fr-FR' : 'ar-SA');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const trackedTimeout = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => { timers.current = timers.current.filter(item => item !== timer); callback(); }, delay);
    timers.current.push(timer);
  };
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => previous?.focus();
  }, [isOpen]);

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
      timers.current.forEach(clearTimeout);
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
    trackedTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleEquip = (outfitId: DidouOutfitId) => {
    if (!unlockedOutfits.includes(outfitId)) return;

    setIsChangingOutfitAnim(true);
    trackedTimeout(() => setIsChangingOutfitAnim(false), 900);

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
    trackedTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleBuy = (outfit: DidouOutfitItem) => {
    if (currentCoins < outfit.priceGoldCoins) {
      setFeedbackMsg(
        isFrench
          ? `Pièces insuffisantes ! Il te manque ${outfit.priceGoldCoins - currentCoins} pièces.`
          : `رصيدك غير كافٍ! تحتاج ${outfit.priceGoldCoins - currentCoins} دينار ذهبي إضافي.`
      );
      trackedTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    setIsChangingOutfitAnim(true);
    trackedTimeout(() => setIsChangingOutfitAnim(false), 900);

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
    trackedTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleFeedTreat = (treat: typeof DIDOU_TREATS_LIST[0]) => {
    if (currentCoins < treat.priceGoldCoins) {
      setFeedbackMsg(
        isFrench
          ? `Pas assez de pièces ! Il te manque ${treat.priceGoldCoins - currentCoins} pièces 🪙`
          : `رصيدك غير كافٍ! تحتاج ${treat.priceGoldCoins - currentCoins} دينار ذهبي 🪙`
      );
      trackedTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    setEatingFoodIcon(treat.icon);
    setIsEatingAnim(true);
    trackedTimeout(() => setIsEatingAnim(false), 2200);

    const newCoins = currentCoins - treat.priceGoldCoins;
    const newEnergy = getDidouEnergyAfterTreat(activeAvatarConfig, treat.energyBonus);
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
    trackedTimeout(() => setFeedbackMsg(null), 4000);
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

  const tabs: { id: ModalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'wardrobe', label: isFrench ? 'Tenues' : 'ملابسي', icon: <Shirt /> },
    { id: 'nutrition', label: isFrench ? 'Nourrir' : 'غذائي', icon: <Utensils /> },
    { id: 'evolution', label: isFrench ? 'Grandir' : 'أكبر', icon: <Award /> },
    { id: 'wisdom', label: isFrench ? 'Parler' : 'نتحدث', icon: <MessageCircle /> },
  ];
  const nextStage = DIDOU_STAGES.find(stage => stage.minLevel > userLevel);
  const stageProgress = nextStage ? Math.max(0, Math.min(100, (userLevel - currentStage.minLevel) / (nextStage.minLevel - currentStage.minLevel) * 100)) : 100;
  const previewOutfit = activeTab === 'wardrobe' ? selectedOutfitId : activeOutfitId;

  return <div className="didou-studio-overlay fixed inset-0 z-[70] kids-modal-overlay flex items-center justify-center p-2 sm:p-5" dir={direction}>
    <motion.div role="dialog" aria-modal="true" aria-labelledby="didou-studio-title" data-didou-studio
      className="didou-studio" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
        if (event.key === 'Tab') {
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), [href], select, input, [tabindex="0"]'));
          const first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
      <header className="didou-studio-header">
        <div className="min-w-0">
          <h2 id="didou-studio-title">{isFrench ? 'Le coin de Didou' : 'ركن ديدو'}</h2>
          <p>{isFrench ? 'Un petit moment avec ton compagnon' : 'لحظة جميلة مع صديقك'}</p>
        </div>
        <button ref={closeButtonRef} type="button" className="didou-icon-button" onClick={onClose} aria-label={isFrench ? 'Fermer' : 'إغلاق'}><X /></button>
      </header>
      <div role="tablist" aria-label={isFrench ? 'Activités de Didou' : 'أنشطة ديدو'} className="didou-studio-tabs"
        onKeyDown={event => {
          let index = tabs.findIndex(tab => tab.id === activeTab);
          if (event.key === 'Home') index = 0;
          else if (event.key === 'End') index = tabs.length - 1;
          else if (event.key === 'ArrowRight') index = (index + (direction === 'rtl' ? -1 : 1) + tabs.length) % tabs.length;
          else if (event.key === 'ArrowLeft') index = (index + (direction === 'rtl' ? 1 : -1) + tabs.length) % tabs.length;
          else return;
          event.preventDefault(); setActiveTab(tabs[index].id); document.getElementById('didou-tab-' + tabs[index].id)?.focus();
        }}>
        {tabs.map(tab => <button key={tab.id} id={'didou-tab-' + tab.id} type="button" role="tab" aria-selected={activeTab === tab.id}
          aria-controls="didou-studio-panel" tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)}>{tab.icon}<span>{tab.label}</span></button>)}
      </div>
      <div ref={scrollAreaRef} className="didou-studio-scroll" tabIndex={0} role="region" aria-label={isFrench ? 'Espace de Didou' : 'مساحة ديدو'}>
        <div className="didou-studio-balance"><span>🪙 {currentCoins} {isFrench ? 'pièces' : 'قطعة'}</span><span>{isFrench ? 'Gagnées dans tes activités' : 'تكسبها في أنشطتك'}</span></div>
        {feedbackMsg && <p role="status" className="didou-feedback">{feedbackMsg}</p>}
        <div className="didou-studio-layout">
          <aside className="didou-studio-preview">
            <DidouPortrait species={activeSpecies} outfitId={previewOutfit} stage={currentStage.stage} size="xl"
              label={isFrench ? 'Didou, ' + currentStage.nameFr : 'ديدو، ' + currentStage.nameAr} mood="happy"
              isEating={isEatingAnim} eatingFoodIcon={eatingFoodIcon} isChangingOutfit={isChangingOutfitAnim} />
            <div className="didou-preview-info">
              <p className="didou-stage-label">{isFrench ? currentStage.nameFr : currentStage.nameAr}</p>
              <p className="didou-small">{isFrench ? 'Niveau' : 'المستوى'} {userLevel} · ❤️ {friendshipLevel}/10</p>
              <label className="didou-meter-label">⚡ {isFrench ? 'Énergie' : 'الطاقة'} {currentEnergy}%
                <progress value={currentEnergy} max={100} aria-label={isFrench ? 'Énergie de Didou' : 'طاقة ديدو'} /></label>
              {activeTab === 'wardrobe' && <>
                <p className="font-extrabold text-sm">{isFrench ? selectedOutfit.nameFr : selectedOutfit.nameAr}</p>
                {isEquipped ? <p className="didou-equipped"><Check className="w-4 h-4" />{isFrench ? 'Tenue portée' : 'أرتدي هذا الزي'}</p>
                  : <button type="button" className="didou-primary-button" disabled={isChangingOutfitAnim || (!isUnlocked && currentCoins < selectedOutfit.priceGoldCoins)}
                    onClick={() => isUnlocked ? handleEquip(selectedOutfit.id) : handleBuy(selectedOutfit)}>
                    {isUnlocked ? (isFrench ? 'Porter cette tenue' : 'أرتدي هذا الزي') : `${isFrench ? 'Débloquer' : 'أفتح الزي'} · ${selectedOutfit.priceGoldCoins} 🪙`}
                  </button>}
                {!isUnlocked && currentCoins < selectedOutfit.priceGoldCoins && <p className="didou-small">{isFrench ? 'Continue tes activités pour gagner des pièces.' : 'تابع أنشطتك لتكسب قطعاً إضافية.'}</p>}
              </>}
            </div>
          </aside>
          <section role="tabpanel" id="didou-studio-panel" aria-labelledby={'didou-tab-' + activeTab} className="didou-studio-content">
            {activeTab === 'wardrobe' && <>
              <h3>{isFrench ? 'La garde-robe' : 'خزانة ملابسي'}</h3>
              <div className="didou-species" role="group" aria-label={isFrench ? 'Choisir ton compagnon' : 'اختر صديقك'}>
                <button type="button" aria-pressed={activeSpecies === 'fennec'} onClick={() => handleSpeciesChange('fennec')}>🦊 {isFrench ? 'Fennec' : 'الفنك'}</button>
                <button type="button" aria-pressed={activeSpecies === 'eagle'} onClick={() => handleSpeciesChange('eagle')}>🦅 {isFrench ? 'Aiglon' : 'العقاب'}</button>
              </div>
              <div className="didou-filter-row" role="group" aria-label={isFrench ? 'Types de tenues' : 'أنواع الأزياء'}>
                {(['all', 'clothing', 'headwear'] as const).map((category, i) => <button type="button" key={category} aria-pressed={outfitCategory === category} onClick={() => setOutfitCategory(category)}>{(isFrench ? ['Tout', 'Tenues', 'Coiffes'] : ['الكل', 'أزياء', 'قبعات'])[i]}</button>)}
              </div>
              <div className="didou-outfit-grid">{filteredOutfits.map(outfit => <button type="button" className="didou-outfit-choice" key={outfit.id} data-outfit={outfit.id}
                aria-pressed={selectedOutfitId === outfit.id} onClick={() => {
                  setSelectedOutfitId(outfit.id);
                  if (window.matchMedia('(max-width: 639px)').matches) scrollAreaRef.current?.scrollTo?.({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
                }}>
                <span className="didou-outfit-symbol" aria-hidden="true">{outfit.icon}</span>
                <span className="font-extrabold">{isFrench ? outfit.nameFr : outfit.nameAr}</span>
                <span className="didou-small">{activeOutfitId === outfit.id ? (isFrench ? 'Portée ✓' : 'أرتديها ✓') : unlockedOutfits.includes(outfit.id) ? (isFrench ? 'Disponible' : 'متاح') : `${outfit.priceGoldCoins} 🪙`}</span>
              </button>)}</div>
            </>}
            {activeTab === 'nutrition' && <>
              <h3>{isFrench ? 'À table, Didou !' : 'هيا نأكل يا ديدو!'}</h3>
              <p className="didou-description">{isFrench ? 'Choisis une gourmandise et regarde son énergie.' : 'اختر طعاماً لديدو وانظر إلى طاقته.'}</p>
              <div className="didou-food-grid">{DIDOU_TREATS_LIST.map(treat => <article key={treat.id} className="didou-food-choice" data-treat={treat.id}>
                <span className="didou-food-symbol" aria-hidden="true">{treat.icon}</span>
                <h4>{isFrench ? treat.nameFr : treat.nameAr}</h4>
                <p className="didou-small">⚡ +{treat.energyBonus}% · +{treat.xpBonus} XP</p>
                <button type="button" className="didou-primary-button" disabled={currentCoins < treat.priceGoldCoins || isEatingAnim} onClick={() => handleFeedTreat(treat)}>
                  {isFrench ? 'Donner' : 'أقدم'} · {treat.priceGoldCoins} 🪙
                </button>
              </article>)}</div>
            </>}
            {activeTab === 'evolution' && <>
              <h3>{isFrench ? 'Didou grandit avec toi' : 'ديدو يكبر معك'}</h3>
              <p className="didou-description">{nextStage ? (isFrench ? `Prochaine étape au niveau ${nextStage.minLevel}. Continue à apprendre à ton rythme.` : `المرحلة التالية في المستوى ${nextStage.minLevel}. تعلّم على مهل وبثقة.`) : (isFrench ? 'Tu as atteint la dernière étape de Didou !' : 'وصلت إلى آخر مرحلة لديدو!')}</p>
              <progress className="didou-growth-progress" value={stageProgress} max={100} aria-label={isFrench ? 'Progression vers la prochaine étape' : 'التقدم نحو المرحلة التالية'} />
              <ol className="didou-growth-steps">{DIDOU_STAGES.map(stage => <li key={stage.stage} data-current={stage.stage === currentStage.stage || undefined} aria-current={stage.stage === currentStage.stage ? 'step' : undefined}>
                <span className="didou-growth-icon" aria-hidden="true">{activeSpecies === 'fennec' ? stage.iconFennec : stage.iconEagle}</span>
                <div><h4>{isFrench ? stage.nameFr : stage.nameAr}</h4><p className="didou-small">{isFrench ? 'Niveau' : 'المستوى'} {stage.minLevel}</p></div>
                <span className="didou-small">{stage.stage === currentStage.stage ? (isFrench ? 'Maintenant' : 'الآن') : userLevel >= stage.minLevel ? '✓' : '🔒'}</span>
              </li>)}</ol>
            </>}
            {activeTab === 'wisdom' && <>
              <h3>{isFrench ? 'Un petit mot de Didou' : 'كلمة من ديدو'}</h3>
              <p className="didou-description">{isFrench ? 'Des encouragements à lire ou à écouter.' : 'كلمات تشجيع تقرؤها أو تسمعها.'}</p>
              {voiceAvailable === false && <p className="didou-small">{isFrench ? 'La voix n’est pas disponible sur cet appareil. Tu peux lire tous les messages.' : 'الصوت غير متاح على هذا الجهاز. يمكنك قراءة كل الرسائل.'}</p>}
              <div className="didou-dialogues">{(isFrench ? DIDOU_DIALOGUES_FR : DIDOU_DIALOGUES_AR).map((quote, index) => <article key={index} data-speaking={playingDialogueIndex === index || undefined}>
                <p>{quote}</p>
                {voiceAvailable === true && <button type="button" className="didou-secondary-button" onClick={() => {
                  if (playingDialogueIndex === index) { stopSpeech(); setPlayingDialogueIndex(null); } else handlePlayDialogue(quote, index);
                }}><Volume2 className="w-4 h-4" />{playingDialogueIndex === index ? (isFrench ? 'Arrêter' : 'أوقف') : (isFrench ? 'Écouter' : 'أستمع')}</button>}
              </article>)}</div>
            </>}
          </section>
        </div>
      </div>
    </motion.div>
  </div>;
};
