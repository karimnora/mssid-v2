import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolsHubView } from './ToolsHubView';
import { INTERACTIVE_LABS_LIST } from '../data/subjectsData';

describe('ToolsHubView young grades', () => {
  it('shows four lab tiles on 1AP and skips the four desktop categories', () => {
    render(
      <ToolsHubView
        grade="1AP"
        tools={INTERACTIVE_LABS_LIST}
        selectedToolId="math"
        onSelectTool={vi.fn()}
      />
    );
    expect(document.querySelector('[data-labs-layout="young"]')).toBeTruthy();
    expect(document.querySelector('[data-young-lab="primary_math_ops"]')).toBeTruthy();
    expect(document.querySelector('[data-young-lab="primary_discovery"]')).toBeTruthy();
    expect(document.querySelector('[data-young-lab="algerian_market"]')).toBeTruthy();
    expect(document.querySelector('[data-young-lab="touch_writing"]')).toBeTruthy();
    expect(screen.queryByText('الهوية والتراث')).not.toBeInTheDocument();
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
    expect(document.querySelector('[data-labs-layout="young"]')).toBeNull();
  });
});
