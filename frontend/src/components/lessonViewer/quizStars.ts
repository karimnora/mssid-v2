/**
 * End-of-quiz stars (V2 « monde de jeu », docs/v2-design-monde.md): every question right on the
 * first try = 3 stars, at least 60 % on the first try = 2, otherwise 1. Never 0: the quiz is only
 * finished once every answer is right, so finishing always earns a star.
 */
export function quizStars(totalQuestions: number, missedQuestions: number): 1 | 2 | 3 {
  if (totalQuestions <= 0) return 1;
  const firstTry = Math.max(0, totalQuestions - missedQuestions) / totalQuestions;
  if (firstTry >= 1) return 3;
  if (firstTry >= 0.6) return 2;
  return 1;
}
