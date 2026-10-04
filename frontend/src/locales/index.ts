import { common as commonAr } from './ar/common';
import { navigation as navigationAr } from './ar/navigation';
import { home as homeAr } from './ar/home';
import { auth as authAr } from './ar/auth';
import { admin as adminAr } from './ar/admin';
import { challenges as challengesAr } from './ar/challenges';
import { contact as contactAr } from './ar/contact';
import { courses as coursesAr } from './ar/courses';
import { exams as examsAr } from './ar/exams';
import { labsLanguage as labsLanguageAr } from './ar/labsLanguage';
import { labsMath as labsMathAr } from './ar/labsMath';
import { labsScience as labsScienceAr } from './ar/labsScience';
import { labsSocial as labsSocialAr } from './ar/labsSocial';
import { labsImmersive as labsImmersiveAr } from './ar/labsImmersive';
import { meta as metaAr } from './ar/meta';
import { subscription as subscriptionAr } from './ar/subscription';
import { tools as toolsAr } from './ar/tools';

import { common as commonFr } from './fr/common';
import { navigation as navigationFr } from './fr/navigation';
import { home as homeFr } from './fr/home';
import { auth as authFr } from './fr/auth';
import { admin as adminFr } from './fr/admin';
import { challenges as challengesFr } from './fr/challenges';
import { contact as contactFr } from './fr/contact';
import { courses as coursesFr } from './fr/courses';
import { exams as examsFr } from './fr/exams';
import { labsLanguage as labsLanguageFr } from './fr/labsLanguage';
import { labsMath as labsMathFr } from './fr/labsMath';
import { labsScience as labsScienceFr } from './fr/labsScience';
import { labsSocial as labsSocialFr } from './fr/labsSocial';
import { labsImmersive as labsImmersiveFr } from './fr/labsImmersive';
import { meta as metaFr } from './fr/meta';
import { subscription as subscriptionFr } from './fr/subscription';
import { tools as toolsFr } from './fr/tools';

const arStrings = {
  common: commonAr,
  navigation: navigationAr,
  home: homeAr,
  auth: authAr,
  admin: adminAr,
  challenges: challengesAr,
  contact: contactAr,
  courses: coursesAr,
  exams: examsAr,
  labsLanguage: labsLanguageAr,
  labsMath: labsMathAr,
  labsScience: labsScienceAr,
  labsSocial: labsSocialAr,
  labsImmersive: labsImmersiveAr,
  meta: metaAr,
  subscription: subscriptionAr,
  tools: toolsAr,
};

const frStrings: typeof arStrings = {
  common: commonFr,
  navigation: navigationFr,
  home: homeFr,
  auth: authFr,
  admin: adminFr,
  challenges: challengesFr,
  contact: contactFr,
  courses: coursesFr,
  exams: examsFr,
  labsLanguage: labsLanguageFr,
  labsMath: labsMathFr,
  labsScience: labsScienceFr,
  labsSocial: labsSocialFr,
  labsImmersive: labsImmersiveFr,
  meta: metaFr,
  subscription: subscriptionFr,
  tools: toolsFr,
};

export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: arStrings,
  },
  fr: {
    code: 'fr' as const,
    direction: 'ltr' as const,
    strings: frStrings,
  },
};

export type AppLocale = keyof typeof locales;
export type LocaleStrings = typeof locales['ar']['strings'];
