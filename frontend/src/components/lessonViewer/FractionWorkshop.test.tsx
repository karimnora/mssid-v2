import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FractionWorkshop } from "./FractionWorkshop";
function mount(transfer = false) {
  const observe = vi.fn(),
    speak = vi.fn();
  const view = render(
    <FractionWorkshop transfer={transfer} onObserve={observe} onSpeak={speak} />
  );
  const scope = within(view.container);
  return { observe, speak, scope, el: view.container };
}
function solve(el: HTMLElement, transfer = false) {
  fireEvent.change(el.querySelector("[data-fraction-whole]")!, {
    target: { value: transfer ? "2" : "3" },
  });
  fireEvent.change(el.querySelector("[data-fraction-rest]")!, {
    target: { value: transfer ? "1" : "2" },
  });
  fireEvent.click(el.querySelector("[data-fraction-check]")!);
  fireEvent.click(el.querySelector('[data-fraction-mission="1"]')!);
  fireEvent.click(
    el.querySelector('[data-fraction-lower="' + (transfer ? 2 : 3) + '"]')!
  );
  fireEvent.click(el.querySelector("[data-fraction-check]")!);
  fireEvent.click(el.querySelector('[data-fraction-mission="2"]')!);
  fireEvent.click(
    el.querySelector('[data-fraction-factor="' + (transfer ? 2 : 5) + '"]')!
  );
  fireEvent.click(el.querySelector("[data-fraction-check]")!);
}
describe("Fraction workshop reasoning", () => {
  it("checks decomposition, bounding and equivalence by their mathematical values", () => {
    const { el, observe } = mount();
    solve(el);
    expect(observe.mock.calls.map((c) => c[0])).toEqual([
      "decompose",
      "bound",
      "equivalent",
    ]);
    expect(
      observe.mock.calls.every((c) => c[1].completed && !c[1].helped)
    ).toBe(true);
    expect(el).toHaveTextContent("1/2 = 5/10");
  });
  it("never marks a wrong construction as completed and tracks retries as help", () => {
    const { el, observe } = mount();
    fireEvent.click(el.querySelector("[data-fraction-check]")!);
    expect(observe).toHaveBeenLastCalledWith(
      "decompose",
      expect.objectContaining({ completed: false, attempts: 1 })
    );
    solve(el);
    expect(
      observe.mock.calls.find(
        (c) => c[0] === "decompose" && c[1].completed
      )?.[1].helped
    ).toBe(true);
  });
  it("requires an explanation after applying the three ideas to new fractions", () => {
    const { el, observe } = mount(true);
    expect(el.querySelector("[data-fraction-explain]")).toBeNull();
    solve(el, true);
    fireEvent.click(el.querySelector('[data-fraction-explain="1"]')!);
    expect(observe).toHaveBeenLastCalledWith(
      "explain",
      expect.objectContaining({ completed: false })
    );
    fireEvent.click(el.querySelector('[data-fraction-explain="0"]')!);
    expect(observe).toHaveBeenLastCalledWith(
      "explain",
      expect.objectContaining({ completed: true, helped: true })
    );
  });
  it("keeps explicit hint use in the observation", () => {
    const { el, observe } = mount();
    fireEvent.click(el.querySelector("[data-fraction-hint]")!);
    solve(el);
    expect(observe.mock.calls[0][1].helped).toBe(true);
  });
});
