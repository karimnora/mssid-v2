import React, { useState } from 'react';
import {
  Compass,
  Map,
  Clock,
  Shield,
  Award,
  Check,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  CloudRain,
  Mountain,
  Flag
} from 'lucide-react';

interface HistoryGeoProps {
  initialTab?: 'timeline' | 'map' | 'heroes' | 'climate';
  grade?: string;
}

export const HistoryGeoInteractive: React.FC<HistoryGeoProps> = ({ initialTab = 'timeline', grade = '4AP' }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'heroes' | 'climate'>(initialTab);

  /* ==========================================
     1. TIMELINE & PERIODS BUILDER
     ========================================== */
  const TIMELINE_PERIODS_4AP = [
    {
      id: 'p1_4ap',
      title: 'التاريخ المعلمي الشخصي والاجتماعي',
      dates: 'مراحل نمو الفرد والأسرة',
      keyEvent: 'تاريخ الميلاد، أول يوم بالطفولة والمدرسة، التخرج، وزفاف الأقارب والتويزة المحلية.',
      color: 'from-amber-600 to-amber-800'
    },
    {
      id: 'p2_4ap',
      title: 'التاريخ المعلمي الوطني والعالمي',
      dates: 'أيام مجيدة في الوطن والعالم',
      keyEvent: '1 نوفمبر (الثورة)، 5 جولية (الاستقلال)، 16 أفريل (يوم العلم)، و1 ماي (عيد العمال).',
      color: 'from-emerald-600 to-emerald-800'
    },
    {
      id: 'p3_4ap',
      title: 'المصادر التاريخية المادية',
      dates: 'الآثار الملموسة المتبقية من القدامى',
      keyEvent: 'المباني الأثرية (تيمقاد وجميلة)، الرسوم الصخرية بالتاسيلي، المسكوكات والنقوش.',
      color: 'from-sky-600 to-sky-800'
    },
    {
      id: 'p4_4ap',
      title: 'المصادر التاريخية اللامادية',
      dates: 'التراث الشفهي الموروث عِبر الأجيال',
      keyEvent: 'الحكايات والقصص الشعبية القديمة، الأشعار والفلكلور، والعادات والتقاليد الوطنية.',
      color: 'from-purple-600 to-purple-800'
    }
  ];

  const TIMELINE_PERIODS_5AP = [
    {
      id: 'p1_5ap',
      title: 'المرحلة القديمة',
      dates: 'من ظهور الكتابة (3200 ق.م) إلى سقوط روما (476 م)',
      keyEvent: 'تأسيس المملكة النوميدية وتوحيدها على يد الملك ماسينيسا وعاصمتها سيرتا.',
      color: 'from-amber-600 to-amber-800'
    },
    {
      id: 'p2_5ap',
      title: 'المرحلة الوسيطة',
      dates: 'من سقوط روما (476 م) إلى فتح القسطنطينية (1453 م)',
      keyEvent: 'الفتوحات الإسلامية وتأسيس الدول المستقلة (الرستمية، الحمادية، الزيانية).',
      color: 'from-emerald-600 to-emerald-800'
    },
    {
      id: 'p3_5ap',
      title: 'المرحلة الحديثة',
      dates: 'من فتح القسطنطينية (1453 م) إلى الاحتلال الفرنسي (1830 م)',
      keyEvent: 'انضمام الجزائر للدولة العثمانية وبناء الأسطول البحري الجزائري القوي.',
      color: 'from-sky-600 to-sky-800'
    },
    {
      id: 'p4_5ap',
      title: 'المرحلة المعاصرة',
      dates: 'من 1830 م إلى يومنا هذا',
      keyEvent: 'المقاومات الشعبية، اندلاع ثورة 1 نوفمبر 1954 واستقلال الجزائر 1962.',
      color: 'from-purple-600 to-purple-800'
    }
  ];

  const TIMELINE_PERIODS = grade === '4AP' ? TIMELINE_PERIODS_4AP : TIMELINE_PERIODS_5AP;

  const [selectedPeriod, setSelectedPeriod] = useState<number>(0);

  /* ==========================================
     2. MAP & BOUNDARIES GAME (حدود الجزائر والموقع)
     ========================================== */
  const BOUNDARIES_QUESTIONS = [
    { id: 'b1', position: 'شمالاً', correctName: 'البحر الأبيض المتوسط', options: ['البحر الأبيض المتوسط', 'المحيط الأطلسي', 'البحر الأحمر'], icon: '🌊' },
    { id: 'b2', position: 'شرقاً', correctName: 'تونس وليبيا', options: ['تونس وليبيا', 'المغرب والصحراء الغربية', 'مالي والنيجر'], icon: '🗺️' },
    { id: 'b3', position: 'غرباً', correctName: 'المغرب والصحراء الغربية وموريتانيا', options: ['المغرب والصحراء الغربية وموريتانيا', 'تونس وليبيا', 'مالي والنيجر'], icon: '🏜️' },
    { id: 'b4', position: 'جنوباً', correctName: 'مالي والنيجر', options: ['مالي والنيجر', 'تونس وليبيا', 'مصر والسودان'], icon: '☀️' }
  ];

  const [userBoundaries, setUserBoundaries] = useState<{ [key: string]: string }>({});

  const handleSelectBoundary = (pos: string, choice: string) => {
    setUserBoundaries((prev) => ({ ...prev, [pos]: choice }));
  };

  /* ==========================================
     3. ALGERIAN HISTORICAL HEROES (شخصيات وأبطال الجزائر)
     ========================================== */
  const HEROES_4AP = [
    {
      id: 'h1_4ap',
      name: 'الملك ماسينيسا',
      title: 'موحد المملكة النوميدية وعاصمتها سيرتا (قسنطينة)',
      period: '205 - 148 ق.م (الجزائر القديمة)',
      achievement: 'نجح في توحيد نوميديا الشرقية والغربية، طور الفلاحة وسك أول عملة نوميدية تحت شعار «إفريقيا للإفريقيين».',
      avatar: '👑'
    },
    {
      id: 'h2_4ap',
      name: 'الملك يوغورطة',
      title: 'بطل المقاومة النوميدية ضد الاستعمار الروماني',
      period: '111 - 105 ق.م (التاريخ القديم)',
      achievement: 'خاض حرباً شجاعة وذكية ضد الرومانيين وسجل خطة تينيبيديم الشجاعة لدحر الغزاة.',
      avatar: '🛡️'
    },
    {
      id: 'h3_4ap',
      name: 'الملك صيفاقس',
      title: 'ملك نوميديا الغربية وعاصمتها سيگا (عين تموشنت)',
      period: 'القرن 3 ق.م',
      achievement: 'أسس مملكة ماسيسايل وتولى تنظيم الجيش والتجارة البحرية بالصحراء والساحل.',
      avatar: '🏛️'
    },
    {
      id: 'h4_4ap',
      name: 'الملكة تين هينان',
      title: 'أم التوارق وسيدة الصحراء الجزائرية القديمة',
      period: 'القرن 4 م (أهقار - تمنراست)',
      achievement: 'أسست حكم أهقار وحمت الواحات والقوافل التجارية بصحراء الجزائر وتوجد آثار ضريحها بتمنراست.',
      avatar: '👑'
    }
  ];

  const HEROES_5AP = [
    {
      id: 'h1_5ap',
      name: 'الأمير عبد القادر الجزائري',
      title: 'مؤسس الدولة الجزائرية الحديثة وقائد المقاومة بالغرب',
      period: '1832 - 1847 م',
      achievement: 'بناء جيش منظم، صك العملة، وتأسيس عواصم متنقلة (الزمالة) ومعاهدات مثل دي ميشال والتاقنة.',
      avatar: '🗡️'
    },
    {
      id: 'h2_5ap',
      name: 'أحمد باي',
      title: 'بايلك الشرق وقائد مقاومة قسنطينة',
      period: '1830 - 1848 م',
      achievement: 'التصدي للحملة الفرنسية الأولى على قسنطينة 1836 والدفاع عن المدينة التاريخية.',
      avatar: '🏰'
    },
    {
      id: 'h3_5ap',
      name: 'لالة فاطمة نسومر',
      title: 'خنساء جرجرة وقائدة المقاومة بمنطقة القبائل',
      period: '1854 - 1857 م',
      achievement: 'الانتصار في معركة إشريضن وسباو وضياع خطط الجنرالات الفرنسيين.',
      avatar: '👩‍🦱'
    },
    {
      id: 'h4_5ap',
      name: 'مصطفى بن بولعيد',
      title: 'أب الثورة الجزائرية وقائد المنطقة الأولى (الأوراس)',
      period: '1954 - 1956 م',
      achievement: 'التخطيط لاندلاع ثورة 1 نوفمبر 1954 وتوفير السلاح والمال للثوار.',
      avatar: '⭐'
    }
  ];

  const HEROES = grade === '4AP' ? HEROES_4AP : HEROES_5AP;

  const [activeHeroIdx, setActiveHeroIdx] = useState<number>(0);

  /* ==========================================
     4. CLIMATE & RELIEF EXPLORER (الأقاليم والمناخ)
     ========================================== */
  const CLIMATES = [
    {
      id: 'c1',
      name: 'مناخ البحر الأبيض المتوسط',
      region: 'الإقليم الشمالي (الساحل والشريط التلي)',
      features: 'حار وجاف صيفاً، حار ورطب ممطر شتاءً. غطاء نباتي كثيف (أشجار الزيتون، الصنوبر، البلوط).',
      color: 'bg-emerald-950 border-emerald-500 text-emerald-200',
      icon: '🌧️'
    },
    {
      id: 'c2',
      name: 'المناخ القاري (السهبي)',
      region: 'الهضاب العليا الداخلية',
      features: 'حار وجاف صيفاً، بارد وقليل الأمطار شتاءً. حشائش الحلفاء والشيح.',
      color: 'bg-amber-950 border-amber-500 text-amber-200',
      icon: '🌾'
    },
    {
      id: 'c3',
      name: 'المناخ الصحراوي',
      region: 'الإقليم الجنوبي (الصحراء الكبرى)',
      features: 'شدديد الحرارة والجفاف صيفاً، شديد البرودة ليلاً شتاءً. أمطار نادرة ونباتات شوكية ونخيل الواحات.',
      color: 'bg-orange-950 border-orange-500 text-orange-200',
      icon: '☀️'
    }
  ];

  const [activeClimateIdx, setActiveClimateIdx] = useState<number>(0);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300">مَخْبَرُ التَّارِيخِ وَالجُغْرَافِيَا التَّفَاعُلِيِّ (Histoire & Géographie {grade})</h2>
            <p className="text-xs text-slate-400">برنامج الجيل الثاني • الخط الزمني، خرائط الجزائر، البطولات الوطنية والأقاليم المناخية</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">
            <Flag className="w-4 h-4 text-emerald-400" />
            <span>الجمهورية الجزائرية الديمقراطية الشعبية 🇩🇿</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'timeline'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>1. الخط الزمني للمراحل التاريخية</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'map'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>2. حدود وموقع الجزائر الجغرافي</span>
        </button>

        <button
          onClick={() => setActiveTab('heroes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'heroes'
              ? 'bg-purple-500 text-white border-purple-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>3. أبطال المقاومة والثورة الوطنية</span>
        </button>

        <button
          onClick={() => setActiveTab('climate')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'climate'
              ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>4. المناخ والتضاريس في الجزائر</span>
        </button>
      </div>

      {/* TAB 1: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs text-slate-200 leading-relaxed">
            <strong>⏳ استكشف المراحل التاريخية الأربعة للجزائر والعالم:</strong> انقر على أي مرحلة لاستكشاف إطارها الزمني وأبرز المحطات والمعالم التاريخية.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {TIMELINE_PERIODS.map((period, idx) => {
              const isSelected = selectedPeriod === idx;
              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(idx)}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between h-32 bg-gradient-to-br ${period.color} ${
                    isSelected ? 'ring-4 ring-amber-400 scale-[1.03] shadow-2xl' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-amber-200">المرحلة 0{idx + 1}</div>
                  <div className="text-base font-black text-white">{period.title}</div>
                  <div className="text-[10px] text-slate-200 line-clamp-1">{period.dates}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Period Box */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300">
                📌 {TIMELINE_PERIODS[selectedPeriod].title}
              </h3>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                {TIMELINE_PERIODS[selectedPeriod].dates}
              </span>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الحدث والمعلم التاريخي البارز في هذه المرحلة:</span>
              </div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                {TIMELINE_PERIODS[selectedPeriod].keyEvent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAP & BOUNDARIES */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs text-slate-200 leading-relaxed flex items-center justify-between">
            <div>
              <strong>🗺️ تحدي حدود الموقع الجغرافي للجزائر:</strong> حدد الجار أو البحر المناسب لكل جهة أصلية حول خريطة الوطن العزيز (المساحة: 2,381,741 كم²)!
            </div>
            <button
              onClick={() => setUserBoundaries({})}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs flex items-center gap-1 cursor-pointer border border-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" /> إعادة المحاولة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOUNDARIES_QUESTIONS.map((q) => {
              const currentChoice = userBoundaries[q.id];
              const isCorrect = currentChoice === q.correctName;

              return (
                <div key={q.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-300 flex items-center gap-2">
                      <span>{q.icon}</span>
                      <span>حدود الجزائر {q.position}:</span>
                    </span>
                    {currentChoice && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-rose-950 text-rose-300 border border-rose-500'}`}>
                        {isCorrect ? '✅ صحيحة' : '❌ خاطئة'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectBoundary(q.id, opt)}
                        className={`p-3 rounded-xl border text-right text-xs font-bold transition-all cursor-pointer ${
                          currentChoice === opt
                            ? opt === q.correctName
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                              : 'bg-rose-950 border-rose-400 text-rose-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(userBoundaries).length === BOUNDARIES_QUESTIONS.length && (
            <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-200 rounded-2xl text-center space-y-2">
              <Award className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
              <div className="text-base font-black">🇩🇿 ممتاز! أتقنت جميع الحدود الجغرافية للجزائر الحبيبة!</div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HEROES */}
      {activeTab === 'heroes' && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {HEROES.map((h, idx) => (
              <button
                key={h.id}
                onClick={() => setActiveHeroIdx(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                  activeHeroIdx === idx
                    ? 'bg-purple-600 text-white border-purple-300 shadow-md scale-[1.02]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>{h.avatar}</span>
                <span>{h.name}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <span className="text-4xl p-3 bg-slate-900 rounded-2xl border border-slate-800">{HEROES[activeHeroIdx].avatar}</span>
              <div>
                <h3 className="text-lg font-black text-purple-300">{HEROES[activeHeroIdx].name}</h3>
                <p className="text-xs text-amber-300 font-bold">{HEROES[activeHeroIdx].title}</p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">الفترة والمرحلة: {HEROES[activeHeroIdx].period}</div>
              </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-black text-emerald-400">📜 إنجازاته البطولية ومقومات نضاله:</div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                {HEROES[activeHeroIdx].achievement}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLIMATE */}
      {activeTab === 'climate' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CLIMATES.map((c, idx) => (
              <div key={c.id} className={`p-5 rounded-3xl border ${c.color} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="text-xs font-mono font-bold bg-slate-900/60 px-2.5 py-1 rounded-full text-white">إقليم 0{idx + 1}</span>
                </div>
                <h3 className="text-base font-black">{c.name}</h3>
                <div className="text-xs font-bold text-amber-300">{c.region}</div>
                <p className="text-xs leading-relaxed text-slate-200">{c.features}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
