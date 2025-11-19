import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomModal from './CustomModal';
import { colors } from '../../../theme/colors';

const ConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm,
  title = 'Confirmar Acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmButtonColor = colors.primary,
  isDestructive = false
}) => {
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.confirmButton,
              { backgroundColor: isDestructive ? colors.error || '#FF6B6B' : confirmButtonColor }
            ]} 
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
});

export default ConfirmationModal;