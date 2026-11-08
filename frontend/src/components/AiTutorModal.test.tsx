import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AiTutorModal } from './AiTutorModal';
import { LocaleProvider } from '../context/LocaleContext';
vi.mock('../utils/speech', () => ({ stopSpeech: vi.fn(), speakText: vi.fn() }));
vi.mock('./musaidi/MusaidiPanel', () => ({ MusaidiPanel: ({grade}: {grade:string}) => <p data-testid="grade">{grade}</p> }));
afterEach(cleanup);
describe('Prepared assistant modal', () => {
 it('passes the actual grade without a pilot or mode switch', () => {
  render(<AiTutorModal isOpen grade="5AP" onClose={vi.fn()} />, {wrapper: LocaleProvider});
  expect(screen.getByTestId('grade')).toHaveTextContent('5AP');
  expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  expect(screen.queryByText(/طريقة موجّهة|Méthode guidée|pilote/)).not.toBeInTheDocument();
 });
 it('closes with Escape', () => {
  const close = vi.fn();
  render(<AiTutorModal isOpen grade="2AP" onClose={close} />, {wrapper: LocaleProvider});
  fireEvent.keyDown(window, {key:'Escape'});
  expect(close).toHaveBeenCalledOnce();
 });
});
