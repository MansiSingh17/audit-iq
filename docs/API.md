# AuditIQ API Documentation

## Base URL
`http://localhost:8080/api`

## Endpoints

### Documents
- `POST /documents/upload` - Upload document
- `GET /documents` - List documents
- `GET /documents/{id}` - Get document
- `DELETE /documents/{id}` - Delete document

### Checklists
- `POST /checklists/generate/{documentId}` - Generate checklist
- `GET /checklists/{id}` - Get checklist
- `PUT /checklists/{id}/items/{itemNumber}` - Update item

### Risk Assessment
- `POST /risk-assessments/assess/{documentId}` - Assess risk
- `GET /risk-assessments/{id}` - Get assessment

### Grammar
- `POST /grammar/correct` - Correct grammar
