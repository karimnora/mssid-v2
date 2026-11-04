import { describe, expect, it } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { MISSIONS, canOpenMission, missionForLesson } from './index';
import { isItem } from './types';
import { numericAssertions } from '../../test/mathAssertions';

describe('Didou missions content', () => {
  it('belong to real lessons of their grade and subject, one mission per lesson', () => {
    const lessons = new Set(MISSIONS.map((m) => m.lessonId));
    expect(lessons.size).toBe(MISSIONS.length);
    for (const mission of MISSIONS) {
      const lesson = COURSES_DATA.find((l) => l.id === mission.lessonId);
      expect(lesson, mission.id).toBeTruthy();
      expect(lesson!.grade).toBe(mission.grade);
      expect(lesson!.subject).toBe(mission.subject);
      expect(missionForLesson(mission.lessonId)).toBe(mission);
    }
  });

  it('opens exactly one mission per subject and grade to free accounts', () => {
    const free = new Map<string, number>();
    for (const m of MISSIONS) if (m.free) free.set(`${m.grade}:${m.subject}`, (free.get(`${m.grade}:${m.subject}`) ?? 0) + 1);
    for (const m of MISSIONS) expect(free.get(`${m.grade}:${m.subject}`), m.id).toBe(1);
    const premiumOnly = MISSIONS.find((m) => !m.free)!;
    expect(canOpenMission(premiumOnly, false)).toBe(false);
    expect(canOpenMission(premiumOnly, true)).toBe(true);
  });

  it('starts with a story, ends with a memo card, and has a three-question final challenge', () => {
    for (const mission of MISSIONS) {
      expect(mission.scenes[0].kind, mission.id).toBe('story');
      expect(mission.scenes[mission.scenes.length - 1].kind, mission.id).toBe('recap');
      expect(mission.scenes.filter((s) => isItem(s) && s.challenge).length, mission.id).toBe(3);
      expect(new Set(mission.scenes.map((s) => s.id)).size).toBe(mission.scenes.length);
    }
  });

  it('explains every wrong answer, with a single right choice and consistent sorting, tagging and grouping', () => {
    for (const mission of MISSIONS) {
      for (const scene of mission.scenes.filter(isItem)) {
        const at = `${mission.id}/${scene.id}`;
        expect(scene.hintAr && scene.successAr && scene.sayAr, at).toBeTruthy();
        if (scene.kind === 'choose') {
          expect(scene.options.filter((o) => o.correct), at).toHaveLength(1);
          for (const o of scene.options.filter((x) => !x.correct)) expect(o.whyAr, `${at}/${o.id}`).toBeTruthy();
        }
        if (scene.kind === 'numeric') {
          for (const m of scene.mistakes ?? []) expect(m.value, at).not.toBe(scene.answer);
          expect(scene.wrongAr, at).toBeTruthy();
        }
        if (scene.kind === 'sort') {
          const bins = new Set(scene.bins.map((b) => b.id));
          for (const c of scene.cards) expect(bins.has(c.bin) && c.whyAr.length > 0, `${at}/${c.id}`).toBe(true);
        }
        if (scene.kind === 'tag') {
          for (const w of scene.words) expect(scene.roles, `${at}/${w.textAr}`).toContain(w.role);
        }
        if (scene.kind === 'group') {
          expect(scene.boxesAnswer * scene.size + scene.restAnswer, at).toBe(scene.total);
          expect(scene.restAnswer, at).toBeLessThan(scene.size);
        }
      }
    }
  });

  it('writes big numbers with the Algerian thin space, never the source underscore', () => {
    for (const mission of MISSIONS) expect(JSON.stringify(mission), mission.id).not.toMatch(/d_d/);
  });

  it('covers several trimester 1 lessons of 5AP with the help ladder', () => {
    const t1 = MISSIONS.filter((m) => COURSES_DATA.find((l) => l.id === m.lessonId)?.trimester === 1);
    expect(t1.map((m) => m.lessonId)).toEqual(expect.arrayContaining(['math-5ap-large-numbers', 'arabic-5ap-passive-voice', 'arabic-5ap-sentence-components']));
    for (const mission of t1.filter((m) => m.id !== 'mission-arabic-5ap-sentence')) {
      const items = mission.scenes.filter(isItem);
      expect(items.some((s) => s.exampleAr || s.stepsAr?.length), mission.id).toBe(true);
    }
  });

  it('keeps every written calculation of the maths missions true', () => {
    let checked = 0;
    for (const mission of MISSIONS.filter((m) => m.subject === 'math')) {
      const texts = mission.scenes.flatMap((s) => [
        s.sayAr,
        ...(s.kind === 'explain' ? s.steps.flatMap((step) => [step.showAr, step.sayAr]) : []),
        ...(isItem(s) ? [s.successAr, s.hintAr, s.exampleAr ?? '', ...(s.stepsAr ?? [])] : []),
        ...(s.kind === 'choose' ? s.options.map((o) => o.whyAr ?? '') : []),
        ...(s.kind === 'numeric' ? (s.mistakes ?? []).map((m) => m.whyAr) : []),
      ]);
      for (const text of texts) {
        const checks = numericAssertions(text);
        checked += checks.length;
        expect(checks.filter((c) => !c.valid), `${mission.id}: ${text}`).toEqual([]);
      }
    }
    expect(checked).toBeGreaterThan(8);
  });
});
