import React from "react";
import type { CourseLesson } from "../../types";
import type { PracticeBindings } from "./practiceBindings";
import type { useLessonQuiz } from "./useLessonQuiz";
import type {
  FractionObservations,
  FractionObservation,
} from "./FractionWorkshop";
import { isGuidedPractice } from "./practiceAssessment";
const describe = (r?: FractionObservation) =>
  !r
    ? "لم تُجرّب"
    : r.completed
    ? r.helped
      ? "نجح مع مساعدة أو بعد محاولة أخرى"
      : "نجح دون تلميح ومن المحاولة الأولى"
    : "بحاجة إلى تدريب";
export function SessionLearningReport({
  lesson,
  practice,
  quiz,
  learn,
  transfer,
  onContinue,
}: {
  lesson: CourseLesson;
  practice: PracticeBindings;
  quiz: ReturnType<typeof useLessonQuiz>;
  learn: FractionObservations;
  transfer: FractionObservations;
  onContinue: (target: "interactive" | "practice" | "quiz") => void;
}) {
  const exercises = [
    ...(lesson.progressiveExercises ?? []),
    ...(lesson.evaluationExercises ?? []),
  ].filter((ex) => !isGuidedPractice(ex));
  const outcomes = Object.values(practice.sessionResults);
  const alone = outcomes.filter((r) => r.correct && !r.helped).length,
    helped = outcomes.filter((r) => r.correct && r.helped).length,
    needs = outcomes.filter((r) => !r.correct).length;
  const transferDone = ["decompose", "bound", "equivalent", "explain"].every(
    (key) => transfer[key as keyof FractionObservations]?.completed
  );
  const target = !transferDone
    ? "interactive"
    : exercises.some((ex) => !practice.sessionResults[ex.id]?.correct)
    ? "practice"
    : "quiz";
  const correctQuiz = lesson.quiz.filter((q) =>
    q.options.some((o) => o.isCorrect && o.id === quiz.selectedAnswers[q.id])
  ).length;
  return (
    <section data-session-report>
      <h2 id="session-report-title">ملخص هذه الجلسة</h2>
      <p>{lesson.titleAr}</p>
      <p>
        هذا وصف لما فعله الطفل في الجلسة الحالية، وليس شهادة إتقان أو سجلًا
        محفوظًا بعد إغلاق الدرس.
      </p>
      <h3>المهارات التي جرّبها</h3>
      <div className="session-table-wrap">
        <table>
          <caption>الملاحظة المباشرة في الرسم والتطبيق الجديد</caption>
          <thead>
            <tr>
              <th scope="col">المهارة</th>
              <th scope="col">أكتشف وأجرّب</th>
              <th scope="col">مختبر الحديقة</th>
            </tr>
          </thead>
          <tbody>
            {(["decompose", "bound", "equivalent", "explain"] as const).map(
              (key, i) => (
                <tr key={key}>
                  <th scope="row">
                    {
                      [
                        "تفكيك كسر",
                        "حصر كسر",
                        "تكافؤ الكسور",
                        "اختيار تفسير للتكافؤ",
                      ][i]
                    }
                  </th>
                  <td>{describe(learn[key])}</td>
                  <td>{describe(transfer[key])}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <h3>التمارين الأصلية</h3>
      <p>
        نجح وحده: {alone} · نجح مع مساعدة أو بعد خطأ: {helped} · يحتاج محاولة
        أخرى: {needs} · لم يُقيّم بعد:{" "}
        {exercises.filter((ex) => !practice.sessionResults[ex.id]).length}
      </p>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>
            <span>{ex.problemAr}</span>
            <strong>
              {!practice.sessionResults[ex.id]
                ? "لم يُقيّم بعد"
                : !practice.sessionResults[ex.id].correct
                ? "يحتاج محاولة أخرى"
                : practice.sessionResults[ex.id].helped
                ? "نجح مع مساعدة أو بعد خطأ"
                : "نجح وحده"}
            </strong>
          </li>
        ))}
      </ul>
      <p>
        الاختبار: {correctQuiz} / {lesson.quiz.length} إجابات صحيحة.{" "}
        {quiz.quizFullyPassed
          ? "تم التحقق من الاختبار."
          : "لم يُنجز الاختبار في هذه الجلسة بعد."}
      </p>
      <h3>الخطوة المقترحة</h3>
      <p>
        {target === "interactive"
          ? "تطبيق المهارات على كسور جديدة في مختبر الحديقة."
          : target === "practice"
          ? "التدرّب على التمارين الأصلية التي لم تنجح بعد."
          : "الإجابة عن الاختبار للتأكد من الفهم."}
      </p>
      <button
        type="button"
        data-session-next
        onClick={() => onContinue(target)}
      >
        أفتح النشاط المقترح
      </button>
    </section>
  );
}
