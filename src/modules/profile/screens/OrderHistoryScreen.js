import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { colors } from '../../../theme/colors';

const OrderCard = ({ order, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return colors.success;
      case 'shipped': return colors.primary;
      case 'processing': return colors.warning;
      case 'cancelled': return colors.error;
      default: return colors.gray;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onViewDetails(order)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.orderDate}>
        {new Date(order.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      
      <View style={styles.orderItems}>
        <Text style={styles.itemsCount}>
          {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
        </Text>
        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
      </View>
      
      {order.items.slice(0, 2).map((item, index) => (
        <Text key={index} style={styles.itemName}>
          • {item.name} (x{item.quantity})
        </Text>
      ))}
      
      {order.items.length > 2 && (
        <Text style={styles.moreItems}>
          y {order.items.length - 2} productos más...
        </Text>
      )}
    </TouchableOpacity>
  );
};

const OrderHistoryScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Datos de ejemplo - en una app real vendrían de una API
  const [orders] = useState([
    {
      id: '12345',
      status: 'delivered',
      createdAt: '2024-01-15T10:30:00Z',
      total: 89.99,
      items: [
        { name: 'Camiseta Básica', quantity: 2 },
        { name: 'Jeans Slim Fit', quantity: 1 }
      ]
    },
    {
      id: '12344',
      status: 'shipped',
      createdAt: '2024-01-10T14:20:00Z',
      total: 156.50,
      items: [
        { name: 'Zapatillas Deportivas', quantity: 1 },
        { name: 'Calcetines Pack x3', quantity: 1 },
        { name: 'Gorra Deportiva', quantity: 1 }
      ]
    },
    {
      id: '12343',
      status: 'processing',
      createdAt: '2024-01-08T09:15:00Z',
      total: 45.00,
      items: [
        { name: 'Libro de Programación', quantity: 1 }
      ]
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleViewOrderDetails = (order) => {
    navigation.navigate('OrderDetailsScreen', { order });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Pedidos</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
            <Text style={styles.emptySubtitle}>
              Cuando realices tu primera compra, aparecerá aquí
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('ProductsTab')}
            >
              <Text style={styles.emptyButtonText}>Explorar Productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewOrderDetails}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  orderItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemsCount: {
    fontSize: 14,
    color: colors.gray,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  itemName: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 14,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ordersList: {
    paddingBottom: 20,
  },
});

export default OrderHistoryScreen;