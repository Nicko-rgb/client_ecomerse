import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';
import { useProducts, useCategories } from '../hooks/useProducts';
import styles from '../styles/homeStyles';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default function HomeScreen() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Explorar');
    const selectedCategory = useMemo(() => (category === 'Explorar' ? undefined : category), [category]);
    const { products: apiProducts, loading: loadingProducts, error: errorProducts, refreshing, loadingMore, hasMore, refreshProducts, loadMore } = useProducts({ category: selectedCategory, search });
    const { categories: apiCategories, loading: loadingCategories } = useCategories();

    // Agregar "Explorar" al inicio de las categorías
    // Las categorías de la API vienen como objetos {name, count}, extraer solo el nombre
    const categories = useMemo(() => {
        const categoryNames = apiCategories.map(cat => 
            typeof cat === 'string' ? cat : cat.name || cat
        );
        return ['Explorar', ...categoryNames];
    }, [apiCategories]);

    // Productos provienen del servidor con filtros y paginación
    const products = apiProducts;

    if (loadingProducts || loadingCategories) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12, color: colors.gray }}>Cargando productos...</Text>
            </View>
        );
    }

    if (errorProducts) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ color: colors.error, textAlign: 'center' }}>Error: {errorProducts}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />
            {/* Search Box */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    placeholder="Buscar en la aplicación..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginLeft: 8, flex: 1 }}
                />
            </View>
            {/* Category Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsRow}
                contentContainerStyle={styles.chipsContent}
            >
                {categories.map((c, index) => (
                    <TouchableOpacity
                        key={`category-${index}-${c}`}
                        onPress={() => setCategory(c)}
                        style={[styles.chip, category === c && { backgroundColor: colors.primary }]}
                    >
                        <Text style={[styles.chipText, { fontFamily: fontNames.playpenBold }, category === c && { color: '#fff' }]}>
                            {typeof c === 'string' ? c : c.name || 'Sin categoría'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Product Grid */}
            {products.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 18, color: colors.gray, textAlign: 'center' }}>
                        No se encontraron productos
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item, index) => `product-${item._id || item.id || index}`}
                    renderItem={({ item, index }) => (
                        <View style={[styles.cardItem, index % 2 === 0 && { marginRight: 8 }]}>
                            <ProductCard product={item} />
                        </View>
                    )}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => refreshProducts({ category: selectedCategory, search })} />}
                    onEndReached={() => hasMore && loadMore()}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={loadingMore ? (
                        <View style={{ paddingVertical: 16 }}>
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                    ) : null}
                />
            )}
        </View>
    );
}
