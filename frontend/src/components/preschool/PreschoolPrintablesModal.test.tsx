import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PreschoolPrintablesModal } from './PreschoolPrintablesModal';
import { PRINTABLE_WORKSHEETS } from '../../data/preschool/printablesData';

const firstGraphisme = PRINTABLE_WORKSHEETS.find((s) => s.category === 'graphisme')!;
const firstColoriage = PRINTABLE_WORKSHEETS.find((s) => s.category === 'coloriage')!;

describe('PreschoolPrintablesModal', () => {
  it('renders the active worksheet inside a printable-sheet overlay', () => {
    render(<PreschoolPrintablesModal language="ar" onExit={vi.fn()} />);
    expect(document.querySelector('.sheet-print-modal')).toBeTruthy();
    expect(document.querySelector('[data-preschool-printable="true"]')).toBeTruthy();
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(screen.getAllByText(firstGraphisme.titleI18n.ar).length).toBeGreaterThan(0);
    expect(screen.getByText(firstGraphisme.instructionI18n.ar, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByText('مَسِيد DZ — التحضيري').length).toBeGreaterThan(0);
  });

  it('hides chrome from paper with no-print on header, tabs and list', () => {
    render(<PreschoolPrintablesModal language="fr" onExit={vi.fn()} />);
    const overlay = document.querySelector('.sheet-print-modal')!;
    const noPrint = overlay.querySelectorAll('.no-print');
    expect(noPrint.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('Imprimer / Enregistrer en PDF').closest('.no-print')).toBeTruthy();
  });

  it('calls window.print from the print button', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<PreschoolPrintablesModal language="fr" onExit={vi.fn()} />);
    await userEvent.click(screen.getByText('Imprimer / Enregistrer en PDF'));
    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));
    printSpy.mockRestore();
  });

  it('switches category and still keeps a printable sheet', async () => {
    render(<PreschoolPrintablesModal language="fr" onExit={vi.fn()} />);
    await userEvent.click(screen.getByText('Coloriage'));
    expect(screen.getAllByText(firstColoriage.titleI18n.fr).length).toBeGreaterThan(0);
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(document.querySelector('svg')).toBeTruthy();
  });

  it('closes via the close button', async () => {
    const onExit = vi.fn();
    render(<PreschoolPrintablesModal language="ar" onExit={onExit} />);
    await userEvent.click(screen.getByLabelText('خروج / Fermer / Close'));
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('replaces an Arabic selection with a Latin worksheet when switching to French', async () => {
    const { rerender } = render(<PreschoolPrintablesModal language="ar" onExit={vi.fn()} />);
    await userEvent.click(screen.getByText('تَتَبُّع الحُرُوف'));
    expect(document.querySelector('.paper-large-glyph')?.textContent).toContain('أ');
    rerender(<PreschoolPrintablesModal language="fr" onExit={vi.fn()} />);
    const paper = document.querySelector('.preschool-worksheet')!;
    expect(paper.textContent).not.toMatch(/\p{Script=Arabic}/u);
    expect(paper.querySelector('.paper-large-glyph')?.textContent).toContain('A');
  });

  it.each(['fr', 'en'] as const)('does not include Arabic letter sheets in the %s category print pack', async language => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {
      const sheets = [...document.querySelectorAll('.preschool-worksheet')];
      expect(sheets.length).toBeGreaterThanOrEqual(26);
      sheets.forEach(sheet => expect(sheet.textContent).not.toMatch(/\p{Script=Arabic}/u));
    });
    render(<PreschoolPrintablesModal language={language} onExit={vi.fn()} />);
    await userEvent.click(screen.getByText(language === 'fr' ? 'Traçage des lettres' : 'Letter tracing'));
    await userEvent.click(screen.getByRole('button', { name: language === 'fr' ? /Imprimer le cahier/ : /Print booklet/ }));
    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));
    printSpy.mockRestore();
  });
});
