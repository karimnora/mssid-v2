import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { COURSES_DATA } from "../../data/coursesData";
import { LessonViewer } from "../LessonViewer";
import { LocaleProvider } from "../../context/LocaleContext";
import { ActivityExitProvider } from "../../context/ActivityExitContext";
import { speakText } from "../../utils/speech";
import { pilotVoiceFor, PILOT_VOICES } from "./villagePilotVoices";
import { VILLAGE_MATH_PILOT } from "./VillageMathPilot";
vi.mock("../../utils/speech", async (original) => ({
  ...(await original<typeof import("../../utils/speech")>()),
  speakText: vi.fn(() => Promise.resolve()),
  stopSpeech: vi.fn(),
  useVoiceAvailable: () => true,
}));
const lesson = COURSES_DATA.find((l) => l.id === VILLAGE_MATH_PILOT)!;
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("mssid_locale_preference", "ar");
});
function mount() {
  const onCompleteQuiz = vi.fn(),
    onQuizFullyValidated = vi.fn(),
    onPracticeResult = vi.fn(),
    onQuizMiss = vi.fn();
  render(
    <LocaleProvider>
      <ActivityExitProvider>
        <LessonViewer
          lesson={lesson}
          onBack={vi.fn()}
          onCompleteQuiz={onCompleteQuiz}
          onQuizFullyValidated={onQuizFullyValidated}
          onPracticeResult={onPracticeResult}
          onQuizMiss={onQuizMiss}
        />
      </ActivityExitProvider>
    </LocaleProvider>
  );
  return { onCompleteQuiz, onQuizFullyValidated, onPracticeResult, onQuizMiss };
}
const phase = (i: number) =>
  fireEvent.click(document.querySelector(`[data-pilot-phase="${i}"]`)!);
describe("5AP fractions reference lesson", () => {
  it("uses five phases and an unscored fraction manipulation without manufacturing progress", async () => {
    const actions = mount();
    expect(document.querySelectorAll("[data-pilot-phase]")).toHaveLength(5);
    phase(1);
    const workshop = document.querySelector(
      '[data-fraction-workshop="learn"]'
    )!;
    fireEvent.change(workshop.querySelector("[data-fraction-whole]")!, {
      target: { value: "3" },
    });
    fireEvent.change(workshop.querySelector("[data-fraction-rest]")!, {
      target: { value: "2" },
    });
    fireEvent.click(workshop.querySelector("[data-fraction-check]")!);
    expect(workshop).toHaveTextContent(
      "الرسم والعملية يعبّران عن الكمية نفسها"
    );
    expect(actions.onCompleteQuiz).not.toHaveBeenCalled();
    expect(actions.onQuizFullyValidated).not.toHaveBeenCalled();
  });
  it("preserves help tracking, answers and the original once-only XP through the guided presentation", async () => {
    const actions = mount();
    phase(3);
    await waitFor(
      () =>
        expect(
          document.querySelector("[data-pilot-practice]")
        ).toBeInTheDocument(),
      { timeout: 4000 }
    );
    const active = () =>
      document.querySelector<HTMLElement>(
        "[data-pilot-exercise]:not([hidden])"
      )!;
    fireEvent.click(document.querySelector("[data-pilot-help]")!);
    expect(active()).toHaveTextContent(
      lesson.progressiveExercises![0].hintsAr[0]
    );
    fireEvent.click(within(active()).getByText("8"));
    fireEvent.click(
      within(active()).getByRole("button", { name: "تحقق من الإجابة" })
    );
    expect(actions.onCompleteQuiz).toHaveBeenCalledWith(
      lesson.id,
      lesson.progressiveExercises![0].xpReward
    );
    expect(actions.onPracticeResult).toHaveBeenCalledWith(
      lesson.id,
      expect.objectContaining({ outcome: "success", helped: true })
    );
    expect(document.querySelector("[data-pilot-companion]")).toHaveAttribute(
      "data-pilot-companion",
      "cheer"
    );
    const nav = document.querySelector("[data-pilot-practice] > .pilot-row")!;
    fireEvent.click(
      within(nav as HTMLElement).getByRole("button", { name: "التالي" })
    );
    fireEvent.click(
      within(nav as HTMLElement).getByRole("button", { name: "السابق" })
    );
    expect(active()).toHaveTextContent("إجابة صحيحة");
    expect(actions.onCompleteQuiz).toHaveBeenCalledTimes(1);
    expect(actions.onQuizFullyValidated).not.toHaveBeenCalled();
  });
  it("offers an encouraging source hint after an error without awarding success", async () => {
    const actions = mount();
    phase(3);
    await waitFor(
      () =>
        expect(
          document.querySelector("[data-pilot-practice]")
        ).toBeInTheDocument(),
      { timeout: 4000 }
    );
    const active = document.querySelector<HTMLElement>(
      "[data-pilot-exercise]:not([hidden])"
    )!;
    fireEvent.click(within(active).getByText("5"));
    fireEvent.click(
      within(active).getByRole("button", { name: "تحقق من الإجابة" })
    );
    expect(actions.onCompleteQuiz).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(actions.onPracticeResult).toHaveBeenCalledWith(
        lesson.id,
        expect.objectContaining({ outcome: "fail" })
      )
    );
    expect(document.querySelector("[data-pilot-companion]")).toHaveTextContent(
      lesson.progressiveExercises![0].hintsAr[0]
    );
  });
});

describe("pilot voice assets", () => {
  it("uses the recorded Nova voice for the opening instruction", async () => {
    mount();
    fireEvent.click(document.querySelector("[data-pilot-listen]")!);
    await waitFor(() =>
      expect(speakText).toHaveBeenCalledWith(
        expect.any(String),
        "ar-SA",
        0.9,
        1,
        expect.objectContaining({
          preferredRecording: expect.stringContaining("5ap-fractions"),
        })
      )
    );
  });
  it("accepts display whitespace or omitted vowel marks, but never merges different explicit Arabic vowels", () => {
    const clip = PILOT_VOICES.find((c) =>
      /[\u064b-\u065f\u0670]/.test(c.text)
    )!;
    expect(pilotVoiceFor(" " + clip.text + " ")).toBe(clip.src);
    expect(pilotVoiceFor(clip.text.replace(/[\u064b-\u065f\u0670]/g, ""))).toBe(
      clip.src
    );
    const wrong = clip.text.replace(/[\u064b-\u065f\u0670]/, (mark) =>
      mark === "َ" ? "ِ" : "َ"
    );
    expect(pilotVoiceFor(wrong)).toBeUndefined();
    expect(pilotVoiceFor("constructor")).toBeUndefined();
  });
});

it("builds the protected session report from a real helped exercise", async () => {
  mount();
  phase(3);
  const active = document.querySelector<HTMLElement>(
    "[data-pilot-exercise]:not([hidden])"
  )!;
  fireEvent.click(document.querySelector("[data-pilot-help]")!);
  fireEvent.click(within(active).getByText("8"));
  fireEvent.click(
    within(active).getByRole("button", { name: "تحقق من الإجابة" })
  );
  fireEvent.click(document.querySelector("[data-session-parent]")!);
  expect(document.querySelector("[data-session-report]")).toBeNull();
  const gate = screen.getByRole("dialog");
  const numbers = gate.textContent!.match(/(\d+)\s*\+\s*(\d+)\s*=/)!;
  fireEvent.change(within(gate).getByRole("spinbutton"), {
    target: { value: String(Number(numbers[1]) + Number(numbers[2])) },
  });
  fireEvent.submit(gate.querySelector("form")!);
  await waitFor(() =>
    expect(document.querySelector("[data-session-report]")).toHaveTextContent(
      "نجح مع مساعدة أو بعد خطأ: 1"
    )
  );
  expect(document.querySelector("[data-session-report]")).toHaveTextContent(
    "لم يُقيّم بعد"
  );
});
