package dz.mssid.education.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
class CahierContentServiceTest {
 @Test void enforcesServerRightsEvenWhenClientClaimsPremium()throws Exception{
  var access=mock(CahierAccessService.class);when(access.status("parent")).thenReturn(new CahierAccessService.Access(false,3,3,"2030-01-01T00:00:00Z",List.of(),true));
  var service=new CahierContentService(access,new ObjectMapper());assertThatThrownBy(()->service.content("parent","math-1ap-c-spatial-position")).isInstanceOf(ResponseStatusException.class);
 }
 @Test void previouslyUnlockedSheetRemainsReadableWithoutCredits()throws Exception{
  var access=mock(CahierAccessService.class);String id="math-1ap-c-spatial-position";when(access.status("parent")).thenReturn(new CahierAccessService.Access(false,3,0,"2030-01-01T00:00:00Z",List.of(id),true));
  var content=new CahierContentService(access,new ObjectMapper()).content("parent",id);assertThat(content.get("exercises").size()).isEqualTo(3);assertThat(content.get("versoAr").size()).isEqualTo(3);
 }
}
