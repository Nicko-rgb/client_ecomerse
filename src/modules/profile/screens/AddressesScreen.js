import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../hooks/useProfile';
import AddressCard from '../components/AddressCard';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const AddressesScreen = ({ navigation }) => {
  const { addresses, loading, error, refreshAddresses, deleteAddress, updateAddress } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  // Refrescar datos cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      refreshAddresses();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAddresses();
    setRefreshing(false);
  };

  const handleAddAddress = () => {
    navigation.navigate('AddAddressScreen');
  };

  const handleEditAddress = (address) => {
    navigation.navigate('EditAddressScreen', { address });
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Eliminar Dirección',
      '¿Estás seguro de que quieres eliminar esta dirección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            const result = await deleteAddress(addressId);
            if (result.success) {
              Alert.alert('Éxito', result.message);
            } else {
              Alert.alert('Error', result.error);
            }
          }
        },
      ]
    );
  };

  const handleSetPrimary = (addressId) => {
    Alert.alert(
      'Dirección Principal',
      '¿Quieres establecer esta como tu dirección principal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            const result = await updateAddress(addressId, { isPrimary: true });
            if (result.success) {
              Alert.alert('Éxito', result.message);
            } else {
              Alert.alert('Error', result.error);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Mis Direcciones" onBack={() => navigation.goBack()} />
      <View style={[styles.header, { justifyContent: 'flex-end' }]}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {addresses.length === 0 && !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>No tienes direcciones guardadas</Text>
            <Text style={styles.emptySubtitle}>
              Agrega una dirección para facilitar tus compras
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddAddress}
            >
              <Text style={styles.emptyButtonText}>Agregar Primera Dirección</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.addressesList}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetPrimary={handleSetPrimary}
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
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
  addressesList: {
    paddingBottom: 20,
  },
  errorContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error || '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AddressesScreen;
