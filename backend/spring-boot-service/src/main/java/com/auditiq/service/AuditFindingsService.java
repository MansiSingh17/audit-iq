package com.auditiq.service;

import com.auditiq.dto.AuditFindingDTO;
import com.auditiq.dto.RemediationStepDTO;
import com.auditiq.dto.SeverityDTO;
import com.auditiq.model.ComplianceDocument;
import com.auditiq.repository.ComplianceDocumentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuditFindingsService {

    @Autowired
    private ComplianceDocumentRepository documentRepository;

    @Autowired
    private ClaudeService claudeService;

    /**
     * Generate audit findings for a document using Claude AI
     */
    @Transactional
    public AuditFindingDTO generateFindings(Long documentId, String framework) {
        log.info("Generating audit findings for document ID: {} with framework: {}", documentId, framework);

        // 1. Fetch document
        ComplianceDocument document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));

        // 2. Get document text content
        String documentText = document.getTextContent();
        if (documentText == null || documentText.trim().isEmpty()) {
            throw new RuntimeException("Document has no extractable text content");
        }

        // 3. Call Claude API for analysis
        log.info("Calling Claude API to analyze {} characters of text", documentText.length());
        String claudeResponse = claudeService.analyzeDocument(documentText, framework);

        // 4. Parse Claude's JSON response into structured findings
        List<Map<String, Object>> parsedFindings = claudeService.parseAuditFindings(claudeResponse);
        
        log.info("Parsed {} findings from Claude response", parsedFindings.size());

        // 5. Convert to DTOs
        List<AuditFindingDTO.Finding> findings = parsedFindings.stream()
            .map(this::convertToFindingDTO)
            .collect(Collectors.toList());

        // 6. Calculate summary statistics
        Map<String, Long> severityCounts = findings.stream()
            .collect(Collectors.groupingBy(
                f -> f.getSeverity().getLevel(),
                Collectors.counting()
            ));

        int criticalCount = severityCounts.getOrDefault("CRITICAL", 0L).intValue();
        int highCount = severityCounts.getOrDefault("HIGH", 0L).intValue();
        int mediumCount = severityCounts.getOrDefault("MEDIUM", 0L).intValue();
        int lowCount = severityCounts.getOrDefault("LOW", 0L).intValue();

        // 7. Generate executive summary
        String executiveSummary = generateExecutiveSummary(
            findings.size(), criticalCount, highCount, mediumCount, lowCount, findings
        );

        // 8. Build response DTO
        AuditFindingDTO response = new AuditFindingDTO();
        response.setDocumentId(documentId);
        response.setDocumentName(document.getFileName());
        response.setComplianceFramework(framework);
        response.setFindings(findings);
        response.setTotalFindings(findings.size());
        response.setCriticalCount(criticalCount);
        response.setHighCount(highCount);
        response.setMediumCount(mediumCount);
        response.setLowCount(lowCount);
        response.setTotalHighPriority(criticalCount + highCount);
        response.setExecutiveSummary(executiveSummary);
        response.setGeneratedAt(LocalDateTime.now());
        response.setCompliancePercentage(calculateCompliancePercentage(findings));
        response.setRiskSummary(generateRiskSummary(criticalCount, highCount));

        log.info("Successfully generated {} findings: {} critical, {} high, {} medium, {} low",
            findings.size(), criticalCount, highCount, mediumCount, lowCount);

        return response;
    }

    /**
     * Convert parsed finding map to DTO
     */
    private AuditFindingDTO.Finding convertToFindingDTO(Map<String, Object> parsedFinding) {
        AuditFindingDTO.Finding finding = new AuditFindingDTO.Finding();
        
        finding.setTitle((String) parsedFinding.get("title"));
        finding.setDescription((String) parsedFinding.get("description"));
        finding.setEvidence((String) parsedFinding.getOrDefault("evidence", ""));
        finding.setRecommendedTimeline((String) parsedFinding.getOrDefault("recommendedTimeline", "30 days"));
        finding.setBestPractices((String) parsedFinding.getOrDefault("bestPractices", ""));
        
        // Severity
        String severityLevel = (String) parsedFinding.getOrDefault("severity", "MEDIUM");
        Integer impactScore = (Integer) parsedFinding.getOrDefault("impactScore", 5);
        finding.setSeverity(mapSeverity(severityLevel, impactScore));
        finding.setImpactScore(impactScore);
        finding.setSeverityString(severityLevel);
        
        // Arrays
        @SuppressWarnings("unchecked")
        List<String> affectedControls = (List<String>) parsedFinding.getOrDefault("affectedControls", Collections.emptyList());
        finding.setAffectedControls(affectedControls);
        
        @SuppressWarnings("unchecked")
        List<String> remediationStepsList = (List<String>) parsedFinding.getOrDefault("remediationSteps", Collections.emptyList());
        finding.setRemediationSteps(convertRemediationSteps(remediationStepsList));
        
        return finding;
    }

    /**
     * Convert remediation steps list to DTO objects
     */
    private List<RemediationStepDTO> convertRemediationSteps(List<String> steps) {
        List<RemediationStepDTO> dtoSteps = new ArrayList<>();
        for (int i = 0; i < steps.size(); i++) {
            RemediationStepDTO step = new RemediationStepDTO();
            step.setStepNumber(i + 1);
            step.setAction(steps.get(i));
            step.setStatus("PENDING");
            dtoSteps.add(step);
        }
        return dtoSteps;
    }

    /**
     * Map severity level to detailed severity DTO
     */
    private SeverityDTO mapSeverity(String level, Integer impactScore) {
        return switch (level.toUpperCase()) {
            case "CRITICAL" -> new SeverityDTO(
                "CRITICAL",
                impactScore != null ? impactScore : 9,
                "24 hours",
                "Severe - Immediate business risk",
                "Critical system vulnerability",
                "#DC2626"
            );
            case "HIGH" -> new SeverityDTO(
                "HIGH",
                impactScore != null ? impactScore : 7,
                "7 days",
                "High - Significant risk",
                "Major security concern",
                "#F59E0B"
            );
            case "MEDIUM" -> new SeverityDTO(
                "MEDIUM",
                impactScore != null ? impactScore : 5,
                "30 days",
                "Moderate - Requires attention",
                "Notable security gap",
                "#3B82F6"
            );
            case "LOW" -> new SeverityDTO(
                "LOW",
                impactScore != null ? impactScore : 3,
                "90 days",
                "Low - Improvement opportunity",
                "Minor enhancement needed",
                "#10B981"
            );
            default -> new SeverityDTO(
                "MEDIUM",
                5,
                "30 days",
                "Moderate - Requires attention",
                "Notable security gap",
                "#3B82F6"
            );
        };
    }

    /**
     * Generate executive summary
     */
    private String generateExecutiveSummary(int total, int critical, int high, int medium, int low, 
                                           List<AuditFindingDTO.Finding> findings) {
        StringBuilder summary = new StringBuilder();
        summary.append(String.format("Compliance Assessment Summary\n\n"));
        summary.append(String.format("Total Findings: %d\n", total));
        summary.append(String.format("- Critical: %d (immediate action required)\n", critical));
        summary.append(String.format("- High: %d (urgent attention needed)\n", high));
        summary.append(String.format("- Medium: %d (plan remediation)\n", medium));
        summary.append(String.format("- Low: %d (improvement opportunities)\n\n", low));

        if (critical > 0) {
            summary.append(String.format("⚠️ IMMEDIATE ACTION REQUIRED: %d critical finding(s) pose significant compliance and security risks.\n\n", critical));
            summary.append("Critical Findings:\n");
            findings.stream()
                .filter(f -> "CRITICAL".equals(f.getSeverity().getLevel()))
                .limit(3)
                .forEach(f -> summary.append(String.format("- %s\n", f.getTitle())));
        }

        return summary.toString();
    }

    /**
     * Generate risk summary
     */
    private String generateRiskSummary(int critical, int high) {
        if (critical > 0) {
            return String.format("Critical Risk: %d critical findings require immediate attention", critical);
        } else if (high > 0) {
            return String.format("High Risk: %d high-priority findings need urgent remediation", high);
        } else {
            return "Moderate Risk: Focus on medium-priority improvements";
        }
    }

    /**
     * Calculate compliance percentage
     */
    private double calculateCompliancePercentage(List<AuditFindingDTO.Finding> findings) {
        if (findings.isEmpty()) {
            return 100.0;
        }

        long criticalCount = findings.stream()
            .filter(f -> "CRITICAL".equals(f.getSeverity().getLevel()))
            .count();

        long highCount = findings.stream()
            .filter(f -> "HIGH".equals(f.getSeverity().getLevel()))
            .count();

        // Simple calculation: each critical = -10%, each high = -5%
        double penalty = (criticalCount * 10) + (highCount * 5);
        return Math.max(0, 100 - penalty);
    }

    /**
     * Generate remediation guidance for a specific finding
     */
    public String generateRemediationGuidance(Long documentId, String findingDescription) {
        log.info("Generating remediation guidance for document: {}", documentId);

        ComplianceDocument document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));

        String documentContext = document.getTextContent();
        
        return claudeService.generateRemediationGuidance(findingDescription, documentContext);
    }

    /**
     * Get remediation guidance (overloaded for controller compatibility)
     */
    public String getRemediationGuidance(Long documentId, String findingDescription) {
        return generateRemediationGuidance(documentId, findingDescription);
    }

    /**
     * Generate findings from text (for paste text mode in controller)
     */
    public AuditFindingDTO generateFindingsFromText(String documentText, String framework, String fileName) {
        log.info("Generating findings from text: {} characters, framework: {}", documentText.length(), framework);

        // Call Claude API for analysis
        String claudeResponse = claudeService.analyzeDocument(documentText, framework);

        // Parse Claude's JSON response
        List<Map<String, Object>> parsedFindings = claudeService.parseAuditFindings(claudeResponse);
        
        // Convert to DTOs
        List<AuditFindingDTO.Finding> findings = parsedFindings.stream()
            .map(this::convertToFindingDTO)
            .collect(Collectors.toList());

        // Calculate summary statistics
        Map<String, Long> severityCounts = findings.stream()
            .collect(Collectors.groupingBy(
                f -> f.getSeverity().getLevel(),
                Collectors.counting()
            ));

        int criticalCount = severityCounts.getOrDefault("CRITICAL", 0L).intValue();
        int highCount = severityCounts.getOrDefault("HIGH", 0L).intValue();
        int mediumCount = severityCounts.getOrDefault("MEDIUM", 0L).intValue();
        int lowCount = severityCounts.getOrDefault("LOW", 0L).intValue();

        // Generate executive summary
        String executiveSummary = generateExecutiveSummary(
            findings.size(), criticalCount, highCount, mediumCount, lowCount, findings
        );

        // Build response DTO
        AuditFindingDTO response = new AuditFindingDTO();
        response.setDocumentName(fileName != null ? fileName : "Pasted Text");
        response.setComplianceFramework(framework);
        response.setFindings(findings);
        response.setTotalFindings(findings.size());
        response.setCriticalCount(criticalCount);
        response.setHighCount(highCount);
        response.setMediumCount(mediumCount);
        response.setLowCount(lowCount);
        response.setTotalHighPriority(criticalCount + highCount);
        response.setExecutiveSummary(executiveSummary);
        response.setGeneratedAt(LocalDateTime.now());
        response.setCompliancePercentage(calculateCompliancePercentage(findings));
        response.setRiskSummary(generateRiskSummary(criticalCount, highCount));

        return response;
    }
}