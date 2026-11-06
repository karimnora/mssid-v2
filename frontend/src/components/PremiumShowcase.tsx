import React from 'react';
import home from '../assets/premium-showcase/home.webp';
import voice from '../assets/premium-showcase/voice.webp';
import manipulation from '../assets/premium-showcase/manipulation.webp';
import support from '../assets/premium-showcase/support.webp';
import report from '../assets/premium-showcase/report.webp';
import { useLocaleContext } from '../context/LocaleContext';
const captures = [
  { src: home, ar: 'مسار واضح حسب المستوى', fr: 'Un parcours adapté au niveau' },
  { src: voice, ar: 'ديدو يشرح ويرافق بالصوت', fr: 'Didou accompagne avec sa voix' },
  { src: manipulation, ar: 'أفهم باللمس والتجربة', fr: 'Comprendre en manipulant' },
  { src: support, ar: 'تدريب وتلميحات عند الحاجة', fr: 'Entraînement et indices utiles' },
  { src: report, ar: 'ملاحظات واضحة للولي', fr: 'Des observations pour les parents' },
];
export function PremiumShowcase() {
  const { locale } = useLocaleContext();
  const ar = locale === 'ar';
  return <section data-premium-showcase className="space-y-4 text-base text-[#184d3c]">
    <h3 className="text-xl font-extrabold">{ar ? 'شاهد تجربة التعلّم مع ديدو' : 'Découvrez l’expérience avec Didou'}</h3>
    <p>{ar ? 'لقطات حقيقية من التطبيق بملف تجريبي، وليست نتائج لطفلك. دروس البرنامج والمختبرات المجانية تبقى متاحة.' : 'Captures réelles sur un profil de démonstration, pas les résultats de votre enfant. Les cours et laboratoires gratuits restent disponibles.'}</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {captures.map(c => <figure key={c.src} className="rounded-2xl border-2 border-[#ddcda7] bg-[#FFFBF0] p-2 space-y-2">
        <a href={c.src} target="_blank" rel="noreferrer" aria-label={(ar ? 'تكبير: ' : 'Agrandir : ') + (ar ? c.ar : c.fr)} className="block rounded-xl focus-visible:outline outline-offset-2 min-h-[60px]">
          <img src={c.src} alt={ar ? c.ar : c.fr} loading="lazy" width="390" height="844" className="w-full h-auto rounded-xl" />
        </a>
        <figcaption className="font-bold">{ar ? c.ar : c.fr}</figcaption>
      </figure>)}
    </div>
    <p className="font-bold">{ar ? 'اشتراك واحد لما يصل إلى 6 أطفال. عند انتهاء الاشتراك، يعود الحساب إلى المجاني دون حذف التقدّم.' : 'Un abonnement pour jusqu’à 6 enfants. À son expiration, retour au gratuit sans suppression des progrès.'}</p>
  </section>;
}
