import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function OrderSummaryExpandable({ items, subtotal, shipping, tax, total }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>Resumen del Pedido</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={colors.muted} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Lista de productos */}
          <View style={styles.productsContainer}>
            {items.map((item) => (
              <View key={item.id} style={styles.productItem}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.productQuantity}>
                    Cantidad: {item.quantity}
                  </Text>
                </View>
                <Text style={styles.productPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Desglose de costos */}
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>
              {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Impuestos</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productsContainer: {
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.lightBackground,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: colors.muted,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
