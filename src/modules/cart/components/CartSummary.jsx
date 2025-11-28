import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { cartStyles } from '../styles/cartStyles';

export default function CartSummary({ subtotal, onCheckout }) {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      {/* Header con toggle */}
      <TouchableOpacity 
        style={cartStyles.summaryHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={cartStyles.summaryHeaderLeft}>
          <Text style={cartStyles.totalLabel}>Total</Text>
          <Text style={cartStyles.totalValue}>${total.toFixed(2)}</Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-down" : "chevron-up"} 
          size={24} 
          color={colors.primary} 
        />
      </TouchableOpacity>

      {/* Detalles expandibles */}
      {isExpanded && (
        <>
          <View style={cartStyles.divider} />
          
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.summaryLabel}>Subtotal</Text>
            <Text style={cartStyles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={cartStyles.summaryRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={cartStyles.summaryLabel}>Envío</Text>
              {shipping === 0 && (
                <View style={cartStyles.freeBadge}>
                  <Text style={cartStyles.freeBadgeText}>GRATIS</Text>
                </View>
              )}
            </View>
            <Text style={[cartStyles.summaryValue, shipping === 0 && { color: colors.success }]}>
              {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={cartStyles.summaryRow}>
            <Text style={cartStyles.summaryLabel}>Impuestos (10%)</Text>
            <Text style={cartStyles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
          
          {shipping === 0 && (
            <View style={cartStyles.savingsRow}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={cartStyles.savingsText}>
                ¡Ahorraste $5.00 en envío!
              </Text>
            </View>
          )}

          <View style={cartStyles.divider} />
        </>
      )}
      
      <TouchableOpacity 
        style={cartStyles.checkoutButton}
        onPress={handleCheckout}
      >
        <Ionicons name="lock-closed" size={18} color={colors.white} style={{ marginRight: 8 }} />
        <Text style={cartStyles.checkoutButtonText}>
          Proceder al Pago
        </Text>
      </TouchableOpacity>
    </View>
  );
}
