import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function FreeShippingProgress({ subtotal }) {
  const freeShippingThreshold = 50.00;
  const remaining = freeShippingThreshold - subtotal;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const hasReachedFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <View style={styles.container}>
      {hasReachedFreeShipping ? (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.successText}>
            ¡Felicidades! Tienes envío gratis
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.textContainer}>
            <Ionicons name="rocket" size={18} color={colors.primary} />
            <Text style={styles.text}>
              Agrega <Text style={styles.amount}>${remaining.toFixed(2)}</Text> más para envío gratis
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  amount: {
    fontWeight: '700',
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.lightBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 8,
  },
});
