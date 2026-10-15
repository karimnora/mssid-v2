package dz.mssid.education.service;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
class NotebookMergeRegressionTest {
 @Test void repeatingASnapshotDoesNotMultiplySessions(){
  Map<String,Object> session=Map.of("lessonId","math-1","at","2026-10-15T10:00:00Z","outcome","success","competenceIds",List.of("math-a"));
  var result=ProgressGuard.mergeLessonSessions(List.of(session),List.of(session));assertThat(result).hasSize(1);
 }
 @Test void olderDeviceCannotReplaceLatestOutcome(){
  Map<String,Object> current=Map.of("attempts",2,"successes",1,"failures",1,"lastAt","2026-10-15T10:00:00Z","lastLessonId","math-new","lastOutcome","fail");
  Map<String,Object> older=Map.of("attempts",3,"successes",2,"lastAt","2026-10-14T10:00:00Z","lastLessonId","math-old","lastOutcome","success");
  var result=ProgressGuard.mergeCompetenceStats(Map.of("math-a",current),Map.of("math-a",older));
  assertThat((Map<String,Object>)result.get("math-a")).containsEntry("lastOutcome","fail").containsEntry("lastLessonId","math-new").containsEntry("attempts",3);
 }
}
