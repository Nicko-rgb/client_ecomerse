import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cartStyles } from '../styles/cartStyles';

export default function CartSummary({ subtotal, onCheckout }) {
  const navigation = useNavigation();
  
  const freeShippingThreshold = 50.00;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 5.00;
  const tax = subtotal * 0.10;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigation.navigate('Checkout');
    }
  };

  return (
    <View style={cartStyles.summaryContainer}>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Subtotal</Text>
        <Text style={cartStyles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>
          Envío {shipping === 0 && '(Gratis)'}
        </Text>
        <Text style={cartStyles.summaryValue}>
          {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
        </Text>
      </View>
      
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Impuestos (10%)</Text>
        <Text style={cartStyles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>
      
      <View style={cartStyles.divider} />
      
      <View style={cartStyles.totalRow}>
        <Text style={cartStyles.totalLabel}>Total</Text>
        <Text style={cartStyles.totalValue}>${total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={cartStyles.checkoutButton}
        onPress={handleCheckout}
      >
        <Text style={cartStyles.checkoutButtonText}>
          Proceder al Pago
        </Text>
      </TouchableOpacity>
    </View>
  );
}
