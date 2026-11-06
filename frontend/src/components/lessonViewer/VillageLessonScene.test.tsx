import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { VillageLessonScene } from './VillageLessonScene';
vi.mock('../../utils/speech', () => ({ stopSpeech: vi.fn() }));
it('isolates the legacy app and restores it when leaving the scene', () => {
  const root = document.createElement('div');
  root.id = 'root';
  root.style.display = 'grid';
  document.body.append(root);
  const view = render(
    <VillageLessonScene>
      <button type="button">داخل الدرس</button>
    </VillageLessonScene>,
    { container: root }
  );
  expect(root.style.display).toBe('none');
  expect(root.inert).toBe(true);
  expect(root).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('main')).toHaveAttribute('data-village-lesson-scene');
  expect(screen.getByRole('button', { name: 'داخل الدرس' })).toBeVisible();
  view.unmount();
  expect(root.style.display).toBe('grid');
  expect(root.inert).toBe(false);
  expect(root).not.toHaveAttribute('aria-hidden');
  expect(document.body).not.toHaveClass('mssid-village-scene-active');
  root.remove();
});
