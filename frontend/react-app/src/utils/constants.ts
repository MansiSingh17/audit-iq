export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '60000');

export const COMPLIANCE_STANDARDS = {
  ISO_27001: 'ISO 27001:2022',
  GDPR: 'General Data Protection Regulation',
  HIPAA: 'Health Insurance Portability and Accountability Act',
  SOC2: 'SOC 2 Type II',
} as const;

export const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
] as const;

export const RISK_COLORS = {
  CRITICAL: 'text-red-600',
  HIGH: 'text-orange-600',
  MEDIUM: 'text-yellow-600',
  LOW: 'text-green-600',
  MINIMAL: 'text-blue-600',
} as const;