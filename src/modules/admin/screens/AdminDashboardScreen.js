import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAdmin } from '../hooks/useAdmin';
import { colors } from '../../../theme/colors';

const StatCard = ({ icon, title, value, subtitle, color, onPress }) => (
  <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
    <Text style={styles.statIcon}>{icon}</Text>
    <View style={styles.statContent}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  </TouchableOpacity>
);

const AdminDashboardScreen = ({ navigation }) => {
  const { dashboardStats, recentActivity, loading, error, refreshDashboard } = useAdmin();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDashboard();
    setRefreshing(false);
  };

  if (loading && !dashboardStats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshDashboard}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
        <Text style={styles.headerSubtitle}>Panel de control del ecommerce</Text>
      </View>

      {/* Estadísticas de Productos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Productos</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="📦"
            title="Total Productos"
            value={dashboardStats?.totalProducts || 0}
            color={colors.primary}
            onPress={() => navigation.navigate('AdminProductsScreen')}
          />
          <StatCard
            icon="✅"
            title="Activos"
            value={dashboardStats?.activeProducts || 0}
            color={colors.success}
            onPress={() => navigation.navigate('AdminProductsScreen', { filter: 'active' })}
          />
          <StatCard
            icon="⚠️"
            title="Stock Bajo"
            value={dashboardStats?.lowStockProducts || 0}
            subtitle="< 10 unidades"
            color={colors.warning}
            onPress={() => navigation.navigate('AdminProductsScreen', { filter: 'lowStock' })}
          />
        </View>
      </View>

      {/* Estadísticas de Pedidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛒 Pedidos</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="📋"
            title="Total Pedidos"
            value={dashboardStats?.totalOrders || 0}
            color={colors.primary}
            onPress={() => navigation.navigate('AdminOrdersScreen')}
          />
          <StatCard
            icon="⏳"
            title="Pendientes"
            value={dashboardStats?.pendingOrders || 0}
            color={colors.warning}
            onPress={() => navigation.navigate('AdminOrdersScreen', { filter: 'pending' })}
          />
          <StatCard
            icon="🚚"
            title="Procesando"
            value={dashboardStats?.processingOrders || 0}
            color={colors.primary}
            onPress={() => navigation.navigate('AdminOrdersScreen', { filter: 'processing' })}
          />
          <StatCard
            icon="✅"
            title="Entregados"
            value={dashboardStats?.deliveredOrders || 0}
            color={colors.success}
            onPress={() => navigation.navigate('AdminOrdersScreen', { filter: 'delivered' })}
          />
        </View>
      </View>

      {/* Estadísticas de Ingresos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Ingresos</Text>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Ingresos Totales</Text>
          <Text style={styles.revenueValue}>
            ${(dashboardStats?.totalRevenue || 0).toFixed(2)}
          </Text>
          <Text style={styles.revenueSubtitle}>
            De {dashboardStats?.totalOrders || 0} pedidos completados
          </Text>
        </View>
      </View>

      {/* Estadísticas de Usuarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Usuarios</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="👥"
            title="Total Usuarios"
            value={dashboardStats?.totalUsers || 0}
            color={colors.primary}
            onPress={() => navigation.navigate('AdminUsersScreen')}
          />
          <StatCard
            icon="✅"
            title="Activos"
            value={dashboardStats?.activeUsers || 0}
            color={colors.success}
            onPress={() => navigation.navigate('AdminUsersScreen', { filter: 'active' })}
          />
          <StatCard
            icon="🆕"
            title="Nuevos (mes)"
            value={dashboardStats?.newUsersThisMonth || 0}
            color={colors.primary}
            onPress={() => navigation.navigate('AdminUsersScreen', { filter: 'new' })}
          />
        </View>
      </View>

      {/* Actividad Reciente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Actividad Reciente</Text>
        
        {recentActivity?.recentOrders && recentActivity.recentOrders.length > 0 && (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>Últimos Pedidos</Text>
            {recentActivity.recentOrders.slice(0, 3).map((order) => (
              <TouchableOpacity 
                key={order.id}
                style={styles.activityItem}
                onPress={() => navigation.navigate('AdminOrderDetailsScreen', { order })}
              >
                <Text style={styles.activityText}>
                  Pedido #{order.id} - ${order.total.toFixed(2)}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('AdminOrdersScreen')}
            >
              <Text style={styles.viewAllText}>Ver todos los pedidos →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminCreateProductScreen')}
          >
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Nuevo Producto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminOrdersScreen', { filter: 'pending' })}
          >
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Pedidos Pendientes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('AdminProductsScreen', { filter: 'lowStock' })}
          >
            <Text style={styles.quickActionIcon}>⚠️</Text>
            <Text style={styles.quickActionText}>Stock Bajo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.bg,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statContent: {
    gap: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.gray,
  },
  revenueCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  revenueSubtitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  activityText: {
    fontSize: 14,
    color: colors.dark,
  },
  activityDate: {
    fontSize: 12,
    color: colors.gray,
  },
  viewAllButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.dark,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default AdminDashboardScreen;