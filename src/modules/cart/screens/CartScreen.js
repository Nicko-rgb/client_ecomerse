import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import CartSummary from '../components/CartSummary';
import ProductDetailModal from '../components/ProductDetailModal';
import FreeShippingProgress from '../components/FreeShippingProgress';
import RecommendedProducts from '../components/RecommendedProducts';
import DeliveryEstimate from '../components/DeliveryEstimate';
import PaymentMethods from '../components/PaymentMethods';
import CartActions from '../components/CartActions';
import { cartStyles } from '../styles/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import ModalMessage from '../../../components/ModalMessage';

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
  const [loginModalVisible, setLoginModalVisible] = useState(false);

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
      setLoginModalVisible(true);
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

  const ListHeaderComponent = () => (
    <>
      <FreeShippingProgress subtotal={subtotal} />
    </>
  );

  const ListFooterComponent = () => (
    <>
      <PaymentMethods />
      <DeliveryEstimate />
      <CartActions onClearCart={clearCart} items={items} />
      <RecommendedProducts />
    </>
  );

  return (
    <View style={cartStyles.container}>
      <View style={cartStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="cart" size={24} color={colors.primary} />
          <Text style={cartStyles.headerTitle}>Mi Carrito</Text>
        </View>
        <Text style={cartStyles.headerSubtitle}>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={cartStyles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
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

      <ModalMessage
        visible={loginModalVisible}
        type="info"
        title="Iniciar Sesión"
        message="Debes iniciar sesión para continuar con la compra"
        secondaryLabel="Cancelar"
        onSecondary={() => setLoginModalVisible(false)}
        primaryLabel="Iniciar Sesión"
        onPrimary={() => {
          setLoginModalVisible(false);
          navigation.navigate('LoginScreen');
        }}
        onClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
}
