package com.auditiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentAnalysisResponse {
    private boolean success;
    private String standard;
    private String summary;
    private List<String> keyFindings;
    private Integer confidenceScore;
    private String error;
}