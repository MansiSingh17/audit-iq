package com.auditiq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_documents")
@Data  // ← THIS GENERATES ALL GETTERS/SETTERS!
@NoArgsConstructor
@AllArgsConstructor
public class AuditDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(name = "s3key", nullable = false)
    private String s3Key;

    @Column(name = "s3url", nullable = false)
    private String s3Url;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplianceStandard standard;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProcessingStatus status = ProcessingStatus.UPLOADED;

    @Column(nullable = false)
    private String uploadedBy = "system";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum ComplianceStandard {
        ISO_27001("ISO 27001:2022"),
        GDPR("GDPR"),
        HIPAA("HIPAA"),
        SOC2("SOC 2"),
        PCI_DSS("PCI DSS");

        private final String displayName;

        ComplianceStandard(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum ProcessingStatus {
        UPLOADED,
        PROCESSING,
        COMPLETED,
        FAILED
    }
}