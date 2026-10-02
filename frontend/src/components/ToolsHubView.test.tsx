import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsHubView } from './ToolsHubView';
import { INTERACTIVE_LABS_LIST } from '../data/subjectsData';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderHub = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('ToolsHubView', () => {
  it('shows the category hub on 1AP, not four compact tiles', () => {
    renderHub(
      <ToolsHubView
        grade="1AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId={null}
        catalogOpen
        onCatalogOpenChange={vi.fn()}
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-labs-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-labs-layout="young"]')).toBeNull();
    expect(document.querySelector('[data-young-lab="primary_math_ops"]')).toBeNull();
    expect(screen.getByText('الهوية والتراث')).toBeInTheDocument();
  });

  it('keeps the category hub from 5AP', () => {
    renderHub(
      <ToolsHubView
        grade="5AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId={null}
        catalogOpen
        onCatalogOpenChange={vi.fn()}
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-labs-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-labs-layout="young"]')).toBeNull();
  });

  it('hides catalog grid when a lab is focused (P0)', () => {
    renderHub(
      <ToolsHubView
        grade="5AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId="arabic_conjugator"
        catalogOpen={false}
        onCatalogOpenChange={vi.fn()}
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-lab-focused="true"]')).toBeTruthy();
    expect(screen.queryByText('🌟 جميع الأدوات')).toBeNull();
    expect(screen.getByText('اختر مختبراً آخر')).toBeInTheDocument();
  });

  it('restores the mobile hub when catalog is reopened after a focused lab', () => {
    const { rerender } = renderHub(
      <ToolsHubView
        grade="5AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId="arabic_conjugator"
        catalogOpen={false}
        onCatalogOpenChange={vi.fn()}
        onSelectTool={vi.fn()}
      />,
    );

    rerender(
      <LocaleProvider>
        <ToolsHubView
          grade="5AP"
          tools={INTERACTIVE_LABS_LIST}
          selectedToolId="arabic_conjugator"
          catalogOpen
          onCatalogOpenChange={vi.fn()}
          onSelectTool={vi.fn()}
        />
      </LocaleProvider>,
    );

    expect(document.querySelector('[data-lab-focused="false"]')).toBeTruthy();
    expect(screen.getByText('المختبرات التفاعلية')).toBeInTheDocument();
    expect(screen.getByText('الهوية والتراث')).toBeInTheDocument();
  });
});
