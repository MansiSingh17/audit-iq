package com.auditiq.service;

import com.auditiq.model.AuditDocument;
import com.auditiq.repository.AuditDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentManagementService {

    private final AuditDocumentRepository documentRepository;
    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    /**
     * Upload document to S3 and save metadata to database
     */
    public AuditDocument uploadDocument(MultipartFile file, String standard, String uploadedBy) {
        try {
            log.info("Uploading document: {} for standard: {}", file.getOriginalFilename(), standard);

            // Generate unique file name
            String fileName = file.getOriginalFilename();
            String fileExtension = fileName.substring(fileName.lastIndexOf("."));
            String s3Key = "documents/" + UUID.randomUUID() + fileExtension;

            // Upload to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String s3Url = String.format("https://%s.s3.amazonaws.com/%s", bucketName, s3Key);

            // Extract text from document for analysis - FIXED!
            String extractedText = extractTextFromFile(file);

            // Create database record
            AuditDocument document = new AuditDocument();
            document.setFileName(fileName);
            document.setFileType(file.getContentType());
            document.setFileSize(file.getSize());
            document.setS3Key(s3Key);
            document.setS3Url(s3Url);
            document.setStandard(AuditDocument.ComplianceStandard.valueOf(standard.toUpperCase().replace(" ", "_")));
            document.setStatus(AuditDocument.ProcessingStatus.UPLOADED);
            document.setUploadedBy(uploadedBy);
            document.setExtractedText(extractedText);
            document.setCreatedAt(LocalDateTime.now());
            document.setUpdatedAt(LocalDateTime.now());

            AuditDocument savedDocument = documentRepository.save(document);
            log.info("Document uploaded successfully with ID: {}", savedDocument.getId());
            log.info("Extracted text length: {} characters", extractedText != null ? extractedText.length() : 0);

            return savedDocument;

        } catch (IOException e) {
            log.error("Error uploading document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }

    /**
     * Get document by ID
     */
    public AuditDocument getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    /**
     * Get all documents
     */
    public List<AuditDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    /**
     * Get documents by standard
     */
    public List<AuditDocument> getDocumentsByStandard(String standard) {
        AuditDocument.ComplianceStandard complianceStandard = AuditDocument.ComplianceStandard
                .valueOf(standard.toUpperCase().replace(" ", "_"));
        return documentRepository.findByStandard(complianceStandard);
    }

    /**
     * Get documents by status
     */
    public List<AuditDocument> getDocumentsByStatus(String status) {
        AuditDocument.ProcessingStatus processingStatus = AuditDocument.ProcessingStatus.valueOf(status.toUpperCase());
        return documentRepository.findByStatus(processingStatus);
    }

    /**
     * Get recent documents (last 10)
     */
    public List<AuditDocument> getRecentDocuments() {
        return documentRepository.findTop10ByOrderByCreatedAtDesc();
    }

    /**
     * Download document from S3
     */
    public byte[] downloadDocument(Long id) {
        try {
            AuditDocument document = getDocumentById(id);

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(document.getS3Key())
                    .build();

            byte[] fileContent = s3Client.getObjectAsBytes(getObjectRequest).asByteArray();
            log.info("Document downloaded successfully: {}", document.getFileName());

            return fileContent;

        } catch (Exception e) {
            log.error("Error downloading document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to download document: " + e.getMessage());
        }
    }

    /**
     * Delete document from S3 and database - ENHANCED ERROR HANDLING
     */
    public void deleteDocument(Long id) {
        AuditDocument document = null;
        try {
            log.info("🗑️ Attempting to delete document with ID: {}", id);
            
            // Get document first
            document = getDocumentById(id);
            log.info("📄 Found document: {} (S3 Key: {})", document.getFileName(), document.getS3Key());

            // Delete from S3
            try {
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(document.getS3Key())
                        .build();

                s3Client.deleteObject(deleteObjectRequest);
                log.info("✅ Deleted from S3: {}", document.getS3Key());
            } catch (Exception s3Error) {
                log.warn("⚠️ S3 deletion failed (continuing anyway): {}", s3Error.getMessage());
                // Continue to delete from database even if S3 fails
            }

            // Delete from database
            documentRepository.deleteById(id);
            log.info("✅ Document deleted successfully from database: {}", document.getFileName());

        } catch (Exception e) {
            log.error("❌ Error deleting document ID {}: {}", id, e.getMessage(), e);
            if (document != null) {
                log.error("Document details - Name: {}, S3 Key: {}", document.getFileName(), document.getS3Key());
            }
            throw new RuntimeException("Failed to delete document: " + e.getMessage());
        }
    }

    /**
     * Update document status
     */
    public AuditDocument updateDocumentStatus(Long id, AuditDocument.ProcessingStatus status) {
        AuditDocument document = getDocumentById(id);
        document.setStatus(status);
        document.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    /**
     * Extract text from uploaded file - FIXED TO USE APACHE PDFBOX!
     */
    private String extractTextFromFile(MultipartFile file) {
        try {
            String fileType = file.getContentType();
            log.info("Extracting text from file type: {}", fileType);

            // Handle PDF files with Apache PDFBox
            if ("application/pdf".equalsIgnoreCase(fileType) || 
                file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                
                return extractTextFromPDF(file);
            }
            
            // Handle text files
            if (fileType != null && fileType.startsWith("text/")) {
                byte[] bytes = file.getBytes();
                String text = new String(bytes, "UTF-8");
                log.info("Extracted {} characters from text file", text.length());
                return text;
            }
            
            // For other file types, return empty string
            log.warn("Unsupported file type for text extraction: {}", fileType);
            return "Text extraction not supported for file type: " + fileType;

        } catch (Exception e) {
            log.error("Could not extract text from file: {}", e.getMessage(), e);
            return "Error extracting text: " + e.getMessage();
        }
    }

    /**
     * Extract text from PDF using Apache PDFBox
     */
    private String extractTextFromPDF(MultipartFile file) {
        PDDocument document = null;
        try {
            log.info("Loading PDF document: {}", file.getOriginalFilename());
            
            // Load PDF document
            document = org.apache.pdfbox.Loader.loadPDF(file.getBytes());
            
            // Create PDF text stripper
            PDFTextStripper stripper = new PDFTextStripper();
            
            // Extract text from all pages
            String text = stripper.getText(document);
            
            log.info("✅ Successfully extracted {} characters from PDF ({} pages)", 
                    text.length(), document.getNumberOfPages());
            
            return text;

        } catch (IOException e) {
            log.error("❌ Error extracting text from PDF: {}", e.getMessage(), e);
            return "Error extracting PDF text: " + e.getMessage();
        } finally {
            // Always close the document
            if (document != null) {
                try {
                    document.close();
                } catch (IOException e) {
                    log.warn("Error closing PDF document: {}", e.getMessage());
                }
            }
        }
    }
}