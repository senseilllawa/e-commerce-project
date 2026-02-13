import apiClient from './client';

export const itemsAPI = {
  getItems: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/items', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getItem: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createItem: async (itemData) => {
    try {
      const response = await apiClient.post('/api/v1/items', {
        item: itemData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await apiClient.put(`/api/v1/items/${id}`, {
        item: itemData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchItems: async (query) => {
    try {
      const response = await apiClient.get('/api/v1/items', {
        params: { search: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
