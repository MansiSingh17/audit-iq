#!/bin/bash
echo "🔨 Building all services..."

cd backend/spring-boot-service
mvn clean install -DskipTests

cd ../python-ml-service
pip install -r requirements.txt

cd ../../frontend/react-app
npm install
npm run build

echo "✅ Build complete!"
