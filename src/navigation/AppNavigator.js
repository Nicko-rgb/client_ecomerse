import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from '../modules/welcome/screens/WelcomeScreen';
import HomeScreen from '../modules/products/screens/HomeScreen';
import CartScreen from '../modules/cart/screens/CartScreen';
import { useCart } from '../context/CartContext';

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
} from '../modules/profile';

// Importar pantallas adicionales
import EditAddressScreen from '../modules/profile/screens/EditAddressScreen';
import AddPaymentMethodScreen from '../modules/profile/screens/AddPaymentMethodScreen';
import EditPaymentMethodScreen from '../modules/profile/screens/EditPaymentMethodScreen';
import OrderDetailsScreen from '../modules/profile/screens/OrderDetailsScreen';
import ChangePasswordScreen from '../modules/profile/screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { count } = useCart();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#44C38D',
        tabBarInactiveTintColor: '#98C9B8',
        tabBarStyle: { height: 64 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Productos') return <Ionicons name="home" size={size} color={color} />;
          if (route.name === 'Carrito') return <Ionicons name="cart" size={size} color={color} />;
          return <Ionicons name="person" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Productos" component={HomeScreen} />
      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{
          tabBarBadge: count > 0 ? count : undefined,
          tabBarBadgeStyle: { backgroundColor: '#44C38D' },
        }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#44C38D',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Bienvenida" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      
      {/* Pantallas del módulo Profile */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
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
      <Stack.Screen 
        name="PaymentMethodsScreen" 
        component={PaymentMethodsScreen}
        options={{ title: 'Métodos de Pago' }}
      />
      <Stack.Screen 
        name="OrderHistoryScreen" 
        component={OrderHistoryScreen}
        options={{ title: 'Mis Pedidos' }}
      />
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
      <Stack.Screen 
        name="HelpScreen" 
        component={HelpScreen}
        options={{ title: 'Ayuda y Soporte' }}
      />
      <Stack.Screen 
        name="TermsScreen" 
        component={TermsScreen}
        options={{ title: 'Términos y Condiciones' }}
      />
      
      {/* Pantallas adicionales del perfil */}
      <Stack.Screen 
        name="EditAddressScreen" 
        component={EditAddressScreen}
        options={{ title: 'Editar Dirección' }}
      />
      <Stack.Screen 
        name="AddPaymentMethodScreen" 
        component={AddPaymentMethodScreen}
        options={{ title: 'Agregar Método de Pago' }}
      />
      <Stack.Screen 
        name="EditPaymentMethodScreen" 
        component={EditPaymentMethodScreen}
        options={{ title: 'Editar Método de Pago' }}
      />
      <Stack.Screen 
        name="OrderDetailsScreen" 
        component={OrderDetailsScreen}
        options={{ title: 'Detalles del Pedido' }}
      />
      <Stack.Screen 
        name="ChangePasswordScreen" 
        component={ChangePasswordScreen}
        options={{ title: 'Cambiar Contraseña' }}
      />
    </Stack.Navigator>
  );
}