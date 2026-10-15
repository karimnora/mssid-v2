import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  Minus,
  Plus,
  RotateCcw,
  Volume2,
} from "lucide-react";
import {
  MARKET_PLANS,
  MARKET_SESSIONS,
  marketSucceeded,
  type MarketBand,
  type MarketTask,
} from "../../data/market/marketMission";
import type { PreschoolLanguage } from "../../data/preschool/types";
import type { FamilyResults, TaskOutcome } from "../../utils/familyLearning";
import { isolateMathRuns } from "../../utils/textFormatter";
import {
  useActivityExit,
  useActivityExitGuard,
} from "../../context/ActivityExitContext";
import { DidouGuide } from "../family/AdventureStage";
import { ParentGateButton } from "../preschool/PreschoolParentBilan";
import { speakText, stopSpeech } from "../../utils/speech";
import { MarketProduce, MarketScene } from "./MarketArt";
import "./marketMission.css";
interface Props {
  band: MarketBand;
  language: PreschoolLanguage;
  premium: boolean;
  results: FamilyResults;
  onResult: (id: string, outcome: TaskOutcome) => void;
  onPending?: (value: boolean) => void;
  onExit: () => void;
}
const voices = { fr: "fr-FR", ar: "ar-SA", en: "en-US" } as const;
export function MarketMission({
  band,
  language,
  premium,
  results,
  onResult,
  onPending,
  onExit,
}: Props) {
  const t = (fr: string, ar: string, en: string) =>
    language === "fr" ? fr : language === "ar" ? ar : en;
  const tasks = MARKET_PLANS[band].tasks;
  const first = tasks.findIndex((task) => !marketSucceeded(results[task.id]));
  const [step, setStep] = useState(
    first < 0 ? 5 : !premium && first > 1 ? 1 : first
  );
  const [view, setView] = useState<"play" | "pause" | "report">(
    first < 0 ? "report" : "play"
  );
  const [status, setStatus] = useState<TaskOutcome | null>(null),
    [hint, setHint] = useState(false),
    [pending, setPending] = useState(false),
    [attempt, setAttempt] = useState(0);
  const assisted = useRef(false),
    locked = useRef(false),
    heading = useRef<HTMLHeadingElement>(null);
  const exit = useActivityExit();
  useActivityExitGuard(pending, language);
  useEffect(
    () => () => {
      onPending?.(false);
      stopSpeech();
    },
    [onPending]
  );
  useEffect(() => {
    heading.current?.focus();
    return () => stopSpeech();
  }, [step, view]);
  const task = tasks[step],
    session = Math.floor(step / 2),
    success = status === "independent" || status === "helped";
  const done = tasks.filter((task) => marketSucceeded(results[task.id])).length;
  const mark = () => {
    setPending(true);
    onPending?.(true);
  };
  const release = () => {
    setPending(false);
    onPending?.(false);
  };
  const navigate = (action: () => void) => {
    if (pending) exit.requestLeave(action);
    else action();
  };
  const open = (n: number) => {
    stopSpeech();
    release();
    setStep(n);
    setView("play");
    setStatus(null);
    setHint(false);
    assisted.current = false;
    locked.current = false;
    setAttempt((a) => a + 1);
  };
  const allowed = (n: number) =>
    n === 0 ||
    (premium &&
      tasks.slice(0, n * 2).every((task) => marketSucceeded(results[task.id])));
  const check = (correct: boolean) => {
    if (locked.current) return;
    const outcome = correct
      ? assisted.current
        ? "helped"
        : "independent"
      : "review";
    if (correct) {
      locked.current = true;
      release();
    } else assisted.current = true;
    setStatus(outcome);
    onResult(task.id, outcome);
  };
  const observe = (outcome: TaskOutcome) => {
    if (locked.current) return;
    locked.current = true;
    onResult(task.id, outcome);
    release();
    setView("report");
  };
  const report = (
    <MarketReport
      tasks={tasks}
      results={results}
      language={language}
      replay={(n) => {
        if (allowed(Math.floor(n / 2))) navigate(() => open(n));
      }}
      allowed={allowed}
    />
  );
  return (
    <section
      className="premium-adventures market-mission"
      data-market-mission={band}
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
    >
      <header className="market-top">
        <button
          type="button"
          className="market-secondary"
          onClick={() => navigate(onExit)}
          aria-label={t(
            "Retour aux ateliers",
            "أعود إلى الورشات",
            "Back to workshops"
          )}
        >
          <ArrowLeft aria-hidden />
        </button>
        <div>
          <small>
            {t("LES AVENTURES DE DIDOU", "مغامرات ديدو", "DIDOU’S ADVENTURES")}{" "}
            ·{" "}
            {band === "preschool"
              ? t("Préscolaire", "التحضيري", "Preschool")
              : band}
          </small>
          <h2>
            {t(
              "La mission du marché de Didou",
              "مهمة سوق ديدو",
              "Didou’s market mission"
            )}
          </h2>
        </div>
      </header>
      <MarketScene phase={session} />
      <div className="market-progress">
        <span aria-live="polite">
          {done}/6 {t("défis réussis", "تحديات ناجحة", "challenges completed")}
        </span>
        <progress
          value={done}
          max={6}
          aria-label={t(
            "Progression de la mission",
            "تقدم المهمة",
            "Mission progress"
          )}
        />
      </div>
      <nav
        className="market-sessions"
        aria-label={t("Séances du marché", "جلسات السوق", "Market sessions")}
      >
        {MARKET_SESSIONS.map((title, n) => (
          <button
            type="button"
            key={n}
            aria-label={String(n + 1) + ". " + title[language]}
            aria-current={session === n ? "step" : undefined}
            disabled={!allowed(n)}
            onClick={() => {
              if (n === session && view === "play") return;
              navigate(() => open(n * 2));
            }}
          >
            <span>
              {!allowed(n) && <LockKeyhole size={14} aria-hidden />} {n + 1}.{" "}
              {
                [
                  t("Je prépare", "أحضّر", "I pack"),
                  t("Je paie", "أدفع", "I pay"),
                  t("Je partage", "أقاسم", "I share"),
                ][n]
              }
            </span>
            {!premium && n > 0 && <small> Premium</small>}
          </button>
        ))}
      </nav>
      {view === "play" ? (
        <article className="market-work" key={step + ":" + attempt}>
          <h3 ref={heading} tabIndex={-1}>
            {task.title[language]}
          </h3>
          <DidouGuide
            text={task.prompt[language]}
            fr={language === "fr"}
            uiLanguage={language}
            lang={voices[language]}
            success={success}
          />
          <MarketChallenge
            task={task}
            language={language}
            solved={success}
            onWork={mark}
            onCheck={check}
            onObserve={observe}
          />
          {!success && task.kind !== "observe" && (
            <button
              type="button"
              className="market-quiet"
              aria-expanded={hint}
              onClick={() => {
                assisted.current = true;
                setHint(true);
              }}
            >
              {t("Un indice", "مساعدة", "A hint")}
            </button>
          )}
          {hint && (
            <p className="market-hint">
              {isolateMathRuns(task.hint[language])}
            </p>
          )}
          {status && task.kind !== "observe" && (
            <div
              className="market-feedback"
              role="status"
              data-review={!success}
            >
              <strong>
                {success
                  ? t("Tu as vérifié !", "تحققت من الحل!", "You checked it!")
                  : t(
                      "Tu peux modifier et réessayer.",
                      "يمكنك التعديل والمحاولة مجدداً.",
                      "You can change it and try again."
                    )}
              </strong>
              <p>
                {isolateMathRuns(
                  (success ? task.explain : task.hint)[language]
                )}
              </p>
            </div>
          )}
          {success && (
            <button
              type="button"
              className="market-action"
              onClick={() => {
                if (step % 2 === 1) setView("pause");
                else open(step + 1);
              }}
            >
              <Check aria-hidden size={18} />
              {step % 2 === 1
                ? t(
                    "Terminer cette séance",
                    "أنهي هذه الجلسة",
                    "Finish this session"
                  )
                : t(
                    "Continuer la mission",
                    "أتابع المهمة",
                    "Continue the mission"
                  )}
            </button>
          )}
          <button
            type="button"
            className="market-quiet"
            onClick={() => navigate(() => open(step))}
          >
            <RotateCcw aria-hidden size={17} />
            {t("Recommencer ce défi", "أعيد التحدي", "Restart this challenge")}
          </button>
        </article>
      ) : view === "pause" ? (
        <div className="market-work market-end">
          <h3 ref={heading} tabIndex={-1}>
            {t(
              "Une commande bien préparée !",
              "طلب جاهز بعناية!",
              "A carefully prepared order!"
            )}
          </h3>
          <p>
            {t(
              "Tu peux faire une pause. Ton carnet garde tes résultats sur cet appareil.",
              "يمكنك أخذ استراحة. يحتفظ الدفتر بنتائجك على هذا الجهاز.",
              "You can take a break. Your notebook keeps your results on this device."
            )}
          </p>
          {premium && session < 2 ? (
            <button
              type="button"
              className="market-action"
              onClick={() => open(step + 1)}
            >
              {t(
                "Ouvrir la séance suivante",
                "أفتح الجلسة التالية",
                "Open the next session"
              )}
            </button>
          ) : (
            <>
              <p>
                {t(
                  "La découverte reste rejouable. Les deux autres séances sont incluses dans Premium.",
                  "يمكن إعادة الاكتشاف. الجلستان الأخريان ضمن Premium.",
                  "Discovery can be replayed. The other two sessions are included in Premium."
                )}
              </p>
              <button
                type="button"
                className="market-secondary"
                onClick={() => open(0)}
              >
                {t(
                  "Rejouer la découverte",
                  "أعيد الاكتشاف",
                  "Replay discovery"
                )}
              </button>
            </>
          )}
          <button
            type="button"
            className="market-quiet"
            onClick={() => setView("report")}
          >
            {t("Voir mon carnet", "أرى دفتري", "View my notebook")}
          </button>
        </div>
      ) : (
        <div className="market-work">
          <h3 ref={heading} tabIndex={-1}>
            {t("Le carnet du marché", "دفتر السوق", "The market notebook")}
          </h3>
          {report}
        </div>
      )}
      {view !== "report" && (
        <details className="market-notes">
          <summary>
            {t(
              "Repères pour le parent",
              "ملاحظات للوالد",
              "Notes for the grown-up"
            )}
          </summary>
          {report}
        </details>
      )}
      <p className="market-footnote">
        {t(
          "Prix fictifs pour apprendre ; les pièces dessinées sont des objets de jeu. Résultats locaux sur cet appareil : les réussites ne prouvent pas à elles seules un apprentissage durable.",
          "أسعار خيالية للتعلم؛ القطع المرسومة أدوات لعب. النتائج محلية على هذا الجهاز: النجاح وحده لا يثبت تعلماً دائماً.",
          "Fictional prices for learning; the illustrated coins are play objects. Results stay on this device: success alone does not prove lasting learning."
        )}
      </p>
    </section>
  );
}
function MarketChallenge({
  task,
  language,
  solved,
  onWork,
  onCheck,
  onObserve,
}: {
  task: MarketTask;
  language: PreschoolLanguage;
  solved: boolean;
  onWork: () => void;
  onCheck: (correct: boolean) => void;
  onObserve: (outcome: TaskOutcome) => void;
}) {
  const t = (fr: string, ar: string, en: string) =>
    language === "fr" ? fr : language === "ar" ? ar : en;
  const [amounts, setAmounts] = useState<number[]>(() =>
    task.kind === "pack"
      ? [0, 0]
      : task.kind === "share"
      ? task.targets.map(() => 0)
      : []
  );
  const [wallet, setWallet] = useState<number[]>([]),
    [choice, setChoice] = useState<number | null>(null),
    [parent, setParent] = useState(false);
  const total = amounts.reduce((a, b) => a + b, 0),
    paid = wallet.reduce((a, b) => a + b, 0);
  const verify = t(
    "Vérifier mon défi",
    "أتحقق من التحدي",
    "Check my challenge"
  );
  if (task.kind === "observe")
    return (
      <div className="market-end">
        <p>{task.action[language]}</p>
        {parent ? (
          <fieldset>
            <legend>
              {t(
                "Observation de l’adulte",
                "ملاحظة الشخص البالغ",
                "Grown-up’s observation"
              )}
            </legend>
            {(["independent", "helped", "review"] as const).map((outcome) => (
              <button
                type="button"
                className="market-secondary"
                key={outcome}
                onClick={() => onObserve(outcome)}
              >
                {outcome === "independent"
                  ? t(
                      "Réussi sans aide",
                      "نجح دون مساعدة",
                      "Succeeded without help"
                    )
                  : outcome === "helped"
                  ? t("Réussi avec aide", "نجح بمساعدة", "Succeeded with help")
                  : t(
                      "À reprendre ensemble",
                      "نعيده معاً",
                      "Try again together"
                    )}
              </button>
            ))}
          </fieldset>
        ) : (
          <ParentGateButton
            language={language}
            onUnlock={() => setParent(true)}
          />
        )}
        <button
          type="button"
          className="market-quiet"
          onClick={() => onObserve("review")}
        >
          {t("Faire l’observation plus tard", "نؤجل الملاحظة", "Observe later")}
        </button>
      </div>
    );
  if (task.kind === "compare" || task.kind === "read")
    return (
      <>
        {task.kind === "read" && (
          <div className="market-reading">
            <p>{isolateMathRuns(task.passage[language])}</p>
            <button
              type="button"
              className="market-quiet"
              onClick={() => {
                void speakText(task.passage[language], voices[language]).catch(
                  () => {}
                );
              }}
            >
              <Volume2 size={18} aria-hidden />
              {t("Écouter le récit", "أستمع إلى القصة", "Listen to the story")}
            </button>
          </div>
        )}
        <div className="market-options">
          {task.options.map((label, n) => (
            <button
              type="button"
              key={n}
              className="market-secondary"
              aria-label={label[language]}
              aria-pressed={choice === n}
              disabled={solved}
              onClick={() => {
                onWork();
                setChoice(n);
                onCheck(n === task.correct);
              }}
            >
              {task.kind === "compare" &&
                task.id.split(":")[1] === "preschool" && (
                  <span className="market-objects">
                    {Array.from({ length: n === 0 ? 3 : 5 }, (_, i) => (
                      <MarketProduce key={i} kind="apple" size={24} />
                    ))}
                  </span>
                )}
              <span>{isolateMathRuns(label[language])}</span>
            </button>
          ))}
        </div>
      </>
    );
  if (task.kind === "pay")
    return (
      <>
        <div
          className="market-coins"
          role="group"
          aria-label={t(
            "Pièces disponibles",
            "القطع المتاحة",
            "Available coins"
          )}
        >
          {task.coins.map((value) => (
            <button
              type="button"
              className="market-coin"
              key={value}
              disabled={
                solved || paid + value > task.total + 100 || wallet.length >= 60
              }
              aria-label={
                t("Ajouter ", "أضيف ", "Add ") +
                value +
                (task.tokens ? t(" jeton", " رمز", " token") : " DA")
              }
              onClick={() => {
                onWork();
                setWallet((old) => [...old, value]);
              }}
            >
              {value}
              <small>
                {task.tokens ? t(" jeton", " رمز", " token") : " DA"}
              </small>
            </button>
          ))}
        </div>
        <div className="market-purse">
          <output
            aria-live="polite"
            aria-label={t("Montant composé", "المبلغ المكوّن", "Amount made")}
          >
            {paid}
            {task.tokens ? t(" jetons", " رموز", " tokens") : " DA"}
          </output>
          <p dir="ltr">{wallet.length ? wallet.join(" + ") : "0"}</p>
          <button
            type="button"
            className="market-quiet"
            disabled={solved || wallet.length === 0}
            onClick={() => {
              onWork();
              setWallet((old) => old.slice(0, -1));
            }}
          >
            <Minus size={17} aria-hidden />
            {t(
              "Retirer la dernière pièce",
              "أحذف آخر قطعة",
              "Remove last coin"
            )}
          </button>
        </div>
        {!solved && (
          <button
            type="button"
            className="market-action"
            onClick={() => {
              onWork();
              onCheck(paid === task.total);
            }}
          >
            {verify}
          </button>
        )}
      </>
    );
  const pack = task.kind === "pack";
  const change = (i: number, delta: number) => {
    if (solved) return;
    onWork();
    setAmounts((old) =>
      old.map((n, j) =>
        i === j
          ? Math.max(
              0,
              Math.min(pack ? task.targets[i] + 4 : task.total, n + delta)
            )
          : n
      )
    );
  };
  return (
    <>
      <div
        className={pack ? "market-pack" : "market-baskets"}
        role="group"
        aria-label={
          pack
            ? t("Ma commande", "طلبي", "My order")
            : t("Paniers à partager", "سلال التقاسم", "Sharing baskets")
        }
      >
        {amounts.map((n, i) => (
          <section className="market-bin" key={i}>
            <h4>
              {pack
                ? i === 0
                  ? t("Pommes", "تفاح", "Apples")
                  : t("Carottes", "جزر", "Carrots")
                : t("Panier ", "السلة ", "Basket ") + (i + 1)}
            </h4>
            <MarketProduce kind={pack && i === 1 ? "carrot" : "apple"} />
            <output className="market-count" aria-live="polite">
              {n}
            </output>
            <div className="market-objects" aria-hidden>
              {Array.from({ length: n }, (_, j) => (
                <MarketProduce
                  key={j}
                  size={20}
                  kind={pack && i === 1 ? "carrot" : "apple"}
                />
              ))}
            </div>
            <div className="market-controls">
              <button
                type="button"
                className="market-secondary"
                disabled={solved || n === 0}
                aria-label={
                  t("Retirer de ", "أحذف من ", "Remove from ") + (i + 1)
                }
                onClick={() => change(i, -1)}
              >
                <Minus aria-hidden size={18} />
              </button>
              <button
                type="button"
                className="market-secondary"
                disabled={
                  solved ||
                  (!pack && total >= task.total) ||
                  (pack && n >= task.targets[i] + 4)
                }
                aria-label={t("Ajouter à ", "أضيف إلى ", "Add to ") + (i + 1)}
                onClick={() => change(i, 1)}
              >
                <Plus aria-hidden size={18} />
              </button>
            </div>
          </section>
        ))}
      </div>
      {!pack && (
        <p aria-live="polite">
          {t("Pommes restantes : ", "التفاح المتبقي: ", "Apples remaining: ") +
            (task.total - total)}
        </p>
      )}
      {!solved && (
        <button
          type="button"
          className="market-action"
          onClick={() => {
            onWork();
            onCheck(amounts.every((n, i) => n === task.targets[i]));
          }}
        >
          {verify}
        </button>
      )}
    </>
  );
}
function MarketReport({
  tasks,
  results,
  language,
  replay,
  allowed,
}: {
  tasks: MarketTask[];
  results: FamilyResults;
  language: PreschoolLanguage;
  replay: (step: number) => void;
  allowed: (session: number) => boolean;
}) {
  const t = (fr: string, ar: string, en: string) =>
    language === "fr" ? fr : language === "ar" ? ar : en;
  const next = tasks.findIndex(
    (task) => results[task.id]?.outcome === "review"
  );
  const helped = tasks.findIndex(
    (task) => results[task.id]?.outcome === "helped"
  );
  const untried = tasks.findIndex((task) => !results[task.id]);
  const suggested = next >= 0 ? next : helped >= 0 ? helped : untried;
  return (
    <div className="market-end">
      <p>
        {t(
          "Derniers essais : les réussites historiques gardent les séances ouvertes. Le bilan distingue le jeu vérifié automatiquement et l’observation d’un adulte.",
          "آخر المحاولات: تبقي النجاحات السابقة الجلسات مفتوحة. يميّز الدفتر التحقق الآلي عن ملاحظة البالغ.",
          "Latest attempts: earlier successes keep sessions open. The notebook distinguishes automatic checks from a grown-up’s observation."
        )}
      </p>
      <ol className="market-report">
        {tasks.map((task, i) => (
          <li key={task.id}>
            <strong>
              {i + 1}. {task.title[language]}
            </strong>
            <span>
              {!results[task.id]
                ? t("À découvrir", "للاكتشاف", "Not tried")
                : results[task.id].outcome === "independent"
                ? t(
                    "Réussi sans aide",
                    "نجح دون مساعدة",
                    "Succeeded without help"
                  )
                : results[task.id].outcome === "helped"
                ? t("Réussi avec aide", "نجح بمساعدة", "Succeeded with help")
                : t("À reprendre", "للإعادة", "Try again")}
            </span>
            <small>
              {task.kind === "observe"
                ? t("Observation adulte", "ملاحظة بالغ", "Grown-up observation")
                : t(
                    "Réponse vérifiée dans le jeu",
                    "إجابة متحقق منها في اللعبة",
                    "Answer checked in the game"
                  )}
            </small>
            {allowed(Math.floor(i / 2)) && (
              <button
                type="button"
                className="market-quiet"
                onClick={() => replay(i)}
              >
                {t(
                  "Reprendre ce défi",
                  "أعيد هذا التحدي",
                  "Replay this challenge"
                )}
              </button>
            )}
          </li>
        ))}
      </ol>
      {suggested >= 0 && (
        <p>
          <strong>
            {t("Prochaine étape : ", "الخطوة التالية: ", "Next step: ")}
          </strong>
          {tasks[suggested].title[language]}
          {!allowed(Math.floor(suggested / 2)) && " · Premium"}
        </p>
      )}
    </div>
  );
}
