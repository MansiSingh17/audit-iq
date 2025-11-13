"""
Text Processing Utilities
"""
import re
from typing import List, Dict
from app.utils.logger import get_logger

logger = get_logger(__name__)

class TextProcessor:
    """Utility class for text processing operations"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and normalize text
        
        Args:
            text: Input text string
            
        Returns:
            Cleaned text string
        """
        if not text:
            return ""
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', '', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def split_into_sentences(text: str) -> List[str]:
        """
        Split text into sentences
        
        Args:
            text: Input text string
            
        Returns:
            List of sentences
        """
        # Simple sentence splitting (can be improved with NLTK)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    @staticmethod
    def split_into_chunks(text: str, max_length: int = 512) -> List[str]:
        """
        Split text into chunks of maximum length
        
        Args:
            text: Input text string
            max_length: Maximum chunk length
            
        Returns:
            List of text chunks
        """
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            word_length = len(word) + 1  # +1 for space
            
            if current_length + word_length > max_length:
                if current_chunk:
                    chunks.append(' '.join(current_chunk))
                    current_chunk = [word]
                    current_length = word_length
            else:
                current_chunk.append(word)
                current_length += word_length
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    @staticmethod
    def extract_keywords(text: str, top_n: int = 10) -> List[str]:
        """
        Extract top keywords from text
        
        Args:
            text: Input text string
            top_n: Number of top keywords to return
            
        Returns:
            List of keywords
        """
        # Simple keyword extraction based on frequency
        words = re.findall(r'\b[a-z]{4,}\b', text.lower())
        
        # Remove common stop words
        stop_words = {
            'that', 'this', 'with', 'from', 'have', 'been', 'will',
            'their', 'which', 'there', 'would', 'about', 'other',
            'these', 'could', 'should', 'shall', 'being', 'such'
        }
        
        words = [w for w in words if w not in stop_words]
        
        # Count frequency
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Sort by frequency
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        
        return [word for word, freq in sorted_words[:top_n]]
    
    @staticmethod
    def calculate_readability_score(text: str) -> Dict[str, float]:
        """
        Calculate basic readability metrics
        
        Args:
            text: Input text string
            
        Returns:
            Dictionary with readability metrics
        """
        sentences = TextProcessor.split_into_sentences(text)
        words = text.split()
        
        num_sentences = len(sentences)
        num_words = len(words)
        num_chars = len(text.replace(' ', ''))
        
        if num_sentences == 0 or num_words == 0:
            return {
                'avg_sentence_length': 0,
                'avg_word_length': 0,
                'complexity_score': 0
            }
        
        avg_sentence_length = num_words / num_sentences
        avg_word_length = num_chars / num_words
        
        # Simple complexity score (0-100)
        complexity_score = min(100, (avg_sentence_length * 2) + (avg_word_length * 10))
        
        return {
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'complexity_score': round(complexity_score, 2)
        }
    
    @staticmethod
    def truncate_text(text: str, max_length: int, suffix: str = "...") -> str:
        """
        Truncate text to maximum length
        
        Args:
            text: Input text string
            max_length: Maximum length
            suffix: Suffix to add when truncated
            
        Returns:
            Truncated text
        """
        if len(text) <= max_length:
            return text
        
        return text[:max_length - len(suffix)] + suffix
    
    @staticmethod
    def highlight_terms(text: str, terms: List[str]) -> str:
        """
        Highlight specific terms in text
        
        Args:
            text: Input text string
            terms: List of terms to highlight
            
        Returns:
            Text with highlighted terms
        """
        for term in terms:
            pattern = re.compile(re.escape(term), re.IGNORECASE)
            text = pattern.sub(f'**{term}**', text)
        
        return text
    
    @staticmethod
    def remove_html_tags(text: str) -> str:
        """
        Remove HTML tags from text
        
        Args:
            text: Input text string with HTML
            
        Returns:
            Clean text without HTML
        """
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text)
    
    @staticmethod
    def normalize_whitespace(text: str) -> str:
        """
        Normalize all whitespace to single spaces
        
        Args:
            text: Input text string
            
        Returns:
            Normalized text
        """
        return ' '.join(text.split())
    
    @staticmethod
    def count_words(text: str) -> int:
        """
        Count words in text
        
        Args:
            text: Input text string
            
        Returns:
            Word count
        """
        return len(text.split())
    
    @staticmethod
    def extract_numbers(text: str) -> List[float]:
        """
        Extract all numbers from text
        
        Args:
            text: Input text string
            
        Returns:
            List of numbers
        """
        numbers = re.findall(r'\d+\.?\d*', text)
        return [float(n) for n in numbers]
    
    @staticmethod
    def is_question(text: str) -> bool:
        """
        Check if text is a question
        
        Args:
            text: Input text string
            
        Returns:
            True if text is a question
        """
        text = text.strip()
        return text.endswith('?') or text.lower().startswith(('what', 'why', 'how', 'when', 'where', 'who'))
    
    @staticmethod
    def format_as_paragraph(text: str, line_length: int = 80) -> str:
        """
        Format text as paragraphs with specific line length
        
        Args:
            text: Input text string
            line_length: Maximum line length
            
        Returns:
            Formatted text
        """
        words = text.split()
        lines = []
        current_line = []
        current_length = 0
        
        for word in words:
            word_length = len(word) + 1
            
            if current_length + word_length > line_length:
                lines.append(' '.join(current_line))
                current_line = [word]
                current_length = word_length
            else:
                current_line.append(word)
                current_length += word_length
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return '\n'.join(lines)