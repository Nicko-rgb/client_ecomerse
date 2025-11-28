import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../../../config/api';
import { User } from '../models/User';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener perfil del usuario
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener token
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!token || !user) {
        setError('No autenticado');
        return;
      }
      
      const profileUserId = userId || user.id;
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Convertir los datos a una instancia de User
        const userInstance = new User(data.data);
        setProfile(userInstance);
      } else {
        setError('Error al cargar el perfil');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const profileUserId = userId || (user ? user.id : null);
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Convertir los datos actualizados a una instancia de User
        const userInstance = new User(data.data);
        setProfile(userInstance);
        return { success: true, message: data.message };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      const errorMsg = 'Error al actualizar el perfil';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Obtener direcciones
  const fetchAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      // No hacer request si no hay usuario autenticado
      if (!token || !user) {
        return;
      }
      
      const profileUserId = userId || user.id;
      const url = `${API_BASE_URL}/profile/${profileUserId}/addresses`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch (err) {
      console.error('Error al cargar direcciones:', err);
      // No establecer error aquí para no afectar la UI principal
    }
  };

  // Agregar dirección
  const addAddress = async (addressData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!token || !user) {
        return { success: false, error: 'No autenticado' };
      }
      
      const profileUserId = userId || user.id;
      const url = `${API_BASE_URL}/profile/${profileUserId}/addresses`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchAddresses(); // Recargar direcciones
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Error al agregar dirección' };
      }
    } catch (err) {
      console.error('Error al agregar dirección:', err);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  // Obtener métodos de pago
  const fetchPaymentMethods = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      // No hacer request si no hay usuario autenticado
      if (!token || !user) {
        return;
      }
      
      const profileUserId = userId || user.id;
      const url = `${API_BASE_URL}/profile/${profileUserId}/payment-methods`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentMethods(data.data || []);
      }
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
      // No establecer error aquí para no afectar la UI principal
    }
  };

  // Actualizar dirección
  const updateAddress = async (addressId, addressData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const profileUserId = userId || (user ? user.id : null);
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchAddresses(); // Recargar direcciones
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al actualizar dirección' };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar dirección
  const deleteAddress = async (addressId) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const profileUserId = userId || (user ? user.id : null);
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchAddresses(); // Recargar direcciones
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al eliminar dirección' };
    } finally {
      setLoading(false);
    }
  };

  // Agregar método de pago
  const addPaymentMethod = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!token || !user) {
        return { success: false, error: 'No autenticado' };
      }
      
      const profileUserId = userId || user.id;
      const url = `${API_BASE_URL}/profile/${profileUserId}/payment-methods`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchPaymentMethods(); // Recargar métodos de pago
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Error al agregar método de pago' };
      }
    } catch (err) {
      console.error('Error al agregar método de pago:', err);
      return { success: false, error: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar método de pago
  const updatePaymentMethod = async (paymentMethodId, paymentData) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const profileUserId = userId || (user ? user.id : null);
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}/payment-methods/${paymentMethodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPaymentMethods(); // Recargar métodos de pago
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al actualizar método de pago' };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar método de pago
  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const profileUserId = userId || (user ? user.id : null);
      
      const response = await fetch(`${API_BASE_URL}/profile/${profileUserId}/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchPaymentMethods(); // Recargar métodos de pago
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error al eliminar método de pago' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      
      // Solo cargar datos si hay usuario autenticado
      if (token && user) {
        fetchProfile();
        fetchAddresses();
        fetchPaymentMethods();
      }
    };
    
    loadData();
  }, [userId]);

  // Agregar listener para refrescar cuando la pantalla recibe foco
  useEffect(() => {
    const refreshData = () => {
      fetchAddresses();
      fetchPaymentMethods();
    };
    
    // Refrescar datos cada vez que el hook se use
    refreshData();
  }, []);

  return {
    profile,
    addresses,
    paymentMethods,
    loading,
    error,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    refreshProfile: fetchProfile,
    refreshAddresses: fetchAddresses,
    refreshPaymentMethods: fetchPaymentMethods,
  };
};