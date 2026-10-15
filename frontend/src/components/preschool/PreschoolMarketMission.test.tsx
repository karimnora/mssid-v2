import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { PreschoolMarketMission } from "./PreschoolMarketMission";
import {
  marketStorageKey,
  readMarketResults,
} from "../../utils/marketMissionProgress";
const state = vi.hoisted(() => ({ owner: "user:9:child:1" }));
vi.mock("../../hooks/useCahierAccess", () => ({
  useCahierAccess: () => ({
    authUser: { id: 9 },
    access: { premium: true },
    loading: false,
    error: false,
  }),
}));
vi.mock("../../utils/progressOwner", () => ({
  getActiveProgressOwner: () => state.owner,
}));
vi.mock("../../utils/speech", () => ({
  speakText: vi.fn().mockResolvedValue(undefined),
  stopSpeech: vi.fn(),
}));
beforeEach(() => {
  cleanup();
  localStorage.clear();
  state.owner = "user:9:child:1";
});
describe("preschool market ownership", () => {
  it("saves actual attempts and never overlays a second child or another learning language", () => {
    const view = render(
      <PreschoolMarketMission language="fr" onExit={vi.fn()} />
    );
    for (let i = 0; i < 3; i++)
      fireEvent.click(
        screen.getByRole("button", { name: "Ajouter à 1" })
      );
    for (let i = 0; i < 2; i++)
      fireEvent.click(
        screen.getByRole("button", { name: "Ajouter à 2" })
      );
    fireEvent.click(screen.getByRole("button", { name: "Vérifier mon défi" }));
    expect(
      readMarketResults(
        marketStorageKey(state.owner, "preschool", "fr"),
        "preschool"
      )["market-mission:preschool:0"].outcome
    ).toBe("independent");
    state.owner = "user:9:child:2";
    view.rerender(<PreschoolMarketMission language="fr" onExit={vi.fn()} />);
    expect(screen.getByText("0/6 défis réussis")).toBeInTheDocument();
    state.owner = "user:9:child:1";
    view.rerender(<PreschoolMarketMission language="en" onExit={vi.fn()} />);
    expect(screen.getByText("0/6 challenges completed")).toBeInTheDocument();
  });
  it("rejects an active profile belonging to another account", () => {
    state.owner = "user:44:child:1";
    render(<PreschoolMarketMission language="fr" onExit={vi.fn()} />);
    expect(
      localStorage.getItem(marketStorageKey("user:9", "preschool", "fr"))
    ).toBe("{}");
    expect(
      localStorage.getItem(marketStorageKey(state.owner, "preschool", "fr"))
    ).toBeNull();
  });
});
