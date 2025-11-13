package com.auditiq.repository;

import com.auditiq.model.ComplianceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceDocumentRepository extends JpaRepository<ComplianceDocument, Long> {

    List<ComplianceDocument> findByIsDeletedFalse();

    List<ComplianceDocument> findByUploadedBy(String uploadedBy);

    List<ComplianceDocument> findByComplianceFramework(String framework);

    List<ComplianceDocument> findByStatus(String status);

    @Query("SELECT d FROM ComplianceDocument d WHERE d.isDeleted = false AND d.status = :status")
    List<ComplianceDocument> findActiveByStatus(@Param("status") String status);

    @Query("SELECT d FROM ComplianceDocument d WHERE d.isDeleted = false AND d.createdAt >= :since")
    List<ComplianceDocument> findRecentDocuments(@Param("since") LocalDateTime since);

    Optional<ComplianceDocument> findByIdAndIsDeletedFalse(Long id);

    @Query("SELECT d FROM ComplianceDocument d WHERE d.isDeleted = false AND d.fileName LIKE %:keyword%")
    List<ComplianceDocument> searchByFileName(@Param("keyword") String keyword);
}