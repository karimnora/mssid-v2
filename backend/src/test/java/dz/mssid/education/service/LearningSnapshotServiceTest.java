package dz.mssid.education.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.entity.User;
import dz.mssid.education.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
class LearningSnapshotServiceTest {
 private static LearningSnapshotService.Observation observation(String outcome,String at,String completed){return new LearningSnapshotService.Observation(outcome,at,completed);}
 @Test void mergesNewerAttemptAndPreservesFirstCompletion(){
  var old=observation("independent","2026-10-10T10:00:00Z","2026-10-10T10:00:00Z");
  var next=observation("review","2026-10-11T10:00:00Z",null);
  var merged=LearningSnapshotService.merge(Map.of("a",old),Map.of("a",next,"b",next));
  assertThat(merged.get("a").outcome()).isEqualTo("review");assertThat(merged.get("a").completedAt()).isEqualTo(old.completedAt());assertThat(merged).hasSize(2);
  assertThat(LearningSnapshotService.merge(merged,Map.of("a",old))).isEqualTo(merged);
 }
 @Test void rejectsInvalidOutcomeAndFutureOrBrokenDates(){
  assertThatThrownBy(()->LearningSnapshotService.validate(Map.of("a",observation("admin","2026-10-10T10:00:00Z",null)))).isInstanceOf(ResponseStatusException.class);
  assertThatThrownBy(()->LearningSnapshotService.validate(Map.of("a",observation("helped","broken",null)))).isInstanceOf(ResponseStatusException.class);
  assertThatThrownBy(()->LearningSnapshotService.validate(Map.of("a",observation("helped","2099-10-10T10:00:00Z",null)))).isInstanceOf(ResponseStatusException.class);
 }
 @Test void anotherFamiliesChildIsNeverReadOrWritten(){
  var jdbc=mock(JdbcTemplate.class);var users=mock(UserRepository.class);var children=mock(ChildProfileRepository.class);var owner=User.builder().id(7L).build();when(users.findByEmail("parent")).thenReturn(Optional.of(owner));when(children.findByIdAndUserEmail(99L,"parent")).thenReturn(Optional.empty());
  var service=new LearningSnapshotService(jdbc,users,children,new ObjectMapper());
  assertThatThrownBy(()->service.get("parent",99L,"family-1AP")).isInstanceOf(ResponseStatusException.class);
  assertThatThrownBy(()->service.save("parent",99L,"family-1AP",Map.of())).isInstanceOf(ResponseStatusException.class);verifyNoInteractions(jdbc);
 }
 @Test void unknownScopeDoesNotReadDatabase(){var jdbc=mock(JdbcTemplate.class);var users=mock(UserRepository.class);var children=mock(ChildProfileRepository.class);assertThatThrownBy(()->new LearningSnapshotService(jdbc,users,children,new ObjectMapper()).get("parent",null,"../../parent")).isInstanceOf(ResponseStatusException.class);verifyNoInteractions(jdbc,users,children);}
}
