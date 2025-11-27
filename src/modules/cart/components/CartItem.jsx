import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { cartStyles } from '../styles/cartStyles';

export default function CartItem({ item, onIncrement, onDecrement, onRemove, onPress }) {
  const subtotal = item.price * (item.quantity || 1);

  return (
    <TouchableOpacity 
      style={cartStyles.cartItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Image 
        source={{ uri: (item.image ? item.image : (Array.isArray(item.images) && item.images.length ? item.images[0] : undefined)) || 'https://via.placeholder.com/300' }} 
        style={cartStyles.itemImage}
        resizeMode="cover"
      />
      
      <View style={cartStyles.itemDetails}>
        <Text style={cartStyles.itemTitle} numberOfLines={2}>
          {item.title || item.name}
        </Text>
        
        <Text style={cartStyles.itemPrice}>
          ${item.price.toFixed(2)}
        </Text>
        
        <View style={cartStyles.quantityContainer}>
          <TouchableOpacity 
            style={cartStyles.quantityButton}
            onPress={(e) => {
              e.stopPropagation();
              onDecrement();
            }}
          >
            <Ionicons name="remove" size={18} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={cartStyles.quantityText}>
            {item.quantity || 1}
          </Text>
          
          <TouchableOpacity 
            style={cartStyles.quantityButton}
            onPress={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
          >
            <Ionicons name="add" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={cartStyles.subtotalText}>
          Subtotal: ${subtotal.toFixed(2)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={cartStyles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Ionicons name="trash-outline" size={18} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
