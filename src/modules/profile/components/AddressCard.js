import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import ConfirmationModal from './ConfirmationModal';

const AddressCard = ({ address, onEdit, onDelete, onSetPrimary }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrimaryModal, setShowPrimaryModal] = useState(false);
  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  const getAddressTypeLabel = (type) => {
    switch (type) {
      case 'home': return 'Casa';
      case 'work': return 'Trabajo';
      case 'other': return 'Otro';
      default: return 'Dirección';
    }
  };

  return (
    <View style={[styles.container, address.isPrimary && styles.primaryContainer]}>
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>{getAddressTypeIcon(address.type)}</Text>
          <Text style={styles.typeLabel}>{getAddressTypeLabel(address.type)}</Text>
        </View>
        {address.isPrimary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>Principal</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.street}>{address.street}</Text>
      <Text style={styles.location}>
        {address.city}, {address.state} {address.zipCode}
      </Text>
      <Text style={styles.country}>{address.country}</Text>
      
      <View style={styles.actions}>
        {!address.isPrimary && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowPrimaryModal(true)}
          >
            <Text style={styles.actionText}>Hacer principal</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(address)}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => setShowDeleteModal(true)}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      {/* Modales de confirmación */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete(address.id);
        }}
        title="Eliminar Dirección"
        message={`¿Estás seguro de que quieres eliminar la dirección "${address.street}"?`}
        confirmText="Eliminar"
        isDestructive={true}
      />

      <ConfirmationModal
        visible={showPrimaryModal}
        onClose={() => setShowPrimaryModal(false)}
        onConfirm={() => {
          setShowPrimaryModal(false);
          onSetPrimary(address.id);
        }}
        title="Dirección Principal"
        message="¿Quieres establecer esta dirección como tu dirección principal?"
        confirmText="Establecer"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  primaryContainer: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  typeLabel: {
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
  street: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  actions: {
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
});

export default AddressCard;