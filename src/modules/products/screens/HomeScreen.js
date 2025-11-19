import React from 'react';
import { View, TextInput, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import useProducts from '../hooks/useProducts';
import styles from '../styles/homeStyles';

export default function HomeScreen() {
  const { categories, products, search, setSearch, category, setCategory } = useProducts();

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Buscar en la aplicación..."
          value={search}
          onChangeText={setSearch}
          style={{ marginLeft: 8, flex: 1 }}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
        {categories.map((c) => (
          <CategoryChip key={c} label={c} selected={c === category} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}