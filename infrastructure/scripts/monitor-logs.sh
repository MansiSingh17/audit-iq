#!/bin/bash
SERVICE=${1:-all}

case $SERVICE in
  backend) tail -f ../../backend/spring-boot-service/logs/auditiq.log ;;
  python) tail -f ../../backend/python-ml-service/logs/ml-service.log ;;
  *) echo "Monitoring all services..." && tail -f ../../backend/spring-boot-service/logs/auditiq.log ;;
esac
