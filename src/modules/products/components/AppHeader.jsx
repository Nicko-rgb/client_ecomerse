import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../theme/colors';
import { fontNames } from '../../../theme/fonts';

export default function AppHeader() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 }}>
            <Text style={{ flex: 1, fontSize: 22, color: colors.primary, fontFamily: fontNames.playpenExtraBold }}>Mi Tienda</Text>
            <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
}