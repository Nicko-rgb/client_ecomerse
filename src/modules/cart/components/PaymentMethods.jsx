import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export default function PaymentMethods() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={18} color={colors.success} />
        <Text style={styles.title}>Pago 100% Seguro</Text>
      </View>
      
      <View style={styles.methodsContainer}>
        <View style={styles.methodItem}>
          <Ionicons name="card-outline" size={24} color={colors.primary} />
          <Text style={styles.methodText}>Visa</Text>
        </View>
        
        <View style={styles.methodItem}>
          <Ionicons name="card-outline" size={24} color={colors.primary} />
          <Text style={styles.methodText}>Mastercard</Text>
        </View>
        
        <View style={styles.methodItem}>
          <Ionicons name="logo-paypal" size={24} color="#003087" />
          <Text style={styles.methodText}>PayPal</Text>
        </View>
        
        <View style={styles.methodItem}>
          <Ionicons name="cash-outline" size={24} color={colors.success} />
          <Text style={styles.methodText}>Efectivo</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  methodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  methodItem: {
    alignItems: 'center',
    width: '22%',
  },
  methodText: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'center',
  },
});
