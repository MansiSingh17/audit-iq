from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import time
import os
from werkzeug.utils import secure_filename

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize ML models (lazy loading)
grammar_model = None
checklist_model = None
document_analyzer = None

def load_grammar_model():
    """Lazy load grammar correction model"""
    global grammar_model
    if grammar_model is None:
        try:
            from transformers import T5ForConditionalGeneration, T5Tokenizer
            logger.info("Loading T5 grammar correction model...")
            model_name = "vennify/t5-base-grammar-correction"
            grammar_model = {
                'tokenizer': T5Tokenizer.from_pretrained(model_name),
                'model': T5ForConditionalGeneration.from_pretrained(model_name)
            }
            logger.info("Grammar model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading grammar model: {e}")
            grammar_model = {'error': str(e)}
    return grammar_model

def load_checklist_model():
    """Lazy load checklist generation model"""
    global checklist_model
    if checklist_model is None:
        try:
            from transformers import T5ForConditionalGeneration, T5Tokenizer
            logger.info("Loading T5 checklist generation model...")
            model_name = "t5-base"
            checklist_model = {
                'tokenizer': T5Tokenizer.from_pretrained(model_name),
                'model': T5ForConditionalGeneration.from_pretrained(model_name)
            }
            logger.info("Checklist model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading checklist model: {e}")
            checklist_model = {'error': str(e)}
    return checklist_model

def load_document_analyzer():
    """Lazy load document analyzer"""
    global document_analyzer
    if document_analyzer is None:
        try:
            from app.document_analyzer import DocumentAnalyzer
            logger.info("Loading Document Analyzer...")
            document_analyzer = DocumentAnalyzer()
            logger.info("Document Analyzer loaded successfully")
        except Exception as e:
            logger.error(f"Error loading document analyzer: {e}")
            document_analyzer = {'error': str(e)}
    return document_analyzer

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AuditIQ ML Service',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/api/grammar/correct', methods=['POST'])
@app.route('/correct-grammar', methods=['POST'])
def correct_grammar():
    """Correct grammar in text - supports both endpoints"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        language = data.get('language', 'en')
        
        start_time = time.time()
        
        # Use LanguageTool for better grammar checking
        try:
            import language_tool_python
            tool = language_tool_python.LanguageTool(language)
            
            # Check grammar
            matches = tool.check(text)
            
            # Apply corrections
            corrected_text = language_tool_python.utils.correct(text, matches)
            
            # Generate corrections list
            corrections = []
            for match in matches:
                corrections.append({
                    'original': text[match.offset:match.offset + match.errorLength],
                    'corrected': match.replacements[0] if match.replacements else text[match.offset:match.offset + match.errorLength],
                    'type': match.ruleId,
                    'message': match.message,
                    'offset': match.offset,
                    'length': match.errorLength,
                    'position': match.offset,
                    'suggestion': match.message
                })
            
            tool.close()
            
        except Exception as e:
            logger.warning(f"LanguageTool failed, falling back to T5: {e}")
            
            # Fallback to T5 model
            model_dict = load_grammar_model()
            
            if 'error' in model_dict:
                return jsonify({'error': f'Model loading failed: {model_dict["error"]}'}), 500
            
            tokenizer = model_dict['tokenizer']
            model = model_dict['model']
            
            inputs = tokenizer.encode(f"grammar: {text}", return_tensors="pt", max_length=512, truncation=True)
            outputs = model.generate(inputs, max_length=512, num_beams=4, early_stopping=True)
            corrected_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            corrections = []
            if text != corrected_text:
                corrections.append({
                    'original': text,
                    'corrected': corrected_text,
                    'type': 'GRAMMAR',
                    'message': 'Grammar correction applied',
                    'offset': 0,
                    'length': len(text),
                    'position': 0,
                    'suggestion': 'The text has been corrected for grammar and style.'
                })
        
        processing_time = (time.time() - start_time) * 1000
        
        return jsonify({
            'originalText': text,
            'correctedText': corrected_text,
            'corrections': corrections,
            'language': language,
            'processingTimeMs': round(processing_time, 2)
        }), 200
        
    except Exception as e:
        logger.error(f"Error in grammar correction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/checklists/generate', methods=['POST'])
@app.route('/generate-checklist', methods=['POST'])
def generate_checklist():
    """Generate compliance checklist - supports both endpoints"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Missing request data'}), 400
        
        text = data.get('text', '')
        standard = data.get('standard', 'ISO27001')
        document_id = data.get('documentId')
        
        start_time = time.time()
        
        logger.info(f"Generating checklist for standard: {standard}")
        
        # Sample checklist items based on standard
        checklist_items = [
            {
                'itemNumber': 1,
                'title': 'Information Security Policy',
                'description': 'Verify that an information security policy is documented and approved by management',
                'category': 'Policy & Organization',
                'requirement': 'Mandatory',
                'status': 'PENDING',
                'priority': 'HIGH',
                'evidence': [],
                'notes': ''
            },
            {
                'itemNumber': 2,
                'title': 'Access Control Policy',
                'description': 'Ensure proper access control mechanisms are defined and implemented',
                'category': 'Access Control',
                'requirement': 'Mandatory',
                'status': 'PENDING',
                'priority': 'HIGH',
                'evidence': [],
                'notes': ''
            },
            {
                'itemNumber': 3,
                'title': 'Risk Assessment Process',
                'description': 'Conduct regular risk assessments and maintain risk treatment plans',
                'category': 'Risk Management',
                'requirement': 'Mandatory',
                'status': 'PENDING',
                'priority': 'HIGH',
                'evidence': [],
                'notes': ''
            },
            {
                'itemNumber': 4,
                'title': 'Asset Management',
                'description': 'Maintain an inventory of all information assets and assign ownership',
                'category': 'Asset Management',
                'requirement': 'Mandatory',
                'status': 'PENDING',
                'priority': 'MEDIUM',
                'evidence': [],
                'notes': ''
            },
            {
                'itemNumber': 5,
                'title': 'Security Awareness Training',
                'description': 'Provide regular security awareness training to all employees',
                'category': 'Human Resources',
                'requirement': 'Mandatory',
                'status': 'PENDING',
                'priority': 'MEDIUM',
                'evidence': [],
                'notes': ''
            }
        ]
        
        processing_time = (time.time() - start_time) * 1000
        
        response = {
            'success': True,
            'items': checklist_items,
            'standard': standard,
            'documentId': document_id,
            'processingTimeMs': round(processing_time, 2),
            'totalItems': len(checklist_items),
            'completedItems': 0,
            'pendingItems': len(checklist_items)
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error generating checklist: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'items': []
        }), 500

@app.route('/analyze-document', methods=['POST'])
def analyze_document():
    """Analyze uploaded document for compliance - NEW IMPLEMENTATION"""
    try:
        start_time = time.time()
        
        # Check if this is a file upload (multipart/form-data) or JSON
        if 'file' in request.files:
            # Handle file upload from frontend
            file = request.files['file']
            standard = request.form.get('standard', 'ISO_27001')
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Read file content
            try:
                file_content = file.read().decode('utf-8', errors='ignore')
            except Exception as e:
                logger.error(f"Error reading file: {e}")
                return jsonify({'error': 'Could not read file content'}), 400
            
            document_name = secure_filename(file.filename)
            
        elif request.is_json:
            # Handle JSON request (for testing or alternative API)
            data = request.get_json()
            
            if not data or 'text' not in data:
                return jsonify({'error': 'Missing text field'}), 400
            
            file_content = data['text']
            standard = data.get('standard', 'ISO_27001')
            document_name = data.get('documentName', 'Uploaded Document')
        else:
            return jsonify({'error': 'Invalid request format. Send multipart/form-data with file or JSON with text.'}), 400
        
        logger.info(f"Analyzing document: {document_name} for standard: {standard}")
        
        # Load and use document analyzer
        analyzer = load_document_analyzer()
        
        if isinstance(analyzer, dict) and 'error' in analyzer:
            logger.error(f"Analyzer not available: {analyzer['error']}")
            return jsonify({'error': f'Document analyzer not available: {analyzer["error"]}'}), 500
        
        # Perform analysis
        result = analyzer.analyze_document(file_content, standard)
        
        # Update document name in result
        result['documentName'] = document_name
        
        processing_time = (time.time() - start_time) * 1000
        logger.info(f"Analysis completed in {processing_time:.2f}ms")
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error analyzing document: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/assess-risk', methods=['POST'])
def assess_risk():
    """Assess risk in document"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        text = data['text']
        
        start_time = time.time()
        
        # Sample risk assessment
        risk_findings = [
            {
                'title': 'Inadequate Access Controls',
                'description': 'Current access control measures may not meet compliance requirements',
                'severity': 'HIGH',
                'likelihood': 'MEDIUM',
                'impact': 'HIGH',
                'riskScore': 8.5,
                'recommendations': [
                    'Implement multi-factor authentication',
                    'Regular access reviews'
                ]
            }
        ]
        
        processing_time = (time.time() - start_time) * 1000
        
        return jsonify({
            'findings': risk_findings,
            'overallRiskScore': 7.5,
            'riskLevel': 'MEDIUM',
            'processingTimeMs': round(processing_time, 2)
        }), 200
        
    except Exception as e:
        logger.error(f"Error assessing risk: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """AI Chat endpoint for compliance Q&A"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Missing message field'}), 400
        
        message = data['message']
        conversation_id = data.get('conversationId', f'conv-{int(time.time())}')
        context = data.get('context', '')
        standard = data.get('standard', '')
        
        start_time = time.time()
        
        logger.info(f"Chat message: {message[:50]}... Context: {context}")
        
        # Simple keyword-based responses (can be enhanced with GPT/Claude later)
        response_text = generate_chat_response(message, context, standard)
        
        # Generate suggested questions
        suggestions = generate_suggestions(context, standard)
        
        # Get related controls
        related_controls = get_related_controls(message)
        
        processing_time = (time.time() - start_time) * 1000
        
        return jsonify({
            'response': response_text,
            'conversationId': conversation_id,
            'suggestedQuestions': suggestions,
            'relatedControls': related_controls,
            'confidence': 'MEDIUM'
        }), 200
        
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        return jsonify({'error': str(e)}), 500

def generate_chat_response(message, context, standard):
    """Generate contextual chat response"""
    msg_lower = message.lower()
    
    if 'iso 27001' in msg_lower or 'a.8.24' in msg_lower:
        return ("ISO 27001:2022 Control A.8.24 - Use of Cryptography:\n\n"
                "Requirements:\n"
                "• Define policy on cryptographic controls\n"
                "• Specify approved algorithms (e.g., AES-256, RSA-2048)\n"
                "• Implement key management procedures\n"
                "• Ensure proper key lifecycle management\n\n"
                "Best Practice: Use AES-256 for data at rest and TLS 1.3 for data in transit.")
    
    elif 'gdpr' in msg_lower and ('breach' in msg_lower or 'article 33' in msg_lower):
        return ("GDPR Article 33 - Data Breach Notification:\n\n"
                "Requirements:\n"
                "• Notify supervisory authority within 72 hours\n"
                "• Include nature of breach, categories affected, likely consequences\n"
                "• Document all breaches in breach register\n"
                "• Communicate to data subjects if high risk (Article 34)\n\n"
                "Action: Create breach notification templates and escalation procedures.")
    
    elif 'hipaa' in msg_lower or 'ephi' in msg_lower:
        return ("HIPAA Security Rule - ePHI Protection:\n\n"
                "Required Safeguards:\n"
                "• Administrative: Risk analysis, workforce training, BAAs\n"
                "• Physical: Facility access controls, device security\n"
                "• Technical: Access controls, encryption, audit logs\n\n"
                "Priority: Implement encryption for ePHI at rest and in transit.")
    
    elif 'policy' in msg_lower or 'write' in msg_lower:
        return ("I can help you write audit-ready policies!\n\n"
                "For best results, tell me:\n"
                "1. Policy type (access control, encryption, incident response, etc.)\n"
                "2. Compliance standard (ISO 27001, GDPR, HIPAA)\n"
                "3. Specific requirements or controls to address\n\n"
                "Example: 'Write an access control policy for ISO 27001 A.5.15'")
    
    elif 'remediat' in msg_lower or 'fix' in msg_lower:
        return ("Remediation Guidance:\n\n"
                "For Critical Findings (24hr timeline):\n"
                "• Immediate executive escalation\n"
                "• Deploy emergency controls\n"
                "• Document compensating measures\n\n"
                "For High Findings (7 days):\n"
                "• Form remediation task force\n"
                "• Allocate dedicated resources\n"
                "• Implement staged rollout\n\n"
                "What specific finding needs remediation?")
    
    else:
        return ("Hello! I'm your Audit-IQ compliance assistant. I can help with:\n\n"
                "📋 Compliance Requirements - ISO 27001, GDPR, HIPAA\n"
                "🔍 Finding Explanations - Detailed control guidance\n"
                "📝 Policy Writing - Audit-ready templates\n"
                "✨ Best Practices - Industry benchmarks\n"
                "⚡ Remediation - Step-by-step guidance\n\n"
                "Try asking: 'What are ISO 27001 encryption requirements?' or 'Help me write an access control policy'")

def generate_suggestions(context, standard):
    """Generate contextual question suggestions"""
    suggestions = []
    
    if context in ['analysis', 'findings']:
        suggestions.append({'question': 'Explain this critical flag', 'category': 'Analysis Help', 'icon': '🚩'})
        suggestions.append({'question': 'How do I remediate this quickly?', 'category': 'Remediation', 'icon': '⚡'})
    
    if standard:
        suggestions.append({'question': f'What are {standard} encryption requirements?', 'category': 'Compliance', 'icon': '🔐'})
    
    suggestions.append({'question': 'Help me write a security policy', 'category': 'Policy Writing', 'icon': '📝'})
    suggestions.append({'question': 'What are industry best practices?', 'category': 'Best Practices', 'icon': '✨'})
    
    return suggestions

def get_related_controls(message):
    """Extract related controls from message"""
    controls = []
    
    if 'encrypt' in message.lower():
        controls.extend(['ISO 27001 - A.8.24', 'NIST CSF - PR.DS-5'])
    if 'access' in message.lower():
        controls.extend(['ISO 27001 - A.5.15', 'NIST CSF - PR.AC-1'])
    if 'breach' in message.lower() or 'incident' in message.lower():
        controls.extend(['ISO 27001 - A.5.24', 'GDPR - Article 33'])
    
    return controls

if __name__ == '__main__':
    port = 5001
    logger.info("Starting AuditIQ ML Service...")
    logger.info(f"Service will be available at http://localhost:{port}")
    logger.info("Endpoints available:")
    logger.info("  - POST /chat (NEW: AI Chatbot)")
    logger.info("  - POST /analyze-document (AI Document Analysis)")
    logger.info("  - POST /correct-grammar")
    logger.info("  - POST /generate-checklist")
    logger.info("  - POST /assess-risk")
    logger.info("  - GET /health")
    app.run(host='0.0.0.0', port=port, debug=True)