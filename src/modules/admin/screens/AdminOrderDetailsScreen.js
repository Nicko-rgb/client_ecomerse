import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useOrders } from '../hooks/useAdmin';
import { colors } from '../../../theme/colors';

const AdminOrderDetailsScreen = ({ navigation, route }) => {
  const { order } = route.params;
  const { updateOrderStatus } = useOrders();
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [notes, setNotes] = useState(order.notes || '');

  const statuses = [
    { key: 'pending', label: 'Pendiente', color: colors.gray },
    { key: 'processing', label: 'Procesando', color: colors.warning },
    { key: 'shipped', label: 'Enviado', color: colors.primary },
    { key: 'delivered', label: 'Entregado', color: colors.success },
    { key: 'cancelled', label: 'Cancelado', color: colors.error },
  ];

  const handleStatusChange = async (newStatus) => {
    Alert.alert(
      'Cambiar Estado',
      `¿Cambiar el estado del pedido a "${statuses.find(s => s.key === newStatus)?.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const result = await updateOrderStatus(order.id, {
              status: newStatus,
              trackingNumber,
              notes
            });
            if (result.success) {
              Alert.alert('Éxito', 'Estado actualizado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Pedido</Text>
        <View style={styles.infoCard}>
          <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.createdAt).toLocaleString('es-ES')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado Actual</Text>
        <View style={styles.statusContainer}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.statusButton,
                order.status === status.key && { backgroundColor: status.color }
              ]}
              onPress={() => handleStatusChange(status.key)}
            >
              <Text style={[
                styles.statusButtonText,
                order.status === status.key && styles.statusButtonTextActive
              ]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              Cantidad: {item.quantity} × ${item.price.toFixed(2)}
            </Text>
            <Text style={styles.itemTotal}>
              ${(item.quantity * item.price).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Número de Seguimiento</Text>
        <TextInput
          style={styles.input}
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          placeholder="Ingresa el número de seguimiento"
          placeholderTextColor={colors.gray}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notas adicionales..."
          placeholderTextColor={colors.gray}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => handleStatusChange(order.status)}
        >
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.gray,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusButtonText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminOrderDetailsScreen;