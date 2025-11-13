package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeverityDTO {
    private String level;           // CRITICAL, HIGH, MEDIUM, LOW
    private Integer impactScore;    // 1-10
    private String remediationTimeframe; // "24 hours", "7 days", etc.
    private String businessImpact;
    private String technicalImpact;
    private String color;           // Hex color for UI
}