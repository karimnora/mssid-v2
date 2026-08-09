import React, { useState, useEffect } from 'react';
import { PaymentReceipt, AuthUser, UserRole } from '../types/auth';
import { AuthService } from '../services/authService';
import { X, ShieldCheck, CheckCircle2, XCircle, Clock, Search, Eye, Filter, Sparkles, Image, Users, UserCheck, ShieldAlert, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReceiptUpdated: () => void;
}

export const AdminReceiptsManager: React.FC<Props> = ({ isOpen, onClose, onReceiptUpdated }) => {
  const [activeTab, setActiveTab] = useState<'RECEIPTS' | 'USERS'>('RECEIPTS');
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => AuthService.getReceipts());
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rejectionReason, setRejectionReason] = useState<string>('صورة الوصل غير واضحة أو الرقم المرجعي غير متطابق');

  // User RBAC Management State
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'USERS') {
      loadUsers();
    }
  }, [isOpen, activeTab]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await AuthService.getAllUsersAsync();
      setUsers(list);
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  if (!isOpen) return null;

  const reloadReceipts = () => {
    const updated = AuthService.getReceipts();
    setReceipts(updated);
    onReceiptUpdated();
  };

  const handleApprove = (id: number) => {
    AuthService.verifyReceipt(id, true);
    reloadReceipts();
    if (selectedReceipt && selectedReceipt.id === id) {
      setSelectedReceipt(null);
    }
  };

  const handleReject = (id: number) => {
    AuthService.verifyReceipt(id, false, rejectionReason);
    reloadReceipts();
    if (selectedReceipt && selectedReceipt.id === id) {
      setSelectedReceipt(null);
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setRoleMessage(null);
    const ok = await AuthService.updateUserRoleAsync(userId, newRole);
    if (ok) {
      setRoleMessage(`تم تعديل الدور بنجاح إلى ${newRole}`);
      setTimeout(() => setRoleMessage(null), 3000);
      loadUsers();
    } else {
      setRoleMessage('حدث خطأ أثناء تعديل الدور');
    }
  };

  const filteredReceipts = receipts.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (u.nom && u.nom.toLowerCase().includes(q)) || (u.email && u.email.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden dir-rtl" dir="rtl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black font-sans text-white flex items-center gap-2">
                <span>لوحة تحكم المشرف والربط الآمن للمستخدمين - mssid dz</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  ROLE_ADMIN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                إدارة أمنية متكاملة للمستخدمين، الصلاحيات (RBAC)، والمصادقة على اشتراكات بريدي موب
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2">
          <button
            onClick={() => setActiveTab('RECEIPTS')}
            className={`px-5 py-3 text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'RECEIPTS'
                ? 'border-amber-400 text-amber-300 bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>معالجة وصولات الدفع ({receipts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-5 py-3 text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'USERS'
                ? 'border-purple-500 text-purple-300 bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>إدارة حسابات المستخدمين والصلاحيات (RBAC)</span>
          </button>
        </div>

        {activeTab === 'RECEIPTS' ? (
          <>
            {/* Filter Toolbar */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-4 h-4 text-purple-400" />
                <span>فلترة الوصولات:</span>
              </span>
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStatus === 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                جميع الوصولات ({receipts.length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING_VERIFICATION')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStatus === 'PENDING_VERIFICATION' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                قيد الانتظار ({receipts.filter((r) => r.status === 'PENDING_VERIFICATION').length})
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterStatus === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                }`}
              >
                المقبولة ({receipts.filter((r) => r.status === 'APPROVED').length})
              </button>
            </div>

            {/* Table & Details Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto flex-1 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800">
              {/* List View */}
              <div className="p-4 space-y-3 overflow-y-auto">
                {filteredReceipts.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">لا يوجد وصولات مسجلة بهذه الحالة.</div>
                ) : (
                  filteredReceipts.map((item) => {
                    const isSelected = selectedReceipt?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedReceipt(item)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-purple-900/40 border-purple-500 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-white">{item.userName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              item.status === 'PENDING_VERIFICATION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : item.status === 'APPROVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex justify-between items-center">
                          <span>طريقة الدفع: {item.paymentMethod}</span>
                          <span className="font-mono font-bold text-amber-300">{item.amountDzd} DZD</span>
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono">المرجع: {item.transactionRef}</div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Detailed Preview & Action Box */}
              <div className="p-5 bg-slate-950 space-y-4 overflow-y-auto">
                {selectedReceipt ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-black text-sm text-amber-300">تفاصيل معالجة وصل الدفع رقم #{selectedReceipt.id}</h3>
                      <span className="text-xs font-mono text-slate-400">{selectedReceipt.submittedAt}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400">المستخدم:</span>{' '}
                        <strong className="text-white">{selectedReceipt.userName}</strong> ({selectedReceipt.userEmail})
                      </div>
                      <div>
                        <span className="text-slate-400">طريقة التحويل:</span>{' '}
                        <strong className="text-purple-300">{selectedReceipt.paymentMethod}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">الرقم المرجعي:</span>{' '}
                        <strong className="text-amber-300 font-mono">{selectedReceipt.transactionRef}</strong>
                      </div>
                    </div>

                    {/* Receipt Image Preview */}
                    <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 p-2 space-y-2">
                      <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Image className="w-3.5 h-3.5 text-purple-400" />
                        <span>صورة الوصل المرفقة:</span>
                      </div>
                      <img
                        src={selectedReceipt.receiptImageUrl}
                        alt="Receipt preview"
                        className="w-full h-48 object-cover rounded-xl border border-slate-800"
                      />
                    </div>

                    {/* Actions */}
                    {selectedReceipt.status === 'PENDING_VERIFICATION' ? (
                      <div className="space-y-3 pt-2">
                        <button
                          onClick={() => handleApprove(selectedReceipt.id)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>المصادقة وتفعيل اشتراك ROLE_PREMIUM لمساهمة الطالب</span>
                        </button>

                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="سبب الرفض..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
                          />
                          <button
                            onClick={() => handleReject(selectedReceipt.id)}
                            className="w-full py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 font-bold text-xs rounded-xl border border-rose-800 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>رفض الوصل</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-center font-bold text-emerald-400">
                        تم معالجة هذا الوصل بصفة نهائية ({selectedReceipt.status})
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">اختر وصل دفع من القائمة الجانبية لمعاينته والتحقق منه.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Users & RBAC Management Panel */
          <div className="p-5 space-y-4 overflow-y-auto flex-1 bg-slate-950">
            {/* Search and Refresh Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="البحث بالاسم أو البريد..."
                  className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {roleMessage && (
                <div className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                  {roleMessage}
                </div>
              )}

              <button
                onClick={loadUsers}
                disabled={loadingUsers}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{loadingUsers ? 'جاري التحميل...' : 'تحديث قائمة القواعد البيانات'}</span>
              </button>
            </div>

            {/* Users List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUsers.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-500 text-xs">لا يوجد مستخدمون مطابقون للبحث.</div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-white">{u.nom}</span>
                          <span className="text-[10px] font-mono text-slate-400">#{u.id}</span>
                        </div>
                        <div className="text-xs text-purple-300 font-mono">{u.email}</div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black font-mono border ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : u.role === 'ROLE_TEACHER'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : u.role === 'ROLE_PREMIUM'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span>النقاط XP: <strong className="text-amber-300 font-mono">{u.score || u.xp || 0}</strong></span>
                      <span>المستوى: <strong className="text-purple-300 font-mono">{u.level || 1}</strong></span>
                      <span>السنة: <strong className="text-emerald-300 font-mono">{u.grade || '5AP'}</strong></span>
                    </div>

                    {/* Role Modifier Dropdown */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xs text-slate-400 font-bold shrink-0">تعديل الصلاحيات:</span>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-700 text-xs font-extrabold text-amber-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="ROLE_FREE">👤 ROLE_FREE (تلميذ مجاني)</option>
                        <option value="ROLE_PREMIUM">⭐ ROLE_PREMIUM (مشترك تميز)</option>
                        <option value="ROLE_TEACHER">🎓 ROLE_TEACHER (أستاذ/مُعد دروس)</option>
                        <option value="ROLE_ADMIN">🛡️ ROLE_ADMIN (مشرف عام)</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
