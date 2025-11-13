#!/bin/bash
echo "🧹 Cleaning Docker resources..."
docker system prune -af --volumes
echo "✅ Cleanup complete!"
