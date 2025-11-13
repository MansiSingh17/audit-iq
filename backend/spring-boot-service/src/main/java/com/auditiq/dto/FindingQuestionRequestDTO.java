package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for asking questions about specific audit findings
 * Used for contextual AI chat about findings
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindingQuestionRequestDTO {
    
    // Finding information
    private String findingId;  // ID of the finding (optional)
    private String findingDescription;  // Description of the finding
    private String findingTitle;  // Title of the finding
    private String severity;  // Severity level
    
    // Document context
    private Long documentId;  // Related document ID
    private String documentContext;  // Full or partial document text
    private String documentType;  // Type of document (policy, procedure, etc.)
    
    // Compliance context
    private String complianceFramework;  // ISO 27001, GDPR, etc.
    private String affectedControl;  // Specific control affected
    
    // Question details
    private String question;  // Specific question (optional - can be inferred)
    private String questionType;  // "remediation", "explanation", "impact", "timeline"
    
    // Additional context
    private String organizationContext;  // Context about the organization
    private String currentImplementation;  // What's currently in place
    private String constraints;  // Any constraints (budget, timeline, etc.)
    
    // Helper methods
    public String getFullContext() {
        StringBuilder context = new StringBuilder();
        
        context.append("=== AUDIT FINDING ===\n");
        if (findingTitle != null) {
            context.append("Title: ").append(findingTitle).append("\n");
        }
        if (severity != null) {
            context.append("Severity: ").append(severity).append("\n");
        }
        context.append("Description: ").append(findingDescription).append("\n\n");
        
        if (complianceFramework != null) {
            context.append("Framework: ").append(complianceFramework).append("\n");
        }
        if (affectedControl != null) {
            context.append("Affected Control: ").append(affectedControl).append("\n");
        }
        
        if (documentContext != null && !documentContext.isEmpty()) {
            context.append("\n=== DOCUMENT CONTEXT ===\n");
            context.append(documentContext).append("\n");
        }
        
        if (currentImplementation != null && !currentImplementation.isEmpty()) {
            context.append("\n=== CURRENT IMPLEMENTATION ===\n");
            context.append(currentImplementation).append("\n");
        }
        
        if (organizationContext != null && !organizationContext.isEmpty()) {
            context.append("\n=== ORGANIZATION CONTEXT ===\n");
            context.append(organizationContext).append("\n");
        }
        
        if (constraints != null && !constraints.isEmpty()) {
            context.append("\n=== CONSTRAINTS ===\n");
            context.append(constraints).append("\n");
        }
        
        return context.toString();
    }
    
    public String getDefaultQuestion() {
        if (question != null && !question.isEmpty()) {
            return question;
        }
        
        // Generate default question based on question type
        if ("remediation".equals(questionType)) {
            return "How do I remediate this finding? Provide specific, actionable steps.";
        } else if ("explanation".equals(questionType)) {
            return "Explain this finding in detail. What exactly is the issue and why is it important?";
        } else if ("impact".equals(questionType)) {
            return "What is the business and technical impact of this finding?";
        } else if ("timeline".equals(questionType)) {
            return "What is a realistic timeline for remediating this finding?";
        } else {
            return "Provide detailed guidance about this finding and how to address it.";
        }
    }
}