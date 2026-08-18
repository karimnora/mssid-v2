import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiTutorModal } from './AiTutorModal';
import { springBootApi } from '../services/springBootApi';

describe('AiTutorModal Integration Tests (Gemini AI Tutor)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal with the topic input when open', () => {
    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    expect(screen.getByText(/المعلّم الذكي "مسيد"/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/مثال: الكسور العشرية/i)).toBeInTheDocument();
  });

  it('displays a loading state while waiting for the AI response', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockImplementation(
      () => new Promise(() => {}) // never resolves — keeps the button in loading state
    );

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    expect(screen.getByText('المعلم مسيد يفكر ويشرح...')).toBeInTheDocument();
  });

  it('renders the AI generated answer on success (Happy Path)', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 200,
      data: {
        responseText: 'شرح مفصل للقسمة الإقليدية: القسمة هي عملية توزيع متساوٍ...',
        status: 'success',
      },
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText(/شرح مفصل للقسمة الإقليدية/i)).toBeInTheDocument();
    });
  });

  // Regression test for the bug found in the CMS/AI audit: the backend answers 200 OK even when
  // Gemini itself failed, putting the raw exception text in the same field used for real answers
  // and only status:'error' distinguishes the two. The old code ignored status entirely, so a raw
  // backend exception was rendered inside the tutor's answer box as if a child had really been
  // taught by it.
  it('shows a generic error message instead of the raw backend text when the AI call fails (status: error)', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 200,
      data: {
        responseText: "Erreur lors de l'appel de l'API Gemini: 401 Unauthorized",
        status: 'error',
      },
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText('تعذر الوصول إلى المعلم الذكي حالياً. حاول مرة أخرى بعد قليل.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Erreur lors de l'appel de l'API Gemini/)).not.toBeInTheDocument();
  });

  it('handles a network failure gracefully', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockRejectedValue(new Error('Network error'));

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText('تعذر الاتصال بالخادم. يرجى التحقق من الشبكة وإعادة المحاولة.')).toBeInTheDocument();
    });
  });

  it('shows grade-specific suggested topic chips, and clicking one fills the topic field', () => {
    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="3AP" />);

    const chip = screen.getByRole('button', { name: /جدول الضرب/ });
    fireEvent.click(chip);

    expect(screen.getByPlaceholderText(/مثال: الكسور العشرية/i)).toHaveValue('جدول الضرب');
  });

  // "generate" mode now asks the backend for structured output (see GeminiAiService.
  // generatePracticeExercise) instead of one free-text blob with a "الحل:" heading the frontend used
  // to just trust was there — this locks in that the exercise, solution, and check question all
  // render from their own dedicated fields.
  it('renders exercise, solution, and an interactive check question for "generate" mode structured output', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 200,
      data: {
        status: 'success',
        exerciseText: 'احسب ناتج 24 × 3.',
        solutionText: 'الجواب هو 72، لأن 24 × 3 = 72.',
        quickCheck: {
          questionAr: 'كم ناتج 24 × 3؟',
          options: [
            { labelAr: '62', isCorrect: false },
            { labelAr: '72', isCorrect: true },
          ],
        },
      },
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="3AP" />);
    fireEvent.click(screen.getByRole('button', { name: /ولّد مسألة تدريبية جديدة/i }));
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText('احسب ناتج 24 × 3.')).toBeInTheDocument();
    });
    expect(screen.getByText(/الجواب هو 72/)).toBeInTheDocument();
    expect(screen.getByText(/كم ناتج 24 × 3؟/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('72'));
    expect(screen.getByText(/أحسنت! إجابة صحيحة/)).toBeInTheDocument();
  });
});
