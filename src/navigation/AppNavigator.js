import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import WelcomeScreen from '../modules/welcome/screens/WelcomeScreen';
import HomeScreen from '../modules/products/screens/HomeScreen';
import CartScreen from '../modules/cart/screens/CartScreen';
import ProfileScreen from '../modules/profile/screens/ProfileScreen';
import { useCart } from '../context/CartContext';

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
    <Stack.Navigator>
      <Stack.Screen name="Bienvenida" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}