import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocaleContext } from '../context/LocaleContext';

const metadata = {
  ar: {
    title: 'mssid dz | المنصة التعليمية الجزائرية للابتدائي',
    description:
      'مَسِيد DZ للتعليم التحضيري والابتدائي في الجزائر: دروس وتمارين وتقييمات وأنشطة تفاعلية من التحضيري إلى السنة الخامسة.',
    keywords: 'mssid, تعليم تحضيري, تعليم ابتدائي, الجزائر, السنة الخامسة, تمارين, دروس, أنشطة تفاعلية',
  },
  fr: {
    title: 'mssid dz | Plateforme éducative algérienne primaire',
    description:
      "Mssid DZ accompagne les enfants du préscolaire à la 5AP en Algérie avec des leçons, exercices, évaluations et activités interactives.",
    keywords: 'mssid, préscolaire, primaire, Algérie, 5AP, exercices, leçons, activités interactives',
  },
  en: {
    title: 'mssid dz | Algerian primary learning platform',
    description:
      'Mssid DZ helps children in Algeria learn from preschool to 5AP with lessons, exercises, assessments and interactive activities.',
    keywords: 'mssid, preschool, primary education, Algeria, 5AP, exercises, lessons, interactive activities',
  },
};

// Organization + WebSite describe the site itself, not a specific page, so they're stable regardless
// of app state. Course describes the whole 1AP-5AP catalog as one entity rather than one Course per
// subject: the app has a single real URL (no client-side router), so fragmenting into many Course
// objects that all repeat that same `url` would look repetitive/spammy to crawlers for no benefit —
// this can split into distinct per-subject entries once real per-course pages exist to point to.
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mssid DZ',
  url: 'https://mssid-dz.com/',
  logo: 'https://mssid-dz.com/pwa-512x512.png',
  description: metadata.ar.description,
  areaServed: 'DZ',
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mssid DZ',
  url: 'https://mssid-dz.com/',
  inLanguage: 'ar',
};

const COURSE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'برنامج التعليم الابتدائي الجزائري - مَسِيد DZ',
  description: metadata.ar.description,
  provider: { '@type': 'Organization', name: 'Mssid DZ', sameAs: 'https://mssid-dz.com/' },
  url: 'https://mssid-dz.com/',
  hasCourseInstance: ['1AP', '2AP', '3AP', '4AP', '5AP'].map((grade) => ({
    '@type': 'CourseInstance',
    name: grade,
    courseMode: 'online',
  })),
};

export const SeoHead: React.FC = () => {
  const { locale, direction } = useLocaleContext();
  const localeMeta = metadata[locale] || metadata.ar;

  return (
    <Helmet>
      <html lang={locale} dir={direction} />
      <title>{localeMeta.title}</title>
      <meta name="description" content={localeMeta.description} />
      <meta name="keywords" content={localeMeta.keywords} />
      <meta property="og:title" content={localeMeta.title} />
      <meta property="og:description" content={localeMeta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://mssid-dz.com/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={localeMeta.title} />
      <meta name="twitter:description" content={localeMeta.description} />
      <link rel="canonical" href="https://mssid-dz.com/" />
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(COURSE_JSON_LD)}</script>
    </Helmet>
  );
};
