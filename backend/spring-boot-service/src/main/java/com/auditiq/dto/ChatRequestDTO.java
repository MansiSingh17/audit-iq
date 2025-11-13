package com.auditiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDTO {
    private String message;  // User's message
    private Long conversationId;  // Database ID (null for new conversation)
    private String conversationIdString;  // String ID (for compatibility)
    private String context;  // Optional: document context, finding details
    private String standard;  // Optional: compliance standard (ISO 27001, GDPR, etc.)
    private String documentId;  // Optional: related document ID
    private String findingId;  // Optional: related finding ID
    
    // Helper method to get conversation ID
    public Long getConversationIdAsLong() {
        if (conversationId != null) {
            return conversationId;
        }
        if (conversationIdString != null && !conversationIdString.isEmpty()) {
            try {
                return Long.parseLong(conversationIdString);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}