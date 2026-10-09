package dz.mssid.education.controller;
import dz.mssid.education.entity.*;
import dz.mssid.education.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;
class SubscriptionStatusControllerTest {
 @Test void returnsOnlyAuthenticatedOwnersSubscription(){
  var users=mock(UserRepository.class);var subscriptions=mock(SubscriptionRepository.class);var principal=mock(UserDetails.class);var owner=new User();
  when(principal.getUsername()).thenReturn("parent@test.invalid");when(users.findByEmail("parent@test.invalid")).thenReturn(Optional.of(owner));
  when(subscriptions.findByUser(owner)).thenReturn(Optional.of(Subscription.builder().status(Subscription.SubscriptionStatus.ACTIVE).startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(3)).build()));
  var result=new SubscriptionStatusController(users,subscriptions).status(principal);assertThat(result.status()).isEqualTo("ACTIVE");verify(subscriptions).findByUser(owner);
 }
 @Test void requiresAuthentication(){assertThatThrownBy(()->new SubscriptionStatusController(mock(UserRepository.class),mock(SubscriptionRepository.class)).status(null)).isInstanceOf(ResponseStatusException.class);}
 @Test void noSubscriptionReturnsFreeStatus(){
  var users=mock(UserRepository.class);var subscriptions=mock(SubscriptionRepository.class);var principal=mock(UserDetails.class);var owner=new User();when(principal.getUsername()).thenReturn("parent");when(users.findByEmail("parent")).thenReturn(Optional.of(owner));when(subscriptions.findByUser(owner)).thenReturn(Optional.empty());
  assertThat(new SubscriptionStatusController(users,subscriptions).status(principal).status()).isEqualTo("NONE");
 }
 @Test void overdueActiveSubscriptionIsReportedExpired(){
  var users=mock(UserRepository.class);var subscriptions=mock(SubscriptionRepository.class);var principal=mock(UserDetails.class);var owner=new User();when(principal.getUsername()).thenReturn("parent");when(users.findByEmail("parent")).thenReturn(Optional.of(owner));when(subscriptions.findByUser(owner)).thenReturn(Optional.of(Subscription.builder().status(Subscription.SubscriptionStatus.ACTIVE).endDate(LocalDate.of(2000,1,1)).build()));
  assertThat(new SubscriptionStatusController(users,subscriptions).status(principal).status()).isEqualTo("EXPIRED");
 }
}
