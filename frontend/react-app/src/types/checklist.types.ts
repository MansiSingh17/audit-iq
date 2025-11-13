export interface Checklist {
  id: number;
  title: string;
  standard: string;
  documentId: number;
  totalItems: number;
  completedItems: number;
  items: ChecklistItem[];
  description?: string;
  generatedBy: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  requirement: string;
  description: string;
  category: string;
  priority: ChecklistPriority;
  status: ChecklistStatus;
  controlId: string;
  notes?: string;
}

export enum ChecklistPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ChecklistStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}