import React from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ProductCard from '../components/ProductCard';
import useProducts from '../hooks/useProducts';
import styles from '../styles/homeStyles';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default function HomeScreen() {
    const { categories, products, search, setSearch, category, setCategory } = useProducts();

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={styles.chipsContent}>
                {categories.map((c) => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setCategory(c)}
                        style={[styles.chip, category === c && { backgroundColor: colors.primary }]}
                    >
                        <Text style={[styles.chipText, { fontFamily: fontNames.playpenBold }, category === c && { color: '#fff' }]}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Product Grid */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={[styles.cardItem, index % 2 === 0 && { marginRight: 8 }]}>
                        <ProductCard product={item} />
                    </View>
                )}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}