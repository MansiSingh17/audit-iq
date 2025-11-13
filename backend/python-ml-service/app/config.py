import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV', 'production') == 'development'
    
    # Model Configuration
    MODEL_NAME = os.getenv('MODEL_NAME', 't5-base')
    MAX_LENGTH = int(os.getenv('MAX_LENGTH', 512))
    MIN_LENGTH = int(os.getenv('MIN_LENGTH', 50))
    
    # Redis Configuration
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))
    
    # API Configuration
    API_TIMEOUT = int(os.getenv('API_TIMEOUT', 60))
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB
    
    # Compliance Standards
    COMPLIANCE_STANDARDS = {
        'ISO_27001': {
            'name': 'ISO 27001:2022',
            'controls': 93,
            'categories': ['Organizational', 'People', 'Physical', 'Technological']
        },
        'GDPR': {
            'name': 'General Data Protection Regulation',
            'articles': 99,
            'categories': ['Lawfulness', 'Data Subject Rights', 'Security', 'Accountability']
        },
        'HIPAA': {
            'name': 'Health Insurance Portability and Accountability Act',
            'requirements': 45,
            'categories': ['Administrative', 'Physical', 'Technical']
        },
        'SOC2': {
            'name': 'SOC 2 Type II',
            'principles': 5,
            'categories': ['Security', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy']
        }
    }
    
    # Risk Thresholds
    RISK_THRESHOLDS = {
        'CRITICAL': 0.9,
        'HIGH': 0.7,
        'MEDIUM': 0.5,
        'LOW': 0.3,
        'MINIMAL': 0.0
    }
    
    # Grammar Correction
    LANGUAGE_TOOL_LANGUAGE = os.getenv('LANGUAGE_TOOL_LANGUAGE', 'en-US')
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration"""
        pass