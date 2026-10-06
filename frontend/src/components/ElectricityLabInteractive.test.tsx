import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ElectricityLabInteractive } from './ElectricityLabInteractive';
import { LocaleProvider } from '../context/LocaleContext';

const renderLab = () =>
  render(
    <LocaleProvider>
      <ElectricityLabInteractive />
    </LocaleProvider>,
  );

describe('ElectricityLabInteractive switch', () => {
  it('opens the circuit and updates the explanation when the switch is turned off', () => {
    renderLab();
    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('انحياز أمامي');
    expect(document.querySelector('[data-elec-explain]')?.textContent).toContain('القاطعة مغلقة');

    fireEvent.click(document.querySelector('[data-elec-switch]') as HTMLElement);

    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('القاطعة مفتوحة');
    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('التيار لا يمر');
    expect(document.querySelector('[data-elec-explain]')?.textContent).toContain('قطع الحلقة');
  });
});
