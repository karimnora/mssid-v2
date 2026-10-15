package dz.mssid.education.controller;
import dz.mssid.education.service.LearningSnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/learning")
@RequiredArgsConstructor
public class LearningSnapshotController {
 private final LearningSnapshotService service;
 @GetMapping("/{scope}")
 public ResponseEntity<Map<String,LearningSnapshotService.Observation>> get(@AuthenticationPrincipal UserDetails user, @PathVariable String scope, @RequestParam(required=false) Long childId) {
  if(user==null) return ResponseEntity.status(401).build();
  return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.get(user.getUsername(),childId,scope));
 }
 @PutMapping("/{scope}")
 public ResponseEntity<Map<String,LearningSnapshotService.Observation>> save(@AuthenticationPrincipal UserDetails user, @PathVariable String scope, @RequestParam(required=false) Long childId, @RequestBody Map<String,LearningSnapshotService.Observation> results) {
  if(user==null) return ResponseEntity.status(401).build();
  return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.save(user.getUsername(),childId,scope,results));
 }
}
