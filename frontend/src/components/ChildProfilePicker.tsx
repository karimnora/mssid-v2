import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { ParentGateModal } from './ParentGateModal';
import { springBootApi } from '../services/springBootApi';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import type { ChildProfile } from '../utils/childProfileStorage';

const AVATARS = ['🦊', '🦁', '🐼', '🦉', '🐢', '🦋', '🚀', '🎓'];
const GRADES = ['PRESCHOOL', '1AP', '2AP', '3AP', '4AP', '5AP'] as const;
const MAX_PROFILES = 6;

type GateIntent = { kind: 'create' } | { kind: 'edit'; child: ChildProfile } | { kind: 'delete'; child: ChildProfile };

function gradeLabel(grade: string, t: (key: string) => string): string {
  if (grade === 'PRESCHOOL') return t('childGradePreschool');
  if (grade === '1AP') return t('childGrade1AP');
  if (grade === '2AP') return t('childGrade2AP');
  if (grade === '3AP') return t('childGrade3AP');
  if (grade === '4AP') return t('childGrade4AP');
  if (grade === '5AP') return t('childGrade5AP');
  return grade;
}

interface ChildProfilePickerProps {
  isOpen: boolean;
  onSelectChild: (child: ChildProfile) => void;
  onSkip: () => void;
}

export const ChildProfilePicker: React.FC<ChildProfilePickerProps> = ({ isOpen, onSelectChild, onSkip }) => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gate, setGate] = useState<GateIntent | null>(null);
  const [form, setForm] = useState<{ id?: number; displayName: string; grade: string; avatar: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const res = await springBootApi.getChildProfiles();
      if (res.error || !Array.isArray(res.data) || !res.data.every(child => child
          && Number.isInteger(child.id) && child.id > 0 && typeof child.displayName === 'string'
          && GRADES.includes(child.grade as typeof GRADES[number]))) {
        setLoadError(true);
        setChildren([]);
      } else {
        setChildren(res.data);
      }
    } catch {
      setLoadError(true);
      setChildren([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setForm(null);
      setGate(null);
      void load();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onGateVerified = () => {
    if (!gate) return;
    if (gate.kind === 'create') {
      setForm({ displayName: '', grade: '1AP', avatar: '🦊' });
    } else if (gate.kind === 'edit') {
      setForm({
        id: gate.child.id,
        displayName: gate.child.displayName,
        grade: gate.child.grade,
        avatar: gate.child.avatar || '🦊',
      });
    } else {
      void removeChild(gate.child.id);
    }
    setGate(null);
  };

  const removeChild = async (id: number) => {
    const res = await springBootApi.deleteChildProfile(id);
    if (!res.error) await load();
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.displayName.trim()) return;
    setSaving(true);
    setFormError(null);
    const payload = {
      displayName: form.displayName.trim(),
      grade: form.grade,
      avatar: form.avatar,
    };
    try {
      const res = form.id
        ? await springBootApi.updateChildProfile(form.id, payload)
        : await springBootApi.createChildProfile(payload);
      if (res.error || !res.data || !Number.isInteger(res.data.id) || res.data.id <= 0
          || typeof res.data.displayName !== 'string' || !GRADES.includes(res.data.grade as typeof GRADES[number])) {
        setFormError(res.error || t('childPickerUnavailable'));
      } else {
        setForm(null);
        await load();
        if (!form.id) onSelectChild(res.data);
      }
    } catch {
      setFormError(t('childPickerUnavailable'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#FFFBF0] text-[#0f172a] overflow-y-auto"
      dir={direction}
      role="dialog"
      aria-modal="true"
      aria-label={t('childPickerTitle')}
    >
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 min-h-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#008751]/15 text-[#008751] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black">{t('childPickerTitle')}</h1>
            <p className="text-sm font-bold text-slate-600 mt-1 leading-relaxed">{t('childPickerSubtitle')}</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm font-bold text-slate-500">{t('loadingDefaultLabel')}</p>
        ) : loadError ? (
          <p className="text-sm font-bold text-[#C42A23] bg-white border border-[#E7E2D7] rounded-2xl p-4">
            {t('childPickerUnavailable')}
          </p>
        ) : form ? (
          <form onSubmit={saveForm} className="bg-white border border-[#E7E2D7] rounded-3xl p-4 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-extrabold text-slate-500">{t('childPickerName')}</span>
              <input
                required
                maxLength={40}
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="kids-input w-full"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-extrabold text-slate-500">{t('childPickerGrade')}</span>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="kids-input w-full"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{gradeLabel(g, t)}</option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setForm({ ...form, avatar: a })}
                  className={`w-12 h-12 rounded-2xl text-2xl border-2 ${form.avatar === a ? 'border-[#008751] bg-[#008751]/10' : 'border-[#E7E2D7] bg-white'}`}
                  aria-label={a}
                >
                  {a}
                </button>
              ))}
            </div>
            {formError && <p className="text-xs font-bold text-[#C42A23]">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="kids-cta flex-1">
                {t('childPickerSave')}
              </button>
              <button type="button" onClick={() => setForm(null)} className="min-h-[var(--hit)] px-4 font-extrabold text-slate-500">
                {t('childPickerCancel')}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white border border-[#E7E2D7] rounded-3xl p-3 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => onSelectChild(child)}
                  className="flex-1 flex items-center gap-3 min-h-[var(--hit)] text-start"
                >
                  <span className="text-3xl w-12 text-center" aria-hidden>{child.avatar || '🎓'}</span>
                  <span>
                    <span className="block font-black">{child.displayName}</span>
                    <span className="block text-xs font-bold text-slate-500">{gradeLabel(child.grade, t)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setGate({ kind: 'edit', child })}
                  className="w-12 h-12 rounded-2xl border border-[#E7E2D7] flex items-center justify-center"
                  aria-label={t('childPickerEdit')}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setGate({ kind: 'delete', child })}
                  className="w-12 h-12 rounded-2xl border border-[#E7E2D7] text-[#C42A23] flex items-center justify-center"
                  aria-label={t('childPickerDelete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {children.length < MAX_PROFILES ? (
              <button
                type="button"
                onClick={() => setGate({ kind: 'create' })}
                className="w-full min-h-[var(--hit)] rounded-3xl border-2 border-dashed border-[#008751] text-[#008751] font-extrabold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('childPickerAdd')}
              </button>
            ) : (
              <p className="text-xs font-bold text-slate-500 text-center">{t('childPickerMax')}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onSkip}
          className="w-full min-h-[var(--hit)] font-extrabold text-slate-500"
        >
          {t('childPickerSkip')}
        </button>
      </div>

      <ParentGateModal
        isOpen={gate != null}
        onClose={() => setGate(null)}
        onVerified={onGateVerified}
      />
    </div>
  );
};
