import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 24 }}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&fit=crop' }}
        style={{ width: 240, height: 240, borderRadius: 120, marginBottom: 24 }}
      />
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>Bienvenido a Mi Tienda</Text>
      <Text style={{ marginTop: 8, color: colors.muted, textAlign: 'center' }}>Explora productos, agrega al carrito y compra fácil.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace('MainTabs')}
        style={{ marginTop: 24, backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}