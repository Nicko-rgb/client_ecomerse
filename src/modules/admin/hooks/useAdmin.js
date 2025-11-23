import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useAdmin = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener estadísticas del dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      // Solo hacer request si hay token y es admin
      if (!token || !user || user.role !== 'admin') {
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDashboardStats(data.data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener actividad reciente
  const fetchRecentActivity = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      
      // Solo hacer request si hay token y es admin
      if (!token || !user || user.role !== 'admin') {
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecentActivity(data.data);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      // Solo cargar si es admin
      if (user && user.role === 'admin') {
        fetchDashboardStats();
        fetchRecentActivity();
      }
    };
    
    loadData();
  }, []);

  return {
    dashboardStats,
    recentActivity,
    loading,
    error,
    refreshDashboard: () => {
      fetchDashboardStats();
      fetchRecentActivity();
    }
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No autenticado');
        return;
      }
      
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchProducts();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al crear producto' };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchProducts();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al actualizar producto' };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchProducts();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al eliminar producto' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.role === 'admin') {
        fetchProducts();
      }
    };
    loadData();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No autenticado');
        return;
      }
      
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/orders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, statusData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchOrders();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al actualizar pedido' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.role === 'admin') {
        fetchOrders();
      }
    };
    loadData();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  };
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No autenticado');
        return;
      }
      
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchUsers();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al actualizar usuario' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (user && user.role === 'admin') {
        fetchUsers();
      }
    };
    loadData();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser
  };
};