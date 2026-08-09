import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiTutorModal } from './AiTutorModal';

describe('AiTutorModal Integration Tests (Gemini AI Tutor)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders modal with grade and quota information when open', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ remaining: 50, limit: 50 }),
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    expect(screen.getByText(/المعلّم الذكي "مسيد"/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/مثال: الكسور العشرية/i)).toBeInTheDocument();
  });

  it('displays loading spinner state when AI response is being generated', async () => {
    // Mock quota fetch and slow explain API response
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/gemini/quota')) {
        return Promise.resolve({ json: async () => ({ remaining: 50, limit: 50 }) });
      }
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    const submitBtn = screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i });
    fireEvent.click(submitBtn);

    // Should show loading state text and spinner
    expect(screen.getByText('المعلم مسيد يفكر ويشرح...')).toBeInTheDocument();
  });

  it('renders AI generated answer and cache hit badge on success (Happy Path)', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/gemini/quota')) {
        return Promise.resolve({ json: async () => ({ remaining: 50, limit: 50 }) });
      }
      return Promise.resolve({
        status: 200,
        json: async () => ({
          text: 'شرح مفصل للقسمة الإقليدية: القسمة هي عملية توزيع متساوٍ...',
          cached: true,
          cacheHitsCount: 3,
          usage: { remaining: 50, limit: 50 },
        }),
      });
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    const submitBtn = screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/شرح مفصل للقسمة الإقليدية/i)).toBeInTheDocument();
      expect(screen.getByText(/إجابة فورية مخزنة \(Cache Hit #3\)/i)).toBeInTheDocument();
    });
  });

  it('handles rate limit 429 error and displays user alert (Error Handling)', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/gemini/quota')) {
        return Promise.resolve({ json: async () => ({ remaining: 0, limit: 3 }) });
      }
      return Promise.resolve({
        status: 429,
        json: async () => ({
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'لقد تجاوزت الحد اليومي المسموح به لأسئلة الذكاء الاصطناعي.',
          limit: 3,
        }),
      });
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    const submitBtn = screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('لقد تجاوزت الحد اليومي المسموح به لأسئلة الذكاء الاصطناعي.')).toBeInTheDocument();
      expect(screen.getByText(/تنبيه نظام الحماية والحد اليومي/i)).toBeInTheDocument();
    });
  });

  it('handles network failure error gracefully (Error Handling)', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/gemini/quota')) {
        return Promise.resolve({ json: async () => ({ remaining: 5, limit: 5 }) });
      }
      return Promise.reject(new Error('Network error'));
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    const submitBtn = screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('تعذر الاتصال بالخادم. يرجى التحقق من الشبكة وإعادة المحاولة.')).toBeInTheDocument();
    });
  });
});
