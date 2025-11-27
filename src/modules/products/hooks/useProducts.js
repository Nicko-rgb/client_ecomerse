import { useState, useEffect, useMemo } from 'react';
import API_CONFIG, { apiClient } from '../../../config/api';

export const useProducts = (filters = {}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async (customFilters = {}, { reset = false } = {}) => {
        try {
            const targetPage = reset ? 1 : page;
            if (reset) {
                setRefreshing(true);
                setError(null);
            } else {
                setLoading(true);
            }
            const params = { ...filters, ...customFilters, page: targetPage, limit, random: true };
            const { data } = await apiClient.get('/products', { params });
            if (data.success) {
                const incoming = data.data || [];
                setHasMore(Boolean(data.hasMore));
                if (reset) {
                    setProducts(incoming);
                    setPage(1);
                } else {
                    setProducts(prev => {
                        const map = new Map(prev.map(p => [p.id || p._id, p]));
                        for (const item of incoming) {
                            const key = item.id || item._id;
                            if (!map.has(key)) map.set(key, item);
                        }
                        return Array.from(map.values());
                    });
                }
            } else {
                setError('Error al cargar productos');
            }
        } catch (err) {
            setError(`Error de conexión: ${err.message}`);
        } finally {
            if (reset) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const params = { ...filters, page: nextPage, limit, random: true };
            const { data } = await apiClient.get('/products', { params });
            if (data.success) {
                const incoming = data.data || [];
                setHasMore(Boolean(data.hasMore));
                setProducts(prev => [...prev, ...incoming]);
                setPage(nextPage);
            }
        } catch (err) {
            // no bloquear UI por error de loadMore
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        // refetch cuando cambian filtros
        setPage(1);
        setHasMore(true);
        fetchProducts({}, { reset: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    return { products, loading, error, refreshing, loadingMore, hasMore, refreshProducts: (custom) => fetchProducts(custom, { reset: true }), loadMore };
};

export const useFeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await apiClient.get('/products/featured');
            if (data.success) {
                setProducts(data.data);
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    return { products, loading, error, refreshProducts: fetchFeaturedProducts };
};

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await apiClient.get('/products/categories');
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, refreshCategories: fetchCategories };
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
            const { data: productData } = await apiClient.get(`/products/${productId}`);
            if (productData.success) {
                setProduct(productData.data);
                const { data: relatedData } = await apiClient.get(`/products/${productId}/related`);
                if (relatedData.success) {
                    setRelatedProducts(relatedData.data);
                }
            }
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    return { product, relatedProducts, loading, error, refreshProduct: fetchProductDetails };
};

export const useProducto = (product) => {
    const [selected, setSelected] = useState(0);
    const gallery = useMemo(() => {
        const arr = [product.image];
        return [product.image, ...arr, ...arr].slice(0, 4);
    }, [product.image]);

    const { products } = useProducts();
    const similares = useMemo(() => {
        return products
            .filter((p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id))
            .slice(0, 4);
    }, [products, product]);

    return { gallery, selected, setSelected, similares };
};
