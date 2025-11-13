package com.auditiq.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
@Slf4j
public class ClaudeService {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url:https://api.anthropic.com/v1/messages}")
    private String apiUrl;

    @Value("${claude.model:claude-sonnet-4-20250514}")
    private String model;

    @Value("${claude.max.tokens:4096}")
    private int maxTokens;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ClaudeService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Analyze document for audit findings
     */
    public String analyzeDocument(String documentText, String framework) {
        try {
            String prompt = buildAuditPrompt(documentText, framework);
            return callClaudeAPI(prompt);
        } catch (Exception e) {
            log.error("Error analyzing document with Claude", e);
            throw new RuntimeException("Failed to analyze document: " + e.getMessage());
        }
    }

    /**
     * Generate remediation guidance
     */
    public String generateRemediationGuidance(String findingDescription, String documentContext) {
        try {
            String prompt = buildRemediationPrompt(findingDescription, documentContext);
            return callClaudeAPI(prompt);
        } catch (Exception e) {
            log.error("Error generating remediation guidance", e);
            throw new RuntimeException("Failed to generate remediation: " + e.getMessage());
        }
    }

    /**
     * Chat conversation
     */
    public String chat(String message, String conversationHistory) {
        try {
            String prompt = buildChatPrompt(message, conversationHistory);
            return callClaudeAPI(prompt);
        } catch (Exception e) {
            log.error("Error in chat conversation", e);
            throw new RuntimeException("Failed to process chat: " + e.getMessage());
        }
    }

    /**
     * Chat with message list (for ChatService compatibility)
     */
    public String chat(List<ChatMessage> messages) {
        try {
            // Convert ChatMessage list to conversation history
            StringBuilder history = new StringBuilder();
            for (ChatMessage msg : messages) {
                history.append(msg.getRole()).append(": ").append(msg.getContent()).append("\n");
            }
            
            // Get the last user message
            String lastMessage = messages.isEmpty() ? "" : 
                messages.get(messages.size() - 1).getContent();
            
            return chat(lastMessage, history.toString());
        } catch (Exception e) {
            log.error("Error in chat conversation with messages", e);
            throw new RuntimeException("Failed to process chat: " + e.getMessage());
        }
    }

    /**
     * Generate policy document
     */
    public String generatePolicy(String policyType, String requirements) {
        try {
            String prompt = buildPolicyPrompt(policyType, requirements);
            return callClaudeAPI(prompt);
        } catch (Exception e) {
            log.error("Error generating policy", e);
            throw new RuntimeException("Failed to generate policy: " + e.getMessage());
        }
    }

    /**
     * Analyze finding for remediation (for ChatService compatibility)
     */
    public String analyzeFinding(String findingDescription, String documentContext) {
        return generateRemediationGuidance(findingDescription, documentContext);
    }

    /**
     * Improve policy document (for ChatService compatibility)
     */
    public String improvePolicy(String policyText, String improvementGoals) {
        try {
            String prompt = String.format("""
                You are a policy improvement expert. Review and enhance the following policy document.
                
                Current Policy:
                %s
                
                Improvement Goals:
                %s
                
                Provide an improved version that:
                1. Enhances clarity and professionalism
                2. Strengthens compliance alignment
                3. Adds missing elements
                4. Improves audit readiness
                
                Return the improved policy in a professional format.
                """, policyText, improvementGoals);
            
            return callClaudeAPI(prompt);
        } catch (Exception e) {
            log.error("Error improving policy", e);
            throw new RuntimeException("Failed to improve policy: " + e.getMessage());
        }
    }

    /**
     * Build audit analysis prompt - CRITICAL: Structured JSON output
     */
    private String buildAuditPrompt(String documentText, String framework) {
        return String.format("""
            You are an expert compliance auditor specializing in %s. Analyze the following document and provide audit findings in STRICT JSON format.
            
            CRITICAL INSTRUCTIONS:
            1. Return ONLY valid JSON - no markdown, no explanations, no preamble
            2. Each finding must be a complete, actionable item
            3. Do NOT split findings into fragments
            
            Required JSON structure:
            {
              "findings": [
                {
                  "title": "Clear, concise finding title (50 chars max)",
                  "description": "Detailed description of the gap or issue",
                  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
                  "impactScore": 1-10,
                  "evidence": "Specific evidence from the document",
                  "affectedControls": ["Control A.1", "Control A.2"],
                  "remediationSteps": [
                    "Step 1: Specific action",
                    "Step 2: Next action"
                  ],
                  "recommendedTimeline": "Timeline for remediation",
                  "bestPractices": "Industry best practices"
                }
              ],
              "executiveSummary": "Brief summary of findings"
            }
            
            Document to analyze:
            %s
            
            Framework: %s
            
            Return ONLY the JSON object. No additional text.
            """, framework, documentText, framework);
    }

    /**
     * Build remediation guidance prompt
     */
    private String buildRemediationPrompt(String findingDescription, String documentContext) {
        return String.format("""
            You are a compliance remediation expert. Provide detailed, actionable guidance for addressing this audit finding.
            
            Finding:
            %s
            
            Document Context:
            %s
            
            Provide:
            1. Root cause analysis
            2. Step-by-step remediation plan
            3. Resource requirements
            4. Timeline estimates
            5. Success metrics
            6. Best practices to prevent recurrence
            
            Be specific and actionable.
            """, findingDescription, documentContext);
    }

    /**
     * Build chat prompt
     */
    private String buildChatPrompt(String message, String conversationHistory) {
        return String.format("""
            You are Audit-IQ Assistant, an expert in compliance, audit, and information security.
            
            Conversation History:
            %s
            
            User: %s
            
            Provide helpful, accurate, and professional guidance. If discussing specific regulations or standards, cite them appropriately.
            """, conversationHistory != null ? conversationHistory : "None", message);
    }

    /**
     * Build policy generation prompt
     */
    private String buildPolicyPrompt(String policyType, String requirements) {
        return String.format("""
            You are a policy development expert. Create a professional, audit-ready %s policy document.
            
            Requirements:
            %s
            
            The policy should include:
            1. Purpose and Scope
            2. Policy Statement
            3. Roles and Responsibilities
            4. Procedures
            5. Compliance and Enforcement
            6. Review and Updates
            
            Format the policy professionally with clear sections and numbering.
            """, policyType, requirements);
    }

    /**
     * Call Claude API with proper error handling
     */
    private String callClaudeAPI(String prompt) {
        try {
            // Build request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            log.info("Calling Claude API...");
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );

            // Parse response
            JsonNode responseJson = objectMapper.readTree(response.getBody());
            JsonNode contentArray = responseJson.get("content");
            
            if (contentArray != null && contentArray.isArray() && contentArray.size() > 0) {
                String fullResponse = contentArray.get(0).get("text").asText();
                log.info("Claude API response received: {} characters", fullResponse.length());
                return fullResponse;
            }

            throw new RuntimeException("Invalid response format from Claude API");

        } catch (Exception e) {
            log.error("Error calling Claude API", e);
            throw new RuntimeException("Claude API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Parse Claude's JSON response into structured findings
     */
    public List<Map<String, Object>> parseAuditFindings(String claudeResponse) {
        try {
            // Clean the response - remove markdown code blocks if present
            String cleanResponse = claudeResponse.trim();
            if (cleanResponse.startsWith("```json")) {
                cleanResponse = cleanResponse.substring(7);
            }
            if (cleanResponse.startsWith("```")) {
                cleanResponse = cleanResponse.substring(3);
            }
            if (cleanResponse.endsWith("```")) {
                cleanResponse = cleanResponse.substring(0, cleanResponse.length() - 3);
            }
            cleanResponse = cleanResponse.trim();

            // Parse JSON
            JsonNode rootNode = objectMapper.readTree(cleanResponse);
            JsonNode findingsNode = rootNode.get("findings");
            
            if (findingsNode == null || !findingsNode.isArray()) {
                log.warn("No findings array in response, returning empty list");
                return Collections.emptyList();
            }

            List<Map<String, Object>> findings = new ArrayList<>();
            
            for (JsonNode findingNode : findingsNode) {
                Map<String, Object> finding = new HashMap<>();
                
                finding.put("title", getTextValue(findingNode, "title"));
                finding.put("description", getTextValue(findingNode, "description"));
                finding.put("severity", getTextValue(findingNode, "severity"));
                finding.put("impactScore", findingNode.has("impactScore") ? findingNode.get("impactScore").asInt() : 5);
                finding.put("evidence", getTextValue(findingNode, "evidence"));
                finding.put("recommendedTimeline", getTextValue(findingNode, "recommendedTimeline"));
                finding.put("bestPractices", getTextValue(findingNode, "bestPractices"));
                
                // Parse arrays
                finding.put("affectedControls", parseArrayField(findingNode, "affectedControls"));
                finding.put("remediationSteps", parseArrayField(findingNode, "remediationSteps"));
                
                findings.add(finding);
            }

            log.info("Successfully parsed {} findings", findings.size());
            return findings;

        } catch (Exception e) {
            log.error("Error parsing Claude response as JSON", e);
            // Fallback: return single finding with full response
            return List.of(Map.of(
                "title", "Analysis Complete",
                "description", claudeResponse,
                "severity", "MEDIUM",
                "impactScore", 5
            ));
        }
    }

    private String getTextValue(JsonNode node, String fieldName) {
        return node.has(fieldName) ? node.get(fieldName).asText() : "";
    }

    private List<String> parseArrayField(JsonNode node, String fieldName) {
        List<String> result = new ArrayList<>();
        if (node.has(fieldName) && node.get(fieldName).isArray()) {
            node.get(fieldName).forEach(item -> result.add(item.asText()));
        }
        return result;
    }

    /**
     * Inner class for chat messages (ChatService compatibility)
     */
    public static class ChatMessage {
        private String role;
        private String content;

        public ChatMessage() {}

        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}