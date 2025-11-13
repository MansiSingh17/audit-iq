#!/bin/bash
echo "⚠️  This will DELETE all data!"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  docker-compose down -v
  rm -rf ../../backups/*
  mysql -u root -proot123 -e "DROP DATABASE IF EXISTS auditiq_db;"
  mysql -u root -proot123 -e "CREATE DATABASE auditiq_db;"
  echo "✅ Reset complete!"
fi
