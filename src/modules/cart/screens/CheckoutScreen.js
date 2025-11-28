import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../../../context/CartContext';
import { useCreateOrder } from '../../../hooks/useCreateOrder';
import { useProfile } from '../../../modules/profile/hooks/useProfile';
import OrderSummaryExpandable from '../components/OrderSummaryExpandable';
import { checkoutStyles } from '../styles/checkoutStyles';
import colors from '../../../theme/colors';

export default function CheckoutScreen({ navigation }) {
  const { items, getSubtotal, clearCart } = useCart();
  const { createOrder, loading: orderLoading } = useCreateOrder();
  const { profile, addresses } = useProfile();
  
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Cargar datos del usuario automáticamente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Cargar datos del perfil
        if (profile) {
          setShippingAddress(prev => ({
            ...prev,
            fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            phone: profile.phone || ''
          }));
        }

        // Cargar dirección principal si existe
        if (addresses && addresses.length > 0) {
          const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];
          if (primaryAddress) {
            // Parsear la dirección completa
            const addressParts = primaryAddress.fullAddress?.split(', ') || [];
            setShippingAddress(prev => ({
              ...prev,
              address: addressParts[0] || '',
              city: addressParts[1] || '',
              zipCode: addressParts[2] || ''
            }));
            setDeliveryNotes(primaryAddress.reference || '');
          }
        }
      } catch (error) {
        console.log('Error cargando datos del usuario:', error);
      }
    };

    loadUserData();
  }, [profile, addresses]);

  const subtotal = getSubtotal();
  const shipping = 5.00;
  const tax = subtotal * 0.10;
  const total = subtotal + shipping + tax;

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.zipCode) {
      Alert.alert('Error', 'Por favor completa todos los campos de envío');
      return false;
    }

    if (selectedPayment === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        Alert.alert('Error', 'Por favor completa todos los datos de la tarjeta');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Error', 'Número de tarjeta inválido');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const orderData = {
      items: items.map(item => ({
        name: item.name || item.title || 'Producto sin nombre',
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        product: {
          name: item.name || item.title || 'Producto sin nombre',
          image: item.image
        }
      })),
      shippingAddress: {
        fullAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.zipCode}`,
        reference: deliveryNotes || 'Sin notas especiales',
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone
      },
      paymentMethod: {
        type: selectedPayment,
        title: selectedPayment === 'card' ? `Tarjeta **** ${cardNumber.slice(-4)}` :
               selectedPayment === 'paypal' ? 'PayPal' : 'Pago en efectivo'
      },
      totalAmount: total
    };

    const result = await createOrder(orderData);

    if (result.success) {
      clearCart();
      navigation.replace('OrderConfirmation', {
        orderNumber: result.data._id,
        total: total,
        estimatedDelivery: '3-5 días hábiles'
      });
    } else {
      Alert.alert(
        'Error al procesar pedido',
        result.error || 'Hubo un problema al procesar tu pedido. Por favor intenta nuevamente.',
        [
          { text: 'OK' }
        ]
      );
    }
  };

  return (
    <View style={checkoutStyles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={checkoutStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={checkoutStyles.section}>
            <OrderSummaryExpandable
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </View>

          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>
              <Ionicons name="location" size={20} color={colors.primary} /> Dirección de Envío
            </Text>
            {profile && (
              <View style={styles.autoFillContainer}>
                <Text style={styles.autoFillText}>
                  ✅ Datos cargados automáticamente desde tu perfil
                </Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={() => {
                    // Recargar datos del perfil
                    window.location.reload?.() || navigation.replace('CheckoutScreen');
                  }}
                >
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                  <Text style={styles.refreshText}>Actualizar</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={checkoutStyles.card}>
              <TextInput
                style={checkoutStyles.input}
                placeholder="Nombre completo"
                value={shippingAddress.fullName}
                onChangeText={(text) => setShippingAddress({...shippingAddress, fullName: text})}
              />
              <TextInput
                style={checkoutStyles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={shippingAddress.phone}
                onChangeText={(text) => setShippingAddress({...shippingAddress, phone: text})}
              />
              <TextInput
                style={checkoutStyles.input}
                placeholder="Dirección completa"
                value={shippingAddress.address}
                onChangeText={(text) => setShippingAddress({...shippingAddress, address: text})}
              />
              <View style={checkoutStyles.row}>
                <TextInput
                  style={[checkoutStyles.input, checkoutStyles.halfInput]}
                  placeholder="Ciudad"
                  value={shippingAddress.city}
                  onChangeText={(text) => setShippingAddress({...shippingAddress, city: text})}
                />
                <TextInput
                  style={[checkoutStyles.input, checkoutStyles.halfInput]}
                  placeholder="Código Postal"
                  keyboardType="numeric"
                  value={shippingAddress.zipCode}
                  onChangeText={(text) => setShippingAddress({...shippingAddress, zipCode: text})}
                />
              </View>
              <TextInput
                style={[checkoutStyles.input, checkoutStyles.textArea]}
                placeholder="Notas de entrega (opcional)"
                placeholderTextColor={colors.muted}
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={checkoutStyles.section}>
            <Text style={checkoutStyles.sectionTitle}>
              <Ionicons name="card" size={20} color={colors.primary} /> Método de Pago
            </Text>
            
            <View style={checkoutStyles.paymentMethods}>
              <TouchableOpacity
                style={[
                  checkoutStyles.paymentOption,
                  selectedPayment === 'card' && checkoutStyles.paymentOptionActive
                ]}
                onPress={() => setSelectedPayment('card')}
              >
                <Ionicons 
                  name="card" 
                  size={24} 
                  color={selectedPayment === 'card' ? colors.primary : colors.muted} 
                />
                <Text style={[
                  checkoutStyles.paymentText,
                  selectedPayment === 'card' && checkoutStyles.paymentTextActive
                ]}>
                  Tarjeta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  checkoutStyles.paymentOption,
                  selectedPayment === 'paypal' && checkoutStyles.paymentOptionActive
                ]}
                onPress={() => setSelectedPayment('paypal')}
              >
                <Ionicons 
                  name="logo-paypal" 
                  size={24} 
                  color={selectedPayment === 'paypal' ? colors.primary : colors.muted} 
                />
                <Text style={[
                  checkoutStyles.paymentText,
                  selectedPayment === 'paypal' && checkoutStyles.paymentTextActive
                ]}>
                  PayPal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  checkoutStyles.paymentOption,
                  selectedPayment === 'cash' && checkoutStyles.paymentOptionActive
                ]}
                onPress={() => setSelectedPayment('cash')}
              >
                <Ionicons 
                  name="cash" 
                  size={24} 
                  color={selectedPayment === 'cash' ? colors.primary : colors.muted} 
                />
                <Text style={[
                  checkoutStyles.paymentText,
                  selectedPayment === 'cash' && checkoutStyles.paymentTextActive
                ]}>
                  Efectivo
                </Text>
              </TouchableOpacity>
            </View>

            {selectedPayment === 'card' && (
              <View style={checkoutStyles.card}>
                <TextInput
                  style={checkoutStyles.input}
                  placeholder="Número de tarjeta"
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  maxLength={19}
                />
                <TextInput
                  style={checkoutStyles.input}
                  placeholder="Nombre en la tarjeta"
                  value={cardName}
                  onChangeText={setCardName}
                />
                <View style={checkoutStyles.row}>
                  <TextInput
                    style={[checkoutStyles.input, checkoutStyles.halfInput]}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    maxLength={5}
                  />
                  <TextInput
                    style={[checkoutStyles.input, checkoutStyles.halfInput]}
                    placeholder="CVV"
                    keyboardType="numeric"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {selectedPayment === 'paypal' && (
              <View style={checkoutStyles.card}>
                <Text style={checkoutStyles.infoText}>
                  Serás redirigido a PayPal para completar el pago de forma segura.
                </Text>
              </View>
            )}

            {selectedPayment === 'cash' && (
              <View style={checkoutStyles.card}>
                <Text style={checkoutStyles.infoText}>
                  Pagarás en efectivo al recibir tu pedido. Asegúrate de tener el monto exacto.
                </Text>
              </View>
            )}
          </View>

          <View style={checkoutStyles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            <Text style={checkoutStyles.securityText}>
              Tu información está protegida con encriptación SSL
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={checkoutStyles.footer}>
        <TouchableOpacity 
          style={[checkoutStyles.placeOrderButton, orderLoading && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={orderLoading}
        >
          {orderLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={checkoutStyles.placeOrderText}>
              Confirmar Pedido - ${total.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  autoFillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4
  },
  autoFillText: {
    fontSize: 12,
    color: colors.success || '#4CAF50',
    fontStyle: 'italic',
    flex: 1
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: colors.lightGray || '#F5F5F5'
  },
  refreshText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500'
  }
};