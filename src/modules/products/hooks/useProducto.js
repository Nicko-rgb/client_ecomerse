import { useMemo, useState } from 'react';
import useProducts from './useProducts';

export default function useProducto(product) {
    const [selected, setSelected] = useState(0);
    const gallery = useMemo(() => {
        const arr = [product.image];
        return [product.image, ...arr, ...arr].slice(0, 4);
    }, [product.image]);

    const { products } = useProducts();
    const similares = useMemo(() => {
        return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    }, [products, product]);

    return { gallery, selected, setSelected, similares };
}