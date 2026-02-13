import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authAPI = {
  // Регистрация нового аккаунта
  signUp: async (userData) => {
    try {
      const response = await apiClient.post('/users/sign_up', {
        user: userData,
      });

      const token = response.headers.authorization?.split(' ')[1];
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Вход в систему
  signIn: async (email, password) => {
    try {
      const response = await apiClient.post('/users/sign_in', {
        user: { email, password },
      });
      
      const token = response.headers.authorization?.split(' ')[1];
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Выход из аккаунта
  signOut: async () => {
    try {
      await apiClient.delete('/users/sign_out');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('currentUser');
    }
  },

  // Проверка состояния авторизации при запуске приложения
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
    } catch (error) {
      return { isAuthenticated: false, user: null };
    }
  },
};
