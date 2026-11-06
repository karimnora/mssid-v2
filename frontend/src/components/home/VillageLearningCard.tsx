import React from "react";
import { BookOpen, Volume2, ArrowLeft } from "lucide-react";
import type { DidouHomeConnection } from "./DidouVillageHome";
import { VillageButton, VillageProgress } from "./VillagePrimitives";
export function VillageLearningCard({
  connection,
  onDetails,
  onStart,
  onListen,
}: {
  connection: DidouHomeConnection;
  onDetails: () => void;
  onStart: () => void;
  onListen: () => void;
}) {
  const ready = !!(connection.mission?.cta || connection.onContinue);
  const line =
    connection.mission?.say ||
    connection.nextTitle ||
    (connection.total === null
      ? "نحضّر دروسك…"
      : "اختر ما تريد أن تتعلّمه اليوم");
  return (
    <section
      className="village-learning-card"
      aria-label="مهمتي القادمة"
      data-home-learning-card
    >
      <p className="village-learning-next" title={line}>
        {line}
      </p>
      <div className="village-learning-progress">
        <span data-home-progress>
          {connection.total === null ? (
            "نحضّر دروسك…"
          ) : (
            <>
              الدروس المكتملة:{" "}
              <bdi dir="ltr">
                {connection.completed} / {connection.total}
              </bdi>
            </>
          )}
        </span>
        {connection.total !== null && connection.total > 0 && (
          <VillageProgress
            label="الدروس المكتملة"
            value={connection.completed}
            max={connection.total}
          />
        )}
      </div>
      <div className="village-learning-actions">
        <VillageButton data-home-resume disabled={!ready} onClick={onStart}>
          أكمل <ArrowLeft size={20} />
        </VillageButton>
        <button
          type="button"
          className="village-learning-icon"
          data-home-read-plan
          aria-label="اسمع مهمتي"
          onClick={onListen}
        >
          <Volume2 size={24} />
        </button>
        <button
          type="button"
          className="village-learning-icon"
          data-home-lessons
          aria-label="دروسي وخريطة ديدو"
          onClick={onDetails}
        >
          <BookOpen size={22} />
          <span>دروسي</span>
        </button>
      </div>
    </section>
  );
}
