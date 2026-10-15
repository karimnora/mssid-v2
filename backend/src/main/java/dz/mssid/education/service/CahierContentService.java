package dz.mssid.education.service;
import com.fasterxml.jackson.databind.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.util.*;
@Service
public class CahierContentService {
 private final CahierAccessService access;private final Map<String,JsonNode> documents=new HashMap<>();
 private final Map<String,JsonNode> papers=new HashMap<>();
 public CahierContentService(CahierAccessService access,ObjectMapper mapper)throws IOException {
  this.access=access;try(var input=new ClassPathResource("cem-content.json").getInputStream()){for(var node:mapper.readTree(input))papers.put(node.get("id").asText(),node);}
  try(var input=new ClassPathResource("cahier-content.json").getInputStream()){for(var node:mapper.readTree(input))documents.put(node.get("competenceId").asText(),node);}
 }
 public JsonNode paper(String email,String id){
  if(!papers.containsKey(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND);
  if(!access.status(email).premium())throw new ResponseStatusException(HttpStatus.FORBIDDEN);
  return papers.get(id).deepCopy();
 }
 public JsonNode content(String email,String id){
  if(!documents.containsKey(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND);
  var rights=access.status(email);
  if(!rights.premium()&&!rights.unlockedIds().contains(id))throw new ResponseStatusException(HttpStatus.FORBIDDEN);
  return documents.get(id).deepCopy();
 }
}
