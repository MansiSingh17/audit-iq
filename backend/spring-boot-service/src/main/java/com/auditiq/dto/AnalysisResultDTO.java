package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResultDTO {
    
    private String documentId;
    private String documentName;
    private String standard;
    private LocalDateTime analyzedAt;
    private OverallAssessment overallAssessment;
    private List<CriticalFlag> criticalFlags;
    private List<ImprovementSuggestion> improvements;
    private List<ComplianceGap> complianceGaps;
    private List<RiskArea> riskAreas;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverallAssessment {
        private String score; // e.g., "75/100"
        private String rating; // e.g., "Good", "Needs Improvement"
        private String summary;
        private int criticalIssues;
        private int warnings;
        private int recommendations;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CriticalFlag {
        private String id;
        private String severity; // HIGH, MEDIUM, LOW
        private String title;
        private String description;
        private String location; // Section/page in document
        private String recommendation;
        private List<String> affectedControls;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImprovementSuggestion {
        private String id;
        private String category;
        private String title;
        private String description;
        private String benefit;
        private String effort; // LOW, MEDIUM, HIGH
        private int priority; // 1-5
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComplianceGap {
        private String controlId;
        private String controlName;
        private String requirement;
        private String currentState;
        private String expectedState;
        private String gap;
        private List<String> remediationSteps;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskArea {
        private String id;
        private String riskLevel; // CRITICAL, HIGH, MEDIUM, LOW
        private String title;
        private String description;
        private String impact;
        private String likelihood;
        private List<String> mitigationActions;
    }
}