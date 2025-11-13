package com.auditiq.service;

import com.auditiq.dto.RiskAssessmentResponse;
import com.auditiq.exception.ResourceNotFoundException;
import com.auditiq.model.AuditDocument;
import com.auditiq.model.RiskAssessment;
import com.auditiq.repository.AuditDocumentRepository;
import com.auditiq.repository.RiskAssessmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskRepository;
    private final AuditDocumentRepository documentRepository;
    private final PythonMLClient pythonMLClient;

    @Transactional
    public RiskAssessment performRiskAssessment(Long documentId) {
        AuditDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        if (document.getExtractedText() == null || document.getExtractedText().isEmpty()) {
            throw new IllegalArgumentException("Document has no extracted text for analysis");
        }

        RiskAssessmentResponse mlResponse;
        if (document.getExtractedText() != null && !document.getExtractedText().isEmpty()) {
            mlResponse = pythonMLClient.assessRisk(
                    document.getExtractedText(),
                    document.getStandard().name()
            );
        } else {
            throw new IllegalArgumentException("Document text is empty");
        }

        RiskAssessment assessment = new RiskAssessment();
        assessment.setDocument(document);
        assessment.setOverallRiskScore(mlResponse.getOverallScore());
        assessment.setOverallRiskLevel(
                RiskAssessment.RiskLevel.valueOf(mlResponse.getOverallLevel().toUpperCase())
        );
        assessment.setSummary(mlResponse.getSummary());
        assessment.setRecommendations(String.join("; ", mlResponse.getRecommendations()));
        assessment.setAssessedBy("AI System");

        for (RiskAssessmentResponse.RiskFindingDTO findingDTO : mlResponse.getFindings()) {
            RiskAssessment.RiskFinding finding = new RiskAssessment.RiskFinding();
            finding.setRiskAssessment(assessment);
            finding.setCategory(findingDTO.getCategory());
            finding.setFinding(findingDTO.getFinding());
            finding.setRiskScore(findingDTO.getRiskScore());
            finding.setRiskLevel(
                    RiskAssessment.RiskLevel.valueOf(findingDTO.getRiskLevel().toUpperCase())
            );
            finding.setImpact(findingDTO.getImpact());
            finding.setMitigation(findingDTO.getMitigation());
            assessment.getFindings().add(finding);
        }

        RiskAssessment savedAssessment = riskRepository.save(assessment);
        log.info("Created risk assessment with ID: {} for document: {}, Risk Level: {}", 
                savedAssessment.getId(), documentId, savedAssessment.getOverallRiskLevel());
        return savedAssessment;
    }

    public RiskAssessment getRiskAssessmentById(Long id) {
        return riskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Risk assessment not found with id: " + id));
    }

    public List<RiskAssessment> getAssessmentsByDocumentId(Long documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new ResourceNotFoundException("Document not found with id: " + documentId);
        }
        return riskRepository.findByDocumentId(documentId);
    }

    public List<RiskAssessment> getAllAssessments() {
        return riskRepository.findAll();
    }

    public List<RiskAssessment> getAssessmentsByRiskLevel(RiskAssessment.RiskLevel riskLevel) {
        return riskRepository.findByOverallRiskLevel(riskLevel);
    }

    @Transactional
    public void deleteAssessment(Long id) {
        RiskAssessment assessment = getRiskAssessmentById(id);
        assessment.getFindings().clear();
        riskRepository.delete(assessment);
    }

    @Transactional
    public RiskAssessment regenerateAssessment(Long assessmentId) {
        log.info("Regenerating risk assessment with ID: {}", assessmentId);
        
        RiskAssessment existingAssessment = getRiskAssessmentById(assessmentId);
        Long documentId = existingAssessment.getDocument().getId();
        
        deleteAssessment(assessmentId);
        
        return performRiskAssessment(documentId);
    }

    @Transactional
    public RiskAssessment updateAssessment(Long assessmentId, RiskAssessment updatedAssessment) {
        RiskAssessment existingAssessment = getRiskAssessmentById(assessmentId);
        existingAssessment.setAssessedBy(updatedAssessment.getAssessedBy());
        return riskRepository.save(existingAssessment);
    }
}