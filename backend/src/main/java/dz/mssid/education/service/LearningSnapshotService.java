package dz.mssid.education.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dz.mssid.education.repository.ChildProfileRepository;
import dz.mssid.education.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LearningSnapshotService {
 private final JdbcTemplate jdbc;
 private final UserRepository users;
 private final ChildProfileRepository children;
 private final ObjectMapper mapper;
 public record Observation(String outcome, String at, String completedAt) {}
 private Long owner(String email, Long childId, String scope) {
  if (scope == null || !scope.matches("family-[1-5]AP|preschool-(?:ar|fr|en)|(?:garden|market)-preschool-(?:ar|fr|en)"))
   throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid scope");
  var user = users.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  if (childId != null && children.findByIdAndUserEmail(childId, email).isEmpty())
   throw new ResponseStatusException(HttpStatus.NOT_FOUND);
  return user.getId();
 }
 private static String key(Long childId) { return childId == null ? "account" : "child:" + childId; }
 @Transactional(readOnly=true)
 public Map<String, Observation> get(String email, Long childId, String scope) {
  return load(owner(email, childId, scope), childId, scope);
 }
 private Map<String, Observation> load(Long userId, Long childId, String scope) {
  var rows = jdbc.queryForList("SELECT results::text FROM learning_snapshots WHERE user_id=? AND owner_key=? AND scope=?", String.class, userId, key(childId), scope);
  if (rows.isEmpty()) return new TreeMap<>();
  try { return mapper.readValue(rows.get(0), new TypeReference<TreeMap<String, Observation>>() {}); }
  catch (Exception ex) { throw new IllegalStateException("Unreadable learning snapshot", ex); }
 }
 @Transactional
 public Map<String, Observation> save(String email, Long childId, String scope, Map<String, Observation> incoming) {
  Long userId = owner(email, childId, scope);
  validate(incoming);
  // Also serializes the first insert and concurrent writes from different devices.
  jdbc.queryForObject("SELECT id FROM users WHERE id=? FOR UPDATE", Long.class, userId);
  var merged = merge(load(userId, childId, scope), incoming);
  if (merged.size() > 1200) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Too many observations");
  try {
   jdbc.update("INSERT INTO learning_snapshots(user_id,owner_key,child_id,scope,results) VALUES (?,?,?,?,?::jsonb) ON CONFLICT(user_id,owner_key,scope) DO UPDATE SET results=EXCLUDED.results,updated_at=CURRENT_TIMESTAMP", userId, key(childId), childId, scope, mapper.writeValueAsString(merged));
  } catch (com.fasterxml.jackson.core.JsonProcessingException ex) { throw new IllegalStateException(ex); }
  return merged;
 }
 static void validate(Map<String, Observation> values) {
  if (values == null || values.size()>1200) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
  values.forEach((id, v) -> {
   try {
    if (id == null || !id.matches("[A-Za-z0-9:_-]{1,160}") || v == null || !Set.of("independent","helped","review").contains(v.outcome())) throw new IllegalArgumentException();
    Instant at=Instant.parse(v.at());
    if (at.isAfter(Instant.now().plusSeconds(300)) || at.isBefore(Instant.parse("2020-01-01T00:00:00Z"))) throw new IllegalArgumentException();
    if (v.completedAt()!=null && Instant.parse(v.completedAt()).isAfter(at)) throw new IllegalArgumentException();
   } catch(Exception ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid observation"); }
  });
 }
 public static Map<String, Observation> merge(Map<String, Observation> existing, Map<String, Observation> incoming) {
  Map<String, Observation> result=new TreeMap<>(existing);
  incoming.forEach((id, next) -> result.merge(id,next,(old,value)-> {
   int comparison=Instant.parse(value.at()).compareTo(Instant.parse(old.at()));
   // A stable tie-break keeps repeated synchronizations deterministic.
   var latest=comparison>0 || comparison==0 && value.outcome().compareTo(old.outcome())>0 ? value : old;
   String first=old.completedAt();
   if (first==null || value.completedAt()!=null && Instant.parse(value.completedAt()).isBefore(Instant.parse(first))) first=value.completedAt();
   return new Observation(latest.outcome(),latest.at(),first);
  }));
  return result;
 }
}
