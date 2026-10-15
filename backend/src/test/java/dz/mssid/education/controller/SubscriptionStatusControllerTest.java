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
  var result=new SubscriptionStatusController(users,subscriptions,mock(PaymentReceiptRepository.class)).status(principal);assertThat(result.status()).isEqualTo("ACTIVE");verify(subscriptions).findByUser(owner);
 }
 @Test void requiresAuthentication(){assertThatThrownBy(()->new SubscriptionStatusController(mock(UserRepository.class),mock(SubscriptionRepository.class),mock(PaymentReceiptRepository.class)).status(null)).isInstanceOf(ResponseStatusException.class);}
 @Test void noSubscriptionReturnsFreeStatus(){
  var users=mock(UserRepository.class);var subscriptions=mock(SubscriptionRepository.class);var principal=mock(UserDetails.class);var owner=new User();when(principal.getUsername()).thenReturn("parent");when(users.findByEmail("parent")).thenReturn(Optional.of(owner));when(subscriptions.findByUser(owner)).thenReturn(Optional.empty());
  assertThat(new SubscriptionStatusController(users,subscriptions,mock(PaymentReceiptRepository.class)).status(principal).status()).isEqualTo("NONE");
 }
 @Test void overdueActiveSubscriptionIsReportedExpired(){
  var users=mock(UserRepository.class);var subscriptions=mock(SubscriptionRepository.class);var principal=mock(UserDetails.class);var owner=new User();when(principal.getUsername()).thenReturn("parent");when(users.findByEmail("parent")).thenReturn(Optional.of(owner));when(subscriptions.findByUser(owner)).thenReturn(Optional.of(Subscription.builder().status(Subscription.SubscriptionStatus.ACTIVE).endDate(LocalDate.of(2000,1,1)).build()));
  assertThat(new SubscriptionStatusController(users,subscriptions,mock(PaymentReceiptRepository.class)).status(principal).status()).isEqualTo("EXPIRED");
 }

 @Test void receiptStatusReturnsOnlyOwnersLatestStateWithoutImage(){
  var users=mock(UserRepository.class);var receipts=mock(PaymentReceiptRepository.class);var owner=User.builder().id(7L).build();var principal=mock(UserDetails.class);when(principal.getUsername()).thenReturn("parent");when(users.findByEmail("parent")).thenReturn(Optional.of(owner));
  when(receipts.findFirstByUserIdOrderBySubmittedAtDescIdDesc(7L)).thenReturn(Optional.of(PaymentReceipt.builder().status(PaymentReceipt.ReceiptStatus.REJECTED).planId("P3M").durationMonths(3).rejectionReason("Justificatif illisible").receiptImageUrl("private-image").build()));
  var response=new SubscriptionStatusController(users,mock(SubscriptionRepository.class),receipts).receiptStatus(principal);
  assertThat(response.getBody().status()).isEqualTo("REJECTED");assertThat(response.getBody().rejectionReason()).isEqualTo("Justificatif illisible");assertThat(response.getHeaders().getCacheControl()).contains("no-store");verify(receipts).findFirstByUserIdOrderBySubmittedAtDescIdDesc(7L);
 }
}
