package com.auditiq.repository;

import com.auditiq.model.RiskAssessment;
import com.auditiq.model.AuditDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    
    List<RiskAssessment> findByDocumentId(Long documentId);
    
    List<RiskAssessment> findByDocument(AuditDocument document);
    
    List<RiskAssessment> findByOverallRiskLevel(RiskAssessment.RiskLevel riskLevel);
}