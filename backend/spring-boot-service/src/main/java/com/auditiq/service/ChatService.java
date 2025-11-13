package com.auditiq.service;

import com.auditiq.model.ChatConversation;
import com.auditiq.model.ChatMessage;
import com.auditiq.repository.ChatConversationRepository;
import com.auditiq.repository.ChatMessageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ChatService {

    @Autowired
    private ClaudeService claudeService;

    @Autowired
    private ChatConversationRepository conversationRepository;

    @Autowired
    private ChatMessageRepository messageRepository;

    /**
     * Send a message and get AI response
     */
    @Transactional
    public ChatMessage sendMessage(String userMessage, Long conversationId) {
        log.info("Processing chat message for conversation: {}", conversationId);

        // Get or create conversation
        ChatConversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        } else {
            // Create new conversation
            conversation = new ChatConversation();
            conversation.setTitle(generateConversationTitle(userMessage));
            conversation.setCreatedAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setConversation(conversation);
        userMsg.setRole("user");
        userMsg.setContent(userMessage);
        userMsg.setCreatedAt(LocalDateTime.now());
        messageRepository.save(userMsg);

        // Get conversation history
        List<ChatMessage> history = messageRepository.findByConversationOrderByCreatedAtAsc(conversation);

        // Build message list for Claude API
        List<ClaudeService.ChatMessage> claudeMessages = new ArrayList<>();
        for (ChatMessage msg : history) {
            claudeMessages.add(new ClaudeService.ChatMessage(msg.getRole(), msg.getContent()));
        }

        // Call Claude API
        String aiResponse = claudeService.chat(claudeMessages);

        // Save AI response
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setConversation(conversation);
        aiMsg.setRole("assistant");
        aiMsg.setContent(aiResponse);
        aiMsg.setCreatedAt(LocalDateTime.now());
        aiMsg = messageRepository.save(aiMsg);

        // Update conversation timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return aiMsg;
    }

    /**
     * Get all conversations
     */
    public List<ChatConversation> getAllConversations() {
        return conversationRepository.findAllByOrderByUpdatedAtDesc();
    }

    /**
     * Get messages in a conversation
     */
    public List<ChatMessage> getConversationMessages(Long conversationId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        return messageRepository.findByConversationOrderByCreatedAtAsc(conversation);
    }

    /**
     * Delete a conversation
     */
    @Transactional
    public void deleteConversation(Long conversationId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        
        // Delete all messages
        messageRepository.deleteByConversation(conversation);
        
        // Delete conversation
        conversationRepository.delete(conversation);
    }

    /**
     * Start a new conversation
     */
    @Transactional
    public ChatConversation createConversation(String title) {
        ChatConversation conversation = new ChatConversation();
        conversation.setTitle(title != null ? title : "New Conversation");
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        return conversationRepository.save(conversation);
    }

    /**
     * Ask about a specific finding (contextual chat)
     */
    @Transactional
    public ChatMessage askAboutFinding(String findingDescription, String documentContext, Long conversationId) {
        log.info("Asking about finding in conversation: {}", conversationId);

        // Get or create conversation
        ChatConversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        } else {
            conversation = new ChatConversation();
            conversation.setTitle("Finding Analysis");
            conversation.setCreatedAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Build contextual message
        String contextualMessage = String.format(
            "I need help understanding this audit finding:\n\n%s\n\nDocument context:\n%s",
            findingDescription, documentContext
        );

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setConversation(conversation);
        userMsg.setRole("user");
        userMsg.setContent(contextualMessage);
        userMsg.setCreatedAt(LocalDateTime.now());
        messageRepository.save(userMsg);

        // Call Claude API with finding context
        String aiResponse = claudeService.analyzeFinding(findingDescription, documentContext);

        // Save AI response
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setConversation(conversation);
        aiMsg.setRole("assistant");
        aiMsg.setContent(aiResponse);
        aiMsg.setCreatedAt(LocalDateTime.now());
        aiMsg = messageRepository.save(aiMsg);

        // Update conversation
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return aiMsg;
    }

    /**
     * Generate a policy document
     */
    @Transactional
    public ChatMessage generatePolicy(String policyType, String requirements, Long conversationId) {
        log.info("Generating policy: {} for conversation: {}", policyType, conversationId);

        // Get or create conversation
        ChatConversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        } else {
            conversation = new ChatConversation();
            conversation.setTitle("Policy Generation: " + policyType);
            conversation.setCreatedAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Build request message
        String requestMessage = String.format(
            "Generate a %s policy with the following requirements:\n%s",
            policyType, requirements
        );

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setConversation(conversation);
        userMsg.setRole("user");
        userMsg.setContent(requestMessage);
        userMsg.setCreatedAt(LocalDateTime.now());
        messageRepository.save(userMsg);

        // Call Claude API
        String policyDocument = claudeService.generatePolicy(policyType, requirements);

        // Save AI response
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setConversation(conversation);
        aiMsg.setRole("assistant");
        aiMsg.setContent(policyDocument);
        aiMsg.setCreatedAt(LocalDateTime.now());
        aiMsg = messageRepository.save(aiMsg);

        // Update conversation
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return aiMsg;
    }

    /**
     * Improve an existing policy
     */
    @Transactional
    public ChatMessage improvePolicy(String policyText, String improvementGoals, Long conversationId) {
        log.info("Improving policy for conversation: {}", conversationId);

        // Get or create conversation
        ChatConversation conversation;
        if (conversationId != null) {
            conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found: " + conversationId));
        } else {
            conversation = new ChatConversation();
            conversation.setTitle("Policy Improvement");
            conversation.setCreatedAt(LocalDateTime.now());
            conversation.setUpdatedAt(LocalDateTime.now());
            conversation = conversationRepository.save(conversation);
        }

        // Build request message
        String requestMessage = String.format(
            "Improve this policy:\n%s\n\nImprovement goals:\n%s",
            policyText, improvementGoals
        );

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setConversation(conversation);
        userMsg.setRole("user");
        userMsg.setContent(requestMessage);
        userMsg.setCreatedAt(LocalDateTime.now());
        messageRepository.save(userMsg);

        // Call Claude API
        String improvedPolicy = claudeService.improvePolicy(policyText, improvementGoals);

        // Save AI response
        ChatMessage aiMsg = new ChatMessage();
        aiMsg.setConversation(conversation);
        aiMsg.setRole("assistant");
        aiMsg.setContent(improvedPolicy);
        aiMsg.setCreatedAt(LocalDateTime.now());
        aiMsg = messageRepository.save(aiMsg);

        // Update conversation
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return aiMsg;
    }

    /**
     * Generate conversation title from first message
     */
    private String generateConversationTitle(String firstMessage) {
        if (firstMessage.length() > 50) {
            return firstMessage.substring(0, 47) + "...";
        }
        return firstMessage;
    }
}