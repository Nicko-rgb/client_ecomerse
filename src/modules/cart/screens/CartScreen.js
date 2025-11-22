import React, { useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import CartSummary from '../components/CartSummary';
import ProductDetailModal from '../components/ProductDetailModal';
import { cartStyles } from '../styles/cartStyles';

export default function CartScreen({ navigation }) {
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity,
    addToCart,
    clearCart,
    getSubtotal,
    getTotalItems
  } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Iniciar Sesión',
        'Debes iniciar sesión para continuar con la compra',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar Sesión', 
            onPress: () => navigation.navigate('LoginScreen')
          }
        ]
      );
      return;
    }

    // Continuar con el checkout
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={cartStyles.container}>
        <EmptyCart />
      </View>
    );
  }

  return (
    <View style={cartStyles.container}>
      <View style={cartStyles.header}>
        <Text style={cartStyles.headerTitle}>Mi Carrito</Text>
        <Text style={cartStyles.headerSubtitle}>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={cartStyles.listContent}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={() => incrementQuantity(item.id)}
            onDecrement={() => decrementQuantity(item.id)}
            onRemove={() => removeFromCart(item.id)}
            onPress={() => handleProductPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <CartSummary 
        subtotal={subtotal}
        onCheckout={handleCheckout}
      />

      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={() => selectedProduct && addToCart(selectedProduct)}
        onRemove={() => selectedProduct && removeFromCart(selectedProduct.id)}
      />
    </View>
  );
}