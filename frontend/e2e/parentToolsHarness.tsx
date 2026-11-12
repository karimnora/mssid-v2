// Local E2E fixture only: synthetic profiles, no accounts and no external sharing.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamPlanPanel } from '../src/components/examPlan/ExamPlanPanel';
import { LocaleProvider } from '../src/context/LocaleContext';
import { createFreshGuestProfile } from '../src/hooks/useUserProgress';
import { buildParentNotebook, buildWeeklyPlan, recordPracticeResult } from '../src/utils/competenceProgress';
import { buildWeeklyReport, drawWeeklyReportCard, formatWeeklyReportText } from '../src/utils/weeklyReport';
import '../src/index.css';

const query = new URLSearchParams(location.search);
const locale = query.get('lang') === 'ar' ? 'ar' : 'fr';
localStorage.setItem('mssid_locale_preference', locale);
document.documentElement.classList.add(query.get('dark') === 'true' ? 'theme-dark' : 'theme-light');
const NOW = new Date(2026, 10, 12, 12);
const profiles = [
  { ...recordPracticeResult(createFreshGuestProfile('5AP'), 'arabic-5ap-tamyiz',
    { outcome: 'fail', exerciseId: 'arabic-5ap-tamyiz-eval3' }, NOW.toISOString()), name: 'Démo Amine' },
  { ...createFreshGuestProfile('4AP'), name: 'Démo Lina' },
];
function Harness() {
  const [child, setChild] = useState(0);
  const [opened, setOpened] = useState('');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const notebook = buildParentNotebook(profiles[child], profiles[child].grade);
  const report = buildWeeklyReport(notebook, buildWeeklyPlan(notebook, NOW), NOW);
  return <main className="max-w-xl mx-auto p-3 space-y-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <h1>TEST LOCAL — PROFILS FICTIFS</h1>
    <nav className="flex flex-wrap gap-3">
      <button onClick={() => { setChild(0); setResult(''); }}>Démo Amine 5AP</button>
      <button onClick={() => { setChild(1); setResult(''); }}>Démo Lina 4AP</button>
    </nav>
    <p aria-label="Profil actif">{notebook.childName} — {notebook.grade}</p>
    <ExamPlanPanel notebook={notebook} storageKey={'e2e-parent-tools-' + child} locale={locale} premium now={NOW}
      onReviewLesson={id => setOpened(id)} onPrint={id => setOpened('print:' + id)} onOpenExam={id => setOpened('exam:' + id)} />
    <output aria-label="Ressource ouverte">{opened}</output>
    <section><h2>Bilan fictif</h2>
      <button disabled={busy} onClick={async () => {
        setBusy(true);
        try {
          const blob = await drawWeeklyReportCard(report, locale);
          setResult(blob ? 'Image prête : ' + blob.type : formatWeeklyReportText(report, locale));
        } catch { setResult('Export indisponible'); }
        finally { setBusy(false); }
      }}>Préparer le bilan sans envoyer</button>
      <output aria-label="Résultat export" className="block whitespace-pre-wrap break-words">{result}</output>
    </section>
  </main>;
}
createRoot(document.getElementById('root')!).render(<LocaleProvider><Harness /></LocaleProvider>);
