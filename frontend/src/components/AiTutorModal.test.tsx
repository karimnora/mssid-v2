import React from 'react';
import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {AiTutorModal} from './AiTutorModal';
import {LocaleProvider} from '../context/LocaleContext';
import {setStoredLocale} from '../localePreference';
import type {CourseLesson} from '../types';
import {springBootApi} from '../services/springBootApi';
vi.mock('../utils/speech',()=>({speakText:vi.fn(),stopSpeech:vi.fn()}));
const guideTab=()=>fireEvent.click(screen.getByRole('button',{name:/Méthode guidée|طريقة موجّهة/}));
const show=(grade:'1AP'|'2AP'|'5AP'='1AP',onReviewLesson=vi.fn())=>{const view=render(<AiTutorModal isOpen onClose={vi.fn()} grade={grade} onReviewLesson={onReviewLesson}/>,{wrapper:LocaleProvider});guideTab();return view;};
beforeEach(()=>{localStorage.clear();setStoredLocale('fr');});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('Prepared child accompaniment',()=>{
 it('provides help without AI requests or quotas, even for free users',()=>{
  const quota=vi.spyOn(springBootApi,'getAiQuota');const explain=vi.spyOn(springBootApi,'askGeminiExplain');show();
  expect(screen.getByRole('dialog')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Un indice'}));
  expect(screen.getByText('Choisis un objet comme repère.')).toBeInTheDocument();
  expect(quota).not.toHaveBeenCalled();expect(explain).not.toHaveBeenCalled();
 });
 it('allows wrong-example retries without invoking course navigation or completion',()=>{
  const review=vi.fn();show('1AP',review);fireEvent.click(screen.getByRole('button',{name:'Un exemple similaire'}));
  fireEvent.click(screen.getByRole('button',{name:'Sur la chaise.'}));expect(screen.getByRole('status')).toHaveTextContent('Réessaie');
  fireEvent.click(screen.getByRole('button',{name:'Sous la chaise.'}));expect(screen.getByRole('status')).not.toHaveTextContent('Réessaie');
  expect(screen.getByText(/Sans points ni validation/)).toBeInTheDocument();expect(review).not.toHaveBeenCalled();
 });
 it('resets hints and examples when switching grade',()=>{
  show();fireEvent.click(screen.getByRole('button',{name:'Un indice'}));fireEvent.click(screen.getByRole('button',{name:'2AP'}));
  expect(screen.queryByText('Choisis un objet comme repère.')).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'Un indice'})).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toHaveValue('math-2ap-c-numbers-999');
 });
 it('clearly announces the pilot limit to older children',()=>{show('5AP');expect(screen.getByText(/Le pilote couvre/)).toBeInTheDocument();});
 it('opens the current lesson notion and returns to its linked course on request',()=>{
  const close=vi.fn(),review=vi.fn();const lesson={id:'math-1ap-t2-addition-concept',grade:'1AP',subject:'math'} as CourseLesson;
  render(<AiTutorModal isOpen onClose={close} grade="1AP" lesson={lesson} onReviewLesson={review}/>,{wrapper:LocaleProvider});guideTab();
  expect(screen.getByRole('combobox')).toHaveValue('math-1ap-c-addition');fireEvent.click(screen.getByRole('button',{name:'Un exemple similaire'}));
  expect(screen.getByText('Tu as 3 jetons et tu en ajoutes 2. Combien en as-tu ?')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Revoir le cours lié'}));expect(close).toHaveBeenCalledOnce();expect(review).toHaveBeenCalledWith(lesson.id);
 });
 it('has Arabic help and closes with Escape',()=>{
  setStoredLocale('ar');const close=vi.fn();render(<AiTutorModal isOpen onClose={close} grade="2AP"/>,{wrapper:LocaleProvider});guideTab();
  expect(screen.getByRole('dialog')).toHaveAttribute('dir','rtl');fireEvent.click(screen.getByRole('button',{name:'مساعدة'}));
  fireEvent.keyDown(window,{key:'Escape'});expect(close).toHaveBeenCalledOnce();
 });
});
