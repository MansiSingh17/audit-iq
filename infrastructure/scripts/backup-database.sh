#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p ../../backups
docker exec auditiq-mysql mysqldump \
  -u root -proot123 auditiq_db \
  > "../../backups/auditiq_db_$TIMESTAMP.sql"
echo "✅ Backup: backups/auditiq_db_$TIMESTAMP.sql"
