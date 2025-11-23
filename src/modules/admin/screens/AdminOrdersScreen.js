import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useOrders } from '../hooks/useAdmin';
import { colors } from '../../../theme/colors';

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
  const labels = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
};

const OrderCard = ({ order, onPress }) => (
  <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)}>
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

    <View style={styles.orderDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Cliente:</Text>
        <Text style={styles.detailValue}>Usuario #{order.userId}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Items:</Text>
        <Text style={styles.detailValue}>{order.items.length} productos</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Total:</Text>
        <Text style={[styles.detailValue, styles.totalValue]}>${order.total.toFixed(2)}</Text>
      </View>
    </View>

    <View style={styles.paymentStatus}>
      <Text style={[
        styles.paymentText,
        { color: order.paymentStatus === 'paid' ? colors.success : colors.warning }
      ]}>
        {order.paymentStatus === 'paid' ? '✅ Pagado' : '⏳ Pendiente de pago'}
      </Text>
    </View>
  </TouchableOpacity>
);

const AdminOrdersScreen = ({ navigation, route }) => {
  const { orders, loading, fetchOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filter = route.params?.filter;

  useEffect(() => {
    if (filter && filter !== 'all') {
      setFilterStatus(filter);
      fetchOrders({ status: filter });
    }
  }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      fetchOrders();
    } else {
      fetchOrders({ status });
    }
  };

  const handleOrderPress = (order) => {
    navigation.navigate('AdminOrderDetailsScreen', { order });
  };

  const statuses = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'processing', label: 'Procesando' },
    { key: 'shipped', label: 'Enviados' },
    { key: 'delivered', label: 'Entregados' },
  ];

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.filterButton,
                filterStatus === status.key && styles.filterButtonActive
              ]}
              onPress={() => handleFilterChange(status.key)}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status.key && styles.filterButtonTextActive
              ]}>
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de pedidos */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={handleOrderPress} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No hay pedidos</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  filterContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
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
  orderDetails: {
    gap: 4,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  detailValue: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentStatus: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
  },
});

export default AdminOrdersScreen;