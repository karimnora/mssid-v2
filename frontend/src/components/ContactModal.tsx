import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, AlertTriangle } from 'lucide-react';
import { springBootApi } from '../services/springBootApi';
import { AuthUser } from '../types/auth';
import { Button } from './ui';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser?: AuthUser | null;
}

type ContactType = 'suggestion' | 'bug' | 'concern';

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  suggestion: '💡 اقتراح',
  bug: '🐞 الإبلاغ عن مشكلة',
  concern: '⚠️ استفسار أو قلق',
};

// Simple "contact us / suggestions" form — posts to POST /api/v1/contact (persisted server-side, see
// ContactController.java). Reachable from the app footer and the profile dropdown menu (Navbar.tsx).
export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, authUser }) => {
  const [name, setName] = useState(authUser?.nom || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [type, setType] = useState<ContactType>('suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const canSubmit = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0 && !isSubmitting;

  const handleClose = () => {
    setSubmitState('idle');
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitState('idle');
    try {
      const res = await springBootApi.submitContact({ name: name.trim(), email: email.trim(), type, message: message.trim() });
      if (res.error) throw new Error(res.error);
      setSubmitState('success');
      setMessage('');
    } catch {
      setSubmitState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 dir-rtl" dir="rtl">
      <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold font-sans">تواصل معنا</h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">اقتراحاتك وملاحظاتك تساعدنا على تحسين مَسِيد DZ</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {submitState === 'success' ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900">شكراً لك! تم إرسال رسالتك بنجاح.</h3>
              <p className="text-sm text-slate-700">سنقوم بمراجعتها في أقرب وقت ممكن.</p>
              <Button variant="primary" onClick={handleClose}>إغلاق</Button>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">الاسم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك الكامل"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">البريد الإلكتروني (أو بريد ولي الأمر)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">نوع الرسالة</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CONTACT_TYPE_LABELS) as ContactType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`min-h-11 px-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        type === t
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {CONTACT_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">رسالتك</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب اقتراحك أو استفسارك هنا..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {submitState === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>تعذّر إرسال الرسالة. تحقق من اتصالك بالإنترنت وحاول مجدداً.</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {submitState !== 'success' && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0">
            <Button variant="primary" fullWidth icon={<Send className="w-4 h-4" />} disabled={!canSubmit} loading={isSubmitting} onClick={handleSubmit}>
              إرسال الرسالة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
