# Test de Navegación - Módulo Profile

## Pasos para probar la navegación:

### 1. Reiniciar la aplicación
```bash
# En la terminal donde corre Metro
# Presiona 'r' para reload o Ctrl+C y luego:
npx expo start
```

### 2. Verificar que el servidor esté corriendo
```bash
# En otra terminal:
cd server_ecomerse
npm start
```

### 3. Probar navegación paso a paso:

#### Desde ProfileScreen:
- ✅ Tap en "Editar Perfil" → debe ir a `EditProfile`
- ✅ Tap en "Direcciones" → debe ir a `AddressesScreen`
- ✅ Tap en "Métodos de Pago" → debe ir a `PaymentMethodsScreen`
- ✅ Tap en "Historial de Pedidos" → debe ir a `OrderHistoryScreen`
- ✅ Tap en "Configuración" → debe ir a `SettingsScreen`
- ✅ Tap en "Ayuda y Soporte" → debe ir a `HelpScreen`
- ✅ Tap en "Términos y Condiciones" → debe ir a `TermsScreen`

#### Desde AddressesScreen:
- ✅ Tap en "+ Agregar" → debe ir a `AddAddressScreen`

### 4. Verificar datos del perfil:
- ✅ El ProfileHeader debe mostrar: "Juan Pérez"
- ✅ Debe mostrar: "usuario@ejemplo.com"
- ✅ Debe mostrar: "Miembro desde 2023"
- ✅ Direcciones: "1 direcciones guardadas"
- ✅ Métodos de pago: "1 métodos guardados"

## Si no funciona:

### Problema 1: Error de navegación
```
ERROR The action 'NAVIGATE' with payload {"name":"EditProfile"} was not handled
```
**Solución**: Las pantallas están registradas en AppNavigator.js, reinicia la app.

### Problema 2: Error de red
```
ERROR Network request failed
```
**Solución**: Verifica que el servidor esté corriendo y la IP sea correcta en `src/config/api.js`

### Problema 3: Error de métodos
```
ERROR profile.getFullName is not a function
```
**Solución**: Ya solucionado con la clase User en el hook useProfile.

## Comandos útiles:

```bash
# Reiniciar Metro bundler
npx expo start --clear

# Ver logs en tiempo real
npx expo logs

# Verificar servidor
curl http://10.106.183.4:5000/api/profile/1
```