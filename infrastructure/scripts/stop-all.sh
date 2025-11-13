#!/bin/bash
echo "🛑 Stopping all services..."

pkill -f "spring-boot:run"
pkill -f "python app.py"
pkill -f "npm start"

echo "✅ All services stopped"
