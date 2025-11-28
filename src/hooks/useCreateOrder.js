import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG, { apiClient } from '../config/api';

export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No autenticado');
      }
      
      const { data } = await apiClient.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Error al crear el pedido');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error al crear el pedido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createOrder,
    loading,
    error
  };
};