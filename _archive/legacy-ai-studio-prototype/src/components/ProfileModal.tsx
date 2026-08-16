import React, { useState, useEffect } from 'react';
import { UserProfile, Badge } from '../types';
import { AuthUser } from '../types/auth';
import { X, Award, Flame, Trophy, Star, CheckCircle2, ShieldCheck, RefreshCw, Edit2, Database } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  authUser?: AuthUser | null;
  onResetProgress: () => void;
  onUpdateName?: (newName: string) => void;
  onRefreshFromDb?: () => Promise<void>;
}

const ALL_BADGES: Badge[] = [
  { id: 'b_welcome', titleAr: 'مجتهد الجزائر', descriptionAr: 'انضمامك لمنصة مسيد DZ والبدء في التعلم', icon: '🇩🇿', category: 'streak' },
  { id: 'b_math_star', titleAr: 'عبقري الرياضيات', descriptionAr: 'إكمال 3 دروس واختبارات في الرياضيات', icon: '📐', category: 'math' },
  { id: 'b_soroban_master', titleAr: 'بطل السوروبان', descriptionAr: 'إتقان تمرين Anzan الخاطف وتفعيل مكملات 5', icon: '🧮', category: 'soroban' },
  { id: 'b_arabic_hero', titleAr: 'فارس الضاد', descriptionAr: 'إكمال قواعد النحو والإملاء بامتياز', icon: '📖', category: 'arabic' },
  { id: 'b_french_champion', titleAr: 'Champion de Français 5AP', descriptionAr: 'إتقان مشاريع وقواعد اللغة الفرنسية للسنة الخامسة', icon: '🇫🇷', category: 'french' },
  { id: 'b_english_master', titleAr: 'English Master 5AP', descriptionAr: 'إتقان وحدات ومحادثات اللغة الإنجليزية والنطق الصوتي', icon: '🇬🇧', category: 'english' },
  { id: 'b_exam_champion', titleAr: 'بطل شهادة 5AP', descriptionAr: 'حل موضوع امتحان شهادة ابتدائي رسمي بنجاح', icon: '🏆', category: 'exams' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  authUser,
  onResetProgress,
  onUpdateName,
  onRefreshFromDb,
}) => {
  const currentName = authUser?.nom || userProfile.name;
  const [editedName, setEditedName] = useState(currentName);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setEditedName(authUser?.nom || userProfile.name);
  }, [authUser?.nom, userProfile.name]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onUpdateName && editedName.trim()) {
      onUpdateName(editedName.trim());
    }
    onClose();
  };

  const handleRefreshClick = async () => {
    if (onRefreshFromDb) {
      setIsRefreshing(true);
      await onRefreshFromDb();
      setIsRefreshing(false);
    }
  };

  const totalXp = authUser?.score !== undefined ? authUser.score : (authUser?.xp !== undefined ? authUser.xp : userProfile.xp);
  const currentLevel = authUser?.level !== undefined ? authUser.level : Math.floor(totalXp / 100) + 1;
  const nextLevelXp = currentLevel * 100;
  const xpInCurrentLevel = totalXp % 100;
  const currentLevelProgress = Math.min(100, Math.round((xpInCurrentLevel / 100) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 dir-rtl" dir="rtl">
      <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 flex items-center justify-center text-xl font-bold">
              <span className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                {userProfile.avatar || '🎓'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold font-sans">{currentName}</h2>
                {authUser?.role && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    authUser.role === 'ROLE_ADMIN'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : authUser.role === 'ROLE_PREMIUM'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {authUser.role === 'ROLE_ADMIN' ? 'ADMIN' : authUser.role === 'ROLE_PREMIUM' ? 'PREMIUM' : 'FREE'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {authUser?.email ? `${authUser.email} • المستوى ${currentLevel}` : `تلميذ في ${userProfile.grade} • المستوى ${currentLevel}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshFromDb && (
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                title="تحديث البيانات من قاعدة البيانات"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <Database className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Edit Name Section */}
          <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
            <label className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
              <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>اسم التلميذ / الحساب الشخصي:</span>
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="أدخل اسمك هنا..."
              className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* XP & Level Progress Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>المستوى الحالي ({currentLevel}) ← التقدم نحو المستوى ({currentLevel + 1})</span>
              </div>
              <span className="font-mono text-emerald-700 font-black">{totalXp} XP</span>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>سلسلة الحضور: {userProfile.streakDays} أيام متواصلة</span>
              </div>
              <span>مكتمل {userProfile.completedLessonIds.length} دروس</span>
            </div>
          </div>

          {/* Badges Gallery */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              شارات الأوسمة والإنجازات الجزائرية ({userProfile.badges.length}/{ALL_BADGES.length}):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_BADGES.map((b) => {
                const isUnlocked = userProfile.badges.includes(b.id) || b.id === 'b_welcome';
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-slate-100/60 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="text-2xl p-1 bg-white rounded-lg border border-slate-200 shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs">{b.titleAr}</h4>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{b.descriptionAr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex items-center justify-between text-xs font-bold">
          <button
            onClick={onResetProgress}
            className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التقدم</span>
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-700 transition-colors shadow-md active:scale-95 cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
