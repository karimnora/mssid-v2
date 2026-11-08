import React, { useState } from 'react';
import { ParentGateModal } from './ParentGateModal';
import { useProgressOwner } from '../utils/ownerStorage';
import { listLegacyProgress, recoverLegacyProgress } from '../utils/legacyProgressRecovery';

export function LegacyProgressRecovery({ name, arabic }: { name: string; arabic: boolean }) {
  const owner = useProgressOwner();
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const items = listLegacyProgress();
  if (!items.length && !message) return null;
  const t = (ar: string, fr: string) => arabic ? ar : fr;
  const labels: Record<string, string> = {
    mssid_game_levels: t('مستويات ألعاب التحضيري', 'Niveaux des jeux préscolaires'),
    mssid_learning_games_v1: t('الألعاب التعليمية', 'Jeux pédagogiques'),
    mssid_missions_v1: t('مهمات ديدو', 'Missions de Didou'),
    mssid_discovered_wilayas: t('الولايات المكتشفة', 'Wilayas découvertes'),
    mssid_completed_expeditions: t('الرحلات المكتملة', 'Expéditions terminées'),
    mssid_daily_objective: t('هدف اليوم', 'Objectif du jour'),
    'mssid.cemRewarded': t('مكافآت التحضير', 'Récompenses de préparation'),
    mssid_quiz_first_awards: t('مكافآت الأسئلة', 'Historique des récompenses de quiz'),
    mssid_quiz_game_xp: t('مكافآت الألعاب', 'Historique des récompenses de jeux'),
    mssid_quiz_revision_day: t('مراجعة اليوم', 'Révisions du jour'),
    mssid_last_activity: t('آخر نشاط', 'Dernière activité'),
  };
  return <section className="rounded-2xl border p-4 space-y-3" data-legacy-recovery>
    <h3 className="font-bold text-base">{t('بيانات قديمة دون اسم', 'Anciennes données sans propriétaire identifié')}</h3>
    <p>{t('لا ننسبها تلقائياً. اختر فقط ما يخص الملف الحالي: ', 'Elles restent conservées. Attribuez uniquement ce qui appartient au profil actuel : ')}<strong>{name}</strong>.</p>
    <p>{t('لا تُستبدل البيانات الحالية ولا تُضاف نقاط.', 'Les données actuelles ne seront pas remplacées et aucun XP ne sera ajouté.')}</p>
    {items.map(item => <button key={item.key} type="button" className="block min-h-[60px] w-full border rounded-xl p-3" onClick={() => setPending(item.key)}>{labels[item.key]}</button>)}
    {message && <p role="status">{message}</p>}
    <ParentGateModal isOpen={pending !== null} onClose={() => setPending(null)} onVerified={() => {
      const saved = pending !== null && recoverLegacyProgress(pending, owner);
      setPending(null);
      setMessage(saved ? t('تمت الاستعادة. أعد فتح النشاط.', 'Données attribuées. Rouvrez l’activité.') : t('لم تُستبدل البيانات. احتُفظ بالنسخة القديمة.', 'Aucune donnée remplacée. La copie ancienne est conservée.'));
    }} />
  </section>;
}
