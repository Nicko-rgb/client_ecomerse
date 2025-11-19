import React, { useState } from 'react';
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
import { useProfile } from '../hooks/useProfile';
import { colors } from '../../../theme/colors';

const AddPaymentMethodScreen = ({ navigation }) => {
  const { addPaymentMethod, loading } = useProfile();
  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    isPrimary: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = value.replace(/\D/g, '');
    // Agregar espacios cada 4 dígitos
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const formatExpiryDate = (value) => {
    // Remover caracteres no numéricos
    const cleaned = value.replace(/\D/g, '');
    // Agregar slash después de 2 dígitos
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (value) => {
    const formatted = formatCardNumber(value);
    handleInputChange('cardNumber', formatted);
  };

  const handleExpiryDateChange = (value) => {
    const formatted = formatExpiryDate(value);
    handleInputChange('expiryDate', formatted);
  };

  const validateForm = () => {
    if (!formData.cardNumber.replace(/\s/g, '') || formData.cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Número de tarjeta inválido');
      return false;
    }
    
    if (!formData.cardHolder.trim()) {
      Alert.alert('Error', 'El nombre del titular es obligatorio');
      return false;
    }
    
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      Alert.alert('Error', 'Fecha de vencimiento inválida');
      return false;
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      Alert.alert('Error', 'CVV inválido');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Enmascarar número de tarjeta para guardar
    const maskedCardNumber = '**** **** **** ' + formData.cardNumber.slice(-4);
    
    const paymentMethodData = {
      ...formData,
      cardNumber: maskedCardNumber,
    };

    const result = await addPaymentMethod(paymentMethodData);
    
    if (result.success) {
      Alert.alert('Éxito', 'Método de pago agregado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al agregar el método de pago');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Agregar Método de Pago</Text>
        
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
          <Text style={styles.label}>Número de Tarjeta *</Text>
          <TextInput
            style={styles.input}
            value={formData.cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.gray}
            keyboardType="numeric"
            maxLength={19}
          />
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

        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Vencimiento *</Text>
            <TextInput
              style={styles.input}
              value={formData.expiryDate}
              onChangeText={handleExpiryDateChange}
              placeholder="MM/AA"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>CVV *</Text>
            <TextInput
              style={styles.input}
              value={formData.cvv}
              onChangeText={(value) => handleInputChange('cvv', value.replace(/\D/g, ''))}
              placeholder="123"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
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

        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Tu información está protegida con encriptación de nivel bancario
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Método de Pago</Text>
          )}
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.gray,
    flex: 1,
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

export default AddPaymentMethodScreen;