import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';

export default function AppHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
      <Text style={{ flex: 1, fontSize: 22, fontWeight: '700', color: colors.text }}>Mi Tienda</Text>
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}