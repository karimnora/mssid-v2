import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppModals } from './useAppModals';

describe('useAppModals — openErrorReport', () => {
  it('opens the contact modal with a pre-filled, context-labeled bug report message', () => {
    const { result } = renderHook(() => useAppModals());

    expect(result.current.isContactModalOpen).toBe(false);
    expect(result.current.contactPrefillMessage).toBeNull();

    act(() => {
      result.current.openErrorReport('Examen 5AP Maths T2 — Question 3');
    });

    expect(result.current.isContactModalOpen).toBe(true);
    expect(result.current.contactPrefillMessage).toContain('Examen 5AP Maths T2 — Question 3');
  });
});
