package com.auditiq.controller;

import com.auditiq.dto.AnalysisResultDTO;
import com.auditiq.dto.DocumentUploadResponse;
import com.auditiq.model.AuditDocument;
import com.auditiq.service.AIAnalysisService;
import com.auditiq.service.DocumentManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller for Document Management (Upload, Store, Retrieve, Delete)
 */
@Slf4j
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentManagementController {

    private final DocumentManagementService documentService;
    private final AIAnalysisService aiAnalysisService;

    /**
     * Upload document to S3 and save to database
     */
    @PostMapping("/upload")
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("standard") String standard,
            @RequestParam(value = "uploadedBy", defaultValue = "system") String uploadedBy) {
        
        try {
            log.info("Upload request received: {} for standard: {}", file.getOriginalFilename(), standard);

            AuditDocument document = documentService.uploadDocument(file, standard, uploadedBy);
            
            DocumentUploadResponse response = DocumentUploadResponse.builder()
                    .id(document.getId())
                    .fileName(document.getFileName())
                    .fileType(document.getFileType())
                    .fileSize(document.getFileSize())
                    .s3Url(document.getS3Url())
                    .standard(document.getStandard().name())
                    .status(document.getStatus().name())
                    .uploadedBy(document.getUploadedBy())
                    .createdAt(document.getCreatedAt())
                    .message("Document uploaded successfully")
                    .build();
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Analyze a stored document by ID
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<AnalysisResultDTO> analyzeStoredDocument(@PathVariable Long id) {
        try {
            log.info("Analyzing stored document ID: {}", id);
            AnalysisResultDTO result = aiAnalysisService.analyzeStoredDocument(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error analyzing document {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get document by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuditDocument> getDocument(@PathVariable Long id) {
        try {
            AuditDocument document = documentService.getDocumentById(id);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            log.error("Error getting document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all documents
     */
    @GetMapping
    public ResponseEntity<List<AuditDocument>> getAllDocuments() {
        List<AuditDocument> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    /**
     * Get documents by standard
     */
    @GetMapping("/standard/{standard}")
    public ResponseEntity<List<AuditDocument>> getDocumentsByStandard(@PathVariable String standard) {
        try {
            List<AuditDocument> documents = documentService.getDocumentsByStandard(standard);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Error getting documents by standard: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get documents by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<AuditDocument>> getDocumentsByStatus(@PathVariable String status) {
        try {
            List<AuditDocument> documents = documentService.getDocumentsByStatus(status);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            log.error("Error getting documents by status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get recent documents
     */
    @GetMapping("/recent")
    public ResponseEntity<List<AuditDocument>> getRecentDocuments() {
        List<AuditDocument> documents = documentService.getRecentDocuments();
        return ResponseEntity.ok(documents);
    }

    /**
     * View document in browser (opens inline, not download)
     */
    @GetMapping("/{id}/view")
    public ResponseEntity<byte[]> viewDocument(@PathVariable Long id) {
        try {
            log.info("📄 Viewing document ID: {}", id);
            AuditDocument document = documentService.getDocumentById(id);
            byte[] fileContent = documentService.downloadDocument(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileContent);
        } catch (Exception e) {
            log.error("Error viewing document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Download document from S3 (forces download)
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        try {
            log.info("⬇️ Downloading document ID: {}", id);
            AuditDocument document = documentService.getDocumentById(id);
            byte[] fileContent = documentService.downloadDocument(id);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + document.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(fileContent);
        } catch (Exception e) {
            log.error("Error downloading document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete document
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        try {
            log.info("🗑️ Deleting document ID: {}", id);
            documentService.deleteDocument(id);
            log.info("✅ Document deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("❌ Error deleting document: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}