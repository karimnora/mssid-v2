import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  LockKeyhole,
  Printer,
  Volume2,
} from "lucide-react";
import type { PrimaryGrade } from "../../types";
import type {
  FamilyModule,
  FamilyDomain,
} from "../../data/family/familyContent";
import { ENRICHMENT_MODULES } from "../../data/family/enrichmentContent";
import type { FamilyResults, TaskOutcome } from "../../utils/familyLearning";
import { useActivityExit } from "../../context/ActivityExitContext";
import { speakText, stopSpeech } from "../../utils/speech";
import { FamilyTaskCard } from "./FamilyTaskCard";
import { canUseWebCheckout } from "../../utils/paymentPlatform";
import { NATIVE_OFFER_COPY } from "../../constants/nativeOfferCopy";
import "./enrichmentLibrary.css";
interface Props {
  grade: PrimaryGrade;
  fr: boolean;
  premium: boolean;
  results: FamilyResults;
  onResult: (id: string, outcome: TaskOutcome) => void;
  onPrint: (module: FamilyModule) => void;
  onPending?: (value: boolean) => void;
}
const domains: Partial<Record<FamilyDomain, [string, string]>> = {
  operations: ["Problèmes", "مسائل"],
  logic: ["Logique", "تفكير منطقي"],
  science: ["Sciences", "علوم"],
  reading: ["Lecture arabe", "قراءة عربية"],
  french: ["Français", "فرنسية"],
  english: ["English", "إنجليزية"],
  writing: ["Écriture", "كتابة"],
};
const complete = (result: FamilyResults[string] | undefined) =>
  Boolean(result?.completedAt) ||
  result?.outcome === "independent" ||
  result?.outcome === "helped";
export function EnrichmentLibrary(props: Props) {
  const { grade, fr, results } = props,
    t = (a: string, b: string) => (fr ? a : b);
  const [domain, setDomain] = useState<FamilyDomain | "all">("all"),
    [selected, setSelected] = useState<string | null>(()=>new URLSearchParams(window.location.search).get("workshop"));
  const all = ENRICHMENT_MODULES.filter((m) => m.grade === grade),
    available = all.filter((m) => domain === "all" || m.domain === domain);
  const current = all.find((m) => m.id === selected);
  if (current)
    return (
      <ModuleReader
        key={current.id}
        {...props}
        module={current}
        onBack={() => setSelected(null)}
      />
    );
  return (
    <section className="enrichment-library" data-enrichment-library={grade}>
      <header>
        <p className="enrichment-eyebrow">
          {t("LES ATELIERS DE DIDOU", "ورشات ديدو")} · {grade}
        </p>
        <h3>{t("Je choisis ma découverte", "أختار اكتشافي")}</h3>
        <p>
          {t(
            "Des ateliers de quatre défis, avec une méthode et un bilan. Le premier défi de chaque atelier est gratuit.",
            "ورشات من أربعة تحديات مع طريقة ودفتر متابعة. التحدي الأول في كل ورشة مجاني."
          )}
        </p>
      </header>
      <nav
        className="enrichment-filters"
        aria-label={t("Domaines des ateliers", "مجالات الورشات")}
      >
        <button
          type="button"
          className="studio-outline"
          aria-pressed={domain === "all"}
          onClick={() => setDomain("all")}
        >
          {t("Tous", "الكل")}
        </button>
        {Object.entries(domains)
          .filter(([id]) => all.some((m) => m.domain === id))
          .map(([id, label]) => (
            <button
              type="button"
              className="studio-outline"
              key={id}
              aria-pressed={domain === id}
              onClick={() => setDomain(id as FamilyDomain)}
            >
              {label[fr ? 0 : 1]}
            </button>
          ))}
      </nav>
      <div className="enrichment-grid">
        {available.map((module) => (
          <button
            type="button"
            className="enrichment-module"
            key={module.id}
            data-enrichment-module={module.id}
            onClick={() => setSelected(module.id)}
          >
            <BookOpen aria-hidden size={25} />
            <strong>{fr ? module.title.fr : module.title.ar}</strong>
            <span>{fr ? module.objective.fr : module.objective.ar}</span>
            <small>
              {module.tasks.filter((task) => complete(results[task.id])).length}
              /4 {t("défis réussis", "تحديات ناجحة")}
            </small>
          </button>
        ))}
      </div>
      <p className="studio-muted">
        {t(
          "Les ateliers complètent les apprentissages et ne remplacent pas le programme de la classe. Les découvertes françaises en 1AP–2AP se font avec un adulte. Les observations restent sur cet appareil.",
          "تكمل الورشات التعلم ولا تعوض برنامج القسم. اكتشاف الفرنسية في1AP و2AP بمرافقة بالغ. تبقى الملاحظات على هذا الجهاز."
        )}
      </p>
    </section>
  );
}
function ModuleReader({
  module,
  fr,
  premium,
  results,
  onResult,
  onPrint,
  onBack,
  onPending: parentPending,
}: Props & { module: FamilyModule; onBack: () => void }) {
  const t = (a: string, b: string) => (fr ? a : b),
    text = (v: { fr: string; ar: string }) => (fr ? v.fr : v.ar);
  const [step, setStep] = useState(0);
  const exit = useActivityExit();
  const pending = useRef(false);
  const onPending = React.useCallback(
    (value: boolean) => {
      pending.current = value;
      parentPending?.(value);
    },
    [parentPending]
  );
  const navigate = (action: () => void) => {
    if (pending.current) exit.requestLeave(action);
    else action();
  };
  const heading = useRef<HTMLHeadingElement>(null);
  const task = module.tasks[step];
  useEffect(() => {
    heading.current?.focus();
    return () => stopSpeech();
  }, [task.id]);
  const allowed = (n: number) =>
    n === 0 ||
    (premium &&
      module.tasks.slice(0, n).every((task) => complete(results[task.id])));
  const done = module.tasks.filter((task) => complete(results[task.id])).length;
  const move = (n: number) => {
    if (n === step || !allowed(n)) return;
    navigate(() => setStep(n));
  };
  return (
    <section className="enrichment-library" data-enrichment-reader={module.id}>
      <button
        type="button"
        className="studio-outline"
        onClick={() => navigate(onBack)}
      >
        <ArrowLeft aria-hidden size={18} />
        {t("Retour aux ateliers", "أعود إلى الورشات")}
      </button>
      <header>
        <h3 ref={heading} tabIndex={-1}>
          {text(module.title)}
        </h3>
        <p>{text(module.objective)}</p>
        <p aria-live="polite">
          {done}/4 {t("défis réussis", "تحديات ناجحة")}
        </p>
      </header>
      <nav
        className="enrichment-steps"
        aria-label={t("Défis de cet atelier", "تحديات الورشة")}
      >
        {module.tasks.map((task, n) => (
          <button
            type="button"
            key={task.id}
            className="studio-outline"
            disabled={!allowed(n)}
            aria-current={step === n ? "step" : undefined}
            onClick={() => move(n)}
          >
            {!allowed(n) && <LockKeyhole aria-hidden size={16} />}{" "}
            {t("Défi", "تحدي")} {n + 1}
            {complete(results[task.id]) && <Check aria-hidden size={16} />}
          </button>
        ))}
      </nav>
      {module.text && (
        <section
          className="enrichment-story"
          lang={module.language}
          dir={module.language === "ar" ? "rtl" : "ltr"}
        >
          <p>{text(module.text)}</p>
          <button
            type="button"
            className="studio-outline"
            onClick={() => {
              void speakText(
                text(module.text!),
                module.language === "ar"
                  ? "ar-SA"
                  : module.language === "en"
                  ? "en-US"
                  : "fr-FR"
              ).catch(() => {});
            }}
          >
            <Volume2 aria-hidden size={18} />
            {t("Écouter le texte", "أستمع إلى النص")}
          </button>
        </section>
      )}
      <FamilyTaskCard
        key={task.id}
        task={task}
        fr={fr}
        result={results[task.id]?.outcome}
        onResult={onResult}
        guardExit
        parentGate
        onPending={onPending}
      />
      {complete(results[task.id]) &&
        step < 3 &&
        (premium ? (
          <button
            type="button"
            className="studio-action"
            onClick={() => move(step + 1)}
          >
            {t("Défi suivant", "التحدي التالي")}
          </button>
        ) : (
          <p className="studio-feedback">
            {canUseWebCheckout()
              ? t(
                  "Tu peux rejouer ce défi. Premium ouvre les trois défis suivants de cet atelier.",
                  "يمكنك إعادة هذا التحدي. يفتح Premium التحديات الثلاثة التالية في الورشة."
                )
              : t(NATIVE_OFFER_COPY.enrichment.fr, NATIVE_OFFER_COPY.enrichment.ar)}
          </p>
        ))}
      {done === 4 && (
        <p className="studio-feedback">
          {t(
            "Atelier exploré ! Refais un défi plus tard et explique ta méthode à un proche.",
            "استكملت الورشة! أعد تحدياً لاحقاً واشرح طريقتك لقريب."
          )}
        </p>
      )}
      <details className="enrichment-report">
        <summary>{t("Bilan pour le parent", "دفتر متابعة للوالد")}</summary>
        <ol>
          {module.tasks.map((task, n) => (
            <li key={task.id}>
              <strong>
                {t("Défi", "تحدي")} {n + 1} ·{" "}
              </strong>
              {!results[task.id]
                ? t("À découvrir", "للاكتشاف")
                : results[task.id].outcome === "independent"
                ? t("Réussi sans aide", "نجح دون مساعدة")
                : results[task.id].outcome === "helped"
                ? t("Réussi avec aide", "نجح بمساعدة")
                : t("À reprendre", "للإعادة")}{" "}
              ·{" "}
              {task.accepted
                ? t(
                    "réponse vérifiée dans le jeu",
                    "إجابة متحقق منها في اللعبة"
                  )
                : t("observation adulte", "ملاحظة بالغ")}
            </li>
          ))}
        </ol>
        <p>
          {t(
            "Les réussites précédentes gardent les défis ouverts. Une réussite ne prouve pas à elle seule un acquis durable.",
            "تبقي النجاحات السابقة التحديات مفتوحة. لا يثبت نجاح واحد اكتساباً دائماً."
          )}
        </p>
      </details>
      {premium && (
        <button
          type="button"
          className="studio-outline"
          onClick={() => onPrint(module)}
        >
          <Printer aria-hidden size={18} />
          {t("Imprimer cet atelier", "أطبع هذه الورشة")}
        </button>
      )}
    </section>
  );
}
