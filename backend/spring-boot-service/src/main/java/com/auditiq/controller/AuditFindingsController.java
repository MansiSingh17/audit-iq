package com.auditiq.controller;

import com.auditiq.dto.AuditFindingDTO;
import com.auditiq.dto.FindingsSummaryDTO;
import com.auditiq.service.AuditFindingsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/audit-findings")
@Slf4j
@CrossOrigin(origins = "*")
public class AuditFindingsController {

    @Autowired
    private AuditFindingsService auditFindingsService;

    /**
     * Generate audit findings for an uploaded document
     */
    @PostMapping("/generate")
    public ResponseEntity<FindingsSummaryDTO> generateFindings(
            @RequestParam Long documentId,
            @RequestParam String framework) {
        try {
            log.info("Generating findings for document: {}, framework: {}", documentId, framework);
            
            AuditFindingDTO findings = auditFindingsService.generateFindings(documentId, framework);
            
            return ResponseEntity.ok(FindingsSummaryDTO.success(findings));
        } catch (Exception e) {
            log.error("Error generating findings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(FindingsSummaryDTO.error(e.getMessage()));
        }
    }

    /**
     * Generate findings from pasted text (no file upload)
     */
    @PostMapping("/generate-from-text")
    public ResponseEntity<FindingsSummaryDTO> generateFindingsFromText(
            @RequestBody Map<String, String> request) {
        try {
            String documentText = request.get("documentText");
            String framework = request.get("framework");
            String fileName = request.getOrDefault("fileName", "Pasted Text");

            log.info("Generating findings from text: {} chars, framework: {}", 
                documentText.length(), framework);
            
            AuditFindingDTO findings = auditFindingsService.generateFindingsFromText(
                documentText, framework, fileName);
            
            return ResponseEntity.ok(FindingsSummaryDTO.success(findings));
        } catch (Exception e) {
            log.error("Error generating findings from text", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(FindingsSummaryDTO.error(e.getMessage()));
        }
    }

    /**
     * Get remediation guidance for a specific finding
     */
    @PostMapping("/remediation-guidance")
    public ResponseEntity<Map<String, String>> getRemediationGuidance(
            @RequestBody Map<String, Object> request) {
        try {
            Long documentId = Long.valueOf(request.get("documentId").toString());
            String findingDescription = (String) request.get("findingDescription");

            log.info("Getting remediation guidance for document: {}", documentId);
            
            String guidance = auditFindingsService.getRemediationGuidance(documentId, findingDescription);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "guidance", guidance
            ));
        } catch (Exception e) {
            log.error("Error getting remediation guidance", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
                ));
        }
    }
}