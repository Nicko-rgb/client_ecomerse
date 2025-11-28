import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useOrders } from '../../../hooks/useOrders';
import { colors } from '../../../theme/colors';

const OrderCard = ({ order, onViewDetails }) => {
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

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onViewDetails(order)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Pedido #{order._id || order.id}</Text>
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
          {order.items?.length || 0} {order.items?.length === 1 ? 'producto' : 'productos'}
        </Text>
        <Text style={styles.orderTotal}>${Number(order.totalAmount || order.total || 0).toFixed(2)}</Text>
      </View>
      
      {order.items?.slice(0, 2).map((item, index) => (
        <Text key={`${order._id || order.id}-item-${index}`} style={styles.itemName}>
          • {item.product?.name || item.name} (x{item.quantity})
        </Text>
      ))}
      
      {order.items?.length > 2 && (
        <Text style={styles.moreItems}>
          y {order.items.length - 2} productos más...
        </Text>
      )}
    </TouchableOpacity>
  );
};

const OrderHistoryScreen = ({ navigation }) => {
  const { orders, loading, error, refreshOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  const handleViewOrderDetails = (order) => {
    navigation.navigate('OrderDetailsScreen', { order });
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.gray }}>Cargando pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: colors.error, textAlign: 'center' }}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.emptyButton}
          onPress={refreshOrders}
        >
          <Text style={styles.emptyButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
                key={order._id || order.id || `order-${Math.random()}`}
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