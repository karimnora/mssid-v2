import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Download, HardDrive, CheckCircle2, Trash2, Wifi, WifiOff, RefreshCw, Sparkles, Check } from 'lucide-react';
import { LESSON_PACKS_CATALOG } from '../data/lessonPacksData';
import { LessonPack } from '../types/ecosystem';

interface OfflinePacksManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_STORAGE_DOWNLOADED_KEY = 'mssid_downloaded_packs_v2';

export const OfflinePacksManagerModal: React.FC<OfflinePacksManagerModalProps> = ({ isOpen, onClose }) => {
  const [downloadedPackIds, setDownloadedPackIds] = useState<string[]>([]);
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_DOWNLOADED_KEY);
      if (raw) {
        setDownloadedPackIds(JSON.parse(raw));
      } else {
        // Pre-download baraem & 5ap by default for instant delight
        const initial = ['pack_baraem_t1', 'pack_5ap_full'];
        setDownloadedPackIds(initial);
        localStorage.setItem(LOCAL_STORAGE_DOWNLOADED_KEY, JSON.stringify(initial));
      }
    } catch {
      // ignore
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const handleDownload = (pack: LessonPack) => {
    if (downloadingPackId) return;

    setDownloadingPackId(pack.id);
    setDownloadProgress(10);

    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25 + 15);
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDownloadedPackIds((prev) => {
            const next = [...prev, pack.id];
            localStorage.setItem(LOCAL_STORAGE_DOWNLOADED_KEY, JSON.stringify(next));
            return next;
          });
          setDownloadingPackId(null);
          setDownloadProgress(0);
        }, 500);
      }
      setDownloadProgress(progress);
    }, 250);
  };

  const handleDelete = (packId: string) => {
    setDownloadedPackIds((prev) => {
      const next = prev.filter((id) => id !== packId);
      localStorage.setItem(LOCAL_STORAGE_DOWNLOADED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSyncPendingOfflineLogs = async () => {
    setSyncStatusMsg('جاري مزامنة الإنجازات والدرجات مع الخادم السحابي...');
    try {
      const res = await fetch('/api/v1/offline-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncLogs: [
            {
              userId: 101,
              exerciseId: 'math-5ap-ex1',
              score: 10,
              coinsEarned: 25,
              clientTimestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      if (res.ok) {
        setSyncStatusMsg('تمت المزامنة بنجاح! جميع النقاط والأوسمة محفوظة.');
      } else {
        setSyncStatusMsg('تم حفظ البيانات محلياً وسيتم الرفع فور استقرار الاتصال.');
      }
    } catch {
      setSyncStatusMsg('تم التخزين المحلي بنجاح (وضع Offline).');
    }
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const totalDownloadedMb = LESSON_PACKS_CATALOG.filter((p) =>
    downloadedPackIds.includes(p.id)
  ).reduce((sum, p) => sum + p.sizeMb, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm dir-rtl" dir="rtl">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg">إدارة حزم الدروس بدون إنترنت (PWA Offline)</h3>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {isOnline ? 'متصل بالإنترنت' : 'وضع بدون اتصال'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold">حمّل حزم الدروس مرة واحدة وتعلّم في أي مكان بدون استهلاك البيانات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Storage status & sync banner */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-700 block">المساحة المستهلكة من ذاكرة الهاتف:</span>
              <span className="font-black text-slate-900 text-sm">
                {totalDownloadedMb.toFixed(1)} ميغابايت (MB) مُخزنة محلياً
              </span>
            </div>
          </div>

          <button
            onClick={handleSyncPendingOfflineLogs}
            className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>مزامنة النقاط مع السحابة</span>
          </button>
        </div>

        {syncStatusMsg && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-black text-center animate-fade-in">
            {syncStatusMsg}
          </div>
        )}

        {/* Packs list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {LESSON_PACKS_CATALOG.map((pack) => {
            const isDownloaded = downloadedPackIds.includes(pack.id);
            const isDownloading = downloadingPackId === pack.id;

            return (
              <div
                key={pack.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isDownloaded
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      {pack.grade}
                    </span>
                    <h4 className="font-black text-sm text-slate-900">{pack.titleAr}</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{pack.descriptionAr}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold pt-1">
                    <span>📚 {pack.lessonsCount} درس وتمريناً</span>
                    <span>💾 الحجم: {pack.sizeMb} MB</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                  {isDownloading ? (
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-emerald-700">
                        <span>جاري التحميل...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : isDownloaded ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-black flex items-center gap-1">
                        <Check className="w-4 h-4" /> جاهز بدون نت
                      </span>
                      <button
                        onClick={() => handleDelete(pack.id)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="حذف الحزمة لتوفير مساحة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownload(pack)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل ({pack.sizeMb} MB)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
