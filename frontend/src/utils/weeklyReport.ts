import type { PrimaryGrade } from '../types';
import { weeklySessions, type ParentNotebook, type ParentNotebookSession, type WeeklyPlan } from './competenceProgress';
import { getCahier } from '../data/cahiers/competenceCahiers';
import { PLAY_STORE_URL } from './appPlatform';

/**
 * Weekly parent report ("حصيلة الأسبوع") shared as an image on WhatsApp. Built only from the parent
 * notebook (competence stats + lesson sessions): it never claims mastery from a single success.
 */
export interface WeeklyReport {
  childName: string;
  grade: PrimaryGrade;
  fromDate: string;
  toDate: string;
  weekSessions: number;
  weekSuccesses: number;
  /** Exercise successes alone / with a hint this week (« réussi seul » vs « avec aide »). */
  weekAlone: number;
  weekHelped: number;
  /** Competences succeeded this week (newest first, unique). */
  successes: { ar: string; fr: string }[];
  /** Competences to review (carnet state). */
  toReview: { ar: string; fr: string }[];
  reviewCount: number;
  next?: { ar: string; fr: string; minutes: number; cahierTitleAr?: string };
  /** Short report of free families: how many lines were left for the detailed report. */
  light?: { moreSuccesses: number; moreToReview: number };
}

/**
 * Short weekly report, free for every family: the week's counts, one success, one point to review
 * and tomorrow's advice. The alone/with-a-hint split, the full lists and the catch-up cahier stay in
 * the detailed report (`weeklyReportShare`). Same rule as the e-mail (backend WeeklyReportBuilder).
 */
export function lightWeeklyReport(report: WeeklyReport): WeeklyReport {
  return {
    ...report,
    weekAlone: 0,
    weekHelped: 0,
    successes: report.successes.slice(0, 1),
    toReview: report.toReview.slice(0, 1),
    next: report.next ? { ar: report.next.ar, fr: report.next.fr, minutes: report.next.minutes } : undefined,
    light: {
      moreSuccesses: Math.max(0, report.successes.length - 1),
      moreToReview: Math.max(0, report.reviewCount - 1),
    },
  };
}

/** « + 2 autres dans le bilan détaillé » — no price, no payment word: also shown in the Android app. */
export function lightReportNote(report: WeeklyReport, locale: 'ar' | 'fr'): string | null {
  const more = report.light ? report.light.moreSuccesses + report.light.moreToReview : 0;
  if (more <= 0) return null;
  return locale === 'fr' ? `+ ${more} autre(s) ligne(s) dans le bilan détaillé.` : `+ ${more} سطر آخر في الحصيلة المفصّلة.`;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_ITEMS = 3;

export function buildWeeklyReport(notebook: ParentNotebook, plan: WeeklyPlan, now: Date = new Date()): WeeklyReport {
  const weekAgo = new Date(now.getTime() - WEEK_MS);
  const recent = weeklySessions(notebook, now);
  const successful = recent.filter(session => session.outcome === 'success');
  const count = (sessions: ParentNotebookSession[]) => sessions.reduce((sum, session) => sum + (session.count ?? 1), 0);
  const seen = new Set<string>();
  const successes: WeeklyReport['successes'] = [];
  for (const session of recent) {
    if (session.outcome !== 'success') continue;
    session.competenceIds.forEach((id, i) => {
      if (seen.has(id) || successes.length >= MAX_ITEMS) return;
      seen.add(id);
      successes.push({ ar: session.labelsAr[i] ?? id, fr: session.labelsFr[i] ?? id });
    });
  }
  const next = plan.next
    ? { ar: plan.next.labelAr, fr: plan.next.labelFr, minutes: plan.minutes, cahierTitleAr: getCahier(plan.next.competenceId)?.titleAr }
    : undefined;
  return {
    childName: notebook.childName,
    grade: notebook.grade,
    fromDate: weekAgo.toISOString().slice(0, 10),
    toDate: now.toISOString().slice(0, 10),
    weekSessions: count(recent),
    weekSuccesses: count(successful),
    weekAlone: count(successful.filter(session => session.helped === false)),
    weekHelped: count(successful.filter(session => session.helped === true)),
    successes,
    toReview: notebook.review.slice(0, MAX_ITEMS).map((r) => ({ ar: r.labelAr, fr: r.labelFr })),
    reviewCount: plan.reviewCount,
    next,
  };
}

const formatDate = (iso: string, locale: 'ar' | 'fr') =>
  new Intl.DateTimeFormat(locale === 'fr' ? 'fr-DZ' : 'ar-DZ', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

/** Plain-text version: WhatsApp message under the image, and the fallback when images cannot be shared. */
export function formatWeeklyReportText(report: WeeklyReport, locale: 'ar' | 'fr'): string {
  const fr = locale === 'fr';
  const period = `${formatDate(report.fromDate, locale)} – ${formatDate(report.toDate, locale)}`;
  const lines: string[] = [];
  if (fr) {
    lines.push(`📒 Bilan de la semaine — ${report.childName} (${report.grade})`, period, '');
    lines.push(`✅ ${report.weekSessions} séance(s), ${report.weekSuccesses} réussie(s).`);
    if (report.weekAlone + report.weekHelped > 0) lines.push(`💪 Exercices : ${report.weekAlone} réussi(s) seul, ${report.weekHelped} avec un indice.`);
    if (report.successes.length) lines.push(`Réussi : ${report.successes.map((s) => s.fr).join(' · ')}`);
    lines.push(report.toReview.length ? `🔁 À revoir : ${report.toReview.map((s) => s.fr).join(' · ')}` : '🔁 Rien à revoir pour le moment.');
    if (report.next) lines.push(`👉 Conseil : ${report.next.minutes} min sur « ${report.next.fr} »${report.next.cahierTitleAr ? ` (cahier : ${report.next.cahierTitleAr})` : ''}.`);
    const note = lightReportNote(report, 'fr');
    if (note) lines.push(note);
    lines.push('', `مَسِيد DZ — ${PLAY_STORE_URL}`);
  } else {
    lines.push(`📒 حصيلة الأسبوع — ${report.childName} (${report.grade})`, period, '');
    lines.push(`✅ ${report.weekSessions} حصة، منها ${report.weekSuccesses} ناجحة.`);
    if (report.weekAlone + report.weekHelped > 0) lines.push(`💪 التمارين: ${report.weekAlone} بمفرده، ${report.weekHelped} بمساعدة تلميح.`);
    if (report.successes.length) lines.push(`نجح في: ${report.successes.map((s) => s.ar).join(' · ')}`);
    lines.push(report.toReview.length ? `🔁 للمراجعة: ${report.toReview.map((s) => s.ar).join(' · ')}` : '🔁 لا شيء للمراجعة حالياً.');
    if (report.next) lines.push(`👉 نصيحة: ${report.next.minutes} دقيقة حول «${report.next.ar}»${report.next.cahierTitleAr ? ` (كراس: ${report.next.cahierTitleAr})` : ''}.`);
    const note = lightReportNote(report, 'ar');
    if (note) lines.push(note);
    lines.push('', `مَسِيد DZ — ${PLAY_STORE_URL}`);
  }
  return lines.join('\n');
}

/** 1080×1350 card (WhatsApp/Instagram portrait). Browser canvas only; resolves null when unavailable. */
export async function drawWeeklyReportCard(report: WeeklyReport, locale: 'ar' | 'fr'): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  let ctx: CanvasRenderingContext2D | null = null;
  try {
    ctx = canvas.getContext('2d');
  } catch {
    return null;
  }
  if (!ctx) return null;
  const fr = locale === 'fr';
  const rtl = !fr;
  const W = 1080;
  const M = 80;
  const font = (size: number, weight = 700) => `${weight} ${size}px "Segoe UI", Tahoma, "Noto Naskh Arabic", Arial, sans-serif`;
  ctx.direction = rtl ? 'rtl' : 'ltr';
  ctx.textAlign = rtl ? 'right' : 'left';
  const x = rtl ? W - M : M;

  ctx.fillStyle = '#FFFBF2';
  ctx.fillRect(0, 0, W, 1350);
  ctx.fillStyle = '#0B6B4F';
  ctx.fillRect(0, 0, W, 250);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = font(34, 600);
  ctx.fillText(fr ? 'Bilan de la semaine' : 'حصيلة الأسبوع', x, 95);
  ctx.font = font(64, 800);
  ctx.fillText(`${report.childName} · ${report.grade}`, x, 175);
  ctx.font = font(30, 500);
  ctx.fillText(`${formatDate(report.fromDate, locale)} – ${formatDate(report.toDate, locale)}`, x, 222);

  const wrap = (text: string, maxWidth: number) => {
    const words = text.split(/\s+/);
    const out: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx!.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = w;
      } else line = test;
    }
    if (line) out.push(line);
    return out;
  };
  let y = 330;
  const block = (title: string, color: string, items: string[], empty: string) => {
    ctx!.fillStyle = color;
    ctx!.font = font(40, 800);
    ctx!.fillText(title, x, y);
    y += 58;
    ctx!.fillStyle = '#1C2321';
    ctx!.font = font(34, 500);
    const list = items.length ? items : [empty];
    for (const item of list) {
      for (const [i, line] of wrap(item, W - 2 * M - 40).entries()) {
        ctx!.fillText(i === 0 ? `• ${line}` : `  ${line}`, x, y);
        y += 48;
      }
    }
    y += 34;
  };
  block(
    fr ? `✅ ${report.weekSessions} séance(s), ${report.weekSuccesses} réussie(s)` : `✅ ${report.weekSessions} حصة، ${report.weekSuccesses} ناجحة`,
    '#0B6B4F',
    [
      ...(report.weekAlone + report.weekHelped > 0 ? [fr ? `💪 ${report.weekAlone} seul · ${report.weekHelped} avec un indice` : `💪 ${report.weekAlone} بمفرده · ${report.weekHelped} بمساعدة تلميح`] : []),
      ...report.successes.map((s) => (fr ? s.fr : s.ar)),
    ],
    fr ? 'Pas encore de réussite cette semaine.' : 'لا نجاح مسجّل هذا الأسبوع بعد.',
  );
  block(fr ? '🔁 À revoir' : '🔁 للمراجعة', '#A86B00', report.toReview.map((s) => (fr ? s.fr : s.ar)), fr ? 'Rien à revoir pour le moment.' : 'لا شيء للمراجعة حالياً.');
  if (report.next) {
    block(
      fr ? `👉 Conseil : ${report.next.minutes} min` : `👉 نصيحة: ${report.next.minutes} دقيقة`,
      '#1D4ED8',
      [fr ? report.next.fr : report.next.ar, ...(report.next.cahierTitleAr ? [`${fr ? 'Cahier' : 'كراس'} : ${report.next.cahierTitleAr}`] : [])],
      '',
    );
  }
  const note = lightReportNote(report, locale);
  if (note) {
    ctx.fillStyle = '#475569';
    ctx.font = font(30, 600);
    ctx.fillText(note, x, Math.min(y, 1190));
  }
  ctx.fillStyle = '#0B6B4F';
  ctx.fillRect(0, 1230, W, 120);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = font(40, 800);
  ctx.textAlign = 'center';
  ctx.fillText('مَسِيد DZ', W / 2, 1302);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(blob);
    };
    // An unresponsive WebView must not prevent the existing text-sharing fallback.
    const timer = setTimeout(() => finish(null), 3000);
    try {
      canvas.toBlob(finish, 'image/png');
    } catch {
      finish(null);
    }
  });
}
