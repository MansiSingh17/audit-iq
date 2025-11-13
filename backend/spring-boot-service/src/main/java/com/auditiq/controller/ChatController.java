package com.auditiq.controller;

import com.auditiq.dto.ChatRequestDTO;
import com.auditiq.model.ChatConversation;
import com.auditiq.model.ChatMessage;
import com.auditiq.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * Send a chat message
     */
    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody ChatRequestDTO request) {
        try {
            log.info("Received chat message, conversationId: {}", request.getConversationId());
            
            ChatMessage response = chatService.sendMessage(
                request.getMessage(), 
                request.getConversationId()
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("conversationId", response.getConversation().getId());
            result.put("message", response.getContent());
            result.put("timestamp", response.getCreatedAt());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error sending message", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get conversation history
     */
    @GetMapping("/conversation/{conversationId}")
    public ResponseEntity<Map<String, Object>> getConversation(@PathVariable Long conversationId) {
        try {
            log.info("Getting conversation: {}", conversationId);
            
            List<ChatMessage> messages = chatService.getConversationMessages(conversationId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("conversationId", conversationId);
            result.put("messages", messages);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error getting conversation", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all conversations
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversation>> getConversations() {
        try {
            log.info("Getting all conversations");
            List<ChatConversation> conversations = chatService.getAllConversations();
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            log.error("Error getting conversations", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Delete a conversation
     */
    @DeleteMapping("/conversation/{conversationId}")
    public ResponseEntity<Map<String, String>> deleteConversation(@PathVariable Long conversationId) {
        try {
            log.info("Deleting conversation: {}", conversationId);
            chatService.deleteConversation(conversationId);
            return ResponseEntity.ok(Map.of("status", "deleted"));
        } catch (Exception e) {
            log.error("Error deleting conversation", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Ask about a finding
     */
    @PostMapping("/ask-about-finding")
    public ResponseEntity<Map<String, Object>> askAboutFinding(@RequestBody Map<String, Object> request) {
        try {
            String findingDescription = (String) request.get("findingDescription");
            String documentContext = (String) request.get("documentContext");
            Long conversationId = request.get("conversationId") != null ? 
                Long.valueOf(request.get("conversationId").toString()) : null;
            
            log.info("Asking about finding, conversationId: {}", conversationId);
            
            ChatMessage response = chatService.askAboutFinding(
                findingDescription, 
                documentContext, 
                conversationId
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("conversationId", response.getConversation().getId());
            result.put("message", response.getContent());
            result.put("timestamp", response.getCreatedAt());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error asking about finding", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Generate a policy
     */
    @PostMapping("/generate-policy")
    public ResponseEntity<Map<String, Object>> generatePolicy(@RequestBody Map<String, Object> request) {
        try {
            String policyType = (String) request.get("policyType");
            String requirements = (String) request.get("requirements");
            Long conversationId = request.get("conversationId") != null ? 
                Long.valueOf(request.get("conversationId").toString()) : null;
            
            log.info("Generating policy: {}, conversationId: {}", policyType, conversationId);
            
            ChatMessage response = chatService.generatePolicy(
                policyType, 
                requirements, 
                conversationId
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("conversationId", response.getConversation().getId());
            result.put("message", response.getContent());
            result.put("timestamp", response.getCreatedAt());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error generating policy", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Improve a policy
     */
    @PostMapping("/improve-policy")
    public ResponseEntity<Map<String, Object>> improvePolicy(@RequestBody Map<String, Object> request) {
        try {
            String policyText = (String) request.get("policyText");
            String improvementGoals = (String) request.get("improvementGoals");
            Long conversationId = request.get("conversationId") != null ? 
                Long.valueOf(request.get("conversationId").toString()) : null;
            
            log.info("Improving policy, conversationId: {}", conversationId);
            
            ChatMessage response = chatService.improvePolicy(
                policyText, 
                improvementGoals, 
                conversationId
            );
            
            Map<String, Object> result = new HashMap<>();
            result.put("conversationId", response.getConversation().getId());
            result.put("message", response.getContent());
            result.put("timestamp", response.getCreatedAt());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error improving policy", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", e.getMessage()));
        }
    }
}