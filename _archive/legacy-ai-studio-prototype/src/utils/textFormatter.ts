/**
 * Utility to format educational texts for primary school children.
 * Automatically splits packed strings with numbered items (1), 2), 3) or 1-, 2-, 3-)
 * or process markers (العملية العمودية:, الجواب:, الحل:, etc.) onto separate lines.
 */
export function formatEducationalText(text: string | undefined | null): string {
  if (!text) return '';

  let formatted = text.trim();

  // Normalize CRLF to LF
  formatted = formatted.replace(/\r\n/g, '\n');

  // Insert a newline before numbered steps: " 1)", " 2)", " 1-", " 2-", " 1.", " 2.", " 1/ "
  // Matches digits 1-20 followed by ), -, ., or / when preceded by space/sentence boundary
  formatted = formatted.replace(/(?<!^|\n)\s+(?=\b([1-9]|1[0-9]|20)[\)\-\.\/]\s*)/g, '\n');

  // Insert a newline before bullet points: " •", " *", " -"
  formatted = formatted.replace(/(?<!^|\n)\s+(?=[•\*\-]\s+)/g, '\n');

  // Key process markers in primary school math, science, and grammar
  const processKeywords = [
    'العملية العمودية:',
    'العملية الأفقیة:',
    'العملية الأفقية:',
    'العملية:',
    'الجواب:',
    'الحل:',
    'الحل النموذجي:',
    'النتيجة:',
    'الاستنتاج:',
    'التشخيص:',
    'النصائح:',
    'الشرح:',
    'السبب:',
    'العلاج:',
    'التفسير:',
    'الميزتان:',
    'المقدمة:',
    'العرض:',
    'الخاتمة:',
    'الإعراب:',
    'المشكلة:',
    'الوضعية:',
    'التطبيق:',
    'القاعدة:',
    'الشواهد:',
    'ملاحظة:',
    'تنبيه:',
    'خطوة 1:',
    'خطوة 2:',
    'خطوة 3:'
  ];

  for (const kw of processKeywords) {
    const escapedKw = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(?<!^|\\n)\\s+(?=${escapedKw})`, 'g');
    formatted = formatted.replace(regex, '\n');
  }

  // Clean up excessive blank lines (max 2 consecutive newlines)
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted.trim();
}
