package com.auditiq.repository;

import com.auditiq.model.ChatConversation;
import com.auditiq.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByConversationOrderByCreatedAtAsc(ChatConversation conversation);
    
    void deleteByConversation(ChatConversation conversation);
    
    Long countByConversation(ChatConversation conversation);
}