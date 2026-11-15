function evaluate(text: string): number {
  // Algerian convention (as in the lessons): thousands separated by U+202F or a space, decimal comma.
  const normalized = text
    .replace(/(?<=\d)[  \t]+(?=\d{3}(?:\D|$))/g, '')
    .replace(/(?<=\d),(?=\d)/g, '.');
  const tokens = normalized.match(/\d+(?:\.\d+)?|[()+×÷−\-/]/g) ?? [];
  if (tokens.join('') !== normalized.replace(/\s/g, '')) throw new Error('Not a complete numeric expression');
  let cursor = 0;
  const atom = (): number => {
    const token = tokens[cursor++];
    if (token === '(') { const value = sum(); if (tokens[cursor++] !== ')') throw new Error('Unbalanced'); return value; }
    if (!token || !/^\d/.test(token)) throw new Error('Missing operand');
    return Number(token);
  };
  const product = (): number => {
    let value = atom();
    while (['×', '÷', '/'].includes(tokens[cursor])) {
      const operator = tokens[cursor++]; const rhs = atom();
      value = operator === '×' ? value * rhs : value / rhs;
    }
    return value;
  };
  const sum = (): number => {
    let value = product();
    while (['+', '−', '-'].includes(tokens[cursor])) {
      const operator = tokens[cursor++]; const rhs = product();
      value = operator === '+' ? value + rhs : value - rhs;
    }
    return value;
  };
  const value = sum();
  if (cursor !== tokens.length || !Number.isFinite(value)) throw new Error('Incomplete');
  return value;
}
export function numericAssertions(text: string) {
  const assertions: { expression: string; valid: boolean }[] = [];
  // Catalogue notation: thousands are grouped with U+202F ("1 200"), decimals use a comma ("12,5").
  text = text.replace(/(?<=\d) (?=\d{3}(?!\d))/g, '').replace(/(?<=\d),(?=\d{1,2}(?!\d))/g, '.');
  for (let candidate of text.split(/[^0-9.,()+×÷−\-/=<>≤≥ \t ]+/).flatMap(part => part.split(/\.(?!\d)/))) {
    candidate = candidate.trim().replace(/^\d{1,2}\)[ \t]+/, '').replace(/^[=<>≤≥]+\s*/, '').replace(/[,  ]+$/, '');
    while (candidate.endsWith(')') && (candidate.match(/\)/g)?.length ?? 0) > (candidate.match(/\(/g)?.length ?? 0)) candidate = candidate.slice(0, -1);
    const operands = candidate.split(/[=<>≤≥]/); const comparisons = candidate.match(/[=<>≤≥]/g) ?? [];
    if (!comparisons.length) continue;
    // "47 = 4 dizaines + 7 unités", times and verbal fractions are not plain-number equalities.
    if (comparisons.every(operator => operator === '=') && !/[+×÷−\-/]/.test(candidate)) continue;
    let values: number[];
    try { values = operands.map(evaluate); } catch { continue; }
    assertions.push({ expression: candidate, valid: comparisons.every((operator, index) => {
      const a = values[index]; const b = values[index + 1];
      return operator === '=' ? Math.abs(a - b) < 1e-8 : operator === '<' ? a < b : operator === '>' ? a > b : operator === '≤' ? a <= b : a >= b;
    }) });
  }
  return assertions;
}
