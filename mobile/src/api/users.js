import apiClient from './client';

export const usersAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/v1/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/api/v1/profile', {
        user: userData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUser: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${id}`, {
        user: userData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
