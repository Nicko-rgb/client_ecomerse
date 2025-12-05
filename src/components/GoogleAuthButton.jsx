import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import colors from '../theme/colors';
import logo from '../../assets/icos/google.png'

export default function GoogleAuthButton({ onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#fff'
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Image source={logo} style={{ width: 18, height: 18 }} />
        <Text style={{ color: colors.text, fontWeight: '700' }}>Continuar con Google</Text>
      </View>
    </TouchableOpacity>
  );
}
