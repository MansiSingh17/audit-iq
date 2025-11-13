package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Wrapper DTO for backward compatibility with existing controller
 * Maps AuditFindingDTO to expected response format
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FindingsSummaryDTO {
    private AuditFindingDTO data;
    private String status;
    private String message;

    public FindingsSummaryDTO(AuditFindingDTO data) {
        this.data = data;
        this.status = "success";
        this.message = "Findings generated successfully";
    }

    public static FindingsSummaryDTO success(AuditFindingDTO data) {
        return new FindingsSummaryDTO(data, "success", "Findings generated successfully");
    }

    public static FindingsSummaryDTO error(String message) {
        return new FindingsSummaryDTO(null, "error", message);
    }
}