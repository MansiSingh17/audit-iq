# AuditIQ ML Service

Machine Learning microservice for AuditIQ platform providing NLP-based document analysis, checklist generation, risk assessment, and grammar correction.

## Features

- **Document Analysis**: Extract and summarize text from PDF, DOCX, XLSX
- **Checklist Generation**: Auto-generate compliance checklists using T5 transformer
- **Risk Assessment**: Context-aware risk analysis with severity classification
- **Grammar Correction**: Real-time grammar and spelling correction using LanguageTool

## Tech Stack

- **Flask**: Web framework
- **HuggingFace Transformers**: T5 model for NLP tasks
- **PyTorch**: Deep learning framework
- **LanguageTool**: Grammar checking
- **Redis**: Caching layer
- **Python 3.9+**: Core language

## Installation

### Prerequisites

```bash
python --version  # 3.9 or higher
redis-server --version  # 7.0 or higher
java --version  # For LanguageTool
```

### Setup

```bash
# Clone and navigate
cd backend/python-ml-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Configuration

Edit `.env` file:

```bash
FLASK_ENV=development
PORT=5000
REDIS_HOST=localhost
REDIS_PORT=6379
MODEL_NAME=t5-base
```

## Running the Service

### Development Mode

```bash
# Activate virtual environment
source venv/bin/activate

# Start Flask development server
python app.py
```

Service will be available at `http://localhost:5000`

### Production Mode

```bash
# Using gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 wsgi:app

# Or using Docker
docker build -t auditiq-ml-service .
docker run -p 5000:5000 auditiq-ml-service
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Generate Checklist
```bash
POST /api/checklist/generate
Content-Type: application/json

{
  "text": "Your document text here",
  "standard": "ISO_27001"
}
```

### Analyze Risk
```bash
POST /api/risk/analyze
Content-Type: application/json

{
  "text": "Your document text here",
  "standard": "ISO_27001"
}
```

### Correct Grammar
```bash
POST /api/grammar/correct
Content-Type: application/json

{
  "text": "Text with grammar errors here"
}
```

### Extract Text
```bash
POST /api/document/extract
Content-Type: application/json

{
  "file_content": "base64_encoded_content",
  "file_type": "pdf"
}
```

### Summarize Text
```bash
POST /api/document/summarize
Content-Type: application/json

{
  "text": "Long text to summarize"
}
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_routes.py

# Run with verbose output
pytest -v
```

## Project Structure

```
python-ml-service/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── routes.py          # API routes
│   ├── models/            # ML models
│   │   ├── checklist_generator.py
│   │   ├── risk_analyzer.py
│   │   ├── grammar_checker.py
│   │   └── document_analyzer.py
│   └── utils/             # Utility functions
│       ├── cache_manager.py
│       ├── logger.py
│       └── text_processor.py
├── tests/                 # Test files
├── logs/                  # Log files
├── data/                  # Data files
├── app.py                 # Main application
├── wsgi.py               # WSGI entry point
├── requirements.txt       # Dependencies
└── Dockerfile            # Docker configuration
```

## Supported Compliance Standards

- **ISO 27001:2022** - Information Security Management
- **GDPR** - General Data Protection Regulation
- **HIPAA** - Health Insurance Portability and Accountability Act
- **SOC 2** - Service Organization Control 2

## Model Information

### T5 Model
- Default: `t5-base` (220M parameters)
- Alternative: `t5-large` (770M parameters) for better accuracy
- Tasks: Summarization, checklist generation

### LanguageTool
- Version: Latest stable
- Languages: English (US)
- Rules: 2000+ grammar and style rules

## Performance

- **Checklist Generation**: ~5-10 seconds
- **Risk Analysis**: ~3-7 seconds
- **Grammar Correction**: ~1-3 seconds
- **Text Extraction**: ~2-5 seconds
- **Summarization**: ~5-8 seconds

Performance depends on:
- Document size
- Hardware (CPU/GPU)
- Model size
- Cache availability

## Caching

Redis is used to cache ML model results:
- **TTL**: 1 hour (configurable)
- **Cache Keys**: Based on content hash
- **Hit Rate**: ~60-80% in production

Clear cache:
```python
from app.utils.cache_manager import CacheManager
cache = CacheManager()
cache.clear_all()
```

## Logging

Logs are written to:
- Console (colored output)
- `logs/auditiq_ml.log` (file)

Log levels:
- DEBUG: Detailed information
- INFO: General information
- WARNING: Warning messages
- ERROR: Error messages
- CRITICAL: Critical errors

## Troubleshooting

### Model Download Issues
```bash
# Manually download model
python -c "from transformers import T5Tokenizer, T5ForConditionalGeneration; \
           T5Tokenizer.from_pretrained('t5-base'); \
           T5ForConditionalGeneration.from_pretrained('t5-base')"
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# Start Redis
redis-server
```

### Memory Issues
- Use smaller model: `MODEL_NAME=t5-small`
- Reduce batch size
- Limit input text length
- Use CPU instead of GPU

### LanguageTool Issues
```bash
# Install Java if missing
sudo apt-get install default-jre

# Check Java version
java -version
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/auditiq/issues
- Email: support@auditiq.com

## Authors

- AuditIQ Team

## Acknowledgments

- HuggingFace for transformer models
- LanguageTool for grammar checking
- Flask community