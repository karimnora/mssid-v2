import { LabQuizSession } from './LabQuizSession';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText as speakTextShared } from '../utils/speech';
import {
  Award,
  BookOpen,
  Volume2,
  Sparkles,
  Calendar,
  Flag,
  Shield,
  Search,
  CheckCircle,
  HelpCircle,
  Clock,
  Star,
  Layers,
  Flame,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { AuthService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

export interface HeroProfile {
  id: string;
  nameAr: string;
  titleAr: string;
  eraAr: string;
  category: 'revolution' | 'resistance' | 'reform' | 'ancient';
  birthDeathAr: string;
  hometownAr: string;
  avatarIcon: string;
  roleAr: string;
  famousQuoteAr?: string;
  achievementsAr: string[];
  lessonLearnedAr: string;
}

export interface HistoryEvent {
  id: string;
  yearAr: string;
  exactDateAr?: string;
  titleAr: string;
  category: 'ancient' | 'resistance' | 'revolution' | 'independence';
  summaryAr: string;
  detailsAr: string;
  icon: string;
  significanceAr: string;
}

const ALGERIAN_HEROES: HeroProfile[] = [
  {
    id: 'benboulaid',
    nameAr: 'الشهيد مصطفى بن بولعيد',
    titleAr: 'أب الثورة التحريرية وقائد المنطقة الأولى (الأوراس)',
    eraAr: 'الثورة التحريرية المباركة (1954-1962)',
    category: 'revolution',
    birthDeathAr: '1917 - 1956م',
    hometownAr: 'آريس، باتنة (الأوراس الأشم)',
    avatarIcon: '🎖️',
    roleAr: 'أحد القادة الستة التاريخيين الذين فجروا ثورة 1 نوفمبر 1954.',
    famousQuoteAr: 'إذا استشهدنا فدافعوا عن أرواحنا، إننا خلقنا لنمهد لكم طريق الحرية.',
    achievementsAr: [
      'تنظيم وتأطير أولى العمليات العسكرية للثورة في جبال الأوراس',
      'تمويل الثورة بماله الخاص وتوفير السلاح للثوار',
      'الهروب الأسطوري من سجن الكدية بقسنطينة للعودة لقيادة المعارك',
    ],
    lessonLearnedAr: 'الشجاعة، الإيثار، والتضحية بكل شيء من أجل حرية الوطن.',
  },
  {
    id: 'benmhidi',
    nameAr: 'الشهيد العربي بن مهيدي',
    titleAr: 'حكيم الثورة وقائد المنطقة الخامسة (وهران)',
    eraAr: 'الثورة التحريرية المباركة (1954-1962)',
    category: 'revolution',
    birthDeathAr: '1923 - 1957م',
    hometownAr: 'عين مليلة، أم البواقي',
    avatarIcon: '🕊️',
    roleAr: 'العقل المدبر لمعركة الجزائر وأحد أبرز قادة مؤتمر الصومام 1956.',
    famousQuoteAr: 'ألقوا بالثورة إلى الشارع يحتضنها الشعب.',
    achievementsAr: [
      'ترأس مؤتمر الصومام التاريخي في 20 أوت 1956',
      'إدارة وتنظيم معركة الجزائر التاريخية بحنكة وشجاعة فائقة',
      'الصمود الأسطوري أمام التعذيب والابتسامة الخالدة في وجه العدو',
    ],
    lessonLearnedAr: 'قوة الإيمان بالقضية، الحكمة العالية، والابتسامة في أصعب اللحظات.',
  },
  {
    id: 'diddouche',
    nameAr: 'الشهيد ديدوش مراد (سي عبد القادر)',
    titleAr: 'أصغر القادة الستة وقائد المنطقة الثانية (الشمال القسنطيني)',
    eraAr: 'الثورة التحريرية المباركة (1954-1962)',
    category: 'revolution',
    birthDeathAr: '1927 - 1955م',
    hometownAr: 'المرادية، الجزائر العاصمة',
    avatarIcon: '🔥',
    roleAr: 'محرر ومصمم أول بيان لثورة أول نوفمبر 1954 مع رفاقه وأول قائد منطقة يستشهد.',
    famousQuoteAr: 'إذا استشهدنا، فحافظوا على مبادئنا التي من أجلها نموت.',
    achievementsAr: [
      'صياغة وتوزيع بيان أول نوفمبر 1954 الذي أعلن ميلاد الثورة',
      'تنظيم الخلايا الأولى للمجاهدين في الشمال القسنطيني',
      'خوض معركة وادي بوكركر التاريخية حتى الاستشهاد',
    ],
    lessonLearnedAr: 'حيوية الشباب وعزمهم القادر على تغيير مجرى التاريخ.',
  },
  {
    id: 'emir_abdelkader',
    nameAr: 'الأمير عبد القادر الجزائري',
    titleAr: 'مؤسس الدولة الجزائرية الحديثة وفارس المقاومة الشعبية',
    eraAr: 'المقاومة الشعبية (1832-1847م)',
    category: 'resistance',
    birthDeathAr: '1807 - 1883م',
    hometownAr: 'القيطنة، معسكر',
    avatarIcon: '⚔️',
    roleAr: 'قائد عسكري عبقري، شاعر، عالم دين، ورائد القانون الدولي الإنساني.',
    famousQuoteAr: 'المجد للشجعان الذين يحمون وطنهم وعقيدتهم بالعدل والعلم.',
    achievementsAr: [
      'توحيد القبائل الجزائرية وبناء جيش وطني منظم وعاصمة متنقلة (الزمالة)',
      'تأسيس مصانع الأسلحة وسك العملة وبناء الحصون والمعاهدات الدبلوماسية',
      'حماية آلاف الأبرياء في دمشق وتكريمه عالمياً كرمز للإنسانية',
    ],
    lessonLearnedAr: 'الجمع بين العلم والفروسية والأخلاق العالية في السلم والحرب.',
  },
  {
    id: 'hasiba',
    nameAr: 'الشهيدة حسيبة بن بوعلي',
    titleAr: 'أيقونة الفدائيات وبطلة معركة الجزائر',
    eraAr: 'الثورة التحريرية المباركة (1954-1962)',
    category: 'revolution',
    birthDeathAr: '1938 - 1957م',
    hometownAr: 'الشلف (الأصنام سابقاً)',
    avatarIcon: '🌸',
    roleAr: 'ممرضة وفدائية شجاعة في قلب القصبة العتيقة بالجزائر العاصمة.',
    famousQuoteAr: 'إن الموت في سبيل حرية الجزائر شرف لا يضاهيه شرف.',
    achievementsAr: [
      'تقديم الرعاية الطبية للمجاهدين ونقل الرسائل والمعلومات الحيوية',
      'الانضمام لمجموعة الفدائيين الأبطال في قصبة الجزائر',
      'الاستشهاد البطولي رفقة علي لابوانت وعمر الصغير إثر تفجير مخبئهم',
    ],
    lessonLearnedAr: 'دور المرأة والفتيات الجزائريات في صناعة فجر الاستقلال.',
  },
  {
    id: 'benbadis',
    nameAr: 'الإمام عبد الحميد بن باديس',
    titleAr: 'رائد النهضة والإصلاح ورئيس جمعية العلماء المسلمين الجزائريين',
    eraAr: 'الحركة الوطنية والإصلاح الفكري',
    category: 'reform',
    birthDeathAr: '1889 - 1940م',
    hometownAr: 'قسنطينة (مدينة العلم والجسور)',
    avatarIcon: '📖',
    roleAr: 'باعث النهضة التعليمية واللغوية وحامي الهوية الوطنية الجزائرية.',
    famousQuoteAr: 'شَعْـبُ الجـزائرِ مُـسْـلِـمٌ، وَإلى العُـروبةِ يَنـتَـسِـبْ.',
    achievementsAr: [
      'تأسيس جمعية العلماء المسلمين الجزائريين سنة 1931م',
      'إنشاء مئات المدارس الحرة لتعليم اللغة العربية والقرآن الكريم',
      'ترسيخ ثالوث الهوية: الإسلام ديننا، العربية لغتنا، والجزائر وطننا',
    ],
    lessonLearnedAr: 'سلاح العلم والتربية والأخلاق هو الدرع الحقيقي لحماية الأمة.',
  },
  {
    id: 'moufdi',
    nameAr: 'مفدي زكريا',
    titleAr: 'شاعر الثورة الجزائرية ومؤلف النشيد الوطني "قسماً"',
    eraAr: 'الثورة التحريرية والأدب الوطني',
    category: 'revolution',
    birthDeathAr: '1908 - 1977م',
    hometownAr: 'بني يزقن، غرداية (وادي ميزاب)',
    avatarIcon: '✍️',
    roleAr: 'شاعر العروبة والوطن الذي كتب أخلد الأناشيد بدمائه في سجن بربروس.',
    famousQuoteAr: 'وعقدنا العزم أن تحيا الجزائر، فاشهدوا.. فاشهدوا.. فاشهدوا!',
    achievementsAr: [
      'تأليف كلمات النشيد الوطني الجزائري الرسمي "قسماً"',
      'نظم "إلياذة الجزائر" التي تروي تاريخ الجزائر عبر آلاف السنين',
      'تسخير موهبته الشعرية لخدمة كفاح الشعب الجزائري',
    ],
    lessonLearnedAr: 'الكلمة الصادقة والشعر الهادف سلاح قوي يخلّد بطولات الوطن.',
  },
  {
    id: 'massinissa',
    nameAr: 'الملك ماسينيسا (Massinissa)',
    titleAr: 'مؤسس وموحد مملكة نوميديا القديمة العظمى',
    eraAr: 'العصور القديمة والنوميدية',
    category: 'ancient',
    birthDeathAr: '238 - 148 ق.م',
    hometownAr: 'سيرتا (قسنطينة حالياً)',
    avatarIcon: '👑',
    roleAr: 'أول من وحّد شمال إفريقيا تحت راية مملكة نوميديا القوية وعاصمتها سيرتا.',
    famousQuoteAr: 'إفريقيا للأفارقة، والأرض لمن يزرعها ويحميها.',
    achievementsAr: [
      'توحيد قبائل الماسيل والماسيسيل في دولة موحدة قوية ومزدهرة',
      'تطوير الفلاحة والزراعة وتحويل النوميديين إلى مزارعين مهرة',
      'سك أولى العملات النوميدية وتشييد الحصون والمدن الحضارية',
    ],
    lessonLearnedAr: 'الوحدة تصنع القوة، وبناء الاقتصاد والزراعة أساس السيادة.',
  },
  {
    id: 'fatma_nsoumer',
    nameAr: 'لالة فاطمة نسومر',
    titleAr: 'خنساء الجزائر وبطلة جبال جرجرة',
    eraAr: 'المقاومة الشعبية (1854-1857م)',
    category: 'resistance',
    birthDeathAr: '1830 - 1863م',
    hometownAr: 'ورجة، عين الحمام (تيزي وزو)',
    avatarIcon: '🏔️',
    roleAr: 'قائدة ثورية ومفكرة حكيمة قادت معارك كبرى دفاعاً عن جبال جرجرة والقبائل.',
    famousQuoteAr: 'لن تدوس أقدام المعتدين جبالنا إلا على أجسادنا.',
    achievementsAr: [
      'قيادة معارك إيشريظن وسباو وتكبيد العدو خسائر فادحة',
      'توحيد صفوف المقاومين بحكمتها وفصاحتها ورباطة جأشها',
      'رمزية التحدي النسوي الجزائري الخالد في وجه الاستعمار',
    ],
    lessonLearnedAr: 'الإرادة الفولاذية والدفاع عن كرامة الأرض والحرية.',
  },
];

const HISTORY_TIMELINE: HistoryEvent[] = [
  {
    id: 'numidia',
    yearAr: '202 ق.م',
    titleAr: 'توحيد مملكة نوميديا الكبرى',
    category: 'ancient',
    summaryAr: 'الملك ماسينيسا يوحد نوميديا الشرقية والغربية ويتخذ سيرتا (قسنطينة) عاصمة للبلاد.',
    detailsAr: 'شهدت هذه الفترة ازدهاراً زراعياً واقتصادياً هائلاً، حيث تحولت نوميديا إلى قوة إقليمية ضاربة وسكت عملتها الخاصة.',
    icon: '🏛️',
    significanceAr: 'أول تنظيم سياسي موحد لدولة جزائرية قوية في شمال إفريقيا.',
  },
  {
    id: 'sidi_ferruch',
    yearAr: '1830م',
    exactDateAr: '14 جوان 1830م',
    titleAr: 'إنزال سيدي فرج وبداية المقاومة الوطنية',
    category: 'resistance',
    summaryAr: 'نزول القوات الاستعمارية الفرنسية في شاطئ سيدي فرج وانطلاق هبة الشعب الجزائري للدفاع عن أرضه.',
    detailsAr: 'رفض الشعب الجزائري الاحتلال منذ اللحظة الأولى، فانطلقت المقاومات الشعبية الباسلة في الشرق والغرب والجنوب والوسط.',
    icon: '⚔️',
    significanceAr: 'بداية ملحمة كفاح شعبي استمرت أكثر من 132 سنة من التضحيات والصمود.',
  },
  {
    id: 'may_1945',
    yearAr: '1945م',
    exactDateAr: '8 ماي 1945م',
    titleAr: 'مجازر 8 ماي 1945 التاريخية (سطيف، قالمة، وخراطة)',
    category: 'resistance',
    summaryAr: 'خروج الشعب الجزائري في مظاهرات سلمية للمطالبة بالاستقلال ومواجهتها بمجازر مروعة خلفت 45 ألف شهيد.',
    detailsAr: 'أكدت هذه المجازر للشباب الجزائري أن ما أُخذ بالقوة لا يُسترد إلا بالقوة، وكانت المحطة الحاسمة التي عجلت بتفجير الثورة المسلحة.',
    icon: '🩸',
    significanceAr: 'المنعرج الحاسم الذي غرس القناعة بحتمية العمل الثوري المسلح.',
  },
  {
    id: 'nov_1954',
    yearAr: '1954م',
    exactDateAr: '1 نوفمبر 1954م',
    titleAr: 'اندلاع ثورة أول نوفمبر التحريرية المظفرة',
    category: 'revolution',
    summaryAr: 'انطلاق أولى الرصاصات المباركة في منتصف الليل بجبال الأوراس والشمال القسنطيني وباقي ربوع الوطن.',
    detailsAr: 'أصدر جيل الرواد بيان أول نوفمبر 1954 التاريخي، معلناً تأسيس جبهة وجيش التحرير الوطني لاسترجاع السيادة الوطنية الكاملة.',
    icon: '🔥',
    significanceAr: 'أعظم ثورة تحررية في القرن العشرين أسقطت أعتى الجيوش ونالت احترام العالم.',
  },
  {
    id: 'soummam_1956',
    yearAr: '1956م',
    exactDateAr: '20 أوت 1956م',
    titleAr: 'مؤتمر الصومام التاريخي (إيفري، أوزلاقن)',
    category: 'revolution',
    summaryAr: 'انعقاد المؤتمر التأسيسي لثورة التحرير وتنظيم هياكل جيش التحرير ومؤسسات الدولة الجزائرية.',
    detailsAr: 'خرج المؤتمر بقرارات استراتيجية كبرى مثل تقسيم الجزائر إلى ست ولايات عسكرية وأولية العمل السياسي والداخلي وتأسيس المجلس الوطني للثورة.',
    icon: '📜',
    significanceAr: 'وضع الهيكل التنظيمي والسياسي الشامل الذي قاد الثورة نحو النصر.',
  },
  {
    id: 'dec_1960',
    yearAr: '1960م',
    exactDateAr: '11 ديسمبر 1960م',
    titleAr: 'مظاهرات 11 ديسمبر 1960 الشعبية',
    category: 'revolution',
    summaryAr: 'خروج ملايين الجزائريين في شوارع العاصمة والمدن الكبرى رافعين الراية الوطنية وهاتفين بالاستقلال.',
    detailsAr: 'أبهرت هذه المظاهرات العالم وأجبرت هيئة الأمم المتحدة على إدراج القضية الجزائرية والاعتراف بحق الشعب في تقرير المصير.',
    icon: '📢',
    significanceAr: 'استفتاء شعبي علني أمام أنظار الرأي العام الدولي برفض الاستعمار.',
  },
  {
    id: 'july_1962',
    yearAr: '1962م',
    exactDateAr: '5 جويلية 1962م',
    titleAr: 'عيد الاستقلال والحرية واسترجاع السيادة الوطنية',
    category: 'independence',
    summaryAr: 'إعلان استقلال الجمهورية الجزائرية الديمقراطية الشعبية بعد تضحية مليون ونصف مليون شهيد طاهر.',
    detailsAr: 'ارتفعت الراية الجزائرية خفاقة في سماء الوطن، متوجة ملحمة كفاح تاريخي وصانعة يوم النصر والحرية لجميع أبناء الجزائر.',
    icon: '🇩🇿',
    significanceAr: 'يوم النصر والحرية واسترجاع الأرض والهوية والسيادة الوطنية للأبد.',
  },
];

const NATIONAL_SYMBOLS = [
  {
    id: 'flag',
    nameAr: 'العلم الوطني الجزائري 🇩🇿',
    icon: '🇩🇿',
    color: 'from-emerald-700 to-rose-700 text-white',
    descriptionAr: 'راية الشرف والسيادة، صممت بألوان رمزية خالدة:',
    components: [
      { name: 'اللون الأخضر 🟢', meaning: 'يرمز للأمل، النماء، الطبيعة الخضراء، والازدهار والتمسك بالقيم الإسلامية.' },
      { name: 'اللون الأبيض ⚪', meaning: 'يرمز للسلام، النقاء، والصفاء الذي ينشده الشعب الجزائري.' },
      { name: 'اللون الأحمر 🔴', meaning: 'يرمز لتضحيات ودماء مليون ونصف مليون شهيد سالت طاهرة لتحرير الوطن.' },
      { name: 'الهلال والنجمة 🌙⭐', meaning: 'الهلال رمز الهوية الإسلامية، والنجمة الخماسية تمثل أركان الإسلام الخمسة.' },
    ],
  },
  {
    id: 'anthem',
    nameAr: 'النشيد الوطني الجزائري "قَسَماً"',
    icon: '🎵',
    color: 'from-amber-600 to-emerald-700 text-white',
    descriptionAr: 'كتبه الشاعر مفدي زكريا في زنزانته بسجن بربروس، ولحنه الموسيقار محمد فوزي:',
    verses: [
      'قَسَماً بِالنَّازِلَاتِ المَاحِقَاتِ • وَالدِّمَاءِ الزَّاكِيَاتِ الطَّاهِرَاتِ',
      'وَالبُنُودِ اللَّامِعَاتِ الخَافِقَاتِ • فِي الجِبَالِ الشَّامِخَاتِ الشَّاهِقَاتِ',
      'نَحْنُ ثُرْنَا فَحَيَاةٌ أَوْ مَمَاتٌ • وَعَقَدْنَا العَزْمَ أَنْ تَحْيَا الجَزَائِرُ',
      'فَاشْهَدُوا.. فَاشْهَدُوا.. فَاشْهَدُوا!',
    ],
  },
];

interface AlgerianHistoryMuseumProps {
  onBack?: () => void;
  grade?: string;
  onReward?: (coins: number, xp: number) => void;
}

export const AlgerianHistoryMuseum: React.FC<AlgerianHistoryMuseumProps> = ({
  onBack,
  grade = '5AP',
  onReward,
}) => {
  const { direction } = useLocaleContext();
  const t = useTranslation('labsSocial');
  const tCommon = useTranslation('common');
  const [activeTab, setActiveTab] = useState<'heroes' | 'timeline' | 'symbols' | 'detective_quiz'>('heroes');
  const [selectedHeroCategory, setSelectedHeroCategory] = useState<string>('all');
  const [selectedHero, setSelectedHero] = useState<HeroProfile>(ALGERIAN_HEROES[0]);
  const [heroSearch, setHeroSearch] = useState('');

  // Detective Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Audio Speech synthesis — delegates to the shared, feature-flag-gated implementation (see
  // utils/speech.ts) rather than calling window.speechSynthesis directly, so voiceReading actually
  // controls this like every other narration in the app.
  const speakText = (text: string) => {
    speakTextShared(text, 'ar-SA', 0.92);
  };

  const filteredHeroes = useMemo(() => {
    const term = heroSearch.trim().toLowerCase();
    return ALGERIAN_HEROES.filter((h) => {
      const matchSearch =
        !term ||
        h.nameAr.includes(term) ||
        h.titleAr.includes(term) ||
        h.hometownAr.includes(term) ||
        h.roleAr.includes(term);

      const matchCategory =
        selectedHeroCategory === 'all' || h.category === selectedHeroCategory;

      return matchSearch && matchCategory;
    });
  }, [heroSearch, selectedHeroCategory]);

  // Quiz Questions generator based on heroes & timeline
  const quizQuestions = useMemo(() => [
    {
      question: 'من هو البطل الملقب بـ "حكيم الثورة" وصاحب مقولة "ألقوا بالثورة إلى الشارع يحتضنها الشعب"؟',
      options: ['الشهيد العربي بن مهيدي', 'الشهيد مصطفى بن بولعيد', 'الشهيد ديدوش مراد', 'العقيد لطفي'],
      answer: 'الشهيد العربي بن مهيدي',
      explanation: 'الشهيد العربي بن مهيدي هو حكيم الثورة وقائد المنطقة الخامسة، وترأس مؤتمر الصومام 1956.',
    },
    {
      question: 'في أي تاريخ تم الإعلان عن اندلاع ثورة التحرير الجزائرية المظفرة؟',
      options: ['1 نوفمبر 1954م', '8 ماي 1945م', '20 أوت 1956م', '5 جويلية 1962م'],
      answer: '1 نوفمبر 1954م',
      explanation: 'انطلقت الثورة في ليلة الأول من نوفمبر 1954م المباركة بقيادة جيل الرواد الأبطال.',
    },
    {
      question: 'من هو مؤلف كلمات النشيد الوطني الجزائري الرسمي "قسماً"؟',
      options: ['الشاعر مفدي زكريا', 'الإمام عبد الحميد بن باديس', 'الشيخ البشير الإبراهيمي', 'محمد العيد آل خليفة'],
      answer: 'الشاعر مفدي زكريا',
      explanation: 'كتب شاعر الثورة مفدي زكريا كلمات النشيد الوطني قسماً بسجن بربروس في الجزائر العاصمة.',
    },
    {
      question: 'ماذا يرمز اللون الأخضر في العلم الوطني الجزائري؟',
      options: ['الأمل، النماء والازدهار والتمسك بالقيم', 'دماء الشهداء الطاهرة', 'السلام والصفاء', 'جبال الأوراس الشامخة'],
      answer: 'الأمل، النماء والازدهار والتمسك بالقيم',
      explanation: 'اللون الأخضر يرمز للأمل والنماء والطبيعة الخضراء والتمسك بالقيم الإسلامية السامية.',
    },
    {
      question: 'من هو مؤسس الدولة الجزائرية الحديثة وقائد المقاومة الشعبية في الغرب الجزائري؟',
      options: ['الأمير عبد القادر الجزائري', 'أحمد باي قسنطينة', 'الشيخ بوعمامة', 'الشيخ المقراني'],
      answer: 'الأمير عبد القادر الجزائري',
      explanation: 'بايع الجزائريون الأمير عبد القادر سنة 1832م وأسس الدولة الحديثة والجيش المنظم.',
    },
    {
      question: 'أين انعقد مؤتمر الصومام التاريخي في 20 أوت 1956م؟',
      options: ['قرية إيفري (بجاية / الصومام)', 'غابة الأوراس', 'قصبة الجزائر', 'جبال الونشريس'],
      answer: 'قرية إيفري (بجاية / الصومام)',
      explanation: 'انعقد مؤتمر الصومام في قرية إيفري بوادي الصومام لتنظيم وتوحيد هياكل الثورة وجيش التحرير.',
    },
  ], []);

  const currentQuiz = quizQuestions[Math.min(quizIndex, quizQuestions.length - 1)];

  const handleAnswerQuiz = (chosen: string) => {
    if (isQuizAnswered) return;
    setSelectedQuizOption(chosen);
    setIsQuizAnswered(true);

    const isCorrect = chosen === currentQuiz.answer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback({
        isCorrect: true,
        text: `أحسنت يا بطل! إجابة صحيحة: ${currentQuiz.explanation} 🇩🇿✨ (+30 نقطة و15 دينار ذهبي)`,
      });
      speakText('أحسنت يا بطل! إجابة صحيحة وممتازة.');
      AuthService.addScore(30);
      if (onReward) onReward(15, 30);
    } else {
      setQuizFeedback({
        isCorrect: false,
        text: `إجابة غير صحيحة! الجواب الصحيح هو: ${currentQuiz.answer}. ${currentQuiz.explanation}`,
      });
      speakText('إجابة غير صحيحة. استمع للمعلومة الصحيحة.');
    }
  };

  const handleNextQuiz = () => {
    setQuizIndex((prev) => Math.min(prev + 1, quizQuestions.length));
    setSelectedQuizOption(null);
    setIsQuizAnswered(false);
    setQuizFeedback(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6" dir={direction}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-500/30">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('historyMuseumBannerTitle')}
              </h1>
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                {t('historyMuseumCurriculumBadge')}
              </span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 font-medium max-w-2xl leading-relaxed">
              {t('historyMuseumBannerTagline')}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            data-activity-navigation="true" onClick={onBack}
            aria-label={tCommon('backToTools')}
            className="z-10 hit-target flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl transition-all border border-white/30 shadow-sm cursor-pointer"
          >
            {direction === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => setActiveTab('heroes')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'heroes'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{t('historyMuseumTabHeroes')}</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t('historyMuseumTabTimeline')}</span>
        </button>

        <button
          onClick={() => setActiveTab('symbols')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'symbols'
              ? 'bg-rose-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>{t('historyMuseumTabSymbols')}</span>
        </button>

        <button
          onClick={() => setActiveTab('detective_quiz')}
          className={`py-3 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'detective_quiz'
              ? 'bg-teal-700 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('historyMuseumTabDetectiveQuiz')}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: HEROES & LEADERS GALLERY                          */}
      {/* ======================================================== */}
      {activeTab === 'heroes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Heroes Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Filter Bar */}
            <div className="bg-[var(--app-card-bg)] p-4 rounded-3xl border border-[var(--app-card-border)] shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="ابحث باسم البطل (مثال: بن مهيدي، بن بولعيد، حسيبة، الأمير عبد القادر)..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full pr-11 pl-4 py-3 bg-[var(--app-card-subtle)] rounded-2xl text-xs sm:text-sm font-bold border border-[var(--app-card-border)] focus:outline-emerald-500 text-[var(--app-text)] placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'all', label: t('historyMuseumCatAll') },
                  { id: 'revolution', label: t('historyMuseumCatRevolution') },
                  { id: 'resistance', label: t('historyMuseumCatResistance') },
                  { id: 'reform', label: t('historyMuseumCatReform') },
                  { id: 'ancient', label: t('historyMuseumCatAncient') },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedHeroCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedHeroCategory === cat.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Heroes Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredHeroes.map((hero) => {
                const isSelected = selectedHero.id === hero.id;
                return (
                  <motion.button
                    key={hero.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedHero(hero);
                      // On mobile the detail panel sits below the (scrollable) heroes grid, not
                      // beside it like the desktop sticky sidebar — without this, tapping a hero
                      // silently updates state below the fold and the child sees no visible
                      // reaction to their tap. The timeout lets the panel's content re-render with
                      // the new hero before we measure where to scroll.
                      setTimeout(() => {
                        document.getElementById('hero-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 80);
                    }}
                    className={`p-4 rounded-3xl border-2 text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/30 border-emerald-600 shadow-md scale-[1.02]'
                        : 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] hover:border-emerald-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl shrink-0">
                        {hero.avatarIcon}
                      </span>
                      <div>
                        <h3 className="font-black text-sm text-[var(--app-text)]">
                          {hero.nameAr}
                        </h3>
                        <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold mt-0.5">
                          {hero.titleAr}
                        </p>
                        <span className="inline-block mt-1 text-[10px] bg-[var(--app-card-subtle)] px-2 py-0.5 rounded-md font-bold text-[var(--app-text-muted)]">
                          {hero.hometownAr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
                      <span className="font-bold">{hero.birthDeathAr}</span>
                      <span className="font-black text-emerald-700 dark:text-emerald-400">
                        {t('historyMuseumViewBiography')}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Hero Full Profile Card (5 cols) */}
          <div id="hero-detail-panel" className="lg:col-span-5 space-y-4 lg:sticky lg:top-6 scroll-mt-20">
            <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 border-2 border-emerald-600 shadow-xl space-y-5">
              <div className="flex items-start justify-between border-b border-[var(--app-card-border)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-emerald-100 text-emerald-950 rounded-2xl shadow-inner">
                    {selectedHero.avatarIcon}
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-[var(--app-text)]">
                      {selectedHero.nameAr}
                    </h2>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold mt-0.5">
                      {selectedHero.titleAr}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    speakText(
                      `${selectedHero.nameAr}. ${selectedHero.titleAr}. ولد بـ ${selectedHero.hometownAr}. ${
                        selectedHero.famousQuoteAr ? `من أقواله الخالدة: ${selectedHero.famousQuoteAr}` : ''
                      }`
                    )
                  }
                  className="p-2 bg-[var(--app-card-subtle)] hover:bg-emerald-100 rounded-xl text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                  title={t('historyMuseumListenBiographyTooltip')}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[var(--app-card-subtle)] p-2.5 rounded-xl border border-[var(--app-card-border)]">
                    <span className="text-[10px] text-[var(--app-text-muted)] font-bold block">{t('historyMuseumBirthplaceLabel')}</span>
                    <span className="font-black text-[var(--app-text)]">{selectedHero.hometownAr}</span>
                  </div>
                  <div className="bg-[var(--app-card-subtle)] p-2.5 rounded-xl border border-[var(--app-card-border)]">
                    <span className="text-[10px] text-[var(--app-text-muted)] font-bold block">{t('historyMuseumPeriodLabel')}</span>
                    <span className="font-black text-[var(--app-text)]">{selectedHero.birthDeathAr}</span>
                  </div>
                </div>

                {/* Famous Quote Banner */}
                {selectedHero.famousQuoteAr && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-300 dark:border-amber-900">
                    <span className="text-[11px] font-black text-amber-950 dark:text-amber-300 block mb-1">
                      {t('historyMuseumFamousQuoteLabel')}
                    </span>
                    <p className="font-black text-amber-900 dark:text-amber-200 text-xs sm:text-sm italic leading-relaxed">
                      "{selectedHero.famousQuoteAr}"
                    </p>
                  </div>
                )}

                {/* Key Achievements */}
                <div className="space-y-1.5">
                  <span className="text-xs font-black text-[var(--app-text)] block">
                    {t('historyMuseumAchievementsLabel')}
                  </span>
                  <ul className="space-y-1">
                    {selectedHero.achievementsAr.map((ach, idx) => (
                      <li
                        key={idx}
                        className="bg-[var(--app-card-subtle)] p-2.5 rounded-xl text-xs font-bold text-[var(--app-text)] flex items-start gap-2 border border-[var(--app-card-border)]"
                      >
                        <span className="text-emerald-600 font-black">✓</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson learned */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                  <span className="text-[11px] font-black text-emerald-950 dark:text-emerald-300 block mb-0.5">
                    {t('historyMuseumLessonLabel')}
                  </span>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    {selectedHero.lessonLearnedAr}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TIMELINE OF GLORIOUS MILESTONES                   */}
      {/* ======================================================== */}
      {activeTab === 'timeline' && (
        <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-8 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="bg-amber-100 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
              {t('historyMuseumTimelineBadge')}
            </span>
            <h2 className="text-2xl font-black text-[var(--app-text)]">
              {t('historyMuseumTimelineHeading')}
            </h2>
            <p className="text-xs text-[var(--app-text-muted)] font-medium">
              {t('historyMuseumTimelineSubtext')}
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative border-r-2 border-emerald-600 mr-4 sm:mr-8 pr-6 sm:pr-8 space-y-8">
            {HISTORY_TIMELINE.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-[var(--app-card-subtle)] p-5 rounded-3xl border border-[var(--app-card-border)] shadow-xs space-y-3"
              >
                {/* Timeline Dot & Year */}
                <div className="absolute -right-9 sm:-right-11 top-4 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white">
                  {idx + 1}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--app-card-border)] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{event.icon}</span>
                    <div>
                      <h3 className="font-black text-base text-[var(--app-text)]">
                        {event.titleAr}
                      </h3>
                      {event.exactDateAr && (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {event.exactDateAr}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="bg-amber-500 text-amber-950 font-black text-xs px-3 py-1 rounded-xl shrink-0 self-start sm:self-auto shadow-xs">
                    {event.yearAr}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-[var(--app-text)] leading-relaxed">
                  {event.summaryAr}
                </p>

                <p className="text-xs text-[var(--app-text-muted)] font-medium leading-relaxed bg-[var(--app-card-bg)] p-3 rounded-2xl border border-[var(--app-card-border)]">
                  📖 <span className="font-bold">{t('historyMuseumDetailsLabel')}</span> {event.detailsAr}
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-xl text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t('historyMuseumSignificanceLabel', { significance: event.significanceAr })}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: NATIONAL SYMBOLS & ANTHEM                         */}
      {/* ======================================================== */}
      {activeTab === 'symbols' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Flag section */}
          <div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--app-card-border)] pb-4">
              <span className="text-4xl">🇩🇿</span>
              <div>
                <h2 className="text-xl font-black text-[var(--app-text)]">
                  {t('historyMuseumFlagHeading')}
                </h2>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">
                  {t('historyMuseumFlagSubtext')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {NATIONAL_SYMBOLS[0].components?.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--app-card-subtle)] p-4 rounded-2xl border border-[var(--app-card-border)] space-y-1.5 shadow-xs"
                >
                  <span className="font-black text-sm text-[var(--app-text)] block">
                    {comp.name}
                  </span>
                  <p className="text-xs text-[var(--app-text-muted)] font-bold leading-relaxed">
                    {comp.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Anthem Section */}
          <div
            className="rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-emerald-600/30"
            style={{ backgroundImage: 'linear-gradient(to bottom right, #064e3b, #042f2e)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🎵</span>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    النشيد الوطني الجزائري "قَسَماً"
                  </h3>
                  <p className="text-xs text-emerald-200 font-bold mt-0.5">
                    تأليف الشاعر مفدي زكريا • ألحان الموسيقار محمد فوزي
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  speakText(
                    'قسماً بالنازلات الماحقات، والدماء الزاكيات الطاهرات، والبنود اللامعات الخافقات، في الجبال الشامخات الشاهقات، نحن ثرنا فحياة أو ممات، وعقدنا العزم أن تحيا الجزائر، فاشهدوا فاشهدوا فاشهدوا!'
                  )
                }
                className="px-5 py-2.5 bg-amber-400 text-amber-950 rounded-2xl font-black text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t('historyMuseumListenFirstVerseButton')}</span>
              </button>
            </div>

            <div className="space-y-2 text-center py-2">
              {NATIONAL_SYMBOLS[1].verses?.map((verse, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base font-black text-amber-200 tracking-wide leading-relaxed py-1"
                >
                  {verse}
                </p>
              ))}
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md text-xs text-emerald-100 font-medium leading-relaxed">
              💡 <span className="font-bold">{t('historyMuseumHistoricalNoteLabel')}</span> كُتب النشيد الوطني الجزائري سنة 1955م بالزنزانة رقم 69 بسجن بربروس في العاصمة بعدما طلب قادة جبهة التحرير من مفدي زكريا نشيداً يعبر عن عظمة الثورة.
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: HISTORY DETECTIVE QUIZ                            */}
      {/* ======================================================== */}
      {activeTab === 'detective_quiz' && (
        <LabQuizSession complete={quizIndex >= quizQuestions.length} score={quizScore} total={quizQuestions.length} onRestart={() => { setQuizIndex(0); setQuizScore(0); setSelectedQuizOption(null); setIsQuizAnswered(false); setQuizFeedback(null); }}>
<div className="bg-[var(--app-card-bg)] rounded-3xl p-6 sm:p-8 border border-[var(--app-card-border)] shadow-md space-y-6 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--app-card-border)]">
            <span className="text-xs font-black text-[var(--app-text-muted)]">
              {t('historyMuseumDetectiveQuestionLabel', { number: quizIndex + 1 })}
            </span>
            <span className="bg-amber-100 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-xs">
              {t('scoreBadge', { score: quizScore })}
            </span>
          </div>

          <div className="space-y-4 py-4">
            <span className="text-5xl block animate-bounce">🎖️</span>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--app-text)] leading-snug">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === opt;
              const isCorrect = opt === currentQuiz.answer;
              let btnClass =
                'bg-[var(--app-card-subtle)] hover:bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)]';

              if (isQuizAnswered) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-700 text-white border-emerald-700 shadow-md scale-[1.02]';
                } else if (isSelected) {
                  btnClass = 'bg-rose-600 text-white border-rose-600 shadow-md';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isQuizAnswered}
                  onClick={() => handleAnswerQuiz(opt)}
                  className={`p-4 rounded-2xl border-2 font-black text-sm transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {isQuizAnswered && (
            <div className="space-y-4 pt-2">
              {quizFeedback && (
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border ${
                    quizFeedback.isCorrect
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                      : 'bg-rose-50 text-rose-950 border-rose-200'
                  }`}
                >
                  {quizFeedback.text}
                </div>
              )}

              <button
                onClick={handleNextQuiz}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
              >
                {t('nextQuestionButton')}
              </button>
            </div>
          )}
        </div>
</LabQuizSession>
      )}
    </div>
  );
};
