package dz.mssid.education.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonDto {
    private String id;
    private String grade;       // ex: "5AP"
    private String subject;     // ex: "math", "arabic"
    private String categoryAr;
    private String titleAr;
    private String summaryAr;
    private List<String> rulesAr;
    private List<KeyFormulaDto> keyFormulas;
    private List<ExampleDto> examplesAr;
    private String interactiveTool;
    private Object gameplaySimulation; // Désérialisé directement sous forme d'objet/JSON
    private List<QuizQuestionDto> quiz;
    private Integer trimester;
    private String domainAr;
    private String sequenceAr;
    private String objectiveAr;
    private String discoveryAr;
    private GuidedExampleDto guidedExampleAr;
    private List<ProgressiveExerciseDto> progressiveExercises;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class KeyFormulaDto {
        private String labelAr;
        private String formulaAr;
        private String noteAr;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ExampleDto {
        private String problem;
        private String solution;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class GuidedExampleDto {
        private String problem;
        private String hint;
        private String solution;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class QuizQuestionDto {
        private String id;
        private String questionAr;
        private List<QuizOptionDto> options;
        private String hintAr;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class QuizOptionDto {
        private String id;
        private String textAr;
        private boolean isCorrect;
        private String explanationAr;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProgressiveExerciseDto {
        private String id;
        private Integer level;
        private String levelLabelAr;
        private String problemAr;
        private List<String> hintsAr;
        private String solutionAr;
        private String detailedCorrectionAr;
        private Integer xpReward;
    }
}