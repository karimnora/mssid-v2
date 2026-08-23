import { describe, expect, it } from 'vitest';
import { frenchProjectsForGrade } from './FrenchProjectsLabInteractive';

describe('frenchProjectsForGrade', () => {
  it('shows 4 official 3AP projects for 3AP', () => {
    const projects = frenchProjectsForGrade('3AP');
    expect(projects).toHaveLength(4);
    expect(projects.every((p) => p.grade === '3AP')).toBe(true);
    expect(projects.map((p) => p.projectNumber)).toEqual([1, 2, 3, 4]);
  });

  it('never shows 5AP projects to 3AP', () => {
    const projects = frenchProjectsForGrade('3AP');
    expect(projects.some((p) => p.grade === '5AP')).toBe(false);
  });

  it('shows 3 five-AP projects for 5AP only', () => {
    const projects = frenchProjectsForGrade('5AP');
    expect(projects).toHaveLength(3);
    expect(projects.every((p) => p.grade === '5AP')).toBe(true);
  });

  it('offers 3AP revision projects for 4AP', () => {
    const projects = frenchProjectsForGrade('4AP');
    expect(projects).toHaveLength(4);
    expect(projects.every((p) => p.grade === '3AP')).toBe(true);
  });
});
