#!/bin/bash
echo "🚀 Starting all services..."

# Start MySQL
mysql.server start

# Start Redis (if installed)
redis-server --daemonize yes

# Start Backend (in background)
cd ../../backend/spring-boot-service
mvn spring-boot:run &

# Start Python ML (in background)
cd ../../backend/python-ml-service
source venv/bin/activate
python app.py &

# Start Frontend
cd ../../frontend/react-app
npm start

echo "✅ All services started!"
