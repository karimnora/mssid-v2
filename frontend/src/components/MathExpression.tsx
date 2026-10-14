import React from 'react';
import { isolateMathRuns } from '../utils/textFormatter';

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

/**
 * Use the same complete-expression isolation as exam solutions. Splitting on whitespace used
 * to isolate only "+"/"(3" fragments and leave operands in the surrounding RTL paragraph.
 * Unicode isolates also allow long expressions to wrap naturally on a narrow screen.
 */
export function renderTextWithMath(text: string | undefined | null): React.ReactNode {
  if (!text) return null;
  return isolateMathRuns(text);
}
