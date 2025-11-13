"""
Tests for utility functions
"""
import pytest
from app.utils.text_processor import TextProcessor
from app.utils.cache_manager import CacheManager
from app.utils import hash_text, validate_text_input, create_success_response, create_error_response

class TestTextProcessor:
    """Test TextProcessor class"""
    
    def test_clean_text(self):
        """Test text cleaning"""
        text = "  This   is   a   test  "
        result = TextProcessor.clean_text(text)
        assert result == "This is a test"
    
    def test_split_into_sentences(self):
        """Test sentence splitting"""
        text = "First sentence. Second sentence! Third sentence?"
        sentences = TextProcessor.split_into_sentences(text)
        assert len(sentences) == 3
    
    def test_split_into_chunks(self):
        """Test text chunking"""
        text = " ".join(["word"] * 100)
        chunks = TextProcessor.split_into_chunks(text, max_length=50)
        assert len(chunks) > 1
        assert all(len(chunk) <= 50 for chunk in chunks)
    
    def test_extract_keywords(self):
        """Test keyword extraction"""
        text = "security security policy policy access control control"
        keywords = TextProcessor.extract_keywords(text, top_n=3)
        assert len(keywords) <= 3
        assert 'security' in keywords or 'policy' in keywords
    
    def test_calculate_readability_score(self):
        """Test readability calculation"""
        text = "This is a simple sentence. This is another one."
        scores = TextProcessor.calculate_readability_score(text)
        assert 'avg_sentence_length' in scores
        assert 'avg_word_length' in scores
        assert 'complexity_score' in scores
    
    def test_truncate_text(self):
        """Test text truncation"""
        text = "This is a long text that needs to be truncated"
        result = TextProcessor.truncate_text(text, max_length=20)
        assert len(result) <= 20
        assert result.endswith("...")
    
    def test_count_words(self):
        """Test word counting"""
        text = "This is a test sentence"
        count = TextProcessor.count_words(text)
        assert count == 5
    
    def test_is_question(self):
        """Test question detection"""
        assert TextProcessor.is_question("What is this?") is True
        assert TextProcessor.is_question("This is a statement.") is False
    
    def test_normalize_whitespace(self):
        """Test whitespace normalization"""
        text = "This\t\tis  \na   test"
        result = TextProcessor.normalize_whitespace(text)
        assert result == "This is a test"

class TestCacheManager:
    """Test CacheManager class"""
    
    @pytest.fixture
    def cache(self):
        """Create cache manager instance"""
        return CacheManager()
    
    def test_set_and_get(self, cache):
        """Test cache set and get"""
        key = "test_key"
        value = {"data": "test_value"}
        
        cache.set(key, value)
        result = cache.get(key)
        
        # If Redis is available
        if result is not None:
            assert result == value
    
    def test_get_missing_key(self, cache):
        """Test getting missing key"""
        result = cache.get("nonexistent_key")
        assert result is None
    
    def test_delete(self, cache):
        """Test cache deletion"""
        key = "test_key_to_delete"
        value = {"data": "test"}
        
        cache.set(key, value)
        cache.delete(key)
        result = cache.get(key)
        
        assert result is None

class TestUtilityFunctions:
    """Test utility functions"""
    
    def test_hash_text(self):
        """Test text hashing"""
        text = "test text"
        hash1 = hash_text(text)
        hash2 = hash_text(text)
        
        assert hash1 == hash2
        assert len(hash1) == 64  # SHA256 produces 64 character hex
    
    def test_hash_different_texts(self):
        """Test different texts produce different hashes"""
        hash1 = hash_text("text1")
        hash2 = hash_text("text2")
        
        assert hash1 != hash2
    
    def test_validate_text_input_valid(self):
        """Test valid text input"""
        text = "This is a valid text input for testing"
        is_valid, error = validate_text_input(text)
        
        assert is_valid is True
        assert error is None
    
    def test_validate_text_input_too_short(self):
        """Test text input too short"""
        text = "Short"
        is_valid, error = validate_text_input(text, min_length=10)
        
        assert is_valid is False
        assert error is not None
    
    def test_validate_text_input_too_long(self):
        """Test text input too long"""
        text = "x" * 60000
        is_valid, error = validate_text_input(text, max_length=50000)
        
        assert is_valid is False
        assert error is not None
    
    def test_validate_text_input_empty(self):
        """Test empty text input"""
        is_valid, error = validate_text_input("")
        
        assert is_valid is False
        assert error is not None
    
    def test_create_success_response(self):
        """Test success response creation"""
        data = {"result": "success"}
        response = create_success_response(data, "Operation completed")
        
        assert response['success'] is True
        assert response['data'] == data
        assert 'timestamp' in response
        assert response['message'] == "Operation completed"
    
    def test_create_error_response(self):
        """Test error response creation"""
        error = "Something went wrong"
        details = {"code": 500}
        response = create_error_response(error, details)
        
        assert response['success'] is False
        assert response['error'] == error
        assert response['details'] == details
        assert 'timestamp' in response

class TestTextProcessorEdgeCases:
    """Test edge cases for TextProcessor"""
    
    def test_clean_empty_text(self):
        """Test cleaning empty text"""
        result = TextProcessor.clean_text("")
        assert result == ""
    
    def test_split_empty_text(self):
        """Test splitting empty text"""
        sentences = TextProcessor.split_into_sentences("")
        assert len(sentences) == 0
    
    def test_extract_keywords_short_text(self):
        """Test keyword extraction from short text"""
        text = "test"
        keywords = TextProcessor.extract_keywords(text)
        assert len(keywords) <= 1
    
    def test_readability_empty_text(self):
        """Test readability of empty text"""
        scores = TextProcessor.calculate_readability_score("")
        assert scores['avg_sentence_length'] == 0
        assert scores['avg_word_length'] == 0