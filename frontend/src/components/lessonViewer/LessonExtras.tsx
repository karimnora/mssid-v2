import React from "react";
import type { CourseLesson } from "../../types";
import type { PracticeResult } from "../../utils/competenceProgress";
import { MissionBanner } from "../missions/MissionBanner";
import { missionForLesson } from "../../data/missions";
import { LearningGameEntry } from "../games/learning/LearningGameEntry";
import { packsForLesson } from "../../data/games";
import { PilotOptional } from "./VillageMathPilot";
export function LessonExtras({
  lesson,
  playful = false,
  collapsible = false,
  onPracticeResult,
  onCompleteQuiz,
}: {
  lesson: CourseLesson;
  playful?: boolean;
  collapsible?: boolean;
  onPracticeResult?: (id: string, result: PracticeResult) => void;
  onCompleteQuiz: (id: string, xp: number) => void;
}) {
  const mission = missionForLesson(lesson.id);
  return (
    <>
      {!playful && mission && (
        <PilotOptional enabled={collapsible} label="مهمة إضافية للدرس">
          <MissionBanner
            mission={mission}
            onPracticeResult={onPracticeResult}
            onCompleteQuiz={onCompleteQuiz}
          />
        </PilotOptional>
      )}
      {packsForLesson(lesson.id).map((pack) => (
        <div className="mb-4" key={pack.id}>
          <PilotOptional enabled={collapsible} label={pack.titleAr}>
            <LearningGameEntry
              pack={pack}
              focusLessonId={lesson.id}
              onPracticeResult={onPracticeResult}
              onEarnXp={(_, xp) => onCompleteQuiz(lesson.id, xp)}
            />
          </PilotOptional>
        </div>
      ))}
    </>
  );
}
