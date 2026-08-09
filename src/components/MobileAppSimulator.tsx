import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  RotateCw,
  Wifi,
  Battery,
  Download,
  Sparkles,
  BookOpen,
  Home,
  Grid,
  Bot,
  User,
  Flame,
  Award,
  ChevronLeft,
  Volume2,
  Play,
  Pause,
  Send,
  DownloadCloud,
  CheckCircle2,
  Moon,
  Sun,
  ShieldCheck,
  GraduationCap,
  Calculator,
  Search,
  ArrowRight
} from 'lucide-react';
import { PrimaryGrade, SubjectId } from '../types';
import { MssidLogo } from './MssidLogo';
import { springBootApi } from '../services/springBootApi';

interface MobileAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  currentGrade: PrimaryGrade;
  onGradeChange: (grade: PrimaryGrade) => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  isOpen,
  onClose,
  currentGrade,
  onGradeChange,
}) => {
  const [deviceType, setDeviceType] = useState<'iphone' | 'android' | 'tablet'>('android');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [carrier, setCarrier] = useState<'Mobilis 4G' | 'Djezzy 4G' | 'Ooredoo 4G' | 'Wi-Fi 5G'>('Mobilis 4G');
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'lessons' | 'ai' | 'offline' | 'profile'>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // AI Chat Mobile State
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'أهلاً بك في تطبيق مَسيد DZ للمحمول! أنا المعلم الذكي، كيف يمكنني مساعدتك اليوم في الدروس أو التمارين؟',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // APK / Download state
  const [isApkDownloaded, setIsApkDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (!isOpen) return null;

  const handleAiSend = async () => {
    if (!aiQuery.trim() || isAiLoading) return;

    const userText = aiQuery;
    setAiQuery('');
    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsAiLoading(true);

    try {
      const response = await springBootApi.askGeminiExplain({
        topic: 'تعليم ابتدائي جزائري',
        question: userText,
        grade: currentGrade,
      });

      const reply = response.data?.text || response.error || 'ممتاز! هذا سؤال جيد. استمر في الاجتهاد!';
      setAiChatHistory((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch {
      setAiChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: 'ممتاز! تحضير موفق للدروس وفق المنهاج الوزاري الجزائري.' },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownloadApk = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsApkDownloaded(true);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Dimensions based on device and orientation
  const getContainerDimensions = () => {
    if (orientation === 'landscape') {
      return 'w-[680px] h-[360px]';
    }
    if (deviceType === 'tablet') {
      return 'w-[420px] h-[640px]';
    }
    return 'w-[340px] h-[660px]';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100">
        
        {/* Top Header Controls Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MssidLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">تطبيق الهاتف المحمول Mssid DZ Mobile</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Android & iOS Native PWA
                </span>
              </div>
              <p className="text-xs text-slate-400">محاكي هاتف ذكي تفاعلي 100% متوافق مع كافة الشاشات والأجهزة</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Device selector */}
            <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700/60 text-xs">
              <button
                onClick={() => setDeviceType('android')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  deviceType === 'android' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setDeviceType('iphone')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  deviceType === 'iphone' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  deviceType === 'tablet' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>لوحة إلكترونية (Tablet)</span>
              </button>
            </div>

            {/* Carrier selector */}
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value as any)}
              className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Mobilis 4G">موبيليس Mobilis 4G</option>
              <option value="Djezzy 4G">جيزي Djezzy 4G</option>
              <option value="Ooredoo 4G">أوريدو Ooredoo 4G</option>
              <option value="Wi-Fi 5G">شبكة Wi-Fi الجزائر</option>
            </select>

            {/* Orientation Toggle */}
            <button
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-all"
              title="تدوير الشاشة"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 rounded-xl transition-all border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body with Phone Frame + Side Controls */}
        <div className="p-6 flex flex-col lg:flex-row items-center justify-center gap-8 bg-slate-900/90 min-h-[620px]">
          
          {/* Simulated Mobile Phone Frame */}
          <div className="relative group transition-all duration-300">
            {/* Phone Bezel */}
            <div
              className={`transition-all duration-300 bg-slate-950 p-3 rounded-[42px] border-4 border-slate-700 shadow-2xl shadow-emerald-950/40 relative flex flex-col ${getContainerDimensions()}`}
            >
              {/* Notch / Speaker Hole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-xl z-30 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Mobile Screen Container */}
              <div
                className={`w-full h-full rounded-[30px] overflow-hidden flex flex-col relative transition-colors duration-200 ${
                  isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
                }`}
              >
                {/* Mobile Status Bar */}
                <div className={`px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-bold z-20 select-none ${
                  isDarkMode ? 'bg-slate-900/80 text-slate-300' : 'bg-emerald-800 text-white'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span>09:41</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-tight opacity-90">{carrier}</span>
                    <Wifi className="w-3 h-3" />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px]">98%</span>
                      <Battery className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Mobile App Header */}
                <div className={`px-4 py-2.5 flex items-center justify-between border-b select-none ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-emerald-700 text-white border-emerald-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <MssidLogo size="sm" />
                    <div>
                      <h3 className="font-extrabold text-sm leading-tight">مَسيد DZ Mobile</h3>
                      <p className="text-[10px] opacity-80">
                        {currentGrade} • الجزائر
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                      title="الوضع الليلك / النهار"
                    >
                      {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Mobile Screen Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
                  
                  {/* TAB 1: HOME */}
                  {activeMobileTab === 'home' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {/* Streak & XP Card */}
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                            <Flame className="w-5 h-5 text-yellow-200 fill-yellow-200" />
                          </div>
                          <div>
                            <p className="text-[10px] opacity-90">سلسلة المواظبة اليومية</p>
                            <p className="font-black text-sm">5 أيام متتالية! 🔥</p>
                          </div>
                        </div>
                        <div className="bg-white/20 px-2.5 py-1 rounded-xl text-[11px] font-extrabold backdrop-blur-xs">
                          320 XP
                        </div>
                      </div>

                      {/* Grade Quick Selector Carousel */}
                      <div>
                        <p className={`text-[11px] font-bold mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          المستوى الدراسي (الابتدائي):
                        </p>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {(['1AP', '2AP', '3AP', '4AP', '5AP'] as PrimaryGrade[]).map((g) => (
                            <button
                              key={g}
                              onClick={() => onGradeChange(g)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
                                currentGrade === g
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : isDarkMode
                                  ? 'bg-slate-800 text-slate-300'
                                  : 'bg-white border border-slate-200 text-slate-700'
                              }`}
                            >
                              السنة {g}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Audio Lesson Player */}
                      <div className={`p-3 rounded-2xl border transition-all ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-2xs'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                            الدرس الصوتي اليومي
                          </span>
                          <span className="text-[10px] opacity-60">03:45 دقيقة</span>
                        </div>
                        <p className="font-bold text-xs mb-2">شرح سورة العاديات وتفسير الآيات (3AP)</p>
                        
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                          <button
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all"
                          >
                            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div className="flex-1">
                            <div className="h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full bg-emerald-500 transition-all ${isPlayingAudio ? 'w-2/3' : 'w-1/4'}`} />
                            </div>
                            <p className="text-[9px] opacity-70 mt-1">تلاوة صوتية تفاعلية بصوت واضح للأطفال</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Interactive Tool Grid */}
                      <div>
                        <p className={`text-[11px] font-bold mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          الورشات والأنشطة المفتوحة:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer hover:border-emerald-500 transition-all ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                              <Calculator className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-[11px]">معداد السوروبان</p>
                              <p className="text-[9px] opacity-60">الحساب الذهني</p>
                            </div>
                          </div>

                          <div className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer hover:border-emerald-500 transition-all ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}>
                            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-[11px]">تصريف الأفعال</p>
                              <p className="text-[9px] opacity-60">لغة عربية</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LESSONS & EXAMS */}
                  {activeMobileTab === 'lessons' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm">برنامج الدروس والاختبارات</h4>
                        <span className="text-[10px] text-emerald-600 font-bold">{currentGrade}</span>
                      </div>

                      {['الرياضيات', 'اللغة العربية', 'التربية الإسلامية', 'العلوم والتكنولوجيا', 'التاريخ والجغرافيا'].map((subject, idx) => (
                        <div
                          key={subject}
                          className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                              idx === 0 ? 'bg-emerald-100 text-emerald-700' :
                              idx === 1 ? 'bg-indigo-100 text-indigo-700' :
                              idx === 2 ? 'bg-amber-100 text-amber-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              0{idx + 1}
                            </div>
                            <div>
                              <p className="font-bold text-xs">{subject}</p>
                              <p className="text-[9px] opacity-60">12 درساً • ملخصات + تمارين محلولة</p>
                            </div>
                          </div>
                          <ChevronLeft className="w-4 h-4 opacity-50" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: AI TUTOR CHAT */}
                  {activeMobileTab === 'ai' && (
                    <div className="flex flex-col h-[380px] justify-between animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span className="font-bold text-xs">المعلم الذكي - المساعد الدراسي Mssid AI</span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 scrollbar-thin">
                        {aiChatHistory.map((m, idx) => (
                          <div
                            key={idx}
                            className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-2xs ${
                                m.sender === 'user'
                                  ? 'bg-emerald-600 text-white rounded-br-xs'
                                  : isDarkMode
                                  ? 'bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700'
                                  : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200'
                              }`}
                            >
                              {m.text}
                            </div>
                          </div>
                        ))}
                        {isAiLoading && (
                          <div className="flex justify-end">
                            <div className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2 rounded-2xl text-[10px] animate-pulse">
                              المعلم الذكي يفكر... 🧠
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input Box */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                          placeholder="اطرح سؤالاً في الدرس..."
                          className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                            isDarkMode
                              ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500'
                              : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                        <button
                          onClick={handleAiSend}
                          disabled={isAiLoading}
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs active:scale-95 transition-all disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: OFFLINE & APK DOWNLOAD */}
                  {activeMobileTab === 'offline' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="p-3 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <DownloadCloud className="w-5 h-5 text-emerald-300" />
                          <h4 className="font-extrabold text-xs">تثبيت التطبيق دون إنترنت (APK / PWA)</h4>
                        </div>
                        <p className="text-[10px] opacity-90 leading-normal">
                          حمل دروس السنة {currentGrade} واستخدم التطبيق في أرجاء الجزائر حتى في حال انقطاع الشبكة!
                        </p>
                      </div>

                      {/* Download Simulator */}
                      <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="font-bold text-xs mb-1">تطبيق Mssid DZ Android (حزمة APK)</p>
                        <p className="text-[10px] opacity-60 mb-3">الحجم: 14.2 ميغابايت • متوافق مع Android 6.0+</p>

                        {isApkDownloaded ? (
                          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-[11px] font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>تم تثبيت التطبيق بنجاح! جاهز للعمل بدون إنترنت.</span>
                          </div>
                        ) : (
                          <div>
                            {downloadProgress > 0 && downloadProgress < 100 && (
                              <div className="mb-2">
                                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 transition-all duration-300"
                                    style={{ width: `${downloadProgress}%` }}
                                  />
                                </div>
                                <p className="text-[9px] text-left font-mono opacity-70 mt-1">{downloadProgress}%</p>
                              </div>
                            )}

                            <button
                              onClick={handleDownloadApk}
                              disabled={downloadProgress > 0 && downloadProgress < 100}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                            >
                              <Download className="w-4 h-4" />
                              <span>تحميل وتثبيت ملف APK للجزائر</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={`p-3 rounded-2xl border text-[10px] space-y-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <p className="font-bold text-emerald-600">مميزات الحزمة المباشرة:</p>
                        <p>✓ مزامنة البيانات تلقائياً عند الاتصال بالشبكة</p>
                        <p>✓ حماية كاملة مشفرة متوافقة مع Spring Boot JWT</p>
                        <p>✓ تصفح مجاني لكافة الدروس الأساسية</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Mobile Bottom Navigation Bar */}
                <div className={`px-2 py-1.5 border-t flex items-center justify-around select-none z-20 ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <button
                    onClick={() => setActiveMobileTab('home')}
                    className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                      activeMobileTab === 'home' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-[9px]">الرئيسية</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileTab('lessons')}
                    className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                      activeMobileTab === 'lessons' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[9px]">الدروس</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileTab('ai')}
                    className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                      activeMobileTab === 'ai' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span className="text-[9px]">الذكاء الاصطناعي</span>
                  </button>

                  <button
                    onClick={() => setActiveMobileTab('offline')}
                    className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                      activeMobileTab === 'offline' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'
                    }`}
                  >
                    <DownloadCloud className="w-4 h-4" />
                    <span className="text-[9px]">بدون إنترنت</span>
                  </button>
                </div>

                {/* Home Indicator Bar at the very bottom */}
                <div className={`py-1 flex justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
                  <div className="w-24 h-1 bg-slate-400/50 rounded-full" />
                </div>

              </div>
            </div>
          </div>

          {/* Side Info & Native Android / PWA Instructions Card */}
          <div className="flex-1 max-w-md space-y-4 text-right">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>خصائص التطبيق المحمول (Mssid DZ Native)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                تم تطوير تطبيق مَسيد DZ بالكامل بتقنيات الـ PWA و Android WebView لتزويد تلاميذ وأولياء الأمور في كامل ولايات الجزائر بتجربة سلسة وسريعة جداً.
              </p>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">مناسب للأطفال والتلاميذ:</span>
                    <p className="text-slate-400 text-[11px]">واجهة عربية بسيطة مع ألوان مريحة ومعدلات تكبير مثالية لشاشات الهواتف.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <DownloadCloud className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">وضع العمل بدون إنترنت (Offline First):</span>
                    <p className="text-slate-400 text-[11px]">يخزن الدروس والمقتطفات الصوتية محلياً لاستمرار التصفح دون انقطاع.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">ربط مع Spring Boot Backend:</span>
                    <p className="text-slate-400 text-[11px]">اتصال آمن عبر JWT Token و Rate Limiting لمنع الضغط وزيادة السرعة.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button to close simulator or test */}
            <div className="flex items-center justify-between gap-3 bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-2xl">
              <div>
                <p className="font-bold text-xs text-emerald-300">جاهز للتجربة التفاعلية؟</p>
                <p className="text-[11px] text-slate-400">يمكنك التفاعل مباشرة داخل شاشة الهاتف بالأعلى!</p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
              >
                العودة للموقع
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
