"""
Tests for API routes
"""
import pytest
import json
from app import create_app

@pytest.fixture
def client():
    """Create test client"""
    app = create_app()
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert data['service'] == 'AuditIQ ML Service'

def test_generate_checklist_missing_text(client):
    """Test checklist generation with missing text"""
    response = client.post(
        '/api/checklist/generate',
        data=json.dumps({'standard': 'ISO_27001'}),
        content_type='application/json'
    )
    assert response.status_code == 400

def test_generate_checklist_success(client):
    """Test successful checklist generation"""
    response = client.post(
        '/api/checklist/generate',
        data=json.dumps({
            'text': 'This is a sample audit document about security policies and procedures.',
            'standard': 'ISO_27001'
        }),
        content_type='application/json'
    )
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'items' in data
    assert 'standard' in data

def test_analyze_risk_missing_text(client):
    """Test risk analysis with missing text"""
    response = client.post(
        '/api/risk/analyze',
        data=json.dumps({'standard': 'ISO_27001'}),
        content_type='application/json'
    )
    assert response.status_code == 400

def test_analyze_risk_success(client):
    """Test successful risk analysis"""
    response = client.post(
        '/api/risk/analyze',
        data=json.dumps({
            'text': 'No encryption implemented. Passwords are weak. Unauthorized access detected.',
            'standard': 'ISO_27001'
        }),
        content_type='application/json'
    )
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'overall_risk_score' in data
    assert 'findings' in data

def test_correct_grammar_missing_text(client):
    """Test grammar correction with missing text"""
    response = client.post(
        '/api/grammar/correct',
        data=json.dumps({}),
        content_type='application/json'
    )
    assert response.status_code == 400

def test_correct_grammar_success(client):
    """Test successful grammar correction"""
    response = client.post(
        '/api/grammar/correct',
        data=json.dumps({
            'text': 'This are a test sentence with grammar error.'
        }),
        content_type='application/json'
    )
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'corrected_text' in data

def test_summarize_text_missing_text(client):
    """Test text summarization with missing text"""
    response = client.post(
        '/api/document/summarize',
        data=json.dumps({}),
        content_type='application/json'
    )
    assert response.status_code == 400

def test_summarize_text_success(client):
    """Test successful text summarization"""
    response = client.post(
        '/api/document/summarize',
        data=json.dumps({
            'text': 'This is a long document that needs to be summarized. ' * 50
        }),
        content_type='application/json'
    )
    assert response.status_code == 200
    
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'summary' in data

def test_invalid_endpoint(client):
    """Test invalid endpoint"""
    response = client.get('/api/invalid/endpoint')
    assert response.status_code == 404

def test_method_not_allowed(client):
    """Test method not allowed"""
    response = client.get('/api/checklist/generate')
    assert response.status_code == 405