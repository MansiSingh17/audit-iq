package com.auditiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentUploadResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String s3Url;
    private String standard;
    private String status;
    private String uploadedBy;
    private LocalDateTime createdAt;
    private String message;
}
