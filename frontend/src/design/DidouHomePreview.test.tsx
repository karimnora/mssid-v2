import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { DidouHomePreview, type DidouHomeConnection } from './DidouHomePreview';
import { HOME_VOICES } from './homePreviewVoices';

class TestAudio {
 static instances: TestAudio[] = [];
 paused = true;
 currentTime = 0;
 preload = '';
 onplaying: (() => void) | null = null;
 onended: (() => void) | null = null;
 onerror: (() => void) | null = null;
 load = vi.fn();
 removeAttribute = vi.fn();
 pause = vi.fn(() => { this.paused = true; });
 play = vi.fn(() => { this.paused = false; this.onplaying?.(); return Promise.resolve(); });
 constructor(public src: string) { TestAudio.instances.push(this); }
}
const clip = (id: keyof typeof HOME_VOICES) => TestAudio.instances.find(item => item.src === HOME_VOICES[id].src)!;
const main = () => document.querySelector('[data-home-preview]')!;
beforeEach(() => { TestAudio.instances = []; vi.stubGlobal('Audio', TestAudio); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Didou welcomes and presents his world', () => {
 it('presents each place once after the greeting and finishes without looping', () => {
  render(<DidouHomePreview />);
  fireEvent.click(document.querySelector('[data-home-start]')!);
  expect(main()).toHaveAttribute('data-home-tour', 'playing');
  expect(main()).toHaveAttribute('data-home-voice-id', 'welcome');
  for (const [previous, next] of [['welcome','stories'],['stories','workshop'],['workshop','games']] as const) {
   act(() => clip(previous).onended?.());
   expect(main()).toHaveAttribute('data-home-voice-id', next);
   expect(document.querySelector(`[data-home-place="${next}"]`)).toHaveAttribute('aria-pressed', 'true');
   expect(TestAudio.instances.filter(item => !item.paused)).toHaveLength(1);
  }
  act(() => { clip('games').paused = true; clip('games').onended?.(); });
  expect(main()).toHaveAttribute('data-home-tour', 'idle');
  expect(document.querySelector('[data-home-start]')).toBeInTheDocument();
  expect(TestAudio.instances.reduce((sum,item)=>sum+item.play.mock.calls.length,0)).toBe(4);
 });

 it('lets a child choose a place immediately and ignores the old greeting end event', () => {
  render(<DidouHomePreview />);
  fireEvent.click(document.querySelector('[data-home-start]')!);
  const lateEnd = clip('welcome').onended;
  fireEvent.click(document.querySelector('[data-home-place="games"]')!);
  act(() => lateEnd?.());
  expect(main()).toHaveAttribute('data-home-tour','idle');
  expect(main()).toHaveAttribute('data-home-voice-id','games');
  expect(document.querySelector('[data-home-voice-phase]')).toHaveAttribute('data-home-voice-phase','speaking');
  expect(clip('stories').play).not.toHaveBeenCalled();
  expect(TestAudio.instances.filter(item => !item.paused)).toHaveLength(1);
 });

 it('stops the presentation when skipped or muted and allows an explicit restart', () => {
  render(<DidouHomePreview />);
  fireEvent.click(document.querySelector('[data-home-start]')!);
  fireEvent.click(document.querySelector('[data-home-skip]')!);
  expect(main()).toHaveAttribute('data-home-tour','idle');
  expect(TestAudio.instances.filter(item => !item.paused)).toHaveLength(0);
  fireEvent.click(document.querySelector('[data-home-start]')!);
  fireEvent.click(document.querySelector('[data-home-sound]')!);
  expect(main()).toHaveAttribute('data-home-tour','idle');
  expect(TestAudio.instances.filter(item => !item.paused)).toHaveLength(0);
  expect(document.querySelector('[data-home-sound]')).toHaveAttribute('aria-pressed','false');
 });
 it('counts four real discoveries, gives each the correct reaction, and resets only on request', async () => {
  render(<DidouHomePreview />);
  for (const [index,id] of ['bee','bird','ladybug','butterfly'].entries()) {
   fireEvent.click(document.querySelector(`[data-home-creature="${id}"]`)!);
   expect(document.querySelector('[data-home-discovery]')).toHaveTextContent(`${index+1} / 4`);
   expect(main()).toHaveAttribute('data-home-voice-id',id==='butterfly'?'butterfly':'discovery');
   expect(TestAudio.instances.filter(item=>!item.paused)).toHaveLength(1);
  }
  expect(document.querySelector('[data-home-reset-discoveries]')).toBeInTheDocument();
  fireEvent.click(document.querySelector('[data-home-reset-discoveries]')!);
  expect(document.querySelector('[data-home-discovery]')).not.toBeInTheDocument();
  await waitFor(()=>expect(document.querySelectorAll('[data-home-creature]:not([disabled])')).toHaveLength(4));
 });

 it('reacts visually to a discovery while muted without starting or preloading voices', () => {
  render(<DidouHomePreview />);
  fireEvent.click(document.querySelector('[data-home-sound]')!);
  fireEvent.click(document.querySelector('[data-home-creature="bee"]')!);
  expect(document.querySelector('.home-preview-character-button img')).toHaveAttribute('src',expect.stringContaining('didou-cheer'));
  expect(TestAudio.instances).toHaveLength(0);
  expect(document.querySelector('[data-home-discovery]')).toHaveTextContent('1 / 4');
 });
});

const connected = (): DidouHomeConnection => ({
 sound:true,onToggleSound:vi.fn(),onStopSpeech:vi.fn(),grade:'4AP',name:'سارة',completed:2,total:10,
 onExit:vi.fn(),onOpenCourses:vi.fn(),onOpenMap:vi.fn(),onContinue:vi.fn(),nextTitle:'القسمة',
 onOpenLabs:vi.fn(),onOpenGames:vi.fn(),onOpenExams:vi.fn(),shelfGroups:[],
 mission:{say:'نراجع معًا',cta:'نبدأ',onStart:vi.fn()},
});
describe('connected village navigation', () => {
 it('uses the real class and progress and opens the next lesson via its guarded callback', () => {
  const connection=connected();render(<DidouHomePreview connection={connection}/>);
  expect(document.querySelector('[data-home-progress]')).toHaveTextContent('4AP · 2 / 10');
  fireEvent.click(document.querySelector('[data-home-lessons]')!);
  expect(document.querySelector('[role=dialog]')).toHaveTextContent('سارة');
  fireEvent.click(document.querySelector('[data-home-continue]')!);
  expect(connection.onContinue).toHaveBeenCalledOnce();
  expect(TestAudio.instances.filter(item=>!item.paused)).toHaveLength(0);
 });
 it('opens games and labs with app callbacks instead of fixed 2AP URLs, stopping the voice', () => {
  const connection=connected();render(<DidouHomePreview connection={connection}/>);
  for(const id of ['games','workshop'] as const){fireEvent.click(document.querySelector(`[data-home-place="${id}"]`)!);fireEvent.click(document.querySelector('[data-home-enter]')!);}
  expect(connection.onOpenGames).toHaveBeenCalledOnce();expect(connection.onOpenLabs).toHaveBeenCalledOnce();
  expect(connection.onStopSpeech).toHaveBeenCalled();
  expect(connection.onOpenExams).not.toHaveBeenCalled();
  expect(TestAudio.instances.filter(item=>!item.paused)).toHaveLength(0);
  expect(document.querySelector('[role=dialog]')).not.toBeInTheDocument();
 });
 it('keeps the real mission and course access when there is no map or next station', () => {
  const connection={...connected(),onOpenMap:null,onContinue:null,nextTitle:null,total:null};
  render(<DidouHomePreview connection={connection}/>);fireEvent.click(document.querySelector('[data-home-lessons]')!);
  expect(document.querySelector('[data-home-map]')).not.toBeInTheDocument();
  expect(document.querySelector('[data-home-continue]')).not.toBeInTheDocument();
  fireEvent.click(document.querySelector('[data-home-mission]')!);expect(connection.mission!.onStart).toHaveBeenCalledOnce();
  fireEvent.click(document.querySelector('[data-home-all-courses]')!);expect(connection.onOpenCourses).toHaveBeenCalledOnce();
 });
});

it('gives exams their own course-space entry, never the garden action', () => {
 const connection=connected();render(<DidouHomePreview connection={connection}/>);
 fireEvent.click(document.querySelector('[data-home-lessons]')!);
 fireEvent.click(document.querySelector('[data-home-exams]')!);
 expect(connection.onOpenExams).toHaveBeenCalledOnce();
 expect(connection.onOpenGames).not.toHaveBeenCalled();
});
