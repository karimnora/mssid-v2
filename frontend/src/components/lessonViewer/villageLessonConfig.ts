import type { CourseLesson } from "../../types";
/** Opt-in only after content/interaction review. Shared layout needs no lesson-id branches. */
export const VILLAGE_LESSONS: Readonly<
  Record<string, { interaction: "fractions"; audioBudgetBytes: number }>
> = {
  "math-5ap-fractions": {
    interaction: "fractions",
    audioBudgetBytes: 1_050_000,
  },
};
export const villageLessonConfig = (lesson: Pick<CourseLesson, "id">) =>
  VILLAGE_LESSONS[lesson.id];
export const VILLAGE_MATH_PILOT = Object.keys(VILLAGE_LESSONS)[0];
