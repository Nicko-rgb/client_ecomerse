import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import WelcomeScreen from '../modules/welcome/screens/WelcomeScreen';
import HomeScreen from '../modules/products/screens/HomeScreen';
import ImageViewer from '../modules/products/screens/ImageViewer';
import Producto from '../modules/products/screens/Producto';
import CartScreen from '../modules/cart/screens/CartScreen';
import CheckoutScreen from '../modules/cart/screens/CheckoutScreen';
import OrderConfirmationScreen from '../modules/cart/screens/OrderConfirmationScreen';
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

// Importar pantallas adicionales del perfil
import EditAddressScreen from '../modules/profile/screens/EditAddressScreen';
import AddPaymentMethodScreen from '../modules/profile/screens/AddPaymentMethodScreen';
import EditPaymentMethodScreen from '../modules/profile/screens/EditPaymentMethodScreen';
import OrderDetailsScreen from '../modules/profile/screens/OrderDetailsScreen';
import ChangePasswordScreen from '../modules/profile/screens/ChangePasswordScreen';

// Importar pantallas del módulo Admin
import {
  AdminDashboardScreen,
  AdminProductsScreen,
  AdminCreateProductScreen,
  AdminEditProductScreen,
  AdminOrdersScreen,
  AdminOrderDetailsScreen,
  AdminUsersScreen,
  AdminUserDetailsScreen,
} from '../modules/admin';

// Importar pantallas de autenticación
import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProductsStack = createNativeStackNavigator();

function ProductosStack() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductsStack.Screen name="HomeProductos" component={HomeScreen} />
      <ProductsStack.Screen name="Producto" component={Producto} />
    </ProductsStack.Navigator>
  );
}

function MainTabs() {
  const { count } = useCart();
  const flyX = useRef(new Animated.Value(0));
  const flyY = useRef(new Animated.Value(0));
  const [flyVisible, setFlyVisible] = useState(false);
  const cartScale = useRef(new Animated.Value(1));
  const cartIconRef = useRef(null);
  const [cartIconPos, setCartIconPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    global.__startCartFly__ = (sx, sy) => {
      if (!cartIconPos.x && !cartIconPos.y) return;
      setFlyVisible(true);
      flyX.current.setValue(sx);
      flyY.current.setValue(sy);
      Animated.parallel([
        Animated.timing(flyX.current, { toValue: cartIconPos.x, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(flyY.current, { toValue: cartIconPos.y, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ]).start(() => {
        setFlyVisible(false);
        Animated.sequence([
          Animated.timing(cartScale.current, { toValue: 1.2, duration: 120, useNativeDriver: true }),
          Animated.timing(cartScale.current, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start();
      });
    };
    return () => {
      if (global.__startCartFly__ && typeof global.__startCartFly__ === 'function') delete global.__startCartFly__;
    };
  }, [cartIconPos.x, cartIconPos.y]);

  return (
    <View style={{ flex: 1 }}>
      {flyVisible && (
        <Animated.View
          pointerEvents="none"
          style={{ position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, left: flyX.current, top: flyY.current, zIndex: 999 }}
        />
      )}
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.primaryLight,
        tabBarStyle: { height: 64 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Productos') return <Ionicons name="home" size={size} color={color} />;
          if (route.name === 'Carrito') return (
            <Animated.View
              ref={cartIconRef}
              onLayout={() => {
                if (cartIconRef.current && cartIconRef.current.measureInWindow) {
                  cartIconRef.current.measureInWindow((x, y, w, h) => {
                    setCartIconPos({ x: x + w / 2, y: y + h / 2 });
                  });
                }
              }}
              style={{ transform: [{ scale: cartScale.current }] }}
            >
              <Ionicons name="cart" size={size} color={color} />
            </Animated.View>
          );
          return <Ionicons name="person" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Productos" component={ProductosStack} />
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
    </View>
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
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Finalizar Compra' }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageViewer"
        component={ImageViewer}
        options={{ headerShown: false }}
      />

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

      {/* Pantallas del módulo Admin */}
      <Stack.Screen
        name="AdminDashboardScreen"
        component={AdminDashboardScreen}
        options={{ title: 'Dashboard Admin' }}
      />
      <Stack.Screen
        name="AdminProductsScreen"
        component={AdminProductsScreen}
        options={{ title: 'Gestión de Productos' }}
      />
      <Stack.Screen
        name="AdminCreateProductScreen"
        component={AdminCreateProductScreen}
        options={{ title: 'Crear Producto' }}
      />
      <Stack.Screen
        name="AdminEditProductScreen"
        component={AdminEditProductScreen}
        options={{ title: 'Editar Producto' }}
      />
      <Stack.Screen
        name="AdminOrdersScreen"
        component={AdminOrdersScreen}
        options={{ title: 'Gestión de Pedidos' }}
      />
      <Stack.Screen
        name="AdminOrderDetailsScreen"
        component={AdminOrderDetailsScreen}
        options={{ title: 'Detalles del Pedido' }}
      />
      <Stack.Screen
        name="AdminUsersScreen"
        component={AdminUsersScreen}
        options={{ title: 'Gestión de Usuarios' }}
      />
      <Stack.Screen
        name="AdminUserDetailsScreen"
        component={AdminUserDetailsScreen}
        options={{ title: 'Detalles del Usuario' }}
      />

      {/* Pantallas de Autenticación */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: 'Iniciar Sesión', headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: 'Crear Cuenta' }}
      />

      {/* Pantalla de Privacidad */}
      <Stack.Screen
        name="PrivacySettingsScreen"
        component={require('../modules/profile/screens/PrivacySettingsScreen').default}
        options={{ title: 'Privacidad y Datos' }}
      />
    </Stack.Navigator>
  );
}
