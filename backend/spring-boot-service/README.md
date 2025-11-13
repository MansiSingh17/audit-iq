# AuditIQ Spring Boot Service

REST API backend service for AuditIQ platform built with Spring Boot 3.2.

## Features

- **Document Management**: Upload, store, and manage audit documents
- **Checklist Generation**: Auto-generate compliance checklists via ML service
- **Risk Assessment**: Analyze and assess compliance risks
- **Grammar Correction**: Real-time grammar checking for audit reports
- **User Management**: User authentication and authorization
- **Audit Logging**: Comprehensive activity tracking
- **AWS S3 Integration**: Secure document storage
- **Redis Caching**: High-performance result caching
- **Python ML Client**: Integration with ML microservice

## Tech Stack

- **Java 17**: Core language
- **Spring Boot 3.2**: Application framework
- **Spring Data JPA**: Database access
- **MySQL 8.0**: Primary database
- **Redis 7.0**: Caching layer
- **AWS SDK**: S3 storage integration
- **Lombok**: Boilerplate code reduction
- **Maven**: Build tool

## Prerequisites

```bash
java --version          # 17 or higher
mvn --version          # 3.8 or higher
mysql --version        # 8.0 or higher
redis-server --version # 7.0 or higher
```

## Quick Start

### 1. Clone and Navigate

```bash
cd backend/spring-boot-service
```

### 2. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE auditiq_db;
CREATE USER 'auditiq'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON auditiq_db.* TO 'auditiq'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Required settings in `.env`:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=auditiq_db
DB_USERNAME=auditiq
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=auditiq-documents
ML_SERVICE_URL=http://localhost:5000
```

### 4. Start Redis

```bash
# Start Redis server
redis-server

# Or with Docker
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Verify
redis-cli ping  # Should return PONG
```

### 5. Build and Run

```bash
# Clean and install dependencies
mvn clean install

# Run application
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Application will start on `http://localhost:8080`

## API Endpoints

### Health Check
```bash
GET /actuator/health
```

### Document Operations

**Upload Document**
```bash
POST /api/audit/upload
Content-Type: multipart/form-data

Parameters:
- file: MultipartFile (PDF, DOCX, XLSX)
- standard: String (ISO_27001, GDPR, HIPAA, SOC2)
- uploadedBy: String (optional)
```

**Get All Documents**
```bash
GET /api/audit/documents
```

**Get Document by ID**
```bash
GET /api/audit/documents/{id}
```

**Analyze Document**
```bash
POST /api/audit/analyze/{documentId}
```

**Delete Document**
```bash
DELETE /api/audit/documents/{id}
```

### Checklist Operations

**Generate Checklist**
```bash
POST /api/checklist/generate/{documentId}?generatedBy={username}
```

**Get Checklist**
```bash
GET /api/checklist/{id}
GET /api/checklist/document/{documentId}
GET /api/checklist/all
```

**Update Checklist Item**
```bash
PUT /api/checklist/{id}/item/{itemIndex}/status?status=COMPLETED
PUT /api/checklist/{id}/item/{itemIndex}/notes
```

### Risk Assessment Operations

**Assess Risk**
```bash
POST /api/risk/assess/{documentId}?assessedBy={username}
```

**Get Risk Assessment**
```bash
GET /api/risk/{id}
GET /api/risk/document/{documentId}
GET /api/risk/all
GET /api/risk/level/{riskLevel}
GET /api/risk/critical
```

**Get Risk Statistics**
```bash
GET /api/risk/statistics
```

### Grammar Correction

**Correct Grammar**
```bash
POST /api/grammar/correct
Content-Type: application/json

{
  "text": "Text with grammar errors to correct"
}
```

**Correct Document Grammar**
```bash
POST /api/grammar/document/{documentId}/correct
```

### User Management

**Register User**
```bash
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secure_password",
  "fullName": "John Doe",
  "organization": "ACME Corp",
  "role": "AUDITOR"
}
```

**Get User**
```bash
GET /api/users/{id}
GET /api/users/username/{username}
GET /api/users/email/{email}
GET /api/users/all
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=DocumentAnalysisServiceTest

# Run with coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

## Building

### Development Build
```bash
mvn clean package
```

### Production Build
```bash
mvn clean package -Pprod -DskipTests
```

### Docker Build
```bash
# Build image
docker build -t auditiq-backend .

# Run container
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=mysql \
  -e REDIS_HOST=redis \
  --name auditiq-backend \
  auditiq-backend
```

## Configuration Profiles

### Development (`dev`)
- Detailed logging
- SQL debugging
- Auto-create database schema
- Local services

Activate:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production (`prod`)
- Optimized logging
- Connection pooling
- SSL enabled
- External services

Activate:
```bash
java -jar target/audit-iq-service-1.0.0.jar --spring.profiles.active=prod
```

## Project Structure

```
backend/spring-boot-service/
├── src/
│   ├── main/
│   │   ├── java/com/auditiq/
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── service/          # Business logic
│   │   │   ├── repository/       # Data access
│   │   │   ├── model/            # JPA entities
│   │   │   ├── dto/              # Data transfer objects
│   │   │   └── exception/        # Exception handling
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── logback-spring.xml
│   └── test/                     # Unit and integration tests
├── logs/                         # Application logs
├── pom.xml                       # Maven configuration
├── Dockerfile                    # Docker configuration
└── README.md                     # This file
```

## Database Schema

### Main Tables
- `audit_documents` - Document metadata
- `checklists` - Generated checklists
- `checklist_items` - Checklist items
- `risk_assessments` - Risk assessment results
- `risk_findings` - Individual risk findings
- `users` - User accounts
- `audit_logs` - Activity audit trail

### Relationships
- Document → Checklist (One-to-Many)
- Document → Risk Assessment (One-to-Many)
- Checklist → Checklist Items (One-to-Many)
- Risk Assessment → Risk Findings (One-to-Many)

## Caching Strategy

Redis caching is enabled for:
- Document retrieval (`documents` cache)
- Checklist retrieval (`checklists` cache)
- Risk assessments (`riskAssessments` cache)
- Grammar corrections (`grammar` cache)

TTL: 1 hour (configurable)

## Error Handling

All exceptions are handled globally via `GlobalExceptionHandler`:

- `ResourceNotFoundException` → 404 Not Found
- `BadRequestException` → 400 Bad Request
- `S3StorageException` → 500 Internal Server Error
- `MaxUploadSizeExceededException` → 413 Payload Too Large
- Generic exceptions → 500 Internal Server Error

## Logging

### Log Levels
- **Production**: WARN (errors and warnings only)
- **Development**: DEBUG (detailed debugging info)

### Log Files
- `logs/auditiq.log` - All logs
- `logs/error.log` - Errors only

### Log Rotation
- Max file size: 10MB
- Max history: 30 days
- Total size cap: 1GB

## Security

### Development
- HTTP enabled
- CORS allows all origins
- Debug logging enabled

### Production
- HTTPS/SSL enabled
- CORS restricted to configured origins
- Minimal logging
- Secure headers

## Performance

### Database Connection Pool
- Max pool size: 20
- Min idle: 5
- Connection timeout: 30s

### Async Processing
- Core pool size: 5
- Max pool size: 10
- Queue capacity: 100

### File Upload
- Max file size: 50MB
- Supported formats: PDF, DOCX, DOC, XLSX, XLS, TXT

## Monitoring

Access actuator endpoints:

```bash
# Health check
curl http://localhost:8080/actuator/health

# Application info
curl http://localhost:8080/actuator/info

# Metrics
curl http://localhost:8080/actuator/metrics
```

## Troubleshooting

### Database Connection Issues

```bash
# Check MySQL is running
systemctl status mysql

# Test connection
mysql -h localhost -u auditiq -p auditiq_db
```

### Redis Connection Issues

```bash
# Check Redis is running
redis-cli ping

# View Redis info
redis-cli info
```

### Build Issues

```bash
# Clean Maven cache
mvn dependency:purge-local-repository

# Rebuild from scratch
mvn clean install -U
```

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
mvn spring-boot:run -Dserver.port=8081
```

## Dependencies

Major dependencies:
- Spring Boot: 3.2.0
- Spring Data JPA: 3.2.0
- MySQL Connector: 8.1.0
- Redis: 7.0
- AWS SDK S3: 2.20.0
- Lombok: 1.18.30
- Apache POI: 5.2.3
- PDFBox: 2.0.29

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run `mvn test`
5. Submit pull request

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/auditiq/issues
- Email: support@auditiq.com