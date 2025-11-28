import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export default function DeliveryEstimate() {
  // Calcular fecha estimada (3-5 días hábiles)
  const getEstimatedDate = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const options = { month: 'short', day: 'numeric' };
    return `${minDate.toLocaleDateString('es-ES', options)} - ${maxDate.toLocaleDateString('es-ES', options)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Entrega estimada</Text>
        <Text style={styles.date}>{getEstimatedDate()}</Text>
      </View>
      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 2,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
