package com.auditiq.controller;

import com.auditiq.dto.GrammarCorrectionRequest;
import com.auditiq.dto.GrammarCorrectionResponse;
import com.auditiq.service.GrammarCorrectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/grammar")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class GrammarController {

    private final GrammarCorrectionService grammarCorrectionService;

    @PostMapping("/correct")
    public ResponseEntity<GrammarCorrectionResponse> correctGrammar(
            @Valid @RequestBody GrammarCorrectionRequest request) {
        
        log.info("Correcting grammar for text of length: {}", request.getText().length());
        
        GrammarCorrectionResponse response = grammarCorrectionService.correctGrammar(request.getText());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check")
    public ResponseEntity<GrammarCorrectionResponse> checkGrammar(
            @Valid @RequestBody GrammarCorrectionRequest request) {
        
        log.info("Checking grammar for text of length: {}", request.getText().length());
        
        GrammarCorrectionResponse response = grammarCorrectionService.checkGrammar(request.getText());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/document/{documentId}/correct")
    public ResponseEntity<GrammarCorrectionResponse> correctDocumentGrammar(@PathVariable Long documentId) {
        log.info("Correcting grammar for document ID: {}", documentId);
        
        GrammarCorrectionResponse response = grammarCorrectionService.correctDocumentGrammar(documentId);
        
        return ResponseEntity.ok(response);
    }
}