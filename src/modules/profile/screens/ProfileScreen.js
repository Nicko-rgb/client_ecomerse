import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../../theme/colors';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Perfil</Text>
      <Text style={{ marginTop: 8 }}>Próximamente</Text>
    </View>
  );
}