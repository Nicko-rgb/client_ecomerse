import React, { useState, useEffect } from 'react';
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
import { colors } from '../../../theme/colors';

const PaymentMethodCard = ({ paymentMethod, onEdit, onDelete, onSetPrimary }) => {
  const getCardIcon = (type) => {
    switch (type) {
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'paypal': return '🅿️';
      default: return '💳';
    }
  };

  const getCardTypeLabel = (type) => {
    switch (type) {
      case 'credit_card': return 'Tarjeta de Crédito';
      case 'debit_card': return 'Tarjeta de Débito';
      case 'paypal': return 'PayPal';
      default: return 'Método de Pago';
    }
  };

  return (
    <View style={[styles.card, paymentMethod.isPrimary && styles.primaryCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTypeContainer}>
          <Text style={styles.cardIcon}>{getCardIcon(paymentMethod.type)}</Text>
          <Text style={styles.cardTypeLabel}>{getCardTypeLabel(paymentMethod.type)}</Text>
        </View>
        {paymentMethod.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Principal</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.cardNumber}>{paymentMethod.cardNumber}</Text>
      <Text style={styles.cardHolder}>{paymentMethod.cardHolder}</Text>
      {paymentMethod.expiryDate && (
        <Text style={styles.expiryDate}>Vence: {paymentMethod.expiryDate}</Text>
      )}
      
      <View style={styles.cardActions}>
        {!paymentMethod.isPrimary && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => onSetPrimary(paymentMethod.id)}
          >
            <Text style={styles.actionText}>Hacer principal</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(paymentMethod)}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => onDelete(paymentMethod.id)}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PaymentMethodsScreen = ({ navigation }) => {
  const { paymentMethods, loading, error, refreshPaymentMethods, deletePaymentMethod, updatePaymentMethod } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  // Refrescar datos cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      refreshPaymentMethods();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPaymentMethods();
    setRefreshing(false);
  };

  const handleAddPaymentMethod = () => {
    navigation.navigate('AddPaymentMethodScreen');
  };

  const handleEditPaymentMethod = (paymentMethod) => {
    navigation.navigate('EditPaymentMethodScreen', { paymentMethod });
  };

  const handleDeletePaymentMethod = (paymentMethodId) => {
    Alert.alert(
      'Eliminar Método de Pago',
      '¿Estás seguro de que quieres eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            const result = await deletePaymentMethod(paymentMethodId);
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

  const handleSetPrimary = (paymentMethodId) => {
    Alert.alert(
      'Método de Pago Principal',
      '¿Quieres establecer este como tu método de pago principal?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            const result = await updatePaymentMethod(paymentMethodId, { isPrimary: true });
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
      <View style={styles.header}>
        <Text style={styles.title}>Métodos de Pago</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPaymentMethod}
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
        
        {paymentMethods.length === 0 && !error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>No tienes métodos de pago guardados</Text>
            <Text style={styles.emptySubtitle}>
              Agrega una tarjeta o método de pago para facilitar tus compras
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddPaymentMethod}
            >
              <Text style={styles.emptyButtonText}>Agregar Primer Método</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.paymentMethodsList}>
            {paymentMethods.map((paymentMethod) => (
              <PaymentMethodCard
                key={paymentMethod.id}
                paymentMethod={paymentMethod}
                onEdit={handleEditPaymentMethod}
                onDelete={handleDeletePaymentMethod}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  primaryCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cardTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  primaryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 16,
    color: colors.dark,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  cardHolder: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    // Estilos adicionales para el botón de eliminar si es necesario
  },
  deleteText: {
    color: colors.error || '#FF6B6B',
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
  paymentMethodsList: {
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

export default PaymentMethodsScreen;