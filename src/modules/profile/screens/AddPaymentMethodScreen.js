import React, { useState } from 'react';
import {
  View,
  Text,
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
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: 'credit_card',
      title: '💳 Tarjeta de Crédito/Débito',
      subtitle: 'Visa, Mastercard, American Express',
      popular: true
    },
    {
      id: 'paypal',
      title: '🅿️ PayPal',
      subtitle: 'Paga con tu cuenta de PayPal',
      popular: true
    },
    {
      id: 'apple_pay',
      title: '📱 Apple Pay',
      subtitle: 'Pago rápido y seguro con Face ID',
      popular: false
    },
    {
      id: 'google_pay',
      title: '🟢 Google Pay',
      subtitle: 'Pago rápido con tu cuenta Google',
      popular: false
    },
    {
      id: 'bank_transfer',
      title: '🏦 Transferencia Bancaria',
      subtitle: 'Pago directo desde tu banco',
      popular: false
    }
  ];

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleContinue = async () => {
    if (!selectedMethod) {
      Alert.alert('Selecciona un método', 'Por favor selecciona un método de pago');
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethod);
    
    // Crear datos del método de pago
    const paymentMethodData = {
      type: selectedMethod,
      title: method.title,
      cardNumber: selectedMethod === 'credit_card' ? '**** **** **** 0000' : 
                  selectedMethod === 'paypal' ? 'usuario@ejemplo.com' : '',
      cardHolder: selectedMethod === 'credit_card' ? 'USUARIO EJEMPLO' : 
                  selectedMethod === 'paypal' ? 'Usuario Ejemplo' : '',
      expiryDate: selectedMethod === 'credit_card' ? '12/28' : '',
      isPrimary: false
    };
    
    const result = await addPaymentMethod(paymentMethodData);
    
    if (result.success) {
      Alert.alert('Éxito', result.message || 'Método de pago agregado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'No se pudo agregar el método de pago');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>💳 Agregar Método de Pago</Text>
        <Text style={styles.subtitle}>Selecciona tu método de pago preferido</Text>
        
        <View style={styles.methodsList}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
                method.popular && styles.methodCardPopular
              ]}
              onPress={() => handleSelectMethod(method.id)}
            >
              {method.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
              
              <View style={styles.methodContent}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              
              <View style={[
                styles.radioButton,
                selectedMethod === method.id && styles.radioButtonSelected
              ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🔒 Pago Seguro</Text>
          <Text style={styles.infoText}>
            Todos los métodos de pago están protegidos con encriptación de nivel bancario.
          </Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !selectedMethod && styles.continueButtonDisabled,
            loading && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedMethod || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.continueButtonText}>
              {selectedMethod ? 'Continuar' : 'Selecciona un método'}
            </Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  methodsList: {
    marginBottom: 20,
  },
  methodCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E8',
  },
  methodCardPopular: {
    borderColor: colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: colors.gray,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddPaymentMethodScreen;