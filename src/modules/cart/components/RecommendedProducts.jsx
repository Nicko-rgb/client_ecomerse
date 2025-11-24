import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../theme/colors';
import { useCart } from '../../../context/CartContext';
import useProducts from '../../products/hooks/useProducts';

export default function RecommendedProducts() {
  const navigation = useNavigation();
  const { addToCart, items: cartItems } = useCart();
  const { products } = useProducts();
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Filtrar productos que NO están en el carrito
    const cartProductIds = cartItems.map(item => item.id);
    const filtered = products
      .filter(product => !cartProductIds.includes(product.id))
      .slice(0, 6); // Mostrar máximo 6 productos
    
    setRecommendedProducts(filtered);
  }, [products, cartItems]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('Producto', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < (item.rating || 4) ? 'star' : 'star-outline'} 
            color={colors.secondary} 
            size={14} 
          />
        ))}
      </View>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          handleAddToCart(item);
        }}
      >
        <Ionicons name="add" size={18} color={colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (recommendedProducts.length === 0) {
    return null; // No mostrar nada si no hay productos recomendados
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={20} color={colors.primary} />
        <Text style={styles.title}>También te puede gustar</Text>
      </View>
      <FlatList
        data={recommendedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: 20,
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 140,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.lightBackground,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    minHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
