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
public class ChatResponseDTO {
    private String response;  // AI response message
    private String message;  // Alternative field name (for compatibility)
    private Long conversationId;  // Database ID
    private String conversationIdString;  // String ID
    private LocalDateTime timestamp;
    private List<ChatMessageDTO.SuggestedQuestion> suggestedQuestions;
    private List<String> relatedControls;
    private String confidence;  // "high", "medium", "low"
    private String messageId;  // ID of the response message
    
    // Helper to ensure both response fields are set
    public void setResponseMessage(String msg) {
        this.response = msg;
        this.message = msg;
    }
    
    public String getResponseMessage() {
        return response != null ? response : message;
    }
    
    // Helper to set conversation ID
    public void setConversationIdFromLong(Long id) {
        this.conversationId = id;
        this.conversationIdString = id != null ? id.toString() : null;
    }
    
    // Generate suggested follow-up questions based on response
    public void generateSuggestedQuestions(String responseText, String standard) {
        if (this.suggestedQuestions == null) {
            this.suggestedQuestions = new ArrayList<>();
        }
        
        // Add contextual questions based on response content
        if (responseText.toLowerCase().contains("policy")) {
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "Can you help me write a policy for this?",
                "policy",
                "file-text"
            ));
        }
        
        if (responseText.toLowerCase().contains("control") || responseText.toLowerCase().contains("requirement")) {
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "What are the implementation steps?",
                "implementation",
                "list-checks"
            ));
        }
        
        if (responseText.toLowerCase().contains("risk") || responseText.toLowerCase().contains("vulnerability")) {
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "How do I remediate this risk?",
                "remediation",
                "shield-alert"
            ));
        }
        
        // Standard-specific questions
        if (standard != null) {
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "Tell me more about " + standard + " requirements",
                "compliance",
                "book-open"
            ));
        }
        
        // Default follow-up
        if (this.suggestedQuestions.isEmpty()) {
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "Can you explain this in more detail?",
                "clarification",
                "help-circle"
            ));
            this.suggestedQuestions.add(new ChatMessageDTO.SuggestedQuestion(
                "What are the best practices?",
                "guidance",
                "star"
            ));
        }
    }
    
    // Set confidence based on response quality
    public void autoSetConfidence(String responseText) {
        if (responseText == null || responseText.isEmpty()) {
            this.confidence = "low";
            return;
        }
        
        // Simple heuristic: longer, more detailed responses = higher confidence
        if (responseText.length() > 500 && responseText.contains("specific")) {
            this.confidence = "high";
        } else if (responseText.length() > 200) {
            this.confidence = "medium";
        } else {
            this.confidence = "low";
        }
    }
}