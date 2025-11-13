package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditFindingDTO {
    
    private Long documentId;
    private String documentName;
    private String documentType;
    private String complianceFramework;
    private String frameworkVersion;
    
    private List<Finding> findings;
    
    private Integer totalFindings;
    private Integer criticalCount;
    private Integer highCount;
    private Integer mediumCount;
    private Integer lowCount;
    private Integer totalHighPriority;
    
    private String executiveSummary;
    private String overallRiskLevel;
    private String complianceStatus;
    private Double complianceScore;
    private Double compliancePercentage;
    private String riskSummary;
    
    private LocalDateTime generatedAt;
    private String generatedBy;
    private LocalDate nextReviewDate;
    
    private String priorityRecommendations;
    private String quickWins;
    private String actionPlan;
    private String analysisQuality;
    
    private Integer totalControlsReviewed;
    private Integer controlsCompliant;
    private Integer controlsPartiallyCompliant;
    private Integer controlsNonCompliant;

    /**
     * Inner class for individual findings
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Finding {
        private Long id;
        private String title;
        private String description;
        
        private SeverityDTO severity;
        private Integer impactScore;
        private String severityString;
        
        private String remediationTimeline;
        private LocalDate dueDate;
        private String status;
        
        private String controlReference;
        private String standard;
        
        private String grammarCorrectedDescription;
        private String executiveSummary;
        private String auditReadyDocumentation;
        
        private String industryBestPractices;
        private String benchmarkComparisons;
        private String frameworkAlignments;
        
        private List<RemediationStepDTO> remediationSteps;
        
        private String assignedTo;
        private String estimatedEffort;
        private String priority;
        
        private String evidence;
        private List<String> affectedControls;
        private String bestPractices;
        private String recommendedTimeline;
    }
}