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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import OrderSummaryExpandable from '../components/OrderSummaryExpandable';
import { checkoutStyles } from '../styles/checkoutStyles';
import colors from '../../../theme/colors';

export default function CheckoutScreen({ navigation }) {
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  
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

  // Autocompletar datos del usuario al cargar
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.fullName,
        phone: user.phone || prev.phone,
      }));
      
      // Si el usuario tiene nombre, también autocompletar el nombre en la tarjeta
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (fullName) {
        setCardName(fullName);
      }
    }
  }, [user]);

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

  const getPaymentDetails = (method) => {
    switch(method) {
      case 'card':
        return {
          type: 'Tarjeta de Crédito/Débito',
          last4: cardNumber.replace(/\s/g, '').slice(-4),
          cardHolder: cardName
        };
      case 'paypal':
        return {
          type: 'PayPal',
          email: user?.email || 'usuario@email.com'
        };
      case 'cash':
        return {
          type: 'Efectivo',
          message: 'Pago contra entrega'
        };
      default:
        return {};
    }
  };

  const navigateToConfirmation = (paymentMethod) => {
    const orderNumber = Math.floor(Math.random() * 1000000);
    clearCart();
    navigation.replace('OrderConfirmation', {
      orderNumber,
      total,
      estimatedDelivery: '3-5 días hábiles',
      paymentMethod: paymentMethod,
      paymentDetails: getPaymentDetails(paymentMethod)
    });
  };

  const handleCardPayment = () => {
    Alert.alert(
      'Procesando Pago',
      'Verificando datos de la tarjeta...',
      [],
      { cancelable: false }
    );

    setTimeout(() => {
      Alert.alert(
        '¡Pago Exitoso!',
        `Tu tarjeta terminada en ${cardNumber.slice(-4)} ha sido cargada exitosamente.\n\nMonto: $${total.toFixed(2)}`,
        [
          {
            text: 'Ver Detalles',
            onPress: () => navigateToConfirmation('card')
          }
        ]
      );
    }, 1500);
  };

  const handlePayPalPayment = () => {
    Alert.alert(
      'Redirigiendo a PayPal',
      'Serás redirigido a PayPal para completar el pago de forma segura.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => {
            Alert.alert(
              'Simulación PayPal',
              'En una app real, aquí se abriría PayPal.\n\n¿Confirmar pago simulado?',
              [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Pagar',
                  onPress: () => {
                    Alert.alert(
                      '¡Pago Completado!',
                      `PayPal ha procesado tu pago de $${total.toFixed(2)} exitosamente.`,
                      [
                        {
                          text: 'Ver Detalles',
                          onPress: () => navigateToConfirmation('paypal')
                        }
                      ]
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleCashPayment = () => {
    Alert.alert(
      'Confirmar Pedido',
      `Pagarás $${total.toFixed(2)} en efectivo al recibir tu pedido.\n\n¿Confirmar pedido?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert(
              '¡Pedido Confirmado!',
              'Tu pedido ha sido registrado. Prepara el efectivo para cuando llegue el repartidor.',
              [
                {
                  text: 'Ver Detalles',
                  onPress: () => navigateToConfirmation('cash')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    
    // Navegar directamente a confirmación con el método de pago seleccionado
    navigateToConfirmation(selectedPayment);
  };

  const oldAlert = () => {
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
  }; // Función vieja - no se usa más

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
          {/* Resumen del pedido expandible */}
          <View style={checkoutStyles.section}>
            <OrderSummaryExpandable
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </View>

        {/* Dirección de envío */}
        <View style={checkoutStyles.section}>
          <Text style={checkoutStyles.sectionTitle}>
            <Ionicons name="location" size={20} color={colors.primary} /> Dirección de Envío
          </Text>
          {user && (shippingAddress.fullName || shippingAddress.phone) && (
            <View style={checkoutStyles.autofilledBanner}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={checkoutStyles.autofilledText}>
                Datos autocompletados desde tu perfil
              </Text>
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
            <Text style={checkoutStyles.helperText}>
              Ej: Dejar en portería, tocar timbre 2 veces, etc.
            </Text>
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

        {/* Espacio extra para que el contenido no quede detrás del botón */}
        <View style={{ height: 100 }} />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Botón de confirmar pedido - Siempre visible */}
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
    </View>
  );
}
