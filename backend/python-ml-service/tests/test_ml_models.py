"""
Tests for ML models
"""
import pytest
from app.models.checklist_generator import ChecklistGenerator
from app.models.risk_analyzer import RiskAnalyzer
from app.models.grammar_checker import GrammarChecker
from app.models.document_analyzer import DocumentAnalyzer

@pytest.fixture
def sample_text():
    """Sample text for testing"""
    return """
    This is a sample audit document. The company has implemented security policies.
    However, there are some gaps in access control and encryption. Password policies
    need to be strengthened. Regular security audits are not being conducted.
    """

@pytest.fixture
def checklist_generator():
    """Create checklist generator instance"""
    return ChecklistGenerator()

@pytest.fixture
def risk_analyzer():
    """Create risk analyzer instance"""
    return RiskAnalyzer()

@pytest.fixture
def grammar_checker():
    """Create grammar checker instance"""
    return GrammarChecker()

@pytest.fixture
def document_analyzer():
    """Create document analyzer instance"""
    return DocumentAnalyzer()

class TestChecklistGenerator:
    """Test ChecklistGenerator class"""
    
    def test_generate_checklist_iso27001(self, checklist_generator, sample_text):
        """Test checklist generation for ISO 27001"""
        result = checklist_generator.generate(sample_text, 'ISO_27001')
        
        assert result['success'] is True
        assert result['standard'] == 'ISO_27001'
        assert 'items' in result
        assert len(result['items']) > 0
        assert 'statistics' in result
    
    def test_generate_checklist_gdpr(self, checklist_generator, sample_text):
        """Test checklist generation for GDPR"""
        result = checklist_generator.generate(sample_text, 'GDPR')
        
        assert result['success'] is True
        assert result['standard'] == 'GDPR'
        assert len(result['items']) > 0
    
    def test_checklist_item_structure(self, checklist_generator, sample_text):
        """Test structure of checklist items"""
        result = checklist_generator.generate(sample_text, 'ISO_27001')
        
        item = result['items'][0]
        assert 'id' in item
        assert 'requirement' in item
        assert 'description' in item
        assert 'category' in item
        assert 'priority' in item
        assert 'status' in item

class TestRiskAnalyzer:
    """Test RiskAnalyzer class"""
    
    def test_analyze_risk_iso27001(self, risk_analyzer):
        """Test risk analysis for ISO 27001"""
        text = "No encryption. Weak passwords. Unauthorized access."
        result = risk_analyzer.analyze(text, 'ISO_27001')
        
        assert result['success'] is True
        assert result['standard'] == 'ISO_27001'
        assert 'overall_risk_score' in result
        assert 'findings' in result
        assert len(result['findings']) > 0
    
    def test_risk_severity_levels(self, risk_analyzer):
        """Test risk severity classification"""
        text = "Missing encryption and no backup system."
        result = risk_analyzer.analyze(text, 'ISO_27001')
        
        # Check that findings have severity levels
        for finding in result['findings']:
            assert 'severity' in finding
            assert finding['severity'] in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
    
    def test_risk_recommendations(self, risk_analyzer):
        """Test risk recommendations"""
        text = "No security policies documented."
        result = risk_analyzer.analyze(text, 'ISO_27001')
        
        assert 'recommendations' in result
        assert len(result['recommendations']) > 0

class TestGrammarChecker:
    """Test GrammarChecker class"""
    
    def test_correct_grammar(self, grammar_checker):
        """Test grammar correction"""
        text = "This are a test sentance with errors."
        result = grammar_checker.correct(text)
        
        assert result['success'] is True
        assert 'original_text' in result
        assert 'corrected_text' in result
        assert 'corrections' in result
    
    def test_no_errors(self, grammar_checker):
        """Test text with no errors"""
        text = "This is a correctly written sentence."
        result = grammar_checker.correct(text)
        
        assert result['success'] is True
        assert result['original_text'] == text

class TestDocumentAnalyzer:
    """Test DocumentAnalyzer class"""
    
    def test_summarize_text(self, document_analyzer):
        """Test text summarization"""
        text = "This is a long document. " * 100
        result = document_analyzer.summarize(text)
        
        assert result['success'] is True
        assert 'summary' in result
        assert len(result['summary']) < len(text)
    
    def test_summarization_compression(self, document_analyzer):
        """Test that summary is shorter than original"""
        text = "Sample text for summarization. " * 50
        result = document_analyzer.summarize(text)
        
        assert result['compression_ratio'] < 1.0

@pytest.mark.slow
class TestModelPerformance:
    """Performance tests for ML models"""
    
    def test_checklist_generation_time(self, checklist_generator, sample_text):
        """Test checklist generation performance"""
        import time
        
        start = time.time()
        result = checklist_generator.generate(sample_text, 'ISO_27001')
        elapsed = time.time() - start
        
        assert result['success'] is True
        assert elapsed < 15.0  # Should complete within 15 seconds
    
    def test_risk_analysis_time(self, risk_analyzer, sample_text):
        """Test risk analysis performance"""
        import time
        
        start = time.time()
        result = risk_analyzer.analyze(sample_text, 'ISO_27001')
        elapsed = time.time() - start
        
        assert result['success'] is True
        assert elapsed < 10.0  # Should complete within 10 seconds