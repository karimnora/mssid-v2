package dz.mssid.education.controller;

import dz.mssid.education.entity.CmsCourse;
import dz.mssid.education.entity.CmsCurriculumProgram;
import dz.mssid.education.entity.CmsExamSpec;
import dz.mssid.education.entity.CmsExercise;
import dz.mssid.education.service.CmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cms")
@RequiredArgsConstructor
public class CmsController {

    private final CmsService cmsService;

    @GetMapping("/courses")
    public ResponseEntity<List<CmsCourse>> listCourses() {
        return ResponseEntity.ok(cmsService.getAllCourses());
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CmsCourse> getCourse(@PathVariable String id) {
        CmsCourse course = cmsService.getCourseById(id);
        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @PostMapping("/courses")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsCourse> createCourse(@RequestBody CmsCourse course) {
        return ResponseEntity.ok(cmsService.saveCourse(course));
    }

    @PutMapping("/courses/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsCourse> updateCourse(@PathVariable String id, @RequestBody CmsCourse course) {
        if (cmsService.getCourseById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        course.setId(id);
        return ResponseEntity.ok(cmsService.saveCourse(course));
    }

    @PutMapping("/courses/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<CmsCourse>> bulkSaveCourses(@RequestBody List<CmsCourse> courses) {
        return ResponseEntity.ok(cmsService.saveCourses(courses));
    }

    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        cmsService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exercises")
    public ResponseEntity<List<CmsExercise>> listExercises() {
        return ResponseEntity.ok(cmsService.getAllExercises());
    }

    @GetMapping("/exercises/{id}")
    public ResponseEntity<CmsExercise> getExercise(@PathVariable String id) {
        CmsExercise exercise = cmsService.getExerciseById(id);
        return exercise != null ? ResponseEntity.ok(exercise) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exercises")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsExercise> createExercise(@RequestBody CmsExercise exercise) {
        return ResponseEntity.ok(cmsService.saveExercise(exercise));
    }

    @PutMapping("/exercises/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsExercise> updateExercise(@PathVariable String id, @RequestBody CmsExercise exercise) {
        if (cmsService.getExerciseById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        exercise.setId(id);
        return ResponseEntity.ok(cmsService.saveExercise(exercise));
    }

    @PutMapping("/exercises/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<CmsExercise>> bulkSaveExercises(@RequestBody List<CmsExercise> exercises) {
        return ResponseEntity.ok(cmsService.saveExercises(exercises));
    }

    @DeleteMapping("/exercises/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExercise(@PathVariable String id) {
        cmsService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exams")
    public ResponseEntity<List<CmsExamSpec>> listExams() {
        return ResponseEntity.ok(cmsService.getAllExams());
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<CmsExamSpec> getExam(@PathVariable String id) {
        CmsExamSpec exam = cmsService.getExamById(id);
        return exam != null ? ResponseEntity.ok(exam) : ResponseEntity.notFound().build();
    }

    @PostMapping("/exams")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsExamSpec> createExam(@RequestBody CmsExamSpec exam) {
        return ResponseEntity.ok(cmsService.saveExam(exam));
    }

    @PutMapping("/exams/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsExamSpec> updateExam(@PathVariable String id, @RequestBody CmsExamSpec exam) {
        if (cmsService.getExamById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        exam.setId(id);
        return ResponseEntity.ok(cmsService.saveExam(exam));
    }

    @PutMapping("/exams/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<CmsExamSpec>> bulkSaveExams(@RequestBody List<CmsExamSpec> exams) {
        return ResponseEntity.ok(cmsService.saveExams(exams));
    }

    @DeleteMapping("/exams/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteExam(@PathVariable String id) {
        cmsService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/curriculum")
    public ResponseEntity<List<CmsCurriculumProgram>> listCurriculum() {
        return ResponseEntity.ok(cmsService.getAllCurricula());
    }

    @GetMapping("/curriculum/{id}")
    public ResponseEntity<CmsCurriculumProgram> getCurriculum(@PathVariable String id) {
        CmsCurriculumProgram curriculum = cmsService.getCurriculumById(id);
        return curriculum != null ? ResponseEntity.ok(curriculum) : ResponseEntity.notFound().build();
    }

    @PostMapping("/curriculum")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsCurriculumProgram> createCurriculum(@RequestBody CmsCurriculumProgram curriculum) {
        return ResponseEntity.ok(cmsService.saveCurriculum(curriculum));
    }

    @PutMapping("/curriculum/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<CmsCurriculumProgram> updateCurriculum(@PathVariable String id, @RequestBody CmsCurriculumProgram curriculum) {
        if (cmsService.getCurriculumById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        curriculum.setId(id);
        return ResponseEntity.ok(cmsService.saveCurriculum(curriculum));
    }

    @PutMapping("/curriculum/bulk")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<CmsCurriculumProgram>> bulkSaveCurriculum(@RequestBody List<CmsCurriculumProgram> curricula) {
        return ResponseEntity.ok(cmsService.saveCurricula(curricula));
    }

    @DeleteMapping("/curriculum/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCurriculum(@PathVariable String id) {
        cmsService.deleteCurriculum(id);
        return ResponseEntity.noContent().build();
    }
}
