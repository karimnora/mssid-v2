import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsHubView } from './ToolsHubView';
import { INTERACTIVE_LABS_LIST } from '../data/subjectsData';

describe('ToolsHubView', () => {
  it('shows the category hub on 1AP, not four compact tiles', () => {
    render(
      <ToolsHubView
        grade="1AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId="primary_math_ops"
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-labs-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-labs-layout="young"]')).toBeNull();
    expect(document.querySelector('[data-young-lab="primary_math_ops"]')).toBeNull();
    expect(screen.getByText('الهوية والتراث')).toBeInTheDocument();
  });

  it('keeps the category hub from 5AP', () => {
    render(
      <ToolsHubView
        grade="5AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId="arabic_conjugator"
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-labs-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-labs-layout="young"]')).toBeNull();
  });
});
