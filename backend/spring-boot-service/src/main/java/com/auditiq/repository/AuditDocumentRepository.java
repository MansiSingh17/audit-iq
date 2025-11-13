package com.auditiq.repository;

import com.auditiq.model.AuditDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditDocumentRepository extends JpaRepository<AuditDocument, Long> {
    List<AuditDocument> findTop10ByOrderByCreatedAtDesc();
    List<AuditDocument> findByStandard(AuditDocument.ComplianceStandard standard);
    List<AuditDocument> findByStatus(AuditDocument.ProcessingStatus status);
    List<AuditDocument> findByUploadedBy(String uploadedBy);
}
