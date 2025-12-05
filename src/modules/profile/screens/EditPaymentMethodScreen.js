import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../theme/colors';
import Header from '../../../components/Header';

const EditPaymentMethodScreen = ({ navigation, route }) => {
  const { paymentMethod } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isPrimary: false,
  });

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        type: paymentMethod.type || 'credit_card',
        cardNumber: paymentMethod.cardNumber || '',
        cardHolder: paymentMethod.cardHolder || '',
        expiryDate: paymentMethod.expiryDate || '',
        isPrimary: paymentMethod.isPrimary || false,
      });
    }
  }, [paymentMethod]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleExpiryDateChange = (value) => {
    const formatted = formatExpiryDate(value);
    handleInputChange('expiryDate', formatted);
  };

  const handleSave = async () => {
    if (!formData.cardHolder.trim()) {
      Alert.alert('Error', 'El nombre del titular es obligatorio');
      return;
    }
    
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      Alert.alert('Error', 'Fecha de vencimiento inválida');
      return;
    }

    setLoading(true);
    
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Éxito', 'Método de pago actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el método de pago');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Método de Pago',
      '¿Estás seguro de que quieres eliminar este método de pago?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            console.log('Eliminar método de pago:', paymentMethod.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Editar Método de Pago" onBack={() => navigation.goBack()} />
      <View style={styles.form}>
        <Text style={styles.title}>Editar Método de Pago</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Tarjeta</Text>
          <View style={styles.typeContainer}>
            {[
              { key: 'credit_card', label: '💳 Crédito' },
              { key: 'debit_card', label: '💳 Débito' },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.typeOption,
                  formData.type === type.key && styles.typeOptionSelected
                ]}
                onPress={() => handleInputChange('type', type.key)}
              >
                <Text style={[
                  styles.typeText,
                  formData.type === type.key && styles.typeTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Tarjeta</Text>
          <View style={styles.cardNumberContainer}>
            <Text style={styles.cardNumberText}>{formData.cardNumber}</Text>
            <Text style={styles.cardNumberNote}>
              Por seguridad, no se puede modificar el número de tarjeta
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Titular *</Text>
          <TextInput
            style={styles.input}
            value={formData.cardHolder}
            onChangeText={(value) => handleInputChange('cardHolder', value.toUpperCase())}
            placeholder="JUAN PÉREZ"
            placeholderTextColor={colors.gray}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de Vencimiento *</Text>
          <TextInput
            style={[styles.input, styles.halfWidthInput]}
            value={formData.expiryDate}
            onChangeText={handleExpiryDateChange}
            placeholder="MM/AA"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleInputChange('isPrimary', !formData.isPrimary)}
          >
            <View style={[
              styles.checkboxBox,
              formData.isPrimary && styles.checkboxBoxChecked
            ]}>
              {formData.isPrimary && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Establecer como método principal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Eliminar Método de Pago</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark,
  },
  halfWidthInput: {
    width: '50%',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: colors.dark,
  },
  typeTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  cardNumberContainer: {
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
    padding: 12,
  },
  cardNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  cardNumberNote: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: colors.dark,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error || '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPaymentMethodScreen;
