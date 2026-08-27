import { describe, it, expect } from 'vitest';
import { formatEducationalText, isolateMathRuns, LRI, PDI } from './textFormatter';

describe('formatEducationalText - Educational Text Formatter Utility', () => {
  it('formats numbered items with newlines (1), 2), 3))', () => {
    const input = '1) حساب عدد الكراريس الإجمالي: العملية العمودية: 35 × 48 = 1,680 كراساً. 2) حساب الثمن الإجمالي للكراريس: العملية العمودية: 1,680 × 85 = 142,800 DZD. الجواب: الثمن الإجمالي للشراء هو 142,800 دينار جزائري.';
    const output = formatEducationalText(input);

    expect(output).toContain(`1) حساب عدد الكراريس الإجمالي:\nالعملية العمودية: ${LRI}35 × 48 = 1,680${PDI} كراساً.`);
    expect(output).toContain('\n2) حساب الثمن الإجمالي للكراريس:');
    expect(output).toContain(`\nالعملية العمودية: ${LRI}1,680 × 85 = 142,800${PDI} DZD.`);
    // A lone number with no operator (last sentence) needs no isolation.
    expect(output).toContain('\nالجواب: الثمن الإجمالي للشراء هو 142,800 دينار جزائري.');
  });

  it('formats numbered items with dashes (1-, 2-, 3-)', () => {
    const input = '1- ممرضات: جمع مؤنث سالم. 2- زيت: اسم ثلاثي ساكن الوسط.';
    const output = formatEducationalText(input);

    expect(output).toBe('1- ممرضات: جمع مؤنث سالم.\n2- زيت: اسم ثلاثي ساكن الوسط.');
  });

  it('formats bullet points (•, *, -)', () => {
    const input = 'أركان الإسلام: • الشهادتان • إقام الصلاة • إيتاء الزكاة';
    const output = formatEducationalText(input);

    expect(output).toContain('أركان الإسلام:\n• الشهادتان\n• إقام الصلاة\n• إيتاء الزكاة');
  });

  it('inserts newline before key educational process markers (الحل:, الاستنتاج:, القاعدة:)', () => {
    const input = 'المسألة الأولى. الحل: حساب المجموع. الاستنتاج: التفوق محقق.';
    const output = formatEducationalText(input);

    expect(output).toContain('المسألة الأولى.\nالحل: حساب المجموع.\nالاستنتاج: التفوق محقق.');
  });

  it('handles null, undefined, or empty string gracefully', () => {
    expect(formatEducationalText('')).toBe('');
    expect(formatEducationalText(null)).toBe('');
    expect(formatEducationalText(undefined)).toBe('');
  });

  it('cleans up excessive blank lines (more than 2 consecutive newlines)', () => {
    const input = 'سطر أول\n\n\n\nسطر ثانٍ';
    const output = formatEducationalText(input);

    expect(output).toBe('سطر أول\n\nسطر ثانٍ');
  });

  // Regression tests: the numbered-step/bullet-point splitters used to fire on digits/dashes that
  // were part of a math expression, not a real list marker — "(1 × 10) + 8." was mistaken for step
  // markers "10)"/"8." and split mid-formula, and "48 - 23" was mistaken for a "- 23" bullet. Both
  // fed into the exact garbled exam solutions reported by the user.
  it('does not split a numbered-looking closing paren/period inside a math expression', () => {
    const input = 'ب) 45,618 = (4 × 10,000) + (5 × 1,000) + (6 × 100) + (1 × 10) + 8.';
    const output = formatEducationalText(input);

    expect(output).not.toContain('10)\n');
    expect(output).not.toContain('\n8');
  });

  it('does not split a subtraction "N - M" into a bullet line', () => {
    const output = formatEducationalText('العملية العمودية: 48 - 23 = 25.');
    expect(output).not.toContain('48\n-');
  });

  it('still splits a genuine numbered step that follows a completed sentence', () => {
    const output = formatEducationalText('الخطوة الأولى: 25 + 30 = 55. 2) الخطوة الثانية: تحقق من الجواب.');
    expect(output).toContain('\n2) الخطوة الثانية:');
  });
});

// Regression tests for a reported bug: exam solution text mixing Arabic with multi-term math
// expressions (e.g. a number decomposed into "(4 × 10,000) + (5 × 1,000) + ...") rendered with the
// terms visually scrambled/reordered inside the RTL solution box — unreadable for a child checking
// their answer. Root cause: no bidi isolation around the embedded LTR math runs.
describe('isolateMathRuns', () => {
  it('wraps the exact reported case: a number decomposed by multiplication and addition', () => {
    const input = 'ب) 45,618 = (4 × 10,000) + (5 × 1,000) + (6 × 100) + (1 × 10) + 8.';
    const output = isolateMathRuns(input);

    expect(output).toBe(
      `ب) ${LRI}45,618 = (4 × 10,000) + (5 × 1,000) + (6 × 100) + (1 × 10) + 8${PDI}.`
    );
  });

  it('wraps the exact reported case: a multi-digit comparison with a parenthetical explanation', () => {
    const input = 'أ) 67,508 < 67,580 (نقارن من اليسار: 6750=6750 ثم 8 < 8؟ لا: 0 مقابل 8 في العشرات).';
    const output = isolateMathRuns(input);

    // Each numeric/operator cluster gets its own isolate; the Arabic words in between stay as-is.
    expect(output).toBe(
      `أ) ${LRI}67,508 < 67,580${PDI} (نقارن من اليسار: ${LRI}6750=6750${PDI} ثم ${LRI}8 < 8${PDI}؟ لا: 0 مقابل 8 في العشرات).`
    );
  });

  it('does not wrap a lone number (no operator, nothing to reorder)', () => {
    expect(isolateMathRuns('الجواب هو 142,800 دينار.')).toBe('الجواب هو 142,800 دينار.');
    expect(isolateMathRuns('4 زوايا قائمة (90° لكل واحدة).')).toBe('4 زوايا قائمة (90° لكل واحدة).');
  });

  it('does not touch plain Arabic text with no digits', () => {
    const input = 'الجملة الاسمية تتكون من مبتدأ وخبر.';
    expect(isolateMathRuns(input)).toBe(input);
  });

  it('wraps a simple comparison and a percentage/division expression as one combined run', () => {
    expect(isolateMathRuns('40 < 47 < 50.')).toBe(`${LRI}40 < 47 < 50${PDI}.`);
    expect(isolateMathRuns('15% = (6,000 × 15) ÷ 100 = 900.')).toBe(
      `${LRI}15% = (6,000 × 15) ÷ 100 = 900${PDI}.`
    );
  });
});
