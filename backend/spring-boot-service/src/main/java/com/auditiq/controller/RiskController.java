package com.auditiq.controller;

import com.auditiq.model.RiskAssessment;
import com.auditiq.service.RiskAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/risk-assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RiskController {

    private final RiskAssessmentService riskAssessmentService;

    @PostMapping("/assess/{documentId}")
    public ResponseEntity<RiskAssessment> assessRisk(@PathVariable Long documentId) {
        try {
            log.info("Assessing risk for document ID: {}", documentId);
            RiskAssessment assessment = riskAssessmentService.performRiskAssessment(documentId);
            return ResponseEntity.ok(assessment);
        } catch (Exception e) {
            log.error("Error assessing risk for document {}: {}", documentId, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RiskAssessment> getRiskAssessment(@PathVariable Long id) {
        RiskAssessment assessment = riskAssessmentService.getRiskAssessmentById(id);
        return ResponseEntity.ok(assessment);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<RiskAssessment>> getAssessmentsByDocument(@PathVariable Long documentId) {
        List<RiskAssessment> assessments = riskAssessmentService.getAssessmentsByDocumentId(documentId);
        return ResponseEntity.ok(assessments);
    }

    @GetMapping
    public ResponseEntity<List<RiskAssessment>> getAllAssessments() {
        List<RiskAssessment> assessments = riskAssessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        riskAssessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }
}