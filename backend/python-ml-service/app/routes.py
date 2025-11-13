from flask import request, jsonify
from app.models.checklist_generator import ChecklistGenerator
from app.models.risk_analyzer import RiskAnalyzer
from app.models.grammar_checker import GrammarChecker
from app.models.document_analyzer import DocumentAnalyzer
from app.utils.cache_manager import CacheManager
from app.utils.logger import get_logger
import traceback

logger = get_logger(__name__)
cache = CacheManager()

# Initialize models
checklist_gen = ChecklistGenerator()
risk_analyzer = RiskAnalyzer()
grammar_checker = GrammarChecker()
doc_analyzer = DocumentAnalyzer()

def register_routes(app):
    """Register all API routes"""
    
    @app.route('/api/checklist/generate', methods=['POST'])
    def generate_checklist():
        """Generate compliance checklist"""
        try:
            data = request.get_json()
            text = data.get('text', '')
            standard = data.get('standard', 'ISO_27001')
            
            if not text:
                return jsonify({'error': 'Text is required'}), 400
            
            logger.info(f'Generating checklist for standard: {standard}')
            
            # Check cache
            cache_key = f'checklist:{standard}:{hash(text)}'
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info('Returning cached checklist')
                return jsonify(cached_result), 200
            
            # Generate checklist
            result = checklist_gen.generate(text, standard)
            
            # Cache result
            cache.set(cache_key, result)
            
            return jsonify(result), 200
            
        except Exception as e:
            logger.error(f'Error generating checklist: {str(e)}')
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to generate checklist',
                'details': str(e)
            }), 500
    
    @app.route('/api/risk/analyze', methods=['POST'])
    def analyze_risk():
        """Analyze compliance risks"""
        try:
            data = request.get_json()
            text = data.get('text', '')
            standard = data.get('standard', 'ISO_27001')
            
            if not text:
                return jsonify({'error': 'Text is required'}), 400
            
            logger.info(f'Analyzing risk for standard: {standard}')
            
            # Check cache
            cache_key = f'risk:{standard}:{hash(text)}'
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info('Returning cached risk analysis')
                return jsonify(cached_result), 200
            
            # Analyze risk
            result = risk_analyzer.analyze(text, standard)
            
            # Cache result
            cache.set(cache_key, result)
            
            return jsonify(result), 200
            
        except Exception as e:
            logger.error(f'Error analyzing risk: {str(e)}')
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to analyze risk',
                'details': str(e)
            }), 500
    
    @app.route('/api/grammar/correct', methods=['POST'])
    def correct_grammar():
        """Correct grammar and spelling"""
        try:
            data = request.get_json()
            text = data.get('text', '')
            
            if not text:
                return jsonify({'error': 'Text is required'}), 400
            
            logger.info('Correcting grammar')
            
            # Check cache
            cache_key = f'grammar:{hash(text)}'
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info('Returning cached grammar correction')
                return jsonify(cached_result), 200
            
            # Correct grammar
            result = grammar_checker.correct(text)
            
            # Cache result
            cache.set(cache_key, result)
            
            return jsonify(result), 200
            
        except Exception as e:
            logger.error(f'Error correcting grammar: {str(e)}')
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to correct grammar',
                'details': str(e)
            }), 500
    
    @app.route('/api/document/extract', methods=['POST'])
    def extract_text():
        """Extract text from document"""
        try:
            data = request.get_json()
            file_content = data.get('file_content')
            file_type = data.get('file_type', 'pdf')
            
            if not file_content:
                return jsonify({'error': 'File content is required'}), 400
            
            logger.info(f'Extracting text from {file_type}')
            
            # Extract text
            result = doc_analyzer.extract_text(file_content, file_type)
            
            return jsonify(result), 200
            
        except Exception as e:
            logger.error(f'Error extracting text: {str(e)}')
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to extract text',
                'details': str(e)
            }), 500
    
    @app.route('/api/document/summarize', methods=['POST'])
    def summarize_text():
        """Summarize document text"""
        try:
            data = request.get_json()
            text = data.get('text', '')
            
            if not text:
                return jsonify({'error': 'Text is required'}), 400
            
            logger.info('Summarizing text')
            
            # Check cache
            cache_key = f'summary:{hash(text)}'
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info('Returning cached summary')
                return jsonify(cached_result), 200
            
            # Summarize
            result = doc_analyzer.summarize(text)
            
            # Cache result
            cache.set(cache_key, result)
            
            return jsonify(result), 200
            
        except Exception as e:
            logger.error(f'Error summarizing text: {str(e)}')
            logger.error(traceback.format_exc())
            return jsonify({
                'error': 'Failed to summarize text',
                'details': str(e)
            }), 500