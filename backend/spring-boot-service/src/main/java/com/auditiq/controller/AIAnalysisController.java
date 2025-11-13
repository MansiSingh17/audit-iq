package com.auditiq.controller;

import com.auditiq.dto.AnalysisResultDTO;
import com.auditiq.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIAnalysisController {

    private final AIAnalysisService analysisService;

    @PostMapping("/analyze-document")
    public ResponseEntity<AnalysisResultDTO> analyzeDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("standard") String standard) {
        
        try {
            log.info("Received document analysis request: {} for standard: {}", 
                    file.getOriginalFilename(), standard);

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            if (standard == null || standard.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            AnalysisResultDTO result = analysisService.analyzeDocumentQuick(file, standard);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error analyzing document: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}