import language_tool_python
from app.config import Config
from app.utils.logger import get_logger

logger = get_logger(__name__)

class GrammarChecker:
    """Grammar and spelling correction using LanguageTool"""
    
    def __init__(self):
        logger.info('Initializing grammar checker')
        self.tool = language_tool_python.LanguageTool(Config.LANGUAGE_TOOL_LANGUAGE)
        logger.info('Grammar checker initialized successfully')
    
    def correct(self, text):
        """Correct grammar and spelling in text"""
        try:
            logger.info('Correcting grammar')
            
            # Check text
            matches = self.tool.check(text)
            
            # Apply corrections
            corrected_text = language_tool_python.utils.correct(text, matches)
            
            # Format corrections
            corrections = []
            for match in matches:
                correction = {
                    'type': match.ruleId,
                    'original': match.matchedText,
                    'corrected': match.replacements[0] if match.replacements else '',
                    'position': match.offset,
                    'suggestion': match.message
                }
                corrections.append(correction)
            
            result = {
                'success': True,
                'original_text': text,
                'corrected_text': corrected_text,
                'corrections': corrections,
                'total_corrections': len(corrections)
            }
            
            logger.info(f'Grammar correction complete: {len(corrections)} corrections made')
            return result
            
        except Exception as e:
            logger.error(f'Error in grammar correction: {str(e)}')
            raise