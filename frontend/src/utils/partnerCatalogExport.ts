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

// One fixed, vivid color per subject — reused everywhere a subject appears (grade bars, the
// aggregate pie, legends) so the same color always means the same subject across the document.
const SUBJECT_COLORS: Record<string, string> = {
  arabic: '#2E86DE',
  math: '#EE5253',
  islamic: '#10AC84',
  science: '#00B8D9',
  civics: '#F9A826',
  french: '#8854D0',
  english: '#FD7272',
  history_geo: '#786FA6',
  art: '#F97F51',
  tamazight: '#22C58B',
  soroban: '#E4589E',
};
const FALLBACK_COLOR = '#94A3B8';

// Cycled for open-ended categories with no fixed identity (wilaya codes) — kept distinct from the
// SUBJECT_COLORS hues so the two pies never look like they share a legend.
const WILAYA_PALETTE = ['#2E86DE', '#F9A826', '#10AC84', '#EE5253', '#8854D0', '#00B8D9', '#F97F51'];

const GRADE_BAR_COLORS: Record<PrimaryGrade, string> = {
  '1AP': '#2E86DE',
  '2AP': '#00B8D9',
  '3AP': '#10AC84',
  '4AP': '#F9A826',
  '5AP': '#EE5253',
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

interface PieEntry {
  label: string;
  value: number;
  color: string;
}

/**
 * Renders a pseudo-3D pie chart as inline SVG — no charting library, so the file stays a single
 * portable .html an admin can email or open offline. The "3D" comes from stacking two identical
 * ellipses (a plain dark one, and the colored wedges on top) offset vertically by `depth`: since
 * both share the same rx/ry, the lower ellipse's arc peeks out below the wedges by exactly `depth`
 * px all the way around, reading as the extruded side of a cake/cylinder.
 */
function pieChart3D(entries: PieEntry[], size = 280): string {
  const total = entries.reduce((sum, e) => sum + e.value, 0) || 1;
  const cx = size / 2;
  const cy = size * 0.4;
  const rx = size * 0.42;
  const ry = rx * 0.58;
  const depth = ry * 0.34;

  let cursorDeg = -90;
  let wedges = '';
  for (const entry of entries) {
    const sweep = (entry.value / total) * 360;
    if (sweep <= 0) continue;
    const a0 = (cursorDeg * Math.PI) / 180;
    const a1 = ((cursorDeg + sweep) * Math.PI) / 180;
    const x0 = (cx + rx * Math.cos(a0)).toFixed(2);
    const y0 = (cy + ry * Math.sin(a0)).toFixed(2);
    const x1 = (cx + rx * Math.cos(a1)).toFixed(2);
    const y1 = (cy + ry * Math.sin(a1)).toFixed(2);
    const largeArc = sweep > 180 ? 1 : 0;
    wedges += `<path d="M ${cx},${cy} L ${x0},${y0} A ${rx.toFixed(1)},${ry.toFixed(1)} 0 ${largeArc} 1 ${x1},${y1} Z" fill="${entry.color}" stroke="#fff" stroke-width="2"/>`;
    cursorDeg += sweep;
  }

  const base = `<ellipse cx="${cx}" cy="${(cy + depth).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#0F172A" opacity="0.28"/>`;
  const gloss = `<ellipse cx="${cx}" cy="${(cy - ry * 0.32).toFixed(1)}" rx="${(rx * 0.5).toFixed(1)}" ry="${(ry * 0.2).toFixed(1)}" fill="#fff" opacity="0.25"/>`;

  return `<svg viewBox="0 0 ${size} ${Math.round(size * 0.62)}" width="100%" role="img" aria-label="graphique circulaire">${base}${wedges}${gloss}</svg>`;
}

function pieLegend(entries: PieEntry[]): string {
  const total = entries.reduce((sum, e) => sum + e.value, 0) || 1;
  return entries
    .map((e) => {
      const pct = (e.value / total) * 100;
      return `
      <div class="legend-row">
        <span class="swatch" style="background:${e.color}"></span>
        <span class="legend-label">${escapeHtml(e.label)}</span>
        <span class="legend-val mono">${e.value} · ${pct.toFixed(1)}%</span>
      </div>`;
    })
    .join('');
}

/**
 * Builds the partner-facing catalog + audience document, computed live from the app's own data
 * every time it's called: the course catalog comes straight from COURSES_DATA (the same array every
 * lesson-facing screen reads), and the audience numbers come from whatever AdminStatsOverview the
 * caller already fetched. Nothing here is fabricated or cached — re-running this after new lessons
 * ship or the user base grows reflects both changes immediately.
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

  const subjectTotals: Record<string, number> = {};
  for (const grade of GRADES) {
    for (const [subject, count] of Object.entries(byGrade[grade].subjects)) {
      subjectTotals[subject] = (subjectTotals[subject] || 0) + count;
    }
  }
  const subjectPieEntries: PieEntry[] = Object.entries(subjectTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([subject, value]) => ({
      label: subjectLabel(subject, SUBJECT_LABEL_FR),
      value,
      color: SUBJECT_COLORS[subject] || FALLBACK_COLOR,
    }));

  const wilayaEntries = Object.entries(stats.wilayaDistribution || {})
    .filter(([code]) => code !== 'UNKNOWN')
    .sort((a, b) => b[1] - a[1]);
  const unknownWilaya = stats.wilayaDistribution?.UNKNOWN || 0;

  const topWilayas = wilayaEntries.slice(0, 6);
  const otherWilayasTotal = wilayaEntries.slice(6).reduce((sum, [, v]) => sum + v, 0);
  const wilayaPieEntries: PieEntry[] = [
    ...topWilayas.map(([code, value], i) => ({
      label: `${code} — ${WILAYA_NAME_AR[code] || code}`,
      value,
      color: WILAYA_PALETTE[i % WILAYA_PALETTE.length],
    })),
    ...(otherWilayasTotal > 0 ? [{ label: 'Autres wilayas', value: otherWilayasTotal, color: '#94A3B8' }] : []),
    ...(unknownWilaya > 0 ? [{ label: 'Non renseignée', value: unknownWilaya, color: '#CBD5E1' }] : []),
  ];

  const gradeSections = GRADES.map((grade, idx) => {
    const bucket = byGrade[grade];
    const subjectRows = Object.entries(bucket.subjects)
      .sort((a, b) => b[1] - a[1])
      .map(([subject, count]) => {
        const pct = bucket.total > 0 ? (count / bucket.total) * 100 : 0;
        const color = SUBJECT_COLORS[subject] || FALLBACK_COLOR;
        return `
      <div class="bar-row">
        <div class="bar-label"><span class="swatch" style="background:${color}"></span><span class="fr">${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_FR))}</span><span class="ar">${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_AR))}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%; background:${color}"></div></div>
        <div class="bar-count mono">${count}</div>
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
        const color = SUBJECT_COLORS[subject] || FALLBACK_COLOR;
        const tag = `Extrait · ${escapeHtml(subjectLabel(subject, SUBJECT_LABEL_FR))}`;
        if (SUBJECTS_ALREADY_LATIN.has(subject)) {
          return `
      <div class="exhibit" style="border-top-color:${color}"><span class="tag" style="color:${color}">${tag}</span><p class="quote fr">${escapeHtml(sample.title)}</p></div>`;
        }
        const gloss = LESSON_GLOSS_FR[sample.id] || '(traduction non disponible pour cet extrait)';
        return `
      <div class="exhibit" style="border-top-color:${color}"><span class="tag" style="color:${color}">${tag}</span><p class="quote ar">${escapeHtml(sample.title)}</p><p class="quote-fr">${escapeHtml(gloss)}</p></div>`;
      })
      .join('');

    return `
  <section class="card grade" id="g${grade}">
    <div class="grade-head">
      <span class="grade-num" style="background:${GRADE_BAR_COLORS[grade]}">${idx + 1}</span>
      <span class="grade-title">${grade} <span class="ar">${GRADE_NAME_AR[grade]}</span></span>
      <div class="grade-total"><b class="mono" style="color:${GRADE_BAR_COLORS[grade]}">${bucket.total}</b><span>leçons</span></div>
    </div>
    <div class="bars">${subjectRows}</div>
    <div class="exhibits">${exhibits}</div>
  </section>`;
  }).join('');

  const growthBars = GRADES.map((g) => {
    const h = (byGrade[g].total / growthMax) * 100;
    return `<div class="gbar"><span class="gbar-val mono">${byGrade[g].total}</span><div class="gbar-fill" style="height:${h.toFixed(0)}%; background:${GRADE_BAR_COLORS[g]}"></div><span class="gbar-lbl">${g}</span></div>`;
  }).join('');

  const navPills = GRADES.map((g) => `<a href="#g${g}" style="border-color:${GRADE_BAR_COLORS[g]}22"><b style="color:${GRADE_BAR_COLORS[g]}">${g}</b><small>${byGrade[g].total} leçons</small></a>`).join('');

  const subjectCount = new Set(GRADES.flatMap((g) => Object.keys(byGrade[g].subjects))).size;
  const generatedAt = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Catalogue MSSID — export partenaire</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Mulish:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
  :root{
    --bg:#F5F6FC; --card:#FFFFFF; --ink:#171A2B; --ink-soft:#4B4F63; --muted:#767A90;
    --line:#E7E8F3; --accent1:#4F46E5; --accent2:#7C3AED; --accent3:#06B6D4;
    --shadow: 0 8px 24px rgba(23,26,43,.08); --shadow-sm: 0 2px 8px rgba(23,26,43,.06);
  }
  *{ box-sizing:border-box; }
  body{ margin:0; background:var(--bg); color:var(--ink); font-family:'Mulish', -apple-system, 'Segoe UI', sans-serif; line-height:1.55; }
  .ar{ font-family:'Noto Naskh Arabic', 'Traditional Arabic', serif; direction:rtl; unicode-bidi:isolate; }
  .mono{ font-family:'IBM Plex Mono', ui-monospace, monospace; font-variant-numeric:tabular-nums; }
  .page{ max-width:900px; margin:0 auto; padding:32px 20px 72px; }
  .card{ background:var(--card); border-radius:20px; box-shadow:var(--shadow-sm); padding:28px; margin-bottom:22px; }

  header.hero{
    background:linear-gradient(135deg, var(--accent1), var(--accent2) 65%, var(--accent3));
    border-radius:24px; padding:36px 32px; color:#fff; box-shadow:var(--shadow); margin-bottom:24px;
    position:relative; overflow:hidden;
  }
  header.hero::after{ content:""; position:absolute; inset:-40% -20% auto auto; width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,.10); }
  .eyebrow{ font-family:'IBM Plex Mono', monospace; font-size:11.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.85); margin:0 0 12px; position:relative; }
  .head-row{ display:flex; align-items:center; gap:24px; flex-wrap:wrap; position:relative; }
  h1{ font-family:'Poppins', sans-serif; font-weight:800; font-size:44px; line-height:1; margin:0; color:#fff; text-wrap:balance; }
  .hero-badge{ flex-shrink:0; padding:14px 22px; border-radius:16px; background:rgba(255,255,255,.16); backdrop-filter:blur(4px); text-align:center; }
  .hero-badge b{ font-family:'Poppins', sans-serif; font-size:30px; line-height:1; font-weight:800; display:block; color:#fff; }
  .hero-badge span{ font-family:'IBM Plex Mono', monospace; font-size:9.5px; letter-spacing:.06em; text-transform:uppercase; color:rgba(255,255,255,.85); }
  .subtitle{ max-width:64ch; margin:16px 0 0; color:rgba(255,255,255,.92); font-size:15px; position:relative; }
  .subtitle .ar{ color:#fff; }

  .growth{ margin-top:26px; display:flex; align-items:flex-end; gap:16px; height:100px; position:relative; }
  .gbar{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:6px; height:100%; }
  .gbar-fill{ width:100%; max-width:42px; border-radius:6px 6px 2px 2px; box-shadow:0 4px 10px rgba(0,0,0,.18); }
  .gbar-val{ font-size:12px; color:#fff; font-weight:600; }
  .gbar-lbl{ font-family:'IBM Plex Mono', monospace; font-size:10.5px; color:rgba(255,255,255,.85); }

  .intro{ padding:4px 4px 4px; font-size:15px; color:var(--ink-soft); max-width:70ch; }

  nav.jump{ display:flex; gap:10px; flex-wrap:wrap; margin:18px 0 26px; }
  nav.jump a{ display:flex; flex-direction:column; align-items:center; gap:2px; padding:9px 16px; border:2px solid; border-radius:12px; text-decoration:none; color:var(--ink); background:var(--card); box-shadow:var(--shadow-sm); }
  nav.jump a b{ font-family:'Poppins', sans-serif; font-size:15px; }
  nav.jump a small{ font-family:'IBM Plex Mono', monospace; color:var(--muted); font-size:10px; }

  .section-title{ font-family:'Poppins', sans-serif; font-weight:700; font-size:19px; margin:0 0 18px; display:flex; align-items:center; gap:10px; }
  .section-title .dot{ width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg, var(--accent1), var(--accent3)); flex-shrink:0; }

  .pie-grid{ display:grid; grid-template-columns:1fr 1fr; gap:24px; }
  @media (max-width:640px){ .pie-grid{ grid-template-columns:1fr; } }
  .pie-block{ display:flex; flex-direction:column; gap:14px; }
  .pie-block h3{ font-family:'Poppins', sans-serif; font-size:14px; font-weight:600; color:var(--ink-soft); margin:0; text-align:center; }
  .pie-block svg{ display:block; margin:0 auto; max-width:220px; }
  .legend{ display:flex; flex-direction:column; gap:7px; }
  .legend-row{ display:grid; grid-template-columns:12px 1fr auto; align-items:center; gap:9px; font-size:12.5px; }
  .swatch{ width:12px; height:12px; border-radius:4px; flex-shrink:0; display:inline-block; }
  .legend-label{ color:var(--ink-soft); }
  .legend-val{ color:var(--ink); font-weight:600; font-size:11.5px; }

  section.grade{ scroll-margin-top:16px; }
  .grade-head{ display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; margin-bottom:20px; }
  .grade-num{ font-family:'Poppins', sans-serif; font-weight:700; font-size:13px; width:28px; height:28px; border-radius:9px; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .grade-title{ font-family:'Poppins', sans-serif; font-weight:700; font-size:21px; }
  .grade-title .ar{ font-weight:600; font-size:16px; color:var(--muted); margin-inline-start:10px; }
  .grade-total{ margin-inline-start:auto; text-align:end; }
  .grade-total b{ font-family:'IBM Plex Mono', monospace; font-size:22px; }
  .grade-total span{ display:block; font-size:10.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }

  .bars{ display:flex; flex-direction:column; gap:11px; margin-bottom:22px; }
  .bar-row{ display:grid; grid-template-columns:180px 1fr 32px; align-items:center; gap:12px; }
  .bar-label{ display:flex; align-items:baseline; gap:6px; line-height:1.25; overflow:hidden; }
  .bar-label .fr{ font-size:13px; font-weight:600; white-space:nowrap; }
  .bar-label .ar{ font-size:11.5px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .bar-track{ height:10px; background:var(--line); border-radius:6px; overflow:hidden; }
  .bar-fill{ height:100%; border-radius:6px; }
  .bar-count{ font-size:13px; text-align:end; color:var(--ink-soft); }

  .exhibits{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media (max-width:560px){ .exhibits{ grid-template-columns:1fr; } .bar-row{ grid-template-columns:130px 1fr 28px; } }
  .exhibit{ background:var(--bg); border-radius:12px; padding:16px 18px; border-top:4px solid; }
  .exhibit .tag{ font-family:'IBM Plex Mono', monospace; font-size:9.5px; letter-spacing:.08em; text-transform:uppercase; margin-bottom:8px; display:block; font-weight:600; }
  .exhibit .quote{ font-size:15.5px; line-height:1.7; margin:0; }
  .exhibit .quote.ar{ text-align:right; }
  .exhibit .quote.fr{ font-family:'Poppins', sans-serif; font-weight:600; font-size:13.5px; }
  .exhibit .quote-fr{ margin:8px 0 0; padding-top:8px; border-top:1px dashed var(--line); font-size:12.5px; color:var(--muted); font-style:italic; }

  .stat-grid{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:8px; }
  @media (max-width:560px){ .stat-grid{ grid-template-columns:1fr 1fr; } }
  .stat-tile{ background:var(--bg); border-radius:14px; padding:16px; text-align:center; }
  .stat-tile b{ display:block; font-family:'Poppins', sans-serif; font-size:24px; }
  .stat-tile span{ font-size:11.5px; color:var(--muted); }

  footer{ text-align:center; margin-top:8px; }
  .note{ font-size:12px; color:var(--muted); max-width:64ch; margin:0 auto; }
</style>
</head>
<body>
<div class="page">

  <header class="hero">
    <p class="eyebrow">Catalogue &amp; audience — export du ${escapeHtml(generatedAt)}</p>
    <div class="head-row">
      <h1>MSSID</h1>
      <div class="hero-badge"><b>${totalLessons}</b><span>leçons</span></div>
      <div class="hero-badge"><b>${stats.totalUsers}</b><span>comptes</span></div>
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
    représentée, suivie de l'audience actuelle (comptes actifs et répartition géographique par wilaya).
  </p>

  <nav class="jump" aria-label="Aller à un niveau">${navPills}</nav>

  <section class="card">
    <h2 class="section-title"><span class="dot"></span>Vue d'ensemble</h2>
    <div class="pie-grid">
      <div class="pie-block">
        <h3>Contenu par matière</h3>
        ${pieChart3D(subjectPieEntries)}
        <div class="legend">${pieLegend(subjectPieEntries)}</div>
      </div>
      <div class="pie-block">
        <h3>Comptes par wilaya</h3>
        ${wilayaPieEntries.length > 0 ? pieChart3D(wilayaPieEntries) : '<p class="note" style="text-align:center;">Pas encore de donnée wilaya.</p>'}
        <div class="legend">${pieLegend(wilayaPieEntries)}</div>
      </div>
    </div>
  </section>

  ${gradeSections}

  <section class="card">
    <h2 class="section-title"><span class="dot"></span>Audience actuelle</h2>
    <div class="stat-grid">
      <div class="stat-tile"><b style="color:var(--accent1)">${stats.dailyActiveUsers}</b><span>actifs aujourd'hui</span></div>
      <div class="stat-tile"><b style="color:var(--accent2)">${stats.weeklyActiveUsers}</b><span>actifs 7 jours</span></div>
      <div class="stat-tile"><b style="color:var(--accent3)">${stats.monthlyActiveUsers}</b><span>actifs 30 jours</span></div>
      <div class="stat-tile"><b style="color:#EE5253">${stats.retentionRate7Days.toFixed(1)}%</b><span>rétention 7 jours</span></div>
      <div class="stat-tile"><b style="color:#F9A826">${stats.retentionRate30Days.toFixed(1)}%</b><span>rétention 30 jours</span></div>
      <div class="stat-tile"><b style="color:#10AC84">${stats.newUsersLast30Days}</b><span>nouveaux (30 jours)</span></div>
    </div>
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
