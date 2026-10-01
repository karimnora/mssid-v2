const IDLE =
  'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)]';
const CORRECT = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
const WRONG = 'bg-[#FFF8E7] border-[var(--brand-coral)] text-[var(--app-text)]';

const BASE =
  'p-2.5 min-h-[var(--hit)] rounded-xl text-xs font-bold border transition-all cursor-pointer';

/** Style a lab MCQ option without leaking the key after a miss. */
export function labQuizOptionClass(
  selected: string | number | undefined,
  option: string | number,
  correct: string | number,
  className = BASE,
): string {
  if (selected === undefined) return `${className} ${IDLE}`;
  if (option === selected && option === correct) return `${className} ${CORRECT}`;
  if (option === selected) return `${className} ${WRONG}`;
  return `${className} ${IDLE}`;
}

export function labQuizIsLocked(
  selected: string | number | undefined,
  correct: string | number,
): boolean {
  return selected !== undefined && selected === correct;
}
