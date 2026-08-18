import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocaleContext } from '../context/LocaleContext';

const metadata = {
  ar: {
    title: 'mssid dz | المنصة التعليمية الجزائرية للابتدائي',
    description:
      'منصة مَسِيد الجزائر للتعليم الابتدائي: دروس، تمارين، امتحانات 5AP، دعم BaridiMob، Edahabia/CIB، وحلول رسمية.',
    keywords: 'mssid, تعليم ابتدائي, الجزائر, BaridiMob, Edahabia, CIB, امتحانات 5AP, تمارين, دروس',
  },
  fr: {
    title: 'mssid dz | Plateforme éducative algérienne primaire',
    description:
      "mssid dz pour le primaire algérien : leçons, exercices, examens 5AP, BaridiMob, Edahabia/CIB et solutions officielles.",
    keywords: 'mssid, éducation primaire, Algérie, BaridiMob, Edahabia, CIB, 5AP, exercices, leçons',
  },
  en: {
    title: 'mssid dz | Algerian primary learning platform',
    description:
      'mssid dz for Algerian primary education: lessons, exercises, 5AP exams, BaridiMob, Edahabia/CIB and official solutions.',
    keywords: 'mssid, primary education, Algeria, BaridiMob, Edahabia, CIB, 5AP, exercises, lessons',
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
  url: 'https://mssid.dz/',
  logo: 'https://mssid.dz/pwa-512x512.png',
  description: metadata.ar.description,
  areaServed: 'DZ',
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Mssid DZ',
  url: 'https://mssid.dz/',
  inLanguage: 'ar',
};

const COURSE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'برنامج التعليم الابتدائي الجزائري - مَسِيد DZ',
  description: metadata.ar.description,
  provider: { '@type': 'Organization', name: 'Mssid DZ', sameAs: 'https://mssid.dz/' },
  url: 'https://mssid.dz/',
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
      <meta property="og:url" content="https://mssid.dz/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={localeMeta.title} />
      <meta name="twitter:description" content={localeMeta.description} />
      <link rel="canonical" href="https://mssid.dz/" />
      <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(WEBSITE_JSON_LD)}</script>
      <script type="application/ld+json">{JSON.stringify(COURSE_JSON_LD)}</script>
    </Helmet>
  );
};
