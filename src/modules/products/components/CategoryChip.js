import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';

export default function CategoryChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: selected ? colors.primary : '#E9F6F1',
      }}
    >
      <Text style={{ color: selected ? '#fff' : colors.primary, fontWeight: '600' }}>{label}</Text>
    </TouchableOpacity>
  );
}