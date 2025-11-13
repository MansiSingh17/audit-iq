package com.auditiq.service;

import com.auditiq.dto.GrammarCorrectionRequest;
import com.auditiq.dto.GrammarCorrectionResponse;
import com.auditiq.model.AuditDocument;
import com.auditiq.repository.AuditDocumentRepository;
import com.auditiq.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GrammarCorrectionService {

    private final PythonMLClient pythonMLClient;
    private final AuditDocumentRepository documentRepository;

    @Cacheable(value = "grammarCorrections", key = "#text.hashCode()")
    public GrammarCorrectionResponse correctText(String text) {
        log.info("Correcting grammar for text of length: {}", text.length());
        return pythonMLClient.correctGrammar(text);
    }

    public GrammarCorrectionResponse correctGrammar(String text) {
        return correctText(text);
    }

    public GrammarCorrectionResponse checkGrammar(String text) {
        return correctText(text);
    }

    public GrammarCorrectionResponse correctDocumentGrammar(Long documentId) {
        AuditDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));
        
        return correctText(document.getExtractedText());
    }

    public GrammarCorrectionResponse correctTextWithLanguage(String text, String language) {
        log.info("Correcting grammar for language: {}", language);
        return pythonMLClient.correctGrammar(text);
    }

    public List<GrammarCorrectionResponse> batchCorrect(List<String> texts) {
        log.info("Batch correcting {} texts", texts.size());
        List<GrammarCorrectionResponse> responses = new ArrayList<>();
        
        for (String text : texts) {
            responses.add(correctText(text));
        }
        
        return responses;
    }
}
