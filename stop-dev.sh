#!/bin/bash
echo "🛑 Stopping all services..."
pkill -f "spring-boot:run"
pkill -f "npm start"
echo "✅ Stopped!"
