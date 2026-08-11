export class MathParserError extends Error {}

type TokenType = 'number' | 'operator' | 'paren' | 'variable' | 'percent';

type Token = {
  type: TokenType;
  value: string;
};

export interface LinearValue {
  coef: number;
  constant: number;
}

const normalize = (text: string): string =>
  text
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '.')
    .replace(/×/g, '*')
    .replace(/％/g, '%')
    .trim();

const tokenize = (input: string): Token[] => {
  const text = normalize(input);
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    if (char === ' ') {
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(char)) {
      let num = char;
      i += 1;
      while (i < text.length && /[0-9.]/.test(text[i])) {
        num += text[i];
        i += 1;
      }
      if (num.split('.').length > 2) {
        throw new MathParserError('Nombre invalide.');
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }
    if (char === 'x' || char === 'X') {
      tokens.push({ type: 'variable', value: 'x' });
      i += 1;
      continue;
    }
    if (char === '%') {
      tokens.push({ type: 'percent', value: '%' });
      i += 1;
      continue;
    }
    if ('+-*/'.includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i += 1;
      continue;
    }
    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      i += 1;
      continue;
    }
    throw new MathParserError(`Caractère non pris en charge : ${char}`);
  }

  return tokens;
};

const add = (a: LinearValue, b: LinearValue): LinearValue => ({
  coef: a.coef + b.coef,
  constant: a.constant + b.constant,
});

const subtract = (a: LinearValue, b: LinearValue): LinearValue => ({
  coef: a.coef - b.coef,
  constant: a.constant - b.constant,
});

const multiply = (a: LinearValue, b: LinearValue): LinearValue => {
  if (a.coef !== 0 && b.coef !== 0) {
    throw new MathParserError('Multiplication entre variables non prise en charge.');
  }
  if (a.coef !== 0) {
    return { coef: a.coef * b.constant, constant: 0 };
  }
  if (b.coef !== 0) {
    return { coef: b.coef * a.constant, constant: 0 };
  }
  return { coef: 0, constant: a.constant * b.constant };
};

const divide = (a: LinearValue, b: LinearValue): LinearValue => {
  if (b.coef !== 0) {
    throw new MathParserError('Division par une variable non prise en charge.');
  }
  if (b.constant === 0) {
    throw new MathParserError('Division par zéro.');
  }
  return { coef: a.coef / b.constant, constant: a.constant / b.constant };
};

const percent = (value: LinearValue): LinearValue => ({
  coef: value.coef / 100,
  constant: value.constant / 100,
});

const parseExpression = (tokens: Token[]): LinearValue => {
  let position = 0;

  const peek = (): Token | undefined => tokens[position];
  const consume = (): Token => tokens[position++];

  const parseFactor = (): LinearValue => {
    const token = peek();
    if (!token) {
      throw new MathParserError('Expression incomplète.');
    }

    if (token.type === 'operator' && token.value === '-') {
      consume();
      const value = parseFactor();
      return { coef: -value.coef, constant: -value.constant };
    }

    if (token.type === 'paren' && token.value === '(') {
      consume();
      const value = parseSum();
      if (peek()?.type !== 'paren' || peek()?.value !== ')') {
        throw new MathParserError('Parenthèse fermante manquante.');
      }
      consume();
      return parsePercent(value);
    }

    if (token.type === 'number') {
      consume();
      const numberValue = parseFloat(token.value);
      return parsePercent({ coef: 0, constant: numberValue });
    }

    if (token.type === 'variable') {
      consume();
      return parsePercent({ coef: 1, constant: 0 });
    }

    throw new MathParserError(`Jeton inattendu: ${token.value}`);
  };

  const parsePercent = (value: LinearValue): LinearValue => {
    if (peek()?.type === 'percent') {
      consume();
      return percent(value);
    }
    return value;
  };

  const parseTerm = (): LinearValue => {
    let value = parseFactor();
    while (peek()?.type === 'operator' && ['*', '/'].includes(peek()!.value)) {
      const operator = consume().value;
      const nextValue = parseFactor();
      value = operator === '*' ? multiply(value, nextValue) : divide(value, nextValue);
    }
    return value;
  };

  const parseSum = (): LinearValue => {
    let value = parseTerm();
    while (peek()?.type === 'operator' && ['+', '-'].includes(peek()!.value)) {
      const operator = consume().value;
      const nextValue = parseTerm();
      value = operator === '+' ? add(value, nextValue) : subtract(value, nextValue);
    }
    return value;
  };

  const result = parseSum();
  if (position < tokens.length) {
    throw new MathParserError('Expression invalide ou partie non analysée.');
  }
  return result;
};

export const evaluateExpression = (expression: string): number => {
  const value = parseExpression(tokenize(expression));
  if (value.coef !== 0) {
    throw new MathParserError('Expression avec variable non supportée pour ce calcul.');
  }
  return Number(value.constant.toFixed(10));
};

export const solveLinearEquation = (equation: string): { variable: string; value: number; steps: string[] } => {
  const parts = equation.split('=');
  if (parts.length !== 2) {
    throw new MathParserError('L’équation doit contenir un signe égal.');
  }

  const left = parseExpression(tokenize(parts[0]));
  const right = parseExpression(tokenize(parts[1]));
  const coef = left.coef - right.coef;
  const constant = right.constant - left.constant;

  if (coef === 0) {
    throw new MathParserError('Équation non linéaire ou indéterminée.');
  }

  const solution = constant / coef;
  return {
    variable: 'x',
    value: Number(solution.toFixed(10)),
    steps: [
      `Simplifier: ${left.coef}x + ${left.constant} = ${right.coef}x + ${right.constant}`,
      `Isoler x: ${coef === 1 ? '' : coef}x = ${constant}`,
      `Résoudre: x = ${constant} ÷ ${coef} = ${solution}`,
    ],
  };
};

export const generateExplanation = (expression: string): string => {
  const normalized = normalize(expression);
  const simpleAddMatch = normalized.match(/^\s*(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)\s*$/);
  if (simpleAddMatch) {
    const [_, a, b] = simpleAddMatch;
    const aNum = Number(a);
    const bNum = Number(b);
    const tensA = Math.floor(aNum / 10) * 10;
    const onesA = aNum - tensA;
    const tensB = Math.floor(bNum / 10) * 10;
    const onesB = bNum - tensB;
    if (tensA || tensB) {
      return `Décomposer: ${aNum} = ${tensA} + ${onesA}\nDécomposer: ${bNum} = ${tensB} + ${onesB}\nSomme des dizaines: ${tensA + tensB}\nSomme des unités: ${onesA + onesB}\nRésultat: ${aNum + bNum}`;
    }
  }
  return `Calcul effectué: ${expression} = ${evaluateExpression(expression)}`;
};
