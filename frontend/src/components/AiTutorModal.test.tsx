import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AiTutorModal } from './AiTutorModal';
import { springBootApi } from '../services/springBootApi';

describe('AiTutorModal Integration Tests (Gemini AI Tutor)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(springBootApi, 'getAiQuota').mockResolvedValue({
      status: 200,
      data: { allowed: true, remaining: 3, limit: 3, resetHours: 24 },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal with the topic input when open', async () => {
    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    expect(screen.getByText(/المعلّم الذكي "مسيد"/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/مثال: الكسور العشرية/i)).toBeInTheDocument();
    expect(await screen.findByText('باقي 3 من 3 أسئلة اليوم')).toBeInTheDocument();
  });

  it('pre-fills the topic with the first chip of the opened grade, not a 4AP/5AP default', async () => {
    const { rerender } = render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="1AP" />);

    expect(screen.getByRole('button', { name: /حرف الباء وحركاته/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByPlaceholderText(/مثال: الكسور العشرية/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /حل مسألة أو سؤال/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ولّد مسألة تدريبية جديدة/ })).not.toBeInTheDocument();
    expect(await screen.findByText('باقي 3 من 3 أسئلة اليوم')).toBeInTheDocument();

    rerender(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    expect(screen.getByPlaceholderText(/مثال: الكسور العشرية/i)).toHaveValue('الحال والتمييز');
    expect(screen.queryByRole('button', { name: /إنّ وأخواتها/ })).not.toBeInTheDocument();
  });

  it('shows remaining daily questions in the modal', async () => {
    vi.mocked(springBootApi.getAiQuota).mockResolvedValue({
      status: 200,
      data: { allowed: true, remaining: 2, limit: 3, resetHours: 12 },
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);

    expect(await screen.findByText('باقي 2 من 3 أسئلة اليوم')).toBeInTheDocument();
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

  it('lets a 1AP child ask from chips with a listen button on the answer', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 200,
      data: {
        responseText: 'الباء حرف من حروف الهجاء.',
        status: 'success',
        quotaRemaining: 2,
        quotaLimit: 3,
      },
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="1AP" />);
    fireEvent.click(screen.getByRole('button', { name: 'اشرح لي' }));

    expect(await screen.findByText('الباء حرف من حروف الهجاء.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'استمع' })).toBeInTheDocument();
    expect(screen.getByText('باقي 2 من 3 أسئلة اليوم')).toBeInTheDocument();
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
    expect(screen.getByText(/كم ناتج 24 × 3؟/)).toBeInTheDocument();
    expect(screen.queryByText(/الجواب هو 72/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('72'));
    expect(screen.getByText(/أحسنت! إجابة صحيحة/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /عرض الحل للوالدين/ }));
    expect(screen.getByText('بوابة الوالدين')).toBeInTheDocument();
    const prompt = screen.getByText(/^\d+ \+ \d+ = \?$/);
    const [a, b] = prompt.textContent!.match(/\d+/g)!.map(Number);
    fireEvent.change(screen.getByPlaceholderText('اكتب الناتج هنا'), { target: { value: String(a + b) } });
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));

    expect(screen.getByText(/الجواب هو 72/)).toBeInTheDocument();
  });

  it('surfaces the daily quota message when the backend answers 429', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 429,
      error: 'لقد استنفدت حصتك اليومية من أسئلة المعلم الذكي (3/3). حاول مرة أخرى بعد حوالي 12 ساعة.',
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText(/استنفدت حصتك اليومية/)).toBeInTheDocument();
    });
  });

  it('asks the child to sign in when the backend answers 401', async () => {
    vi.spyOn(springBootApi, 'askGeminiExplain').mockResolvedValue({
      status: 401,
      error: 'Non autorisé',
    });

    render(<AiTutorModal isOpen={true} onClose={vi.fn()} grade="5AP" />);
    fireEvent.click(screen.getByRole('button', { name: /اطلب الإجابة من المعلم الذكي/i }));

    await waitFor(() => {
      expect(screen.getByText('يجب تسجيل الدخول لاستخدام المعلم الذكي.')).toBeInTheDocument();
    });
  });
});
