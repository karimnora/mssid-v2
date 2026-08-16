import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Award,
  CheckCircle2,
  Sparkles,
  Volume2,
  HelpCircle,
  Footprints,
  Compass,
  Star,
  Check,
  RotateCcw
} from 'lucide-react';

interface IslamicInteractiveProps {
  initialTab?: 'quran' | 'faith' | 'hajj' | 'ethics';
  grade?: string;
}

export const IslamicEducationInteractive: React.FC<IslamicInteractiveProps> = ({ initialTab = 'quran', grade = '4AP' }) => {
  const [activeTab, setActiveTab] = useState<'quran' | 'faith' | 'hajj' | 'ethics'>(initialTab);

  /* ==========================================
     1. QURAN SURAHS & VERSES (4AP & 5AP)
     ========================================== */
  const SURAH_VERSES_4AP = [
    { id: 'v1_4ap', verse: 'وَالضُّحَىٰ ﴿١﴾ وَاللَّيْلِ إِذَا سَجَىٰ ﴿٢﴾', surah: 'سورة الضحى', meaning: 'أقسم الله بوقت الضحى وبالليل إذا أظلم وسكن بأن ربه ما تركه وما أبغضه.' },
    { id: 'v2_4ap', verse: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ﴿٣﴾ وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ ﴿٤﴾', surah: 'سورة الضحى', meaning: 'بشرى للنبي ﷺ وللأمة بأن الآخرة أعظم وأبقى من نعيم الدنيا الزائل.' },
    { id: 'v3_4ap', verse: 'أَلَمْ يَشْرَحْ لَكَ صَدْرَكَ ﴿١﴾ وَوَضَعْنَا عَنكَ وِزْرَكَ ﴿٢﴾', surah: 'سورة الشرح', meaning: 'تذكير بفضل الله ونعمته الجليلة في شرح الصدر ورفع الذكر وتيسير الأمور.' },
    { id: 'v4_4ap', verse: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٦﴾', surah: 'سورة الشرح', meaning: 'قاعدة ربانية خالدة: فرج الله قريب ويسره يرافق الصبر والدعاء مع كل عسر.' },
    { id: 'v5_4ap', verse: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴿١﴾ خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ ﴿٢﴾', surah: 'سورة العلق', meaning: 'أول ما نزل من القرآن الكريم بغار حراء دعوة للعلم والمطالعة ومعرفة الخالق.' },
    { id: 'v6_4ap', verse: 'لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ ﴿٤﴾', surah: 'سورة التين', meaning: 'تكريم الله للإنسان بخلقه في أحسن صورة وأعدل هامة واستقامة.' }
  ];

  const SURAH_VERSES_5AP = [
    { id: 'v1_5ap', verse: 'وَالْفَجْرِ ﴿١﴾ وَلَيَالٍ عَشْرٍ ﴿٢﴾', surah: 'سورة الفجر', meaning: 'أقسم الله بوقت الفجر المشرق وبالليالي العشر المباركة من ذي الحجة.' },
    { id: 'v2_5ap', verse: 'وَالشَّفْعِ وَالْوَتْرِ ﴿٣﴾ وَاللَّيْلِ إِذَا يَسْرِ ﴿٤﴾', surah: 'سورة الفجر', meaning: 'قسم بمخلوقات الله الشفع والوتر لبيان عظمة الخالق وقدرته النافذة.' },
    { id: 'v3_5ap', verse: 'سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى ﴿١﴾ الَّذِي خَلَقَ فَسَوَّىٰ ﴿٢﴾', surah: 'سورة الأعلى', meaning: 'تنزيه وتقديس اسم الله العلي الأعلى الذي أتقن كل شيء خلقه وهداه.' },
    { id: 'v4_5ap', verse: 'وَالَّذِي قَدَّرَ فَهَدَىٰ ﴿٣﴾ وَالَّذِي أَخْرَجَ الْمَرْعَىٰ ﴿٤﴾', surah: 'سورة الأعلى', meaning: 'تقدير الله لأرزاق جميع الكائنات وهدايتها لما ينفعها بالكون.' },
    { id: 'v5_5ap', verse: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ﴿٢٧﴾ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً ﴿٢٨﴾', surah: 'سورة الفجر', meaning: 'تكريم النفس المؤمنة بالبشرى والرضوان والجنة يوم القيامة.' }
  ];

  const SURAH_VERSES = grade === '4AP' ? SURAH_VERSES_4AP : SURAH_VERSES_5AP;
  const [activeVerseIdx, setActiveVerseIdx] = useState<number>(0);

  /* ==========================================
     2. WORSHIP & HAJJ SIMULATION (4AP & 5AP)
     ========================================== */
  const WORSHIP_STEPS_4AP = [
    {
      step: 1,
      title: 'الطهارة والوضوء الصحيح',
      desc: 'غسل الكفين، المضمضة والاستنشاق، غسل الوجه واليدين إلى المرفقين، مسح الرأس والأذنين وغسل الرجلين إلى الكعبين.',
      type: 'شرط لصحة الصلاة',
      icon: '💧'
    },
    {
      step: 2,
      title: 'معرفة مبطلات الوضوء',
      desc: 'الخروج من السبلين (البول والريح والبراز)، النوم الثقيل، وخروج الدم الكثير يوجب إعادتها قبل الصلاة.',
      type: 'فقه الطهارة',
      icon: '🚫'
    },
    {
      step: 3,
      title: 'صلاة الجمعة المباركة',
      desc: 'صلاة فرض ركعتين جهرية بالمسجد خلف الإمام بعد سماع خطبتي الجمعة والإنصات لهما.',
      type: 'فرض عين يوم الجمعة',
      icon: '🕌'
    },
    {
      step: 4,
      title: 'صلاة العيدين وآداب المسجد',
      desc: 'صلاة عيد الفطر وعيد الأضحى ركعتان بالتكبيرات بدون أذان، مع الالتزام بالهدوء والدخول باليمين والتطيب.',
      type: 'سنة مؤكدة وآداب جليلة',
      icon: '✨'
    }
  ];

  const HAJJ_STEPS_5AP = [
    {
      step: 1,
      title: 'الإحرام من الميقات',
      desc: 'نية الدخول في النسك من الميقات المحدد وارتداء ثياب الإحرام للرجال.',
      type: 'ركن أساسي من أركان الحج',
      icon: '🕋'
    },
    {
      step: 2,
      title: 'الطواف حول الكعبة الشريفة',
      desc: 'الطواف حول الكعبة المشرفة 7 أشواط بدءاً من الحجر الأسود.',
      type: 'ركن أساسي من أركان الحج',
      icon: '🔄'
    },
    {
      step: 3,
      title: 'السعي بين الصفا والمروة',
      desc: 'السعي 7 أشواط بين جبلي الصفا والمروة اقتداءً بالسيدة هاجر عليها السلام.',
      type: 'ركن أساسي من أركان الحج',
      icon: '⛰️'
    },
    {
      step: 4,
      title: 'الوقوف بعرفة (يوم 9 ذو الحجة)',
      desc: 'أهم أركان الحج (الحج عرفة)، الوقوف بدعاء وضراعة لله من الزوال إلى غروب الشمس.',
      type: 'أعظم أركان الحج',
      icon: '🏔️'
    },
    {
      step: 5,
      title: 'المبيت بمزدلفة ورمي الجمرات',
      desc: 'جمع الحصى والمبيت بمزدلفة ثم رمي جمرة العقبة الكبرى بمنى والتحلل.',
      type: 'واجبات الحج المباركة',
      icon: '🪨'
    }
  ];

  const WORSHIP_STEPS = grade === '4AP' ? WORSHIP_STEPS_4AP : HAJJ_STEPS_5AP;
  const [currentWorshipStep, setCurrentWorshipStep] = useState<number>(0);

  /* ==========================================
     3. PILLARS OF FAITH & MESSENGERS (4AP & 5AP)
     ========================================== */
  const PILLARS_OF_FAITH_4AP = [
    { name: '1. الإيمان بالرسل والأنبياء', desc: 'التصديق بأن الله أرسل أنبياء ورسلاً مبشرين ومنذرين لهداية البشرية للتوحيد والخير.' },
    { name: '2. الإيمان بالكتب السماوية', desc: 'التصديق بالكتب المنزلة: القرآن الكريم (محمد ﷺ)، التوراة (موسى)، الإنجيل (عيسى)، والزبور (داوود).' },
    { name: '3. أولو العزم من الرسل (5)', desc: 'هم الأكثر صبراً وتحملاً للأذى: سيدنا نوح، إبراهيم، موسى، عيسى، ومحمد عليهم الصلاة والسلام.' },
    { name: '4. خاتم الأنبياء والمرسلين', desc: 'سيدنا محمد ﷺ هو خاتم الأنبياء والقرآن هو الكتاب الخاتم المحفوظ من التحريف إلى يوم القيامة.' }
  ];

  const PILLARS_OF_FAITH_5AP = [
    { name: '1. الإيمان بالله تعالى', desc: 'التصديق الجازم بوجود الله تعالى ووحدانيته في ربوبيته وألويته وأسمائه وصفاته.' },
    { name: '2. الإيمان بالملائكة الكرام', desc: 'التصديق بوجود خلق كرام من نور لا يعصون الله ما أمرهم ويفعلون ما يؤمرون.' },
    { name: '3. الإيمان بالكتب السماوية', desc: 'التصديق بالكتب التي أنزلها الله على رسله لهداية البشرية.' },
    { name: '4. الإيمان بالرسل والأنبياء', desc: 'التصديق بجميع الرسل والأنبياء من آدم عليه السلام إلى محمد ﷺ.' },
    { name: '5. الإيمان باليوم الآخر', desc: 'التصديق بالبعث والحساب والجنة والنار وما يحدث بعد الموت.' },
    { name: '6. الإيمان بالقدر خيره وشره', desc: 'التصديق بأن كل ما يحدث في الكون هو بقضاء الله وقدره وحكمته.' }
  ];

  const PILLARS_OF_FAITH = grade === '4AP' ? PILLARS_OF_FAITH_4AP : PILLARS_OF_FAITH_5AP;
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  /* ==========================================
     4. ETHICAL VIRTUES & SCENARIOS (4AP & 5AP)
     ========================================== */
  const ETHICAL_SCENARIOS_4AP = [
    {
      id: 'e1_4ap',
      title: 'خلق الصدق والأمانة اقتداءً بالنبي ﷺ',
      situation: 'وجد أحمد محفظة نقود وساعة يد في ساحة المدرسة أثناء الاستراحة.',
      options: [
        { text: 'يسلم المحفظة والساعة فوراً لإدارة المدرسة والمدير ليعيدها لصاحبها (الأمانة).', isCorrect: true, feedback: 'باراك الله فيك ! هذا هو خلق الأمانة الاقتداء بالنبي محمد الصادق الأمين ﷺ.' },
        { text: 'يأخذها لنفسه ويكتم أمرها.', isCorrect: false, feedback: 'حاول مجدداً ! المسلم أمين يحفظ الأمانات واللقطة ولا يأخذ مال غيره.' }
      ]
    },
    {
      id: 'e2_4ap',
      title: 'بر الوالدين والإحسان للجار',
      situation: 'طلبت منك أمك مساعدتها في تنظيف المنزل وطلب منك جارك الشيخ الكبير حمل القفة الثقيلة.',
      options: [
        { text: 'أبادر بطاعة أمي وابتسامة وأساعد الجار الشيخ برفق واحترام.', isCorrect: true, feedback: 'ممتاز ! قال تعالى: ﴿وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا﴾ والإحسان للجار من كمال الإيمان.' },
        { text: 'أتجاهل أمه وجاره وألعب فقط بالساتف.', isCorrect: false, feedback: 'بر الوالدين وإعانة الجار واجب إسلامي نؤجر عليه في الدنيا والآخرة.' }
      ]
    }
  ];

  const ETHICAL_SCENARIOS_5AP = [
    {
      id: 'e1_5ap',
      title: 'خلق الإيثار (تقديم غيرك على نفسك)',
      situation: 'رأيت زميلك في الفصل نسي أدواته المدرسية ومقلمته وليس لديه قلم للرسم، ولديك قلم إضافي تحتاجه لتجميل كراسك.',
      options: [
        { text: 'أعطيه القلم الإضافي بطيب خاطر وأؤثره على نفسي (الإيثار).', isCorrect: true, feedback: 'ممتاز ! هذا هو خلق الإيثار الذي مدح الله به الصحابة الأنصار ﴿وَيُؤْثِرُونَ عَلَىٰ أَنفُسِهِمْ وَلَوْ كَانَ بِهِمْ خَصَاصَةٌ﴾.' },
        { text: 'أحتفظ بالقلمين لنفسي ولا أساعده.', isCorrect: false, feedback: 'حاول مجدداً ! المسلم يحب لأخيه ما يحب لنفسه ويساعد المحتاجين.' }
      ]
    },
    {
      id: 'e2_5ap',
      title: 'خلق التعاون والأخوة',
      situation: 'نظمت المدرسة حملة تشجير وتنظيف للساحة والمصلى قبل شهر رمضان المبارك.',
      options: [
        { text: 'أشارك بغرس الأشجار وتكتل الجهود مع زملائي والمعلمين (التعاون على البر).', isCorrect: true, feedback: 'أحسنت ! قال تعالى: ﴿وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ﴾.' },
        { text: 'أجلس بعيداً وأترك العمل لغيري.', isCorrect: false, feedback: 'الإسلام يحثنا على المبادرة والمشاركة الإيجابية في أعمال الخير.' }
      ]
    }
  ];

  const ETHICAL_SCENARIOS = grade === '4AP' ? ETHICAL_SCENARIOS_4AP : ETHICAL_SCENARIOS_5AP;
  const [activeEthicsIdx, setActiveEthicsIdx] = useState<number>(0);
  const [selectedEthicsOption, setSelectedEthicsOption] = useState<number | null>(null);

  return (
    <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-300">مَخْبَرُ التَّرْبِيَةِ الإِسْلَامِيَّةِ التَّفَاعُلِيِّ ({grade})</h2>
            <p className="text-xs text-emerald-200">برنامج الجيل الثاني • القرآن الكريم، أركان الإيمان والرسل، الطهارة والعبادات، والسيرة العطرة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>﴿وَمَن يُعَظِّمْ شَعَائِرَ اللَّهِ فَإِنَّهَا مِن تَقْوَى الْقُلُوبِ﴾</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-800 pb-3">
        <button
          onClick={() => setActiveTab('quran')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'quran'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. السور المقررة (القرآن الكريم)</span>
        </button>

        <button
          onClick={() => setActiveTab('faith')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'faith'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>2. العقيدة والإيمان بالرسل والكتب</span>
        </button>

        <button
          onClick={() => setActiveTab('hajj')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'hajj'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3. العبادات وطرق أداء المناسك</span>
        </button>

        <button
          onClick={() => setActiveTab('ethics')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'ethics'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>4. الأخلاق والسيرة النبوية</span>
        </button>
      </div>

      {/* TAB 1: QURAN */}
      {activeTab === 'quran' && (
        <div className="space-y-6">
          <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800 text-xs text-emerald-100 leading-relaxed">
            <strong>📖 آيات السور المقررة ومعانيها :</strong> اختر الآية للتدبر وفهم المعنى والتفسير الميسر.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-300 border-b border-emerald-800 pb-2">الآيات والسور الكريمة:</h3>
              {SURAH_VERSES.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVerseIdx(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer font-serif ${
                    activeVerseIdx === idx
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-bold text-base scale-[1.01]'
                      : 'bg-emerald-900/80 border-emerald-800 text-amber-200 hover:bg-emerald-850 text-sm'
                  }`}
                >
                  <div className="text-[10px] text-emerald-300 font-sans font-bold mb-1">[{v.surah}]</div>
                  <div>{v.verse}</div>
                </button>
              ))}
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">تفسير ودلالة الآية ({SURAH_VERSES[activeVerseIdx].surah})</span>
                  <span className="text-sm font-serif font-bold text-amber-300">{SURAH_VERSES[activeVerseIdx].verse}</span>
                </div>

                <div className="mt-4 p-4 bg-emerald-950 rounded-2xl border border-emerald-800 space-y-2">
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>المعنى الإجمالي والتدبر التربوي:</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200 leading-relaxed">
                    {SURAH_VERSES[activeVerseIdx].meaning}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-[11px] text-slate-400 border border-slate-800 text-center">
                💡 يستفاد من سور القرآن المقررة : الإقبال على القراءة والعلم، الصبر عند العسر، والعمل الصالح والتخلق بالرحمة والصدق.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAITH */}
      {activeTab === 'faith' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PILLARS_OF_FAITH.map((pillar, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPillar(idx)}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer space-y-2 ${
                  selectedPillar === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl ring-2 ring-amber-400 scale-[1.02]'
                    : 'bg-emerald-900/80 text-emerald-100 border-emerald-800 hover:bg-emerald-850'
                }`}
              >
                <div className="text-sm font-black">{pillar.name}</div>
                <div className={`text-xs leading-relaxed ${selectedPillar === idx ? 'text-slate-900 font-bold' : 'text-emerald-300'}`}>
                  {pillar.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORSHIP / HAJJ */}
      {activeTab === 'hajj' && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {WORSHIP_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentWorshipStep(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                  currentWorshipStep === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                    : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
                }`}
              >
                <span>{s.icon}</span>
                <span>المرحلة {s.step}: {s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <span className="text-4xl p-3 bg-emerald-950 rounded-2xl border border-emerald-800">{WORSHIP_STEPS[currentWorshipStep].icon}</span>
              <div>
                <h3 className="text-lg font-black text-amber-300">{WORSHIP_STEPS[currentWorshipStep].title}</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold inline-block mt-1">
                  {WORSHIP_STEPS[currentWorshipStep].type}
                </span>
              </div>
            </div>

            <div className="bg-emerald-950 p-5 rounded-2xl border border-emerald-800 space-y-2">
              <div className="text-xs font-black text-emerald-400">📜 كيفية التطبيق والبيان الفقهي:</div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                {WORSHIP_STEPS[currentWorshipStep].desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ETHICS & SIRAH */}
      {activeTab === 'ethics' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300">
                ✨ {ETHICAL_SCENARIOS[activeEthicsIdx].title}
              </h3>
              <span className="text-xs text-emerald-400 font-bold">وضعية تقويم وسلوك إسلامي</span>
            </div>

            <p className="text-sm font-bold text-slate-200 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 leading-relaxed">
              {ETHICAL_SCENARIOS[activeEthicsIdx].situation}
            </p>

            <div className="space-y-3">
              {ETHICAL_SCENARIOS[activeEthicsIdx].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => setSelectedEthicsOption(oIdx)}
                  className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
                    selectedEthicsOption === oIdx
                      ? opt.isCorrect
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                        : 'bg-rose-950 border-rose-500 text-rose-200'
                      : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>

            {selectedEthicsOption !== null && (
              <div className="p-4 bg-emerald-900 border border-emerald-600 rounded-2xl text-xs text-emerald-100 font-bold leading-relaxed animate-in fade-in duration-300">
                {ETHICAL_SCENARIOS[activeEthicsIdx].options[selectedEthicsOption].feedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

