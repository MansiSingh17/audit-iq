#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./restore-database.sh <backup-file.sql>"
  exit 1
fi
docker exec -i auditiq-mysql mysql \
  -u root -proot123 auditiq_db < "$1"
echo "✅ Database restored from $1"
