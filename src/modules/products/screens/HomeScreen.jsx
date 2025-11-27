import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';
import { useProducts, useCategories, useFeaturedProducts } from '../hooks/useProducts';
import styles from '../styles/homeStyles';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Explorar');
    const selectedCategory = useMemo(() => (category === 'Explorar' ? undefined : category), [category]);
    const { products: apiProducts, loading: loadingProducts, error: errorProducts, refreshing, loadingMore, hasMore, refreshProducts, loadMore } = useProducts({ category: selectedCategory, search });
    const { categories: apiCategories, loading: loadingCategories } = useCategories();
    const { products: featured, loading: loadingFeatured, refreshProducts: refreshFeatured } = useFeaturedProducts();

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
                        <View style={styles.cardItem}>
                            <ProductCard product={item} />
                        </View>
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.gridColumn}
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => Promise.all([refreshProducts({ category: selectedCategory, search }), refreshFeatured()])} />}
                    onEndReached={() => hasMore && loadMore()}
                    onEndReachedThreshold={0.3}
                    ListHeaderComponent={(
                        <View style={styles.sliderContainer}>
                            {loadingFeatured ? (
                                <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            ) : (
                                <FlatList
                                    data={featured}
                                    keyExtractor={(item, index) => `featured-${item.id || index}`}
                                    horizontal
                                    pagingEnabled
                                    // style={{borderWidth: 1}}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        const productData = {
                                            id: item._id || item.id,
                                            title: item.name || item.title,
                                            price: item.price,
                                            image: item.images?.[0] || item.image || 'https://via.placeholder.com/600',
                                            rating: item.rating || 5,
                                            category: item.category,
                                            description: item.description,
                                            stock: item.stock
                                        };
                                        const { width } = Dimensions.get('window');
                                        return (
                                            <TouchableOpacity style={{ width }} activeOpacity={0.9} onPress={() => navigation.navigate('Producto', { product: productData })}>
                                                <View style={{ height: 200, marginHorizontal: 6, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.card }}>
                                                    <LottieView
                                                        source={require('../../../../assets/lottie/Fire.json')}
                                                        style={{ position: 'absolute', top: 8, right: 8, width: 36, height: 36, zIndex: 100 }}
                                                        autoPlay
                                                        loop
                                                    />
                                                    <Image source={{ uri: productData.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, backgroundColor: 'rgba(0,0,0,0.35)' }}>
                                                        <Text style={{ color: '#fff', fontFamily: fontNames.playpenBold, fontSize: 16 }} numberOfLines={1}>{productData.title}</Text>
                                                        <Text style={{ color: '#fff' }}>$ {productData.price?.toFixed ? productData.price.toFixed(2) : productData.price}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            )}
                        </View>
                    )}
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
