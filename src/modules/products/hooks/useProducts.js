import { useMemo, useState } from 'react';

const CATEGORIES = ['Explorar', 'Tecnología', 'Ropa', 'Accesorios', 'Salud y Belleza',  'Categoria1', 'Categoria2', 'Categoria3', 'Categoria4', 'Categoria5', 'Categoria6'];

const DATA = [
    {
        id: '1',
        title: 'Laptop Asus Zeembook',
        price: 2999.99,
        category: 'Tecnología',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&fit=crop',
    },
    {
        id: '2',
        title: 'Polo marca Sakura',
        price: 99.99,
        category: 'Ropa',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1520975944220-6cfa88b6a67f?q=80&w=800&fit=crop',
    },
    {
        id: '3',
        title: 'Zapatillas Adidas',
        price: 199.99,
        category: 'Accesorios',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
    },
    {
        id: '4',
        title: 'Tacos para mujeres',
        price: 30.99,
        category: 'Accesorios',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&fit=crop',
    },
    {
        id: '5',
        title: 'Iphone 16 PRO MAX',
        price: 3999.99,
        category: 'Categoria1',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1598327106820-19b5f97a1c5a?q=80&w=800&fit=crop',
    },
    {
        id: '6',
        title: 'Monitor Gaming',
        price: 899.99,
        category: 'Categoria2',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&fit=crop',
    },
    {
        id: '7',
        title: 'Iphone 16 PRO MAX',
        price: 3999.99,
        category: 'Categoria3',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1598327106820-19b5f97a1c5a?q=80&w=800&fit=crop',
    },
    {
        id: '8',
        title: 'Monitor Gaming',
        price: 899.99,
        category: 'Categoria4',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&fit=crop',
    },
    {
        id: '9',
        title: 'Iphone 16 PRO MAX',
        price: 3999.99,
        category: 'Categoria5',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1598327106820-19b5f97a1c5a?q=80&w=800&fit=crop',
    },
    {
        id: '10',
        title: 'Monitor Gaming',
        price: 899.99,
        category: 'Categoria6',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&fit=crop',
    },
];

export default function useProducts() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Explorar');

    const list = useMemo(() => {
        return DATA.filter((p) => {
            const byCat = category === 'Explorar' ? true : p.category === category;
            const bySearch = search.length === 0 ? true : p.title.toLowerCase().includes(search.toLowerCase());
            return byCat && bySearch;
        });
    }, [search, category]);

    return { categories: CATEGORIES, products: list, search, setSearch, category, setCategory };
}