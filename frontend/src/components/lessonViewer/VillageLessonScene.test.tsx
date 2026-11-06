import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { VillageLessonScene } from './VillageLessonScene';
vi.mock('../../utils/speech', () => ({ stopSpeech: vi.fn() }));
it('suspends only legacy surfaces and preserves arriving global messages', () => {
  const root = document.createElement('div');
  root.id = 'root';
  root.style.display = 'grid';
  document.body.append(root);
  const chrome = document.createElement('header');
  chrome.setAttribute('data-app-header', '');
  chrome.style.display = 'flex';
  chrome.setAttribute('aria-hidden', 'false');
  root.append(chrome);
  const mount = document.createElement('div');
  root.append(mount);
  const view = render(
    <VillageLessonScene><button type="button">داخل الدرس</button></VillageLessonScene>,
    { container: mount }
  );
  expect(root.style.display).toBe('grid');
  expect(root.inert).not.toBe(true);
  expect(root).not.toHaveAttribute('aria-hidden');
  expect(chrome.style.display).toBe('none');
  expect(chrome.inert).toBe(true);
  expect(chrome).toHaveAttribute('aria-hidden', 'true');
  expect(screen.getByRole('button', { name: 'داخل الدرس' })).toBeVisible();
  const alert = document.createElement('div');
  alert.setAttribute('role', 'alert');
  alert.textContent = 'رسالة من التطبيق';
  root.append(alert);
  expect(screen.getByRole('alert')).toBeVisible();
  expect(alert.closest('[inert], [aria-hidden="true"]')).toBeNull();
  view.unmount();
  expect(chrome.style.display).toBe('flex');
  expect(chrome.inert).not.toBe(true);
  expect(chrome).toHaveAttribute('aria-hidden', 'false');
  expect(root.style.display).toBe('grid');
  expect(document.body).not.toHaveClass('mssid-village-scene-active');
  root.remove();
});
