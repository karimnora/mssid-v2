package dz.mssid.education.controller;
import dz.mssid.education.repository.SubscriptionRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.ZoneId;
@RestController
@RequiredArgsConstructor
public class SubscriptionStatusController {
 private final UserRepository users;
 private final SubscriptionRepository subscriptions;
 public record Status(String status, LocalDate startDate, LocalDate endDate) {}
 @GetMapping("/api/v1/payments/subscription")
 @Transactional(readOnly=true)
 public Status status(@AuthenticationPrincipal UserDetails principal) {
  if(principal==null)throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
  var owner=users.findByEmail(principal.getUsername()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  return subscriptions.findByUser(owner).map(s->{
   var state=s.getStatus().name();
   if(state.equals("ACTIVE")&&s.getEndDate()!=null&&s.getEndDate().isBefore(LocalDate.now(ZoneId.of("Africa/Algiers"))))state="EXPIRED";
   return new Status(state,s.getStartDate(),s.getEndDate());
  }).orElse(new Status("NONE",null,null));
 }
}
