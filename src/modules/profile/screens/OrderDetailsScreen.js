import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const OrderDetailsScreen = ({ navigation, route }) => {
  const { order } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return colors.success;
      case 'shipped': return colors.primary;
      case 'processing': return colors.warning;
      case 'pending': return colors.gray;
      case 'cancelled': return colors.error;
      default: return colors.gray;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const handleTrackOrder = () => {
    Alert.alert(
      'Rastrear Pedido',
      `Número de seguimiento: TR${order.id}2024\n\nEste pedido está ${getStatusLabel(order.status).toLowerCase()}.`,
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contactar Soporte',
      '¿Cómo te gustaría contactarnos?',
      [
        { text: 'Email', onPress: () => console.log('Contactar por email') },
        { text: 'Teléfono', onPress: () => console.log('Contactar por teléfono') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleReorder = () => {
    Alert.alert(
      'Volver a Pedir',
      '¿Quieres agregar estos productos al carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, agregar', onPress: () => console.log('Reordenar productos') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Detalles del Pedido" onBack={() => navigation.goBack()} />
      {/* Header del pedido */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderTop}>
          <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.orderDate}>
          Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>

      {/* Productos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos ({order.items.length})</Text>
        <View style={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image 
                source={{ uri: item.product?.image || item.image || 'https://via.placeholder.com/60x60?text=No+Image' }}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product?.name || item.name}</Text>
                <Text style={styles.itemQuantity}>Cantidad: {item.quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price || 25.99).toFixed(2)} c/u</Text>
              </View>
              <Text style={styles.itemTotal}>
                ${((item.price || 25.99) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Resumen de costos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${((order.totalAmount || order.total || 0) * 0.85).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={styles.summaryValue}>${((order.totalAmount || order.total || 0) * 0.1).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Impuestos</Text>
            <Text style={styles.summaryValue}>${((order.totalAmount || order.total || 0) * 0.05).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(order.totalAmount || order.total || 0).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Información de envío */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Envío</Text>
        <View style={styles.shippingContainer}>
          <View style={styles.shippingRow}>
            <Text style={styles.shippingLabel}>Dirección:</Text>
            <Text style={styles.shippingValue}>
              Calle Principal 123{'\n'}
              Ciudad, Estado 12345{'\n'}
              País
            </Text>
          </View>
          <View style={styles.shippingRow}>
            <Text style={styles.shippingLabel}>Método:</Text>
            <Text style={styles.shippingValue}>Envío estándar (3-5 días)</Text>
          </View>
          {order.status === 'shipped' && (
            <View style={styles.shippingRow}>
              <Text style={styles.shippingLabel}>Seguimiento:</Text>
              <Text style={styles.trackingNumber}>TR{order.id}2024</Text>
            </View>
          )}
        </View>
      </View>

      {/* Información de pago */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentMethod}>💳 Tarjeta terminada en 1234</Text>
          <Text style={styles.paymentStatus}>✅ Pago procesado</Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actionsContainer}>
        {order.status === 'shipped' && (
          <TouchableOpacity style={styles.actionButton} onPress={handleTrackOrder}>
            <Text style={styles.actionButtonText}>📦 Rastrear Pedido</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.actionButton} onPress={handleReorder}>
          <Text style={styles.actionButtonText}>🔄 Volver a Pedir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
          <Text style={styles.actionButtonText}>💬 Contactar Soporte</Text>
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
  orderHeader: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: colors.gray,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.lightGray,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.gray,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.dark,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  shippingContainer: {
    gap: 12,
  },
  shippingRow: {
    flexDirection: 'row',
  },
  shippingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    width: 80,
  },
  shippingValue: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
  },
  trackingNumber: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  paymentContainer: {
    gap: 8,
  },
  paymentMethod: {
    fontSize: 16,
    color: colors.dark,
  },
  paymentStatus: {
    fontSize: 14,
    color: colors.success,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OrderDetailsScreen;
