import { isolateMathRuns } from "../../utils/textFormatter";
import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { Bilingual, FamilyTask } from "../../data/family/familyContent";
import {
  checkFamilyAnswer,
  type TaskOutcome,
} from "../../utils/familyLearning";
import { useActivityExitGuard } from "../../context/ActivityExitContext";
import { speakText, stopSpeech } from "../../utils/speech";
import { ParentGateButton } from "../preschool/PreschoolParentBilan";
export function FamilyTaskCard({
  task,
  fr,
  result,
  onResult,
  guardExit = false,
  parentGate = false,
  onPending,
}: {
  task: FamilyTask;
  fr: boolean;
  result?: TaskOutcome;
  onResult: (id: string, outcome: TaskOutcome) => void;
  guardExit?: boolean;
  parentGate?: boolean;
  onPending?: (pending: boolean) => void;
}) {
  const say = (a: string, b: string) => (fr ? a : b);
  const text = (v: Bilingual) => isolateMathRuns(fr ? v.fr : v.ar);
  const [input, setInput] = useState("");
  const [help, setHelp] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [attempted, setAttempted] = useState(false);
  const choiceLocked = useRef(false);
  const [parentUnlocked, setParentUnlocked] = useState(false),
    [started, setStarted] = useState(false),
    [observed, setObserved] = useState(false);
  useActivityExitGuard(
    guardExit &&
      !observed &&
      checked !== true &&
      Boolean(input.trim() || help || revealed || started),
    fr ? "fr" : "ar"
  );
  useEffect(
    () => () => {
      stopSpeech();
      onPending?.(false);
    },
    [onPending]
  );
  const check = (value = input) => {
    if (task.options && choiceLocked.current) return;
    const correct = checkFamilyAnswer(task, value);
    if (task.options && correct) choiceLocked.current = true;
    onPending?.(!correct);
    setChecked(correct);
    setAttempted(true);
    if (correct !== null)
      onResult(
        task.id,
        correct
          ? help || revealed || attempted
            ? "helped"
            : "independent"
          : "review"
      );
    if (correct) setAnswer(true);
  };
  return (
    <section className="studio-question space-y-3" data-family-task={task.id}>
      <p
        className="font-bold"
        dir={task.language === "ar" ? "rtl" : task.language ? "ltr" : undefined}
        lang={task.language}
      >
        {text(task.prompt)}
      </p>
      {task.language && (
        <button
          type="button"
          className="studio-outline"
          onClick={() => {
            void speakText(
              fr ? task.prompt.fr : task.prompt.ar,
              task.language === "ar"
                ? "ar-SA"
                : task.language === "en"
                ? "en-US"
                : "fr-FR"
            ).catch(() => {});
          }}
        >
          <Volume2 size={17} aria-hidden />{" "}
          {say("Écouter la consigne", "أستمع إلى التعليمة")}
        </button>
      )}
      {task.options && (
        <div
          className="enrichment-answers"
          role="group"
          aria-label={say("Choisir ma réponse", "أختار إجابتي")}
        >
          {task.options.map((option) => (
            <button
              type="button"
              key={option.id}
              className="studio-outline"
              aria-label={fr ? option.label.fr : option.label.ar}
              aria-pressed={input === option.id}
              disabled={checked === true}
              lang={task.language}
              dir={
                task.language === "ar"
                  ? "rtl"
                  : task.language
                  ? "ltr"
                  : undefined
              }
              onClick={() => {
                setInput(option.id);
                check(option.id);
              }}
            >
              {text(option.label)}
            </button>
          ))}
        </div>
      )}
      {task.accepted && !task.options && (
        <label className="block">
          {say("Ta réponse (nombre seul)", "إجابتك (العدد فقط)")}
          <input
            className="studio-input"
            inputMode="decimal"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setChecked(null);
              onPending?.(Boolean(e.target.value.trim()));
            }}
          />
          <button
            className="studio-action mt-2"
            disabled={!input.trim()}
            onClick={() => check()}
          >
            {say("Vérifier ma réponse", "أتحقق من إجابتي")}
          </button>
        </label>
      )}
      <div className="studio-pills">
        <button
          className="studio-outline"
          onClick={() => {
            setHelp(true);
            if (checked !== true) onPending?.(true);
          }}
          aria-expanded={help}
        >
          {say("Indice", "مساعدة")}
        </button>
        <button
          className="studio-outline"
          onClick={() => {
            setAnswer(!answer);
            setRevealed(true);
            if (checked !== true) onPending?.(true);
          }}
          aria-expanded={answer}
        >
          {answer
            ? say("Masquer le corrigé", "أخفي التصحيح")
            : say("Comprendre le corrigé", "أفهم التصحيح")}
        </button>
      </div>
      {help && <p className="studio-muted">{text(task.hint)}</p>}
      {checked !== null && (
        <p role="status" className="studio-feedback" data-retry={!checked}>
          {checked
            ? say(
                "Réponse correcte. Explique ta méthode.",
                "إجابة صحيحة. اشرح طريقتك."
              )
            : say(
                "À revoir : utilise l’indice et vérifie chaque étape.",
                "للمراجعة: استعمل المساعدة وتحقّق من كل خطوة."
              )}
        </p>
      )}
      {answer && (
        <div
          className="studio-feedback"
          dir={
            task.language === "ar" ? "rtl" : task.language ? "ltr" : undefined
          }
          lang={task.language}
        >
          <p className="font-bold">{text(task.answer)}</p>
          <p>{text(task.method)}</p>
        </div>
      )}
      {!task.accepted && guardExit && !started && (
        <button
          type="button"
          className="studio-outline"
          onClick={() => {
            setStarted(true);
            onPending?.(true);
          }}
        >
          {say("Je commence sur une feuille", "أبدأ على ورقة")}
        </button>
      )}
      {!task.accepted && parentGate && !parentUnlocked && (
        <ParentGateButton
          language={fr ? "fr" : "ar"}
          onUnlock={() => setParentUnlocked(true)}
        />
      )}
      {!task.accepted && (!parentGate || parentUnlocked) && (
        <fieldset className="space-y-2">
          <legend className="studio-muted">
            {say(
              "Observation du parent après l’essai — pas de note automatique",
              "ملاحظة الوالد بعد المحاولة — دون تنقيط آلي"
            )}
          </legend>
          <div className="studio-pills">
            {(["independent", "helped", "review"] as const).map((outcome) => (
              <button
                key={outcome}
                className="studio-outline"
                aria-pressed={result === outcome}
                onClick={() => {
                  setStarted(false);
                  setObserved(true);
                  onPending?.(false);
                  onResult(
                    task.id,
                    parentGate &&
                      outcome === "independent" &&
                      (help || revealed)
                      ? "helped"
                      : outcome
                  );
                }}
              >
                {outcome === "independent"
                  ? say("Réussi seul", "نجح وحده")
                  : outcome === "helped"
                  ? say("Réussi avec aide", "نجح بمساعدة")
                  : say("À reprendre", "للمراجعة")}
                {result === outcome ? " ✓" : ""}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {result && (
        <p className="studio-muted">
          {say("Dernière observation enregistrée : ", "آخر ملاحظة محفوظة: ")}
          {result === "independent"
            ? say(
                "réussite observée, à confirmer plus tard.",
                "نجاح ملاحظ، نؤكّده لاحقاً."
              )
            : result === "helped"
            ? say("avec aide, prévoir un rappel.", "بمساعدة، نخطّط لمراجعة.")
            : say("à reprendre doucement.", "نراجع بهدوء.")}
        </p>
      )}
    </section>
  );
}
