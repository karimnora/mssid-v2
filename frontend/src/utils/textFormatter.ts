/**
 * Utility to format educational texts for primary school children.
 * Automatically splits packed strings with numbered items (1), 2), 3) or 1-, 2-, 3-)
 * or process markers (العملية العمودية:, الجواب:, الحل:, etc.) onto separate lines.
 */
export function stripArabicTashkeel(text: string): string {
  return text.replace(/[\u064B-\u0652]/g, '');
}

// Unicode "Left-to-Right Isolate" (U+2066) / "Pop Directional Isolate" (U+2069) \u2014 invisible
// control characters, safe to embed in plain text rendered by React (no HTML/markup involved).
// Written as escapes rather than the raw invisible glyphs so they stay visible/greppable in source.
export const LRI = '\u2066';
export const PDI = '\u2069';

// Matches a run of digits/operators/punctuation long enough to be a math expression: starts and
// ends on a digit (or %, \u00B0, closing paren), and may contain operators, commas, decimal points,
// same-line spaces and parentheses in between. Deliberately requires digit-anchored ends so it
// never reaches into the Arabic word on either side. The inner whitespace is space/tab only (not
// \n): this runs after the newline-insertion passes above, and a run must never bridge across an
// already-inserted line break \u2014 otherwise an unrelated genuine list marker on the next line (e.g.
// "2)") gets swallowed into the previous line's math isolate.
const MATH_RUN = /(?:\([ \t]*)*[0-9٠-٩][0-9٠-٩.,٫٬%\u00B0+x*\-\u2212\u00D7\u00F7/=<>≤≥() \t]*[0-9٠-٩%\u00B0)]/g;
// A lone number ("142,800") has no bidi-reordering risk by itself \u2014 only wrap runs that actually
// combine multiple terms with an operator/comparison symbol.
const HAS_OPERATOR = /[+x*\-\u2212\u00D7\u00F7/=<>≤≥]/;

/**
 * Wraps embedded math expressions (e.g. "45,618 = (4 \u00D7 10,000) + (5 \u00D7 1,000) + ...") in bidi
 * isolates so the browser renders them left-to-right in place, instead of reordering the terms
 * against the surrounding RTL Arabic paragraph. Without this, a solution like
 * "\u0628) 45,618 = (4 \u00D7 10,000) + (5 \u00D7 1,000) + (6 \u00D7 100) + (1 \u00D7 10) + 8." can visually scramble into
 * something like "(10 \u00D7 1) + (100 \u00D7 1) + (1,000 \u00D7 5) + (10,000 \u00D7 4)" \u2014 unreadable for a child
 * checking their answer (revue utilisateur : r\u00E9ponses des examens mal affich\u00E9es).
 */
export function isolateMathRuns(text: string): string {
  return text.replace(MATH_RUN, (run) => {
    if (!HAS_OPERATOR.test(run)) return run;
    // A numbered answer is Arabic page structure, not an operand in its equation.
    const marker = run.match(/^[0-9٠-٩]{1,2}\)[ \t]+/)?.[0] ?? '';
    let expression = run.slice(marker.length);
    let suffix = '';
    // Keep the enclosing Arabic sentence's closing parenthesis outside the LTR island.
    while (expression.endsWith(')') && (expression.match(/\)/g)?.length ?? 0) > (expression.match(/\(/g)?.length ?? 0)) {
      expression = expression.slice(0, -1); suffix = `)${suffix}`;
    }
    return `${marker}${LRI}${expression}${PDI}${suffix}`;
  });
}

/** "2 / 4" that cannot visually reverse to "4 / 2" inside a surrounding RTL sentence. */
export function formatProgressCount(current: number, total: number): string {
  return `${LRI}${current} / ${total}${PDI}`;
}

export function formatEducationalText(text: string | undefined | null, options?: { hideTashkeel?: boolean }): string {
  if (!text) return '';

  let formatted = text.trim();
  if (options?.hideTashkeel) {
    formatted = stripArabicTashkeel(formatted);
  }

  // Normalize CRLF to LF
  formatted = formatted.replace(/\r\n/g, '\n');

  // Insert a newline before numbered steps: " 1)", " 2)", " 1-", " 2-", " 1.", " 2.", " 1/ "
  // Matches digits 1-20 followed by ), -, ., or / when preceded by space/sentence boundary.
  // Excludes a digit/operator/"(" right before the whitespace: without this, a math expression
  // like "(1 × 10) + 8." gets its "10)" and "8." mistaken for step markers "10)"/"8." and split
  // onto their own lines mid-formula (revue utilisateur : réponses des examens mal affichées).
  formatted = formatted.replace(/(?<![0-9+\-×÷=<>(])(?<!^|\n)\s+(?=\b([1-9]|1[0-9]|20)[\)\-\.\/]\s*)/g, '\n');

  // Insert a newline before bullet points: " •", " *", " -"
  // Same digit/operator exclusion as the numbered-step rule above: without it, a subtraction like
  // "48 - 23 = 25" gets its " - " mistaken for a bullet marker and split into "48" / "- 23 = 25".
  formatted = formatted.replace(/(?<![0-9+\-×÷=<>(])(?<!^|\n)\s+(?=[•\*\-]\s+)/g, '\n');

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

  formatted = isolateMathRuns(formatted);

  return formatted.trim();
}
