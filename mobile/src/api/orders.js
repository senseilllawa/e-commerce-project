import apiClient from './client';

export const ordersAPI = {
  getOrders: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/orders', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrder: async (id) => {
    try {
      const response = await apiClient.get(`/api/v1/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createOrder: async (cartItems) => {
    try {
      const response = await apiClient.post('/api/v1/orders', {
        cart_items: cartItems,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
