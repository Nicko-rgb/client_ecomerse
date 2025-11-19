import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';
import { useCart } from '../../../context/CartContext';

export default function CartScreen() {
  const { items, removeFromCart, clearCart } = useCart();
  const total = items.reduce((s, p) => s + p.price, 0);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '600', color: colors.text }}>{item.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 12 }}>$ {item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(index)}>
                <Text style={{ color: colors.primary }}>Quitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>Tu carrito está vacío</Text>}
      />
      <View style={{ padding: 16, borderTopWidth: 1, borderColor: '#eee' }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Total: $ {total.toFixed(2)}</Text>
        <TouchableOpacity style={{ marginTop: 12, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10 }} onPress={clearCart}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Proceder al pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}