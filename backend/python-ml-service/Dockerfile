FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    wget \
    curl \
    default-jre \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download LanguageTool
RUN mkdir -p /opt/languagetool && \
    cd /opt/languagetool && \
    wget https://languagetool.org/download/LanguageTool-stable.zip && \
    unzip LanguageTool-stable.zip && \
    rm LanguageTool-stable.zip

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p logs data models

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run application with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--worker-class", "sync", "wsgi:app"]