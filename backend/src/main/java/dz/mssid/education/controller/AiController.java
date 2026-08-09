package dz.mssid.education.controller;

import dz.mssid.education.dto.AiExplainRequest;
import dz.mssid.education.dto.GeminiPromptRequest;
import dz.mssid.education.dto.GeminiResponse;
import dz.mssid.education.dto.SolveExamRequest;
import dz.mssid.education.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permet les requêtes Cross-Origin depuis votre frontend Vite/React
public class AiController {

}