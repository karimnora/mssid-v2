import React, { useState } from 'react';
import { AUDIT_DATA } from '../data/auditData';
import { X, ShieldCheck, AlertTriangle, Bug, Layers, Zap, Trophy, Code2, CheckCircle2 } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const [selectedAuditTab, setSelectedAuditTab] = useState<string>('bugs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 dir-rtl" dir="rtl">
      <div className="bg-white border border-slate-300 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - High Density Slate Dark Style */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight font-sans">
                  تقرير التدقيق الفني الشامل لمشروع Mssid DZ
                </h2>
                <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/20">
                  github.com/karimnora/mssid-dz
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                تحليل الأخطاء والهندسة المعمارية والأمان والأداء وخطة التوسع بدون تعديل كود
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Tabs */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {AUDIT_DATA.map((section) => {
            const isActive = selectedAuditTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setSelectedAuditTab(section.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{section.titleFr}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${section.badgeColor}`}>
                  {section.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {AUDIT_DATA.filter((sec) => sec.id === selectedAuditTab).map((sec) => (
            <div key={sec.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 font-sans">{sec.titleAr}</h3>
                <span className="text-xs font-bold text-slate-500 font-mono">[{sec.titleFr}]</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          item.impact === 'critical' ? 'bg-rose-500 animate-ping' : item.impact === 'high' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <h4 className="font-bold text-sm text-slate-900">{item.titleAr}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-600">({item.titleFr})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          item.status === 'fixed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.status === 'fixed' ? 'تم معالجته' : 'مخطط'}</span>
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.descriptionAr}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* No-code Extensible JSON Code Demonstration */}
          {selectedAuditTab === 'scalable-schema' && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-amber-400 border-b border-slate-800 pb-2">
                <span>// نموذج إضافة درس جديد تلقائياً بدون تعديل كود: /src/data/coursesData.ts</span>
                <Code2 className="w-4 h-4" />
              </div>
              <pre className="text-emerald-300 text-[11px] overflow-x-auto leading-relaxed">
{`{
  id: "math-1ap-addition",
  grade: "1AP",
  subject: "math",
  categoryAr: "الأعداد والحساب",
  titleAr: "الجمع البسيط بالأرقام والأشكال",
  summaryAr: "تعلم تجميع الكريات والأرقام الأولى من 1 إلى 9.",
  rulesAr: [
    "عد العناصر معاً لحساب المجموع الإجمالي.",
    "استخدم خرزات السوروبان الأحاديّة للتثبيت."
  ],
  interactiveTool: "soroban",
  quiz: [
    {
      id: "q1",
      questionAr: "كم يساوي 3 + 2؟",
      options: [
        { id: "a", textAr: "5", isCorrect: true },
        { id: "b", textAr: "6", isCorrect: false }
      ]
    }
  ]
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>نظام معمارية المنهاج الجزائري المكتمل v1.0.4</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق التقرير
          </button>
        </div>
      </div>
    </div>
  );
};
