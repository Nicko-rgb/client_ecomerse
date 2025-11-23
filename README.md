# 📱 Cliente E-Commerce - React Native

## 📋 Descripción General

Aplicación móvil de e-commerce desarrollada con React Native y Expo. Incluye autenticación, catálogo de productos, carrito de compras, perfil de usuario y panel de administración.

---

## 🏗️ Estructura del Proyecto

```
client_ecomerse/
├── src/
│   ├── config/          # Configuraciones globales
│   ├── context/         # Context API (Estado global)
│   ├── hooks/           # Custom hooks reutilizables
│   ├── modules/         # Módulos de la aplicación
│   ├── navigation/      # Configuración de navegación
│   └── theme/           # Estilos y temas
├── assets/              # Recursos estáticos (imágenes, fuentes)
├── App.js               # Punto de entrada de la aplicación
└── package.json         # Dependencias del proyecto
```

---

## 📂 Carpetas Principales

### `/src/config`
Configuraciones globales de la aplicación.

**Archivos**:
- `api.js` - URL base de la API y configuraciones de red

**Uso**:
```javascript
import API_CONFIG from './config/api';
const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
```

---

### `/src/context`
Manejo de estado global usando Context API.

**Archivos**:
- `AuthContext.js` - Autenticación y usuario
- `CartContext.js` - Carrito de compras

**AuthContext**:
```javascript
const { user, token, isAuthenticated, login, logout } = useAuth();
```

**CartContext**:
```javascript
const { items, count, addToCart, removeFromCart } = useCart();
```

---

### `/src/hooks`
Custom hooks reutilizables para lógica compartida.

**Archivos**:
- `useProducts.js` - Gestión de productos
- `useOrders.js` - Gestión de pedidos

**Ejemplo**:
```javascript
const { products, loading, error } = useProducts();
```

---

### `/src/modules`
Módulos organizados por funcionalidad (feature-based).

#### Estructura de un módulo:
```
module/
├── screens/       # Pantallas del módulo
├── components/    # Componentes específicos
├── hooks/         # Hooks del módulo
├── models/        # Modelos de datos
└── styles/        # Estilos del módulo
```

#### Módulos disponibles:

**1. `/modules/auth`** - Autenticación
- LoginScreen
- RegisterScreen

**2. `/modules/products`** - Productos
- HomeScreen (lista de productos)
- Producto (detalles)

**3. `/modules/cart`** - Carrito
- CartScreen
- CheckoutScreen

**4. `/modules/profile`** - Perfil de usuario
- ProfileScreen
- EditProfileScreen
- AddressesScreen
- PaymentMethodsScreen
- OrderHistoryScreen
- SettingsScreen
- ChangePasswordScreen
- PrivacySettingsScreen

**5. `/modules/admin`** - Panel de administración
- AdminDashboardScreen
- AdminProductsScreen
- AdminOrdersScreen
- AdminUsersScreen

---

### `/src/navigation`
Configuración de navegación de la aplicación.

**Archivos**:
- `AppNavigator.js` - Navegador principal (Stack + Tabs)

**Estructura**:
```javascript
Stack Navigator (Principal)
├── WelcomeScreen
├── MainTabs (Bottom Tabs)
│   ├── Productos
│   ├── Carrito
│   └── Perfil
├── LoginScreen
├── RegisterScreen
└── [Otras pantallas...]
```

---

### `/src/theme`
Estilos y temas globales.

**Archivos**:
- `colors.js` - Paleta de colores
- `fonts.js` - Fuentes personalizadas

**Uso**:
```javascript
import { colors } from './theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
  }
});
```

---

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Instalar AsyncStorage
npm install @react-native-async-storage/async-storage

# Iniciar el proyecto
npm start
```

---

## 📦 Dependencias Principales

```json
{
  "@react-navigation/native": "Navegación",
  "@react-navigation/stack": "Stack Navigator",
  "@react-navigation/bottom-tabs": "Bottom Tabs",
  "@react-native-async-storage/async-storage": "Almacenamiento local",
  "expo": "Framework de React Native",
  "react-native-gesture-handler": "Gestos",
  "react-native-safe-area-context": "Safe Area"
}
```

---

## 🔐 Autenticación

### Flujo de autenticación:
1. Usuario ingresa credenciales en LoginScreen
2. AuthContext.login() llama a la API
3. Token y user se guardan en AsyncStorage
4. Estado global se actualiza
5. Usuario es redirigido a MainTabs

### Persistencia:
- Token JWT guardado en AsyncStorage
- Verificación automática al iniciar la app
- Logout limpia AsyncStorage

---

## 🛒 Carrito de Compras

### Funcionalidades:
- Agregar productos
- Incrementar/Decrementar cantidad
- Eliminar productos
- Calcular subtotal
- Persistencia en AsyncStorage
- Verificar autenticación antes del checkout

---

## 👤 Perfil de Usuario

### Características:
- Avatar con iniciales personalizadas
- Editar información personal
- Gestión de direcciones
- Gestión de métodos de pago
- Historial de pedidos
- Configuración de notificaciones
- Cambio de contraseña
- Configuración de privacidad

---

## 🎨 Guía de Estilos

### Colores principales:
```javascript
{
  primary: '#44C38D',      // Verde principal
  bg: '#F5F5F5',           // Fondo
  white: '#FFFFFF',        // Blanco
  dark: '#1A1A1A',         // Texto oscuro
  gray: '#6B7280',         // Gris
  error: '#FF6B6B',        // Error
  success: '#44C38D',      // Éxito
}
```

### Componentes reutilizables:
- ProductCard
- CartItem
- ProfileMenuItem
- AddressCard

---

## 🧪 Testing

### Credenciales de prueba:

**Cliente**:
```
Email: usuario@ejemplo.com
Password: password123
```

**Administrador**:
```
Email: admin@ejemplo.com
Password: admin123
```

---

## 📱 Pantallas Principales

### HomeScreen
- Lista de productos desde la API
- Búsqueda de productos
- Filtro por categorías
- Agregar al carrito

### CartScreen
- Lista de productos en el carrito
- Modificar cantidades
- Eliminar productos
- Ver subtotal
- Proceder al checkout

### ProfileScreen
- Avatar personalizado
- Información del usuario
- Menú de opciones
- Logout

### AdminDashboardScreen
- Estadísticas generales
- Gráficos de ventas
- Actividad reciente
- Accesos rápidos

---

## 🔄 Flujo de Datos

```
Usuario → Pantalla → Hook → API → Backend
                ↓
            Context (Estado Global)
                ↓
        AsyncStorage (Persistencia)
```

---

## 🚀 Comandos Útiles

```bash
# Iniciar en modo desarrollo
npm start

# Limpiar caché
npm start -- --clear

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web
npm run web
```

---

## 📝 Convenciones de Código

### Nombres de archivos:
- Componentes: `PascalCase.js` (ej: `ProductCard.js`)
- Hooks: `camelCase.js` (ej: `useProducts.js`)
- Screens: `PascalCase.js` (ej: `HomeScreen.js`)

### Estructura de componentes:
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <View style={styles.container}>
      <Text>{prop1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // estilos
  }
});

export default ComponentName;
```

---

## 🐛 Debugging

### Logs:
```javascript
console.log('Debug:', data);
```

### React Native Debugger:
- Presiona `Cmd + D` (iOS) o `Cmd + M` (Android)
- Selecciona "Debug"

### Errores comunes:
1. **Token expirado**: Cerrar sesión y volver a iniciar
2. **AsyncStorage**: Verificar permisos
3. **Navegación**: Verificar nombres de pantallas

---

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## 👥 Equipo

Para dudas o sugerencias, contacta al equipo de desarrollo.

---

## 📄 Licencia

Este proyecto es privado y confidencial.
