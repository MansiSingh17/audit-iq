package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for improving existing policies using AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyImprovementRequestDTO {
    
    // Original policy
    private String policyText;  // The policy text to improve
    private String policyType;  // Type of policy (optional, helps AI understand context)
    private String currentVersion;  // Current version number
    
    // Improvement goals
    private String improvementGoals;  // Overall improvement objectives
    private List<String> specificImprovements;  // Specific areas to improve
    
    // Compliance alignment
    private String targetFramework;  // ISO 27001, GDPR, HIPAA, etc.
    private List<String> targetControls;  // Specific controls to align with
    private List<String> currentGaps;  // Known gaps to address
    
    // Enhancement requests
    private Boolean makeMoreAuditReady;  // Make more suitable for audits
    private Boolean improveClarity;  // Improve readability and clarity
    private Boolean addTechnicalDetails;  // Add more technical specifics
    private Boolean addExamples;  // Add practical examples
    private Boolean addMetrics;  // Add measurable KPIs
    private Boolean updateForModernPractices;  // Update to current best practices
    
    // Scope preferences
    private String tone;  // "More formal", "More accessible", "Keep current"
    private String detailLevel;  // "More detailed", "More concise", "Keep current"
    
    // Constraints
    private List<String> mustKeep;  // Elements that must be preserved
    private List<String> mustRemove;  // Elements that should be removed
    private Integer maxLength;  // Maximum length in words (optional)
    private Integer minLength;  // Minimum length in words (optional)
    
    // Additional context
    private String organizationContext;  // Context about the organization
    private String whyImproving;  // Reason for improvement (audit finding, new regulation, etc.)
    private String additionalInstructions;  // Any other specific instructions
    
    // Output preferences
    private Boolean showChanges;  // Highlight what was changed
    private Boolean explainChanges;  // Provide explanations for changes
    private Boolean provideSummary;  // Include summary of improvements
    
    // Helper methods
    public String getFullImprovementGoals() {
        StringBuilder goals = new StringBuilder();
        
        if (improvementGoals != null && !improvementGoals.isEmpty()) {
            goals.append(improvementGoals).append("\n\n");
        }
        
        goals.append("Requested Improvements:\n");
        
        if (makeMoreAuditReady != null && makeMoreAuditReady) {
            goals.append("- Make more audit-ready and compliant\n");
        }
        if (improveClarity != null && improveClarity) {
            goals.append("- Improve clarity and readability\n");
        }
        if (addTechnicalDetails != null && addTechnicalDetails) {
            goals.append("- Add more technical details\n");
        }
        if (addExamples != null && addExamples) {
            goals.append("- Add practical examples\n");
        }
        if (addMetrics != null && addMetrics) {
            goals.append("- Add measurable KPIs and metrics\n");
        }
        if (updateForModernPractices != null && updateForModernPractices) {
            goals.append("- Update to current best practices\n");
        }
        
        if (specificImprovements != null && !specificImprovements.isEmpty()) {
            goals.append("\nSpecific Improvements Needed:\n");
            specificImprovements.forEach(item -> goals.append("- ").append(item).append("\n"));
        }
        
        if (targetFramework != null) {
            goals.append("\nAlign with: ").append(targetFramework).append("\n");
        }
        
        if (targetControls != null && !targetControls.isEmpty()) {
            goals.append("Target Controls: ").append(String.join(", ", targetControls)).append("\n");
        }
        
        if (mustKeep != null && !mustKeep.isEmpty()) {
            goals.append("\nMust Keep:\n");
            mustKeep.forEach(item -> goals.append("- ").append(item).append("\n"));
        }
        
        if (mustRemove != null && !mustRemove.isEmpty()) {
            goals.append("\nMust Remove:\n");
            mustRemove.forEach(item -> goals.append("- ").append(item).append("\n"));
        }
        
        if (additionalInstructions != null && !additionalInstructions.isEmpty()) {
            goals.append("\nAdditional Instructions:\n").append(additionalInstructions);
        }
        
        return goals.toString();
    }
}