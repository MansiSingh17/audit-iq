# Troubleshooting

## Backend won't start

**Java version issue:**
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
mvn -version
```

**MySQL connection:**
```bash
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
```

## Frontend shows errors

**API URL issue:**
Check `src/services/api.ts`:
```typescript
baseURL: 'http://localhost:8080'  // No /api suffix!
```

## Port conflicts
```bash
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5000  # Python ML
```
