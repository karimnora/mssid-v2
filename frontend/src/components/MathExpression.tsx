import React from 'react';

// Arabic (and most RTL scripts) reorder text visually by the Unicode Bidi Algorithm. Digits stay
// LTR on their own, but once an expression mixes digits with parentheses/operators inside an RTL
// paragraph, the algorithm can flip operand order and mirror "(" / ")" — e.g. "(3 + 5) × 2" can
// render with the parenthesised group on the wrong side. Isolating the expression in its own
// dir="ltr" span (unicode-bidi: isolate) keeps its internal layout fixed regardless of the
// surrounding paragraph direction, without affecting the RTL flow of the Arabic text around it.
interface MathExpressionProps {
  children: React.ReactNode;
  className?: string;
}

export const MathExpression: React.FC<MathExpressionProps> = ({ children, className = '' }) => (
  <span dir="ltr" style={{ unicodeBidi: 'isolate' }} className={`inline-block ${className}`}>
    {children}
  </span>
);

// A token counts as "math" only if it contains a digit AND at least one operator/paren/equals sign —
// bare words never match, and a lone number ("التمرين 3") is left inline since a single number is
// never visually reordered by the bidi algorithm on its own.
const MATH_TOKEN = /^[0-9٠-٩()×x*÷/+\-=.,%]+$/;

function isMathToken(token: string): boolean {
  if (!MATH_TOKEN.test(token)) return false;
  const hasDigit = /[0-9٠-٩]/.test(token);
  const hasSymbol = /[()×x*÷/+\-=]/.test(token);
  return hasDigit && hasSymbol;
}

/**
 * Splits `text` on whitespace and wraps consecutive runs of math-like tokens in an isolated
 * <MathExpression>, leaving surrounding Arabic/French/English words untouched. Safe to use as
 * React children anywhere `text` used to be rendered directly (no dangerouslySetInnerHTML).
 */
export function renderTextWithMath(text: string | undefined | null): React.ReactNode {
  if (!text) return null;

  const parts = text.split(/(\s+)/);
  const nodes: React.ReactNode[] = [];
  let buffer: string[] = [];
  let key = 0;

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    nodes.push(
      <MathExpression key={`math-${key++}`}>{buffer.join('')}</MathExpression>
    );
    buffer = [];
  };

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      if (buffer.length > 0) {
        buffer.push(part);
      } else {
        nodes.push(part);
      }
      continue;
    }
    if (isMathToken(part)) {
      buffer.push(part);
    } else {
      flushBuffer();
      nodes.push(part);
    }
  }
  flushBuffer();

  return nodes;
}
