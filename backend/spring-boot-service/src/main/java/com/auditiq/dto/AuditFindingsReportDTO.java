package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditFindingsReportDTO {
    private String reportId;
    private LocalDateTime generatedAt;
    private String standard;
    private String documentName;
    private ExecutiveSummary executiveSummary;
    private List<AuditFindingDTO> criticalFindings;
    private List<AuditFindingDTO> highFindings;
    private List<AuditFindingDTO> mediumFindings;
    private List<AuditFindingDTO> lowFindings;
    private FindingsStatistics statistics;
    private List<BestPracticeRecommendation> bestPractices;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExecutiveSummary {
        private String overview;
        private Integer totalFindings;
        private Double complianceScore;
        private String riskRating;
        private List<String> keyRecommendations;
        private String estimatedRemediationTime;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FindingsStatistics {
        private Integer critical;
        private Integer high;
        private Integer medium;
        private Integer low;
        private Double averageImpactScore;
        private String mostCommonCategory;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BestPracticeRecommendation {
        private String category;
        private String recommendation;
        private String rationale;
        private List<String> industryExamples;
        private String implementationGuide;
    }
}