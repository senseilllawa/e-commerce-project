import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authAPI = {
  signUp: async (userData) => {
    try {
      const response = await apiClient.post('/users/sign_up', {
        user: userData,
      }, {
        headers: { 'Accept': 'application/json' }
      });

      const token = response.headers.authorization?.split(' ')[1];
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        const userDataToStore = response.data.data || response.data;
        await AsyncStorage.setItem('currentUser', JSON.stringify(userDataToStore));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signIn: async (email, password) => {
    try {
      const response = await apiClient.post('/users/sign_in', {
        user: { email, password },
      }, {
        headers: { 'Accept': 'application/json' }
      });
      
      const token = response.headers.authorization?.split(' ')[1];
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        const userDataToStore = response.data.data || response.data;
        await AsyncStorage.setItem('currentUser', JSON.stringify(userDataToStore));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signOut: async () => {
    try {
      await apiClient.delete('/users/sign_out');
    } catch (error) {
      // Оставляем только технический лог, если нужно для дебага
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userJson = await AsyncStorage.getItem('currentUser');
      
      if (token && userJson) {
        return {
          isAuthenticated: true,
          user: JSON.parse(userJson),
        };
      }
      return { isAuthenticated: false, user: null };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  },
};