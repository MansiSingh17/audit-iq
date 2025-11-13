package com.auditiq.controller;

import com.auditiq.model.Checklist;
import com.auditiq.service.ChecklistGenerationService;
import com.auditiq.service.ChecklistTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/checklists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChecklistController {

    private final ChecklistGenerationService checklistService;
    private final ChecklistTemplateService templateService;

    @PostMapping("/generate-template")
    public ResponseEntity<Resource> generateTemplate(@RequestBody Map<String, String> request) {
        try {
            String standard = request.get("standard");
            String format = request.get("format");
            
            log.info("Generating template for standard: {}, format: {}", standard, format);

            if (standard == null || format == null) {
                throw new IllegalArgumentException("Standard and format are required");
            }

            byte[] fileContent;
            String filename;
            MediaType mediaType;

            if ("EXCEL".equalsIgnoreCase(format)) {
                fileContent = templateService.generateExcelTemplate(standard);
                filename = standard + "_Checklist.xlsx";
                mediaType = MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            } else if ("PDF".equalsIgnoreCase(format)) {
                fileContent = templateService.generatePdfTemplate(standard);
                filename = standard + "_Checklist.pdf";
                mediaType = MediaType.APPLICATION_PDF;
            } else {
                throw new IllegalArgumentException("Invalid format. Use EXCEL or PDF");
            }

            ByteArrayResource resource = new ByteArrayResource(fileContent);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(mediaType)
                    .contentLength(fileContent.length)
                    .body(resource);

        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error generating template: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/generate/{documentId}")
    public ResponseEntity<Checklist> generateChecklist(@PathVariable Long documentId) {
        try {
            log.info("Generating checklist for document ID: {}", documentId);
            Checklist checklist = checklistService.generateChecklist(documentId);
            return ResponseEntity.ok(checklist);
        } catch (Exception e) {
            log.error("Error generating checklist for document {}: {}", documentId, e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Checklist> getChecklist(@PathVariable Long id) {
        Checklist checklist = checklistService.getChecklistById(id);
        return ResponseEntity.ok(checklist);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<Checklist>> getChecklistsByDocument(@PathVariable Long documentId) {
        List<Checklist> checklists = checklistService.getChecklistsByDocumentId(documentId);
        return ResponseEntity.ok(checklists);
    }

    @GetMapping
    public ResponseEntity<List<Checklist>> getAllChecklists() {
        List<Checklist> checklists = checklistService.getAllChecklists();
        return ResponseEntity.ok(checklists);
    }

    @PutMapping("/{checklistId}/items/{itemNumber}")
    public ResponseEntity<Checklist> updateChecklistItem(
            @PathVariable Long checklistId,
            @PathVariable Integer itemNumber,
            @RequestParam Boolean completed) {
        try {
            Checklist checklist = checklistService.updateChecklistItemStatus(checklistId, itemNumber, completed);
            log.info("Updated checklist {} item {}", checklistId, itemNumber);
            return ResponseEntity.ok(checklist);
        } catch (Exception e) {
            log.error("Error updating checklist item: {}", e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChecklist(@PathVariable Long id) {
        checklistService.deleteChecklist(id);
        return ResponseEntity.noContent().build();
    }
}