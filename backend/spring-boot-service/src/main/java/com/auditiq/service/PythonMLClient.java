package com.auditiq.service;

import com.auditiq.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PythonMLClient {

    private final RestTemplate restTemplate;

    @Value("${python.ml.service.url:http://localhost:5000}")
    private String pythonServiceUrl;

    public DocumentAnalysisResponse analyzeDocument(String text, String standard) {
        try {
            log.info("Analyzing document with standard: {}", standard);
            
            Map<String, Object> request = new HashMap<>();
            request.put("text", text);
            request.put("standard", standard);

            String url = pythonServiceUrl + "/api/analyze";
            DocumentAnalysisResponse response = restTemplate.postForObject(
                    url,
                    request,
                    DocumentAnalysisResponse.class
            );

            log.info("Document analysis completed successfully");
            return response;

        } catch (Exception e) {
            log.error("Error analyzing document: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to analyze document: " + e.getMessage(), e);
        }
    }

    public ChecklistResponse generateChecklist(String text, String standard) {
        try {
            log.info("Generating checklist for standard: {}", standard);
            
            Map<String, Object> request = new HashMap<>();
            request.put("text", text);
            request.put("standard", standard);

            String url = pythonServiceUrl + "/api/checklists/generate";
            ChecklistResponse response = restTemplate.postForObject(
                    url,
                    request,
                    ChecklistResponse.class
            );

            log.info("Checklist generation completed successfully");
            return response;

        } catch (Exception e) {
            log.error("Error generating checklist: {}", e.getMessage(), e);
            return createErrorChecklistResponse(e.getMessage());
        }
    }

    public GrammarCorrectionResponse correctGrammar(String text) {
        try {
            log.info("Correcting grammar for text of length: {}", text.length());
            
            GrammarCorrectionRequest request = new GrammarCorrectionRequest(text, "en", true);

            String url = pythonServiceUrl + "/api/grammar/correct";
            GrammarCorrectionResponse response = restTemplate.postForObject(
                    url,
                    request,
                    GrammarCorrectionResponse.class
            );

            log.info("Grammar correction completed successfully");
            return response;

        } catch (Exception e) {
            log.error("Error correcting grammar: {}", e.getMessage(), e);
            return createErrorGrammarResponse(text, e.getMessage());
        }
    }

    public RiskAssessmentResponse assessRisk(String text, String standard) {
        try {
            log.info("Assessing risk for standard: {}", standard);
            
            Map<String, Object> request = new HashMap<>();
            request.put("text", text);
            request.put("standard", standard);

            String url = pythonServiceUrl + "/api/risk/assess";
            RiskAssessmentResponse response = restTemplate.postForObject(
                    url,
                    request,
                    RiskAssessmentResponse.class
            );

            log.info("Risk assessment completed successfully");
            return response;

        } catch (Exception e) {
            log.error("Error assessing risk: {}", e.getMessage(), e);
            return createErrorRiskResponse(e.getMessage());
        }
    }

    public Map<String, Object> getServiceHealth() {
        try {
            String url = pythonServiceUrl + "/api/health";
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Python ML service is unavailable: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "unhealthy");
            errorResponse.put("error", e.getMessage());
            return errorResponse;
        }
    }

    private ChecklistResponse createErrorChecklistResponse(String error) {
        ChecklistResponse response = new ChecklistResponse();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }

    private RiskAssessmentResponse createErrorRiskResponse(String error) {
        RiskAssessmentResponse response = new RiskAssessmentResponse();
        response.setSuccess(false);
        response.setError(error);
        return response;
    }

    private GrammarCorrectionResponse createErrorGrammarResponse(String originalText, String error) {
        GrammarCorrectionResponse response = new GrammarCorrectionResponse();
        response.setSuccess(false);
        response.setOriginalText(originalText);
        response.setCorrectedText(originalText);
        response.setError(error);
        return response;
    }
}