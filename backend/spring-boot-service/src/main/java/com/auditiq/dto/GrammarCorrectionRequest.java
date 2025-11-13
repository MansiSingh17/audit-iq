package com.auditiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCorrectionRequest {
    private String text;
    private String language = "en";
    private Boolean returnSuggestions = true;
}
