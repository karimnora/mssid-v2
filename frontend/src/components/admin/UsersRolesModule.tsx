import React, { useState, useEffect } from 'react';
import { PaymentReceipt, AuthUser, UserRole } from '../../types/auth';
import { AuthService } from '../../services/authService';
import { CheckCircle2, XCircle, Search, Image, Users, Sparkles, Filter, ShieldCheck } from 'lucide-react';

// Absorbed from the retired standalone AdminReceiptsManager modal (see Navbar/App.tsx) — same
// visual identity (dark slate-900 back-office theme), now rendered inline as the "👥 المستخدمون
// والصلاحيات" tab body of the Admin Console instead of a fixed-overlay modal.
export const UsersRolesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RECEIPTS' | 'USERS'>('RECEIPTS');

  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rejectionReason, setRejectionReason] = useState<string>('صورة الوصل غير واضحة أو الرقم المرجعي غير متطابق');
  const [receiptMessage, setReceiptMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [verifyingReceiptId, setVerifyingReceiptId] = useState<number | null>(null);

  // User RBAC Management State
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [roleMessage, setRoleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadReceipts = async () => {
    setLoadingReceipts(true);
    try {
      // Real backend read (GET /v1/payments/admin/receipts) — replaces the old localStorage-mock
      // AuthService.getReceipts() so the list reflects the actual database, not stale sample data.
      const list = await AuthService.getAllReceiptsAsync();
      setReceipts(list);
    } catch (e) {
      console.error('Error loading receipts:', e);
    } finally {
      setLoadingReceipts(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await AuthService.getAllUsersAsync();
      setUsers(list);
    } catch (e) {
      console.error('Error loading users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'RECEIPTS') {
      loadReceipts();
    } else if (activeTab === 'USERS') {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // SEC/BUG FIX: previously called the local-only AuthService.verifyReceipt (fire-and-forget to the
  // backend, optimistic localStorage write shown as instant "success") — a failed network call meant
  // the admin saw "approved" while the server never actually recorded it, silently leaving a paying
  // user stuck on FREE. Now awaits the real backend call and only reports success once confirmed.
  const handleVerify = async (id: number, approve: boolean, reason?: string) => {
    setReceiptMessage(null);
    setVerifyingReceiptId(id);
    const result = await AuthService.verifyReceiptAsync(id, approve, reason);
    setVerifyingReceiptId(null);

    if (!result.success) {
      setReceiptMessage({
        type: 'error',
        text: result.message || 'تعذر تسجيل القرار على الخادم. لم تتم الموافقة/الرفض فعلياً — أعد المحاولة.',
      });
      return;
    }

    // Keep the receipt selected (rather than clearing it) and reflect its new status inline — the
    // admin sees the confirmed APPROVED/REJECTED state directly, instead of the success message and
    // the detail panel disappearing in the same instant (they would have, if selectedReceipt were
    // cleared here: the message banner below only renders while a receipt is selected).
    setSelectedReceipt((prev) => (prev && prev.id === id ? { ...prev, status: approve ? 'APPROVED' : 'REJECTED' } : prev));
    setReceiptMessage({ type: 'success', text: approve ? 'تمت الموافقة على الوصل وترقية الحساب بنجاح.' : 'تم رفض الوصل بنجاح.' });
    setTimeout(() => setReceiptMessage(null), 3000);
    await loadReceipts();
  };

  // Both actions are irreversible from the admin's side (approval instantly grants a paid
  // subscription; rejection is final and shown to the payer) — a stray tap must not trigger either.
  const handleApprove = (id: number) => {
    if (!window.confirm('هل أنت متأكد من الموافقة على هذا الوصل وترقية حساب المستخدم إلى ROLE_PREMIUM؟')) return;
    handleVerify(id, true);
  };
  const handleReject = (id: number) => {
    if (!window.confirm('هل أنت متأكد من رفض هذا الوصل؟ سيتم إشعار المستخدم بالسبب المدخل.')) return;
    handleVerify(id, false, rejectionReason);
  };

  // SEC/BUG FIX: previously called updateUserRoleAsync and trusted a boolean that could be `true`
  // from a local-only fallback even when the backend never persisted the change (same bug class as
  // receipts above, see handleVerify). Now awaits the real result and only reports success once the
  // backend confirms, surfacing the actual error otherwise instead of a generic message.
  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setRoleMessage(null);
    const result = await AuthService.updateUserRoleAsync(userId, newRole);
    if (!result.success) {
      setRoleMessage({
        type: 'error',
        text: result.message || 'تعذر تسجيل التغيير على الخادم. لم يتم تعديل الدور فعلياً — أعد المحاولة.',
      });
      return;
    }
    setRoleMessage({ type: 'success', text: `تم تعديل الدور بنجاح إلى ${newRole}` });
    setTimeout(() => setRoleMessage(null), 3000);
    loadUsers();
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
    <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden dir-rtl" dir="rtl">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/80 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black font-sans text-white flex flex-wrap items-center gap-2">
              <span>لوحة تحكم المشرف</span>
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                ROLE_ADMIN
              </span>
            </h2>
            <p className="text-xs text-slate-300 hidden sm:block">
              إدارة أمنية متكاملة للمستخدمين، الصلاحيات (RBAC)، والمصادقة على اشتراكات بريدي موب
            </p>
          </div>
        </div>
      </div>

      {/* Tab Switcher Bar */}
      <div className="flex gap-1 border-b border-slate-800 bg-slate-950 px-2 sm:px-4 pt-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('RECEIPTS')}
          className={`px-4 sm:px-5 min-h-[var(--hit)] text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === 'RECEIPTS'
              ? 'border-amber-400 text-amber-300 bg-slate-900 rounded-t-xl'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="sm:hidden">وصولات ({receipts.length})</span>
          <span className="hidden sm:inline">معالجة وصولات الدفع ({receipts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 sm:px-5 min-h-[var(--hit)] text-xs font-black transition-all cursor-pointer flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === 'USERS'
              ? 'border-purple-500 text-purple-300 bg-slate-900 rounded-t-xl'
              : 'border-transparent text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span className="sm:hidden">حسابات</span>
          <span className="hidden sm:inline">إدارة حسابات المستخدمين والصلاحيات (RBAC)</span>
        </button>
      </div>

      {activeTab === 'RECEIPTS' ? (
        <>
          {/* Filter Toolbar */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-300 shrink-0 flex items-center gap-1">
              <Filter className="w-4 h-4 text-purple-400" />
              <span>فلترة الوصولات:</span>
            </span>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 min-h-[var(--hit)] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterStatus === 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              جميع الوصولات ({receipts.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING_VERIFICATION')}
              className={`px-3 min-h-[var(--hit)] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterStatus === 'PENDING_VERIFICATION' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              قيد الانتظار ({receipts.filter((r) => r.status === 'PENDING_VERIFICATION').length})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-3 min-h-[var(--hit)] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterStatus === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
              }`}
            >
              المقبولة ({receipts.filter((r) => r.status === 'APPROVED').length})
            </button>
            <button
              onClick={loadReceipts}
              disabled={loadingReceipts}
              className="mr-auto px-3 min-h-[var(--hit)] rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{loadingReceipts ? 'جاري التحميل...' : 'تحديث القائمة'}</span>
            </button>
          </div>

          {/* Table & Details Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800">
            {/* List View */}
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {loadingReceipts && receipts.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">جاري تحميل وصولات الدفع...</div>
              ) : filteredReceipts.length === 0 ? (
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

                      <div className="text-[11px] text-slate-300 flex justify-between items-center">
                        <span>طريقة الدفع: {item.paymentMethod}</span>
                        <span className="font-mono font-bold text-amber-300">{item.amountDzd} DZD</span>
                      </div>

                      <div className="text-[11px] text-slate-300">مدة الاشتراك: {item.durationMonths ?? 12} أشهر · {item.planId ?? 'LEGACY_12M'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">المرجع: {item.transactionRef}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Detailed Preview & Action Box */}
            <div className="p-5 bg-slate-950 space-y-4 max-h-[70vh] overflow-y-auto">
              {selectedReceipt ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-black text-sm text-amber-300">تفاصيل معالجة وصل الدفع رقم #{selectedReceipt.id}</h3>
                    <span className="text-xs font-mono text-slate-300">{selectedReceipt.submittedAt}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-300">المستخدم:</span>{' '}
                      <strong className="text-white">{selectedReceipt.userName}</strong> ({selectedReceipt.userEmail})
                    </div>
                    <div>
                      <span className="text-slate-300">طريقة التحويل:</span>{' '}
                      <strong className="text-purple-300">{selectedReceipt.paymentMethod}</strong>
                    </div>
                    <div>
                      <span className="text-slate-300">الرقم المرجعي:</span>{' '}
                      <strong className="text-amber-300 font-mono">{selectedReceipt.transactionRef}</strong>
                    </div>
                  </div>

                  {/* Receipt Image Preview */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 p-2 space-y-2">
                    <div className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
                      <Image className="w-3.5 h-3.5 text-purple-400" />
                      <span>صورة الوصل المرفقة:</span>
                    </div>
                    <img
                      src={selectedReceipt.receiptImageUrl}
                      alt="Receipt preview"
                      loading="lazy"
                      className="w-full h-48 object-cover rounded-xl border border-slate-800"
                    />
                  </div>

                  {/* Actions */}
                  {receiptMessage && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${receiptMessage.type === 'success' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800' : 'bg-rose-900/40 text-rose-300 border border-rose-800'}`}>
                      {receiptMessage.text}
                    </div>
                  )}
                  {selectedReceipt.status === 'PENDING_VERIFICATION' ? (
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => handleApprove(selectedReceipt.id)}
                        disabled={verifyingReceiptId === selectedReceipt.id}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{verifyingReceiptId === selectedReceipt.id ? 'جارٍ التسجيل على الخادم...' : 'المصادقة وتفعيل اشتراك ROLE_PREMIUM لمساهمة الطالب'}</span>
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
                          disabled={verifyingReceiptId === selectedReceipt.id}
                          className="w-full py-2 bg-rose-900/60 hover:bg-rose-900 disabled:opacity-50 disabled:cursor-not-allowed text-rose-200 font-bold text-xs rounded-xl border border-rose-800 transition-all cursor-pointer flex items-center justify-center gap-2"
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
        <div className="p-5 space-y-4 bg-slate-950">
          {/* Search and Refresh Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-300 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="البحث بالاسم أو البريد..."
                className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {roleMessage && (
              <div
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                  roleMessage.type === 'success'
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                    : 'text-rose-400 bg-rose-950/60 border-rose-800'
                }`}
              >
                {roleMessage.text}
              </div>
            )}

            <button
              onClick={loadUsers}
              disabled={loadingUsers}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{loadingUsers ? 'جاري التحميل...' : 'تحديث قائمة المستخدمين'}</span>
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
                        <span className="text-[10px] font-mono text-slate-300">#{u.id}</span>
                      </div>
                      <div className="text-xs text-purple-300 font-mono">{u.email}</div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black font-mono border ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : u.role === 'ROLE_PREMIUM'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span>النقاط XP: <strong className="text-amber-300 font-mono">{u.score || u.xp || 0}</strong></span>
                    <span>المستوى: <strong className="text-purple-300 font-mono">{u.level || 1}</strong></span>
                    <span>السنة: <strong className="text-emerald-300 font-mono">{u.grade || '5AP'}</strong></span>
                  </div>

                  {/* Role Modifier Dropdown */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-slate-300 font-bold shrink-0">تعديل الصلاحيات:</span>
                    <select
                      value={u.role}
                      onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        // The <select> is controlled by u.role (from server-loaded state, never
                        // mutated locally on cancel), so declining here leaves it showing the
                        // original role with no extra reset needed.
                        if (!window.confirm(`هل أنت متأكد من تغيير دور "${u.nom}" إلى ${newRole}؟`)) return;
                        handleRoleChange(u.id, newRole);
                      }}
                      className="bg-slate-950 border border-slate-700 text-xs font-extrabold text-amber-300 rounded-xl px-3 min-h-[var(--hit)] focus:outline-none focus:border-purple-500 cursor-pointer min-w-0 max-w-full"
                    >
                      <option value="ROLE_FREE">👤 ROLE_FREE (تلميذ مجاني)</option>
                      <option value="ROLE_PREMIUM">⭐ ROLE_PREMIUM (مشترك تميز)</option>
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
  );
};
