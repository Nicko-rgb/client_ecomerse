// Ejemplo de cómo integrar las pantallas del módulo Profile en React Navigation
// Este archivo es solo de referencia - adapta según tu estructura de navegación

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importar todas las pantallas del módulo Profile
import {
  ProfileScreen,
  EditProfileScreen,
  AddressesScreen,
  AddAddressScreen,
  PaymentMethodsScreen,
  OrderHistoryScreen,
  SettingsScreen,
  HelpScreen,
  TermsScreen,
} from '../index';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#44C38D', // colors.primary
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Pantalla principal del perfil */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
      
      {/* Edición de perfil */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      
      {/* Gestión de direcciones */}
      <Stack.Screen 
        name="AddressesScreen" 
        component={AddressesScreen}
        options={{ title: 'Mis Direcciones' }}
      />
      
      <Stack.Screen 
        name="AddAddressScreen" 
        component={AddAddressScreen}
        options={{ title: 'Agregar Dirección' }}
      />
      
      {/* Métodos de pago */}
      <Stack.Screen 
        name="PaymentMethodsScreen" 
        component={PaymentMethodsScreen}
        options={{ title: 'Métodos de Pago' }}
      />
      
      {/* Historial de pedidos */}
      <Stack.Screen 
        name="OrderHistoryScreen" 
        component={OrderHistoryScreen}
        options={{ title: 'Mis Pedidos' }}
      />
      
      {/* Configuración */}
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
      
      {/* Ayuda y soporte */}
      <Stack.Screen 
        name="HelpScreen" 
        component={HelpScreen}
        options={{ title: 'Ayuda' }}
      />
      
      {/* Términos y condiciones */}
      <Stack.Screen 
        name="TermsScreen" 
        component={TermsScreen}
        options={{ title: 'Términos y Condiciones' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

// Ejemplo de uso en tu AppNavigator principal:
/*
import ProfileNavigator from './modules/profile/navigation/ProfileNavigator';

// En tu Tab Navigator o Stack Navigator principal:
<Tab.Screen 
  name="ProfileTab" 
  component={ProfileNavigator}
  options={{
    tabBarLabel: 'Perfil',
    tabBarIcon: ({ color, size }) => (
      <Icon name="person" size={size} color={color} />
    ),
  }}
/>
*/