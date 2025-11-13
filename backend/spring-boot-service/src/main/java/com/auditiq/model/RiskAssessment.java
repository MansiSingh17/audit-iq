package com.auditiq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "risk_assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private AuditDocument document;

    @Column(nullable = false)
    private Double overallRiskScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel overallRiskLevel;

    @Column(length = 2000)
    private String summary;

    @Column(length = 5000)
    private String recommendations;

    @Column(nullable = false)
    private String assessedBy = "AI System";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "riskAssessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<RiskFinding> findings = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    // Inner class for RiskFinding
    @Entity
    @Table(name = "risk_findings")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskFinding {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "risk_assessment_id")
        private RiskAssessment riskAssessment;

        @Column(nullable = false)
        private String category;

        @Column(nullable = false, length = 1000)
        private String finding;

        @Column(nullable = false)
        private Double riskScore;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private RiskLevel riskLevel;

        @Column(length = 2000)
        private String impact;

        @Column(length = 2000)
        private String mitigation;

        @Column(nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();
    }
}