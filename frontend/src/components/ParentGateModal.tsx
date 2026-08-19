import React, { useEffect, useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

// COPPA / Google Play Families-style Parent Gate: a simple arithmetic check before a sensitive
// action (purchase, external link, account deletion) — not meant to be unsolvable by a child, just
// a deliberate friction step an accidental tap can't clear. See the "Diagnostic de Lancement"
// roadmap's J-3→J-1 phase for the product decision behind this.
export const ParentGateModal: React.FC<ParentGateModalProps> = ({ isOpen, onClose, onVerified }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setA(10 + Math.floor(Math.random() * 40));
      setB(10 + Math.floor(Math.random() * 40));
      setAnswer('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(answer) === a + b) {
      onVerified();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans dir-rtl" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-extrabold text-white">بوابة الوالدين</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            هذا الإجراء مخصص لولي الأمر. للمتابعة، يرجى حل العملية الحسابية التالية:
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
            <span dir="ltr" className="text-2xl font-black text-white font-mono">
              {a} + {b} = ?
            </span>
          </div>
          <input
            type="number"
            autoFocus
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="اكتب الناتج هنا"
            dir="ltr"
            className="w-full text-center bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white text-lg font-bold rounded-xl px-3 py-2.5"
          />
          {error && <p className="text-xs text-rose-400 text-center font-bold">إجابة غير صحيحة، حاول مجدداً.</p>}
          <button
            type="submit"
            disabled={!answer}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer"
          >
            متابعة
          </button>
        </form>
      </div>
    </div>
  );
};
