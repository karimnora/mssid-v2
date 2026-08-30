import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Award,
  Trophy,
  Sparkles,
  Volume2,
  Share2,
  Check,
  RotateCcw,
  Palette,
  Shield,
  Star,
  BookOpen,
  Calculator,
  Compass,
  FlaskConical,
  GraduationCap,
  Heart,
  Feather,
  Smile,
} from 'lucide-react';
import { PrimaryGrade, UserProfile } from '../types';
import { WILAYAS_LIST } from '../data/wilayasData';
import { speakText as speakTextShared, stopSpeech } from '../utils/speech';

export interface HonorCertificatesStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  defaultGrade?: PrimaryGrade;
}

export type CertificateTemplateId =
  | 'honor_board'
  | 'math_champion'
  | 'arabic_calligraphy'
  | 'reading_crown'
  | 'science_explorer'
  | 'wilayas_ambassador'
  | 'daily_perseverance'
  | 'exam_acquis_5ap';

interface CertificateTemplate {
  id: CertificateTemplateId;
  titleAr: string;
  subtitleAr: string;
  badgeEmoji: string;
  primaryColor: string;
  borderClass: string;
  themeBg: string;
  sealDefault: string;
  recommendedFor: string;
  defaultMotivation: string;
}

const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'honor_board',
    titleAr: 'لَوْحَةُ الشَّرَفِ وَالامْتِيَازِ الْمَدْرَسِيّ',
    subtitleAr: 'TABLEAU D\'HONNEUR & EXCELLENCE SCOLAIRE',
    badgeEmoji: '🌟',
    primaryColor: 'from-amber-600 via-yellow-500 to-amber-700',
    borderClass: 'border-amber-500',
    themeBg: 'bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/60',
    sealDefault: 'republic_gold',
    recommendedFor: 'النتائج الممتازة في جميع المواد خلال الفصل الدراسي',
    defaultMotivation: 'نظراً لاجتهاده المتميز، وسلوكه المثالي، وتفوقه الباهر في تحصيل العلوم والمعارف، منحته إدارة المدرسة هذه الشهادة تشجيعاً لمسيرته الناجحة.',
  },
  {
    id: 'math_champion',
    titleAr: 'شَهَادَةُ فَارِسِ الرِّيَاضِيَّاتِ وَالْحِسَابِ الذِّهْنِيّ',
    subtitleAr: 'CHAMPION DE CALCUL MENTAL & MATHÉMATIQUES',
    badgeEmoji: '📐',
    primaryColor: 'from-blue-600 via-indigo-500 to-sky-600',
    borderClass: 'border-blue-500',
    themeBg: 'bg-gradient-to-br from-blue-50/70 via-white to-sky-50/60',
    sealDefault: 'trophy_gold',
    recommendedFor: 'التفوق في جدول الضرب، حل المسائل، والحساب السريع',
    defaultMotivation: 'تقديراً لسرعة بديهته في حل المسائل الحسابية وتفوقه في عالم الأعداد والهندسة وسرعة التفكير المنطقي.',
  },
  {
    id: 'arabic_calligraphy',
    titleAr: 'وِسَامُ الْخَطِّ الْعَرَبِيِّ وَفَصَاحَةِ الْبَيَان',
    subtitleAr: 'PRIX DE CALLIGRAPHIE & ÉLOQUENCE ARABE',
    badgeEmoji: '✍️',
    primaryColor: 'from-emerald-700 via-teal-600 to-emerald-800',
    borderClass: 'border-emerald-600',
    themeBg: 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60',
    sealDefault: 'star_crescent',
    recommendedFor: 'جمال الخط، الإعراب المتقن، والتعبير الكتابي الشجي',
    defaultMotivation: 'اعتزازاً بجمال رسم حروف لغة الضاد وإتقانه لقواعد النحو وفصاحة التعبير في نصوص الإنشاء والقراءة.',
  },
  {
    id: 'reading_crown',
    titleAr: 'شَهَادَةُ قَارِئِ الْمُسْتَقْبَلِ وَتَاجِ الْمَعْرِفَة',
    subtitleAr: 'GRAND LECTEUR & COURONNE DU SAVOIR',
    badgeEmoji: '📖',
    primaryColor: 'from-purple-600 via-fuchsia-500 to-pink-600',
    borderClass: 'border-purple-500',
    themeBg: 'bg-gradient-to-br from-purple-50/70 via-white to-pink-50/60',
    sealDefault: 'republic_gold',
    recommendedFor: 'المطالعة المستمرة، فصاحة الإلقاء، وحب القصص',
    defaultMotivation: 'تكريماً لشغفه الكبير بمطالعة الكتب والقصص الهادفة وحرصه المستمر على نهل المعرفة وتوسيع أفقه الفكري.',
  },
  {
    id: 'science_explorer',
    titleAr: 'وِسَامُ الْعَالِمِ الصَّغِيرِ وَالإِيقَاظِ الْعِلْمِيّ',
    subtitleAr: 'JEUNE SAVANT & EXPLORATEUR DES SCIENCES',
    badgeEmoji: '🔬',
    primaryColor: 'from-teal-600 via-cyan-500 to-emerald-600',
    borderClass: 'border-teal-500',
    themeBg: 'bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/60',
    sealDefault: 'trophy_gold',
    recommendedFor: 'إجراء التجارب، حب الاستكشاف، وفهم الطبيعة والكون',
    defaultMotivation: 'تشجيعاً لحسه الاستكشافي المتميز وفهمه العميق لتجارب التربية العلمية والتكنولوجية واهتمامه بحماية البيئة.',
  },
  {
    id: 'wilayas_ambassador',
    titleAr: 'شَهَادَةُ سَفِيرِ التُّرَاثِ وَالـ 58 وِلَايَة',
    subtitleAr: 'GRAND AMBASSADEUR DU PATRIMOINE ALGÉRIEN',
    badgeEmoji: '🇩🇿',
    primaryColor: 'from-emerald-600 via-amber-500 to-rose-600',
    borderClass: 'border-emerald-600',
    themeBg: 'bg-gradient-to-br from-emerald-50/60 via-amber-50/30 to-rose-50/40',
    sealDefault: 'didou_seal',
    recommendedFor: 'استكشاف معالم الجزائر، الجغرافيا الوطنية، والتاريخ المجيد',
    defaultMotivation: 'تقديراً لشغفه بتاريخ وطنه المجيد واستكشافه لمعالم ولايات الجزائر الـ 58 من الساحل الأشم حتى صحراء الهقار.',
  },
  {
    id: 'daily_perseverance',
    titleAr: 'شَهَادَةُ النُّجُومِيَّةِ وَالْمُثَابَرَةِ وَحُسْنِ السَّلُوك',
    subtitleAr: 'PRIX D\'ASSIDUITÉ & BELLE DISCIPLINE',
    badgeEmoji: '🎖️',
    primaryColor: 'from-rose-600 via-orange-500 to-amber-600',
    borderClass: 'border-rose-500',
    themeBg: 'bg-gradient-to-br from-rose-50/70 via-white to-orange-50/60',
    sealDefault: 'didou_seal',
    recommendedFor: 'المواظبة اليومية، التحلي بالأخلاق العالية، وروح التعاون',
    defaultMotivation: 'نظراً لالتزامه اليومي بأداء واجباته المدرسية، وتحليه بروح الأخوة والاحترام داخل فضاء التعلم.',
  },
  {
    id: 'exam_acquis_5ap',
    titleAr: 'شَهَادَةُ التَّفَوُّقِ فِي تَقْيِيمِ الْمُكْتَسَبَاتِ (5AP)',
    subtitleAr: 'ATTESTATION D\'ÉVALUATION DES ACQUIS DU PRIMAIRE',
    badgeEmoji: '🎓',
    primaryColor: 'from-slate-800 via-emerald-800 to-amber-700',
    borderClass: 'border-emerald-700',
    themeBg: 'bg-gradient-to-br from-slate-50 via-emerald-50/40 to-amber-50/50',
    sealDefault: 'republic_gold',
    recommendedFor: 'إتمام امتحانات مرحلة التعليم الابتدائي بنجاح واقتدار',
    defaultMotivation: 'تتويجاً لاجتيازه الموفق والمشرف لكافة ميادين امتحان تقييم مكتسبات مرحلة التعليم الابتدائي واستعداده للانتقال للطور المتوسط.',
  },
];

const HONORS_APPRECIATIONS = [
  { id: 'excellence', labelAr: 'بامتياز وتكريم الطاقم التربوي 🌟', labelFr: 'Avec Félicitations du Jury' },
  { id: 'tres_bien', labelAr: 'بتقدير ممتاز جداً 🥇', labelFr: 'Mention Très Bien' },
  { id: 'bien', labelAr: 'بتقدير جيد جداً 🥈', labelFr: 'Mention Bien' },
  { id: 'encouragements', labelAr: 'لوحة الشرف مع التشجيع 🎖️', labelFr: 'Tableau d\'Honneur' },
  { id: 'merit', labelAr: 'شهادة استحقاق وعرفان 📜', labelFr: 'Témoignage de Mérite' },
];

export const HonorCertificatesStudioModal: React.FC<HonorCertificatesStudioModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  defaultGrade = '5AP',
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<CertificateTemplateId>('honor_board');
  const [studentName, setStudentName] = useState<string>(userProfile?.name || 'محمد أمين بن عيسى');
  const [schoolName, setSchoolName] = useState<string>('المدرسة الابتدائية الأمير عبد القادر');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Alger
  const [grade, setGrade] = useState<PrimaryGrade>(defaultGrade);
  const [schoolYear, setSchoolYear] = useState<string>('2025 / 2026');
  const [trimesterText, setTrimesterText] = useState<string>('الفصل الثاني');
  const [selectedHonor, setSelectedHonor] = useState<string>(HONORS_APPRECIATIONS[0].labelAr);
  const [sealType, setSealType] = useState<'republic_gold' | 'star_crescent' | 'didou_seal' | 'trophy_gold'>('republic_gold');
  const [customMotivation, setCustomMotivation] = useState<string>('');
  const [teacherTitle, setTeacherTitle] = useState<string>('أستاذ(ة) القسم: ذ. بلقاسم');
  const [directorTitle, setDirectorTitle] = useState<string>('مدير(ة) المؤسسة: ذ. حـ. سعيدي');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const printRef = useRef<HTMLDivElement>(null);
  const speechTimeoutRef = useRef<number | null>(null);

  // Stop any in-flight speech synthesis and pending timers when the modal unmounts/closes,
  // so a lingering utterance or timeout doesn't outlive the studio.
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) window.clearTimeout(speechTimeoutRef.current);
      stopSpeech();
    };
  }, []);

  if (!isOpen) return null;

  const currentTemplate = CERTIFICATE_TEMPLATES.find((t) => t.id === selectedTemplateId) || CERTIFICATE_TEMPLATES[0];
  const selectedWilaya = WILAYAS_LIST.find((w) => w.code === selectedWilayaCode) || WILAYAS_LIST[15];

  const handlePrint = () => {
    // The shared print stylesheet (index.css) sets a portrait `@page` for the A4 revision
    // worksheets. This certificate is laid out landscape (280mm wide), so without overriding
    // the page orientation just for this print, the right portion of the diploma gets cut off
    // on paper. Inject a scoped override, print, then remove it once the print dialog closes.
    const landscapeOverride = document.createElement('style');
    landscapeOverride.setAttribute('data-certificate-print-override', 'true');
    landscapeOverride.textContent = '@media print { @page { size: A4 landscape; margin: 10mm; } }';
    document.head.appendChild(landscapeOverride);

    const cleanup = () => {
      landscapeOverride.remove();
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    window.print();
  };

  const handleSpeakSpeech = () => {
    if (speechTimeoutRef.current) {
      window.clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `بكل فخر واعتزاز، تمنح مدرسة ${schoolName} بولاية ${selectedWilaya.nameAr}، ${currentTemplate.titleAr} للبطل المجتهد ${studentName}، بالمستوى ${grade}، ${selectedHonor}. ألف مبروك هذا النجاح المشرف!`;
    setIsSpeaking(true);
    speakTextShared(textToSpeak, 'ar-SA', 0.88);
    speechTimeoutRef.current = window.setTimeout(() => {
      setIsSpeaking(false);
      speechTimeoutRef.current = null;
    }, 14000);
  };

  const effectiveMotivation = customMotivation.trim() || currentTemplate.defaultMotivation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[96vh] overflow-hidden text-right"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 border border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  استوديو لوحات الشرف والشهادات الرسمية التكريمية
                </h2>
                <span className="bg-amber-100 text-amber-950 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  A4 Print Ready 🇩🇿
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                صمّم واطبع شهادات فخرية رسمية مخصصة لتكريم أبنائك وتلاميذك في البيت والمدرسة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakSpeech}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isSpeaking
                  ? 'bg-amber-500 text-amber-950 animate-pulse'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title="استمع إلى قراءة خطاب التكريم صوتياً"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'جاري الإلقاء 🎙️' : 'إلقاء التكريم 🔊'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF 🖨️</span>
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Left Configuration Panel, Right Live A4 Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-3 overflow-hidden flex-1">
          {/* Controls Settings (5 Cols) */}
          <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-1 pl-1">
            {/* 1. Template Choice */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>1. اختر نوع الشهادة والتكريم:</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {CERTIFICATE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setCustomMotivation('');
                    }}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 cursor-pointer ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-black shadow-xs'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 text-xs font-bold'
                    }`}
                  >
                    <span className="text-xl shrink-0">{tmpl.badgeEmoji}</span>
                    <div className="overflow-hidden">
                      <span className="block text-xs truncate font-black">{tmpl.titleAr}</span>
                      <span className="block text-[10px] text-slate-500 truncate">{tmpl.subtitleAr}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Student & School Details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>2. بيانات التلميذ(ة) والمؤسسة:</span>
              </label>

              <div>
                <span className="font-bold text-slate-600 block mb-1">اسم ولقب التلميذ(ة):</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-black text-slate-900 focus:outline-emerald-500"
                  placeholder="مثال: ياسمين بن علي"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-600 block mb-1">المستوى الدراسي:</span>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    <option value="1AP">1AP — الأولى ابتدائي</option>
                    <option value="2AP">2AP — الثانية ابتدائي</option>
                    <option value="3AP">3AP — الثالثة ابتدائي</option>
                    <option value="4AP">4AP — الرابعة ابتدائي</option>
                    <option value="5AP">5AP — الخامسة ابتدائي</option>
                  </select>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block mb-1">الولاية:</span>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    {WILAYAS_LIST.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.codeStr} - ولاية {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-600 block mb-1">المدرسة الابتدائية:</span>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                  placeholder="اسم المدرسة..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-600 block mb-1">السنة الدراسية:</span>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 text-center font-mono"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-1">المناسبة / الفصل:</span>
                  <input
                    type="text"
                    value={trimesterText}
                    onChange={(e) => setTrimesterText(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 text-center"
                  />
                </div>
              </div>
            </div>

            {/* 3. Honors, Seal & Signatures */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>3. التقدير والشارات الرسمية:</span>
              </label>

              <div>
                <span className="font-bold text-slate-600 block mb-1">عبارة التقدير والشرف:</span>
                <select
                  value={selectedHonor}
                  onChange={(e) => setSelectedHonor(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-black text-amber-900"
                >
                  {HONORS_APPRECIATIONS.map((h) => (
                    <option key={h.id} value={h.labelAr}>
                      {h.labelAr} ({h.labelFr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="font-bold text-slate-600 block mb-1">نوع الختم الذهبي:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'republic_gold', label: '🇩🇿 ختم الفخر الوطني' },
                    { id: 'star_crescent', label: '🌙 الهلال والنجمة' },
                    { id: 'didou_seal', label: '🦊 ختم ديدو الرسمي' },
                    { id: 'trophy_gold', label: '🏆 كأس الامتياز' },
                  ].map((seal) => (
                    <button
                      key={seal.id}
                      onClick={() => setSealType(seal.id as typeof sealType)}
                      className={`p-2 rounded-xl border text-center font-black transition-all cursor-pointer ${
                        sealType === seal.id
                          ? 'bg-amber-100 text-amber-950 border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {seal.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-600 block mb-1">نص التنويه والثناء (اختياري):</span>
                <textarea
                  rows={2}
                  value={customMotivation}
                  onChange={(e) => setCustomMotivation(e.target.value)}
                  placeholder={currentTemplate.defaultMotivation}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800 text-[11px] focus:outline-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Live A4 Landscape Certificate Canvas (7 Cols) */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-200/80 rounded-3xl overflow-y-auto border border-slate-300">
            <div className="text-center pb-2 text-[11px] text-slate-600 font-bold print:hidden">
              معاينة حية بالحجم الطباعي القياسي (A4 Landscape) — جاهز للتأطير والتعليق
            </div>

            {/* PRINTABLE DIPLOMA CONTAINER */}
            <div
              ref={printRef}
              id="honor-certificate-print-stage"
              className={`printable-certificate relative w-full max-w-[280mm] min-h-[195mm] p-6 sm:p-8 rounded-2xl shadow-2xl border-8 ${currentTemplate.borderClass} ${currentTemplate.themeBg} text-slate-900 flex flex-col justify-between overflow-hidden select-none bg-white`}
              style={{
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)',
              }}
            >
              {/* Arabesque / Golden Corner Decorations */}
              <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600 rounded-br-xl pointer-events-none" />

              {/* Watermark Logo DZ in Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <span className="text-[180px] font-black">🇩🇿</span>
              </div>

              {/* Top Header: Official Republic Algerian Header */}
              <div className="text-center space-y-1 relative z-10">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🇩🇿</span>
                  <h4 className="text-xs sm:text-sm font-black tracking-widest text-slate-800">
                    الْجُمْهُورِيَّةُ الْجَزَائِرِيَّةُ الدِّيمُقْرَاطِيَّةُ الشَّعْبِيَّةُ
                  </h4>
                  <span className="text-xl">🇩🇿</span>
                </div>
                <h5 className="text-[11px] sm:text-xs font-bold text-slate-600">
                  وِزَارَةُ التَّرْبِيَةِ الْوَطَنِيَّةِ — مُدِيرِيَّةُ التَّرْبِيَةِ لِوِلَايَةِ {selectedWilaya.nameAr} ({selectedWilaya.codeStr})
                </h5>
                <p className="text-[10px] font-black text-slate-500">
                  {schoolName} • السنة الدراسية: {schoolYear}
                </p>
                <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
              </div>

              {/* Title Section with Golden Ribbon Look */}
              <div className="text-center my-3 relative z-10 space-y-1">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 shadow-md border border-amber-300">
                  <span className="text-2xl">{currentTemplate.badgeEmoji}</span>
                  <h1 className="text-lg sm:text-2xl font-black tracking-wide font-serif">
                    {currentTemplate.titleAr}
                  </h1>
                  <span className="text-2xl">{currentTemplate.badgeEmoji}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-black tracking-wider text-amber-900/80">
                  {currentTemplate.subtitleAr}
                </p>
              </div>

              {/* Core Honoree Certificate Text */}
              <div className="text-center space-y-3 px-4 sm:px-8 relative z-10">
                <p className="text-xs sm:text-sm text-slate-700 font-bold">
                  تَشْهَدُ إِدَارَةُ الْمَدْرَسَةِ وَالطَّاقَمُ التَّرْبَوِيُّ بِأَنَّ التِّلْمِيذَ(ة) الْمُتَمَيِّز(ة):
                </p>

                {/* Honoree Full Name with Calligraphic styling */}
                <div className="my-2">
                  <span className="inline-block px-8 py-2 text-xl sm:text-3xl font-black text-emerald-950 border-b-2 border-dashed border-amber-500 bg-amber-100/40 rounded-xl">
                    {studentName || 'اسم ولقب التلميذ'}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-bold text-slate-800 flex-wrap">
                  <span className="bg-white/80 px-3 py-1 rounded-lg border border-slate-200">
                    المستوى: <strong className="text-emerald-800">{grade}</strong>
                  </span>
                  <span className="bg-white/80 px-3 py-1 rounded-lg border border-slate-200">
                    المناسبة: <strong className="text-emerald-800">{trimesterText}</strong>
                  </span>
                  <span className="bg-amber-100 text-amber-950 px-3 py-1 rounded-lg border border-amber-300 font-black">
                    التقدير: {selectedHonor}
                  </span>
                </div>

                {/* Motivation / Appreciation Paragraph */}
                <p className="max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed text-slate-700 font-medium italic pt-1">
                  « {effectiveMotivation} »
                </p>
              </div>

              {/* Bottom Row: Golden Seal in Center, Signatures on Sides */}
              <div className="grid grid-cols-3 items-end pt-4 border-t border-slate-200/80 relative z-10 text-xs">
                {/* Right: Teacher Signature */}
                <div className="text-center space-y-6">
                  <span className="font-black text-slate-800 block text-[11px] sm:text-xs">
                    توقيع وملاحظة الأستاذ(ة):
                  </span>
                  <div className="font-serif italic text-slate-500 text-[11px] pt-4">
                    {teacherTitle}
                  </div>
                </div>

                {/* Center: Golden Metallic Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 border-4 border-amber-200 shadow-xl flex flex-col items-center justify-center text-amber-950">
                    {sealType === 'republic_gold' ? (
                      <>
                        <span className="text-2xl sm:text-3xl">🇩🇿</span>
                        <span className="text-[7px] sm:text-[8px] font-black tracking-tighter text-center leading-tight mt-0.5">
                          فخر الجزائر<br />ختم الامتياز
                        </span>
                      </>
                    ) : sealType === 'star_crescent' ? (
                      <>
                        <span className="text-2xl sm:text-3xl">🌙</span>
                        <span className="text-[7px] sm:text-[8px] font-black tracking-tighter text-center leading-tight mt-0.5">
                          وسام الشرف<br />والفخر الوطني
                        </span>
                      </>
                    ) : sealType === 'didou_seal' ? (
                      <>
                        <span className="text-2xl sm:text-3xl">🦊</span>
                        <span className="text-[7px] sm:text-[8px] font-black tracking-tighter text-center leading-tight mt-0.5">
                          رفيق التميز<br />ديدو الفنك
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl sm:text-3xl">🏆</span>
                        <span className="text-[7px] sm:text-[8px] font-black tracking-tighter text-center leading-tight mt-0.5">
                          كأس التفوق<br />الأول على الدفعة
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-amber-900 mt-1">SCEAU OFFICIEL</span>
                </div>

                {/* Left: School Principal Stamp */}
                <div className="text-center space-y-6">
                  <span className="font-black text-slate-800 block text-[11px] sm:text-xs">
                    ختم وتوقيع إدارة المؤسسة:
                  </span>
                  <div className="font-serif italic text-slate-500 text-[11px] pt-4">
                    {directorTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Quick Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>نصيحة: يمكنك تأطير هذه الشهادة بعد طباعتها وتعليقها في غرفة التلميذ لتحفيزه المستمر!</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الآن 🖨️</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
