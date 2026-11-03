import React, { useState } from 'react';
import { pickText, type JourneyWorld } from '../../data/journey/journeyWorlds';
import { DidouFull, MedalArt, StarIcon } from './DidouJourneyArt';
import { ArrowIcon, CoinIcon } from './JourneyMap';
import { JourneyRibbon, SpeakerIcon, type JourneySfx, type RibbonContent } from './JourneyRibbon';

export type DistrictId = 'journey' | 'courses' | 'labs' | 'medals' | 'parents';

interface PlanetHubProps {
  locale: string;
  userName: string;
  totalStars: number;
  coins: number;
  worlds: readonly JourneyWorld[] | null;
  claimedWorldIds: readonly string[];
  sound: boolean;
  onToggleSound: () => void;
  onOpenMap: () => void;
  onOpenCourses: () => void;
  onOpenLabs: () => void;
  onOpenParents: () => void;
  onExit: () => void;
  say: (text: string) => void;
  sfx: JourneySfx;
}

const flag = (
  <g transform="translate(86 6)">
    <path d="M0 0V40" stroke="#6b4a2a" strokeWidth="2.5" />
    <rect x="1" y="2" width="13" height="18" fill="#0f8a4b" />
    <rect x="14" y="2" width="13" height="18" fill="#fff" />
    <circle cx="14" cy="11" r="5.2" fill="#d6283b" />
    <circle cx="15.8" cy="11" r="4.2" fill="#fff" />
  </g>
);

const DISTRICT_ART: Record<DistrictId, React.ReactNode> = {
  journey: (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M10 108 Q40 84 60 96 T110 72" stroke="#fff" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="28" r="13" fill="#ffd23f" />
      <g transform="translate(66 60) rotate(32)">
        <path d="M0 -46 C15 -32 16 -8 14 12 H-14 C-16 -8 -15 -32 0 -46Z" fill="#fff8ec" stroke="#13206b" strokeWidth="2.5" />
        <path d="M0 -46 C8 -38 12 -30 13 -24 H-13 C-12 -30 -8 -38 0 -46Z" fill="#d6283b" />
        <circle cy="-10" r="7" fill="#62d2ff" stroke="#13206b" strokeWidth="2.5" />
        <path d="M-14 4 L-26 18 L-14 14Z M14 4 L26 18 L14 14Z" fill="#d6283b" />
        <path d="M-8 14 Q0 36 8 14Z" fill="#ffb800" />
      </g>
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      {flag}
      <path d="M14 112 V60 L60 34 L106 60 V112Z" fill="#fff8ec" />
      <path d="M8 62 L60 30 L112 62 L106 66 L60 40 L14 66Z" fill="#1f8a5c" />
      <path d="M48 112 V88 A12 12 0 0 1 72 88 V112Z" fill="#2f6fe0" />
      <rect x="24" y="74" width="14" height="16" rx="7" fill="#2f6fe0" />
      <rect x="82" y="74" width="14" height="16" rx="7" fill="#2f6fe0" />
      <rect x="14" y="98" width="92" height="8" fill="#0e7a5a" />
    </svg>
  ),
  labs: (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M44 14 H76 V44 L104 100 Q108 112 94 112 H26 Q12 112 16 100 L44 44Z" fill="#e8f7ff" stroke="#13206b" strokeWidth="3" />
      <path d="M30 78 H90 L104 100 Q108 112 94 112 H26 Q12 112 16 100Z" fill="#a6e85f" />
      <circle cx="50" cy="92" r="6" fill="#fff" />
      <circle cx="70" cy="98" r="4" fill="#fff" />
      <rect x="40" y="8" width="40" height="10" rx="4" fill="#8b22e0" />
    </svg>
  ),
  medals: (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M36 6 L60 50 L84 6Z" fill="#d6283b" />
      <path d="M48 6 L60 30 L72 6Z" fill="#0f8a4b" />
      <circle cx="60" cy="78" r="36" fill="#ffc21a" stroke="#fff" strokeWidth="6" />
      <path d="M60 54l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff" />
    </svg>
  ),
  parents: (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M18 112 V58 L60 26 L102 58 V112Z" fill="#ffe1ef" />
      <path d="M10 60 L60 22 L110 60 L102 64 L60 32 L18 64Z" fill="#c2186b" />
      <path d="M60 98 C30 78 40 56 60 70 C80 56 90 78 60 98Z" fill="#ec2e86" />
      <rect x="78" y="80" width="26" height="22" rx="4" fill="#ffd23f" stroke="#b77900" strokeWidth="2" />
      <path d="M84 80 V72 A7 7 0 0 1 98 72 V80" stroke="#b77900" strokeWidth="3.5" fill="none" />
    </svg>
  ),
};

/** The Wiloki-like home of the journey: districts orbit a planet, the front one opens with the big play button. */
export function PlanetHub(props: PlanetHubProps) {
  const { locale, userName, totalStars, coins, worlds, claimedWorldIds, sound, onToggleSound, onOpenMap, onOpenCourses, onOpenLabs, onOpenParents, onExit, say, sfx } = props;
  const ar = locale === 'ar';
  const T = (arText: string, frText: string) => (ar ? arText : frText);
  const districts: Array<{ id: DistrictId; label: string; hint: string }> = [
    { id: 'journey', label: T('رحلتي', 'Mon voyage'), hint: T('رحلتي: من الصحراء إلى الفضاء!', "Mon voyage : du Sahara jusqu'à l'espace !") },
    { id: 'courses', label: T('دروسي', 'Mes cours'), hint: T('كل الدروس مرتّبة حسب المواد', 'Tous les cours, rangés par matière') },
    { id: 'labs', label: T('المختبرات', 'Ateliers'), hint: T('مختبرات وألعاب تربوية', 'Ateliers et jeux éducatifs') },
    { id: 'medals', label: T('أوسمتي', 'Médailles'), hint: T('هنا أوسمة كل عالم أكملته', 'Ici, les médailles de chaque monde terminé') },
    { id: 'parents', label: T('الأولياء', 'Parents'), hint: T('ركن الأولياء لمتابعة التقدّم', 'Le coin des parents pour suivre les progrès') },
  ];
  const n = districts.length;
  const step = 360 / n;
  const [rot, setRot] = useState(0);
  const [bubble, setBubble] = useState(T('مرحبا! أنا ديدو. اضغط الزر الأزرق لنسافر معاً', 'Salut ! Je suis Didou. Appuie sur le bouton bleu pour partir avec moi.'));
  const [hop, setHop] = useState(false);
  const [ribbon, setRibbon] = useState<RibbonContent | null>(null);
  const front = ((Math.round(-rot / step) % n) + n) % n;

  const talk = (text: string) => {
    setBubble(text);
    say(text);
  };
  const spin = (dir: 1 | -1) => {
    const next = rot + dir * step;
    setRot(next);
    sfx.whoosh();
    talk(districts[((Math.round(-next / step) % n) + n) % n].hint);
  };
  const enter = (id: DistrictId) => {
    sfx.pop();
    if (id === 'journey') {
      if (worlds) onOpenMap();
      else {
        const text = T('رحلة ديدو متاحة الآن للسنة الأولى، وستصل باقي السنوات قريباً', "Le voyage de Didou est disponible en 1AP pour l'instant ; les autres années arrivent bientôt.");
        say(text);
        setRibbon({ text, buttons: [{ label: T('حسناً', "D'accord"), onClick: () => setRibbon(null) }] });
      }
    } else if (id === 'courses') onOpenCourses();
    else if (id === 'labs') onOpenLabs();
    else if (id === 'parents') onOpenParents();
    else {
      const earned = worlds ? worlds.filter((w) => claimedWorldIds.includes(w.id)).length : 0;
      const text = T(`عندك ${earned} من ${worlds?.length ?? 0} أوسمة. أكمل كل عالم لتربح وسامه!`, `Tu as ${earned} médaille(s) sur ${worlds?.length ?? 0}. Termine chaque monde pour gagner sa médaille !`);
      say(text);
      setRibbon({
        text,
        extra: worlds && (
          <div className="j-medals">
            {worlds.map((w) => (
              <MedalArt key={w.id} color={w.medalColor} data-earned={claimedWorldIds.includes(w.id)} aria-label={pickText(w.badge, locale)} role="img" />
            ))}
          </div>
        ),
        buttons: [{ label: T('حسناً', "D'accord"), onClick: () => setRibbon(null) }],
      });
    }
  };
  const onDistrict = (i: number) => {
    if (i === front) return enter(districts[i].id);
    let delta = (((i - front) % n) + n) % n;
    if (delta > n / 2) delta -= n;
    setRot(rot - delta * step);
    sfx.whoosh();
    talk(districts[i].hint);
  };
  const lines = [
    T('مرحبا! أنا ديدو، فنك من الصحراء الجزائرية', "Salut ! Je suis Didou, un fennec du Sahara algérien."),
    T('اضغط على «رحلتي» لنسافر معاً', 'Appuie sur « Mon voyage » pour partir avec moi.'),
    T('هههه! هذا يدغدغني', 'Hi hi ! Ça chatouille !'),
  ];
  const [lineIndex, setLineIndex] = useState(0);
  const poke = () => {
    setHop(false);
    window.requestAnimationFrame(() => setHop(true));
    sfx.boing();
    talk(lines[lineIndex % lines.length]);
    setLineIndex(lineIndex + 1);
  };

  return (
    <>
      <div className="j-hub-top">
        <div className="j-hub-actions">
          <button type="button" className="j-gloss j-round j-flip" onClick={onExit} aria-label={T('العودة إلى التطبيق', "Retour à l'application")}>
            <ArrowIcon to="left" />
          </button>
          <button type="button" className="j-gloss j-round" onClick={onToggleSound} aria-pressed={sound} aria-label={T('الصوت', 'Son')}>
            {sound ? (
              <SpeakerIcon />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" />
                <path d="M16 9l5 6M21 9l-5 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
        <div className="j-counters">
          <div className="j-counter" style={{ justifyContent: 'center' }}>
            <span>{userName}</span>
          </div>
          <div className="j-counter" aria-label={T('النجوم', 'Étoiles')}>
            <span>{totalStars}</span>
            <StarIcon />
          </div>
          <div className="j-counter" aria-label={T('القطع الذهبية', "Pièces d'or")}>
            <span>{coins}</span>
            <CoinIcon />
          </div>
        </div>
      </div>

      <div className="j-planet" style={{ ['--rot' as string]: `${rot}deg` }}>
        <div className="j-sphere">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <path d="M30 70 Q55 40 90 52 Q110 60 104 82 Q96 104 70 100 Q40 98 30 70Z" fill="#59c26a" opacity=".85" />
            <path d="M120 120 Q150 100 176 124 Q186 150 160 164 Q132 172 122 150Z" fill="#e8c27a" opacity=".85" />
            <path d="M50 140 Q66 130 80 142 Q84 158 66 162 Q50 160 50 140Z" fill="#59c26a" opacity=".8" />
          </svg>
        </div>
        {districts.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className="j-district"
            data-front={i === front}
            style={{ ['--a' as string]: `${i * step}deg` }}
            onClick={() => onDistrict(i)}
            aria-label={d.label}
          >
            {DISTRICT_ART[d.id]}
            <span className="j-lbl journey-outline">{d.label}</span>
          </button>
        ))}
        <button type="button" className="j-gloss j-play" onClick={() => enter(districts[front].id)} aria-label={`${T('ادخل', 'Entrer')} : ${districts[front].label}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5l13 7.5-13 7.5z" fill="#fff" />
          </svg>
        </button>
      </div>

      <div className="j-say j-hub-say">
        <div className="j-say-text">
          <span>{bubble}</span>
          <button type="button" className="j-listen" onClick={() => say(bubble)} aria-label={T('استمع', 'Écouter')}>
            <SpeakerIcon />
          </button>
        </div>
      </div>
      <button type="button" className="j-hub-didou" data-hop={hop} onClick={poke} onAnimationEnd={() => setHop(false)} aria-label={T('ديدو', 'Didou')}>
        <DidouFull />
      </button>

      <button type="button" className="j-gloss j-round j-nav" data-side="right" onClick={() => spin(1)} aria-label={T('أدر الكوكب', 'Tourner la planète')}>
        <ArrowIcon to="right" />
      </button>
      <button type="button" className="j-gloss j-round j-nav" data-side="left" onClick={() => spin(-1)} aria-label={T('أدر الكوكب', 'Tourner la planète')}>
        <ArrowIcon to="left" />
      </button>

      {ribbon && <JourneyRibbon {...ribbon} onListen={() => say(ribbon.text)} listenLabel={T('استمع إلى ديدو', 'Écouter Didou')} />}
    </>
  );
}
