import { describe, it, expect } from 'vitest';
import { formatEducationalText } from './textFormatter';

describe('formatEducationalText - Educational Text Formatter Utility', () => {
  it('formats numbered items with newlines (1), 2), 3))', () => {
    const input = '1) حساب عدد الكراريس الإجمالي: العملية العمودية: 35 × 48 = 1,680 كراساً. 2) حساب الثمن الإجمالي للكراريس: العملية العمودية: 1,680 × 85 = 142,800 DZD. الجواب: الثمن الإجمالي للشراء هو 142,800 دينار جزائري.';
    const output = formatEducationalText(input);

    expect(output).toContain('1) حساب عدد الكراريس الإجمالي:\nالعملية العمودية: 35 × 48 = 1,680 كراساً.');
    expect(output).toContain('\n2) حساب الثمن الإجمالي للكراريس:');
    expect(output).toContain('\nالعملية العمودية: 1,680 × 85 = 142,800 DZD.');
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
});
