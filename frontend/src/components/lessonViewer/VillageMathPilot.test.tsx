import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  act,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { COURSES_DATA } from "../../data/coursesData";
import { LessonViewer } from "../LessonViewer";
import { LocaleProvider } from "../../context/LocaleContext";
import { ActivityExitProvider } from "../../context/ActivityExitContext";
import { speakText, stopSpeech } from "../../utils/speech";
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
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("mssid_locale_preference", "ar");
});
function mount() {
  const onCompleteQuiz = vi.fn(),
    onQuizFullyValidated = vi.fn(),
    onPracticeResult = vi.fn(),
    onQuizMiss = vi.fn();
  render(
    <React.StrictMode><LocaleProvider>
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
    </LocaleProvider></React.StrictMode>
  );
  return { onCompleteQuiz, onQuizFullyValidated, onPracticeResult, onQuizMiss };
}

const panelKey = () => document.querySelector('.village-scene-progress [aria-current="step"]')?.getAttribute('data-pilot-phase') + (document.querySelector('[data-quiz-question]') ? ':quiz' : '');
const next = async () => {
  const before = panelKey();
  await act(async () => { fireEvent.click(document.querySelector('[data-linear-next]')!); });
  if (before !== panelKey()) expect(vi.mocked(speakText).mock.invocationCallOrder.at(-1)).toBeGreaterThan(vi.mocked(stopSpeech).mock.invocationCallOrder.at(-1)!);
};
async function solveJourney() {
  for (let step = 0; step < 6; step++) {
    const workshop = document.querySelector('[data-fraction-step="' + step + '"]')!;
    if (step % 3 === 0) {
      for (let i = 0; i < (step < 3 ? 3 : 2); i++) fireEvent.click(within(workshop as HTMLElement).getByRole('button', { name: 'أضيف وحدة' }));
      for (let i = 0; i < (step < 3 ? 2 : 1); i++) fireEvent.click(within(workshop as HTMLElement).getByRole('button', { name: 'أضيف جزءًا' }));
    } else if (step % 3 === 1) fireEvent.click(workshop.querySelector('[data-fraction-lower="' + (step < 3 ? 3 : 2) + '"]')!);
    else fireEvent.click(workshop.querySelector('[data-fraction-factor="' + (step < 3 ? 5 : 2) + '"]')!);
    fireEvent.click(workshop.querySelector('[data-fraction-check]')!);
    await next();
  }
  fireEvent.click(document.querySelector('[data-fraction-explain="0"]')!); await next();
}
describe('immersive guided fractions lesson', () => {
  it('guides a linear unscored journey, preserves practice help and XP, protects the report and requires the official quiz', async () => {
    const actions = mount();
    expect(document.querySelector('[data-village-lesson-scene]')).toBeInTheDocument();
    expect(document.querySelectorAll('.village-scene-progress li')).toHaveLength(5);
    expect(document.querySelector('.village-scene-progress button')).toBeNull();
    await next();
    expect(document.querySelector('[data-linear-next]')).toBeDisabled();
    expect(vi.mocked(speakText).mock.invocationCallOrder.at(-1)).toBeGreaterThan(vi.mocked(stopSpeech).mock.invocationCallOrder.at(-1)!);
    fireEvent.click(document.querySelector('[data-fraction-check]')!);
    expect(actions.onCompleteQuiz).not.toHaveBeenCalled();
    expect(actions.onQuizFullyValidated).not.toHaveBeenCalled();
    await solveJourney();
    expect(document.querySelector('[data-pilot-rule]')).toBeInTheDocument();
    expect(actions.onCompleteQuiz).not.toHaveBeenCalled();
    await next();
    const active = () => document.querySelector<HTMLElement>('[data-pilot-exercise]:not([hidden])')!;
    fireEvent.click(within(active()).getByText('5'));
    fireEvent.click(within(active()).getByRole('button', { name: 'تحقق من الإجابة' }));
    expect(actions.onCompleteQuiz).not.toHaveBeenCalled();
    expect(actions.onPracticeResult).toHaveBeenCalledWith(lesson.id, expect.objectContaining({outcome:'fail'}));
    expect(document.querySelector('[data-pilot-companion]')).toHaveTextContent(lesson.progressiveExercises![0].hintsAr[0]);
    fireEvent.click(within(active()).getByRole('button', { name: 'حاول مرة أخرى' }));
    fireEvent.click(document.querySelector('[data-pilot-help]')!);
    expect(active()).toHaveTextContent(lesson.progressiveExercises![0].hintsAr[0]);
    fireEvent.click(within(active()).getByText('8'));
    fireEvent.click(within(active()).getByRole('button', { name: 'تحقق من الإجابة' }));
    expect(actions.onCompleteQuiz).toHaveBeenCalledWith(lesson.id, lesson.progressiveExercises![0].xpReward);
    expect(actions.onPracticeResult).toHaveBeenCalledWith(lesson.id, expect.objectContaining({outcome:'success', helped:true}));
    expect(document.querySelector('[data-pilot-companion]')).toHaveAttribute('data-pilot-companion', 'cheer');
    await next(); fireEvent.click(document.querySelector('[data-linear-previous]')!);
    expect(active()).toHaveTextContent('إجابة صحيحة');
    expect(actions.onCompleteQuiz).toHaveBeenCalledTimes(1);
    fireEvent.click(document.querySelector('[data-session-parent]')!);
    expect(document.querySelector('[data-session-report]')).toBeNull();
    const gate=screen.getByRole('dialog'); const numbers=gate.textContent!.match(/(\d+)\s*\+\s*(\d+)\s*=/)!;
    fireEvent.change(within(gate).getByRole('spinbutton'),{target:{value:String(+numbers[1]+ +numbers[2])}});fireEvent.submit(gate.querySelector('form')!);
    await waitFor(()=>expect(document.querySelector('[data-session-report]')).toHaveTextContent('نجح مع مساعدة أو بعد خطأ: 1'));
    expect(document.querySelector('[data-session-report]')).toHaveTextContent('لم يُقيّم بعد');
    fireEvent.click(document.querySelector('[data-session-next]')!);
    for (let i=0;i<lesson.progressiveExercises!.length;i++) await next();
    await next();
    expect(document.querySelector('[data-primary-cta="finish-lesson"]')).toBeNull();
    const q=lesson.quiz[0], wrong=q.options.find(o=>!o.isCorrect)!;
    fireEvent.click(document.querySelector('[data-quiz-question="'+q.id+'"] [data-quiz-option-id="'+wrong.id+'"]')!);
    await waitFor(()=>expect(speakText).toHaveBeenLastCalledWith(lesson.rulesAr![0], 'ar-SA', .9, 1, expect.objectContaining({preferredRecording:pilotVoiceFor(lesson.rulesAr![0])})));
    for(const question of lesson.quiz) fireEvent.click(document.querySelector('[data-quiz-question="'+question.id+'"] [data-quiz-option-id="'+question.options.find(o=>o.isCorrect)!.id+'"]')!);
    expect(document.querySelector('[data-primary-cta="finish-lesson"]')).toBeInTheDocument();
  },20000);
  it('uses a fresh recorded Nova request for the opening instruction', async()=>{
    mount();fireEvent.click(document.querySelector('[data-pilot-listen]')!);
    await waitFor(()=>expect(speakText).toHaveBeenLastCalledWith(expect.any(String),'ar-SA',.9,1,expect.objectContaining({preferredRecording:expect.stringContaining('5ap-fractions')})));
  });
  it('does not merge explicitly different Arabic vowels or unsafe property names',()=>{
    const clip=PILOT_VOICES.find(c=>/[\u064b-\u065f\u0670]/.test(c.text))!;
    expect(pilotVoiceFor(' '+clip.text+' ')).toBe(clip.src);
    expect(pilotVoiceFor(clip.text.replace(/[\u064b-\u065f\u0670]/g,''))).toBe(clip.src);
    const wrong=clip.text.replace(/[\u064b-\u065f\u0670]/,m=>m==='َ'?'ِ':'َ');
    expect(pilotVoiceFor(wrong)).toBeUndefined();expect(pilotVoiceFor('constructor')).toBeUndefined();
  });
});
