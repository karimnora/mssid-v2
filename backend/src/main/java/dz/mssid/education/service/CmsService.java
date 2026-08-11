package dz.mssid.education.service;

import dz.mssid.education.entity.CmsCourse;
import dz.mssid.education.entity.CmsCurriculumProgram;
import dz.mssid.education.entity.CmsExamSpec;
import dz.mssid.education.entity.CmsExercise;
import dz.mssid.education.repository.CmsCourseRepository;
import dz.mssid.education.repository.CmsCurriculumProgramRepository;
import dz.mssid.education.repository.CmsExamSpecRepository;
import dz.mssid.education.repository.CmsExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CmsService {

    private final CmsCourseRepository cmsCourseRepository;
    private final CmsExerciseRepository cmsExerciseRepository;
    private final CmsExamSpecRepository cmsExamSpecRepository;
    private final CmsCurriculumProgramRepository cmsCurriculumProgramRepository;

    public List<CmsCourse> getAllCourses() {
        return cmsCourseRepository.findAll();
    }

    public CmsCourse getCourseById(String courseId) {
        return cmsCourseRepository.findById(courseId).orElse(null);
    }

    public CmsCourse saveCourse(CmsCourse course) {
        return cmsCourseRepository.save(course);
    }

    public List<CmsCourse> saveCourses(List<CmsCourse> courses) {
        return cmsCourseRepository.saveAll(courses);
    }

    public void deleteCourse(String courseId) {
        cmsCourseRepository.deleteById(courseId);
    }

    public List<CmsExercise> getAllExercises() {
        return cmsExerciseRepository.findAll();
    }

    public CmsExercise getExerciseById(String exerciseId) {
        return cmsExerciseRepository.findById(exerciseId).orElse(null);
    }

    public CmsExercise saveExercise(CmsExercise exercise) {
        return cmsExerciseRepository.save(exercise);
    }

    public List<CmsExercise> saveExercises(List<CmsExercise> exercises) {
        return cmsExerciseRepository.saveAll(exercises);
    }

    public void deleteExercise(String exerciseId) {
        cmsExerciseRepository.deleteById(exerciseId);
    }

    public List<CmsExamSpec> getAllExams() {
        return cmsExamSpecRepository.findAll();
    }

    public CmsExamSpec getExamById(String examId) {
        return cmsExamSpecRepository.findById(examId).orElse(null);
    }

    public CmsExamSpec saveExam(CmsExamSpec examSpec) {
        return cmsExamSpecRepository.save(examSpec);
    }

    public List<CmsExamSpec> saveExams(List<CmsExamSpec> exams) {
        return cmsExamSpecRepository.saveAll(exams);
    }

    public void deleteExam(String examId) {
        cmsExamSpecRepository.deleteById(examId);
    }

    public List<CmsCurriculumProgram> getAllCurricula() {
        return cmsCurriculumProgramRepository.findAll();
    }

    public CmsCurriculumProgram getCurriculumById(String curriculumId) {
        return cmsCurriculumProgramRepository.findById(curriculumId).orElse(null);
    }

    public CmsCurriculumProgram saveCurriculum(CmsCurriculumProgram curriculumProgram) {
        return cmsCurriculumProgramRepository.save(curriculumProgram);
    }

    public List<CmsCurriculumProgram> saveCurricula(List<CmsCurriculumProgram> curricula) {
        return cmsCurriculumProgramRepository.saveAll(curricula);
    }

    public void deleteCurriculum(String curriculumId) {
        cmsCurriculumProgramRepository.deleteById(curriculumId);
    }
}
