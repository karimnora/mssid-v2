package dz.mssid.education.controller;

import dz.mssid.education.service.CahierAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cahiers")
@RequiredArgsConstructor
public class CahierAccessController {
    private final CahierAccessService access;
    private final dz.mssid.education.service.CahierContentService content;
    @GetMapping("/papers/{paperId}")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> paper(@AuthenticationPrincipal UserDetails principal,@PathVariable String paperId) {
        if(principal==null)return ResponseEntity.status(401).build();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(content.paper(principal.getUsername(),paperId));
    }
    @GetMapping("/{documentId}/content")
    public ResponseEntity<com.fasterxml.jackson.databind.JsonNode> content(@AuthenticationPrincipal UserDetails principal,@PathVariable String documentId) {
        if(principal==null)return ResponseEntity.status(401).build();
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(content.content(principal.getUsername(),documentId));
    }
    @GetMapping("/access")
    public ResponseEntity<CahierAccessService.Access> status(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(access.status(principal.getUsername()));
    }
    @PostMapping("/{documentId}/unlock")
    public ResponseEntity<CahierAccessService.Access> unlock(@AuthenticationPrincipal UserDetails principal, @PathVariable String documentId) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        var result = access.unlock(principal.getUsername(), documentId);
        return ResponseEntity.status(result.allowed() ? HttpStatus.OK : HttpStatus.TOO_MANY_REQUESTS).body(result);
    }
}
