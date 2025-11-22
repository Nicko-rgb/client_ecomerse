import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useAdminUsers } from '../hooks/useAdmin';
import { colors } from '../../../theme/colors';

const UserCard = ({ user, onPress }) => (
  <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
    <View style={styles.userHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.firstName?.[0]}{user.lastName?.[0]}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: user.active ? colors.success : colors.error }
      ]}>
        <Text style={styles.statusText}>
          {user.active ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
    </View>

    <View style={styles.userDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Rol:</Text>
        <Text style={styles.detailValue}>
          {user.role === 'admin' ? '👑 Admin' : '👤 Cliente'}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Teléfono:</Text>
        <Text style={styles.detailValue}>{user.phone || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Registro:</Text>
        <Text style={styles.detailValue}>
          {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const AdminUsersScreen = ({ navigation }) => {
  const { users, loading, fetchUsers } = useAdminUsers();
  const [refreshing, setRefreshing] = useState(false);
  const [filterRole, setFilterRole] = useState('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
    if (role === 'all') {
      fetchUsers();
    } else {
      fetchUsers({ role });
    }
  };

  const handleUserPress = (user) => {
    navigation.navigate('AdminUserDetailsScreen', { user });
  };

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'customer', label: 'Clientes' },
    { key: 'admin', label: 'Admins' },
  ];

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              filterRole === filter.key && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              filterRole === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard user={item} onPress={handleUserPress} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>No hay usuarios</Text>
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
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    gap: 8,
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
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
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
  userDetails: {
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
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

export default AdminUsersScreen;