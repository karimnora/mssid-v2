import React, { useState, useEffect } from 'react';
import { PrimaryGrade, SubjectId, CourseLesson, UserProfile } from './types';
import { AuthUser } from './types/auth';
import { AuthService } from './services/authService';
import { SUBJECTS_LIST, COURSE_SUBJECTS_LIST, INTERACTIVE_LABS_LIST, OFFICIAL_EXAMS_LIST, SPECIAL_TOOLS_AND_EXAMS_LIST } from './data/subjectsData';
import { COURSES_DATA } from './data/coursesData';
import { CourseBreadcrumb } from './components/CourseBreadcrumb';
import { LessonViewer } from './components/LessonViewer';
import { ExamsViewer } from './components/ExamsViewer';
import { SorobanInteractive } from './components/SorobanInteractive';
import { ElectricityLabInteractive } from './components/ElectricityLabInteractive';
import { UnitConverter } from './components/UnitConverter';
import { GeometryVisualizer } from './components/GeometryVisualizer';
import { ArabicConjugator } from './components/ArabicConjugator';
import { FrenchLanguageLab } from './components/FrenchLanguageLab';
import { EnglishLanguageLab } from './components/EnglishLanguageLab';
import { MultiplicationTableInteractive } from './components/MultiplicationTableInteractive';
import { AiTutorModal } from './components/AiTutorModal';
import { AuditModal } from './components/AuditModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AdminReceiptsManager } from './components/AdminReceiptsManager';
import { CmsMainView } from './components/cms/CmsMainView';
import { MssidLogo } from './components/MssidLogo';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Navbar, HeaderTheme } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import {
  BookOpen,
  Calculator,
  Grid,
  Award,
  FlaskConical,
  Compass,
  Heart,
  Languages,
  Bot,
  ShieldCheck,
  Flame,
  Star,
  Trophy,
  Sparkles,
  Globe,
  User,
  ChevronLeft,
  Search,
  Sparkle,
  GraduationCap,
  Sliders,
  Server,
  KeyRound,
  Lock,
  Smartphone,
  Zap
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator,
  BookOpen,
  Grid,
  Award,
  FlaskConical,
  Zap,
  Compass,
  Heart,
  Languages,
  Sparkles,
  Globe,
};

import { useRealtimeUser } from './hooks/useRealtimeUser';

export default function App() {
  const [grade, setGrade] = useState<PrimaryGrade>('5AP');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [mainCategory, setMainCategory] = useState<'courses' | 'labs' | 'exams'>('courses');

  const handleSelectSubject = (subject: SubjectId) => {
    setSelectedSubject(subject);
    setSelectedLesson(null);
    if (INTERACTIVE_LABS_LIST.some((s) => s.id === subject)) {
      setMainCategory('labs');
    } else if (OFFICIAL_EXAMS_LIST.some((s) => s.id === subject)) {
      setMainCategory('exams');
    } else {
      setMainCategory('courses');
    }
  };

  // View state: Student App vs Back Office CMS
  const [isCmsActive, setIsCmsActive] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminReceiptsModalOpen, setIsAdminReceiptsModalOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>('neutre');

  // Current Auth User & Realtime Database Hook
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());
  const { user: realtimeUser, isLiveConnected, lastEvent } = useRealtimeUser(authUser);
  const [realtimeToast, setRealtimeToast] = useState<string | null>(null);

  // Sync state when realtime user updates from database
  useEffect(() => {
    if (realtimeUser) {
      setAuthUser(realtimeUser);
    }
  }, [realtimeUser]);

  // Show floating toast on real-time event
  useEffect(() => {
    if (lastEvent) {
      if (lastEvent.type === 'ROLE_UPDATED' || lastEvent.type === 'RECEIPT_VERIFIED') {
        setRealtimeToast('🎉 تم تحديث صلاحيات حسابك من القاعدة المباشرة بنجاح!');
      } else if (lastEvent.type === 'SCORE_UPDATED') {
        setRealtimeToast('⚡ تم تحديث نقاطك وتقدمك من المباشر!');
      } else if (lastEvent.type === 'PROFILE_UPDATED') {
        setRealtimeToast('✅ تم تحديث ملفك الشخصي في قاعدة البيانات!');
      }
      const timer = setTimeout(() => setRealtimeToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  // User Profile State in LocalStorage & DB Sync
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mssid_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    return {
      name: 'التلميذ المجتهد',
      grade: '5AP',
      avatar: '🇩🇿',
      xp: 140,
      level: 2,
      streakDays: 4,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      completedLessonIds: ['math-5ap-numbers'],
      badges: ['b_welcome', 'b_math_star'],
      quizScores: { 'math-5ap-numbers': 30 },
    };
  });

  useEffect(() => {
    AuthService.fetchProfileFromDbAsync().then((fetched) => {
      if (fetched) {
        setAuthUser(fetched);
        const xp = fetched.score !== undefined ? fetched.score : (fetched.xp !== undefined ? fetched.xp : 140);
        const level = fetched.level !== undefined ? fetched.level : Math.floor(xp / 100) + 1;
        setUserProfile((prev) => ({
          ...prev,
          name: fetched.nom || prev.name,
          xp: xp,
          level: level,
          streakDays: fetched.streakDays || prev.streakDays,
          completedLessonIds: fetched.completedLessonIds || prev.completedLessonIds,
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      const xp = authUser.score !== undefined ? authUser.score : (authUser.xp !== undefined ? authUser.xp : 140);
      const level = authUser.level !== undefined ? authUser.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: authUser.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: authUser.streakDays || prev.streakDays,
        completedLessonIds: authUser.completedLessonIds || prev.completedLessonIds,
      }));
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('mssid_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  if (isCmsActive) {
    return <CmsMainView onExitCms={() => setIsCmsActive(false)} />;
  }

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    const updatedAuth = AuthService.addScore(earnedXp, lessonId);
    if (updatedAuth) {
      setAuthUser(updatedAuth);
    }

    setUserProfile((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessonIds: newCompleted,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: (prev.quizScores[lessonId] || 0) + earnedXp,
        },
      };
    });
  };

  const handleResetProgress = () => {
    if (window.confirm('هل أنت تأكد من إعادة ضبط التقدم والنقاط؟')) {
      const freshProfile: UserProfile = {
        name: userProfile.name || 'التلميذ المجتهد',
        grade: '5AP',
        avatar: '🇩🇿',
        xp: 0,
        level: 1,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        completedLessonIds: [],
        badges: ['b_welcome'],
        quizScores: {},
      };
      setUserProfile(freshProfile);
      setIsProfileModalOpen(false);
    }
  };

  const handleUpdateProfileName = (newName: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, name: newName };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      return updated;
    });

    if (authUser) {
      const updatedAuth = { ...authUser, nom: newName };
      AuthService.setCurrentUser(updatedAuth);
      setAuthUser(updatedAuth);
      AuthService.updateProfileAsync(newName).catch(() => {});
    }
  };

  const handleRefreshProfileFromDb = async () => {
    const fetched = await AuthService.fetchProfileFromDbAsync();
    if (fetched) {
      setAuthUser(fetched);
      const xp = fetched.score !== undefined ? fetched.score : (fetched.xp !== undefined ? fetched.xp : 140);
      const level = fetched.level !== undefined ? fetched.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: fetched.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: fetched.streakDays || prev.streakDays,
        completedLessonIds: fetched.completedLessonIds || prev.completedLessonIds,
      }));
    }
  };

  // Filter lessons by grade, subject, and trimester
  const currentLessons = COURSES_DATA.filter(
    (l) => l.subject === selectedSubject &&
      (l.grade === grade || selectedSubject === 'soroban') &&
      (selectedTrimester === 'all' || l.trimester === selectedTrimester)
  );

  // Dynamic theme-based styling classes
  const isNeutreTheme = headerTheme === 'neutre';
  const isLightTheme = headerTheme === 'light';
  const isSepiaTheme = headerTheme === 'sepia';

  const pageBgClass = isNeutreTheme || isLightTheme
    ? 'bg-[#FFFBF0] text-slate-800'
    : isSepiaTheme
    ? 'bg-[#FBF9F5] text-stone-900'
    : 'bg-[#0F172A] text-slate-100';

  const cardBgClass = isNeutreTheme || isLightTheme
    ? 'bg-white rounded-3xl border-b-4 border-slate-200 shadow-sm text-slate-800 hover:border-indigo-300 transition-all'
    : isSepiaTheme
    ? 'bg-[#F5F2EB] border-[#E7E2D7] text-stone-900 shadow-xs'
    : 'bg-[#1E293B] border-slate-700/70 text-slate-100 shadow-xl';

  const tabsContainerBgClass = isNeutreTheme || isLightTheme
    ? 'bg-white rounded-2xl border-2 border-amber-100 shadow-sm'
    : isSepiaTheme
    ? 'bg-[#FBF9F5] border-[#E7E2D7]'
    : 'bg-[#0F172A]/90 border-slate-800';

  const inactiveTabBgClass = isNeutreTheme || isLightTheme
    ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent font-bold'
    : isSepiaTheme
    ? 'bg-[#EDE8DF] text-stone-700 hover:bg-[#E2DCCF] border-[#D6CEBF]'
    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-slate-700/60';

  const footerClass = isNeutreTheme || isLightTheme
    ? 'bg-white border-t-4 border-indigo-50 text-slate-500'
    : isSepiaTheme
    ? 'bg-[#F5F2EB] border-t border-[#E7E2D7] text-stone-600'
    : 'bg-[#0B1329] border-t border-slate-800 text-slate-400';

  return (
    <div className={`min-h-screen font-sans dir-rtl antialiased selection:bg-purple-500 selection:text-white pb-20 md:pb-8 transition-colors duration-300 ${pageBgClass}`} dir="rtl">
      
      {/* Real-time DB Sync Toast Notification */}
      {realtimeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>{realtimeToast}</span>
        </div>
      )}

      {/* PWA Mobile Install Banner for Android & iOS */}
      <PwaInstallBanner />

      {/* 1. REFACTORED SAAS DASHBOARD HEADER COMPONENT WITH MULTI-THEME & CONSOLIDATED DROPDOWN */}
      <Navbar
        currentGrade={grade}
        onGradeChange={(g) => {
          setGrade(g);
          setSelectedLesson(null);
        }}
        userProfile={userProfile}
        authUser={authUser}
        isLiveConnected={isLiveConnected}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          AuthService.logout();
          setAuthUser(null);
          setUserProfile((prev) => ({
            ...prev,
            name: 'تلميذ مَسِيد',
            xp: 0,
            level: 1,
            completedLessonIds: [],
          }));
        }}
        onOpenAdminReceiptsModal={() => setIsAdminReceiptsModalOpen(true)}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenCms={() => setIsCmsActive(true)}
        onHomeClick={() => setSelectedLesson(null)}
        currentTheme={headerTheme}
        onThemeChange={(t) => setHeaderTheme(t)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">
        
        {/* Isolated Category Switcher & Sub-Subject Selector */}
        <div className="space-y-4">
          
          {/* Main Category Header Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className={`p-1.5 rounded-2xl border flex items-center gap-2 flex-wrap ${tabsContainerBgClass}`}>
              {/* Tab 1: Courses */}
              <button
                onClick={() => {
                  setMainCategory('courses');
                  if (!COURSE_SUBJECTS_LIST.some((s) => s.id === selectedSubject)) {
                    setSelectedSubject('math');
                  }
                  setSelectedLesson(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  mainCategory === 'courses'
                    ? isNeutreTheme || isLightTheme
                      ? 'bg-indigo-600 text-white shadow-md border-b-4 border-indigo-800'
                      : 'bg-purple-700 text-white shadow-md'
                    : inactiveTabBgClass
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>📚 الدروس والمواد التعليمية</span>
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {COURSE_SUBJECTS_LIST.length} مواد
                </span>
              </button>

              {/* Tab 2: Interactive Labs */}
              <button
                onClick={() => {
                  setMainCategory('labs');
                  if (!INTERACTIVE_LABS_LIST.some((s) => s.id === selectedSubject)) {
                    setSelectedSubject('arabic_conjugator');
                  }
                  setSelectedLesson(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  mainCategory === 'labs'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold border-b-4 border-amber-700'
                    : inactiveTabBgClass
                }`}
              >
                <Zap className="w-4 h-4 text-amber-950" />
                <span>⚡ المختبرات والأدوات التفاعلية</span>
                <span className="bg-slate-950/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {INTERACTIVE_LABS_LIST.length} أدوات
                </span>
              </button>

              {/* Tab 3: Official Exams */}
              <button
                onClick={() => {
                  setMainCategory('exams');
                  setSelectedSubject('exams');
                  setSelectedLesson(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  mainCategory === 'exams'
                    ? 'bg-purple-600 text-white shadow-md font-extrabold border-b-4 border-purple-900'
                    : inactiveTabBgClass
                }`}
              >
                <Award className="w-4 h-4 text-purple-200" />
                <span>📜 الامتحانات الرسمية (5AP)</span>
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {OFFICIAL_EXAMS_LIST.length} بنك
                </span>
              </button>
            </div>

            <div className="text-xs font-bold text-slate-500">
              {mainCategory === 'courses' ? (
                <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/20">
                  <span>🎓 الدروس والبرامج البيداغوجية الرسمية ({grade})</span>
                </span>
              ) : mainCategory === 'labs' ? (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  <span>🧪 الأدوات والمختبرات وتصريف الأفعال المستقلة</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-800 dark:text-purple-300 px-3 py-1.5 rounded-xl border border-purple-500/20">
                  <span>📜 بنك مواضيع امتحانات شهادة التعليم الابتدائي 5AP مع الحلول</span>
                </span>
              )}
            </div>
          </div>

          {/* Sub-Subject Selector Tabs Bar */}
          <div className={`border rounded-3xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto transition-colors duration-300 ${tabsContainerBgClass}`}>
            {(mainCategory === 'courses'
              ? COURSE_SUBJECTS_LIST
              : mainCategory === 'labs'
              ? INTERACTIVE_LABS_LIST
              : OFFICIAL_EXAMS_LIST
            ).map((subj) => {
              const IconComp = ICON_MAP[subj.icon] || BookOpen;
              const isSelected = selectedSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => handleSelectSubject(subj.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all cursor-pointer whitespace-nowrap text-xs font-bold shrink-0 ${
                    isSelected
                      ? mainCategory === 'labs'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md border-b-4 border-amber-700'
                        : mainCategory === 'exams'
                        ? 'bg-purple-600 text-white font-black shadow-md border-b-4 border-purple-900'
                        : isNeutreTheme || isLightTheme
                        ? 'bg-indigo-600 text-white font-black shadow-md border-b-4 border-indigo-800'
                        : 'bg-purple-700 text-white shadow-md border-b-4 border-purple-900'
                      : inactiveTabBgClass
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{subj.nameAr}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected View Rendering */}
        <div>
          {selectedSubject === 'arabic_conjugator' ? (
            <ArabicConjugator grade={grade} />
          ) : selectedSubject === 'french_lab' ? (
            <FrenchLanguageLab grade={grade} />
          ) : selectedSubject === 'english_lab' ? (
            <EnglishLanguageLab grade={grade} />
          ) : selectedSubject === 'soroban' ? (
            <SorobanInteractive />
          ) : selectedSubject === 'electricity' ? (
            <ElectricityLabInteractive />
          ) : selectedSubject === 'geometry' ? (
            <GeometryVisualizer grade={grade} theme={headerTheme} />
          ) : selectedSubject === 'converter' ? (
            <UnitConverter grade={grade} theme={headerTheme} />
          ) : selectedSubject === 'multiplication' ? (
            <MultiplicationTableInteractive grade={grade} />
          ) : selectedSubject === 'exams' ? (
            <ExamsViewer />
          ) : selectedLesson ? (
            <LessonViewer
              lesson={selectedLesson}
              allLessons={currentLessons}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
              onBack={() => setSelectedLesson(null)}
              onCompleteQuiz={handleCompleteQuiz}
              grade={grade}
              subjectId={selectedSubject}
              trimester={selectedTrimester}
              onHomeClick={() => {
                setSelectedLesson(null);
                setMainCategory('courses');
              }}
            />
          ) : (
            /* Lessons Cards Grid */
            <div className="space-y-6">
              {/* Course Breadcrumb */}
              <CourseBreadcrumb
                grade={grade}
                subjectId={selectedSubject}
                trimester={selectedTrimester}
                onHomeClick={() => {
                  setSelectedLesson(null);
                  setMainCategory('courses');
                }}
                onSubjectClick={() => setSelectedLesson(null)}
                onTrimesterClick={(t) => setSelectedTrimester(t)}
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black font-sans">
                    دروس ومحتوى مادة {SUBJECTS_LIST.find((s) => s.id === selectedSubject)?.nameAr} - {grade}
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    برنامج وزارة التربية الوطنية الجزائرية (1AP - 5AP)
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${(isLightTheme || isNeutreTheme || isSepiaTheme) ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-purple-300 bg-purple-500/10 border-purple-500/30'}`}>
                  عدد الدروس: {currentLessons.length}
                </span>
              </div>

              {/* Trimester Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                <span className="opacity-70 shrink-0">تصفية حسب الفصل:</span>
                <button
                  onClick={() => setSelectedTrimester('all')}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                    selectedTrimester === 'all'
                      ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                      : 'bg-purple-500/10 text-purple-800 border-purple-200 hover:bg-purple-500/20'
                  }`}
                >
                  🌟 جميع الفصول
                </button>
                <button
                  onClick={() => setSelectedTrimester(1)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                    selectedTrimester === 1
                      ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                      : 'bg-purple-500/10 text-purple-800 border-purple-200 hover:bg-purple-500/20'
                  }`}
                >
                  1️⃣ الفصل الأول
                </button>
                <button
                  onClick={() => setSelectedTrimester(2)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                    selectedTrimester === 2
                      ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                      : 'bg-purple-500/10 text-purple-800 border-purple-200 hover:bg-purple-500/20'
                  }`}
                >
                  2️⃣ الفصل الثاني
                </button>
                <button
                  onClick={() => setSelectedTrimester(3)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                    selectedTrimester === 3
                      ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                      : 'bg-purple-500/10 text-purple-800 border-purple-200 hover:bg-purple-500/20'
                  }`}
                >
                  3️⃣ الفصل الثالث
                </button>
              </div>

              {currentLessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentLessons.map((lesson) => {
                    const isCompleted = userProfile.completedLessonIds.includes(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`rounded-3xl border p-5 transition-all cursor-pointer space-y-4 hover:-translate-y-0.5 ${cardBgClass}`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${(isLightTheme || isNeutreTheme || isSepiaTheme) ? 'text-purple-800 bg-purple-50 border-purple-100' : 'text-purple-300 bg-purple-500/15 border-purple-500/30'}`}>
                              {lesson.categoryAr}
                            </span>
                            {lesson.trimester && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30">
                                الفصل {lesson.trimester}
                              </span>
                            )}
                          </div>
                          {isCompleted && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                              ✓ مكتمل
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-base font-extrabold font-sans">{lesson.titleAr}</h3>
                          <p className="text-xs opacity-75 mt-1 line-clamp-2 leading-relaxed">
                            {lesson.summaryAr}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/20 text-xs font-bold text-purple-400">
                          <span>بدء الدورة والتمارين التفاعلية</span>
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`border rounded-3xl p-12 text-center space-y-3 ${cardBgClass}`}>
                  <BookOpen className="w-12 h-12 opacity-40 mx-auto" />
                  <h3 className="text-base font-extrabold">لا توجد دروس حالياً لهذه المرحلة الحالية</h3>
                  <p className="text-xs opacity-70 max-w-md mx-auto">
                    يمكنك تجربة دروس الرياضيات، الحساب الذهني بالسوروبان، أو خوض امتحانات شهادة التعليم الابتدائي (5AP) حالياً.
                  </p>
                  <button
                    onClick={() => handleSelectSubject('math')}
                    className="px-4 py-2 bg-purple-700 text-white font-bold text-xs rounded-xl hover:bg-purple-800 cursor-pointer"
                  >
                    الانتقال لدروس الرياضيات
                  </button>
                </div>
              )}

              {/* Tools Section Bottom Bar */}
              <div className={`rounded-2xl p-6 border space-y-4 ${cardBgClass}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 block uppercase tracking-wider">INTERACTIVE MATH SUITE</span>
                    <h3 className="text-base font-extrabold font-sans">الأدوات التفاعلية للمرحلة الابتدائية</h3>
                  </div>
                  <span className="text-xs opacity-70">سريعة الاستجابة وبدون حماية أو تشفير خارجي</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UnitConverter theme={headerTheme} />
                  <GeometryVisualizer theme={headerTheme} />
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className={`py-6 mt-12 transition-colors duration-300 ${footerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold">مَسِيد Mssid DZ</span>
            <span className="opacity-75">• المنهاج الرسمي لوزارة التربية الوطنية الجزائرية (Spring Boot Architecture)</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAuditModalOpen(true)} className="hover:text-emerald-400 cursor-pointer">
              تقرير التدقيق الفني (Audit Report)
            </button>
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-amber-400 cursor-pointer">
              المعلم مسيد (Gemini AI)
            </button>
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AiTutorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        grade={grade}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        authUser={authUser}
        onResetProgress={handleResetProgress}
        onUpdateName={handleUpdateProfileName}
        onRefreshFromDb={handleRefreshProfileFromDb}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setAuthUser(user)}
      />

      <AdminReceiptsManager
        isOpen={isAdminReceiptsModalOpen}
        onClose={() => setIsAdminReceiptsModalOpen(false)}
        onReceiptUpdated={() => setAuthUser(AuthService.getCurrentUser())}
      />

      <MobileAppSimulator
        isOpen={isMobileSimulatorOpen}
        onClose={() => setIsMobileSimulatorOpen(false)}
        currentGrade={grade}
        onGradeChange={(newGrade) => setGrade(newGrade)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Dedicated Native Mobile Bottom Navigation Bar for Mobile Viewport Users */}
      <MobileBottomNav
        selectedSubject={selectedSubject}
        setSelectedSubject={(subj) => handleSelectSubject(subj)}
        onClearSelectedLesson={() => setSelectedLesson(null)}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        theme={headerTheme}
      />
    </div>
  );
}
