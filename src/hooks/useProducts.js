import { useState, useEffect } from 'react';
import API_CONFIG from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (customFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({ ...filters, ...customFilters }).toString();
      const url = `${API_BASE_URL}/products${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchProducts
  };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products/featured`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refreshProducts: fetchFeaturedProducts
  };
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refreshCategories: fetchCategories
  };
};

export const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Obtener producto
      const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
      
      if (!productResponse.ok) {
        throw new Error(`HTTP error! status: ${productResponse.status}`);
      }
      
      const productData = await productResponse.json();
      
      if (productData.success) {
        setProduct(productData.data);
        
        // Obtener productos relacionados
        const relatedResponse = await fetch(`${API_BASE_URL}/products/${productId}/related`);
        const relatedData = await relatedResponse.json();
        
        if (relatedData.success) {
          setRelatedProducts(relatedData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  return {
    product,
    relatedProducts,
    loading,
    error,
    refreshProduct: fetchProductDetails
  };
};