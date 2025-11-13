package com.auditiq.repository;

import com.auditiq.model.Checklist;
import com.auditiq.model.AuditDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    
    List<Checklist> findByDocumentId(Long documentId);
    
    List<Checklist> findByStandard(AuditDocument.ComplianceStandard standard);
    
    List<Checklist> findByDocument(AuditDocument document);
}