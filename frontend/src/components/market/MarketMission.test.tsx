import React, { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { MarketMission } from "./MarketMission";
import { MARKET_PLANS, type MarketBand } from "../../data/market/marketMission";
import { recordMarketResult } from "../../utils/marketMissionProgress";
import type { FamilyResults } from "../../utils/familyLearning";
import { ActivityExitProvider } from "../../context/ActivityExitContext";
import { speakText, stopSpeech } from "../../utils/speech";
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
  band = "1AP",
  premium = true,
  initial = {},
  record = vi.fn(),
  exit = vi.fn(),
}: {
  band?: MarketBand;
  premium?: boolean;
  initial?: FamilyResults;
  record?: (id: string, o: string) => void;
  exit?: () => void;
}) {
  const [results, setResults] = useState(initial);
  return (
    <ActivityExitProvider>
      <MarketMission
        band={band}
        language="fr"
        premium={premium}
        results={results}
        onExit={exit}
        onResult={(id, o) => {
          record(id, o);
          setResults((p) => recordMarketResult(p, id, o));
        }}
      />
    </ActivityExitProvider>
  );
}
function pack(band: MarketBand) {
  const task = MARKET_PLANS[band].tasks[0];
  if (task.kind !== "pack") throw Error("pack missing");
  task.targets.forEach((n, i) => {
    for (let j = 0; j < n; j++) click("Ajouter à " + (i + 1));
  });
  click("Vérifier mon défi");
}
function compare(band: MarketBand) {
  click("Continuer la mission");
  const task = MARKET_PLANS[band].tasks[1];
  if (task.kind !== "compare") throw Error("compare missing");
  click(task.options[task.correct].fr);
  click("Terminer cette séance");
}
describe("Didou market journey", () => {
  for (const band of Object.keys(MARKET_PLANS) as MarketBand[])
    it("completes the adapted journey honestly in " + band, () => {
      const record = vi.fn();
      render(<Harness band={band} record={record} />);
      pack(band);
      compare(band);
      click("Ouvrir la séance suivante");
      const tasks = MARKET_PLANS[band].tasks,
        pay = tasks[2],
        read = tasks[3],
        share = tasks[4];
      if (pay.kind !== "pay" || read.kind !== "read" || share.kind !== "share")
        throw Error("curriculum mismatch");
      let remaining = pay.total;
      for (const coin of pay.coins) {
        while (remaining >= coin) {
          click("Ajouter " + coin + (pay.tokens ? " jeton" : " DA"));
          remaining -= coin;
        }
      }
      click("Vérifier mon défi");
      click("Continuer la mission");
      click(read.options[read.correct].fr);
      click("Terminer cette séance");
      click("Ouvrir la séance suivante");
      share.targets.forEach((n, i) => {
        for (let j = 0; j < n; j++) click("Ajouter à " + (i + 1));
      });
      click("Vérifier mon défi");
      click("Continuer la mission");
      expect(
        screen.queryByText("Observation de l’adulte")
      ).not.toBeInTheDocument();
      click("Faire l’observation plus tard");
      expect(screen.getByText("Le carnet du marché")).toBeInTheDocument();
      expect(screen.getByText("5/6 défis réussis")).toBeInTheDocument();
      expect(record).toHaveBeenCalledTimes(6);
      expect(record).toHaveBeenLastCalledWith(
        "market-mission:" + band + ":5",
        "review"
      );
    });
  it("requires the parent gate before an adult can validate the final task", () => {
    const initial: FamilyResults = {};
    for (const task of MARKET_PLANS["1AP"].tasks.slice(0, 5))
      initial[task.id] = { outcome: "independent", at: "2026-10-15T10:00:00Z" };
    const record = vi.fn();
    render(<Harness initial={initial} record={record} />);
    expect(
      screen.queryByRole("button", { name: "Réussi sans aide" })
    ).not.toBeInTheDocument();
    click("Espace parent");
    const dialog = screen.getByRole("dialog"),
      sum = dialog.textContent!.match(/(\d+) \+ (\d+) = \?/)!;
    fireEvent.change(within(dialog).getByRole("spinbutton"), {
      target: { value: String(Number(sum[1]) + Number(sum[2])) },
    });
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Continuer" })
    );
    click("Réussi sans aide");
    expect(record).toHaveBeenLastCalledWith(
      "market-mission:1AP:5",
      "independent"
    );
    expect(screen.getByText("6/6 défis réussis")).toBeInTheDocument();
  });
  it("keeps two discovery challenges replayable and paid sessions closed", () => {
    render(<Harness premium={false} />);
    pack("1AP");
    compare("1AP");
    expect(
      screen.getByRole("button", { name: /2. Choisir et payer/ })
    ).toBeDisabled();
    click("Rejouer la découverte");
    expect(
      screen.getByRole("group", { name: "Ma commande" })
    ).toBeInTheDocument();
  });
  it("keeps the basket after touching the current session or canceling an exit", () => {
    const exit = vi.fn();
    render(<Harness exit={exit} />);
    click("Ajouter à 1");
    click("1. Préparer ma commande");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    click("Retour aux ateliers");
    const dialog = screen.getByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Continuer" })
    );
    expect(exit).not.toHaveBeenCalled();
    const first = within(
      screen.getByRole("group", { name: "Ma commande" })
    ).getAllByRole("status")[0];
    expect(first).toHaveTextContent("1");
  });
  it("records help after an error, blocks duplicate success, and supports undoing coins", () => {
    const record = vi.fn();
    render(<Harness record={record} />);
    click("Vérifier mon défi");
    pack("1AP");
    expect(record).toHaveBeenLastCalledWith("market-mission:1AP:0", "helped");
    const count = record.mock.calls.length;
    expect(
      screen.queryByRole("button", { name: "Vérifier mon défi" })
    ).not.toBeInTheDocument();
    expect(record).toHaveBeenCalledTimes(count);
    compare("1AP");
    click("Ouvrir la séance suivante");
    click("Ajouter 10 DA");
    click("Retirer la dernière pièce");
    expect(screen.getByLabelText("Montant composé")).toHaveTextContent("0 DA");
  });
  it("stops speech when leaving a reading task without counting listening as help", () => {
    const initial: FamilyResults = {};
    for (const task of MARKET_PLANS["1AP"].tasks.slice(0, 3))
      initial[task.id] = { outcome: "independent", at: "2026-10-15T10:00:00Z" };
    const record = vi.fn();
    const view = render(<Harness initial={initial} record={record} />);
    click("Écouter le récit");
    expect(speakText).toHaveBeenCalledWith(expect.any(String), "fr-FR");
    click("Des carottes");
    expect(record).toHaveBeenLastCalledWith(
      "market-mission:1AP:3",
      "independent"
    );
    view.unmount();
    expect(stopSpeech).toHaveBeenCalled();
  });
});
