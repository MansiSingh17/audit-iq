"""
AuditIQ ML Service - Main Application Package
"""

__version__ = '1.0.0'
__author__ = 'AuditIQ Team'

from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.utils.logger import setup_logger

# Initialize logger
logger = setup_logger()

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Register routes
    from app.routes import register_routes
    register_routes(app)
    
    logger.info('AuditIQ ML Service initialized successfully')
    
    return app