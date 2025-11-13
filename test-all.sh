#!/bin/bash
echo "🧪 Running all tests..."

echo "Testing Backend..."
cd backend/spring-boot-service
mvn test

echo "Testing Frontend..."
cd ../../frontend/react-app
npm test -- --watchAll=false

echo "✅ All tests passed!"
