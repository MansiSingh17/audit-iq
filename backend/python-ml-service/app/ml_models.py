"""
ML Models Module - Singleton instances for model management
"""
from app.models.checklist_generator import ChecklistGenerator
from app.models.risk_analyzer import RiskAnalyzer
from app.models.grammar_checker import GrammarChecker
from app.models.document_analyzer import DocumentAnalyzer
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Singleton instances
_checklist_generator = None
_risk_analyzer = None
_grammar_checker = None
_document_analyzer = None

def get_checklist_generator() -> ChecklistGenerator:
    """Get singleton instance of ChecklistGenerator"""
    global _checklist_generator
    if _checklist_generator is None:
        logger.info('Initializing ChecklistGenerator singleton')
        _checklist_generator = ChecklistGenerator()
    return _checklist_generator

def get_risk_analyzer() -> RiskAnalyzer:
    """Get singleton instance of RiskAnalyzer"""
    global _risk_analyzer
    if _risk_analyzer is None:
        logger.info('Initializing RiskAnalyzer singleton')
        _risk_analyzer = RiskAnalyzer()
    return _risk_analyzer

def get_grammar_checker() -> GrammarChecker:
    """Get singleton instance of GrammarChecker"""
    global _grammar_checker
    if _grammar_checker is None:
        logger.info('Initializing GrammarChecker singleton')
        _grammar_checker = GrammarChecker()
    return _grammar_checker

def get_document_analyzer() -> DocumentAnalyzer:
    """Get singleton instance of DocumentAnalyzer"""
    global _document_analyzer
    if _document_analyzer is None:
        logger.info('Initializing DocumentAnalyzer singleton')
        _document_analyzer = DocumentAnalyzer()
    return _document_analyzer

def preload_models():
    """Preload all models at startup"""
    logger.info('Preloading all ML models...')
    get_checklist_generator()
    get_risk_analyzer()
    get_grammar_checker()
    get_document_analyzer()
    logger.info('All ML models preloaded successfully')