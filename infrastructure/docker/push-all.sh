#!/bin/bash
REGISTRY=${1:-docker.io}
echo "📤 Pushing to $REGISTRY..."

docker tag auditiq/spring-boot:latest $REGISTRY/auditiq/spring-boot:latest
docker push $REGISTRY/auditiq/spring-boot:latest

docker tag auditiq/python-ml:latest $REGISTRY/auditiq/python-ml:latest
docker push $REGISTRY/auditiq/python-ml:latest

docker tag auditiq/frontend:latest $REGISTRY/auditiq/frontend:latest
docker push $REGISTRY/auditiq/frontend:latest

echo "✅ Pushed to $REGISTRY"
