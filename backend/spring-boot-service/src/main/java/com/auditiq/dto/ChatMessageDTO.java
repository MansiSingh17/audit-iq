package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;  // Database ID
    private String messageId;  // String ID (for compatibility)
    private Long conversationId;  // Database conversation ID
    private String conversationIdString;  // String ID (for compatibility)
    private String role;  // "user" or "assistant"
    private String content;
    private LocalDateTime timestamp;
    private String context;  // Document context or finding context
    private List<SuggestedQuestion> suggestedQuestions;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedQuestion {
        private String question;
        private String category;  // "compliance", "remediation", "policy", etc.
        private String icon;
    }
    
    // Helper methods for Claude service compatibility
    public String getConversationIdAsString() {
        if (conversationIdString != null) {
            return conversationIdString;
        }
        return conversationId != null ? conversationId.toString() : null;
    }
    
    public void setConversationIdFromLong(Long id) {
        this.conversationId = id;
        this.conversationIdString = id != null ? id.toString() : null;
    }
    
    // Generate suggested questions based on context
    public void generateSuggestedQuestions(String messageContext) {
        if (this.suggestedQuestions == null) {
            this.suggestedQuestions = new ArrayList<>();
        }
        
        // Add contextual suggested questions based on the conversation
        if (messageContext != null && messageContext.contains("ISO 27001")) {
            this.suggestedQuestions.add(new SuggestedQuestion(
                "What are the key controls in ISO 27001 Annex A?",
                "compliance",
                "shield-check"
            ));
        }
        
        if (messageContext != null && messageContext.contains("policy")) {
            this.suggestedQuestions.add(new SuggestedQuestion(
                "Can you help me improve this policy?",
                "policy",
                "file-edit"
            ));
        }
        
        // Default questions if none added
        if (this.suggestedQuestions.isEmpty()) {
            this.suggestedQuestions.add(new SuggestedQuestion(
                "How can I remediate this finding?",
                "remediation",
                "wrench"
            ));
            this.suggestedQuestions.add(new SuggestedQuestion(
                "What are the best practices for this control?",
                "guidance",
                "lightbulb"
            ));
        }
    }
}