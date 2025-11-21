import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../context/CartContext';
import { checkoutStyles } from '../styles/checkoutStyles';
import colors from '../../../theme/colors';

export default function CheckoutScreen({ navigation }) {
  const { items, getSubtotal, clearCart } = useCart();
  
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

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    Alert.alert(
      '¡Pedido Confirmado!',
      `Tu pedido por $${total.toFixed(2)} ha sido procesado exitosamente.\n\nRecibirás un correo de confirmación pronto.`,
      [
        {
          text: 'Ver Pedidos',
          onPress: () => {
            clearCart();
            navigation.navigate('MainTabs', { screen: 'Perfil' });
          }
        },
        {
          text: 'Seguir Comprando',
          onPress: () => {
            clearCart();
            navigation.navigate('MainTabs', { screen: 'Productos' });
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={checkoutStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumen del pedido */}
        <View style={checkoutStyles.section}>
          <Text style={checkoutStyles.sectionTitle}>Resumen del Pedido</Text>
          <View style={checkoutStyles.card}>
            <View style={checkoutStyles.summaryRow}>
              <Text style={checkoutStyles.summaryLabel}>
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </Text>
              <Text style={checkoutStyles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={checkoutStyles.summaryRow}>
              <Text style={checkoutStyles.summaryLabel}>Envío</Text>
              <Text style={checkoutStyles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={checkoutStyles.summaryRow}>
              <Text style={checkoutStyles.summaryLabel}>Impuestos</Text>
              <Text style={checkoutStyles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={checkoutStyles.divider} />
            <View style={checkoutStyles.summaryRow}>
              <Text style={checkoutStyles.totalLabel}>Total</Text>
              <Text style={checkoutStyles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Dirección de envío */}
        <View style={checkoutStyles.section}>
          <Text style={checkoutStyles.sectionTitle}>
            <Ionicons name="location" size={20} color={colors.primary} /> Dirección de Envío
          </Text>
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
          </View>
        </View>

        {/* Método de pago */}
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

        {/* Información de seguridad */}
        <View style={checkoutStyles.securityInfo}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={checkoutStyles.securityText}>
            Tu información está protegida con encriptación SSL
          </Text>
        </View>
      </ScrollView>

      {/* Botón de confirmar pedido */}
      <View style={checkoutStyles.footer}>
        <TouchableOpacity 
          style={checkoutStyles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={checkoutStyles.placeOrderText}>
            Confirmar Pedido - ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
