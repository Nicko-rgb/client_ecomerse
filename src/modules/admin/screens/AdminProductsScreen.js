import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useProducts } from '../hooks/useAdmin';
import { colors } from '../../../theme/colors';

const ProductCard = ({ product, onEdit, onDelete, onToggleActive }) => (
  <View style={styles.productCard}>
    <View style={styles.productHeader}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: product.active ? colors.success : colors.error }
      ]}>
        <Text style={styles.statusText}>
          {product.active ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
    </View>

    <Text style={styles.productDescription} numberOfLines={2}>
      {product.description}
    </Text>

    <View style={styles.productDetails}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Precio:</Text>
        <Text style={styles.detailValue}>${product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Stock:</Text>
        <Text style={[
          styles.detailValue,
          { color: product.stock < 10 ? colors.error : colors.success }
        ]}>
          {product.stock} unidades
        </Text>
      </View>
    </View>

    <View style={styles.productActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => onEdit(product)}
      >
        <Text style={styles.actionButtonText}>✏️ Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.toggleButton]}
        onPress={() => onToggleActive(product)}
      >
        <Text style={styles.actionButtonText}>
          {product.active ? '🔴 Desactivar' : '🟢 Activar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => onDelete(product)}
      >
        <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const AdminProductsScreen = ({ navigation, route }) => {
  const { products, loading, fetchProducts, updateProduct, deleteProduct } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // all, active, inactive

  const filter = route.params?.filter;

  useEffect(() => {
    if (filter === 'lowStock') {
      // Filtrar productos con stock bajo
      fetchProducts();
    } else if (filter === 'active') {
      setFilterActive('active');
      fetchProducts({ active: 'true' });
    }
  }, [filter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      fetchProducts({ search: query });
    } else {
      fetchProducts();
    }
  };

  const handleFilterChange = (filter) => {
    setFilterActive(filter);
    if (filter === 'all') {
      fetchProducts();
    } else {
      fetchProducts({ active: filter === 'active' ? 'true' : 'false' });
    }
  };

  const handleEdit = (product) => {
    navigation.navigate('AdminEditProductScreen', { product });
  };

  const handleDelete = (product) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteProduct(product.id);
            if (result.success) {
              Alert.alert('Éxito', 'Producto eliminado correctamente');
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const handleToggleActive = async (product) => {
    const newStatus = !product.active;
    const result = await updateProduct(product.id, { active: newStatus });
    
    if (result.success) {
      Alert.alert(
        'Éxito',
        `Producto ${newStatus ? 'activado' : 'desactivado'} correctamente`
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const filteredProducts = filter === 'lowStock'
    ? products.filter(p => p.stock < 10)
    : products;

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Filtros */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterActive === 'all' && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filterActive === 'all' && styles.filterButtonTextActive
            ]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterActive === 'active' && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange('active')}
          >
            <Text style={[
              styles.filterButtonText,
              filterActive === 'active' && styles.filterButtonTextActive
            ]}>
              Activos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filterActive === 'inactive' && styles.filterButtonActive
            ]}
            onPress={() => handleFilterChange('inactive')}
          >
            <Text style={[
              styles.filterButtonText,
              filterActive === 'inactive' && styles.filterButtonTextActive
            ]}>
              Inactivos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No hay productos</Text>
          </View>
        }
      />

      {/* Botón flotante para agregar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdminCreateProductScreen')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.dark,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
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
  productCard: {
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  productCategory: {
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
  productDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
    lineHeight: 20,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  toggleButton: {
    backgroundColor: colors.warning,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '300',
  },
});

export default AdminProductsScreen;