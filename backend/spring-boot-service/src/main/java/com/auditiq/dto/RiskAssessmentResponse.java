package com.auditiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskAssessmentResponse {
    private boolean success;
    private Double overallScore;
    private String overallLevel;
    private String summary;
    private List<String> recommendations;
    private List<RiskFindingDTO> findings;
    private String error;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskFindingDTO {
        private String category;
        private String finding;
        private Double riskScore;
        private String riskLevel;
        private String impact;
        private String mitigation;
    }
}
