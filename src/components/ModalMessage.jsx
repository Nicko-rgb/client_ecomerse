import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { fontNames } from '../theme/fonts';

export default function ModalMessage({
    visible,
    type = 'info',
    title = '',
    message = '',
    onClose,
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
}) {
    const cfg = {
        info: { icon: 'information-circle', color: colors.primary },
        error: { icon: 'alert-circle', color: colors.error },
        success: { icon: 'checkmark-circle', color: colors.secondary },
        warning: { icon: 'warning', color: colors.yellow },
    }[type] || { icon: 'information-circle', color: colors.primary };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <View style={{ width: '100%', maxWidth: 420, borderRadius: 16, backgroundColor: colors.white, padding: 16, borderWidth: 1, borderColor: cfg.color }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name={cfg.icon} size={24} color={cfg.color} />
                        <Text style={{ marginLeft: 8, fontSize: 18, color: colors.text, fontFamily: fontNames.playpenExtraBold }}>{title}</Text>
                    </View>
                    <Text style={{ marginTop: 10, fontSize: 17, color: colors.text, fontFamily: fontNames.spartanRegular }}>{message}</Text>
                    <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {secondaryLabel && (
                            <TouchableOpacity onPress={onSecondary || onClose} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#F3F4F6', marginRight: 8 }}>
                                <Text style={{ color: colors.text, fontWeight: '700' }}>{secondaryLabel}</Text>
                            </TouchableOpacity>
                        )}
                        {primaryLabel && (
                            <TouchableOpacity onPress={onPrimary} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: cfg.color }}>
                                <Text style={{ color: colors.white, fontWeight: '700' }}>{primaryLabel}</Text>
                            </TouchableOpacity>
                        )}
                        {!primaryLabel && !secondaryLabel && (
                            <TouchableOpacity onPress={onClose} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#F3F4F6' }}>
                                <Text style={{ color: colors.text, fontWeight: '700' }}>Cerrar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
