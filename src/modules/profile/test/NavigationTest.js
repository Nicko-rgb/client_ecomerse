import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../../theme/colors';

// Componente de prueba para verificar navegación
const NavigationTest = ({ navigation }) => {
  const testNavigation = (screenName) => {
    try {
      navigation.navigate(screenName);
      console.log(`✅ Navegación exitosa a: ${screenName}`);
    } catch (error) {
      console.error(`❌ Error navegando a ${screenName}:`, error);
      Alert.alert('Error de Navegación', `No se pudo navegar a ${screenName}`);
    }
  };

  const screens = [
    { name: 'EditProfile', title: 'Editar Perfil' },
    { name: 'AddressesScreen', title: 'Direcciones' },
    { name: 'PaymentMethodsScreen', title: 'Métodos de Pago' },
    { name: 'OrderHistoryScreen', title: 'Historial de Pedidos' },
    { name: 'SettingsScreen', title: 'Configuración' },
    { name: 'HelpScreen', title: 'Ayuda' },
    { name: 'TermsScreen', title: 'Términos' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test de Navegación</Text>
      <Text style={styles.subtitle}>Toca para probar cada pantalla:</Text>
      
      {screens.map((screen) => (
        <TouchableOpacity
          key={screen.name}
          style={styles.button}
          onPress={() => testNavigation(screen.name)}
        >
          <Text style={styles.buttonText}>{screen.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationTest;