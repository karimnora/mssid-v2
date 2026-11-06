"use client";
import { useMotionPreference } from "../../hooks/useMotionPreference";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Gamepad2,
  Home,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  RotateCcw,
  Grid2X2,
  ClipboardCheck,
  Map as MapIcon,
} from "lucide-react";
import landscape from "../../assets/design/home-v3/village-landscape.webp";
import portrait from "../../assets/design/home-v3/village-portrait.webp";
import greet from "../../assets/design/home-v3/didou-greet.webp";
import point from "../../assets/design/home-v3/didou-point.webp";
import cheer from "../../assets/design/home-v3/didou-cheer.webp";
import { GardenCreatures, type GardenCreatureId } from "./GardenCreatures";
import { useDidouVoice, type VoiceId } from "./useDidouVoice";
import { motionTokens, springs } from "./villageMotion";
import { VillageDialog } from "./VillageDialog";
import {
  VillageButton,
  VillageCard,
  VillageProgress,
} from "./VillagePrimitives";
import { VillageLearningCard } from "./VillageLearningCard";
import { speakText } from "../../utils/speech";
import { DidouBubble } from "./DidouBubble";
import { PlanetShelf, type PlanetShelfGroup } from "../journey/PlanetShelf";
import type { PrimaryGrade } from "../../types";
import "./villageHome.css";

type PlaceId = "stories" | "workshop" | "games";
const HOME_CAPTIONS: Record<VoiceId, string> = {
  welcome: "مرحبًا! أنا ديدو، صديقك في مسيد.",
  stories: "هنا نقرأ الحكايات ونتعلم أشياء جديدة.",
  workshop: "هنا نجرب ونكتشف معًا.",
  games: "وهنا نلعب ونتعلم!",
  butterfly: "أحسنت! وجدت الفراشة!",
  discovery: "واو! اكتشاف جميل!",
};
const PRESENTATION = [
  "welcome",
  "stories",
  "workshop",
  "games",
] as const satisfies readonly VoiceId[];
const PLACES = [
  {
    id: "stories",
    title: "دار الحكايات",
    short: "أقرأ وأكتشف",
    Icon: BookOpen,
    path: "/courses",
    color: "blue",
  },
  {
    id: "workshop",
    title: "ورشة الاكتشاف",
    short: "أجرب وأفهم",
    Icon: FlaskConical,
    path: "/labs",
    color: "teal",
  },
  {
    id: "games",
    title: "حديقة الألعاب",
    short: "ألعب وأتعلم",
    Icon: Gamepad2,
    path: "/challenges",
    color: "orange",
  },
] as const;

export interface DidouHomeConnection {
  sound: boolean;
  onToggleSound: () => void;
  onStopSpeech: () => void;
  grade: PrimaryGrade;
  name: string;
  completed: number;
  total: number | null;
  onExit: () => void;
  onOpenCourses: () => void;
  onOpenStories?: () => void;
  onOpenMath?: () => void;
  onOpenPilot?: () => void;
  onOpenMap: (() => void) | null;
  onContinue: (() => void) | null;
  nextTitle: string | null;
  onOpenLabs: () => void;
  onOpenGames: () => void;
  onOpenExams: () => void;
  shelfGroups: PlanetShelfGroup[];
  mission?: { say: string; cta: string | null; onStart: () => void } | null;
  examPlanCta?: { label: string; onOpen: () => void } | null;
}
/** The same artwork drives both the isolated preview and the child's connected home. */
export function DidouVillageHome({
  connection,
  demoGrade = "1AP",
}: {
  connection?: DidouHomeConnection;
  demoGrade?: PrimaryGrade;
}) {
  const reduced = useMotionPreference();
  const [selected, setSelected] = useState<PlaceId | null>(null);
  const [localMuted, setLocalMuted] = useState(false);
  const muted = connection ? !connection.sound : localMuted;
  const setMuted = (value: boolean) => {
    if (connection) {
      if (value === connection.sound) connection.onToggleSound();
    } else setLocalMuted(value);
  };
  const [started, setStarted] = useState(false);
  const [discovered, setDiscovered] = useState<readonly GardenCreatureId[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const reactionTimer = useRef<number | null>(null);
  const [hovered, setHovered] = useState<PlaceId | null>(null);
  const [panel, setPanel] = useState(false);
  const [learning, setLearning] = useState(false);
  const [shelf, setShelf] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const touring = useRef(false);
  const cancelTour = () => {
    touring.current = false;
    setTourActive(false);
  };
  const place = PLACES.find((item) => item.id === selected);

  const { voiceId, setVoiceId, phase, feedback, stop, prepare, say } =
    useDidouVoice({
      muted,
      onError: cancelTour,
      onStopSpeech: connection?.onStopSpeech,
    });
  useEffect(
    () => () => {
      touring.current = false;
      if (reactionTimer.current !== null)
        window.clearTimeout(reactionTimer.current);
    },
    []
  );

  const start = () => {
    setStarted(true);
    setMuted(false);
    setPanel(false);
    setTourActive(true);
    touring.current = true;
    prepare(true);
    const present = (index: number) => {
      if (!touring.current) return;
      const id = PRESENTATION[index];
      if (!id) {
        cancelTour();
        setSelected(null);
        setVoiceId("welcome");
        return;
      }
      setTourStep(index);
      setSelected(id === "welcome" ? null : id);
      say(id, () => present(index + 1), true);
    };
    present(0);
  };
  const choose = (id: PlaceId) => {
    setCelebrating(false);
    cancelTour();
    setStarted(true);
    setSelected(id);
    setPanel(false);
    say(id);
    prepare();
  };
  const discover = (id: GardenCreatureId) => {
    cancelTour();
    setDiscovered((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
    setStarted(true);
    setSelected(null);
    setCelebrating(true);
    if (reactionTimer.current !== null)
      window.clearTimeout(reactionTimer.current);
    reactionTimer.current = window.setTimeout(
      () => setCelebrating(false),
      motionTokens.reactionHold * 1000
    );
    say(id === "butterfly" ? "butterfly" : "discovery");
    prepare();
  };
  const resetDiscoveries = () => {
    cancelTour();
    stop();
    setDiscovered([]);
    setCelebrating(false);
    setVoiceId("welcome");
  };
  const leave = (action: () => void) => {
    cancelTour();
    stop();
    action();
  };
  const enterPlace = () => {
    if (!connection || !selected) {
      setPanel(true);
      return;
    }
    leave(
      selected === "workshop"
        ? connection.onOpenLabs
        : selected === "games"
        ? connection.onOpenGames
        : connection.onOpenStories ?? connection.onOpenCourses
    );
  };
  const pose = celebrating ? cheer : selected || hovered ? point : greet;

  return (
    <main
      className="home-preview"
      lang="ar"
      dir="rtl"
      data-home-preview
      data-home-connected={!!connection}
      data-home-grade={connection?.grade}
      data-home-tour={tourActive ? "playing" : "idle"}
      data-home-tour-step={tourStep}
      data-home-voice-id={voiceId}
    >
      <picture className="home-preview-world" aria-hidden="true">
        <source media="(max-width: 680px)" srcSet={portrait} />
        <img src={landscape} alt="" draggable={false} />
      </picture>
      <div className="home-preview-shade" aria-hidden="true" />
      <header className="home-preview-header">
        <a
          className="home-preview-brand"
          href="/"
          onClick={
            connection
              ? (event) => {
                  event.preventDefault();
                  leave(connection.onExit);
                }
              : undefined
          }
          aria-label="العودة إلى مسيد"
        >
          <span>
            مَسيد<span className="home-preview-brand-dot">✦</span>
          </span>
        </a>
        <div className="home-preview-tools">
          <button
            type="button"
            className="home-preview-round"
            data-home-sound
            aria-label={muted ? "تشغيل الصوت" : "إيقاف الصوت"}
            aria-pressed={!muted}
            onClick={() => {
              cancelTour();
              stop();
              setMuted(!muted);
            }}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <a
            className="home-preview-round home-preview-back"
            href="/"
            onClick={
              connection
                ? (event) => {
                    event.preventDefault();
                    leave(connection.onExit);
                  }
                : undefined
            }
            aria-label="الواجهة الحالية"
          >
            <Home />
          </a>
          {connection && (
            <button
              type="button"
              className="home-preview-round"
              data-home-activities
              aria-label="كل الأنشطة"
              onClick={() => {
                cancelTour();
                stop();
                setShelf(true);
              }}
            >
              <Grid2X2 />
            </button>
          )}
        </div>
      </header>
      <section className="home-preview-title" aria-label="الترحيب">
        <p>
          <span />{" "}
          {connection
            ? `أهلًا ${connection.name} · ${connection.grade}`
            : "أهلًا بك في عالم ديدو"}{" "}
          <span />
        </p>
        <h1>
          نتعلّم <em>ونلعب!</em>
        </h1>
        <span className="home-preview-kicker">حكايات، تجارب وألعاب تنتظرك</span>
      </section>

      {connection ? (
        <VillageLearningCard
          connection={connection}
          onDetails={() => {
            cancelTour();
            stop();
            setLearning(true);
          }}
          onStart={() => {
            const action = connection.mission?.cta
              ? connection.mission.onStart
              : connection.onContinue;
            if (action) leave(action);
          }}
          onListen={() => {
            cancelTour();
            stop();
            setMuted(false);
            const text =
              [
                connection.mission?.say || connection.nextTitle,
                connection.total === null
                  ? ""
                  : `الدروس المكتملة: ${connection.completed} من ${connection.total}.`,
              ]
                .filter(Boolean)
                .join(" ") || "نحضّر دروسك. انتظر لحظة.";
            void speakText(text, "ar-SA").catch(() => {});
          }}
        />
      ) : (
        <a
          className="home-preview-lessons"
          data-home-lessons
          href={`/courses?g=${demoGrade}`}
        >
          <BookOpen size={24} /> دُرُوسِي <ArrowLeft size={20} />
        </a>
      )}
      <nav className="home-preview-places" aria-label="أماكن الاستكشاف">
        {PLACES.map(({ id, title, Icon, color }) => (
          <motion.button
            key={id}
            type="button"
            className={`home-preview-place home-preview-place--${id} home-preview-place--${color}`}
            data-home-place={id}
            aria-pressed={selected === id}
            onPointerEnter={() => setHovered(id)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(id)}
            onBlur={() => setHovered(null)}
            onClick={() => choose(id)}
            whileHover={reduced ? undefined : { y: -5, scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            transition={springs.press}
          >
            <span className="home-preview-place-icon">
              <Icon size={23} />
            </span>
            <span>
              <strong>{title}</strong>
            </span>
            <ArrowLeft className="home-preview-place-arrow" size={19} />
          </motion.button>
        ))}
      </nav>

      <GardenCreatures discovered={discovered} onDiscover={discover} />
      {discovered.length > 0 && (
        <span
          className="home-preview-discovery"
          data-home-discovery
          role="status"
        >
          <Sparkles size={18} /> أصدقاء الحديقة: {discovered.length} / 4
        </span>
      )}

      <div className="home-preview-character" data-home-didou={phase}>
        <span className="home-preview-character-shadow" />
        <motion.button
          type="button"
          className="home-preview-character-button"
          aria-label="تحدث مع ديدو"
          data-home-didou-button
          onClick={() => {
            if (!started) {
              start();
              return;
            }
            cancelTour();
            say(voiceId);
            prepare();
          }}
          animate={
            reduced
              ? undefined
              : celebrating
              ? { y: [0, -14, 0, -5, 0], rotate: [0, -2, 0, 2, 0] }
              : phase === "speaking"
              ? { y: [0, -4, 0], rotate: [0, 1, 0] }
              : { y: [0, -2, 0], rotate: [0, -0.4, 0.4, 0] }
          }
          transition={{
            duration: celebrating
              ? motionTokens.cheer
              : phase === "speaking"
              ? motionTokens.breath
              : motionTokens.idle,
            repeat: celebrating ? 0 : Infinity,
          }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
        >
          <motion.img
            key={pose}
            src={pose}
            alt="ديدو، الفنك ذو الوشاح الأخضر والنجمة الحمراء"
            draggable={false}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.feedback }}
          />
        </motion.button>
        <span className="home-preview-character-tag">
          دِيدُو <span>✦</span>
        </span>
      </div>

      <DidouBubble
        phase={phase}
        tourActive={tourActive}
        tourStep={tourStep}
        caption={HOME_CAPTIONS[voiceId]}
        feedback={feedback}
      >
        {tourActive ? (
          <VillageButton
            data-home-skip
            onClick={() => {
              cancelTour();
              stop();
              setSelected(null);
              setVoiceId("welcome");
            }}
          >
            <ArrowLeft size={20} /> تخطي
          </VillageButton>
        ) : discovered.length === 4 ? (
          <VillageButton data-home-reset-discoveries onClick={resetDiscoveries}>
            <RotateCcw size={20} /> نلعب من جديد
          </VillageButton>
        ) : selected ? (
          <VillageButton data-home-enter onClick={enterPlace}>
            <ArrowLeft size={20} /> هيا ندخل!
          </VillageButton>
        ) : (
          <VillageButton data-home-start onClick={start}>
            <Play size={21} fill="currentColor" />{" "}
            {started ? "اسمع ديدو من جديد" : "اسمع ديدو"}
          </VillageButton>
        )}
      </DidouBubble>

      {connection && learning && (
        <VillageDialog
          titleId="home-learning-title"
          className="home-preview-learning"
          onClose={() => setLearning(false)}
        >
          <h2 id="home-learning-title">رحلتك يا {connection.name}</h2>
          <p>
            {connection.grade}
            {" · "}
            {connection.total === null
              ? "نحضّر دروسك…"
              : `${connection.completed} من ${connection.total} درسًا مكتملًا`}
          </p>
          {connection.total !== null && connection.total > 0 && (
            <VillageProgress
              label="الدروس المكتملة"
              value={connection.completed}
              max={connection.total}
            />
          )}
          {connection.mission && (
            <VillageCard className="home-preview-mission">
              <p>{connection.mission.say}</p>
              {connection.mission.cta && (
                <VillageButton
                  data-home-mission
                  onClick={() => leave(connection.mission!.onStart)}
                >
                  {connection.mission.cta}
                </VillageButton>
              )}
            </VillageCard>
          )}
          {connection.onContinue && (
            <VillageButton
              data-home-continue
              onClick={() => leave(connection.onContinue!)}
            >
              أكمل رحلتي <ArrowLeft size={20} />
            </VillageButton>
          )}
          {connection.nextTitle && (
            <p className="home-preview-next">{connection.nextTitle}</p>
          )}
          {connection.onOpenMap && (
            <VillageButton
              variant="secondary"
              data-home-map
              onClick={() => leave(connection.onOpenMap!)}
            >
              <MapIcon /> خريطة ديدو
            </VillageButton>
          )}
          <VillageButton
            variant="secondary"
            data-home-all-courses
            onClick={() => leave(connection.onOpenCourses)}
          >
            <BookOpen /> كل دروسي
          </VillageButton>
          <VillageButton
            variant="secondary"
            className="home-preview-exams"
            data-home-exams
            onClick={() => leave(connection.onOpenExams)}
          >
            <ClipboardCheck /> امتحاناتي
          </VillageButton>
          {connection.onOpenMath && (
            <VillageButton
              variant="secondary"
              data-home-math
              onClick={() => leave(connection.onOpenMath!)}
            >
              دار الأرقام
            </VillageButton>
          )}
          {connection.onOpenPilot && (
            <VillageButton
              variant="secondary"
              data-home-pilot
              onClick={() => leave(connection.onOpenPilot!)}
            >
              أكتشف الكسور مع ديدو
            </VillageButton>
          )}
          {connection.examPlanCta && (
            <VillageButton
              variant="secondary"
              onClick={() => leave(connection.examPlanCta!.onOpen)}
            >
              {connection.examPlanCta.label}
            </VillageButton>
          )}
        </VillageDialog>
      )}
      {connection && shelf && (
        <PlanetShelf
          title="كل الأنشطة"
          closeLabel="إغلاق"
          groups={connection.shelfGroups}
          onClose={() => {
            setShelf(false);
            document
              .querySelector<HTMLElement>("[data-home-activities]")
              ?.focus();
          }}
          onPick={() => {
            stop();
            setShelf(false);
          }}
        />
      )}
      {panel && place && (
        <VillageDialog
          titleId="home-preview-door-title"
          onClose={() => setPanel(false)}
        >
          <place.Icon size={46} />
          <p>اِخْتِيَارٌ رَائِعٌ!</p>
          <h2 id="home-preview-door-title">{place.title}</h2>
          <p>{place.short}</p>
          <a
            className="home-preview-play"
            href={`${place.path}?g=${demoGrade}`}
          >
            اُدْخُلْ وَاكْتَشِفْ <ArrowLeft size={20} />
          </a>
          <small>تَفْتَحُ الأَنْشِطَةَ المَوْجُودَةَ فِي مَسيد.</small>
        </VillageDialog>
      )}
    </main>
  );
}
