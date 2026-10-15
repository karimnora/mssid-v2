import { useActivityExitGuard } from "../../context/ActivityExitContext";
import React, { useState } from "react";
import { beforeEach, it, expect, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  within,
} from "@testing-library/react";
import { EnrichmentLibrary } from "./EnrichmentLibrary";
import { ENRICHMENT_MODULES } from "../../data/family/enrichmentContent";
import { FamilyTaskCard } from "./FamilyTaskCard";
import { ActivityExitProvider } from "../../context/ActivityExitContext";
import type { FamilyResults } from "../../utils/familyLearning";
vi.mock("../../utils/speech", () => ({
  speakText: vi.fn().mockResolvedValue(undefined),
  stopSpeech: vi.fn(),
}));
beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }));
function Harness({
  premium = true,
  record = vi.fn(),
  outer = false,
}: {
  premium?: boolean;
  record?: (id: string, o: string) => void;
  outer?: boolean;
}) {
  const [results, setResults] = useState<FamilyResults>({});
  return (
    <ActivityExitProvider>
      {outer && <OuterGuard />}
      <EnrichmentLibrary
        grade="5AP"
        fr
        premium={premium}
        results={results}
        onPrint={vi.fn()}
        onResult={(id, o) => {
          record(id, o);
          setResults((old) => ({
            ...old,
            [id]: { outcome: o, at: "2026-10-15T10:00:00Z" },
          }));
        }}
      />
    </ActivityExitProvider>
  );
}
function OuterGuard() {
  useActivityExitGuard(true, "fr");
  return null;
}
it("can return after success even when the enclosing lab has its own active guard", () => {
  render(<Harness outer />);
  click("Problèmes");
  fireEvent.click(document.querySelector("[data-enrichment-module]")!);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "680" } });
  click("Vérifier ma réponse");
  click("Retour aux ateliers");
  expect(document.querySelectorAll("[data-enrichment-module]")).toHaveLength(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
it("offers seven domains in 5AP and keeps only the first challenge free", () => {
  render(<Harness premium={false} />);
  expect(document.querySelectorAll("[data-enrichment-module]")).toHaveLength(7);
  click("Problèmes");
  expect(document.querySelectorAll("[data-enrichment-module]")).toHaveLength(1);
  fireEvent.click(document.querySelector("[data-enrichment-module]")!);
  expect(screen.getByRole("button", { name: "Défi 2" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "680" } });
  click("Vérifier ma réponse");
  expect(screen.getByText(/Tu peux rejouer/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Défi 2" })).toBeDisabled();
});
it("records a corrected mistake as helped, unlocks progression and guards unfinished input", () => {
  const record = vi.fn();
  render(<Harness record={record} />);
  click("Problèmes");
  fireEvent.click(document.querySelector("[data-enrichment-module]")!);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "1" } });
  click("Retour aux ateliers");
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", {
      name: "Continuer",
    })
  );
  expect(screen.getByRole("textbox")).toHaveValue("1");
  click("Vérifier ma réponse");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "680" } });
  click("Vérifier ma réponse");
  expect(record).toHaveBeenLastCalledWith(
    "explore:5AP:daily-maths:0",
    "helped"
  );
  click("Défi suivant");
  expect(screen.getByRole("textbox")).toHaveValue("");
});
it("corrects new choice questions without exposing numeric answer codes or double success", () => {
  const module = ENRICHMENT_MODULES.find(
      (m) => m.id === "explore:3AP:english-reading"
    )!,
    task = module.tasks[0],
    record = vi.fn();
  render(<FamilyTaskCard task={task} fr onResult={record} />);
  const correct = task.options!.find((o) => task.accepted!.includes(o.id))!;
  click(correct.label.fr);
  expect(record).toHaveBeenCalledWith(task.id, "independent");
  expect(record).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: correct.label.fr })).toBeDisabled();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});
it("requires the parent gate and never labels a revealed writing model as independent", () => {
  const task = ENRICHMENT_MODULES.find(
      (m) => m.id === "explore:5AP:writing-workshop"
    )!.tasks[0],
    record = vi.fn();
  render(
    <ActivityExitProvider>
      <FamilyTaskCard task={task} fr onResult={record} guardExit parentGate />
    </ActivityExitProvider>
  );
  expect(
    screen.queryByRole("button", { name: "Réussi seul" })
  ).not.toBeInTheDocument();
  click("Comprendre le corrigé");
  click("Espace parent");
  const dialog = screen.getByRole("dialog"),
    sum = dialog.textContent!.match(/(\d+) \+ (\d+) = \?/)!;
  fireEvent.change(within(dialog).getByRole("spinbutton"), {
    target: { value: String(Number(sum[1]) + Number(sum[2])) },
  });
  fireEvent.click(within(dialog).getByRole("button", { name: "Continuer" }));
  click("Réussi seul");
  expect(record).toHaveBeenCalledWith(task.id, "helped");
});
