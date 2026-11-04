import { Icon3d, type Icon3dName } from '../art3d/Icon3d';
import { SubjectArt3d } from '../subjectArt3d';
import type { PlanetShelfGroup, PlanetShelfItem } from './PlanetShelf';

/** The labs the shelf can open directly, with their 3D icon. Only those available for the grade are shown. */
const FOCUSED_LABS: Array<{ id: string; icon: Icon3dName; ar: string; fr: string }> = [
  { id: 'primary_math_ops', icon: 'geometry', ar: 'مختبر الرياضيات', fr: 'Atelier de maths' },
  { id: 'wilayas_map', icon: 'algeria', ar: 'ولايات الجزائر', fr: "Wilayas d'Algérie" },
  { id: 'algerian_market', icon: 'market', ar: 'السوق الجزائري', fr: 'Le marché algérien' },
  { id: 'history_museum', icon: 'museum', ar: 'متحف التاريخ', fr: "Musée d'histoire" },
  { id: 'science_lab', icon: 'flask', ar: 'مخبر العلوم', fr: 'Labo de sciences' },
  { id: 'touch_writing', icon: 'pen', ar: 'أكتب بإصبعي', fr: "J'écris du doigt" },
  { id: 'tamazight_curriculum', icon: 'tifinagh', ar: 'الأمازيغية', fr: 'Tamazight' },
];

export interface PlanetShelfActions {
  locale: string;
  subjects: Array<{ id: string; nameAr: string; nameFr: string }>;
  availableLabIds: readonly string[];
  resumeTitle?: string | null;
  onResume?: () => void;
  onOpenSubject: (id: string) => void;
  onOpenAllCourses: () => void;
  onOpenExams: () => void;
  onOpenChallenges: () => void;
  onOpenLabsCatalog: () => void;
  onOpenLab: (id: string) => void;
  onOpenDressingRoom: () => void;
  onOpenHonorCertificates: () => void;
  onOpenParents: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenPreschool?: () => void;
}

const icon = (name: Icon3dName) => <Icon3d name={name} className="w-full h-full" />;

/** Everything the classic home offers, grouped by what the child wants to do (« كل الأنشطة »). */
export function buildPlanetShelfGroups(a: PlanetShelfActions): PlanetShelfGroup[] {
  const ar = a.locale === 'ar';
  const T = (arText: string, frText: string) => (ar ? arText : frText);

  const learn: PlanetShelfItem[] = [];
  if (a.onResume) {
    learn.push({
      id: 'resume',
      label: a.resumeTitle ? T(`أكمل: ${a.resumeTitle}`, `Reprendre : ${a.resumeTitle}`) : T('أكمل من حيث توقفت', 'Reprendre'),
      icon: icon('star'),
      onOpen: a.onResume,
    });
  }
  learn.push({ id: 'courses', label: T('كل الدروس', 'Tous les cours'), icon: icon('book'), onOpen: a.onOpenAllCourses });
  for (const s of a.subjects) {
    learn.push({ id: `subject-${s.id}`, label: ar ? s.nameAr : s.nameFr, icon: <SubjectArt3d id={s.id} />, onOpen: () => a.onOpenSubject(s.id) });
  }

  const practice: PlanetShelfItem[] = [
    { id: 'exams', label: T('الامتحانات', 'Examens'), icon: icon('notebook'), onOpen: a.onOpenExams },
    { id: 'challenges', label: T('التحديات والألعاب', 'Défis et jeux'), icon: icon('trophy'), onOpen: a.onOpenChallenges },
    { id: 'labs', label: T('كل المختبرات والألعاب', 'Tous les ateliers et jeux'), icon: icon('puzzle'), onOpen: a.onOpenLabsCatalog },
  ];

  const discover: PlanetShelfItem[] = FOCUSED_LABS.filter((lab) => a.availableLabIds.includes(lab.id)).map((lab) => ({
    id: `lab-${lab.id}`,
    label: T(lab.ar, lab.fr),
    icon: icon(lab.icon),
    onOpen: () => a.onOpenLab(lab.id),
  }));

  const me: PlanetShelfItem[] = [
    { id: 'dressing-room', label: T('خزانة ديدو', 'Le vestiaire de Didou'), icon: icon('balloons'), onOpen: a.onOpenDressingRoom },
    { id: 'certificates', label: T('شهادات الشرف', "Certificats d'honneur"), icon: icon('graduation'), onOpen: a.onOpenHonorCertificates },
    { id: 'profile', label: T('ملفي', 'Mon profil'), icon: icon('heart'), onOpen: a.onOpenProfile },
  ];
  if (a.onOpenPreschool) me.push({ id: 'preschool', label: T('عالم التحضيري', 'Le monde du préscolaire'), icon: icon('letters'), onOpen: a.onOpenPreschool });

  const parents: PlanetShelfItem[] = [
    { id: 'parents', label: T('دفتر المتابعة', 'Carnet de suivi'), icon: icon('magnifier'), onOpen: a.onOpenParents },
    { id: 'settings', label: T('الإعدادات', 'Réglages'), icon: icon('clock'), onOpen: a.onOpenSettings },
  ];

  return [
    { id: 'learn', title: T('أتعلّم', "J'apprends"), items: learn },
    { id: 'practice', title: T('أتمرّن وأمتحن وألعب', "Je m'entraîne, je passe des examens, je joue"), items: practice },
    { id: 'discover', title: T('أكتشف', 'Je découvre'), items: discover },
    { id: 'me', title: T('أنا وديدو', 'Didou et moi'), items: me },
    { id: 'parents', title: T('ركن الأولياء', 'Le coin des parents'), items: parents },
  ];
}
