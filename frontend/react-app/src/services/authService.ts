import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  organization: string;
  role: string;
}

export const authService = {
  register: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};