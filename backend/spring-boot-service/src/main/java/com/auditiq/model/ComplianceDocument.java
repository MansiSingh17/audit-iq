package com.auditiq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false)
    private String s3Key;

    @Column(nullable = false)
    private String s3Bucket;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String textContent;

    private String complianceFramework;

    private String documentType;

    private String status; // UPLOADED, PROCESSING, ANALYZED, ERROR

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private LocalDateTime analyzedAt;

    private String analysisStatus;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String analysisResult;

    private Integer totalPages;

    private String language;

    private Boolean isDeleted = false;
}