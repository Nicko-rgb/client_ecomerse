# 📦 Módulos de la Aplicación

## 📋 Descripción

Los módulos están organizados por funcionalidad (feature-based architecture). Cada módulo contiene todo lo necesario para una característica específica: pantallas, componentes, hooks, modelos y estilos.

---

## 🏗️ Estructura de un Módulo

```
module/
├── screens/       # Pantallas del módulo
├── components/    # Componentes específicos del módulo
├── hooks/         # Custom hooks del módulo
├── models/        # Modelos de datos
├── styles/        # Estilos específicos
└── index.js       # Exportaciones del módulo
```

---

## 📂 Módulos Disponibles

### 1. `/auth` - Autenticación

**Propósito**: Manejo de autenticación de usuarios

**Pantallas**:
- `LoginScreen.js` - Inicio de sesión
- `RegisterScreen.js` - Registro de usuarios

**Funcionalidades**:
- Login con email y contraseña
- Registro de nuevos usuarios
- Validación de campos
- Integración con AuthContext
- Navegación post-login

**Uso**:
```javascript
import { LoginScreen, RegisterScreen } from './modules/auth';
```

---

### 2. `/products` - Productos

**Propósito**: Catálogo y detalles de productos

**Pantallas**:
- `HomeScreen.jsx` - Lista de productos
- `Producto.jsx` - Detalles del producto

**Componentes**:
- `ProductCard.jsx` - Tarjeta de producto
- `AppHeader.jsx` - Header de la app

**Hooks**:
- `useProducts.js` - Gestión de productos (mock data)

**Funcionalidades**:
- Lista de productos desde API
- Búsqueda de productos
- Filtro por categorías
- Detalles del producto
- Agregar al carrito
- Productos relacionados

**Uso**:
```javascript
import { HomeScreen, Producto } from './modules/products';
import { useProducts } from '../hooks/useProducts';

const { products, loading, error } = useProducts();
```

---

### 3. `/cart` - Carrito de Compras

**Propósito**: Gestión del carrito y checkout

**Pantallas**:
- `CartScreen.js` - Carrito de compras
- `CheckoutScreen.js` - Finalizar compra

**Componentes**:
- `CartItem.js` - Item del carrito
- `CartSummary.jsx` - Resumen del carrito
- `EmptyCart.js` - Estado vacío
- `ProductDetailModal.js` - Modal de detalles

**Funcionalidades**:
- Ver productos en el carrito
- Incrementar/Decrementar cantidad
- Eliminar productos
- Calcular subtotal
- Verificar autenticación
- Proceder al checkout

**Uso**:
```javascript
import { CartScreen, CheckoutScreen } from './modules/cart';
import { useCart } from '../../context/CartContext';

const { items, count, addToCart, removeFromCart } = useCart();
```

---

### 4. `/profile` - Perfil de Usuario

**Propósito**: Gestión del perfil y configuraciones

**Pantallas**:
- `ProfileScreen.js` - Perfil principal
- `EditProfileScreen.js` - Editar perfil
- `AddressesScreen.js` - Gestión de direcciones
- `AddAddressScreen.js` - Agregar dirección
- `EditAddressScreen.js` - Editar dirección
- `PaymentMethodsScreen.js` - Métodos de pago
- `AddPaymentMethodScreen.js` - Agregar método
- `EditPaymentMethodScreen.js` - Editar método
- `OrderHistoryScreen.js` - Historial de pedidos
- `OrderDetailsScreen.js` - Detalles de pedido
- `SettingsScreen.js` - Configuración
- `ChangePasswordScreen.js` - Cambiar contraseña
- `PrivacySettingsScreen.js` - Privacidad
- `HelpScreen.js` - Ayuda y soporte
- `TermsScreen.js` - Términos y condiciones

**Componentes**:
- `ProfileHeader.js` - Header del perfil con avatar
- `ProfileMenuItem.js` - Item del menú
- `AddressCard.js` - Tarjeta de dirección
- `CustomModal.js` - Modal personalizado

**Hooks**:
- `useProfile.js` - Gestión del perfil

**Models**:
- `User.js` - Modelo de usuario

**Funcionalidades**:
- Avatar con iniciales personalizadas
- Editar información personal
- Gestión de direcciones
- Gestión de métodos de pago
- Historial de pedidos con estados
- Configuración de notificaciones
- Cambio de contraseña con validación
- Configuración de privacidad
- Ayuda y soporte
- Logout

**Uso**:
```javascript
import { ProfileScreen, EditProfileScreen } from './modules/profile';
import { useProfile } from './modules/profile/hooks/useProfile';

const { profile, addresses, paymentMethods, updateProfile } = useProfile();
```

---

### 5. `/admin` - Panel de Administración

**Propósito**: Gestión administrativa del sistema

**Pantallas**:
- `AdminDashboardScreen.js` - Dashboard principal
- `AdminProductsScreen.js` - Gestión de productos
- `AdminCreateProductScreen.js` - Crear producto
- `AdminEditProductScreen.js` - Editar producto
- `AdminOrdersScreen.js` - Gestión de pedidos
- `AdminOrderDetailsScreen.js` - Detalles de pedido
- `AdminUsersScreen.js` - Gestión de usuarios
- `AdminUserDetailsScreen.js` - Detalles de usuario

**Componentes**:
- `StatCard.js` - Tarjeta de estadística
- `ActivityItem.js` - Item de actividad
- `ProductCard.js` - Tarjeta de producto admin
- `OrderCard.js` - Tarjeta de pedido
- `UserCard.js` - Tarjeta de usuario

**Hooks**:
- `useAdmin.js` - Gestión del dashboard
  - `useAdmin()` - Estadísticas y actividad
  - `useProducts()` - CRUD de productos
  - `useOrders()` - Gestión de pedidos
  - `useAdminUsers()` - Gestión de usuarios

**Funcionalidades**:
- Dashboard con estadísticas
- Gráficos de ventas
- Actividad reciente
- CRUD completo de productos
- Gestión de pedidos
- Actualización de estados
- Gestión de usuarios
- Cambio de roles
- Solo accesible para admins

**Uso**:
```javascript
import { AdminDashboardScreen } from './modules/admin';
import { useAdmin, useProducts } from './modules/admin/hooks/useAdmin';

const { dashboardStats, recentActivity } = useAdmin();
const { products, createProduct, updateProduct, deleteProduct } = useProducts();
```

---

## 🔄 Flujo de Datos entre Módulos

```
Usuario → Pantalla (Screen)
            ↓
        Componente
            ↓
        Hook (useXXX)
            ↓
        API / Context
            ↓
        Backend
```

---

## 🎯 Mejores Prácticas

### 1. Organización
- Cada módulo debe ser independiente
- Componentes reutilizables en `/components` global
- Componentes específicos en el módulo

### 2. Naming
- Screens: `PascalCase` + `Screen` (ej: `ProfileScreen.js`)
- Components: `PascalCase` (ej: `ProductCard.jsx`)
- Hooks: `camelCase` + `use` prefix (ej: `useProducts.js`)

### 3. Imports
```javascript
// ✅ Bueno - Import desde index
import { ProfileScreen } from './modules/profile';

// ❌ Malo - Import directo
import ProfileScreen from './modules/profile/screens/ProfileScreen';
```

### 4. Exportaciones
Usar `index.js` en cada módulo:
```javascript
// modules/profile/index.js
export { default as ProfileScreen } from './screens/ProfileScreen';
export { default as EditProfileScreen } from './screens/EditProfileScreen';
```

---

## 🔐 Protección de Rutas

### Verificación de Autenticación
```javascript
// En la pantalla
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <LoginPrompt />;
}
```

### Verificación de Rol
```javascript
// En la pantalla admin
const { isAdmin } = useAuth();

if (!isAdmin) {
  return <AccessDenied />;
}
```

---

## 🎨 Estilos

### Estilos Globales
```javascript
import { colors } from '../../theme/colors';
```

### Estilos del Módulo
```javascript
// En /styles del módulo
import styles from '../styles/profileStyles';
```

---

## 🧪 Testing

### Probar un Módulo
1. Navegar a la pantalla principal
2. Verificar que carga correctamente
3. Probar todas las funcionalidades
4. Verificar navegación entre pantallas
5. Probar estados de error
6. Verificar loading states

---

## 📝 Agregar un Nuevo Módulo

1. **Crear estructura**:
```bash
mkdir -p src/modules/nuevo-modulo/{screens,components,hooks,models,styles}
```

2. **Crear index.js**:
```javascript
export { default as NuevaPantalla } from './screens/NuevaPantalla';
```

3. **Agregar al navegador**:
```javascript
import { NuevaPantalla } from './modules/nuevo-modulo';

<Stack.Screen name="NuevaPantalla" component={NuevaPantalla} />
```

4. **Crear hook si es necesario**:
```javascript
// hooks/useNuevoModulo.js
export const useNuevoModulo = () => {
  // Lógica
  return { data, loading, error };
};
```

---

## 🚀 Comandos Útiles

```bash
# Ver estructura de módulos
tree src/modules -L 2

# Buscar en módulos
grep -r "searchTerm" src/modules/

# Contar archivos por módulo
find src/modules -type f | wc -l
```

---

## 📚 Recursos

- [React Native Components](https://reactnative.dev/docs/components-and-apis)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Feature-Based Architecture](https://khalilstemmler.com/articles/software-design-architecture/feature-sliced/)

---

## 👥 Contribuir

Al agregar nuevas funcionalidades:
1. Seguir la estructura de módulos existente
2. Documentar nuevos hooks y componentes
3. Agregar ejemplos de uso
4. Actualizar este README

---

## 📄 Licencia

Este proyecto es privado y confidencial.
