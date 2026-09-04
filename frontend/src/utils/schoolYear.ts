/** Algerian school year runs September→June: before September, we're still in last year's. */
export function currentSchoolYearLabel(): string {
  const now = new Date();
  const startYear = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear} / ${startYear + 1}`;
}
