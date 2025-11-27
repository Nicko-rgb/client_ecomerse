import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG, { apiClient } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setError('No autenticado');
        return;
      }
      
      const { data } = await apiClient.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError('Error al cargar pedidos');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders
  };
};

export const useOrderDetails = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setError('No autenticado');
        return;
      }
      
      const { data } = await apiClient.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data.success) {
        setOrder(data.data);
      } else {
        setError('Error al cargar detalles del pedido');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  return {
    order,
    loading,
    error,
    refreshOrder: fetchOrderDetails
  };
};
