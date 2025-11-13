#!/bin/bash
echo "🔍 Service Health Check..."

check_service() {
  if curl -sf "$1" > /dev/null 2>&1; then
    echo "✅ $2"
  else
    echo "❌ $2"
  fi
}

check_service "http://localhost:8080/actuator/health" "Backend (8080)"
check_service "http://localhost:5000/api/health" "Python ML (5000)"
check_service "http://localhost:3000" "Frontend (3000)"
