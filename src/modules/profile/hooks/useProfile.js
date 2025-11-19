import { useState, useEffect } from 'react';
import API_CONFIG from '../../../config/api';
import { User } from '../models/User';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useProfile = (userId = 1) => {
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
      
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
      
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
      
      const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/addresses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAddresses(data.data);
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
      
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      return { success: false, error: 'Error al agregar dirección' };
    } finally {
      setLoading(false);
    }
  };

  // Obtener métodos de pago
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/payment-methods`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentMethods(data.data);
      }
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
      // No establecer error aquí para no afectar la UI principal
    }
  };

  // Agregar método de pago
  const addPaymentMethod = async (paymentData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/profile/${userId}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      return { success: false, error: 'Error al agregar método de pago' };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
    fetchPaymentMethods();
  }, [userId]);

  return {
    profile,
    addresses,
    paymentMethods,
    loading,
    error,
    updateProfile,
    addAddress,
    addPaymentMethod,
    refreshProfile: fetchProfile,
    refreshAddresses: fetchAddresses,
    refreshPaymentMethods: fetchPaymentMethods,
  };
};