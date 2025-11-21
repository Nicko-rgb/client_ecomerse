import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../theme/colors';
import { cartStyles } from '../styles/cartStyles';

export default function EmptyCart() {
  const navigation = useNavigation();

  return (
    <View style={cartStyles.emptyContainer}>
      <View style={cartStyles.emptyIcon}>
        <Ionicons name="cart-outline" size={120} color={colors.lightGray} />
      </View>
      
      <Text style={cartStyles.emptyTitle}>
        Tu carrito está vacío
      </Text>
      
      <Text style={cartStyles.emptySubtitle}>
        Parece que aún no has agregado nada a tu carrito. ¡Explora nuestros productos!
      </Text>
      
      <TouchableOpacity 
        style={cartStyles.emptyButton}
        onPress={() => navigation.navigate('Productos')}
      >
        <Text style={cartStyles.emptyButtonText}>
          Explorar Productos
        </Text>
      </TouchableOpacity>
    </View>
  );
}
