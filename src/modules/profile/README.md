# Módulo de Profile - Ecommerce

Este módulo maneja toda la funcionalidad relacionada con el perfil del usuario en la aplicación de ecommerce.

## Estructura del Módulo

```
profile/
├── components/          # Componentes reutilizables
│   ├── ProfileHeader.js    # Header del perfil con avatar y info básica
│   ├── ProfileMenuItem.js  # Item de menú con icono y navegación
│   └── AddressCard.js      # Tarjeta para mostrar direcciones
├── hooks/              # Custom hooks
│   └── useProfile.js      # Hook principal para gestión del perfil
├── screens/            # Pantallas del módulo
│   ├── ProfileScreen.js         # Pantalla principal del perfil
│   ├── EditProfileScreen.js     # Editar información personal
│   ├── AddressesScreen.js       # Gestión de direcciones
│   ├── AddAddressScreen.js      # Agregar nueva dirección
│   ├── PaymentMethodsScreen.js  # Gestión de métodos de pago
│   ├── OrderHistoryScreen.js    # Historial de pedidos
│   ├── SettingsScreen.js        # Configuraciones de la app
│   ├── HelpScreen.js           # Ayuda y soporte
│   └── TermsScreen.js          # Términos y condiciones
├── styles/             # Estilos compartidos
│   └── profile.js         # Estilos del módulo
├── index.js            # Exportaciones del módulo
└── README.md           # Documentación
```

## Funcionalidades

### 1. Perfil Principal
- **ProfileScreen**: Pantalla principal con menú de opciones
- Información del usuario (nombre, email, avatar)
- Navegación a diferentes secciones
- Opción de cerrar sesión

### 2. Edición de Perfil
- **EditProfileScreen**: Formulario para editar información personal
- Campos: nombre, apellido, email, teléfono, fecha de nacimiento, género
- Validaciones de formulario
- Actualización en tiempo real

### 3. Gestión de Direcciones
- **AddressesScreen**: Lista de direcciones guardadas
- **AddressCard**: Componente para mostrar cada dirección
- Agregar, editar y eliminar direcciones
- Establecer dirección principal

### 4. Componentes Reutilizables
- **ProfileHeader**: Header con avatar y información básica
- **ProfileMenuItem**: Item de menú con icono y navegación
- **AddressCard**: Tarjeta para mostrar direcciones

### 5. Hook Principal
- **useProfile**: Gestiona el estado y las operaciones del perfil
- Conexión con la API del backend
- Estados de loading y error
- Operaciones CRUD para perfil y direcciones

## API Endpoints (Backend)

### Perfil
- `GET /api/profile/:id` - Obtener perfil del usuario
- `PUT /api/profile/:id` - Actualizar perfil del usuario

### Direcciones
- `GET /api/profile/:id/addresses` - Obtener direcciones del usuario
- `POST /api/profile/:id/addresses` - Agregar nueva dirección

### Métodos de Pago
- `GET /api/profile/:id/payment-methods` - Obtener métodos de pago
- `POST /api/profile/:id/payment-methods` - Agregar método de pago

## Uso del Módulo

### Importar componentes
```javascript
import { 
  ProfileScreen, 
  EditProfileScreen, 
  useProfile 
} from '../modules/profile';
```

### Usar el hook
```javascript
const { 
  profile, 
  addresses, 
  loading, 
  error, 
  updateProfile 
} = useProfile(userId);
```

### Navegación
El módulo está diseñado para trabajar con React Navigation. Consulta el archivo `navigation/ProfileNavigator.example.js` para ver un ejemplo completo de integración.

Pantallas principales:
```javascript
// Pantallas principales
<Stack.Screen name="Profile" component={ProfileScreen} />
<Stack.Screen name="EditProfile" component={EditProfileScreen} />
<Stack.Screen name="AddressesScreen" component={AddressesScreen} />
<Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
<Stack.Screen name="PaymentMethodsScreen" component={PaymentMethodsScreen} />
<Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
<Stack.Screen name="SettingsScreen" component={SettingsScreen} />
<Stack.Screen name="HelpScreen" component={HelpScreen} />
<Stack.Screen name="TermsScreen" component={TermsScreen} />
```

## Configuración

### Backend
1. Asegúrate de que el servidor esté corriendo en `http://localhost:5000`
2. Los endpoints de la API están configurados en `useProfile.js`

### Frontend
1. Importa los colores del tema: `import { colors } from '../../../theme/colors'`
2. Los estilos están centralizados en `styles/profile.js`

## Solución de Problemas

### Error: "profile.getFullName is not a function"
**Solucionado**: El hook `useProfile` ahora convierte automáticamente los datos del backend en instancias de la clase `User`, que incluye todos los métodos necesarios.

### Error: "Network request failed"
**Solucionado**: Configurada la IP local en `src/config/api.js` para permitir conexiones desde el emulador/dispositivo.

## Funcionalidades Completadas

- [x] Perfil principal con información del usuario
- [x] Edición de perfil completa
- [x] Gestión de direcciones (listar, agregar)
- [x] Gestión de métodos de pago (listar)
- [x] Historial de pedidos con estados
- [x] Configuraciones completas (notificaciones, seguridad, apariencia)
- [x] Sistema de ayuda con FAQ
- [x] Términos y condiciones
- [x] Navegación completa entre pantallas

## Próximas Funcionalidades

- [ ] Editar/eliminar direcciones (funcionalidad backend)
- [ ] Agregar/editar métodos de pago (formularios)
- [ ] Detalles de pedidos individuales
- [ ] Cambio de contraseña (formulario)
- [ ] Configuración de privacidad
- [ ] Chat de soporte en vivo
- [ ] Notificaciones push
- [ ] Modo oscuro funcional

## Dependencias

- React Native
- React Navigation (para navegación entre pantallas)
- Fetch API (para comunicación con backend)

## Notas de Desarrollo

- El módulo sigue la arquitectura modular del proyecto
- Cada funcionalidad está separada en su propio archivo
- Los estilos utilizan el sistema de colores centralizado
- El hook `useProfile` centraliza toda la lógica de estado
- Los componentes son reutilizables y modulares