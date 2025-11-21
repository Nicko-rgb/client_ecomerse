import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { cartStyles } from '../styles/cartStyles';

export default function CartSummary({ subtotal }) {
  const navigation = useNavigation();
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = subtotal * 0.10; // 10% de impuesto
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={cartStyles.summaryContainer}>
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Subtotal</Text>
        <Text style={cartStyles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={cartStyles.summaryRow}>
        <Text style={cartStyles.summaryLabel}>Envío</Text>
        <Text style={cartStyles.summaryValue}>${shipping.toFixed(2)}</Text>
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
