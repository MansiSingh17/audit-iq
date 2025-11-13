package com.auditiq.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCorrectionResponse {
    private boolean success;
    private String originalText;
    private String correctedText;
    
    // Map 'corrections' from Python to 'suggestions' in Java
    @JsonProperty("corrections")
    private List<GrammarCorrection> corrections;
    
    private String language;
    private Double processingTimeMs;
    private String error;
    
    // Keep backwards compatibility
    public List<GrammarCorrection> getSuggestions() {
        return corrections;
    }
    
    public void setSuggestions(List<GrammarCorrection> suggestions) {
        this.corrections = suggestions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrammarCorrection {
        private String original;
        private String corrected;
        private String type;
        private String message;
        private Integer offset;
        private Integer length;
        private Integer position;
        private String suggestion;
    }
}