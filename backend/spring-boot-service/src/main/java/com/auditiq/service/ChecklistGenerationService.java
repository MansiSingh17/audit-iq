package com.auditiq.service;

import com.auditiq.dto.ChecklistResponse;
import com.auditiq.exception.ResourceNotFoundException;
import com.auditiq.model.AuditDocument;
import com.auditiq.model.Checklist;
import com.auditiq.repository.AuditDocumentRepository;
import com.auditiq.repository.ChecklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChecklistGenerationService {

    private final ChecklistRepository checklistRepository;
    private final AuditDocumentRepository documentRepository;
    private final PythonMLClient pythonMLClient;

    @Transactional
    public Checklist generateChecklist(Long documentId) {
        AuditDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        if (document.getExtractedText() == null || document.getExtractedText().isEmpty()) {
            throw new IllegalArgumentException("Document has no extracted text for analysis");
        }

        ChecklistResponse mlResponse;
        if (document.getExtractedText() != null && !document.getExtractedText().isEmpty()) {
            mlResponse = pythonMLClient.generateChecklist(
                    document.getExtractedText(),
                    document.getStandard().name()
            );
        } else {
            throw new IllegalArgumentException("Document text is empty");
        }

        Checklist checklist = new Checklist();
        checklist.setStandardName(mlResponse.getStandard());
        checklist.setStandard(document.getStandard());
        checklist.setDocument(document);
        checklist.setGeneratedBy("AI System");
        checklist.setTotalItems(mlResponse.getItems().size());
        checklist.setCompletedItems(0);

        for (ChecklistResponse.ChecklistItemDTO itemDTO : mlResponse.getItems()) {
            Checklist.ChecklistItem item = new Checklist.ChecklistItem();
            item.setChecklist(checklist);
            item.setItemNumber(itemDTO.getItemNumber());
            item.setRequirement(itemDTO.getRequirement());
            item.setDescription(itemDTO.getDescription());
            item.setCompleted(false);
            item.setPriority(Checklist.ChecklistItem.Priority.valueOf(itemDTO.getPriority().toUpperCase()));
            checklist.getItems().add(item);
        }

        Checklist savedChecklist = checklistRepository.save(checklist);
        log.info("Generated checklist with ID: {} for document: {}", savedChecklist.getId(), documentId);
        return savedChecklist;
    }

    public Checklist getChecklistById(Long id) {
        return checklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Checklist not found with id: " + id));
    }

    public List<Checklist> getChecklistsByDocumentId(Long documentId) {
        if (!documentRepository.existsById(documentId)) {
            throw new ResourceNotFoundException("Document not found with id: " + documentId);
        }
        return checklistRepository.findByDocumentId(documentId);
    }

    public List<Checklist> getAllChecklists() {
        return checklistRepository.findAll();
    }

    public List<Checklist> getChecklistsByStandard(AuditDocument.ComplianceStandard standard) {
        return checklistRepository.findByStandard(standard);
    }

    @Transactional
    public Checklist updateChecklistItemStatus(Long checklistId, Integer itemNumber, Boolean completed) {
        Checklist checklist = getChecklistById(checklistId);

        if (itemNumber < 0 || itemNumber >= checklist.getItems().size()) {
            throw new IllegalArgumentException("Invalid item number: " + itemNumber);
        }

        Checklist.ChecklistItem item = checklist.getItems().get(itemNumber);
        item.setCompleted(completed);

        List<Checklist.ChecklistItem> items = checklist.getItems();
        long completedCount = items.stream()
                .filter(Checklist.ChecklistItem::getCompleted)
                .count();

        checklist.setCompletedItems((int) completedCount);

        return checklistRepository.save(checklist);
    }

    @Transactional
    public void deleteChecklist(Long id) {
        Checklist checklist = getChecklistById(id);
        checklist.getItems().clear();
        checklistRepository.delete(checklist);
    }

    @Transactional
    public Checklist regenerateChecklist(Long checklistId) {
        log.info("Regenerating checklist with ID: {}", checklistId);
        
        Checklist existingChecklist = getChecklistById(checklistId);
        Long documentId = existingChecklist.getDocument().getId();
        
        deleteChecklist(checklistId);
        
        return generateChecklist(documentId);
    }

    @Transactional
    public Checklist updateChecklist(Long checklistId, Checklist updatedChecklist) {
        Checklist existingChecklist = getChecklistById(checklistId);
        existingChecklist.setGeneratedBy(updatedChecklist.getGeneratedBy());
        return checklistRepository.save(existingChecklist);
    }
}