import { useState } from 'react';
import { pickText, type JourneyWorld } from '../../data/journey/journeyWorlds';
import { DidouFull, MedalArt, StarIcon } from './DidouJourneyArt';
import { ArrowIcon, CoinIcon } from './JourneyMap';
import { PlanetDistrictArt, PlanetSurface } from './planetDistrictArt';
import { PlanetShelf, ShelfButtonArt, type PlanetShelfGroup } from './PlanetShelf';
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
  /** Premium planet home: the whole classic home as a « كل الأنشطة » sheet. */
  shelfGroups?: PlanetShelfGroup[];
  /** Label of the top back button (Premium: « الواجهة الكلاسيكية »). */
  exitLabel?: string;
}

/** The Wiloki-like home of the journey: districts orbit a planet, the front one opens with the big play button. */
export function PlanetHub(props: PlanetHubProps) {
  const { locale, userName, totalStars, coins, worlds, claimedWorldIds, sound, onToggleSound, onOpenMap, onOpenCourses, onOpenLabs, onOpenParents, onExit, say, sfx, shelfGroups, exitLabel } = props;
  const [shelfOpen, setShelfOpen] = useState(false);
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
          <button type="button" className="j-gloss j-round j-flip" onClick={onExit} aria-label={exitLabel ?? T('العودة إلى التطبيق', "Retour à l'application")}>
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
          <PlanetSurface />
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
            <PlanetDistrictArt id={d.id} />
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

      {shelfGroups && shelfGroups.length > 0 && (
        <button
          type="button"
          className="j-gloss j-shelf-open"
          data-tone="orange"
          data-planet-shelf-open=""
          onClick={() => {
            sfx.pop();
            say(T('كل الأنشطة: الدروس، الامتحانات، التحديات، الألعاب والمختبرات', 'Toutes les activités : cours, examens, défis, jeux et ateliers'));
            setShelfOpen(true);
          }}
        >
          <ShelfButtonArt />
          <span>{T('كل الأنشطة', 'Toutes les activités')}</span>
        </button>
      )}
      {shelfOpen && shelfGroups && (
        <PlanetShelf
          title={T('كل الأنشطة', 'Toutes les activités')}
          closeLabel={T('أغلق', 'Fermer')}
          groups={shelfGroups}
          onClose={() => setShelfOpen(false)}
          onPick={() => {
            sfx.pop();
            setShelfOpen(false);
          }}
        />
      )}
      {ribbon && <JourneyRibbon {...ribbon} onListen={() => say(ribbon.text)} listenLabel={T('استمع إلى ديدو', 'Écouter Didou')} />}
    </>
  );
}
