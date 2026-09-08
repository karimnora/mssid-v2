import { PrimaryGrade } from '../types';
import { WILAYAS_LIST } from '../data/wilayasData';

// Everything an admin's live GET /api/v1/admin/stats/overview already returns that this export
// actually uses — a subset of AnalyticsModule.tsx's AdminStatsOverview, kept separate so this file
// has no import-time dependency on that component.
export interface PartnerExportStats {
  totalUsers: number;
  wilayaDistribution: Record<string, number>;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate7Days: number;
  retentionRate30Days: number;
  newUsersLast30Days: number;
}

const GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

const GRADE_NAME_AR: Record<PrimaryGrade, string> = {
  '1AP': 'السنة الأولى ابتدائي',
  '2AP': 'السنة الثانية ابتدائي',
  '3AP': 'السنة الثالثة ابتدائي',
  '4AP': 'السنة الرابعة ابتدائي',
  '5AP': 'السنة الخامسة ابتدائي',
};

const SUBJECT_LABEL_FR: Record<string, string> = {
  arabic: 'Arabe',
  math: 'Mathématiques',
  islamic: 'Éduc. islamique',
  science: 'Éveil scientifique',
  civics: 'Éduc. civique',
  french: 'Français',
  english: 'Anglais',
  history_geo: 'Histoire-Géo',
  art: 'Arts',
  tamazight: 'Tamazight',
  soroban: 'Soroban',
};

const SUBJECT_LABEL_AR: Record<string, string> = {
  arabic: 'العربية',
  math: 'الرياضيات',
  islamic: 'التربية الإسلامية',
  science: 'التربية العلمية',
  civics: 'التربية المدنية',
  french: 'الفرنسية',
  english: 'الإنجليزية',
  history_geo: 'التاريخ والجغرافيا',
  art: 'التربية الفنية',
  tamazight: 'الأمازيغية',
  soroban: 'السوروبان',
};

const WILAYA_NAME_AR: Record<string, string> = Object.fromEntries(
  WILAYAS_LIST.map((w) => [w.codeStr, w.nameAr])
);

// Subjects whose titleAr field already IS French/English content (french/english lessons store their
// real title there, not a translation) — shown as-is. Everything else is genuinely Arabic/Tamazight,
// so its exhibit needs a French gloss below the original — see LESSON_GLOSS_FR.
const SUBJECTS_ALREADY_LATIN = new Set(['french', 'english']);

// Short, hand-written French gloss for every lesson currently first in its (grade, subject) bucket —
// i.e. every lesson this export could pick as an exhibit today. Keyed by lesson id (stable) rather
// than by subject, so a future content change that picks a different lesson degrades to the generic
// fallback below instead of silently mislabeling a different lesson's quote.
const LESSON_GLOSS_FR: Record<string, string> = {
  'arabic-1ap-t1-oral-daily': "Je m'exprime : la famille, l'école, le jeu",
  'civics-1ap-t1-greetings-respect': 'Je salue et je respecte les grandes personnes',
  'islamic-1ap-t1-fatiha-basmala': 'Sourate Al-Fatiha, la basmala et la hamdala',
  'math-1ap-t2-compare-quantities': 'Je compare : plus que, moins que, autant que',
  'science-1ap-t1-five-senses-hygiene': 'Mes cinq sens et mon hygiène',

  'arabic-2ap-t1-reading-school': "Je lis un texte : l'école et la famille",
  'civics-2ap-t1-personal-documents': "Mes papiers : carte d'identité et livret de famille",
  'islamic-2ap-t3-surah-takathur': 'Mémorisation de la sourate At-Takathur',
  'math-2ap-t2-subtraction-with-carry': 'La soustraction posée avec retenue',
  'science-2ap-t2-animal-movement': 'Comment se déplacent les animaux ?',

  'arabic-3ap-t1-conjugation-past-present': 'Conjugaison du passé et du présent (1re et 2e personnes)',
  'art-3ap-t1-colors-rhythm': 'Couleurs primaires, secondaires et rythme musical',
  'civics-3ap-t1-school-rules-symbols': 'Règles de vie à l’école et symboles nationaux',
  'history-3ap-t1-time-eras-timeline': 'Le temps historique (passé, présent, futur) et les points cardinaux',
  'islamic-3ap-t1-pillars-purity-surahs': "Piliers de la foi et de l'islam, la purification (les ablutions)",
  'math-3ap-t1-numbers-to-999': 'Les nombres de 0 à 999 : lecture, écriture, décomposition',
  'science-3ap-u1-respiration-heartbeat': "La respiration et le rythme cardiaque à l'effort",
  'tamazight-3ap-initiation-lettres-formes': 'Découverte des lettres tifinagh et de leurs formes',

  'arabic-4ap-parts-of-speech-sentences': 'Les classes de mots et la phrase nominale/verbale',
  'art-4ap-t1-warm-cool-colors': 'Les couleurs chaudes et froides',
  'civics-4ap-public-private-property': 'Propriété publique et propriété privée',
  'history-4ap-personal-national-history': 'Histoire personnelle et histoire nationale : la notion de temps',
  'islamic-4ap-faith-messengers-books': 'La croyance aux messagers et aux livres révélés',
  'math-4ap-numbers-under-100k': 'Les nombres inférieurs à 100 000 : lecture, écriture, encadrement',
  'tamazight-4ap-agemmay-tifinagh-lettres': "L'alphabet tifinagh et ses lettres de base",

  'arabic-5ap-sentence-components': 'La phrase verbale et nominale, sujet et complément',
  'art-5ap-t1-complementary-colors': 'Couleurs complémentaires et contrastes',
  'civics-5ap-national-symbols': 'Les symboles de la souveraineté nationale',
  'history-5ap-periods-landmarks': 'Les quatre périodes historiques et leurs grands repères',
  'islamic-5ap-quran-fajr-ala': "Sourate Al-A'la (nouvelle) et révision d'Al-Fajr",
  'math-5ap-circle-radius': 'Le cercle : centre, rayon et diamètre',
  'science-5ap-electric-circuit': 'Le circuit électrique simple : éléments, conducteurs et isolants',
  'soroban-basics': "Les composants du soroban et les règles d'activation",
  'tamazight-5ap-taseddast-noms-verbes': 'Le nom et le verbe en tamazight',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function subjectLabel(id: string, map: Record<string, string>): string {
  return map[id] || id;
}

/**
 * Builds the same "carnet scolaire" partner-facing document previously drafted as a one-off Claude
 * artifact, but computed live from the app's own data every time it's called: the course catalog
 * comes straight from COURSES_DATA (the same array every lesson-facing screen reads), and the
 * audience numbers come from whatever AdminStatsOverview the caller already fetched. Nothing here
 * is fabricated or cached — re-running this after new lessons ship or the user base grows reflects
 * both changes immediately, unlike the static snapshot it replaces.
 */
export async function generatePartnerCatalogHtml(stats: PartnerExportStats): Promise<string> {
  const { COURSES_DATA } = await import('../data/coursesData');

  const byGrade: Record<PrimaryGrade, { total: number; subjects: Record<string, number>; samples: Record<string, { id: string; title: string }> }> =
    Object.fromEntries(GRADES.map((g) => [g, { total: 0, subjects: {}, samples: {} }])) as any;

  let totalLessons = 0;
  for (const lesson of COURSES_DATA) {
    const grade = lesson.grade as PrimaryGrade;
    const bucket = byGrade[grade];
    if (!bucket || !lesson.subject) continue;
    totalLessons++;
    bucket.total++;
    bucket.subjects[lesson.subject] = (bucket.subjects[lesson.subject] || 0) + 1;
    if (!bucket.samples[lesson.subject] && lesson.titleAr) {
      bucket.samples[lesson.subject] = { id: lesson.id, title: lesson.titleAr };
    }
  }

  const growthMax = Math.max(...GRADES.map((g) => byGrade[g].total), 1);

  const wilayaEntries = Object.entries(stats.wilayaDistribution || {})
    .filter(([code]) => code !== 'UNKNOWN')
    .sort((a, b) => b[1] - a[1]);
  const unknownWilaya = stats.wilayaDistribution?.UNKNOWN || 0;
  const wilayaTotal = wilayaEntries.reduce((sum, [, v]) => sum + v, 0) + unknownWilaya;

  const gradeSections = GRADES.map((grade, idx) => {
    const bucket = byGrade[grade];
    const subjectRows = Object.entries(bucket.subjects)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, count]) => {
        const pct = bucket.total > 0 ? (count / bucket.total) * 100 : 0;
        return `
      <div class="ledger-row">
        <div class="ledger-label"><span class="fr">${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_FR))}</span><span class="ar">${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_AR))}</span></div>
        <div class="ledger-track"><div class="ledger-fill" style="width:${pct.toFixed(1)}%"></div></div>
        <div class="ledger-count mono">${count}</div>
      </div>`;
      })
      .join('');

    const topTwoSubjects = Object.entries(bucket.subjects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([subject]) => subject);
    const exhibits = topTwoSubjects
      .map((subject) => {
        const sample = bucket.samples[subject];
        if (!sample) return '';
        const tag = `Extrait · ${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_FR))}`;
        if (SUBJECTS_ALREADY_LATIN.has(subject)) {
          // french/english lessons store their real (already-French/English) title in titleAr —
          // no translation needed.
          return `
      <div class="exhibit"><span class="tag">${tag}</span><p class="quote fr">${escapeHtml(sample.title)}</p></div>`;
        }
        const gloss = LESSON_GLOSS_FR[sample.id] || '(traduction non disponible pour cet extrait)';
        return `
      <div class="exhibit"><span class="tag">${tag}</span><p class="quote ar">${escapeHtml(sample.title)}</p><p class="quote-fr">${escapeHtml(gloss)}</p></div>`;
      })
      .join('');

    return `
  <section class="grade" id="g${grade}">
    <div class="grade-head">
      <span class="grade-num">${idx + 1}</span>
      <span class="grade-title">${grade} <span class="ar">${GRADE_NAME_AR[grade]}</span></span>
      <div class="grade-total"><b class="mono">${bucket.total}</b><span>leçons</span></div>
    </div>
    <div class="ledger">${subjectRows}</div>
    <div class="exhibits">${exhibits}</div>
  </section>`;
  }).join('');

  const growthBars = GRADES.map((g) => {
    const h = (byGrade[g].total / growthMax) * 100;
    return `<div class="bar"><div class="fill" style="height:${h.toFixed(0)}%"></div><span class="lbl">${g}</span></div>`;
  }).join('');

  const navPills = GRADES.map((g) => `<a href="#g${g}"><b>${g}</b><small>${byGrade[g].total} leçons</small></a>`).join('');

  const wilayaRows = wilayaEntries
    .slice(0, 12)
    .map(([code, count]) => {
      const pct = wilayaTotal > 0 ? (count / wilayaTotal) * 100 : 0;
      const name = WILAYA_NAME_AR[code] || code;
      return `
      <div class="ledger-row">
        <div class="ledger-label"><span class="fr">${escapeHtml(code)} — ${escapeHtml(name)}</span></div>
        <div class="ledger-track"><div class="ledger-fill" style="width:${pct.toFixed(1)}%"></div></div>
        <div class="ledger-count mono">${count}</div>
      </div>`;
    })
    .join('');
  const unknownRow = unknownWilaya > 0
    ? `
      <div class="ledger-row">
        <div class="ledger-label"><span class="fr">Wilaya non renseignée</span></div>
        <div class="ledger-track"><div class="ledger-fill" style="width:${((unknownWilaya / Math.max(wilayaTotal, 1)) * 100).toFixed(1)}%"></div></div>
        <div class="ledger-count mono">${unknownWilaya}</div>
      </div>`
    : '';

  const subjectCount = new Set(GRADES.flatMap((g) => Object.keys(byGrade[g].subjects))).size;
  const generatedAt = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Catalogue MSSID — export partenaire</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;600;700&family=Work+Sans:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
  :root{
    --paper:#EFF1E7; --paper-raised:#F9FAF3; --ink:#1B241D; --ink-soft:#3E463A; --muted:#6C7267;
    --forest:#1F5D42; --forest-soft:#2E7350; --seal:#B8802A; --seal-soft:#D79A3C;
    --line:#D6D4C1; --line-strong:#C2C0AA; --shadow: 0 1px 0 rgba(27,36,29,.06);
  }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--paper); color:var(--ink); font-family:'Work Sans', -apple-system, 'Segoe UI', sans-serif; line-height:1.55; }
  .ar{ font-family:'Noto Naskh Arabic', 'Traditional Arabic', serif; direction:rtl; unicode-bidi:isolate; }
  .mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; font-variant-numeric:tabular-nums; }
  .page{ max-width:760px; margin:0 auto; padding:56px 24px 80px; }
  header{ position:relative; padding-bottom:36px; margin-bottom:8px; border-bottom:2px solid var(--line-strong); }
  .stamp{ position:absolute; top:-6px; inset-inline-end:-4px; width:150px; padding:8px 6px; border:1.5px dashed var(--seal); border-radius:6px; color:var(--seal); font-family:'IBM Plex Mono', monospace; font-size:9.5px; font-weight:600; letter-spacing:.06em; text-align:center; text-transform:uppercase; transform:rotate(6deg); opacity:.85; }
  .eyebrow{ font-family:'IBM Plex Mono', monospace; font-size:11.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:var(--forest); margin:0 0 14px; }
  .head-row{ display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
  h1{ font-family:'Zilla Slab', Georgia, serif; font-weight:700; font-size:46px; line-height:1; margin:0; color:var(--ink); text-wrap:balance; }
  .seal-badge{ flex-shrink:0; width:104px; height:104px; border-radius:50%; border:2.5px solid var(--seal); display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--seal); position:relative; }
  .seal-badge::before{ content:""; position:absolute; inset:6px; border:1px solid var(--seal); border-radius:50%; opacity:.55; }
  .seal-badge b{ font-family:'Zilla Slab', serif; font-size:26px; line-height:1; font-weight:700; }
  .seal-badge span{ font-family:'IBM Plex Mono', monospace; font-size:9px; letter-spacing:.05em; text-transform:uppercase; margin-top:3px; }
  .subtitle{ max-width:62ch; margin:18px 0 0; color:var(--ink-soft); font-size:15.5px; }
  .growth{ margin-top:28px; display:flex; align-items:flex-end; gap:14px; height:56px; }
  .growth .bar{ flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; }
  .growth .fill{ width:100%; max-width:38px; background:var(--forest); border-radius:3px 3px 0 0; }
  .growth .lbl{ font-family:'IBM Plex Mono', monospace; font-size:10.5px; color:var(--muted); }
  .intro{ padding:28px 0 8px; font-size:15.5px; color:var(--ink-soft); max-width:64ch; }
  nav.jump{ display:flex; gap:8px; flex-wrap:wrap; margin:20px 0 40px; padding-top:20px; border-top:1px solid var(--line); }
  nav.jump a{ display:flex; flex-direction:column; align-items:center; gap:2px; padding:8px 14px; border:1px solid var(--line-strong); border-radius:8px; text-decoration:none; color:var(--ink); background:var(--paper-raised); box-shadow:var(--shadow); }
  nav.jump a b{ font-family:'Zilla Slab', serif; font-size:15px; }
  nav.jump a small{ font-family:'IBM Plex Mono', monospace; color:var(--muted); font-size:10px; }
  section.grade{ padding:36px 0; border-top:2px solid var(--line-strong); }
  .grade-head{ display:flex; align-items:baseline; gap:16px; flex-wrap:wrap; margin-bottom:22px; }
  .grade-num{ font-family:'Zilla Slab', serif; font-weight:700; font-size:13px; width:26px; height:26px; border-radius:50%; background:var(--forest); color:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .grade-title{ font-family:'Zilla Slab', serif; font-weight:700; font-size:24px; }
  .grade-title .ar{ font-weight:600; font-size:19px; color:var(--muted); margin-inline-start:10px; }
  .grade-total{ margin-inline-start:auto; text-align:end; }
  .grade-total b{ font-family:'IBM Plex Mono', monospace; font-size:22px; color:var(--forest); }
  .grade-total span{ display:block; font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
  .ledger{ display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
  .ledger-row{ display:grid; grid-template-columns:170px 1fr 34px; align-items:center; gap:12px; }
  .ledger-label{ display:flex; flex-direction:column; line-height:1.25; }
  .ledger-label .fr{ font-size:13px; font-weight:600; }
  .ledger-label .ar{ font-size:12px; color:var(--muted); }
  .ledger-track{ height:9px; background:var(--line); border-radius:5px; overflow:hidden; }
  .ledger-fill{ height:100%; background:var(--forest-soft); border-radius:5px; }
  .ledger-count{ font-family:'IBM Plex Mono', monospace; font-size:13px; text-align:end; color:var(--ink-soft); }
  .exhibits{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media (max-width:560px){ .exhibits{ grid-template-columns:1fr; } .ledger-row{ grid-template-columns:130px 1fr 30px; } }
  .exhibit{ background:var(--paper-raised); border:1px solid var(--line-strong); border-radius:10px; padding:16px 18px; box-shadow:var(--shadow); }
  .exhibit .tag{ font-family:'IBM Plex Mono', monospace; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; color:var(--seal); margin-bottom:8px; display:block; }
  .exhibit .quote{ font-size:16px; line-height:1.7; margin:0; }
  .exhibit .quote.ar{ text-align:right; }
  .exhibit .quote.fr{ font-family:'Zilla Slab', serif; font-size:14px; }
  .exhibit .quote-fr{ margin:8px 0 0; padding-top:8px; border-top:1px dashed var(--line-strong); font-size:12.5px; color:var(--muted); font-style:italic; }
  footer{ margin-top:44px; padding-top:28px; border-top:2px solid var(--line-strong); }
  .foot-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; }
  @media (max-width:560px){ .foot-grid{ grid-template-columns:1fr 1fr; } }
  .foot-fact b{ display:block; font-family:'Zilla Slab', serif; font-size:26px; color:var(--forest); }
  .foot-fact span{ font-size:12px; color:var(--muted); }
  .note{ font-size:12.5px; color:var(--muted); max-width:64ch; }
</style>
</head>
<body>
<div class="page">

  <header>
    <div class="stamp">Usage&nbsp;: présentation<br>partenaire</div>
    <p class="eyebrow">Catalogue &amp; audience — export du ${escapeHtml(generatedAt)}</p>
    <div class="head-row">
      <h1>MSSID</h1>
      <div class="seal-badge"><b>${totalLessons}</b><span>leçons</span></div>
    </div>
    <p class="subtitle">
      Contenu original conforme au programme officiel algérien de 2ᵉ génération (<span class="ar">الجيل الثاني</span>),
      réparti sur 5 niveaux du primaire et ${subjectCount} matières. Document généré automatiquement depuis
      les données réelles de l'application — aucun chiffre saisi à la main.
    </p>
    <div class="growth" aria-hidden="true">${growthBars}</div>
  </header>

  <p class="intro">
    Répartition du contenu par niveau et par matière, avec un extrait authentique par matière la plus
    représentée, suivie de l'audience actuelle (comptes actifs et répartition par wilaya).
  </p>

  <nav class="jump" aria-label="Aller à un niveau">${navPills}</nav>

  ${gradeSections}

  <section class="grade">
    <div class="grade-head">
      <span class="grade-title">Audience actuelle</span>
      <div class="grade-total"><b class="mono">${stats.totalUsers}</b><span>comptes</span></div>
    </div>
    <div class="foot-grid" style="margin-bottom:24px;">
      <div class="foot-fact"><b class="mono">${stats.dailyActiveUsers}</b><span>actifs aujourd'hui</span></div>
      <div class="foot-fact"><b class="mono">${stats.weeklyActiveUsers}</b><span>actifs 7 jours</span></div>
      <div class="foot-fact"><b class="mono">${stats.monthlyActiveUsers}</b><span>actifs 30 jours</span></div>
      <div class="foot-fact"><b class="mono">${stats.retentionRate7Days.toFixed(1)}%</b><span>rétention 7 jours</span></div>
      <div class="foot-fact"><b class="mono">${stats.retentionRate30Days.toFixed(1)}%</b><span>rétention 30 jours</span></div>
      <div class="foot-fact"><b class="mono">${stats.newUsersLast30Days}</b><span>nouveaux (30 jours)</span></div>
    </div>
    <p class="eyebrow" style="margin-bottom:14px;">Répartition par wilaya</p>
    <div class="ledger">${wilayaRows}${unknownRow || ''}</div>
  </section>

  <footer>
    <p class="note">
      Instantané généré le ${escapeHtml(generatedAt)} directement depuis le contenu et la base d'utilisateurs
      de l'application — aucun chiffre estimé ni arrondi de complaisance. Document destiné à une
      présentation à un partenaire, non contractuel.
    </p>
  </footer>

</div>
</body>
</html>`;
}

/** Triggers a browser download of the generated document — no server round-trip, no library. */
export function downloadHtmlFile(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
