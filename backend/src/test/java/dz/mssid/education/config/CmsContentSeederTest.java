package dz.mssid.education.config;

import dz.mssid.education.repository.CmsExamSpecRepository;
import dz.mssid.education.repository.CmsExerciseRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CmsContentSeederTest {

    @Mock
    private CmsExamSpecRepository cmsExamSpecRepository;

    @Mock
    private CmsExerciseRepository cmsExerciseRepository;

    @InjectMocks
    private CmsContentSeeder cmsContentSeeder;

    @Test
    @DisplayName("run - seeds 12 exams (5 exercises each) when the CMS tables are empty")
    void run_SeedsAllExamsAndExercises_WhenTablesAreEmpty() {
        when(cmsExamSpecRepository.existsById(anyString())).thenReturn(false);
        when(cmsExerciseRepository.existsById(anyString())).thenReturn(false);

        cmsContentSeeder.run();

        // 12 exams x 5 blocks each (4 exercises + 1 situation d'intégration) = 60 exercise saves
        verify(cmsExerciseRepository, times(60)).save(any());
        // 12 exam spec saves
        verify(cmsExamSpecRepository, times(12)).save(any());
    }

    @Test
    @DisplayName("run - skips an exam entirely (no exercise saves) when its ID already exists")
    void run_SkipsReseeding_WhenExamIdAlreadyExists() {
        when(cmsExamSpecRepository.existsById(anyString())).thenReturn(true);

        cmsContentSeeder.run();

        verify(cmsExamSpecRepository, never()).save(any());
        verify(cmsExerciseRepository, never()).save(any());
        verify(cmsExerciseRepository, never()).existsById(anyString());
    }
}
