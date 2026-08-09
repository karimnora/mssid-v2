package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfficialExamDto {
    private String id; // Converti depuis Long
    private Integer year;
    private String titleAr;
    private String sessionAr;
    private String subject; // ex: "math", "science"
    private String grade;   // ex: "5AP"
    private Integer durationMinutes;
    private Integer totalPoints;
    private List<ExamExerciseDto> exercises;
    private ExamExerciseDto problemExercise;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExamExerciseDto {
        private String titleAr;
        private Integer points;
        private String contentAr;
        private String solutionAr;
    }
}