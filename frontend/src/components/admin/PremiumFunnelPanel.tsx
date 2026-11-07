import React, { useEffect, useState } from 'react';
import { springBootApi } from '../../services/springBootApi';
import { downloadCsv } from './analyticsData';
type Row = { event: string; grade: string; day: string; total: number };
const labels: Record<string, string> = {
  lock_open: 'Cadenas ouvert', parent_interest: 'Demande au parent',
  offer_open: 'Offre consultée', demo_complete: 'Démo terminée',
};
export function PremiumFunnelPanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError(false); setRows(null);
    springBootApi.getPremiumFunnel().then(result => {
      if (cancelled) return;
      if (result.error || !Array.isArray(result.data)) setError(true);
      else setRows(result.data);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [tick]);
  return <section data-premium-funnel-admin className="rounded-2xl border border-slate-700 p-4 space-y-3" dir="ltr">
    <h3 className="font-bold text-lg">Découverte du Premium - 7 derniers jours</h3>
    <p>Actions agrégées par classe et jour (heure d’Algérie), pas des familles uniques ni des abonnements. Aucune identité n’est enregistrée dans ces compteurs.</p>
    <button type="button" className="min-h-[60px] px-4 border rounded-xl" onClick={() => setTick(n => n + 1)}>Actualiser</button>
    {error ? <p role="alert">Compteurs indisponibles. Aucun résultat n’est inventé.</p> : rows === null ? <p role="status">Chargement des compteurs…</p> : !rows.length ? <p>Aucune action reçue sur cette période.</p> : <>
      <div className="overflow-x-auto"><table className="w-full text-start"><thead><tr><th>Jour</th><th>Classe</th><th>Action</th><th>Total</th></tr></thead><tbody>
        {rows.map(row => <tr key={[row.day,row.grade,row.event].join(':')}><td>{row.day}</td><td>{row.grade}</td><td>{labels[row.event] ?? row.event}</td><td>{row.total}</td></tr>)}
      </tbody></table></div>
      <button type="button" className="min-h-[60px] px-4 border rounded-xl" onClick={() => downloadCsv(['day,grade,event,total', ...rows.map(row => [row.day,row.grade,row.event,row.total].join(','))].join('\n'), 'premium-funnel-7-jours.csv')}>Exporter les compteurs CSV</button>
    </>}
  </section>;
}
