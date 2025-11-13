package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemediationStepDTO {
    private Integer stepNumber;
    private String action;
    private String owner;
    private LocalDate deadline;
    private String status;  // PENDING, IN_PROGRESS, COMPLETED
    private String resources;
}