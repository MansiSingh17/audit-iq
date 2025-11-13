package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextAnalysisRequestDTO {
    private String text;
    private String standard;
    private String documentName;
}