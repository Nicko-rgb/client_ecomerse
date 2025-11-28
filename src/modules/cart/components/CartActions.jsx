import React from 'react';
import { View, Text, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export default function CartActions({ onClearCart, items }) {
  const handleClearCart = () => {
    Alert.alert(
      'Vaciar Carrito',
      '¿Estás seguro de que deseas eliminar todos los productos del carrito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: onClearCart,
        },
      ]
    );
  };

  const handleShareCart = async () => {
    try {
      const productList = items.map((item, index) => 
        `${index + 1}. ${item.title || item.name} - $${item.price.toFixed(2)} x${item.quantity}`
      ).join('\n');
      
      const message = `🛒 Mi Carrito de Compras:\n\n${productList}\n\n¡Mira lo que voy a comprar!`;
      
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleShareCart}
      >
        <Ionicons name="share-social-outline" size={20} color={colors.primary} />
        <Text style={styles.actionText}>Compartir</Text>
      </TouchableOpacity>
      
      <View style={styles.divider} />
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleClearCart}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
        <Text style={[styles.actionText, { color: colors.error }]}>Vaciar Carrito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
});
