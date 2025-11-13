import api from './api';

export interface Checklist {
  id: number;
  standardName: string;
  standard: string;
  totalItems: number;
  completedItems: number;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
  generatedBy: string;
}

export interface ChecklistItem {
  id: number;
  itemNumber: number;
  requirement: string;
  description: string;
  completed: boolean;
  priority: string;
  notes?: string;
}

export const checklistService = {
  generateChecklist: async (documentId: number): Promise<Checklist> => {
    const response = await api.post(`/api/checklists/generate/${documentId}`);
    return response.data;
  },

  getChecklistById: async (id: number): Promise<Checklist> => {
    const response = await api.get(`/api/checklists/${id}`);
    return response.data;
  },

  getChecklistByDocument: async (documentId: number): Promise<Checklist[]> => {
    const response = await api.get(`/api/checklists/document/${documentId}`);
    return response.data;
  },

  getAllChecklists: async (): Promise<Checklist[]> => {
    const response = await api.get('/api/checklists');
    return response.data;
  },

  updateItemStatus: async (checklistId: number, itemNumber: number, completed: boolean): Promise<Checklist> => {
  const response = await api.put(`/api/checklists/${checklistId}/items/${itemNumber}?completed=${completed}`);
  return response.data;
},

  deleteChecklist: async (id: number) => {
  await api.delete(`/api/checklists/${id}`);
    }
};
