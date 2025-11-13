package com.auditiq.service;

import com.auditiq.model.AuditLog;
import com.auditiq.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLog createLog(String action, String entityType, Long entityId, String performedBy, String details) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setPerformedBy(performedBy != null ? performedBy : "system");
        auditLog.setDetails(details);
        auditLog.setTimestamp(LocalDateTime.now());

        AuditLog savedLog = auditLogRepository.save(auditLog);
        log.info("Created audit log: {} - {} for entity {}:{}", action, entityType, entityType, entityId);
        return savedLog;
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    public List<AuditLog> getLogsByEntityType(String entityType) {
        return auditLogRepository.findByEntityType(entityType);
    }

    public List<AuditLog> getLogsByEntityId(Long entityId) {
        return auditLogRepository.findByEntityId(entityId);
    }

    public List<AuditLog> getLogsByPerformedBy(String performedBy) {
        return auditLogRepository.findByPerformedBy(performedBy);
    }

    public List<AuditLog> getLogsByAction(String action) {
        return auditLogRepository.findByAction(action);
    }
}