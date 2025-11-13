#!/bin/bash
set -e
echo "🐳 Building all Docker images..."

cd ../../backend/spring-boot-service
docker build -t auditiq/spring-boot:latest .

cd ../python-ml-service
docker build -t auditiq/python-ml:latest .

cd ../../frontend/react-app
docker build -t auditiq/frontend:latest .

echo "✅ All images built!"
