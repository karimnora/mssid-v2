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
    </Helmet>
  );
};
