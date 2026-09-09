import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText as speakTextShared } from '../utils/speech';
import {
  ShoppingBag,
  Coins,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Award,
  Sparkles,
  Volume2,
  Plus,
  Minus,
  Store,
  Zap,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { AuthService } from '../services/authService';

interface MarketItem {
  id: string;
  nameAr: string;
  priceDzd: number;
  icon: string;
  unitAr: string;
  category: 'food' | 'fruits' | 'school' | 'artisan';
}

const MARKET_PRODUCTS: MarketItem[] = [
  // Fruits & Agriculture
  { id: 'dates', nameAr: 'تمر دقلة نور بسكرة الذهبي', priceDzd: 450, icon: '🌴', unitAr: '1 كلغ', category: 'fruits' },
  { id: 'oranges', nameAr: 'برتقال متيجة وبوفاريك اللذيذ', priceDzd: 200, icon: '🍊', unitAr: '1 كلغ', category: 'fruits' },
  { id: 'apples', nameAr: 'تفاح الأوراس وخنشلة الأحمر', priceDzd: 320, icon: '🍎', unitAr: '1 كلغ', category: 'fruits' },
  { id: 'olives', nameAr: 'زيتون معسكر والقبائل الطبيعي', priceDzd: 300, icon: '🫒', unitAr: 'علبة', category: 'fruits' },
  { id: 'strawberries', nameAr: 'فراولة سكيكدة الطازجة', priceDzd: 380, icon: '🍓', unitAr: 'علبة', category: 'fruits' },

  // Daily Food
  { id: 'bread', nameAr: 'خبز الدار الجزائري بالسمسم', priceDzd: 50, icon: '🥖', unitAr: '1 خبزة', category: 'food' },
  { id: 'milk', nameAr: 'كيس حليب مبستر مقنن', priceDzd: 25, icon: '🥛', unitAr: '1 كيس', category: 'food' },
  { id: 'couscous', nameAr: 'كسكسي القمح الصلب الممتاز', priceDzd: 240, icon: '🥣', unitAr: '1 كلغ', category: 'food' },
  { id: 'cheese', nameAr: 'جبن تقليدي طري وطبيعي', priceDzd: 180, icon: '🧀', unitAr: 'علبة', category: 'food' },
  { id: 'kalb_louz', nameAr: 'قلب اللوز الجزائري بالعسل', priceDzd: 150, icon: '🍯', unitAr: 'قطعة', category: 'food' },

  // School Supplies
  { id: 'notebook', nameAr: 'كراس مدرسي 96 صفحة ملون', priceDzd: 120, icon: '📓', unitAr: '1 كراس', category: 'school' },
  { id: 'color_pencils', nameAr: 'علبة أقلام تلوين خشبية (12 لون)', priceDzd: 260, icon: '🎨', unitAr: 'علبة', category: 'school' },
  { id: 'pencil_case', nameAr: 'مقلمة مدرسية مطرزة', priceDzd: 350, icon: '✏️', unitAr: 'مقلمة', category: 'school' },
  { id: 'geometry_set', nameAr: 'علبة أدوات هندسية (منقلة ومسطرة)', priceDzd: 280, icon: '📐', unitAr: 'طقم', category: 'school' },

  // Traditional & Artisan
  { id: 'pottery', nameAr: 'فخار تيزي وزو وتيبازة المزخرف', priceDzd: 650, icon: '🏺', unitAr: 'قطعة', category: 'artisan' },
  { id: 'rug_mini', nameAr: 'زربية غرداية التذكارية المنسوجة', priceDzd: 950, icon: '🧶', unitAr: 'قطعة', category: 'artisan' },
  { id: 'traditional_soap', nameAr: 'صابون زيت الزيتون التقليدي', priceDzd: 90, icon: '🧼', unitAr: 'قطعة', category: 'artisan' },
];

const CURRENCY_DENOMINATIONS = [
  // Banknotes (الأوراق النقدية). The 2000/500 DA notes use an inline `swatchStyle` gradient
  // instead of Tailwind's `from-indigo-*`/`from-purple-*` classes: those class names are matched
  // (as substrings) by the global .lab-interior "force dark instrument panels to light" CSS rule
  // in index.css, which was silently repainting these two real, content-accurate banknote colors
  // to plain white — leaving the (also white) label text invisible on a blank swatch.
  { value: 2000, type: 'bill', color: 'border-blue-400 text-white', swatchStyle: { background: 'linear-gradient(to bottom right, #1D4ED8, #312E81)' }, label: '2000 دج', sub: 'ورقة نقدية زرقاء' },
  { value: 1000, type: 'bill', color: 'from-emerald-700 to-teal-900 border-emerald-400 text-white', label: '1000 دج', sub: 'ورقة نقدية خضراء' },
  { value: 500, type: 'bill', color: 'border-purple-400 text-white', swatchStyle: { background: 'linear-gradient(to bottom right, #9333EA, #6B21A8)' }, label: '500 دج', sub: 'ورقة نقدية بنفسجية' },

  // Coins (القطع النقدية)
  { value: 200, type: 'coin', color: 'from-amber-400 to-yellow-500 border-amber-600 text-amber-950 font-black', label: '200 دج', sub: 'قطعة ثنائية المعدن' },
  { value: 100, type: 'coin', color: 'from-slate-200 to-slate-400 border-slate-500 text-slate-900 font-black', label: '100 دج', sub: 'قطعة ثنائية المعدن' },
  { value: 50, type: 'coin', color: 'from-amber-300 to-yellow-400 border-yellow-600 text-yellow-950 font-black', label: '50 دج', sub: 'قطعة معدنية' },
  { value: 20, type: 'coin', color: 'from-yellow-500 to-amber-600 border-yellow-700 text-white font-black', label: '20 دج', sub: 'قطعة معدنية' },
  { value: 10, type: 'coin', color: 'from-amber-400 to-amber-600 border-amber-700 text-amber-950 font-black', label: '10 دج', sub: 'قطعة ألمنيوم/برونز' },
  { value: 5, type: 'coin', color: 'from-slate-300 to-slate-400 border-slate-500 text-slate-900 font-black', label: '5 دج', sub: 'قطعة معدنية صغيرة' },
];

const GAME_SCENARIOS = [
  {
    id: 1,
    customer: 'العم بلقاسم',
    avatar: '👴',
    storyAr: 'اشترى العم بلقاسم 2 كلغ من تمر دقلة نور بسكرة (900 دج) ودفع بورقة 1000 دج.',
    totalCost: 900,
    paidAmount: 1000,
    expectedChange: 100,
    paidBillLabel: 'ورقة 1000 دج',
  },
  {
    id: 2,
    customer: 'الخالة فاطمة',
    avatar: '👵',
    storyAr: 'اشترت الخالة فاطمة سميد للكسكسي وكيس حليب بمجموع 265 دج ودفعت ورقة 500 دج.',
    totalCost: 265,
    paidAmount: 500,
    expectedChange: 235,
    paidBillLabel: 'ورقة 500 دج',
  },
  {
    id: 3,
    customer: 'الأستاذ توفيق',
    avatar: '👨‍🏫',
    storyAr: 'اشترى الأستاذ توفيق كراسات ومستلزمات مدرسية بمبلغ 1450 دج ودفع ورقة 2000 دج.',
    totalCost: 1450,
    paidAmount: 2000,
    expectedChange: 550,
    paidBillLabel: 'ورقة 2000 دج',
  },
  {
    id: 4,
    customer: 'الصديق يوسف',
    avatar: '👦',
    storyAr: 'اشترى يوسف برتقال وخبز الدار بمبلغ 250 دج ودفع قطعتين من 200 دج (المجموع 400 دج).',
    totalCost: 250,
    paidAmount: 400,
    expectedChange: 150,
    paidBillLabel: 'قطعتين 200 دج (400 دج)',
  },
  {
    id: 5,
    customer: 'الأخت أمينة',
    avatar: '👧',
    storyAr: 'اشترت أمينة علبة ألوان خشبية ومقلمة بمبلغ 610 دج ودفعت ورقة 1000 دج.',
    totalCost: 610,
    paidAmount: 1000,
    expectedChange: 390,
    paidBillLabel: 'ورقة 1000 دج',
  },
  {
    id: 6,
    customer: 'الحاج مسعود',
    avatar: '🧓',
    storyAr: 'اشترى الحاج مسعود زيتون معسكر وزيت زيتون وصابون طبيعي بمبلغ 740 دج ودفع ورقة 1000 دج.',
    totalCost: 740,
    paidAmount: 1000,
    expectedChange: 260,
    paidBillLabel: 'ورقة 1000 دج',
  },
];

const SPEED_MATH_CHALLENGES = [
  { question: 'ما هو باقي طرح 1000 دج - 650 دج؟', options: [350, 450, 250, 300], answer: 350, explanation: '1000 - 650 = 350 دج' },
  { question: 'كم قطعة من فئة 50 دج نحتاج لتكوين 200 دج؟', options: [4, 2, 5, 3], answer: 4, explanation: '50 × 4 = 200 دج (4 قطع)' },
  { question: 'كم دينار جزائري تساوي 3 أوراق نقدية من فئة 500 دج؟', options: [1500, 1000, 2000, 1200], answer: 1500, explanation: '3 × 500 = 1500 دج' },
  { question: 'اشتريت كيس حليب (25 دج) وخبزة (50 دج). كم المجموع؟', options: [75, 65, 80, 70], answer: 75, explanation: '25 + 50 = 75 دج' },
  { question: 'دفعت ورقة 2000 دج ومشترياتك 1600 دج. كم الصرف المسترجع؟', options: [400, 300, 500, 600], answer: 400, explanation: '2000 - 1600 = 400 دج' },
  { question: 'كم قطعة من فئة 20 دج نحتاج لتكوين 100 دج؟', options: [5, 4, 10, 6], answer: 5, explanation: '20 × 5 = 100 دج (5 قطع)' },
];

interface AlgerianCurrencyMarketProps {
  onBack?: () => void;
  grade?: string;
  goldCoins?: number;
  onEarnCoins?: (amount: number) => void;
}

// 1AP (nombres < 100) ne voit que les pièces courantes ; 2AP (nombres < 1000) débloque les
// billets jusqu'à 1000 DA ; à partir de 3AP (nombres < 100 000) toutes les coupures sont visibles.
const getMaxDenominationForGrade = (grade?: string): number => {
  if (grade === '1AP') return 100;
  if (grade === '2AP') return 1000;
  return Infinity;
};

export const AlgerianCurrencyMarket: React.FC<AlgerianCurrencyMarketProps> = ({
  onBack,
  grade = '3AP',
  goldCoins = 150,
  onEarnCoins,
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'change_game' | 'speed_math'>('shop');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');

  const visibleDenominations = useMemo(() => {
    const maxValue = getMaxDenominationForGrade(grade);
    return CURRENCY_DENOMINATIONS.filter((cur) => cur.value <= maxValue);
  }, [grade]);

  // Shopping mode state
  const [cart, setCart] = useState<Record<string, number>>({ dates: 1, milk: 2, bread: 1 });
  const [tenderedBills, setTenderedBills] = useState<number[]>([]);
  const [shopFeedback, setShopFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Change making game state
  const [gameScenarioIndex, setGameScenarioIndex] = useState(0);
  const [gameGivenMoney, setGameGivenMoney] = useState<number[]>([]);
  const [gameFeedback, setGameFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [gameScore, setGameScore] = useState(0);

  // Speed Math State
  const [mathIndex, setMathIndex] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [selectedMathOption, setSelectedMathOption] = useState<number | null>(null);
  const [mathFeedback, setMathFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const currentScenario = GAME_SCENARIOS[gameScenarioIndex % GAME_SCENARIOS.length];
  const currentMath = SPEED_MATH_CHALLENGES[mathIndex % SPEED_MATH_CHALLENGES.length];

  // Delegates to the shared, feature-flag-gated implementation (see utils/speech.ts) so voiceReading
  // actually controls this like every other narration in the app.
  const speakText = (text: string) => {
    speakTextShared(text, 'ar-SA', 0.92);
  };

  // Cart calculations
  const cartTotal = useMemo(() => {
    return (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
      const p = MARKET_PRODUCTS.find((item) => item.id === id);
      return sum + (p ? p.priceDzd * Number(qty) : 0);
    }, 0);
  }, [cart]);

  const tenderedTotal = useMemo(() => {
    return tenderedBills.reduce((sum, val) => sum + val, 0);
  }, [tenderedBills]);

  const filteredProducts = useMemo(() => {
    if (selectedProductCategory === 'all') return MARKET_PRODUCTS;
    return MARKET_PRODUCTS.filter((p) => p.category === selectedProductCategory);
  }, [selectedProductCategory]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setShopFeedback(null);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
    setShopFeedback(null);
  };

  const handlePay = () => {
    if (cartTotal === 0) {
      setShopFeedback({ success: false, message: 'سلتك فارغة! اختر بعض المواد الجزائرية أولاً.' });
      return;
    }

    if (tenderedTotal < cartTotal) {
      const diff = cartTotal - tenderedTotal;
      setShopFeedback({
        success: false,
        message: `المبلغ المدفوع غير كافٍ! ينقصك ${diff} دج لإتمام الشراء. أضف نقوداً أخرى إلى الصندوق.`,
      });
      speakText(`المبلغ غير كافٍ! ينقصك ${diff} دينار جزائري.`);
    } else {
      const change = tenderedTotal - cartTotal;
      const msg =
        change === 0
          ? `ممتاز جداً يا بطل! لقد دفعت الحساب بالتمام والكمال (${tenderedTotal} دج). بارك الله فيك!`
          : `أحسنت صنعاً! لقد دفعت ${tenderedTotal} دج وسيرجع لك البائع صرفاً قدره ${change} دج. 🪙✨`;

      setShopFeedback({ success: true, message: msg });
      speakText(msg);

      // Award XP & Gold Coins
      AuthService.addScore(35);
      if (onEarnCoins) onEarnCoins(15);
    }
  };

  const handleGameAddChange = (val: number) => {
    setGameGivenMoney((prev) => [...prev, val]);
    setGameFeedback(null);
  };

  const handleGameRemoveChange = (index: number) => {
    setGameGivenMoney((prev) => prev.filter((_, i) => i !== index));
    setGameFeedback(null);
  };

  const gameGivenTotal = useMemo(() => {
    return gameGivenMoney.reduce((sum, val) => sum + val, 0);
  }, [gameGivenMoney]);

  const handleCheckChange = () => {
    if (gameGivenTotal === currentScenario.expectedChange) {
      setGameFeedback({
        success: true,
        message: `إجابة عبقرية وصحيحة! الصرف الصحيح هو بالضبط ${currentScenario.expectedChange} دج! (+50 نقطة و20 دينار ذهبي 🪙)`,
      });
      speakText(`أحسنت! إجابة صحيحة، الصرف هو ${currentScenario.expectedChange} دينار جزائري.`);
      setGameScore((prev) => prev + 1);
      AuthService.addScore(50);
      if (onEarnCoins) onEarnCoins(20);
    } else {
      const diff = Math.abs(gameGivenTotal - currentScenario.expectedChange);
      const isMore = gameGivenTotal > currentScenario.expectedChange;
      setGameFeedback({
        success: false,
        message: isMore
          ? `لقد أرجعت زيادة قدرها ${diff} دج! أعد الحساب وانزع بعض القطع النقدية.`
          : `الصرف ينقصه ${diff} دج! أضف قطعاً نقدية لتصل إلى ${currentScenario.expectedChange} دج.`,
      });
      speakText(isMore ? `لقد أرجعت زيادة قدرها ${diff} دينار.` : `ينقصك ${diff} دينار.`);
    }
  };

  const nextScenario = () => {
    setGameScenarioIndex((prev) => prev + 1);
    setGameGivenMoney([]);
    setGameFeedback(null);
  };

  // Speed Math Answer
  const handleSpeedMathAnswer = (opt: number) => {
    if (selectedMathOption !== null) return;
    setSelectedMathOption(opt);
    if (opt === currentMath.answer) {
      setMathScore((prev) => prev + 1);
      setMathFeedback({
        success: true,
        text: `ممتاز! إجابة صحيحة: ${currentMath.explanation} (+25 نقطة 🏆)`,
      });
      speakText('ممتاز! إجابة صحيحة.');
      AuthService.addScore(25);
      if (onEarnCoins) onEarnCoins(10);
    } else {
      setMathFeedback({
        success: false,
        text: `للأسف إجابة خاطئة! الحل الصحيح هو: ${currentMath.explanation}`,
      });
      speakText('إجابة خاطئة، انتبه للشرح.');
    }
  };

  const handleNextSpeedMath = () => {
    setMathIndex((prev) => prev + 1);
    setSelectedMathOption(null);
    setMathFeedback(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 dir-rtl" dir="rtl">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-700 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/30">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
            🏪
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                سوق المسيد وحساب الدنانير الجزائرية (DA)
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                محاكي الرياضيات والتجارة
              </span>
            </div>
            <p className="text-amber-100 text-xs sm:text-sm mt-1.5 font-medium max-w-2xl leading-relaxed">
              محاكي دكان الخيرات الجزائرية: تعلّم استعمال الأوراق والقطع النقدية الرسمية (5 دج إلى 2000 دج)، جمع الفواتير، وإرجاع الصرف بدقة!
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            aria-label="العودة للأدوات"
            className="z-10 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl transition-all border border-white/30 shadow-sm cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('shop')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛒 عربة التسوق والدفع بالدنانير</span>
        </button>

        <button
          onClick={() => setActiveTab('change_game')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'change_game'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>🧮 لعبة التاجر وإرجاع الصرف ({gameScore} أرباح)</span>
        </button>

        <button
          onClick={() => setActiveTab('speed_math')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'speed_math'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>⚡ تحدي الحساب السريع بالدنانير</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SHOPPING & BILL PAYING                            */}
      {/* ======================================================== */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Products Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base font-black text-[var(--app-text)] flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>دكان الخيرات الجزائرية (اختر المواد وضعها في السلة):</span>
              </h2>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'food', label: '🥣 غذائية' },
                  { id: 'fruits', label: '🍊 فواكه وخضر' },
                  { id: 'school', label: '📓 مدرسية' },
                  { id: 'artisan', label: '🏺 تقليدية' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedProductCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      selectedProductCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredProducts.map((prod) => {
                const countInCart = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className={`bg-[var(--app-card-bg)] rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                      countInCart > 0
                        ? 'border-emerald-500 shadow-md bg-emerald-50/10'
                        : 'border-[var(--app-card-border)] shadow-xs hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-3xl p-1.5 bg-[var(--app-card-subtle)] rounded-xl">
                        {prod.icon}
                      </span>
                      <span className="bg-amber-100 text-amber-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                        {prod.priceDzd} دج
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <h3 className="font-black text-xs sm:text-sm text-[var(--app-text)] line-clamp-1">
                        {prod.nameAr}
                      </h3>
                      <p className="text-[11px] text-[var(--app-text-muted)] font-medium mt-0.5">
                        الوحدة: {prod.unitAr}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--app-card-border)]">
                      {countInCart > 0 ? (
                        <div className="flex items-center gap-2 w-full justify-between">
                          <button
                            onClick={() => removeFromCart(prod.id)}
                            aria-label={`إنقاص كمية ${prod.nameAr}`}
                            className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center font-black transition-colors cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-black text-emerald-800 dark:text-emerald-300 text-sm">
                            {countInCart}
                          </span>
                          <button
                            onClick={() => addToCart(prod.id)}
                            aria-label={`زيادة كمية ${prod.nameAr}`}
                            className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center justify-center font-black transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(prod.id)}
                          className="w-full py-2 bg-[var(--app-card-subtle)] hover:bg-emerald-700 hover:text-white rounded-xl text-xs font-black text-[var(--app-text)] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة للسلة</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cash Register & Cart Total (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-6">
            <div className="bg-[var(--app-card-bg)] rounded-3xl p-5 border border-[var(--app-card-border)] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-3">
                <h3 className="font-black text-[var(--app-text)] flex items-center gap-2 text-sm sm:text-base">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  <span>فاتورة المشتريات:</span>
                </h3>
                <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-2xl border border-emerald-200">
                  {cartTotal} دج
                </span>
              </div>

              {/* Items summary */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {Object.keys(cart).length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 font-medium">
                    السلة فارغة، اضغط على المواد أعلاه لإضافتها
                  </p>
                ) : (
                  (Object.entries(cart) as [string, number][]).map(([id, qty]) => {
                    const prod = MARKET_PRODUCTS.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-xs bg-[var(--app-card-subtle)] p-2 rounded-xl border border-[var(--app-card-border)]"
                      >
                        <span className="font-bold text-[var(--app-text)] truncate max-w-[180px]">
                          {prod.nameAr} × {qty}
                        </span>
                        <span className="font-black text-emerald-800 dark:text-emerald-300">
                          {prod.priceDzd * Number(qty)} دج
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cash payment tray */}
              <div className="space-y-2.5 pt-2 border-t border-[var(--app-card-border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--app-text-muted)]">
                    اضغط على النقود لدفعها في الصندوق:
                  </span>
                  {tenderedBills.length > 0 && (
                    <button
                      onClick={() => setTenderedBills([])}
                      className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                    >
                      تفريغ الصندوق
                    </button>
                  )}
                </div>

                {/* Denominations Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {visibleDenominations.map((cur) => (
                    <button
                      key={cur.value}
                      onClick={() => setTenderedBills((prev) => [...prev, cur.value])}
                      className={`p-2 rounded-xl border text-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer bg-gradient-to-br ${cur.color}`}
                      style={cur.swatchStyle}
                    >
                      <span className="block text-xs font-black">{cur.label}</span>
                    </button>
                  ))}
                </div>

                {/* Total placed in cash register */}
                <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-3 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-900 dark:text-amber-300 font-bold block">
                      المبلغ الذي وضعته في الصندوق:
                    </span>
                    <span className="text-xl font-black text-amber-950 dark:text-amber-200">
                      {tenderedTotal} دج
                    </span>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>

                <button
                  onClick={handlePay}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-2xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>تأكيد الدفع واستلام وصل الشراء</span>
                </button>
              </div>

              {shopFeedback && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-black flex items-start gap-2 border ${
                    shopFeedback.success
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-rose-100 text-rose-950 border-rose-300'
                  }`}
                >
                  <span className="text-lg">{shopFeedback.success ? '🎉' : '⚠️'}</span>
                  <div className="flex-1 leading-relaxed">{shopFeedback.message}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CASHIER CHANGE-MAKING GAME                        */}
      {/* ======================================================== */}
      {activeTab === 'change_game' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6">
            {/* Customer scenario banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-200">
                  {currentScenario.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-[var(--app-text)] text-base">
                      زبون جديد: {currentScenario.customer}
                    </h3>
                    <button
                      onClick={() => speakText(currentScenario.storyAr)}
                      className="p-1 rounded-lg bg-amber-200 text-amber-950 hover:bg-amber-300 cursor-pointer"
                      title="استمع للطلب"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-bold mt-1 leading-relaxed">
                    {currentScenario.storyAr}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl text-center border border-amber-300">
                  <span className="text-[10px] font-extrabold text-[var(--app-text-muted)] block">
                    ثمن المشتريات
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {currentScenario.totalCost} دج
                  </span>
                </div>
                <div className="bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-center shadow-xs">
                  <span className="text-[10px] font-extrabold text-emerald-100 block">
                    المبلغ المدفوع
                  </span>
                  <span className="text-sm font-black">{currentScenario.paidAmount} دج</span>
                </div>
              </div>
            </div>

            {/* Currency selector */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-[var(--app-text)]">
                🧮 اضغط على القطع والأوراق النقدية لتجهيز الصرف الصحيح للزبون:
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {visibleDenominations.map((cur) => (
                  <button
                    key={cur.value}
                    onClick={() => handleGameAddChange(cur.value)}
                    className={`py-3 px-2 rounded-2xl border text-center shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer bg-gradient-to-br ${cur.color}`}
                    style={cur.swatchStyle}
                  >
                    <span className="block text-xs font-black">{cur.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tray of selected change */}
            <div className="bg-[var(--app-card-subtle)] rounded-2xl p-4 border border-[var(--app-card-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[var(--app-text)]">
                  صينية الصرف المجهزة (المجموع:{' '}
                  <span className="text-amber-600 font-extrabold text-sm">
                    {gameGivenTotal} دج
                  </span>
                  )
                </span>
                {gameGivenMoney.length > 0 && (
                  <button
                    onClick={() => setGameGivenMoney([])}
                    className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                  >
                    إعادة البدء
                  </button>
                )}
              </div>

              <div className="min-h-16 bg-[var(--app-card-bg)] rounded-xl p-2.5 border border-dashed border-[var(--app-card-border)] flex flex-wrap items-center gap-2">
                {gameGivenMoney.length === 0 ? (
                  <span className="text-xs text-slate-400 font-medium">
                    انقر فوق فئات النقود أعلاه لإضافتها هنا للصرف...
                  </span>
                ) : (
                  gameGivenMoney.map((val, idx) => {
                    const match = CURRENCY_DENOMINATIONS.find((c) => c.value === val);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleGameRemoveChange(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border shadow-xs flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-br ${
                          match?.color || 'bg-slate-200'
                        }`}
                        style={match?.swatchStyle}
                        title="انقر للحذف"
                      >
                        <span>{val} دج</span>
                        <span className="text-[10px] opacity-60">✕</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Action Buttons & Feedback */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCheckChange}
                disabled={gameGivenMoney.length === 0}
                className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black rounded-2xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>تسليم الصرف للزبون وتأكيد العملية</span>
              </button>

              <button
                onClick={nextScenario}
                className="w-full sm:w-auto px-5 py-3 bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-border)] text-[var(--app-text)] font-black rounded-2xl transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <span>الانتقال للزبون التالي</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {gameFeedback && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-black flex items-start gap-2 border ${
                  gameFeedback.success
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}
              >
                <span className="text-xl">{gameFeedback.success ? '🎉' : '💡'}</span>
                <div className="flex-1 leading-relaxed">{gameFeedback.message}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SPEED MATH CHALLENGE                              */}
      {/* ======================================================== */}
      {activeTab === 'speed_math' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border border-[var(--app-card-border)] shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-teal-600" />
                <h3 className="font-black text-[var(--app-text)] text-base sm:text-lg">
                  تحدي الذكاء والحساب السريع بالدنانير
                </h3>
              </div>
              <span className="bg-teal-100 text-teal-900 text-xs font-black px-3 py-1 rounded-full">
                النتيجة: {mathScore} / {SPEED_MATH_CHALLENGES.length}
              </span>
            </div>

            {/* Question Box */}
            <div className="bg-teal-50 dark:bg-teal-950/30 p-5 rounded-2xl border border-teal-200 dark:border-teal-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-teal-800 dark:text-teal-300">
                  السؤال الرقم #{mathIndex + 1}:
                </span>
                <button
                  onClick={() => speakText(currentMath.question)}
                  className="p-1 rounded-lg bg-teal-200 text-teal-900 hover:bg-teal-300 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-relaxed">
                {currentMath.question}
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentMath.options.map((opt, idx) => {
                const isSelected = selectedMathOption === opt;
                const isCorrect = opt === currentMath.answer;

                let btnStyle =
                  'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text)] hover:border-teal-400';

                if (selectedMathOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-700 text-white border-emerald-700 font-black shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 text-white border-rose-700 font-black';
                  } else {
                    btnStyle = 'bg-[var(--app-card-subtle)] text-slate-400 border-transparent opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedMathOption !== null}
                    onClick={() => handleSpeedMathAnswer(opt)}
                    className={`p-4 rounded-2xl border-2 text-center text-sm font-black transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt} دج</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next */}
            {mathFeedback && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-black border ${
                    mathFeedback.success
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                      : 'bg-rose-100 text-rose-950 border-rose-300'
                  }`}
                >
                  {mathFeedback.text}
                </div>

                <button
                  onClick={handleNextSpeedMath}
                  className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-2xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>التالي</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};