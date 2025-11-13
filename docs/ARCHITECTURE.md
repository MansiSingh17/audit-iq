# AuditIQ Architecture

## System Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │◄────►│ Spring Boot  │◄────►│   Python    │
│  Frontend   │      │   Backend    │      │ ML Service  │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
           ┌────▼───┐  ┌───▼────┐  ┌──▼────┐
           │  MySQL │  │ Redis  │  │ AWS S3│
           └────────┘  └────────┘  └───────┘
```

## Components
- **Frontend**: React SPA with TypeScript
- **API Gateway**: Spring Boot REST API
- **ML Service**: Python Flask + HuggingFace T5
- **Database**: MySQL for persistence
- **Cache**: Redis for performance
- **Storage**: AWS S3 for documents
