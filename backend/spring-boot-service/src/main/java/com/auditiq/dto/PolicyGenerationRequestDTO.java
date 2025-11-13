package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for generating new policies using AI
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyGenerationRequestDTO {
    
    // Basic policy information
    private String policyType;  // "Access Control", "Encryption", "Incident Response", etc.
    private String policyTitle;  // Custom title (optional)
    
    // Compliance requirements
    private String complianceFramework;  // ISO 27001, GDPR, HIPAA, SOC 2, etc.
    private List<String> specificControls;  // e.g., ["A.9.2.1", "A.9.2.2"] for ISO 27001
    private String requirements;  // Specific requirements or constraints
    
    // Organization context
    private String organizationType;  // "Healthcare", "Financial", "Technology", etc.
    private String organizationSize;  // "Small (<50)", "Medium (50-500)", "Large (500+)"
    private String existingPolicies;  // Optional: existing policies to reference
    
    // Policy scope
    private List<String> applicableRoles;  // Roles this policy applies to
    private List<String> applicableSystems;  // Systems/assets this policy covers
    private String geographicScope;  // "Global", "US only", "EU only", etc.
    
    // Customization preferences
    private String tone;  // "Formal", "Conversational", "Technical"
    private String detailLevel;  // "High", "Medium", "Low"
    private Boolean includeExamples;  // Include practical examples
    private Boolean includeProcedures;  // Include implementation procedures
    private Boolean includeMetrics;  // Include KPIs and metrics
    
    // Additional requirements
    private List<String> mustInclude;  // Specific elements that must be included
    private List<String> mustAvoid;  // Things to avoid or exclude
    private String additionalNotes;  // Any other instructions
    
    // Helper methods
    public String getFullRequirements() {
        StringBuilder fullReq = new StringBuilder();
        
        if (requirements != null && !requirements.isEmpty()) {
            fullReq.append(requirements).append("\n\n");
        }
        
        if (complianceFramework != null) {
            fullReq.append("Compliance Framework: ").append(complianceFramework).append("\n");
        }
        
        if (specificControls != null && !specificControls.isEmpty()) {
            fullReq.append("Specific Controls: ").append(String.join(", ", specificControls)).append("\n");
        }
        
        if (organizationType != null) {
            fullReq.append("Organization Type: ").append(organizationType).append("\n");
        }
        
        if (mustInclude != null && !mustInclude.isEmpty()) {
            fullReq.append("\nMust Include:\n");
            mustInclude.forEach(item -> fullReq.append("- ").append(item).append("\n"));
        }
        
        if (mustAvoid != null && !mustAvoid.isEmpty()) {
            fullReq.append("\nMust Avoid:\n");
            mustAvoid.forEach(item -> fullReq.append("- ").append(item).append("\n"));
        }
        
        if (additionalNotes != null && !additionalNotes.isEmpty()) {
            fullReq.append("\nAdditional Notes:\n").append(additionalNotes);
        }
        
        return fullReq.toString();
    }
}