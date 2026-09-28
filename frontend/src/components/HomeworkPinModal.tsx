import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, KeyRound, Share2, Copy, Check, Users, BookOpen, Clock, Sparkles } from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';
import { HomeworkAssignment } from '../types/ecosystem';
import { useAuth } from '../context/AuthContext';
import { springBootApi } from '../services/springBootApi';

interface HomeworkPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHomework?: (homework: HomeworkAssignment) => void;
  onStartHomework?: (homework: any) => void;
  currentGrade?: PrimaryGrade;
  defaultMode?: 'join' | 'create';
}

export const HomeworkPinModal: React.FC<HomeworkPinModalProps> = ({
  isOpen,
  onClose,
  onSelectHomework,
  onStartHomework,
  currentGrade = '5AP',
  defaultMode = 'join',
}) => {
  const { authUser } = useAuth();
  const [mode, setMode] = useState<'join' | 'create'>(defaultMode);
  
  // Join state
  const [pinInput, setPinInput] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Create state
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<PrimaryGrade>(currentGrade);
  const [subject, setSubject] = useState<SubjectId>('math');
  const [createdHomework, setCreatedHomework] = useState<HomeworkAssignment | null>(null);
  const [copied, setCopied] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim().toUpperCase();
    if (!cleanPin) return;

    setJoinLoading(true);
    setJoinError(null);

    try {
      const res = await fetch(`/api/v1/homeworks/pin/${encodeURIComponent(cleanPin)}`);
      if (res.ok) {
        const hw: HomeworkAssignment = await res.json();
        if (onSelectHomework) {
          onSelectHomework(hw);
        }
        if (onStartHomework) {
          onStartHomework(hw);
        }
        onClose();
      } else {
        // Fallback demo homework if offline
        const fallbackHw: HomeworkAssignment = {
          id: `hw-${cleanPin}`,
          pinCode: cleanPin,
          teacherId: 103,
          teacherName: 'الأستاذ',
          title: `واجب مدرسي (${cleanPin})`,
          targetGrade: cleanPin.includes('1AP') ? '1AP' : cleanPin.includes('2AP') ? '2AP' : cleanPin.includes('3AP') ? '3AP' : cleanPin.includes('4AP') ? '4AP' : '5AP',
          subject: 'math',
          exerciseIds: ['ex-1', 'ex-2'],
          createdAt: new Date().toISOString().slice(0, 10),
          descriptionAr: 'واجب منزلي للمراجعة والتدرب.',
        };
        if (onSelectHomework) {
          onSelectHomework(fallbackHw);
        }
        if (onStartHomework) {
          onStartHomework(fallbackHw);
        }
        onClose();
      }
    } catch {
      setJoinError('تعذر العثور على الواجب. تأكد من صحة الرمز.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreateLoading(true);

    const generatedPin = `DZ-${grade}-${Math.floor(Math.random() * 89 + 10)}`;
    const newHomework: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      pinCode: generatedPin,
      teacherId: authUser?.id || 103,
      teacherName: authUser?.nom || 'أستاذ المادة',
      title: title.trim(),
      targetGrade: grade,
      subject: subject,
      exerciseIds: [`${subject}-${grade}-1`, `${subject}-${grade}-2`],
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      descriptionAr: `واجب منزلي رسمي موجه لتلاميذ ${grade} في مادة ${subject}.`,
    };

    try {
      await fetch('/api/v1/homeworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHomework),
      });
    } catch {
      // ignore
    }

    setCreatedHomework(newHomework);
    setCreateLoading(false);
  };

  const handleCopyLink = () => {
    if (!createdHomework) return;
    const shareText = `السلام عليكم، هذا هو رمز الواجب المدرسي عبر منصة مسيد DZ:\n📌 الرمز: ${createdHomework.pinCode}\n📖 العنوان: ${createdHomework.title} (${createdHomework.targetGrade})\n👉 ادخل للمنصة واكتب الرمز لبدء الحل مباشرة!`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    if (!createdHomework) return;
    const text = encodeURIComponent(
      `السلام عليكم، هذا هو رمز الواجب المدرسي عبر منصة مسيد DZ:\n📌 الرمز: ${createdHomework.pinCode}\n📖 العنوان: ${createdHomework.title} (${createdHomework.targetGrade})\n👉 افتح منصة مسيد واكتب الرمز!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm dir-rtl overflow-x-hidden overflow-y-auto" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full min-w-0 max-h-[min(90dvh,calc(100svh-1.5rem))] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-2xl shrink-0">
              🔑
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug break-words">الواجبات ورمز PIN السريع</h3>
              <p className="text-xs text-slate-500 font-bold leading-snug break-words">انضم لواجب بدون كلمة سر أو شارك واجبك مع تلاميذك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hit-target w-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all ${
              mode === 'join' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👨‍🎓 انضمام كتلميذ (إدخال الرمز)
          </button>
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all ${
              mode === 'create' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👩‍🏫 فضاء الأستاذ (توليد واجب PIN)
          </button>
        </div>

        {mode === 'join' ? (
          /* Join Form */
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                أدخل رمز الواجب المكون من 6 إلى 8 أحرف (مثال: DZ-3AP-88):
              </label>

              <div className="relative">
                <KeyRound className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="DZ-3AP-88"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.toUpperCase())}
                  className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl font-black text-center text-lg tracking-widest text-emerald-800 focus:outline-emerald-500 focus:bg-white"
                  required
                />
              </div>

              {joinError && <p className="text-xs text-rose-600 font-bold">{joinError}</p>}
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
              💡 يقدم الأستاذ رمز الـ PIN في القسم أو عبر مجموعة واتساب/فايبر لفتح التمارين المخصصة فوراً.
            </div>

            <button
              type="submit"
              disabled={joinLoading || !pinInput.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{joinLoading ? 'جاري التحقق...' : 'فتح الواجب وبدء الحل 🚀'}</span>
            </button>
          </form>
        ) : (
          /* Create Form */
          <div>
            {!createdHomework ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 block">عنوان الواجب:</label>
                  <input
                    type="text"
                    placeholder="مثال: واجب العطلة في الرياضيات وتطبيقات الكسور"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">المستوى المستهدف:</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold"
                    >
                      <option value="1AP">1AP — الأولى ابتدائي</option>
                      <option value="2AP">2AP — الثانية ابتدائي</option>
                      <option value="3AP">3AP — الثالثة ابتدائي</option>
                      <option value="4AP">4AP — الرابعة ابتدائي</option>
                      <option value="5AP">5AP — الخامسة ابتدائي</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 block">المادة:</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as SubjectId)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold"
                    >
                      <option value="math">الرياضيات</option>
                      <option value="arabic">اللغة العربية</option>
                      <option value="science">التربية العلمية</option>
                      <option value="history_geo">التاريخ والجغرافيا</option>
                      <option value="french">اللغة الفرنسية</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createLoading || !title.trim()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد رمز الـ PIN والمشاركة</span>
                </button>
              </form>
            ) : (
              /* Created Result Card */
              <div className="space-y-4 text-center">
                <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-300 space-y-3">
                  <span className="text-xs font-extrabold text-emerald-800 block">تم إنشاء الواجب بنجاح! 🎊</span>
                  
                  <div className="bg-white py-3 px-6 rounded-2xl border-2 border-dashed border-emerald-500 inline-block shadow-sm">
                    <span className="text-2xl font-black tracking-widest text-emerald-950 font-mono">
                      {createdHomework.pinCode}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900">{createdHomework.title}</h4>
                  <p className="text-xs text-slate-500 font-bold">
                    المستوى: {createdHomework.targetGrade} | المادة: {createdHomework.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ نص الواجب'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة عبر WhatsApp</span>
                  </button>
                </div>

                <button
                  onClick={() => setCreatedHomework(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold underline"
                >
                  توليد واجب جديد ➕
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
