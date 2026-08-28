import React, { useEffect, useState } from 'react';
import { Mail, RefreshCw, Search, AlertTriangle, Lightbulb, Bug } from 'lucide-react';
import { springBootApi } from '../../services/springBootApi';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  type: 'suggestion' | 'bug' | 'concern' | string;
  message: string;
  submittedAt: string;
}

const TYPE_META: Record<string, { labelAr: string; icon: React.FC<{ className?: string }>; className: string }> = {
  suggestion: { labelAr: 'اقتراح', icon: Lightbulb, className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  bug: { labelAr: 'مشكلة تقنية', icon: Bug, className: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  concern: { labelAr: 'استفسار / قلق', icon: AlertTriangle, className: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
};

// Closes the gap found during the CMS/roles audit: ContactController's public POST /api/v1/contact
// (the "نتواصل معك" form) had no read path anywhere in the app — submissions landed in the DB with
// no way to see them short of a direct SQL query. This is the missing GET side.
export const ContactMessagesModule: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await springBootApi.getContactMessages();
      if (res.error) {
        setError(res.error);
      } else {
        setMessages((res.data as ContactMessage[]) || []);
      }
    } catch {
      setError('تعذر الاتصال بالخادم لجلب رسائل التواصل.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (filterType !== 'ALL' && m.type !== filterType) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 dir-rtl font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">رسائل "نتواصل معك" ({messages.length})</h2>
            <p className="text-xs text-slate-300 mt-1">
              الرسائل المرسلة عبر نموذج التواصل في التطبيق — اقتراحات، مشاكل تقنية، واستفسارات من الزوار والمستخدمين.
            </p>
          </div>
        </div>

        <button
          onClick={loadMessages}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs min-h-[var(--hit)] px-4 rounded-xl shadow-md transition-all cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'جاري التحميل...' : 'تحديث القائمة'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {['ALL', 'suggestion', 'bug', 'concern'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 min-h-[var(--hit)] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterType === t ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t === 'ALL' ? `الكل (${messages.length})` : TYPE_META[t]?.labelAr || t}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو البريد الإلكتروني أو نص الرسالة..."
            className="w-full pr-9 pl-3 min-h-[var(--hit)] bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading && messages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">جاري تحميل رسائل التواصل...</div>
        ) : error ? (
          <div className="p-4">
            <div className="bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-bold p-4 rounded-2xl">{error}</div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">لا توجد رسائل تواصل بهذه المعايير.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredMessages.map((m) => {
              const meta = TYPE_META[m.type] || { labelAr: m.type, icon: Mail, className: 'bg-slate-700/40 text-slate-300 border-slate-600' };
              const TypeIcon = meta.icon;
              return (
                <div key={m.id} className="p-4 space-y-2 hover:bg-slate-950/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-sm">{m.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{m.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] border ${meta.className}`}>
                        <TypeIcon className="w-3 h-3" />
                        <span>{meta.labelAr}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">{m.submittedAt}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{m.message}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
