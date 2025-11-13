#!/bin/bash
echo "🚀 Starting AuditIQ Development Environment..."

# Ensure Java 17
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

# Start MySQL
mysql.server start || echo "MySQL already running"

# Start Backend
cd backend/spring-boot-service
mvn spring-boot:run &
BACKEND_PID=$!

# Wait for backend
sleep 10

# Start Frontend
cd ../../frontend/react-app
npm start &
FRONTEND_PID=$!

echo "✅ Services started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

wait
